"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Calculator,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  Eye,
  Gem,
  Package,
  PackageCheck,
  PackageX,
  PenLine,
  Plus,
  RefreshCcw,
  Scale,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  TriangleAlert,
  Undo2,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  categorySlices,
  goldMetrics,
  goldRateRows,
  goldTabs,
  inventoryMetrics,
  inventoryRows,
  purchaseMetrics,
  purchaseRows,
  purchaseTabs,
  reportActivities,
  reportMetrics,
  reportTabs,
  salesTrend,
  topProducts,
  type InventoryRow,
  type InventoryStatus,
  type Metric,
  type PurchaseRow,
  type PurchaseStatus,
  type PurchaseType,
} from "./data";
import styles from "./reference-66.module.css";

const purchaseIcons = [ShoppingCart, UsersRound, Clock3, Undo2] as const;
const goldIcons = [CircleDollarSign, CircleDollarSign, Scale, Gem] as const;
const inventoryIcons = [Package, PackageCheck, TriangleAlert, PackageX] as const;
const reportIcons = [ShoppingCart, ShoppingCart, ChartNoAxesColumnIncreasing, CircleDollarSign] as const;

function PageIntro({ action, description, title }: { action?: ReactNode; description: string; title: string }) {
  return (
    <header className={styles.pageIntro}>
      <div><h1>{title}</h1><p>{description}</p></div>
      {action ? <div className={styles.pageActions}>{action}</div> : null}
    </header>
  );
}

function PrimaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button className={styles.primaryButton} onClick={onClick} type={type}>{children}</button>;
}

function MetricCard({ icon: Icon, metric }: { icon: LucideIcon; metric: Metric }) {
  return (
    <Card as="article" className={styles.metricCard}>
      <div className={styles.metricCopy}>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        <small>{metric.trend ? <b>{metric.trend}</b> : null}{metric.trend ? " " : ""}{metric.note}</small>
      </div>
      <i className={`${styles.metricIcon} ${styles[metric.accent]}`}><Icon aria-hidden="true" size={18}/></i>
    </Card>
  );
}

function Metrics({ icons, metrics }: { icons: readonly LucideIcon[]; metrics: readonly Metric[] }) {
  return <section aria-label="Summary" className={styles.metrics}>{metrics.map((metric, index) => <MetricCard icon={icons[index] ?? Package} key={metric.label} metric={metric}/>)}</section>;
}

function Tabs<T extends string>({ active, label, onChange, tabs }: { active: T; label: string; onChange: (tab: T) => void; tabs: readonly T[] }) {
  return (
    <nav aria-label={label} className={styles.tabs}>
      {tabs.map((tab) => <button aria-current={active === tab ? "page" : undefined} key={tab} onClick={() => onChange(tab)} type="button">{tab}</button>)}
    </nav>
  );
}

function SearchField({ onChange, placeholder, value }: { onChange: (value: string) => void; placeholder: string; value: string }) {
  return <label className={styles.searchField}><Search aria-hidden="true" size={13}/><input aria-label={placeholder} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value}/></label>;
}

function StatusPill({ children, tone }: { children: ReactNode; tone: "success" | "warning" | "danger" }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

function IconButton({ children, danger = false, label, onClick }: { children: ReactNode; danger?: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} className={`${styles.iconButton} ${danger ? styles.dangerAction : ""}`} onClick={onClick} title={label} type="button">{children}</button>;
}

function Modal({ children, description, onClose, title }: { children: ReactNode; description?: string; onClose: () => void; title: string }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <Card aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button aria-label="Close dialog" onClick={onClose} type="button"><X size={17}/></button>
        </header>
        {children}
      </Card>
    </div>
  );
}

