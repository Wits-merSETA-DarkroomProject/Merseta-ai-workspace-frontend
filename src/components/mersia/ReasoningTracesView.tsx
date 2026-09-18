import React from "react";
import { Layers, AlertCircle, Sparkles, Network, ArrowDown, CheckCircle2 } from "lucide-react";
import { ReasoningTrace } from "./ReasoningTrace";

export const ReasoningTracesView: React.FC = () => {
  const traces = [
    {
      title: "Artisan Shortage & Hybrid Competency Trace",
      disclaimer: "Illustrative prototype — Bayesian reasoning layer not yet operational.",
      steps: [
        {
          title: "1. Macro Trend Identification",
          description:
            "4th Industrial Revolution automation in automotive assembly lines contracting routine low-skill operations.",
          status: "verified" as const,
        },
        {
          title: "2. Occupational Demand Shift",
          description:
            "Demand surge for mechatronics technicians, millwrights, and telemetry diagnostics specialists.",
          status: "derived" as const,
        },
        {
          title: "3. Skills Pipeline Bottleneck",
          description:
            "TVET college engineering curricula retain legacy mechanical bias lacking sensor calibration training.",
          status: "derived" as const,
        },
        {
          title: "4. Strategic Recommendation",
          description:
            "merSETA board to inject discretionary funding into modular mechatronics bridge credentials.",
          status: "prototype" as const,
        },
      ],
    },
    {
      title: "Just Energy Transition Coal Re-Skilling Trace",
      disclaimer: "Illustrative prototype — Bayesian reasoning layer not yet operational.",
      steps: [
        {
          title: "1. Decarbonisation Schedule",
          description:
            "Phased decommissioning of coal power stations in Mpumalanga industrial heartland.",
          status: "verified" as const,
        },
        {
          title: "2. Artisan Exposure Analysis",
          description:
            "Boilermakers, pipefitters, and heavy mechanical welders face direct employment dislocation.",
          status: "verified" as const,
        },
        {
          title: "3. Vocational Re-skilling Pathway",
          description:
            "GWO-certified short learning pathways for wind turbine maintenance and green hydrogen pipeline fabrication.",
          status: "prototype" as const,
        },
        {
          title: "4. Policy Implementation",
          description:
            "Deployment of regional clean-energy training hubs funded via SETA / GIZ green economy partnerships.",
          status: "prototype" as const,
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Header */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-medium">
          <Layers className="w-3.5 h-3.5 text-gold" />
          <span>REASONING ARCHITECTURE</span>
          <span>·</span>
          <span>INFERENCE TRACES</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Cognitive Reasoning Traces
        </h1>

        <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
          Transparent step-by-step cognitive trajectories explaining how claims are connected to
          primary empirical evidence and translated into policy recommendations.
        </p>
      </div>

      {/* Prominent Research Honesty Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-gold/40 bg-surface shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-ink font-semibold text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 text-gold shrink-0" />
          <span>Bayesian Network Prototype Disclosure</span>
        </div>
        <p className="text-xs text-muted-text leading-relaxed">
          The current merSIA prototype displays illustrative reasoning flows to demonstrate the
          target intelligence architecture. The full probabilistic Bayesian Directed Acyclic Graph
          (DAG) for causal inference is in active academic research with Wits REAL and will be
          integrated in subsequent releases.
        </p>
      </div>

      {/* List of Traces */}
      <div className="space-y-6">
        {traces.map((trace, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold text-gold font-mono tracking-wider uppercase">
              TRACE 0{idx + 1} · {trace.title}
            </h3>
            <ReasoningTrace
              title={trace.title}
              steps={trace.steps}
              disclaimer={trace.disclaimer}
              defaultExpanded={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReasoningTracesView;
