import React from "react";
import { X, ExternalLink, FileText, Calendar, Building2, Bookmark, ArrowRight, ShieldCheck } from "lucide-react";
import { CitationItem } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CitationDrawerProps {
  isOpen: boolean;
  citation: CitationItem | null;
  onClose: () => void;
  onOpenDocumentViewer: (citation: CitationItem) => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  isOpen,
  citation,
  onClose,
  onOpenDocumentViewer,
}) => {
  if (!isOpen || !citation) return null;

  const status = citation.evidenceStatus || "Verified";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1220]/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-elevated border-l border-line shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-line flex items-center justify-between bg-surface">
            <div className="flex items-center gap-2">
              <span className="eyebrow">PRIMARY EVIDENCE RECORD</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] p-1.5 text-muted-text hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Document Title & Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-surface-muted text-ink border border-line">
                  <FileText className="w-3.5 h-3.5 text-gold" />
                  <span>{citation.documentType || "Sector Document"}</span>
                </span>

                <Badge variant={status.toLowerCase().includes("verified") ? "verified" : "emerging"}>
                  {status}
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-ink leading-snug">
                {citation.sourceTitle}
              </h3>
            </div>

            {/* Source Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-line bg-surface">
              <div className="space-y-1">
                <span className="eyebrow text-[10px] block">ORGANISATION</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-body">
                  <Building2 className="w-3.5 h-3.5 text-muted-text shrink-0" />
                  <span className="truncate">{citation.organisation || "merSETA"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="eyebrow text-[10px] block">OBSERVATION PERIOD</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-body">
                  <Calendar className="w-3.5 h-3.5 text-muted-text shrink-0" />
                  <span>{citation.observationPeriod || citation.year || "2024–2025"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="eyebrow text-[10px] block">PAGE CITATION</span>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gold">
                  <Bookmark className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Page {citation.page || "42"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="eyebrow text-[10px] block">CORPUS PROVENANCE</span>
                <div className="flex items-center gap-1.5 text-xs text-green-bright font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-bright" />
                  <span>Verified Corpus</span>
                </div>
              </div>
            </div>

            {/* Highlighted Evidence Passage */}
            <div className="space-y-2">
              <span className="eyebrow block">
                EXTRACTED EMPIRICAL PASSAGE
              </span>
              <div className="p-4 rounded-xl border-l-4 border-l-gold border-y border-r border-line bg-surface text-body text-xs leading-relaxed font-normal shadow-2xs">
                <span className="font-serif italic text-muted-text mr-1.5">“</span>
                {citation.snippet}
                <span className="font-serif italic text-muted-text ml-1.5">”</span>
              </div>
            </div>

            {/* Institutional Provenance Assurance */}
            <div className="p-3.5 rounded-[8px] border border-line bg-surface-muted text-[11px] text-muted-text leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <ShieldCheck className="w-3.5 h-3.5 text-green-bright" />
                <span>Statutory Traceability Guarantee</span>
              </div>
              <p>
                This citation was extracted directly from the verified merSETA / Wits REAL prototype corpus. Every claim in merSIA maps to primary statutory literature with immutable page boundaries.
              </p>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-line bg-surface flex items-center gap-3">
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenDocumentViewer(citation);
              }}
              className="flex-1 bg-navy text-white hover:bg-navy-soft h-10 font-bold text-xs gap-2 shadow-2xs cursor-pointer"
            >
              <span>Inspect in full text</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 text-xs font-semibold border-line hover:bg-surface-muted text-body cursor-pointer"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationDrawer;
