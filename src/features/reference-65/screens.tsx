"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  BadgeDollarSign,
  Barcode,
  Boxes,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  CreditCard,
  Crown,
  Gem,
  Infinity as InfinityIcon,
  Link2,
  Package,
  PackageCheck,
  PackageX,
  Pause,
  PenLine,
  Plus,
  Save,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TriangleAlert,
  UserRoundPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import { DonutReport } from "@/features/reference-ui/report-visuals";
import {
  categorySlices,
  dashboardMetrics,
  goldRates,
  inventoryRows,
  recentSales,
  reportActivities,
  reportMetrics,
  saleProducts,
  salesOverview,
  salesOverviewLabels,
  salesPurchaseComparison,
  topCustomers,
  topSellingProducts,
  type InventoryRow,
  type Metric,
  type ProductKind,
  type SaleProduct,
} from "./data";
import styles from "./reference-65.module.css";

const dashboardIcons = [ShoppingCart, ShoppingBag, Boxes, BadgeDollarSign] as const;
const inventoryIcons = [Package, BadgeDollarSign, TriangleAlert, PackageX] as const;
const reportIcons = [ShoppingCart, ShoppingBag, BadgeDollarSign, PackageCheck] as const;

function PageIntro({ action, description, title }: { action?: ReactNode; description: string; title: string }) {
  return (
    <header className={styles.pageIntro}>
      <div><h1>{title}</h1><p>{description}</p></div>
      {action ? <div className={styles.headerAction}>{action}</div> : null}
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
        <small>{metric.label}</small>
        <strong>{metric.value}</strong>
        {metric.trend ? <span><b>{metric.trend}</b> {metric.note}</span> : <span>{metric.note}</span>}
      </div>
      <span className={`${styles.metricIcon} ${styles[metric.accent]}`}><Icon aria-hidden="true" size={20} /></span>
    </Card>
  );
}

function Metrics({ icons, items }: { icons: readonly LucideIcon[]; items: readonly Metric[] }) {
  return <section aria-label="Summary" className={styles.metrics}>{items.map((metric, index) => <MetricCard icon={icons[index] ?? Package} key={metric.label} metric={metric} />)}</section>;
}

