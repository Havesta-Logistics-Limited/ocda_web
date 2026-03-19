"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarData {
  logo: string;
  logoFull: string;
  logoImage?: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

const DEFAULT: NavbarData = {
  logo: "OCDA",
  logoFull: "Ojobeda CDA",
  logoImage: "",
  links: [],
  ctaLabel: "Join OCDA",
  ctaHref: "#contact",
};

export default function NavbarEditor() {
  const [data, setData] = useState<NavbarData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content/navbar")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setData(d.data as NavbarData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content/navbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setStatus("success");
      setMsg("Navbar saved successfully!");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const addLink = () =>
    setData((d) => ({ ...d, links: [...d.links, { href: "#", label: "New Link" }] }));

  const removeLink = (i: number) =>
    setData((d) => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }));

  const updateLink = (i: number, field: keyof NavLink, val: string) =>
    setData((d) => ({
      ...d,
      links: d.links.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)),
    }));

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
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Navbar</h1>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-community-200/10 border border-community-200/30 hover:bg-community-200/20 hover:border-community-200 text-community-200 font-mono text-sm transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-community-200/10 border border-community-200/30 text-community-200 mb-6">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-mono text-sm">{msg}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
          <AlertCircle className="h-4 w-4" />
          <span className="font-mono text-sm">{msg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic fields */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Brand</h2>
          <div className="mb-5">
            <ImageUploader
              label="Logo Image (replaces text initials when set)"
              hint="Recommended: square or horizontal logo, transparent background PNG"
              aspectRatio="3/1"
              value={data.logoImage}
              onChange={(url) => setData((d) => ({ ...d, logoImage: url }))}
              onClear={() => setData((d) => ({ ...d, logoImage: "" }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: "logo", label: "Logo Short / Fallback Initials (e.g. OCDA)" },
              { key: "logoFull", label: "Logo Full Name (e.g. Ojobeda CDA)" },
              { key: "ctaLabel", label: "CTA Button Label" },
              { key: "ctaHref", label: "CTA Button Link" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={data[key as keyof NavbarData] as string}
                  onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Navigation Links</h2>
            <button
              onClick={addLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/10 border border-community-200/20 hover:bg-community-200/20 text-community-200 font-mono text-xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {data.links.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all"
                  placeholder="#section"
                />
                <button
                  onClick={() => removeLink(i)}
                  className="p-2.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {data.links.length === 0 && (
              <p className="text-slate-600 font-mono text-sm text-center py-4">
                No links. Click &ldquo;Add Link&rdquo; to add one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
