import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Clock,
  BookOpen,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import {
  ModelPersonaId,
  ReferenceStyleId,
  TimePeriodFilterId,
  MODEL_PERSONAS,
  REFERENCE_STYLES,
  TIME_PERIOD_FILTERS,
} from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface AIInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  persona: ModelPersonaId;
  onPersonaChange: (persona: ModelPersonaId) => void;
  timePeriod: TimePeriodFilterId;
  onTimePeriodChange: (tp: TimePeriodFilterId) => void;
  referenceStyle: ReferenceStyleId;
  onReferenceStyleChange: (style: ReferenceStyleId) => void;
  onAttachClick?: () => void;
  className?: string;
}

export const AIInput: React.FC<AIInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  persona,
  onPersonaChange,
  timePeriod,
  onTimePeriodChange,
  referenceStyle,
  onReferenceStyleChange,
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"persona" | "time" | "style" | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  const currentPersona = MODEL_PERSONAS.find((p) => p.id === persona) || MODEL_PERSONAS[0];
  const currentTime =
    TIME_PERIOD_FILTERS.find((t) => t.id === timePeriod) || TIME_PERIOD_FILTERS[0];
  const currentStyle = REFERENCE_STYLES.find((s) => s.id === referenceStyle) || REFERENCE_STYLES[0];

  return (
    <div
      className={`relative w-full rounded-xl border transition-all duration-200 bg-surface shadow-2xs ${
        isFocused
          ? "border-gold ring-1 ring-gold/40"
          : "border-line hover:border-line"
      } ${className}`}
    >
      {/* Upper Input Area */}
      <div className="p-4 sm:p-5">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask merSIA about skills priorities, Just Transition re-skilling, or labour-market evidence..."
          disabled={isLoading}
          className="w-full bg-transparent resize-none border-none outline-hidden text-sm sm:text-base text-ink placeholder:text-muted-text/60 leading-relaxed max-h-44 overflow-y-auto"
        />
      </div>

      {/* Control Strip */}
      <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-line flex flex-wrap items-center justify-between gap-2.5 bg-surface-muted rounded-b-xl">
        {/* Left: Selectors and filters */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
          {/* Persona selector pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "persona" ? null : "persona")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-line bg-surface hover:bg-surface-muted text-xs font-semibold text-ink transition-colors shadow-2xs cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-gold" />
              <span>{currentPersona.title}</span>
              <ChevronDown className="w-3 h-3 text-muted-text" />
            </button>

            {openDropdown === "persona" && (
              <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-1.5 animate-rise-in">
                <span className="block px-2.5 py-1 eyebrow text-[10px]">
                  SYNTHESIS PERSONA
                </span>
                {MODEL_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onPersonaChange(p.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-[6px] text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                      persona === p.id
                        ? "bg-gold/15 text-gold font-bold"
                        : "hover:bg-surface-muted text-body"
                    }`}
                  >
                    <span>{p.title}</span>
                    <span className="text-[10px] text-muted-text font-normal line-clamp-1">
                      {p.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Horizon selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "time" ? null : "time")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-line bg-surface hover:bg-surface-muted text-xs font-semibold text-ink transition-colors shadow-2xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber" />
              <span>{currentTime.label}</span>
              <ChevronDown className="w-3 h-3 text-muted-text" />
            </button>

            {openDropdown === "time" && (
              <div className="absolute bottom-full left-0 mb-2 z-50 w-52 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-1.5 animate-rise-in">
                <span className="block px-2.5 py-1 eyebrow text-[10px]">
                  TIME HORIZON
                </span>
                {TIME_PERIOD_FILTERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onTimePeriodChange(t.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs transition-colors cursor-pointer ${
                      timePeriod === t.id
                        ? "bg-gold/15 text-gold font-bold"
                        : "hover:bg-surface-muted text-body"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reference Style selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "style" ? null : "style")}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-line bg-surface hover:bg-surface-muted text-xs font-semibold text-ink transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              <span>{currentStyle.title}</span>
              <ChevronDown className="w-3 h-3 text-muted-text" />
            </button>

            {openDropdown === "style" && (
              <div className="absolute bottom-full left-0 mb-2 z-50 w-56 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-1.5 animate-rise-in">
                <span className="block px-2.5 py-1 eyebrow text-[10px]">
                  REFERENCE STYLE
                </span>
                {REFERENCE_STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onReferenceStyleChange(s.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs transition-colors cursor-pointer ${
                      referenceStyle === s.id
                        ? "bg-gold/15 text-gold font-bold"
                        : "hover:bg-surface-muted text-body"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Submit Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="h-8 px-3.5 rounded-[6px] bg-navy text-white hover:bg-navy-soft text-xs font-bold gap-1.5 transition-colors disabled:opacity-40 shadow-2xs cursor-pointer"
          >
            <span>Ask merSIA</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIInput;
