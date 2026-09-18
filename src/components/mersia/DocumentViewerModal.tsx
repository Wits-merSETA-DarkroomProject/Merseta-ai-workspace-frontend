import React, { useState, useEffect } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  Building2,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";
import { CitationItem, PROTOTYPE_DOCUMENTS } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface DocumentViewerModalProps {
  isOpen: boolean;
  citation: CitationItem | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  citation,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(42);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (citation?.page) {
      const p =
        typeof citation.page === "number" ? citation.page : parseInt(String(citation.page), 10);
      if (!isNaN(p)) setCurrentPage(p);
    }
  }, [citation]);

  if (!isOpen || !citation) return null;

  // Find full doc metadata if available
  const docObj = PROTOTYPE_DOCUMENTS.find((d) => d.id === citation.sourceId) || {
    title: citation.sourceTitle,
    organisation: citation.organisation || "merSETA",
    year: citation.year || "2024",
    type: citation.documentType || "Sector Skills Plan",
    pageCount: 184,
    detail: "Official Statutory Document",
    content: citation.snippet,
  };

  const totalPages = docObj.pageCount || 184;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-[#0B1220]/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-xl border border-line bg-surface shadow-2xl flex flex-col overflow-hidden animate-rise-in">
        {/* Top Control Bar */}
        <div className="h-14 px-6 border-b border-line bg-surface flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-navy/10 text-gold shrink-0 border border-gold/20">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-ink truncate max-w-md">
                {citation.sourceTitle}
              </h2>
              <p className="text-[10px] text-muted-text font-mono">
                {citation.organisation} · {citation.year} · Prototype Corpus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-lg h-8 w-8 hover:bg-surface-muted text-muted-text hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Split Interface Content */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line">
          {/* LEFT: DOCUMENT / PDF VIEWER (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full bg-canvas min-h-0">
            {/* Document Navigation & Zoom Toolbar */}
            <div className="h-11 px-4 border-b border-line bg-surface flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="h-7 px-2 text-xs border-line text-ink hover:bg-surface-muted cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="font-mono text-xs text-body px-1">
                  Page <strong className="text-gold font-bold">{currentPage}</strong> of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="h-7 px-2 text-xs border-line text-ink hover:bg-surface-muted cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-text">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
                  className="h-7 w-7 hover:bg-surface-muted text-muted-text hover:text-ink cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                  className="h-7 w-7 hover:bg-surface-muted text-muted-text hover:text-ink cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-canvas">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-xl bg-surface-elevated border border-line shadow-sm p-8 sm:p-10 rounded-lg space-y-6 transition-transform"
              >
                {/* Formal Document Header */}
                <div className="border-b border-line pb-4 text-center space-y-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-text font-semibold">
                    {docObj.organisation.toUpperCase()} · RESEARCH & PLANNING DIVISION
                  </span>
                  <h3 className="text-base font-bold text-ink">{docObj.title}</h3>
                  <p className="text-[11px] font-mono text-muted-text">
                    Section 3.4: Priority Skills Matrix & Labour Absorption
                  </p>
                </div>

                {/* Simulated Document Body with Highlighted Citation Excerpt */}
                <div className="space-y-4 text-xs text-body leading-relaxed font-serif">
                  <p>
                    The systemic transformation of manufacturing across the Republic of South Africa
                    requires synchronizing skills funding mechanisms with real-time industrial
                    demand signals.
                  </p>

                  {/* Highlighted Evidence Area */}
                  <div className="relative p-4 rounded-md bg-gold/15 border-l-4 border-gold border-y border-r border-gold/30 text-body font-sans font-medium text-xs shadow-2xs">
                    <div className="absolute top-1.5 right-2 text-[9px] font-mono text-amber font-bold">
                      CITED EVIDENCE [Page {citation.page}]
                    </div>
                    <p className="pt-2 italic text-ink">“{citation.snippet}”</p>
                  </div>

                  <p>
                    Employer surveys administered across the automotive, metals, plastics, and
                    engineering sub-sectors substantiate these findings. When workplace experiential
                    placements fail to scale proportionally with TVET college enrollment, artisan
                    qualification pipelines experience critical friction.
                  </p>
                  <p className="text-muted-text text-[11px]">
                    Recommendation: Expand funding allocations toward hybrid artisan qualifications
                    integrating mechatronics and programmable automation telemetry.
                  </p>
                </div>

                <div className="pt-8 border-t border-line flex items-center justify-between text-[10px] font-mono text-muted-text">
                  <span>CONFIDENTIAL SECTOR DRAFT</span>
                  <span>PAGE {currentPage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ANSWER & REASONING PANEL (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-full bg-surface overflow-y-auto p-6 space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                CITED SYNTHESIS & REASONING
              </span>
              <h3 className="text-base font-semibold text-ink">
                Traceable Sector Intelligence
              </h3>
            </div>

            {/* Answer Claim Box */}
            <div className="p-4 rounded-lg border border-line bg-surface-muted space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold">
                  CLAIM IN SYNTHESIS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gold/15 text-gold border border-gold/30">
                  Citation [{citation.page ? "1" : "—"}]
                </span>
              </div>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-medium">
                The MER sector exhibits acute technical shortages in artisan trades—especially CNC
                toolmakers, millwrights, and mechatronics technicians—demanding urgent hybrid
                re-skilling.
              </p>
            </div>

            {/* Evidence Verification Details */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold">
                EVIDENCE TRACEABILITY
              </span>
              <div className="p-4 rounded-lg border border-gold/40 bg-surface-muted space-y-1.5 text-xs text-body">
                <div className="font-semibold text-amber flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Primary Provenance</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-text">
                  This claim was cross-referenced against the primary statutory text of{" "}
                  <strong className="text-ink">{citation.sourceTitle}</strong> at{" "}
                  <strong className="text-ink">Page {citation.page}</strong>. No ungrounded
                  hallucinations were permitted during synthesis.
                </p>
              </div>
            </div>

            {/* Illustrative Reasoning Chain */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold">
                REASONING RELATIONSHIP
              </span>
              <div className="p-3.5 rounded-lg border border-line bg-surface-muted space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-text font-mono text-[10px]">
                  <span>Question</span>
                  <span>→</span>
                  <span className="text-ink font-semibold">Statutory Finding</span>
                  <span>→</span>
                  <span className="text-gold font-semibold">Recommendation</span>
                </div>
                <p className="text-xs text-muted-text leading-relaxed">
                  The cited finding directly informs the training priority recommendations issued to
                  the SETA board regarding discretionary grant allocations.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-line flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(citation.snippet);
                  alert("Citation text copied to clipboard!");
                }}
                className="flex-1 text-xs border-line text-body hover:bg-surface-muted cursor-pointer"
              >
                Copy Citation Text
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onClose}
                className="flex-1 text-xs bg-navy text-white hover:bg-navy-soft cursor-pointer"
              >
                Return to Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
