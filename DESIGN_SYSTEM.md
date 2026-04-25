# Design System

## Purpose
This file defines the first layer of the project design system: official CTA color tokens pulled from CTA's branding guidance and prepared for use in the app.

## Source
- CTA branding page: https://www.transitchicago.com/developers/branding/
- Local notes: `/Users/matthewmiller/Desktop/fun/train_app/docs/research/CTA_BRANDING_NOTES.md`

## Token Naming
Use raw brand tokens first. Semantic aliases can be added later after layout and component decisions are made.

Format:
- CSS custom properties: `--color-cta-*`
- TypeScript keys: `cta*`

## Official CTA Color Tokens
These are the official CTA `L` route colors and sign gray from CTA's branding guide.

| Token | Hex | Intended meaning |
|---|---|---|
| `--color-cta-red` | `#C60C30` | Red Line |
| `--color-cta-blue` | `#00A1DE` | Blue Line |
| `--color-cta-brown` | `#62361B` | Brown Line |
| `--color-cta-green` | `#009B3A` | Green Line |
| `--color-cta-orange` | `#F9461C` | Orange Line |
| `--color-cta-purple` | `#522398` | Purple Line |
| `--color-cta-pink` | `#E27EA6` | Pink Line |
| `--color-cta-yellow` | `#F9E300` | Yellow Line |
| `--color-cta-sign-grey` | `#565A5C` | CTA sign gray |

## CSS Token Block
```css
:root {
  --color-cta-red: #c60c30;
  --color-cta-blue: #00a1de;
  --color-cta-brown: #62361b;
  --color-cta-green: #009b3a;
  --color-cta-orange: #f9461c;
  --color-cta-purple: #522398;
  --color-cta-pink: #e27ea6;
  --color-cta-yellow: #f9e300;
  --color-cta-sign-grey: #565a5c;
}
```

## TypeScript Token Object
```ts
export const ctaColors = {
  red: "#C60C30",
  blue: "#00A1DE",
  brown: "#62361B",
  green: "#009B3A",
  orange: "#F9461C",
  purple: "#522398",
  pink: "#E27EA6",
  yellow: "#F9E300",
  signGrey: "#565A5C",
} as const;
```

## Recommended Semantic Aliases
These are not additional CTA colors. They are app-level aliases that map directly to the raw CTA tokens.

```css
:root {
  --color-line-red: var(--color-cta-red);
  --color-line-blue: var(--color-cta-blue);
  --color-line-brown: var(--color-cta-brown);
  --color-line-green: var(--color-cta-green);
  --color-line-orange: var(--color-cta-orange);
  --color-line-purple: var(--color-cta-purple);
  --color-line-pink: var(--color-cta-pink);
  --color-line-yellow: var(--color-cta-yellow);
  --color-ui-sign-grey: var(--color-cta-sign-grey);
}
```

## Current Guidance
- Treat these as locked brand-reference tokens.
- Do not adjust these hex values unless CTA changes their published branding guidance.
- Build future neutral palettes around `--color-cta-sign-grey`, not by changing CTA route colors.
- Keep route colors as accents, badges, separators, and status identifiers, not as full-page backgrounds.

## Important Distinction
The yellow signal arcs in the CTA tracker icons are not the same thing as the official Yellow Line token.

- Official Yellow Line token: `#F9E300`
- Tracker icon signal yellow seen in the downloaded SVG assets: `#FFD400`

For now:
- use `#F9E300` as the official CTA route token
- treat `#FFD400` as an icon-specific asset color only if we decide to keep the tracker-style signal marks

## Design Basis For Inferred Tokens
The remaining variables below are not official CTA brand tokens. They are design decisions inferred from the references we reviewed:

