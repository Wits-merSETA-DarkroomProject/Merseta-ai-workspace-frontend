import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Star,
  MoreVertical,
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
} from "lucide-react";
import {
  WorkspaceItem,
  Source,
  SavedAnswer,
  CitationItem,
  UserSession,
  PROTOTYPE_DOCUMENTS,
  getStoredUser,
  setStoredUser,
  getStoredWorkspaces,
  createStoredWorkspace,
  updateStoredWorkspace,
  deleteStoredWorkspace,
  duplicateStoredWorkspace,
  toggleFavoriteWorkspace,
  getStoredSavedAnswers,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";
import { InstitutionBranding } from "./InstitutionBranding";
import { DocumentViewerModal } from "./DocumentViewerModal";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { SearchDialog } from "./SearchDialog";

export const WorkspaceHub: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Filter & Search
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "starred" | "Research" | "Philosophy" | "Cognitive Systems">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals & Dialogs
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"Research" | "Philosophy" | "Cognitive Systems" | "Design">("Research");
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(
    new Set(PROTOTYPE_DOCUMENTS.map((d) => d.id))
  );

  // Edit/Rename Modal
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Document Viewer Modal
  const [activeViewerCitation, setActiveViewerCitation] = useState<CitationItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Upload Document Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [corpusDocuments, setCorpusDocuments] = useState<Source[]>(PROTOTYPE_DOCUMENTS);

  // Global Search Dialog
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // User Dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdownWsId, setActiveDropdownWsId] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);
    setWorkspaces(getStoredWorkspaces());
    setSavedAnswers(getStoredSavedAnswers());
    setTheme(getStoredTheme());

    const handleWsUpdate = () => setWorkspaces(getStoredWorkspaces());
    const handleSavedUpdate = () => setSavedAnswers(getStoredSavedAnswers());
    window.addEventListener("mersia_workspaces_updated", handleWsUpdate);
    window.addEventListener("mersia_saved_answers_updated", handleSavedUpdate);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchDialogOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mersia_workspaces_updated", handleWsUpdate);
      window.removeEventListener("mersia_saved_answers_updated", handleSavedUpdate);
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

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosenSources = PROTOTYPE_DOCUMENTS.filter((d) => selectedDocIds.has(d.id));
    const created = createStoredWorkspace({
      title: newTitle.trim(),
      description: newDesc.trim() || "Notebook for sectoral research and statutory analysis.",
      category: newCategory,
      sources: chosenSources.length > 0 ? chosenSources : PROTOTYPE_DOCUMENTS,
    });

    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    navigate({ to: "/workspace/$id", params: { id: created.id } });
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspace || !editTitle.trim()) return;

    updateStoredWorkspace(editingWorkspace.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
    });
    setEditingWorkspace(null);
  };

  const handleDeleteWorkspace = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Are you sure you want to delete this workspace?")) {
      deleteStoredWorkspace(id);
      setActiveDropdownWsId(null);
    }
  };

  const handleDuplicateWorkspace = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    duplicateStoredWorkspace(id);
    setActiveDropdownWsId(null);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
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

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "starred") return !!ws.isFavorite;
    if (activeTab === "all") return true;
    return ws.category === activeTab;
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas text-ink antialiased flex flex-col selection:bg-gold/20 selection:text-ink">
      {/* 1. TOP MINIMAL NAVIGATION BAR */}
      <header className="shrink-0 w-full border-b border-line-soft bg-surface/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20">
        {/* Left: Institutional Co-branding */}
        <div className="flex items-center gap-4">
          <InstitutionBranding variant="header" />
          <div className="hidden sm:block h-4 w-px bg-line-soft" />
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-muted-text">
            Workspace Hub
          </span>
        </div>

        {/* Center: Search Trigger (⌘K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="w-full h-9 rounded-full border border-line-soft bg-surface-muted/60 hover:bg-surface-muted px-3.5 text-xs text-muted-text flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-text" />
              <span>Search workspaces, documents, and notes...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line-soft text-[10px] font-mono text-muted-text">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & User Session */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="w-9 h-9 rounded-full border border-line-soft hover:border-line flex items-center justify-center text-muted-text hover:text-ink transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Menu */}
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-surface-elevated p-1.5 shadow-2xl z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-line-soft mb-1">
                    <p className="text-xs font-semibold text-ink truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-muted-text truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface-muted rounded-lg transition-colors text-left"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold" />
                    <span>New Workspace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA (Scrollable) */}
      <main className="flex-1 min-h-0 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
             {/* Header Hero Banner (NotebookLM style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Research Notebooks
            </h1>
            <p className="text-xs sm:text-sm text-muted-text">
              Manage your sector intelligence workspaces and evidence canvases.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy hover:bg-navy-soft text-white text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-navy/20 border border-line-soft shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>New Notebook</span>
          </button>
        </div>

        {/* 3. CONTROLS BAR: CATEGORY TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line-soft pb-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Notebooks", count: workspaces.length },
              { id: "starred", label: "Starred", count: workspaces.filter((w) => w.isFavorite).length },
              { id: "Research", label: "Research", count: workspaces.filter((w) => w.category === "Research").length },
              { id: "Philosophy", label: "Just Transition", count: workspaces.filter((w) => w.category === "Philosophy").length },
              { id: "Cognitive Systems", label: "Labour Dynamics", count: workspaces.filter((w) => w.category === "Cognitive Systems").length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-surface-elevated text-ink border border-gold/40 shadow-xs font-semibold"
                    : "text-muted-text hover:text-ink hover:bg-surface-muted/60"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-canvas/60 text-muted-text">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Search Filter + Grid/List Mode */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-text" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter notebooks..."
                className="w-full h-8 pl-8 pr-3 rounded-full border border-line-soft bg-surface-muted/40 text-xs text-ink placeholder:text-muted-text/50 outline-hidden transition-all focus:border-gold/50 focus:bg-surface"
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

        {/* 4. WORKSPACES DISPLAY (NotebookLM Grid / List) */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {/* Blank Create Card */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative h-48 rounded-2xl border-2 border-dashed border-line-soft hover:border-gold/50 bg-surface/30 hover:bg-surface/60 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-surface-muted group-hover:bg-gold/15 group-hover:scale-105 border border-line-soft flex items-center justify-center transition-all">
                <Plus className="w-5 h-5 text-muted-text group-hover:text-gold transition-colors" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink group-hover:text-gold transition-colors">
                  Create New Notebook
                </p>
                <p className="text-[11px] text-muted-text mt-0.5">
                  Start a fresh synthesis with custom sources
                </p>
              </div>
            </button>

            {/* Notebook Cards */}
            {filteredWorkspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => navigate({ to: "/workspace/$id", params: { id: ws.id } })}
                className="group relative h-48 rounded-2xl border border-line-soft hover:border-gold/40 bg-surface/70 hover:bg-surface backdrop-blur-xs p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-black/10 cursor-pointer overflow-hidden"
              >
                {/* Notebook Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-gold/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Top: Category Tag + Star Favorite + Action Dropdown */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-muted text-[10px] font-mono uppercase tracking-wider text-muted-text group-hover:text-gold transition-colors">
                    {ws.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleStar(ws.id, e)}
                      className={`p-1.5 rounded-full hover:bg-surface-muted transition-colors ${
                        ws.isFavorite ? "text-gold" : "text-muted-text/40 hover:text-muted-text"
                      }`}
                      title={ws.isFavorite ? "Unstar notebook" : "Star notebook"}
                    >
                      <Star className={`w-3.5 h-3.5 ${ws.isFavorite ? "fill-gold" : ""}`} />
                    </button>

                    {/* 3-dot dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownWsId((prev) => (prev === ws.id ? null : ws.id));
                        }}
                        className="p-1.5 rounded-full hover:bg-surface-muted text-muted-text hover:text-ink transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeDropdownWsId === ws.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownWsId(null);
                            }}
                          />
                          <div className="absolute right-0 mt-1 w-44 rounded-xl border border-line bg-surface-elevated p-1 shadow-2xl z-50 animate-in fade-in">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownWsId(null);
                                setEditingWorkspace(ws);
                                setEditTitle(ws.title);
                                setEditDesc(ws.description);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-ink hover:bg-surface-muted rounded-lg text-left"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-muted-text" />
                              <span>Rename Notebook</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDuplicateWorkspace(ws.id, e)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-ink hover:bg-surface-muted rounded-lg text-left"
                            >
                              <Copy className="w-3.5 h-3.5 text-muted-text" />
                              <span>Duplicate</span>
                            </button>
                            <div className="my-1 border-t border-line-soft" />
                            <button
                              type="button"
                              onClick={(e) => handleDeleteWorkspace(ws.id, e)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Notebook</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold text-ink group-hover:text-gold transition-colors line-clamp-1">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-muted-text line-clamp-2 leading-relaxed font-normal">
                    {ws.description}
                  </p>
                </div>

                {/* Bottom: Sources Count + Last Active */}
                <div className="flex items-center justify-between pt-2 border-t border-line-soft/40 text-[11px] text-muted-text">
                  <div className="flex items-center gap-1.5 text-gold font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{ws.sources?.length || 5} sources</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-text/70">
                    Updated {ws.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="rounded-2xl border border-line-soft bg-surface/50 divide-y divide-line-soft overflow-hidden mb-8">
            {filteredWorkspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => navigate({ to: "/workspace/$id", params: { id: ws.id } })}
                className="group flex items-center justify-between p-4 hover:bg-surface-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStar(ws.id, e)}
                    className={`p-1 rounded-full hover:bg-surface-muted transition-colors ${
                      ws.isFavorite ? "text-gold" : "text-muted-text/40 hover:text-muted-text"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${ws.isFavorite ? "fill-gold" : ""}`} />
                  </button>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-ink group-hover:text-gold transition-colors truncate">
                      {ws.title}
                    </h3>
                    <p className="text-[11px] text-muted-text truncate">{ws.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs text-muted-text">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-surface-muted text-[10px] font-mono">
                    {ws.category}
                  </span>
                  <span className="text-gold font-medium">{ws.sources?.length || 5} sources</span>
                  <span className="text-[11px] font-mono text-muted-text/70">{ws.updatedAt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-text group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      {/* CREATE WORKSPACE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-surface-elevated p-6 shadow-2xl space-y-5 animate-rise-in">
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-navy text-gold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-ink">Create Research Notebook</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-text hover:text-ink text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-text">Notebook Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. TVET Artisan Pipeline Analysis 2026"
                  className="w-full h-10 px-3.5 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-text">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief context on the sectoral inquiry focus..."
                  className="w-full p-3 rounded-xl border border-line-soft bg-surface-muted text-xs sm:text-sm text-ink outline-hidden focus:border-gold/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-text">Sector Domain</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                >
                  <option value="Research">Research & Empirical Inquiry</option>
                  <option value="Philosophy">Just Transition & Decarbonisation</option>
                  <option value="Cognitive Systems">Labour Market Dynamics</option>
                  <option value="Design">Automotive & 4.0 Advanced Systems</option>
                </select>
              </div>

              {/* Document Selection Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-medium text-muted-text block">
                  Grounding Sources ({selectedDocIds.size} Selected)
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-line-soft rounded-xl p-2 bg-surface-muted/30">
                  {PROTOTYPE_DOCUMENTS.map((doc) => {
                    const isChecked = selectedDocIds.has(doc.id);
                    return (
                      <label
                        key={doc.id}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-muted text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = new Set(selectedDocIds);
                            if (isChecked) next.delete(doc.id);
                            else next.add(doc.id);
                            setSelectedDocIds(next);
                          }}
                          className="rounded border-line-soft text-gold focus:ring-gold"
                        />
                        <span className="truncate text-ink">{doc.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line-soft hover:bg-surface-muted text-xs font-medium text-muted-text hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-medium transition-colors border border-line-soft"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {editingWorkspace && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface-elevated p-6 shadow-2xl space-y-4 animate-rise-in">
            <h3 className="text-sm font-semibold text-ink">Rename Notebook</h3>
            <form onSubmit={handleSaveRename} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-muted-text">Notebook Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-text">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWorkspace(null)}
                  className="px-3 py-1.5 rounded-lg border border-line-soft text-xs text-muted-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy text-white text-xs font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        citation={activeViewerCitation}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* DOCUMENT UPLOAD MODAL (Local, Links, Cloud, Notes) */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddSource={(newSource) => {
          setCorpusDocuments((prev) => [newSource, ...prev]);
        }}
      />

      {/* SEARCH DIALOG */}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onSelectDocument={(docId) => {
          setIsSearchDialogOpen(false);
          const found = corpusDocuments.find((d) => d.id === docId) || PROTOTYPE_DOCUMENTS.find((d) => d.id === docId);
          if (found) openDocumentViewer(found);
        }}
      />
    </div>
  );
};
