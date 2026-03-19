export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
const IMAGE_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed images: JPG, PNG, WebP, GIF. Allowed videos: MP4, WebM, OGG." },
        { status: 400 }
      )
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const maxSize = isVideo ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? "100MB for videos" : "5MB for images"}.` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    await writeFile(join(uploadsDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
