import { NextResponse } from "next/server";
import { batchGetQuotes } from "../../../lib/finnhub";
import { SCAN_UNIVERSE, processQuotes } from "../../../lib/scanner-engine";
import type { ScannerApiResponse, ScannerApiError } from "../../../types/scanner";

export const dynamic = "force-dynamic";
export const revalidate = 300;

interface CacheEntry {
  data: ScannerApiResponse;
  expiresAt: number;
}

let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 300_000;

function getCachedResponse(): ScannerApiResponse | null {
  if (memoryCache && Date.now() < memoryCache.expiresAt) {
    return memoryCache.data;
  }
  return null;
}

function setCachedResponse(data: ScannerApiResponse): void {
  memoryCache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
}

export async function GET(): Promise<NextResponse<ScannerApiResponse | ScannerApiError>> {
  try {
    if (!process.env.FINNHUB_API_KEY) {
      return NextResponse.json(
        { success: false as const, error: "FINNHUB_API_KEY not configured", code: "MISSING_API_KEY" },
        { status: 500 }
      );
    }

    const cached = getCachedResponse();
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60", "X-Scanner-Cache": "HIT" },
      });
    }

    const symbols = SCAN_UNIVERSE.map((e) => e.symbol);
    const errors: string[] = [];
    const startTime = Date.now();

    console.log(`[Scanner] Fetching quotes for ${symbols.length} symbols...`);
    const quotes = await batchGetQuotes(symbols);

    for (const sym of symbols) {
      if (!quotes.has(sym)) errors.push(`Quote fetch failed: ${sym}`);
    }

    console.log(`[Scanner] Got ${quotes.size}/${symbols.length} quotes. Scoring...`);

    // Skip technicals to stay within Vercel Hobby 10s timeout
    // Quotes alone provide 80% of the scoring (4 of 5 factors)
    const technicals = new Map();

    const elapsed = Date.now() - startTime;
    console.log(`[Scanner] Pipeline complete in ${elapsed}ms`);

    const { stocks, errors: processingErrors } = processQuotes(quotes, technicals, errors);

    if (stocks.length === 0) {
      return NextResponse.json(
        { success: false as const, error: "No stocks fetched. Check FINNHUB_API_KEY.", code: "NO_DATA" },
        { status: 502 }
      );
    }

    const response: ScannerApiResponse = {
      success: true,
      data: stocks,
      meta: {
        fetchedAt: new Date().toISOString(),
        count: stocks.length,
        universe: symbols.length,
        errors: [...errors, ...processingErrors],
      },
    };

    setCachedResponse(response);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Scanner-Cache": "MISS",
        "X-Scanner-Duration-Ms": elapsed.toString(),
      },
    });
  } catch (error) {
    console.error("[Scanner] Unhandled error:", error);

    if (memoryCache) {
      return NextResponse.json(memoryCache.data, {
        status: 200,
        headers: { "X-Scanner-Cache": "STALE", "X-Scanner-Error": "true" },
      });
    }

    return NextResponse.json(
      { success: false as const, error: error instanceof Error ? error.message : "Internal error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
