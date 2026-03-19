"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface HeroData {
  badge: string;
  headline: string;
  headlineAccent: string;
  typingTexts: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage?: string;
  backgroundVideo?: string;
}

const DEFAULT: HeroData = {
  badge: "Est. 2024 · Ojobeda, Kogi State",
  headline: "Ojobeda Community",
  headlineAccent: "Development Association",
  typingTexts: ["Community Growth."],
  description: "",
  primaryCta: { label: "Our Programs", href: "#services" },
  secondaryCta: { label: "Join Us", href: "#contact" },
};

export default function HeroEditor() {
  const [data, setData] = useState<HeroData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [newTypingText, setNewTypingText] = useState("");

  useEffect(() => {
    fetch("/api/content/hero")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as HeroData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Hero saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addTypingText = () => {
    if (!newTypingText.trim()) return;
    setData((d) => ({ ...d, typingTexts: [...d.typingTexts, newTypingText.trim()] }));
    setNewTypingText("");
  };

  const removeTypingText = (i: number) =>
    setData((d) => ({ ...d, typingTexts: d.typingTexts.filter((_, idx) => idx !== i) }));

  const field = (key: string, label: string, multiline = false) => (
    <div key={key}>
      <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={(data as unknown as Record<string, string>)[key]}
          onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
          rows={3}
          className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all resize-y"
        />
      ) : (
        <input
          type="text"
          value={(data as unknown as Record<string, string>)[key]}
          onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
          className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
        />
      )}
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-community-200 animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors">
            <ArrowLeft className="h-3 w-3" />Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Hero Section</h1>
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

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
          <div>
            <h2 className="font-display font-semibold text-white mb-1">Background Media</h2>
            <p className="font-mono text-xs text-slate-500 mb-5">Video takes priority over image when both are set.</p>
          </div>
          <div>
            <h3 className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-3">Background Video</h3>
            {data.backgroundVideo ? (
              <div className="space-y-3">
                <video
                  src={data.backgroundVideo}
                  controls
                  muted
                  className="w-full rounded-xl border border-white/10 max-h-48 object-cover bg-black"
                />
                <div className="flex items-center gap-3">
                  <span className="flex-1 font-mono text-xs text-slate-400 truncate">{data.backgroundVideo}</span>
                  <button
                    onClick={() => setData((d) => ({ ...d, backgroundVideo: "" }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
                  >
                    Remove Video
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-community-200/40 cursor-pointer transition-all group">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                    const json = await res.json() as { url?: string; error?: string };
                    if (json.url) setData((d) => ({ ...d, backgroundVideo: json.url }));
                    else alert(json.error ?? "Upload failed");
                  }}
                />
                <span className="font-mono text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Click to upload video</span>
                <span className="font-mono text-[10px] text-slate-600 mt-1">MP4, WebM, OGG — max 100MB</span>
              </label>
            )}
          </div>
          <div>
            <h3 className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-3">Background Image (fallback)</h3>
            <ImageUploader
              label="Hero Background Photo (used when no video is set)"
              hint="Recommended: wide landscape photo, 1920×1080 or larger"
              aspectRatio="16/9"
              value={data.backgroundImage}
              onChange={(url) => setData((d) => ({ ...d, backgroundImage: url }))}
              onClear={() => setData((d) => ({ ...d, backgroundImage: "" }))}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Hero Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("badge", "Badge Text")}
            {field("headline", "Main Headline")}
            {field("headlineAccent", "Headline Accent (colored)")}
          </div>
          <div className="mt-5">
            {field("description", "Description", true)}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Typing Animation Texts</h2>
          <div className="space-y-2 mb-4">
            {data.typingTexts.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={t}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      typingTexts: d.typingTexts.map((x, idx) => (idx === i ? e.target.value : x)),
                    }))
                  }
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
                />
                <button onClick={() => removeTypingText(i)} className="p-2.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTypingText}
              onChange={(e) => setNewTypingText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTypingText()}
              className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
              placeholder="Type a new cycling text and press Add..."
            />
            <button onClick={addTypingText} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">CTA Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Primary CTA Label</label>
              <input type="text" value={data.primaryCta.label} onChange={(e) => setData((d) => ({ ...d, primaryCta: { ...d.primaryCta, label: e.target.value } }))} className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all" />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Primary CTA Link</label>
              <input type="text" value={data.primaryCta.href} onChange={(e) => setData((d) => ({ ...d, primaryCta: { ...d.primaryCta, href: e.target.value } }))} className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all" />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Secondary CTA Label</label>
              <input type="text" value={data.secondaryCta.label} onChange={(e) => setData((d) => ({ ...d, secondaryCta: { ...d.secondaryCta, label: e.target.value } }))} className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all" />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Secondary CTA Link</label>
              <input type="text" value={data.secondaryCta.href} onChange={(e) => setData((d) => ({ ...d, secondaryCta: { ...d.secondaryCta, href: e.target.value } }))} className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
