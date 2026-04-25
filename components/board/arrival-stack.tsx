import ArrivalRow from "./arrival-row";

export type ArrivalStackItem = {
  id: string;
  routeColor: string;
  routeLabel: string;
  runNumber?: number | string;
  destinationName: string;
  etaValue: string;
  etaUnit?: string | null;
  textColor?: string;
  copyColor?: string;
  signalColor?: string;
  showSignal?: boolean;
  statusBadgeLabel?: string | null;
};

export type ArrivalStackProps = {
  arrivals: readonly ArrivalStackItem[];
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
  emptyMessage?: string;
};

export function ArrivalStack({
  arrivals,
  ariaLabel = "Arrival list",
  className,
  compact = false,
  emptyMessage = "No arrival information available.",
}: ArrivalStackProps) {
  const composedClassName = [
    "board-arrival-stack",
    compact ? "board-arrival-stack--compact" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={composedClassName} aria-label={ariaLabel}>
      {arrivals.length > 0 ? (
        arrivals.map((arrival) => (
          <ArrivalRow
            key={arrival.id}
            routeColor={arrival.routeColor}
            routeLabel={arrival.routeLabel}
            runNumber={arrival.runNumber}
            destination={arrival.destinationName}
            etaPrimary={arrival.etaValue}
            etaSecondary={arrival.etaUnit ?? undefined}
            textColor={arrival.textColor}
            copyColor={arrival.copyColor}
            signalColor={arrival.signalColor}
            showSignal={arrival.showSignal}
            statusBadgeLabel={arrival.statusBadgeLabel ?? undefined}
          />
        ))
      ) : (
        <div className="board-arrival-stack__empty" role="status">
          <p className="board-arrival-stack__empty-text">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}

export default ArrivalStack;
