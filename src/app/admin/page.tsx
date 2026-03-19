"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Navigation, Star, Info, Layers, BarChart3, Users, Phone, FileText,
  Edit3, Clock, Activity, RefreshCw, TrendingUp, Zap, Globe,
  BookOpen, FolderOpen, Heart,
} from "lucide-react";

interface SectionMeta { section: string; updatedAt: string; updatedBy: string | null; }
interface AuditEntry { id: number; action: string; section: string | null; adminEmail: string; createdAt: string; }

const SECTION_MAP: Record<string, { label: string; icon: React.ReactNode; href: string; desc: string; badge?: string }> = {
  // Homepage sections
  navbar:        { label: "Navbar",           icon: <Navigation className="h-4 w-4" />,  href: "/admin/navbar",         desc: "Navigation links & logo",          badge: "Home" },
  hero:          { label: "Hero",             icon: <Star className="h-4 w-4" />,        href: "/admin/hero",           desc: "Headlines, CTA buttons",           badge: "Home" },
  about:         { label: "About Section",    icon: <Info className="h-4 w-4" />,        href: "/admin/about",          desc: "Homepage about preview",           badge: "Home" },
  services:      { label: "Programs Section", icon: <Layers className="h-4 w-4" />,      href: "/admin/services",       desc: "Homepage programs preview",        badge: "Home" },
  stats:         { label: "Impact Stats",     icon: <BarChart3 className="h-4 w-4" />,   href: "/admin/stats",          desc: "Key metrics & numbers",            badge: "Home" },
  team:          { label: "Leadership",       icon: <Users className="h-4 w-4" />,       href: "/admin/team",           desc: "Board members & officials",        badge: "Shared" },
  contact:       { label: "Contact",          icon: <Phone className="h-4 w-4" />,       href: "/admin/contact",        desc: "Address, phone, email",            badge: "Page" },
  footer:        { label: "Footer",           icon: <FileText className="h-4 w-4" />,    href: "/admin/footer",         desc: "Footer links & copyright",         badge: "Shared" },
  // Full page editors
  about_page:    { label: "About Page",       icon: <BookOpen className="h-4 w-4" />,    href: "/admin/about-page",     desc: "Mission, vision, values, timeline", badge: "Page" },
  programs_page: { label: "Programs Page",    icon: <Globe className="h-4 w-4" />,       href: "/admin/programs-page",  desc: "Full programs list & stats",       badge: "Page" },
  get_involved:  { label: "Get Involved",     icon: <Heart className="h-4 w-4" />,       href: "/admin/get-involved",   desc: "Donate details, volunteer form",   badge: "Page" },
  projects_page: { label: "Projects Page",    icon: <FolderOpen className="h-4 w-4" />,  href: "/admin/projects-page",  desc: "All community projects",           badge: "Page" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "Just now";
}

export default function AdminDashboard() {
  const [sections, setSections] = useState<SectionMeta[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [metaRes, auditRes] = await Promise.all([fetch("/api/admin/meta"), fetch("/api/admin/audit")]);
      if (metaRes.ok) setSections(await metaRes.json());
      if (auditRes.ok) setAudit(await auditRes.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    { label: "Sections",     value: "12",                                                           icon: <Globe className="h-5 w-5" />,    color: "community" },
    { label: "Last Edit",    value: sections[0] ? timeAgo(sections[0].updatedAt) : "—",             icon: <Clock className="h-5 w-5" />,    color: "gold" },
    { label: "Total Edits",  value: String(audit.length),                                           icon: <TrendingUp className="h-5 w-5" />, color: "community" },
    { label: "Status",       value: "Live",                                                         icon: <Zap className="h-5 w-5" />,      color: "gold" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] text-community-200/60 tracking-[0.25em] uppercase mb-1.5">
            // Overview
          </p>
          <h2 className="font-display font-black text-3xl text-white">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mt-1">OCDA content management system</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-community-200/30 hover:bg-community-200/[0.04] text-slate-500 hover:text-community-200 font-mono text-xs tracking-wide transition-all duration-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: color === "community"
                ? "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.02) 100%)"
                : "linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 100%)",
              borderColor: color === "community" ? "rgba(74,222,128,0.15)" : "rgba(251,191,36,0.15)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-40"
              style={{ background: color === "community" ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)" }}
            />
            <div className={`mb-3 ${color === "community" ? "text-community-200" : "text-gold-400"}`}>{icon}</div>
            <p className="font-mono text-[10px] text-slate-600 tracking-[0.2em] uppercase mb-1">{label}</p>
            <p className={`font-display font-black text-2xl ${color === "community" ? "text-community-200" : "text-gold-400"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Section grid */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Edit3 className="h-4 w-4 text-community-200" />
          <h3 className="font-display font-bold text-white text-lg">Content Sections</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(SECTION_MAP).map(([key, { label, icon, href, desc, badge }]) => {
            const meta = sections.find((s) => s.section === key);
            return (
              <div
                key={key}
                className="group relative flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 hover:border-community-200/25 hover:bg-community-200/[0.03] cursor-default"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon */}
                  <div className="h-10 w-10 rounded-xl bg-community-200/[0.08] border border-community-200/[0.12] flex items-center justify-center text-community-200 flex-shrink-0 group-hover:bg-community-200/[0.12] transition-colors">
                    {icon}
                  </div>
                  {/* Labels */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display font-semibold text-white text-sm leading-none">{label}</p>
                      {badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wide ${badge === "Page" ? "bg-gold-400/10 text-gold-400/80" : badge === "Shared" ? "bg-blue-400/10 text-blue-400/80" : "bg-community-200/10 text-community-200/70"}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-slate-600 truncate">{desc}</p>
                    {meta && (
                      <p className="font-mono text-[10px] text-slate-700 mt-0.5">
                        <Clock className="h-2.5 w-2.5 inline mr-1" />{timeAgo(meta.updatedAt)}
                        {meta.updatedBy && <span className="text-slate-700"> · {meta.updatedBy}</span>}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href={href}
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-community-200/[0.08] border border-community-200/[0.15] hover:bg-community-200/[0.18] hover:border-community-200/40 text-community-200 font-mono text-xs tracking-wide transition-all duration-200"
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit log */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Activity className="h-4 w-4 text-gold-400" />
          <h3 className="font-display font-bold text-white text-lg">Recent Activity</h3>
        </div>
        {audit.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-10 text-center">
            <p className="font-mono text-sm text-slate-700">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.05] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
            {audit.slice(0, 8).map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-community-200" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }} />
                  {i < audit.slice(0, 8).length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-full bg-community-200/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-slate-300">
                    {entry.action.replace(/_/g, " ")}
                    {entry.section && <span className="text-community-200/80"> · {entry.section}</span>}
                  </p>
                  <p className="font-mono text-[10px] text-slate-600 mt-0.5">{entry.adminEmail}</p>
                </div>
                <p className="font-mono text-[10px] text-slate-600 flex-shrink-0 tabular-nums">
                  {timeAgo(entry.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
