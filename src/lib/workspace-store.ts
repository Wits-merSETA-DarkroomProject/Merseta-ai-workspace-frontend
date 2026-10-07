export interface Source {
  id: string;
  title: string;
  detail: string;
  type: string;
  author?: string;
  organisation?: string;
  year?: string;
  pageCount?: number;
  dateAdded: string;
  timePeriod?: string;
  content: string;
  keyTopics?: string[];
}

export interface CitationItem {
  sourceId: string;
  sourceTitle: string;
  organisation?: string;
  year?: string;
  page?: number | string;
  documentType?: string;
  snippet: string;
  evidenceStatus?: "Verified" | "Emerging" | "Observed" | "Inferred" | "Uncertain";
  confidenceLevel?: "High" | "Medium" | "Low";
  method?: string;
  observationPeriod?: string;
}

export interface ConfidenceData {
  score: number;
  level?: "HIGH" | "MODERATE" | "LOW";
  modelAgreement?: {
    llama: boolean;
    deepSeek: boolean;
  };
  note?: string;
}

export interface ReasoningStep {
  title: string;
  description: string;
  status: "verified" | "derived" | "prototype";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  persona?: string;
  citations?: CitationItem[];
  confidence?: ConfidenceData;
  reasoningTrace?: {
    title?: string;
    steps?: ReasoningStep[];
    disclaimer?: string;
    intent?: string;
    sourcesConsulted?: string[];
    synthesisSteps?: string[];
    confidence?: "high" | "moderate";
  };
}

export interface StudioArtifact {
  type: "audio" | "guide" | "briefing";
  title: string;
  createdAt: string;
  content: string;
  audioDuration?: string;
}

export interface UserSession {
  name: string;
  email: string;
  avatarUrl?: string;
}

export type ModelPersonaId =
  | "policy-analyst"
  | "researcher"
  | "data-scientist"
  | "educator"
  | "curator"
  | "dialectical"
  | "distiller"
  | "academic";

export type ReferenceStyleId = "in-depth" | "concise" | "socratic" | "aphoristic";
export type ResponseStyleId = ReferenceStyleId;

export type TimePeriodFilterId = "all" | "contemporary" | "foundational" | "historical";

export interface WorkspaceConfig {
  persona: ModelPersonaId;
  referenceStyle: ReferenceStyleId;
  responseStyle?: ResponseStyleId;
  showReferences: boolean;
  showReasoningTrace: boolean;
  timePeriodFilter: TimePeriodFilterId;
}

export interface SavedAnswer {
  id: string;
  question: string;
  answerSnippet: string;
  fullAnswer: string;
  persona: string;
  confidenceScore: number;
  savedAt: string;
  sources: string[];
  tags: string[];
}

export interface SystemServiceStatus {
  id: string;
  name: string;
  category: string;
  status: "Operational" | "Prototype" | "Coming Soon";
  latency: string;
  uptime: string;
  description: string;
}

export interface WorkspaceItem {
  id: string;
  title: string;
  description: string;
  category: "Cognitive Systems" | "Philosophy" | "Design" | "Research" | "General";
  icon: string;
  createdAt: string;
  updatedAt: string;
  sources: Source[];
  messages: ChatMessage[];
  artifacts: StudioArtifact[];
  isFavorite?: boolean;
  config?: WorkspaceConfig;
}

export const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  persona: "policy-analyst",
  referenceStyle: "in-depth",
  responseStyle: "in-depth",
  showReferences: true,
  showReasoningTrace: true,
  timePeriodFilter: "all",
};

export const MODEL_PERSONAS: { id: ModelPersonaId; title: string; description: string }[] = [
  {
    id: "policy-analyst",
    title: "Policy Analyst",
    description: "Focuses on strategic levers, statutory compliance, and sector-wide interventions.",
  },
  {
    id: "researcher",
    title: "Academic Researcher",
    description: "Rigorous empirical methodology, provenance tracing, and critical evaluation.",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Highlights quantitative trends, statistical distributions, and vacancy variances.",
  },
  {
    id: "educator",
    title: "Curriculum Specialist",
    description: "Translates labour market signals into TVET curricula and modular micro-credentials.",
  },
  {
    id: "curator",
    title: "Quiet Curator",
    description: "Strictly disciplined, grounded synthesis preserving exact author nuances.",
  },
];

