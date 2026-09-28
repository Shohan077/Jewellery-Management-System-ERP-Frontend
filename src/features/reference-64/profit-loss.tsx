"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Feedback } from "@/features/reference-55/shared";
import base from "@/features/reference-55/reference-55.module.css";
import { expenseAmounts, expenseSlices, netMarginValues, profitLossRows, profitTrendSeries, topExpenses } from "./data";
import { BreakdownDonut, LineChart, PanelHeading, ResponsiveTable, Sparkline } from "./shared";
import styles from "./reference-64.module.css";

export function Reference64ProfitLoss() {
  const [period, setPeriod] = useState("May 1, 2024 - May 18, 2024");
  const [comparison, setComparison] = useState("Previous Period");
  const [message, setMessage] = useState("");

  function exportReport() {
    const rows = [
      ["Particulars", "This Period", "Previous Period", "Change", "Change %"],
      ...profitLossRows.map((row) => [row.label, row.current, row.previous, row.change, row.percent]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "profit-loss-may-2024.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Profit & Loss report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <div className={styles.reportToolbar}>
        <label><span>Select Period</span><select onChange={(event) => setPeriod(event.target.value)} value={period}><option>May 1, 2024 - May 18, 2024</option><option>April 1, 2024 - April 30, 2024</option><option>January 1, 2024 - May 18, 2024</option></select></label>
        <label><span>Compare With</span><select onChange={(event) => setComparison(event.target.value)} value={comparison}><option>Previous Period</option><option>Previous Month</option><option>Previous Year</option></select></label>
        <button className={base.primaryButton} onClick={() => setMessage(`Report generated for ${period}, compared with ${comparison.toLowerCase()}.`)} type="button">Generate Report</button>
        <span className={styles.toolbarSpacer} />
        <button className={base.exportButton} onClick={exportReport} type="button"><Download size={12} />Export</button>
      </div>

      {message ? <Feedback>{message}</Feedback> : null}

      <section className={styles.profitTop}>
        <Card className={styles.profitTableCard}>
          <PanelHeading>Profit &amp; Loss Summary</PanelHeading>
          <ResponsiveTable label="Profit and loss summary" minWidth={650}>
            <thead><tr><th>Particulars</th><th className={styles.numeric}>This Period (৳)</th><th className={styles.numeric}>Previous Period (৳)</th><th className={styles.numeric}>Change (৳)</th><th className={styles.numeric}>Change %</th></tr></thead>
            <tbody>{profitLossRows.map((row) => <tr className={row.emphasis === "strong" ? styles.strongRow : row.emphasis === "medium" ? styles.mediumRow : undefined} key={row.label}><td>{row.label}</td><td className={styles.numeric}>{row.current}</td><td className={styles.numeric}>{row.previous}</td><td className={styles.numeric}>{row.change}</td><td className={`${styles.numeric} ${styles.positive}`}>{row.percent}</td></tr>)}</tbody>
          </ResponsiveTable>
        </Card>

        <Card className={styles.chartCard}>
          <PanelHeading>Profit Trend</PanelHeading>
          <LineChart labels={["May 1", "May 4", "May 7", "May 10", "May 13", "May 16", "May 18"]} max={6} series={profitTrendSeries} ticks={[{ value: 6, label: "6L" }, { value: 4.5, label: "4.5L" }, { value: 3, label: "3L" }, { value: 1.5, label: "1.5L" }, { value: 0, label: "0" }]} />
        </Card>
      </section>

      <section className={styles.profitBottom}>
        <Card className={styles.expenseCard}>
          <PanelHeading meta="(This Period)">Expense Breakdown</PanelHeading>
          <BreakdownDonut centerLabel="Total Expenses" centerValue="৳ 2,45,000" items={expenseSlices.map((slice) => ({ ...slice, detail: `(৳ ${expenseAmounts[slice.label]})` }))} />
        </Card>

        <Card className={styles.topExpenses}>
          <PanelHeading>Top Expenses</PanelHeading>
          <ol>{topExpenses.map(([label, value], index) => <li key={label}><b>{index + 1}</b><span>{label}</span><strong>৳ {value}</strong></li>)}</ol>
        </Card>

        <Card className={styles.marginCard}>
          <PanelHeading>Net Profit Margin</PanelHeading>
          <div className={styles.marginValue}><strong>29.51%</strong><span>(Net Profit / Net Sales)</span></div>
          <Sparkline values={netMarginValues} />
          <div className={styles.sparkLabels}><span>May 1</span><span>May 4</span><span>May 7</span><span>May 10</span><span>May 13</span><span>May 16</span></div>
        </Card>
      </section>
    </div>
  );
}

