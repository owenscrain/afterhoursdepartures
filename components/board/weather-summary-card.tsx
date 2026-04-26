type WeatherIconVariant =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export type WeatherCardDisplay = {
  current: string | null;
  high: string | null;
  low: string | null;
  condition: string;
  weatherCode: number | null;
};

export type WeatherSummaryCardProps = {
  weather: WeatherCardDisplay | null;
  ariaLabel?: string;
  className?: string;
};

function getWeatherIconVariant(weatherCode: number | null): WeatherIconVariant {
  if (weatherCode === null) {
    return "cloudy";
  }

  if (weatherCode === 0) {
    return "clear";
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return "partly-cloudy";
  }

  if (weatherCode === 3) {
    return "cloudy";
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return "fog";
  }

  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) {
    return "snow";
  }

  if (weatherCode >= 95) {
    return "storm";
  }

  return "rain";
}

function WeatherConditionIcon({
  weatherCode,
  className,
}: {
  weatherCode: number | null;
  className?: string;
}) {
  const iconVariant = getWeatherIconVariant(weatherCode);
  const sharedProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 4,
    viewBox: "0 0 64 64",
  };

  if (iconVariant === "clear") {
    return (
      <svg {...sharedProps}>
        <circle cx="32" cy="32" r="10" />
        <path d="M32 8v8" />
        <path d="M32 48v8" />
        <path d="M8 32h8" />
        <path d="M48 32h8" />
        <path d="M15 15l6 6" />
        <path d="M43 43l6 6" />
        <path d="M49 15l-6 6" />
        <path d="M21 43l-6 6" />
      </svg>
    );
  }

  if (iconVariant === "partly-cloudy") {
    return (
      <svg {...sharedProps}>
        <circle cx="23" cy="24" r="8" />
        <path d="M23 8v5" />
        <path d="M23 35v5" />
        <path d="M7 24h5" />
        <path d="M34 24h5" />
        <path d="M12 13l4 4" />
        <path d="M30 31l4 4" />
        <path d="M34 13l-4 4" />
        <path d="M16 31l-4 4" />
        <path d="M20 46h24a8 8 0 0 0 1-16 13 13 0 0 0-24-3 9 9 0 0 0-1 19Z" />
      </svg>
    );
  }

  if (iconVariant === "cloudy") {
    return (
      <svg {...sharedProps}>
        <path d="M18 46h27a9 9 0 0 0 0-18 14 14 0 0 0-26-4 10 10 0 0 0-1 22Z" />
      </svg>
    );
  }

  if (iconVariant === "fog") {
    return (
      <svg {...sharedProps}>
        <path d="M18 40h27a9 9 0 0 0 0-18 14 14 0 0 0-26-4 10 10 0 0 0-1 22Z" />
        <path d="M16 48h32" />
        <path d="M20 56h24" />
      </svg>
    );
  }

  if (iconVariant === "snow") {
    return (
      <svg {...sharedProps}>
        <path d="M18 36h27a9 9 0 0 0 0-18 14 14 0 0 0-26-4 10 10 0 0 0-1 22Z" />
        <path d="M23 47v10" />
        <path d="M19 52h8" />
        <path d="M20 49l6 6" />
        <path d="M26 49l-6 6" />
        <path d="M41 47v10" />
        <path d="M37 52h8" />
        <path d="M38 49l6 6" />
        <path d="M44 49l-6 6" />
      </svg>
    );
  }

  if (iconVariant === "storm") {
    return (
      <svg {...sharedProps}>
        <path d="M18 36h27a9 9 0 0 0 0-18 14 14 0 0 0-26-4 10 10 0 0 0-1 22Z" />
        <path d="M31 40l-6 10h7l-3 10 10-14h-7l4-6" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <path d="M18 36h27a9 9 0 0 0 0-18 14 14 0 0 0-26-4 10 10 0 0 0-1 22Z" />
      <path d="M24 44l-4 10" />
      <path d="M34 44l-4 10" />
      <path d="M44 44l-4 10" />
    </svg>
  );
}

export function WeatherSummaryCard({
  weather,
  ariaLabel = "Weather summary",
  className,
}: WeatherSummaryCardProps) {
  const composedClassName = ["board-weather-card", className].filter(Boolean).join(" ");
  const current = weather?.current ?? "--";
  const high = weather?.high ?? "--";
  const low = weather?.low ?? "--";
  const condition = weather?.condition ?? "Weather unavailable";

  return (
    <section
      className={composedClassName}
      aria-label={`${ariaLabel}. ${condition}. Current ${current}. High ${high}. Low ${low}.`}
    >
      <div className="board-weather-card__primary">
        <WeatherConditionIcon
          weatherCode={weather?.weatherCode ?? null}
          className="board-weather-card__icon"
        />

        <p className="board-weather-card__current u-tabular-nums">{current}</p>
      </div>

      <div className="board-weather-card__range u-tabular-nums">
        <p className="board-weather-card__range-item">
          <span className="board-weather-card__range-label">HI</span>
          <span className="board-weather-card__range-value">{high}</span>
        </p>

        <p className="board-weather-card__range-item">
          <span className="board-weather-card__range-label">LO</span>
          <span className="board-weather-card__range-value">{low}</span>
        </p>
      </div>
    </section>
  );
}

export default WeatherSummaryCard;
