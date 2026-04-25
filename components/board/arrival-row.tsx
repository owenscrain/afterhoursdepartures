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
  statusBadgeLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export function ArrivalRow({
  routeColor,
  routeLabel,
  destination,
  etaPrimary,
  etaSecondary,
  runNumber,
  textColor = "var(--color-text-on-route)",
  copyColor = "var(--color-text-secondary)",
  statusBadgeLabel,
  className,
  style,
}: ArrivalRowProps) {
  const spokenRouteText = `${routeLabel}${runNumber != null ? ` #${runNumber}` : ""}`;
  const composedClassName = ["board-arrival-row", className].filter(Boolean).join(" ");
  const rowStyle = {
    "--arrival-row-bg": routeColor,
    "--arrival-row-fg": textColor,
    "--arrival-row-copy": copyColor,
    ...style,
  } as CSSProperties;

  return (
    <article
      aria-label={`${spokenRouteText} to ${destination}, ${etaPrimary}${etaSecondary ? ` ${etaSecondary}` : ""}${statusBadgeLabel ? `, ${statusBadgeLabel}` : ""}`}
      className={composedClassName}
      style={rowStyle}
    >
      <div className="board-arrival-row__left">
        <p className="board-arrival-row__destination">{destination}</p>
      </div>

      <div className="board-arrival-row__right">
        <div className="board-arrival-row__eta-line u-tabular-nums">
          <span className="board-arrival-row__eta-primary">{etaPrimary}</span>

          {etaSecondary ? (
            <span className="board-arrival-row__eta-secondary">{etaSecondary}</span>
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
