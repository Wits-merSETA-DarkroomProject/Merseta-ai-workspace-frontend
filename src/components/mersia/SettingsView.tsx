import React, { useState } from "react";
import {
  Settings,
  UserCheck,
  BookOpen,
  Clock,
  Sun,
  Moon,
  RotateCcw,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  WorkspaceConfig,
  ModelPersonaId,
  ReferenceStyleId,
  TimePeriodFilterId,
  MODEL_PERSONAS,
  REFERENCE_STYLES,
  TIME_PERIOD_FILTERS,
  saveStoredConfig,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme, ThemeMode } from "@/lib/theme";
import { Button } from "@/components/ui/button";

interface SettingsViewProps {
  config: WorkspaceConfig;
  onUpdateConfig: (cfg: WorkspaceConfig) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  onResetData,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  const handleToggleTheme = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  const handleChangePersona = (persona: ModelPersonaId) => {
    const updated = { ...config, persona };
    onUpdateConfig(updated);
    saveStoredConfig(updated);
  };

  const handleChangeReferenceStyle = (referenceStyle: ReferenceStyleId) => {
    const updated = { ...config, referenceStyle };
    onUpdateConfig(updated);
    saveStoredConfig(updated);
  };

  const handleChangeTimePeriod = (timePeriodFilter: TimePeriodFilterId) => {
    const updated = { ...config, timePeriodFilter };
    onUpdateConfig(updated);
    saveStoredConfig(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Header */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-medium">
          <Settings className="w-3.5 h-3.5" />
          <span>RESEARCH PLATFORM CONFIGURATION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Workspace Preferences
        </h1>

        <p className="text-xs sm:text-sm text-muted-text leading-relaxed">
          Configure synthesis defaults, institutional citation formats, and display themes across
          all inquiries.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* 1. Default Persona */}
        <div className="p-6 rounded-xl border border-line bg-surface shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-ink">Default Analysis Persona</h3>
          </div>
          <p className="text-xs text-muted-text leading-relaxed">
            Select the default analytical posture assumed by merSIA when generating sector
            syntheses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {MODEL_PERSONAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChangePersona(p.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  config.persona === p.id
                    ? "border-gold bg-gold/10 text-gold font-semibold ring-1 ring-gold/20"
                    : "border-line bg-surface-muted hover:bg-surface-elevated text-ink"
                }`}
              >
                <div className="font-semibold text-ink">{p.title}</div>
                <div className="text-[11px] text-muted-text font-normal line-clamp-1 mt-0.5">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Reference Style */}
        <div className="p-6 rounded-xl border border-line bg-surface shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-ink">Citation & Reference Style</h3>
          </div>
          <p className="text-xs text-muted-text leading-relaxed">
            Choose the default academic referencing standard applied to in-text citations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {REFERENCE_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleChangeReferenceStyle(s.id)}
                className={`p-3 rounded-lg border text-center text-xs transition-all ${
                  config.referenceStyle === s.id
                    ? "border-gold bg-gold/10 text-gold font-semibold ring-1 ring-gold/20"
                    : "border-line bg-surface-muted hover:bg-surface-elevated text-ink"
                }`}
              >
                <div className="font-semibold text-ink">{s.title}</div>
                <div className="text-[10px] text-muted-text font-mono mt-0.5">
                  [{s.id}]
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Appearance & Theme */}
        <div className="p-6 rounded-xl border border-line bg-surface shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-semibold text-ink">Interface Theme</h3>
            </div>
            <p className="text-xs text-muted-text">
              Active mode: <strong className="capitalize text-ink">{theme}</strong> (Dark #0B1220 default / Paper #FBFAF7)
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleTheme}
            className="text-xs gap-1.5 border-line text-ink hover:bg-surface-muted"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-gold" /> : <Moon className="w-3.5 h-3.5 text-navy" />}
            <span>Toggle to {theme === "dark" ? "Light / Paper" : "Dark"}</span>
          </Button>
        </div>

        {/* 4. Reset Session Data */}
        <div className="p-6 rounded-xl border border-red-500/30 bg-surface shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-ink">Reset Prototype Cache</h3>
            <p className="text-xs text-muted-text">
              Restore default prototype inquiries, sample citations, and clear session cache.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={onResetData}
            className="text-xs gap-1.5 self-start sm:self-center bg-red-600 text-white hover:bg-red-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Prototype Default</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
