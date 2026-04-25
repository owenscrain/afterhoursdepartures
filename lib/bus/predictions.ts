import type {
  BusPredictionsRequest,
  BusStopConfig,
  CtaBusPredictionsResponse,
  CtaBusRawPrediction,
  NormalizedBusPredictionsPayload,
  NormalizedBusStopPrediction,
} from "./types";

const CTA_BUS_TRACKER_PREDICTIONS_URL =
  "https://www.ctabustracker.com/bustime/api/v3/getpredictions";

function normalizePredictionList(
  predictions?: CtaBusRawPrediction[] | CtaBusRawPrediction,
): CtaBusRawPrediction[] {
  if (!predictions) {
    return [];
  }

  return Array.isArray(predictions) ? predictions : [predictions];
}

function parseCountdown(value: string): { minutesUntilArrival: number | null; isDue: boolean } {
  if (value === "DUE") {
    return { minutesUntilArrival: 0, isDue: true };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return { minutesUntilArrival: null, isDue: false };
  }

  return {
    minutesUntilArrival: parsed,
    isDue: parsed <= 0,
  };
}

function toEtaDisplay(prediction: CtaBusRawPrediction) {
  const countdown = parseCountdown(prediction.prdctdn);

  if (countdown.isDue) {
    return {
      etaValue: "Due",
      etaUnit: null,
      etaLabel: "Due",
      minutesUntilArrival: countdown.minutesUntilArrival,
      isDue: true,
    };
  }

  if (countdown.minutesUntilArrival === null) {
    return {
      etaValue: "--",
      etaUnit: null,
      etaLabel: "Unavailable",
      minutesUntilArrival: null,
      isDue: false,
    };
  }

  return {
    etaValue: String(countdown.minutesUntilArrival),
    etaUnit: "min",
    etaLabel: `${countdown.minutesUntilArrival} min`,
    minutesUntilArrival: countdown.minutesUntilArrival,
    isDue: false,
  };
}

function toEmptyStopPrediction(stop: BusStopConfig): NormalizedBusStopPrediction {
  return {
    stopId: stop.stopId,
    cardLabel: stop.cardLabel,
    stopName: stop.stopName,
    destinationName: null,
    etaValue: "--",
    etaUnit: null,
    etaLabel: "Unavailable",
    minutesUntilArrival: null,
    isDue: false,
    hasPrediction: false,
  };
}

function normalizeStopPrediction(
  stop: BusStopConfig,
  prediction: CtaBusRawPrediction | null,
): NormalizedBusStopPrediction {
  if (!prediction) {
    return toEmptyStopPrediction(stop);
  }

  const eta = toEtaDisplay(prediction);

  return {
    stopId: stop.stopId,
    cardLabel: stop.cardLabel,
    stopName: stop.stopName,
    destinationName: prediction.des,
    etaValue: eta.etaValue,
    etaUnit: eta.etaUnit,
    etaLabel: eta.etaLabel,
    minutesUntilArrival: eta.minutesUntilArrival,
    isDue: eta.isDue,
    hasPrediction: true,
  };
}

export class BusApiError extends Error {
  statusCode: number;

  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "BusApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function fetchAndNormalizeBusPredictions(
  request: BusPredictionsRequest,
): Promise<NormalizedBusPredictionsPayload> {
  const searchParams = new URLSearchParams({
    key: request.apiKey,
    rt: request.routeCode,
    stpid: request.stops.map((stop) => stop.stopId).join(","),
    format: "json",
  });

  if (request.top) {
    searchParams.set("top", String(request.top));
  }

  const response = await fetch(
    `${CTA_BUS_TRACKER_PREDICTIONS_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new BusApiError(
      `CTA bus predictions request failed with status ${response.status}.`,
      502,
    );
  }

  const body = (await response.json()) as CtaBusPredictionsResponse;
  const payload = body["bustime-response"];

  if (!payload) {
    throw new BusApiError("CTA bus predictions response was missing bustime-response.", 502);
  }

  const errors = payload.error
    ? Array.isArray(payload.error)
      ? payload.error
      : [payload.error]
    : [];

  if (errors.length > 0) {
    throw new BusApiError(errors[0].msg, 502, errors);
  }

  const predictions = normalizePredictionList(payload.prd);
  const generatedAt = predictions[0]?.tmstmp ?? new Date().toISOString();

  const predictionsByStopId = new Map<string, CtaBusRawPrediction>();

  for (const prediction of predictions) {
    const current = predictionsByStopId.get(prediction.stpid);

    if (!current) {
      predictionsByStopId.set(prediction.stpid, prediction);
      continue;
    }

    const currentMinutes = parseCountdown(current.prdctdn).minutesUntilArrival;
    const nextMinutes = parseCountdown(prediction.prdctdn).minutesUntilArrival;

    if (currentMinutes === null || (nextMinutes !== null && nextMinutes < currentMinutes)) {
      predictionsByStopId.set(prediction.stpid, prediction);
    }
  }

  return {
    generatedAt,
    serverTime: new Date().toISOString(),
    routeCode: request.routeCode,
    predictions: request.stops.map((stop) =>
      normalizeStopPrediction(stop, predictionsByStopId.get(stop.stopId) ?? null),
    ),
  };
}
