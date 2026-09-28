"use client";

import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Banknote,
  BookOpenText,
  CalendarCheck2,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Eye,
  FilePenLine,
  Filter,
  HandCoins,
  Landmark,
  LockKeyhole,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import { DonutReport, MultiTrendChart } from "@/features/reference-ui/report-visuals";
import {
  cashMetrics,
  cashRows,
  cashTabs,
  categorySlices,
  mortgageMetrics,
  mortgageRows,
  mortgageTabs,
  profitTrend,
  reportMetrics,
  reportTabs,
  salesTrend,
  topCustomers,
  topProducts,
  userMetrics,
  userRows,
  userTabs,
  type CashRow,
  type CashType,
  type Metric,
  type MortgageRow,
  type MortgageStatus,
  type UserRow,
  type UserStatus,
} from "./data";
import styles from "./reference-67.module.css";

const mortgageIcons = [WalletCards, HandCoins, CircleDollarSign, CalendarCheck2] as const;
const cashIcons = [Banknote, HandCoins, ReceiptText, Landmark] as const;
const reportIcons = [ChartNoAxesColumnIncreasing, ReceiptText, CircleDollarSign, WalletCards] as const;
const userIcons = [UsersRound, UserRoundCheck, UserRoundX, LockKeyhole] as const;

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

function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button className={styles.secondaryButton} onClick={onClick} type="button">{children}</button>;
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
  return <section aria-label="Summary" className={styles.metrics}>{metrics.map((metric, index) => <MetricCard icon={icons[index] ?? WalletCards} key={metric.label} metric={metric}/>)}</section>;
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

