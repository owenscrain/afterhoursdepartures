"use client";

import { useEffect, useRef, useState } from "react";

import { DISPLAY_CONFIG } from "../../lib/config";
import type {
  ApiArrivalsResponse,
  ApiArrivalsSuccessResponse,
  NormalizedArrival,
} from "../../lib/cta/types";
import styles from "./brown-line-departure-display.module.css";

const DEPARTURE_COUNT = 4;
const LOOKAHEAD_COUNT = 12;
const CHICAGO_CLOCK_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: DISPLAY_CONFIG.timezone,
});

type DepartureItem = {
  id: string;
  destination: string;
  etaValue: string;
  etaUnit: string | null;
  isScheduled: boolean;
  isDelayed: boolean;
};

function getErrorMessage(response: Response, body: ApiArrivalsResponse | null) {
  if (body && !body.ok) {
    return body.error;
  }

  return `Arrivals request failed with status ${response.status}.`;
}

function toDepartureItem(arrival: NormalizedArrival): DepartureItem {
  return {
    id: arrival.id,
    destination: arrival.destinationName,
    etaValue: arrival.etaValue,
    etaUnit: arrival.etaUnit,
    isScheduled: arrival.isScheduled,
    isDelayed: arrival.isDelayed,
  };
}

function BrownLineDepartureRow({ departure }: { departure: DepartureItem }) {
  const statusLabel = departure.isDelayed ? "Delayed" : null;
  const className = [
    styles.departure,
    departure.isScheduled ? styles.scheduledDeparture : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      aria-label={`Brown Line to ${departure.destination}, ${departure.etaValue}${departure.etaUnit ? ` ${departure.etaUnit}` : ""}${departure.isScheduled ? ", scheduled" : ""}${statusLabel ? `, ${statusLabel}` : ""}`}
    >
      <div className={styles.departureCopy}>
        <p className={styles.destination}>{departure.destination}</p>
        {statusLabel ? (
          <p className={styles.status}>{statusLabel}</p>
        ) : null}
      </div>

      <div className={`${styles.eta} u-tabular-nums`}>
        <span className={styles.etaValue}>{departure.etaValue}</span>
        {departure.etaUnit ? (
          <span className={styles.etaUnit}>{departure.etaUnit}</span>
        ) : null}
      </div>
    </article>
  );
}

export function BrownLineDepartureDisplay() {
  const [departures, setDepartures] = useState<DepartureItem[]>([]);
  const [emptyMessage, setEmptyMessage] = useState("Loading Brown Line departures...");
  const [clockLabel, setClockLabel] = useState(() =>
    CHICAGO_CLOCK_FORMATTER.format(new Date()),
  );
  const hasLoadedSuccessfullyRef = useRef(false);
  const lastGoodDeparturesRef = useRef<DepartureItem[]>([]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockLabel(CHICAGO_CLOCK_FORMATTER.format(new Date()));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadDepartures() {
      try {
        const response = await fetch(`/api/arrivals?routes=Brn&max=${LOOKAHEAD_COUNT}`, {
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
        const nextDepartures = successfulBody.arrivals
          .filter((arrival) => arrival.routeCode === "Brn")
          .slice(0, DEPARTURE_COUNT)
          .map(toDepartureItem);

        setDepartures(nextDepartures);
        setEmptyMessage("No Brown Line departures available right now.");
        hasLoadedSuccessfullyRef.current = true;
        lastGoodDeparturesRef.current = nextDepartures;
      } catch {
        if (!isActive) {
          return;
        }

        if (hasLoadedSuccessfullyRef.current) {
          setDepartures(lastGoodDeparturesRef.current);
          setEmptyMessage("No Brown Line departures available right now.");
          return;
        }

        setDepartures([]);
        setEmptyMessage("Unable to load Brown Line departures.");
      }
    }

    void loadDepartures();

    const intervalId = window.setInterval(() => {
      void loadDepartures();
    }, DISPLAY_CONFIG.arrivals.refreshIntervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <main className={styles.display} aria-label="Brown Line departure display">
      <p className={`${styles.clock} u-tabular-nums`}>{clockLabel}</p>

      <section className={styles.departures} aria-label="Next Brown Line departures">
        {departures.length > 0 ? (
          departures.map((departure) => (
            <BrownLineDepartureRow key={departure.id} departure={departure} />
          ))
        ) : (
          <div className={styles.empty} role="status">
            {emptyMessage}
          </div>
        )}
      </section>
    </main>
  );
}

export default BrownLineDepartureDisplay;
