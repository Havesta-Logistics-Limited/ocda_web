"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface Service {
  tag: string;
  title: string;
  summary: string;
  detail: string;
  image?: string;
}

interface ServicesData {
  sectionLabel: string;
  headline: string;
  services: Service[];
}

const DEFAULT: ServicesData = {
  sectionLabel: "WHAT WE DO",
  headline: "Our Programs & Initiatives",
  services: [],
};

export default function ServicesEditor() {
  const [data, setData] = useState<ServicesData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/content/services")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as ServicesData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Programs saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addService = () => {
    const tag = String(data.services.length + 1).padStart(2, "0");
    setData((d) => ({
      ...d,
      services: [...d.services, { tag, title: "New Program", summary: "", detail: "" }],
    }));
    setExpanded(data.services.length);
  };

  const removeService = (i: number) =>
    setData((d) => ({ ...d, services: d.services.filter((_, idx) => idx !== i) }));

  const updateService = (i: number, field: keyof Service, val: string) =>
    setData((d) => ({
      ...d,
      services: d.services.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
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
          <h1 className="font-display font-bold text-2xl text-white">Edit Programs Section</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Section Label</label>
              <input type="text" value={data.sectionLabel} onChange={(e) => setData((d) => ({ ...d, sectionLabel: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Headline</label>
              <input type="text" value={data.headline} onChange={(e) => setData((d) => ({ ...d, headline: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Programs / Services ({data.services.length})</h2>
            <button onClick={addService} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Program
            </button>
          </div>
          <div className="space-y-3">
            {data.services.map((service, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-community-200">[{service.tag}]</span>
                    <span className="font-display font-semibold text-white text-sm">{service.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); removeService(i); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {expanded === i ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </div>
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                    <ImageUploader
                      label="Program Image"
                      hint="Shown in the program card on the homepage"
                      aspectRatio="16/9"
                      value={service.image}
                      onChange={(url) => updateService(i, "image", url)}
                      onClear={() => updateService(i, "image", "")}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Tag</label>
                        <input type="text" value={service.tag} onChange={(e) => updateService(i, "tag", e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                        <input type="text" value={service.title} onChange={(e) => updateService(i, "title", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Summary (hover preview)</label>
                      <input type="text" value={service.summary} onChange={(e) => updateService(i, "summary", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Detail (hover expanded)</label>
                      <textarea value={service.detail} onChange={(e) => updateService(i, "detail", e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {data.services.length === 0 && (
              <p className="text-slate-600 font-mono text-sm text-center py-4">No programs. Click &ldquo;Add Program&rdquo; to add one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