function Pager({ current, last, onChange }: { current: number; last: number; onChange: (page: number) => void }) {
  const pages = [1, 2, 3, 4, 5];
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

function PanelHeader({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return <header className={styles.panelHeader}><h2>{children}</h2>{action}</header>;
}

function formatBdt(value: FormDataEntryValue | null) {
  const number = Number(String(value ?? "0").replaceAll(",", "")) || 0;
  return `৳ ${new Intl.NumberFormat("en-IN").format(number)}`;
}

function downloadCsv(filename: string, rows: readonly (readonly (string | number)[])[]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function MortgageForm({ onClose, onSave }: { onClose: () => void; onSave: (row: MortgageRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: "MOR-10059",
      customer: String(form.get("customer")),
      weight: `${form.get("weight")} g`,
      purity: String(form.get("purity")),
      amount: formatBdt(form.get("amount")),
      interest: `${form.get("interest")}%`,
      dueDate: String(form.get("dueDate")),
      status: "Active",
    });
  }

  return (
    <Modal description="Record pledged gold and loan details." onClose={onClose} title="New Mortgage">
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Customer</span><input name="customer" placeholder="Customer name" required/></label>
        <label><span>Gold weight (g)</span><input min="0" name="weight" placeholder="22.50" required step="0.01" type="number"/></label>
        <label><span>Purity</span><select defaultValue="22K" name="purity"><option>24K</option><option>22K</option><option>21K</option><option>18K</option></select></label>
        <label><span>Loan amount</span><input min="0" name="amount" placeholder="180000" required type="number"/></label>
        <label><span>Interest (%)</span><input defaultValue="18" min="0" name="interest" required type="number"/></label>
        <label><span>Due date</span><input defaultValue="10 Jun 2025" name="dueDate" required/></label>
        <footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Save Mortgage</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

function MortgageDetails({ onClose, row }: { onClose: () => void; row: MortgageRow }) {
  return (
    <Modal description={row.customer} onClose={onClose} title={row.id}>
      <div className={styles.detailGrid}>
        <p><span>Gold weight</span><strong>{row.weight}</strong></p>
        <p><span>Purity</span><strong>{row.purity}</strong></p>
        <p><span>Loan amount</span><strong>{row.amount}</strong></p>
        <p><span>Interest / Due</span><strong>{row.interest} · {row.dueDate}</strong></p>
      </div>
    </Modal>
  );
}

export function Reference67MortgageManagement() {
  const [rows, setRows] = useState<MortgageRow[]>([...mortgageRows]);
  const [activeTab, setActiveTab] = useState<(typeof mortgageTabs)[number]>("Active Mortgages");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All Status" | MortgageStatus>("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<"new" | MortgageRow | null>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => {
    const tabMatches = activeTab === "Active Mortgages"
      ? row.status === "Active" || row.status === "Overdue"
      : row.status === activeTab;
    const queryMatches = `${row.id} ${row.customer} ${row.purity}`.toLowerCase().includes(query.trim().toLowerCase());
    return tabMatches && queryMatches && (status === "All Status" || row.status === status);
  }), [activeTab, query, rows, status]);

  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={() => setDialog("new")}><Plus size={13}/>New Mortgage</PrimaryButton>} description="Manage pledged gold and loan transactions." title="Mortgage / Pawn Management"/>
      <Metrics icons={mortgageIcons} metrics={mortgageMetrics}/>
      <Card className={styles.dataCard}>
        <Tabs active={activeTab} label="Mortgage status" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={mortgageTabs}/>
        <div className={styles.tableToolbar}>
          <SearchField onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by customer, mobile, or mortgage ID..." value={query}/>
          {showFilters ? <select aria-label="Filter mortgage status" onChange={(event) => setStatus(event.target.value as "All Status" | MortgageStatus)} value={status}><option>All Status</option><option>Active</option><option>Overdue</option><option>Released</option><option>Closed</option></select> : null}
          <button aria-expanded={showFilters} className={styles.filterButton} onClick={() => setShowFilters((current) => !current)} type="button"><Filter size={12}/>Filters</button>
        </div>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <caption className="sr-only">Mortgage and pawn records</caption>
            <thead><tr><th>Mortgage ID</th><th>Customer</th><th>Gold Weight</th><th>Purity</th><th>Loan Amount</th><th>Interest (%)</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => <tr key={row.id}><td>{row.id}</td><td>{row.customer}</td><td>{row.weight}</td><td>{row.purity}</td><td>{row.amount}</td><td>{row.interest}</td><td>{row.dueDate}</td><td><StatusBadge tone={row.status === "Active" ? "success" : row.status === "Overdue" ? "danger" : "info"}>{row.status}</StatusBadge></td><td><span className={styles.rowActions}><IconAction label={`View ${row.id}`} onClick={() => setDialog(row)}><Eye size={12}/></IconAction></span></td></tr>)}
              {!visibleRows.length ? <tr><td className={styles.emptyCell} colSpan={9}>No mortgages match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of 128 entries</span><Pager current={page} last={16} onChange={setPage}/></footer>
      </Card>
      {message ? <Feedback>{message}</Feedback> : null}
      {dialog === "new" ? <MortgageForm onClose={() => setDialog(null)} onSave={(row) => { setRows((current) => [row, ...current]); setDialog(null); setMessage(`${row.id} was added.`); }}/>: null}
      {dialog && dialog !== "new" ? <MortgageDetails onClose={() => setDialog(null)} row={dialog}/>: null}
    </div>
  );
}

type CashDialog = { mode: "new"; type: CashType } | { mode: "edit"; row: CashRow } | { mode: "view"; row: CashRow } | null;

