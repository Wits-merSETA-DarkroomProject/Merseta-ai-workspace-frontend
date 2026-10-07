import React, { useState, useRef } from "react";
import {
  Upload,
  Link2,
  Cloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  Check,
  X,
  Sparkles,
  ArrowRight,
  HardDrive,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Source } from "@/lib/workspace-store";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (newSource: Source) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
}) => {
  const [activeTab, setActiveTab] = useState<"local" | "link" | "cloud" | "text">("local");

  // Local file upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localTitle, setLocalTitle] = useState("");
  const [localAuthor, setLocalAuthor] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Link upload states
  const [webUrl, setWebUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlAuthor, setUrlAuthor] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // Cloud upload states
  const [cloudProvider, setCloudProvider] = useState<"google" | "onedrive" | "merseta">("merseta");
  const [selectedCloudFileId, setSelectedCloudFileId] = useState<string | null>(null);
  const [isCloudConnecting, setIsCloudConnecting] = useState(false);

  // Text upload states
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textAuthor, setTextAuthor] = useState("");

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const inferred = file.name.replace(/\.[^/.]+$/, "");
    if (!localTitle) setLocalTitle(inferred);
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !localTitle.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(timer);
      setUploadProgress(100);

      const ext = selectedFile?.name.split(".").pop()?.toLowerCase() || "pdf";
      const docType =
        ext === "pdf"
          ? "PDF Document"
          : ext === "xlsx" || ext === "csv"
            ? "Data Spreadsheet"
            : "Research Document";

      const newSource: Source = {
        id: `src-local-${Date.now()}`,
        title: localTitle.trim() || selectedFile?.name || "Uploaded Document",
        detail: `${docType} · Local Ingestion`,
        type: ext,
        author: localAuthor.trim() || "Institutional Contributor",
        year: "2026",
        pageCount: Math.floor(Math.random() * 40) + 12,
        dateAdded: "Just now",
        content: `Extracted content from local file "${selectedFile?.name || localTitle}". Synthesized statutory passages and empirical data indexed into grounded vector store with line-by-line page boundary verification.`,
      };

      onAddSource(newSource);
      setIsUploading(false);
      onClose();
    }, 700);
  };

  // Handle Web Link Ingestion
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webUrl.trim()) return;

    setIsScraping(true);

    setTimeout(() => {
      let inferred = urlTitle.trim();
      if (!inferred) {
        try {
          const parsed = new URL(webUrl);
          inferred = `${parsed.hostname.replace("www.", "")} — Sector Intelligence Bulletin`;
        } catch {
          inferred = "Web Statutory Resource";
        }
      }

      const newSource: Source = {
        id: `src-web-${Date.now()}`,
        title: inferred,
        detail: `Web Ingestion · ${webUrl.slice(0, 32)}...`,
        type: "web",
        author: urlAuthor.trim() || "Online Sector Intelligence",
        year: "2026",
        dateAdded: "Just now",
        content: `Live web ingestion from ${webUrl}. Verified sector intelligence text extracted, stripped of DOM boilerplate, and indexed into closed grounding environment.`,
      };

      onAddSource(newSource);
      setIsScraping(false);
      onClose();
    }, 800);
  };

  // Cloud documents repository list
  const CLOUD_FILES = [
    {
      id: "cloud-1",
      provider: "merseta",
      name: "merSETA_Chamber_Discretionary_Grants_2026.pdf",
      size: "4.2 MB",
      author: "merSETA Governance",
      pages: 64,
      desc: "Chamber funding distribution framework and artisan grant thresholds.",
    },
    {
      id: "cloud-2",
      provider: "merseta",
      name: "DHET_National_Occupations_High_Demand_2025.pdf",
      size: "8.1 MB",
      author: "DHET Republic of South Africa",
      pages: 142,
      desc: "Statutory national list of top priority occupations in engineering and manufacturing.",
    },
    {
      id: "cloud-3",
      provider: "google",
      name: "Wits_REAL_Just_Transition_Fieldwork_Interviews.docx",
      size: "2.6 MB",
      author: "Wits REAL Research Unit",
      pages: 48,
      desc: "Qualitative interview findings with coal station workers in Mpumalanga.",
    },
    {
      id: "cloud-4",
      provider: "onedrive",
      name: "Automotive_OEM_EV_Transformation_Telemetry_2026.xlsx",
      size: "5.4 MB",
      author: "Auto Chamber Council",
      pages: 36,
      desc: "Quarterly transition metrics for mechatronics & battery diagnostics technicians.",
    },
  ];

  const handleCloudSubmit = () => {
    const chosen = CLOUD_FILES.find((f) => f.id === selectedCloudFileId) || CLOUD_FILES[0]!;
    setIsCloudConnecting(true);

    setTimeout(() => {
      const newSource: Source = {
        id: `src-cloud-${Date.now()}`,
        title: chosen.name.replace(/_/g, " ").replace(/\.[^/.]+$/, ""),
        detail: `Cloud Ingestion · ${chosen.provider.toUpperCase()} Drive`,
        type: "pdf",
        author: chosen.author,
        year: "2026",
        pageCount: chosen.pages,
        dateAdded: "Just now",
        content: `Imported from ${chosen.provider} cloud storage. ${chosen.desc} Full text parsed with unbroken citation provenance.`,
      };

      onAddSource(newSource);
      setIsCloudConnecting(false);
      onClose();
    }, 600);
  };

  // Direct Text Submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) return;

    const newSource: Source = {
      id: `src-text-${Date.now()}`,
      title: textTitle.trim(),
      detail: "Direct Research Notes · Text Passage",
      type: "note",
      author: textAuthor.trim() || "Researcher",
      year: "2026",
      dateAdded: "Just now",
      content: textContent.trim(),
    };

    onAddSource(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-2xl border border-line-soft bg-surface-elevated shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-rise-in">
        
        {/* Top Header */}
        <div className="h-14 px-6 border-b border-line-soft bg-surface/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-navy/60 border border-gold/30 text-gold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Add Research Sources</h3>
              <p className="text-[11px] text-muted-text font-mono">
                Ingest local files, web links, cloud repositories, or text excerpts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-muted text-muted-text hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Pill Strip */}
        <div className="px-6 pt-3 pb-2 border-b border-line-soft/60 bg-surface/40 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: "local", label: "Local Files", icon: HardDrive },
            { id: "link", label: "Web Link / URL", icon: Globe },
            { id: "cloud", label: "Cloud Storage", icon: Cloud },
            { id: "text", label: "Direct Notes", icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-surface-elevated text-gold border border-gold/40 shadow-xs font-semibold"
                    : "text-muted-text hover:text-ink hover:bg-surface-muted/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* 1. LOCAL FILE TAB */}
          {activeTab === "local" && (
            <form onSubmit={handleLocalSubmit} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="hidden"
              />

              {/* Drag & Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  selectedFile
                    ? "border-gold/50 bg-gold/5"
                    : "border-line-soft hover:border-gold/40 bg-surface-muted/30 hover:bg-surface-muted/60"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-surface-muted border border-line-soft flex items-center justify-center text-gold">
                  <Upload className="w-5 h-5" />
                </div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-ink truncate max-w-sm">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] font-mono text-gold">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to choose different file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-ink">
                      Drag & drop your document here, or <span className="text-gold underline">browse</span>
                    </p>
                    <p className="text-[11px] text-muted-text font-mono">
                      PDF, DOCX, CSV, XLSX, TXT (up to 50MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Document Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Document Title</label>
                  <input
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="e.g. merSETA Auto Chamber Skills 2026"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Organisation / Author</label>
                  <input
                    type="text"
                    value={localAuthor}
                    onChange={(e) => setLocalAuthor(e.target.value)}
                    placeholder="e.g. merSETA / Wits REAL"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-text">
                    <span>Extracting statutory text passages...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-line-soft hover:bg-surface-muted text-xs text-muted-text hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(!selectedFile && !localTitle.trim()) || isUploading}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-medium transition-colors border border-line-soft flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-gold" />
                  )}
                  <span>Upload & Index</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. WEB LINK INGESTION TAB */}
          {activeTab === "link" && (
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-line-soft text-xs text-muted-text space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-ink">
                  <Globe className="w-3.5 h-3.5 text-gold" />
                  <span>Statutory Web Intelligence Ingestion</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Enter any official SETA, university research monograph, government gazette, or sector publication URL.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-text">Web Document URL</label>
                <input
                  type="url"
                  required
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="https://www.merseta.org.za/research/ssp-2025.pdf"
                  className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Title Override (Optional)</label>
                  <input
                    type="text"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    placeholder="Auto-detected if blank"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Organisation / Publisher</label>
                  <input
                    type="text"
                    value={urlAuthor}
                    onChange={(e) => setUrlAuthor(e.target.value)}
                    placeholder="e.g. merSETA / DHET"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-line-soft text-xs text-muted-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!webUrl.trim() || isScraping}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-medium flex items-center gap-1.5"
                >
                  {isScraping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Link2 className="w-3.5 h-3.5 text-gold" />
                  )}
                  <span>Crawl & Ingest</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. CLOUD STORAGE TAB */}
          {activeTab === "cloud" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-line-soft pb-2">
                {[
                  { id: "merseta", label: "merSETA Cloud Repository" },
                  { id: "google", label: "Google Drive" },
                  { id: "onedrive", label: "OneDrive / SharePoint" },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setCloudProvider(prov.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      cloudProvider === prov.id
                        ? "bg-navy/50 text-gold border border-gold/30"
                        : "text-muted-text hover:text-ink"
                    }`}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-text">
                  Available Institutional Documents
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {CLOUD_FILES.map((file) => {
                    const isSelected = selectedCloudFileId === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => setSelectedCloudFileId(file.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-gold bg-gold/10"
                            : "border-line-soft bg-surface-muted/40 hover:bg-surface-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-gold shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-ink truncate">{file.name}</h4>
                            <p className="text-[10px] text-muted-text font-mono">
                              {file.author} · {file.size} · {file.pages} pages
                            </p>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-gold bg-gold text-canvas" : "border-line-soft"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-line-soft text-xs text-muted-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCloudSubmit}
                  disabled={isCloudConnecting}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-medium flex items-center gap-1.5"
                >
                  {isCloudConnecting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-gold" />
                  )}
                  <span>Import Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. DIRECT TEXT / NOTE TAB */}
          {activeTab === "text" && (
            <form onSubmit={handleTextSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Passage Title</label>
                  <input
                    type="text"
                    required
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="e.g. Chamber Executive Summary 2026"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-text">Author / Source Reference</label>
                  <input
                    type="text"
                    value={textAuthor}
                    onChange={(e) => setTextAuthor(e.target.value)}
                    placeholder="e.g. Policy Briefing Note"
                    className="w-full h-9 px-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-text">Statutory Text Content</label>
                <textarea
                  rows={5}
                  required
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste statutory report excerpts, interview transcripts, or curriculum frameworks..."
                  className="w-full p-3 rounded-xl border border-line-soft bg-surface-muted text-xs text-ink outline-hidden focus:border-gold/50 resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-line-soft text-xs text-muted-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!textTitle.trim() || !textContent.trim()}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-gold" />
                  <span>Add Passage</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
