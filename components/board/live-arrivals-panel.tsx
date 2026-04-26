"use client";

import { useEffect, useRef, useState } from "react";

import { DISPLAY_CONFIG } from "../../lib/config";
import type {
  ApiBusPredictionsResponse,
  ApiBusPredictionsSuccessResponse,
  NormalizedBusStopPrediction,
} from "../../lib/bus/types";
import type {
  ApiArrivalsResponse,
  ApiArrivalsSuccessResponse,
  NormalizedArrival,
} from "../../lib/cta/types";
import type {
  ApiWeatherResponse,
  ApiWeatherSuccessResponse,
  WeatherSummary,
} from "../../lib/weather/types";
import ArrivalStack, { type ArrivalStackItem } from "./arrival-stack";
import BusBoxGrid, { type BusBoxItem } from "./bus-box-grid";
import WeatherSummaryCard, {
  type WeatherCardDisplay,
} from "./weather-summary-card";

const CLOCK_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: DISPLAY_CONFIG.timezone,
});
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: DISPLAY_CONFIG.timezone,
});

function formatTimeLabel(value: string | number | Date) {
  return CLOCK_FORMATTER.format(new Date(value));
}

function formatDateLabel(value: string | number | Date) {
  const date = new Date(value);
  const parts = DATE_FORMATTER.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = date.getDate();

  return `${weekday}, ${month} ${formatOrdinalDay(day)}`;
}

