import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  WorkspaceItem,
  UserSession,
  getStoredUser,
  setStoredUser,
  getStoredWorkspaces,
  createStoredWorkspace,
  deleteStoredWorkspace,
  duplicateStoredWorkspace,
  resetWorkspacesToDefault,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fieldnotes — Workspaces" },
      { name: "description", content: "A quiet canvas for thinking with your sources." },
      { property: "og:title", content: "Fieldnotes — Workspaces" },
      { property: "og:description", content: "A quiet canvas for thinking with your sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const CATEGORIES = ["All", "Cognitive Systems", "Design", "Philosophy"] as const;

function HomePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Create Workspace Modal (Boxless)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<WorkspaceItem["category"]>("Cognitive Systems");
  const [preloadSources, setPreloadSources] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hovered item index for subtle indication
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getStoredTheme());
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      setTheme(customEvent.detail || getStoredTheme());
    };
    window.addEventListener("fieldnotes_theme_changed", handleThemeChange);
    return () => {
      window.removeEventListener("fieldnotes_theme_changed", handleThemeChange);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  // 1. Auth check & data load
  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);
    setWorkspaces(getStoredWorkspaces());
    setIsAuthChecked(true);

    const handleStorageChange = () => {
      setWorkspaces(getStoredWorkspaces());
    };
    window.addEventListener("fieldnotes_workspaces_updated", handleStorageChange);
    return () => {
      window.removeEventListener("fieldnotes_workspaces_updated", handleStorageChange);
    };
  }, [navigate]);

  // Greeting based on user name and time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const name = currentUser?.name || "Researcher";
    return `${timeOfDay}, ${name}`;
  }, [currentUser]);

  const handleSignOut = () => {
    setStoredUser(null);
    navigate({ to: "/login" });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createStoredWorkspace({
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        preloadSources,
      });

      setWorkspaces(getStoredWorkspaces());
      setIsSubmitting(false);
      setIsCreateOpen(false);
      setNewTitle("");
      setNewDescription("");
      navigate({
        to: "/workspace/$id",
        params: { id: created.id },
      });
    }, 180);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStoredWorkspace(id);
    setWorkspaces(getStoredWorkspaces());
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateStoredWorkspace(id);
    setWorkspaces(getStoredWorkspaces());
  };

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === "All") return true;
    return ws.category === selectedCategory;
  });

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <span className="text-sm text-muted-foreground animate-soft-pulse">Opening Fieldnotes...</span>
      </div>
    );
  }

  return (
    <main className="relative h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between bg-background text-foreground antialiased select-none px-6 py-5 sm:py-7">
      {/* 1. TOP HEADER (Identical to login page layout) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/60 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
            Fieldnotes
          </span>
          <span className="text-border">/</span>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal tracking-tight">
            A quiet canvas for thinking with your sources.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="text-foreground font-medium hover:opacity-75 transition-opacity"
          >
            + New workspace
          </button>
          <span className="text-border">·</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* 2. CENTER STAGE: GREETING + SPACED OUT BOXLESS WORKSPACES LIST */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto flex-1 min-h-0 flex flex-col justify-between py-6 sm:py-8 overflow-hidden animate-rise-in">
        {/* Warm Greeting & Intention Statement */}
        <div className="flex flex-col space-y-2 max-w-2xl shrink-0 pb-5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
            The Workspaces
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-foreground leading-snug">
            “{greeting}.”
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground/90 font-normal">
            Your grounded workspaces are waiting. Select an inquiry to resume synthesis, or establish a new primary canvas.
          </p>
        </div>

        {/* Clean, Boxless Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/50 pb-3 shrink-0">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`transition-colors font-medium pb-0.5 ${
                  selectedCategory === cat
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full sm:w-56 bg-transparent border-none py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden"
            />
          </div>
        </div>

        {/* 3. WORKSPACES AREA: Boxless, Spacious, In-Page Scroll Only */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 py-3 space-y-1">
          {filteredWorkspaces.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `No workspaces match “${searchQuery}”.`
                  : "No workspaces found in this category."}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-xs">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-foreground underline underline-offset-4"
                  >
                    Clear filter
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="text-foreground underline underline-offset-4 font-medium"
                >
                  Create workspace →
                </button>
              </div>
            </div>
          ) : (
            filteredWorkspaces.map((ws, index) => {
              const formattedIndex = String(index + 1).padStart(2, "0");
              const isHovered = hoveredId === ws.id;

              return (
                <div
                  key={ws.id}
                  onMouseEnter={() => setHoveredId(ws.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    navigate({
                      to: "/workspace/$id",
                      params: { id: ws.id },
                    })
                  }
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-border/35 hover:border-foreground/30 transition-all cursor-pointer"
                >
                  {/* Left: Index + Title + Description */}
                  <div className="flex items-start gap-3.5 sm:gap-5 min-w-0 max-w-2xl">
                    <span className="font-mono text-xs text-muted-foreground/70 pt-1 shrink-0">
                      {formattedIndex}
                    </span>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base sm:text-lg font-normal tracking-tight text-foreground group-hover:text-foreground">
                          {ws.title}
                        </h2>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80">
                          {ws.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground/85 leading-relaxed line-clamp-1">
                        {ws.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Sources count, updated date & quiet actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-muted-foreground shrink-0 pl-7 sm:pl-0">
                    <div className="flex items-center gap-2">
                      <span>{ws.sources?.length || 0} sources</span>
                      <span>·</span>
                      <span>{ws.updatedAt}</span>
                    </div>

                    <div
                      className="flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(ws.id, e)}
                        className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors hidden sm:inline"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(ws.id, e)}
                        className="text-xs text-muted-foreground/70 hover:text-destructive transition-colors hidden sm:inline"
                      >
                        Remove
                      </button>
                      <span className="text-xs font-medium text-foreground transition-transform group-hover:translate-x-1">
                        Open →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. MINIMAL FOOTER (Identical to login page layout) */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          <span>Fieldnotes</span>
          <span>·</span>
          <span>{workspaces.length} grounded sanctuaries</span>
          <span>·</span>
          <span>Form and purpose in complete distillation</span>
        </div>
        <button
          type="button"
          onClick={() => setWorkspaces(resetWorkspacesToDefault())}
          className="hover:text-foreground transition-colors"
        >
          Reset sample workspaces
        </button>
      </footer>

      {/* 4.5. SLIGHT AMBIENT HORIZON CONTINUATION FROM THE LOGIN SCREEN */}
      <div 
        className="pointer-events-none absolute bottom-0 inset-x-0 h-[50vh] sm:h-[60vh] overflow-hidden z-0 opacity-25 dark:opacity-20"
        aria-hidden="true"
      >
        <img
          src="/s.jpeg"
          alt=""
          className="w-full h-full object-cover object-bottom"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* 5. BOXLESS CREATE WORKSPACE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-5 animate-rise-in">
          <div className="w-full max-w-lg space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
                  Establish Workspace
                </span>
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground mt-1">
                  A new ground for inquiry.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground pt-1"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Workspace Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cognitive Systems Research"
                  className="w-full bg-transparent border-b border-border focus:border-foreground py-2 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief note on central questions or theme..."
                  className="w-full bg-transparent border-b border-border focus:border-foreground py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Category
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(["Cognitive Systems", "Design", "Philosophy", "Research"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`px-2.5 py-1 transition-colors ${
                        newCategory === cat
                          ? "text-foreground font-semibold border-b border-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={preloadSources}
                  onChange={(e) => setPreloadSources(e.target.checked)}
                  className="accent-foreground"
                />
                <span>Preload foundational literature sources</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || isSubmitting}
                  className="text-xs sm:text-sm font-medium text-foreground hover:opacity-75 transition-opacity"
                >
                  {isSubmitting ? "Establishing..." : "Establish Workspace →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}