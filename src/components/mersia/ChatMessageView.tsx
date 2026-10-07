import React, { useState } from "react";
import { ChatMessage, CitationItem } from "@/lib/workspace-store";
import { ConfidenceSignal } from "./ConfidenceSignal";
import { ReasoningTrace } from "./ReasoningTrace";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  FileText,
  User,
} from "lucide-react";

interface ChatMessageViewProps {
  message: ChatMessage;
  onCitationClick: (citation: CitationItem) => void;
  onSaveAnswer?: ((message: ChatMessage) => void) | undefined;
  isSaved?: boolean | undefined;
}

export const ChatMessageView: React.FC<ChatMessageViewProps> = ({
  message,
  onCitationClick,
  onSaveAnswer,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message.content || "");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadgeVariant = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("verified")) return "verified";
    if (s.includes("emerging")) return "emerging";
    if (s.includes("observed")) return "observed";
    if (s.includes("inferred")) return "inferred";
    return "uncertain";
  };

  if (!isAssistant) {
    // User research inquiry
    return (
      <div className="flex justify-end my-4 animate-rise-in">
        <div className="max-w-2xl rounded-xl bg-surface-elevated border border-line px-5 py-3.5 text-body shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold tracking-widest text-amber uppercase">
            <User className="w-3.5 h-3.5 text-gold" />
            <span>RESEARCH INQUIRY</span>
            <span className="text-line">·</span>
            <span className="text-muted-text font-normal lowercase">{message.timestamp}</span>
          </div>
          <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap text-body">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // Assistant response structured around:
  // 1. Header (Persona + Actions)
  // 2. ANALYSIS (AI Interpretation)
  // 3. WHY THIS SIGNAL EXISTS
  // 4. CONFIDENCE (Model Agreement Consensus)
  // 5. EVIDENCE (Strict Empirical Source Metadata)
  // 6. REASONING TRACE (Causal Progression)
  return (
    <div className="my-6 space-y-4 animate-rise-in">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-7 shadow-2xs space-y-6">
        {/* Header: Persona + Timestamp + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-navy text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs border border-gold/40 shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink tracking-tight">merSIA</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-muted text-ink border border-line">
                  {message.persona || "Policy Analyst"}
                </span>
              </div>
              <span className="text-[10px] text-muted-text font-mono">
                Skills Intelligence Synthesis · {message.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center">
            {onSaveAnswer && (
              <button
                type="button"
                onClick={() => onSaveAnswer(message)}
                className={`px-2.5 py-1 rounded-[6px] border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSaved
                    ? "border-gold bg-gold/15 text-gold font-bold"
                    : "border-line text-muted-text hover:text-ink hover:bg-surface-muted"
                }`}
                title={isSaved ? "Saved to notebook" : "Save answer"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-gold text-gold" : ""}`} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-[6px] border border-line text-muted-text hover:text-ink hover:bg-surface-muted text-xs transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Copy answer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-bright" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* 1. ANALYSIS SECTION */}
        <div className="space-y-2">
          <span className="eyebrow block">ANALYSIS</span>
          <div className="text-sm sm:text-base text-body leading-relaxed font-normal whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        {/* 2. CONFIDENCE VISUALIZATION */}
        {message.confidence && (
          <div className="pt-2 border-t border-line/60">
            <span className="eyebrow block mb-2">MODEL AGREEMENT CONSENSUS</span>
            <ConfidenceSignal
              score={message.confidence.score}
              level={message.confidence.level || "HIGH"}
              modelAgreement={message.confidence.modelAgreement}
              note={message.confidence.note}
            />
          </div>
        )}

        {/* 3. EVIDENCE & SOURCE CITATIONS */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="eyebrow">EVIDENCE & SOURCE PROVENANCE</span>
              <span className="text-[11px] font-mono text-muted-text">
                {message.citations.length} verified observations
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {message.citations.map((cite, index) => {
                const status = cite.evidenceStatus || "Verified";
                return (
                  <div
                    key={index}
                    onClick={() => onCitationClick(cite)}
                    className="group p-4 rounded-xl border border-line bg-surface-muted hover:bg-surface-elevated hover:border-gold/40 hover:shadow-2xs transition-all cursor-pointer space-y-3"
                  >
                    {/* Top Row: Evidence Number + Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-[4px] bg-navy text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-line">
                          {index + 1}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber">
                          EVIDENCE · {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status}
                      </Badge>
                    </div>

                    {/* Source Title & Organisation */}
                    <div>
                      <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">
                        SOURCE
                      </span>
                      <h4 className="text-sm font-semibold text-ink group-hover:text-gold transition-colors leading-snug">
                        {cite.sourceTitle}
                      </h4>
                      {cite.organisation && (
                        <p className="text-[11px] text-muted-text mt-0.5">
                          {cite.organisation} · {cite.year || "2024"}
                        </p>
                      )}
                    </div>

                    {/* Empirical Observation Excerpt */}
                    <div>
                      <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-0.5">
                        OBSERVATION
                      </span>
                      <p className="text-xs text-body leading-relaxed italic bg-surface p-2.5 rounded-[6px] border border-line">
                        “{cite.snippet}”
                      </p>
                    </div>

                    {/* Metadata Grid: Period, Page, Method, Confidence */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-line text-[10px] font-mono text-muted-text">
                      <div>
                        <span className="block text-amber font-bold uppercase">PERIOD</span>
                        <span>{cite.observationPeriod || cite.year || "2024–2025"}</span>
                      </div>
                      <div>
                        <span className="block text-amber font-bold uppercase">PAGE</span>
                        <span>Page {cite.page || 1}</span>
                      </div>
                      <div>
                        <span className="block text-amber font-bold uppercase">CONFIDENCE</span>
                        <span className="text-green-bright font-bold">{cite.confidenceLevel || "High"}</span>
                      </div>
                      <div>
                        <span className="block text-amber font-bold uppercase">METHOD</span>
                        <span className="truncate block">{cite.method || "Corpus Extraction"}</span>
                      </div>
                    </div>

                    {/* View Action Link */}
                    <div className="flex items-center justify-end pt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-ink group-hover:text-gold group-hover:gap-2 transition-all">
                        <span>Inspect in primary text</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gold" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. REASONING TRACE */}
        {message.reasoningTrace && (
          <div className="pt-3 border-t border-line">
            <ReasoningTrace
              title={message.reasoningTrace.title || "Reasoning Trace"}
              steps={message.reasoningTrace.steps || []}
              disclaimer={message.reasoningTrace.disclaimer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageView;
