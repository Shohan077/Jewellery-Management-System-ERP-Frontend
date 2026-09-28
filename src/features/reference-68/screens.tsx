"use client";

import { useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import {
  customerMetrics,
  customerRows,
  customerTabs,
  karigarMetrics,
  karigarRows,
  karigarTabs,
  productionMetrics,
  productionOrders,
  productionTabs,
  stockSummary,
  valuationMetrics,
  valuationSlices,
  valuationTrend,
  type CustomerRow,
  type KarigarRow,
  type KarigarStatus,
  type Metric,
  type ProductionOrder,
  type ProductionStatus,
} from "./data";
import styles from "./reference-68.module.css";

function PageIntro({ action, breadcrumb, description, title }: { action?: ReactNode; breadcrumb: string; description: string; title: string }) {
  return (
    <header className={styles.pageIntro}>
      <div>
        <h1>{title}</h1>
        <span>{breadcrumb}</span>
        <p>{description}</p>
      </div>
      {action ? <div className={styles.pageActions}>{action}</div> : null}
    </header>
  );
}

function PrimaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button className={styles.primaryButton} onClick={onClick} type={type}>{children}</button>;
}

function SecondaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button className={styles.secondaryButton} onClick={onClick} type={type}>{children}</button>;
}

function MetricCards({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <section aria-label="Summary" className={styles.metrics} style={{ "--metric-count": metrics.length } as CSSProperties}>
      {metrics.map((metric) => (
        <Card as="article" className={styles.metricCard} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.trend ? <b className={metric.accent === "red" ? styles.negative : undefined}>{metric.trend}</b> : null}{metric.trend && metric.note ? " " : ""}{metric.note}</small>
        </Card>
      ))}
    </section>
  );
}

function Tabs<T extends string>({ active, label, onChange, tabs }: { active: T; label: string; onChange: (tab: T) => void; tabs: readonly T[] }) {
  return (
    <nav aria-label={label} className={styles.tabs}>
      {tabs.map((tab) => <button aria-current={tab === active ? "page" : undefined} key={tab} onClick={() => onChange(tab)} type="button">{tab}</button>)}
    </nav>
  );
}

function SearchField({ onChange, placeholder, value }: { onChange: (value: string) => void; placeholder: string; value: string }) {
  return <label className={styles.searchField}><Search aria-hidden="true" size={13}/><input aria-label={placeholder} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value}/></label>;
}

function FilterButton({ onClick }: { onClick: () => void }) {
  return <button className={styles.filterButton} onClick={onClick} type="button"><Filter size={12}/>Filters</button>;
}

function Pager({ current, last, onChange }: { current: number; last: number; onChange: (page: number) => void }) {
  const pageItems = last <= 5 ? Array.from({ length: last }, (_, index) => index + 1) : [1, 2, 3, 4, 5];
  return (
    <nav aria-label="Table pages" className={styles.pagination}>
      <button aria-label="Previous page" disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))} type="button"><ChevronLeft size={12}/></button>
      {pageItems.map((page) => <button aria-current={current === page ? "page" : undefined} key={page} onClick={() => onChange(page)} type="button">{page}</button>)}
      {last > 5 ? <><span>…</span><button aria-current={current === last ? "page" : undefined} onClick={() => onChange(last)} type="button">{last}</button></> : null}
      <button aria-label="Next page" disabled={current === last} onClick={() => onChange(Math.min(last, current + 1))} type="button"><ChevronRight size={12}/></button>
    </nav>
  );
}

function TableFooter({ current, last, onChange, shown, total }: { current: number; last: number; onChange: (page: number) => void; shown: number; total: number }) {
  return <footer className={styles.tableFooter}><span>Showing 1 to {shown} of {total.toLocaleString("en-IN")} entries</span><Pager current={current} last={last} onChange={onChange}/></footer>;
}

function statusTone(status: ProductionStatus | KarigarStatus) {
  if (status === "Completed" || status === "Active") return "success" as const;
  if (status === "In Progress") return "info" as const;
  if (status === "Cancelled") return "danger" as const;
  return "warning" as const;
}