- CTA branding guidance emphasizes high contrast, solid-fill boxes, and readability over decoration.
- CTA sign gray is the only official neutral color CTA publishes in the branding guide.
- The reference kiosk app uses a very dark canvas with gray structural surfaces and no decorative effects.
- The reference kiosk app uses `Arial` throughout, which is a strong signal to stay with a plain, signage-like sans serif instead of a fashionable display font.
- The reference kiosk app's spacing values cluster around `8`, `12`, `16`, `20`, `24`, `40`, and large type sizes such as `24`, `38`, and `44`.

For that reason, the variables below should be treated as `project design tokens`, not `official CTA brand values`.

## Neutrals And Background Palette
### Rationale
CTA's branding guide gives us `sign grey` as the core neutral and repeatedly emphasizes contrast and solid, readable surfaces. The reference kiosk app also uses a dark board with slightly lighter gray panels:

- canvas: `#1E1E1E`
- header surface: `#4F4F4F`
- secondary panel: `#3F3F3F`

The best translation for this project is:
- keep the page on a dark charcoal canvas
- anchor supporting surfaces around CTA sign gray
- reserve bright route colors for accents and rows, not whole-page fills

### Neutral Tokens
These values are intentionally conservative so the route colors stay prominent.

| Token | Hex | Usage |
|---|---|---|
| `--color-neutral-950` | `#17191A` | deepest page edge, overscan fallback |
| `--color-neutral-900` | `#1E1E1E` | primary board canvas |
| `--color-neutral-850` | `#25282A` | recessed section background |
| `--color-neutral-800` | `#313436` | grouped panel background |
| `--color-neutral-700` | `#3F4345` | secondary card or inset panel |
| `--color-neutral-600` | `#4C5052` | stronger header strip |
| `--color-neutral-500` | `#565A5C` | official CTA sign gray |
| `--color-neutral-300` | `#A9AEAF` | muted border or disabled text |
| `--color-neutral-200` | `#C8CBCC` | soft divider on dark backgrounds |
| `--color-neutral-100` | `#E7E9EA` | subdued light text |
| `--color-neutral-0` | `#FFFFFF` | primary light text |

### Neutral CSS Block
```css
:root {
  --color-neutral-950: #17191a;
  --color-neutral-900: #1e1e1e;
  --color-neutral-850: #25282a;
  --color-neutral-800: #313436;
  --color-neutral-700: #3f4345;
  --color-neutral-600: #4c5052;
  --color-neutral-500: #565a5c;
  --color-neutral-300: #a9aeaf;
  --color-neutral-200: #c8cbcc;
  --color-neutral-100: #e7e9ea;
  --color-neutral-0: #ffffff;
}
```

### Recommended Semantic Mapping
```css
:root {
  --color-bg-app: var(--color-neutral-900);
  --color-bg-board: var(--color-neutral-900);
  --color-bg-panel: var(--color-neutral-800);
  --color-bg-panel-strong: var(--color-neutral-700);
  --color-bg-header: var(--color-neutral-600);
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-primary: var(--color-neutral-0);
  --color-text-secondary: var(--color-neutral-100);
  --color-text-muted: var(--color-neutral-300);
}
```

### Usage Rules
- Use `--color-bg-board` for the outer application surface.
- Use `--color-bg-header` only for clear structural strips such as station or section headers.
- Use `--color-bg-panel` and `--color-bg-panel-strong` for inset modules, not for arrival rows that are color-coded by route.
- Avoid gradients as the dominant background treatment in V1.
- Avoid pure black; CTA sign systems and the reference kiosk both feel softer and more realistic with charcoal instead.

## Typography Family And Scale
### Rationale
We do not have a public official CTA type token set in the branding material we reviewed. The best evidence available is:

- CTA's branding guide and developer materials use a plain sans-serif voice.
- The reference kiosk app uses `Arial` for every text element.
- The interface must be readable from across a room on a fixed `9:16` display.

That makes the right move here a pragmatic one:
- use a system-safe sans serif
- keep weights limited
- make size, contrast, and spacing do the work

### Font Family Recommendation
```css
:root {
  --font-family-ui: Arial, "Helvetica Neue", Helvetica, sans-serif;
  --font-family-display: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
```

