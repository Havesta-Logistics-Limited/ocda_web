"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Activity } from "lucide-react";
import Link from "next/link";

interface AuditEntry {
  id: number;
  action: string;
  section: string | null;
  adminEmail: string;
  ip: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState<"idle" | "success" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setAudit(d); })
      .catch(() => {})
      .finally(() => setAuditLoading(false));
  }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus("idle");

    if (!currentPw || !newPw || !confirmPw) {
      setPwStatus("error");
      setPwMsg("All fields are required.");
      return;
    }

    if (newPw !== confirmPw) {
      setPwStatus("error");
      setPwMsg("New passwords do not match.");
      return;
    }

    if (newPw.length < 8) {
      setPwStatus("error");
      setPwMsg("New password must be at least 8 characters.");
      return;
    }

    const hasUpper = /[A-Z]/.test(newPw);
    const hasLower = /[a-z]/.test(newPw);
    const hasDigit = /\d/.test(newPw);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPw);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      setPwStatus("error");
      setPwMsg("Password must contain uppercase, lowercase, digit, and special character.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed");
      setPwStatus("success");
      setPwMsg("Password changed successfully!");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwStatus("error");
      setPwMsg(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSaving(false);
      setTimeout(() => setPwStatus("idle"), 4000);
    }
  };

  const inputCls = "w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 font-mono border border-white/[0.08] focus:outline-none focus:border-community-200/50 transition-all";

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 mb-3 transition-colors">
          <ArrowLeft className="h-3 w-3" />Back to Dashboard
        </Link>
        <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and view activity.</p>
      </div>

      <div className="space-y-6">
        {/* Account info */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-4">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Name</p>
              <p className="text-slate-300">{session?.user?.name ?? "—"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-1">Email</p>
              <p className="text-slate-300">{session?.user?.email ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5">Change Password</h2>

          {pwStatus === "success" && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-community-200/10 border border-community-200/30 text-community-200 mb-5">
              <CheckCircle2 className="h-4 w-4" /><span className="font-mono text-sm">{pwMsg}</span>
            </div>
          )}
          {pwStatus === "error" && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-5">
              <AlertCircle className="h-4 w-4" /><span className="font-mono text-sm">{pwMsg}</span>
            </div>
          )}

          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={`${inputCls} pr-12`}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={`${inputCls} pr-12`}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-600 mt-1.5">
                Min 8 chars · uppercase · lowercase · digit · special character
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-500 tracking-widest uppercase mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={inputCls}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-community-200/10 border border-community-200/30 hover:bg-community-200/20 hover:border-community-200 text-community-200 font-mono text-sm transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Change Password
            </button>
          </form>
        </div>

        {/* Audit log */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gold-400" />
            Full Audit Log
          </h2>
          {auditLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-community-200 animate-spin" />
            </div>
          ) : audit.length === 0 ? (
            <p className="text-slate-600 font-mono text-sm text-center py-4">No activity logged yet.</p>
          ) : (
            <div className="space-y-1">
              {audit.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/3 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-community-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-slate-300 truncate">
                      {entry.action.replace(/_/g, " ")}
                      {entry.section && <span className="text-community-200"> · {entry.section}</span>}
                    </p>
                    <p className="font-mono text-xs text-slate-600">
                      {entry.adminEmail}
                      {entry.ip && ` · ${entry.ip}`}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-slate-600 flex-shrink-0">{timeAgo(entry.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