function currency(value: FormDataEntryValue | null) {
  const amount = Number(value) || 0;
  return `৳ ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

function ProductionOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (order: ProductionOrder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: `PROD-${10057 + Math.floor(Math.random() * 100)}`,
      product: String(form.get("product")),
      karigar: String(form.get("karigar")),
      dueDate: String(form.get("dueDate")),
      quantity: Number(form.get("quantity")) || 1,
      unit: "Pcs",
      status: "In Progress",
      progress: 0,
    });
  }
  return (
    <Modal description="Create and assign a jewellery production order." onClose={onClose} title="New Production Order">
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Product</span><input name="product" placeholder="Gold Ring (22K)" required/></label>
        <label><span>Karigar</span><select defaultValue="Rashid Karigar" name="karigar"><option>Rashid Karigar</option><option>Jahirul Karigar</option><option>Salim Karigar</option><option>Monir Karigar</option></select></label>
        <label><span>Due date</span><input defaultValue="30 May 2025" name="dueDate" required/></label>
        <label><span>Quantity</span><input defaultValue="1" min="1" name="quantity" required type="number"/></label>
        <footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Create Order</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

function ProductionDetails({ onClose, onComplete, order }: { onClose: () => void; onComplete: () => void; order: ProductionOrder }) {
  return (
    <Modal description={`${order.product} · ${order.karigar}`} onClose={onClose} title={order.id}>
      <div className={styles.detailGrid}>
        <p><span>Due date</span><strong>{order.dueDate}</strong></p><p><span>Quantity</span><strong>{order.quantity} {order.unit}</strong></p>
        <p><span>Status</span><strong>{order.status}</strong></p><p><span>Progress</span><strong>{order.progress}%</strong></p>
      </div>
      {order.status === "In Progress" ? <footer className={styles.modalFooter}><SecondaryButton onClick={onClose}>Close</SecondaryButton><PrimaryButton onClick={onComplete}><CheckCircle2 size={13}/>Mark Completed</PrimaryButton></footer> : null}
    </Modal>
  );
}

export function Reference68ManufacturingProduction() {
  const [rows, setRows] = useState<ProductionOrder[]>([...productionOrders]);
  const [activeTab, setActiveTab] = useState<(typeof productionTabs)[number]>("All Orders");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All Status" | ProductionStatus>("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<"new" | ProductionOrder | null>(null);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => (activeTab === "All Orders" || row.status === activeTab) && (status === "All Status" || row.status === status) && `${row.id} ${row.product} ${row.karigar}`.toLowerCase().includes(query.trim().toLowerCase())), [activeTab, query, rows, status]);

  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={() => setDialog("new")}><Plus size={13}/>New Production Order</PrimaryButton>} breadcrumb="Home / Manufacturing / Production" description="Create and manage jewellery production orders and track progress." title="Manufacturing / Production"/>
      <MetricCards metrics={productionMetrics}/>
      <Card className={styles.dataCard}>
        <Tabs active={activeTab} label="Production order status" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={productionTabs}/>
        <div className={styles.tableToolbar}>
          <SearchField onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by order no, product, karigar..." value={query}/>
          {showFilters ? <select aria-label="Filter production status" onChange={(event) => setStatus(event.target.value as "All Status" | ProductionStatus)} value={status}><option>All Status</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select> : null}
          <FilterButton onClick={() => setShowFilters((value) => !value)}/>
        </div>
        <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.productionTable}`}><thead><tr><th>Order No</th><th>Product</th><th>Karigar</th><th>Due Date</th><th>Qty</th><th>Unit</th><th>Status</th><th>Progress</th><th>Actions</th></tr></thead><tbody>
          {visible.map((row) => <tr key={row.id}><td><b>{row.id}</b></td><td>{row.product}</td><td>{row.karigar}</td><td>{row.dueDate}</td><td>{row.quantity}</td><td>{row.unit}</td><td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td><td><div className={styles.progress}><i style={{ width: `${row.progress}%` }}/><span>{row.progress}%</span></div></td><td><span className={styles.rowActions}><IconAction label={`View ${row.id}`} onClick={() => setDialog(row)}><Eye size={12}/></IconAction><IconAction label={`Complete ${row.id}`} onClick={() => { setRows((items) => items.map((item) => item.id === row.id ? { ...item, status: "Completed", progress: 100 } : item)); setMessage(`${row.id} marked completed.`); }}><CheckCircle2 size={12}/></IconAction></span></td></tr>)}
          {!visible.length ? <tr><td className={styles.emptyCell} colSpan={9}>No matching production orders.</td></tr> : null}
        </tbody></table></div>
        <TableFooter current={page} last={23} onChange={setPage} shown={visible.length} total={156}/>
      </Card>
      <Feedback>{message}</Feedback>
      {dialog === "new" ? <ProductionOrderForm onClose={() => setDialog(null)} onSave={(order) => { setRows((items) => [order, ...items]); setDialog(null); setMessage(`${order.id} created.`); }}/>: dialog ? <ProductionDetails onClose={() => setDialog(null)} onComplete={() => { setRows((items) => items.map((item) => item.id === dialog.id ? { ...item, status: "Completed", progress: 100 } : item)); setDialog(null); setMessage(`${dialog.id} marked completed.`); }} order={dialog}/> : null}
    </div>
  );
}