Why this stack:
- it matches the reference kiosk's `Arial` choice
- it keeps setup minimal
- it stays closer to transit-sign utility than a stylized web font would

### Font Weight Tokens
```css
:root {
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Type Scale
This scale is tuned for a fixed wall display, not a general consumer website.

| Token | Size | Typical use |
|---|---|---|
| `--font-size-12` | `0.75rem` | legal note, attribution |
| `--font-size-14` | `0.875rem` | small metadata |
| `--font-size-16` | `1rem` | supportive body text |
| `--font-size-18` | `1.125rem` | status text |
| `--font-size-20` | `1.25rem` | small section labels |
| `--font-size-24` | `1.5rem` | section headers, route labels |
| `--font-size-32` | `2rem` | compact hero text |
| `--font-size-40` | `2.5rem` | clock and major header text |
| `--font-size-48` | `3rem` | arrival destination emphasis |
| `--font-size-64` | `4rem` | oversized focal values if needed |

### Type CSS Block
```css
:root {
  --font-size-12: 0.75rem;
  --font-size-14: 0.875rem;
  --font-size-16: 1rem;
  --font-size-18: 1.125rem;
  --font-size-20: 1.25rem;
  --font-size-24: 1.5rem;
  --font-size-32: 2rem;
  --font-size-40: 2.5rem;
  --font-size-48: 3rem;
  --font-size-64: 4rem;
}
```

### Semantic Type Roles
```css
:root {
  --font-station-label: var(--font-size-24);
  --font-section-title: var(--font-size-24);
  --font-header-title: var(--font-size-40);
  --font-clock: var(--font-size-40);
  --font-arrival-meta: var(--font-size-20);
  --font-arrival-destination: var(--font-size-48);
  --font-arrival-eta: var(--font-size-48);
  --font-status-text: var(--font-size-18);
  --font-legal: var(--font-size-12);
}
```

### Typography Rules
- Use bold only for hierarchy, not everywhere.
- Keep most labels at `20` or `24`; jump to `40` or `48` only for primary board information.
- Avoid condensed novelty fonts in V1.
- Prefer uppercase sparingly. Route chips and micro labels can use it; destinations should remain normal case for legibility.

## Spacing Scale
### Rationale
The reference kiosk app uses spacing values centered on an `8px` rhythm with common steps such as:

- `8`
- `12`
- `16`
- `20`
- `24`
- `40`

That is a good fit for a fixed display interface because it gives enough density control without overcomplicating the system.

### Spacing Tokens
| Token | Value | Typical use |
|---|---|---|
| `--space-4` | `0.25rem` | tight icon/text correction |
| `--space-8` | `0.5rem` | row gap |
| `--space-12` | `0.75rem` | compact inner padding |
| `--space-16` | `1rem` | small panel padding |
| `--space-20` | `1.25rem` | header inset |
| `--space-24` | `1.5rem` | standard content inset |
| `--space-32` | `2rem` | module separation |
| `--space-40` | `2.5rem` | board edge padding |
| `--space-48` | `3rem` | large section separation |
| `--space-64` | `4rem` | oversized spacing reserve |

### Spacing CSS Block
```css
:root {
  --space-4: 0.25rem;
  --space-8: 0.5rem;
  --space-12: 0.75rem;
  --space-16: 1rem;
  --space-20: 1.25rem;
  --space-24: 1.5rem;
  --space-32: 2rem;
  --space-40: 2.5rem;
  --space-48: 3rem;
  --space-64: 4rem;
}
```

### Layout Recommendations
```css
:root {
  --layout-board-padding-x: var(--space-40);
  --layout-board-padding-y: var(--space-24);
  --layout-section-gap: var(--space-24);
  --layout-panel-padding: var(--space-16);
  --layout-row-gap: var(--space-8);
  --layout-arrival-row-padding-x: var(--space-24);
  --layout-arrival-row-padding-y: var(--space-12);
}
```

### Spacing Rules
- Use `40` as the outer board gutter on a `1080x1920` canvas.
- Use `24` as the default left-right inset for major content blocks.
- Use `8` between repeated rows.
- Do not use arbitrary one-off values before the first layout pass proves the scale insufficient.

## Border Radius And Card Treatment
### Rationale
CTA's readability guidance allows solid-fill icons inside rounded boxes, but the overall system feel is still operational and rigid, not soft or bubbly. The reference kiosk app reinforces that:

- arrival rows are `border-radius: 0px`
- utility labels and secondary panels use very small rounding
- visual separation comes from color blocks, not depth effects

That suggests a restrained surface language:
- mostly square panels
- minimal rounding
- almost no shadow

### Radius Tokens
| Token | Value | Use |
|---|---|---|
| `--radius-none` | `0px` | arrival rows, edge-to-edge strips |
| `--radius-sm` | `4px` | icon containers, route labels, small panels |
| `--radius-md` | `8px` | optional larger cards if needed |
| `--radius-pill` | `999px` | pill controls only if introduced later |

### Radius CSS Block
```css
:root {
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 999px;
}
```

### Card Treatment Rules
```css
:root {
  --shadow-none: none;
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.18);
}
```

Use these rules:
- Arrival rows should default to `--radius-none`.
- Major board sections should be flat and rectangular.
- Small icon boxes and utility labels may use `--radius-sm`.
- Avoid large rounded corners.
- Avoid heavy shadows, glows, glass blur, and translucent panels.
- Prefer separators, contrast, and spacing over elevation.

### Recommended Component Treatment
| Component | Surface rule |
|---|---|
| app canvas | flat dark background |
| station or section header strip | solid neutral bar, `--radius-none` |
| arrival row | route-colored block, `--radius-none` |
| inset info panel | neutral surface, `--radius-sm` |
| icon box | solid fill, `--radius-sm` |
| status badge | route or neutral fill, `--radius-sm` |

## Icon Sizing Rules
### Rationale
The extracted transit icons are not perfectly square:

- train icon viewBox: `60 x 70`
- bus icon viewBox: `62 x 68`

Because of that, icon sizing should be controlled by `height`, not width. If width is treated as the primary dimension, the train and bus icons will feel misaligned even when they technically occupy the same box.

### Core Rule
- Size transit icons by height.
- Place them inside a fixed icon slot when they appear next to text.
- Let width vary naturally within that slot.

### Icon Size Tokens
```css
:root {
  --icon-size-xs: 16px;
  --icon-size-sm: 24px;
  --icon-size-md: 32px;
  --icon-size-lg: 40px;
  --icon-size-xl: 48px;
  --icon-size-hero: 64px;
}
```

### Semantic Icon Tokens
```css
:root {
  --icon-size-inline: var(--icon-size-sm);
  --icon-size-section: var(--icon-size-md);
  --icon-size-header: var(--icon-size-lg);
  --icon-size-empty: var(--icon-size-xl);
  --icon-size-state: var(--icon-size-hero);
}
```

### Icon Gap Tokens
```css
:root {
  --icon-gap-sm: var(--space-8);
  --icon-gap-md: var(--space-12);
  --icon-gap-lg: var(--space-16);
}
```

### Usage Rules
- Use `--icon-size-header` for the main board or station-level header icon.
- Use `--icon-size-section` for section titles such as arrivals or route status.
- Use `--icon-size-inline` for small support contexts.
- Use `--icon-size-empty` and `--icon-size-state` only for special empty or offline states.
- Keep icon slots square even when the icon itself is not square.
- Align the icon slot, not the raw SVG outline, with the text baseline or centerline.
- Do not create many one-off icon sizes.

### Tracker Indicator Rule
If the UI includes a small realtime indicator mark like the one shown in the reference screenshot, treat it as a separate `status glyph`, not as a primary transit icon.

```css
:root {
  --icon-size-status-glyph: 24px;
}
```

Rules:
- The status glyph should be smaller than the ETA text.
- It should read as a support indicator, not as the focal point.
- It should never compete visually with the destination or ETA.

## Train Information Display Card
### Rationale
The target design does not behave like a stack of modern rounded cards. It behaves like a transit board:

- one station header at the top
- one combined arrival list beneath it
- full-width route-colored arrival rows
- thin white dividers between rows
- strong left/right alignment
- destination and ETA as the primary information
- a persistent utility footer at the bottom

For implementation, this should be treated as a `stacked board row system`, not as independent floating cards.

### MVP Product Decisions
These are locked product decisions for the first build:

- single station in V1
- component design should remain extensible to multi-station and bus support later
- one combined arrival list, not split by direction
- strict sorting by arrival time
- show `4` to `5` total arrivals
- top header shows station name only
- remove the `Service toward ...` strip in mixed-direction mode
- keep the run number in each row
- keep the row visually close to the CTA-style reference cards
- use a small `Scheduled` badge for non-live-tracked trains in V1
- persistent footer is always visible
- footer layout is split: weather on one side, time on the other
- weather block should support current temperature, high/low, and a condition icon
- MVP configuration can remain code-driven
- optimization priority is:
  1. closest visual match
  2. easiest configuration
  3. most reliable always-on display

### Overall Composition
The train information module should have three layers:

1. Station header
- station name only
- full-width neutral background
- white text
- single-line, bold, left-aligned

2. Repeating arrival rows
- full-width route-colored rows
- one row per arriving train
- combined direction list
- consistent row height
- thin divider between rows

3. Utility footer
- persistent split footer
- weather on one side
- current time on the other

### Station Header
Recommended characteristics:
- background: `--color-bg-header`
- text color: `--color-text-primary`
- radius: `--radius-none`
- padding-x: `--space-24`
- padding-y: `--space-20`

Recommended type:
- font: `--font-section-title`
- weight: `--font-weight-bold`

### Arrival Row Structure
Each arrival row should use a two-column layout:

```txt
| left content                                     | right ETA cluster |
| route + run number + "to"                        | ETA + status glyph |
| destination / direction endpoint (Loop/Kimball)  | badge if needed   |
```

Implementation guidance:
- display: grid or flex
- left column: `1fr`
- right column: `auto`
- vertical alignment: centered
- no rounded corners
- fixed row height to prevent visual jitter

### Arrival Row Tokens
```css
:root {
  --arrival-row-min-height: 132px;
  --arrival-row-padding-x: var(--space-24);
  --arrival-row-padding-y: var(--space-16);
  --arrival-row-divider: 2px;
  --arrival-row-eta-min-width: 240px;
}
```

### Arrival Row Surface Rules
- background should be the official route color token for that line
- text should be white except for yellow-line special cases if needed
- border radius should be `--radius-none`
- divider should be a thin high-contrast line between rows
- use divider lines instead of gaps between rows if matching the screenshot closely

### Left Column Content
The left side has two lines:

1. Meta line
- Example: `Brown Line #405 to`
- Smaller than the destination
- Should establish route, train number, and the CTA-style `to` phrasing

