import React, { useState, useEffect } from "react";
import {
  X,
  Edit2,
  Check,
  FileText,
  Layers,
  Sparkles,
  Building2,
} from "lucide-react";
import {
  WorkspaceItem,
  ProjectItem,
  ModelPersonaId,
  MODEL_PERSONAS,
  INSIGNIA_OPTIONS,
  PROTOTYPE_DOCUMENTS,
  updateStoredWorkspace,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";

interface CustomizeWorkspaceModalProps {
  isOpen: boolean;
  workspace: WorkspaceItem | null;
  projects: ProjectItem[];
  onClose: () => void;
  onWorkspaceUpdated: (updatedWorkspace: WorkspaceItem) => void;
}

export const CustomizeWorkspaceModal: React.FC<
  CustomizeWorkspaceModalProps
> = ({ isOpen, workspace, projects, onClose, onWorkspaceUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [category, setCategory] = useState<
    "Research" | "Philosophy" | "Cognitive Systems" | "Design" | "General"
  >("Research");
  const [insignia, setInsignia] = useState("vocational-shield");
  const [persona, setPersona] = useState<ModelPersonaId>("policy-analyst");
  const [groundingMode, setGroundingMode] = useState<
    "strict-corpus" | "balanced" | "exploratory"
  >("strict-corpus");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [targetNQFLevel, setTargetNQFLevel] = useState("NQF Level 4-6");
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (workspace) {
      setTitle(workspace.title);
      setDescription(workspace.description);
      setProjectId(workspace.projectId || projects[0]?.id || "");
      setCategory(workspace.category);
      setInsignia(workspace.customization?.insignia || "vocational-shield");
      setPersona(workspace.config?.persona || "policy-analyst");
      setGroundingMode(workspace.customization?.groundingMode || "strict-corpus");
      setSystemInstructions(workspace.customization?.systemInstructions || "");
      setTargetNQFLevel(
        workspace.customization?.targetNQFLevel || "NQF Level 4-6"
      );
      setSelectedDocIds(new Set((workspace.sources || []).map((s) => s.id)));
    }
  }, [workspace, projects]);

  if (!isOpen || !workspace) return null;

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenSources = PROTOTYPE_DOCUMENTS.filter((d) =>
      selectedDocIds.has(d.id)
    );

    const targetProjectId =
      projectId || workspace.projectId || "proj-national-skills";

    const updated = updateStoredWorkspace(workspace.id, {
      title: title.trim(),
      description: description.trim(),
      projectId: targetProjectId,
      category,
      customization: {
        insignia,
        themeId:
          currentProject?.themeId ||
          workspace.customization?.themeId ||
          "amber-gold",
        systemInstructions: systemInstructions.trim() || undefined,
        groundingMode,
        targetNQFLevel,
      },
      sources: chosenSources.length > 0 ? chosenSources : workspace.sources,
      config: {
        ...(workspace.config || {
          referenceStyle: "in-depth",
          responseStyle: "in-depth",
          showReferences: true,
          showReasoningTrace: true,
          timePeriodFilter: "all",
        }),
        persona,
      },
    });

    if (updated) {
      onWorkspaceUpdated(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-line bg-surface-elevated p-6 sm:p-8 shadow-2xl space-y-6 animate-rise-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line-soft pb-4">
          <div className="flex items-center gap-3">
            <InsigniaEmblem
              code={insignia}
              themeId={currentProject?.themeId || "amber-gold"}
              size="md"
              showGlow
            />
            <div>
              <h2 className="text-lg font-bold text-ink tracking-tight">
                Customize Research Workspace
              </h2>
              <p className="text-xs text-muted-text">
                Configure parent project, grounding documents, insignia crest, and
                AI persona directives.
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
          {/* Parent Project Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">
              Parent Sector Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  📁 {p.name} ({p.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Workspace Title & Description */}
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Workspace Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50 focus:bg-surface transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Research Focus & Context
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50 focus:bg-surface transition-all resize-none"
              />
            </div>
          </div>

          {/* 3-Column Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Domain Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
              >
                <option value="Research">Research & Empirical</option>
                <option value="Philosophy">Just Transition & JET</option>
                <option value="Cognitive Systems">Labour Dynamics</option>
                <option value="Design">Automotive & 4.0</option>
                <option value="General">General Inquiries</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Default Persona
              </label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as ModelPersonaId)}
                className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
              >
                {MODEL_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Target NQF Band
              </label>
              <select
                value={targetNQFLevel}
                onChange={(e) => setTargetNQFLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
              >
                <option value="NQF Level 2-3 (Pre-Trade)">NQF Level 2-3</option>
                <option value="NQF Level 4-6 (Artisans & Technicians)">
                  NQF Level 4-6 (Artisans)
                </option>
                <option value="NQF Level 7+ (Engineers & Specialists)">
                  NQF Level 7+ (Engineers)
                </option>
                <option value="All NQF Bands">All NQF Bands</option>
              </select>
            </div>
          </div>

          {/* Insignia Emblem Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink block">
              Workspace Insignia Emblem (Custom Vector Crest)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-36 overflow-y-auto p-2 rounded-xl border border-line-soft bg-surface-muted/30">
              {INSIGNIA_OPTIONS.map((ins) => {
                const isSelected = insignia === ins.code;
                return (
                  <button
                    key={ins.code}
                    type="button"
                    onClick={() => setInsignia(ins.code)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/15 shadow-sm"
                        : "border-line-soft hover:border-gold/40 hover:bg-surface-muted"
                    }`}
                  >
                    <InsigniaEmblem
                      code={ins.code}
                      themeId={currentProject?.themeId || "amber-gold"}
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

          {/* Custom AI System Prompt Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center justify-between">
              <span>Custom AI Reasoning Directive</span>
              <span className="text-[10px] font-mono text-muted-text">
                Active in chat inference
              </span>
            </label>
            <input
              type="text"
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              placeholder="e.g. Always emphasize Mpumalanga coal decommissioning timelines and 6-9 month micro-credentials."
              className="w-full h-9 px-3.5 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
            />
          </div>

          {/* Grounding Sources Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink">
                Attached Grounding Sources ({selectedDocIds.size} Selected)
              </label>
              <button
                type="button"
                onClick={() => {
                  if (selectedDocIds.size === PROTOTYPE_DOCUMENTS.length) {
                    setSelectedDocIds(new Set([PROTOTYPE_DOCUMENTS[0]!.id]));
                  } else {
                    setSelectedDocIds(
                      new Set(PROTOTYPE_DOCUMENTS.map((d) => d.id))
                    );
                  }
                }}
                className="text-[11px] font-mono text-gold hover:underline"
              >
                {selectedDocIds.size === PROTOTYPE_DOCUMENTS.length
                  ? "Select single"
                  : "Select all"}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-line-soft rounded-xl p-2 bg-surface-muted/30">
              {PROTOTYPE_DOCUMENTS.map((doc) => {
                const isChecked = selectedDocIds.has(doc.id);
                return (
                  <label
                    key={doc.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-muted text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const next = new Set(selectedDocIds);
                        if (isChecked) {
                          if (next.size > 1) next.delete(doc.id);
                        } else {
                          next.add(doc.id);
                        }
                        setSelectedDocIds(next);
                      }}
                      className="rounded border-line-soft text-gold focus:ring-gold"
                    />
                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                      <span className="truncate text-ink font-medium">
                        {doc.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-text shrink-0">
                        {doc.year} · {doc.pageCount}p
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
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
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-semibold transition-all border border-line-soft shadow-md hover:shadow-navy/20 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-gold" />
              <span>Save Workspace Customization</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
