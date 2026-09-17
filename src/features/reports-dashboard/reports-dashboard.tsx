"use client";

import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  Printer,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  categorySales,
  dashboardTotals,
  formatDashboardCurrency,
  topSellingProducts,
  weeklyPerformance,
} from "./reports-dashboard-data";
import styles from "./reports-dashboard.module.css";

const branchFactors: Record<string, number> = {
  "All Branches": 1,
  "Main Branch": 0.42,
  "Uttara Branch": 0.24,
  "Chittagong Branch": 0.18,
  "Sylhet Branch": 0.16,
};

const periodFactors: Record<string, number> = {
  "01 Apr 2025 - 30 Apr 2025": 1,
  "01 Mar 2025 - 31 Mar 2025": 0.92,
  "01 Feb 2025 - 28 Feb 2025": 0.84,
  "01 Jan 2025 - 31 Mar 2025": 2.76,
};

type MetricCardProps = {
  label: string;
  trend: number;
  value: number;
};

function MetricCard({ label, trend, value }: MetricCardProps) {
  const positive = trend >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  return (
    <Card className={styles.metricCard}>
      <p>{label}</p>
      <strong>{formatDashboardCurrency(value)}</strong>
      <span className={positive ? styles.positive : styles.negative}>
        <TrendIcon aria-hidden="true" size={12} /> {Math.abs(trend)}%
      </span>
    </Card>
  );
}

