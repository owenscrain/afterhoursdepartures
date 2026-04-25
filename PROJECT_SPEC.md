# Chicago CTA Train Tracker Project Spec

## Project Summary
Build a browser-based Chicago CTA train tracker optimized for a permanent vertical 9:16 home display, with a phone-like layout. The product should reuse the visual language of the CTA-style arrival board shown in the reference project while allowing custom configuration for station selection, routes, layout, and future expansion.

Reference project reviewed on April 24, 2026:
- Repo: https://github.com/mo-arvan/cta-transit-display
- Main file reviewed: `src/main.py`
- Key finding: the reference implementation is a Python desktop kiosk app built with PySide6, not a web app.

## Primary Goal
Create a web application that looks and feels like a CTA arrival display, runs reliably on a vertical 9:16 screen in a home environment, and uses the user's CTA API key to show live train arrivals for user-selected stations and lines.

## Product Goals
- Deliver a CTA-inspired arrival board aesthetic suitable for always-on display.
- Optimize the interface for a vertical 9:16, phone-like layout.
- Show real-time CTA train arrivals for one or more configured stations.
- Support a custom configuration layer instead of hardcoding one station and one line.
- Run in a browser-based kiosk mode on a local display device.
- Keep the API key out of client-side source code when possible.
- Be easy to adjust later for different stations, lines, refresh intervals, and layout modules.

## Non-Goals For V1
- Full CTA system coverage across all buses and trains.
- User accounts or multi-user personalization.
- Mobile-first responsive design for general consumer browsing.
- Complex historical analytics.
- Native desktop packaging unless kiosk deployment later proves necessary.

## Reference Design Analysis
The reference project provides useful design cues and domain behavior to borrow:
- Dark CTA-style background with high-contrast route cards.
- Prominent current time in the header.
- Arrival rows with line, train number, destination, and ETA.
- A split layout with arrivals on one side and status/info on the other.
- Large typography sized for across-room readability.
- Auto-refresh behavior for live data.
- Full-screen kiosk presentation.

What should not be copied directly:
- PySide6 desktop UI code.
- Hardcoded station config (`Diversey`, station id `40530`, Brown Line only).
- Direct client-side API key usage pattern.
- Fixed two-column desktop proportions without validating them for a 9:16 screen.
- Static route status mock data.

## Recommended Technical Direction
Use a web stack rather than porting the Python desktop app directly.

Recommended architecture:
- Frontend: React with Vite or Next.js.
- Styling: CSS modules, Tailwind, or vanilla CSS with design tokens.
- Data layer: a lightweight backend or server route that proxies CTA API requests.
- Deployment target: Raspberry Pi, mini PC, or wall-mounted tablet in browser kiosk mode.

Recommendation for V1:
- Use a web frontend.
- Add a small server-side proxy endpoint to protect the CTA API key.
- Store display configuration in environment variables or a local config file.

## Why This Direction
- A browser app is easier to iterate on visually.
- Portrait layout work is simpler in web CSS than in a desktop widget toolkit.
- Kiosk browser deployment is flexible across hardware.
- A backend proxy avoids exposing the CTA key to the browser.
- Future modules like weather, service alerts, or multiple station panels fit naturally into a web app.

## Core V1 Features
- Full-screen vertical layout for 1080x1920 or similar 9:16 displays.
- Configurable station id and station label.
- Configurable route filtering.
- Real-time arrivals list from CTA Train Tracker API.
- ETA formatting such as `Due`, `1 min`, `5 min`.
- Large clock in header.
- Auto-refresh on a fixed interval.
- Loading, empty, and error states that are readable at a distance.
- CTA-inspired route color treatment.
- Optional secondary panel for service status, static messages, or rotating metadata.

## V1 Configuration Requirements
The app should support configuration without code edits where possible.

Expected config fields:
- `CTA_API_KEY`
- `CTA_STATION_ID`
- `CTA_STATION_NAME`
- `CTA_SELECTED_ROUTES`
- `CTA_MAX_TRAINS`
- `CTA_REFRESH_INTERVAL_MS`
- `DISPLAY_TIMEZONE`
- `DISPLAY_24_HOUR_CLOCK` or `DISPLAY_12_HOUR_CLOCK`
- `DISPLAY_THEME` if multiple visual variants are added later

