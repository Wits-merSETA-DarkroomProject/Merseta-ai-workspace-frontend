import React, { useState } from "react";
import {
  MoreVertical,
  Star,
  Edit2,
  Copy,
  Trash2,
  FileText,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import {
  WorkspaceItem,
  ProjectItem,
  PROJECT_THEMES,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";

interface WorkspaceCardProps {
  workspace: WorkspaceItem;
  parentProject?: (ProjectItem | null) | undefined;
  onOpen: (workspaceId: string) => void;
  onCustomize: (workspace: WorkspaceItem) => void;
  onMoveToProject: (workspace: WorkspaceItem) => void;
  onDuplicate: (workspaceId: string) => void;
  onDelete: (workspaceId: string) => void;
  onToggleStar: (workspaceId: string, e: React.MouseEvent) => void;
  showParentProjectBadge?: boolean | undefined;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  parentProject,
  onOpen,
  onCustomize,
  onMoveToProject,
  onDuplicate,
  onDelete,
  onToggleStar,
  showParentProjectBadge = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive theme and insignia from workspace customization or fallback
  const themeId =
    workspace.customization?.themeId || parentProject?.themeId || "amber-gold";
  const theme = PROJECT_THEMES[themeId] || PROJECT_THEMES["amber-gold"]!;
  const insigniaCode =
    workspace.customization?.insignia ||
    parentProject?.iconCode ||
    "vocational-shield";

  return (
    <div
      onClick={() => onOpen(workspace.id)}
      className="group relative rounded-2xl border border-line-soft hover:border-gold/40 bg-surface/70 hover:bg-surface backdrop-blur-xs p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/15 cursor-pointer overflow-hidden min-h-[210px]"
    >
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      {/* Top Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Custom Insignia Emblem for Workspace */}
            <InsigniaEmblem
              code={insigniaCode}
              themeId={themeId}
              size="sm"
              className="shrink-0 group-hover:scale-105 transition-transform"
            />

            <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-surface-muted text-[10px] font-mono uppercase tracking-wider text-muted-text group-hover:text-gold transition-colors font-medium border border-line-soft">
                {workspace.category}
              </span>

              {showParentProjectBadge && parentProject && (
                <span className="px-2 py-0.5 rounded-full bg-surface-muted/60 text-[10px] font-mono text-ink/70 border border-line-soft truncate max-w-[130px]">
                  📁 {parentProject.name}
                </span>
              )}
            </div>
          </div>

          {/* Star & Actions */}
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => onToggleStar(workspace.id, e)}
              className={`p-1.5 rounded-full hover:bg-surface-muted transition-colors ${
                workspace.isFavorite
                  ? "text-gold"
                  : "text-muted-text/40 hover:text-muted-text"
              }`}
              title={workspace.isFavorite ? "Unstar notebook" : "Star notebook"}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  workspace.isFavorite ? "fill-gold" : ""
                }`}
              />
            </button>

            {/* 3-dot dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-surface-muted text-muted-text hover:text-ink transition-colors"
                title="Workspace actions"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 rounded-xl border border-line bg-surface-elevated p-1 shadow-2xl z-50 animate-in fade-in space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onCustomize(workspace);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gold" />
                      <span>Customize Workspace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onMoveToProject(workspace);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-muted-text" />
                      <span>Move to Project...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDuplicate(workspace.id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-text" />
                      <span>Duplicate</span>
                    </button>
                    <div className="my-1 border-t border-line-soft" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete(workspace.id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Workspace</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-semibold text-ink group-hover:text-gold transition-colors line-clamp-1">
            {workspace.title}
          </h3>
          <p className="text-xs text-muted-text line-clamp-2 leading-relaxed font-normal">
            {workspace.description}
          </p>
        </div>

        {/* Custom Grounding Indicator & Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {workspace.customization?.targetNQFLevel && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted text-muted-text border border-line-soft">
              {workspace.customization.targetNQFLevel}
            </span>
          )}
          {workspace.config?.persona && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
              {workspace.config.persona}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-line-soft/50 text-[11px] text-muted-text font-mono">
        <div className="flex items-center gap-1.5 text-gold font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>{workspace.sources?.length || 5} sources</span>
        </div>
        <div className="flex items-center gap-1 text-muted-text/70">
          <span>{workspace.updatedAt}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:text-ink transition-all" />
        </div>
      </div>
    </div>
  );
};
