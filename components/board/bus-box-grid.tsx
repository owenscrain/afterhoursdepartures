import BusDirectionBox, { type BusDirectionBoxProps } from "./bus-direction-box";

export type BusBoxItem = Pick<
  BusDirectionBoxProps,
  "directionLabel" | "directionName" | "etaValue" | "etaUnit" | "hasPrediction"
> & {
  id: string;
};

export type BusBoxGridProps = {
  boxes: readonly BusBoxItem[];
  ariaLabel?: string;
  className?: string;
};

export function BusBoxGrid({
  boxes,
  ariaLabel = "Bus arrival boxes",
  className,
}: BusBoxGridProps) {
  const composedClassName = ["display-bus-grid", className].filter(Boolean).join(" ");

  return (
    <section className={composedClassName} aria-label={ariaLabel}>
      {boxes.map((box) => (
        <BusDirectionBox
          key={box.id}
          directionLabel={box.directionLabel}
          directionName={box.directionName}
          etaValue={box.etaValue}
          etaUnit={box.etaUnit}
          hasPrediction={box.hasPrediction}
        />
      ))}
    </section>
  );
}

export default BusBoxGrid;