function formatOrdinalDay(day: number) {
  const remainder = day % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

type WeatherDisplay = WeatherCardDisplay;

function formatWeatherDisplay(weather: WeatherSummary): WeatherDisplay {
  return {
    current: `${weather.temperature}\u00b0`,
    high: weather.highTemperature !== null ? `${weather.highTemperature}\u00b0` : null,
    low: weather.lowTemperature !== null ? `${weather.lowTemperature}\u00b0` : null,
    condition: weather.conditionLabel,
    weatherCode: weather.weatherCode,
  };
}

function toStackItem(arrival: NormalizedArrival): ArrivalStackItem {
  return {
    id: arrival.id,
    routeColor: arrival.routeColor,
    routeLabel: arrival.routeLabel,
    runNumber: arrival.runNumber,
    destinationName: arrival.destinationName,
    etaValue: arrival.etaValue,
    etaUnit: arrival.etaUnit,
    textColor: "var(--color-text-on-route)",
    copyColor: "var(--color-text-secondary)",
    mutedEta: arrival.isScheduled,
  };
}

function getErrorMessage(response: Response, body: ApiArrivalsResponse | null) {
  if (body && !body.ok) {
    return body.error;
  }

  return `Arrivals request failed with status ${response.status}.`;
}

function toDirectionName(label: string) {
  if (/^e/i.test(label)) {
    return "Eastbound";
  }

  if (/^w/i.test(label)) {
    return "Westbound";
  }

  return label;
}

function toDirectionLabel(label: string): string {
  if (/^e/i.test(label)) {
    return "East";
  }

  if (/^w/i.test(label)) {
    return "West";
  }

  return label;
}

function toBusBoxItem(prediction: NormalizedBusStopPrediction): BusBoxItem {
  return {
    id: prediction.stopId,
    directionLabel: toDirectionLabel(prediction.cardLabel),
    directionName: toDirectionName(prediction.cardLabel),
    etaValue: prediction.etaValue,
    etaUnit: prediction.etaUnit,
    hasPrediction: prediction.hasPrediction,
  };
}

function getBusErrorMessage(response: Response, body: ApiBusPredictionsResponse | null) {
  if (body && !body.ok) {
    return body.error;
  }

  return `Bus request failed with status ${response.status}.`;
}

function getInitialBusBoxes(): BusBoxItem[] {
  return DISPLAY_CONFIG.bus.stops.map((stop) => ({
    id: stop.stopId,
    directionLabel: toDirectionLabel(stop.cardLabel),
    directionName: toDirectionName(stop.cardLabel),
    etaValue: "--",
    etaUnit: null,
    hasPrediction: false,
  }));
}

export function LiveArrivalsPanel() {
  const [arrivals, setArrivals] = useState<ArrivalStackItem[]>([]);
  const [busBoxes, setBusBoxes] = useState<BusBoxItem[]>(() => getInitialBusBoxes());
  const [emptyMessage, setEmptyMessage] = useState("Loading live arrivals...");
  const [clockLabel, setClockLabel] = useState(() => formatTimeLabel(new Date()));
  const [dateLabel, setDateLabel] = useState(() => formatDateLabel(new Date()));
  const [weatherDisplay, setWeatherDisplay] = useState<WeatherDisplay | null>(null);
  const hasLoadedSuccessfullyRef = useRef(false);
  const lastGoodArrivalsRef = useRef<ArrivalStackItem[]>([]);
  const hasLoadedWeatherSuccessfullyRef = useRef(false);
  const lastGoodWeatherRef = useRef<WeatherDisplay | null>(null);
  const hasLoadedBusSuccessfullyRef = useRef(false);
  const lastGoodBusBoxesRef = useRef<BusBoxItem[]>(getInitialBusBoxes());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = new Date();
      setClockLabel(formatTimeLabel(now));
      setDateLabel(formatDateLabel(now));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadArrivals() {
      try {
        const response = await fetch("/api/arrivals", {
          cache: "no-store",
        });
        const body = (await response.json()) as ApiArrivalsResponse;

        if (!response.ok || !body.ok) {
          throw new Error(getErrorMessage(response, body));
        }

        if (!isActive) {
          return;
        }

        const successfulBody = body as ApiArrivalsSuccessResponse;
        const nextArrivals = successfulBody.arrivals.map(toStackItem);

        setArrivals(nextArrivals);
        setEmptyMessage("No live arrivals available right now.");

        hasLoadedSuccessfullyRef.current = true;
        lastGoodArrivalsRef.current = nextArrivals;
      } catch {
        if (!isActive) {
          return;
        }

        if (hasLoadedSuccessfullyRef.current) {
          setArrivals(lastGoodArrivalsRef.current);
          setEmptyMessage("No live arrivals available right now.");
          return;
        }

        setArrivals([]);
        setEmptyMessage("Unable to load live arrivals.");
      }
    }

    void loadArrivals();

    const intervalId = window.setInterval(() => {
      void loadArrivals();
    }, DISPLAY_CONFIG.arrivals.refreshIntervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadWeather() {
      try {
        const response = await fetch("/api/weather", {
          cache: "no-store",
        });
        const body = (await response.json()) as ApiWeatherResponse;

        if (!response.ok || !body.ok) {
          throw new Error(
            !body.ok ? body.error : `Weather request failed with status ${response.status}.`,
          );
        }

        if (!isActive) {
          return;
        }

        const successfulBody = body as ApiWeatherSuccessResponse;
        const nextWeatherDisplay = formatWeatherDisplay(successfulBody.weather);

        setWeatherDisplay(nextWeatherDisplay);
        hasLoadedWeatherSuccessfullyRef.current = true;
        lastGoodWeatherRef.current = nextWeatherDisplay;
      } catch {
        if (!isActive) {
          return;
        }

        if (hasLoadedWeatherSuccessfullyRef.current && lastGoodWeatherRef.current) {
          setWeatherDisplay(lastGoodWeatherRef.current);
          return;
        }

        setWeatherDisplay(null);
      }
    }

    void loadWeather();

    const intervalId = window.setInterval(() => {
      void loadWeather();
    }, DISPLAY_CONFIG.weather.refreshIntervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadBuses() {
      try {
        const response = await fetch("/api/buses", {
          cache: "no-store",
        });
        const body = (await response.json()) as ApiBusPredictionsResponse;

        if (!response.ok || !body.ok) {
          throw new Error(getBusErrorMessage(response, body));
        }

        if (!isActive) {
          return;
        }

        const successfulBody = body as ApiBusPredictionsSuccessResponse;
        const nextBusBoxes = successfulBody.predictions.map(toBusBoxItem);

        setBusBoxes(nextBusBoxes);
        hasLoadedBusSuccessfullyRef.current = true;
        lastGoodBusBoxesRef.current = nextBusBoxes;
      } catch {
        if (!isActive) {
          return;
        }

        if (hasLoadedBusSuccessfullyRef.current) {
          setBusBoxes(lastGoodBusBoxesRef.current);
          return;
        }

        setBusBoxes(getInitialBusBoxes());
      }
    }

    void loadBuses();

    const intervalId = window.setInterval(() => {
      void loadBuses();
    }, DISPLAY_CONFIG.bus.refreshIntervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <ArrivalStack
        arrivals={arrivals}
        ariaLabel="Live arrival list"
        className="display-stack-region"
        compact
        emptyMessage={emptyMessage}
      />

      <section className="display-support-region" aria-label="Bus and weather cards">
        <BusBoxGrid boxes={busBoxes} />
        <WeatherSummaryCard weather={weatherDisplay} />
      </section>

      <footer className="display-footer" aria-label="Board footer">
        <p className="display-footer__copy display-footer__copy--date">{dateLabel}</p>
        <p className="display-footer__copy display-footer__copy--clock u-tabular-nums">
          {clockLabel}
        </p>
      </footer>
    </>
  );
}

export default LiveArrivalsPanel;
