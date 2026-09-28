import type { CSSProperties } from "react";
import styles from "./report-visuals.module.css";

export type DonutSlice = { color: string; label: string; value: number };

export function DonutReport({ centerLabel, centerValue, slices }: { centerLabel: string; centerValue: string; slices: readonly DonutSlice[] }) {
  const gradient = slices.map((slice, index) => {
    const start = slices.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    const end = start + slice.value;
    return `${slice.color} ${start}% ${end}%`;
  }).join(", ");
  return <div className={styles.donutLayout}><div className={styles.donut} style={{ "--donut-gradient": `conic-gradient(${gradient})` } as CSSProperties}><span><strong>{centerValue}</strong><small>{centerLabel}</small></span></div><ul>{slices.map((slice) => <li key={slice.label}><i style={{ background: slice.color }} /><span>{slice.label}</span><strong>{slice.value}%</strong></li>)}</ul></div>;
}

const chartBox = { left: 42, right: 620, top: 18, bottom: 206, width: 650, height: 240 } as const;

function points(values: readonly number[], max: number) {
  return values.map((value, index) => `${chartBox.left + index / (values.length - 1) * (chartBox.right - chartBox.left)},${chartBox.top + (max - value) / max * (chartBox.bottom - chartBox.top)}`).join(" ");
}

export function MultiTrendChart({ labels, max = 100, series }: { labels: readonly string[]; max?: number; series: readonly { color: string; label: string; values: readonly number[] }[] }) {
  const grid = [max, max * .8, max * .6, max * .4, max * .2, 0];
  return <div className={styles.trend}><div className={styles.legend}>{series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</div><div className={styles.chartScroll}><svg aria-label={series.map((item) => item.label).join(", ")} role="img" viewBox={`0 0 ${chartBox.width} ${chartBox.height}`}>{grid.map((value) => { const y = chartBox.top + (max - value) / max * (chartBox.bottom - chartBox.top); return <g key={value}><line x1={chartBox.left} x2={chartBox.right} y1={y} y2={y} /><text x="0" y={y + 4}>{value === 0 ? "0" : `${value}L`}</text></g>; })}{series.map((item) => <polyline fill="none" key={item.label} points={points(item.values, max)} stroke={item.color} />)}{labels.map((label, index) => <text className={styles.xLabel} key={label} textAnchor={index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"} x={chartBox.left + index / (labels.length - 1) * (chartBox.right - chartBox.left)} y="232">{label}</text>)}</svg></div></div>;
}