export const REFERENCE_STYLES: { id: ReferenceStyleId; title: string }[] = [
  { id: "in-depth", title: "Comprehensive Synthesis" },
  { id: "concise", title: "Concise Briefing" },
  { id: "socratic", title: "Socratic Inquiry" },
  { id: "aphoristic", title: "Aphoristic Notes" },
];

export const RESPONSE_STYLES = REFERENCE_STYLES;

export const TIME_PERIOD_FILTERS: { id: TimePeriodFilterId; label: string }[] = [
  { id: "all", label: "All Corpus Horizons" },
  { id: "contemporary", label: "Contemporary (2023–2026)" },
  { id: "foundational", label: "Baseline (2018–2022)" },
  { id: "historical", label: "Longitudinal Archives" },
];

export const PROTOTYPE_DOCUMENTS: (Source & { organisation: string; year: string; keyTopics: string[] })[] = [
  {
    id: "doc-ssp-2024",
    title: "merSETA Sector Skills Plan 2024/2025",
    detail: "Statutory Sector Skills Plan · 184 pages",
    type: "Sector Skills Plan",
    organisation: "merSETA",
    year: "2024",
    pageCount: 184,
    dateAdded: "Active in corpus",
    timePeriod: "2024–2025",
    keyTopics: ["Artisan Trades", "Manufacturing 4.0", "Skills Priorities", "Chamber Profiles"],
    content:
      "Section 3.4 highlights priority skills lists: mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exhibit vacancy rates exceeding 34% across primary manufacturing chambers. Technological transformation within automotive and metal engineering sub-sectors necessitates a rapid transition toward hybrid artisan qualifications combining electro-mechanical competencies with digital sensor calibration and telemetry diagnostics.",
  },
  {
    id: "doc-jet-2024",
    title: "Learning Pathways in the Context of a Just Energy Transition",
    detail: "Research Monograph · 96 pages",
    type: "Research Report",
    organisation: "Wits REAL / GIZ",
    year: "2024",
    pageCount: 96,
    dateAdded: "Active in corpus",
    timePeriod: "2024",
    keyTopics: ["Just Transition", "Decarbonisation", "Artisan Re-skilling", "Mpumalanga"],
    content:
      "Modular learning pathways with accredited micro-credentials allow displaced coal facility artisans to transition into renewable energy project sites within 6 to 9 months, preserving wage security. Phased decommissioning of coal-fired facilities in Mpumalanga directly exposes boilermakers, pipe-fitters, and heavy electrical technicians to employment dislocation.",
  },
  {
    id: "doc-elma-2024",
    title: "Employment and Labour Market Analysis in South Africa",
    detail: "Empirical Labour Market Analysis · 142 pages",
    type: "Labour Market Analysis",
    organisation: "Wits REAL / GIZ",
    year: "2024",
    pageCount: 142,
    dateAdded: "Active in corpus",
    timePeriod: "2024",
    keyTopics: ["Labour Polarization", "Manufacturing Contraction", "P1/P2 Placements", "Youth Absorption"],
    content:
      "Demand for low-skilled manual manufacturing labour has contracted by 14% over the preceding decade, while demand for specialized technicians, quality engineers, and certified trades has grown by 19%. The primary structural bottleneck preventing youth absorption into formal apprenticeships remains the availability of employer-hosted P1 and P2 workplace experiential placements.",
  },
  {
    id: "doc-sanea-2023",
    title: "South African Energy Skills Roadmap 2023–2030",
    detail: "Strategic National Roadmap · 112 pages",
    type: "Strategic Roadmap",
    organisation: "SANEA / Wits REAL",
    year: "2023",
    pageCount: 112,
    dateAdded: "Active in corpus",
    timePeriod: "2023–2030",
    keyTopics: ["Transmission Grid", "Renewable Energy", "Green Hydrogen", "Engineering Capacity"],
    content:
      "South Africa's energy roadmap projects a cumulative requirement of 145,000 new technical and engineering jobs by 2030 across transmission grid expansion, solar photovoltaic installations, and green hydrogen demonstration hubs.",
  },
  {
    id: "doc-bankseta-2018",
    title: "Skills Supply and Demand in the Engineering and Services Sectors",
    detail: "Historical Baseline Study · 78 pages",
    type: "Research Report",
    organisation: "BankSETA / merSETA",
    year: "2018",
    pageCount: 78,
    dateAdded: "Active in corpus",
    timePeriod: "2018",
    keyTopics: ["Longitudinal Baseline", "Artisan Pipeline", "TVET Infrastructure", "SETA Discretionary Grants"],
    content:
      "Baseline evaluation establishes that artisan certification throughput grew by only 2.1% per annum between 2014 and 2018, leading to acute structural deficits when major capital infrastructure projects commenced.",
  },
];

