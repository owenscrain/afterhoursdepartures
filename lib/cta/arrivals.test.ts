import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAndNormalizeCtaArrivals } from "./arrivals";
import { buildCtaResponse, buildRawArrival } from "../../test/fixtures/cta";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("fetchAndNormalizeCtaArrivals", () => {
  it("normalizes CTA arrivals into sorted board data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify(
          buildCtaResponse({
            eta: [
              buildRawArrival({
                rn: "499",
                arrT: "2026-04-25T12:32:52",
                isSch: "1",
                destNm: "Loop",
                stpDe: "Service toward Loop",
              }),
              buildRawArrival({
                rn: "412",
                arrT: "2026-04-25T12:17:52",
              }),
              buildRawArrival({
                rn: "410",
                arrT: "2026-04-25T12:13:00",
                isApp: "1",
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

    const result = await fetchAndNormalizeCtaArrivals({
      apiKey: "test-key",
      mapId: "41440",
      routeCodes: ["Brn"],
      max: 4,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("mapid")).toBe("41440");
    expect(requestUrl.searchParams.get("rt")).toBe("Brn");
    expect(requestUrl.searchParams.get("max")).toBe("4");
    expect(requestUrl.searchParams.get("outputType")).toBe("JSON");

    expect(result.stationName).toBe("Addison");
    expect(result.query.routeCodes).toEqual(["Brn"]);
    expect(result.arrivals).toHaveLength(3);
    expect(result.arrivals.map((arrival) => arrival.runNumber)).toEqual([
      "410",
      "412",
      "499",
    ]);

    expect(result.arrivals[0]).toMatchObject({
      routeCode: "Brn",
      routeLabel: "Brown Line",
      routeColor: "var(--color-line-brown)",
      destinationName: "Kimball",
      etaValue: "Due",
      etaUnit: null,
      etaLabel: "Due",
      isDue: true,
      isApproaching: true,
      statusBadgeLabel: null,
      heading: 357,
      latitude: 41.94702,
      longitude: -87.67474,
    });

    expect(result.arrivals[2]).toMatchObject({
      destinationName: "Loop",
      etaValue: "20",
      etaUnit: "min",
      etaLabel: "20 min",
      isScheduled: true,
      statusBadgeLabel: "Scheduled",
    });
  });

  it("throws a client error before fetching when no mapId or stopId is provided", async () => {
    await expect(
      fetchAndNormalizeCtaArrivals({
        apiKey: "test-key",
      }),
    ).rejects.toMatchObject({
      name: "CtaApiError",
      statusCode: 400,
      message: "CTA arrivals requests require either a mapId or a stopId.",
    });
  });

  it("throws a CTA API error when the upstream payload returns an error code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify(
            buildCtaResponse({
              errCd: "4",
              errNm: "Invalid mapid",
              eta: null,
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
      fetchAndNormalizeCtaArrivals({
        apiKey: "test-key",
        mapId: "bad-id",
      }),
    ).rejects.toMatchObject({
      name: "CtaApiError",
      statusCode: 400,
      message: "Invalid mapid",
    });
  });
});
