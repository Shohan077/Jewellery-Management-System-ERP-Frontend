"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileClock,
  Filter,
  KeyRound,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundCog,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  oldGoldEntries,
  oldGoldMetrics,
  oldGoldTabs,
  paymentModes,
  productionMetrics,
  productionOrders,
  productionTabs,
  recentActivities,
  reportMetrics,
  reportTabs,
  salesCategories,
  salesTrend,
  securityShortcuts,
  securityUsers,
  topSellingProducts,
  userMetrics,
  userTabs,
  type Metric,
  type OldGoldEntry,
  type ProductionOrder,
  type ProductionStatus,
  type SecurityUser,
  type UserStatus,
} from "./data";
import styles from "./reference-70.module.css";

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

function SecondaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button className={styles.secondaryButton} onClick={onClick} type={type}>{children}</button>;
}

function Metrics({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <section aria-label="Summary" className={styles.metrics} style={{ "--metric-count": metrics.length } as CSSProperties}>
      {metrics.map((metric) => (
        <Card as="article" className={styles.metricCard} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.trend ? <b className={metric.tone === "danger" ? styles.dangerText : undefined}>{metric.trend}</b> : null}{metric.trend ? " " : ""}{metric.note}</small>
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

function TableToolbar({ filterLabel = "Filters", onFilter, onQuery, placeholder, query }: { filterLabel?: string; onFilter: () => void; onQuery: (value: string) => void; placeholder: string; query: string }) {
  return (
    <div className={styles.tableToolbar}>
      <SearchField onChange={onQuery} placeholder={placeholder} value={query}/>
      <SecondaryButton onClick={onFilter}><Filter size={12}/>{filterLabel}</SecondaryButton>
    </div>
  );
}

function Pager({ current, last, onChange }: { current: number; last: number; onChange: (page: number) => void }) {
  const visible = last <= 6 ? Array.from({ length: last }, (_, index) => index + 1) : [1, 2, 3, 4, 5];
  return (
    <nav aria-label="Table pages" className={styles.pagination}>
      <button aria-label="Previous page" disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))} type="button"><ChevronLeft size={12}/></button>
      {visible.map((page) => <button aria-current={page === current ? "page" : undefined} key={page} onClick={() => onChange(page)} type="button">{page}</button>)}
      {last > 6 ? <span>…</span> : null}
      {last > 6 ? <button aria-current={last === current ? "page" : undefined} onClick={() => onChange(last)} type="button">{last}</button> : null}
      <button aria-label="Next page" disabled={current === last} onClick={() => onChange(Math.min(last, current + 1))} type="button"><ChevronRight size={12}/></button>
    </nav>
  );
}

function TableFooter({ current, last, onChange, text }: { current: number; last: number; onChange: (page: number) => void; text: string }) {
  return <footer className={styles.tableFooter}><span>{text}</span><Pager current={current} last={last} onChange={onChange}/></footer>;
}

function StatusPill({ children, tone }: { children: ReactNode; tone: "success" | "info" | "warning" | "danger" }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

function IconButton({ children, danger = false, label, onClick }: { children: ReactNode; danger?: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} className={`${styles.iconButton} ${danger ? styles.iconDanger : ""}`} onClick={onClick} title={label} type="button">{children}</button>;
}

function Feedback({ children }: { children: string }) {
  return <p aria-live="polite" className={`${styles.feedback} ${children ? styles.feedbackVisible : ""}`}>{children || "Ready"}</p>;
}

function Dialog({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <Card aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}><div><h2>{title}</h2><p>{description}</p></div><button aria-label="Close dialog" onClick={onClose} type="button"><X size={17}/></button></header>
        {children}
      </Card>
    </div>
  );
}

function EmptyRows({ colSpan, message = "No matching records found." }: { colSpan: number; message?: string }) {
  return <tr><td className={styles.emptyCell} colSpan={colSpan}>{message}</td></tr>;
}

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function AddOldGoldDialog({ onClose, onSave }: { onClose: () => void; onSave: (entry: OldGoldEntry) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = field(form, "type") as OldGoldEntry["type"];
    const weight = Number(field(form, "weight"));
    const rate = Number(field(form, "rate"));
    onSave({
      id: `${type === "Purchase" ? "OGP" : "OGX"}-${String(Date.now()).slice(-5)}`,
      date: "26 May 2025",
      customer: field(form, "customer"),
      type,
      weight: weight.toFixed(3),
      rate: rate.toLocaleString("en-IN"),
      value: Math.round(weight * rate).toLocaleString("en-IN"),
      profit: Math.round(weight * rate * 0.05).toLocaleString("en-IN"),
      status: field(form, "status") as OldGoldEntry["status"],
    });
  }
  return <Dialog description="Record a purchase or jewellery exchange." onClose={onClose} title="New Old Gold Entry"><form className={styles.modalForm} onSubmit={submit}><label><span>Customer</span><input name="customer" placeholder="Customer name" required/></label><label><span>Entry Type</span><select name="type"><option>Purchase</option><option>Exchange</option></select></label><label><span>Weight (g)</span><input min="0.001" name="weight" required step="0.001" type="number"/></label><label><span>Rate (৳/g)</span><input min="1" name="rate" required type="number"/></label><label><span>Status</span><select name="status"><option>Completed</option><option>Pending</option></select></label><footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Save Entry</PrimaryButton></footer></form></Dialog>;
}

function AddProductionDialog({ onClose, onSave }: { onClose: () => void; onSave: (order: ProductionOrder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({ id: `PROD-${String(Date.now()).slice(-5)}`, item: field(form, "item"), karigar: field(form, "karigar"), quantity: Number(field(form, "quantity")), weight: Number(field(form, "weight")).toFixed(3), status: field(form, "status") as ProductionStatus, startDate: "26 May 2025", dueDate: field(form, "dueDate") });
  }
  return <Dialog description="Create a production order and assign it to a karigar." onClose={onClose} title="New Production Order"><form className={styles.modalForm} onSubmit={submit}><label><span>Item / Design</span><input name="item" placeholder="Gold Necklace 22K" required/></label><label><span>Karigar</span><input name="karigar" placeholder="Karigar name" required/></label><label><span>Quantity</span><input min="1" name="quantity" required type="number"/></label><label><span>Weight (g)</span><input min="0.001" name="weight" required step="0.001" type="number"/></label><label><span>Status</span><select name="status"><option>In Progress</option><option>Pending</option><option>Completed</option></select></label><label><span>Due Date</span><input defaultValue="30 May 2025" name="dueDate" required/></label><footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Create Order</PrimaryButton></footer></form></Dialog>;
}

function AddUserDialog({ onClose, onSave }: { onClose: () => void; onSave: (user: SecurityUser) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({ id: Date.now(), name: field(form, "name"), email: field(form, "email"), role: field(form, "role"), status: field(form, "status") as UserStatus, lastLogin: "Never" });
  }
  return <Dialog description="Create an account and assign its access role." onClose={onClose} title="Add User"><form className={styles.modalForm} onSubmit={submit}><label><span>Full Name</span><input name="name" placeholder="Full name" required/></label><label><span>Email</span><input name="email" placeholder="name@jewelleryerp.com" required type="email"/></label><label><span>Role</span><select name="role"><option>Manager</option><option>Accountant</option><option>Sales Executive</option><option>Inventory Incharge</option><option>Viewer</option></select></label><label><span>Status</span><select name="status"><option>Active</option><option>Inactive</option></select></label><footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Add User</PrimaryButton></footer></form></Dialog>;
}

export function Reference70OldGoldExchange() {
  const [entries, setEntries] = useState<OldGoldEntry[]>([...oldGoldEntries]);
  const [activeTab, setActiveTab] = useState<(typeof oldGoldTabs)[number]>("All Entries");
  const [query, setQuery] = useState("");
  const [completedOnly, setCompletedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(false);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => entries.filter((entry) => {
    const tabMatch = activeTab === "All Entries" || (activeTab === "Old Gold Purchase" && entry.type === "Purchase") || activeTab === entry.type;
    const queryMatch = `${entry.id} ${entry.customer} ${entry.type} ${entry.status}`.toLowerCase().includes(query.toLowerCase());
    return tabMatch && queryMatch && (!completedOnly || entry.status === "Completed");
  }), [activeTab, completedOnly, entries, query]);
  return <div className={styles.page}><PageIntro action={<PrimaryButton onClick={() => setDialog(true)}><Plus size={13}/>New Old Gold Entry</PrimaryButton>} description="Manage old gold purchase, exchange and valuation." title="Old Gold / Exchange"/><Metrics metrics={oldGoldMetrics}/><Card className={styles.tableCard}><Tabs active={activeTab} label="Old gold views" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={oldGoldTabs}/><TableToolbar filterLabel={completedOnly ? "Completed" : "Filters"} onFilter={() => setCompletedOnly((value) => !value)} onQuery={setQuery} placeholder="Search by customer, mobile, invoice no..." query={query}/><div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.oldGoldTable}`}><caption className="sr-only">Old gold entries</caption><thead><tr><th>#</th><th>Invoice No</th><th>Date</th><th>Customer</th><th>Type</th><th>Weight (g)</th><th>Rate (৳/g)</th><th>Value (৳)</th><th>Profit (৳)</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.length ? visible.map((entry, index) => <tr key={entry.id}><td>{index + 1}</td><td>{entry.id}</td><td>{entry.date}</td><td>{entry.customer}</td><td>{entry.type}</td><td>{entry.weight}</td><td>{entry.rate}</td><td>{entry.value}</td><td>{entry.profit}</td><td><StatusPill tone={entry.status === "Completed" ? "success" : "warning"}>{entry.status}</StatusPill></td><td><span className={styles.rowActions}><IconButton label={`View ${entry.id}`} onClick={() => setMessage(`${entry.id} details opened.`)}><Eye size={12}/></IconButton><IconButton label={`Open receipt ${entry.id}`} onClick={() => setMessage(`${entry.id} receipt is ready.`)}><ReceiptText size={12}/></IconButton></span></td></tr>) : <EmptyRows colSpan={11}/>}</tbody></table></div><TableFooter current={page} last={6} onChange={setPage} text={`Showing 1 to ${visible.length} of ${query || activeTab !== "All Entries" ? visible.length : 48} entries`}/></Card>{dialog ? <AddOldGoldDialog onClose={() => setDialog(false)} onSave={(entry) => { setEntries((rows) => [entry, ...rows]); setDialog(false); setMessage(`${entry.id} was added successfully.`); }}/> : null}<Feedback>{message}</Feedback></div>;
}

export function Reference70ManufacturingProduction() {
  const [orders, setOrders] = useState<ProductionOrder[]>([...productionOrders]);
  const [activeTab, setActiveTab] = useState<(typeof productionTabs)[number]>("All Orders");
  const [query, setQuery] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(false);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => orders.filter((order) => {
    const tabMatch = activeTab === "All Orders" || activeTab === order.status;
    const queryMatch = `${order.id} ${order.item} ${order.karigar} ${order.status}`.toLowerCase().includes(query.toLowerCase());
    return tabMatch && queryMatch && (!pendingOnly || order.status === "Pending");
  }), [activeTab, orders, pendingOnly, query]);
  return <div className={styles.page}><PageIntro action={<PrimaryButton onClick={() => setDialog(true)}><Plus size={13}/>New Production Order</PrimaryButton>} description="Manage production orders, material issue and finished goods." title="Manufacturing / Production"/><Metrics metrics={productionMetrics}/><Card className={styles.tableCard}><Tabs active={activeTab} label="Production views" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={productionTabs}/><TableToolbar filterLabel={pendingOnly ? "Pending" : "Filters"} onFilter={() => setPendingOnly((value) => !value)} onQuery={setQuery} placeholder="Search by order no, item name, karigar..." query={query}/><div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.productionTable}`}><caption className="sr-only">Production orders</caption><thead><tr><th>Order No</th><th>Item / Design</th><th>Karigar</th><th>Qty</th><th>Weight (g)</th><th>Status</th><th>Start Date</th><th>Due Date</th><th>Actions</th></tr></thead><tbody>{visible.length ? visible.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.item}</td><td>{order.karigar}</td><td>{order.quantity}</td><td>{order.weight}</td><td><StatusPill tone={order.status === "Completed" ? "success" : order.status === "In Progress" ? "info" : "warning"}>{order.status}</StatusPill></td><td>{order.startDate}</td><td>{order.dueDate}</td><td><span className={styles.rowActions}><IconButton label={`Edit ${order.id}`} onClick={() => setMessage(`${order.id} is ready to edit.`)}><Pencil size={12}/></IconButton><IconButton label={`View ${order.id}`} onClick={() => setMessage(`${order.id} details opened.`)}><Eye size={12}/></IconButton></span></td></tr>) : <EmptyRows colSpan={9} message={activeTab === "Material Issue" || activeTab === "Wastage" ? `${activeTab} records will appear here.` : undefined}/>}</tbody></table></div><TableFooter current={page} last={9} onChange={setPage} text={`Showing 1 to ${visible.length} of ${query || activeTab !== "All Orders" ? visible.length : 72} entries`}/></Card>{dialog ? <AddProductionDialog onClose={() => setDialog(false)} onSave={(order) => { setOrders((rows) => [order, ...rows]); setDialog(false); setMessage(`${order.id} was created successfully.`); }}/> : null}<Feedback>{message}</Feedback></div>;
}

