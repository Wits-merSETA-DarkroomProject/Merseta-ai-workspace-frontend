import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Copy,
  Trash2,
  Building2,
  Calendar,
  Layers,
  FileText,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  ProjectItem,
  WorkspaceItem,
  PROJECT_THEMES,
} from "@/lib/workspace-store";
import { InsigniaEmblem } from "./InsigniaEmblem";
import { WorkspaceCard } from "./WorkspaceCard";

interface ProjectDetailViewProps {
  project: ProjectItem;
  workspaces: WorkspaceItem[];
  allProjects: ProjectItem[];
  onBack: () => void;
  onOpenWorkspace: (workspaceId: string) => void;
  onCreateWorkspaceInProject: (projectId: string) => void;
  onCustomizeWorkspace: (workspace: WorkspaceItem) => void;
  onMoveWorkspaceToProject: (workspace: WorkspaceItem) => void;
  onDuplicateWorkspace: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onToggleStarWorkspace: (workspaceId: string, e: React.MouseEvent) => void;
  onEditProject: (project: ProjectItem) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleFavoriteProject: (projectId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  workspaces,
  allProjects,
  onBack,
  onOpenWorkspace,
  onCreateWorkspaceInProject,
  onCustomizeWorkspace,
  onMoveWorkspaceToProject,
  onDuplicateWorkspace,
  onDeleteWorkspace,
  onToggleStarWorkspace,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavoriteProject,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const theme = PROJECT_THEMES[project.themeId] || PROJECT_THEMES["amber-gold"]!;

  // Collect unique documents across this project's workspaces
  const docIds = new Set<string>();
  workspaces.forEach((w) => {
    (w.sources || []).forEach((s) => docIds.add(s.id));
  });
  const totalDocsCount = docIds.size > 0 ? docIds.size : 5;

  const filteredWorkspaces = workspaces.filter(
    (ws) =>
      ws.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
    <div className="space-y-8 animate-rise-in select-none pb-12">
      {/* 1. BACK NAVIGATION & BREADCRUMB */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line-soft bg-surface-muted/50 hover:bg-surface-muted hover:text-ink text-xs font-medium text-muted-text transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Projects & Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavoriteProject(project.id)}
            className={`p-2 rounded-full border border-line-soft hover:bg-surface-muted transition-colors ${
              project.isFavorite ? "text-gold" : "text-muted-text/40 hover:text-muted-text"
            }`}
            title={project.isFavorite ? "Unstar project" : "Star project"}
          >
            <Star className={`w-4 h-4 ${project.isFavorite ? "fill-gold" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => onEditProject(project)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line-soft hover:border-gold/50 bg-surface-muted text-xs font-medium text-ink hover:text-gold transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-muted-text" />
            <span>Customize Project</span>
          </button>

          <button
            type="button"
            onClick={() => onDuplicateProject(project.id)}
            className="p-2 rounded-xl border border-line-soft hover:bg-surface-muted text-muted-text hover:text-ink transition-colors cursor-pointer"
            title="Duplicate Project"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteProject(project.id)}
            className="p-2 rounded-xl border border-line-soft hover:bg-red-500/10 text-muted-text hover:text-red-400 transition-colors cursor-pointer"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. PROJECT HERO BANNER */}
      <div
        className={`relative rounded-3xl border ${theme.borderGlow} bg-surface/90 backdrop-blur-md p-6 sm:p-8 overflow-hidden shadow-xl`}
      >
        {/* Top Gradient Banner Ambient Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${theme.gradient}`}
        />

        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.accentHex }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Insignia + Details */}
          <div className="flex items-start gap-4 sm:gap-6 min-w-0">
            <InsigniaEmblem
              code={project.iconCode}
              themeId={project.themeId}
              size="xl"
              showGlow={!!project.isFavorite}
              className="shrink-0 scale-105"
            />

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold border ${theme.badgeBg}`}
                >
                  {project.domain}
                </span>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${statusInfo.classes}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
                  <span>{statusInfo.label}</span>
                </div>

                <span className="text-[11px] font-mono text-muted-text/90">
                  Horizon: {project.horizon}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-ink tracking-tight">
                {project.name}
              </h1>

              <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
                {project.description}
              </p>

              {/* Chambers Covered */}
              {project.targetChambers && project.targetChambers.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-mono text-muted-text/80 mr-1">
                    CHAMBERS:
                  </span>
                  {project.targetChambers.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-mono text-muted-text border border-line-soft"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Action to create workspace inside this project */}
          <div className="flex flex-row lg:flex-col items-stretch justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-line-soft">
            <button
              type="button"
              onClick={() => onCreateWorkspaceInProject(project.id)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs sm:text-sm font-semibold transition-all border border-line-soft shadow-lg hover:shadow-navy/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>New Workspace</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-muted-text px-2">
              <span className="text-ink font-semibold">
                {workspaces.length} {workspaces.length === 1 ? "Notebook" : "Notebooks"}
              </span>
              <span>·</span>
              <span className="text-gold font-medium">{totalDocsCount} Sources</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WORKSPACES CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
        <div>
          <h2 className="text-base font-bold text-ink">
            Project Workspaces & Research Notebooks
          </h2>
          <p className="text-xs text-muted-text">
            All inquiry notebooks configured with evidence grounding for this project.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-text" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search workspaces in project..."
              className="w-full h-8 pl-8 pr-3 rounded-full border border-line-soft bg-surface-muted/50 text-xs text-ink placeholder:text-muted-text/50 outline-hidden focus:border-gold/50 focus:bg-surface"
            />
          </div>

          <div className="flex items-center rounded-full border border-line-soft p-0.5 bg-surface-muted/40 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "grid" ? "bg-surface text-ink" : "text-muted-text hover:text-ink"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "list" ? "bg-surface text-ink" : "text-muted-text hover:text-ink"
              }`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. WORKSPACES DISPLAY */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Create Blank Card */}
          <button
            type="button"
            onClick={() => onCreateWorkspaceInProject(project.id)}
            className="group relative h-52 rounded-2xl border-2 border-dashed border-line-soft hover:border-gold/50 bg-surface/30 hover:bg-surface/60 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-surface-muted group-hover:bg-gold/15 group-hover:scale-105 border border-line-soft flex items-center justify-center transition-all">
              <Plus className="w-5 h-5 text-muted-text group-hover:text-gold transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink group-hover:text-gold transition-colors">
                Create Workspace in Project
              </p>
              <p className="text-[11px] text-muted-text mt-0.5">
                Launch a fresh synthesis grounded in this project's mandate
              </p>
            </div>
          </button>

          {/* Project Workspaces Cards */}
          {filteredWorkspaces.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              parentProject={project}
              onOpen={onOpenWorkspace}
              onCustomize={onCustomizeWorkspace}
              onMoveToProject={onMoveWorkspaceToProject}
              onDuplicate={onDuplicateWorkspace}
              onDelete={onDeleteWorkspace}
              onToggleStar={onToggleStarWorkspace}
              showParentProjectBadge={false}
            />
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="rounded-2xl border border-line-soft bg-surface/50 divide-y divide-line-soft overflow-hidden">
          {filteredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => onOpenWorkspace(ws.id)}
              className="group flex items-center justify-between p-4 hover:bg-surface-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <InsigniaEmblem
                  code={
                    ws.customization?.insignia ||
                    project.iconCode ||
                    "vocational-shield"
                  }
                  themeId={project.themeId}
                  size="sm"
                />

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-ink group-hover:text-gold transition-colors truncate">
                    {ws.title}
                  </h3>
                  <p className="text-[11px] text-muted-text truncate">
                    {ws.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs text-muted-text font-mono">
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-surface-muted text-[10px]">
                  {ws.category}
                </span>
                <span className="text-gold font-medium">
                  {ws.sources?.length || 5} sources
                </span>
                <span className="text-[11px] text-muted-text/70">{ws.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredWorkspaces.length === 0 && (
        <div className="rounded-2xl border border-line-soft bg-surface/40 p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center text-muted-text">
            <Layers className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">
              No Workspaces Created in this Project
            </h3>
            <p className="text-xs text-muted-text mt-1 max-w-sm mx-auto">
              Add your first research workspace to begin synthesis and evidence inquiry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCreateWorkspaceInProject(project.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-soft transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            <span>Create First Workspace</span>
          </button>
        </div>
      )}
    </div>
  );
};
