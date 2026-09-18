import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Building2,
  Calendar,
  ExternalLink,
  BookOpen,
  Tag,
  Download,
  Eye,
} from "lucide-react";
import { PROTOTYPE_DOCUMENTS, Source, CitationItem } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";

interface DocumentsViewProps {
  onOpenViewer: (citation: CitationItem) => void;
  onAskAboutDoc: (docTitle: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onOpenViewer, onAskAboutDoc }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const years = ["all", "2024", "2023", "2018"];
  const organisations = ["all", "merSETA", "Wits REAL", "GIZ", "SANEA", "BankSETA"];
  const types = [
    "all",
    "Sector Skills Plan",
    "Research Report",
    "Labour Market Analysis",
    "Strategic Roadmap",
  ];

  const filteredDocs = PROTOTYPE_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keyTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesYear = selectedYear === "all" || doc.year === selectedYear;
    const matchesOrg = selectedOrg === "all" || doc.organisation.includes(selectedOrg);
    const matchesType = selectedType === "all" || doc.type === selectedType;

    return matchesSearch && matchesYear && matchesOrg && matchesType;
  });

  const handleOpenDoc = (doc: Source) => {
    const citation: CitationItem = {
      sourceId: doc.id,
      sourceTitle: doc.title,
      organisation: doc.organisation,
      year: doc.year,
      page: 12,
      documentType: doc.type,
      snippet: doc.content.slice(0, 240) + "...",
    };
    onOpenViewer(citation);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-rise-in select-none">
      {/* 1. HEADER WITH HONEST PROTOTYPE CORPUS BANNER */}
      <div className="space-y-2.5 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span>PROTOTYPE CORPUS</span>
          <span>·</span>
          <span>5 VERIFIED SECTOR DOCUMENTS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          MER Sector Research Corpus
        </h1>

        <p className="text-xs sm:text-sm text-muted-text max-w-3xl leading-relaxed">
          merSIA currently operates against a closed illustrative corpus of statutory sector and
          labour-market research documents. No unverified external materials are indexed, ensuring complete
          answer traceability.
        </p>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="p-4 sm:p-5 rounded-xl border border-line bg-surface shadow-2xs space-y-3.5">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter documents by keyword, artisan trade, or author..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface-muted border border-line rounded-lg text-ink placeholder:text-muted-text outline-hidden focus:border-navy focus:ring-1 focus:ring-navy transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-line">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text mr-1 font-semibold">
              YEAR:
            </span>
            {years.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors capitalize ${
                  selectedYear === yr
                    ? "bg-navy text-white font-semibold"
                    : "bg-surface-muted text-muted-text border border-line hover:text-ink hover:bg-surface-elevated"
                }`}
              >
                {yr === "all" ? "All Years" : yr}
              </button>
            ))}
          </div>

          {/* Organisation Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-text mr-1 font-semibold">
              ORGANISATION:
            </span>
            {organisations.map((org) => (
              <button
                key={org}
                type="button"
                onClick={() => setSelectedOrg(org)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  selectedOrg === org
                    ? "bg-navy text-white font-semibold"
                    : "bg-surface-muted text-muted-text border border-line hover:text-ink hover:bg-surface-elevated"
                }`}
              >
                {org === "all" ? "All Orgs" : org}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DOCUMENT CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-text font-mono">
          <span>
            Showing {filteredDocs.length} of {PROTOTYPE_DOCUMENTS.length} documents
          </span>
          <span className="text-emerald-400 font-semibold">● 100% Indexed & Grounded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 sm:p-6 rounded-xl border border-line bg-surface hover:border-gold/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between gap-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-surface-muted text-ink border border-line">
                    {doc.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-text">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{doc.year}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold tracking-tight text-ink leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-muted-text font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-muted-text shrink-0" />
                  <span>{doc.organisation}</span>
                  <span>·</span>
                  <span>{doc.pageCount} Pages</span>
                </p>
              </div>

              {/* Excerpt Snippet */}
              <div className="p-3.5 rounded-lg bg-surface-muted border border-line text-xs text-body line-clamp-3 leading-relaxed">
                {doc.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {doc.keyTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-muted text-muted-text border border-line"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onAskAboutDoc(`What does the ${doc.title} recommend regarding sector skills?`)
                  }
                  className="text-xs flex-1 gap-1.5 border-line text-ink hover:bg-surface-muted"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  <span>Inquire About Doc</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleOpenDoc(doc)}
                  className="text-xs flex-1 gap-1.5 bg-navy text-white hover:bg-navy-light"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Document</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsView;
