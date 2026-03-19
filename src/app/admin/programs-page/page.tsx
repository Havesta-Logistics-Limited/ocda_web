"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface Program {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  beneficiaries: string;
  gradient: string;
}

interface ProgramsPageData {
  pageHero: { label: string; headline: string; description: string };
  programs: Program[];
  statsSection: { title: string; description: string; stats: Array<{ value: string; label: string }> };
}

const DEFAULT: ProgramsPageData = {
  pageHero: { label: "OUR PROGRAMS", headline: "Transforming Communities Through Action", description: "Our evidence-based programs are designed to create lasting change — addressing root causes of poverty and inequality in Nigerian communities." },
  programs: [
    { title: "Women Economic Empowerment", description: "Our flagship women's program provides micro-financing, business skills training, and mentorship to women entrepreneurs. We've helped establish over 200 women-owned businesses and cooperatives across Nigeria.", category: "Women Empowerment", categoryColor: "bg-purple-100 text-purple-700", beneficiaries: "5,200+", gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
    { title: "Education for All Initiative", description: "From scholarships to school infrastructure, our education program ensures every child has access to quality learning. We've built 12 classrooms, equipped 25 libraries, and sponsored thousands of students.", category: "Education", categoryColor: "bg-blue-100 text-blue-700", beneficiaries: "8,500+", gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
    { title: "Community Health Outreach", description: "Mobile clinics, immunization drives, maternal health programs, and health education bring essential medical care to underserved communities across 20+ states.", category: "Healthcare", categoryColor: "bg-red-100 text-red-700", beneficiaries: "15,000+", gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" },
    { title: "Sustainable Agriculture Program", description: "Modern farming techniques, access to quality inputs, irrigation support, and cooperative formation for smallholder farmers. We're building food security from the ground up.", category: "Agriculture", categoryColor: "bg-green-100 text-green-700", beneficiaries: "3,800+", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
    { title: "Youth Skills Development", description: "Vocational training, digital literacy, entrepreneurship boot camps, and leadership programs for Nigerian youth aged 15–35. Building the next generation of community leaders.", category: "Youth Development", categoryColor: "bg-teal-100 text-teal-700", beneficiaries: "4,200+", gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
  ],
  statsSection: { title: "Together, We're Making a Difference", description: "Across Nigeria, our programs continue to transform communities and create opportunity for thousands of families every year.", stats: [{ value: "6", label: "Active Programs" }, { value: "35+", label: "Communities" }, { value: "50K+", label: "Lives Impacted" }, { value: "120+", label: "Projects" }] },
};

const GRADIENT_OPTIONS = [
  { label: "Purple", value: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
  { label: "Blue", value: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
  { label: "Red", value: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" },
  { label: "Green", value: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
  { label: "Teal", value: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
  { label: "Orange", value: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)" },
];

const COLOR_OPTIONS = [
  { label: "Purple", value: "bg-purple-100 text-purple-700" },
  { label: "Blue", value: "bg-blue-100 text-blue-700" },
  { label: "Red", value: "bg-red-100 text-red-700" },
  { label: "Green", value: "bg-green-100 text-green-700" },
  { label: "Teal", value: "bg-teal-100 text-teal-700" },
  { label: "Orange", value: "bg-orange-100 text-orange-700" },
];

export default function ProgramsPageEditor() {
  const [data, setData] = useState<ProgramsPageData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/content/programs_page")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as ProgramsPageData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setStatus("idle");
    try {
      const res = await fetch("/api/content/programs_page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success"); setMsg("Programs page saved!");
    } catch (e) { setStatus("error"); setMsg(e instanceof Error ? e.message : "Save failed."); }
    finally { setSaving(false); setTimeout(() => setStatus("idle"), 3000); }
  };

  const updateProgram = (i: number, field: keyof Program, val: string) =>
    setData((d) => ({ ...d, programs: d.programs.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  const updateStat = (i: number, field: "value" | "label", val: string) =>
    setData((d) => ({ ...d, statsSection: { ...d.statsSection, stats: d.statsSection.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) } }));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-community-200 animate-spin" /></div>;

  const inputCls = "w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors"><ArrowLeft className="h-3 w-3" />Back to Dashboard</Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Programs Page</h1>
          <p className="text-slate-500 text-sm mt-1">Controls the full /programs page content</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-community-200/10 border border-community-200/30 hover:bg-community-200/20 hover:border-community-200 text-community-200 font-mono text-sm transition-all disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
        </button>
      </div>

      {status === "success" && <div className="flex items-center gap-3 p-4 rounded-xl bg-community-200/10 border border-community-200/30 text-community-200 mb-6"><CheckCircle2 className="h-4 w-4" /><span className="font-mono text-sm">{msg}</span></div>}
      {status === "error" && <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6"><AlertCircle className="h-4 w-4" /><span className="font-mono text-sm">{msg}</span></div>}

      <div className="space-y-6">
        {/* Page Hero */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Page Header (Hero Banner)</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Label</label>
              <input type="text" value={data.pageHero.label} onChange={(e) => setData((d) => ({ ...d, pageHero: { ...d.pageHero, label: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Headline</label>
              <input type="text" value={data.pageHero.headline} onChange={(e) => setData((d) => ({ ...d, pageHero: { ...d.pageHero, headline: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Description</label>
              <textarea value={data.pageHero.description} onChange={(e) => setData((d) => ({ ...d, pageHero: { ...d.pageHero, description: e.target.value } }))} rows={3} className={`${inputCls} resize-y`} />
            </div>
          </div>
        </div>

        {/* Programs */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Programs ({data.programs.length})</h2>
            <button onClick={() => { setData((d) => ({ ...d, programs: [...d.programs, { title: "New Program", description: "", category: "Category", categoryColor: "bg-blue-100 text-blue-700", beneficiaries: "0", gradient: GRADIENT_OPTIONS[0].value }] })); setExpanded(data.programs.length); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Program
            </button>
          </div>
          <div className="space-y-3">
            {data.programs.map((prog, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="font-display font-semibold text-white text-sm">{prog.title}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setData((d) => ({ ...d, programs: d.programs.filter((_, idx) => idx !== i) })); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    {expanded === i ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </div>
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                      <input type="text" value={prog.title} onChange={(e) => updateProgram(i, "title", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                      <textarea value={prog.description} onChange={(e) => updateProgram(i, "description", e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Category Name</label>
                        <input type="text" value={prog.category} onChange={(e) => updateProgram(i, "category", e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Beneficiaries</label>
                        <input type="text" value={prog.beneficiaries} onChange={(e) => updateProgram(i, "beneficiaries", e.target.value)} className={inputCls} placeholder="e.g. 5,200+" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Badge Color</label>
                        <select value={prog.categoryColor} onChange={(e) => updateProgram(i, "categoryColor", e.target.value)} className={inputCls}>
                          {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Card Gradient</label>
                        <select value={prog.gradient} onChange={(e) => updateProgram(i, "gradient", e.target.value)} className={inputCls}>
                          {GRADIENT_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Impact Stats Banner</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Banner Title</label>
              <input type="text" value={data.statsSection.title} onChange={(e) => setData((d) => ({ ...d, statsSection: { ...d.statsSection, title: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Banner Description</label>
              <textarea value={data.statsSection.description} onChange={(e) => setData((d) => ({ ...d, statsSection: { ...d.statsSection, description: e.target.value } }))} rows={2} className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">Stats</label>
              <div className="grid grid-cols-2 gap-3">
                {data.statsSection.stats.map((stat, i) => (
                  <div key={i} className="glass rounded-xl p-4 border border-white/5">
                    <div className="mb-2">
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Value</label>
                      <input type="text" value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Label</label>
                      <input type="text" value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setData((d) => ({ ...d, statsSection: { ...d.statsSection, stats: [...d.statsSection.stats, { value: "0", label: "New Stat" }] } }))} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
                <Plus className="h-3.5 w-3.5" />Add Stat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