2. Destination line
- Example: `Kimball` or `Loop`
- Largest text in the row
- Primary focal point on the left side

Recommended type mapping:
```css
:root {
  --font-arrival-meta: var(--font-size-20);
  --font-arrival-destination: var(--font-size-48);
}
```

Left-column rules:
- Keep the meta line on one line when possible.
- Give destination the strongest emphasis.
- Prefer title case and plain language for destination names.
- Keep vertical spacing between the two lines tight.
- Direction should be communicated by the destination endpoint shown on the large line.
- Because the list is mixed-direction, the destination line is required, not optional.

### Right Column ETA Cluster
The right side is a single horizontal cluster:

- ETA text
- optional realtime/status glyph to its right
- optional small status badge below or adjacent when the train is not live-tracked

Examples:
- `Due`
- `23 min`
- `32 min`

Recommended structure:
```txt
[ ETA text ] [ status glyph ]
```

Recommended type rules:
- ETA number or `Due` should be the dominant element on the right
- `min` should be slightly lighter in emphasis than the number
- use tabular numerals so the numbers align visually down the column
- any non-live-tracking badge should be visually subordinate to ETA

Recommended ETA tokens:
```css
:root {
  --font-arrival-eta-number: var(--font-size-48);
  --font-arrival-eta-unit: var(--font-size-40);
}
```

