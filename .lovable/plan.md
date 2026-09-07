# Notebook-style AI workspace

## Scope
- Replace the blank home screen with a polished, responsive research workspace inspired by NotebookLM, using a restrained editorial visual language drawn from Notion AI and OpenAI.
- Add a separate `/login` page with a clean sign-in form and matching visual system.
- Keep every interaction presentation-only: no authentication, uploads, AI calls, persistence, or sample response behavior.

## Experience
- Build a three-part workspace: source library, central notebook conversation, and studio/output area.
- Use purposeful sample content so the interface feels complete, while clearly avoiding simulated actions or fake loading/results.
- Add subtle entrance, focus, panel, and control transitions with reduced-motion support.
- Adapt the workspace into a clear stacked layout on small screens without overlaps.

## Design system
- Create a warm neutral canvas, ink typography, restrained green accent, fine borders, compact radii, and soft elevation through semantic design tokens.
- Use an editorial serif for key titles and a crisp sans-serif for interface text.
- Reuse the same navigation, controls, spacing, and state language across the workspace and sign-in page.

## Technical details
- Implement route-specific metadata for `/` and `/login`.
- Add the `/login` route before linking to it from the workspace.
- Keep all visuals in frontend files only and preserve the existing TanStack application structure.
- Verify desktop and mobile rendering in the live app.
