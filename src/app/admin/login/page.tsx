"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { SessionProvider } from "next-auth/react";

function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (status === "authenticated") router.replace("/admin");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (attempts >= 5) { setError("Too many attempts. Wait 15 minutes."); return; }
    if (!email.trim() || !password) { setError("Enter both email and password."); return; }
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: email.toLowerCase().trim(), password, redirect: false });
      if (result?.error) {
        setAttempts((a) => a + 1);
        const rem = 4 - attempts;
        setError(rem > 0 ? `Invalid credentials. ${rem} attempt${rem !== 1 ? "s" : ""} remaining.` : "Too many attempts. Please wait.");
      } else if (result?.ok) {
        router.replace("/admin");
      }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden relative">

      {/* Animated background grid */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Top scan line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-community-200/60 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-community-200/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-400/4 blur-[100px] pointer-events-none" />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-14 relative z-10">
        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-community-200/10 border border-community-200/30 flex items-center justify-center shadow-neon-green">
            <ShieldCheck className="h-5 w-5 text-community-200" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-widest">
            OC<span className="text-community-200 text-glow-green">DA</span>
          </span>
        </div>

        {/* Center text */}
        <div>
          <div className="mb-6">
            <span className="font-mono text-xs text-community-200/60 tracking-[0.3em] uppercase">
              // Secure Admin Portal
            </span>
          </div>
          <h1 className="font-display font-black text-5xl text-white leading-tight mb-5">
            Manage Your<br />
            <span className="text-community-200 text-glow-green">Community</span><br />
            Platform
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-sm">
            Full control over OCDA website content — hero, programs, team, contact and more — all in one place.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-3">
            {[
              "Real-time content editing",
              "Audit trail on every change",
              "Rate-limited & session-secured",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-community-200 shadow-neon-green" />
                <span className="font-mono text-sm text-slate-400">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom meta */}
        <p className="font-mono text-xs text-slate-700">
          © {new Date().getFullYear()} Ojobeda Community Development Association · Kogi State, Nigeria
        </p>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-community-200/20 to-transparent self-stretch" />

      {/* ── RIGHT PANEL ── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-16 relative z-10 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex h-12 w-12 rounded-xl bg-community-200/10 border border-community-200/30 items-center justify-center mb-4 shadow-neon-green">
              <ShieldCheck className="h-6 w-6 text-community-200" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">
              OC<span className="text-community-200">DA</span> Admin
            </h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="font-mono text-community-200/70 text-xs tracking-[0.25em] uppercase mb-2">
              // Authenticate
            </p>
            <h2 className="font-display font-bold text-3xl text-white">Sign In</h2>
            <p className="text-slate-500 text-sm mt-1">Admin access only. All actions are logged.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/25 text-red-400 mb-6">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="font-mono text-xs leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] text-slate-500 tracking-[0.2em] uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ocda.ng"
                autoComplete="email"
                disabled={loading || attempts >= 5}
                required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-community-200/50 focus:bg-community-200/[0.03] focus:shadow-[0_0_0_3px_rgba(74,222,128,0.08)] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-slate-500 tracking-[0.2em] uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={loading || attempts >= 5}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-community-200/50 focus:bg-community-200/[0.03] focus:shadow-[0_0_0_3px_rgba(74,222,128,0.08)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="w-full relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-mono text-sm font-medium tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
              style={{
                background: "linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.08) 100%)",
                border: "1px solid rgba(74,222,128,0.3)",
                color: "#4ade80",
              }}
            >
              {/* Hover glow sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-community-200/0 via-community-200/10 to-community-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Authenticating...</>
              ) : (
                <><ShieldCheck className="h-4 w-4" />Access Portal</>
              )}
            </button>
          </form>

          {/* Attempt indicator */}
          {attempts > 0 && (
            <div className="mt-4 flex items-center gap-1.5">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < attempts ? "bg-red-500/60" : "bg-white/5"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
