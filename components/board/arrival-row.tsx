import type { CSSProperties } from "react";

export type ArrivalRowProps = {
  routeColor: string;
  routeLabel: string;
  destination: string;
  etaPrimary: string;
  etaSecondary?: string;
  runNumber?: number | string;
  textColor?: string;
  copyColor?: string;
  signalColor?: string;
  showSignal?: boolean;
  statusBadgeLabel?: string;
  className?: string;
  style?: CSSProperties;
};

type SignalGlyphProps = {
  className?: string;
};

function SignalGlyph({ className }: SignalGlyphProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M5 18a13 13 0 0 1 13-13" />
      <path d="M9 18a9 9 0 0 1 9-9" />
      <path d="M13 18a5 5 0 0 1 5-5" />
    </svg>
  );
}

export function ArrivalRow({
  routeColor,
  routeLabel,
  destination,
  etaPrimary,
  etaSecondary,
  runNumber,
  textColor = "var(--color-text-on-route)",
  copyColor = "var(--color-text-secondary)",
  signalColor,
  showSignal = true,
  statusBadgeLabel,
  className,
  style,
}: ArrivalRowProps) {
  const metaText = `${routeLabel}${runNumber != null ? ` #${runNumber}` : ""} to`;
  const composedClassName = ["board-arrival-row", className].filter(Boolean).join(" ");
  const rowStyle = {
    "--arrival-row-bg": routeColor,
    "--arrival-row-fg": textColor,
    "--arrival-row-copy": copyColor,
    "--arrival-row-signal": signalColor ?? textColor,
    ...style,
  } as CSSProperties;

  return (
    <article
      aria-label={`${metaText} ${destination}, ${etaPrimary}${etaSecondary ? ` ${etaSecondary}` : ""}${statusBadgeLabel ? `, ${statusBadgeLabel}` : ""}`}
      className={composedClassName}
      style={rowStyle}
    >
      <div className="board-arrival-row__left">
        <p className="board-arrival-row__meta">{metaText}</p>
        <p className="board-arrival-row__destination">{destination}</p>
      </div>

      <div className="board-arrival-row__right">
        <div className="board-arrival-row__eta-line u-tabular-nums">
          <span className="board-arrival-row__eta-primary">{etaPrimary}</span>

          {etaSecondary ? (
            <span className="board-arrival-row__eta-secondary">{etaSecondary}</span>
          ) : null}

          {showSignal ? (
            <SignalGlyph className="board-arrival-row__signal" />
          ) : null}
        </div>

        {statusBadgeLabel ? (
          <span className="board-arrival-row__status-badge u-status-badge">
            {statusBadgeLabel}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default ArrivalRow;