ETA layout rules:
- Right-align the full ETA cluster.
- Reserve a minimum width for the cluster so row alignment stays stable.
- When displaying `Due`, center it within the same reserved cluster width used for minute values.
- Use `font-variant-numeric: tabular-nums;` for ETA values.
- If a train is not confirmed live-tracked, show a small `Scheduled` badge without changing the ETA alignment model.

### Alignment Rules
- Align all left-column content to the same left inset.
- Align all ETA clusters to the same right inset.
- Destination baseline should visually anchor the row.
- ETA cluster should be vertically centered against the full row, not only against the meta line.
- Keep the row visually balanced even when the ETA changes from `Due` to a two-digit number.

### Recommended Spacing Within A Row
```css
:root {
  --arrival-meta-gap: 6px;
  --arrival-cluster-gap: var(--space-12);
  --arrival-right-padding: var(--space-24);
  --arrival-badge-gap: var(--space-8);
}
```

Rules:
- Use a small gap between meta and destination.
- Use a moderate gap between ETA text and the status glyph.
- Avoid excessive internal whitespace because the layout should feel like a board, not a marketing card.

### Divider Strategy
To match the screenshot closely:
- use thin white horizontal dividers between rows
- do not separate rows with large vertical gaps
- keep dividers consistent in thickness across the module

