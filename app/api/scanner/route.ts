// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/api/scanner/route.ts — Momentum Scanner API (FMP)
// 600 stocks in 2 batch calls, ~2 second total scan time
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextResponse } from "next/server";
import { batchGetQuotes } from "../../../lib/fmp";
import { SCAN_UNIVERSE, processQuotes } from "../../../lib/scanner-engine";
import type { ScannerApiResponse, ScannerApiError } from "../../../lib/scanner-engine";

export const dynamic = "force-dynamic";
export const revalidate = 300;

// ── In-memory cache ──────────────────────────────────────

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

// ── Route Handler ────────────────────────────────────────

export async function GET(): Promise<NextResponse<ScannerApiResponse | ScannerApiError>> {
  try {
    if (!process.env.FMP_API_KEY) {
      return NextResponse.json(
        { success: false as const, error: "FMP_API_KEY not configured", code: "MISSING_API_KEY" },
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

    console.log(`[Scanner] Fetching batch quotes for ${symbols.length} symbols via FMP...`);
    const quotes = await batchGetQuotes(symbols);

    const missed = symbols.filter((s) => !quotes.has(s));
    if (missed.length > 0) {
      errors.push(`${missed.length} symbols not returned by FMP`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Scanner] Got ${quotes.size}/${symbols.length} quotes in ${elapsed}ms. Scoring...`);

    const { stocks, errors: processingErrors } = processQuotes(quotes, errors);

    if (stocks.length === 0) {
      return NextResponse.json(
        { success: false as const, error: "No stocks fetched. Check FMP_API_KEY.", code: "NO_DATA" },
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
        headers: { "X-Scanner-Cache": "STALE" },
      });
    }

    return NextResponse.json(
      { success: false as const, error: error instanceof Error ? error.message : "Internal error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
