import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";
import { buildWeatherResponse } from "../../../test/fixtures/weather";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GET /api/weather", () => {
  it("returns normalized weather data from the default display config", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(buildWeatherResponse()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.defaults.refreshIntervalMs).toBe(600000);
    expect(body.defaults.timezone).toBe("America/Chicago");
    expect(body.weather).toMatchObject({
      temperature: 55,
      highTemperature: 67,
      lowTemperature: 47,
      conditionLabel: "Partly Cloudy",
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("latitude")).toBe("41.94702");
    expect(requestUrl.searchParams.get("longitude")).toBe("-87.67474");
  });
});