function downloadReportCsv(scale: number) {
  const rows = [
    ["Product Name", "Quantity Sold", "Amount (BDT)"],
    ...topSellingProducts.map((product) => [product.name, Math.max(1, Math.round(product.quantity * scale)), Math.round(product.amount * scale)]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "reports-dashboard.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ReportsDashboard() {
  const [period, setPeriod] = useState("01 Apr 2025 - 30 Apr 2025");
  const [branch, setBranch] = useState("All Branches");
  const [message, setMessage] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const scale = (periodFactors[period] ?? 1) * (branchFactors[branch] ?? 1);
  const view = useMemo(() => ({
    metrics: {
      sales: dashboardTotals.sales * scale,
      purchase: dashboardTotals.purchase * scale,
      profit: dashboardTotals.profit * scale,
      expenses: dashboardTotals.expenses * scale,
    },
    weeks: weeklyPerformance.map((week) => ({
      ...week,
      sales: week.sales * scale,
      purchase: week.purchase * scale,
    })),
    products: topSellingProducts.map((product) => ({
      ...product,
      quantity: Math.max(1, Math.round(product.quantity * scale)),
      amount: product.amount * scale,
    })),
  }), [scale]);

  const chartMaximum = Math.max(...view.weeks.flatMap((week) => [week.sales, week.purchase]), 1);

  useEffect(() => {
    if (!scheduleOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScheduleOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [scheduleOpen]);

  function refreshReport(nextPeriod: string, nextBranch: string) {
    setMessage(`Report updated for ${nextPeriod} · ${nextBranch}.`);
  }

  function printReport(mode: "PDF" | "print") {
    setMessage(mode === "PDF" ? "PDF print view opened. Choose Save as PDF in the print dialog." : "Print view opened.");
    window.setTimeout(() => window.print(), 0);
  }

  function scheduleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const frequency = String(form.get("frequency"));
    const recipient = String(form.get("recipient"));
    setScheduleOpen(false);
    setMessage(`${frequency} report scheduled for ${recipient}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerFilters}>
            <label>
              <CalendarDays aria-hidden="true" size={15} />
              <span className="sr-only">Report date range</span>
              <select onChange={(event) => { setPeriod(event.target.value); refreshReport(event.target.value, branch); }} value={period}>
                {Object.keys(periodFactors).map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={14} />
            </label>
            <label>
              <span className="sr-only">Report branch</span>
              <select onChange={(event) => { setBranch(event.target.value); refreshReport(period, event.target.value); }} value={branch}>
                {Object.keys(branchFactors).map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={14} />
            </label>
          </div>
        )}
        description="View detailed reports and business analytics"
        title="Reports & Analytics"
      />

      <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

      <section aria-label="Business performance summary" className={styles.metrics}>
        <MetricCard label="Total Sales" trend={12} value={view.metrics.sales} />
        <MetricCard label="Total Purchase" trend={-5} value={view.metrics.purchase} />
        <MetricCard label="Gross Profit" trend={18} value={view.metrics.profit} />
        <MetricCard label="Total Expenses" trend={8} value={view.metrics.expenses} />
      </section>

      <div className={styles.analyticsGrid}>
        <Card className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2>Sales vs Purchase</h2>
            <div className={styles.legend}><span><i className={styles.salesKey} />Sales</span><span><i className={styles.purchaseKey} />Purchase</span></div>
          </div>
          <div aria-label="Weekly sales versus purchase bar chart" className={styles.barChart} role="img">
            <div className={styles.yAxis}><span>2M</span><span>1.5M</span><span>1M</span><span>500K</span><span>0</span></div>
            <div className={styles.plot}>
              {view.weeks.map((week) => (
                <div className={styles.week} key={week.week}>
                  <div className={styles.barPair}>
                    <span className={styles.salesBar} style={{ height: `${Math.max(5, week.sales / chartMaximum * 100)}%` }} title={`Sales ${formatDashboardCurrency(week.sales)}`} />
                    <span className={styles.purchaseBar} style={{ height: `${Math.max(5, week.purchase / chartMaximum * 100)}%` }} title={`Purchase ${formatDashboardCurrency(week.purchase)}`} />
                  </div>
                  <span>{week.week}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className={styles.categoryCard}>
          <h2>Sales by Category</h2>
          <div className={styles.categoryContent}>
            <div aria-label="Sales split by jewellery category" className={styles.donut} role="img"><span>৳ {(Math.floor(view.metrics.sales / 1_000) / 100).toFixed(2)}L</span></div>
            <ul>{categorySales.map((item) => <li key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><strong>{item.value}%</strong></li>)}</ul>
          </div>
        </Card>

        <Card className={styles.productsCard}>
          <h2>Top Selling Products</h2>
          <div className={styles.tableScroller}>
            <table>
              <caption className="sr-only">Top selling jewellery products</caption>
              <thead><tr><th scope="col">#</th><th scope="col">Product Name</th><th scope="col">Qty Sold</th><th scope="col">Amount (৳)</th></tr></thead>
              <tbody>{view.products.map((product, index) => <tr key={product.id}><td>{index + 1}</td><td><strong>{product.name}</strong></td><td>{product.quantity}</td><td>{formatDashboardCurrency(product.amount)}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <Card className={styles.actionsCard}>
          <h2>Quick Actions</h2>
          <button onClick={() => printReport("PDF")} type="button"><FileDown aria-hidden="true" size={16} />Export PDF</button>
          <button onClick={() => { downloadReportCsv(scale); setMessage("Excel-compatible CSV report downloaded."); }} type="button"><FileSpreadsheet aria-hidden="true" size={16} />Export Excel</button>
          <button onClick={() => printReport("print")} type="button"><Printer aria-hidden="true" size={16} />Print Report</button>
          <button onClick={() => setScheduleOpen(true)} type="button"><CalendarClock aria-hidden="true" size={16} />Schedule Report</button>
        </Card>
      </div>

      {scheduleOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setScheduleOpen(false); }}>
          <Card aria-labelledby="schedule-report-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <div className={styles.modalHeader}>
              <div><h2 id="schedule-report-title">Schedule Report</h2><p>Deliver this report automatically by email.</p></div>
              <button aria-label="Close schedule report dialog" autoFocus onClick={() => setScheduleOpen(false)} type="button"><X aria-hidden="true" size={19} /></button>
            </div>
            <form onSubmit={scheduleReport}>
              <label><span>Frequency</span><select className="select" defaultValue="Weekly" name="frequency"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label>
              <label><span>Recipient Email</span><input className="field" defaultValue="admin@aarohanjewellery.com" name="recipient" required type="email" /></label>
              <label><span>First Delivery</span><input className="field" defaultValue="2025-05-01" name="date" required type="date" /></label>
              <div className={styles.modalActions}><button className="button" onClick={() => setScheduleOpen(false)} type="button">Cancel</button><button className="button button--primary" type="submit"><CheckCircle2 aria-hidden="true" size={15} />Schedule</button></div>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
