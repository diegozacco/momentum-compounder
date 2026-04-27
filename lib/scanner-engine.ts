// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// lib/scanner-engine.ts — Momentum Scoring & Analysis
// Converts raw Finnhub data into ranked scanner results
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  UniverseEntry,
  ScannerStock,
  FinnhubQuote,
  FinnhubTechnicalIndicator,
  SectorName,
} from "../types/scanner";

// ── Scan Universe ────────────────────────────────────────
// 120 liquid, high-beta names across 11 GICS sectors.
// Curated for momentum trading: high liquidity, institutional
// participation, and enough volatility for tradeable moves.
// Scans wide, returns top 30 ranked by composite score.

export const SCAN_UNIVERSE: UniverseEntry[] = [
  // ── Technology (22) ────────────────────────────────────
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Technology" },
  { symbol: "AVGO", name: "Broadcom Inc", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology" },
  { symbol: "AAPL", name: "Apple Inc", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp", sector: "Technology" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology" },
  { symbol: "SMCI", name: "Super Micro Computer", sector: "Technology" },
  { symbol: "CRDO", name: "Credo Technology", sector: "Technology" },
  { symbol: "ANET", name: "Arista Networks", sector: "Technology" },
  { symbol: "PLTR", name: "Palantir Technologies", sector: "Technology" },
  { symbol: "APP", name: "AppLovin Corp", sector: "Technology" },
  { symbol: "PANW", name: "Palo Alto Networks", sector: "Technology" },
  { symbol: "ORCL", name: "Oracle Corp", sector: "Technology" },
  { symbol: "CRM", name: "Salesforce Inc", sector: "Technology" },
  { symbol: "NOW", name: "ServiceNow Inc", sector: "Technology" },
  { symbol: "MRVL", name: "Marvell Technology", sector: "Technology" },
  { symbol: "MU", name: "Micron Technology", sector: "Technology" },
  { symbol: "CRWD", name: "CrowdStrike Holdings", sector: "Technology" },
  { symbol: "DDOG", name: "Datadog Inc", sector: "Technology" },
  { symbol: "NET", name: "Cloudflare Inc", sector: "Technology" },
  { symbol: "SNOW", name: "Snowflake Inc", sector: "Technology" },
  { symbol: "SHOP", name: "Shopify Inc", sector: "Technology" },

  // ── Energy (8) ─────────────────────────────────────────
  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy" },
  { symbol: "CVX", name: "Chevron Corp", sector: "Energy" },
  { symbol: "TRGP", name: "Targa Resources", sector: "Energy" },
  { symbol: "OKE", name: "ONEOK Inc", sector: "Energy" },
  { symbol: "WMB", name: "Williams Companies", sector: "Energy" },
  { symbol: "SLB", name: "Schlumberger Ltd", sector: "Energy" },
  { symbol: "MPC", name: "Marathon Petroleum", sector: "Energy" },
  { symbol: "VLO", name: "Valero Energy", sector: "Energy" },

  // ── Industrials (10) ───────────────────────────────────
  { symbol: "GE", name: "GE Aerospace", sector: "Industrials" },
  { symbol: "TT", name: "Trane Technologies", sector: "Industrials" },
  { symbol: "URI", name: "United Rentals", sector: "Industrials" },
  { symbol: "CAT", name: "Caterpillar Inc", sector: "Industrials" },
  { symbol: "DE", name: "Deere & Company", sector: "Industrials" },
  { symbol: "ETN", name: "Eaton Corp", sector: "Industrials" },
  { symbol: "UBER", name: "Uber Technologies", sector: "Industrials" },
  { symbol: "AXON", name: "Axon Enterprise", sector: "Industrials" },
  { symbol: "PWR", name: "Quanta Services", sector: "Industrials" },
  { symbol: "FI", name: "Fiserv Inc", sector: "Industrials" },

  // ── Utilities (6) ──────────────────────────────────────
  { symbol: "VST", name: "Vistra Corp", sector: "Utilities" },
  { symbol: "CEG", name: "Constellation Energy", sector: "Utilities" },
  { symbol: "NRG", name: "NRG Energy", sector: "Utilities" },
  { symbol: "NEE", name: "NextEra Energy", sector: "Utilities" },
  { symbol: "SO", name: "Southern Company", sector: "Utilities" },
  { symbol: "DUK", name: "Duke Energy", sector: "Utilities" },

  // ── Healthcare (10) ────────────────────────────────────
  { symbol: "LLY", name: "Eli Lilly", sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare" },
  { symbol: "ABBV", name: "AbbVie Inc", sector: "Healthcare" },
  { symbol: "MRK", name: "Merck & Co", sector: "Healthcare" },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Healthcare" },
  { symbol: "ISRG", name: "Intuitive Surgical", sector: "Healthcare" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals", sector: "Healthcare" },
  { symbol: "BSX", name: "Boston Scientific", sector: "Healthcare" },
  { symbol: "SYK", name: "Stryker Corp", sector: "Healthcare" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals", sector: "Healthcare" },

  // ── Financials (10) ────────────────────────────────────
  { symbol: "FICO", name: "Fair Isaac Corp", sector: "Financials" },
  { symbol: "GS", name: "Goldman Sachs", sector: "Financials" },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials" },
  { symbol: "V", name: "Visa Inc", sector: "Financials" },
  { symbol: "MA", name: "Mastercard Inc", sector: "Financials" },
  { symbol: "MS", name: "Morgan Stanley", sector: "Financials" },
  { symbol: "BLK", name: "BlackRock Inc", sector: "Financials" },
  { symbol: "SPGI", name: "S&P Global", sector: "Financials" },
  { symbol: "COIN", name: "Coinbase Global", sector: "Financials" },
  { symbol: "HOOD", name: "Robinhood Markets", sector: "Financials" },

  // ── Consumer Discretionary (8) ─────────────────────────
  { symbol: "TSLA", name: "Tesla Inc", sector: "Consumer Discretionary" },
  { symbol: "AMZN", name: "Amazon.com Inc", sector: "Consumer Discretionary" },
  { symbol: "BKNG", name: "Booking Holdings", sector: "Consumer Discretionary" },
  { symbol: "HD", name: "Home Depot", sector: "Consumer Discretionary" },
  { symbol: "CMG", name: "Chipotle Mexican Grill", sector: "Consumer Discretionary" },
  { symbol: "DECK", name: "Deckers Outdoor", sector: "Consumer Discretionary" },
  { symbol: "RCL", name: "Royal Caribbean", sector: "Consumer Discretionary" },
  { symbol: "ORLY", name: "O'Reilly Automotive", sector: "Consumer Discretionary" },

  // ── Communication Services (6) ─────────────────────────
  { symbol: "GOOG", name: "Alphabet Inc", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix Inc", sector: "Communication Services" },
  { symbol: "DIS", name: "Walt Disney Co", sector: "Communication Services" },
  { symbol: "SPOT", name: "Spotify Technology", sector: "Communication Services" },
  { symbol: "TTWO", name: "Take-Two Interactive", sector: "Communication Services" },
  { symbol: "RBLX", name: "Roblox Corp", sector: "Communication Services" },

  // ── Materials (4) ──────────────────────────────────────
  { symbol: "FCX", name: "Freeport-McMoRan", sector: "Materials" },
  { symbol: "NUE", name: "Nucor Corp", sector: "Materials" },
  { symbol: "LIN", name: "Linde PLC", sector: "Materials" },
  { symbol: "SHW", name: "Sherwin-Williams", sector: "Materials" },

  // ── Real Estate (3) ────────────────────────────────────
  { symbol: "EQIX", name: "Equinix Inc", sector: "Real Estate" },
  { symbol: "AMT", name: "American Tower", sector: "Real Estate" },
  { symbol: "DLR", name: "Digital Realty", sector: "Real Estate" },

  // ── Consumer Staples (3) ───────────────────────────────
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer Staples" },
  { symbol: "WMT", name: "Walmart Inc", sector: "Consumer Staples" },
  { symbol: "PG", name: "Procter & Gamble", sector: "Consumer Staples" },
];

// ── Momentum Scoring ─────────────────────────────────────

function computeMomentumScore(
  quote: FinnhubQuote,
  technical: FinnhubTechnicalIndicator | null
): number {
  let score = 0;

  const changePct = quote.dp ?? 0;
  const perfScore = Math.min(30, Math.max(0, (changePct / 3) * 30));
  score += perfScore;

  const range = quote.h - quote.l;
  if (range > 0) {
    const rangePosition = (quote.c - quote.l) / range;
    score += rangePosition * 20;
  }

  if (quote.pc > 0) {
    const gapPct = ((quote.o - quote.pc) / quote.pc) * 100;
    const gapScore = Math.min(15, Math.max(0, (gapPct / 2) * 15));
    score += gapScore;
  }

  if (quote.o > 0) {
    const intradayPct = ((quote.c - quote.o) / quote.o) * 100;
    const intradayScore = Math.min(15, Math.max(0, (intradayPct / 1.5) * 15));
    score += intradayScore;
  }

  if (technical?.technicalAnalysis?.signal) {
    const signal = technical.technicalAnalysis.signal.toLowerCase();
    if (signal === "strong_buy") score += 20;
    else if (signal === "buy") score += 15;
    else if (signal === "neutral") score += 8;
    else if (signal === "sell") score += 3;
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

function estimateRsi(quote: FinnhubQuote): number {
  const changePct = quote.dp ?? 0;
  const range = quote.h - quote.l;
  const rangePosition = range > 0 ? (quote.c - quote.l) / range : 0.5;
  const base = 50 + changePct * 5;
  const adjusted = base * 0.6 + rangePosition * 40;
  return Math.round(Math.min(95, Math.max(5, adjusted)));
}

function detectPattern(quote: FinnhubQuote): string {
  const changePct = quote.dp ?? 0;
  const range = quote.h - quote.l;
  const body = Math.abs(quote.c - quote.o);
  const rangePosition = range > 0 ? (quote.c - quote.l) / range : 0.5;
  const bodyRatio = range > 0 ? body / range : 0;
  const gapPct = quote.pc > 0 ? ((quote.o - quote.pc) / quote.pc) * 100 : 0;

  if (gapPct > 1 && changePct > 1 && rangePosition > 0.7) return "Gap & Go";
  if (changePct > 2 && rangePosition > 0.8 && bodyRatio > 0.6) return "Breakout";
  if (rangePosition > 0.75 && bodyRatio < 0.3 && changePct > 0) return "Hammer Reversal";
  if (bodyRatio > 0.7 && changePct > 0.5 && changePct < 2) return "Range Expansion";
  if (bodyRatio < 0.15 && range > 0) return "Doji (Indecision)";
  if (rangePosition > 0.85 && changePct > 0) return "Closing Strong";
  if (changePct < -2 && rangePosition < 0.2) return "Breakdown";
  if (changePct < -1 && rangePosition < 0.3) return "Selling Pressure";
  if (Math.abs(changePct) < 0.5) return "Consolidation";
  if (changePct > 0) return "Higher Low";
  return "Pulling Back";
}

function mapSignal(
  technical: FinnhubTechnicalIndicator | null
): ScannerStock["signal"] {
  if (!technical?.technicalAnalysis?.signal) return "NEUTRAL";
  const raw = technical.technicalAnalysis.signal.toLowerCase();
  switch (raw) {
    case "strong_buy": return "STRONG BUY";
    case "buy": return "BUY";
    case "sell": return "SELL";
    case "strong_sell": return "STRONG SELL";
    default: return "NEUTRAL";
  }
}

function estimateRelativeVolume(quote: FinnhubQuote): number {
  const range = quote.h - quote.l;
  if (quote.c <= 0 || range <= 0) return 100;
  const rangePct = (range / quote.c) * 100;
  return Math.round(Math.min(500, Math.max(50, rangePct * 80)));
}

// ── Main Scanner ─────────────────────────────────────────

export interface ScanResult {
  stocks: ScannerStock[];
  errors: string[];
}

export function processQuotes(
  quotes: Map<string, FinnhubQuote>,
  technicals: Map<string, FinnhubTechnicalIndicator>,
  errors: string[]
): ScanResult {
  const now = new Date().toISOString();
  const stocks: ScannerStock[] = [];

  for (const entry of SCAN_UNIVERSE) {
    const quote = quotes.get(entry.symbol);
    if (!quote || quote.c <= 0) continue;

    const technical = technicals.get(entry.symbol) ?? null;

    const dayRange = quote.h - quote.l;
    const dayRangePosition =
      dayRange > 0 ? Math.round(((quote.c - quote.l) / dayRange) * 100) : 50;
    const gapPct =
      quote.pc > 0
        ? Math.round(((quote.o - quote.pc) / quote.pc) * 1000) / 10
        : 0;

    stocks.push({
      symbol: entry.symbol,
      name: entry.name,
      sector: entry.sector,
      price: quote.c,
      change: quote.d ?? 0,
      changePct: quote.dp ?? 0,
      dayHigh: quote.h,
      dayLow: quote.l,
      open: quote.o,
      prevClose: quote.pc,
      momentumScore: computeMomentumScore(quote, technical),
      relativeVolume: estimateRelativeVolume(quote),
      rsi: estimateRsi(quote),
      signal: mapSignal(technical),
      pattern: detectPattern(quote),
      dayRangePosition,
      gapPct,
      fetchedAt: now,
    });
  }

  // Sort by momentum score descending, return top 30
  stocks.sort((a, b) => b.momentumScore - a.momentumScore);
  const topStocks = stocks.slice(0, 30);

  return { stocks: topStocks, errors };
}
