"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ContactData {
  sectionLabel: string;
  headline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULT: ContactData = {
  sectionLabel: "GET IN TOUCH",
  headline: "Contact Us",
  description: "",
  email: "info@ocda.ng",
  phone: "+234 800 000 0000",
  address: "Ojobeda Community, Kogi State, Nigeria",
};

export default function ContactEditor() {
  const [data, setData] = useState<ContactData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/contact")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as ContactData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Contact section saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-community-200 animate-spin" />
      </div>
    );

  const inputCls = "w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors">
            <ArrowLeft className="h-3 w-3" />Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Contact Section</h1>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-community-200/10 border border-community-200/30 hover:bg-community-200/20 hover:border-community-200 text-community-200 font-mono text-sm transition-all disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-community-200/10 border border-community-200/30 text-community-200 mb-6">
          <CheckCircle2 className="h-4 w-4" /><span className="font-mono text-sm">{msg}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
          <AlertCircle className="h-4 w-4" /><span className="font-mono text-sm">{msg}</span>
        </div>
      )}

      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="font-display font-semibold text-white mb-2">Contact Details</h2>

        {[
          { key: "sectionLabel", label: "Section Label" },
          { key: "headline", label: "Headline" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">{label}</label>
            <input
              type="text"
              value={(data as unknown as Record<string, string>)[key]}
              onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
              className={inputCls}
            />
          </div>
        ))}

        <div>
          <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
            rows={3}
            className={`${inputCls} resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
