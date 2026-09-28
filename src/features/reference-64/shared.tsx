import type { CSSProperties, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import styles from "./reference-64.module.css";

export type MetricAccent = "blue" | "green" | "orange" | "violet";

export function MetricCard({
  accent = "blue",
  icon,
  label,
  note,
  value,
}: {
  accent?: MetricAccent;
  icon: ReactNode;
  label: string;
  note?: ReactNode;
  value: ReactNode;
}) {
  return (
    <Card as="article" className={styles.metricCard}>
      <span aria-hidden="true" className={`${styles.metricIcon} ${styles[`metric${accent[0].toUpperCase()}${accent.slice(1)}`]}`}>{icon}</span>
      <span className={styles.metricCopy}>
        <small>{label}</small>
        <strong>{value}</strong>
        {note ? <span>{note}</span> : null}
      </span>
    </Card>
  );
}

export function PanelHeading({ children, meta }: { children: ReactNode; meta?: ReactNode }) {
  return <header className={styles.panelHeading}><h2>{children}</h2>{meta ? <span>{meta}</span> : null}</header>;
}

export function ResponsiveTable({
  children,
  label,
  minWidth = 900,
}: {
  children: ReactNode;
  label: string;
  minWidth?: number;
}) {
  return (
    <div className={styles.tableScroll} style={{ "--reference-64-table-width": `${minWidth}px` } as CSSProperties}>
      <table>
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
    </div>
  );
}

type LineSeries = {
  color: string;
  label: string;
  values: readonly number[];
};

const lineBox = { left: 38, right: 510, top: 24, bottom: 172, width: 528, height: 202 } as const;

function chartPoints(values: readonly number[], max: number) {
  const divisor = Math.max(1, values.length - 1);
  return values.map((value, index) => {
    const x = lineBox.left + index / divisor * (lineBox.right - lineBox.left);
    const y = lineBox.top + (max - value) / max * (lineBox.bottom - lineBox.top);
    return `${x},${y}`;
  }).join(" ");
}

export function LineChart({
  labels,
  max,
  series,
  ticks,
}: {
  labels: readonly string[];
  max: number;
  series: readonly LineSeries[];
  ticks: readonly { label: string; value: number }[];
}) {
  return (
    <div className={styles.lineChart}>
      <div className={styles.chartLegend}>
        {series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
      </div>
      <div className={styles.chartCanvas}>
        <svg aria-label={`${series.map((item) => item.label).join(" and ")} trend`} role="img" viewBox={`0 0 ${lineBox.width} ${lineBox.height}`}>
          {ticks.map((tick) => {
            const y = lineBox.top + (max - tick.value) / max * (lineBox.bottom - lineBox.top);
            return <g key={tick.label}><line className={styles.gridLine} x1={lineBox.left} x2={lineBox.right} y1={y} y2={y} /><text className={styles.yLabel} x="2" y={y + 3}>{tick.label}</text></g>;
          })}
          {series.map((item) => (
            <g key={item.label}>
              <polyline fill="none" points={chartPoints(item.values, max)} stroke={item.color} />
              {item.values.map((value, index) => {
                const x = lineBox.left + index / Math.max(1, item.values.length - 1) * (lineBox.right - lineBox.left);
                const y = lineBox.top + (max - value) / max * (lineBox.bottom - lineBox.top);
                return <circle cx={x} cy={y} fill={item.color} key={`${item.label}-${index}`} r="1.8" />;
              })}
            </g>
          ))}
          {labels.map((label, index) => (
            <text
              className={styles.xLabel}
              key={label}
              textAnchor={index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"}
              x={lineBox.left + index / Math.max(1, labels.length - 1) * (lineBox.right - lineBox.left)}
              y="195"
            >{label}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function Sparkline({ color = "#16a65a", values }: { color?: string; values: readonly number[] }) {
  const width = 250;
  const height = 80;
  const top = 8;
  const bottom = 65;
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const points = values.map((value, index) => {
    const x = 3 + index / Math.max(1, values.length - 1) * (width - 6);
    const y = top + (max - value) / Math.max(1, max - min) * (bottom - top);
    return `${x},${y}`;
  }).join(" ");
  const area = `3,${bottom} ${points} ${width - 3},${bottom}`;

  return (
    <svg aria-label="Net profit margin trend" className={styles.sparkline} role="img" viewBox={`0 0 ${width} ${height}`}>
      <defs><linearGradient id="reference64MarginFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".22" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <line x1="3" x2={width - 3} y1={bottom} y2={bottom} />
      <polygon fill="url(#reference64MarginFill)" points={area} />
      <polyline fill="none" points={points} stroke={color} />
      {values.map((value, index) => {
        const x = 3 + index / Math.max(1, values.length - 1) * (width - 6);
        const y = top + (max - value) / Math.max(1, max - min) * (bottom - top);
        return <circle cx={x} cy={y} fill={color} key={index} r="2" />;
      })}
    </svg>
  );
}

export function BreakdownDonut({
  centerLabel,
  centerValue,
  items,
}: {
  centerLabel: string;
  centerValue: string;
  items: readonly { color: string; detail: string; label: string; value: number }[];
}) {
  const gradient = items.map((item, index) => {
    const start = items.slice(0, index).reduce((sum, current) => sum + current.value, 0);
    return `${item.color} ${start}% ${start + item.value}%`;
  }).join(", ");

  return (
    <div className={styles.donutLayout}>
      <div className={styles.donut} style={{ "--reference-64-donut": `conic-gradient(${gradient})` } as CSSProperties}>
        <span><strong>{centerValue}</strong><small>{centerLabel}</small></span>
      </div>
      <ul>
        {items.map((item) => <li key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><b>{item.value}%</b><small>{item.detail}</small></li>)}
      </ul>
    </div>
  );
}

export function BranchBarChart({ rows }: { rows: readonly { name: string; sales: number }[] }) {
  const max = 1400000;
  const ticks = [1400000, 1000000, 600000, 200000, 0];
  return (
    <div className={styles.barChart}>
      <div className={styles.barPlot}>
        <div className={styles.barAxis}>
          {ticks.map((tick) => <span key={tick}>{tick ? `${tick / 100000}L` : "0"}</span>)}
        </div>
        <div className={styles.barGrid}>
          {ticks.map((tick) => <i key={tick} />)}
        </div>
        <div className={styles.bars}>
          {rows.map((row) => (
            <div className={styles.barItem} key={row.name} title={`${row.name}: ৳ ${new Intl.NumberFormat("en-IN").format(row.sales)}`}>
              <strong>{(row.sales / 100000).toFixed(2)}L</strong>
              <i style={{ height: `${row.sales / max * 128}px` }} />
              <span>{row.name.replace(" Branch", "\nBranch")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

