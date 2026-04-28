// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// lib/fmp.ts — Financial Modeling Prep API Client
// Batch quotes: 600 stocks in 2-3 API calls (~1 second)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";
const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;
const BATCH_SIZE = 300; // FMP allows ~300 symbols per batch request

/** Raw quote from FMP batch quote endpoint */
export interface FmpQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  timestamp: number;
}

function getApiKey(): string {
  const key = process.env.FMP_API_KEY;
  if (!key) {
    throw new Error(
      "[FMP] FMP_API_KEY is not set. Add it to your environment variables."
    );
  }
  return key;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * Fetch batch quotes from FMP.
 * FMP's /quote endpoint accepts comma-separated symbols.
 * We chunk into batches of 300 to stay safe.
 */
export async function batchGetQuotes(symbols: string[]): Promise<Map<string, FmpQuote>> {
  const apiKey = getApiKey();
  const results = new Map<string, FmpQuote>();

  // Split symbols into chunks
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    chunks.push(symbols.slice(i, i + BATCH_SIZE));
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Fetch all chunks in parallel
      const promises = chunks.map(async (chunk) => {
        const symbolList = chunk.join(",");
        const url = `${FMP_BASE_URL}/quote/${symbolList}?apikey=${apiKey}`;
        const response = await fetchWithTimeout(url);

        if (response.status === 429) {
          console.warn("[FMP] Rate limited, retrying...");
          return [];
        }

        if (!response.ok) {
          console.error(`[FMP] HTTP ${response.status}: ${response.statusText}`);
          return [];
        }

        const data = (await response.json()) as FmpQuote[];
        return Array.isArray(data) ? data : [];
      });

      const allResults = await Promise.all(promises);

      for (const batch of allResults) {
        for (const quote of batch) {
          if (quote && quote.symbol && quote.price > 0) {
            results.set(quote.symbol, quote);
          }
        }
      }

      // If we got results, return
      if (results.size > 0) return results;

      // No results — retry
      if (attempt < MAX_RETRIES) {
        await sleep(1500);
        continue;
      }
    } catch (error) {
      console.error(`[FMP] Fetch error (attempt ${attempt + 1}):`, error);
      if (attempt < MAX_RETRIES) {
        await sleep(1500);
        continue;
      }
    }
  }

  return results;
}