function Pager({ current, last, onChange, pages = [1, 2, 3, 4, 5] }: { current: number; last: number; onChange: (page: number) => void; pages?: readonly number[] }) {
  return (
    <nav aria-label="Table pages" className={styles.pagination}>
      <button aria-label="Previous page" disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))} type="button"><ChevronLeft size={12}/></button>
      {pages.map((page) => <button aria-current={current === page ? "page" : undefined} key={page} onClick={() => onChange(page)} type="button">{page}</button>)}
      <span>…</span>
      <button aria-current={current === last ? "page" : undefined} onClick={() => onChange(last)} type="button">{last}</button>
      <button aria-label="Next page" disabled={current === last} onClick={() => onChange(Math.min(last, current + 1))} type="button"><ChevronRight size={12}/></button>
    </nav>
  );
}

function Feedback({ children }: { children: string }) {
  return children ? <p aria-live="polite" className={styles.feedback}>{children}</p> : null;
}

function PurchaseForm({ onClose, onSave }: { onClose: () => void; onSave: (row: PurchaseRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = String(form.get("amount") ?? "0");
    const paid = String(form.get("paid") ?? "0");
    const amountNumber = Number(amount.replaceAll(",", ""));
    const paidNumber = Number(paid.replaceAll(",", ""));
    const dueNumber = Math.max(0, amountNumber - paidNumber);
    const status: PurchaseStatus = paidNumber <= 0 ? "Due" : dueNumber > 0 ? "Partial" : "Paid";
    onSave({
      bill: `PUR-${10057 + Date.now() % 100}`,
      supplier: String(form.get("supplier")),
      type: String(form.get("type")) as PurchaseType,
      date: "26 May 2025",
      amount: `৳ ${new Intl.NumberFormat("en-IN").format(amountNumber)}`,
      paid: `৳ ${new Intl.NumberFormat("en-IN").format(paidNumber)}`,
      due: `৳ ${new Intl.NumberFormat("en-IN").format(dueNumber)}`,
      status,
    });
  }
  return (
    <Modal description="Record a supplier bill and payment." onClose={onClose} title="New Purchase">
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Supplier</span><input name="supplier" placeholder="Supplier name" required/></label>
        <label><span>Purchase type</span><select defaultValue="Gold" name="type"><option>Gold</option><option>Diamond</option><option>Other</option><option>Return</option></select></label>
        <label><span>Amount</span><input min="0" name="amount" placeholder="245000" required type="number"/></label>
        <label><span>Paid</span><input min="0" name="paid" placeholder="150000" required type="number"/></label>
        <footer><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><PrimaryButton type="submit">Save Purchase</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference66PurchaseManagement() {
  const [rows, setRows] = useState<PurchaseRow[]>([...purchaseRows]);
  const [activeTab, setActiveTab] = useState<(typeof purchaseTabs)[number]>("All Purchases");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All Status" | PurchaseStatus>("All Status");
  const [showStatus, setShowStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<"new" | PurchaseRow | null>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => {
    const tabMatches = activeTab === "All Purchases" || activeTab === "Purchase Return"
      ? activeTab === "All Purchases" || row.type === "Return"
      : row.type === activeTab.replace(" Purchase", "");
    const queryMatches = `${row.bill} ${row.supplier} ${row.type}`.toLowerCase().includes(query.trim().toLowerCase());
    return tabMatches && queryMatches && (status === "All Status" || row.status === status);
  }), [activeTab, query, rows, status]);

  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={() => setDialog("new")}><Plus size={13}/>New Purchase</PrimaryButton>} description="Manage all purchase transactions and supplier bills." title="Purchase Management"/>
      <Metrics icons={purchaseIcons} metrics={purchaseMetrics}/>
      <Card className={styles.dataCard}>
        <Tabs active={activeTab} label="Purchase types" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={purchaseTabs}/>
        <div className={styles.tableToolbar}>
          <SearchField onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by bill no, supplier..." value={query}/>
          {showStatus ? <select aria-label="Filter purchases by status" onChange={(event) => setStatus(event.target.value as "All Status" | PurchaseStatus)} value={status}><option>All Status</option><option>Paid</option><option>Partial</option><option>Due</option></select> : null}
          <button aria-expanded={showStatus} className={styles.filterButton} onClick={() => setShowStatus((value) => !value)} type="button"><SlidersHorizontal size={12}/>Filters</button>
        </div>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <caption className="sr-only">Purchase bills</caption>
            <thead><tr><th>Bill No</th><th>Supplier</th><th>Purchase Type</th><th>Date</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => <tr key={row.bill}><td>{row.bill}</td><td>{row.supplier}</td><td>{row.type}</td><td>{row.date}</td><td>{row.amount}</td><td>{row.paid}</td><td>{row.due}</td><td><StatusPill tone={row.status === "Paid" ? "success" : row.status === "Partial" ? "warning" : "danger"}>{row.status}</StatusPill></td><td><IconButton label={`View ${row.bill}`} onClick={() => setDialog(row)}><Eye size={12}/></IconButton></td></tr>)}
              {!visibleRows.length ? <tr><td className={styles.emptyCell} colSpan={9}>No purchases match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of 38 entries</span><Pager current={page} last={5} onChange={setPage} pages={[1, 2, 4, 5]}/></footer>
      </Card>
      <Feedback>{message}</Feedback>
      {dialog === "new" ? <PurchaseForm onClose={() => setDialog(null)} onSave={(row) => { setRows((current) => [row, ...current]); setDialog(null); setMessage(`${row.bill} was added.`); }}/>: null}
      {dialog && dialog !== "new" ? <Modal description={dialog.supplier} onClose={() => setDialog(null)} title={dialog.bill}><div className={styles.detailGrid}><p><span>Purchase</span><strong>{dialog.type}</strong></p><p><span>Amount</span><strong>{dialog.amount}</strong></p><p><span>Paid</span><strong>{dialog.paid}</strong></p><p><span>Due</span><strong>{dialog.due}</strong></p></div></Modal> : null}
    </div>
  );
}

