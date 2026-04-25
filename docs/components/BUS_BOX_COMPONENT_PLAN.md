# Bus Box Component Plan

## Goal
Replace the current bus panel with two large CTA-style bus boxes that sit below the train stack and above the footer.

The section should:
- use one box for eastbound and one box for westbound
- show only the direction marker in the top-left: `E` or `W`
- make the next arrival time the dominant content in each box
- use the CTA bus color as the box background
- stay visually simpler than the train rows

## Scope
This plan only covers the frontend bus display rebuild.

The backend bus fetch layer can stay in place:
- `/api/buses`
- `lib/bus/*`

That lets the new UI reuse the same live predictions without redesigning the data layer.

## Visual Direction
Each bus box should behave like a simple transit tile, not a card dashboard.

### Box styling
- background: dedicated CTA bus color token
- text: white
- corners: square
- no shadow
- no border chrome
- generous internal padding

### Content hierarchy
1. Direction marker in the top-left
- `E` for eastbound
- `W` for westbound
- small, bold, anchored to the corner

2. Arrival time as the main element
- centered vertically within the box content area
- very large
- examples:
  - `Due`
  - `5 min`
  - `12 min`

3. Optional support copy
- keep out of the first implementation unless needed
- if used later, it should be small and secondary
- likely candidates:
  - stop name
  - destination
  - `No predictions`

## Recommended Components
### `BusBoxGrid`
Responsibility:
- layout wrapper for the two bus boxes
- horizontal two-column layout
- fills the space between train stack and footer

Props:
- `boxes: BusBoxItem[]`
- `className?: string`

### `BusDirectionBox`
Responsibility:
- render a single direction box
- own the box visual treatment
- display only direction and next ETA in V1

Props:
- `directionLabel: "E" | "W"`
- `etaValue: string`
- `etaUnit?: string | null`
- `backgroundColor?: string`
- `textColor?: string`
- `muted?: boolean`
- `status?: "live" | "empty" | "stale"`

### `BusBoxItem` shape
```ts
export type BusBoxItem = {
  id: string;
  directionLabel: "E" | "W";
  etaValue: string;
  etaUnit?: string | null;
  backgroundColor: string;
  textColor?: string;
  muted?: boolean;
  hasPrediction: boolean;
};
```

## Layout Rules
### Container
- two equal-width columns
- same horizontal padding as the rest of the display shell
- modest gap between boxes
- section should flex to occupy the space below trains

### Box
- width: full column width
- height: stretch to available space
- content aligned with a simple two-zone structure:
  - top-left corner: direction marker
  - centered/lower central field: ETA

### ETA formatting
- `Due` should render without a unit
- numbered ETAs should render as:
  - large number
  - smaller `min`
- use tabular numerals

## Color Plan
Add a dedicated bus token instead of borrowing a train-line token implicitly.

Recommended token:
```css
--color-cta-bus: var(--color-cta-blue);
```

Then use:
```css
--color-bus-box-bg: var(--color-cta-bus);
--color-bus-box-fg: var(--color-text-primary);
```

Reason:
- clearer semantics than using `--color-line-blue`
- easier to adjust later if CTA bus branding needs a separate blue value

## Data Mapping
The existing bus API response already provides enough for the new UI.

Map current bus predictions into the new box shape like this:
- east stop -> `directionLabel: "E"`
- west stop -> `directionLabel: "W"`
- prediction ETA -> `etaValue` + `etaUnit`
- no prediction -> `etaValue: "--"`, `etaUnit: null`, `hasPrediction: false`

Stop mapping for current config:
- East: `Addison & Paulina` (`12535`)
- West: `Addison Brown Line Station` (`12563`)

## Empty And Error States
### No prediction for a direction
- keep the box visible
- show `--`
- optionally dim the ETA slightly

### Bus API refresh failure after a successful load
- keep last good bus values on screen
- do not blank the boxes

### First load failure
- still render both boxes with placeholders
- avoid collapsing the section

## Implementation Order
1. Add bus-specific color tokens
2. Create `components/board/bus-direction-box.tsx`
3. Create `components/board/bus-box-grid.tsx`
4. Rewire `live-arrivals-panel.tsx` to transform `/api/buses` data into `BusBoxItem[]`
5. Add section styles in `app/globals.css`
6. Tune box height and type on the physical display

## Explicit Non-Goals For V1
- no route number inside the box
- no long destination label inside the box
- no iconography
- no extra card header strip
- no mixed bus routes

## Expected Outcome
The rebuilt bus section should read immediately from across the room:
- `E` box on the left
- `W` box on the right
- one large next-bus ETA in each
- strong CTA bus color background

That keeps the bus area visually distinct from the train stack while still feeling part of the same display system.
