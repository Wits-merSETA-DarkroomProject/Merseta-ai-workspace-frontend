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
  CitationItem,
  MODEL_PERSONAS,
  RESPONSE_STYLES,
  TIME_PERIOD_FILTERS,
  DEFAULT_WORKSPACE_CONFIG,
  PROTOTYPE_DOCUMENTS,
  getStoredUser,
  setStoredUser,
  getStoredWorkspace,
  getStoredWorkspaces,
  updateStoredWorkspace,
  saveStoredSavedAnswers,
  getStoredSavedAnswers,
} from "@/lib/workspace-store";
import { getStoredTheme, toggleStoredTheme } from "@/lib/theme";
import { InstitutionBranding } from "@/components/mersia/InstitutionBranding";
import { DocumentViewerModal } from "@/components/mersia/DocumentViewerModal";
import { DocumentUploadModal } from "@/components/mersia/DocumentUploadModal";
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Share2,
  Sun,
  Moon,
  Sparkles,
  Play,
  Pause,
  Volume2,
  Copy,
  Check,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Send,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  SlidersHorizontal,
  ExternalLink,
  Bookmark,
  Layers,
  Cpu,
  MoreVertical,
  X,
  FilePlus,
  Radio,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/workspace/$id")({
  head: () => ({
    meta: [
      { title: "Research Notebook — merSIA Intelligence" },
      {
        name: "description",
        content:
          "Evidence-grounded sectoral intelligence canvas with closed document provenance and dual-model consensus.",
      },
      { property: "og:title", content: "Research Notebook — merSIA Intelligence" },
      {
        property: "og:description",
        content:
          "Evidence-grounded sectoral intelligence canvas with closed document provenance and dual-model consensus.",
      },
    ],
  }),
  component: WorkspacePage,
});

const QUICK_PROMPTS = [
  "What artisan trades face critical shortage in the MER sector?",
  "How will the Just Energy Transition impact artisan employment in Mpumalanga?",
  "What are the structural bottlenecks in P1/P2 TVET experiential placements?",
  "Synthesize a 3-point policy summary on mechatronics and manufacturing 4.0",
];

function WorkspacePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceItem | null>(null);
  const [allWorkspaces, setAllWorkspaces] = useState<WorkspaceItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState("");

  // Layout panels
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<"studio" | "inspector" | "notes">("studio");

  // Core Data
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [sourceSearch, setSourceSearch] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<WorkspaceConfig>(DEFAULT_WORKSPACE_CONFIG);

  // Scratchpad Notes
  const [notesContent, setNotesContent] = useState(
    "Key takeaways and strategic policy notes for this research inquiry..."
  );

  // Active Inspector Citation
  const [inspectedCitation, setInspectedCitation] = useState<CitationItem | null>(null);

  // Document Viewer Modal
  const [activeViewerCitation, setActiveViewerCitation] = useState<CitationItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Add Source Modal
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceContent, setNewSourceContent] = useState("");
  const [newSourceType, setNewSourceType] = useState<"pdf" | "web" | "doc" | "note">("note");
  const [newSourceAuthor, setNewSourceAuthor] = useState("");

  // Studio Artifacts
  const [activeArtifact, setActiveArtifact] = useState<StudioArtifact | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Share & Copy feedback
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [savedMessageId, setSavedMessageId] = useState<string | null>(null);

  // Expanded reasoning traces map
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  // Persona dropdown toggle
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 1. Initial Load & Auth
  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);
    setTheme(getStoredTheme());

    const wsList = getStoredWorkspaces();
    setAllWorkspaces(wsList);

    const ws = getStoredWorkspace(id) || wsList[0];
    if (ws) {
      setCurrentWorkspace(ws);
      setWorkspaceTitle(ws.title);
      setSources(ws.sources || PROTOTYPE_DOCUMENTS);
      setSelectedSourceIds(new Set((ws.sources || PROTOTYPE_DOCUMENTS).map((s) => s.id)));
      setMessages(ws.messages || []);
      setConfig(ws.config || DEFAULT_WORKSPACE_CONFIG);

      // Default expand reasoning traces
      const expanded: Record<string, boolean> = {};
      (ws.messages || []).forEach((m) => {
        if (m.reasoningTrace) expanded[m.id] = true;
      });
      setExpandedReasoning(expanded);

      if (ws.artifacts && ws.artifacts.length > 0) {
        setActiveArtifact(ws.artifacts[0] || null);
      } else {
        // Generate default studio artifact
        setActiveArtifact({
          type: "briefing",
          title: "Executive Synthesis Briefing",
          createdAt: "Initialised with workspace",
          content: `## Sector Skills Intelligence Briefing\n**Grounded Corpus**: ${ws.sources?.length || 5} statutory documents\n\n### Core Inquiries Available\n1. Artisan trade shortages (34%+ vacancy rates in mechatronics, toolmaking, and mechanical trades).\n2. Just Transition regional labour shifts in Mpumalanga (6–9 month modular micro-credentialing).\n3. Labour market structural bottlenecks preventing youth TVET placement.`,
        });
      }
    }
    setIsAuthChecked(true);
  }, [id, navigate]);

  // Sync state changes to persistence
  const syncWorkspaceChanges = (
    newSources?: Source[],
    newMessages?: ChatMessage[],
    newArtifact?: StudioArtifact,
    newConfig?: WorkspaceConfig,
    newTitle?: string
  ) => {
    if (!currentWorkspace) return;
    const updated = updateStoredWorkspace(currentWorkspace.id, {
      title: newTitle ?? workspaceTitle,
      sources: newSources ?? sources,
      messages: newMessages ?? messages,
      artifacts: newArtifact
        ? [newArtifact, ...(currentWorkspace.artifacts || []).filter((a) => a.title !== newArtifact.title)]
        : currentWorkspace.artifacts,
      config: newConfig ?? config,
    });
    if (updated) {
      setCurrentWorkspace(updated);
    }
  };

  // Scroll chat to bottom on updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Audio Playback Simulation with Web Speech API
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    let progressInterval: any;

    if (isAudioPlaying && activeArtifact?.type === "audio") {
      window.speechSynthesis.cancel();
      const textToRead = activeArtifact.content
        .replace(/Host [A-B]:/g, "")
        .replace(/[#*`_]/g, "");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.05;
      utterance.onend = () => {
        setIsAudioPlaying(false);
        setAudioProgress(0);
        clearInterval(progressInterval);
      };
      utterance.onerror = () => {
        setIsAudioPlaying(false);
        setAudioProgress(0);
        clearInterval(progressInterval);
      };
      window.speechSynthesis.speak(utterance);

      progressInterval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 500);
    } else {
      window.speechSynthesis.cancel();
      clearInterval(progressInterval);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      clearInterval(progressInterval);
    };
  }, [isAudioPlaying, activeArtifact]);

  const handleToggleTheme = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (!workspaceTitle.trim()) {
      setWorkspaceTitle(currentWorkspace?.title || "Untitled Notebook");
      return;
    }
    syncWorkspaceChanges(undefined, undefined, undefined, undefined, workspaceTitle.trim());
  };

  const handleToggleSourceSelect = (sourceId: string) => {
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(sourceId)) next.delete(sourceId);
      else next.add(sourceId);
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

  const handleCitationClick = (cit: CitationItem) => {
    setInspectedCitation(cit);
    setRightPanelTab("inspector");
    if (!isRightPanelOpen) setIsRightPanelOpen(true);
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim()) return;

    const newSrc: Source = {
      id: `src-custom-${Date.now()}`,
      title: newSourceTitle.trim(),
      detail:
        newSourceType === "pdf"
          ? "PDF · Uploaded Document"
          : newSourceType === "web"
            ? "Web · Online Intelligence"
            : "Notes · Text Excerpt",
      type: newSourceType,
      author: newSourceAuthor.trim() || currentUser?.name || "Researcher",
      year: "2026",
      dateAdded: "Just now",
      content:
        newSourceContent.trim() ||
        "Custom research notes indexed for cross-document synthesis and statutory comparison.",
    };

    const nextSources = [newSrc, ...sources];
    setSources(nextSources);
    setSelectedSourceIds((prev) => new Set(prev).add(newSrc.id));
    setNewSourceTitle("");
    setNewSourceContent("");
    setNewSourceAuthor("");
    setIsAddSourceOpen(false);
    syncWorkspaceChanges(nextSources);
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
    syncWorkspaceChanges(nextSources);
  };

  // Generate grounded AI response
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsGenerating(true);

    const activeList = sources.filter((s) => selectedSourceIds.has(s.id));
    const lower = text.toLowerCase();

    setTimeout(() => {
      let responseText = "";
      const citations: CitationItem[] = [];

      if (activeList.length === 0) {
        responseText =
          "No sources are currently selected in the left panel. Please select one or more verified sector documents to ground this inquiry with empirical provenance.";
      } else if (
        lower.includes("priority") ||
        lower.includes("artisan") ||
        lower.includes("shortage") ||
        lower.includes("trade")
      ) {
        responseText =
          "According to the merSETA Sector Skills Plan 2024/2025, critical skills shortages in the MER sector remain heavily concentrated in core artisan and technical trades [1]. Vacancy rates for mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exceed 34% across primary manufacturing chambers [1]. Furthermore, technological transformation within the automotive and metal engineering sub-sectors necessitates a rapid transition toward hybrid artisan qualifications combining electro-mechanical competencies with digital sensor calibration and telemetry diagnostics [1].";

        citations.push({
          sourceId: "doc-ssp-2024",
          sourceTitle: "merSETA Sector Skills Plan 2024/2025",
          organisation: "merSETA",
          year: "2024",
          page: 42,
          documentType: "Sector Skills Plan",
          snippet:
            "Section 3.4 highlights priority skills lists: mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exhibit vacancy rates exceeding 34% across primary manufacturing chambers.",
          evidenceStatus: "Verified",
          confidenceLevel: "High",
          method: "Statutory employer WSP data aggregation",
          observationPeriod: "2024–2025",
        });
      } else if (
        lower.includes("just transition") ||
        lower.includes("jet") ||
        lower.includes("energy") ||
        lower.includes("mpumalanga")
      ) {
        responseText =
          "Research conducted by Wits REAL and GIZ (2024) indicates that the Just Energy Transition requires an urgent restructuring of vocational training pathways [1]. Phased decommissioning of coal-fired facilities in Mpumalanga directly exposes boilermakers, pipe-fitters, and heavy electrical technicians to employment dislocation. The study establishes that modular learning pathways with accredited micro-credentials enable artisans to bridge into solar photovoltaic, wind turbine, and green hydrogen projects in 6 to 9 months [1]. This aligns with the SANEA Energy Skills Roadmap (2023), which projects 145,000 net new technical and engineering jobs needed by 2030 [2].";

        citations.push(
          {
            sourceId: "doc-jet-2024",
            sourceTitle: "Learning Pathways in the Context of a Just Energy Transition",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 18,
            documentType: "Research Report",
            snippet:
              "Modular learning pathways with accredited micro-credentials allow displaced coal facility artisans to transition into renewable energy project sites within 6 to 9 months, preserving wage security.",
            evidenceStatus: "Verified",
            confidenceLevel: "High",
            method: "Empirical field study & stakeholder interviews",
            observationPeriod: "2024",
          },
          {
            sourceId: "doc-sanea-2023",
            sourceTitle: "South African Energy Skills Roadmap 2023–2030",
            organisation: "SANEA / Wits REAL",
            year: "2023",
            page: 24,
            documentType: "Strategic Roadmap",
            snippet:
              "Cumulative requirement of 145,000 new technical and engineering jobs by 2030 across transmission grid expansion and solar installations.",
            evidenceStatus: "Verified",
            confidenceLevel: "High",
            method: "National energy model forecasting",
            observationPeriod: "2023–2030",
          }
        );
      } else if (
        lower.includes("labour") ||
        lower.includes("youth") ||
        lower.includes("placement") ||
        lower.includes("elma")
      ) {
        responseText =
          "The Employment and Labour Market Analysis (ELMA 2024) demonstrates significant structural polarization in manufacturing employment [1]. Demand for low-skilled manual roles has declined by 14% over the past decade, while demand for certified artisans and mechatronic technicians grew by 19% [1]. The primary structural bottleneck preventing youth absorption into formal apprenticeships remains the acute deficit of employer-hosted P1 and P2 workplace experiential learning placements [1].";

        citations.push({
          sourceId: "doc-elma-2024",
          sourceTitle: "Employment and Labour Market Analysis in South Africa",
          organisation: "Wits REAL / GIZ",
          year: "2024",
          page: 45,
          documentType: "Labour Market Analysis",
          snippet:
            "Demand for low-skilled manual manufacturing labour contracted by 14% while specialized technicians grew by 19%. Primary structural bottleneck remains employer-hosted P1/P2 workplace experiential placements.",
          evidenceStatus: "Verified",
          confidenceLevel: "High",
          method: "Econometric longitudinal analysis",
          observationPeriod: "2024",
        });
      } else {
        const primaryDoc = activeList[0] || PROTOTYPE_DOCUMENTS[0]!;
        responseText = `Based on synthesis across your ${activeList.length} active sources in this workspace, key empirical findings indicate:\n\n1. **Sectoral Modernisation**: Advanced manufacturing Chambers require rapid TVET curriculum alignment with digital diagnostic and automation trades [1].\n2. **Grounded Provenance**: Primary findings directly cross-reference statutory reports (${primaryDoc.title}) without ungrounded hallucination [1].\n3. **Policy Action**: Expansion of discretionary grant allocations toward hybrid mechatronics apprenticeships.`;

        citations.push({
          sourceId: primaryDoc.id,
          sourceTitle: primaryDoc.title,
          organisation: primaryDoc.organisation || "merSETA",
          year: primaryDoc.year || "2024",
          page: 15,
          documentType: primaryDoc.type,
          snippet: primaryDoc.content.slice(0, 220) + "...",
          evidenceStatus: "Verified",
          confidenceLevel: "High",
        });
      }

      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        persona: MODEL_PERSONAS.find((p) => p.id === config.persona)?.title || "Policy Analyst",
        content: responseText,
        timestamp: "Just now",
        citations,
        confidence: {
          score: 93,
          level: "HIGH",
          modelAgreement: { llama: true, deepSeek: true },
          note: "100% grounded in verified statutory documents.",
        },
        reasoningTrace: {
          title: `Thought for 2.6 seconds · Model Reasoning Trace`,
          steps: [
            {
              title: "1. Grounding & Vector Retrieval",
              description: `Extracted relevant chunks from ${activeList.length} active grounded documents.`,
              status: "verified",
            },
            {
              title: "2. Empirical Synthesis",
              description: "Cross-validated claim boundaries with verified empirical alignment.",
              status: "verified",
            },
            {
              title: "3. Page-Level Attribution",
              description: `Mapped primary assertions to verified statutory page citations.`,
              status: "verified",
            },
          ],
        },
      };

      const updated = [...nextMessages, aiMsg];
      setMessages(updated);
      setExpandedReasoning((prev) => ({ ...prev, [aiMsgId]: true }));
      setIsGenerating(false);
      syncWorkspaceChanges(undefined, updated);
    }, 550);
  };

  // Studio Artifact Generation
  const handleGenerateStudio = (type: "audio" | "guide" | "briefing") => {
    const activeList = sources.filter((s) => selectedSourceIds.has(s.id));
    if (activeList.length === 0) {
      alert("Please select at least one source on the left to synthesize.");
      return;
    }

    if (!isRightPanelOpen) setIsRightPanelOpen(true);
    setRightPanelTab("studio");

    let artifact: StudioArtifact;
    if (type === "audio") {
      artifact = {
        type: "audio",
        title: "Deep Dive Audio Overview",
        createdAt: "Generated just now",
        audioDuration: "2 min 30 sec",
        content: `Host A: Welcome to the merSIA Sector Deep Dive. Today we're reviewing the evidence regarding artisan shortages and the Just Energy Transition in South Africa.\n\nHost B: What stands out across the merSETA Sector Skills Plan is the vacancy intensity: mechanical fitters, millwrights, and mechatronics technicians face vacancy rates over 34%.\n\nHost A: Exactly. And the Wits REAL research shows that for workers facing coal facility decommissioning in Mpumalanga, 6 to 9 month modular micro-credentials can bridge them into renewable energy projects.\n\nHost B: This confirms that rapid, targeted qualification adaptation is the key structural lever.`,
      };
    } else if (type === "guide") {
      artifact = {
        type: "guide",
        title: "TVET Curriculum & Skills Guide",
        createdAt: "Generated just now",
        content: `## TVET & Artisan Alignment Guide\n**Corpus Sources**: ${activeList.map((s) => s.title).join(", ")}\n\n### Core Qualification Priorities\n- **Hybrid Mechatronics**: Integrating PLC diagnostics with hydraulic systems.\n- **Renewable Energy Transition**: Solar PV installation and wind turbine maintenance micro-credentials.\n- **P1/P2 Experiential Placements**: Subsidised workplace host partnerships to alleviate the absorption bottleneck.`,
      };
    } else {
      artifact = {
        type: "briefing",
        title: "Statutory Executive Synthesis",
        createdAt: "Generated just now",
        content: `## Executive Briefing for Sector Planners\n**Notebook**: ${workspaceTitle}\n**Confidence**: High (Dual-Model Verified)\n\n### Strategic Findings\n1. **Artisan Vacancy Pressure**: 34%+ vacancy rate in core mechanical and tooling chambers.\n2. **JET Employment Opportunity**: 145,000 net new energy jobs projected by 2030.\n3. **TVET Experiential Gap**: Immediate SETA intervention required for P1/P2 placement subsidies.`,
      };
    }

    setActiveArtifact(artifact);
    setIsAudioPlaying(false);
    syncWorkspaceChanges(undefined, undefined, artifact);
  };

  // Copy Message Content
  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedMessageId(msg.id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Save Message to Pinned Findings
  const handleSaveToFindings = (msg: ChatMessage) => {
    const existing = getStoredSavedAnswers();
    const newSaved = {
      id: `ans-${Date.now()}`,
      question: "Grounded Synthesis Query",
      answerSnippet: msg.content.slice(0, 150) + "...",
      fullAnswer: msg.content,
      persona: msg.persona || "Policy Analyst",
      confidenceScore: msg.confidence?.score || 92,
      savedAt: "Just now",
      sources: msg.citations?.map((c) => c.sourceTitle) || [sources[0]?.title || "merSETA Corpus"],
      tags: ["Synthesized", workspaceTitle],
    };
    saveStoredSavedAnswers([newSaved, ...existing]);
    setSavedMessageId(msg.id);
    setTimeout(() => setSavedMessageId(null), 2000);
  };

  // Filter sources
  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      s.content.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  if (!isAuthChecked || !currentWorkspace) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-canvas text-ink">
        <span className="text-xs text-muted-text font-mono animate-pulse">
          Opening research notebook...
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-canvas text-ink antialiased selection:bg-gold/20 selection:text-ink">
      
      {/* 1. TOP MINIMALIST HEADER */}
      <header className="h-13 border-b border-line-soft bg-surface/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
        
        {/* Left: Back Link & Editable Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-text hover:text-ink transition-colors font-medium shrink-0 px-2 py-1 rounded-lg hover:bg-surface-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspaces</span>
          </Link>

          <div className="h-4 w-px bg-line-soft shrink-0" />

          {/* Inline Editable Title */}
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={workspaceTitle}
              onChange={(e) => setWorkspaceTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setIsEditingTitle(false);
                  setWorkspaceTitle(currentWorkspace.title);
                }
              }}
              className="text-xs sm:text-sm font-semibold text-ink bg-surface-muted px-2 py-0.5 rounded-md border border-gold/40 outline-hidden max-w-xs sm:max-w-md"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="text-xs sm:text-sm font-semibold text-ink hover:text-gold transition-colors truncate max-w-[160px] sm:max-w-xs md:max-w-md text-left flex items-center gap-1.5 group cursor-pointer"
              title="Click to rename notebook"
            >
              <span className="truncate">{workspaceTitle}</span>
              <span className="text-[10px] text-muted-text opacity-0 group-hover:opacity-100 font-mono transition-opacity">
                ✎
              </span>
            </button>
          )}

          <span className="hidden lg:inline-block px-2 py-0.5 rounded-full bg-surface-muted text-[10px] font-mono text-gold border border-gold/20">
            {currentWorkspace.category}
          </span>
        </div>

        {/* Center: Grounding Context Signal & Persona Pill */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-muted/60 border border-line-soft text-muted-text">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-ink font-medium">
              {selectedSourceIds.size}/{sources.length} sources grounded
            </span>
          </div>

          {/* Persona selector (Click to open & select) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPersonaOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                isPersonaOpen
                  ? "border-gold text-gold bg-gold/10 font-medium"
                  : "border-line-soft bg-surface-muted/40 hover:bg-surface-muted text-ink"
              }`}
            >
              <span>{MODEL_PERSONAS.find((p) => p.id === config.persona)?.title}</span>
              <ChevronDown
                className={`w-3 h-3 text-muted-text transition-transform duration-200 ${
                  isPersonaOpen ? "rotate-180 text-gold" : ""
                }`}
              />
            </button>

            {isPersonaOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsPersonaOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1.5 w-64 rounded-xl border border-line bg-surface-elevated p-1.5 shadow-2xl z-50 animate-in fade-in">
                  <p className="px-2.5 py-1 text-[10px] font-mono uppercase text-muted-text">
                    Model Persona
                  </p>
                  {MODEL_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const next = { ...config, persona: p.id };
                        setConfig(next);
                        syncWorkspaceChanges(undefined, undefined, undefined, next);
                        setIsPersonaOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        config.persona === p.id
                          ? "bg-navy/40 text-gold font-medium"
                          : "text-muted-text hover:text-ink hover:bg-surface-muted"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-ink">{p.title}</div>
                        <div className="text-[10px] text-muted-text line-clamp-1">{p.description}</div>
                      </div>
                      {config.persona === p.id && <Check className="w-3.5 h-3.5 text-gold shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Layout Toggles, Theme, Share, User Profile */}
        <div className="flex items-center gap-2">
          {/* Left panel toggle */}
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLeftPanelOpen
                ? "border-gold/40 text-gold bg-gold/5"
                : "border-line-soft text-muted-text hover:text-ink"
            }`}
            title={isLeftPanelOpen ? "Hide sources panel" : "Show sources panel"}
          >
            {isLeftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          {/* Right studio toggle */}
          <button
            type="button"
            onClick={() => setIsRightPanelOpen((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isRightPanelOpen
                ? "border-gold/40 text-gold bg-gold/5"
                : "border-line-soft text-muted-text hover:text-ink"
            }`}
            title={isRightPanelOpen ? "Hide studio panel" : "Show studio panel"}
          >
            {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg border border-line-soft text-muted-text hover:text-ink transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-soft hover:border-gold/40 text-xs font-medium text-ink bg-surface-muted/50 hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CANVAS BODY */}
      <div className="flex-1 min-h-0 flex relative overflow-hidden">
        
        {/* LEFT PANEL: NOTEBOOKLM SOURCES */}
        {isLeftPanelOpen && (
          <aside className="w-72 sm:w-80 border-r border-line-soft bg-surface/40 flex flex-col shrink-0 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-3.5 border-b border-line-soft flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                  Sources ({sources.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSourceOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy hover:bg-navy-soft text-white text-[11px] font-medium transition-colors border border-line-soft cursor-pointer"
              >
                <Plus className="w-3 h-3 text-gold" />
                <span>Add</span>
              </button>
            </div>

            {/* Search & Select All */}
            <div className="p-3 border-b border-line-soft/60 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-text" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  placeholder="Filter sources..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-line-soft bg-surface-muted/40 text-xs text-ink placeholder:text-muted-text/50 outline-hidden focus:border-gold/40"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-text px-1">
                <button
                  type="button"
                  onClick={handleToggleAllSources}
                  className="hover:text-ink transition-colors cursor-pointer"
                >
                  {selectedSourceIds.size === sources.length ? "Deselect all" : "Select all"}
                </button>
                <span className="font-mono text-[10px]">
                  {selectedSourceIds.size} active in prompt
                </span>
              </div>
            </div>

            {/* Source List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {filteredSources.map((source) => {
                const isSelected = selectedSourceIds.has(source.id);
                return (
                  <div
                    key={source.id}
                    onClick={() => openDocumentViewer(source)}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold/30 bg-surface/90 shadow-xs"
                        : "border-line-soft/60 bg-surface/30 opacity-70 hover:opacity-100 hover:bg-surface/60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleSourceSelect(source.id);
                        }}
                        className="mt-0.5 rounded border-line-soft text-gold focus:ring-gold cursor-pointer"
                      />

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-ink group-hover:text-gold transition-colors leading-snug line-clamp-2">
                          {source.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-muted-text">
                          <span>{source.organisation || "merSETA"}</span>
                          <span>·</span>
                          <span>{source.year || "2024"}</span>
                          {source.pageCount && (
                            <>
                              <span>·</span>
                              <span>{source.pageCount}p</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Delete custom source button */}
                      {source.id.startsWith("src-custom-") && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSource(source.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-text hover:text-red-400 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER PANEL: OPENAI CHAT & SYNTHESIS CANVAS */}
        <main className="flex-1 min-w-0 flex flex-col bg-canvas relative">
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* If no user messages yet: Starter Prompts */}
              {messages.length <= 1 && (
                <div className="py-6 space-y-4">
                  <div className="text-center space-y-1.5">
                    <h2 className="text-lg sm:text-xl font-semibold text-ink">
                      What would you like to synthesize?
                    </h2>
                    <p className="text-xs text-muted-text">
                      Grounded strictly in verified sector skills documentation and research monographs.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                    {QUICK_PROMPTS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="text-left p-3 rounded-xl border border-line-soft hover:border-gold/40 bg-surface/40 hover:bg-surface/80 text-xs text-muted-text hover:text-ink transition-all flex items-center justify-between gap-2 group cursor-pointer"
                      >
                        <span className="line-clamp-2">{q}</span>
                        <Send className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Message List */}
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-2 animate-in fade-in ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Message Bubble */}
                    {isUser ? (
                      <div className="max-w-xl rounded-2xl rounded-tr-xs bg-navy/60 border border-gold/20 px-4 py-2.5 text-xs sm:text-sm text-ink leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full space-y-3">
                        {/* Assistant Header: Clean Typography */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gold font-semibold text-xs tracking-tight">merSIA</span>
                          <span className="text-muted-text/50">·</span>
                          <span className="text-[11px] font-mono text-muted-text font-medium">
                            {msg.persona || "Policy Analyst"}
                          </span>
                          <span className="text-muted-text/40">·</span>
                          <span className="text-[11px] font-mono text-muted-text/60">{msg.timestamp}</span>
                        </div>

                        {/* Collapsible Reasoning Trace (OpenAI / DeepSeek Style - Clean, No generic icons) */}
                        {msg.reasoningTrace && (
                          <div className="rounded-xl overflow-hidden bg-surface-muted/20 border border-line-soft/50 shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedReasoning((prev) => ({
                                  ...prev,
                                  [msg.id]: !prev[msg.id],
                                }))
                              }
                              className="w-full px-3.5 py-1.5 hover:bg-surface-muted/50 flex items-center justify-between text-xs text-muted-text transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold/80" />
                                <span className="font-mono text-[11px] text-muted-text font-medium hover:text-ink transition-colors">
                                  {msg.reasoningTrace.title || "Thought for 2.4s · Model Reasoning Trace"}
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-muted-text transition-transform duration-200 ${
                                  expandedReasoning[msg.id] ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {expandedReasoning[msg.id] && (
                              <div className="px-3.5 py-3 border-t border-line-soft/40 space-y-2 text-[11px] text-muted-text bg-surface-muted/10">
                                {msg.reasoningTrace.intent && (
                                  <div className="pb-1 text-[11px] text-ink/90 font-mono">
                                    <span className="text-gold font-semibold uppercase text-[10px] mr-1.5">Intent:</span>
                                    {msg.reasoningTrace.intent}
                                  </div>
                                )}
                                {msg.reasoningTrace.steps?.map((step, sIdx) => (
                                  <div key={sIdx} className="pl-2.5 border-l-2 border-gold/30 space-y-0.5">
                                    <p className="font-semibold text-ink text-[11px] font-mono">{step.title}</p>
                                    <p className="text-muted-text leading-relaxed">{step.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Response Text with interactive citations */}
                        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line space-y-2 font-normal">
                          {msg.content}
                        </div>

                        {/* Citations Preview Cards */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="pt-1 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-muted-text uppercase">
                              Citations:
                            </span>
                            {msg.citations.map((cit, cIdx) => (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => handleCitationClick(cit)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-muted/60 hover:bg-surface-muted border border-gold/30 text-[11px] text-ink hover:text-gold transition-colors font-medium cursor-pointer"
                              >
                                <Bookmark className="w-3 h-3 text-gold" />
                                <span>[{cIdx + 1}] {cit.sourceTitle} (p. {cit.page || 1})</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message Action Toolbar with Clean Consensus text */}
                        <div className="flex items-center gap-3 pt-1 border-t border-line-soft/30 text-xs text-muted-text">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg)}
                            className="hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedMessageId === msg.id ? "Copied" : "Copy"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveToFindings(msg)}
                            className="hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {savedMessageId === msg.id ? (
                              <Check className="w-3 h-3 text-gold" />
                            ) : (
                              <Bookmark className="w-3 h-3" />
                            )}
                            <span>{savedMessageId === msg.id ? "Saved to Notes" : "Save finding"}</span>
                          </button>

                          {msg.confidence && (
                            <span className="text-[11px] font-mono text-muted-text/80 pl-2 border-l border-line-soft/60">
                              {msg.confidence.score}% Consensus
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleGenerateStudio("audio")}
                            className="hover:text-gold transition-colors flex items-center gap-1 cursor-pointer ml-auto text-gold font-medium"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Audio Overview</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Generating Animation */}
              {isGenerating && (
                <div className="flex items-center gap-3 py-3 text-xs text-muted-text animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                  <span>Synthesizing sector evidence across {selectedSourceIds.size} grounded documents...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* DOCKED OPENAI-STYLE INPUT BAR */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-canvas via-canvas/90 to-transparent shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-2xl border border-line-soft/80 bg-surface/90 backdrop-blur-xl p-2 shadow-2xl focus-within:border-gold/40 focus-within:ring-1 focus-within:ring-gold/30 transition-all">
                
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask a question across ${selectedSourceIds.size} active documents (e.g. artisan vacancies, Just Transition pathways)...`}
                  className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-ink placeholder:text-muted-text/50 outline-hidden resize-none"
                />

                {/* Bottom Bar inside Input */}
                <div className="flex items-center justify-between pt-1 px-2 border-t border-line-soft/40">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{selectedSourceIds.size} Sources Grounded</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isGenerating}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      inputValue.trim() && !isGenerating
                        ? "bg-navy hover:bg-navy-soft text-gold shadow-md"
                        : "bg-surface-muted text-muted-text/40 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-center text-[10px] text-muted-text/60 mt-2 font-mono">
                merSIA outputs are strictly verified against statutory sector planning documentation.
              </p>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: NOTEBOOKLM STUDIO & EVIDENCE INSPECTOR */}
        {isRightPanelOpen && (
          <aside className="w-80 sm:w-96 border-l border-line-soft bg-surface/40 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            {/* Tab Selector */}
            <div className="h-11 px-3 border-b border-line-soft flex items-center justify-between gap-1 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRightPanelTab("studio")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    rightPanelTab === "studio"
                      ? "bg-surface text-gold border border-gold/30"
                      : "text-muted-text hover:text-ink"
                  }`}
                >
                  Studio
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("inspector")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    rightPanelTab === "inspector"
                      ? "bg-surface text-gold border border-gold/30"
                      : "text-muted-text hover:text-ink"
                  }`}
                >
                  Evidence
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("notes")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    rightPanelTab === "notes"
                      ? "bg-surface text-gold border border-gold/30"
                      : "text-muted-text hover:text-ink"
                  }`}
                >
                  Notes
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsRightPanelOpen(false)}
                className="p-1 text-muted-text hover:text-ink rounded-md"
              >
                ✕
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {rightPanelTab === "studio" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                      Studio Generators
                    </h3>
                    <p className="text-[11px] text-muted-text mt-0.5">
                      Synthesize active sources into executive artifacts.
                    </p>
                  </div>

                  {/* Generator Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateStudio("audio")}
                      className="p-2.5 rounded-xl border border-line-soft hover:border-gold/40 bg-surface/50 hover:bg-surface text-center space-y-1 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-gold mx-auto" />
                      <span className="text-[10px] font-semibold text-ink block">Audio Overview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenerateStudio("briefing")}
                      className="p-2.5 rounded-xl border border-line-soft hover:border-gold/40 bg-surface/50 hover:bg-surface text-center space-y-1 transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-gold mx-auto" />
                      <span className="text-[10px] font-semibold text-ink block">Exec Briefing</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenerateStudio("guide")}
                      className="p-2.5 rounded-xl border border-line-soft hover:border-gold/40 bg-surface/50 hover:bg-surface text-center space-y-1 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400 mx-auto" />
                      <span className="text-[10px] font-semibold text-ink block">TVET Guide</span>
                    </button>
                  </div>

                  {/* Active Artifact Display */}
                  {activeArtifact && (
                    <div className="rounded-2xl border border-line-soft bg-surface/80 p-4 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-navy text-[10px] font-mono text-gold uppercase tracking-wider">
                          {activeArtifact.title}
                        </span>
                        <span className="text-[10px] text-muted-text font-mono">
                          {activeArtifact.createdAt}
                        </span>
                      </div>

                      {/* Audio Player Card if type is Audio */}
                      {activeArtifact.type === "audio" && (
                        <div className="p-3 rounded-xl bg-navy/40 border border-gold/20 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setIsAudioPlaying((prev) => !prev)}
                              className="w-8 h-8 rounded-full bg-gold hover:bg-gold-light text-canvas flex items-center justify-center transition-colors cursor-pointer"
                            >
                              {isAudioPlaying ? (
                                <Pause className="w-4 h-4 fill-canvas" />
                              ) : (
                                <Play className="w-4 h-4 fill-canvas ml-0.5" />
                              )}
                            </button>
                            <span className="text-xs font-mono text-gold font-medium">
                              {isAudioPlaying ? "Playing Synthesis..." : activeArtifact.audioDuration}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                            <div
                              className="h-full bg-gold transition-all duration-300"
                              style={{ width: `${isAudioPlaying ? audioProgress : 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Content Preview */}
                      <div className="text-xs text-muted-text whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto font-light">
                        {activeArtifact.content}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {rightPanelTab === "inspector" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                      Citation Provenance Inspector
                    </h3>
                    <p className="text-[11px] text-muted-text mt-0.5">
                      Verify line-by-line statutory excerpt and page boundary.
                    </p>
                  </div>

                  {inspectedCitation ? (
                    <div className="rounded-2xl border border-gold/30 bg-surface/80 p-4 space-y-3">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                          Verified Statutory Text
                        </span>
                        <h4 className="text-xs font-semibold text-ink pt-1">
                          {inspectedCitation.sourceTitle}
                        </h4>
                        <p className="text-[10px] text-muted-text font-mono">
                          Page {inspectedCitation.page || 1} · {inspectedCitation.organisation} ({inspectedCitation.year})
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-muted/60 border border-line-soft text-xs text-ink leading-relaxed font-serif italic">
                        "{inspectedCitation.snippet}"
                      </div>

                      {inspectedCitation.method && (
                        <div className="text-[10px] text-muted-text space-y-0.5">
                          <span className="font-semibold text-ink block">Research Methodology:</span>
                          <span>{inspectedCitation.method}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-text border border-dashed border-line-soft rounded-2xl">
                      Click any citation pill [1] in the chat to inspect its exact verified statutory text here.
                    </div>
                  )}
                </div>
              )}

              {rightPanelTab === "notes" && (
                <div className="space-y-3 flex flex-col h-full">
                  <div>
                    <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                      Research Scratchpad
                    </h3>
                    <p className="text-[11px] text-muted-text mt-0.5">
                      Personal notes auto-saved with this workspace.
                    </p>
                  </div>

                  <textarea
                    rows={14}
                    value={notesContent}
                    onChange={(e) => setNotesContent(e.target.value)}
                    placeholder="Type personal research memos, policy actions, or meeting notes..."
                    className="w-full flex-1 p-3 rounded-xl border border-line-soft bg-surface-muted/40 text-xs text-ink placeholder:text-muted-text/50 outline-hidden focus:border-gold/40 resize-none font-sans leading-relaxed"
                  />
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 3. MODALS */}
      
      {/* Unified Document Upload Modal (Local, Links, Cloud, Notes) */}
      <DocumentUploadModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={(newSrc) => {
          const nextSources = [newSrc, ...sources];
          setSources(nextSources);
          setSelectedSourceIds((prev) => new Set(prev).add(newSrc.id));
          syncWorkspaceChanges(nextSources);
        }}
      />

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface-elevated p-6 shadow-2xl space-y-4 animate-rise-in">
            <div className="flex items-center justify-between border-b border-line-soft pb-2.5">
              <h3 className="text-sm font-semibold text-ink">Share Research Notebook</h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs text-muted-text hover:text-ink"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-text leading-relaxed">
              Anyone with this institutional link can view this notebook with grounded provenance.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-muted-text truncate font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }
                }}
                className="px-3 h-9 rounded-xl bg-navy text-white text-xs font-medium shrink-0"
              >
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        citation={activeViewerCitation}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}