function CashEntryForm({ dialog, onClose, onSave }: { dialog: Exclude<CashDialog, null | { mode: "view" }>; onClose: () => void; onSave: (row: CashRow) => void }) {
  const editing = dialog.mode === "edit" ? dialog.row : null;
  const entryType = dialog.mode === "edit" ? dialog.row.type : dialog.type;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = String(form.get("type")) as CashType;
    const amount = formatBdt(form.get("amount"));
    onSave({
      date: editing?.date ?? "26 May 2025",
      reference: editing?.reference ?? `${type === "Income" ? "INC" : "EXP"}-${type === "Income" ? "10079" : "10046"}`,
      description: String(form.get("description")),
      type,
      income: type === "Income" ? amount : "–",
      expense: type === "Expense" ? amount : "–",
      balance: editing?.balance ?? "৳ 2,45,780",
      paymentMode: String(form.get("paymentMode")) as "Cash" | "Bank",
    });
  }

  const amount = (editing?.income !== "–" ? editing?.income : editing?.expense)?.replaceAll(/[৳,\s]/g, "") ?? "";
  return (
    <Modal description="Add or update the cashbook transaction." onClose={onClose} title={editing ? `Edit ${editing.reference}` : `Add ${entryType}`}>
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Type</span><select defaultValue={entryType} name="type"><option>Income</option><option>Expense</option></select></label>
        <label><span>Payment mode</span><select defaultValue={editing?.paymentMode ?? "Cash"} name="paymentMode"><option>Cash</option><option>Bank</option></select></label>
        <label className={styles.fullField}><span>Description</span><input defaultValue={editing?.description} name="description" placeholder="Transaction description" required/></label>
        <label className={styles.fullField}><span>Amount</span><input defaultValue={amount} min="0" name="amount" required type="number"/></label>
        <footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Save Transaction</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference67CashAccounting() {
  const [rows, setRows] = useState<CashRow[]>([...cashRows]);
  const [activeTab, setActiveTab] = useState<(typeof cashTabs)[number]>("Cashbook");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"All Modes" | "Cash" | "Bank">("All Modes");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<CashDialog>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => {
    const tabMatches = activeTab === "Cashbook" || activeTab === "Ledger"
      ? true
      : activeTab === "Bank Accounts"
        ? row.paymentMode === "Bank"
        : row.type === activeTab;
    const queryMatches = `${row.reference} ${row.description} ${row.type}`.toLowerCase().includes(query.trim().toLowerCase());
    return tabMatches && queryMatches && (mode === "All Modes" || row.paymentMode === mode);
  }), [activeTab, mode, query, rows]);

  function save(row: CashRow) {
    setRows((current) => dialog?.mode === "edit" ? current.map((item) => item.reference === row.reference ? row : item) : [row, ...current]);
    setMessage(`${row.reference} was saved.`);
    setDialog(null);
  }

  function exportCashbook() {
    downloadCsv("cashbook-26-may-2025.csv", [
      ["Date", "Ref No", "Description", "Type", "Income", "Expense", "Balance", "Payment Mode"],
      ...rows.map((row) => [row.date, row.reference, row.description, row.type, row.income, row.expense, row.balance, row.paymentMode]),
    ]);
    setMessage("Cashbook report downloaded.");
  }

  return (
    <div className={styles.page}>
      <PageIntro action={<><PrimaryButton onClick={() => setDialog({ mode: "new", type: "Income" })}><Plus size={13}/>Add Income</PrimaryButton><PrimaryButton onClick={() => setDialog({ mode: "new", type: "Expense" })}><Plus size={13}/>Add Expense</PrimaryButton><SecondaryButton onClick={exportCashbook}><BookOpenText size={12}/>Cashbook Report</SecondaryButton></>} description="Manage cashbook, expenses, income and ledger." title="Cash & Accounting"/>
      <Metrics icons={cashIcons} metrics={cashMetrics}/>
      <Card className={styles.dataCard}>
        <Tabs active={activeTab} label="Accounting sections" onChange={(tab) => { setActiveTab(tab); setPage(1); }} tabs={cashTabs}/>
        <div className={styles.tableToolbar}>
          <SearchField onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search description, ref no, or amount..." value={query}/>
          {showFilters ? <select aria-label="Filter payment mode" onChange={(event) => setMode(event.target.value as typeof mode)} value={mode}><option>All Modes</option><option>Cash</option><option>Bank</option></select> : null}
          <button aria-expanded={showFilters} className={styles.filterButton} onClick={() => setShowFilters((current) => !current)} type="button"><Filter size={12}/>Filters</button>
        </div>
        <div className={styles.tableScroller}>
          <table className={`${styles.dataTable} ${styles.cashTable}`}>
            <caption className="sr-only">Cashbook entries</caption>
            <thead><tr><th>Date</th><th>Ref No</th><th>Description</th><th>Type</th><th>Income (৳)</th><th>Expense (৳)</th><th>Balance (৳)</th><th>Payment Mode</th><th>Action</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => <tr key={row.reference}><td>{row.date}</td><td>{row.reference}</td><td>{row.description}</td><td><StatusBadge tone={row.type === "Income" ? "success" : "warning"}>{row.type}</StatusBadge></td><td>{row.income}</td><td>{row.expense}</td><td>{row.balance}</td><td>{row.paymentMode}</td><td><span className={styles.rowActions}><IconAction label={`Edit ${row.reference}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12}/></IconAction><IconAction label={`View ${row.reference}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12}/></IconAction></span></td></tr>)}
              {!visibleRows.length ? <tr><td className={styles.emptyCell} colSpan={9}>No transactions match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of 120 entries</span><Pager current={page} last={15} onChange={setPage}/></footer>
      </Card>
      {message ? <Feedback>{message}</Feedback> : null}
      {dialog?.mode === "new" || dialog?.mode === "edit" ? <CashEntryForm dialog={dialog} onClose={() => setDialog(null)} onSave={save}/>: null}
      {dialog?.mode === "view" ? <Modal description={`${dialog.row.type} · ${dialog.row.paymentMode}`} onClose={() => setDialog(null)} title={dialog.row.reference}><div className={styles.detailGrid}><p><span>Description</span><strong>{dialog.row.description}</strong></p><p><span>Date</span><strong>{dialog.row.date}</strong></p><p><span>Amount</span><strong>{dialog.row.type === "Income" ? dialog.row.income : dialog.row.expense}</strong></p><p><span>Balance</span><strong>{dialog.row.balance}</strong></p></div></Modal>: null}
    </div>
  );
}

