export type BusStopConfig = {
  stopId: string;
  cardLabel: string;
  stopName: string;
};

export type BusPredictionsRequest = {
  apiKey: string;
  routeCode: string;
  stops: readonly BusStopConfig[];
  top?: number;
};

export type CtaBusRawPrediction = {
  tmstmp: string;
  typ: string;
  stpnm: string;
  stpid: string;
  vid: string;
  dstp: string;
  rt: string;
  rtdd: string;
  rtdir: string;
  des: string;
  prdtm: string;
  tablockid?: string;
  tatripid?: string;
  dly: boolean;
  dyn: number;
  prdctdn: string;
  zone?: string;
};

export type CtaBusError = {
  msg: string;
  rt?: string;
  stpid?: string;
};

export type CtaBusPredictionsResponse = {
  "bustime-response": {
    prd?: CtaBusRawPrediction[] | CtaBusRawPrediction;
    error?: CtaBusError[] | CtaBusError | null;
  };
};

export type NormalizedBusStopPrediction = {
  stopId: string;
  cardLabel: string;
  stopName: string;
  destinationName: string | null;
  etaValue: string;
  etaUnit: string | null;
  etaLabel: string;
  minutesUntilArrival: number | null;
  isDue: boolean;
  hasPrediction: boolean;
};

export type NormalizedBusPredictionsPayload = {
  generatedAt: string;
  serverTime: string;
  routeCode: string;
  predictions: NormalizedBusStopPrediction[];
};

export type ApiBusPredictionsSuccessResponse = NormalizedBusPredictionsPayload & {
  ok: true;
  defaults: {
    routeCode: string;
    refreshIntervalMs: number;
    stops: readonly BusStopConfig[];
  };
};

export type ApiBusPredictionsErrorResponse = {
  ok: false;
  error: string;
  details?: unknown;
};

export type ApiBusPredictionsResponse =
  | ApiBusPredictionsSuccessResponse
  | ApiBusPredictionsErrorResponse;
