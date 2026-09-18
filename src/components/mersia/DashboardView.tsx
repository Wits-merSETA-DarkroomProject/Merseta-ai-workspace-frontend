import React from "react";
import {
  MessageSquare,
  FileText,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";
import { PROTOTYPE_DOCUMENTS, SEED_SAVED_ANSWERS } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
  onNavigateToAsk: (question?: string) => void;
  onNavigateToDocuments: (docId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToAsk,
  onNavigateToDocuments,
}) => {
  const recentQuestions = [
    "What are the key skills priorities identified for the MER sector?",
    "How is the Just Energy Transition affecting skills demand in manufacturing?",
    "What employment trends are emerging across the sector?",
    "What is the projected demand for CNC toolmakers and millwrights by 2026?",
  ];

  const topics = [
    { name: "Skills Development", count: 12, tone: "High Urgency" },
    { name: "Labour Market", count: 9, tone: "Structural" },
    { name: "Energy Transition", count: 8, tone: "Emerging" },
    { name: "Employment Trends", count: 7, tone: "Polarization" },
    { name: "Occupational Demand", count: 6, tone: "Shortage" },
    { name: "TVET & Education", count: 5, tone: "Vocational" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber font-semibold">
              INSTITUTIONAL INTELLIGENCE OVERVIEW
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-muted text-amber border border-gold/40 font-semibold">
              PROTOTYPE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            MER Sector Research Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-text mt-1 max-w-2xl leading-relaxed">
            Analytical synthesis across statutory skills plans, labour market analyses, and
            Just Energy Transition roadmaps.
          </p>
        </div>

        <Button
          onClick={() => onNavigateToAsk()}
          className="bg-navy text-white hover:bg-navy-soft text-xs sm:text-sm gap-2 self-start sm:self-center px-4 py-2 rounded-lg font-medium shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span>New Research Inquiry</span>
        </Button>
      </div>

      {/* 4 Research Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "CORPUS INTEGRITY",
            value: "5 Documents",
            detail: "100% verified statutory texts",
            icon: <FileText className="w-4 h-4 text-gold" />,
          },
          {
            label: "MODEL CONSENSUS",
            value: "87% Agreement",
            detail: "LLaMA 3.3 × DeepSeek R1",
            icon: <ShieldCheck className="w-4 h-4 text-green-bright" />,
          },
          {
            label: "TRACEABILITY RATE",
            value: "100% Provenance",
            detail: "Direct page-level citations",
            icon: <Bookmark className="w-4 h-4 text-amber" />,
          },
          {
            label: "SECTOR COVERAGE",
            value: "6 Sub-Sectors",
            detail: "Automotive, Metals, Plastics, JET",
            icon: <Building2 className="w-4 h-4 text-gold" />,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-line bg-surface shadow-2xs space-y-2 hover:border-gold/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-medium">
                {stat.label}
              </span>
              <div className="p-1.5 rounded-lg bg-surface-muted border border-line">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-ink tracking-tight font-mono">
              {stat.value}
            </div>
            <p className="text-[11px] text-muted-text font-mono">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Main 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Research & Research Topics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Research Inquiries */}
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold">
                CURATED SECTOR INQUIRIES
              </span>
              <button
                type="button"
                onClick={() => onNavigateToAsk()}
                className="text-xs text-gold font-semibold hover:underline cursor-pointer"
              >
                Explore all inquiries →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentQuestions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateToAsk(q)}
                  className="p-3.5 rounded-lg border border-line bg-surface-muted hover:bg-surface hover:border-gold/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-amber font-bold">
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-body group-hover:text-ink transition-colors">
                      “{q}”
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-text group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Key Sector Research Topics */}
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold">
                KEY SECTOR INTELLIGENCE THEMES
              </span>
              <span className="text-[10px] font-mono text-muted-text">
                5 Indexed Primary Sources
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topics.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateToAsk(`What does the research say about ${t.name}?`)}
                  className="p-3.5 rounded-lg border border-line bg-surface-muted hover:border-gold hover:bg-surface transition-all cursor-pointer space-y-1.5"
                >
                  <span className="text-[9px] font-mono text-amber font-semibold uppercase tracking-wider block">
                    {t.tone}
                  </span>
                  <h4 className="text-xs font-semibold text-ink tracking-tight">{t.name}</h4>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-text">
                    <span>{t.count} citations</span>
                    <span className="text-gold font-bold">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Frequently Referenced Sources */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold">
                CLOSED PROTOTYPE CORPUS
              </span>
              <span className="text-[10px] font-mono text-gold font-semibold">5 Statutory Texts</span>
            </div>

            <div className="space-y-3">
              {PROTOTYPE_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigateToDocuments(doc.id)}
                  className="p-3.5 rounded-lg border border-line bg-surface-muted hover:border-gold hover:bg-surface transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-gold shrink-0" />
                      <h4 className="text-xs font-semibold text-ink group-hover:text-gold transition-colors truncate">
                        {doc.title}
                      </h4>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-text group-hover:text-gold shrink-0" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-text pt-1.5 border-t border-line">
                    <span className="truncate max-w-[150px]">{doc.organisation}</span>
                    <span>
                      {doc.year} · {doc.pageCount}p
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Honesty Statement Box */}
          <div className="p-4 sm:p-5 rounded-xl border border-gold/40 bg-surface shadow-2xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span>Institutional Research Rigour</span>
            </div>
            <p className="text-muted-text text-[11px] leading-relaxed">
              merSIA ensures that synthesis is strictly traceable. All analytical answers reflect direct
              empirical passages from the verified prototype corpus without ungrounded
              extrapolations or web crawlers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
