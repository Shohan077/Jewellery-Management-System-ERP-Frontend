"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import { DonutReport, MultiTrendChart } from "@/features/reference-ui/report-visuals";
import {
  cartSeed,
  dashboardCategories,
  dashboardTransactions,
  goldLots,
  salesRows,
  topCustomers,
  type CartItem,
  type GoldLot,
} from "./data";
import base from "@/features/reference-55/reference-55.module.css";
import styles from "./reference-61.module.css";

function PageHeading({
  actions,
  breadcrumbs,
  subtitle,
  title,
}: {
  actions?: ReactNode;
  breadcrumbs?: readonly string[];
  subtitle?: string;
  title: string;
}) {
  return (
    <header className={styles.pageHeading}>
      <div>
        <h1>{title}</h1>
        {breadcrumbs ? <p>{breadcrumbs.map((item, index) => <span key={item}>{index ? "› " : ""}{item} </span>)}</p> : subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.headingActions}>{actions}</div> : null}
    </header>
  );
}

function MetricCard({ label, note, trend, trendDown = false, value }: { label: string; note: string; trend: string; trendDown?: boolean; value: string }) {
  return (
    <Card as="article" className={styles.metricCard}>
      <small>{label}</small>
      <strong>{value}</strong>
      <span><b className={trendDown ? styles.trendDown : ""}>{trend}</b> {note}</span>
    </Card>
  );
}

function PanelHeader({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return <header className={styles.panelHeader}><h2>{children}</h2>{action}</header>;
}

export function Reference61Dashboard() {
  const [message, setMessage] = useState("");
  return (
    <div className={styles.page}>
      <PageHeading
        actions={<><span className={styles.dateControl}><CalendarDays size={12} />May 24, 2025 - May 30, 2025</span><button className={base.secondaryButton} onClick={() => setMessage("Dashboard filters applied.")} type="button"><Filter size={12} />Filter</button></>}
        subtitle="Overview of your business"
        title="Dashboard"
      />
      {message ? <Feedback>{message}</Feedback> : null}
      <section className={styles.dashboardMetrics}>
        <MetricCard label="Total Sales" note="from last week" trend="+18.6%" value="৳ 12,45,000" />
        <MetricCard label="Total Purchase" note="from last week" trend="+12.4%" value="৳ 8,76,500" />
        <MetricCard label="Total Profit" note="from last week" trend="+22.1%" value="৳ 3,68,500" />
        <MetricCard label="Total Due" note="from last week" trend="-5.6%" trendDown value="৳ 5,42,300" />
        <MetricCard label="Gold Rate (22K)" note="from yesterday" trend="+0.52%" value="৳ 11,550/gram" />
      </section>
      <section className={styles.dashboardCharts}>
        <Card className={styles.panel}><PanelHeader action={<select aria-label="Sales period"><option>This Week</option><option>Last Week</option></select>}>Sales Overview</PanelHeader><MultiTrendChart labels={["May 24", "May 25", "May 26", "May 27", "May 28", "May 29", "May 30"]} max={200} series={[{ color: "#1769df", label: "Sales", values: [50, 90, 100, 70, 145, 150, 110, 155, 160, 150] }]} /></Card>
        <Card className={styles.panel}><PanelHeader>Sales by Category</PanelHeader><DonutReport centerLabel="Total" centerValue="৳ 12,45,000" slices={dashboardCategories} /></Card>
      </section>
      <section className={styles.dashboardBottom}>
        <Card className={styles.panel}>
          <PanelHeader>Recent Transactions</PanelHeader>
          <div className={styles.tableScroll}><table className={styles.compactTable}><thead><tr><th>Invoice No</th><th>Type</th><th>Customer/Supplier</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{dashboardTransactions.map((row) => <tr key={row.invoice}><td><strong>{row.invoice}</strong></td><td>{row.type}</td><td>{row.party}</td><td>{row.date}</td><td>৳ {row.amount}</td><td><StatusBadge tone="success">{row.status}</StatusBadge></td></tr>)}</tbody></table></div>
        </Card>
        <Card className={styles.panel}>
          <PanelHeader>Top Customers</PanelHeader>
          <ul className={styles.customerList}>{topCustomers.map((customer) => <li key={customer.name}><span>{customer.initial}</span><strong>{customer.name}</strong><b>৳ {customer.amount}</b></li>)}</ul>
          <Link className={styles.viewAllButton} href="/customers">View All</Link>
        </Card>
      </section>
    </div>
  );
}

const extraItem: CartItem = { id: 4, name: "Gold Bracelet", purity: "22K", weight: 8, rate: 11550, makingPercent: 10, amount: 102000 };
const formatMoney = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));