function GoldRatesTable() {
  return (
    <div className={styles.tableScroller}>
      <table className={`${styles.dataTable} ${styles.goldTable}`}>
        <caption className="sr-only">Daily gold and silver rates</caption>
        <thead><tr><th>Date</th><th>18K (750)</th><th>21K (875)</th><th>22K (916)</th><th>24K (999)</th><th>Silver (1g)</th></tr></thead>
        <tbody>{goldRateRows.map((row) => <tr key={row.date}><td>{row.date}</td><td>৳ {row.eighteen}</td><td>৳ {row.twentyOne}</td><td>৳ {row.twentyTwo}</td><td>৳ {row.twentyFour}</td><td>৳ {row.silver}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function Reference66GoldManagement() {
  const [activeTab, setActiveTab] = useState<(typeof goldTabs)[number]>("Gold Rates");
  const [fromUnit, setFromUnit] = useState("Gram (g)");
  const [toUnit, setToUnit] = useState("Vori (11.664 g)");
  const [amount, setAmount] = useState("10");
  const [converted, setConverted] = useState("0.858 Vori");
  const [message, setMessage] = useState("");

  function convert() {
    const input = Number(amount) || 0;
    const grams = fromUnit.startsWith("Vori") ? input * 11.664 : input;
    const result = toUnit.startsWith("Vori") ? `${(grams / 11.664).toFixed(3)} Vori` : `${grams.toFixed(3)} Gram`;
    setConverted(result);
  }

  return (
    <div className={styles.page}>
      <PageIntro description="Manage gold rates, purity & unit conversion." title="Gold Management"/>
      <Metrics icons={goldIcons} metrics={goldMetrics}/>
      <section className={styles.goldLayout}>
        <Card className={styles.dataCard}>
          <Tabs active={activeTab} label="Gold management sections" onChange={setActiveTab} tabs={goldTabs}/>
          {activeTab === "Gold Rates" ? <GoldRatesTable/> : <div className={styles.tabPlaceholder}><Scale size={24}/><strong>{activeTab}</strong><p>Manage {activeTab.toLowerCase()} settings and values here.</p></div>}
          <div className={styles.cardAction}><button className={styles.smallPrimary} onClick={() => setMessage("All available rate history is now shown.")} type="button">View All Rates</button></div>
        </Card>
        <aside className={styles.goldAside}>
          <Card className={styles.converterCard}>
            <h2>Unit Conversion</h2>
            <label><span>From Unit</span><select onChange={(event) => setFromUnit(event.target.value)} value={fromUnit}><option>Gram (g)</option><option>Vori (11.664 g)</option></select></label>
            <label><span>To Unit</span><select onChange={(event) => setToUnit(event.target.value)} value={toUnit}><option>Vori (11.664 g)</option><option>Gram (g)</option></select></label>
            <label className={styles.amountField}><span>Enter Amount</span><input min="0" onChange={(event) => setAmount(event.target.value)} type="number" value={amount}/><button onClick={convert} type="button">Convert</button></label>
            <div className={styles.conversionResult}><span>Result</span><strong>{converted}</strong></div>
          </Card>
          <Card className={styles.toolsCard}>
            <h2>Tools</h2>
            <button onClick={() => setMessage("Gold calculator opened for the current rate.")} type="button"><Calculator size={13}/>Gold Calculator</button>
            <button onClick={() => setMessage("Gold purity checker opened.")} type="button"><ShieldCheck size={13}/>Gold Purity Checker</button>
            <button onClick={() => setMessage("Wastage calculator opened.")} type="button"><RefreshCcw size={13}/>Wastage Calculator</button>
          </Card>
        </aside>
      </section>
      <Feedback>{message}</Feedback>
    </div>
  );
}

type InventoryDialog = { mode: "view" | "edit"; row: InventoryRow } | null;

function InventoryEditor({ onClose, onSave, row }: { onClose: () => void; onSave: (row: InventoryRow) => void; row: InventoryRow }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      ...row,
      name: String(form.get("name")),
      quantity: Number(form.get("quantity")),
      status: String(form.get("status")) as InventoryStatus,
      location: String(form.get("location")) as InventoryRow["location"],
    });
  }
  return (
    <Modal description={row.sku} onClose={onClose} title={`Edit ${row.name}`}>
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Product name</span><input defaultValue={row.name} name="name" required/></label>
        <label><span>Quantity</span><input defaultValue={row.quantity} min="0" name="quantity" required type="number"/></label>
        <label><span>Status</span><select defaultValue={row.status} name="status"><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></label>
        <label><span>Location</span><select defaultValue={row.location} name="location"><option>Main Store</option><option>Showroom</option><option>Warehouse</option></select></label>
        <footer><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><PrimaryButton type="submit">Save Changes</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference66InventoryManagement() {
  const [rows, setRows] = useState<InventoryRow[]>([...inventoryRows]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [status, setStatus] = useState("All Status");
  const [showStatus, setShowStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<InventoryDialog>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => {
    const text = `${row.sku} ${row.name} ${row.category} ${row.purity}`.toLowerCase();
    return text.includes(query.trim().toLowerCase())
      && (category === "All Categories" || row.category === category)
      && (location === "All Locations" || row.location === location)
      && (status === "All Status" || row.status === status);
  }), [category, location, query, rows, status]);

  return (
    <div className={styles.page}>
      <PageIntro description="Track and manage your jewellery inventory." title="Inventory Management"/>
      <Metrics icons={inventoryIcons} metrics={inventoryMetrics}/>
      <Card className={`${styles.inventoryToolbar} ${showStatus ? styles.expandedToolbar : ""}`}>
        <select aria-label="Filter by category" onChange={(event) => { setCategory(event.target.value); setPage(1); }} value={category}><option>All Categories</option>{[...new Set(rows.map((row) => row.category))].map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by location" onChange={(event) => { setLocation(event.target.value); setPage(1); }} value={location}><option>All Locations</option><option>Main Store</option><option>Showroom</option><option>Warehouse</option></select>
        <SearchField onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by name, SKU, barcode..." value={query}/>
        {showStatus ? <select aria-label="Filter by stock status" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select> : null}
        <button aria-expanded={showStatus} className={styles.filterButton} onClick={() => setShowStatus((value) => !value)} type="button"><SlidersHorizontal size={12}/>Filter</button>
      </Card>
      <Card className={styles.dataCard}>
        <div className={styles.tableScroller}>
          <table className={`${styles.dataTable} ${styles.inventoryTable}`}>
            <caption className="sr-only">Inventory items</caption>
            <thead><tr><th>SKU</th><th>Product Name</th><th>Category</th><th>Purity</th><th>Weight</th><th>Qty</th><th>Unit</th><th>Stock Value</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => <tr key={row.sku}><td>{row.sku}</td><td>{row.name}</td><td>{row.category}</td><td>{row.purity}</td><td>{row.weight}</td><td>{row.quantity}</td><td>{row.unit}</td><td>{row.stockValue}</td><td><StatusPill tone={row.status === "In Stock" ? "success" : row.status === "Low Stock" ? "warning" : "danger"}>{row.status}</StatusPill></td><td><span className={styles.rowActions}><IconButton label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })}><PenLine size={12}/></IconButton><IconButton label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12}/></IconButton></span></td></tr>)}
              {!visibleRows.length ? <tr><td className={styles.emptyCell} colSpan={10}>No inventory items match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of 1,248 entries</span><Pager current={page} last={156} onChange={setPage}/></footer>
      </Card>
      <Feedback>{message}</Feedback>
      {dialog?.mode === "edit" ? <InventoryEditor onClose={() => setDialog(null)} onSave={(updated) => { setRows((current) => current.map((row) => row.sku === updated.sku ? updated : row)); setDialog(null); setMessage(`${updated.name} was updated.`); }} row={dialog.row}/>: null}
      {dialog?.mode === "view" ? <Modal description={`${dialog.row.category} · ${dialog.row.purity}`} onClose={() => setDialog(null)} title={dialog.row.name}><div className={styles.detailGrid}><p><span>SKU</span><strong>{dialog.row.sku}</strong></p><p><span>Weight</span><strong>{dialog.row.weight} {dialog.row.unit}</strong></p><p><span>Quantity</span><strong>{dialog.row.quantity}</strong></p><p><span>Stock value</span><strong>{dialog.row.stockValue}</strong></p></div></Modal>: null}
    </div>
  );
}

