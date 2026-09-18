import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

interface StepItem {
  id: string;
  label: string;
}

const STEPS: StepItem[] = [
  { id: "1", label: "Resolving sector inquiry across statutory corpus..." },
  { id: "2", label: "Filtering chunk-level evidence from 5 primary texts..." },
  { id: "3", label: "Extracting verified page-level observation citations..." },
  { id: "4", label: "Evaluating model agreement consensus & uncertainty..." },
];

interface LoadingSequenceProps {
  onComplete?: () => void;
  className?: string;
}

export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete, className = "" }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`p-5 rounded-xl border border-line bg-surface shadow-2xs space-y-4 max-w-xl mx-auto animate-rise-in ${className}`}
    >
      {/* Calm Institutional Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="space-y-0.5">
          <span className="eyebrow block text-[10px]">ANALYSIS IN PROGRESS</span>
          <p className="text-xs font-semibold text-ink">
            Synthesizing evidence-backed sector intelligence
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-text bg-surface-muted px-2 py-0.5 rounded border border-line">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>Stage {currentStepIndex + 1} of {STEPS.length}</span>
        </div>
      </div>

      {/* Subtle Step Stages */}
      <div className="space-y-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                isDone
                  ? "text-body font-medium"
                  : isCurrent
                    ? "text-ink font-semibold"
                    : "text-muted-text/50"
              }`}
            >
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-green-bright" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-line" />
                )}
              </div>
              <span className="leading-tight">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Subtle Skeleton Loader Bar */}
      <div className="pt-2 border-t border-line flex items-center justify-between text-[10px] font-mono text-muted-text">
        <span>Corpus grounded: merSETA & Wits REAL</span>
        <span className="text-amber font-semibold">5 Prototype Texts</span>
      </div>
    </div>
  );
};

export default LoadingSequence;