function KarigarForm({ onClose, onSave }: { onClose: () => void; onSave: (row: KarigarRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    onSave({ id: `KAR-${1007 + Math.floor(Math.random() * 100)}`, name: String(form.get("name")), specialisation: String(form.get("specialisation")), phone: String(form.get("phone")), status: "Active", dueAmount: "৳ 0", onWork: false });
  }
  return <Modal description="Add a karigar profile and specialisation." onClose={onClose} title="Add Karigar"><form className={styles.modalForm} onSubmit={submit}><label><span>Name</span><input name="name" required/></label><label><span>Phone</span><input name="phone" placeholder="01700-000000" required/></label><label className={styles.fullField}><span>Specialisation</span><input name="specialisation" placeholder="Ring & Pendant" required/></label><footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Add Karigar</PrimaryButton></footer></form></Modal>;
}

function KarigarDetails({ onClose, row }: { onClose: () => void; row: KarigarRow }) {
  return <Modal description={row.specialisation} onClose={onClose} title={row.name}><div className={styles.detailGrid}><p><span>Karigar ID</span><strong>{row.id}</strong></p><p><span>Phone</span><strong>{row.phone}</strong></p><p><span>Status</span><strong>{row.status}</strong></p><p><span>Due Amount</span><strong>{row.dueAmount}</strong></p></div></Modal>;
}

export function Reference68KarigarManagement() {
  const [rows, setRows] = useState<KarigarRow[]>([...karigarRows]);
  const [activeTab, setActiveTab] = useState<(typeof karigarTabs)[number]>("All Karigar");
  const [query, setQuery] = useState(""); const [showFilters, setShowFilters] = useState(false); const [status, setStatus] = useState<"All Status" | KarigarStatus>("All Status"); const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<"new" | KarigarRow | null>(null); const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => (activeTab === "All Karigar" || (activeTab === "On Work" ? row.onWork : row.dueAmount !== "৳ 0")) && (status === "All Status" || row.status === status) && `${row.id} ${row.name} ${row.phone}`.toLowerCase().includes(query.trim().toLowerCase())), [activeTab, query, rows, status]);
  return <div className={styles.page}>
    <PageIntro action={<PrimaryButton onClick={() => setDialog("new")}><Plus size={13}/>Add Karigar</PrimaryButton>} breadcrumb="Home / Karigar Management" description="Manage karigar (artisan) profiles, work orders, and payments." title="Karigar Management"/>
    <MetricCards metrics={karigarMetrics}/>
    <Card className={styles.dataCard}><Tabs active={activeTab} label="Karigar status" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={karigarTabs}/><div className={styles.tableToolbar}><SearchField onChange={setQuery} placeholder="Search by name or mobile..." value={query}/>{showFilters ? <select aria-label="Filter karigar status" onChange={(event) => setStatus(event.target.value as "All Status" | KarigarStatus)} value={status}><option>All Status</option><option>Active</option><option>On Leave</option></select> : null}<FilterButton onClick={() => setShowFilters((value) => !value)}/></div>
      <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.karigarTable}`}><thead><tr><th>Karigar ID</th><th>Name</th><th>Specialisation</th><th>Phone</th><th>Status</th><th>Due Amount</th><th>Actions</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><b>{row.id}</b></td><td>{row.name}</td><td>{row.specialisation}</td><td>{row.phone}</td><td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td><td>{row.dueAmount}</td><td><span className={styles.rowActions}><IconAction label={`Edit ${row.name}`} onClick={() => { setRows((items) => items.map((item) => item.id === row.id ? { ...item, onWork: !item.onWork } : item)); setMessage(`${row.name}'s work status updated.`); }}><FilePenLine size={12}/></IconAction><IconAction label={`View ${row.name}`} onClick={() => setDialog(row)}><Eye size={12}/></IconAction></span></td></tr>)}{!visible.length ? <tr><td className={styles.emptyCell} colSpan={7}>No matching karigars.</td></tr> : null}</tbody></table></div><TableFooter current={page} last={4} onChange={setPage} shown={visible.length} total={24}/></Card>
    <Feedback>{message}</Feedback>{dialog === "new" ? <KarigarForm onClose={() => setDialog(null)} onSave={(row) => { setRows((items) => [row, ...items]); setDialog(null); setMessage(`${row.name} added.`); }}/> : dialog ? <KarigarDetails onClose={() => setDialog(null)} row={dialog}/> : null}
  </div>;
}

