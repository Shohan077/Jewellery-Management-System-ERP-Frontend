import type { CSSProperties } from "react";
import styles from "./analytics.module.css";

export type RingSegment = {
  color: string;
  detail?: string;
  label: string;
  value: number;
};

export function RingChart({
  centerLabel,
  centerValue,
  segments,
}: {
  centerLabel: string;
  centerValue: string;
  segments: readonly RingSegment[];
}) {
  const stops = segments.map((segment, index) => {
    const start = segments.slice(0, index).reduce((total, item) => total + item.value, 0);
    const end = start + segment.value;
    return `${segment.color} ${start}% ${end}%`;
  }).join(", ");

  return (
    <div className={styles.ringLayout}>
      <div
        aria-label={segments.map((segment) => `${segment.label} ${segment.value}%`).join(", ")}
        className={styles.ring}
        role="img"
        style={{ "--ring-segments": `conic-gradient(${stops})` } as CSSProperties}
      >
        <span><strong>{centerValue}</strong><small>{centerLabel}</small></span>
      </div>
      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.label}>
            <i style={{ background: segment.color }} />
            <span>{segment.label}</span>
            <strong>{segment.detail ?? `${segment.value}%`}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type LineSeries = {
  color: string;
  dashed?: boolean;
  label: string;
  values: readonly number[];
};

export function MultiLineChart({
  labels,
  max = 2.5,
  series,
}: {
  labels: readonly string[];
  max?: number;
  series: readonly LineSeries[];
}) {
  const width = 660;
  const height = 225;
  const left = 46;
  const right = 648;
  const top = 15;
  const bottom = 188;
  const grid = [max, max * 0.8, max * 0.6, max * 0.4, max * 0.2, 0];
  const points = (values: readonly number[]) => values.map((value, index) => {
    const x = left + index / Math.max(1, values.length - 1) * (right - left);
    const y = top + (max - value) / max * (bottom - top);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className={styles.lineWrap}>
      <div className={styles.lineLegend}>{series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</div>
      <div className={styles.lineScroller}>
        <svg aria-label={series.map((item) => item.label).join(" and ")} className={styles.lineChart} role="img" viewBox={`0 0 ${width} ${height}`}>
          {grid.map((value) => {
            const y = top + (max - value) / max * (bottom - top);
            return <g key={value}><line x1={left} x2={right} y1={y} y2={y} /><text x="0" y={y + 4}>{value === 0 ? "0" : `${value.toFixed(value % 1 ? 1 : 0)}M`}</text></g>;
          })}
          {series.map((item) => <polyline fill="none" key={item.label} points={points(item.values)} stroke={item.color} strokeDasharray={item.dashed ? "5 5" : undefined} />)}
          {series.flatMap((item) => item.values.map((value, index) => {
            const [x, y] = points(item.values).split(" ")[index].split(",");
            return <circle cx={x} cy={y} fill="white" key={`${item.label}-${index}`} r="2" stroke={item.color} />;
          }))}
          {labels.map((label, index) => <text className={styles.xLabel} key={label} textAnchor={index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"} x={left + index / Math.max(1, labels.length - 1) * (right - left)} y="216">{label}</text>)}
        </svg>
      </div>
    </div>
  );
}

export function BranchBarChart({ data }: { data: readonly { label: string; short: string; value: number }[] }) {
  const max = 6;
  return (
    <div className={styles.barChart} role="img" aria-label={data.map((item) => `${item.label} ${item.value.toFixed(2)} crore`).join(", ")}>
      <div className={styles.barGrid}><span>6Cr</span><span>5Cr</span><span>4Cr</span><span>3Cr</span><span>2Cr</span><span>1Cr</span><span>0</span></div>
      <div className={styles.bars}>
        {data.map((item) => <div key={item.label}><span className={styles.barValue} style={{ bottom: `calc(${item.value / max * 100}% + 4px)` }}>{item.value.toFixed(2)}Cr</span><i style={{ height: `${item.value / max * 100}%` }} /><small>{item.short}</small></div>)}
      </div>
    </div>
  );
}
