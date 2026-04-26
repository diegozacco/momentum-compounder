// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// lib/finnhub.ts — Finnhub API Client
// Production-grade: rate limiting, retries, typed responses
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinnhubQuote, FinnhubTechnicalIndicator } from "../types/scanner";

// ── Configuration ────────────────────────────────────────

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

/**
 * Finnhub free tier: 60 calls/minute.
 * We stagger requests with a delay to stay well under the limit.
 */
const RATE_LIMIT_DELAY_MS = 120; // ~500 calls/min headroom
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 8000;

// ── Helpers ──────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error(
      "[Finnhub] FINNHUB_API_KEY is not set. " +
        "Add it to .env.local: FINNHUB_API_KEY=your_key_here"
    );
  }
  return key;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout — AbortController-based.
 * Prevents hanging requests from blocking the entire scan.
 */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

// ── Core Fetch with Retry ────────────────────────────────

interface FinnhubFetchOptions {
  endpoint: string;
  params: Record<string, string>;
  retries?: number;
}

async function finnhubFetch<T>(options: FinnhubFetchOptions): Promise<T | null> {
  const { endpoint, params, retries = MAX_RETRIES } = options;
  const apiKey = getApiKey();

  const searchParams = new URLSearchParams({ ...params, token: apiKey });
  const url = `${FINNHUB_BASE_URL}${endpoint}?${searchParams.toString()}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url);

      // Rate limited — back off and retry
      if (response.status === 429) {
        console.warn(
          `[Finnhub] Rate limited on ${endpoint} (attempt ${attempt + 1}/${retries + 1})`
        );
        if (attempt < retries) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        return null;
      }

      // Server error — retry
      if (response.status >= 500) {
        console.warn(
          `[Finnhub] Server error ${response.status} on ${endpoint} (attempt ${attempt + 1})`
        );
        if (attempt < retries) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return null;
      }

      // Client error (not 429) — don't retry
      if (!response.ok) {
        console.error(
          `[Finnhub] HTTP ${response.status} on ${endpoint}: ${response.statusText}`
        );
        return null;
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`[Finnhub] Timeout on ${endpoint} (attempt ${attempt + 1})`);
      } else {
        console.error(`[Finnhub] Fetch error on ${endpoint}:`, error);
      }

      if (attempt < retries) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return null;
    }
  }

  return null;
}

// ── Public API ───────────────────────────────────────────

/**
 * Fetch real-time quote for a single symbol.
 * Returns null if the request fails after retries.
 */
export async function getQuote(symbol: string): Promise<FinnhubQuote | null> {
  return finnhubFetch<FinnhubQuote>({
    endpoint: "/quote",
    params: { symbol },
  });
}

/**
 * Fetch aggregate technical indicators for a symbol.
 * Uses the "1D" (daily) resolution.
 */
export async function getTechnicalIndicator(
  symbol: string
): Promise<FinnhubTechnicalIndicator | null> {
  return finnhubFetch<FinnhubTechnicalIndicator>({
    endpoint: "/scan/technical-indicator",
    params: { symbol, resolution: "D" },
  });
}

/**
 * Batch-fetch quotes for multiple symbols with rate limiting.
 * Returns a Map of symbol -> quote (skips failures).
 */
export async function batchGetQuotes(
  symbols: string[]
): Promise<Map<string, FinnhubQuote>> {
  const results = new Map<string, FinnhubQuote>();

  for (const symbol of symbols) {
    const quote = await getQuote(symbol);
    if (quote && quote.c > 0) {
      results.set(symbol, quote);
    }
    // Rate limit spacing
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  return results;
}

/**
 * Batch-fetch technical indicators with rate limiting.
 */
export async function batchGetTechnicals(
  symbols: string[]
): Promise<Map<string, FinnhubTechnicalIndicator>> {
  const results = new Map<string, FinnhubTechnicalIndicator>();

  for (const symbol of symbols) {
    const indicator = await getTechnicalIndicator(symbol);
    if (indicator) {
      results.set(symbol, indicator);
    }
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  return results;
}
