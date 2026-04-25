import { resolveRouteMetadata } from "../config";
import type {
  CtaArrivalsRequest,
  CtaRawArrival,
  CtaRawArrivalsResponse,
  NormalizedArrival,
  NormalizedArrivalsPayload,
} from "./types";

const CTA_TRAIN_TRACKER_ARRIVALS_URL =
  "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx";

function parseFeedTimestamp(value: string): number | null {
  const compactMatch = value.match(
    /^(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
  );

  if (compactMatch) {
    const [, year, month, day, hour, minute, second] = compactMatch;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  const isoLikeMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (isoLikeMatch) {
    const [, year, month, day, hour, minute, second = "0"] = isoLikeMatch;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumber(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeEtaList(eta?: CtaRawArrival[] | CtaRawArrival | null): CtaRawArrival[] {
  if (!eta) {
    return [];
  }

  return Array.isArray(eta) ? eta : [eta];
}

function toBooleanFlag(value: string): boolean {
  return value === "1";
}

function toEtaDisplay(arrival: CtaRawArrival, generatedAt: string) {
  const generatedAtEpoch = parseFeedTimestamp(generatedAt);
  const arrivalEpoch = parseFeedTimestamp(arrival.arrT);
  const isApproaching = toBooleanFlag(arrival.isApp);

  let minutesUntilArrival = 0;

  if (generatedAtEpoch !== null && arrivalEpoch !== null) {
    minutesUntilArrival = Math.max(
      0,
      Math.ceil((arrivalEpoch - generatedAtEpoch) / 60_000),
    );
  }

  const isDue = isApproaching || minutesUntilArrival <= 0;

  if (isDue) {
    return {
      minutesUntilArrival,
      etaValue: "Due",
      etaUnit: null,
      etaLabel: "Due",
      isDue,
    };
  }

  return {
    minutesUntilArrival,
    etaValue: String(minutesUntilArrival),
    etaUnit: "min",
    etaLabel: `${minutesUntilArrival} min`,
    isDue,
  };
}

function toStatusBadgeLabel(arrival: CtaRawArrival): string | null {
  if (toBooleanFlag(arrival.isSch)) {
    return "Scheduled";
  }

  if (toBooleanFlag(arrival.isDly)) {
    return "Delayed";
  }

  return null;
}

function normalizeArrival(arrival: CtaRawArrival, generatedAt: string): NormalizedArrival {
  const routeMetadata = resolveRouteMetadata(arrival.rt);
  const eta = toEtaDisplay(arrival, generatedAt);

  return {
    id: [
      arrival.staId,
      arrival.stpId,
      arrival.rt,
      arrival.rn,
      arrival.arrT,
    ].join(":"),
    stationId: arrival.staId,
    stopId: arrival.stpId,
    stationName: arrival.staNm,
    stopDescription: arrival.stpDe,
    routeCode: arrival.rt,
    routeLabel: routeMetadata.label,
    routeColor: routeMetadata.colorVar,
    routeColorHex: routeMetadata.colorHex,
    runNumber: arrival.rn,
    destinationStopId: arrival.destSt,
    destinationName: arrival.destNm,
    directionCode: arrival.trDr,
    predictionTime: arrival.prdt,
    arrivalTime: arrival.arrT,
    minutesUntilArrival: eta.minutesUntilArrival,
    etaValue: eta.etaValue,
    etaUnit: eta.etaUnit,
    etaLabel: eta.etaLabel,
    isDue: eta.isDue,
    isApproaching: toBooleanFlag(arrival.isApp),
    isScheduled: toBooleanFlag(arrival.isSch),
    isDelayed: toBooleanFlag(arrival.isDly),
    isFault: toBooleanFlag(arrival.isFlt),
    statusBadgeLabel: toStatusBadgeLabel(arrival),
    latitude: parseNumber(arrival.lat),
    longitude: parseNumber(arrival.lon),
    heading: parseNumber(arrival.heading),
  };
}

function normalizePayload(
  responseBody: CtaRawArrivalsResponse,
  request: Omit<CtaArrivalsRequest, "apiKey">,
): NormalizedArrivalsPayload {
  const generatedAt = responseBody.ctatt.tmst;
  const arrivals = normalizeEtaList(responseBody.ctatt.eta)
    .map((arrival) => normalizeArrival(arrival, generatedAt))
    .sort((left, right) => left.minutesUntilArrival - right.minutesUntilArrival);

  return {
    generatedAt,
    serverTime: new Date().toISOString(),
    stationName: arrivals[0]?.stationName ?? null,
    query: {
      mapId: request.mapId,
      stopId: request.stopId,
      routeCodes: request.routeCodes ?? [],
      max: request.max ?? null,
    },
    arrivals,
  };
}

function toErrorStatusCode(errorCode: string): number {
  const parsed = Number(errorCode);

  if (!Number.isFinite(parsed)) {
    return 502;
  }

  if (parsed >= 900) {
    return 502;
  }

  return 400;
}

export class CtaApiError extends Error {
  statusCode: number;

  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "CtaApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function fetchAndNormalizeCtaArrivals(
  request: CtaArrivalsRequest,
): Promise<NormalizedArrivalsPayload> {
  if (!request.mapId && !request.stopId) {
    throw new CtaApiError(
      "CTA arrivals requests require either a mapId or a stopId.",
      400,
    );
  }

  const searchParams = new URLSearchParams({
    key: request.apiKey,
    outputType: "JSON",
  });

  if (request.stopId) {
    searchParams.set("stpid", request.stopId);
  } else if (request.mapId) {
    searchParams.set("mapid", request.mapId);
  }

  if (request.max) {
    searchParams.set("max", String(request.max));
  }

  if (request.routeCodes?.length) {
    searchParams.set("rt", request.routeCodes.join(","));
  }

  const response = await fetch(
    `${CTA_TRAIN_TRACKER_ARRIVALS_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new CtaApiError(
      `CTA arrivals request failed with status ${response.status}.`,
      502,
    );
  }

  const responseBody = (await response.json()) as CtaRawArrivalsResponse;

  if (!responseBody.ctatt) {
    throw new CtaApiError("CTA arrivals response was missing ctatt.", 502);
  }

  if (responseBody.ctatt.errCd !== "0") {
    throw new CtaApiError(
      responseBody.ctatt.errNm ?? "CTA arrivals request failed.",
      toErrorStatusCode(responseBody.ctatt.errCd),
      responseBody.ctatt,
    );
  }

  return normalizePayload(responseBody, {
    mapId: request.mapId,
    stopId: request.stopId,
    routeCodes: request.routeCodes,
    max: request.max,
  });
}
