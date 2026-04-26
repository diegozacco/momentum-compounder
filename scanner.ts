// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// types/scanner.ts — Momentum Compounder Scanner Domain
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Raw quote from Finnhub /quote endpoint */
export interface FinnhubQuote {
  /** Current price */
  c: number;
  /** Change */
  d: number;
  /** Percent change */
  dp: number;
  /** High of the day */
  h: number;
  /** Low of the day */
  l: number;
  /** Open price */
  o: number;
  /** Previous close */
  pc: number;
  /** Timestamp */
  t: number;
}

/** Raw technical indicator from Finnhub */
export interface FinnhubTechnicalIndicator {
  technicalAnalysis?: {
    count?: {
      buy?: number;
      neutral?: number;
      sell?: number;
    };
    signal?: string;
  };
  trend?: {
    adx?: number;
    trending?: boolean;
  };
}

/** Sector classification for rotation analysis */
export type SectorName =
  | "Technology"
  | "Healthcare"
  | "Energy"
  | "Financials"
  | "Industrials"
  | "Consumer Discretionary"
  | "Consumer Staples"
  | "Utilities"
  | "Real Estate"
  | "Materials"
  | "Communication Services";

/** Universe entry — each ticker we scan */
export interface UniverseEntry {
  symbol: string;
  name: string;
  sector: SectorName;
}

/** Processed scanner result returned by the API */
export interface ScannerStock {
  symbol: string;
  name: string;
  sector: SectorName;
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  prevClose: number;
  /** Composite momentum score 0-100 */
  momentumScore: number;
  /** Relative volume vs 20d avg (estimated from price action) */
  relativeVolume: number;
  /** Approximate RSI derived from price movement */
  rsi: number;
  /** Technical signal from Finnhub aggregate indicators */
  signal: "STRONG BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG SELL";
  /** Detected chart pattern (heuristic) */
  pattern: string;
  /** Day range position 0-100 (where current price sits) */
  dayRangePosition: number;
  /** Gap percentage from previous close to open */
  gapPct: number;
  /** Timestamp of data fetch */
  fetchedAt: string;
}

/** API response envelope */
export interface ScannerApiResponse {
  success: boolean;
  data: ScannerStock[];
  meta: {
    fetchedAt: string;
    count: number;
    universe: number;
    errors: string[];
  };
}

/** Error response */
export interface ScannerApiError {
  success: false;
  error: string;
  code: string;
}
