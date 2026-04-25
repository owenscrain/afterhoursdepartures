export const CTA_ROUTE_METADATA = {
  Red: {
    code: "Red",
    label: "Red Line",
    colorVar: "var(--color-line-red)",
    colorHex: "#c60c30",
  },
  Blue: {
    code: "Blue",
    label: "Blue Line",
    colorVar: "var(--color-line-blue)",
    colorHex: "#00a1de",
  },
  Brn: {
    code: "Brn",
    label: "Brown Line",
    colorVar: "var(--color-line-brown)",
    colorHex: "#62361b",
  },
  G: {
    code: "G",
    label: "Green Line",
    colorVar: "var(--color-line-green)",
    colorHex: "#009b3a",
  },
  Org: {
    code: "Org",
    label: "Orange Line",
    colorVar: "var(--color-line-orange)",
    colorHex: "#f9461c",
  },
  P: {
    code: "P",
    label: "Purple Line",
    colorVar: "var(--color-line-purple)",
    colorHex: "#522398",
  },
  Pink: {
    code: "Pink",
    label: "Pink Line",
    colorVar: "var(--color-line-pink)",
    colorHex: "#e27ea6",
  },
  Y: {
    code: "Y",
    label: "Yellow Line",
    colorVar: "var(--color-line-yellow)",
    colorHex: "#f9e300",
  },
} as const;

export type CtaRouteCode = keyof typeof CTA_ROUTE_METADATA;

type StationPreset = {
  name: string;
  mapId: string;
  defaultRouteCodes: CtaRouteCode[];
};

export const CTA_STATION_PRESETS = {
  addisonBrown: {
    name: "Addison",
    mapId: "41440",
    defaultRouteCodes: ["Brn"],
  },
  addisonRed: {
    name: "Addison",
    mapId: "41420",
    defaultRouteCodes: ["Red"],
  },
  addisonBlue: {
    name: "Addison",
    mapId: "41240",
    defaultRouteCodes: ["Blue"],
  },
} as const satisfies Record<string, StationPreset>;

export const DISPLAY_CONFIG = {
  station: CTA_STATION_PRESETS.addisonBrown,
  arrivals: {
    maxRows: 4,
    refreshIntervalMs: 15_000,
  },
  weather: {
    latitude: 41.94702,
    longitude: -87.67474,
    refreshIntervalMs: 10 * 60_000,
  },
  timezone: "America/Chicago",
} as const;

const ROUTE_ALIASES: Record<string, CtaRouteCode> = {
  red: "Red",
  redline: "Red",
  blue: "Blue",
  blueline: "Blue",
  brn: "Brn",
  brown: "Brn",
  brownline: "Brn",
  g: "G",
  green: "G",
  greenline: "G",
  org: "Org",
  orange: "Org",
  orangeline: "Org",
  p: "P",
  purple: "P",
  purpleline: "P",
  pink: "Pink",
  pinkline: "Pink",
  y: "Y",
  yellow: "Y",
  yellowline: "Y",
};

export function normalizeRouteCode(value: string): CtaRouteCode | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_-]+/g, "");
  return ROUTE_ALIASES[normalized] ?? null;
}

export function parseRouteCodes(input?: string | string[] | null): CtaRouteCode[] {
  if (!input) {
    return [];
  }

  const rawValues = Array.isArray(input) ? input : input.split(",");
  const routeCodes = rawValues
    .map((value) => normalizeRouteCode(value))
    .filter((value): value is CtaRouteCode => value !== null);

  return [...new Set(routeCodes)];
}

export function resolveRouteMetadata(routeCode: string) {
  const normalizedCode = normalizeRouteCode(routeCode);

  if (normalizedCode) {
    return CTA_ROUTE_METADATA[normalizedCode];
  }

  return {
    code: routeCode,
    label: routeCode,
    colorVar: "var(--color-ui-sign-grey)",
    colorHex: "#565a5c",
  };
}
