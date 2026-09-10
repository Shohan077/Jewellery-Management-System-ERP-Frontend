"use client";

import { ArrowDown, ArrowUp, CalendarDays, Download, FileSpreadsheet, Printer, RefreshCw } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import reportStyles from "./sales-report.module.css";
import styles from "./profit-loss-report.module.css";

const months = [
  { month: "Jan", income: 1.45, expense: .72, gross: .78, profit: .52 },
  { month: "Feb", income: 1.55, expense: .68, gross: .82, profit: .57 },
  { month: "Mar", income: 1.72, expense: .84, gross: .92, profit: .64 },
  { month: "Apr", income: 1.08, expense: .67, gross: .76, profit: .48 },
  { month: "May", income: 1.48, expense: .77, gross: .86, profit: .59 },
  { month: "Jun", income: 1.59, expense: .62, gross: .95, profit: .66 },
] as const;

const expenseCategories = [
  { label: "Purchase", value: 45, color: "#c89424" }, { label: "Labour", value: 20, color: "#357fd2" },
  { label: "Rent", value: 10, color: "#7656d6" }, { label: "Utilities", value: 8, color: "#24af69" },
  { label: "Marketing", value: 7, color: "#ed7d42" }, { label: "Others", value: 10, color: "#8a919b" },
] as const;

const formatCurrency = (value: number) => `৳ ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

export function ProfitLossReport() {
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-30");
  const [branch, setBranch] = useState("All Branches");
  const [scale, setScale] = useState(1);
  const [message, setMessage] = useState("");

  const statement = useMemo(() => ({ sales: 2_845_600 * scale, cogs: 1_420_300 * scale, gross: 1_425_300 * scale, operating: 400_000 * scale, net: 1_025_300 * scale }), [scale]);
  const metrics = [
    { label: "Total Income", value: statement.sales, trend: "12%", direction: "up" },
    { label: "Total Expense", value: 1_820_300 * scale, trend: "5%", direction: "down" },
    { label: "Net Profit", value: statement.net, trend: "12%", direction: "up" },
    { label: "Profit Margin", value: 36, trend: "4%", direction: "up", percent: true },
  ] as const;

  function generateReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScale(branch === "All Branches" ? 1 : branch === "Main Branch" ? .62 : .38);
    setMessage(`Profit and loss report generated for ${dateFrom} to ${dateTo}, ${branch}.`);
  }

  function exportExcel() {
    const csv = `Particulars,Amount (BDT)\nTotal Sales,${Math.round(statement.sales)}\nCost of Goods Sold,${Math.round(statement.cogs)}\nGross Profit,${Math.round(statement.gross)}\nOperating Expenses,${Math.round(statement.operating)}\nNet Profit,${Math.round(statement.net)}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "profit-loss-report.csv"; anchor.click(); URL.revokeObjectURL(url);
    setMessage("Profit and loss spreadsheet exported.");
  }

  return (
    <div className={reportStyles.page}>
      <PageHeader description="View your business profit and loss statement" title="Profit & Loss Report" />
      <form className={styles.filters} onSubmit={generateReport}>
        <fieldset><legend>Date Range</legend><CalendarDays size={16} /><label><span className="sr-only">Start date</span><input max={dateTo} onChange={(event) => setDateFrom(event.target.value)} type="date" value={dateFrom} /></label><span>–</span><label><span className="sr-only">End date</span><input min={dateFrom} onChange={(event) => setDateTo(event.target.value)} type="date" value={dateTo} /></label></fieldset>
        <label><span>Branch</span><select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branches</option><option>Main Branch</option><option>Other Branches</option></select></label>
        <button className="button button--primary" type="submit"><RefreshCw size={15} />Generate Report</button>
      </form>
      <p aria-live="polite" className={message ? reportStyles.message : "sr-only"}>{message}</p>
      <section aria-label="Profit and loss summary" className={reportStyles.metrics}>
        {metrics.map((metric) => <Card className={reportStyles.metricCard} key={metric.label}><div className={reportStyles.metricTop}><span>{metric.label}</span>{metric.direction === "down" ? <ArrowDown size={17} /> : <ArrowUp size={17} />}</div><strong>{"percent" in metric && metric.percent ? `${metric.value.toFixed(1)}%` : formatCurrency(metric.value)}</strong><p className={metric.direction === "down" ? styles.negativeTrend : ""}>{metric.direction === "down" ? <ArrowDown size={12} /> : <ArrowUp size={12} />}{metric.trend} <span>vs previous period</span></p></Card>)}
      </section>
      <section className={reportStyles.charts}>
        <Card className={reportStyles.dailyCard}><h2>Monthly Profit & Loss Trend</h2><div aria-label="Grouped chart of income, expenses, gross profit and net profit from January to June" className={styles.groupChart} role="img"><div className={styles.yAxis}><span>2M</span><span>1.5M</span><span>1M</span><span>500K</span><span>0</span></div><div className={styles.groupPlot}>{months.map((month) => <div className={styles.monthGroup} key={month.month}><div className={styles.bars}><i style={{ height: `${month.income / 2 * 100}%` }} /><i style={{ height: `${month.expense / 2 * 100}%` }} /><i style={{ height: `${month.gross / 2 * 100}%` }} /><i style={{ height: `${month.profit / 2 * 100}%` }} /></div><span>{month.month}</span></div>)}</div></div><div className={styles.chartLegend}><span><i className={styles.incomeKey} />Income</span><span><i className={styles.expenseKey} />Expense</span><span><i className={styles.grossKey} />Gross</span><span><i className={styles.profitKey} />Profit</span></div></Card>
        <Card className={reportStyles.categoryCard}><h2>Expense Breakdown</h2><div className={reportStyles.categoryContent}><div aria-label="Expense categories: Purchase 45%, Labour 20%, Rent 10%, Utilities 8%, Marketing 7%, Others 10%" className={styles.expenseDonut} role="img"><span><strong>৳ {(18.2 * scale).toFixed(2)}L</strong><small>Total expense</small></span></div><ul className={reportStyles.legend}>{expenseCategories.map((category) => <li key={category.label}><i style={{ background: category.color }} /><span>{category.label}</span><strong>{category.value}%</strong></li>)}</ul></div></Card>
      </section>
      <section className={styles.lowerGrid}>
        <Card className={styles.statement}><h2>Profit & Loss Statement</h2><dl><div><dt>Total Sales</dt><dd>{formatCurrency(statement.sales)}</dd></div><div><dt>Less: Cost of Goods Sold</dt><dd>{formatCurrency(statement.cogs)}</dd></div><div><dt>Gross Profit</dt><dd>{formatCurrency(statement.gross)}</dd></div><div><dt>Less: Operating Expenses</dt><dd>{formatCurrency(statement.operating)}</dd></div><div className={styles.net}><dt>Net Profit</dt><dd>{formatCurrency(statement.net)}</dd></div></dl></Card>
        <Card className={styles.quickActions}><h2>Quick Actions</h2><button className="button" onClick={() => { setMessage("Print dialog opened; choose Save as PDF to export."); window.print(); }} type="button"><Download size={15} />Export PDF</button><button className="button" onClick={exportExcel} type="button"><FileSpreadsheet size={15} />Export Excel</button><button className="button" onClick={() => window.print()} type="button"><Printer size={15} />Print Report</button></Card>
      </section>
    </div>
  );
}
