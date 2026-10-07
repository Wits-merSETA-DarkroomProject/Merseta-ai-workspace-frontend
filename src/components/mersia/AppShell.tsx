import React, { useState, useEffect } from "react";
import { Sidebar, NavViewId } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";
import { SearchDialog } from "./SearchDialog";
import { AskMersiaView } from "./AskMersiaView";
import { DashboardView } from "./DashboardView";
import { DocumentsView } from "./DocumentsView";
import { EvidenceExplorerView } from "./EvidenceExplorerView";
import { SavedAnswersView } from "./SavedAnswersView";
import { ReasoningTracesView } from "./ReasoningTracesView";
import { AboutView } from "./AboutView";
import { SystemStatusView } from "./SystemStatusView";
import { SettingsView } from "./SettingsView";
import { DocumentViewerModal } from "./DocumentViewerModal";
import {
  ChatMessage,
  CitationItem,
  UserSession,
  WorkspaceConfig,
  ModelPersonaId,
  ReferenceStyleId,
  TimePeriodFilterId,
  PROTOTYPE_DOCUMENTS,
  INITIAL_MESSAGES,
  getStoredUser,
  setStoredUser,
  getStoredMessages,
  saveStoredMessages,
  getStoredConfig,
  saveStoredConfig,
  getStoredSavedAnswers,
  saveStoredSavedAnswers,
  SavedAnswer,
} from "@/lib/workspace-store";
import { useNavigate } from "@tanstack/react-router";

interface AppShellProps {
  initialView?: NavViewId;
}

