import { NextResponse } from "next/server";

import { DISPLAY_CONFIG } from "../../../lib/config";
import { fetchWeatherSummary, WeatherApiError } from "../../../lib/weather/forecast";

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
  try {
    const weather = await fetchWeatherSummary({
      latitude: DISPLAY_CONFIG.weather.latitude,
      longitude: DISPLAY_CONFIG.weather.longitude,
      timezone: DISPLAY_CONFIG.timezone,
    });

    return jsonResponse({
      ok: true,
      weather,
      defaults: {
        latitude: DISPLAY_CONFIG.weather.latitude,
        longitude: DISPLAY_CONFIG.weather.longitude,
        refreshIntervalMs: DISPLAY_CONFIG.weather.refreshIntervalMs,
        timezone: DISPLAY_CONFIG.timezone,
      },
    });
  } catch (error) {
    if (error instanceof WeatherApiError) {
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
        error: "Unexpected error while fetching weather.",
      },
      500,
    );
  }
}
