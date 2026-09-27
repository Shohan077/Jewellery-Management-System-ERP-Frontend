"use client";

import { useState, type FormEvent } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryDonutChart, SalesTrendChart } from "./reference-charts";
import styles from "./sales-report-screen.module.css";

type Metric = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  { label: "Total Sales", value: "৳ 2,45,80,000", trend: "+18.6%", icon: WalletCards },
  { label: "Total Invoice", value: "1,258", trend: "+12.4%", icon: FileText },
  { label: "Average Invoice", value: "৳ 19,552", trend: "+8.3%", icon: BarChart3 },
  { label: "Total Profit", value: "৳ 60,40,000", trend: "+24.8%", icon: TrendingUp },
];

const topSellingItems = [
  { item: "22K Gold Necklace", category: "Gold Jewellery", quantity: "158", weight: "325.250", sales: "৳ 68,50,000", profit: "৳ 16,25,000" },
  { item: "Gold Chain (22K)", category: "Gold Jewellery", quantity: "210", weight: "410.500", sales: "৳ 45,20,000", profit: "৳ 10,85,000" },
  { item: "Diamond Ring", category: "Diamond Jewellery", quantity: "95", weight: "48.120", sales: "৳ 28,40,000", profit: "৳ 8,40,000" },
  { item: "Gold Earrings", category: "Gold Jewellery", quantity: "320", weight: "185.750", sales: "৳ 22,10,000", profit: "৳ 4,90,000" },
  { item: "Silver Pendant", category: "Silver Jewellery", quantity: "410", weight: "210.300", sales: "৳ 10,30,000", profit: "৳ 2,05,000" },
] as const;

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <Card as="article" className={styles.metricCard}>
      <span className={styles.metricIcon}><Icon aria-hidden="true" size={17} strokeWidth={1.8} /></span>
      <span className={styles.metricContent}>
        <small>{metric.label}</small>
        <strong>{metric.value}</strong>
        <span><b>{metric.trend}</b> vs last month</span>
      </span>
    </Card>
  );
}

export function Reference52SalesReport() {
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [branch, setBranch] = useState("All Branch");
  const [salesPerson, setSalesPerson] = useState("All");
  const [reportType, setReportType] = useState("Summary");
  const [message, setMessage] = useState("");

  function viewReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Showing ${reportType.toLowerCase()} sales for ${branch}, ${dateRange}.`);
  }

  function resetFilters() {
    setDateRange("01/05/2025 - 31/05/2025");
    setBranch("All Branch");
    setSalesPerson("All");
    setReportType("Summary");
    setMessage("Report filters reset.");
  }

  function exportReport() {
    const headings = ["Item Name", "Category", "Quantity", "Total Weight (gm)", "Total Sales", "Profit"];
    const rows = topSellingItems.map((item) => [item.item, item.category, item.quantity, item.weight, item.sales, item.profit]);
    const csv = [headings, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sales-report-may-2025.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Sales report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <Card as="form" className={styles.filters} onSubmit={viewReport}>
        <label className={styles.dateField}>
          <span>Date Range</span>
          <span className={styles.control}><input aria-label="Sales report date range" onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays aria-hidden="true" size={14} /></span>
        </label>
        <label>
          <span>Branch</span>
          <select onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branch</option><option>Main Branch</option><option>Uttara Branch</option></select>
        </label>
        <label>
          <span>Sales Person</span>
          <select onChange={(event) => setSalesPerson(event.target.value)} value={salesPerson}><option>All</option><option>Arif Hossain</option><option>Nusrat Jahan</option></select>
        </label>
        <label>
          <span>Report Type</span>
          <select onChange={(event) => setReportType(event.target.value)} value={reportType}><option>Summary</option><option>Detailed</option><option>Profit</option></select>
        </label>
        <button className={styles.primaryButton} type="submit">View Report</button>
        <button className={styles.secondaryButton} onClick={resetFilters} type="button"><RotateCcw aria-hidden="true" size={13} />Reset</button>
      </Card>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <section aria-label="Sales report summary" className={styles.metrics}>
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className={styles.charts}>
        <SalesTrendChart className={styles.chartCard} compact title="Sales Trend" />
        <CategoryDonutChart className={styles.chartCard} compact title="Sales by Category" total="৳ 2,45,80,000" />
      </section>

      <Card className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <div><ShoppingBag aria-hidden="true" size={15} /><h2>Top Selling Items</h2></div>
          <button onClick={exportReport} type="button"><Download aria-hidden="true" size={13} />Export</button>
        </header>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Top selling items for May 2025</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Item Name</th><th scope="col">Category</th><th scope="col">Quantity</th><th scope="col">Total Weight (gm)</th><th scope="col">Total Sales (৳)</th><th scope="col">Profit (৳)</th></tr></thead>
            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={item.item}><td>{index + 1}</td><td><strong>{item.item}</strong></td><td>{item.category}</td><td>{item.quantity}</td><td>{item.weight}</td><td>{item.sales}</td><td>{item.profit}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
