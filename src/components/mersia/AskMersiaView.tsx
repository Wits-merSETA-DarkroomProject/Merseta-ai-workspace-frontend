import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  CitationItem,
  ModelPersonaId,
  ReferenceStyleId,
  TimePeriodFilterId,
  SavedAnswer,
} from "@/lib/workspace-store";
import { AIInput } from "./AIInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatMessageView } from "./ChatMessageView";
import { LoadingSequence } from "./LoadingSequence";
import { CitationDrawer } from "./CitationDrawer";
import { DocumentViewerModal } from "./DocumentViewerModal";

interface AskMersiaViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  persona: ModelPersonaId;
  onPersonaChange: (p: ModelPersonaId) => void;
  timePeriod: TimePeriodFilterId;
  onTimePeriodChange: (tp: TimePeriodFilterId) => void;
  referenceStyle: ReferenceStyleId;
  onReferenceStyleChange: (s: ReferenceStyleId) => void;
  onSaveAnswer?: (msg: ChatMessage) => void;
  savedAnswerIds?: Set<string>;
}

export const AskMersiaView: React.FC<AskMersiaViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  persona,
  onPersonaChange,
  timePeriod,
  onTimePeriodChange,
  referenceStyle,
  onReferenceStyleChange,
  onSaveAnswer,
  savedAnswerIds = new Set(),
}) => {
  const [inputText, setInputText] = useState("");
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [viewerCitation, setViewerCitation] = useState<CitationItem | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleSuggestedSelect = (q: string) => {
    onSendMessage(q);
  };

  const handleCitationClick = (cite: CitationItem) => {
    setActiveCitation(cite);
    setIsDrawerOpen(true);
  };

  const handleOpenDocumentViewer = (cite: CitationItem) => {
    setViewerCitation(cite);
    setIsViewerModalOpen(true);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between overflow-x-hidden bg-canvas">
      {/* 1. EDITORIAL RESEARCH HERO */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-6">
        {/* Editorial Heading Section */}
        <div className="text-center space-y-3 mb-8 sm:mb-10 animate-rise-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-surface text-xs font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="font-bold text-ink tracking-wider uppercase text-[10px]">
              Wits × merSETA Skills Intelligence
            </span>
            <span className="text-line">|</span>
            <span className="text-muted-text text-[10px]">5 Approved Sector Texts</span>
          </div>

          <h1 className="hero-title">
            Understand <em>skills</em> through evidence.
          </h1>

          <p className="text-sm sm:text-base text-muted-text max-w-2xl mx-auto leading-relaxed">
            Inquire across statutory skills plans, labour market demand signals, and Just Transition
            pathways for South Africa's manufacturing and engineering sector.
          </p>
        </div>

        {/* Spacious Research Input Bar */}
        <div className="max-w-3xl mx-auto animate-rise-in">
          <AIInput
            value={inputText}
            onChange={setInputText}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            persona={persona}
            onPersonaChange={onPersonaChange}
            timePeriod={timePeriod}
            onTimePeriodChange={onTimePeriodChange}
            referenceStyle={referenceStyle}
            onReferenceStyleChange={onReferenceStyleChange}
          />
        </div>

        {/* Minimal Suggested Question Chips */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto mt-8 animate-rise-in">
            <SuggestedQuestions onSelectQuestion={handleSuggestedSelect} />
          </div>
        )}
      </div>

      {/* 2. CONVERSATION & EVIDENCE STREAM */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 space-y-6 pb-16">
        {messages.map((msg) => (
          <ChatMessageView
            key={msg.id}
            message={msg}
            onCitationClick={handleCitationClick}
            onSaveAnswer={onSaveAnswer}
            isSaved={savedAnswerIds.has(msg.id)}
          />
        ))}

        {/* Subtle Skeleton Loader */}
        {isLoading && (
          <div className="my-6">
            <LoadingSequence />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Slide-over Evidence Drawer */}
      <CitationDrawer
        isOpen={isDrawerOpen}
        citation={activeCitation}
        onClose={() => setIsDrawerOpen(false)}
        onOpenDocumentViewer={handleOpenDocumentViewer}
      />

      {/* Split-screen Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerModalOpen}
        citation={viewerCitation}
        onClose={() => setIsViewerModalOpen(false)}
      />
    </div>
  );
};

export default AskMersiaView;
