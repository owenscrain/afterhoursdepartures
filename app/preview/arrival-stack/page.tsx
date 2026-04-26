import ArrivalStack from "../../../components/board/arrival-stack";
import BusArrivalsCard from "../../../components/board/bus-arrivals-card";
import WeatherSummaryCard, {
  type WeatherCardDisplay,
} from "../../../components/board/weather-summary-card";
import {
  ADDISON_PREVIEW_ARRIVALS,
  ADDISON_PREVIEW_BUS_ARRIVALS,
} from "../../../lib/mock-arrivals";

const PREVIEW_WEATHER: WeatherCardDisplay = {
  current: "55\u00b0",
  high: "67\u00b0",
  low: "47\u00b0",
  condition: "Partly Cloudy",
  weatherCode: 2,
};

export default function ArrivalStackPreviewPage() {
  return (
    <main className="app-shell">
      <section className="display-frame" aria-label="CTA arrival stack preview">
        <header className="display-header" aria-label="Station header">
          <h1 className="display-header__title">Owen Crain</h1>
        </header>

        <ArrivalStack
          arrivals={ADDISON_PREVIEW_ARRIVALS}
          ariaLabel="Arrival list preview"
          className="display-stack-region"
          compact
        />

        <section className="display-support-region" aria-label="Bus and weather preview">
          <BusArrivalsCard
            arrivals={ADDISON_PREVIEW_BUS_ARRIVALS}
            ariaLabel="Bus arrival preview"
          />
          <WeatherSummaryCard weather={PREVIEW_WEATHER} />
        </section>

        <footer className="display-footer" aria-label="Board footer">
          <p className="display-footer__copy display-footer__copy--clock u-tabular-nums">
            6:28 PM
          </p>
        </footer>
      </section>
    </main>
  );
}