function CustomerForm({ onClose, onSave }: { onClose: () => void; onSave: (row: CustomerRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); onSave({ id: `CUS-${10007 + Math.floor(Math.random() * 100)}`, name: String(form.get("name")), phone: String(form.get("phone")), totalPurchase: "৳ 0", totalDue: currency(form.get("due")), loyaltyPoints: Number(form.get("points")) || 0 }); }
  return <Modal description="Create a customer profile with loyalty details." onClose={onClose} title="Add Customer"><form className={styles.modalForm} onSubmit={submit}><label><span>Name</span><input name="name" required/></label><label><span>Phone</span><input name="phone" placeholder="01700-000000" required/></label><label><span>Opening due</span><input defaultValue="0" min="0" name="due" type="number"/></label><label><span>Loyalty points</span><input defaultValue="0" min="0" name="points" type="number"/></label><footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Add Customer</PrimaryButton></footer></form></Modal>;
}

function CustomerDetails({ onClose, row }: { onClose: () => void; row: CustomerRow }) { return <Modal description={row.phone} onClose={onClose} title={row.name}><div className={styles.detailGrid}><p><span>Customer ID</span><strong>{row.id}</strong></p><p><span>Total Purchase</span><strong>{row.totalPurchase}</strong></p><p><span>Total Due</span><strong>{row.totalDue}</strong></p><p><span>Loyalty Points</span><strong>{row.loyaltyPoints}</strong></p></div></Modal>; }

function amountNumber(amount: string) { return Number(amount.replace(/[^0-9]/g, "")); }