const chartBox = { left: 42, right: 598, top: 22, bottom: 185 } as const;
function linePoints(values: readonly number[]) {
  return values.map((value, index) => `${chartBox.left + index / (values.length - 1) * (chartBox.right - chartBox.left)},${chartBox.top + (2 - value) / 2 * (chartBox.bottom - chartBox.top)}`).join(" ");
}

function SalesPurchaseChart() {
  const grid = [2, 1.5, 1, .5, 0];
  return <div className={styles.chart}><div className={styles.chartLegend}><span><i className={styles.salesKey}/>Sales (৳)</span><span><i className={styles.purchaseKey}/>Purchase (৳)</span></div><div className={styles.chartScroll}><svg aria-label="Sales and purchase trend" role="img" viewBox="0 0 620 220">{grid.map((value) => { const y = chartBox.top + (2 - value) / 2 * (chartBox.bottom - chartBox.top); return <g key={value}><line x1={chartBox.left} x2={chartBox.right} y1={y} y2={y}/><text x="2" y={y + 4}>{value ? `${value}M` : "0"}</text></g>; })}<polyline className={styles.salesLine} points={linePoints(salesTrend.sales)}/><polyline className={styles.purchaseLine} points={linePoints(salesTrend.purchase)}/>{salesTrend.sales.map((value, index) => <circle className={styles.salesDot} cx={chartBox.left + index / (salesTrend.sales.length - 1) * (chartBox.right - chartBox.left)} cy={chartBox.top + (2 - value) / 2 * (chartBox.bottom - chartBox.top)} key={`s-${index}` } r="3"/>)}{salesTrend.purchase.map((value, index) => <circle className={styles.purchaseDot} cx={chartBox.left + index / (salesTrend.purchase.length - 1) * (chartBox.right - chartBox.left)} cy={chartBox.top + (2 - value) / 2 * (chartBox.bottom - chartBox.top)} key={`p-${index}`} r="3"/>)}{salesTrend.labels.map((label, index) => <text className={styles.xLabel} key={label} textAnchor={index === 0 ? "start" : index === salesTrend.labels.length - 1 ? "end" : "middle"} x={chartBox.left + index / (salesTrend.labels.length - 1) * (chartBox.right - chartBox.left)} y="211">{label}</text>)}</svg></div></div>;
}

