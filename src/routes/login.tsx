import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, NotebookPen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Fieldnotes" },
      { name: "description", content: "Sign in to your Fieldnotes research workspace." },
      { property: "og:title", content: "Sign in — Fieldnotes" },
      { property: "og:description", content: "Sign in to your Fieldnotes research workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.78fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex w-fit items-center gap-2.5"><span className="grid size-8 place-items-center rounded-md bg-primary-foreground text-primary"><NotebookPen className="size-4" /></span><span className="font-display text-xl">Fieldnotes</span></Link>
        <div className="relative z-10 max-w-xl animate-rise-in">
          <Sparkles className="mb-6 size-6 opacity-70" />
          <blockquote className="font-display text-5xl leading-[1.05]">“The best ideas emerge when the right notes can finally speak to one another.”</blockquote>
          <p className="mt-7 text-sm opacity-65">One quiet place for sources, questions, and the thinking between them.</p>
        </div>
        <div className="absolute inset-x-12 bottom-28 h-px bg-primary-foreground/15" />
        <p className="text-xs opacity-50">Fieldnotes © 2026</p>
      </section>

      <section className="flex min-h-screen flex-col p-5 sm:p-8 lg:p-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> Back</Link>
          <Link to="/" className="flex items-center gap-2 lg:hidden"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><NotebookPen className="size-4" /></span><span className="font-display text-xl">Fieldnotes</span></Link>
        </div>
        <div className="m-auto w-full max-w-sm animate-rise-in">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-4xl">Continue your thinking.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to return to your notebooks, sources, and saved conversations.</p>
          <form className="mt-8 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-1.5"><label htmlFor="email" className="text-sm font-medium">Email address</label><input id="email" type="email" placeholder="you@example.com" className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-hidden transition-all focus:border-ring focus:ring-2 focus:ring-ring/15" /></div>
            <div className="space-y-1.5"><div className="flex items-center justify-between"><label htmlFor="password" className="text-sm font-medium">Password</label><button type="button" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Forgot password?</button></div><input id="password" type="password" placeholder="Enter your password" className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-hidden transition-all focus:border-ring focus:ring-2 focus:ring-ring/15" /></div>
            <Button type="submit" className="h-11 w-full">Continue <ArrowRight /></Button>
          </form>
          <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-[11px] uppercase text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>
          <Button variant="outline" className="h-11 w-full bg-card">Continue with Google</Button>
          <p className="mt-7 text-center text-xs text-muted-foreground">New to Fieldnotes? <button className="font-medium text-foreground hover:underline">Create an account</button></p>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">By continuing, you agree to the Terms and Privacy Policy.</p>
      </section>
    </main>
  );
}