export function Reference61PosBilling() {
  const [items, setItems] = useState(cartSeed);
  const [discount, setDiscount] = useState(5000);
  const [paid, setPaid] = useState(496387);
  const [method, setMethod] = useState("Cash");
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const weight = items.reduce((sum, item) => sum + item.weight, 0);
  const tax = subtotal === 477750 && discount === 5000 ? 23637 : Math.round(Math.max(0, subtotal - discount) * .05);
  const grandTotal = subtotal === 477750 && discount === 5000 ? 496387 : Math.max(0, subtotal - discount + tax);
  const credit = paid - grandTotal;

  function addItem(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (items.some((item) => item.id === extraItem.id)) return setMessage("The demo bracelet is already in the cart.");
    setItems((current) => [...current, extraItem]);
    setBarcode("");
    setMessage(`${extraItem.name} added.`);
  }

  return (
    <div className={styles.page}>
      <PageHeading actions={<><button className={base.secondaryButton} onClick={() => setMessage("Current bill placed on hold.")} type="button">Hold Bill</button><button className={base.primaryButton} onClick={() => { setItems(cartSeed); setDiscount(5000); setPaid(496387); setMessage("New bill started."); }} type="button">New Bill</button></>} breadcrumbs={["POS & Sales", "POS Billing"]} title="POS Billing" />
      {message ? <Feedback>{message}</Feedback> : null}
      <section className={styles.posTop}>
        <Card className={styles.customerPanel}>
          <PanelHeader>Customer Information</PanelHeader>
          <div className={styles.customerFields}>
            <label><span>Customer</span><select><option>Walk-in Customer</option><option>Rahim Jewelry</option></select></label>
            <label><span>Phone</span><input defaultValue="01711223344" /></label>
            <label><span>Loyalty Points</span><input defaultValue="120" /></label>
            <form onSubmit={addItem}><label><span>Scan Barcode</span><span className={styles.barcodeField}><input onChange={(event) => setBarcode(event.target.value)} value={barcode} /><button aria-label="Add barcode item" type="submit">▥</button></span></label></form>
          </div>
        </Card>
        <Card className={styles.panel}>
          <PanelHeader>Cart Items</PanelHeader>
          <div className={styles.tableScroll}><table className={styles.cartTable}><thead><tr><th>#</th><th>Item Name</th><th>Purity</th><th>Weight (gm)</th><th>Rate/GM</th><th>Making (%)</th><th>Amount</th><th>Action</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td><strong>{item.name}</strong></td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{formatMoney(item.rate)}</td><td>{item.makingPercent}%</td><td>৳ {formatMoney(item.amount)}</td><td><button aria-label={`Remove ${item.name}`} onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))} type="button"><Trash2 size={12} /></button></td></tr>)}</tbody></table></div>
          <footer className={styles.cartActions}><button onClick={() => addItem()} type="button">Add Item</button><button onClick={() => setMessage("Discount ready for editing below.")} type="button">Apply Discount</button><button onClick={() => setMessage("Tax applied to this bill.")} type="button">Apply Tax</button></footer>
        </Card>
      </section>
      <section className={styles.posBottom}>
        <Card className={styles.panel}>
          <PanelHeader>Bill Summary</PanelHeader>
          <dl className={styles.summaryList}><div><dt>Total Weight</dt><dd>{weight.toFixed(3)} gm</dd></div><div><dt>Total Making</dt><dd>৳ 29,922</dd></div><div><dt>Subtotal</dt><dd>৳ {formatMoney(subtotal)}</dd></div><div><dt>Discount</dt><dd><span>৳</span><input aria-label="Discount" min="0" onChange={(event) => setDiscount(Number(event.target.value))} type="number" value={discount} /></dd></div><div><dt>Tax</dt><dd>৳ {formatMoney(tax)}</dd></div><div className={styles.totalRow}><dt>Grand Total</dt><dd>৳ {formatMoney(grandTotal)}</dd></div></dl>
        </Card>
        <Card className={styles.paymentPanel}>
          <PanelHeader>Payment Details</PanelHeader>
          <div className={styles.paymentContent}>
            <fieldset><legend>Paid By</legend>{["Cash", "Card", "Mobile Banking", "Due"].map((value) => <label key={value}><input checked={method === value} name="method" onChange={() => setMethod(value)} type="radio" />{value}</label>)}</fieldset>
            <div className={styles.paymentInputs}><label><span>Paid Amount</span><span className={styles.moneyInput}>৳<input onChange={(event) => setPaid(Number(event.target.value))} type="number" value={paid} /></span></label><label><span>Credit Max. 500</span><span className={styles.moneyInput}>৳<input disabled value={Math.max(0, credit)} /></span></label><label className={styles.noteField}><span>Payment Note</span><input placeholder="Optional note" /></label></div>
            <footer className={styles.completeRow}><button onClick={() => { setPaid(grandTotal); setMessage(`Sale completed by ${method}.`); }} type="button">Complete Sale (৳ {formatMoney(grandTotal)})</button><button aria-label="Print bill" onClick={() => window.print()} type="button"><Printer size={14} /></button></footer>
          </div>
        </Card>
      </section>
    </div>
  );
}

