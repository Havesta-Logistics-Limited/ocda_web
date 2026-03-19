/**
 * Client-side security helpers.
 * All user-provided strings must pass through sanitize() before rendering.
 */

import { z } from "zod";

// ── Input sanitisation (strips HTML tags & dangerous chars) ──────────────────
export function sanitize(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#96;")
    .trim();
}

// ── Contact form schema with Zod (server-validated too) ──────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .regex(/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'\-]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email too long")
    .toLowerCase(),
  subject: z
    .string()
    .min(4, "Subject must be at least 4 characters")
    .max(120, "Subject too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message too long"),
});

export type ContactForm = z.infer<typeof contactSchema>;

// ── Client-side rate-limit guard (complement to server rate-limiting) ─────────
const RATE_LIMIT_KEY = "ocda_form_ts";
const RATE_LIMIT_MS  = 60_000; // 1 submission per minute per client

export function checkRateLimit(): { allowed: boolean; waitSeconds: number } {
  if (typeof window === "undefined") return { allowed: true, waitSeconds: 0 };
  const last = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) ?? "0", 10);
  const now  = Date.now();
  const diff = now - last;
  if (last && diff < RATE_LIMIT_MS) {
    return { allowed: false, waitSeconds: Math.ceil((RATE_LIMIT_MS - diff) / 1000) };
  }
  return { allowed: true, waitSeconds: 0 };
}

export function recordSubmission(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
  }
}

// ── CSRF token (server should set this in a cookie; client reads & echoes) ───
export function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

// ── Honeypot field check — bot detection ─────────────────────────────────────
export function isBot(honeypotValue: string): boolean {
  return honeypotValue.length > 0;
}
