# CTA Branding Notes

## Purpose
This document summarizes the CTA branding and trademark guidance that is relevant to this project: a custom house display that uses CTA Train Tracker data and borrows recognizable CTA visual cues without presenting itself as an official CTA product.

## Source Material
- Current CTA branding page: https://www.transitchicago.com/developers/branding/
- Official PDF saved locally: `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/CTA_Trademark_Developer_Guidelines_with_Branding_Guide_v1_0.pdf`
- Relevant exported pages:
  - `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/pages/branding-guide-5.png`
  - `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/pages/branding-guide-6.png`
  - `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/pages/branding-guide-7.png`
  - SVG exports of those same pages are in `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/pages/`

## What CTA Explicitly Allows
CTA’s branding guide says developers using CTA data may do the following:
- Describe the app as using CTA data.
- Mention which CTA API the product uses.
- Use phrases like `Data provided by CTA` or `Powered by CTA data`.
- Use the standard bus and train icons used on CTA signs.
- Use the CTA Bus Tracker and CTA Train Tracker logo icons when presenting data from those respective APIs, subject to CTA’s limits.
- Use official CTA `L` route colors.
- Incorporate CTA style cues from the attached branding guide.

## What CTA Explicitly Restricts
CTA’s guide also says not to do the following:
- Do not start the product name with `CTA`.
- Do not make the app sound official, authorized, partnered, or endorsed.
- Do not use the CTA agency logos or approximations of them.
- Do not use `Bus Tracker` or `Train Tracker` as the project name.
- Do not make CTA marks the dominant visual identity of the product.
- Do not combine CTA marks with your own mark.
- Do not include official CTA maps or documents inside the product.

## Naming Guidance For This Project
For this project, the safest naming strategy is:
- do not use `CTA` as the first word in the product name
- do not name the app `CTA Train Tracker`
- do not use `official` or `authorized`

Safer patterns:
- `Transit Board`
- `L Board`
- `Hallway Display - CTA version`
- `Train Board (for CTA riders)`

Recommended footer or about copy:
- `Data provided by CTA. This app is not made or endorsed by the Chicago Transit Authority.`

## Most Relevant Visual Guidance
The CTA branding materials give us four useful categories of design guidance:
- official route colors
- official icon treatments
- contrast and readability rules
- usage boundaries between general transit visuals and CTA trademarked tracker marks

## Official CTA Route Colors
These are the official screen hex values shown in CTA’s branding guide and should be the baseline for our design tokens.

| Token | Hex |
|---|---|
| `cta-red` | `#c60c30` |
| `cta-blue` | `#00a1de` |
| `cta-brown` | `#62361b` |
| `cta-green` | `#009b3a` |
| `cta-orange` | `#f9461c` |
| `cta-purple` | `#522398` |
| `cta-pink` | `#e27ea6` |
| `cta-yellow` | `#f9e300` |
| `cta-sign-grey` | `#565a5c` |

Suggested CSS token block:

```css
:root {
  --cta-red: #c60c30;
  --cta-blue: #00a1de;
  --cta-brown: #62361b;
  --cta-green: #009b3a;
  --cta-orange: #f9461c;
  --cta-purple: #522398;
  --cta-pink: #e27ea6;
  --cta-yellow: #f9e300;
  --cta-sign-grey: #565a5c;
}
```

## Icon Guidance
### CTA standard `L` train icon
This is the most flexible icon for this project.

CTA says this icon:
- is used to represent general `L` train service
- may be used with `L` service information such as trip planners, mapping, and general service information
- may appear black on light backgrounds
- may appear white on dark backgrounds
- may be modified to match official route colors

Practical recommendation:
- use this as the primary transit icon in the product header, empty states, and section labels

### CTA Train Tracker icon
This icon is more restricted.

CTA says this icon:
- is used exclusively with CTA Train Tracker data
- should not appear alongside scheduled arrivals or unrelated static information
- should not be modified away from its black, white, or gray solid-fill versions
- should carry a trademark note near the icon or at the bottom of the page/screen

Practical recommendation:
- do not make this the app logo
- only use it if we want a small “live tracker data” mark tied directly to real-time arrival content
- if used, add a visible trademark note in the footer or legal/about area

### CTA Bus Tracker icon
This follows similar restrictions to the CTA Train Tracker icon and is not directly relevant to the train-only V1.

### US DOT bus icon
CTA recommends keeping it black or white and not colorizing it when used in relation to CTA service.

## Readability Rules From CTA
The branding guide’s strongest design instruction is not aesthetic, it is readability:
- icons may be used open on transparent background
- icons may also be used in filled rounded boxes
- the icon should be horizontally centered within its box
- avoid transparent icons on busy or low-contrast backgrounds
- if the background is visually noisy, use a solid bounding box instead

Design implication for our UI:
- if the page background is dark and textured, use white icons inside a stable dark or gray container
- do not place thin or outline-based CTA icons directly over moving imagery, gradients, or route-color blocks without sufficient contrast

## What To Use In This Project
Recommended:
- official route colors
- CTA standard `L` train icon
- CTA-inspired information hierarchy
- CTA-style sign gray as a neutral
- explicit attribution for CTA data

Use carefully:
- CTA Train Tracker icon
- CTA Bus Tracker icon

Avoid:
- CTA circle logo
- old CTA wordmarks
- naming the app as if it is official CTA software

## Practical Design Direction
For this project, the cleanest approach is:
- use the CTA standard `L` train icon as the header icon
- use the official line colors for route badges and accents
- use sign gray and deep neutrals for the board background
- keep the product name custom and non-official
- add a footer note that the app uses CTA data and is not endorsed by CTA

This gives us a CTA-recognizable interface without crossing into “official CTA product” territory.

## Recommended Product-Level Rules
Use these as project constraints:
- The product should be described as `CTA-inspired`, not official.
- The top-level app brand should not start with `CTA`.
- CTA route colors should use the official hex values above.
- The default icon should be the standard `L` train icon, not the CTA agency logo.
- The CTA Train Tracker logo should only appear when directly labeling real-time tracker data, if we use it at all.
- The footer should include CTA data attribution and a non-endorsement disclaimer.

## Local Asset Inventory
Saved locally:
- official branding PDF
- raster exports of the route-color page and icon-usage pages
- SVG page exports for vector inspection and future tracing/extraction work

Not yet saved locally:
- CTA’s separate downloadable SVG icon archive from the branding page

Why it is missing:
- CTA’s site allowed direct PDF fetches from this environment, but blocked scripted access to the icon archive behind Cloudflare during this session on April 25, 2026.

Practical fallback:
- use the local page exports as the design reference for now
- if needed, manually download the official icon archive in a browser and place it into `/Users/matthewmiller/Desktop/fun/train_app/references/cta-branding/icons/`

## Immediate Implementation Advice
When we build the design system:
- lock in the official route colors first
- create a neutral grayscale palette around `cta-sign-grey`
- build components around the standard `L` train icon
- leave the CTA Train Tracker logo out of the initial UI unless we have a strong reason to include it
