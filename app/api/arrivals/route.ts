import { NextRequest, NextResponse } from "next/server";

import { DISPLAY_CONFIG, parseRouteCodes } from "../../../lib/config";
import { CtaApiError, fetchAndNormalizeCtaArrivals } from "../../../lib/cta/arrivals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function parsePositiveInteger(value: string | null): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  if (!process.env.CTA_API_KEY) {
    return jsonResponse(
      { ok: false, error: "Missing CTA_API_KEY environment variable." },
      500,
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const stopId = searchParams.get("stpid") ?? undefined;
  const mapId = stopId
    ? undefined
    : searchParams.get("mapid") ?? DISPLAY_CONFIG.station.mapId;

  const requestedMax = parsePositiveInteger(searchParams.get("max"));

  if (searchParams.has("max") && requestedMax === null) {
    return jsonResponse(
      {
        ok: false,
        error: "Query parameter 'max' must be a positive integer.",
      },
      400,
    );
  }

  const rawRoutes = searchParams.get("routes") ?? searchParams.get("rt");
  const routeCodes = parseRouteCodes(rawRoutes);
  const max = requestedMax ?? DISPLAY_CONFIG.arrivals.maxRows;

  if (rawRoutes && routeCodes.length === 0) {
    return jsonResponse(
      {
        ok: false,
        error: "Query parameter 'routes' did not include any supported CTA train route codes.",
      },
      400,
    );
  }

  const resolvedRouteCodes =
    routeCodes.length > 0 ? routeCodes : DISPLAY_CONFIG.station.defaultRouteCodes;

  if (resolvedRouteCodes.length > 4) {
    return jsonResponse(
      {
        ok: false,
        error: "CTA supports at most 4 route codes per arrivals request.",
      },
      400,
    );
  }

  try {
    const payload = await fetchAndNormalizeCtaArrivals({
      apiKey: process.env.CTA_API_KEY,
      mapId,
      stopId,
      routeCodes: resolvedRouteCodes,
      max,
    });

    return jsonResponse({
      ok: true,
      defaults: {
        station: DISPLAY_CONFIG.station,
        refreshIntervalMs: DISPLAY_CONFIG.arrivals.refreshIntervalMs,
        maxRows: DISPLAY_CONFIG.arrivals.maxRows,
      },
      ...payload,
    });
  } catch (error) {
    if (error instanceof CtaApiError) {
      return jsonResponse(
        {
          ok: false,
          error: error.message,
          details: error.details ?? null,
        },
        error.statusCode,
      );
    }

    return jsonResponse(
      {
        ok: false,
        error: "Unexpected error while fetching CTA arrivals.",
      },
      500,
    );
  }
}
