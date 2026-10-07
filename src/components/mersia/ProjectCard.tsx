import React, { useState } from "react";
import {
  MoreVertical,
  Star,
  Edit2,
  Copy,
  Trash2,
  Plus,
  ArrowRight,
  Layers,
  FileText,
  Calendar,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  ProjectItem,
  PROJECT_THEMES,
  WorkspaceItem,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";

interface ProjectCardProps {
  project: ProjectItem;
  workspaces: WorkspaceItem[];
  onSelectProject: (projectId: string) => void;
  onEditProject: (project: ProjectItem) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
  onCreateWorkspaceInProject: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  workspaces,
  onSelectProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onCreateWorkspaceInProject,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = PROJECT_THEMES[project.themeId] || PROJECT_THEMES["amber-gold"]!;

  // Count total unique documents across workspaces in this project
  const docIds = new Set<string>();
  workspaces.forEach((w) => {
    (w.sources || []).forEach((s) => docIds.add(s.id));
  });
  const totalDocsCount = docIds.size > 0 ? docIds.size : 5;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active Project",
          classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      case "planning":
        return {
          label: "Planning",
          classes: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          dot: "bg-sky-400",
        };
      case "review":
        return {
          label: "In Review",
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "archived":
      default:
        return {
          label: "Archived",
          classes: "bg-slate-500/15 text-slate-400 border-slate-500/30",
          dot: "bg-slate-400",
        };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  return (
    <div
      onClick={() => onSelectProject(project.id)}
      className={`group relative rounded-2xl border ${theme.borderGlow} bg-surface/80 hover:bg-surface backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-250 hover:shadow-xl hover:shadow-black/20 cursor-pointer overflow-hidden min-h-[260px]`}
    >
      {/* Top Gradient Banner Ambient Accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
      />

      {/* Decorative ambient corner glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none transition-all group-hover:opacity-30"
        style={{ backgroundColor: theme.accentHex }}
      />

      {/* Header Row: Insignia + Domain Tag + Star & Actions */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Custom Insignia Emblem (NO generic icon) */}
            <InsigniaEmblem
              code={project.iconCode}
              themeId={project.themeId}
              size="lg"
              showGlow={!!project.isFavorite}
              className="shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${theme.badgeBg}`}
                >
                  {project.domain}
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusInfo.classes}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>
              <p className="text-[11px] font-mono text-muted-text/80 mt-1 truncate">
                Horizon: {project.horizon}
              </p>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onToggleFavorite(project.id)}
              className={`p-1.5 rounded-full hover:bg-surface-muted transition-colors ${
                project.isFavorite ? "text-gold" : "text-muted-text/40 hover:text-muted-text"
              }`}
              title={project.isFavorite ? "Unstar project" : "Star project"}
            >
              <Star className={`w-4 h-4 ${project.isFavorite ? "fill-gold" : ""}`} />
            </button>

            {/* 3-dot dropdown menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-surface-muted text-muted-text hover:text-ink transition-colors"
                title="Project Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-52 rounded-xl border border-line bg-surface-elevated p-1.5 shadow-2xl z-50 animate-in fade-in space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onCreateWorkspaceInProject(project.id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left font-medium"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold" />
                      <span>New Workspace inside</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEditProject(project);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-muted-text" />
                      <span>Customize Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDuplicateProject(project.id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-ink hover:bg-surface-muted rounded-lg text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-text" />
                      <span>Duplicate Project</span>
                    </button>
                    <div className="my-1 border-t border-line-soft" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDeleteProject(project.id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Project Name & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-gold transition-colors tracking-tight line-clamp-1">
            {project.name}
          </h3>
          <p className="text-xs text-muted-text line-clamp-2 leading-relaxed font-normal">
            {project.description}
          </p>
        </div>

        {/* Target Chambers tags */}
        {project.targetChambers && project.targetChambers.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.targetChambers.slice(0, 3).map((ch, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface-muted/70 text-[10px] font-mono text-muted-text border border-line-soft"
              >
                {ch}
              </span>
            ))}
            {project.targetChambers.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-surface-muted text-[10px] font-mono text-muted-text">
                +{project.targetChambers.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats Row: Workspaces count + Documents count + Drilldown CTA */}
      <div className="pt-4 mt-4 border-t border-line-soft/60 flex items-center justify-between text-xs text-muted-text">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-ink font-semibold">
            <Layers className="w-3.5 h-3.5 text-gold" />
            <span>
              {workspaces.length} {workspaces.length === 1 ? "Workspace" : "Workspaces"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-text">
            <FileText className="w-3.5 h-3.5 text-muted-text/80" />
            <span>{totalDocsCount} Sources</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gold font-medium group-hover:translate-x-1 transition-transform">
          <span className="text-[11px]">Open Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
