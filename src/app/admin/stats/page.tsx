"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

interface StatsData {
  sectionLabel: string;
  stats: Stat[];
}

const DEFAULT: StatsData = {
  sectionLabel: "OUR IMPACT",
  stats: [],
};

export default function StatsEditor() {
  const [data, setData] = useState<StatsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/stats")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as StatsData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Stats saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addStat = () =>
    setData((d) => ({
      ...d,
      stats: [...d.stats, { value: 0, suffix: "+", label: "New Stat", description: "" }],
    }));

  const removeStat = (i: number) =>
    setData((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  const updateStat = <K extends keyof Stat>(i: number, field: K, val: Stat[K]) =>
    setData((d) => ({
      ...d,
      stats: d.stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
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
          <h1 className="font-display font-bold text-2xl text-white">Edit Impact Stats</h1>
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
          <h2 className="font-display font-semibold text-white mb-4">Section Label</h2>
          <input
            type="text"
            value={data.sectionLabel}
            onChange={(e) => setData((d) => ({ ...d, sectionLabel: e.target.value }))}
            className={inputCls}
          />
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Statistics ({data.stats.length})</h2>
            <button onClick={addStat} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Stat
            </button>
          </div>
          <div className="space-y-4">
            {data.stats.map((stat, i) => (
              <div key={i} className="glass rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-community-200">Stat {i + 1}</span>
                  <button onClick={() => removeStat(i)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(i, "value", parseFloat(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Suffix</label>
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(i, "suffix", e.target.value)}
                      className={inputCls}
                      placeholder="+, yrs, M, etc."
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                    <input
                      type="text"
                      value={stat.description}
                      onChange={(e) => updateStat(i, "description", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            ))}
            {data.stats.length === 0 && (
              <p className="text-slate-600 font-mono text-sm text-center py-4">No stats. Click &ldquo;Add Stat&rdquo; to add one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
