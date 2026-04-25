import type { OpenMeteoForecastResponse } from "../../lib/weather/types";

export function buildWeatherResponse(
  overrides: Partial<OpenMeteoForecastResponse> = {},
): OpenMeteoForecastResponse {
  return {
    current: {
      time: "2026-04-25T12:45",
      temperature_2m: 54.6,
      weather_code: 2,
    },
    daily: {
      time: ["2026-04-25"],
      temperature_2m_max: [66.8],
      temperature_2m_min: [47.2],
    },
    ...overrides,
  };
}
