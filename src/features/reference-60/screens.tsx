"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  Banknote,
  Boxes,
  CircleDollarSign,
  Gem,
  HandCoins,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Feedback, StatusBadge } from "@/features/reference-55/shared";
import { DonutReport, MultiTrendChart } from "@/features/reference-ui/report-visuals";
import {
  dashboardSlices,
  lowStockItems,
  posSeed,
  recentSales,
  salesDetails,
  salesSlices,
  stockRecords,
  stockSlices,
  type PosItem,
} from "./data";
import styles from "./reference-60.module.css";

type Accent = "blue" | "green" | "orange" | "violet" | "pink";

function MetricTile({
  accent = "blue",
  icon,
  label,
  note,
  trend,
  trendDown = false,
  value,
}: {
  accent?: Accent;
  icon?: ReactNode;
  label: string;
  note?: string;
  trend?: string;
  trendDown?: boolean;
  value: string;
}) {
  return (
    <Card as="article" className={styles.metricTile}>
      {icon ? <span className={`${styles.metricIcon} ${styles[accent]}`}>{icon}</span> : null}
      <span className={styles.metricCopy}>
        <small>{label}</small>
        <strong>{value}</strong>
        {trend ? <span><b className={trendDown ? styles.down : ""}>{trend}</b> {note ?? "vs last period"}</span> : note ? <span>{note}</span> : null}
      </span>
    </Card>
  );
}

function PanelTitle({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return <header className={styles.panelTitle}><h2>{children}</h2>{action}</header>;
}

function MiniSalesTable({ title = "Recent Sales" }: { title?: string }) {
  return (
    <Card className={styles.panel}>
      <PanelTitle>{title}</PanelTitle>
      <div className={styles.tableScroll}>
        <table className={styles.miniTable}>
          <thead><tr><th>Invoice No</th><th>Date</th><th>Customer</th><th>Total Amount</th><th>Payment Method</th><th>Status</th></tr></thead>
          <tbody>{recentSales.map((row) => <tr key={row.invoice}><td className={styles.linkCell}>{row.invoice}</td><td>{row.date}</td><td>{row.customer}</td><td>৳ {row.amount}</td><td>{row.payment}</td><td><StatusBadge tone="success">{row.status}</StatusBadge></td></tr>)}</tbody>
        </table>
      </div>
    </Card>
  );
}

export function Reference60Dashboard() {
  return (
    <div className={styles.page}>
      <section className={styles.dashboardMetrics}>
        <MetricTile accent="green" icon={<CircleDollarSign size={18} />} label="Total Sales" note="vs last week" trend="+12.5%" value="৳ 12,45,000" />
        <MetricTile icon={<ShoppingBag size={18} />} label="Total Purchase" note="vs last week" trend="+8.3%" value="৳ 8,75,000" />
        <MetricTile accent="green" icon={<TrendingUp size={18} />} label="Total Profit" note="vs last week" trend="+15.2%" value="৳ 3,70,000" />
        <MetricTile accent="orange" icon={<Gem size={18} />} label="Gold Rate (22K)" note="vs yesterday" trend="-0.35%" trendDown value="৳ 7,950" />
        <MetricTile accent="violet" icon={<Boxes size={18} />} label="Total Stock Value" value="৳ 28,50,000" />
        <MetricTile accent="orange" icon={<UserRound size={18} />} label="Customer Due" value="৳ 6,25,000" />
        <MetricTile accent="pink" icon={<HandCoins size={18} />} label="Supplier Due" value="৳ 3,40,000" />
        <MetricTile accent="green" icon={<Banknote size={18} />} label="Cash in Hand" value="৳ 2,15,000" />
      </section>

      <section className={styles.dashboardCharts}>
        <Card className={styles.panel}>
          <PanelTitle action={<select aria-label="Sales range" defaultValue="This Week"><option>This Week</option><option>Last Week</option></select>}>Sales Overview</PanelTitle>
          <MultiTrendChart labels={["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"]} max={500} series={[{ color: "#1575ea", label: "Sales", values: [170, 300, 210, 400, 460, 210, 320, 210] }]} />
        </Card>
        <Card className={styles.panel}>
          <PanelTitle>Top Selling Categories</PanelTitle>
          <DonutReport centerLabel="Sales Mix" centerValue="100%" slices={dashboardSlices} />
        </Card>
      </section>

      <section className={styles.dashboardBottom}>
        <MiniSalesTable />
        <Card className={styles.panel}>
          <PanelTitle>Low Stock Alerts</PanelTitle>
          <ul className={styles.alertList}>{lowStockItems.map((item) => <li key={item.item}><span className={styles.alertIcon}><AlertCircle size={14} /></span><span><strong>{item.item}</strong><small>Stock: {item.stock}</small></span><i aria-label="Low stock" /></li>)}</ul>
        </Card>
      </section>
    </div>
  );
}

const extraPosItem: PosItem = { id: 4, name: "Gold Bracelet 22K", purity: "22K", weight: 6.750, rate: 7950, making: 900, amount: 54563 };
const money = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));

