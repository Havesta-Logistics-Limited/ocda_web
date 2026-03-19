"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface Project {
  title: string;
  location: string;
  status: string;
  description: string;
  impact: string;
  date: string;
  budget: string;
  gradient: string;
}

interface ProjectsPageData {
  pageHero: { label: string; headline: string; description: string };
  projects: Project[];
}

const DEFAULT: ProjectsPageData = {
  pageHero: { label: "OUR PROJECTS", headline: "Real Impact on the Ground", description: "From water infrastructure to education facilities and healthcare clinics — see the concrete work we're doing to transform communities across Nigeria." },
  projects: [
    { title: "Community Water Project", location: "Sokoto State", status: "Ongoing", description: "Construction of boreholes, water purification systems, and distribution pipelines to provide clean, safe drinking water to rural communities.", impact: "Clean water access for 5,000+ residents", date: "Mar 2024", budget: "₦35.0M", gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
    { title: "Kano State Primary School Construction", location: "Kano State", status: "Ongoing", description: "Building a 6-classroom primary school with library, computer lab, and sanitation facilities to serve underserved communities.", impact: "Will provide education access for 500+ children", date: "Jan 2024 – Aug 2024", budget: "₦45.0M", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
  ],
};

const STATUS_OPTIONS = ["Ongoing", "Completed", "Planned"];

const GRADIENT_OPTIONS = [
  { label: "Blue", value: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
  { label: "Green", value: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
  { label: "Red", value: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" },
  { label: "Purple", value: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
  { label: "Teal", value: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
  { label: "Orange", value: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)" },
];

export default function ProjectsPageEditor() {
  const [data, setData] = useState<ProjectsPageData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/content/projects_page")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as ProjectsPageData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setStatus("idle");
    try {
      const res = await fetch("/api/content/projects_page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success"); setMsg("Projects page saved!");
    } catch (e) { setStatus("error"); setMsg(e instanceof Error ? e.message : "Save failed."); }
    finally { setSaving(false); setTimeout(() => setStatus("idle"), 3000); }
  };

  const updateProject = (i: number, field: keyof Project, val: string) =>
    setData((d) => ({ ...d, projects: d.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-community-200 animate-spin" /></div>;

  const inputCls = "w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors"><ArrowLeft className="h-3 w-3" />Back to Dashboard</Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Projects Page</h1>
          <p className="text-slate-500 text-sm mt-1">Controls the full /projects page content</p>
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

        {/* Projects */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Projects ({data.projects.length})</h2>
            <button onClick={() => { setData((d) => ({ ...d, projects: [...d.projects, { title: "New Project", location: "", status: "Planned", description: "", impact: "", date: "", budget: "₦0", gradient: GRADIENT_OPTIONS[0].value }] })); setExpanded(data.projects.length); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Project
            </button>
          </div>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${proj.status === "Completed" ? "bg-green-500/20 text-green-400" : proj.status === "Ongoing" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}`}>{proj.status}</span>
                    <span className="font-display font-semibold text-white text-sm">{proj.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setData((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) })); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    {expanded === i ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </div>
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                      <input type="text" value={proj.title} onChange={(e) => updateProject(i, "title", e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Location</label>
                        <input type="text" value={proj.location} onChange={(e) => updateProject(i, "location", e.target.value)} className={inputCls} placeholder="e.g. Lagos State" />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Status</label>
                        <select value={proj.status} onChange={(e) => updateProject(i, "status", e.target.value)} className={inputCls}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                      <textarea value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Impact Statement</label>
                      <input type="text" value={proj.impact} onChange={(e) => updateProject(i, "impact", e.target.value)} className={inputCls} placeholder="e.g. Clean water for 5,000+ residents" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Date</label>
                        <input type="text" value={proj.date} onChange={(e) => updateProject(i, "date", e.target.value)} className={inputCls} placeholder="e.g. Mar 2024" />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Budget</label>
                        <input type="text" value={proj.budget} onChange={(e) => updateProject(i, "budget", e.target.value)} className={inputCls} placeholder="e.g. ₦35.0M" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Card Gradient Color</label>
                      <select value={proj.gradient} onChange={(e) => updateProject(i, "gradient", e.target.value)} className={inputCls}>
                        {GRADIENT_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
