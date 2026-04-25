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

const CLOCK_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: DISPLAY_CONFIG.timezone,
});

function formatTimeLabel(value: string | number | Date) {
  return CLOCK_FORMATTER.format(new Date(value));
}

type WeatherDisplay = {
  current: string;
  range: string | null;
  condition: string;
};

function formatWeatherDisplay(weather: WeatherSummary): WeatherDisplay {
  const current = `${weather.temperature}\u00b0`;
  const range =
    weather.highTemperature !== null && weather.lowTemperature !== null
      ? `H ${weather.highTemperature}\u00b0  L ${weather.lowTemperature}\u00b0`
      : null;

  return {
    current,
    range,
    condition: weather.conditionLabel,
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

function toDirectionLabel(label: string): "E" | "W" | string {
  if (/^e/i.test(label)) {
    return "E";
  }

  if (/^w/i.test(label)) {
    return "W";
  }

  return label.slice(0, 1).toUpperCase();
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
  const [weatherDisplay, setWeatherDisplay] = useState<WeatherDisplay | null>(null);
  const [statusLabel, setStatusLabel] = useState("Loading live arrivals...");
  const hasLoadedSuccessfullyRef = useRef(false);
  const lastGoodArrivalsRef = useRef<ArrivalStackItem[]>([]);
  const lastGoodUpdateLabelRef = useRef<string | null>(null);
  const hasLoadedWeatherSuccessfullyRef = useRef(false);
  const lastGoodWeatherRef = useRef<WeatherDisplay | null>(null);
  const hasLoadedBusSuccessfullyRef = useRef(false);
  const lastGoodBusBoxesRef = useRef<BusBoxItem[]>(getInitialBusBoxes());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockLabel(formatTimeLabel(new Date()));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadArrivals(isBackgroundRefresh: boolean) {
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
        const updatedLabel = formatTimeLabel(successfulBody.generatedAt);

        setArrivals(nextArrivals);
        setEmptyMessage("No live arrivals available right now.");
        setStatusLabel(
          isBackgroundRefresh
            ? `Updated ${updatedLabel}`
            : `Live arrivals updated ${updatedLabel}`,
        );

        hasLoadedSuccessfullyRef.current = true;
        lastGoodArrivalsRef.current = nextArrivals;
        lastGoodUpdateLabelRef.current = updatedLabel;
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (hasLoadedSuccessfullyRef.current) {
          setArrivals(lastGoodArrivalsRef.current);
          setEmptyMessage("No live arrivals available right now.");
          setStatusLabel(
            lastGoodUpdateLabelRef.current
              ? `Connection issue. Showing ${lastGoodUpdateLabelRef.current} update.`
              : "Connection issue. Showing last good arrivals.",
          );
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load live arrivals.";

        setArrivals([]);
        setEmptyMessage("Unable to load live arrivals.");
        setStatusLabel(message);
      }
    }

    void loadArrivals(false);

    const intervalId = window.setInterval(() => {
      void loadArrivals(true);
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

      <BusBoxGrid boxes={busBoxes} />

      <footer className="display-footer" aria-label="Board footer">
        <div className="display-footer__left">
          {weatherDisplay ? (
            <p className="display-footer__weather" aria-label="Current weather">
              <span className="display-footer__weather-current">{weatherDisplay.current}</span>
              {weatherDisplay.range ? (
                <span className="display-footer__weather-range">{weatherDisplay.range}</span>
              ) : null}
              <span className="display-footer__weather-condition">{weatherDisplay.condition}</span>
            </p>
          ) : (
            <p className="display-footer__weather-empty">Weather unavailable</p>
          )}
          <p className="display-footer__status">{statusLabel}</p>
        </div>
        <p className="display-footer__copy display-footer__copy--clock">{clockLabel}</p>
      </footer>
    </>
  );
}

export default LiveArrivalsPanel;
