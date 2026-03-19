"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Navigation, Star, Info, Layers, BarChart3,
  Users, Phone, FileText, Settings, LogOut, ShieldCheck,
  Loader2, ChevronRight, ExternalLink, Menu, X,
} from "lucide-react";
import { SessionProvider } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin",          label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/navbar",   label: "Navbar",       icon: Navigation },
  { href: "/admin/hero",     label: "Hero",         icon: Star },
  { href: "/admin/about",    label: "About",        icon: Info },
  { href: "/admin/services", label: "Programs",     icon: Layers },
  { href: "/admin/stats",    label: "Impact Stats", icon: BarChart3 },
  { href: "/admin/team",     label: "Leadership",   icon: Users },
  { href: "/admin/contact",  label: "Contact",      icon: Phone },
  { href: "/admin/footer",   label: "Footer",       icon: FileText },
  { href: "/admin/settings", label: "Settings",     icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login");
  }, [status, router]);

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 grid-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-community-200/10 border border-community-200/30 flex items-center justify-center shadow-neon-green">
            <ShieldCheck className="h-6 w-6 text-community-200 animate-pulse" />
          </div>
          <Loader2 className="h-5 w-5 text-community-200/50 animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) return <>{children}</>;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || (pathname.startsWith(href + "/") && href !== "/admin");

  const currentPage = NAV_ITEMS.find((n) => isActive(n.href, n.exact))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-community-200/40 to-transparent z-50 pointer-events-none" />

      {/* ── SIDEBAR ── */}
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 z-40 flex flex-col
            w-64 bg-dark-900/95 border-r border-white/[0.05]
            transition-transform duration-300 ease-out lg:translate-x-0
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ backdropFilter: "blur(24px)" }}
        >
          {/* Sidebar top glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-community-200/30 to-transparent" />

          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.05]">
            <div className="h-9 w-9 rounded-xl bg-community-200/10 border border-community-200/25 flex items-center justify-center flex-shrink-0 shadow-neon-green">
              <ShieldCheck className="h-4 w-4 text-community-200" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-black text-base text-white tracking-widest leading-none">
                OC<span className="text-community-200">DA</span>
              </p>
              <p className="font-mono text-[10px] text-slate-600 tracking-widest mt-0.5">ADMIN PORTAL</p>
            </div>
          </div>

          {/* User card */}
          <div className="mx-3 mt-3 mb-2 px-4 py-3 rounded-xl bg-community-200/[0.04] border border-community-200/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-community-200/20 to-gold-400/20 border border-community-200/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-bold text-xs text-community-200">
                  {(session.user?.name ?? session.user?.email ?? "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate leading-none mb-0.5">
                  {session.user?.name ?? "Admin"}
                </p>
                <p className="font-mono text-[10px] text-slate-500 truncate">{session.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-community-200 animate-pulse" />
              <span className="font-mono text-[10px] text-community-200/70 tracking-widest">ACTIVE SESSION</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            <p className="font-mono text-[9px] text-slate-700 tracking-[0.2em] uppercase px-3 pt-3 pb-2">Navigation</p>
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    font-mono tracking-wide transition-all duration-200
                    ${active
                      ? "text-community-200 bg-community-200/[0.08] border border-community-200/[0.15]"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-community-200 shadow-neon-green" />
                  )}
                  <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${active ? "text-community-200" : "text-slate-600 group-hover:text-slate-400"}`} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3 w-3 text-community-200/50" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div className="px-3 pb-4 pt-2 border-t border-white/[0.05] space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Public Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent hover:border-red-500/[0.15] transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative z-10">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-dark-900/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-slate-500 hover:text-slate-200 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="font-mono text-[10px] text-slate-600 tracking-[0.2em] uppercase leading-none mb-1">
                // {currentPage}
              </p>
              <h1 className="font-display font-bold text-white text-lg leading-none">{currentPage}</h1>
            </div>
          </div>
          {/* Status badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-community-200/[0.06] border border-community-200/[0.12]">
            <div className="h-1.5 w-1.5 rounded-full bg-community-200 animate-pulse" />
            <span className="font-mono text-[10px] text-community-200/80 tracking-widest">LIVE</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