function SalesBars() {
  const width = 650;
  const height = 240;
  const left = 40;
  const right = 626;
  const top = 20;
  const bottom = 205;
  const max = 2;
  const groupWidth = (right - left) / salesTrend.labels.length;
  return (
    <div className={styles.chartScroller}>
      <svg aria-label="Sales and purchase trend for May 2025" className={styles.barChart} role="img" viewBox={`0 0 ${width} ${height}`}>
        {[2, 1.5, 1, .5, 0].map((value) => { const y = top + (max - value) / max * (bottom - top); return <g key={value}><line x1={left} x2={right} y1={y} y2={y}/><text x="2" y={y + 3}>{value === 0 ? "0" : value === .5 ? "500K" : `${value}M`}</text></g>; })}
        {salesTrend.labels.map((label, index) => {
          const x = left + index * groupWidth + groupWidth * .29;
          const salesHeight = salesTrend.sales[index] / max * (bottom - top);
          const purchaseHeight = salesTrend.purchase[index] / max * (bottom - top);
          return <g key={label}><rect className={styles.salesBar} height={salesHeight} rx="1.5" width={groupWidth * .13} x={x} y={bottom - salesHeight}><title>{`${label} sales: ৳ ${salesTrend.sales[index]}M`}</title></rect><rect className={styles.purchaseBar} height={purchaseHeight} rx="1.5" width={groupWidth * .13} x={x + groupWidth * .18} y={bottom - purchaseHeight}><title>{`${label} purchase: ৳ ${salesTrend.purchase[index]}M`}</title></rect><text className={styles.xLabel} textAnchor="middle" x={x + groupWidth * .15} y="229">{label}</text></g>;
        })}
      </svg>
    </div>
  );
}

function Legend({ items }: { items: readonly { color: "sales" | "purchase" | "profit" | "loss"; label: string }[] }) {
  return <div className={styles.legend}>{items.map((item) => <span key={item.label}><i className={styles[item.color]}/>{item.label}</span>)}</div>;
}

