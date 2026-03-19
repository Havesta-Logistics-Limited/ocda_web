"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface Pillar {
  title: string;
  body: string;
}

interface AboutData {
  sectionLabel: string;
  headline: string;
  headlineAccent: string;
  description: string;
  pillars: Pillar[];
  image?: string;
}

const DEFAULT: AboutData = {
  sectionLabel: "WHO WE ARE",
  headline: "Rooted in Ojobeda,",
  headlineAccent: "Built for the Future",
  description: "",
  pillars: [],
};

export default function AboutEditor() {
  const [data, setData] = useState<AboutData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/about")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as AboutData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("About section saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addPillar = () =>
    setData((d) => ({ ...d, pillars: [...d.pillars, { title: "New Pillar", body: "" }] }));

  const removePillar = (i: number) =>
    setData((d) => ({ ...d, pillars: d.pillars.filter((_, idx) => idx !== i) }));

  const updatePillar = (i: number, field: keyof Pillar, val: string) =>
    setData((d) => ({
      ...d,
      pillars: d.pillars.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)),
    }));

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
          <h1 className="font-display font-bold text-2xl text-white">Edit About Section</h1>
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
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Section Header</h2>
          <div className="space-y-4">
            {[
              { key: "sectionLabel", label: "Section Label" },
              { key: "headline", label: "Headline" },
              { key: "headlineAccent", label: "Headline Accent (colored part)" },
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
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Section Image</h2>
          <ImageUploader
            label="About section image (shown on the right side of the homepage)"
            hint="Recommended: portrait or square photo, min 600×600"
            aspectRatio="4/3"
            value={data.image}
            onChange={(url) => setData((d) => ({ ...d, image: url }))}
            onClear={() => setData((d) => ({ ...d, image: "" }))}
          />
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Pillars / Values</h2>
            <button onClick={addPillar} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Pillar
            </button>
          </div>
          <div className="space-y-4">
            {data.pillars.map((pillar, i) => (
              <div key={i} className="glass rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-community-200">Pillar {i + 1}</span>
                  <button onClick={() => removePillar(i)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={pillar.title} onChange={(e) => updatePillar(i, "title", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Body</label>
                    <textarea value={pillar.body} onChange={(e) => updatePillar(i, "body", e.target.value)} rows={2} className={`${inputCls} resize-y`} />
                  </div>
                </div>
              </div>
            ))}
            {data.pillars.length === 0 && (
              <p className="text-slate-600 font-mono text-sm text-center py-4">No pillars. Click &ldquo;Add Pillar&rdquo; to add one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
