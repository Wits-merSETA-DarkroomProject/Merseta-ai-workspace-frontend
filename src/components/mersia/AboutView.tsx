import React from "react";
import {
  Shield,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Network,
  Clock,
  Sparkles,
  Building2,
  GraduationCap,
} from "lucide-react";

export const AboutView: React.FC = () => {
  const pillars = [
    {
      title: "Closed Sector Corpus",
      desc: "merSIA never hallucinates from generic internet crawls. It searches strictly within verified MER sector planning documents and empirical labour market publications.",
      icon: <Shield className="w-5 h-5 text-primary" />,
    },
    {
      title: "Evidence-First Answers",
      desc: "Every assertion is grounded in verifiable textual snippets. Questions lead to evidence, evidence produces answers, and answers map back to page citations.",
      icon: <FileCheck2 className="w-5 h-5 text-wits-navy" />,
    },
    {
      title: "Model Agreement Confidence",
      desc: "Dual inference evaluation (LLaMA 3.3 + DeepSeek R1) calculates an empirical consensus score, ensuring balanced research perspectives.",
      icon: <CheckCircle2 className="w-5 h-5 text-wits-gold" />,
    },
    {
      title: "Time-Aware Horizon",
      desc: "Historical baseline texts (2018) are never silently blended with contemporary statutory forecasts (2024). Time stamps are prominently badge-coded.",
      icon: <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: "Reasoning Traceability",
      desc: "Structured cognitive chains explain how raw statistical data informs occupational shifts and translates into training priorities.",
      icon: <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: "Academic & Institutional Credibility",
      desc: "Designed to meet the stringent research standards of university faculties, statutory SETA planning units, and vocational authorities.",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 animate-rise-in select-none">
      {/* 1. HERO HEADER */}
      <div className="space-y-3.5 border-b border-line pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>DARKROOM INITIATIVE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          What is <span className="text-gold">merSIA</span>?
        </h1>

        <p className="text-sm sm:text-base text-muted-text leading-relaxed">
          merSIA (<strong>MER Sector Intelligence Assistant</strong>) is a closed, sector-specific
          AI research instrument engineered to make South Africa&apos;s Manufacturing, Engineering
          and Related Services planning documentation easier to search, understand, and act upon
          while maintaining unbroken provenance.
        </p>
      </div>

      {/* 2. CORE PRODUCT PHILOSOPHY */}
      <div className="p-6 sm:p-8 rounded-xl border border-line bg-surface shadow-2xs space-y-4 text-center">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gold font-semibold block">
          CORE PRODUCT PHILOSOPHY
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base font-bold font-mono">
          <span className="text-ink">Question</span>
          <span className="text-gold">→</span>
          <span className="text-blue-400">Evidence</span>
          <span className="text-gold">→</span>
          <span className="text-amber-400">Answer</span>
          <span className="text-gold">→</span>
          <span className="text-emerald-400">Confidence</span>
          <span className="text-gold">→</span>
          <span className="text-blue-400">Reasoning</span>
        </div>
        <p className="text-xs text-muted-text max-w-2xl mx-auto leading-relaxed">
          Every component in merSIA visually reinforces this unbroken chain. Intelligence is only as
          valuable as its traceability back to verified primary sources.
        </p>
      </div>

      {/* 3. SIX PILLARS GRID */}
      <div className="space-y-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold block">
          ARCHITECTURAL PILLARS
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-line bg-surface hover:border-gold/40 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
            >
              <div className="p-2 w-fit rounded-lg bg-surface-muted border border-line">{pillar.icon}</div>
              <h3 className="text-sm font-bold text-ink tracking-tight">{pillar.title}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. INSTITUTIONAL COLLABORATION & DARKROOM INITIATIVE */}
      <div className="p-6 sm:p-8 rounded-xl border border-gold/40 bg-surface shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-ink font-bold text-base">
          <Building2 className="w-5 h-5 text-gold" />
          <span>Institutional Partnership & Governance</span>
        </div>

        <p className="text-xs sm:text-sm text-body leading-relaxed">
          merSIA is conceived under the <strong>Darkroom Initiative</strong>, a research and
          technological collaboration between the{" "}
          <strong className="text-ink">Manufacturing, Engineering and Related Services SETA (merSETA)</strong> and the{" "}
          <strong className="text-ink">
            Centre for Researching Education and Labour (REAL) at the University of the
            Witwatersrand (Wits)
          </strong>
          .
        </p>

        <p className="text-xs text-muted-text leading-relaxed">
          Its overarching mission is to equip policy analysts, skills planners, educators, and
          enterprise researchers with an intelligence instrument tailored specifically to South
          Africa&apos;s industrial needs and the Just Energy Transition.
        </p>
      </div>
    </div>
  );
};

export default AboutView;
