export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