export function Reference60PosBilling() {
  const [items, setItems] = useState(posSeed);
  const [query, setQuery] = useState("");
  const [discount, setDiscount] = useState(2000);
  const [paid, setPaid] = useState(148447);
  const [payment, setPayment] = useState("Cash");
  const [message, setMessage] = useState("");

  const totals = useMemo(() => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const vat = Math.round(Math.max(0, totalAmount - discount) * .05);
    const grandTotal = Math.max(0, totalAmount - discount + vat);
    return { totalWeight, totalAmount, vat, grandTotal, due: Math.max(0, grandTotal - paid) };
  }, [discount, items, paid]);

  function addItem(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (items.some((item) => item.id === extraPosItem.id)) {
      setMessage("The matching demo item is already on this bill.");
      return;
    }
    setItems((current) => [...current, extraPosItem]);
    setQuery("");
    setMessage(`${extraPosItem.name} added.`);
  }

  function completeSale() {
    if (!items.length) return setMessage("Add an item before completing the sale.");
    setPaid(totals.grandTotal);
    setMessage(`Sale completed by ${payment} for ৳ ${money(totals.grandTotal)}.`);
  }

  return (
    <div className={`${styles.page} ${styles.posPage}`}>
      {message ? <Feedback>{message}</Feedback> : null}
      <section className={styles.posGrid}>
        <div className={styles.posMain}>
          <Card className={styles.customerForm}>
            <label><span>Customer</span><select><option>Walk-in Customer</option><option>Rahim Khan</option></select></label>
            <label><span>Phone</span><input placeholder="Enter phone number" /></label>
            <label className={styles.salesPerson}><span>Sales Person</span><select><option>Select Sales Person</option><option>Abdul Karim</option></select></label>
          </Card>

          <Card className={styles.itemsPanel}>
            <form className={styles.itemSearch} onSubmit={addItem}><label><span>Select Items</span><span><input onChange={(event) => setQuery(event.target.value)} placeholder="Scan barcode or search item..." value={query} /><Search size={13} /></span></label></form>
            <div className={styles.tableScroll}><table className={styles.posTable}><thead><tr><th>#</th><th>Item Name</th><th>Purity</th><th>Weight</th><th>Rate (৳)</th><th>Making (৳)</th><th>Amount (৳)</th><th>Action</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td><strong>{item.name}</strong></td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{money(item.rate)}</td><td>{money(item.making)}</td><td>{money(item.amount)}</td><td><button aria-label={`Remove ${item.name}`} onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))} type="button"><Trash2 size={12} /></button></td></tr>)}</tbody></table></div>
            <footer className={styles.itemActions}><span><button onClick={() => addItem()} type="button">Add Item</button><button onClick={() => setMessage("Discount is ready to edit in the bill summary.")} type="button">Apply Discount</button><button onClick={() => setMessage("Current offer applied.")} type="button">Apply Offer</button></span><button onClick={() => { setItems([]); setMessage("Cart cleared."); }} type="button">Clear Cart</button></footer>
          </Card>
          <MiniSalesTable title="Recent Invoices" />
        </div>

        <Card className={styles.billPanel}>
          <PanelTitle>Bill Summary</PanelTitle>
          <dl className={styles.billSummary}>
            <div><dt>Total Weight</dt><dd>{totals.totalWeight.toFixed(3)} gm</dd></div>
            <div><dt>Total Amount</dt><dd>৳ {money(totals.totalAmount)}</dd></div>
            <div><dt>Discount</dt><dd><span className={styles.inlineMoney}>৳ <input aria-label="Discount" min="0" onChange={(event) => setDiscount(Number(event.target.value))} type="number" value={discount} /></span></dd></div>
            <div><dt>Making Charge</dt><dd>৳ 0</dd></div>
            <div><dt>Tax (VAT 5%)</dt><dd>৳ {money(totals.vat)}</dd></div>
            <div className={styles.grandTotal}><dt>Grand Total</dt><dd>৳ {money(totals.grandTotal)}</dd></div>
            <div><dt>Paid Amount</dt><dd><span className={styles.inlineMoney}>৳ <input aria-label="Paid amount" min="0" onChange={(event) => setPaid(Number(event.target.value))} type="number" value={paid} /></span></dd></div>
            <div className={styles.due}><dt>Due Amount</dt><dd>৳ {money(totals.due)}</dd></div>
          </dl>
          <div className={styles.paymentMethods}><strong>Payment Method</strong><div>{["Cash", "Card", "bKash", "Nagad", "Bank"].map((method) => <button aria-pressed={payment === method} key={method} onClick={() => setPayment(method)} type="button">{method}</button>)}</div></div>
          <button className={styles.completeButton} onClick={completeSale} type="button">✓ Complete Sale</button>
          <div className={styles.billActions}><button onClick={() => setMessage("Bill held for later.")} type="button">Hold Bill</button><button onClick={() => setMessage("Sale cancelled.")} type="button">Cancel</button></div>
        </Card>
      </section>
    </div>
  );
}

