const FMP_BASE_URL = "https://financialmodelingprep.com/stable";
const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;
const BATCH_SIZE = 100;

export interface FmpQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
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
  open: number;
  previousClose: number;
  timestamp: number;
}

function getApiKey(): string {
  const key = process.env.FMP_API_KEY;
  if (!key) throw new Error("[FMP] FMP_API_KEY is not set.");
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

export async function batchGetQuotes(symbols: string[]): Promise<Map<string, FmpQuote>> {
  const apiKey = getApiKey();
  const results = new Map<string, FmpQuote>();

  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    chunks.push(symbols.slice(i, i + BATCH_SIZE));
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const promises = chunks.map(async (chunk) => {
        const symbolList = chunk.join(",");
        const url = `${FMP_BASE_URL}/quote?symbol=${symbolList}&apikey=${apiKey}`;
        const response = await fetchWithTimeout(url);

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

      if (results.size > 0) return results;

      if (attempt < MAX_RETRIES) {
        await sleep(1500);
        continue;
      }
