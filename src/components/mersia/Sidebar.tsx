import React from "react";
import {
  MessageSquare,
  LayoutDashboard,
  FileText,
  Network,
  FolderKanban,
  Bookmark,
  Info,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  BookMarked,
} from "lucide-react";
import { InstitutionBranding } from "./InstitutionBranding";

export type NavViewId =
  | "ask"
  | "dashboard"
  | "documents"
  | "evidence"
  | "collections"
  | "saved"
  | "reasoning"
  | "references"
  | "about"
  | "status"
  | "settings";

interface SidebarProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const handleNavClick = (view: NavViewId) => {
    onSelectView(view);
    onCloseMobile();
  };

  const navItemClass = (view: NavViewId) => {
    const isActive = currentView === view;
    return `group relative flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-all duration-180 cursor-pointer ${
      isActive
        ? "bg-surface-muted text-ink font-semibold border-l-2 border-gold shadow-2xs"
        : "text-muted-text hover:text-ink hover:bg-surface-muted"
    } ${isCollapsed ? "justify-center px-2" : ""}`;
  };

  const content = (
    <aside
      className={`h-full flex flex-col justify-between bg-surface border-r border-line select-none transition-all duration-300 ${
        isCollapsed ? "w-[68px]" : "w-[260px]"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-line flex items-center justify-between min-h-16">
        {!isCollapsed ? (
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-ink">
                merSIA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gold/15 text-gold uppercase tracking-wider border border-gold/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10.5px] text-muted-text truncate font-medium">
              Skills Intelligence & Evidence
            </p>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-[6px] bg-navy text-white flex items-center justify-center font-bold text-sm shadow-2xs border border-gold/40">
              M
            </div>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
          title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Workspace section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 eyebrow text-[10px]">WORKSPACE</span>
          )}
          <div
            onClick={() => handleNavClick("ask")}
            className={navItemClass("ask")}
            title="Ask merSIA"
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-gold" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Ask merSIA</span>
                {currentView === "ask" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavClick("dashboard")}
            className={navItemClass("dashboard")}
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Dashboard</span>
                {currentView === "dashboard" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Knowledge section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 eyebrow text-[10px]">SECTOR KNOWLEDGE</span>
          )}
          <div
            onClick={() => handleNavClick("documents")}
            className={navItemClass("documents")}
            title="Documents (5 Sector Texts)"
          >
            <FileText className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Documents</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    currentView === "documents"
                      ? "bg-gold/20 text-gold border-gold/40 font-bold"
                      : "bg-surface-muted text-muted-text border-line"
                  }`}
                >
                  5
                </span>
              </div>
            )}
          </div>
          <div
            onClick={() => handleNavClick("evidence")}
            className={navItemClass("evidence")}
            title="Evidence Explorer"
          >
            <Network className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Evidence Explorer</span>
                {currentView === "evidence" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavClick("collections")}
            className={navItemClass("collections")}
            title="Collections"
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Collections</span>
                {currentView === "collections" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Research Notebook section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 eyebrow text-[10px]">ANALYSIS & SYNTHESIS</span>
          )}
          <div
            onClick={() => handleNavClick("saved")}
            className={navItemClass("saved")}
            title="Saved Answers"
          >
            <Bookmark className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Saved Answers</span>
                {currentView === "saved" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavClick("reasoning")}
            className={navItemClass("reasoning")}
            title="Reasoning Traces"
          >
            <Layers className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>Reasoning Traces</span>
                {currentView === "reasoning" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavClick("references")}
            className={navItemClass("references")}
            title="References"
          >
            <BookMarked className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>References</span>
                {currentView === "references" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Navigation */}
      <div className="p-3 border-t border-line space-y-1 bg-surface">
        <div
          onClick={() => handleNavClick("about")}
          className={navItemClass("about")}
          title="About merSIA & Darkroom"
        >
          <Info className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>About merSIA</span>}
        </div>
        <div
          onClick={() => handleNavClick("status")}
          className={navItemClass("status")}
          title="System Status"
        >
          <Activity className="w-4 h-4 shrink-0 text-green-bright" />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>System Status</span>
              <span className="w-2 h-2 rounded-full bg-green-bright shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          )}
        </div>
        <div
          onClick={() => handleNavClick("settings")}
          className={navItemClass("settings")}
          title="Settings"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </div>

        {/* Institutional Partnership Credit */}
        {!isCollapsed && (
          <div className="px-3 pt-3 text-[10px] text-muted-text border-t border-line mt-2 leading-snug">
            <span className="font-bold text-ink block">Wits–merSETA</span>
            <span>Darkroom Initiative</span>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-full shrink-0">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#0B1220]/75 backdrop-blur-xs transition-opacity animate-in fade-in"
          />
          <div className="relative w-[270px] max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
