export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/security";

// Simple in-memory rate limiter per IP (use Redis in production)
const ipBucket = new Map<string, { count: number; reset: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS    = 60_000;

function rateLimitIp(ip: string): boolean {
  const now    = Date.now();
  const bucket = ipBucket.get(ip);
  if (!bucket || now > bucket.reset) {
    ipBucket.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitIp(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(MAX_REQUESTS),
        },
      }
    );
  }

  // ── Body parsing ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Honeypot check ───────────────────────────────────────────────────────
  const raw = body as Record<string, string>;
  if (raw._trap && raw._trap.length > 0) {
    // Silently discard — don't reveal bot detection to attacker
    return NextResponse.json({ success: true });
  }

  // ── Input validation (Zod) ───────────────────────────────────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // ── TODO: send email via SMTP / queue (replace with real integration) ────
  console.log("Contact submission:", { name, email, subject, message });

  return NextResponse.json(
    { success: true, message: "Your message has been received. We'll respond within 24 hours." },
    { status: 200 }
  );
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
