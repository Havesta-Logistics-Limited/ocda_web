"use client";

import { useState } from "react";
import { Send, AlertCircle, CheckCircle2, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { contactSchema, checkRateLimit, recordSubmission, isBot } from "@/lib/security";

export interface ContactContent {
  sectionLabel: string;
  headline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULT: ContactContent = {
  sectionLabel: "GET IN TOUCH",
  headline: "Contact Us",
  description: "Have a question or want to get involved? We would love to hear from you. Our team responds within 48 hours.",
  email: "info@ocda.ng",
  phone: "+234 800 000 0000",
  address: "Ojobeda Community, Kogi State, Nigeria",
};

type FormState = "idle" | "loading" | "success" | "error";
const INITIAL = { name: "", email: "", subject: "", message: "", _trap: "" };

export default function Contact({ data }: { data: ContactContent | null }) {
  const d = data ?? DEFAULT;
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>("idle");
  const [msg, setMsg] = useState("");

  const update = (field: keyof typeof INITIAL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (isBot(form._trap)) return;
    const rl = checkRateLimit();
    if (!rl.allowed) {
      setState("error");
      setMsg(`Please wait ${rl.waitSeconds}s before submitting again.`);
      return;
    }
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        fe[k] = (v as string[])[0] ?? "Invalid";
      }
      setErrors(fe);
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, _trap: form._trap }),
        signal: AbortSignal.timeout(15_000),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Server error");
      recordSubmission();
      setState("success");
      setMsg("Message received! We will respond within 48 hours.");
      setForm(INITIAL);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const inputCls = (field: string) =>
    "w-full rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border transition-all duration-200 focus:outline-none focus:ring-2 bg-white " +
    (errors[field]
      ? "border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-forest-600 focus:ring-forest-100");

  return (
    <section id="contact" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{d.sectionLabel}</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            {d.headline}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{d.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            {(
              [
                { icon: Mail, label: "Email", value: d.email, href: "mailto:" + d.email },
                { icon: Phone, label: "Phone", value: d.phone, href: "tel:" + d.phone },
                { icon: MapPin, label: "Address", value: d.address, href: "#" },
              ] as const
            ).map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="card p-5 flex items-start gap-4 block"
              >
                <div className="icon-box-green flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-gray-800 text-sm font-medium">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-8">
            {state === "success" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 mb-6">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{msg}</span>
              </div>
            )}
            {state === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-6">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                <input
                  id="_trap"
                  name="_trap"
                  type="text"
                  value={form._trap}
                  onChange={update("_trap")}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className={inputCls("name")}
                    placeholder="Jane Smith"
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputCls("email")}
                    placeholder="jane@example.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={update("subject")}
                  className={inputCls("subject")}
                  placeholder="How can we help?"
                  maxLength={120}
                  required
                />
                {errors.subject && (
                  <p className="mt-1 text-red-500 text-xs">{errors.subject}</p>
                )}
              </div>

              <div className="mb-7">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={update("message")}
                  className={inputCls("message") + " min-h-32 resize-y"}
                  placeholder="Tell us about your inquiry..."
                  maxLength={2000}
                  required
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? (
                    <p className="text-red-500 text-xs">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-gray-400 text-xs">
                    {form.message.length}/2000
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-forest-800 text-white font-semibold text-sm hover:bg-forest-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
