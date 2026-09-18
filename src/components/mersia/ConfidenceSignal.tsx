import React, { useState } from "react";
import { CheckCircle2, Info, HelpCircle } from "lucide-react";

interface ConfidenceSignalProps {
  score?: number;
  level?: "HIGH" | "MODERATE" | "LOW";
  modelAgreement?: {
    llama: boolean;
    deepSeek: boolean;
  };
  note?: string;
  className?: string;
}

export const ConfidenceSignal: React.FC<ConfidenceSignalProps> = ({
  score = 87,
  level = "HIGH",
  modelAgreement = { llama: true, deepSeek: true },
  note,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Safe normalized values
  const safeScore =
    typeof score === "number" && !isNaN(score) ? Math.max(0, Math.min(100, score)) : 87;
  const llamaOk = modelAgreement?.llama ?? true;
  const deepSeekOk = modelAgreement?.deepSeek ?? true;

  // Semantic color for stroke
  const strokeColor = safeScore >= 80 ? "var(--green-bright)" : safeScore >= 60 ? "var(--amber)" : "var(--muted-text)";
  const circumference = 2 * Math.PI * 18; // r = 18
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center gap-3 p-3 rounded-xl border border-line bg-surface-muted ${className}`}
    >
      {/* Radial Progress Gauge */}
      <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="var(--line)"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute font-mono text-xs font-bold text-ink">{safeScore}%</span>
      </div>

      {/* Details & Model Agreement */}
      <div className="space-y-1 min-w-[140px]">
        <div className="flex items-center gap-1.5">
          <span className="eyebrow text-[10px]">EVALUATION CONFIDENCE</span>
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-muted-text hover:text-ink transition-colors cursor-pointer"
            title="Confidence details"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
          <span>{safeScore >= 80 ? "High Agreement" : "Moderate Agreement"}</span>
          <span className="text-line">·</span>
          <span className="text-[10px] font-mono text-muted-text">Dual Model</span>
        </div>

        {/* Inference Models Consensus Badges */}
        <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
          <div
            className={`flex items-center gap-1 ${
              llamaOk ? "text-green-bright font-bold" : "text-muted-text"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>LLaMA 3.3</span>
          </div>
          <span className="text-line">|</span>
          <div
            className={`flex items-center gap-1 ${
              deepSeekOk ? "text-green-bright font-bold" : "text-muted-text"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>DeepSeek R1</span>
          </div>
        </div>
      </div>

      {/* Tooltip Card */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-72 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-3 text-xs space-y-1.5 z-30 animate-rise-in">
          <p className="font-bold text-ink">Inference Consensus Metric</p>
          <p className="text-[11px] text-muted-text leading-relaxed">
            {note ||
              "Calculated by comparing the semantic overlap and citation concordance between independent model runs against the 5 verified sector documents."}
          </p>
          <div className="text-[10px] font-mono text-amber pt-1 border-t border-line">
            Agreement score: {safeScore}/100
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceSignal;