function SalesTrendChart() {
  const width = 690;
  const height = 235;
  const left = 45;
  const right = 13;
  const top = 18;
  const bottom = 195;
  const max = 2;
  const groupWidth = (width - left - right) / salesTrend.labels.length;
  return (
    <div className={styles.chartScroller}>
      <svg aria-label="Sales and purchase trend for May 2025" className={styles.barChart} role="img" viewBox={`0 0 ${width} ${height}`}>
        {[0, .5, 1, 1.5, 2].map((value) => {
          const y = bottom - (value / max) * (bottom - top);
          return <g key={value}><line x1={left} x2={width - right} y1={y} y2={y}/><text textAnchor="end" x={left - 8} y={y + 3}>{value === 0 ? "0" : value < 1 ? `${value * 100}K` : `${value}M`}</text></g>;
        })}
        {salesTrend.labels.map((label, index) => {
          const x = left + groupWidth * index + groupWidth * .28;
          const salesHeight = salesTrend.sales[index] / max * (bottom - top);
          const purchaseHeight = salesTrend.purchase[index] / max * (bottom - top);
          return <g key={label}><rect className={styles.salesBar} height={salesHeight} rx="1.5" width={groupWidth * .18} x={x} y={bottom - salesHeight}><title>{`${label} sales: ৳ ${salesTrend.sales[index]}M`}</title></rect><rect className={styles.purchaseBar} height={purchaseHeight} rx="1.5" width={groupWidth * .18} x={x + groupWidth * .23} y={bottom - purchaseHeight}><title>{`${label} purchase: ৳ ${salesTrend.purchase[index]}M`}</title></rect><text className={styles.xLabel} textAnchor="middle" x={x + groupWidth * .2} y={219}>{label}</text></g>;
        })}
      </svg>
    </div>
  );
}

