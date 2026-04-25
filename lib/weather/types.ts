export type OpenMeteoForecastResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export type WeatherRequest = {
  latitude: number;
  longitude: number;
  timezone: string;
};

export type WeatherSummary = {
  updatedAt: string;
  temperature: number;
  highTemperature: number | null;
  lowTemperature: number | null;
  weatherCode: number;
  conditionLabel: string;
};

export type ApiWeatherSuccessResponse = {
  ok: true;
  weather: WeatherSummary;
  defaults: {
    latitude: number;
    longitude: number;
    refreshIntervalMs: number;
    timezone: string;
  };
};

export type ApiWeatherErrorResponse = {
  ok: false;
  error: string;
  details?: unknown;
};

export type ApiWeatherResponse =
  | ApiWeatherSuccessResponse
  | ApiWeatherErrorResponse;
