import React, { useState } from "react";
import {
  Bookmark,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  Shield,
  FileText,
} from "lucide-react";
import { SavedAnswer, getStoredSavedAnswers, saveStoredSavedAnswers } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface SavedAnswersViewProps {
  onOpenAnswer: (question: string) => void;
}

export const SavedAnswersView: React.FC<SavedAnswersViewProps> = ({ onOpenAnswer }) => {
  const [answers, setAnswers] = useState<SavedAnswer[]>(getStoredSavedAnswers());
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    const updated = answers.filter((a) => a.id !== id);
    setAnswers(updated);
    saveStoredSavedAnswers(updated);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = (answer: SavedAnswer) => {
    const content = `# Question: ${answer.question}\n\n## Answer\n${answer.fullAnswer}\n\n---\nSaved: ${answer.savedAt}\nPersona: ${answer.persona}\nConfidence: ${answer.confidenceScore}%\nSources: ${answer.sources.join(", ")}\n`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mersia-answer-${answer.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAnswers = answers.filter(
    (a) =>
      a.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.answerSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* Header */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-medium">
          <Bookmark className="w-3.5 h-3.5 text-gold" />
          <span>RESEARCH NOTEBOOK</span>
          <span>·</span>
          <span>{answers.length} SAVED SYNTHESES</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Saved Research Answers
        </h1>

        <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
          Curated collection of evidence-backed findings and synthesis answers pinned from your
          interactive inquiry sessions.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter saved answers by question, topic, or keyword..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-surface border border-line rounded-lg text-ink placeholder:text-muted-text outline-hidden focus:border-navy focus:ring-1 focus:ring-navy shadow-2xs transition-all"
        />
      </div>

      {/* Answers Grid */}
      <div className="space-y-4">
        {filteredAnswers.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-line bg-surface space-y-3">
            <Bookmark className="w-8 h-8 text-muted-text mx-auto stroke-1" />
            <p className="text-sm text-muted-text">
              No saved answers match your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnswers.map((ans) => (
              <div
                key={ans.id}
                className="p-5 sm:p-6 rounded-xl border border-line bg-surface hover:border-gold/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between gap-4"
              >
                {/* Upper Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-surface-muted text-ink border border-line">
                      {ans.persona}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-text">
                      <span className="text-emerald-400 font-semibold">{ans.confidenceScore}% Consensus</span>
                      <span>·</span>
                      <span>{ans.savedAt}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-ink leading-snug">
                    “{ans.question}”
                  </h3>

                  <p className="text-xs text-muted-text leading-relaxed">
                    {ans.answerSnippet}
                  </p>
                </div>

                {/* Sources & Tags */}
                <div className="space-y-2 pt-2.5 border-t border-line">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-text font-mono truncate">
                    <FileText className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{ans.sources.join(", ")}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {ans.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface-muted text-muted-text border border-line"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-line flex items-center justify-between gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenAnswer(ans.question)}
                    className="text-xs flex-1 gap-1 border-line text-ink hover:bg-surface-muted"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Inquiry</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(ans.id, ans.fullAnswer)}
                    className="text-xs px-2.5 text-muted-text hover:text-ink hover:bg-surface-muted"
                    title="Copy full answer"
                  >
                    {copiedId === ans.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(ans)}
                    className="text-xs px-2.5 text-muted-text hover:text-ink hover:bg-surface-muted"
                    title="Export as Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ans.id)}
                    className="text-xs px-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    title="Delete saved answer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedAnswersView;
