export interface Source {
  id: string;
  title: string;
  detail: string;
  type: "pdf" | "web" | "doc" | "note";
  author?: string;
  dateAdded: string;
  timePeriod?: string; // e.g. "1991", "2023", "Contemporary", "1996–1999"
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { sourceId: string; sourceTitle: string; snippet: string; timePeriod?: string | undefined }[];
  timestamp: string;
  reasoningTrace?: {
    intent: string;
    sourcesConsulted: string[];
    synthesisSteps: string[];
    confidence: "high" | "moderate";
  } | undefined;
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

export type ModelPersonaId = "curator" | "dialectical" | "distiller" | "academic";
export type ResponseStyleId = "concise" | "in-depth" | "socratic" | "aphoristic";

export interface WorkspaceConfig {
  persona: ModelPersonaId;
  responseStyle: ResponseStyleId;
  showReferences: boolean;
  showReasoningTrace: boolean;
  timePeriodFilter: "all" | "contemporary" | "foundational" | "historical";
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
  persona: "curator",
  responseStyle: "in-depth",
  showReferences: true,
  showReasoningTrace: true,
  timePeriodFilter: "all",
};

export const MODEL_PERSONAS: { id: ModelPersonaId; title: string; description: string }[] = [
  {
    id: "curator",
    title: "Quiet Curator",
    description: "Strictly disciplined, grounded synthesis preserving exact author nuances.",
  },
  {
    id: "dialectical",
    title: "Dialectical Inquirer",
    description: "Actively highlights contradictions and tensions between opposing source texts.",
  },
  {
    id: "distiller",
    title: "Minimal Distiller",
    description: "Dieter Rams-style reduction: essential principles only, zero extraneous verbiage.",
  },
  {
    id: "academic",
    title: "Scholarly Exegete",
    description: "Rigorous historical context, theoretical lineage, and provenance tracing.",
  },
];

export const RESPONSE_STYLES: { id: ResponseStyleId; title: string }[] = [
  { id: "in-depth", title: "Comprehensive Synthesis" },
  { id: "concise", title: "Concise Briefing" },
  { id: "socratic", title: "Socratic Inquiry" },
  { id: "aphoristic", title: "Aphoristic Notes" },
];

export const TIME_PERIOD_FILTERS = [
  { id: "all", label: "All Periods" },
  { id: "contemporary", label: "Contemporary (2020+)" },
  { id: "foundational", label: "Foundational (1990–2010)" },
  { id: "historical", label: "Classical & Historical" },
] as const;

export const INITIAL_SOURCES: Source[] = [
  {
    id: "src-1",
    title: "The Architecture of Attention",
    detail: "PDF · 24 pages",
    type: "pdf",
    author: "Dr. Elena Vance, Cognitive Systems Lab",
    dateAdded: "2 hours ago",
    timePeriod: "2024",
    content: `Human cognitive bandwidth is strictly bounded: working memory sustains roughly 4 discrete information chunks before degradation occurs. When digital interfaces introduce unsolicited sensory interruptions—such as badge notifications, unsolicited modal overlays, and competing visual streams—the cognitive switching penalty consumes up to 23 minutes before pre-interruption focus is re-established.\n\nDesigning calm computing environments requires reversing this hierarchy. Systems must prioritize passive peripheral awareness over active attention capture. By grounding knowledge in spatial canvases rather than ephemeral feeds, researchers retain higher cognitive autonomy and maintain durable flow states.`
  },
  {
    id: "src-2",
    title: "Designing for Deep Work",
    detail: "Website · readwise.io",
    type: "web",
    author: "Readwise Research Collective",
    dateAdded: "Yesterday",
    timePeriod: "2023",
    content: `Knowledge workers spend over 58% of their day coordinating work rather than synthesizing insights. The deep work imperative argues that true innovation stems from prolonged periods of uninterrupted synthesis with primary sources.\n\nKey principles for modern research tools include:\n1. Zero-latency retrieval of connected ideas\n2. Frictionless margin annotations that live adjacent to original texts\n3. Algorithmic synthesis that preserves strict source provenance, preventing hallucinated conclusions.`
  },
  {
    id: "src-3",
    title: "Calm Technology Principles",
    detail: "Document · 1,840 words",
    type: "doc",
    author: "Mark Weiser & John Seely Brown",
    dateAdded: "3 days ago",
    timePeriod: "1996",
    content: `Calm technology is that which informs but doesn't demand our focus or attention. A calm tool moves easily between the periphery of our attention and its center. By remaining peripheral most of the time, calm technology dramatically increases the range of things we can be aware of without burdening our mental processing power.\n\nWhen we query a knowledge base, the output should feel like a natural extension of our own memory: clean, unobtrusive, and rigorously verified against what we personally trust.`
  },
  {
    id: "src-4",
    title: "Ambient Synthesis Interfaces",
    detail: "PDF · 12 pages",
    type: "pdf",
    author: "Interface Horizon Group",
    dateAdded: "Last week",
    timePeriod: "2022",
    content: `Traditional chat interfaces force a linear conversational bottleneck onto multi-dimensional research. In contrast, ambient canvas synthesis presents sources, generative discussions, and living artifacts (study guides, audio overviews, executive syntheses) side-by-side in synchronized harmony.\n\nUsers must always have immediate visibility into which sources are currently active in context, with the ability to toggle or isolate specific documents in real time.`
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    content: "Welcome to Fieldnotes. I have indexed your 4 active sources spanning from 1996 foundational calm tech to 2024 cognitive systems research. Inquire across connected ideas, inspect reasoning traces, or configure synthesis personas above.",
    citations: [
      {
        sourceId: "src-1",
        sourceTitle: "The Architecture of Attention",
        snippet: "Working memory sustains roughly 4 discrete chunks before degradation occurs.",
        timePeriod: "2024",
      },
      {
        sourceId: "src-3",
        sourceTitle: "Calm Technology Principles",
        snippet: "Calm technology informs without demanding active focus.",
        timePeriod: "1996",
      }
    ],
    timestamp: "Just now",
    reasoningTrace: {
      intent: "Initial environment orientation & temporal cross-mapping",
      sourcesConsulted: ["The Architecture of Attention (2024)", "Calm Technology Principles (1996)"],
      synthesisSteps: [
        "Identified temporal span (1996–2024) across 4 grounded documents",
        "Extracted core dichotomy: biological cognitive limits vs peripheral interface architecture",
        "Formulated quiet orientation without ungrounded extrapolations"
      ],
      confidence: "high"
    }
  }
];

export const INITIAL_ARTIFACTS: StudioArtifact[] = [
  {
    type: "audio",
    title: "Audio Overview",
    createdAt: "Yesterday",
    audioDuration: "2 min 14 sec",
    content: `Host A: Welcome back to the Notebook Deep Dive. Today we're looking at cognitive architectures and calm computing principles across your active sources.\n\nHost B: What stands out immediately in Vance's work is the biological limit: our working memory can only comfortably juggle about four discrete concepts before degradation occurs.\n\nHost A: Exactly. And the companion notes from Weiser and Brown argue that the solution isn't to disconnect entirely, but to design tools that live quietly on the periphery until summoned.\n\nHost B: That distinction between 'peripheral awareness' and 'active attention capture' is what defines modern canvas design.`
  },
  {
    type: "guide",
    title: "Study Guide",
    createdAt: "2 days ago",
    content: `## Executive Overview\nThis study guide synthesizes findings regarding working memory limits, notification switching penalties, and calm UI architectures across 1996–2024.\n\n### Core Concepts\n- Cognitive Switching Penalty: The delay required to regain peak focus after an unprompted digital interruption.\n- Peripheral Awareness: Interface feedback that exists outside direct foveal focus.\n- Provenance Tracking: Continuous attribution pinning synthetic conclusions to verifiable source text.`
  }
];

export const SEED_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-attention-architecture",
    title: "Attention Architecture & Calm Computing",
    description: "Investigating cognitive switching costs, bounded working memory, and ambient peripheral design systems.",
    category: "Cognitive Systems",
    icon: "01",
    createdAt: "2 days ago",
    updatedAt: "Just now",
    sources: INITIAL_SOURCES,
    messages: INITIAL_MESSAGES,
    artifacts: INITIAL_ARTIFACTS,
    isFavorite: true,
    config: DEFAULT_WORKSPACE_CONFIG,
  },
  {
    id: "ws-minimalist-interfaces",
    title: "Minimalist Interface Ergonomics",
    description: "Deconstructing Dieter Rams & Jony Ive principles for generative artificial intelligence canvases.",
    category: "Design",
    icon: "02",
    createdAt: "4 days ago",
    updatedAt: "Yesterday",
    sources: [
      {
        id: "src-design-1",
        title: "Less, But Better: The Ethos of Reduction",
        detail: "Document · 3,120 words",
        type: "doc",
        author: "Dieter Rams Archive",
        dateAdded: "4 days ago",
        timePeriod: "1976",
        content: "Good design is as little design as possible. Less, but better—because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity."
      },
      {
        id: "src-design-2",
        title: "The Tactile Weight of Digital Objects",
        detail: "PDF · 18 pages",
        type: "pdf",
        author: "Studio Materiality",
        dateAdded: "3 days ago",
        timePeriod: "2021",
        content: "Software interfaces that respect human sensory dignity avoid arbitrary ornament. Every line, elevation, and transition must feel inevitable rather than decorative."
      }
    ],
    messages: [
      {
        id: "msg-design-welcome",
        role: "assistant",
        content: "Workspace ready. 2 design treatises are indexed regarding intentional reduction and unobtrusive software tools across 1976–2021.",
        timestamp: "Yesterday",
        reasoningTrace: {
          intent: "Contextualize industrial design reduction within contemporary software canvases",
          sourcesConsulted: ["Less, But Better (1976)", "The Tactile Weight of Digital Objects (2021)"],
          synthesisSteps: [
            "Mapped physical tenet 'weniger, aber besser' to pixel constraints",
            "Synthesized tactile gravity against screen lightness"
          ],
          confidence: "high"
        }
      }
    ],
    artifacts: [],
    isFavorite: true,
    config: {
      ...DEFAULT_WORKSPACE_CONFIG,
      persona: "distiller",
      responseStyle: "concise",
    },
  },
  {
    id: "ws-distributed-cognition",
    title: "Distributed Cognition & Memory Synthesis",
    description: "How knowledge workers scaffold associative memory through external canvas artifacts.",
    category: "Philosophy",
    icon: "03",
    createdAt: "Last week",
    updatedAt: "3 days ago",
    sources: [
      {
        id: "src-phil-1",
        title: "The Extended Mind Thesis",
        detail: "PDF · 30 pages",
        type: "pdf",
        author: "Andy Clark & David Chalmers",
        dateAdded: "Last week",
        timePeriod: "1998",
        content: "Where does the mind stop and the rest of the world begin? When external representations actively couple with internal processing, the cognitive system encompasses both organism and tool."
      }
    ],
    messages: [
      {
        id: "msg-phil-welcome",
        role: "assistant",
        content: "Indexed classic foundational literature on the Extended Mind Thesis (1998). Ask questions about external representation vs internal retrieval.",
        timestamp: "Last week"
      }
    ],
    artifacts: [],
    isFavorite: false,
    config: {
      ...DEFAULT_WORKSPACE_CONFIG,
      persona: "academic",
    },
  }
];