## UX Requirements For A House Display
- Text must remain legible from several feet away.
- Information density should stay low enough for glanceability.
- Layout should avoid tiny controls because the display is primarily passive.
- Screen should recover gracefully after network failures.
- Refreshes should not cause visible layout flicker.
- The screen should look intentional when there are no trains or the API is unavailable.

## Data Considerations
Primary data source:
- CTA Train Tracker API

Important implementation considerations:
- Confirm API response shape and rate limits before building the final data layer.
- Handle missing or delayed arrival predictions.
- Normalize route codes to human-readable line names and colors.
- Decide whether service status is part of V1 or deferred.
- If route status is shown, use a real source or clearly label it as static.

## Security Requirements
- Do not hardcode the CTA API key into committed frontend code.
- Prefer server-side usage of the CTA API key.
- Keep `.env` files out of version control.
- If deployed on a local device, document how secrets are configured on that device.

## Design Requirements
The design should feel clearly inspired by CTA signage without becoming a literal copy of the Python reference layout.

Visual direction:
- Dark, transit-display-inspired background.
- Strong typography sized for distance viewing.
- Route-color-based row accents.
- Clear content hierarchy: station, current time, arrivals, supporting information.
- Vertical, phone-like composition tuned to a 9:16 canvas.

Layout guidance for V1:
- Prioritize the arrivals list over secondary modules.
- Consider a stacked layout instead of a wide two-column split because vertical space is the defining constraint.
- Reserve consistent vertical rhythm so the board looks stable as arrivals update.

## Recommended Build Phases
### Phase 1: Discovery and setup
- Choose the app framework.
- Confirm target hardware and browser runtime.
- Verify CTA API connectivity using the provided key.
- Identify the exact station ids and route combinations to support first.
- Pull visual references from the existing project and real CTA displays.

### Phase 2: Skeleton app
- Create the frontend project.
- Add global layout, typography, and color tokens.
- Implement a fixed vertical `9:16` canvas with kiosk-friendly behavior.
- Add mock train data to validate spacing and readability.

### Phase 3: Live data integration
- Build the server-side CTA proxy.
- Fetch real train arrival data.
- Add refresh logic and error handling.
- Add route filtering and ETA formatting.

### Phase 4: Polish for wall display use
- Tune spacing and font sizes for the actual screen.
- Prevent screen flicker and unstable row movement.
- Add empty-state and offline-state presentation.
- Add browser kiosk deployment instructions.

### Phase 5: Optional expansions
- Multiple station rotation.
- Service alerts.
- Weather or local clock/date panel.
- Quiet-hours dimming or overnight mode.
- Admin or local config UI.

## Open Decisions
These should be decided before implementation gets far:
- Framework choice: Vite React vs Next.js.
- Deployment target: Raspberry Pi, mini PC, tablet, or smart display browser.
- Single-station display vs multi-station rotation.
- Whether to include service status in V1.
- Whether the design should be a close homage to official CTA boards or a looser inspired variant.

## Risks
- CTA API behavior may impose formatting or refresh constraints.
- A pure client-side app may expose the API key unless a proxy is added.
- Vertical phone-like layouts can become cramped if too many modules are included.
- Real-time data may be sparse or inconsistent depending on station and line.
- Kiosk hardware may vary in browser support and screen scaling behavior.

## Success Criteria
The project is successful for V1 if:
- The display runs full-screen in a vertical `9:16` layout.
- It shows live CTA train arrivals for the configured station.
- The CTA API key is not exposed in committed frontend code.
- The UI is readable from across the room.
- The app can recover from temporary API or network errors.
- Station and route configuration can be changed without major code edits.

## Immediate Next Steps
1. Choose the web stack.
2. Confirm the target hardware for the 9:16 display.
3. Verify the CTA API key and test a sample station request.
4. Pick the first station id, routes, and max rows for V1.
5. Scaffold the project and implement a static portrait mockup before wiring live data.

## Suggested Initial Deliverables
- Web app scaffold
- Environment variable template
- CTA proxy endpoint
- Static mock screen for 9:16 layout review
- First live arrivals integration
- Kiosk deployment notes
