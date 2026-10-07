import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Star,
  BookOpen,
  FileText,
  Trash2,
  Copy,
  Edit2,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowRight,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Check,
  FolderPlus,
  Layers,
  Building2,
  Calendar,
  RotateCcw,
  Eye,
  Tag,
  ArrowRightLeft,
} from "lucide-react";
import {
  ProjectItem,
  WorkspaceItem,
  Source,
  SavedAnswer,
  CitationItem,
  UserSession,
  PROTOTYPE_DOCUMENTS,
  getStoredUser,
  setStoredUser,
  getStoredProjects,
  saveStoredProjects,
  getStoredProject,
  deleteStoredProject,
  duplicateStoredProject,
  toggleFavoriteProject,
  getStoredWorkspaces,
  createStoredWorkspace,
  updateStoredWorkspace,
  deleteStoredWorkspace,
  duplicateStoredWorkspace,
  toggleFavoriteWorkspace,
  getWorkspacesByProject,
  resetWorkspacesToDefault,
  getStoredSavedAnswers,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";
import { InstitutionBranding } from "./InstitutionBranding";
import { InsigniaEmblem } from "./InsigniaEmblem";
import { ProjectCard } from "./ProjectCard";
import { WorkspaceCard } from "./WorkspaceCard";
import { ProjectDetailView } from "./ProjectDetailView";
import { CreateProjectModal } from "./CreateProjectModal";
import { EditProjectModal } from "./EditProjectModal";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { CustomizeWorkspaceModal } from "./CustomizeWorkspaceModal";
import { MoveWorkspaceModal } from "./MoveWorkspaceModal";
import { DocumentViewerModal } from "./DocumentViewerModal";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { SearchDialog } from "./SearchDialog";

export const WorkspaceHub: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Navigation state
  const [primaryTab, setPrimaryTab] = useState<
    "projects" | "all-workspaces" | "documents"
  >("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [projectDomainFilter, setProjectDomainFilter] = useState<string>("all");
  const [workspaceCategoryFilter, setWorkspaceCategoryFilter] =
    useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Project Modals
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Workspace Modals
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceDefaultProjectId, setWorkspaceDefaultProjectId] = useState<
    string | undefined
  >(undefined);
  const [customizingWorkspace, setCustomizingWorkspace] =
    useState<WorkspaceItem | null>(null);
  const [movingWorkspace, setMovingWorkspace] = useState<WorkspaceItem | null>(
    null
  );

  // Document Management & Viewer Modal
  const [corpusDocuments, setCorpusDocuments] =
    useState<Source[]>(PROTOTYPE_DOCUMENTS);
  const [activeViewerCitation, setActiveViewerCitation] =
    useState<CitationItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docYearFilter, setDocYearFilter] = useState("all");

  // Global Search Dialog
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // User Dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);
    setProjects(getStoredProjects());
    setWorkspaces(getStoredWorkspaces());
    setTheme(getStoredTheme());

    const handleProjectsUpdate = () => setProjects(getStoredProjects());
    const handleWsUpdate = () => setWorkspaces(getStoredWorkspaces());

    window.addEventListener("mersia_projects_updated", handleProjectsUpdate);
    window.addEventListener("mersia_workspaces_updated", handleWsUpdate);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchDialogOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "mersia_projects_updated",
        handleProjectsUpdate
      );
      window.removeEventListener("mersia_workspaces_updated", handleWsUpdate);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleToggleTheme = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  const handleSignOut = () => {
    setStoredUser(null);
    navigate({ to: "/login" });
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset projects and research notebooks to default statutory configuration?"
      )
    ) {
      resetWorkspacesToDefault();
      setProjects(getStoredProjects());
      setWorkspaces(getStoredWorkspaces());
      setSelectedProjectId(null);
    }
  };

  // Project handlers
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCreateWorkspaceInProject = (projectId: string) => {
    setWorkspaceDefaultProjectId(projectId);
    setIsCreateWorkspaceOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? Workspaces inside will be preserved."
      )
    ) {
      deleteStoredProject(id, false);
      if (selectedProjectId === id) setSelectedProjectId(null);
    }
  };

  const handleDuplicateProject = (id: string) => {
    duplicateStoredProject(id);
  };

  const handleToggleFavoriteProj = (id: string) => {
    toggleFavoriteProject(id);
  };

  // Workspace handlers
  const handleOpenWorkspace = (workspaceId: string) => {
    navigate({ to: "/workspace/$id", params: { id: workspaceId } });
  };

  const handleDeleteWorkspace = (id: string) => {
    if (confirm("Are you sure you want to delete this research notebook?")) {
      deleteStoredWorkspace(id);
    }
  };

  const handleDuplicateWorkspace = (id: string) => {
    duplicateStoredWorkspace(id);
  };

  const handleToggleStarWs = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteWorkspace(id);
  };

  const openDocumentViewer = (source: Source) => {
    setActiveViewerCitation({
      sourceId: source.id,
      sourceTitle: source.title,
      organisation: source.organisation || "merSETA",
      year: source.year || "2024",
      page: 1,
      documentType: source.type,
      snippet: source.content.slice(0, 300),
      evidenceStatus: "Verified",
      confidenceLevel: "High",
    });
    setIsViewerOpen(true);
  };

  // Filtering
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (proj.tags || []).some((t) =>
        t.toLowerCase().includes(searchFilter.toLowerCase())
      );

    if (!matchesSearch) return false;
    if (projectDomainFilter === "starred") return !!proj.isFavorite;
    if (projectDomainFilter === "all") return true;
    return proj.domain === projectDomainFilter;
  });

  const filteredAllWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (workspaceCategoryFilter === "starred") return !!ws.isFavorite;
    if (workspaceCategoryFilter === "all") return true;
    return ws.category === workspaceCategoryFilter;
  });

  const activeDrilldownProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null;
  const drilldownWorkspaces = selectedProjectId
    ? getWorkspacesByProject(selectedProjectId)
    : [];

  const filteredDocs = corpusDocuments.filter((d) => {
    const matches =
      d.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.detail.toLowerCase().includes(docSearchQuery.toLowerCase());
    if (!matches) return false;
    if (docYearFilter === "all") return true;
    return d.year === docYearFilter;
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas text-ink antialiased flex flex-col selection:bg-gold/20 selection:text-ink">
      {/* 1. TOP MINIMAL NAVIGATION BAR */}
      <header className="shrink-0 w-full border-b border-line-soft bg-surface/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4 z-20">
        {/* Left: Co-Branding + Breadcrumb context */}
        <div className="flex items-center gap-3.5">
          <InstitutionBranding variant="header" />
          <div className="hidden sm:block h-4 w-px bg-line-soft" />

          <nav className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setSelectedProjectId(null);
                setPrimaryTab("projects");
              }}
              className="text-muted-text hover:text-ink transition-colors cursor-pointer"
            >
              PROJECTS & WORKSPACES
            </button>
            {activeDrilldownProject && (
              <>
                <span className="text-line-soft">/</span>
                <span className="text-gold font-semibold truncate max-w-[200px]">
                  {activeDrilldownProject.name}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Center: Search Trigger (⌘K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="w-full h-9 rounded-full border border-line-soft bg-surface-muted/60 hover:bg-surface-muted px-3.5 text-xs text-muted-text flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gold" />
              <span>Search sector projects, notebooks, and evidence...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line-soft text-[10px] font-mono text-muted-text">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & User Session */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line-soft hover:border-gold/50 bg-surface-muted/60 text-xs font-medium text-ink hover:text-gold transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-gold" />
              <span>New Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWorkspaceDefaultProjectId(undefined);
                setIsCreateWorkspaceOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-navy hover:bg-navy-soft text-white text-xs font-semibold transition-all border border-line-soft shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>New Notebook</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleTheme}
            className="w-9 h-9 rounded-full border border-line-soft hover:border-line flex items-center justify-center text-muted-text hover:text-ink transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-gold" />
            ) : (
              <Moon className="w-4 h-4 text-navy" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-line-soft hover:border-line transition-all bg-surface-muted/40 cursor-pointer"
            >
              <img
                src={
                  currentUser?.avatarUrl ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=merSIA&backgroundColor=1D3557&textColor=ffffff"
                }
                alt="Avatar"
                className="w-6 h-6 rounded-full bg-navy border border-gold/30 object-cover"
              />
              <span className="text-xs font-medium text-ink hidden sm:inline-block max-w-[120px] truncate">
                {currentUser?.name || "Analyst"}
              </span>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-line bg-surface-elevated p-2 shadow-2xl z-50 animate-in fade-in space-y-1">
                  <div className="px-3 py-2 border-b border-line-soft mb-1">
                    <p className="text-xs font-semibold text-ink truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-muted-text truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsCreateProjectOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface-muted rounded-xl transition-colors text-left"
                  >
                    <FolderPlus className="w-4 h-4 text-gold" />
                    <span>Create Sector Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsCreateWorkspaceOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface-muted rounded-xl transition-colors text-left"
                  >
                    <Plus className="w-4 h-4 text-gold" />
                    <span>Create Research Workspace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface-muted rounded-xl transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-muted-text" />
                    <span>Upload Grounding Document</span>
                  </button>
                  <div className="my-1 border-t border-line-soft" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleResetDefaults();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-text hover:text-ink hover:bg-surface-muted rounded-xl transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Default Seed Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE DASHBOARD CONTENT */}
      <main className="flex-1 min-h-0 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
          {/* IF IN PROJECT DRILL-DOWN VIEW: Render ProjectDetailView */}
          {activeDrilldownProject ? (
            <ProjectDetailView
              project={activeDrilldownProject}
              workspaces={drilldownWorkspaces}
              allProjects={projects}
              onBack={() => setSelectedProjectId(null)}
              onOpenWorkspace={handleOpenWorkspace}
              onCreateWorkspaceInProject={handleCreateWorkspaceInProject}
              onCustomizeWorkspace={(ws) => setCustomizingWorkspace(ws)}
              onMoveWorkspaceToProject={(ws) => setMovingWorkspace(ws)}
              onDuplicateWorkspace={handleDuplicateWorkspace}
              onDeleteWorkspace={handleDeleteWorkspace}
              onToggleStarWorkspace={handleToggleStarWs}
              onEditProject={(proj) => setEditingProject(proj)}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onToggleFavoriteProject={handleToggleFavoriteProj}
            />
          ) : (
            /* IF IN MAIN HOME HUB OVERVIEW */
            <>
              {/* Hero Banner with Metric Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Document & Workspace Intelligence</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                    Sector Projects & Research Workspaces
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-text max-w-2xl leading-relaxed">
                    Organize statutory intelligence under custom sector projects,
                    manage grounded notebooks, and synthesize evidence with merSIA.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold/40 hover:border-gold bg-surface-elevated text-xs sm:text-sm font-semibold text-ink hover:text-gold transition-all shadow-xs cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4 text-gold" />
                    <span>New Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceDefaultProjectId(undefined);
                      setIsCreateWorkspaceOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy hover:bg-navy-soft text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-navy/20 border border-line-soft cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-gold" />
                    <span>New Notebook</span>
                  </button>
                </div>
              </div>

              {/* 4 Overview Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "SECTOR PROJECTS",
                    value: String(projects.length),
                    detail: "Active research initiatives",
                    icon: (
                      <InsigniaEmblem
                        code="statutory-crest"
                        themeId="amber-gold"
                        size="xs"
                      />
                    ),
                  },
                  {
                    label: "GROUNDED WORKSPACES",
                    value: String(workspaces.length),
                    detail: "Evidence inquiry notebooks",
                    icon: (
                      <InsigniaEmblem
                        code="quantum-lattice"
                        themeId="sapphire-cyan"
                        size="xs"
                      />
                    ),
                  },
                  {
                    label: "PROTOTYPE CORPUS",
                    value: `${corpusDocuments.length} Documents`,
                    detail: "100% statutory provenance",
                    icon: (
                      <InsigniaEmblem
                        code="tvet-compass"
                        themeId="emerald-teal"
                        size="xs"
                      />
                    ),
                  },
                  {
                    label: "DUAL-MODEL CONSENSUS",
                    value: "92% Agreement",
                    detail: "LLaMA 3.3 × DeepSeek R1",
                    icon: (
                      <InsigniaEmblem
                        code="policy-prism"
                        themeId="amethyst-purple"
                        size="xs"
                      />
                    ),
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-line-soft bg-surface/60 backdrop-blur-xs space-y-1.5 shadow-2xs hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold">
                        {stat.label}
                      </span>
                      {stat.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-ink tracking-tight">
                      {stat.value}
                    </div>
                    <p className="text-[11px] text-muted-text font-mono">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Primary Navigation Tabs */}
              <div className="flex items-center justify-between gap-4 border-b border-line-soft pb-1">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {[
                    {
                      id: "projects",
                      label: "Sector Projects",
                      count: projects.length,
                    },
                    {
                      id: "all-workspaces",
                      label: "All Workspaces",
                      count: workspaces.length,
                    },
                    {
                      id: "documents",
                      label: "Statutory Corpus & Sources",
                      count: corpusDocuments.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPrimaryTab(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                        primaryTab === tab.id
                          ? "bg-surface-elevated text-ink border border-gold/40 shadow-xs font-bold"
                          : "text-muted-text hover:text-ink hover:bg-surface-muted/50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-canvas text-muted-text font-mono">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right: Search + View Grid / List */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-text" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder={`Filter ${
                        primaryTab === "projects" ? "projects..." : "workspaces..."
                      }`}
                      className="w-full h-8 pl-8 pr-3 rounded-full border border-line-soft bg-surface-muted/50 text-xs text-ink placeholder:text-muted-text/50 outline-hidden focus:border-gold/50 focus:bg-surface"
                    />
                  </div>

                  <div className="flex items-center rounded-full border border-line-soft p-0.5 bg-surface-muted/40 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-full transition-colors ${
                        viewMode === "grid"
                          ? "bg-surface text-ink"
                          : "text-muted-text hover:text-ink"
                      }`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-full transition-colors ${
                        viewMode === "list"
                          ? "bg-surface text-ink"
                          : "text-muted-text hover:text-ink"
                      }`}
                      title="List view"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TAB 1: SECTOR PROJECTS VIEW */}
              {primaryTab === "projects" && (
                <div className="space-y-6">
                  {/* Domain Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: "all", label: "All Domains" },
                      { id: "starred", label: "Starred Projects" },
                      { id: "TVET & Qualifications", label: "TVET & Trades" },
                      { id: "Just Transition", label: "Just Energy Transition" },
                      { id: "Labour Dynamics", label: "Labour Market (ELMA)" },
                      { id: "Automotive 4.0", label: "Automotive 4.0" },
                      { id: "Research", label: "Empirical Research" },
                      { id: "Strategic Policy", label: "Statutory Policy" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProjectDomainFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                          projectDomainFilter === tab.id
                            ? "bg-surface-elevated text-gold border border-gold/40 shadow-xs font-semibold"
                            : "text-muted-text hover:text-ink hover:bg-surface-muted/50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Projects Grid / List */}
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Blank Create Project Card */}
                      <button
                        type="button"
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="group relative h-[260px] rounded-2xl border-2 border-dashed border-line-soft hover:border-gold/50 bg-surface/30 hover:bg-surface/60 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-surface-muted group-hover:bg-gold/15 group-hover:scale-105 border border-line-soft flex items-center justify-center transition-all">
                          <FolderPlus className="w-6 h-6 text-muted-text group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink group-hover:text-gold transition-colors">
                            Create New Sector Project
                          </p>
                          <p className="text-xs text-muted-text mt-1 max-w-[220px]">
                            Establish a strategic initiative to group related
                            inquiry workspaces
                          </p>
                        </div>
                      </button>

                      {/* Render Project Cards */}
                      {filteredProjects.map((proj) => (
                        <ProjectCard
                          key={proj.id}
                          project={proj}
                          workspaces={getWorkspacesByProject(proj.id)}
                          onSelectProject={handleSelectProject}
                          onEditProject={(p) => setEditingProject(p)}
                          onDuplicateProject={handleDuplicateProject}
                          onDeleteProject={handleDeleteProject}
                          onToggleFavorite={handleToggleFavoriteProj}
                          onCreateWorkspaceInProject={
                            handleCreateWorkspaceInProject
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    /* Project List View */
                    <div className="rounded-2xl border border-line-soft bg-surface/50 divide-y divide-line-soft overflow-hidden">
                      {filteredProjects.map((proj) => {
                        const childWs = getWorkspacesByProject(proj.id);
                        return (
                          <div
                            key={proj.id}
                            onClick={() => handleSelectProject(proj.id)}
                            className="group flex items-center justify-between p-4 hover:bg-surface-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <InsigniaEmblem
                                code={proj.iconCode}
                                themeId={proj.themeId}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-semibold text-ink group-hover:text-gold transition-colors truncate">
                                  {proj.name}
                                </h3>
                                <p className="text-[11px] text-muted-text truncate">
                                  {proj.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 text-xs text-muted-text font-mono">
                              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-muted text-[10px]">
                                {proj.domain}
                              </span>
                              <span className="text-gold font-medium">
                                {childWs.length} Workspaces
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-text group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ALL WORKSPACES (FLAT OVERVIEW) */}
              {primaryTab === "all-workspaces" && (
                <div className="space-y-6">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: "all", label: "All Notebooks" },
                      { id: "starred", label: "Starred" },
                      { id: "Research", label: "Research" },
                      { id: "Philosophy", label: "Just Transition" },
                      { id: "Cognitive Systems", label: "Labour Dynamics" },
                      { id: "Design", label: "Automotive 4.0" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setWorkspaceCategoryFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                          workspaceCategoryFilter === tab.id
                            ? "bg-surface-elevated text-gold border border-gold/40 shadow-xs font-semibold"
                            : "text-muted-text hover:text-ink hover:bg-surface-muted/50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Workspaces Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Blank Create Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspaceDefaultProjectId(undefined);
                        setIsCreateWorkspaceOpen(true);
                      }}
                      className="group relative h-52 rounded-2xl border-2 border-dashed border-line-soft hover:border-gold/50 bg-surface/30 hover:bg-surface/60 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-surface-muted group-hover:bg-gold/15 group-hover:scale-105 border border-line-soft flex items-center justify-center transition-all">
                        <Plus className="w-5 h-5 text-muted-text group-hover:text-gold transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink group-hover:text-gold transition-colors">
                          Create New Notebook
                        </p>
                        <p className="text-[11px] text-muted-text mt-0.5">
                          Launch fresh grounded synthesis canvas
                        </p>
                      </div>
                    </button>

                    {filteredAllWorkspaces.map((ws) => {
                      const parent = projects.find((p) => p.id === ws.projectId);
                      return (
                        <WorkspaceCard
                          key={ws.id}
                          workspace={ws}
                          parentProject={parent}
                          onOpen={handleOpenWorkspace}
                          onCustomize={(w) => setCustomizingWorkspace(w)}
                          onMoveToProject={(w) => setMovingWorkspace(w)}
                          onDuplicate={handleDuplicateWorkspace}
                          onDelete={handleDeleteWorkspace}
                          onToggleStar={handleToggleStarWs}
                          showParentProjectBadge={true}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: STATUTORY CORPUS & DOCUMENT MANAGEMENT */}
              {primaryTab === "documents" && (
                <div className="space-y-6">
                  {/* Document Management Header & Upload CTA */}
                  <div className="p-6 rounded-2xl border border-line-soft bg-surface/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-gold" />
                        <h3 className="text-sm font-bold text-ink">
                          Closed Sector Evidence Repository
                        </h3>
                      </div>
                      <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
                        Every answer in merSIA references verified statutory
                        and empirical documents. Attach these documents to any
                        project workspace.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-semibold transition-all border border-line-soft shadow-xs shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-gold" />
                      <span>Upload New Document</span>
                    </button>
                  </div>

                  {/* Document Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-5 rounded-2xl border border-line-soft bg-surface/60 hover:border-gold/40 transition-all flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-surface-muted text-gold border border-gold/20 font-semibold">
                              {doc.type}
                            </span>
                            <span className="text-[11px] font-mono text-muted-text">
                              {doc.year} · {doc.pageCount} Pages
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-ink leading-snug">
                            {doc.title}
                          </h4>

                          <p className="text-xs text-muted-text font-medium flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-muted-text" />
                            <span>{doc.organisation}</span>
                          </p>

                          <p className="text-xs text-body/90 line-clamp-3 bg-surface-muted/40 p-3 rounded-xl border border-line-soft leading-relaxed">
                            {doc.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-line-soft">
                          <div className="flex flex-wrap gap-1">
                            {(doc.keyTopics || []).slice(0, 2).map((t, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface-muted text-muted-text"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => openDocumentViewer(doc)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-soft hover:border-gold/50 bg-surface-muted text-xs font-medium text-ink hover:text-gold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Text</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* CREATE PROJECT MODAL */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={(newProjectId) => {
          setSelectedProjectId(newProjectId);
          setProjects(getStoredProjects());
          setWorkspaces(getStoredWorkspaces());
        }}
      />

      {/* EDIT PROJECT MODAL */}
      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onProjectUpdated={() => {
          setProjects(getStoredProjects());
          setWorkspaces(getStoredWorkspaces());
        }}
      />

      {/* CREATE WORKSPACE MODAL */}
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceOpen}
        projects={projects}
        defaultProjectId={workspaceDefaultProjectId || selectedProjectId || undefined}
        onClose={() => {
          setIsCreateWorkspaceOpen(false);
          setWorkspaceDefaultProjectId(undefined);
        }}
        onWorkspaceCreated={(wsId) => {
          navigate({ to: "/workspace/$id", params: { id: wsId } });
        }}
      />

      {/* CUSTOMIZE WORKSPACE MODAL */}
      <CustomizeWorkspaceModal
        isOpen={!!customizingWorkspace}
        workspace={customizingWorkspace}
        projects={projects}
        onClose={() => setCustomizingWorkspace(null)}
        onWorkspaceUpdated={() => {
          setWorkspaces(getStoredWorkspaces());
        }}
      />

      {/* MOVE WORKSPACE MODAL */}
      <MoveWorkspaceModal
        isOpen={!!movingWorkspace}
        workspace={movingWorkspace}
        projects={projects}
        onClose={() => setMovingWorkspace(null)}
        onMoved={() => {
          setWorkspaces(getStoredWorkspaces());
        }}
      />

      {/* DOCUMENT VIEWER MODAL */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        citation={activeViewerCitation}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* DOCUMENT UPLOAD MODAL */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddSource={(newSource) => {
          setCorpusDocuments((prev) => [newSource, ...prev]);
        }}
      />

      {/* GLOBAL SEARCH DIALOG (⌘K) */}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onSelectDocument={(docId) => {
          setIsSearchDialogOpen(false);
          const found =
            corpusDocuments.find((d) => d.id === docId) ||
            PROTOTYPE_DOCUMENTS.find((d) => d.id === docId);
          if (found) openDocumentViewer(found);
        }}
      />
    </div>
  );
};
