"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface TeamMember {
  initials: string;
  name: string;
  title: string;
  bio: string;
  gradient: string;
  photo?: string;
}

interface TeamData {
  sectionLabel: string;
  headline: string;
  members: TeamMember[];
}

const DEFAULT: TeamData = {
  sectionLabel: "LEADERSHIP",
  headline: "The Executive Council",
  members: [],
};

const GRADIENT_OPTIONS = [
  "from-community-200 to-gold-400",
  "from-gold-400 to-neon-purple",
  "from-neon-purple to-community-200",
  "from-community-200 to-neon-purple",
  "from-gold-400 to-community-200",
  "from-neon-purple to-gold-400",
];

export default function TeamEditor() {
  const [data, setData] = useState<TeamData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/team")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as TeamData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Leadership saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addMember = () =>
    setData((d) => ({
      ...d,
      members: [
        ...d.members,
        {
          initials: "XX",
          name: "New Member",
          title: "Title",
          bio: "",
          gradient: GRADIENT_OPTIONS[d.members.length % GRADIENT_OPTIONS.length],
        },
      ],
    }));

  const removeMember = (i: number) =>
    setData((d) => ({ ...d, members: d.members.filter((_, idx) => idx !== i) }));

  const updateMember = (i: number, field: keyof TeamMember, val: string) =>
    setData((d) => ({
      ...d,
      members: d.members.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)),
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
          <h1 className="font-display font-bold text-2xl text-white">Edit Leadership Section</h1>
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
            <h2 className="font-display font-semibold text-white">Members ({data.members.length})</h2>
            <button onClick={addMember} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Member
            </button>
          </div>
          <div className="space-y-4">
            {data.members.map((member, i) => (
              <div key={i} className="glass rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={member.photo} alt={member.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${member.gradient} p-px flex-shrink-0`}>
                        <div className="h-full w-full rounded-full bg-dark-900 flex items-center justify-center">
                          <span className="font-display font-bold text-xs text-white">{member.initials}</span>
                        </div>
                      </div>
                    )}
                    <span className="font-display font-semibold text-white text-sm">{member.name}</span>
                  </div>
                  <button onClick={() => removeMember(i)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mb-4">
                  <ImageUploader
                    label="Member Photo (optional — replaces initials avatar)"
                    hint="Recommended: square headshot, min 200×200"
                    aspectRatio="1/1"
                    value={member.photo}
                    onChange={(url) => updateMember(i, "photo", url)}
                    onClear={() => updateMember(i, "photo", "")}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Initials</label>
                    <input type="text" value={member.initials} maxLength={3} onChange={(e) => updateMember(i, "initials", e.target.value.toUpperCase())} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Full Name</label>
                    <input type="text" value={member.name} onChange={(e) => updateMember(i, "name", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Title / Role</label>
                    <input type="text" value={member.title} onChange={(e) => updateMember(i, "title", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Avatar Gradient (fallback)</label>
                    <select value={member.gradient} onChange={(e) => updateMember(i, "gradient", e.target.value)} className={`${inputCls} cursor-pointer`}>
                      {GRADIENT_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-dark-900">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Bio</label>
                    <textarea value={member.bio} onChange={(e) => updateMember(i, "bio", e.target.value)} rows={2} className={`${inputCls} resize-y`} />
                  </div>
                </div>
              </div>
            ))}
            {data.members.length === 0 && (
              <p className="text-slate-600 font-mono text-sm text-center py-4">No members. Click &ldquo;Add Member&rdquo; to add one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
