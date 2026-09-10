"use client";

import { ArrowUp, CalendarDays, FileBarChart2, ReceiptText, TrendingUp, WalletCards, type LucideIcon } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./sales-report.module.css";

const dailySales = [
  62, 118, 94, 168, 132, 158, 86, 136, 104, 128,
  119, 143, 131, 151, 124, 146, 155, 137, 162, 149,
  171, 184, 153, 193, 166, 226, 148, 181, 159, 132,
] as const;

const categories = [
  { label: "Necklace", value: 28, color: "#c89424" },
  { label: "Ring", value: 22, color: "#358bd5" },
  { label: "Earring", value: 18, color: "#7656d6" },
  { label: "Bracelet", value: 15, color: "#21b878" },
  { label: "Chain", value: 10, color: "#ef7a45" },
  { label: "Others", value: 7, color: "#8b929c" },
] as const;

const topProducts = [
  { name: "Gold Necklace (GN-001)", category: "Necklace", quantity: 28, total: 280_000 },
  { name: "Gold Ring (GR-002)", category: "Ring", quantity: 46, total: 195_000 },
  { name: "Diamond Earring (DE-003)", category: "Earring", quantity: 32, total: 172_000 },
  { name: "Gold Chain (GC-005)", category: "Chain", quantity: 25, total: 145_000 },
  { name: "Gold Bracelet (GB-004)", category: "Bracelet", quantity: 18, total: 120_000 },
] as const;

const formatCurrency = (value: number) => `৳ ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

type Metric = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <Card as="article" className={styles.metricCard}>
      <div className={styles.metricTop}>
        <span>{metric.label}</span>
        <Icon aria-hidden="true" size={18} />
      </div>
      <strong>{metric.value}</strong>
      <p><ArrowUp aria-hidden="true" size={12} /> {metric.trend} <span>vs previous period</span></p>
    </Card>
  );
}

export function SalesReport() {
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-30");
  const [branch, setBranch] = useState("All Branches");
  const [customer, setCustomer] = useState("All Customers");
  const [appliedScale, setAppliedScale] = useState(1);
  const [message, setMessage] = useState("");

  const metrics = useMemo<Metric[]>(() => [
    { label: "Total Sales", value: formatCurrency(1_248_500 * appliedScale), trend: "12%", icon: WalletCards },
    { label: "Total Invoices", value: Math.round(358 * appliedScale).toLocaleString("en-US"), trend: "8%", icon: ReceiptText },
    { label: "Average Invoice Value", value: formatCurrency(3_486 * appliedScale), trend: "12%", icon: TrendingUp },
    { label: "Total Profit", value: formatCurrency(215_600 * appliedScale), trend: "10%", icon: FileBarChart2 },
  ], [appliedScale]);

  const scaledDailySales = useMemo(
    () => dailySales.map((value) => Math.round(value * appliedScale)),
    [appliedScale],
  );

  function generateReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const branchScale = branch === "All Branches" ? 1 : branch === "Main Branch" ? 0.72 : 0.28;
    const customerScale = customer === "All Customers" ? 1 : customer === "VIP Customers" ? 0.46 : 0.54;
    setAppliedScale(branchScale * customerScale);
    setMessage(`Report generated for ${dateFrom} to ${dateTo}, ${branch}, ${customer}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader description="View and analyze your sales performance" title="Sales Report" />

      <form className={styles.filters} onSubmit={generateReport}>
        <fieldset className={styles.dateRange}>
          <legend>Date Range</legend>
          <CalendarDays aria-hidden="true" size={16} />
          <label>
            <span className="sr-only">Start date</span>
            <input max={dateTo} onChange={(event) => setDateFrom(event.target.value)} required type="date" value={dateFrom} />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            <span className="sr-only">End date</span>
            <input min={dateFrom} onChange={(event) => setDateTo(event.target.value)} required type="date" value={dateTo} />
          </label>
        </fieldset>
        <label className={styles.filterField}>
          <span>Branch</span>
          <select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}>
            <option>All Branches</option>
            <option>Main Branch</option>
            <option>Gulshan Branch</option>
          </select>
        </label>
        <label className={styles.filterField}>
          <span>Customer</span>
          <select className="select" onChange={(event) => setCustomer(event.target.value)} value={customer}>
            <option>All Customers</option>
            <option>VIP Customers</option>
            <option>Regular Customers</option>
          </select>
        </label>
        <button className="button button--primary" type="submit">
          <FileBarChart2 aria-hidden="true" size={16} />
          Generate Report
        </button>
      </form>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <section aria-label="Sales report totals" className={styles.metrics}>
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className={styles.charts}>
        <Card aria-labelledby="daily-sales-title" className={styles.dailyCard}>
          <h2 id="daily-sales-title">Daily Sales Trend</h2>
          <div
            aria-label="Daily sales for 1 to 30 April 2025; peak sales occurred on 26 April"
            className={styles.barChart}
            role="img"
          >
            <div aria-hidden="true" className={styles.yLabels}>
              <span>250K</span><span>200K</span><span>150K</span><span>100K</span><span>50K</span><span>0</span>
            </div>
            <div aria-hidden="true" className={styles.bars}>
              {scaledDailySales.map((value, index) => (
                <i key={index} style={{ height: `${Math.max(4, (value / 250) * 100)}%` }} />
              ))}
              <div className={styles.xLabels}>
                <span>1 Apr</span><span>5 Apr</span><span>10 Apr</span><span>15 Apr</span><span>20 Apr</span><span>25 Apr</span><span>30 Apr</span>
              </div>
            </div>
          </div>
        </Card>

        <Card aria-labelledby="category-sales-title" className={styles.categoryCard}>
          <h2 id="category-sales-title">Sales by Category</h2>
          <div className={styles.categoryContent}>
            <div
              aria-label="Sales split: Necklace 28%, Ring 22%, Earring 18%, Bracelet 15%, Chain 10%, Others 7%"
              className={styles.donut}
              role="img"
            >
              <span><strong>৳ {(12.48 * appliedScale).toFixed(2)}L</strong><small>Total sales</small></span>
            </div>
            <ul aria-label="Category legend" className={styles.legend}>
              {categories.map((category) => (
                <li key={category.label}>
                  <i style={{ background: category.color }} />
                  <span>{category.label}</span>
                  <strong>{category.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <Card className={styles.tableCard}>
        <h2>Top Selling Products</h2>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Five top-selling products for the selected sales period</caption>
            <thead>
              <tr><th scope="col">#</th><th scope="col">Product Name</th><th scope="col">Category</th><th scope="col">Quantity Sold</th><th scope="col">Total Amount (৳)</th></tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.name}>
                  <td>{index + 1}</td><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{product.quantity}</td><td>{formatCurrency(product.total * appliedScale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
