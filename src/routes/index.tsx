import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  AudioLines,
  BookOpen,
  ChevronDown,
  FileText,
  Globe2,
  Grid2X2,
  MoreHorizontal,
  NotebookPen,
  PanelLeft,
  Plus,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fieldnotes — Think with your sources" },
      { name: "description", content: "A focused workspace for reading, connecting, and developing ideas." },
      { property: "og:title", content: "Fieldnotes — Think with your sources" },
      { property: "og:description", content: "A focused workspace for reading, connecting, and developing ideas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

const sources = [
  { title: "The Architecture of Attention", detail: "PDF · 24 pages", icon: FileText },
  { title: "Designing for Deep Work", detail: "Website · readwise.io", icon: Globe2 },
  { title: "Calm Technology Notes", detail: "Document · 1,840 words", icon: FileText },
  { title: "Ambient Interfaces", detail: "PDF · 12 pages", icon: FileText },
];

const starters = [
  "What ideas connect these sources?",
  "Where do the authors disagree?",
  "Create a concise research brief",
];

function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Fieldnotes home">
      <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-3">
        <NotebookPen className="size-4" />
      </span>
      <span className="font-display text-xl font-medium">Fieldnotes</span>
    </Link>
  );
}

function Workspace() {
  return (
    <main className="min-h-screen bg-background p-2 text-foreground md:h-screen md:overflow-hidden md:p-3">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1800px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm md:h-[calc(100vh-1.5rem)] md:min-h-0">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-5">
          <div className="flex min-w-0 items-center gap-4">
            <Brand />
            <div className="hidden h-5 w-px bg-border sm:block" />
            <button className="hidden min-w-0 items-center gap-2 text-sm font-medium transition-colors hover:text-primary sm:flex">
              <span className="truncate">Designing for attention</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Share notebook" title="Share notebook"><Share2 /></Button>
            <Button variant="ghost" size="icon" aria-label="More options" title="More options"><MoreHorizontal /></Button>
            <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>
          </div>
        </header>

        <div className="grid flex-1 md:min-h-0 md:grid-cols-[270px_minmax(430px,1fr)_300px]">
          <aside className="border-b border-border bg-secondary/35 p-4 md:overflow-y-auto md:border-r md:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><PanelLeft className="size-4" /><h2 className="text-sm font-semibold">Sources</h2></div>
              <Button variant="ghost" size="icon" aria-label="Add source" title="Add source"><Plus /></Button>
            </div>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-hidden transition-all focus:border-ring focus:ring-2 focus:ring-ring/15" placeholder="Search sources" readOnly />
            </div>
            <Button variant="outline" className="mb-5 w-full justify-start bg-card"><Plus /> Add source</Button>
            <p className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">4 selected</p>
            <div className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-1">
              {sources.map(({ title, detail, icon: Icon }, index) => (
                <article key={title} className="group animate-rise-in flex gap-3 rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-border hover:bg-card" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-card text-muted-foreground"><Icon className="size-4" /></div>
                  <div className="min-w-0"><h3 className="truncate text-sm font-medium">{title}</h3><p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p></div>
                </article>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[600px] flex-col md:min-h-0">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
              <div><h1 className="text-sm font-semibold">Notebook conversation</h1><p className="text-xs text-muted-foreground">Grounded in 4 sources</p></div>
              <Button variant="ghost" size="icon" aria-label="Conversation options" title="Conversation options"><MoreHorizontal /></Button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-12">
              <div className="w-full max-w-2xl animate-rise-in text-center">
                <div className="mx-auto mb-6 grid size-11 place-items-center rounded-full border border-border bg-secondary text-primary"><Sparkles className="size-5" /></div>
                <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Your research, in conversation</p>
                <h2 className="font-display text-4xl leading-tight md:text-5xl">What are you<br />trying to understand?</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">Ask a question and Fieldnotes will work across your selected material, citing every idea back to its source.</p>
                <div className="mx-auto mt-7 grid max-w-lg gap-2 sm:grid-cols-3">
                  {starters.map((starter) => <button key={starter} className="rounded-md border border-border bg-card px-3 py-3 text-left text-xs leading-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-input hover:shadow-sm">{starter}</button>)}
                </div>
              </div>
            </div>
            <div className="shrink-0 p-4 pt-0 md:p-5 md:pt-0">
              <div className="mx-auto max-w-2xl rounded-lg border border-input bg-card p-2 shadow-sm transition-shadow focus-within:shadow-md">
                <textarea readOnly placeholder="Ask about your sources…" className="min-h-16 w-full resize-none bg-transparent px-2 py-2 text-sm outline-hidden placeholder:text-muted-foreground" />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm"><Sparkles /> 4 sources</Button>
                  <Button size="icon" aria-label="Send question" title="Send question"><ArrowUp /></Button>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">Fieldnotes may make mistakes. Check source citations.</p>
            </div>
          </section>

          <aside className="border-t border-border bg-secondary/35 p-4 md:overflow-y-auto md:border-t-0 md:border-l">
            <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Grid2X2 className="size-4" /><h2 className="text-sm font-semibold">Studio</h2></div><Button variant="ghost" size="icon" aria-label="Studio options" title="Studio options"><MoreHorizontal /></Button></div>
            <div className="space-y-2">
              <StudioItem icon={AudioLines} title="Audio overview" detail="A conversational deep dive" />
              <StudioItem icon={BookOpen} title="Study guide" detail="Key concepts and questions" />
              <StudioItem icon={FileText} title="Briefing document" detail="A structured synthesis" />
            </div>
            <div className="my-5 h-px bg-border" />
            <div className="rounded-md border border-dashed border-input p-4 text-center">
              <div className="mx-auto mb-3 flex w-fit items-end gap-1">
                {[12, 21, 16, 26, 18].map((height, i) => <span key={height + i} className="animate-soft-pulse w-1 rounded-full bg-primary" style={{ height, animationDelay: `${i * 120}ms` }} />)}
              </div>
              <h3 className="text-sm font-medium">Build from your sources</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Choose a format above to shape your research into something useful.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StudioItem({ icon: Icon, title, detail }: { icon: typeof AudioLines; title: string; detail: string }) {
  return <button className="group flex w-full items-center gap-3 rounded-md border border-border bg-card p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"><div className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground transition-transform group-hover:scale-105"><Icon className="size-4" /></div><div><h3 className="text-sm font-medium">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{detail}</p></div></button>;
}