function PanelHeader({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return <header className={styles.panelHeader}><h2>{children}</h2>{action}</header>;
}

function ProductGlyph({ kind, size = 25 }: { kind: ProductKind | string; size?: number }) {
  const props = { "aria-hidden": true, size, strokeWidth: 1.6 } as const;
  if (kind === "ring") return <CircleDot {...props} />;
  if (kind === "necklace") return <Circle {...props} />;
  if (kind === "pendant") return <Gem {...props} />;
  if (kind === "earrings") return <Sparkles {...props} />;
  if (kind === "chain") return <Link2 {...props} />;
  if (kind === "bracelet") return <InfinityIcon {...props} />;
  if (kind === "set") return <Crown {...props} />;
  return <Circle {...props} />;
}

function AreaSalesChart() {
  const width = 720;
  const height = 220;
  const left = 38;
  const right = 12;
  const top = 15;
  const bottom = 182;
  const max = 200;
  const points = salesOverview.map((value, index) => ({
    x: left + (index / (salesOverview.length - 1)) * (width - left - right),
    y: bottom - (value / max) * (bottom - top),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${bottom} ${line} ${width - right},${bottom}`;
  return (
    <div className={styles.chartScroller}>
      <svg aria-label="Sales overview from May 20 to May 27" className={styles.areaChart} role="img" viewBox={`0 0 ${width} ${height}`}>
        <defs><linearGradient id="reference-65-sales-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1976ed" stopOpacity=".18"/><stop offset="1" stopColor="#1976ed" stopOpacity=".02"/></linearGradient></defs>
        {[0, 50, 100, 150, 200].map((value) => {
          const y = bottom - (value / max) * (bottom - top);
          return <g key={value}><line x1={left} x2={width-right} y1={y} y2={y}/><text x={left-8} y={y+3} textAnchor="end">{value === 0 ? "0" : value < 100 ? `${value}K` : `${value / 100}L`}</text></g>;
        })}
        {salesOverviewLabels.map((label, index) => <line className={styles.verticalGrid} key={`grid-${label}`} x1={points[index].x} x2={points[index].x} y1={top} y2={bottom}/>)}
        <polygon fill="url(#reference-65-sales-fill)" points={area}/>
        <polyline className={styles.areaLine} points={line}/>
        {points.map((point, index) => <circle cx={point.x} cy={point.y} key={salesOverviewLabels[index]} r="3"><title>{`${salesOverviewLabels[index]}: ৳ ${salesOverview[index]} thousand`}</title></circle>)}
        {salesOverviewLabels.map((label, index) => <text className={styles.axisLabel} key={label} textAnchor={index === 0 ? "start" : index === salesOverviewLabels.length - 1 ? "end" : "middle"} x={points[index].x} y="207">{label}</text>)}
      </svg>
    </div>
  );
}

function ComparisonChart() {
  const width = 650;
  const height = 220;
  const left = 40;
  const bottom = 182;
  const top = 20;
  const max = 20;
  const groupWidth = (width - left - 12) / salesPurchaseComparison.labels.length;
  return (
    <div className={styles.chartScroller}>
      <svg aria-label="Sales and purchase comparison for May" className={styles.comparisonChart} role="img" viewBox={`0 0 ${width} ${height}`}>
        {[0, 5, 10, 15, 20].map((value) => {
          const y = bottom - (value / max) * (bottom - top);
          return <g key={value}><line x1={left} x2={width-12} y1={y} y2={y}/><text x={left-8} y={y+3} textAnchor="end">{value === 0 ? "0" : value < 10 ? `${value * 10}K` : `${value / 10}L`}</text></g>;
        })}
        {salesPurchaseComparison.labels.map((label, index) => {
          const x = left + index * groupWidth + groupWidth * .25;
          const salesHeight = (salesPurchaseComparison.sales[index] / max) * (bottom - top);
          const purchaseHeight = (salesPurchaseComparison.purchase[index] / max) * (bottom - top);
          return <g key={label}><rect fill="#2f83ee" height={salesHeight} rx="1" width={groupWidth*.2} x={x} y={bottom-salesHeight}/><rect fill="#44c8a2" height={purchaseHeight} rx="1" width={groupWidth*.2} x={x+groupWidth*.26} y={bottom-purchaseHeight}/><text className={styles.axisLabel} textAnchor="middle" x={x+groupWidth*.22} y="207">{label}</text></g>;
        })}
      </svg>
    </div>
  );
}

function DataTable({ children, minWidth = 620 }: { children: ReactNode; minWidth?: number }) {
  return <div className={styles.tableScroller}><table style={{ minWidth }}><tbody>{children}</tbody></table></div>;
}

export function Reference65Dashboard() {
  const [period, setPeriod] = useState("Last 7 Days");
  return (
    <div className={styles.page}>
      <PageIntro
        action={<button className={styles.dateButton} type="button"><span>Monday, 26 May 2025</span><CalendarDays aria-hidden="true" size={14}/></button>}
        description="Welcome back, Admin! Here's what's happening today."
        title="Dashboard"
      />
      <Metrics icons={dashboardIcons} items={dashboardMetrics}/>
      <section className={styles.dashboardCharts}>
        <Card className={styles.chartCard}>
          <PanelHeader action={<select aria-label="Sales period" onChange={(event) => setPeriod(event.target.value)} value={period}><option>Last 7 Days</option><option>Last 30 Days</option><option>This Year</option></select>}>Sales Overview</PanelHeader>
          <AreaSalesChart/>
        </Card>
        <Card className={styles.goldCard}>
          <PanelHeader>Gold Rate (Today)</PanelHeader>
          <div className={styles.goldContent}>
            <span className={styles.goldIllustration}><Package aria-hidden="true" size={33}/></span>
            <ul>{goldRates.map((rate) => <li key={rate.purity}><span>{rate.purity}</span><strong>{rate.price}</strong></li>)}</ul>
          </div>
          <button className={styles.panelLink} type="button">View All Rates <span>→</span></button>
        </Card>
      </section>
      <section className={styles.dashboardBottom}>
        <Card className={styles.tableCard}>
          <PanelHeader>Recent Sales</PanelHeader>
          <DataTable minWidth={610}>
            <tr className={styles.tableHead}><th>Invoice No</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
            {recentSales.map((sale) => <tr key={sale.invoice}><td className={styles.blueText}>{sale.invoice}</td><td>{sale.customer}</td><td>{sale.date}</td><td>{sale.amount}</td><td><StatusBadge tone={sale.status === "Paid" ? "success" : "warning"}>{sale.status}</StatusBadge></td></tr>)}
          </DataTable>
        </Card>
        <Card className={styles.tableCard}>
          <PanelHeader>Top Selling Products</PanelHeader>
          <DataTable minWidth={300}>
            <tr className={styles.tableHead}><th>Product</th><th className={styles.right}>Qty</th></tr>
            {topSellingProducts.map((product) => <tr key={product.product}><td><span className={styles.productCell}><i><ProductGlyph kind={product.kind} size={17}/></i>{product.product}</span></td><td className={styles.right}>{product.quantity}</td></tr>)}
          </DataTable>
        </Card>
      </section>
    </div>
  );
}

type CartLine = { product: SaleProduct; quantity: number };
type PosDialog = "customer" | "payment" | null;

function CustomerModal({ onAdd, onClose }: { onAdd: (name: string) => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="Add customer">
      <form className={styles.modalForm} onSubmit={(event) => { event.preventDefault(); const name = String(new FormData(event.currentTarget).get("customer") ?? "").trim(); if (name) onAdd(name); }}>
        <label><span>Customer name</span><input autoFocus name="customer" placeholder="Enter customer name" required/></label>
        <label><span>Phone</span><input name="phone" placeholder="01XXXXXXXXX"/></label>
        <footer><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><PrimaryButton type="submit"><UserRoundPlus size={14}/>Add Customer</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference65PosSales() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([
    { product: saleProducts[0], quantity: 1 },
    { product: saleProducts[4], quantity: 1 },
    { product: saleProducts[1], quantity: 1 },
  ]);
  const [customers, setCustomers] = useState(["Walk-in Customer", "Rahim Ahmed", "Sadia Akter"]);
  const [customer, setCustomer] = useState("Walk-in Customer");
  const [discount, setDiscount] = useState(0);
  const [dialog, setDialog] = useState<PosDialog>(null);
  const [message, setMessage] = useState("");

  const visibleProducts = useMemo(() => saleProducts.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = category === "All" || category === product.category || product.kind === category.toLowerCase() || product.name.toLowerCase().includes(category.toLowerCase());
    return matchesQuery && matchesCategory;
  }), [category, query]);

  const subtotal = cart.reduce((sum, line) => sum + line.product.rate * line.quantity, 0);
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * .05);
  const total = taxable + tax;
  const money = (value: number) => `৳ ${new Intl.NumberFormat("en-IN").format(value)}`;

  function addProduct(product: SaleProduct) {
    setCart((current) => current.some((line) => line.product.sku === product.sku)
      ? current.map((line) => line.product.sku === product.sku ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { product, quantity: 1 }]);
    setMessage(`${product.name} added to the current sale.`);
  }

  function startNewSale() {
    setCart([]);
    setDiscount(0);
    setCustomer("Walk-in Customer");
    setMessage("A new sale is ready.");
  }

  const categoryOptions = ["All", "Gold", "Diamond", "Ring", "Necklace", "Earrings", "Bracelet"];
  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={startNewSale}><Plus size={14}/>New Sale (F1)</PrimaryButton>} description="Create sales invoice, manage billing and process payments." title="POS & Sales"/>
      <section className={styles.posLayout}>
        <Card className={styles.catalogCard}>
          <PanelHeader>Add Product</PanelHeader>
          <div className={styles.productSearch}><label><Search aria-hidden="true" size={14}/><input aria-label="Search products" onChange={(event) => setQuery(event.target.value)} placeholder="Search product by name, SKU or barcode..." value={query}/></label><button aria-label="Scan a barcode" onClick={() => setMessage("Barcode scanner is ready.")} type="button"><Barcode size={18}/></button></div>
          <nav aria-label="Product categories" className={styles.categoryTabs}>{categoryOptions.map((option) => <button aria-current={category === option ? "page" : undefined} key={option} onClick={() => setCategory(option)} type="button">{option}</button>)}</nav>
          <div className={styles.productGrid}>{visibleProducts.map((product) => <button aria-label={`Add ${product.name} to sale`} className={styles.productCard} key={product.sku} onClick={() => addProduct(product)} type="button"><span className={styles.productArt}><ProductGlyph kind={product.kind} size={36}/></span><strong>{product.name}</strong><small>SKU: {product.sku}</small><b>{money(product.rate)}</b></button>)}{!visibleProducts.length ? <p className={styles.emptyProducts}>No products match this search.</p> : null}</div>
        </Card>

        <div className={styles.saleColumn}>
          <Card className={styles.saleCard}>
            <PanelHeader>Current Sale</PanelHeader>
            <div className={styles.saleMeta}><label><span>Invoice No</span><input readOnly value="INV-10046"/></label><label><span>Customer</span><span className={styles.customerControl}><select onChange={(event) => setCustomer(event.target.value)} value={customer}>{customers.map((name) => <option key={name}>{name}</option>)}</select><button aria-label="Add customer" onClick={() => setDialog("customer")} type="button"><Plus size={15}/></button></span></label></div>
            <div className={styles.cartTable}>
              <div className={styles.cartHead}><span>Product</span><span>Qty</span><span>Rate</span><span>Amount</span><span/></div>
              {cart.length ? cart.map((line) => <div className={styles.cartRow} key={line.product.sku}><span><i><ProductGlyph kind={line.product.kind} size={17}/></i>{line.product.name} ({line.product.category === "Gold" ? line.product.name.includes("Necklace") ? "21K" : "22K" : ""})</span><input aria-label={`Quantity for ${line.product.name}`} min="1" onChange={(event) => { const quantity = Math.max(1, Number(event.target.value)); setCart((current) => current.map((item) => item.product.sku === line.product.sku ? { ...item, quantity } : item)); }} type="number" value={line.quantity}/><span>{money(line.product.rate)}</span><strong>{money(line.product.rate * line.quantity)}</strong><IconAction danger label={`Remove ${line.product.name}`} onClick={() => setCart((current) => current.filter((item) => item.product.sku !== line.product.sku))}><Trash2 size={13}/></IconAction></div>) : <p className={styles.emptyCart}>Select a product to begin this sale.</p>}
            </div>
            <div className={styles.totals}><p><span>Sub Total</span><strong>{money(subtotal)}</strong></p><p><label htmlFor="reference65-discount">Discount</label><span className={styles.discountInput}><input id="reference65-discount" min="0" onChange={(event) => setDiscount(Math.max(0, Number(event.target.value)))} type="number" value={discount}/><b>{money(discount)}</b></span></p><p><span>Tax (5%)</span><strong>{money(tax)}</strong></p><p className={styles.grandTotal}><span>Total</span><strong>{money(total)}</strong></p></div>
          </Card>
          <Card className={styles.checkoutActions}><button onClick={() => setMessage(`Sale ${money(total)} put on hold.`)} type="button"><Pause size={14}/>Hold (F4)</button><button onClick={() => setMessage("Draft invoice INV-10046 saved.")} type="button"><Save size={14}/>Save (F6)</button><PrimaryButton onClick={() => cart.length ? setDialog("payment") : setMessage("Add at least one product before payment.")}><CreditCard size={14}/>Process Payment (F8)</PrimaryButton></Card>
        </div>
      </section>
      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>
      {dialog === "customer" ? <CustomerModal onAdd={(name) => { setCustomers((current) => [...current, name]); setCustomer(name); setDialog(null); setMessage(`${name} added as the customer.`); }} onClose={() => setDialog(null)}/> : null}
      {dialog === "payment" ? <Modal description={`Amount due: ${money(total)}`} onClose={() => setDialog(null)} title="Process payment"><form className={styles.modalForm} onSubmit={(event) => { event.preventDefault(); setDialog(null); setCart([]); setDiscount(0); setMessage("Payment completed and invoice INV-10046 created."); }}><label><span>Payment method</span><select><option>Cash</option><option>Card</option><option>Mobile Banking</option></select></label><label><span>Received amount</span><input defaultValue={total} min={total} type="number"/></label><footer><button className={styles.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button><PrimaryButton type="submit"><CreditCard size={14}/>Confirm Payment</PrimaryButton></footer></form></Modal> : null}
    </div>
  );
}

function StockEditor({ initial, onClose, onSave }: { initial?: InventoryRow; onClose: () => void; onSave: (row: InventoryRow) => void }) {
  return (
    <Modal onClose={onClose} title={initial ? "Edit stock item" : "Add stock"}>
      <form className={styles.modalForm} onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const quantity = Number(values.get("quantity"));
        onSave({
          id: initial?.id ?? Date.now(),
          name: String(values.get("name")),
          sku: String(values.get("sku")),
          category: String(values.get("category")) as InventoryRow["category"],
          quantity,
          location: String(values.get("location")) as InventoryRow["location"],
          status: quantity === 0 ? "Out of Stock" : quantity <= 3 ? "Low Stock" : "In Stock",
        });
      }}>
        <label><span>Product name</span><input defaultValue={initial?.name} name="name" required/></label>
        <label><span>SKU</span><input defaultValue={initial?.sku} name="sku" required/></label>
        <label><span>Category</span><select defaultValue={initial?.category ?? "Jewelry"} name="category"><option>Jewelry</option><option>Diamond</option><option>Gold</option></select></label>
        <label><span>Stock quantity</span><input defaultValue={initial?.quantity ?? 1} min="0" name="quantity" required type="number"/></label>
        <label className={styles.fullField}><span>Location</span><select defaultValue={initial?.location ?? "Main Store"} name="location"><option>Main Store</option><option>Showroom</option><option>Warehouse</option></select></label>
        <footer><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><PrimaryButton type="submit"><Save size={14}/>Save Stock</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference65InventoryManagement() {
  const [rows, setRows] = useState<InventoryRow[]>([...inventoryRows]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [status, setStatus] = useState("All Status");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [editor, setEditor] = useState<InventoryRow | "new" | null>(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => {
    const text = `${row.name} ${row.sku} ${row.category} ${row.location}`.toLowerCase();
    return text.includes(query.trim().toLowerCase())
      && (category === "All Categories" || row.category === category)
      && (location === "All Locations" || row.location === location)
      && (status === "All Status" || row.status === status);
  }), [category, location, query, rows, status]);

  const inventoryMetrics: Metric[] = [
    { label: "Total Items", value: "245", note: "", accent: "blue" },
    { label: "Total Stock Value", value: "৳ 12,45,200", note: "", accent: "cyan" },
    { label: "Low Stock Items", value: String(rows.filter((row) => row.status === "Low Stock").length || 18), note: "", accent: "amber" },
    { label: "Out of Stock", value: String(rows.filter((row) => row.status === "Out of Stock").length || 3), note: "", accent: "red" },
  ];

  function saveRow(row: InventoryRow) {
    setRows((current) => current.some((item) => item.id === row.id) ? current.map((item) => item.id === row.id ? row : item) : [...current, row]);
    setMessage(`${row.name} ${editor === "new" ? "added to" : "updated in"} inventory.`);
    setEditor(null);
  }

  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={() => setEditor("new")}><Plus size={14}/>Add Stock</PrimaryButton>} description="Manage stock, track inventory and monitor product availability." title="Inventory Management"/>
      <Card className={`${styles.inventoryToolbar} ${filtersOpen ? styles.filtersOpen : ""}`}>
        <select aria-label="Filter by category" onChange={(event) => { setCategory(event.target.value); setPage(1); }} value={category}><option>All Categories</option><option>Jewelry</option><option>Diamond</option><option>Gold</option></select>
        <select aria-label="Filter by location" onChange={(event) => { setLocation(event.target.value); setPage(1); }} value={location}><option>All Locations</option><option>Main Store</option><option>Showroom</option><option>Warehouse</option></select>
        <label><Search aria-hidden="true" size={14}/><input aria-label="Search inventory" onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search product, SKU..." value={query}/></label>
        {filtersOpen ? <select aria-label="Filter by stock status" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option>All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select> : null}
        <button aria-expanded={filtersOpen} className={styles.filterButton} onClick={() => setFiltersOpen((open) => !open)} type="button"><SlidersHorizontal size={14}/>Filter</button>
      </Card>
      <Metrics icons={inventoryIcons} items={inventoryMetrics}/>
      <Card className={styles.inventoryTableCard}>
        <DataTable minWidth={870}>
          <tr className={styles.tableHead}><th>#</th><th>Product Name</th><th>Category</th><th>SKU</th><th>Stock Qty</th><th>Location</th><th>Status</th><th className={styles.center}>Actions</th></tr>
          {visibleRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.name}</td><td>{row.category}</td><td>{row.sku}</td><td>{row.quantity}</td><td>{row.location}</td><td><StatusBadge tone={row.status === "In Stock" ? "success" : row.status === "Low Stock" ? "warning" : "danger"}>{row.status}</StatusBadge></td><td className={styles.center}><span className={styles.rowActions}><IconAction label={`Edit ${row.name}`} onClick={() => setEditor(row)}><PenLine size={13}/></IconAction><IconAction danger label={`Delete ${row.name}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setMessage(`${row.name} removed from inventory.`); }}><Trash2 size={13}/></IconAction></span></td></tr>)}
          {!visibleRows.length ? <tr><td className={styles.emptyCell} colSpan={8}>No inventory items match these filters.</td></tr> : null}
        </DataTable>
        <footer className={styles.tableFooter}><span>Showing {visibleRows.length ? (page - 1) * 10 + 1 : 0} to {(page - 1) * 10 + visibleRows.length} of 245 entries</span><nav aria-label="Inventory pages"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={13}/></button>{[1,2,3,4,5].map((number) => <button aria-current={page === number ? "page" : undefined} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}<span>…</span><button aria-current={page === 25 ? "page" : undefined} onClick={() => setPage(25)} type="button">25</button><button aria-label="Next page" disabled={page === 25} onClick={() => setPage((current) => Math.min(25, current + 1))} type="button"><ChevronRight size={13}/></button></nav></footer>
      </Card>
      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>
      {editor ? <StockEditor initial={editor === "new" ? undefined : editor} onClose={() => setEditor(null)} onSave={saveRow}/> : null}
    </div>
  );
}