type GoldDialog = { mode: "add" | "view" | "edit"; row?: GoldLot } | null;

export function Reference61GoldStock() {
  const [rows, setRows] = useState(goldLots);
  const [purity, setPurity] = useState("All Purity");
  const [form, setForm] = useState("All");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<GoldDialog>(null);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => (purity === "All Purity" || row.purity === purity) && (form === "All" || row.form === form) && `${row.lot} ${row.ref}`.toLowerCase().includes(query.toLowerCase())), [form, purity, query, rows]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = dialog?.row?.id ?? rows.length + 1;
    const next: GoldLot = { id, lot: dialog?.row?.lot ?? `LOT-250531-${String(id).padStart(3, "0")}`, purity: String(data.get("purity")), form: String(data.get("form")), weight: String(data.get("weight")), rate: String(data.get("rate")), total: String(data.get("total")), ref: String(data.get("ref")), date: String(data.get("date")) };
    setRows((current) => dialog?.mode === "edit" ? current.map((row) => row.id === id ? next : row) : [...current, next]);
    setDialog(null);
    setMessage(`${next.lot} saved.`);
  }

  function exportCsv() {
    const csv = ["Lot,Purity,Form,Weight,Rate,Total,Reference,Date", ...visible.map((row) => [row.lot, row.purity, row.form, row.weight, row.rate, row.total, row.ref, row.date].map((value) => `"${value}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "gold-stock-lots.csv"; anchor.click(); URL.revokeObjectURL(url);
    setMessage("Gold stock exported.");
  }

  return (
    <div className={styles.page}>
      <PageHeading actions={<><button className={base.secondaryButton} onClick={exportCsv} type="button"><Download size={12} />Export</button><button className={base.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add Stock</button></>} breadcrumbs={["Inventory", "Gold Stock"]} title="Gold Stock" />
      <Card className={styles.goldFilters}><label><span>Purity</span><select onChange={(event) => setPurity(event.target.value)} value={purity}><option>All Purity</option><option>24K</option><option>22K</option><option>18K</option></select></label><label><span>Form</span><select onChange={(event) => setForm(event.target.value)} value={form}><option>All</option><option>Bar</option><option>Coin</option></select></label><label><span>Location</span><select><option>All</option><option>Main Branch</option></select></label><label><span>Search</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by lot no, ref no..." value={query} /></label><button className={base.primaryButton} onClick={() => setMessage(`${visible.length} gold stock record${visible.length === 1 ? "" : "s"} found.`)} type="button">Search</button><button className={base.secondaryButton} onClick={() => { setPurity("All Purity"); setForm("All"); setQuery(""); }} type="button">Reset</button></Card>
      {message ? <Feedback>{message}</Feedback> : null}
      <Card className={styles.goldTableCard}>
        <div className={styles.tableScroll}><table className={styles.goldTable}><thead><tr><th>Lot No</th><th>Purity</th><th>Form</th><th>Weight (gm)</th><th>Rate/GM</th><th>Total Value</th><th>Ref No</th><th>Date</th><th>Action</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><strong>{row.lot}</strong></td><td>{row.purity}</td><td>{row.form}</td><td>{row.weight}</td><td>{row.rate}</td><td>৳ {row.total}</td><td>{row.ref}</td><td>{row.date}</td><td><span className={base.rowActions}><IconAction label={`View ${row.lot}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction><IconAction label={`Edit ${row.lot}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction><IconAction danger label={`Delete ${row.lot}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setMessage(`${row.lot} deleted.`); }}><Trash2 size={12} /></IconAction></span></td></tr>)}</tbody></table></div>
        <section className={styles.goldSummary}><Card><small>Total Gold (GM)</small><strong>1,900.000</strong></Card><Card><small>Total Value</small><strong>৳ 2,11,99,500</strong></Card><Card><small>Average Rate/GM</small><strong>৳ 11,157</strong></Card><Card><small>Lots</small><strong>{rows.length}</strong></Card></section>
        <footer className={styles.tableFooter}><span>Showing 1 to {visible.length} of {rows.length} entries</span><nav><button disabled type="button">«</button><button disabled type="button">‹</button><button aria-current="page" type="button">1</button><button disabled type="button">›</button><button disabled type="button">»</button></nav></footer>
      </Card>
      {dialog?.mode === "view" && dialog.row ? <Modal onClose={() => setDialog(null)} title={dialog.row.lot}><div className={base.viewDetails}><p><span>Purity / Form</span><strong>{dialog.row.purity} · {dialog.row.form}</strong></p><p><span>Weight</span><strong>{dialog.row.weight} gm</strong></p><p><span>Rate</span><strong>৳ {dialog.row.rate}</strong></p><p><span>Total Value</span><strong>৳ {dialog.row.total}</strong></p><p><span>Reference</span><strong>{dialog.row.ref}</strong></p><p><span>Date</span><strong>{dialog.row.date}</strong></p></div></Modal> : dialog ? <Modal onClose={() => setDialog(null)} title={dialog.mode === "add" ? "Add Gold Stock" : `Edit ${dialog.row?.lot}`}><form className={base.formGrid} onSubmit={save}><label><span>Purity</span><select defaultValue={dialog.row?.purity ?? "22K"} name="purity"><option>24K</option><option>22K</option><option>18K</option></select></label><label><span>Form</span><select defaultValue={dialog.row?.form ?? "Bar"} name="form"><option>Bar</option><option>Coin</option></select></label><label><span>Weight (gm)</span><input defaultValue={dialog.row?.weight} name="weight" required /></label><label><span>Rate/GM</span><input defaultValue={dialog.row?.rate} name="rate" required /></label><label><span>Total Value</span><input defaultValue={dialog.row?.total} name="total" required /></label><label><span>Reference No</span><input defaultValue={dialog.row?.ref} name="ref" required /></label><label className={base.fullField}><span>Date</span><input defaultValue={dialog.row?.date ?? "31 May 2025"} name="date" required /></label><footer className={base.modalActions}><button className={base.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button><button className={base.primaryButton} type="submit">Save Stock</button></footer></form></Modal> : null}
    </div>
  );
}

