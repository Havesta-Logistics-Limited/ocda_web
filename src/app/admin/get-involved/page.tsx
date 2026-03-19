"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface GetInvolvedData {
  pageHero: { label: string; headline: string; description: string };
  featureCards: Array<{ title: string; description: string }>;
  donate: { headline: string; description: string; presetAmounts: string[]; bankName: string; accountName: string; accountNumber: string };
  volunteer: { headline: string; description: string };
}

const DEFAULT: GetInvolvedData = {
  pageHero: { label: "GET INVOLVED", headline: "Join Us in Building Stronger Communities", description: "Every action counts. Whether you donate, volunteer, or partner — you're making a real difference in the lives of thousands of Nigerians." },
  featureCards: [
    { title: "Make a Donation", description: "Your financial contribution directly funds our programs in education, healthcare, women empowerment, and youth development across Nigeria." },
    { title: "Volunteer With Us", description: "Share your skills, time, and passion to support our field teams, events, and community outreach programs." },
    { title: "Partner With Us", description: "Corporate partnerships, foundation grants, and strategic alliances amplify our impact across communities." },
  ],
  donate: { headline: "Make a Donation", description: "Your contribution directly supports our community programs across Nigeria. All donations are tax-deductible.", presetAmounts: ["5,000", "10,000", "25,000", "50,000", "100,000"], bankName: "First Bank of Nigeria", accountName: "OCDA Nigeria", accountNumber: "0123456789" },
  volunteer: { headline: "Volunteer With Us", description: "Join our network of passionate volunteers making a difference across Nigeria. Fill out the form and our team will be in touch." },
};

export default function GetInvolvedEditor() {
  const [data, setData] = useState<GetInvolvedData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/get_involved")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as GetInvolvedData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setStatus("idle");
    try {
      const res = await fetch("/api/content/get_involved", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success"); setMsg("Get Involved page saved!");
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
          <h1 className="font-display font-bold text-2xl text-white">Edit Get Involved Page</h1>
          <p className="text-slate-500 text-sm mt-1">Controls the full /get-involved page content</p>
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

        {/* Feature Cards */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Feature Cards ({data.featureCards.length})</h2>
            <button onClick={() => setData((d) => ({ ...d, featureCards: [...d.featureCards, { title: "New Card", description: "" }] }))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Card
            </button>
          </div>
          <div className="space-y-4">
            {data.featureCards.map((card, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-community-200">Card {i + 1}</span>
                  <button onClick={() => setData((d) => ({ ...d, featureCards: d.featureCards.filter((_, idx) => idx !== i) }))} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={card.title} onChange={(e) => setData((d) => ({ ...d, featureCards: d.featureCards.map((c, idx) => idx === i ? { ...c, title: e.target.value } : c) }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Description</label>
                    <textarea value={card.description} onChange={(e) => setData((d) => ({ ...d, featureCards: d.featureCards.map((c, idx) => idx === i ? { ...c, description: e.target.value } : c) }))} rows={2} className={`${inputCls} resize-y`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donate Section */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Donate Tab</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Headline</label>
              <input type="text" value={data.donate.headline} onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, headline: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Description</label>
              <textarea value={data.donate.description} onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, description: e.target.value } }))} rows={2} className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Preset Amounts (one per line, numbers in Naira)</label>
              <textarea
                value={data.donate.presetAmounts.join("\n")}
                onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, presetAmounts: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) } }))}
                rows={5}
                className={`${inputCls} resize-y`}
                placeholder={"5,000\n10,000\n25,000\n50,000\n100,000"}
              />
            </div>
            <div className="border-t border-white/5 pt-4">
              <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">Bank Transfer Details</p>
              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Bank Name</label>
                  <input type="text" value={data.donate.bankName} onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, bankName: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Account Name</label>
                  <input type="text" value={data.donate.accountName} onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, accountName: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Account Number</label>
                  <input type="text" value={data.donate.accountNumber} onChange={(e) => setData((d) => ({ ...d, donate: { ...d.donate, accountNumber: e.target.value } }))} className={inputCls} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Section */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Volunteer Tab</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Headline</label>
              <input type="text" value={data.volunteer.headline} onChange={(e) => setData((d) => ({ ...d, volunteer: { ...d.volunteer, headline: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Description</label>
              <textarea value={data.volunteer.description} onChange={(e) => setData((d) => ({ ...d, volunteer: { ...d.volunteer, description: e.target.value } }))} rows={3} className={`${inputCls} resize-y`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
