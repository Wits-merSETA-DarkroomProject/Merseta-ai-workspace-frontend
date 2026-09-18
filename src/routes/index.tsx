import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mersia/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "merSIA — MER Sector Intelligence Assistant" },
      {
        name: "description",
        content:
          "Closed, traceable sectoral intelligence platform for the Manufacturing, Engineering and Related Services sector.",
      },
      { property: "og:title", content: "merSIA — MER Sector Intelligence Assistant" },
      {
        property: "og:description",
        content:
          "Closed, traceable sectoral intelligence platform for the Manufacturing, Engineering and Related Services sector.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return <AppShell />;
}