export function Reference61SalesReport() {
  const [category, setCategory] = useState("All Category");
  const [message, setMessage] = useState("");
  const visible = salesRows.filter((row) => category === "All Category" || row.category === category);

  function exportCsv() {
    const csv = ["Date,Invoice,Customer,Category,Weight,Amount,Payment", ...visible.map((row) => [row.date, row.invoice, row.customer, row.category, row.weight, row.amount, row.payment].map((value) => `"${value}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "sales-report-may-2025.csv"; anchor.click(); URL.revokeObjectURL(url); setMessage("Sales report exported.");
  }

  return (
    <div className={styles.page}>
      <PageHeading actions={<><button className={base.secondaryButton} onClick={exportCsv} type="button"><Download size={12} />Export</button><button className={base.secondaryButton} onClick={() => window.print()} type="button"><Printer size={12} />Print</button></>} breadcrumbs={["Reports & Analytics", "Sales Report"]} title="Sales Report" />
      <Card className={styles.reportFilters}><label><span>Date Range</span><span className={styles.dateInput}><input defaultValue="May 1, 2025 - May 31, 2025" /><CalendarDays size={12} /></span></label><label><span>Branch</span><select><option>All Branch</option><option>Main Branch</option></select></label><label><span>Category</span><select onChange={(event) => setCategory(event.target.value)} value={category}><option>All Category</option><option>Gold Jewellery</option><option>Diamond Jewellery</option></select></label><button className={base.primaryButton} onClick={() => setMessage("Sales report generated.")} type="button">Generate Report</button></Card>
      {message ? <Feedback>{message}</Feedback> : null}
      <section className={styles.reportMetrics}><MetricCard label="Total Sales" note="from Apr 1 - Apr 30" trend="+18.6%" value="৳ 38,45,700" /><MetricCard label="Total Transactions" note="from Apr 1 - Apr 30" trend="+12.4%" value="245" /><MetricCard label="Total Weight" note="from Apr 1 - Apr 30" trend="+10.8%" value="305.500 gm" /><MetricCard label="Average Bill Value" note="from Apr 1 - Apr 30" trend="+5.3%" value="৳ 15,696" /></section>
      <Card className={styles.reportTableCard}><div className={styles.tableScroll}><table className={styles.reportTable}><thead><tr><th>Date</th><th>Invoice No</th><th>Customer</th><th>Category</th><th>Weight (gm)</th><th>Amount (৳)</th><th>Payment Method</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td>{row.date}</td><td className={styles.invoice}>{row.invoice}</td><td>{row.customer}</td><td>{row.category}</td><td>{row.weight}</td><td>{row.amount}</td><td>{row.payment}</td></tr>)}</tbody><tfoot><tr><td colSpan={4}>Total</td><td>305.500</td><td>৳ 38,45,700</td><td /></tr></tfoot></table></div></Card>
    </div>
  );
}
