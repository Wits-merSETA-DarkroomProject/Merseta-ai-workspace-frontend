import React from "react";
import { ArrowUpRight, Zap, Briefcase, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  className?: string;
}

interface QuestionCardItem {
  id: string;
  topic: string;
  question: string;
  icon: React.ReactNode;
  tag: string;
}

const SUGGESTIONS: QuestionCardItem[] = [
  {
    id: "priorities",
    topic: "Sector Skills Priorities",
    question: "What are the key skills priorities identified for the MER sector?",
    icon: <Briefcase className="w-4 h-4 text-[#1D3557]" />,
    tag: "merSETA SSP 2024/25",
  },
  {
    id: "energy",
    topic: "Energy Transition",
    question: "How is the Just Energy Transition affecting skills demand?",
    icon: <Zap className="w-4 h-4 text-[#A86F1C]" />,
    tag: "Wits REAL / GIZ",
  },
  {
    id: "labour",
    topic: "Labour Market Trends",
    question: "What employment trends are emerging across the sector?",
    icon: <TrendingUp className="w-4 h-4 text-[#1D3557]" />,
    tag: "ELMA Monograph",
  },
  {
    id: "skills",
    topic: "Occupational Demand",
    question: "Which occupations show the greatest future skills demand?",
    icon: <BookOpen className="w-4 h-4 text-[#2F755B]" />,
    tag: "SANEA Roadmap",
  },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="eyebrow">SUGGESTED SECTOR INQUIRIES</span>
        <span className="text-[11px] font-mono text-muted-text">Statutory Corpus Grounded</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SUGGESTIONS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectQuestion(item.question)}
            className="group relative p-4 rounded-xl border border-line bg-surface-elevated hover:bg-surface-muted hover:border-gold/50 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[6px] bg-surface-muted group-hover:bg-gold/15 transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-ink tracking-tight">
                  {item.topic}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-text group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <p className="text-xs text-muted-text group-hover:text-body transition-colors leading-relaxed line-clamp-2">
              “{item.question}”
            </p>

            <div className="pt-2 border-t border-line flex items-center justify-between text-[10px] font-mono text-muted-text">
              <span>{item.tag}</span>
              <span className="text-gold font-bold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Inquire</span>
                <ArrowRight className="w-3 h-3 text-gold" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
