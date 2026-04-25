import LiveArrivalsPanel from "../components/board/live-arrivals-panel";
import { DISPLAY_CONFIG } from "../lib/config";

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="display-frame" aria-label="CTA home board">
        <header className="display-header" aria-label="Station header">
          <h1 className="display-header__title">{DISPLAY_CONFIG.station.name}</h1>
        </header>

        <LiveArrivalsPanel />
      </section>
    </main>
  );
}
