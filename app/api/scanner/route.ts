// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/api/scanner/route.ts — Momentum Scanner API
// Next.js App Router Route Handler
//
// GET /api/scanner
//   → Returns top 15 momentum stocks from Finnhub
//   → Response cached for 300s (server-side)
//   → Headers: Cache-Control, X-Scanner-*
//
// Environment:
//   FINNHUB_API_KEY  — Required. Your Finnhub API key.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextResponse } from "next/server";
import { batchGetQuotes, batchGetTechnicals } from "../../../lib/finnhub";
import { SCAN_UNIVERSE, processQuotes } from "../../../lib/scanner-engine";
import type { ScannerApiResponse, ScannerApiError } from "../../../types/scanner";

// ── Cache configuration ──────────────────────────────────

/**
 * Next.js revalidation interval (seconds).
 * The route handler result is cached and revalidated every 300s.
 * This means Finnhub is hit at most once per 5 minutes regardless
 * of how many clients request the scanner.
 */
export const dynamic = "force-dynamic";
export const revalidate = 300;

// ── In-memory cache layer ────────────────────────────────
// Belt-and-suspenders: even if Next.js cache misses, we don't
// hammer Finnhub. This survives within a single server process.

interface CacheEntry {
  data: ScannerApiResponse;
  expiresAt: number;
}

let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 300_000; // 5 minutes

function getCachedResponse(): ScannerApiResponse | null {
  if (memoryCache && Date.now() < memoryCache.expiresAt) {
    return memoryCache.data;
  }
  return null;
}

function setCachedResponse(data: ScannerApiResponse): void {
  memoryCache = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
}

// ── Route Handler ────────────────────────────────────────

export async function GET(): Promise<NextResponse<ScannerApiResponse | ScannerApiError>> {
  try {
    // 1. Check API key
    if (!process.env.FINNHUB_API_KEY) {
      return NextResponse.json(
        {
          success: false as const,
          error: "FINNHUB_API_KEY environment variable is not configured",
          code: "MISSING_API_KEY",
        },
        { status: 500 }
      );
    }

    // 2. Check in-memory cache
    const cached = getCachedResponse();
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
          "X-Scanner-Cache": "HIT",
          "X-Scanner-Fetched-At": cached.meta.fetchedAt,
        },
      });
    }

    // 3. Fetch live data
    const symbols = SCAN_UNIVERSE.map((e) => e.symbol);
    const errors: string[] = [];

    console.log(`[Scanner] Fetching quotes for ${symbols.length} symbols...`);
    const startTime = Date.now();

    // Fetch quotes (rate-limited internally)
    const quotes = await batchGetQuotes(symbols);

    // Track which symbols failed
    for (const sym of symbols) {
      if (!quotes.has(sym)) {
        errors.push(`Quote fetch failed: ${sym}`);
      }
    }

    // Fetch technicals only for symbols we got quotes for
    const quotedSymbols = Array.from(quotes.keys());
    console.log(
      `[Scanner] Got ${quotedSymbols.length}/${symbols.length} quotes. Fetching technicals...`
    );

    const technicals = await batchGetTechnicals(quotedSymbols);

    const elapsed = Date.now() - startTime;
    console.log(`[Scanner] Pipeline complete in ${elapsed}ms`);

    // 4. Score & rank
    const { stocks, errors: processingErrors } = processQuotes(
      quotes,
      technicals,
      errors
    );

    if (stocks.length === 0) {
      return NextResponse.json(
        {
          success: false as const,
          error:
            "No stocks could be fetched. Check FINNHUB_API_KEY and network connectivity.",
          code: "NO_DATA",
        },
        { status: 502 }
      );
    }

    // 5. Build response
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

    // 6. Cache & return
    setCachedResponse(response);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Scanner-Cache": "MISS",
        "X-Scanner-Duration-Ms": elapsed.toString(),
        "X-Scanner-Count": stocks.length.toString(),
      },
    });
  } catch (error) {
    console.error("[Scanner] Unhandled error:", error);

    // Return cached data if available, even if stale
    if (memoryCache) {
      console.warn("[Scanner] Returning stale cache due to error");
      return NextResponse.json(memoryCache.data, {
        status: 200,
        headers: {
          "X-Scanner-Cache": "STALE",
          "X-Scanner-Error": "true",
        },
      });
    }

    return NextResponse.json(
      {
        success: false as const,
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
