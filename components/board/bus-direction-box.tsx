import type { CSSProperties } from "react";

export type BusDirectionBoxProps = {
  directionLabel: "E" | "W" | string;
  directionName: string;
  etaValue: string;
  etaUnit?: string | null;
  hasPrediction: boolean;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
};

export function BusDirectionBox({
  directionLabel,
  directionName,
  etaValue,
  etaUnit,
  hasPrediction,
  backgroundColor = "var(--color-bus-box-bg)",
  textColor = "var(--color-bus-box-fg)",
  className,
  style,
}: BusDirectionBoxProps) {
  const composedClassName = [
    "display-bus-box",
    hasPrediction ? null : "display-bus-box--empty",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const boxStyle = {
    "--bus-box-bg": backgroundColor,
    "--bus-box-fg": textColor,
    ...style,
  } as CSSProperties;

  return (
    <article
      aria-label={`${directionName} bus ${etaValue}${etaUnit ? ` ${etaUnit}` : ""}${hasPrediction ? "" : ", no predictions"}`}
      className={composedClassName}
      style={boxStyle}
    >
      <p className="display-bus-box__direction">{directionLabel}</p>

      <div className="display-bus-box__eta u-tabular-nums">
        <span className="display-bus-box__eta-value">{etaValue}</span>
        {etaUnit ? <span className="display-bus-box__eta-unit">{etaUnit}</span> : null}
      </div>
    </article>
  );
}

export default BusDirectionBox;
