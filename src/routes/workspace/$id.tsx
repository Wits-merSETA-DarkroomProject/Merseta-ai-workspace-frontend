import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Source,
  ChatMessage,
  StudioArtifact,
  UserSession,
  WorkspaceItem,
  WorkspaceConfig,
  ModelPersonaId,
  ResponseStyleId,
  MODEL_PERSONAS,
  RESPONSE_STYLES,
  TIME_PERIOD_FILTERS,
  DEFAULT_WORKSPACE_CONFIG,
  getStoredUser,
  setStoredUser,
  getStoredWorkspace,
  getStoredWorkspaces,
  updateStoredWorkspace,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";

export const Route = createFileRoute("/workspace/$id")({
  head: () => ({
    meta: [
      { title: "Fieldnotes — Research Canvas" },
      { name: "description", content: "A quiet canvas for thinking with your primary sources." },
      { property: "og:title", content: "Fieldnotes — Research Canvas" },
      { property: "og:description", content: "A quiet canvas for thinking with your primary sources." },
    ],
  }),
  component: WorkspacePage,
});

const STARTERS = [
  "What ideas connect these sources?",
  "Where do the authors disagree on cognitive load?",
  "Synthesize a 3-point research summary",
];

function WorkspacePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceItem | null>(null);
  const [allWorkspaces, setAllWorkspaces] = useState<WorkspaceItem[]>([]);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
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

  // Configuration Bar (Persona, Response Style, References, Reasoning Trace, Time Period)
  const [config, setConfig] = useState<WorkspaceConfig>(DEFAULT_WORKSPACE_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Layout states: Panels open/close
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Core Data
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Active source reader modal
  const [readingSource, setReadingSource] = useState<Source | null>(null);

  // Add source dialog modal + File upload
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceType, setNewSourceType] = useState<"pdf" | "web" | "doc" | "note">("note");
  const [newSourceAuthor, setNewSourceAuthor] = useState("");
  const [newSourceTimePeriod, setNewSourceTimePeriod] = useState("");
  const [newSourceContent, setNewSourceContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expanded reasoning traces map: messageId -> boolean
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  // Studio Artifacts
  const [activeArtifact, setActiveArtifact] = useState<StudioArtifact | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [copiedArtifact, setCopiedArtifact] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 1. Auth check and data load
  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);

    const workspaces = getStoredWorkspaces();
    setAllWorkspaces(workspaces);

    const ws = getStoredWorkspace(id) || workspaces[0];
    if (ws) {
      setCurrentWorkspace(ws);
      setSources(ws.sources || []);
      setSelectedSourceIds(new Set((ws.sources || []).map((s) => s.id)));
      setMessages(ws.messages || []);
      setConfig(ws.config || DEFAULT_WORKSPACE_CONFIG);

      // Default expand reasoning traces for messages that have them
      const initialExpanded: Record<string, boolean> = {};
      (ws.messages || []).forEach((m) => {
        if (m.reasoningTrace) initialExpanded[m.id] = true;
      });
      setExpandedReasoning(initialExpanded);

      if (ws.artifacts && ws.artifacts.length > 0) {
        setActiveArtifact(ws.artifacts[0] || null);
      } else {
        setActiveArtifact(null);
      }
    }
    setIsAuthChecked(true);
  }, [id, navigate]);

  // Sync workspace updates to store
  const saveCurrentWorkspaceChanges = (
    newSources?: Source[],
    newMessages?: ChatMessage[],
    newArtifact?: StudioArtifact,
    newConfig?: WorkspaceConfig
  ) => {
    if (!currentWorkspace) return;
    const updatedSources = newSources !== undefined ? newSources : sources;
    const updatedMessages = newMessages !== undefined ? newMessages : messages;
    const updatedConfig = newConfig !== undefined ? newConfig : config;
    const updatedArtifacts = newArtifact
      ? [newArtifact, ...(currentWorkspace.artifacts || []).filter((a) => a.title !== newArtifact.title)]
      : currentWorkspace.artifacts;

    updateStoredWorkspace(currentWorkspace.id, {
      sources: updatedSources,
      messages: updatedMessages,
      artifacts: updatedArtifacts,
      config: updatedConfig,
    });
  };

  const handleUpdateConfig = (updates: Partial<WorkspaceConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    saveCurrentWorkspaceChanges(undefined, undefined, undefined, updated);
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Handle synthetic audio playback using Web Speech API
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isAudioPlaying && activeArtifact?.type === "audio") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        activeArtifact.content.replace(/Host [A-B]:/g, "")
      );
      utterance.rate = 1.0;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isAudioPlaying, activeArtifact]);

  const handleSignOut = () => {
    setStoredUser(null);
    navigate({ to: "/login" });
  };

  const handleToggleSource = (sourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(sourceId)) {
        next.delete(sourceId);
      } else {
        next.add(sourceId);
      }
      return next;
    });
  };

  const handleToggleAllSources = () => {
    if (selectedSourceIds.size === sources.length) {
      setSelectedSourceIds(new Set());
    } else {
      setSelectedSourceIds(new Set(sources.map((s) => s.id)));
    }
  };

  const handleDeleteSource = (sourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSources = sources.filter((s) => s.id !== sourceId);
    setSources(nextSources);
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      next.delete(sourceId);
      return next;
    });
    if (readingSource?.id === sourceId) {
      setReadingSource(null);
    }
    saveCurrentWorkspaceChanges(nextSources);
  };

  // Handle PC file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const inferredTitle = file.name.replace(/\.[^/.]+$/, "");
    if (!newSourceTitle) {
      setNewSourceTitle(inferredTitle);
    }

    // Determine type
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") setNewSourceType("pdf");
    else if (ext === "doc" || ext === "docx") setNewSourceType("doc");
    else setNewSourceType("note");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNewSourceContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim()) return;

    const newSrc: Source = {
      id: `src-${Date.now()}`,
      title: newSourceTitle.trim(),
      detail:
        newSourceType === "pdf"
          ? "PDF · Uploaded Document"
          : newSourceType === "web"
            ? "Website · Article"
            : "Notes · Text Excerpt",
      type: newSourceType,
      author: newSourceAuthor.trim() || currentUser?.name || "Researcher",
      timePeriod: newSourceTimePeriod.trim() || "Contemporary",
      dateAdded: "Just now",
      content:
        newSourceContent.trim() ||
        "No additional text content provided. Indexed for cross-document synthesis.",
    };

    const nextSources = [newSrc, ...sources];
    setSources(nextSources);
    setSelectedSourceIds((prev) => new Set(prev).add(newSrc.id));
    setNewSourceTitle("");
    setNewSourceAuthor("");
    setNewSourceTimePeriod("");
    setNewSourceContent("");
    setUploadedFileName("");
    setIsAddModalOpen(false);
    saveCurrentWorkspaceChanges(nextSources);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsGenerating(true);

    const activeList = sources.filter((s) => selectedSourceIds.has(s.id));

    setTimeout(() => {
      let responseText = "";
      const citations: ChatMessage["citations"] = [];
      const primarySrc = activeList[0];
      const secondarySrc = activeList.length > 1 ? activeList[1] : null;

      const persona = MODEL_PERSONAS.find((p) => p.id === config.persona) ?? {
        id: "curator" as const,
        title: "Quiet Curator",
        description: "Strictly disciplined, grounded synthesis",
      };
      const style = config.responseStyle;

      if (!primarySrc) {
        responseText =
          "No sources are currently in focus. Enable one or more sources on the left to ground this inquiry.";
      } else {
        // Generate tailored response content reflecting persona & style
        if (config.persona === "dialectical") {
          responseText = `A central tension emerges between your active materials:\n\n1. Structural Isolation (${primarySrc.title} [${primarySrc.timePeriod || "n.d."}]): Argues that cognitive continuity requires rigid spatial isolation from interruptions.\n2. Ambient Peripheral Synthesis (${secondarySrc ? `${secondarySrc.title} [${secondarySrc.timePeriod || "n.d."}]` : "Companion Research"}): Argues that disconnecting entirely creates coordination bottlenecks; systems should instead inform at the perceptual periphery without hijacking focus.`;
        } else if (config.persona === "distiller") {
          responseText = `Core Principles:\n- Working memory bandwidth degrades under context switching.\n- Peripheral awareness preserves cognitive autonomy.\n- Grounded source citations anchor synthesis against synthetic hallucination.`;
        } else if (config.persona === "academic") {
          responseText = `Tracing the theoretical lineage across your corpus:\n\nThe foundational premise articulated in ${primarySrc.title} (${primarySrc.timePeriod || "contemporary"}) posits that human working memory capacity is strictly bounded. When contextualized alongside ${secondarySrc ? `${secondarySrc.title} (${secondarySrc.timePeriod || "historical"})` : "prior scholarship"}, the epistemological challenge is not information scarcity, but sensory friction in retrieval.`;
        } else {
          // Quiet Curator (default)
          if (text.toLowerCase().includes("connect") || text.toLowerCase().includes("idea")) {
            responseText = `Across your ${activeList.length} active sources (spanning ${activeList.map((s) => s.timePeriod || "n.d.").filter(Boolean).join(", ")}), the unifying thesis is that deep focus requires deliberate spatial architecture. In ${primarySrc.title}, biological memory degrades under context switching penalties. Meanwhile, ${secondarySrc ? secondarySrc.title : "companion research"} demonstrates that calm tools should live unobtrusively on the periphery until deliberately summoned.\n\nTogether, they establish the foundation for quiet, grounded research canvases over ephemeral chat feeds.`;
          } else if (text.toLowerCase().includes("disagree") || text.toLowerCase().includes("friction")) {
            responseText = `A key point of difference across your sources is the proposed operational remedy:\n\n1. Structural Isolation (${primarySrc.title}): Argues that knowledge work requires rigid isolation blocks and distraction-free boundaries.\n2. Ambient Integration (${secondarySrc ? secondarySrc.title : "Companion Notes"}): Suggests attention can remain fluid as long as tools inform quietly on the periphery.`;
          } else {
            responseText = `Synthesis across active materials in ${currentWorkspace?.title || "workspace"}:\n\n- Working memory bandwidth degrades rapidly when switching context across tools.\n- Calm computing keeps systems peripheral until deliberately summoned.\n- Grounding conclusions in verifiable primary texts eliminates hallucinated claims.`;
          }
        }

        if (style === "concise") {
          responseText = responseText.split("\n\n")[0] || responseText;
        } else if (style === "socratic") {
          responseText += `\n\nReflection Question: How does your current information stack enforce or compromise this boundary between peripheral awareness and focus?`;
        }

        // Citations
        citations.push({
          sourceId: primarySrc.id,
          sourceTitle: primarySrc.title,
          snippet: primarySrc.content.slice(0, 100) + "...",
          timePeriod: primarySrc.timePeriod,
        });

        if (secondarySrc) {
          citations.push({
            sourceId: secondarySrc.id,
            sourceTitle: secondarySrc.title,
            snippet: secondarySrc.content.slice(0, 100) + "...",
            timePeriod: secondarySrc.timePeriod,
          });
        }
      }

      // Model Reasoning Trace
      const reasoningTrace = primarySrc
        ? {
            intent: `Inquiry cross-referencing ${activeList.length} grounded documents under "${persona.title}" persona`,
            sourcesConsulted: activeList.map((s) => `${s.title} (${s.timePeriod || "n.d."})`),
            synthesisSteps: [
              `Queried index using ${config.persona} persona and ${config.responseStyle} output constraint`,
              `Extracted source passages filtered by time period: ${config.timePeriodFilter}`,
              `Preserved verifiable citations; verified against ungrounded hallucinations`,
            ],
            confidence: "high" as const,
          }
        : undefined;

      const aiMsgId = `msg-${Date.now() + 1}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: responseText,
        citations,
        timestamp: "Just now",
        reasoningTrace,
      };

      const finalMessages = [...nextMessages, aiMsg];
      setMessages(finalMessages);
      setExpandedReasoning((prev) => ({ ...prev, [aiMsgId]: true }));
      setIsGenerating(false);
      saveCurrentWorkspaceChanges(undefined, finalMessages);
    }, 450);
  };

  // Studio Generator Functions
  const handleGenerateStudio = (type: "audio" | "guide" | "briefing") => {
    const activeList = sources.filter((s) => selectedSourceIds.has(s.id));
    if (activeList.length === 0) {
      alert("Please select at least one source on the left to synthesize.");
      return;
    }

    if (!rightSidebarOpen) {
      setRightSidebarOpen(true);
    }

    let generatedArtifact: StudioArtifact;

    if (type === "audio") {
      generatedArtifact = {
        type: "audio",
        title: "Audio Overview",
        createdAt: "Generated just now",
        audioDuration: "2 min 14 sec",
        content: `Host A: Welcome to the Fieldnotes Synthesis. Today we're examining core principles across your active sources in ${currentWorkspace?.title || "this workspace"}.\n\nHost B: What stands out immediately across Vance's research is the cognitive ceiling: working memory sustains roughly four discrete concepts before degradation occurs.\n\nHost A: Exactly. And the companion literature from Weiser and Brown argues that the solution is to design tools that live quietly on the periphery until summoned.\n\nHost B: That distinction between 'peripheral awareness' and 'active attention capture' defines calm computing.`,
      };
    } else if (type === "guide") {
      generatedArtifact = {
        type: "guide",
        title: "Study Guide",
        createdAt: "Generated just now",
        content: `## Conceptual Synthesis\nFindings across ${activeList.length} sources regarding working memory limits, notification switching penalties, and calm UI architectures (${activeList.map((s) => s.timePeriod || "n.d.").join(", ")}).\n\n### Core Theses\n- Cognitive Switching Penalty: The delay required to regain peak focus after an unprompted digital interruption.\n- Peripheral Awareness: Interface feedback that exists outside direct foveal focus.\n- Provenance Tracking: Continuous attribution pinning synthetic conclusions to verifiable source text.\n\n### Reflection Prompts\n1. How does your current workflow enforce or violate calm technology principles?\n2. What structural mechanisms prevent hallucinations in grounded research canvases?`,
      };
    } else {
      generatedArtifact = {
        type: "briefing",
        title: "Executive Briefing",
        createdAt: "Generated just now",
        content: `## Strategic Briefing\n**Workspace**: ${currentWorkspace?.title || "Research Canvas"}\n**Sources Synthesized**: ${activeList.map((s) => `${s.title} [${s.timePeriod || "n.d."}]`).join(", ")}\n\n### Key Findings\n1. Interface Switching Overhead: Substantial knowledge work capacity is lost to fragmented communication.\n2. Calm Design Imperative: Platforms adopting spatial, non-modal synthesis report higher analytical throughput.\n\n### Recommendations\n- Implement ambient, canvas-based workflows for analytical synthesis.\n- Enforce direct source citations on all AI-assisted outputs.`,
      };
    }

    setActiveArtifact(generatedArtifact);
    setIsAudioPlaying(false);
    saveCurrentWorkspaceChanges(undefined, undefined, generatedArtifact);
  };

  // Filter sources by search query and time period filter
  const filteredSources = sources.filter((s) => {
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.timePeriod && s.timePeriod.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (config.timePeriodFilter === "contemporary") {
      const year = parseInt(s.timePeriod || "", 10);
      return (year && year >= 2020) || (s.timePeriod?.toLowerCase().includes("contemporary") ?? false);
    }
    if (config.timePeriodFilter === "foundational") {
      const year = parseInt(s.timePeriod || "", 10);
      return (year && year >= 1990 && year < 2020) || false;
    }
    if (config.timePeriodFilter === "historical") {
      const year = parseInt(s.timePeriod || "", 10);
      return (year && year < 1990) || (s.timePeriod?.toLowerCase().includes("classical") ?? false);
    }
    return true;
  });

  if (!isAuthChecked || !currentWorkspace) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <span className="text-sm text-muted-foreground animate-soft-pulse">Opening canvas...</span>
      </div>
    );
  }

  return (
    <div className="relative h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between bg-background text-foreground antialiased select-none">
      {/* 1. TOP HEADER: Quiet, Typographic, Persona & Config Integration */}
      <header className="h-12 border-b border-border/60 bg-background/95 px-5 flex items-center justify-between shrink-0 z-20">
        {/* Left: Navigation breadcrumbs */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            ← Workspaces
          </Link>
          <span className="text-border">/</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {currentWorkspace.category}
          </span>
          <span className="text-border">/</span>

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="text-foreground font-semibold tracking-tight hover:opacity-80 transition-opacity truncate max-w-[180px] sm:max-w-[300px] inline-flex items-center gap-1.5"
            >
              <span>{currentWorkspace.title}</span>
              <span className="text-xs text-muted-foreground font-mono font-normal">▾</span>
            </button>

            {isWorkspaceDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsWorkspaceDropdownOpen(false)}
                />
                <div className="absolute left-0 top-8 z-40 w-72 bg-background border border-border p-3 shadow-xl animate-rise-in space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    All Workspaces
                  </span>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {allWorkspaces.map((ws) => (
                      <Link
                        key={ws.id}
                        to="/workspace/$id"
                        params={{ id: ws.id }}
                        onClick={() => setIsWorkspaceDropdownOpen(false)}
                        className={`flex items-center justify-between py-1.5 px-2 text-xs transition-colors ${
                          ws.id === currentWorkspace.id
                            ? "text-foreground font-semibold bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="truncate">{ws.title}</span>
                        <span className="font-mono text-[10px] opacity-70 shrink-0 ml-2">
                          {ws.sources?.length || 0} src
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border/60 pt-2">
                    <Link
                      to="/"
                      onClick={() => setIsWorkspaceDropdownOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors block"
                    >
                      + Manage all workspaces →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Persona & Model Customization Button */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`text-xs px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1.5 ${
              isConfigOpen
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Persona:</span>
            <span className="font-medium text-foreground">
              {MODEL_PERSONAS.find((p) => p.id === config.persona)?.title}
            </span>
            <span className="text-muted-foreground font-mono text-[10px]">· Customization ▾</span>
          </button>
        </div>

        {/* Right: Panel Toggles & Actions */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`transition-colors ${
              leftSidebarOpen ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sources {leftSidebarOpen ? "[Hide]" : "[Show]"}
          </button>

          <span className="text-border">·</span>

          <button
            type="button"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`transition-colors ${
              rightSidebarOpen ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Studio {rightSidebarOpen ? "[Hide]" : "[Show]"}
          </button>

          <span className="text-border">·</span>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Share
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

      {/* 1.5 INTEGRATED CUSTOMIZATION DRAWER (Persona, Response Style, References, Reasoning Trace, Time Periods) */}
      {isConfigOpen && (
        <div className="border-b border-border/60 bg-secondary/30 px-6 py-3.5 z-10 animate-rise-in">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-4 gap-4 text-xs">
            {/* 1. Model Persona Selector */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Model Persona
              </span>
              <div className="space-y-1">
                {MODEL_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleUpdateConfig({ persona: p.id })}
                    className={`w-full text-left py-0.5 transition-colors block ${
                      config.persona === p.id
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{config.persona === p.id ? "• " : "  "}{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Response Style */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Response Style
              </span>
              <div className="space-y-1">
                {RESPONSE_STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleUpdateConfig({ responseStyle: s.id })}
                    className={`w-full text-left py-0.5 transition-colors block ${
                      config.responseStyle === s.id
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{config.responseStyle === s.id ? "• " : "  "}{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Citations & Reasoning Trace Toggles */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Output Granularity
              </span>
              <div className="space-y-2 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={config.showReferences}
                    onChange={(e) => handleUpdateConfig({ showReferences: e.target.checked })}
                    className="accent-foreground"
                  />
                  <span>Show Citation Links</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={config.showReasoningTrace}
                    onChange={(e) => handleUpdateConfig({ showReasoningTrace: e.target.checked })}
                    className="accent-foreground"
                  />
                  <span>Show Model Reasoning Trace</span>
                </label>
              </div>
            </div>

            {/* 4. Time Period Filter */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Time Period Scope
              </span>
              <div className="space-y-1">
                {TIME_PERIOD_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleUpdateConfig({ timePeriodFilter: f.id })}
                    className={`w-full text-left py-0.5 transition-colors block ${
                      config.timePeriodFilter === f.id
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{config.timePeriodFilter === f.id ? "• " : "  "}{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THREE-COLUMN EDITORIAL CANVASES (Edge-to-Edge, Warm, Boxless) */}
      <div className="flex-1 min-h-0 flex w-full overflow-hidden">
        {/* LEFT COLUMN: Sources Library (Spacious, Editorial Table of Contents) */}
        <aside
          className={`flex flex-col border-r border-border/60 bg-background transition-all duration-200 shrink-0 ${
            leftSidebarOpen ? "w-[290px] sm:w-[320px]" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          {/* Header */}
          <div className="h-10 border-b border-border/50 px-4 flex items-center justify-between text-xs shrink-0">
            <span className="font-mono uppercase tracking-wider text-muted-foreground font-medium">
              Primary Sources ({sources.length})
            </span>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="text-foreground hover:opacity-75 font-medium transition-opacity"
            >
              + Add / Upload
            </button>
          </div>

          {/* Search, Time Period badge & batch toggle */}
          <div className="px-4 py-2.5 border-b border-border/40 space-y-2 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search literature & periods..."
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 outline-hidden py-1"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={handleToggleAllSources}
                className="hover:text-foreground transition-colors"
              >
                {selectedSourceIds.size === sources.length ? "Deselect all" : "Select all"}
              </button>
              <span className="font-mono">{selectedSourceIds.size} active</span>
            </div>
          </div>

          {/* Sources Open List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-border/30">
            {filteredSources.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No matching sources in this period.
              </div>
            ) : (
              filteredSources.map((source, index) => {
                const isSelected = selectedSourceIds.has(source.id);
                const sourceIndex = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={source.id}
                    onClick={() => setReadingSource(source)}
                    className="group py-3 cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Quiet Selection Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSource(source.id, e)}
                        className={`mt-0.5 font-mono text-[11px] transition-colors shrink-0 ${
                          isSelected
                            ? "text-foreground font-bold"
                            : "text-muted-foreground/40 hover:text-muted-foreground"
                        }`}
                        title={isSelected ? "Deselect from context" : "Select into context"}
                      >
                        {isSelected ? `[${sourceIndex}]` : `·${sourceIndex}·`}
                      </button>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className={`text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                              isSelected
                                ? "text-foreground font-medium group-hover:underline underline-offset-4"
                                : "text-muted-foreground line-through opacity-70"
                            }`}
                          >
                            {source.title}
                          </h3>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteSource(source.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-[11px] text-muted-foreground/60 hover:text-destructive transition-opacity"
                            title="Remove source"
                          >
                            remove
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                          <span className="font-mono uppercase">{source.type}</span>
                          {source.timePeriod && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-[10px] text-muted-foreground/90 font-medium">
                                {source.timePeriod}
                              </span>
                            </>
                          )}
                          <span>·</span>
                          <span className="truncate max-w-[120px]">{source.author || source.detail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER COLUMN: Thought Manuscript & Grounded Conversation */}
        <main className="flex-1 min-w-0 flex flex-col justify-between bg-background overflow-hidden relative">
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-12">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Empty Starter Stage */}
              {messages.length <= 1 && (
                <div className="py-8 space-y-6 animate-rise-in">
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
                      The Inquiry · {MODEL_PERSONAS.find((p) => p.id === config.persona)?.title}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground leading-snug">
                      “Reason directly across your sources.”
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                      Every response is synthesized from your {selectedSourceIds.size} active documents with verifiable citations and model reasoning traces.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                      Suggested Inquiries
                    </span>
                    <div className="space-y-1.5">
                      {STARTERS.map((starter, i) => (
                        <button
                          key={starter}
                          onClick={() => handleSendMessage(starter)}
                          className="flex items-center gap-3 w-full text-left py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                          <span className="font-mono text-xs opacity-50">0{i + 1}</span>
                          <span className="group-hover:underline underline-offset-4">{starter}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Manuscript Messages */}
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3 animate-rise-in">
                  {msg.role === "user" ? (
                    <div className="border-b border-border/40 pb-3 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                        <span>INQUIRY</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-base sm:text-lg text-foreground font-normal tracking-tight">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-semibold">SYNTHESIS</span>
                          <span>·</span>
                          <span className="text-muted-foreground/80">
                            {MODEL_PERSONAS.find((p) => p.id === config.persona)?.title}
                          </span>
                        </div>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Model Reasoning Trace Component */}
                      {config.showReasoningTrace && msg.reasoningTrace && (
                        <div className="border-l-2 border-border/70 pl-3 py-1 space-y-1 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedReasoning((prev) => ({
                                ...prev,
                                [msg.id]: !prev[msg.id],
                              }))
                            }
                            className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                          >
                            <span>Reasoning Trace</span>
                            <span className="text-[10px]">{expandedReasoning[msg.id] ? "[-] collapse" : "[+] expand"}</span>
                          </button>

                          {expandedReasoning[msg.id] && (
                            <div className="space-y-1.5 pt-1 text-[11px] text-muted-foreground font-mono leading-relaxed bg-secondary/30 p-2.5 rounded-sm">
                              <div>
                                <span className="text-foreground font-medium">Intent: </span>
                                <span>{msg.reasoningTrace.intent}</span>
                              </div>
                              <div>
                                <span className="text-foreground font-medium">Sources Consulted: </span>
                                <span>{msg.reasoningTrace.sourcesConsulted.join(", ")}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-foreground font-medium">Synthesis Steps:</span>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  {msg.reasoningTrace.synthesisSteps.map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content text */}
                      <div className="text-sm sm:text-base leading-relaxed sm:leading-loose text-foreground/95 whitespace-pre-wrap font-normal">
                        {msg.content}
                      </div>

                      {/* Citations & Reference Links with Time Periods */}
                      {config.showReferences && msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                            References:
                          </span>
                          {msg.citations.map((cite, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const found = sources.find((s) => s.id === cite.sourceId);
                                if (found) setReadingSource(found);
                              }}
                              className="text-xs text-foreground underline underline-offset-4 hover:opacity-75 transition-opacity inline-flex items-center gap-1"
                            >
                              <span>[{i + 1}] {cite.sourceTitle}</span>
                              {cite.timePeriod && (
                                <span className="font-mono text-[10px] text-muted-foreground no-underline">
                                  ({cite.timePeriod})
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="text-xs font-mono text-muted-foreground animate-soft-pulse py-2">
                  Synthesizing across active literature...
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* Clean Boxless Prompt Desk Bar */}
          <div className="shrink-0 border-t border-border/60 bg-background px-6 py-4 md:px-12">
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-3 border-b border-border focus-within:border-foreground transition-colors pb-2"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {selectedSourceIds.size} src
                </span>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Inquire into your active literature..."
                  className="flex-1 bg-transparent py-1 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-hidden"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  className="text-xs font-medium text-foreground hover:opacity-75 disabled:opacity-30 transition-opacity"
                >
                  Send ↵
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2">
                <span>Fieldnotes grounded canvas · {MODEL_PERSONAS.find((p) => p.id === config.persona)?.title}</span>
                <span className="font-mono">Press ↵ to inquire</span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Studio Synthesis (Atelier) */}
        <aside
          className={`flex flex-col border-l border-border/60 bg-background transition-all duration-200 shrink-0 ${
            rightSidebarOpen ? "w-[300px] sm:w-[330px]" : "w-0 overflow-hidden border-l-0"
          }`}
        >
          {/* Header */}
          <div className="h-10 border-b border-border/50 px-4 flex items-center justify-between text-xs shrink-0">
            <span className="font-mono uppercase tracking-wider text-muted-foreground font-medium">
              Studio Synthesis
            </span>
            {activeArtifact && (
              <button
                type="button"
                onClick={() => setActiveArtifact(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Studio Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeArtifact ? (
              <div className="space-y-3 animate-rise-in">
                <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      Artifact
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {activeArtifact.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeArtifact.content);
                      setCopiedArtifact(true);
                      setTimeout(() => setCopiedArtifact(false), 1400);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedArtifact ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Minimal Typographic Audio Player */}
                {activeArtifact.type === "audio" && (
                  <div className="border-b border-border/40 pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                        className="text-xs font-semibold text-foreground hover:opacity-80 transition-opacity"
                      >
                        {isAudioPlaying ? "⏸ Pause Audio" : "▶ Play Overview"}
                      </button>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {activeArtifact.audioDuration}
                      </span>
                    </div>

                    {/* Animated Minimal Soundwave Bars */}
                    <div className="flex items-center gap-1 h-3 pt-1">
                      {[35, 75, 45, 95, 60, 80, 40, 70, 90, 50, 65, 85, 40].map((h, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 bg-foreground/70 transition-all duration-200 ${
                            isAudioPlaying ? "animate-pulse" : "opacity-30"
                          }`}
                          style={{
                            height: isAudioPlaying ? `${h}%` : "30%",
                            animationDelay: `${idx * 80}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Content text */}
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans max-h-[500px] overflow-y-auto pr-1">
                  {activeArtifact.content}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Synthesize across your {selectedSourceIds.size} active documents into publication-ready studio artifacts:
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleGenerateStudio("audio")}
                    className="w-full text-left py-2 border-b border-border/40 hover:border-foreground transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                        I. Audio Overview
                      </h4>
                      <span className="text-xs text-muted-foreground">2 min</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Two-host synthesis discussing key author tensions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateStudio("guide")}
                    className="w-full text-left py-2 border-b border-border/40 hover:border-foreground transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                        II. Study Guide
                      </h4>
                      <span className="text-xs text-muted-foreground">Key concepts</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Definitions, cognitive models, and reflection prompts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateStudio("briefing")}
                    className="w-full text-left py-2 border-b border-border/40 hover:border-foreground transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                        III. Executive Briefing
                      </h4>
                      <span className="text-xs text-muted-foreground">Summary</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Structured findings and strategic takeaways.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MODAL 1: Source Reader (Boxless, Editorial Reading Pane) */}
      {readingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xs p-5 animate-rise-in">
          <div className="w-full max-w-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
                  {readingSource.type} · {readingSource.timePeriod || "Period unstated"}
                </span>
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground mt-1">
                  {readingSource.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {readingSource.author} · Added {readingSource.dateAdded}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReadingSource(null)}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground pt-1"
              >
                Close ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm sm:text-base leading-relaxed sm:leading-loose text-foreground pr-2 font-sans">
              {readingSource.content}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>Source document indexed for synthesis</span>
              <button
                type="button"
                onClick={() => setReadingSource(null)}
                className="text-foreground font-medium underline underline-offset-4"
              >
                Return to canvas →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Source + PC File Upload (Boxless) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xs p-5 animate-rise-in">
          <div className="w-full max-w-md space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
                  Add Material
                </span>
                <h2 className="text-xl font-normal tracking-tight text-foreground mt-0.5">
                  Index literature from PC or text.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel ✕
              </button>
            </div>

            {/* PC File Upload Button Trigger */}
            <div className="border-b border-border/40 pb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 border border-dashed border-border/80 hover:border-foreground/60 transition-colors text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-between"
              >
                <span>{uploadedFileName ? `File selected: ${uploadedFileName}` : "↑ Upload document from your PC (.pdf, .txt, .md, .doc)"}</span>
                <span className="underline underline-offset-2">Browse</span>
              </button>
            </div>

            <form onSubmit={handleAddSourceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  placeholder="e.g. Cognitive Systems & Flow States"
                  className="w-full bg-transparent border-b border-border focus:border-foreground py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                    Author / Origin
                  </label>
                  <input
                    type="text"
                    value={newSourceAuthor}
                    onChange={(e) => setNewSourceAuthor(e.target.value)}
                    placeholder="e.g. Elena Vance"
                    className="w-full bg-transparent border-b border-border focus:border-foreground py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={newSourceTimePeriod}
                    onChange={(e) => setNewSourceTimePeriod(e.target.value)}
                    placeholder="e.g. 1996, 2024, Classical"
                    className="w-full bg-transparent border-b border-border focus:border-foreground py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Source Type
                </label>
                <div className="flex gap-3 text-xs">
                  {(["note", "pdf", "web", "doc"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewSourceType(t)}
                      className={`capitalize transition-colors ${
                        newSourceType === t
                          ? "text-foreground font-semibold border-b border-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Content / Excerpt
                </label>
                <textarea
                  rows={5}
                  value={newSourceContent}
                  onChange={(e) => setNewSourceContent(e.target.value)}
                  placeholder="Paste primary excerpts, notes, or source text..."
                  className="w-full bg-transparent border-b border-border focus:border-foreground py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-hidden transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs sm:text-sm font-medium text-foreground hover:opacity-75 transition-opacity"
                >
                  Index Source →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Share Notebook (Boxless) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xs p-5 animate-rise-in">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
                  Share
                </span>
                <h2 className="text-xl font-normal tracking-tight text-foreground mt-0.5">
                  Quiet grounded link.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Anyone with this link can view and cite your {sources.length} active sources in {currentWorkspace.title}.
            </p>

            <div className="flex items-center gap-2 border-b border-border focus-within:border-foreground py-1">
              <input
                type="text"
                readOnly
                value={`https://fieldnotes.ai/canvas/${currentWorkspace.id}`}
                className="flex-1 bg-transparent font-mono text-xs text-foreground outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://fieldnotes.ai/canvas/${currentWorkspace.id}`);
                  setCopiedShareLink(true);
                  setTimeout(() => setCopiedShareLink(false), 1400);
                }}
                className="text-xs text-foreground font-medium hover:opacity-75 transition-opacity shrink-0"
              >
                {copiedShareLink ? "Copied" : "Copy Link"}
              </button>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