export function Reference67ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<(typeof reportTabs)[number]>("Overview");
  const [range, setRange] = useState("01 May 2025 - 26 May 2025");
  const [message, setMessage] = useState("");

  function exportReport() {
    downloadCsv("reports-and-analytics.csv", [
      ["Metric", "Value", "Change"],
      ...reportMetrics.map((metric) => [metric.label, metric.value, metric.trend ?? ""]),
      [],
      ["Top product", "Category", "Qty sold", "Sales amount"],
      ...topProducts.map((item) => [item.product, item.category, item.quantity, item.amount]),
    ]);
    setMessage(`${activeTab} downloaded.`);
  }

  return (
    <div className={styles.page}>
      <PageIntro action={<><label className={styles.dateRange}><CalendarDays size={12}/><input aria-label="Report date range" onChange={(event) => setRange(event.target.value)} value={range}/></label><PrimaryButton onClick={exportReport}><Download size={12}/>Download Report</PrimaryButton></>} description="View detailed reports and business analytics." title="Reports & Analytics"/>
      <Tabs active={activeTab} label="Report sections" onChange={setActiveTab} tabs={reportTabs}/>
      <Metrics icons={reportIcons} metrics={reportMetrics}/>
      <section className={styles.reportCharts}>
        <Card className={styles.panelCard}><PanelHeader action={<Legend items={[{ color: "sales", label: "Sales (৳)" }, { color: "purchase", label: "Purchase (৳)" }]}/>}>{activeTab === "Overview" ? "Sales Trend" : `${activeTab} Trend`}</PanelHeader><SalesBars/></Card>
        <Card className={styles.panelCard}><PanelHeader action={<Legend items={[{ color: "profit", label: "Profit (৳)" }, { color: "loss", label: "Loss (৳)" }]}/>}>Profit & Loss Trend</PanelHeader><div className={styles.lineChart}><MultiTrendChart labels={profitTrend.labels} max={2} series={[{ label: "Profit", color: "#1475ed", values: profitTrend.profit }, { label: "Loss", color: "#f34848", values: profitTrend.loss }]}/></div></Card>
      </section>
      <section className={styles.reportBottom}>
        <Card className={styles.panelCard}>
          <PanelHeader>Top Selling Products</PanelHeader>
          <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.compactTable}`}><caption className="sr-only">Top selling products</caption><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Qty Sold</th><th>Sales Amount (৳)</th></tr></thead><tbody>{topProducts.map((row, index) => <tr key={row.product}><td>{index + 1}</td><td>{row.product}</td><td>{row.category}</td><td>{row.quantity}</td><td>{row.amount}</td></tr>)}</tbody></table></div>
        </Card>
        <Card className={`${styles.panelCard} ${styles.donutCard}`}><PanelHeader>Sales by Category</PanelHeader><DonutReport centerLabel="Total Sales" centerValue="৳ 18,45,320" slices={categorySlices}/></Card>
        <Card className={styles.panelCard}>
          <PanelHeader>Top Customers</PanelHeader>
          <div className={styles.tableScroller}><table className={`${styles.dataTable} ${styles.customerTable}`}><caption className="sr-only">Top customers</caption><thead><tr><th>#</th><th>Customer</th><th>Total Purchase (৳)</th></tr></thead><tbody>{topCustomers.map((row, index) => <tr key={row.customer}><td>{index + 1}</td><td>{row.customer}</td><td>{row.purchase}</td></tr>)}</tbody></table></div>
        </Card>
      </section>
      {message ? <Feedback>{message}</Feedback> : null}
    </div>
  );
}

type UserDialog = { mode: "new" } | { mode: "edit"; row: UserRow } | null;

function UserForm({ dialog, onClose, onSave }: { dialog: Exclude<UserDialog, null>; onClose: () => void; onSave: (row: UserRow) => void }) {
  const editing = dialog.mode === "edit" ? dialog.row : null;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: editing?.id ?? 9,
      name: String(form.get("name")),
      email: String(form.get("email")),
      role: String(form.get("role")),
      status: String(form.get("status")) as UserStatus,
      lastLogin: editing?.lastLogin ?? "Never",
    });
  }
  return (
    <Modal description="Manage account access and role details." onClose={onClose} title={editing ? `Edit ${editing.name}` : "Add User"}>
      <form className={styles.modalForm} onSubmit={submit}>
        <label><span>Name</span><input defaultValue={editing?.name} name="name" required/></label>
        <label><span>Email</span><input defaultValue={editing?.email} name="email" required type="email"/></label>
        <label><span>Role</span><select defaultValue={editing?.role ?? "Sales Executive"} name="role"><option>Super Admin</option><option>Manager</option><option>Accountant</option><option>Sales Executive</option><option>Inventory Incharge</option><option>Cashier</option><option>Viewer</option></select></label>
        <label><span>Status</span><select defaultValue={editing?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
        <footer><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit">Save User</PrimaryButton></footer>
      </form>
    </Modal>
  );
}

export function Reference67UsersSecurity() {
  const [rows, setRows] = useState<UserRow[]>([...userRows]);
  const [activeTab, setActiveTab] = useState<(typeof userTabs)[number]>("Users");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState<"All Status" | UserStatus>("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [dialog, setDialog] = useState<UserDialog>(null);
  const [message, setMessage] = useState("");

  const roles = useMemo(() => ["All Roles", ...new Set(rows.map((row) => row.role))], [rows]);
  const visibleRows = useMemo(() => rows.filter((row) => {
    const queryMatches = `${row.name} ${row.email} ${row.role}`.toLowerCase().includes(query.trim().toLowerCase());
    return queryMatches && (role === "All Roles" || row.role === role) && (status === "All Status" || row.status === status);
  }), [query, role, rows, status]);

  function save(row: UserRow) {
    setRows((current) => dialog?.mode === "edit" ? current.map((item) => item.id === row.id ? row : item) : [...current, row]);
    setMessage(`${row.name} was saved.`);
    setDialog(null);
  }

  function remove(row: UserRow) {
    setRows((current) => current.filter((item) => item.id !== row.id));
    setMessage(`${row.name} was removed.`);
  }

  return (
    <div className={styles.page}>
      <PageIntro action={<PrimaryButton onClick={() => setDialog({ mode: "new" })}><Plus size={13}/>Add User</PrimaryButton>} description="Manage system users, roles, permissions and activity logs." title="Users & Security"/>
      <Card className={styles.dataCard}>
        <Tabs active={activeTab} label="User security sections" onChange={setActiveTab} tabs={userTabs}/>
        {activeTab === "Users" ? <>
          <div className={styles.tableToolbar}>
            <SearchField onChange={setQuery} placeholder="Search by name, email, or role..." value={query}/>
            {showFilters ? <><select aria-label="Filter by role" onChange={(event) => setRole(event.target.value)} value={role}>{roles.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by status" onChange={(event) => setStatus(event.target.value as typeof status)} value={status}><option>All Status</option><option>Active</option><option>Inactive</option></select></> : null}
            <button aria-expanded={showFilters} className={styles.filterButton} onClick={() => setShowFilters((current) => !current)} type="button"><Filter size={12}/>Filters</button>
          </div>
          <div className={styles.tableScroller}>
            <table className={`${styles.dataTable} ${styles.userTable}`}>
              <caption className="sr-only">System users</caption>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>{visibleRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.name}</td><td>{row.email}</td><td>{row.role}</td><td><StatusBadge tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusBadge></td><td>{row.lastLogin}</td><td><span className={styles.rowActions}><IconAction label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12}/></IconAction><IconAction danger label={`Delete ${row.name}`} onClick={() => remove(row)}><Trash2 size={12}/></IconAction></span></td></tr>)}</tbody>
            </table>
          </div>
        </> : <div className={styles.tabPlaceholder}><ShieldCheck size={28}/><strong>{activeTab}</strong><p>Select and manage {activeTab.toLowerCase()} for your team.</p></div>}
      </Card>
      <Metrics icons={userIcons} metrics={userMetrics.map((metric, index) => index === 0 ? { ...metric, value: String(rows.length) } : index === 1 ? { ...metric, value: String(rows.filter((row) => row.status === "Active").length) } : index === 2 ? { ...metric, value: String(rows.filter((row) => row.status === "Inactive").length) } : metric)}/>
      {message ? <Feedback>{message}</Feedback> : null}
      {dialog ? <UserForm dialog={dialog} onClose={() => setDialog(null)} onSave={save}/>: null}
    </div>
  );
}
