import { NextResponse } from "next/server";

import { DISPLAY_CONFIG } from "../../../lib/config";
import { BusApiError, fetchAndNormalizeBusPredictions } from "../../../lib/bus/predictions";

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

export async function GET() {
  if (!process.env.CTA_BUS_API_KEY) {
    return jsonResponse(
      { ok: false, error: "Missing CTA_BUS_API_KEY environment variable." },
      500,
    );
  }

  try {
    const payload = await fetchAndNormalizeBusPredictions({
      apiKey: process.env.CTA_BUS_API_KEY,
      routeCode: DISPLAY_CONFIG.bus.routeCode,
      stops: DISPLAY_CONFIG.bus.stops,
      top: DISPLAY_CONFIG.bus.topPredictions,
    });

    return jsonResponse({
      ok: true,
      defaults: {
        routeCode: DISPLAY_CONFIG.bus.routeCode,
        refreshIntervalMs: DISPLAY_CONFIG.bus.refreshIntervalMs,
        stops: DISPLAY_CONFIG.bus.stops,
      },
      ...payload,
    });
  } catch (error) {
    if (error instanceof BusApiError) {
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
        error: "Unexpected error while fetching CTA bus predictions.",
      },
      500,
    );
  }
}
