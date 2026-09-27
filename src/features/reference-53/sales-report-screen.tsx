"use client";

import { useState, type FormEvent } from "react";
import { BarChart3, CalendarDays, Download, FileText, ShoppingBag, TrendingUp, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryDonutChart, SalesTrendChart, type CategoryDatum } from "@/features/reference-52/reference-charts";
import { MetricCard, Notice } from "./shared";
import styles from "./sales-report-screen.module.css";

const categories: readonly CategoryDatum[] = [
  { label: "Gold Jewellery", value: 62 },
  { label: "Diamond Jewellery", value: 18 },
  { label: "Silver Jewellery", value: 12 },
  { label: "Others", value: 8 },
];

const rows = [
  { item: "Gold Necklace", category: "Gold Jewellery", quantity: 158, weight: "325.250", sales: "৳ 68,50,000", profit: "৳ 16,25,000" },
  { item: "Gold Chain (22K)", category: "Gold Jewellery", quantity: 210, weight: "410.500", sales: "৳ 45,20,000", profit: "৳ 10,85,000" },
  { item: "Diamond Ring", category: "Diamond Jewellery", quantity: 95, weight: "48.120", sales: "৳ 28,40,000", profit: "৳ 8,40,000" },
  { item: "Gold Earrings", category: "Gold Jewellery", quantity: 320, weight: "185.750", sales: "৳ 22,10,000", profit: "৳ 4,90,000" },
  { item: "Silver Pendant", category: "Silver Jewellery", quantity: 410, weight: "210.300", sales: "৳ 10,30,000", profit: "৳ 2,05,000" },
] as const;

export function Reference53SalesReport() {
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [branch, setBranch] = useState("All Branches");
  const [salesPerson, setSalesPerson] = useState("All");
  const [reportType, setReportType] = useState("Summary");
  const [message, setMessage] = useState("");

  function showReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Showing ${reportType.toLowerCase()} sales for ${branch}, ${dateRange}${salesPerson === "All" ? "" : `, ${salesPerson}`}.`);
  }

  function exportCsv() {
    const csvRows = [
      ["Item Name", "Category", "Quantity", "Total Weight (gm)", "Total Sales", "Profit"],
      ...rows.map((row) => [row.item, row.category, String(row.quantity), row.weight, row.sales, row.profit]),
    ];
    const url = URL.createObjectURL(new Blob([csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-report-31-may-2025.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Sales report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <Card as="form" className={styles.filters} onSubmit={showReport}>
        <label className={styles.dateField}><span>Date Range</span><span className={styles.dateControl}><input onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays size={13} /></span></label>
        <label><span>Branch</span><select onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branches</option><option>Main Branch</option><option>Uttara Branch</option></select></label>
        <label><span>Sales Person</span><select onChange={(event) => setSalesPerson(event.target.value)} value={salesPerson}><option>All</option><option>Arif Hossain</option><option>Nusrat Jahan</option></select></label>
        <label><span>Report Type</span><select onChange={(event) => setReportType(event.target.value)} value={reportType}><option>Summary</option><option>Detailed</option><option>Profit</option></select></label>
        <button className={styles.primaryButton} type="submit">View Report</button>
        <button className={styles.exportButton} onClick={exportCsv} type="button"><Download size={13} />Export</button>
      </Card>

      {message ? <Notice>{message}</Notice> : null}

      <section aria-label="Sales report metrics" className={styles.metrics}>
        <MetricCard icon={<WalletCards size={17} />} label="Total Sales" trend="+16.6%" value="৳ 2,78,45,600" />
        <MetricCard icon={<FileText size={17} />} label="Total Invoice" trend="+11.2%" value="1,584" />
        <MetricCard icon={<BarChart3 size={17} />} label="Average Invoice" trend="+6.5%" value="৳ 17,562" />
        <MetricCard icon={<TrendingUp size={17} />} label="Total Profit" trend="+23.7%" value="৳ 68,12,450" />
      </section>

      <section className={styles.charts}>
        <SalesTrendChart className={styles.chartCard} compact title="Sales Trend" />
        <CategoryDonutChart categories={categories} className={styles.chartCard} compact title="Sales by Category" total="৳ 2,78,45,600" />
      </section>

      <Card className={styles.tableCard}>
        <header><div><ShoppingBag size={14} /><h2>Top Selling Items</h2></div><button onClick={exportCsv} type="button"><Download size={12} />Export</button></header>
        <div className={styles.tableScroller}><table><caption className="sr-only">Top selling products for May 2025</caption><thead><tr><th>#</th><th>Item Name</th><th>Category</th><th>Quantity</th><th>Total Weight (gm)</th><th>Total Sales (৳)</th><th>Profit (৳)</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row.item}><td>{index + 1}</td><td><strong>{row.item}</strong></td><td>{row.category}</td><td>{row.quantity}</td><td>{row.weight}</td><td>{row.sales}</td><td>{row.profit}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
