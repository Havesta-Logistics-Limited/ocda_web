export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/\d/, "Must contain digit")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Validation failed"
    return NextResponse.json({ error: firstError }, { status: 422 })
  }

  const admin = await db.adminUser.findUnique({
    where: { email: session.user.email },
  })

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 })
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.password)
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12)

  await db.adminUser.update({
    where: { id: admin.id },
    data: { password: hashed },
  })

  await db.auditLog.create({
    data: {
      action: "CHANGE_PASSWORD",
      adminEmail: session.user.email,
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown",
    },
  })

  return NextResponse.json({ success: true })
}
