import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkApiWriteRateLimit } from "@/lib/rateLimit"

const VALID_SECTIONS = [
  "navbar",
  "hero",
  "about",
  "services",
  "stats",
  "team",
  "contact",
  "footer",
  "about_page",
  "programs_page",
  "get_involved",
  "projects_page",
] as const

type ValidSection = (typeof VALID_SECTIONS)[number]

const updateSchema = z.object({
  data: z.record(z.unknown()),
})

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

// GET /api/content/[section] — public
export async function GET(
  _req: NextRequest,
  { params }: { params: { section: string } }
) {
  const section = params.section

  if (!VALID_SECTIONS.includes(section as ValidSection)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 })
  }

  try {
    const row = await db.siteContent.findUnique({ where: { section } })
    if (!row) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }
    return NextResponse.json({ section, data: JSON.parse(row.data) })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/content/[section] — admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  const section = params.section
  const ip = getIp(req)

  // Validate section name
  if (!VALID_SECTIONS.includes(section as ValidSection)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 })
  }

  // Check auth session
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Rate limiting
  const rl = checkApiWriteRateLimit(session.user.email)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  // Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  try {
    await db.siteContent.upsert({
      where: { section },
      update: {
        data: JSON.stringify(parsed.data.data),
        updatedBy: session.user.email,
      },
      create: {
        section,
        data: JSON.stringify(parsed.data.data),
        updatedBy: session.user.email,
      },
    })

    // Audit log
    await db.auditLog.create({
      data: {
        action: "UPDATE_CONTENT",
        section,
        adminEmail: session.user.email,
        ip,
      },
    })

    return NextResponse.json({ success: true, section })
  } catch (err) {
    console.error("Content update error:", err)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
