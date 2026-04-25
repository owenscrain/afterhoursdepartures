import type {
  OpenMeteoForecastResponse,
  WeatherRequest,
  WeatherSummary,
} from "./types";

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Freezing Drizzle",
  57: "Freezing Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  81: "Rain Showers",
  82: "Heavy Showers",
  85: "Snow Showers",
  86: "Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function toRoundedTemperature(value: number) {
  return Math.round(value);
}

function toConditionLabel(weatherCode: number) {
  return WEATHER_CODE_LABELS[weatherCode] ?? "Weather";
}

export class WeatherApiError extends Error {
  statusCode: number;

  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "WeatherApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function fetchWeatherSummary(
  request: WeatherRequest,
): Promise<WeatherSummary> {
  const searchParams = new URLSearchParams({
    latitude: String(request.latitude),
    longitude: String(request.longitude),
    timezone: request.timezone,
    temperature_unit: "fahrenheit",
    current: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min",
    forecast_days: "1",
  });

  const response = await fetch(
    `${OPEN_METEO_FORECAST_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new WeatherApiError(
      `Weather request failed with status ${response.status}.`,
      502,
    );
  }

  const body = (await response.json()) as OpenMeteoForecastResponse;

  if (!body.current) {
    throw new WeatherApiError(
      "Weather response was missing current conditions.",
      502,
      body,
    );
  }

  const highTemperature = body.daily?.temperature_2m_max?.[0] ?? null;
  const lowTemperature = body.daily?.temperature_2m_min?.[0] ?? null;

  return {
    updatedAt: body.current.time,
    temperature: toRoundedTemperature(body.current.temperature_2m),
    highTemperature:
      highTemperature !== null ? toRoundedTemperature(highTemperature) : null,
    lowTemperature:
      lowTemperature !== null ? toRoundedTemperature(lowTemperature) : null,
    weatherCode: body.current.weather_code,
    conditionLabel: toConditionLabel(body.current.weather_code),
  };
}