export const AppShell: React.FC<AppShellProps> = ({ initialView = "ask" }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Layout states
  const [currentView, setCurrentView] = useState<NavViewId>(initialView);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Document Viewer Modal
  const [activeViewerCitation, setActiveViewerCitation] = useState<CitationItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Data states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [config, setConfig] = useState<WorkspaceConfig>(getStoredConfig());
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>(getStoredSavedAnswers());

  // 1. Auth check
  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCurrentUser(user);
    setMessages(getStoredMessages());
    setConfig(getStoredConfig());
    setSavedAnswers(getStoredSavedAnswers());
    setIsAuthChecked(true);

    // Listen for global storage events
    const handleMessagesUpdate = () => setMessages(getStoredMessages());
    const handleConfigUpdate = () => setConfig(getStoredConfig());
    const handleSavedUpdate = () => setSavedAnswers(getStoredSavedAnswers());

    window.addEventListener("mersia_messages_updated", handleMessagesUpdate);
    window.addEventListener("mersia_config_updated", handleConfigUpdate);
    window.addEventListener("mersia_saved_answers_updated", handleSavedUpdate);

    // Keyboard shortcut for search (⌘K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mersia_messages_updated", handleMessagesUpdate);
      window.removeEventListener("mersia_config_updated", handleConfigUpdate);
      window.removeEventListener("mersia_saved_answers_updated", handleSavedUpdate);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleSignOut = () => {
    setStoredUser(null);
    navigate({ to: "/login" });
  };

  const handleNewInquiry = () => {
    setMessages(INITIAL_MESSAGES);
    saveStoredMessages(INITIAL_MESSAGES);
    setCurrentView("ask");
  };

  // Generate realistic sector response grounded strictly in the 5 prototype documents
  const handleSendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: "Just now",
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveStoredMessages(updated);
    setIsGenerating(true);

    // Simulated RAG pipeline referencing the 5 prototype texts
    setTimeout(() => {
      let content = "";
      let citations: CitationItem[] = [];
      const lower = trimmed.toLowerCase();

      if (
        lower.includes("priority") ||
        lower.includes("priorities") ||
        lower.includes("artisan") ||
        lower.includes("shortage")
      ) {
        content =
          "According to the merSETA Sector Skills Plan 2024/2025, critical skills shortages in the MER sector remain heavily concentrated in core artisan and technical trades [1]. Vacancy rates for mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exceed 34% across primary manufacturing chambers [1]. Furthermore, technological transformation within the automotive and metal engineering sub-sectors necessitates a rapid transition toward hybrid artisan qualifications combining electro-mechanical competencies with digital sensor calibration and telemetry diagnostics [1].";

        citations = [
          {
            sourceId: "doc-ssp-2024",
            sourceTitle: "merSETA Sector Skills Plan 2024/2025",
            organisation: "merSETA",
            year: "2024",
            page: 42,
            documentType: "Sector Skills Plan",
            snippet:
              "Section 3.4 highlights priority skills lists: mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exhibit vacancy rates exceeding 34% across primary manufacturing chambers.",
          },
        ];
      } else if (
        lower.includes("energy") ||
        lower.includes("jet") ||
        lower.includes("transition") ||
        lower.includes("renewable")
      ) {
        content =
          "Research conducted by Wits REAL and GIZ (2024) indicates that the Just Energy Transition requires an urgent restructuring of vocational training pathways [1]. Phased decommissioning of coal-fired facilities in Mpumalanga directly exposes boilermakers, pipe-fitters, and heavy electrical technicians to employment dislocation. The study establishes that modular learning pathways with accredited micro-credentials enable artisans to bridge into solar photovoltaic, wind turbine, and green hydrogen projects in 6 to 9 months [1]. This aligns with the SANEA Energy Skills Roadmap (2023), which projects 145,000 net new technical and engineering jobs needed by 2030 [2].";

        citations = [
          {
            sourceId: "doc-jet-2024",
            sourceTitle: "Learning Pathways in the Context of a Just Energy Transition",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 18,
            documentType: "Research Report",
            snippet:
              "Modular learning pathways with accredited micro-credentials allow displaced artisans to transition into renewable energy project sites within 6 to 9 months, preserving wage security.",
          },
          {
            sourceId: "doc-sanea-2023",
            sourceTitle: "South African Energy Skills Roadmap",
            organisation: "SANEA / Wits REAL",
            year: "2023",
            page: 24,
            documentType: "Strategic Roadmap",
            snippet:
              "South Africa's energy roadmap projects a cumulative requirement of 145,000 new technical and engineering jobs by 2030 across transmission expansion and commercial installations.",
          },
        ];
      } else if (
        lower.includes("labour") ||
        lower.includes("employment") ||
        lower.includes("trend") ||
        lower.includes("polarization")
      ) {
        content =
          "The Employment and Labour Market Analysis in South Africa (Wits REAL / GIZ, 2024) documents pronounced occupational polarization across industrial manufacturing nodes [1]. Low-skilled manual manufacturing occupations contracted by 14% over the preceding decade, whereas demand for specialized certified technicians and quality engineers grew by 19% [1]. The primary structural bottleneck preventing youth absorption into formal apprenticeships remains the availability of employer-hosted P1 and P2 workplace experiential placements [1].";

        citations = [
          {
            sourceId: "doc-elma-2024",
            sourceTitle: "Employment and Labour Market Analysis in South Africa",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 31,
            documentType: "Labour Market Analysis",
            snippet:
              "Demand for low-skilled manual manufacturing labour has contracted by 14% over the preceding decade, while demand for specialized technicians, quality engineers, and certified trades has grown by 19%.",
          },
        ];
      } else {
        content =
          "Cross-document synthesis across the 5 prototype MER sector texts reveals three overarching structural imperatives:\n\n1. Technical Artisan Supply: Critical vacancies persist in mechanical fitters and millwrights, compounded by P1/P2 workplace experiential learning bottlenecks [1].\n2. Just Transition Re-Skilling: Coal facility transitions require rapid 6–9 month modular micro-credentialing into renewable and green hydrogen infrastructure [2].\n3. Manufacturing 4.0 Integration: Automotive assembly and metal fabrication demand hybrid trades bridging mechanical assembly with digital diagnostics telemetry [1].";

        citations = [
          {
            sourceId: "doc-ssp-2024",
            sourceTitle: "merSETA Sector Skills Plan 2024/2025",
            organisation: "merSETA",
            year: "2024",
            page: 12,
            documentType: "Sector Skills Plan",
            snippet:
              "The 2024/25 Sector Skills Plan mandates a pivot toward hybrid qualifications combining classic electro-mechanical artisan trades with digital diagnostics telemetry.",
          },
          {
            sourceId: "doc-jet-2024",
            sourceTitle: "Learning Pathways in the Context of a Just Energy Transition",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 7,
            documentType: "Research Report",
            snippet:
              "The primary challenge is re-skilling boiler-makers, pipe-fitters, and electrical technicians into solar photovoltaic, wind turbine maintenance, and green hydrogen infrastructure trades.",
          },
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: "Just now",
        persona:
          config.persona === "policy-analyst"
            ? "Policy Analyst"
            : config.persona === "researcher"
              ? "Researcher"
              : config.persona === "data-scientist"
                ? "Data Scientist"
                : "Educator",
        confidence: {
          score: 87,
          level: "HIGH",
          modelAgreement: { llama: true, deepSeek: true },
          note: "Confidence reflects agreement between independently generated model responses. (Prototype)",
        },
        citations,
        reasoningTrace: {
          title: "Sector Cognitive Inference Trace",
          disclaimer: "Illustrative prototype — Bayesian reasoning layer not yet operational.",
          steps: [
            {
              title: "Macro Industrial Finding",
              description:
                "Extracted empirical employment and vacancy trends from primary statutory corpus.",
              status: "verified",
            },
            {
              title: "Occupational Demand Derivation",
              description:
                "Mapped shift from routine mechanical assembly toward digital diagnostics & clean-energy trades.",
              status: "derived",
            },
            {
              title: "Institutional Recommendation",
              description:
                "Formulated discretionary funding priority for TVET modular experiential learning pathways.",
              status: "prototype",
            },
          ],
        },
      };

      const finalMessages = [...updated, assistantMsg];
      setMessages(finalMessages);
      saveStoredMessages(finalMessages);
      setIsGenerating(false);
    }, 2800);
  };

  const handleSaveAnswer = (msg: ChatMessage) => {
    const newAnswer: SavedAnswer = {
      id: `saved-${Date.now()}`,
      question: messages[messages.length - 2]?.content || "Sector Research Finding",
      answerSnippet: msg.content.slice(0, 160) + "...",
      fullAnswer: msg.content,
      savedAt: "Just now",
      persona: msg.persona || "Policy Analyst",
      confidenceScore: msg.confidence?.score || 87,
      sources: msg.citations?.map((c) => c.sourceTitle) || ["merSETA Sector Skills Plan"],
      tags: ["Sector Intelligence", "Verified Corpus"],
    };

    const updated = [newAnswer, ...savedAnswers];
    setSavedAnswers(updated);
    saveStoredSavedAnswers(updated);
  };

  const handleOpenGlobalViewer = (citation: CitationItem) => {
    setActiveViewerCitation(citation);
    setIsViewerOpen(true);
  };

  const handleResetData = () => {
    localStorage.removeItem("mersia_active_messages_v1");
    localStorage.removeItem("mersia_saved_answers_v1");
    localStorage.removeItem("mersia_active_config_v1");
    setMessages(INITIAL_MESSAGES);
    setSavedAnswers(getStoredSavedAnswers());
    alert("Session cache restored to prototype defaults.");
  };

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <span className="text-sm text-muted-foreground animate-soft-pulse font-mono">
          Initializing merSIA Sector Assistant...
        </span>
      </div>
    );
  }

  const savedAnswerIds = new Set(savedAnswers.map((a) => a.id));

  return (
    <div className="flex h-screen max-h-screen w-screen overflow-hidden bg-canvas text-body antialiased select-none">
      {/* 1. PERSISTENT SIDEBAR */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-canvas">
        {/* TOP NAVIGATION */}
        <TopNavigation
          currentView={currentView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNewInquiry={handleNewInquiry}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* VIEW ROUTER CANVAS */}
        <main className="flex-1 overflow-y-auto min-h-0 relative bg-canvas">
          {currentView === "ask" && (
            <AskMersiaView
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isGenerating}
              persona={config.persona}
              onPersonaChange={(p) => {
                const upd = { ...config, persona: p };
                setConfig(upd);
                saveStoredConfig(upd);
              }}
              timePeriod={config.timePeriodFilter}
              onTimePeriodChange={(tp) => {
                const upd = { ...config, timePeriodFilter: tp };
                setConfig(upd);
                saveStoredConfig(upd);
              }}
              referenceStyle={config.referenceStyle}
              onReferenceStyleChange={(s) => {
                const upd = { ...config, referenceStyle: s };
                setConfig(upd);
                saveStoredConfig(upd);
              }}
              onSaveAnswer={handleSaveAnswer}
              savedAnswerIds={savedAnswerIds}
            />
          )}

          {currentView === "dashboard" && (
            <DashboardView
              onNavigateToAsk={(q) => {
                setCurrentView("ask");
                if (q) handleSendMessage(q);
              }}
              onNavigateToDocuments={(docId) => {
                setCurrentView("documents");
              }}
            />
          )}

          {currentView === "documents" && (
            <DocumentsView
              onOpenViewer={handleOpenGlobalViewer}
              onAskAboutDoc={(q) => {
                setCurrentView("ask");
                handleSendMessage(q);
              }}
            />
          )}

          {currentView === "evidence" && <EvidenceExplorerView />}

          {currentView === "collections" && (
            <DocumentsView
              onOpenViewer={handleOpenGlobalViewer}
              onAskAboutDoc={(q) => {
                setCurrentView("ask");
                handleSendMessage(q);
              }}
            />
          )}

          {currentView === "saved" && (
            <SavedAnswersView
              onOpenAnswer={(q) => {
                setCurrentView("ask");
                handleSendMessage(q);
              }}
            />
          )}

          {currentView === "reasoning" && <ReasoningTracesView />}

          {currentView === "references" && (
            <DocumentsView
              onOpenViewer={handleOpenGlobalViewer}
              onAskAboutDoc={(q) => {
                setCurrentView("ask");
                handleSendMessage(q);
              }}
            />
          )}

          {currentView === "about" && <AboutView />}

          {currentView === "status" && <SystemStatusView />}

          {currentView === "settings" && (
            <SettingsView
              config={config}
              onUpdateConfig={setConfig}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* 3. GLOBAL MODALS & DRAWERS */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDocument={(docId) => {
          setCurrentView("documents");
        }}
        onSelectQuery={(q) => {
          setCurrentView("ask");
          handleSendMessage(q);
        }}
      />

      <DocumentViewerModal
        isOpen={isViewerOpen}
        citation={activeViewerCitation}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};

export default AppShell;
