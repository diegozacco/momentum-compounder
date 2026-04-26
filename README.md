# Momentum Compounder

Premium fintech dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **API:** Finnhub (live scanner data)
- **Deploy:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and add your Finnhub key
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `FINNHUB_API_KEY`
4. Deploy

## Project Structure

```
app/
├── layout.tsx          Root layout (fonts, metadata)
├── page.tsx            Main app (login + all 6 pages)
├── globals.css         Tailwind + custom styles
└── api/
    └── scanner/
        └── route.ts    GET /api/scanner (Finnhub live data)
lib/
├── finnhub.ts          Finnhub API client (retry, rate limit)
└── scanner-engine.ts   Momentum scoring algorithm
types/
└── scanner.ts          Shared TypeScript interfaces
```

## Pages

1. **Login** — Email/password with OAuth buttons
2. **Dashboard** — Portfolio KPIs, equity curve, positions table
3. **Scanner** — Momentum breakout candidates (mock + live API)
4. **Trade Detail** — Position deep-dive with charts and risk levels
5. **Rotation** — Sector heatmap and economic cycle position
6. **Journal** — Trade log with grades, tags, and notes

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FINNHUB_API_KEY` | For scanner | Free at [finnhub.io](https://finnhub.io/register) |

## License

Private