export const SEED_SAVED_ANSWERS: SavedAnswer[] = [
  {
    id: "ans-1",
    question: "What are the primary artisan trade shortages in the MER manufacturing sector?",
    answerSnippet:
      "Mechanical fitters, millwrights, and CNC toolmakers face vacancy rates exceeding 34% across primary manufacturing chambers...",
    fullAnswer:
      "According to the merSETA Sector Skills Plan 2024/2025, critical skills shortages in the MER sector remain heavily concentrated in core artisan and technical trades [1]. Vacancy rates for mechanical fitters, millwrights, CNC toolmakers, and mechatronics technicians exceed 34% across primary manufacturing chambers [1]. Furthermore, technological transformation within the automotive and metal engineering sub-sectors necessitates a rapid transition toward hybrid artisan qualifications combining electro-mechanical competencies with digital sensor calibration and telemetry diagnostics [1].",
    persona: "Policy Analyst",
    confidenceScore: 87,
    savedAt: "2 days ago",
    sources: ["merSETA Sector Skills Plan 2024/2025"],
    tags: ["Artisans", "Manufacturing", "Shortages"],
  },
  {
    id: "ans-2",
    question: "How will the Just Energy Transition impact artisan employment in Mpumalanga?",
    answerSnippet:
      "Phased coal station decommissioning directly affects boilermakers, pipefitters, and heavy welders, requiring 6–9 month modular pathways...",
    fullAnswer:
      "Research conducted by Wits REAL and GIZ (2024) indicates that the Just Energy Transition requires an urgent restructuring of vocational training pathways [1]. Phased decommissioning of coal-fired facilities in Mpumalanga directly exposes boilermakers, pipe-fitters, and heavy electrical technicians to employment dislocation. The study establishes that modular learning pathways with accredited micro-credentials enable artisans to bridge into solar photovoltaic, wind turbine, and green hydrogen projects in 6 to 9 months [1]. This aligns with the SANEA Energy Skills Roadmap (2023), which projects 145,000 net new technical and engineering jobs needed by 2030 [2].",
    persona: "Researcher",
    confidenceScore: 92,
    savedAt: "Yesterday",
    sources: ["Learning Pathways in the Context of a JET", "SANEA Energy Skills Roadmap"],
    tags: ["Just Transition", "Energy", "Mpumalanga"],
  },
];

export const SYSTEM_STATUSES: SystemServiceStatus[] = [
  {
    id: "retrieval",
    name: "Sector Corpus Vector Retrieval (Hybrid BM25 + Dense)",
    category: "Retrieval Pipeline",
    status: "Operational",
    latency: "42ms",
    uptime: "99.98%",
    description: "Embeddings indexed over the 5 prototype texts with strict chunk provenance.",
  },
  {
    id: "citations",
    name: "Statutory Page Citation Verification Engine",
    category: "Provenance",
    status: "Operational",
    latency: "18ms",
    uptime: "100%",
    description: "Every citation marker maps to verified page boundaries in statutory texts.",
  },
  {
    id: "consensus",
    name: "Dual-Model Agreement Consensus (LLaMA 3.3 / DeepSeek R1)",
    category: "Inference Consensus",
    status: "Operational",
    latency: "280ms",
    uptime: "99.94%",
    description: "Calculates empirical model agreement score and uncertainty boundaries.",
  },
  {
    id: "reasoning",
    name: "Bayesian Sector Reasoning Trace Generator",
    category: "Cognitive Engine",
    status: "Prototype",
    latency: "120ms",
    uptime: "98.5%",
    description: "Maps macroeconomic trends to occupational shifts and TVET recommendations.",
  },
  {
    id: "live-ingestion",
    name: "Automated Annual Workplace Skills Plan (WSP) Ingestion",
    category: "Data Pipeline",
    status: "Coming Soon",
    latency: "—",
    uptime: "—",
    description: "Scheduled integration for batch employer Workplace Skills Plan returns.",
  },
];

