import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setStoredUser } from "@/lib/workspace-store";
import { InstitutionBranding } from "@/components/mersia/InstitutionBranding";
import { ShieldCheck, BookOpen, Layers, ArrowRight } from "lucide-react";

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
    }, 350);
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
    <main className="relative min-h-screen w-screen overflow-y-auto flex flex-col justify-between bg-canvas text-ink antialiased select-none px-6 py-6 sm:py-8">
      {/* 1. TOP HEADER WITH CO-BRANDING */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-line pb-4">
        <InstitutionBranding />

        <button
          type="button"
          onClick={handleQuickGuest}
          className="text-xs sm:text-sm text-gold hover:text-gold-light transition-colors font-semibold flex items-center gap-1.5"
        >
          <span>Explore Prototype as Guest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 2. CENTER STAGE: INSTITUTIONAL CONTEXT + SIGN-IN FORM */}
      <div className="relative z-20 w-full max-w-5xl mx-auto my-auto py-10 grid lg:grid-cols-12 items-center gap-8 lg:gap-12 animate-rise-in">
        {/* Left Column (7 cols): Institutional Research Mission */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-gold font-semibold block">
              REPUBLIC OF SOUTH AFRICA · HIGHER EDUCATION & TRAINING
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
              Understand <em className="text-gold italic font-serif">skills</em> through evidence.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-muted-text pt-1">
              merSIA is a closed, sector-specific intelligence instrument engineered under the{" "}
              <strong className="text-ink">Darkroom Initiative</strong> by <strong className="text-ink">Wits University (REAL)</strong> and{" "}
              <strong className="text-ink">merSETA</strong>. Designed to make statutory planning documentation easier to
              search, understand, and act upon with unbroken provenance.
            </p>
          </div>

          {/* 3 Grounded Pillars */}
          <div className="space-y-3 pt-2">
            {[
              {
                title: "Closed Statutory Corpus",
                detail: "Answers generated strictly from verified sector documents without ungrounded hallucinations.",
                icon: <ShieldCheck className="w-4 h-4 text-gold" />,
              },
              {
                title: "Dual-Model Empirical Consensus",
                detail: "LLaMA 3.3 and DeepSeek R1 consensus scoring calibrates answer confidence.",
                icon: <Layers className="w-4 h-4 text-gold" />,
              },
              {
                title: "Unbroken Page Traceability",
                detail: "Every synthesis claim maps directly to primary text excerpts and page citations.",
                icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-line bg-surface shadow-2xs"
              >
                <div className="p-1.5 rounded-md bg-surface-muted border border-line shrink-0 mt-0.5">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{p.title}</h4>
                  <p className="text-xs text-muted-text leading-relaxed mt-0.5">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Institutional Sign-In Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-2xs space-y-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-gold font-semibold block">
                RESEARCHER ACCESS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
                Sign in to merSIA
              </h2>
              <p className="mt-1 text-xs text-muted-text">
                Enter your institutional credentials or continue as a guest researcher.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400 text-center font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold block"
                >
                  Institutional Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@merseta.org.za or wits.ac.za"
                  className="h-10 w-full rounded-lg border border-line bg-surface-muted px-3.5 text-xs sm:text-sm text-ink placeholder:text-muted-text outline-hidden transition-all focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (optional for prototype)"
                  className="h-10 w-full rounded-lg border border-line bg-surface-muted px-3.5 text-xs sm:text-sm text-ink placeholder:text-muted-text outline-hidden transition-all focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-full rounded-lg bg-navy hover:bg-navy-light text-white text-xs sm:text-sm font-medium transition-all shadow-2xs"
              >
                {isLoading ? "Authenticating..." : "Sign In to Workspace"}
              </Button>
            </form>

            <div className="relative my-3 text-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-surface px-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-text">
                or explore prototype
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickGuest}
              disabled={isLoading}
              className="h-10 w-full rounded-lg border border-line bg-surface-muted text-xs sm:text-sm font-medium text-ink hover:bg-surface hover:border-gold transition-all"
            >
              Launch Prototype as Guest Analyst →
            </Button>
          </div>
        </div>
      </div>

      {/* 3. MINIMAL INSTITUTIONAL FOOTER */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-line pt-4 text-xs text-muted-text">
        <div className="flex items-center gap-2">
          <span>merSIA Intelligence</span>
          <span>·</span>
          <span>Darkroom Initiative</span>
          <span>·</span>
          <span>Wits REAL & merSETA</span>
        </div>
        <div>Republic of South Africa · 2026</div>
      </footer>
    </main>
  );
}