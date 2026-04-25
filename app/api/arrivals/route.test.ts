import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "./route";
import { buildCtaResponse, buildRawArrival } from "../../../test/fixtures/cta";

const ORIGINAL_API_KEY = process.env.CTA_API_KEY;

beforeEach(() => {
  process.env.CTA_API_KEY = "test-key";
});

afterEach(() => {
  if (ORIGINAL_API_KEY === undefined) {
    delete process.env.CTA_API_KEY;
  } else {
    process.env.CTA_API_KEY = ORIGINAL_API_KEY;
  }

  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GET /api/arrivals", () => {
  it("returns normalized CTA arrivals using default config", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify(
          buildCtaResponse({
            eta: [
              buildRawArrival({
                rn: "409",
                rt: "Brn",
                destNm: "Loop",
                stpDe: "Service toward Loop",
                arrT: "2026-04-25T12:15:36",
                heading: "153",
                lat: "41.96536",
                lon: "-87.67539",
              }),
              buildRawArrival({
                rn: "407",
                rt: "Brn",
                destNm: "Kimball",
                stpDe: "Service toward Kimball",
                arrT: "2026-04-25T12:16:17",
                heading: "357",
              }),
            ],
          }),
        ),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest("http://localhost:3000/api/arrivals"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.defaults.station.mapId).toBe("41440");
    expect(body.defaults.refreshIntervalMs).toBe(15000);
    expect(body.query.routeCodes).toEqual(["Brn"]);
    expect(body.arrivals).toHaveLength(2);
    expect(body.arrivals[0]).toMatchObject({
      routeLabel: "Brown Line",
      destinationName: "Loop",
      etaValue: "3",
      etaUnit: "min",
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("mapid")).toBe("41440");
    expect(requestUrl.searchParams.get("rt")).toBe("Brn");
    expect(requestUrl.searchParams.get("max")).toBe("4");
  });

  it("accepts route and map overrides for other lines", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify(
          buildCtaResponse({
            eta: [
              buildRawArrival({
                staId: "41420",
                staNm: "Addison",
                rt: "Red",
                destNm: "Howard",
                stpDe: "Service toward Howard",
                heading: "1",
              }),
            ],
          }),
        ),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest(
        "http://localhost:3000/api/arrivals?mapid=41420&routes=Red&max=2",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.query.mapId).toBe("41420");
    expect(body.query.routeCodes).toEqual(["Red"]);
    expect(body.query.max).toBe(2);
    expect(body.arrivals[0]).toMatchObject({
      routeCode: "Red",
      routeLabel: "Red Line",
      routeColor: "var(--color-line-red)",
      destinationName: "Howard",
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("mapid")).toBe("41420");
    expect(requestUrl.searchParams.get("rt")).toBe("Red");
    expect(requestUrl.searchParams.get("max")).toBe("2");
  });

  it("returns 400 for an invalid max parameter", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest("http://localhost:3000/api/arrivals?max=0"),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toContain("max");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported route filters", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest(
        "http://localhost:3000/api/arrivals?mapid=41440&routes=NotARoute",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toContain("routes");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when CTA_API_KEY is missing", async () => {
    delete process.env.CTA_API_KEY;

    const response = await GET(
      new NextRequest("http://localhost:3000/api/arrivals"),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error).toContain("CTA_API_KEY");
  });
});