export const INITIAL_SOURCES: Source[] = PROTOTYPE_DOCUMENTS;

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    persona: "Policy Analyst",
    content:
      "Welcome to merSIA. I have indexed the 5 approved MER sector statutory and empirical documents from merSETA and Wits REAL. Inquire about emerging skills priorities, Just Transition re-skilling pathways, or labour market demand signals.",
    timestamp: "Just now",
    citations: [
      {
        sourceId: "doc-ssp-2024",
        sourceTitle: "merSETA Sector Skills Plan 2024/2025",
        organisation: "merSETA",
        year: "2024",
        page: 12,
        documentType: "Sector Skills Plan",
        snippet: "Statutory skills priorities identified across manufacturing and engineering chambers.",
        evidenceStatus: "Verified",
        confidenceLevel: "High",
        method: "Statutory employer data aggregation",
        observationPeriod: "2024–2025",
      },
      {
        sourceId: "doc-jet-2024",
        sourceTitle: "Learning Pathways in the Context of a Just Energy Transition",
        organisation: "Wits REAL / GIZ",
        year: "2024",
        page: 18,
        documentType: "Research Report",
        snippet: "Modular micro-credentials enable artisans to bridge into renewable energy sites in 6 to 9 months.",
        evidenceStatus: "Verified",
        confidenceLevel: "High",
        method: "Empirical field study",
        observationPeriod: "2024",
      },
    ],
    confidence: {
      score: 92,
      level: "HIGH",
      modelAgreement: { llama: true, deepSeek: true },
      note: "100% corpus grounded in merSETA SSP 2024/25 and Wits REAL research.",
    },
    reasoningTrace: {
      title: "Initial Sector Corpus Orientation",
      steps: [
        {
          title: "1. Corpus Indexation",
          description: "Verified 5 approved prototype sector documents across statutory and empirical research.",
          status: "verified",
        },
        {
          title: "2. Horizon Framing",
          description: "Established temporal range from 2018 baseline to 2024 statutory forecasts.",
          status: "verified",
        },
        {
          title: "3. Research Readiness",
          description: "Grounded RAG pipeline prepared for occupational and skills intelligence queries.",
          status: "verified",
        },
      ],
      disclaimer: "Answers are grounded strictly in the 5 prototype texts.",
    },
  },
];

// LocalStorage Persistence Keys
const AUTH_KEY = "mersia_auth_user";
const MESSAGES_KEY = "mersia_messages_v2";
const CONFIG_KEY = "mersia_config_v2";
const SAVED_ANSWERS_KEY = "mersia_saved_answers_v2";
const WORKSPACES_KEY = "mersia_workspaces_v2";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function saveStoredMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event("mersia_messages_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredConfig(): WorkspaceConfig {
  if (typeof window === "undefined") return DEFAULT_WORKSPACE_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_WORKSPACE_CONFIG;
  } catch {
    return DEFAULT_WORKSPACE_CONFIG;
  }
}

export function saveStoredConfig(config: WorkspaceConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("mersia_config_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredSavedAnswers(): SavedAnswer[] {
  if (typeof window === "undefined") return SEED_SAVED_ANSWERS;
  try {
    const raw = localStorage.getItem(SAVED_ANSWERS_KEY);
    if (!raw) {
      localStorage.setItem(SAVED_ANSWERS_KEY, JSON.stringify(SEED_SAVED_ANSWERS));
      return SEED_SAVED_ANSWERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_SAVED_ANSWERS;
  } catch {
    return SEED_SAVED_ANSWERS;
  }
}

export function saveStoredSavedAnswers(answers: SavedAnswer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_ANSWERS_KEY, JSON.stringify(answers));
    window.dispatchEvent(new Event("mersia_saved_answers_updated"));
  } catch (e) {
    console.error(e);
  }
}

