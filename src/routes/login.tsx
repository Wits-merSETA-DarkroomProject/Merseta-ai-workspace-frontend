import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setStoredUser } from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Fieldnotes — Quiet Grounded Canvas" },
      { name: "description", content: "A quiet canvas for thinking with your sources." },
      { property: "og:title", content: "Fieldnotes — Quiet Grounded Canvas" },
      { property: "og:description", content: "A quiet canvas for thinking with your sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getStoredTheme());
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      setTheme(customEvent.detail || getStoredTheme());
    };
    window.addEventListener("fieldnotes_theme_changed", handleThemeChange);
    return () => {
      window.removeEventListener("fieldnotes_theme_changed", handleThemeChange);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      const username = email.split("@")[0] || "Researcher";
      setStoredUser({
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: email.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=171717&textColor=ffffff`,
      });
      setIsLoading(false);
      navigate({ to: "/" });
    }, 350);
  };

  const handleQuickGuest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStoredUser({
        name: "Researcher",
        email: "guest@fieldnotes.ai",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=FN&backgroundColor=171717&textColor=ffffff`,
      });
      setIsLoading(false);
      navigate({ to: "/" });
    }, 200);
  };

  return (
    <main className="relative h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between bg-background text-foreground antialiased select-none px-6 py-5 sm:py-7">
      {/* 1. TOP HEADER - High contrast, legible typography */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
            Fieldnotes
          </span>
          <span className="text-border">/</span>
          <p className="text-xs sm:text-sm text-foreground/80 font-normal tracking-tight">
            A quiet canvas for thinking with your sources.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickGuest}
          className="text-xs sm:text-sm text-foreground/90 hover:text-foreground transition-colors font-medium underline underline-offset-4"
        >
          Explore workspace as guest →
        </button>
      </header>

      {/* 2. CENTER STAGE: HIGH-CONTRAST JONY IVE INTENTION + SIGN-IN FORM */}
      <div className="relative z-20 w-full max-w-5xl mx-auto my-auto grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-8 lg:gap-14 animate-rise-in">
        {/* Philosophy Section - High contrast readable text */}
        <div className="flex flex-col space-y-3.5 max-w-lg">
          <span className="text-xs uppercase tracking-widest text-foreground/75 font-mono font-semibold">
            The Intention
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-foreground leading-snug">
            “An instrument of singular quietude.”
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/85 dark:text-foreground/90 font-normal">
            We began with a very deliberate, almost quiet obsession: to strip away the synthetic clutter of contemporary computing and return to the profound purity of focused thought. Fieldnotes was engineered not to demand your attention, but to dignify it. By grounding intelligence directly within the primary sources you hold dear, we have arrived at an interface of quiet inevitability—where research ceases to be an act of friction, and dissolves into an intimate, continuous dialogue with your materials.
          </p>
          <div className="pt-1 flex items-center gap-2.5 text-xs text-foreground/70">
            <span className="h-px w-8 bg-border" />
            <span>Form and purpose in complete distillation</span>
          </div>
        </div>

        {/* Minimalist Boxless Sign-in Section */}
        <div className="w-full max-w-[340px] mx-auto lg:ml-auto space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-foreground/80 font-normal">
              Continue to your grounded workspaces.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-2.5 text-xs sm:text-sm text-destructive text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-10 w-full rounded-lg border border-input bg-background/95 px-3.5 text-sm text-foreground placeholder:text-foreground/50 outline-hidden transition-all focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (optional for demo)"
                className="h-10 w-full rounded-lg border border-input bg-background/95 px-3.5 text-sm text-foreground placeholder:text-foreground/50 outline-hidden transition-all focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full rounded-lg text-sm font-medium transition-all"
            >
              {isLoading ? "Entering..." : "Continue with Email"}
            </Button>
          </form>

          <div className="relative my-3 text-center text-xs">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <span className="relative bg-background px-2.5 text-xs uppercase tracking-wider text-foreground/60">
              or
            </span>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickGuest}
              disabled={isLoading}
              className="h-9.5 w-full rounded-lg border-border bg-background/90 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleQuickGuest}
              disabled={isLoading}
              className="h-9 w-full rounded-lg text-sm text-foreground/80 hover:text-foreground"
            >
              Launch Demo Workspace
            </Button>
          </div>
        </div>
      </div>

      {/* 3. IMAGE FROM PUBLIC FOLDER (s.jpeg) FADING FROM FOOTER TO THE TOP */}
      <div 
        className="pointer-events-none absolute bottom-0 inset-x-0 h-[65vh] sm:h-[75vh] overflow-hidden z-0"
        aria-hidden="true"
      >
        <img
          src="/s.jpeg"
          alt="Calm horizon"
          className="w-full h-full object-cover object-bottom"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* 4. MINIMAL FOOTER */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto text-center text-xs text-foreground/70 pt-2">
        <span>Terms</span>
        <span className="mx-2 text-border">·</span>
        <span>Privacy Policy</span>
        <span className="mx-2 text-border">·</span>
        <span>Fieldnotes 2026</span>
      </footer>
    </main>
  );
}