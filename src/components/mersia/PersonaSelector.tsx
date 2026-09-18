import React from "react";
import { MODEL_PERSONAS, ModelPersonaId } from "@/lib/workspace-store";
import { Check, ShieldCheck, Microscope, BarChart3, GraduationCap } from "lucide-react";

interface PersonaSelectorProps {
  selectedPersona: ModelPersonaId;
  onSelectPersona: (id: ModelPersonaId) => void;
  className?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
  className = "",
}) => {
  const getPersonaIcon = (id: ModelPersonaId) => {
    switch (id) {
      case "policy-analyst":
        return <ShieldCheck className="w-4 h-4 text-[#1D3557]" />;
      case "researcher":
        return <Microscope className="w-4 h-4 text-[#1D3557]" />;
      case "data-scientist":
        return <BarChart3 className="w-4 h-4 text-[#A86F1C]" />;
      case "educator":
        return <GraduationCap className="w-4 h-4 text-[#2F755B]" />;
      default:
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-amber font-semibold">
          RESEARCH SYNTHESIS PERSONA
        </span>
        <span className="text-[11px] font-mono text-muted-text">4 Analytical Lenses</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {MODEL_PERSONAS.map((persona) => {
          const isSelected = selectedPersona === persona.id;

          return (
            <div
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? "border-gold bg-surface-muted shadow-2xs ring-1 ring-gold/40"
                  : "border-line bg-surface hover:border-gold/40 hover:bg-surface-muted"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-surface-elevated border border-line">{getPersonaIcon(persona.id)}</div>
                  <div>
                    <h4 className="text-xs font-semibold text-ink tracking-tight">
                      {persona.title}
                    </h4>
                    <span className="text-[10px] font-mono text-muted-text">
                      {persona.badge}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gold text-canvas flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-canvas font-bold" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-muted-text leading-relaxed">
                {persona.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;
