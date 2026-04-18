# ClaimFlow AI — Claim Orchestrator Dashboard

AI-assisted, mobile-first dashboard for tracking an insurance claim: status, ETA, actionable items, polymorphic timeline rendering, and simulated AI helpers.

## Prerequisites

- Node.js (LTS recommended)

## Scripts (npm)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # serves production build locally
npm run lint
```

### Desktop (local)

1. Run `npm install` (once), then `npm run dev`.
2. Open **http://localhost:5173** in your browser (Chrome, Edge, Firefox, Safari).
3. To **simulate a phone/tablet width** without a device: open DevTools (**F12** or **Cmd+Option+I** on macOS) → toggle the **device toolbar** (**Cmd+Shift+M** in Chrome/Edge) and pick a preset or custom width.

### Mobile (real phone or tablet)

Your computer and phone must be on the **same Wi‑Fi**. Allow incoming connections in the OS firewall if prompted.

1. From the project folder, start the dev server with the host exposed:

   ```bash
   npm run dev -- --host
   ```

2. In the terminal, Vite prints a **Network** URL (e.g. `http://192.168.x.x:5173`). Open that URL in the phone’s browser.

3. To try the **production build** on the LAN:

   ```bash
   npm run build && npm run preview -- --host
   ```

   Use the **Network** URL from the terminal on your phone, same as above.

## Technical stack

- React (Vite) + TypeScript  
- Tailwind CSS v4 + bespoke UI primitives (button/card/dialog patterns aligned with **shadcn/ui** ergonomics, without the CLI scaffolding)  
- TanStack React Query (`fetch('/claim-process.json')` + **Zod** parsing)  
- **Zustand** for insertion nodes (“information notes” / “attachments”) + simulated AI explanation + document-review state  
- **Zod** for API payloads and note validation  
- **i18next** + **react-i18next** for **English** and **Turkish** UI copy (`src/i18n/locales/`, language stored in `localStorage` as `claimflow_locale`)  
- **Theming** — [shadcn/ui](https://ui.shadcn.com/)-style **semantic CSS variables** in `src/index.css` (`@theme` for Tailwind v4) + `components.json` for CLI alignment; **light** presentation with a **blue primary** and cool-mist **background** (no auto dark-on-OS to avoid flat slate navies)

## Architecture highlights

1. **Registry pattern** — `processDetails` items resolve to a typed renderer via `Map<title, Renderer>` (`src/features/claim/processRegistry.tsx`). Unknown titles fall back to a generic field grid without a giant `switch`.
2. **Responsive layout** — stacked timeline on small screens; on large screens the timeline spans the primary column with a sticky guidance column.
3. **Dynamic timeline inserts** — client-only notes and attachment markers stored in Zustand; removable per row.
4. **Mock claim assistant** — floating action button (bottom-right) opens a slide-over chat on all screen sizes. Rule-based replies in `src/features/assistant/mockAssistant.ts` (no API); copy in i18n.
5. **Simulated AI (milestones)**  
   - **Explain with AI** — plain-language copy per milestone (`src/i18n/locales/*.json` + `src/i18n/display.ts`).  
   - **AI document review** — heuristic filename check on the Deduction Reason step (`DocumentAnalyzerPanel`).

## Dataset

Fixture lives at `public/claim-process.json`. Shape is validated through `claimProcessSchema` (`src/features/claim/schemas.ts`).

## Routing

| Path | Screen |
|------|--------|
| `/` | Claim dashboard (summary, incidents list, policy, full claim timeline) |
| `/incidents/:incidentId` | Single incident detail (milestones, uploads, partner note, support form) |

`incidentId` values match the `incidents[].id` entries in the fixture (open a card from the dashboard or construct the URL manually while developing).

## Scope & limitations

- **No backend** in this repo: the UI reads the static JSON under `public/` via `fetch`. There are **no `.env` files or API keys** required for local runs.
- **Assistant chat**, **notes**, **support/partner submissions**, and **upload pickers** are **client-side simulations** (state + UX only), unless you wire them to a real API later.

## Case-study README prompts

**Design choices**

- Optimize for scanning: three summary cards mirror the brief’s “answers within seconds” framing.
- Touch-friendly targets (`min-height` / padding on interactive controls).

**If I had more time**

- Persist inserts to storage or backend; add optimistic updates.
- Replace simulated AI with a guarded API route + streaming responses.
- Add Vitest coverage for schemas and registry fallback behavior.

**AI tooling used**

- Coding assistant for scaffolding Tailwind primitives, ESLint fixes, and copy tightening.

---

MIT License — see `LICENSE`.
