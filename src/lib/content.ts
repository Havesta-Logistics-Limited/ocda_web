import { db } from "./db"

export async function getContent<T = unknown>(section: string): Promise<T | null> {
  try {
    const row = await db.siteContent.findUnique({ where: { section } })
    if (!row) return null
    return JSON.parse(row.data) as T
  } catch {
    return null
  }
}

export async function getAllContent(): Promise<Record<string, unknown>> {
  try {
    const rows = await db.siteContent.findMany()
    return Object.fromEntries(rows.map((r) => [r.section, JSON.parse(r.data)]))
  } catch {
    return {}
  }
}

export async function getAllContentWithMeta(): Promise<
  Array<{ section: string; updatedAt: Date; updatedBy: string | null }>
> {
  try {
    const rows = await db.siteContent.findMany({
      select: { section: true, updatedAt: true, updatedBy: true },
      orderBy: { updatedAt: "desc" },
    })
    return rows
  } catch {
    return []
  }
}
