export type CtaArrivalsRequest = {
  apiKey: string;
  mapId?: string;
  stopId?: string;
  routeCodes?: string[];
  max?: number;
};

export type CtaRawArrival = {
  staId: string;
  stpId: string;
  staNm: string;
  stpDe: string;
  rn: string;
  rt: string;
  destSt: string;
  destNm: string;
  trDr: string;
  prdt: string;
  arrT: string;
  isApp: string;
  isSch: string;
  isDly: string;
  isFlt: string;
  flags: unknown;
  lat?: string;
  lon?: string;
  heading?: string;
};

export type CtaRawArrivalsResponse = {
  ctatt: {
    tmst: string;
    errCd: string;
    errNm: string | null;
    eta?: CtaRawArrival[] | CtaRawArrival | null;
  };
};

export type NormalizedArrival = {
  id: string;
  stationId: string;
  stopId: string;
  stationName: string;
  stopDescription: string;
  routeCode: string;
  routeLabel: string;
  routeColor: string;
  routeColorHex: string;
  runNumber: string;
  destinationStopId: string;
  destinationName: string;
  directionCode: string;
  predictionTime: string;
  arrivalTime: string;
  minutesUntilArrival: number;
  etaValue: string;
  etaUnit: string | null;
  etaLabel: string;
  isDue: boolean;
  isApproaching: boolean;
  isScheduled: boolean;
  isDelayed: boolean;
  isFault: boolean;
  statusBadgeLabel: string | null;
  latitude: number | null;
  longitude: number | null;
  heading: number | null;
};

export type NormalizedArrivalsPayload = {
  generatedAt: string;
  serverTime: string;
  stationName: string | null;
  query: {
    mapId?: string;
    stopId?: string;
    routeCodes: string[];
    max: number | null;
  };
  arrivals: NormalizedArrival[];
};

export type ApiArrivalsSuccessResponse = NormalizedArrivalsPayload & {
  ok: true;
  defaults: {
    station: {
      name: string;
      mapId: string;
      defaultRouteCodes: string[];
    };
    refreshIntervalMs: number;
    maxRows: number;
  };
};

export type ApiArrivalsErrorResponse = {
  ok: false;
  error: string;
  details?: unknown;
};

export type ApiArrivalsResponse =
  | ApiArrivalsSuccessResponse
  | ApiArrivalsErrorResponse;