function Donut({ centerLabel, centerValue, slices }: { centerLabel: string; centerValue: string; slices: readonly { color: string; label: string; value: number }[] }) {
  const stops = slices.map((slice, index) => {
    const start = slices.slice(0, index).reduce((total, item) => total + item.value, 0);
    return `${slice.color} ${start}% ${start + slice.value}%`;
  });
  return <div className={styles.donutLayout}><div className={styles.donut} style={{ "--donut": `conic-gradient(${stops.join(",")})` } as CSSProperties}><span><strong>{centerValue}</strong><small>{centerLabel}</small></span></div><ul>{slices.map((slice) => <li key={slice.label}><i style={{ background: slice.color }}/><span>{slice.label}</span><b>{slice.value}%</b></li>)}</ul></div>;
}

function exportReport() {
  const rows = [["Metric", "Value", "Change"], ...reportMetrics.map((metric) => [metric.label, metric.value, metric.trend ?? ""])];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "jewellery-erp-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function Reference70ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<(typeof reportTabs)[number]>("Overview");
  return <div className={styles.page}><PageIntro action={<PrimaryButton onClick={exportReport}><Download size={13}/>Export Report</PrimaryButton>} description="View detailed business reports and analytics." title="Reports & Analytics"/><Card className={styles.reportTabs}><Tabs active={activeTab} label="Report type" onChange={setActiveTab} tabs={reportTabs}/></Card>{activeTab === "Overview" ? <><Metrics metrics={reportMetrics}/><section className={styles.reportTop}><Card className={styles.reportCard}><header><h2>Sales Vs Purchase Trend</h2></header><SalesPurchaseChart/></Card><Card className={styles.reportCard}><header><h2>Top Categories by Sales</h2></header><Donut centerLabel="Total Sales" centerValue="৳ 18,45,320" slices={salesCategories}/></Card></section><section className={styles.reportBottom}><Card className={styles.reportCard}><header><h2>Top Selling Products</h2></header><div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.productsTable}`}><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Qty Sold</th><th>Sales Amount (৳)</th></tr></thead><tbody>{topSellingProducts.map((product, index) => <tr key={product.product}><td>{index + 1}</td><td>{product.product}</td><td>{product.category}</td><td>{product.quantity}</td><td>{product.amount}</td></tr>)}</tbody></table></div></Card><Card className={styles.reportCard}><header><h2>Sales by Payment Mode</h2></header><Donut centerLabel="Total Sales" centerValue="৳ 18,45,320" slices={paymentModes}/></Card><Card className={styles.reportCard}><header><h2>Recent Activities</h2></header><ul className={styles.activities}>{recentActivities.map((activity) => <li key={activity.title}><span><Activity size={11}/></span><div><b>{activity.title}</b><small>{activity.time}</small></div></li>)}</ul></Card></section></> : <Card className={styles.reportPlaceholder}><BarChart3 size={34}/><strong>{activeTab}</strong><p>Select filters and export this report when it is ready.</p><SecondaryButton onClick={() => setActiveTab("Overview")}>Back to Overview</SecondaryButton></Card>}</div>;
}

const shortcutIcons = [UserRoundCog, KeyRound, FileClock, ShieldCheck] as const;

export function Reference70UsersSecurity() {
  const [users, setUsers] = useState<SecurityUser[]>([...securityUsers]);
  const [activeTab, setActiveTab] = useState<(typeof userTabs)[number]>("Users");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [dialog, setDialog] = useState(false);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()) && (statusFilter === "All" || user.status === statusFilter)), [query, statusFilter, users]);
  function cycleStatus() { setStatusFilter((value) => value === "All" ? "Active" : value === "Active" ? "Inactive" : "All"); }
  return <div className={styles.page}><PageIntro action={<PrimaryButton onClick={() => setDialog(true)}><Plus size={13}/>Add User</PrimaryButton>} description="Manage users, roles, permissions and security settings." title="Users & Security"/><Card className={styles.userPanel}><Tabs active={activeTab} label="Security views" onChange={setActiveTab} tabs={userTabs}/>{activeTab === "Users" ? <><Metrics metrics={userMetrics}/><TableToolbar filterLabel={statusFilter === "All" ? "Filters" : statusFilter} onFilter={cycleStatus} onQuery={setQuery} placeholder="Search by name, email, role..." query={query}/><div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.usersTable}`}><caption className="sr-only">System users</caption><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>{visible.length ? visible.map((user, index) => <tr key={user.id}><td>{index + 1}</td><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><StatusPill tone={user.status === "Active" ? "success" : "danger"}>{user.status}</StatusPill></td><td>{user.lastLogin}</td><td><span className={styles.rowActions}><IconButton label={`Edit ${user.name}`} onClick={() => setMessage(`${user.name}'s account is ready to edit.`)}><Pencil size={12}/></IconButton><IconButton danger label={`Delete ${user.name}`} onClick={() => { setUsers((rows) => rows.filter((row) => row.id !== user.id)); setMessage(`${user.name} was removed.`); }}><Trash2 size={12}/></IconButton></span></td></tr>) : <EmptyRows colSpan={7}/>}</tbody></table></div></> : <section className={styles.securityPlaceholder}><ShieldCheck size={34}/><strong>{activeTab}</strong><p>Manage {activeTab.toLowerCase()} for your jewellery ERP team.</p></section>}</Card><section className={styles.securityShortcuts}>{securityShortcuts.map((shortcut, index) => { const Icon = shortcutIcons[index]; return <button key={shortcut.title} onClick={() => setActiveTab(shortcut.tab)} type="button"><Icon size={24}/><span><b>{shortcut.title}</b><strong>{shortcut.value}</strong><small>{shortcut.description}</small></span></button>; })}</section>{dialog ? <AddUserDialog onClose={() => setDialog(false)} onSave={(user) => { setUsers((rows) => [user, ...rows]); setDialog(false); setActiveTab("Users"); setMessage(`${user.name} was added successfully.`); }}/> : null}<Feedback>{message}</Feedback></div>;
}
