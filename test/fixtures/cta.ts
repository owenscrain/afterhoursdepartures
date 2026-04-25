import type { CtaRawArrival, CtaRawArrivalsResponse } from "../../lib/cta/types";

export function buildRawArrival(
  overrides: Partial<CtaRawArrival> = {},
): CtaRawArrival {
  return {
    staId: "41440",
    stpId: "30178",
    staNm: "Addison",
    stpDe: "Service toward Kimball",
    rn: "411",
    rt: "Brn",
    destSt: "30292",
    destNm: "Kimball",
    trDr: "5",
    prdt: "2026-04-25T12:12:52",
    arrT: "2026-04-25T12:20:52",
    isApp: "0",
    isSch: "0",
    isDly: "0",
    isFlt: "0",
    flags: null,
    lat: "41.94702",
    lon: "-87.67474",
    heading: "357",
    ...overrides,
  };
}

export function buildCtaResponse(
  overrides: Partial<CtaRawArrivalsResponse["ctatt"]> = {},
): CtaRawArrivalsResponse {
  return {
    ctatt: {
      tmst: "2026-04-25T12:12:52",
      errCd: "0",
      errNm: null,
      eta: [buildRawArrival()],
      ...overrides,
    },
  };
}
