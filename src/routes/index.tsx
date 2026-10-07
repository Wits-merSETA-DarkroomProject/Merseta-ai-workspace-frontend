import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceHub } from "@/components/mersia/WorkspaceHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workspaces & Research Hub — merSIA" },
      {
        name: "description",
        content:
          "Manage sector intelligence workspaces, explore statutory evidence corpus, and synthesize findings with merSIA.",
      },
      { property: "og:title", content: "Workspaces & Research Hub — merSIA" },
      {
        property: "og:description",
        content:
          "Manage sector intelligence workspaces, explore statutory evidence corpus, and synthesize findings with merSIA.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return <WorkspaceHub />;
}