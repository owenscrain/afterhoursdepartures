import ArrivalStack from "../../../components/board/arrival-stack";
import { ADDISON_PREVIEW_ARRIVALS } from "../../../lib/mock-arrivals";

export default function ArrivalStackPreviewPage() {
  return (
    <main className="app-shell">
      <div>
        <section className="display-frame" aria-label="CTA arrival stack preview">
          <header className="display-header" aria-label="Station header">
            <h1 className="display-header__title">Addison</h1>
          </header>

          <ArrivalStack
            arrivals={ADDISON_PREVIEW_ARRIVALS}
            ariaLabel="Arrival list preview"
            className="display-stack-region"
            compact
          />

          <footer className="display-footer" aria-label="Board footer">
            <p className="display-footer__copy">52° / 67° Partly Cloudy</p>
            <p className="display-footer__copy">9:41 AM</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