export function Reference68CustomerManagement() {
  const [rows, setRows] = useState<CustomerRow[]>([...customerRows]); const [activeTab, setActiveTab] = useState<(typeof customerTabs)[number]>("All Customers"); const [query, setQuery] = useState(""); const [showFilters, setShowFilters] = useState(false); const [minimumPoints, setMinimumPoints] = useState(0); const [page, setPage] = useState(1); const [dialog, setDialog] = useState<"new" | CustomerRow | null>(null); const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => (activeTab === "All Customers" || (activeTab === "With Due" ? amountNumber(row.totalDue) > 0 : row.loyaltyPoints >= 500)) && row.loyaltyPoints >= minimumPoints && `${row.id} ${row.name} ${row.phone}`.toLowerCase().includes(query.trim().toLowerCase())), [activeTab, minimumPoints, query, rows]);
  return <div className={styles.page}>
    <PageIntro action={<PrimaryButton onClick={() => setDialog("new")}><Plus size={13}/>Add Customer</PrimaryButton>} breadcrumb="Home / Customer Management" description="Manage customer information, purchase history and loyalty." title="Customer Management"/>
    <MetricCards metrics={customerMetrics}/>
    <Card className={styles.dataCard}><Tabs active={activeTab} label="Customer segments" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={customerTabs}/><div className={styles.tableToolbar}><SearchField onChange={setQuery} placeholder="Search by name, phone or customer ID..." value={query}/>{showFilters ? <select aria-label="Minimum loyalty points" onChange={(event) => setMinimumPoints(Number(event.target.value))} value={minimumPoints}><option value="0">All Points</option><option value="300">300+ Points</option><option value="500">500+ Points</option></select> : null}<FilterButton onClick={() => setShowFilters((value) => !value)}/></div>
      <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.customerTable}`}><thead><tr><th>Customer ID</th><th>Name</th><th>Phone</th><th>Total Purchase</th><th>Total Due</th><th>Loyalty Points</th><th>Actions</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><b>{row.id}</b></td><td>{row.name}</td><td>{row.phone}</td><td>{row.totalPurchase}</td><td>{row.totalDue}</td><td>{row.loyaltyPoints}</td><td><span className={styles.rowActions}><IconAction label={`View ${row.name}`} onClick={() => setDialog(row)}><Eye size={12}/></IconAction><IconAction label={`Add loyalty points for ${row.name}`} onClick={() => { setRows((items) => items.map((item) => item.id === row.id ? { ...item, loyaltyPoints: item.loyaltyPoints + 10 } : item)); setMessage(`10 loyalty points added for ${row.name}.`); }}><FilePenLine size={12}/></IconAction></span></td></tr>)}{!visible.length ? <tr><td className={styles.emptyCell} colSpan={7}>No matching customers.</td></tr> : null}</tbody></table></div><TableFooter current={page} last={208} onChange={setPage} shown={visible.length} total={1248}/></Card>
    <Feedback>{message}</Feedback>{dialog === "new" ? <CustomerForm onClose={() => setDialog(null)} onSave={(row) => { setRows((items) => [row, ...items]); setDialog(null); setMessage(`${row.name} added.`); }}/> : dialog ? <CustomerDetails onClose={() => setDialog(null)} row={dialog}/> : null}
  </div>;
}

function ValuationDonut() {
  const gradient = valuationSlices.map((slice, index) => { const start = valuationSlices.slice(0, index).reduce((sum, item) => sum + item.value, 0); return `${slice.color} ${start}% ${start + slice.value}%`; }).join(", ");
  return <div className={styles.donutLayout}><div className={styles.donut} style={{ "--donut": `conic-gradient(${gradient})` } as CSSProperties}><span><strong>৳ 12,45,200</strong><small>Total Value</small></span></div><ul>{valuationSlices.map((slice) => <li key={slice.label}><i style={{ background: slice.color }}/><span>{slice.label}<small>{slice.displayValue}</small></span></li>)}</ul></div>;
}

function ValueTrendChart() {
  const left = 42; const right = 585; const top = 18; const bottom = 174; const max = 15;
  const points = valuationTrend.values.map((value, index) => `${left + index / (valuationTrend.values.length - 1) * (right - left)},${top + (max - value) / max * (bottom - top)}`).join(" ");
  const area = `${left},${bottom} ${points} ${right},${bottom}`;
  return <div className={styles.lineChart}><svg aria-label="Stock value trend for the last six months" role="img" viewBox="0 0 620 205"><defs><linearGradient id="valuation-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1d76ed" stopOpacity=".16"/><stop offset="1" stopColor="#1d76ed" stopOpacity="0"/></linearGradient></defs>{[15, 12, 9, 6, 3, 0].map((value) => { const y = top + (max - value) / max * (bottom - top); return <g key={value}><line x1={left} x2={right} y1={y} y2={y}/><text x="1" y={y + 4}>{value === 0 ? "৳ 0" : `৳ ${value}L`}</text></g>; })}<polygon fill="url(#valuation-fill)" points={area}/><polyline fill="none" points={points}/>{valuationTrend.values.map((value, index) => { const x = left + index / (valuationTrend.values.length - 1) * (right - left); const y = top + (max - value) / max * (bottom - top); return <circle cx={x} cy={y} key={valuationTrend.labels[index]} r="3"/>; })}{valuationTrend.labels.map((label, index) => <text className={styles.xLabel} key={label} textAnchor={index === 0 ? "start" : index === valuationTrend.labels.length - 1 ? "end" : "middle"} x={left + index / (valuationTrend.labels.length - 1) * (right - left)} y="198">{label}</text>)}</svg></div>;
}

function exportValuation() {
  const rows = [["Category", "Items", "Quantity", "Unit", "Avg. Rate", "Stock Value", "Percentage"], ...stockSummary.map((row) => [row.category, row.items, row.quantity, row.unit, row.averageRate, row.value, row.percentage])];
  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "inventory-valuation.csv"; link.click(); URL.revokeObjectURL(url);
}

export function Reference68InventoryValuation() {
  const [message, setMessage] = useState("");
  return <div className={styles.page}>
    <PageIntro action={<SecondaryButton onClick={() => { exportValuation(); setMessage("Inventory valuation exported."); }}><Download size={13}/>Export Report</SecondaryButton>} breadcrumb="Home / Reports / Inventory Valuation" description="Current stock value and summary." title="Inventory Valuation"/>
    <MetricCards metrics={valuationMetrics}/>
    <section className={styles.valuationCharts}><Card className={styles.panelCard}><header className={styles.panelHeader}><h2>Stock Value by Category</h2></header><ValuationDonut/></Card><Card className={styles.panelCard}><header className={styles.panelHeader}><h2>Stock Value Trend (Last 6 Months)</h2></header><ValueTrendChart/></Card></section>
    <Card className={styles.summaryCard}><header className={styles.panelHeader}><h2>Stock Summary</h2></header><div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.summaryTable}`}><thead><tr><th>Category</th><th>Items</th><th>Quantity</th><th>Unit</th><th>Avg. Rate (৳)</th><th>Stock Value (৳)</th><th>Percentage</th></tr></thead><tbody>{stockSummary.map((row) => <tr key={row.category}><td>{row.category}</td><td>{row.items}</td><td>{row.quantity}</td><td>{row.unit}</td><td>{row.averageRate}</td><td>{row.value}</td><td>{row.percentage}</td></tr>)}</tbody><tfoot><tr><th>Total</th><th>1,145</th><th>12,458.650</th><th>–</th><th>–</th><th>৳ 12,45,200</th><th>100%</th></tr></tfoot></table></div></Card>
    <Feedback>{message}</Feedback>
  </div>;
}
