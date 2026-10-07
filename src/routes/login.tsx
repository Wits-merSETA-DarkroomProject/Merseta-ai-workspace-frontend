import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setStoredUser } from "@/lib/workspace-store";
import { InstitutionBranding } from "@/components/mersia/InstitutionBranding";
import { ShieldCheck, Sparkles, BookOpen, ArrowRight, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — merSIA Sector Intelligence" },
      {
        name: "description",
        content:
          "Sign in to merSIA, the sectoral intelligence assistant for the Manufacturing, Engineering and Related Services sector.",
      },
      { property: "og:title", content: "Sign In — merSIA Sector Intelligence" },
      {
        property: "og:description",
        content:
          "Sign in to merSIA, the sectoral intelligence assistant for the Manufacturing, Engineering and Related Services sector.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your institutional email address.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      const username = email.split("@")[0] || "Researcher";
      setStoredUser({
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: email.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=1D3557&textColor=ffffff`,
      });
      setIsLoading(false);
      navigate({ to: "/" });
    }, 300);
  };

  const handleQuickGuest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStoredUser({
        name: "Sector Analyst",
        email: "analyst@merseta.org.za",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=merSIA&backgroundColor=1D3557&textColor=ffffff`,
      });
      setIsLoading(false);
      navigate({ to: "/" });
    }, 200);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden flex flex-col justify-between bg-canvas text-ink antialiased select-none px-6 py-6 sm:py-8">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-navy/30 blur-[120px] rounded-full opacity-60" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[300px] bg-gold/5 blur-[140px] rounded-full" />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-line-soft/60">
        <InstitutionBranding variant="header" />

        <button
          type="button"
          onClick={handleQuickGuest}
          disabled={isLoading}
          className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-gold hover:text-white hover:bg-gold/15 transition-all border border-gold/25"
        >
          <span>Explore as Guest</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* CENTER STAGE */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-8 sm:py-12 animate-rise-in">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Context & Evidence Foundation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted/60 border border-line-soft text-[11px] font-mono uppercase tracking-wider text-gold">
              <Sparkles className="w-3 h-3" />
              <span>Darkroom Sector Intelligence</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
                Evidence-driven intelligence for the <span className="text-gold">MER sector</span>.
              </h1>
              <p className="text-sm sm:text-base text-muted-text font-normal leading-relaxed max-w-xl">
                Synthesize statutory sector skills plans, research monographs, and labour market forecasts with unbroken citation provenance.
              </p>
            </div>

            {/* Clean Value Signals (No clunky heavy boxes) */}
            <div className="pt-2 space-y-2.5">
              {[
                {
                  title: "Closed Statutory Corpus",
                  desc: "Grounded strictly in merSETA SSP & Wits REAL research.",
                  icon: ShieldCheck,
                },
                {
                  title: "Dual-Model Consensus",
                  desc: "LLaMA 3.3 & DeepSeek R1 consensus confidence scoring.",
                  icon: Sparkles,
                },
                {
                  title: "Unbroken Provenance",
                  desc: "Instant line-by-line page citation inspector.",
                  icon: BookOpen,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 py-2 px-3 rounded-lg bg-surface/40 hover:bg-surface/70 border border-line-soft/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-navy/40 border border-gold/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-ink leading-none">{item.title}</h3>
                    <p className="text-[11px] text-muted-text mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Auth Container */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl border border-line-soft bg-surface/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl shadow-black/20 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-ink">Sign In</h2>
                <p className="text-xs text-muted-text mt-0.5">
                  Enter your credentials or launch the guest workspace.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-medium text-muted-text block">
                    Institutional Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-muted-text/70 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@merseta.org.za"
                      className="h-10 w-full pl-9 pr-3 rounded-xl border border-line-soft bg-surface-muted/50 text-xs sm:text-sm text-ink placeholder:text-muted-text/50 outline-hidden transition-all focus:border-gold/50 focus:bg-surface-muted focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[11px] font-medium text-muted-text block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-muted-text/70 pointer-events-none" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="h-10 w-full pl-9 pr-3 rounded-xl border border-line-soft bg-surface-muted/50 text-xs sm:text-sm text-ink placeholder:text-muted-text/50 outline-hidden transition-all focus:border-gold/50 focus:bg-surface-muted focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 border border-line-soft shadow-xs"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Sign In to Notebooks</span>
                  )}
                </button>
              </form>

              <div className="relative my-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line-soft/60" />
                </div>
                <span className="relative bg-surface px-2 text-[10px] uppercase font-mono tracking-wider text-muted-text/80">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={handleQuickGuest}
                disabled={isLoading}
                className="w-full h-10 rounded-xl border border-gold/30 bg-gold/5 hover:bg-gold/10 text-xs sm:text-sm font-medium text-ink transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Prototype as Guest</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-line-soft/60 pt-4 text-xs text-muted-text">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>merSIA</span>
          <span>·</span>
          <span>Wits University REAL</span>
          <span>·</span>
          <span>merSETA</span>
        </div>
        <div className="text-[11px] text-muted-text/70">
          Republic of South Africa · Darkroom Initiative
        </div>
      </footer>
    </main>
  );
}