// Helper to manage auth state in localStorage
const AUTH_KEY = "fieldnotes_auth_user";
const WORKSPACES_KEY = "fieldnotes_workspaces_v2";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession | null) {
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

export function getStoredWorkspaces(): WorkspaceItem[] {
  if (typeof window === "undefined") return SEED_WORKSPACES;
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(SEED_WORKSPACES));
      return SEED_WORKSPACES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(SEED_WORKSPACES));
    return SEED_WORKSPACES;
  } catch (e) {
    console.error(e);
    return SEED_WORKSPACES;
  }
}

export function saveStoredWorkspaces(workspaces: WorkspaceItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
    window.dispatchEvent(new Event("fieldnotes_workspaces_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredWorkspace(id: string): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  return all.find((ws) => ws.id === id) || null;
}

export function createStoredWorkspace(data: {
  title: string;
  description: string;
  category?: WorkspaceItem["category"];
  icon?: string;
  preloadSources?: boolean;
}): WorkspaceItem {
  const all = getStoredWorkspaces();
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "workspace";

  const newWorkspace: WorkspaceItem = {
    id: `ws-${slug}-${Date.now()}`,
    title: data.title.trim(),
    description: data.description.trim() || "A focused research canvas for primary sources.",
    category: data.category || "General",
    icon: String(all.length + 1).padStart(2, "0"),
    createdAt: "Just now",
    updatedAt: "Just now",
    sources: data.preloadSources ? INITIAL_SOURCES : [],
    messages: [
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        content: `Welcome to ${data.title.trim()}. Add your primary source files, documents, or notes on the left to begin grounded synthesis.`,
        timestamp: "Just now",
      }
    ],
    artifacts: [],
    isFavorite: false,
    config: DEFAULT_WORKSPACE_CONFIG,
  };

  const updated = [newWorkspace, ...all];
  saveStoredWorkspaces(updated);
  return newWorkspace;
}

export function updateStoredWorkspace(
  id: string,
  updates: Partial<Omit<WorkspaceItem, "id">>
): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  let updatedItem: WorkspaceItem | null = null;
  const updated = all.map((ws) => {
    if (ws.id === id) {
      updatedItem = {
        ...ws,
        ...updates,
        updatedAt: "Just now",
      };
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
  const filtered = all.filter((ws) => ws.id !== id);
  saveStoredWorkspaces(filtered);
  return true;
}

export function duplicateStoredWorkspace(id: string): WorkspaceItem | null {
  const all = getStoredWorkspaces();
  const target = all.find((ws) => ws.id === id);
  if (!target) return null;

  const duplicated: WorkspaceItem = {
    ...target,
    id: `ws-copy-${Date.now()}`,
    title: `${target.title} (Copy)`,
    createdAt: "Just now",
    updatedAt: "Just now",
  };

  saveStoredWorkspaces([duplicated, ...all]);
  return duplicated;
}

export function resetWorkspacesToDefault(): WorkspaceItem[] {
  saveStoredWorkspaces(SEED_WORKSPACES);
  return SEED_WORKSPACES;
}
