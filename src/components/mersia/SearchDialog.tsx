import React, { useState, useEffect } from "react";
import { Search, X, FileText, Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { PROTOTYPE_DOCUMENTS, SEED_SAVED_ANSWERS } from "@/lib/workspace-store";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (docId: string) => void;
  onSelectQuery?: (query: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
  onSelectQuery,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle dialog
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDocs = PROTOTYPE_DOCUMENTS.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.detail.toLowerCase().includes(query.toLowerCase()) ||
      d.keyTopics.some((t) => t.toLowerCase().includes(query.toLowerCase())),
  );

  const filteredAnswers = SEED_SAVED_ANSWERS.filter(
    (a) =>
      a.question.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-16 sm:pt-24 p-4 bg-[#0B1220]/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-xl border border-line bg-surface-elevated shadow-2xl overflow-hidden animate-rise-in">
        {/* Search Bar Input */}
        <div className="relative flex items-center border-b border-line px-4 py-3 bg-surface-muted">
          <Search className="w-5 h-5 text-muted-text mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search statutory sector documents, evidence, saved findings..."
            className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base text-ink placeholder:text-muted-text"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-text hover:text-ink text-xs"
          >
            <span className="font-mono text-[10px] px-1.5 py-0.5 border border-line rounded bg-surface font-medium text-muted-text">
              ESC
            </span>
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Documents Section */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold block">
              STATUTORY CORPUS DOCUMENTS
            </span>
            {filteredDocs.length === 0 ? (
              <p className="text-xs text-muted-text px-2">No matching documents found.</p>
            ) : (
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-surface text-gold border border-line">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-ink group-hover:text-gold transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] font-mono text-muted-text">
                          {doc.organisation} · {doc.year} · {doc.pageCount} pages
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-text group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Answers Section */}
          <div className="space-y-2 pt-2 border-t border-line">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text font-semibold block">
              SAVED RESEARCH ANSWERS
            </span>
            {filteredAnswers.length === 0 ? (
              <p className="text-xs text-muted-text px-2">No matching saved answers.</p>
            ) : (
              <div className="space-y-1">
                {filteredAnswers.map((ans) => (
                  <div
                    key={ans.id}
                    onClick={() => {
                      if (onSelectQuery) onSelectQuery(ans.question);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-gold/10 text-gold border border-gold/30">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-ink group-hover:text-gold transition-colors">
                          {ans.question}
                        </h4>
                        <p className="text-[10px] text-muted-text line-clamp-1">
                          {ans.answerSnippet}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-text group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-line bg-surface-muted flex items-center justify-between text-[11px] text-muted-text">
          <span className="font-mono">5 Closed Statutory Texts · Wits REAL & merSETA</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
