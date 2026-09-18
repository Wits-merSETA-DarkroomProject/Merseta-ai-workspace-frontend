import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Plus,
  LogOut,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { NavViewId } from "./Sidebar";
import { UserSession } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { InstitutionBranding } from "./InstitutionBranding";
import { useTheme } from "@/lib/theme";

interface TopNavigationProps {
  currentView: NavViewId;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onNewInquiry: () => void;
  currentUser: UserSession | null;
  onSignOut: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentView,
  onOpenMobileMenu,
  onOpenSearch,
  onNewInquiry,
  currentUser,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const getViewBreadcrumb = (view: NavViewId) => {
    switch (view) {
      case "ask":
        return "Ask merSIA";
      case "dashboard":
        return "Dashboard";
      case "documents":
        return "Documents";
      case "evidence":
        return "Evidence Explorer";
      case "collections":
        return "Collections";
      case "saved":
        return "Saved Answers";
      case "reasoning":
        return "Reasoning Traces";
      case "references":
        return "References";
      case "about":
        return "About merSIA";
      case "status":
        return "System Status";
      case "settings":
        return "Settings";
      default:
        return "Intelligence Workspace";
    }
  };

  return (
    <>
      <header className="h-16 border-b border-line bg-surface px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-20 select-none">
        {/* Left: Mobile Menu Trigger + Institution Branding & Breadcrumbs */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Official Wits x merSETA co-branding in header */}
          <div className="hidden lg:flex items-center">
            <InstitutionBranding variant="header" />
          </div>

          <div className="hidden lg:block w-[1px] h-6 bg-line mx-1" />

          {/* Breadcrumbs & View Context */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-text truncate">
            <span className="text-ink font-semibold tracking-tight">merSIA</span>
            <span className="text-line">/</span>
            <span className="text-body font-medium">{getViewBreadcrumb(currentView)}</span>
          </nav>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="hidden md:flex items-center max-w-sm w-full mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-[6px] border border-line bg-surface-muted hover:border-gold/50 text-xs text-muted-text transition-all duration-180 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gold" />
              <span>Search sector evidence, documents...</span>
            </div>
            <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface text-ink border border-line">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Theme Toggle, New Inquiry, Notifications, Help, User */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
            title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
            aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold" />
            ) : (
              <Moon className="w-4 h-4 text-navy" />
            )}
          </button>

          {/* New Inquiry Action */}
          <Button
            type="button"
            onClick={onNewInquiry}
            size="sm"
            className="inline-flex h-8 rounded-[6px] bg-navy text-white hover:bg-navy-soft font-semibold text-xs gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Inquiry</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-4 animate-rise-in space-y-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="eyebrow">NOTIFICATIONS</span>
                  <span className="text-[10px] font-mono text-muted-text">1 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-[8px] bg-surface-muted text-xs space-y-1">
                    <p className="font-semibold text-ink">Corpus Verified</p>
                    <p className="text-muted-text text-[11px] leading-relaxed">
                      All 5 prototype documents active with chunk-level lexical provenance.
                    </p>
                    <span className="text-[9px] font-mono text-subtle block pt-1">
                      Wits REAL · merSETA Engine
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Modal trigger */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-[6px] text-muted-text hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
            title="Help & Guidance"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-gold/30 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs shadow-2xs border border-line">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "R"}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-line bg-surface-elevated text-body shadow-xl p-2 animate-rise-in space-y-1 z-50">
                <div className="px-3 py-2 border-b border-line mb-1">
                  <p className="text-xs font-semibold text-ink truncate">
                    {currentUser?.name || "Researcher"}
                  </p>
                  <p className="text-[10px] font-mono text-muted-text truncate">
                    {currentUser?.email || "researcher@wits.ac.za"}
                  </p>
                </div>

                <div className="px-2 py-1 text-[11px] font-medium text-muted-text flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  <span>MER Sector Clearance</span>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-xs text-[#B91C1C] hover:bg-[#B91C1C]/10 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-line bg-surface-elevated shadow-2xl p-6 space-y-4 animate-rise-in">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="eyebrow">RESEARCH GUIDANCE</span>
                <h3 className="text-lg font-semibold text-ink">
                  Using the merSIA Skills Intelligence Assistant
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="h-8 w-8 rounded-[6px] flex items-center justify-center text-muted-text hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-muted-text leading-relaxed">
              <p>
                <strong className="text-ink">Closed Sector Corpus:</strong> merSIA does not browse the open internet. It
                generates answers exclusively from the 5 validated research and statutory texts provided by
                merSETA and Wits REAL.
              </p>
              <p>
                <strong className="text-ink">Traceability Principle:</strong> Every empirical claim links to an interactive
                citation (e.g. [1]). Clicking any citation marker opens the primary evidence excerpt with page numbers and observation metadata.
              </p>
              <p>
                <strong className="text-ink">Academic & Policy Personas:</strong> Switch between Policy Analyst, Researcher, Data
                Scientist, or Educator to adapt analytical framing to your requirements.
              </p>
            </div>

            <div className="pt-3 border-t border-line flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowHelpModal(false)}
                className="text-xs bg-navy text-white hover:bg-navy-soft"
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavigation;
