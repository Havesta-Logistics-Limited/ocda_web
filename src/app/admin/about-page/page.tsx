"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ValueItem { title: string; description: string; }
interface TimelineItem { year: string; title: string; description: string; }

interface AboutPageData {
  pageHero: { label: string; headline: string; description: string };
  mission: string;
  vision: string;
  values: ValueItem[];
  timeline: TimelineItem[];
}

const DEFAULT: AboutPageData = {
  pageHero: { label: "ABOUT US", headline: "Our Story of Community Impact", description: "For over 13 years, OCDA has been dedicated to empowering Nigerian communities through sustainable development, healthcare, education, and economic opportunity." },
  mission: "To empower Nigerian communities through sustainable development programs that improve quality of life, provide access to education and healthcare, and foster economic independence — ensuring no community is left behind in Nigeria's progress.",
  vision: "A Nigeria where every community — urban and rural — has equal access to quality education, adequate healthcare, and sustainable economic opportunities; where communities are empowered to drive their own development and contribute to national growth.",
  values: [
    { title: "Integrity", description: "We operate with transparency and accountability in all our programs and financial dealings." },
    { title: "Community Ownership", description: "Communities are our partners — we build with them, not for them." },
    { title: "Sustainability", description: "Every program is designed for long-term impact and self-sufficiency." },
    { title: "Inclusivity", description: "We serve all community members regardless of religion, ethnicity, or gender." },
  ],
  timeline: [
    { year: "2010", title: "Foundation", description: "OCDA was founded by community leaders in Ojobeda, Kogi State, with a vision to develop grassroots solutions to community challenges." },
    { year: "2013", title: "Healthcare Initiative Launch", description: "Launched our flagship mobile health clinic program, reaching over 5 communities in the first year with basic healthcare services." },
    { year: "2016", title: "National Expansion", description: "Expanded operations to 6 states across Nigeria, partnering with federal and state government agencies for broader impact." },
    { year: "2024", title: "Growing Impact", description: "Surpassed 50,000 lives impacted milestone, with active programs in 35+ communities and partnerships with 20+ national organizations." },
  ],
};

export default function AboutPageEditor() {
  const [data, setData] = useState<AboutPageData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/about_page")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as AboutPageData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/about_page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success"); setMsg("About page saved!");
    } catch (e) { setStatus("error"); setMsg(e instanceof Error ? e.message : "Save failed."); }
    finally { setSaving(false); setTimeout(() => setStatus("idle"), 3000); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-community-200 animate-spin" /></div>;

  const inputCls = "w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors"><ArrowLeft className="h-3 w-3" />Back to Dashboard</Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit About Page</h1>
          <p className="text-slate-500 text-sm mt-1">Controls the full /about page content</p>
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
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Label (small text above headline)</label>
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

        {/* Mission & Vision */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Mission &amp; Vision</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Our Mission</label>
              <textarea value={data.mission} onChange={(e) => setData((d) => ({ ...d, mission: e.target.value }))} rows={4} className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Our Vision</label>
              <textarea value={data.vision} onChange={(e) => setData((d) => ({ ...d, vision: e.target.value }))} rows={4} className={`${inputCls} resize-y`} />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Our Values ({data.values.length})</h2>
            <button onClick={() => setData((d) => ({ ...d, values: [...d.values, { title: "New Value", description: "" }] }))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Value
            </button>
          </div>
          <div className="space-y-4">
            {data.values.map((v, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-community-200">Value {i + 1}</span>
                  <button onClick={() => setData((d) => ({ ...d, values: d.values.filter((_, idx) => idx !== i) }))} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={v.title} onChange={(e) => setData((d) => ({ ...d, values: d.values.map((val, idx) => idx === i ? { ...val, title: e.target.value } : val) }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                    <textarea value={v.description} onChange={(e) => setData((d) => ({ ...d, values: d.values.map((val, idx) => idx === i ? { ...val, description: e.target.value } : val) }))} rows={2} className={`${inputCls} resize-y`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Timeline / Milestones ({data.timeline.length})</h2>
            <button onClick={() => setData((d) => ({ ...d, timeline: [...d.timeline, { year: String(new Date().getFullYear()), title: "New Milestone", description: "" }] }))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Milestone
            </button>
          </div>
          <div className="space-y-4">
            {data.timeline.map((item, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-gold-400">{item.year || `Milestone ${i + 1}`}</span>
                  <button onClick={() => setData((d) => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }))} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Year</label>
                    <input type="text" value={item.year} onChange={(e) => setData((d) => ({ ...d, timeline: d.timeline.map((t, idx) => idx === i ? { ...t, year: e.target.value } : t) }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={item.title} onChange={(e) => setData((d) => ({ ...d, timeline: d.timeline.map((t, idx) => idx === i ? { ...t, title: e.target.value } : t) }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                  <textarea value={item.description} onChange={(e) => setData((d) => ({ ...d, timeline: d.timeline.map((t, idx) => idx === i ? { ...t, description: e.target.value } : t) }))} rows={2} className={`${inputCls} resize-y`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
