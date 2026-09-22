"use client";

import { Download, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import { downloadAccountingCsv, formatAccountingMoney, profitTrend } from "./accounting-data";
import styles from "./accounting-suite.module.css";

const statementRows = [
  ["A. INCOME", ""], ["Sales", 3_210_000], ["Other Income", 35_000], ["Total Income (A)", 3_245_000],
  ["B. COST OF GOODS SOLD", ""], ["Purchase of Gold", 1_750_000], ["Making Charges", 185_000], ["Other Direct Costs", 50_000], ["Total COGS (B)", 1_985_000],
  ["GROSS PROFIT (A − B)", 1_260_000], ["C. OPERATING EXPENSES", ""], ["Rent", 150_000], ["Salaries", 210_000], ["Utilities", 45_000], ["Other Expenses", 60_000], ["Total Operating Expenses (C)", 465_000], ["NET PROFIT (A − B − C)", 795_000],
] as const;

export function AccountingProfitLoss() {
  const [from, setFrom] = useState("2025-04-01");
  const [to, setTo] = useState("2025-04-30");
  const [branch, setBranch] = useState("Main Branch");
  const [compare, setCompare] = useState("Previous Month");
  const [message, setMessage] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from > to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setMessage(`Profit & Loss refreshed for ${branch}, compared with ${compare}.`);
  }

  function exportReport() {
    downloadAccountingCsv("profit-loss-april-2025.csv", [["Particulars", "Amount"], ...statementRows.map(([label, amount]) => [label, amount])]);
    setMessage("Profit & Loss report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Profit &amp; Loss Report</h1><p>View profitability and business performance.</p></header>
      <Card as="form" className={`${styles.filters} ${styles.profitFilters}`} onSubmit={search}><label><span>From Date <b>*</b></span><input className="field" max={to} onChange={(event) => setFrom(event.target.value)} type="date" value={from} /></label><label><span>To Date <b>*</b></span><input className="field" min={from} onChange={(event) => setTo(event.target.value)} type="date" value={to} /></label><label><span>Branch</span><select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}><option>Main Branch</option><option>Uttara Branch</option><option>Chittagong Branch</option></select></label><label><span>Compare With</span><select className="select" onChange={(event) => setCompare(event.target.value)} value={compare}><option>Previous Month</option><option>Previous Quarter</option><option>Previous Year</option></select></label><button className={styles.primaryButton} type="submit"><Search size={15} />Search</button><button className={styles.outlineButton} onClick={exportReport} type="button"><Download size={15} />Export</button></Card>
      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
      <section className={styles.metrics}><Card><span>Total Income</span><strong className={styles.green}>₹ 32,45,000.00</strong></Card><Card><span>Cost of Goods Sold</span><strong className={styles.red}>₹ 19,85,000.00</strong></Card><Card><span>Operating Expenses</span><strong className={styles.purple}>₹ 4,65,000.00</strong></Card><Card><span>Net Profit</span><strong className={styles.green}>₹ 7,95,000.00</strong><small>24.49% Margin</small></Card></section>
      <section className={styles.profitLayout}>
        <Card className={styles.statement}><header><span>Particulars</span><span>Amount (₹)</span></header>{statementRows.map(([label, amount]) => { const section = label.startsWith("A.") || label.startsWith("B.") || label.startsWith("C."); const total = label.startsWith("Total") || label.startsWith("GROSS") || label.startsWith("NET"); return <div className={`${section ? styles.statementSection : ""} ${total ? styles.statementTotal : ""}`} key={label}><span>{label}</span><strong>{typeof amount === "number" ? formatAccountingMoney(amount).replace("₹ ", "") : ""}</strong></div>; })}</Card>
        <div className={styles.profitRight}>
          <Card className={styles.trendCard}><h2>Profit Trend (Monthly)</h2><div aria-label="Monthly net profit trend from 5.20 lakh in November 2024 to 7.95 lakh in April 2025" className={styles.chart} role="img"><div className={styles.bars}>{profitTrend.map((point) => <div className={styles.barColumn} key={point.month}><span>{point.value.toFixed(2)}</span><i style={{ height: `${point.value * 10}%` }} /><small>{point.month}</small></div>)}</div><svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 500 160"><polyline fill="none" points="35,93 120,70 205,78 290,54 375,43 465,27" stroke="#19964e" strokeWidth="4" /></svg></div><footer><i />Net Profit (₹ Lakhs)</footer></Card>
          <Card className={styles.reportSummary}><h2>Report Summary</h2><dl><div><dt>Gross Profit</dt><dd>₹ 12,60,000.00</dd></div><div><dt>Operating Profit</dt><dd>₹ 7,95,000.00</dd></div><div><dt>Net Profit Margin</dt><dd>24.49%</dd></div><div><dt>Comparison (vs Previous Month)</dt><dd className={styles.green}>+10.42% ↗</dd></div></dl></Card>
        </div>
      </section>
    </div>
  );
}