export function Reference60StockOverview() {
  const [category, setCategory] = useState("All Categories");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => stockRecords.filter((row) => (category === "All Categories" || row.category === category) && `${row.sku} ${row.item}`.toLowerCase().includes(query.toLowerCase())), [category, query]);

  return (
    <div className={styles.page}>
      <Card className={styles.stockToolbar}><select aria-label="Category" onChange={(event) => setCategory(event.target.value)} value={category}><option>All Categories</option><option>Gold Jewellery</option><option>Diamond Jewellery</option><option>Silver Jewellery</option><option>Raw Material</option></select><select aria-label="Branch"><option>Main Branch</option><option>Uttara Branch</option></select><label><span className="sr-only">Search stock</span><span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by item name or SKU..." value={query} /><Search size={13} /></span></label></Card>
      <section className={styles.fiveMetrics}>
        <MetricTile label="Total Stock Items" note="All Items" value="1,256" />
        <MetricTile label="Total Stock Value" note="Current Value" value="৳ 28,50,000" />
        <MetricTile label="Gold Stock" note="Market Value" value="845.350 gm" />
        <MetricTile label="Diamond Stock" note="Total Pieces" value="325 Pcs" />
        <MetricTile label="Low Stock Items" note="Reorder Soon" value="23" />
      </section>
      <Card className={styles.panel}>
        <PanelTitle>Stock List</PanelTitle>
        <div className={styles.tableScroll}><table className={styles.stockTable}><thead><tr><th>SKU</th><th>Item Name</th><th>Category</th><th>Purity</th><th>Weight/Qty</th><th>Unit</th><th>Rate (৳)</th><th>Total Value (৳)</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td className={styles.sku}>{row.sku}</td><td><strong>{row.item}</strong></td><td>{row.category}</td><td>{row.purity}</td><td>{row.quantity}</td><td>{row.unit}</td><td>{row.rate}</td><td>{row.total}</td><td><StatusBadge tone={row.status === "In Stock" ? "success" : "danger"}>{row.status}</StatusBadge></td></tr>)}</tbody></table></div>
      </Card>
      <section className={styles.stockBottom}>
        <Card className={styles.panel}><PanelTitle>Stock Value Summary</PanelTitle><DonutReport centerLabel="Total Value" centerValue="৳ 28.50L" slices={stockSlices} /></Card>
        <Card className={styles.panel}><PanelTitle>Low Stock Items</PanelTitle><div className={styles.tableScroll}><table className={styles.lowTable}><thead><tr><th>Item Name</th><th>Current Stock</th><th>Minimum Stock</th><th>Status</th></tr></thead><tbody>{lowStockItems.slice(0, 3).map((row) => <tr key={row.item}><td>{row.item}</td><td>{row.stock}</td><td>{row.minimum}</td><td><StatusBadge tone="danger">Low Stock</StatusBadge></td></tr>)}</tbody></table></div><Link className={styles.viewLowButton} href="/inventory/alerts">View All Low Stock Items</Link></Card>
      </section>
    </div>
  );
}