Recommended divider token:
```css
:root {
  --arrival-divider-color: rgba(255, 255, 255, 0.9);
}
```

### Behavioral Rules
- Row height should remain stable during refresh.
- ETA changes should not cause row width shifts.
- Long destination names should scale or wrap in a controlled way rather than overflow.
- If route number or train number is missing, preserve the same meta-line position with a simplified string.
- If there is no realtime indicator glyph, the ETA cluster should still align correctly.
- Mixed directions should sort together by arrival time, not be grouped into separate sections.

## Utility Footer
### Rationale
The footer is a persistent utility band, not a secondary information card. It should feel like part of the board frame.

### Structure
The footer should be split into two aligned zones:

```txt
| weather cluster | current time |
```

Recommended characteristics:
- always visible
- full-width neutral surface
- compact but clearly legible
- visually quieter than the arrival rows

### Footer Tokens
```css
:root {
  --footer-min-height: 72px;
  --footer-padding-x: var(--space-24);
  --footer-padding-y: var(--space-16);
  --footer-gap: var(--space-16);
}
```

### Weather Cluster
The weather side should support:
- condition icon
- current temperature
- daily high / low

Recommended order:
```txt
[ icon ] [ current temp ] [ H / L ]
```

Rules:
- keep the icon small relative to the arrival rows
- prioritize current temperature first
- high / low should read as support data

### Time Cluster
The time side should:
- remain right-aligned
- use 12-hour time in MVP
- be visually clear but not compete with the arrival ETAs

Recommended type:
- use `--font-size-24` or `--font-size-32` depending on final layout balance
- use tabular numerals if the clock style benefits from it

### Implementation Recommendation
For V1, implement the train display as:
- one station header strip
- a stack of fixed-height arrival rows
- a two-column row layout
- one mixed-direction list
- official route-color backgrounds
- white text and thin white dividers
- a persistent split footer with weather and time

This will get closest to the screenshot and to CTA board behavior without overcomplicating the system.

## Next Variables To Define
After these tokens, the next variables to investigate are:
- motion rules
- route badge construction
- divider and border strategy
- state colors for loading, warning, and offline errors
