import styles from "./reference-charts.module.css";

const THIS_MONTH = [
  31, 25, 38, 43, 49, 41, 52, 59, 86, 72, 69, 53, 35, 46, 48, 65, 64, 82,
  77, 70, 59, 66, 86,
] as const;

const LAST_MONTH = [
  19, 17, 21, 27, 34, 31, 36, 29, 34, 48, 38, 36, 25, 30, 42, 35, 38, 49,
  38, 36, 31, 35, 41,
] as const;

const CHART = {
  width: 700,
  height: 254,
  left: 48,
  right: 686,
  top: 18,
  bottom: 216,
} as const;

const GRID_VALUES = [100, 80, 60, 40, 20, 0] as const;
const X_TICKS = [
  { ratio: 0, label: "01 May" },
  { ratio: 0.167, label: "05 May" },
  { ratio: 0.333, label: "10 May" },
  { ratio: 0.5, label: "15 May" },
  { ratio: 0.667, label: "20 May" },
  { ratio: 0.833, label: "25 May" },
  { ratio: 1, label: "31 May" },
] as const;

function chartPoints(values: readonly number[]) {
  const plotWidth = CHART.right - CHART.left;
  const plotHeight = CHART.bottom - CHART.top;

  return values.map((value, index) => ({
    x: CHART.left + (index / (values.length - 1)) * plotWidth,
    y: CHART.top + ((100 - value) / 100) * plotHeight,
  }));
}

const THIS_MONTH_POINTS = chartPoints(THIS_MONTH);
const LAST_MONTH_POINTS = chartPoints(LAST_MONTH);

function pointsAttribute(points: readonly { x: number; y: number }[]) {
  return points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export type SalesTrendChartProps = {
  className?: string;
  compact?: boolean;
  title?: string;
};

export function SalesTrendChart({
  className = "",
  compact = false,
  title = "Sales Overview",
}: SalesTrendChartProps) {
  return (
    <section
      aria-label={`${title}: this month compared with last month`}
      className={`${styles.card} ${styles.trendCard} ${compact ? styles.compact : ""} ${className}`.trim()}
    >
      <header className={styles.cardHeader}>
        <h2>{title}</h2>
        <div aria-label="Chart legend" className={styles.legend}>
          <span>
            <i className={styles.currentKey} />
            This Month
          </span>
          <span>
            <i className={styles.previousKey} />
            Last Month
          </span>
        </div>
      </header>

      <div className={styles.chartFrame}>
        <svg
          aria-hidden="true"
          className={styles.lineChart}
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        >
          {GRID_VALUES.map((value) => {
            const y = CHART.top + ((100 - value) / 100) * (CHART.bottom - CHART.top);
            return (
              <g key={value}>
                <line
                  className={styles.gridLine}
                  x1={CHART.left}
                  x2={CHART.right}
                  y1={y}
                  y2={y}
                />
                <text className={styles.axisLabel} x={0} y={y + 4}>
                  {value === 0 ? "0" : `${value}M`}
                </text>
              </g>
            );
          })}

          {X_TICKS.map(({ label, ratio }) => (
            <text
              className={styles.xLabel}
              key={label}
              textAnchor={ratio === 0 ? "start" : ratio === 1 ? "end" : "middle"}
              x={CHART.left + ratio * (CHART.right - CHART.left)}
              y={245}
            >
              {label}
            </text>
          ))}

          <polyline
            className={styles.previousLine}
            fill="none"
            points={pointsAttribute(LAST_MONTH_POINTS)}
          />
          <polyline
            className={styles.currentLine}
            fill="none"
            points={pointsAttribute(THIS_MONTH_POINTS)}
          />

          {THIS_MONTH_POINTS.map(({ x, y }, index) => (
            <circle className={styles.currentPoint} cx={x} cy={y} key={index} r={2.2} />
          ))}
        </svg>
      </div>
    </section>
  );
}

export type CategoryDatum = { label: string; value: number };

const DEFAULT_CATEGORIES: readonly CategoryDatum[] = [
  { label: "Gold Jewellery", value: 60 },
  { label: "Diamond Jewellery", value: 20 },
  { label: "Silver Jewellery", value: 10 },
  { label: "Others", value: 10 },
];

const SEGMENT_STYLES = [styles.goldSegment, styles.diamondSegment, styles.silverSegment, styles.otherSegment] as const;

export type CategoryDonutChartProps = {
  categories?: readonly CategoryDatum[];
  className?: string;
  compact?: boolean;
  title?: string;
  total?: string;
};

export function CategoryDonutChart({
  categories = DEFAULT_CATEGORIES,
  className = "",
  compact = false,
  title = "Sales by Category",
  total = "৳ 2,45,80,000",
}: CategoryDonutChartProps) {
  const segments = categories.map((category, index) => ({
    ...category,
    className: SEGMENT_STYLES[index % SEGMENT_STYLES.length],
    offset: -categories.slice(0, index).reduce((sum, item) => sum + item.value, 0),
  }));
  const categoryDescription = categories.map((category) => `${category.label} ${category.value}%`).join(", ");

  return (
    <section
      aria-label={`${title}. ${total} total sales`}
      className={`${styles.card} ${styles.donutCard} ${compact ? styles.compact : ""} ${className}`.trim()}
    >
      <header className={styles.cardHeader}>
        <h2>{title}</h2>
      </header>

      <div className={styles.donutLayout}>
        <div className={styles.donut} role="img" aria-label={categoryDescription}>
          <svg aria-hidden="true" viewBox="0 0 44 44">
            <circle className={styles.donutTrack} cx="22" cy="22" fill="none" r="16" />
            {segments.map((segment) => (
              <circle
                className={`${styles.donutSegment} ${segment.className}`}
                cx="22"
                cy="22"
                fill="none"
                key={segment.label}
                pathLength="100"
                r="16"
                strokeDasharray={`${segment.value} ${100 - segment.value}`}
                strokeDashoffset={segment.offset}
              />
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <strong>{total}</strong>
            <span>Total Sales</span>
          </div>
        </div>

        <ul className={styles.categoryLegend}>
          {segments.map((segment) => (
            <li key={segment.label}>
              <i className={segment.className} />
              <span>{segment.label}</span>
              <strong>{segment.value}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
