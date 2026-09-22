"use client";

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  LoaderCircle,
  Search,
} from "lucide-react";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  itemProduction,
  karigarOptions,
  karigarPerformance,
  monthlyProduction,
  reportTypes,
  type KarigarPerformance,
  type ProductionReportType,
} from "./production-report-data";
import styles from "./production-report.module.css";

type ReportFilters = {
  reportType: ProductionReportType;
  dateFrom: string;
  dateTo: string;
  karigar: string;
};

const initialFilters: ReportFilters = {
  reportType: "Production Summary",
  dateFrom: "2025-04-01",
  dateTo: "2025-04-30",
  karigar: "All Karigars",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function rangeScale(from: string, to: string) {
  const first = new Date(`${from}T00:00:00Z`).getTime();
  const last = new Date(`${to}T00:00:00Z`).getTime();
  const days = Math.floor((last - first) / 86_400_000) + 1;
  return Math.min(1, Math.max(0.05, days / 30));
}

function scaleRow(row: KarigarPerformance, scale: number): KarigarPerformance {
  const totalOrders = Math.round(row.totalOrders * scale);
  const completed = Math.min(totalOrders, Math.round(row.completed * scale));
  const inProgress = Math.min(totalOrders - completed, Math.round(row.inProgress * scale));
  const pending = Math.max(0, totalOrders - completed - inProgress);
  return { ...row, totalOrders, completed, inProgress, pending };
}

function buildDonutGradient(items: ReadonlyArray<{ color: string; value: number }>) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const stops = items.map((item) => {
    const start = cursor;
    cursor += (item.value / total) * 100;
    return `${item.color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function downloadCsv(filters: ReportFilters, rows: KarigarPerformance[]) {
  const headings = ["SL", "Karigar Name", "Total Orders", "Completed", "In Progress", "Pending", "Completion Rate"];
  const body = rows.map((row, index) => [
    index + 1,
    row.name,
    row.totalOrders,
    row.completed,
    row.inProgress,
    row.pending,
    `${row.totalOrders ? Math.round((row.completed / row.totalOrders) * 100) : 0}%`,
  ]);
  const metadata = [
    ["Production Report"],
    ["Report Type", filters.reportType],
    ["Date From", filters.dateFrom],
    ["Date To", filters.dateTo],
    ["Karigar", filters.karigar],
    [],
  ];
  const csv = [...metadata, headings, ...body]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `production-report-${filters.dateFrom}-to-${filters.dateTo}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

type MetricProps = {
  icon: typeof ClipboardList;
  label: string;
  tone: "amber" | "blue" | "green";
  value: number;
};

function Metric({ icon: Icon, label, tone, value }: MetricProps) {
  return (
    <Card as="article" className={styles.metric}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}><Icon aria-hidden="true" size={23} /></span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </Card>
  );
}

export function ProductionReport() {
  const [draft, setDraft] = useState<ReportFilters>(initialFilters);
  const [applied, setApplied] = useState<ReportFilters>(initialFilters);
  const [message, setMessage] = useState("");

  const view = useMemo(() => {
    const periodScale = rangeScale(applied.dateFrom, applied.dateTo);
    const selectedRows = applied.karigar === "All Karigars"
      ? karigarPerformance
      : karigarPerformance.filter((row) => row.name === applied.karigar);
    const karigarScale = selectedRows.reduce((sum, row) => sum + row.totalOrders, 0) / 32;
    const chartScale = periodScale * karigarScale;
    const rows = selectedRows.map((row) => scaleRow(row, periodScale));
    const metrics = rows.reduce((totals, row) => ({
      total: totals.total + row.totalOrders,
      completed: totals.completed + row.completed,
      inProgress: totals.inProgress + row.inProgress,
      pending: totals.pending + row.pending,
    }), { total: 0, completed: 0, inProgress: 0, pending: 0 });

    return {
      metrics,
      rows,
      months: monthlyProduction.map((month) => ({
        ...month,
        completed: Math.round(month.completed * chartScale),
        inProgress: Math.round(month.inProgress * chartScale),
      })),
      items: itemProduction.map((item) => ({
        ...item,
        value: Math.round(item.value * chartScale),
      })),
    };
  }, [applied]);

  const chartMaximum = Math.max(40, ...view.months.flatMap((month) => [month.completed, month.inProgress]));
  const linePoints = view.months.map((month, index) => {
    const x = 8 + (index / Math.max(1, view.months.length - 1)) * 84;
    const y = 92 - (month.inProgress / chartMaximum) * 78;
    return { x, y };
  });
  const totalItems = view.items.reduce((sum, item) => sum + item.value, 0);

  function generateReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.dateFrom > draft.dateTo) {
      setMessage("Date From must be earlier than Date To.");
      return;
    }
    setApplied(draft);
    const from = dateFormatter.format(new Date(`${draft.dateFrom}T00:00:00Z`));
    const to = dateFormatter.format(new Date(`${draft.dateTo}T00:00:00Z`));
    setMessage(`${draft.reportType} generated for ${from} – ${to}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.exportButton}`} onClick={() => { downloadCsv(applied, view.rows); setMessage("Production report exported as CSV."); }} type="button"><Download aria-hidden="true" size={15} />Export</button>}
        description="Home › Production Management › Production Report"
        title="Production Report"
      />

      <Card className={styles.filterCard}>
        <form onSubmit={generateReport}>
          <label><span>Report Type</span><select onChange={(event) => setDraft((current) => ({ ...current, reportType: event.target.value as ProductionReportType }))} value={draft.reportType}>{reportTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label><span>Date From</span><input onChange={(event) => setDraft((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={draft.dateFrom} /></label>
          <label><span>Date To</span><input onChange={(event) => setDraft((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={draft.dateTo} /></label>
          <label><span>Karigar</span><select onChange={(event) => setDraft((current) => ({ ...current, karigar: event.target.value }))} value={draft.karigar}>{karigarOptions.map((karigar) => <option key={karigar}>{karigar}</option>)}</select></label>
          <button className={styles.generateButton} type="submit"><Search aria-hidden="true" size={15} />Generate Report</button>
        </form>
      </Card>

      <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

      <section aria-label="Production summary" className={styles.metrics}>
        <Metric icon={ClipboardList} label="Total Orders" tone="amber" value={view.metrics.total} />
        <Metric icon={CheckCircle2} label="Completed" tone="green" value={view.metrics.completed} />
        <Metric icon={LoaderCircle} label="In Progress" tone="blue" value={view.metrics.inProgress} />
        <Metric icon={Clock3} label="Pending" tone="amber" value={view.metrics.pending} />
      </section>

      <div className={styles.chartGrid}>
        <Card className={styles.chartCard}>
          <div className={styles.cardHeading}>
            <h2>Monthly Production Overview</h2>
            <div className={styles.legend}><span><i className={styles.completedKey} />Completed</span><span><i className={styles.progressKey} />In Progress</span></div>
          </div>
          <div aria-label="Monthly completed and in-progress production chart" className={styles.trendChart} role="img">
            <div className={styles.yAxis}><span>{chartMaximum}</span><span>{Math.round(chartMaximum * .75)}</span><span>{Math.round(chartMaximum * .5)}</span><span>{Math.round(chartMaximum * .25)}</span><span>0</span></div>
            <div className={styles.plot}>
              <svg aria-hidden="true" className={styles.lineChart} preserveAspectRatio="none" viewBox="0 0 100 100">
                <polyline fill="none" points={linePoints.map((point) => `${point.x},${point.y}`).join(" ")} stroke="#16974d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" />
                {linePoints.map((point, index) => <circle cx={point.x} cy={point.y} fill="white" key={view.months[index].month} r="1.55" stroke="#16974d" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />)}
              </svg>
              {view.months.map((month) => (
                <div className={styles.month} key={month.month}>
                  <div className={styles.barArea}><span style={{ height: `${Math.max(month.completed ? 3 : 0, (month.completed / chartMaximum) * 100)}%` }} title={`${month.month}: ${month.completed} completed`} /></div>
                  <small>{month.month}</small>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className={styles.chartCard}>
          <h2>Item Wise Production</h2>
          <div className={styles.donutLayout}>
            <div aria-label={`${totalItems} total production items`} className={styles.donut} role="img" style={{ background: buildDonutGradient(view.items) } as CSSProperties}><span><strong>{totalItems}</strong><small>Total Items</small></span></div>
            <ul className={styles.itemLegend}>{view.items.map((item) => <li key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><strong>{item.value}</strong></li>)}</ul>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <h2>Karigar Production Performance</h2>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Karigar production performance for the generated report</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Karigar Name</th><th scope="col">Total Orders</th><th scope="col">Completed</th><th scope="col">In Progress</th><th scope="col">Pending</th><th scope="col">Completion Rate</th></tr></thead>
            <tbody>
              {view.rows.map((row, index) => {
                const rate = row.totalOrders ? Math.round((row.completed / row.totalOrders) * 100) : 0;
                return <tr key={row.id}><td>{index + 1}</td><td><strong>{row.name}</strong></td><td>{row.totalOrders}</td><td>{row.completed}</td><td>{row.inProgress}</td><td>{row.pending}</td><td><div className={styles.rate}><span><i style={{ width: `${rate}%` }} /></span><strong>{rate}%</strong></div></td></tr>;
              })}
              {!view.rows.length ? <tr><td className={styles.empty} colSpan={7}>No production data matches these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
