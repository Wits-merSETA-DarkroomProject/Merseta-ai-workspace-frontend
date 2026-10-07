import React, { useState } from "react";
import {
  Network,
  HelpCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Building2,
} from "lucide-react";
import { PROTOTYPE_DOCUMENTS } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface GraphNode {
  id: string;
  type: "question" | "claim" | "evidence" | "document" | "reasoning";
  label: string;
  sublabel?: string;
  detail: string;
  metadata?: string;
}

export const EvidenceExplorerView: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>("claim-1");

  const nodes: GraphNode[] = [
    {
      id: "q-1",
      type: "question",
      label: "Sector Skills Shortages",
      sublabel: "Primary Inquiry",
      detail:
        "Which technical occupations and artisan trades exhibit critical vacancy rates across MER manufacturing chambers?",
      metadata: "Inquiry Node",
    },
    {
      id: "claim-1",
      type: "claim",
      label: "Artisan Shortage Exceeds 34%",
      sublabel: "Extracted Claim",
      detail:
        "Mechanical fitters, millwrights, and CNC toolmakers face vacancy rates exceeding 34% across primary manufacturing chambers.",
      metadata: "Synthesis Claim",
    },
    {
      id: "evidence-1",
      type: "evidence",
      label: "Section 3.4 Table 12",
      sublabel: "Empirical Passage",
      detail:
        "“Section 3.4 highlights priority skills lists: mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exhibit vacancy rates exceeding 34%...”",
      metadata: "Corpus Chunk #842",
    },
    {
      id: "doc-1",
      type: "document",
      label: "merSETA Sector Skills Plan",
      sublabel: "Primary Document",
      detail:
        "Official statutory skills plan published by merSETA Research & Planning Division for 2024/2025.",
      metadata: "merSETA · 2024 · Page 42",
    },
    {
      id: "reasoning-1",
      type: "reasoning",
      label: "Bayesian Causal Node",
      sublabel: "Causal Inference",
      detail:
        "Infers direct link between TVET P1/P2 placement bottlenecks and the escalating 34% artisan vacancy rate. (Prototype reasoning layer).",
      metadata: "Illustrative Reasoning",
    },
  ];

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0]!;

  const getNodeBadge = (type: GraphNode["type"]) => {
    switch (type) {
      case "question":
        return "bg-navy/15 text-navy border-navy/30 dark:bg-navy-light/40 dark:text-cyan-300 dark:border-navy-light";
      case "claim":
        return "bg-gold/15 text-gold border-gold/30";
      case "evidence":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "document":
        return "bg-navy/15 text-navy border-navy/30 dark:bg-navy-light/40 dark:text-blue-300 dark:border-navy-light";
      case "reasoning":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-surface-muted text-muted-text border-line";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Header */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-medium">
          <Network className="w-3.5 h-3.5 text-gold" />
          <span>EVIDENCE NETWORK EXPLORER</span>
          <span>·</span>
          <span>TRACEABILITY TOPOLOGY</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Question → Claim → Evidence → Document Network
        </h1>

        <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
          Interactive graph mapping empirical claims back to primary statutory documents and forward
          to illustrative Bayesian reasoning nodes.
        </p>
      </div>

      {/* Network Graph Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Node Map (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-line bg-surface p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-text font-semibold">
              TOPOLOGY GRAPH
            </span>
            <span className="text-[10px] font-mono text-muted-text">
              Select a node to inspect
            </span>
          </div>

          {/* Sequential Step Nodes */}
          <div className="space-y-4">
            {nodes.map((node, idx) => {
              const isSelected = node.id === activeNodeId;
              const isLast = idx === nodes.length - 1;

              return (
                <div key={node.id} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-6 top-12 bottom-[-18px] w-[2px] bg-line z-0"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    onClick={() => setActiveNodeId(node.id)}
                    className={`relative z-10 p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-gold bg-surface-muted shadow-2xs ring-1 ring-gold/30 text-ink"
                        : "border-line bg-surface hover:bg-surface-muted hover:border-gold/40 text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? "bg-navy text-white border-navy dark:bg-gold dark:text-slate-950 dark:border-gold"
                            : "bg-surface-muted border-line text-muted-text"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-ink">
                            {node.label}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-medium border ${getNodeBadge(
                              node.type,
                            )}`}
                          >
                            {node.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-text line-clamp-1 mt-0.5">
                          {node.sublabel}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-gold translate-x-1"
                          : "text-muted-text"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-line bg-surface p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-line pb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-gold font-semibold">
                NODE INSPECTOR
              </span>
              <span className="text-[10px] font-mono text-muted-text">
                {activeNode.metadata}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-text font-semibold">
                {activeNode.type.toUpperCase()} SPECIFICATION
              </span>
              <h3 className="text-lg font-bold text-ink">{activeNode.label}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{activeNode.sublabel}</p>
            </div>

            <div className="p-4 rounded-lg border border-line bg-surface-muted text-xs text-ink leading-relaxed space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold block">
                CONTENT & EMPIRICAL EVIDENCE
              </span>
              <p className="font-serif italic text-body leading-relaxed">
                {activeNode.detail}
              </p>
            </div>

            {/* Prototype note */}
            {activeNode.type === "reasoning" && (
              <div className="p-3.5 rounded-lg border border-gold/40 bg-gold/10 text-[11px] text-muted-text leading-relaxed space-y-1">
                <strong className="text-gold font-semibold block">
                  Illustrative Prototype Disclaimer:
                </strong>
                Bayesian Directed Acyclic Graph reasoning is currently in prototype evaluation and
                not yet operational on live production networks.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-muted-text font-mono">
            <span>Traceability: Guaranteed</span>
            <span className="text-emerald-400 font-bold">100% Provenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceExplorerView;
