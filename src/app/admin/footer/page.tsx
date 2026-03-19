"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface FooterData {
  description: string;
  links: Record<string, string[]>;
  email: string;
  phone: string;
  address: string;
  logoText: string;
  logoSubtext: string;
  logoImage?: string;
}

const DEFAULT: FooterData = {
  description: "",
  links: {},
  email: "info@ocda.ng",
  phone: "+234 800 000 0000",
  address: "Ojobeda, Kogi State, Nigeria",
  logoText: "OCDA",
  logoSubtext: "Community Development",
  logoImage: "",
};

export default function FooterEditor() {
  const [data, setData] = useState<FooterData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [newColName, setNewColName] = useState("");

  useEffect(() => {
    fetch("/api/content/footer")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data as FooterData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Footer saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addColumn = () => {
    if (!newColName.trim()) return;
    setData((d) => ({ ...d, links: { ...d.links, [newColName.trim()]: [] } }));
    setNewColName("");
  };

  const removeColumn = (col: string) => {
    setData((d) => {
      const newLinks = { ...d.links };
      delete newLinks[col];
      return { ...d, links: newLinks };
    });
  };

  const addItem = (col: string) =>
    setData((d) => ({
      ...d,
      links: { ...d.links, [col]: [...(d.links[col] ?? []), "New Item"] },
    }));

  const removeItem = (col: string, idx: number) =>
    setData((d) => ({
      ...d,
      links: { ...d.links, [col]: d.links[col].filter((_, i) => i !== idx) },
    }));

  const updateItem = (col: string, idx: number, val: string) =>
    setData((d) => ({
      ...d,
      links: {
        ...d.links,
        [col]: d.links[col].map((item, i) => (i === idx ? val : item)),
      },
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
          <h1 className="font-display font-bold text-2xl text-white">Edit Footer</h1>
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
        {/* Logo */}
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
          <h2 className="font-display font-semibold text-white mb-2">Footer Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Logo Text (org name)</label>
              <input type="text" value={data.logoText} onChange={(e) => setData((d) => ({ ...d, logoText: e.target.value }))} className={inputCls} placeholder="OCDA" />
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Logo Subtext (tagline)</label>
              <input type="text" value={data.logoSubtext} onChange={(e) => setData((d) => ({ ...d, logoSubtext: e.target.value }))} className={inputCls} placeholder="Community Development" />
            </div>
          </div>
          <ImageUploader
            label="Logo Image (optional — replaces the initials box)"
            hint="Recommended: square PNG with transparent background, min 72×72px"
            aspectRatio="1/1"
            value={data.logoImage}
            onChange={(url) => setData((d) => ({ ...d, logoImage: url }))}
            onClear={() => setData((d) => ({ ...d, logoImage: "" }))}
          />
          {/* Live preview */}
          <div>
            <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">Preview</p>
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-gray-900 border border-white/5 w-fit">
              {data.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logoImage} alt={data.logoText} className="h-9 w-9 rounded-lg object-contain bg-forest-800 flex-shrink-0" />
              ) : (
                <span className="h-9 w-9 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-sm">{(data.logoText || "OC").slice(0, 2).toUpperCase()}</span>
                </span>
              )}
              <div>
                <p className="font-display font-bold text-white text-base leading-none">{data.logoText || "OCDA"}</p>
                <p className="text-gray-500 text-xs leading-none mt-0.5">{data.logoSubtext || "Community Development"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
          <h2 className="font-display font-semibold text-white mb-2">Footer Info</h2>
          <div>
            <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Description</label>
            <textarea value={data.description} onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))} rows={3} className={`${inputCls} resize-y`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {["email", "phone", "address"].map((key) => (
              <div key={key}>
                <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">{key}</label>
                <input
                  type="text"
                  value={(data as unknown as Record<string, string>)[key]}
                  onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Link Columns</h2>
          <div className="space-y-4 mb-5">
            {Object.entries(data.links).map(([col, items]) => (
              <div key={col} className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-community-200 font-semibold">{col}</span>
                  <div className="flex gap-2">
                    <button onClick={() => addItem(col)} className="p-1.5 rounded-lg text-community-200/60 hover:text-community-200 hover:bg-community-200/10 transition-all">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => removeColumn(col)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(col, idx, e.target.value)}
                        className="flex-1 glass rounded-lg px-3 py-2 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
                      />
                      <button onClick={() => removeItem(col, idx)} className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addColumn()}
              className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
              placeholder="New column name..."
            />
            <button onClick={addColumn} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all">
              <Plus className="h-3.5 w-3.5" />Add Column
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