export const DEFAULT_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-mer-sector",
    title: "MER Sector Skills Intelligence",
    description: "Statutory skills shortages, Just Transition re-skilling, and artisan qualification pathways.",
    category: "Research",
    icon: "01",
    createdAt: "2026-03-15",
    updatedAt: "Just now",
    sources: INITIAL_SOURCES,
    messages: INITIAL_MESSAGES,
    artifacts: [
      {
        type: "guide",
        title: "Artisan Shortages Executive Summary",
        createdAt: "Yesterday",
        content:
          "Synthesized overview of mechanical, mechatronic, and electrical artisan deficits across primary manufacturing chambers.",
      },
      {
        type: "briefing",
        title: "Just Transition Regional Labour Briefing",
        createdAt: "3 days ago",
        content:
          "Mpumalanga coal facility decommissioning timeline mapped against 6-9 month modular micro-credentialing pathways.",
      },
    ],
    isFavorite: true,
    config: DEFAULT_WORKSPACE_CONFIG,
  },
  {
    id: "ws-just-transition",
    title: "Just Energy Transition & Re-skilling",
    description: "Decarbonisation labour shifts, renewable energy capacity, and TVET curriculum adaptation.",
    category: "Philosophy",
    icon: "02",
    createdAt: "2026-03-20",
    updatedAt: "2 hours ago",
    sources: [PROTOTYPE_DOCUMENTS[1] || PROTOTYPE_DOCUMENTS[0]!, PROTOTYPE_DOCUMENTS[3] || PROTOTYPE_DOCUMENTS[0]!],
    messages: [
      {
        id: "msg-jet-1",
        role: "assistant",
        persona: "Policy Analyst",
        content:
          "This workspace is focused on the Just Energy Transition (JET). Based on Wits REAL & SANEA research, 145,000 net new energy jobs will be required by 2030, with high urgency in Mpumalanga.",
        timestamp: "2 hours ago",
        citations: [
          {
            sourceId: "doc-jet-2024",
            sourceTitle: "Learning Pathways in the Context of a Just Energy Transition",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 18,
            documentType: "Research Report",
            snippet: "Modular micro-credentials enable artisans to bridge into renewable energy sites in 6 to 9 months.",
            evidenceStatus: "Verified",
            confidenceLevel: "High",
          },
        ],
        confidence: {
          score: 94,
          level: "HIGH",
          modelAgreement: { llama: true, deepSeek: true },
        },
      },
    ],
    artifacts: [],
    isFavorite: true,
    config: {
      ...DEFAULT_WORKSPACE_CONFIG,
      persona: "researcher",
    },
  },
  {
    id: "ws-labour-dynamics",
    title: "Labour Market Dynamics & Placements",
    description: "Empirical analysis of youth unemployment, P1/P2 experiential bottlenecks, and qualification demand.",
    category: "Cognitive Systems",
    icon: "03",
    createdAt: "2026-03-25",
    updatedAt: "Yesterday",
    sources: [PROTOTYPE_DOCUMENTS[2] || PROTOTYPE_DOCUMENTS[0]!, PROTOTYPE_DOCUMENTS[4] || PROTOTYPE_DOCUMENTS[0]!],
    messages: [
      {
        id: "msg-elma-1",
        role: "assistant",
        persona: "Data Scientist",
        content:
          "Labour analysis indicates a 14% contraction in low-skilled manual manufacturing roles over the last decade, contrasted with a 19% increase in demand for certified technicians and quality inspectors.",
        timestamp: "Yesterday",
        citations: [
          {
            sourceId: "doc-elma-2024",
            sourceTitle: "Employment and Labour Market Analysis in South Africa",
            organisation: "Wits REAL / GIZ",
            year: "2024",
            page: 45,
            documentType: "Labour Market Analysis",
            snippet: "Demand for low-skilled manual manufacturing contracted by 14% while specialized technicians grew 19%.",
            evidenceStatus: "Verified",
            confidenceLevel: "High",
          },
        ],
        confidence: {
          score: 89,
          level: "HIGH",
          modelAgreement: { llama: true, deepSeek: true },
        },
      },
    ],
    artifacts: [],
    isFavorite: false,
    config: {
      ...DEFAULT_WORKSPACE_CONFIG,
      persona: "data-scientist",
    },
  },
  {
    id: "ws-auto-manufacturing",
    title: "Automotive & Chamber 4.0 Transformation",
    description: "Electric vehicle powertrain adoption, mechatronics automation, and CNC precision tooling needs.",
    category: "Design",
    icon: "04",
    createdAt: "2026-04-01",
    updatedAt: "3 days ago",
    sources: [PROTOTYPE_DOCUMENTS[0]!, PROTOTYPE_DOCUMENTS[3] || PROTOTYPE_DOCUMENTS[0]!],
    messages: [],
    artifacts: [],
    isFavorite: false,
    config: DEFAULT_WORKSPACE_CONFIG,
  },
];

