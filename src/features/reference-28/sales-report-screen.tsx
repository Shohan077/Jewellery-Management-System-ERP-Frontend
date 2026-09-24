"use client";

import {
  ArrowUp,
  Eye,
  FileDown,
  FileSpreadsheet,
  PackageCheck,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
  ShoppingBag,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { salesCategories, salesTransactions, salesTrend, type SalesTransaction } from "./reference-data";
import styles from "./reference-pages.module.css";

type SalesFilters = {
  dateFrom: string;
  dateTo: string;
  branch: string;
  customer: string;
};

const initialFilters: SalesFilters = {
  dateFrom: "2025-04-01",
  dateTo: "2025-04-30",
  branch: "All",
  customer: "All",
};

const money = (value: number) => `৳ ${Math.round(value).toLocaleString("en-IN")}`;

function downloadSalesCsv(rows: SalesTransaction[]) {
  const csv = [
    ["Invoice No", "Date", "Customer Name", "Item(s)", "Total Amount", "Payment Status"],
    ...rows.map((row) => [row.invoice, row.date, row.customer, row.item, row.amount, row.status]),
  ].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sales-report-april-2025.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function SalesReportScreen() {
  const [draft, setDraft] = useState<SalesFilters>(initialFilters);
  const [filters, setFilters] = useState<SalesFilters>(initialFilters);
  const [selectedSale, setSelectedSale] = useState<SalesTransaction | null>(null);
  const [message, setMessage] = useState("");

  const filteredTransactions = useMemo(() => salesTransactions.filter((transaction) => (
    transaction.date >= filters.dateFrom
    && transaction.date <= filters.dateTo
    && (filters.branch === "All" || transaction.branch === filters.branch)
    && (filters.customer === "All" || transaction.customerType === filters.customer)
  )), [filters]);

  const reportScale = useMemo(() => {
    const start = new Date(`${filters.dateFrom}T00:00:00`).getTime();
    const end = new Date(`${filters.dateTo}T00:00:00`).getTime();
    const days = Number.isFinite(start) && Number.isFinite(end) ? Math.max(1, Math.round((end - start) / 86_400_000) + 1) : 30;
    const dateScale = Math.min(1, days / 30);
    const branchScale = filters.branch === "All" ? 1 : filters.branch === "Main Branch" ? .48 : .26;
    const customerScale = filters.customer === "All" ? 1 : filters.customer === "Retail" ? .67 : .33;
    return dateScale * branchScale * customerScale;
  }, [filters]);

  const totalSales = Math.round(845_000 * reportScale);
  const invoices = Math.max(filteredTransactions.length ? 1 : 0, Math.round(56 * reportScale));
  const itemsSold = Math.round(320 * reportScale);
  const averageOrder = invoices ? Math.round(totalSales / invoices) : 0;
  const maxTrend = Math.max(...salesTrend);
  const chartPoints = salesTrend.map((value, index) => ({
    x: 8 + (index / (salesTrend.length - 1)) * 88,
    y: 88 - ((value * reportScale) / maxTrend) * 72,
  }));

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.dateFrom > draft.dateTo) {
      setMessage("Date From must be earlier than Date To.");
      return;
    }
    setFilters(draft);
    setMessage("Sales report filters applied.");
  }

  function resetFilters() {
    setDraft(initialFilters);
    setFilters(initialFilters);
    setMessage("Sales report filters reset.");
  }

  function printReport(kind: "PDF" | "Print") {
    setMessage(kind === "PDF" ? "Choose Save as PDF in the print dialog." : "Print dialog opened.");
    window.print();
  }

  return (
    <div className={`${styles.page} ${styles.salesPage}`}>
      <PageHeader
        action={(
          <div className={styles.reportActions}>
            <button className={styles.headerButton} onClick={() => printReport("PDF")} type="button"><FileDown aria-hidden="true" size={14} />Export PDF</button>
            <button className={styles.headerButton} onClick={() => { downloadSalesCsv(filteredTransactions); setMessage("Sales report exported for Excel."); }} type="button"><FileSpreadsheet aria-hidden="true" size={14} />Export Excel</button>
            <button className={styles.primaryButton} onClick={() => printReport("Print")} type="button"><Printer aria-hidden="true" size={14} />Print</button>
          </div>
        )}
        description="Home  ›  Reports & Analytics  ›  Sales Report"
        title="Sales Report"
      />

      <Card className={styles.filterCard}>
        <form className={styles.salesFilters} onSubmit={applyFilters}>
          <label><span>Date From</span><input onChange={(event) => setDraft((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={draft.dateFrom} /></label>
          <label><span>Date To</span><input min={draft.dateFrom} onChange={(event) => setDraft((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={draft.dateTo} /></label>
          <label><span>Branch</span><select onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))} value={draft.branch}><option>All</option><option>Main Branch</option><option>Gulshan Branch</option><option>Uttara Branch</option></select></label>
          <label><span>Customer</span><select onChange={(event) => setDraft((current) => ({ ...current, customer: event.target.value }))} value={draft.customer}><option>All</option><option>Retail</option><option>Wholesale</option></select></label>
          <button className={styles.primaryButton} type="submit"><Search aria-hidden="true" size={14} />Search</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw aria-hidden="true" size={14} />Reset</button>
        </form>
      </Card>

      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>

      <section aria-label="Sales overview" className={styles.metricGrid}>
        <Card className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.greenIcon}`}><WalletCards aria-hidden="true" /></span><div><small>Total Sales</small><strong>{money(totalSales)}</strong><p><ArrowUp aria-hidden="true" />12% <span>vs last month</span></p></div></Card>
        <Card className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.cyanIcon}`}><ReceiptText aria-hidden="true" /></span><div><small>Total Invoices</small><strong>{invoices}</strong><p><ArrowUp aria-hidden="true" />8% <span>vs last month</span></p></div></Card>
        <Card className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.purpleIcon}`}><PackageCheck aria-hidden="true" /></span><div><small>Total Items Sold</small><strong>{itemsSold} pcs</strong><p><ArrowUp aria-hidden="true" />19% <span>vs last month</span></p></div></Card>
        <Card className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.orangeIcon}`}><ShoppingBag aria-hidden="true" /></span><div><small>Average Order Value</small><strong>{money(averageOrder)}</strong><p><ArrowUp aria-hidden="true" />10% <span>vs last month</span></p></div></Card>
      </section>

      <section className={styles.chartGrid}>
        <Card className={styles.chartCard}>
          <h2>Sales Trend (Daily)</h2>
          <div aria-label="Daily sales line chart for April 2025" className={styles.lineChart} role="img">
            <div className={styles.yAxis}><span>200K</span><span>150K</span><span>100K</span><span>50K</span><span>0</span></div>
            <div className={styles.linePlot}>
              <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs><linearGradient id="sales-area-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1388e6" stopOpacity=".2" /><stop offset="1" stopColor="#1388e6" stopOpacity="0" /></linearGradient></defs>
                <path d={`M ${chartPoints.map((point) => `${point.x} ${point.y}`).join(" L ")} L 96 92 L 8 92 Z`} fill="url(#sales-area-gradient)" />
                <polyline fill="none" points={chartPoints.map((point) => `${point.x},${point.y}`).join(" ")} stroke="#087ed7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                {chartPoints.map((point, index) => <circle cx={point.x} cy={point.y} fill="white" key={index} r="1.45" stroke="#087ed7" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />)}
              </svg>
              <div className={styles.xAxis}><span>1 Apr</span><span>5 Apr</span><span>10 Apr</span><span>15 Apr</span><span>20 Apr</span><span>25 Apr</span><span>30 Apr</span></div>
            </div>
          </div>
        </Card>

        <Card className={styles.chartCard}>
          <h2>Sales by Category</h2>
          <div className={styles.donutLayout}>
            <div aria-label="Sales by product category" className={styles.salesDonut} role="img"><span><strong>৳{(totalSales / 100_000).toFixed(2)}L</strong><small>Total Sales</small></span></div>
            <ul className={styles.categoryLegend}>{salesCategories.map((category) => <li key={category.label}><i style={{ background: category.color }} /><span>{category.label}</span><strong>{category.value}%</strong></li>)}</ul>
          </div>
        </Card>
      </section>

      <Card className={styles.tableCard}>
        <h2>Recent Sales Transactions</h2>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <caption className="sr-only">Recent sales transactions for the selected filters</caption>
            <thead><tr><th>SL</th><th>Invoice No</th><th>Date</th><th>Customer Name</th><th>Item(s)</th><th>Total Amount (৳)</th><th>Payment Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => <tr key={transaction.invoice}><td>{index + 1}</td><td>{transaction.invoice}</td><td>{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${transaction.date}T00:00:00`))}</td><td>{transaction.customer}</td><td>{transaction.item}</td><td>{transaction.amount.toLocaleString("en-IN")}</td><td><span className={`${styles.statusBadge} ${transaction.status === "Paid" ? styles.paid : styles.due}`}>{transaction.status}</span></td><td><button className={styles.viewButton} onClick={() => setSelectedSale(transaction)} type="button"><Eye aria-hidden="true" size={12} />View</button></td></tr>)}
              {!filteredTransactions.length ? <tr><td className={styles.emptyRow} colSpan={8}>No sales transactions match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedSale ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedSale(null); }}>
          <section aria-labelledby="sale-details-title" aria-modal="true" className={styles.modal} role="dialog">
            <header><div><h2 id="sale-details-title">Invoice Details</h2><p>{selectedSale.invoice}</p></div><button aria-label="Close invoice details" onClick={() => setSelectedSale(null)} type="button"><X aria-hidden="true" size={18} /></button></header>
            <dl className={styles.detailsList}><div><dt>Customer</dt><dd>{selectedSale.customer}</dd></div><div><dt>Date</dt><dd>{selectedSale.date}</dd></div><div><dt>Item</dt><dd>{selectedSale.item}</dd></div><div><dt>Branch</dt><dd>{selectedSale.branch}</dd></div><div><dt>Total</dt><dd>{money(selectedSale.amount)}</dd></div><div><dt>Status</dt><dd><span className={`${styles.statusBadge} ${selectedSale.status === "Paid" ? styles.paid : styles.due}`}>{selectedSale.status}</span></dd></div></dl>
            <footer><button className={styles.primaryButton} onClick={() => setSelectedSale(null)} type="button">Close</button></footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
