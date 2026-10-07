import React, { useState } from "react";
import { X, ArrowRightLeft, Check, Layers } from "lucide-react";
import {
  WorkspaceItem,
  ProjectItem,
  moveWorkspaceToProject,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";

interface MoveWorkspaceModalProps {
  isOpen: boolean;
  workspace: WorkspaceItem | null;
  projects: ProjectItem[];
  onClose: () => void;
  onMoved: () => void;
}

export const MoveWorkspaceModal: React.FC<MoveWorkspaceModalProps> = ({
  isOpen,
  workspace,
  projects,
  onClose,
  onMoved,
}) => {
  const [targetProjectId, setTargetProjectId] = useState(
    workspace?.projectId || projects[0]?.id || ""
  );

  if (!isOpen || !workspace) return null;

  const handleMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId) return;

    moveWorkspaceToProject(workspace.id, targetProjectId);
    onMoved();
    onClose();
  };

  const currentProject = projects.find((p) => p.id === workspace.projectId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface-elevated p-6 shadow-2xl space-y-5 animate-rise-in">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-navy text-gold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink">
              Move Workspace to Project
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-text hover:text-ink hover:bg-surface-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl border border-line-soft bg-surface-muted/40 space-y-1">
          <p className="text-xs font-semibold text-ink truncate">
            {workspace.title}
          </p>
          <p className="text-[11px] text-muted-text">
            Currently in:{" "}
            <span className="text-gold font-medium">
              {currentProject?.name || "Unassigned"}
            </span>
          </p>
        </div>

        <form onSubmit={handleMove} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">
              Select Destination Project
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = targetProjectId === proj.id;
                const isCurrent = workspace.projectId === proj.id;
                return (
                  <label
                    key={proj.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/10 shadow-xs"
                        : "border-line-soft bg-surface hover:bg-surface-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="destProject"
                      value={proj.id}
                      checked={isSelected}
                      onChange={() => setTargetProjectId(proj.id)}
                      className="sr-only"
                    />
                    <InsigniaEmblem
                      code={proj.iconCode}
                      themeId={proj.themeId}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink truncate">
                        {proj.name}
                      </p>
                      <p className="text-[10px] font-mono text-muted-text">
                        {proj.domain} {isCurrent ? "· Current Parent" : ""}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                  </label>
                );
              })}
            </div>
          </div>

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
              disabled={targetProjectId === workspace.projectId}
              className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-semibold transition-all border border-line-soft shadow-md disabled:opacity-50 cursor-pointer"
            >
              Move Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