const reportTabs = ["Sales Report", "Purchase Report", "Stock Report", "Profit & Loss", "Cash Flow", "Customer Report"] as const;

export function Reference65ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<(typeof reportTabs)[number]>("Sales Report");
  const [rangeIndex, setRangeIndex] = useState(0);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const ranges = ["01 May 2025 - 26 May 2025", "01 Apr 2025 - 30 Apr 2025", "01 Jan 2025 - 26 May 2025"];
  return (
    <div className={styles.page}>
      <PageIntro action={<button className={styles.dateButton} onClick={() => setRangeIndex((index) => (index + 1) % ranges.length)} type="button"><CalendarDays size={14}/><span>{ranges[rangeIndex]}</span></button>} description="View detailed reports and analytics for better business decisions." title="Reports & Analytics"/>
      <nav aria-label="Report categories" className={styles.reportTabs}>{reportTabs.map((tab) => <button aria-current={activeTab === tab ? "page" : undefined} key={tab} onClick={() => setActiveTab(tab)} type="button">{tab}</button>)}</nav>
      <Metrics icons={reportIcons} items={reportMetrics}/>
      <section className={styles.reportCharts}>
        <Card className={styles.chartCard}><PanelHeader action={<div className={styles.legend}><span><i className={styles.salesLegend}/>Sales</span><span><i className={styles.purchaseLegend}/>Purchase</span></div>}>{activeTab === "Sales Report" ? "Sales & Purchase Comparison" : `${activeTab} Overview`}</PanelHeader><ComparisonChart/></Card>
        <Card className={styles.categoryCard}><PanelHeader>Sales by Category</PanelHeader><DonutReport centerLabel="Total Sales" centerValue="৳ 18,45,320" slices={categorySlices}/></Card>
      </section>
      <section className={styles.reportBottom}>
        <Card className={styles.tableCard}><PanelHeader>Top Customers</PanelHeader><DataTable minWidth={440}><tr className={styles.tableHead}><th>#</th><th>Customer Name</th><th>Total Purchase</th><th className={styles.center}>Orders</th></tr>{topCustomers.map((customer, index) => <tr key={customer.name}><td>{index+1}</td><td>{customer.name}</td><td>{customer.purchase}</td><td className={styles.center}>{customer.orders}</td></tr>)}</DataTable></Card>
        <Card className={styles.activityCard}><PanelHeader action={<button className={styles.panelLink} onClick={() => setShowAllActivities((value) => !value)} type="button">{showAllActivities ? "Show Recent" : "View All"} →</button>}>Recent Activities</PanelHeader><ul>{reportActivities.slice(0, showAllActivities ? reportActivities.length : 5).map((activity) => <li key={`${activity.text}-${activity.date}`}><i className={`${styles.activityIcon} ${styles[activity.accent]}`}><ChartNoAxesColumnIncreasing size={12}/></i><span>{activity.text}</span><time>{activity.date}</time></li>)}</ul></Card>
      </section>
    </div>
  );
}