export function getStoredWorkspaces(): WorkspaceItem[] {
  if (typeof window === "undefined") return DEFAULT_WORKSPACES;
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(DEFAULT_WORKSPACES));
      return DEFAULT_WORKSPACES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_WORKSPACES;
  } catch {
    return DEFAULT_WORKSPACES;
  }
}

export function saveStoredWorkspaces(workspaces: WorkspaceItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
    window.dispatchEvent(new Event("mersia_workspaces_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredWorkspace(id: string): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  return all.find((ws) => ws.id === id) || all[0] || null;
}

export function createStoredWorkspace(data: {
  title: string;
  description?: string;
  category?: "Cognitive Systems" | "Philosophy" | "Design" | "Research" | "General";
  sources?: Source[];
}): WorkspaceItem {
  const all = getStoredWorkspaces();
  const newWorkspace: WorkspaceItem = {
    id: `ws-${Date.now()}`,
    title: data.title.trim() || "Untitled Notebook",
    description: data.description?.trim() || "Notebook for sectoral research and statutory analysis.",
    category: data.category || "Research",
    icon: String(all.length + 1).padStart(2, "0"),
    createdAt: "Just now",
    updatedAt: "Just now",
    sources: data.sources && data.sources.length > 0 ? data.sources : INITIAL_SOURCES,
    messages: [
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        persona: "Policy Analyst",
        content: `Welcome to "${data.title.trim() || "Untitled Notebook"}". I am ready to assist your inquiry with grounded evidence from the selected sources.`,
        timestamp: "Just now",
      },
    ],
    artifacts: [],
    isFavorite: false,
    config: DEFAULT_WORKSPACE_CONFIG,
  };

  const updated = [newWorkspace, ...all];
  saveStoredWorkspaces(updated);
  return newWorkspace;
}

export function updateStoredWorkspace(id: string, updates: Partial<WorkspaceItem>): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  let updatedItem: WorkspaceItem | null = null;
  const updated = all.map((ws) => {
    if (ws.id === id) {
      updatedItem = { ...ws, ...updates, updatedAt: "Just now" };
      return updatedItem;
    }
    return ws;
  });
  if (updatedItem) {
    saveStoredWorkspaces(updated);
  }
  return updatedItem;
}

export function deleteStoredWorkspace(id: string): boolean {
  const all = getStoredWorkspaces();
  if (all.length <= 1) return false; // keep at least 1
  const filtered = all.filter((ws) => ws.id !== id);
  saveStoredWorkspaces(filtered);
  return true;
}

export function duplicateStoredWorkspace(id: string): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  const source = all.find((ws) => ws.id === id);
  if (!source) return null;

  const duplicated: WorkspaceItem = {
    ...source,
    id: `ws-${Date.now()}`,
    title: `${source.title} (Copy)`,
    createdAt: "Just now",
    updatedAt: "Just now",
    isFavorite: false,
  };

  const updated = [duplicated, ...all];
  saveStoredWorkspaces(updated);
  return duplicated;
}

export function toggleFavoriteWorkspace(id: string): boolean {
  const all = getStoredWorkspaces();
  let isFav = false;
  const updated = all.map((ws) => {
    if (ws.id === id) {
      isFav = !ws.isFavorite;
      return { ...ws, isFavorite: isFav };
    }
    return ws;
  });
  saveStoredWorkspaces(updated);
  return isFav;
}

export function resetWorkspacesToDefault(): WorkspaceItem[] {
  saveStoredWorkspaces(DEFAULT_WORKSPACES);
  return DEFAULT_WORKSPACES;
}
