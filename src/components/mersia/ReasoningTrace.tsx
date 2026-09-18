import React, { useState } from "react";
import { ChevronDown, ChevronUp, Network, AlertCircle, ArrowDown } from "lucide-react";
import { ReasoningStep } from "@/lib/workspace-store";

interface ReasoningTraceProps {
  title?: string;
  steps?: ReasoningStep[];
  disclaimer?: string;
  defaultExpanded?: boolean;
}

export const ReasoningTrace: React.FC<ReasoningTraceProps> = ({
  title = "Reasoning Trace",
  steps,
  disclaimer = "Illustrative prototype — Bayesian reasoning layer not yet operational.",
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Default illustrative sector flow if steps are not explicitly passed
  const defaultSteps: ReasoningStep[] = [
    {
      title: "Employment Trend",
      description:
        "Structural contraction in manual tasks (-14%) alongside technician demand expansion (+19%).",
      status: "verified",
    },
    {
      title: "Occupational Demand Shift",
      description:
        "Emerging acute shortages across CNC toolmakers, millwrights, and mechatronics trades.",
      status: "derived",
    },
    {
      title: "Emerging Skills Requirement",
      description:
        "Hybrid competencies merging mechanical maintenance with telemetry and sensor diagnostics.",
      status: "derived",
    },
    {
      title: "Training Priority",
      description:
        "Fast-track TVET experiential P1/P2 placements and modular clean-energy micro-credentials.",
      status: "prototype",
    },
  ];

  const activeSteps = Array.isArray(steps) && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-2xs transition-all">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-surface-muted border-b border-line hover:bg-surface-elevated transition-colors"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-gold/10 text-gold">
            <Network className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-ink">{title}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-gold/10 text-gold border border-gold/40">
            Illustrative Prototype
          </span>
        </div>

        <button
          type="button"
          className="text-muted-text hover:text-ink transition-colors p-1"
          aria-label={isExpanded ? "Collapse trace" : "Expand trace"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Trace Body */}
      {isExpanded && (
        <div className="p-4 space-y-4 animate-rise-in">
          {/* Research Honesty Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-gold/40 bg-gold/10 text-xs text-ink">
            <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed text-muted-text">
              <strong className="text-ink font-medium">Research Notice: </strong>
              {disclaimer}
            </span>
          </div>

          {/* Node & Connector Flow */}
          <div className="relative pl-3 sm:pl-6 space-y-4 pt-1">
            {activeSteps.map((step, idx) => {
              const isLast = idx === activeSteps.length - 1;
              const stepTitle = typeof step === "string" ? step : step?.title || `Step ${idx + 1}`;
              const stepDesc = typeof step === "string" ? "" : step?.description || "";
              const stepStatus = typeof step === "string" ? "verified" : step?.status;

              return (
                <div key={idx} className="relative flex items-start gap-3.5 group">
                  {/* Vertical connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[13px] top-7 bottom-[-20px] w-[2px] bg-line"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Node Dot */}
                  <div className="relative z-10 w-7 h-7 rounded-full border border-line bg-surface-muted flex items-center justify-center text-xs font-mono font-bold text-ink shadow-2xs shrink-0 group-hover:border-gold group-hover:bg-gold group-hover:text-slate-950 transition-all">
                    {idx + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-semibold text-ink tracking-tight">
                        {stepTitle}
                      </h4>
                      {stepStatus && (
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-medium border ${
                            stepStatus === "verified"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : stepStatus === "prototype"
                                ? "bg-gold/15 text-gold border-gold/30"
                                : "bg-navy/15 text-navy border-navy/30 dark:bg-navy-light/40 dark:text-cyan-300 dark:border-navy-light"
                          }`}
                        >
                          {stepStatus}
                        </span>
                      )}
                    </div>
                    {stepDesc && (
                      <p className="text-xs text-muted-text mt-1 leading-relaxed">
                        {stepDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasoningTrace;
