import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWeatherSummary, WeatherApiError } from "./forecast";
import { buildWeatherResponse } from "../../test/fixtures/weather";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("fetchWeatherSummary", () => {
  it("normalizes Open-Meteo weather into footer-friendly data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(buildWeatherResponse()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchWeatherSummary({
      latitude: 41.94702,
      longitude: -87.67474,
      timezone: "America/Chicago",
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("latitude")).toBe("41.94702");
    expect(requestUrl.searchParams.get("longitude")).toBe("-87.67474");
    expect(requestUrl.searchParams.get("timezone")).toBe("America/Chicago");
    expect(requestUrl.searchParams.get("temperature_unit")).toBe("fahrenheit");

    expect(result).toMatchObject({
      updatedAt: "2026-04-25T12:45",
      temperature: 55,
      highTemperature: 67,
      lowTemperature: 47,
      weatherCode: 2,
      conditionLabel: "Partly Cloudy",
    });
  });

  it("throws when current conditions are missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify(
            buildWeatherResponse({
              current: undefined,
            }),
          ),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(
      fetchWeatherSummary({
        latitude: 41.94702,
        longitude: -87.67474,
        timezone: "America/Chicago",
      }),
    ).rejects.toMatchObject({
      name: "WeatherApiError",
      statusCode: 502,
      message: "Weather response was missing current conditions.",
    });
  });
});
