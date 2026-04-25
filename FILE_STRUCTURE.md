# File Structure

## Chosen Structure
The project will use the `Option 2` structure: small, board-focused, and flexible enough for design-system work without overengineering the MVP.

```txt
app/
  api/
    arrivals/
      route.ts
  globals.css
  layout.tsx
  page.tsx

components/
  board/
    arrival-row.tsx
    arrival-list.tsx
    station-header.tsx
    board-footer.tsx
  ui/
    badge.tsx
    icon.tsx
    divider.tsx

lib/
  config.ts
  cta/
    arrivals.ts
    types.ts
    format.ts
  weather/
    types.ts

styles/
  tokens.css
  board.css

public/
  icons/
    cta-train-open.svg
    cta-bus-open.svg

docs/
  research/
    CTA_BRANDING_NOTES.md

DESIGN_SYSTEM.md
PROJECT_SPEC.md
TECH_STACK.md
FILE_STRUCTURE.md
```

## Why This Structure
- `app/` stays very small and only owns routing, global styles, and server routes.
- `components/board/` contains the CTA-board-specific UI.
- `components/ui/` contains small reusable primitives that are not specific to train arrivals.
- `lib/cta/` contains CTA-specific fetching, formatting, and types.
- `lib/weather/` is separated so weather logic does not leak into CTA-specific code.
- `styles/` gives us a clean place for tokens and board-specific CSS without putting every rule in `globals.css`.
- `public/icons/` holds the extracted CTA assets we already prepared.

## Responsibilities
### app/
- `page.tsx`: the single-screen board page for the display
- `layout.tsx`: root HTML shell
- `globals.css`: app-wide reset and global variables import
- `api/arrivals/route.ts`: tiny proxy endpoint for CTA arrivals

### components/board/
- `arrival-row.tsx`: the core CTA-style row unit
- `arrival-list.tsx`: stacked arrival rows, sorted and capped for display
- `station-header.tsx`: top station label band
- `board-footer.tsx`: persistent weather/time footer

### components/ui/
- `badge.tsx`: small status badges such as `Scheduled`
- `icon.tsx`: simple wrapper for SVG icons or icon slots
- `divider.tsx`: horizontal divider primitive if we abstract row separators

### lib/cta/
- `types.ts`: CTA arrival types and normalized board row types
- `arrivals.ts`: CTA data fetching helpers or server-side adapters
- `format.ts`: ETA formatting, route naming, and destination formatting

### lib/weather/
- `types.ts`: footer weather data shape for later use

### lib/
- `config.ts`: code-driven MVP config for station, max rows, refresh interval, and route filters if needed later

### styles/
- `tokens.css`: design-system tokens translated from `DESIGN_SYSTEM.md`
- `board.css`: board-specific structural styling for the MVP

## MVP Build Order
1. `styles/tokens.css`
2. `components/board/arrival-row.tsx`
3. `components/board/arrival-list.tsx`
4. `components/board/station-header.tsx`
5. `components/board/board-footer.tsx`
6. `app/page.tsx`
7. `lib/config.ts`
8. `app/api/arrivals/route.ts`
9. `lib/cta/*`

## Notes
- The MVP is still a one-page application.
- This structure keeps the project minimal while avoiding a single flat `components/` folder that will get messy during row design iteration.
- Bus support and multi-station support can be added later without forcing a reorganization.
