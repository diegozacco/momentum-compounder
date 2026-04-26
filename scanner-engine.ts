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
} from "@/types/scanner";

// ── Scan Universe ────────────────────────────────────────
// 30 liquid, high-beta names across sectors.
// Intentionally larger than the 15 we return — we scan wide
// and filter to the strongest movers.

export const SCAN_UNIVERSE: UniverseEntry[] = [
  // Technology
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Technology" },
  { symbol: "AVGO", name: "Broadcom Inc", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology" },
  { symbol: "SMCI", name: "Super Micro Computer", sector: "Technology" },
  { symbol: "CRDO", name: "Credo Technology", sector: "Technology" },
  { symbol: "ANET", name: "Arista Networks", sector: "Technology" },
  { symbol: "PLTR", name: "Palantir Technologies", sector: "Technology" },
  { symbol: "APP", name: "AppLovin Corp", sector: "Technology" },
  { symbol: "PANW", name: "Palo Alto Networks", sector: "Technology" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology" },
  { symbol: "ORCL", name: "Oracle Corp", sector: "Technology" },
  // Energy
  { symbol: "TRGP", name: "Targa Resources", sector: "Energy" },
  { symbol: "OKE", name: "ONEOK Inc", sector: "Energy" },
  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy" },
  // Industrials
  { symbol: "GE", name: "GE Aerospace", sector: "Industrials" },
  { symbol: "TT", name: "Trane Technologies", sector: "Industrials" },
  { symbol: "URI", name: "United Rentals", sector: "Industrials" },
  // Utilities
  { symbol: "VST", name: "Vistra Corp", sector: "Utilities" },
  { symbol: "CEG", name: "Constellation Energy", sector: "Utilities" },
  // Healthcare
  { symbol: "LLY", name: "Eli Lilly", sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare" },
  // Financials
  { symbol: "FICO", name: "Fair Isaac Corp", sector: "Financials" },
  { symbol: "GS", name: "Goldman Sachs", sector: "Financials" },
  // Consumer Discretionary
  { symbol: "TSLA", name: "Tesla Inc", sector: "Consumer Discretionary" },
  { symbol: "BKNG", name: "Booking Holdings", sector: "Consumer Discretionary" },
  // Communication Services
  { symbol: "GOOG", name: "Alphabet Inc", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix Inc", sector: "Communication Services" },
  // Materials
  { symbol: "FCX", name: "Freeport-McMoRan", sector: "Materials" },
  // Real Estate
  { symbol: "EQIX", name: "Equinix Inc", sector: "Real Estate" },
  // Consumer Staples
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer Staples" },
];

// ── Momentum Scoring ─────────────────────────────────────

/**
 * Compute composite momentum score (0-100) from quote data.
 *
 * Scoring breakdown:
 *   - Day performance (change %)          → 0-30 pts
 *   - Day range position (close vs H/L)   → 0-20 pts
 *   - Gap strength (open vs prev close)   → 0-15 pts
 *   - Intraday trend (close vs open)      → 0-15 pts
 *   - Technical signal alignment          → 0-20 pts
 */
function computeMomentumScore(
  quote: FinnhubQuote,
  technical: FinnhubTechnicalIndicator | null
): number {
  let score = 0;

  // 1. Day performance (0-30)
  // +3% or more = full points, scales linearly
  const changePct = quote.dp ?? 0;
  const perfScore = Math.min(30, Math.max(0, (changePct / 3) * 30));
  score += perfScore;

  // 2. Day range position (0-20)
  // Closing near the high = bullish
  const range = quote.h - quote.l;
  if (range > 0) {
    const rangePosition = (quote.c - quote.l) / range;
    score += rangePosition * 20;
  }

  // 3. Gap strength (0-15)
  // Gap up from previous close = momentum
  if (quote.pc > 0) {
    const gapPct = ((quote.o - quote.pc) / quote.pc) * 100;
    const gapScore = Math.min(15, Math.max(0, (gapPct / 2) * 15));
    score += gapScore;
  }

  // 4. Intraday trend (0-15)
  // Price moving up from open to current = strong
  if (quote.o > 0) {
    const intradayPct = ((quote.c - quote.o) / quote.o) * 100;
    const intradayScore = Math.min(15, Math.max(0, (intradayPct / 1.5) * 15));
    score += intradayScore;
  }

  // 5. Technical signal alignment (0-20)
  if (technical?.technicalAnalysis?.signal) {
    const signal = technical.technicalAnalysis.signal.toLowerCase();
    if (signal === "strong_buy") score += 20;
    else if (signal === "buy") score += 15;
    else if (signal === "neutral") score += 8;
    else if (signal === "sell") score += 3;
    // strong_sell = 0
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Estimate RSI from daily price action.
 * This is an approximation — for true RSI you need 14 days of candles.
 * We use the day's movement relative to range as a proxy.
 */
function estimateRsi(quote: FinnhubQuote): number {
  const changePct = quote.dp ?? 0;
  const range = quote.h - quote.l;
  const rangePosition = range > 0 ? (quote.c - quote.l) / range : 0.5;

  // Map: strong up day with close near high → RSI ~75
  //       flat day → RSI ~50
  //       strong down day with close near low → RSI ~25
  const base = 50 + changePct * 5;
  const adjusted = base * 0.6 + rangePosition * 40;

  return Math.round(Math.min(95, Math.max(5, adjusted)));
}

/**
 * Detect chart pattern heuristic from single-day price action.
 * Production note: Real pattern detection requires multi-day candles.
 * This provides a best-effort classification from available data.
 */
function detectPattern(quote: FinnhubQuote): string {
  const changePct = quote.dp ?? 0;
  const range = quote.h - quote.l;
  const body = Math.abs(quote.c - quote.o);
  const rangePosition = range > 0 ? (quote.c - quote.l) / range : 0.5;
  const bodyRatio = range > 0 ? body / range : 0;
  const gapPct = quote.pc > 0 ? ((quote.o - quote.pc) / quote.pc) * 100 : 0;

  // Gap up with continuation
  if (gapPct > 1 && changePct > 1 && rangePosition > 0.7) {
    return "Gap & Go";
  }

  // Strong bullish candle
  if (changePct > 2 && rangePosition > 0.8 && bodyRatio > 0.6) {
    return "Breakout";
  }

  // Hammer / reversal
  if (rangePosition > 0.75 && bodyRatio < 0.3 && changePct > 0) {
    return "Hammer Reversal";
  }

  // Narrow range breakout
  if (bodyRatio > 0.7 && changePct > 0.5 && changePct < 2) {
    return "Range Expansion";
  }

  // Doji / indecision
  if (bodyRatio < 0.15 && range > 0) {
    return "Doji (Indecision)";
  }

  // Close near high with moderate move
  if (rangePosition > 0.85 && changePct > 0) {
    return "Closing Strong";
  }

  // Bearish patterns
  if (changePct < -2 && rangePosition < 0.2) {
    return "Breakdown";
  }

  if (changePct < -1 && rangePosition < 0.3) {
    return "Selling Pressure";
  }

  // Consolidation
  if (Math.abs(changePct) < 0.5) {
    return "Consolidation";
  }

  // Default
  if (changePct > 0) return "Higher Low";
  return "Pulling Back";
}

/**
 * Map Finnhub technical signal string to our display format.
 */
function mapSignal(
  technical: FinnhubTechnicalIndicator | null
): ScannerStock["signal"] {
  if (!technical?.technicalAnalysis?.signal) return "NEUTRAL";

  const raw = technical.technicalAnalysis.signal.toLowerCase();
  switch (raw) {
    case "strong_buy":
      return "STRONG BUY";
    case "buy":
      return "BUY";
    case "sell":
      return "SELL";
    case "strong_sell":
      return "STRONG SELL";
    default:
      return "NEUTRAL";
  }
}

/**
 * Estimate relative volume from price action.
 * Without actual volume data, we use the day's range relative
 * to the close as a volatility proxy.
 */
function estimateRelativeVolume(quote: FinnhubQuote): number {
  const range = quote.h - quote.l;
  if (quote.c <= 0 || range <= 0) return 100;

  // Range as % of price — typical stock has ~1-2% daily range
  const rangePct = (range / quote.c) * 100;

  // Map: 1% range = ~100% (normal), 3% = ~200%, 5% = ~350%
  return Math.round(Math.min(500, Math.max(50, rangePct * 80)));
}

// ── Main Scanner ─────────────────────────────────────────

export interface ScanResult {
  stocks: ScannerStock[];
  errors: string[];
}

/**
 * Run the full scanner pipeline:
 * 1. Fetch quotes for entire universe
 * 2. Fetch technical indicators
 * 3. Score & rank
 * 4. Return top 15
 */
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

  // Sort by momentum score descending, take top 15
  stocks.sort((a, b) => b.momentumScore - a.momentumScore);
  const topStocks = stocks.slice(0, 15);

  return { stocks: topStocks, errors };
}