function SalesCategoryDonut() {
  const stops: string[] = [];
  let position = 0;
  for (const slice of categorySlices) {
    stops.push(`${slice.color} ${position}% ${position + slice.value}%`);
    position += slice.value;
  }
  const donutStyle = { "--donut-colors": `conic-gradient(${stops.join(",")})` } as CSSProperties;
  return (
    <div className={styles.donutContent}>
      <div className={styles.donut} style={donutStyle}><span><strong>৳ 18,45,320</strong><small>Total Sales</small></span></div>
      <ul>{categorySlices.map((slice) => <li key={slice.label}><i style={{ background: slice.color }}/><span>{slice.label}</span><b>{slice.value}%</b></li>)}</ul>
    </div>
  );
}

function PanelHeader({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return <header className={styles.panelHeader}><h2>{children}</h2>{action}</header>;
}

export function Reference66ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<(typeof reportTabs)[number]>("Overview");
  const [rangeIndex, setRangeIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState("");
  const ranges = ["01 May 2025 - 26 May 2025", "01 Apr 2025 - 30 Apr 2025", "01 Jan 2025 - 26 May 2025"];

  function exportReport() {
    const csv = ["Product,Category,Qty Sold,Sales Amount", ...topProducts.map((row) => `${row.product},${row.category},${row.quantity},${row.amount.replace("৳ ", "")}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Report exported successfully.");
  }

  return (
    <div className={styles.page}>
      <PageIntro action={<><button className={styles.dateButton} onClick={() => setRangeIndex((current) => (current + 1) % ranges.length)} type="button"><CalendarDays size={12}/>{ranges[rangeIndex]}<RefreshCcw size={11}/></button><PrimaryButton onClick={exportReport}><Download size={12}/>Export Report</PrimaryButton></>} description="Business insights and detailed reports." title="Reports & Analytics"/>
      <Tabs active={activeTab} label="Report sections" onChange={setActiveTab} tabs={reportTabs}/>
      <Metrics icons={reportIcons} metrics={reportMetrics}/>
      <section className={styles.reportCharts}>
        <Card className={styles.panelCard}><PanelHeader action={<div className={styles.legend}><span><i className={styles.salesLegend}/>Sales (৳)</span><span><i className={styles.purchaseLegend}/>Purchase (৳)</span></div>}>{activeTab === "Overview" ? "Sales Trend" : `${activeTab} Trend`}</PanelHeader><SalesTrendChart/></Card>
        <Card className={styles.panelCard}><PanelHeader>Top Categories by Sales</PanelHeader><SalesCategoryDonut/></Card>
      </section>
      <section className={styles.reportBottom}>
        <Card className={styles.panelCard}>
          <PanelHeader>Top Selling Products</PanelHeader>
          <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.compactTable}`}><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Qty Sold</th><th>Sales Amount (৳)</th></tr></thead><tbody>{topProducts.map((row, index) => <tr key={row.product}><td>{index + 1}</td><td>{row.product}</td><td>{row.category}</td><td>{row.quantity}</td><td>{row.amount}</td></tr>)}</tbody></table></div>
        </Card>
        <Card className={styles.panelCard}>
          <PanelHeader action={<button className={styles.textButton} onClick={() => setShowAll((value) => !value)} type="button">{showAll ? "Show Recent" : "View All"}<ArrowUpRight size={10}/></button>}>Recent Activities</PanelHeader>
          <ul className={styles.activityList}>{reportActivities.slice(0, showAll ? reportActivities.length : 5).map((activity, index) => <li key={activity.text}><i className={`${styles.activityIcon} ${styles[activity.accent]}`}>{index === 1 ? <Package size={11}/> : index === 2 ? <CircleDollarSign size={11}/> : index === 3 ? <RefreshCcw size={11}/> : <ShoppingCart size={11}/>}</i><span>{activity.text}</span><time>{activity.date}</time></li>)}</ul>
        </Card>
      </section>
      <Feedback>{message}</Feedback>
    </div>
  );
}
