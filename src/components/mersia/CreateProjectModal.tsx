import React, { useState } from "react";
import {
  X,
  Plus,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Palette,
  Check,
} from "lucide-react";
import {
  ProjectDomain,
  ProjectStatus,
  PROJECT_THEMES,
  INSIGNIA_OPTIONS,
  createStoredProject,
  createStoredWorkspace,
  PROTOTYPE_DOCUMENTS,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProjectId: string) => void;
}

const AVAILABLE_CHAMBERS = [
  "Metal & Engineering",
  "Automotive",
  "Plastics",
  "Auto Components",
  "Energy & Renewables",
  "Mining & Heavy Electrical",
  "New Technologies & Electronics",
  "TVET Colleges & CET",
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<ProjectDomain>("TVET & Qualifications");
  const [themeId, setThemeId] = useState("amber-gold");
  const [iconCode, setIconCode] = useState("tvet-compass");
  const [horizon, setHorizon] = useState("2024–2026 Statutory");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [leadAnalyst, setLeadAnalyst] = useState("merSETA Intelligence Unit");
  const [selectedChambers, setSelectedChambers] = useState<Set<string>>(
    new Set(["Metal & Engineering", "Automotive"])
  );
  const [createInitialWorkspace, setCreateInitialWorkspace] = useState(true);
  const [initialWorkspaceTitle, setInitialWorkspaceTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj = createStoredProject({
      name: name.trim(),
      description:
        description.trim() ||
        "Sector intelligence project focusing on industrial and TVET research.",
      domain,
      themeId,
      iconCode,
      horizon,
      status,
      leadAnalyst: leadAnalyst.trim() || "merSETA Analyst",
      targetChambers: Array.from(selectedChambers),
      tags: [domain, horizon],
    });

    if (createInitialWorkspace) {
      createStoredWorkspace({
        projectId: newProj.id,
        title:
          initialWorkspaceTitle.trim() ||
          `${name.trim()} Synthesis & Evidence Notebook`,
        description: `Primary research and evidence workspace for ${name.trim()}.`,
        category:
          domain === "Just Transition"
            ? "Philosophy"
            : domain === "Labour Dynamics"
            ? "Cognitive Systems"
            : domain === "Automotive 4.0"
            ? "Design"
            : "Research",
        customization: {
          insignia: iconCode,
          themeId: themeId,
          groundingMode: "strict-corpus",
          targetNQFLevel: "NQF Level 4-6",
        },
        sources: PROTOTYPE_DOCUMENTS,
      });
    }

    onClose();
    onProjectCreated(newProj.id);
  };

  const toggleChamber = (ch: string) => {
    const next = new Set(selectedChambers);
    if (next.has(ch)) next.delete(ch);
    else next.add(ch);
    setSelectedChambers(next);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-line bg-surface-elevated p-6 sm:p-8 shadow-2xl space-y-6 animate-rise-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line-soft pb-4">
          <div className="flex items-center gap-3">
            <InsigniaEmblem
              code={iconCode}
              themeId={themeId}
              size="md"
              showGlow
            />
            <div>
              <h2 className="text-lg font-bold text-ink tracking-tight">
                Create Sector Project
              </h2>
              <p className="text-xs text-muted-text">
                Group and manage dedicated intelligence workspaces under an
                institutional initiative.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-text hover:text-ink hover:bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name & Description */}
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <span>Project Name</span>
                <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. National Artisan Pipeline & TVET Diagnostics 2026"
                className="w-full h-10 px-3.5 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50 focus:bg-surface transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Project Strategic Scope & Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key sectoral mandate, research objectives, and targeted occupational shifts..."
                className="w-full p-3 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50 focus:bg-surface transition-all resize-none"
              />
            </div>
          </div>

          {/* 2-Column Selectors: Domain & Horizon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Sector Domain Pillar
              </label>
              <select
                value={domain}
                onChange={(e) => {
                  const d = e.target.value as ProjectDomain;
                  setDomain(d);
                  if (d === "Just Transition") {
                    setThemeId("emerald-teal");
                    setIconCode("energy-horizon");
                  } else if (d === "Automotive 4.0") {
                    setThemeId("sapphire-cyan");
                    setIconCode("mechatronic-pulse");
                  } else if (d === "Labour Dynamics") {
                    setThemeId("amethyst-purple");
                    setIconCode("labour-dynamics");
                  } else if (d === "TVET & Qualifications") {
                    setThemeId("amber-gold");
                    setIconCode("tvet-compass");
                  }
                }}
                className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
              >
                <option value="TVET & Qualifications">
                  TVET & Qualifications
                </option>
                <option value="Just Transition">
                  Just Energy Transition (JET)
                </option>
                <option value="Labour Dynamics">
                  Labour Market Dynamics & ELMA
                </option>
                <option value="Automotive 4.0">
                  Automotive 4.0 & Advanced Manufacturing
                </option>
                <option value="Research">
                  Empirical Research & Longitudinal Analysis
                </option>
                <option value="Strategic Policy">
                  National Statutory Policy & SETA Levers
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Planning Horizon
              </label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
              >
                <option value="2024–2026 Statutory">2024–2026 Statutory</option>
                <option value="2024–2030 Roadmap Horizon">
                  2024–2030 Roadmap Horizon
                </option>
                <option value="2025–2030 Strategy">2025–2030 Strategy</option>
                <option value="Longitudinal 2018–2026">
                  Longitudinal 2018–2026
                </option>
                <option value="Annual Operational 2026">
                  Annual Operational 2026
                </option>
              </select>
            </div>
          </div>

          {/* Insignia Emblem Selector (NO generic icons) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink block">
              Project Insignia Emblem (Custom Sector Vector Crest)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-44 overflow-y-auto p-2 rounded-xl border border-line-soft bg-surface-muted/30">
              {INSIGNIA_OPTIONS.map((ins) => {
                const isSelected = iconCode === ins.code;
                return (
                  <button
                    key={ins.code}
                    type="button"
                    onClick={() => setIconCode(ins.code)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/15 shadow-sm scale-102"
                        : "border-line-soft hover:border-gold/40 hover:bg-surface-muted"
                    }`}
                  >
                    <InsigniaEmblem
                      code={ins.code}
                      themeId={themeId}
                      size="sm"
                    />
                    <span className="text-[10px] font-mono text-ink text-center leading-tight truncate w-full">
                      {ins.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Palette Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink block">
              Visual Theme Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(PROJECT_THEMES).map((th) => {
                const isSelected = themeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setThemeId(th.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? `border-gold bg-surface font-semibold shadow-xs`
                        : `border-line-soft hover:border-line bg-surface-muted/40 text-muted-text`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: th.accentHex }}
                      />
                      <span className="text-ink text-[11px]">{th.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Chambers */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink block">
              Target Industrial Chambers & Focus ({selectedChambers.size}{" "}
              Selected)
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-line-soft bg-surface-muted/30">
              {AVAILABLE_CHAMBERS.map((ch) => {
                const isSelected = selectedChambers.has(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChamber(ch)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white font-semibold border border-gold/40 shadow-xs"
                        : "bg-surface text-muted-text border border-line-soft hover:text-ink"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Workspace Setup */}
          <div className="p-3.5 rounded-xl border border-line-soft bg-surface-muted/50 space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={createInitialWorkspace}
                onChange={(e) => setCreateInitialWorkspace(e.target.checked)}
                className="rounded border-line-soft text-gold focus:ring-gold"
              />
              <span>
                Automatically create initial Research Notebook inside this
                project
              </span>
            </label>

            {createInitialWorkspace && (
              <input
                type="text"
                value={initialWorkspaceTitle}
                onChange={(e) => setInitialWorkspaceTitle(e.target.value)}
                placeholder="Initial workspace title (defaults to project synthesis)"
                className="w-full h-8 px-3 rounded-lg border border-line-soft bg-surface text-xs text-ink outline-hidden focus:border-gold/50"
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line-soft">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-line-soft hover:bg-surface-muted text-xs font-medium text-muted-text hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-semibold transition-all border border-line-soft shadow-md hover:shadow-navy/20 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
