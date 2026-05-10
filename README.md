# Brown Line After-Hours Departure Display

A standalone Next.js app for a Brown Line departure display at Addison, using the CTA Train Tracker API.

## Setup

1. Install dependencies:

```sh
npm install
```

2. Add your CTA Train Tracker API key:

```sh
cp .env.example .env
```

Then set `CTA_API_KEY` in `.env`.

3. Run locally:

```sh
npm run dev
```

The display is available at `/` and `/brown-line`.
