# Tech Stack Overview

## Goal
Build a minimal Chicago CTA train tracker for a vertical `9:16` home display using a frontend-first architecture with the smallest possible server-side component.

## Chosen Stack
- Framework: `Next.js`
- Language: `TypeScript`
- UI: `React`
- Styling: `global CSS` plus `CSS Modules` or simple component-scoped styles
- Hosting: `Vercel` on the `Hobby` plan
- Server-side API layer: `Next.js Route Handler`
- Data fetching: native `fetch`
- Secrets: Vercel environment variables

## Why This Stack
- `Next.js` lets the frontend and the tiny server live in one project.
- `Vercel` deploys Next.js with minimal setup and works well on the free tier for a personal display app.
- A `Route Handler` is enough to proxy CTA requests without running a separate backend service.
- `TypeScript` keeps the CTA response handling predictable as the UI grows.
- Native `fetch` keeps dependencies low.

## Architecture Summary
The app will be a single Next.js project with two responsibilities:

1. Frontend display UI
- Full-screen vertical `9:16` CTA-style train board
- Polls the local app API for arrival data
- Renders station name, current time, arrival rows, and error states

2. Tiny server-side proxy
- Exposes an internal route such as `/api/arrivals`
- Reads `CTA_API_KEY` from the environment
- Calls the CTA Train Tracker API server-side
- Returns filtered and normalized JSON to the frontend

## Why Not Frontend-Only
- Browser-side requests to CTA are likely blocked by `CORS`
- A browser-visible request would expose the CTA API key
- A server-side proxy avoids both problems with very little added complexity

## V1 Technical Decisions
- Use the `Next.js App Router`
- Use one API route at `app/api/arrivals/route.ts`
- Use `Node.js` runtime for the CTA proxy route
- Use polling for refresh instead of websockets or background workers
- Do not add a database for V1
- Do not add authentication for V1
- Do not split the frontend and backend into separate repos or services

## Expected Project Structure
```txt
app/
  api/
    arrivals/
      route.ts
  globals.css
  layout.tsx
  page.tsx
components/
lib/
.env.local
```

## Data Flow
1. The display loads the Next.js page.
2. The frontend calls `/api/arrivals`.
3. The route handler adds the CTA API key server-side.
4. The route handler requests CTA arrival data.
5. The route handler returns simplified JSON.
6. The frontend renders the updated train board.

## Environment Variables
Expected environment variables for local development and Vercel:

- `CTA_API_KEY`
- `CTA_STATION_ID`
- `CTA_STATION_NAME`
- `CTA_SELECTED_ROUTES`
- `CTA_MAX_TRAINS`
- `CTA_REFRESH_INTERVAL_MS`

## Hosting Model
- Deploy the entire app as one Vercel project
- Store CTA secrets in Vercel project environment variables
- Use Vercel preview deployments for UI iteration
- Use the production deployment URL for the always-on house display

## Free Tier Fit
This stack should fit comfortably within Vercel Hobby for a personal always-on display:
- one lightweight frontend
- one lightweight API route
- no database
- no image processing
- no heavy compute

CTA request volume should also stay manageable for one display if refresh intervals are reasonable.

## Styling Direction
To keep setup minimal:
- start with plain CSS rather than a heavy design system
- define reusable CSS variables for CTA-inspired colors and spacing
- build a fixed vertical layout tuned for `9:16`
- prioritize large type and stable row heights for distance readability

## Libraries To Avoid Initially
Avoid adding these in V1 unless a real need appears:
- database clients
- state management libraries
- charting libraries
- animation libraries
- Tailwind, unless speed of styling clearly outweighs the extra setup
- data fetching wrappers like `SWR` or `React Query`

## Future Upgrades If Needed
- Service alerts endpoint
- Multiple station rotation
- Local admin config UI
- Scheduled dimming or quiet-hours mode
- Simple caching layer in the proxy route

## Recommended Next Implementation Step
Scaffold the Next.js app with:
- `TypeScript`
- `App Router`
- one `app/api/arrivals/route.ts` proxy
- one first-pass `page.tsx` for the vertical `9:16` layout
