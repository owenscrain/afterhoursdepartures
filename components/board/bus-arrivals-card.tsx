export type BusArrivalsCardItem = {
  id: string;
  label: string;
  etaValue: string;
  etaUnit?: string | null;
};

export type BusArrivalsCardProps = {
  arrivals: readonly BusArrivalsCardItem[];
  ariaLabel?: string;
  className?: string;
};

export function BusArrivalsCard({
  arrivals,
  ariaLabel = "Bus arrivals",
  className,
}: BusArrivalsCardProps) {
  const composedClassName = ["board-bus-card", className].filter(Boolean).join(" ");

  return (
    <section className={composedClassName} aria-label={ariaLabel}>
      {arrivals.map((arrival) => (
        <article
          key={arrival.id}
          className="board-bus-card__lane"
          aria-label={`${arrival.label} bus in ${arrival.etaValue}${arrival.etaUnit ? ` ${arrival.etaUnit}` : ""}`}
        >
          <p className="board-bus-card__label">{arrival.label}</p>

          <p className="board-bus-card__eta u-tabular-nums">
            <span className="board-bus-card__eta-primary">{arrival.etaValue}</span>
            {arrival.etaUnit ? (
              <span className="board-bus-card__eta-secondary">{arrival.etaUnit}</span>
            ) : null}
          </p>
        </article>
      ))}
    </section>
  );
}

export default BusArrivalsCard;