export function Reference60SalesReport() {
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState("Daily");
  return (
    <div className={styles.page}>
      <Card className={styles.reportToolbar}><label><span className="sr-only">Date range</span><select><option>May 1, 2024 – May 18, 2024</option></select></label><label><span className="sr-only">Branch</span><select><option>Main Branch</option><option>All Branches</option></select></label></Card>
      <section className={styles.fiveMetrics}>
        <MetricTile label="Total Sales" trend="+18.6%" value="৳ 18,75,000" />
        <MetricTile label="Total Orders" trend="+12.3%" value="235" />
        <MetricTile label="Average Order Value" trend="+5.8%" value="৳ 7,979" />
        <MetricTile label="Total Profit" trend="+15.4%" value="৳ 4,50,000" />
        <MetricTile label="Total Customers" trend="+10.2%" value="168" />
      </section>
      <section className={styles.reportCharts}>
        <Card className={styles.panel}><PanelTitle action={<select aria-label="Chart period" onChange={(event) => setPeriod(event.target.value)} value={period}><option>Daily</option><option>Weekly</option></select>}>Sales Trend</PanelTitle><MultiTrendChart labels={["May 1", "May 4", "May 7", "May 10", "May 13", "May 16"]} max={500} series={[{ color: "#1575ea", label: `${period} Sales`, values: [150, 140, 350, 160, 230, 130, 450, 300, 200, 200, 250, 400, 240, 220] }]} /></Card>
        <Card className={styles.panel}><PanelTitle>Sales by Category</PanelTitle><DonutReport centerLabel="Total Sales" centerValue="৳ 18.75L" slices={salesSlices} /></Card>
      </section>
      <Card className={styles.panel}>
        <PanelTitle>Sales Details</PanelTitle>
        <div className={styles.tableScroll}><table className={styles.salesTable}><thead><tr><th>Date</th><th>Invoice No</th><th>Customer</th><th>Category</th><th>Total Amount (৳)</th><th>Payment Method</th><th>Status</th></tr></thead><tbody>{salesDetails.map((row) => <tr key={row.id}><td>{row.date}</td><td className={styles.linkCell}>{row.invoice}</td><td>{row.customer}</td><td>{row.category}</td><td>৳ {row.amount}</td><td>{row.payment}</td><td><StatusBadge tone="success">{row.status}</StatusBadge></td></tr>)}</tbody></table></div>
        <footer className={styles.salesFooter}><span>Showing 1 to 5 of 235 entries</span><nav aria-label="Sales report pages"><button disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} type="button">‹</button>{[1, 2, 3, 4, 5].map((value) => <button aria-current={page === value ? "page" : undefined} key={value} onClick={() => setPage(value)} type="button">{value}</button>)}<span>…</span><button onClick={() => setPage(47)} type="button">47</button><button disabled={page === 47} onClick={() => setPage(Math.min(47, page + 1))} type="button">›</button></nav></footer>
      </Card>
    </div>
  );
}
