"use client";

import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  alertBranches,
  alertCategories,
  getStockAlertStatus,
  stockAlertItems,
  type StockAlertItem,
  type StockAlertStatus,
} from "./stock-alert-data";
import styles from "./stock-alerts.module.css";

const PAGE_SIZE = 10;
type StatusFilter = "All Status" | StockAlertStatus | "Reorder Pending";
type AlertSettings = {
  defaultMinimum: number;
  criticalLevel: number;
  reminderHours: number;
  dashboardAlerts: boolean;
  emailAlerts: boolean;
  autoReorder: boolean;
};
type DialogState =
  | { mode: "settings" }
  | { mode: "view" | "edit" | "reorder"; item: StockAlertItem };

const initialSettings: AlertSettings = {
  defaultMinimum: 10,
  criticalLevel: 2,
  reminderHours: 24,
  dashboardAlerts: true,
  emailAlerts: true,
  autoReorder: false,
};

function ModalShell({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-describedby="stock-alert-dialog-description" aria-labelledby="stock-alert-dialog-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="stock-alert-dialog-title">{title}</h2>
            <p id="stock-alert-dialog-description">{description}</p>
          </div>
          <button aria-label={`Close ${title}`} onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function SettingsForm({ current, onCancel, onSave }: { current: AlertSettings; onCancel: () => void; onSave: (settings: AlertSettings) => void }) {
  const [draft, setDraft] = useState(current);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <form className={styles.settingsForm} onSubmit={submit}>
      <div className={styles.settingsGrid}>
        <label><span>Default minimum level</span><input autoFocus className="field" min="1" onChange={(event) => setDraft((value) => ({ ...value, defaultMinimum: Number(event.target.value) }))} required type="number" value={draft.defaultMinimum} /></label>
        <label><span>Critical stock level</span><input className="field" min="0" onChange={(event) => setDraft((value) => ({ ...value, criticalLevel: Number(event.target.value) }))} required type="number" value={draft.criticalLevel} /></label>
        <label className={styles.wideField}><span>Repeat unresolved alerts every</span><select className="select" onChange={(event) => setDraft((value) => ({ ...value, reminderHours: Number(event.target.value) }))} value={draft.reminderHours}><option value="6">6 hours</option><option value="12">12 hours</option><option value="24">24 hours</option><option value="48">48 hours</option></select></label>
      </div>
      <fieldset className={styles.toggleGroup}>
        <legend>Notification channels</legend>
        <label><input checked={draft.dashboardAlerts} onChange={(event) => setDraft((value) => ({ ...value, dashboardAlerts: event.target.checked }))} type="checkbox" /><span><strong>Dashboard alerts</strong><small>Show alerts inside Jewellery ERP.</small></span></label>
        <label><input checked={draft.emailAlerts} onChange={(event) => setDraft((value) => ({ ...value, emailAlerts: event.target.checked }))} type="checkbox" /><span><strong>Email notifications</strong><small>Send stock warnings to inventory managers.</small></span></label>
        <label><input checked={draft.autoReorder} onChange={(event) => setDraft((value) => ({ ...value, autoReorder: event.target.checked }))} type="checkbox" /><span><strong>Automatic reorder drafts</strong><small>Create a draft purchase order at the critical level.</small></span></label>
      </fieldset>
      <footer className={styles.modalActions}><button className="button" onClick={onCancel} type="button">Cancel</button><button className="button button--primary" type="submit"><Settings2 aria-hidden="true" size={15} />Save Settings</button></footer>
    </form>
  );
}

function StatusBadge({ status }: { status: StockAlertStatus }) {
  return <span className={`${styles.statusBadge} ${status === "Out of Stock" ? styles.outStatus : styles.lowStatus}`}>{status}</span>;
}

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
}

export function StockAlerts() {
  const [items, setItems] = useState(stockAlertItems);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [categoryDraft, setCategoryDraft] = useState("All Categories");
  const [branchDraft, setBranchDraft] = useState("All Branches");
  const [statusDraft, setStatusDraft] = useState<StatusFilter>("All Status");
  const [category, setCategory] = useState("All Categories");
  const [branch, setBranch] = useState("All Branches");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({
    low: items.filter((item) => getStockAlertStatus(item) === "Low Stock").length,
    out: items.filter((item) => getStockAlertStatus(item) === "Out of Stock").length,
    reorder: items.filter((item) => item.reorderPending).length,
    today: items.filter((item) => item.lastAlert.startsWith("Today")).length,
  }), [items]);

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return items.filter((item) => {
      const itemStatus = getStockAlertStatus(item);
      const matchesSearch = !search || [item.productName, item.code, item.category].some((value) => value.toLowerCase().includes(search));
      const matchesCategory = category === "All Categories" || item.category === category;
      const matchesBranch = branch === "All Branches" || item.branch === branch;
      const matchesStatus = status === "All Status" || (status === "Reorder Pending" ? item.reorderPending : itemStatus === status);
      return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
    });
  }, [branch, category, deferredQuery, items, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const visibleItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function applyFilters() {
    setCategory(categoryDraft);
    setBranch(branchDraft);
    setStatus(statusDraft);
    setPage(1);
    setMessage(categoryDraft === "All Categories" && branchDraft === "All Branches" && statusDraft === "All Status" ? "Stock alert filters cleared." : "Stock alert filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setCategoryDraft("All Categories");
    setBranchDraft("All Branches");
    setStatusDraft("All Status");
    setCategory("All Categories");
    setBranch("All Branches");
    setStatus("All Status");
    setPage(1);
    setMessage("All stock alert filters cleared.");
  }

  function saveMinimumLevel(event: FormEvent<HTMLFormElement>, item: StockAlertItem) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const minimumLevel = Math.max(item.currentStock + 1, Math.round(Number(form.get("minimumLevel"))));
    setItems((current) => current.map((record) => record.id === item.id ? { ...record, minimumLevel } : record));
    setDialog(null);
    setMessage(`${item.productName}'s minimum stock level was updated to ${minimumLevel} pcs.`);
  }

  function createReorder(event: FormEvent<HTMLFormElement>, item: StockAlertItem) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const quantity = Math.max(1, Math.round(Number(form.get("quantity"))));
    const supplier = String(form.get("supplier"));
    setItems((current) => current.map((record) => record.id === item.id ? { ...record, reorderPending: true } : record));
    setDialog(null);
    setMessage(`Reorder draft created for ${quantity} pcs of ${item.productName} from ${supplier}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className="button button--primary" onClick={() => setDialog({ mode: "settings" })} type="button"><Plus aria-hidden="true" size={16} />Alert Settings</button>}
        description="Monitor low stock items and set alerts"
        title="Stock Alerts"
      />

      <section aria-label="Stock alert summary" className={styles.metrics}>
        <Card as="article" className={styles.metricCard}><span>Low Stock Items</span><strong className={styles.redMetric}>{metrics.low}</strong></Card>
        <Card as="article" className={styles.metricCard}><span>Out of Stock</span><strong className={styles.redMetric}>{metrics.out}</strong></Card>
        <Card as="article" className={styles.metricCard}><span>Reorder Pending</span><strong className={styles.orangeMetric}>{metrics.reorder}</strong></Card>
        <Card as="article" className={styles.metricCard}><span>Alerts Today</span><strong className={styles.blueMetric}>{metrics.today}</strong></Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}><Search aria-hidden="true" size={16} /><span className="sr-only">Search stock alerts</span><input onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by product name or code..." type="search" value={query} /></label>
          <label className={styles.selectField}><span className="sr-only">Filter by category</span><select onChange={(event) => setCategoryDraft(event.target.value)} value={categoryDraft}><option>All Categories</option>{alertCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by branch</span><select onChange={(event) => setBranchDraft(event.target.value)} value={branchDraft}><option>All Branches</option>{alertBranches.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => setStatusDraft(event.target.value as StatusFilter)} value={statusDraft}><option>All Status</option><option>Low Stock</option><option>Out of Stock</option><option>Reorder Pending</option></select></label>
          <button className={`button ${styles.filterButton}`} onClick={applyFilters} type="button"><Filter aria-hidden="true" size={15} />Filter</button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Products requiring stock attention</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Product Name</th><th scope="col">Code</th><th scope="col">Category</th><th scope="col">Current Stock</th><th scope="col">Min. Level</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleItems.map((item, index) => {
                const itemStatus = getStockAlertStatus(item);
                return (
                  <tr key={item.id}>
                    <td>{startIndex + index + 1}</td><td><strong>{item.productName}</strong></td><td className={styles.code}>{item.code}</td><td>{item.category}</td>
                    <td className={item.currentStock === 0 ? styles.zeroStock : styles.numeric}>{item.currentStock} <small>{item.unit}</small></td>
                    <td className={styles.numeric}>{item.minimumLevel} <small>{item.unit}</small></td><td><StatusBadge status={itemStatus} /></td>
                    <td><div className={styles.actions}><button aria-label={`View ${item.productName}`} onClick={() => setDialog({ mode: "view", item })} type="button"><Eye aria-hidden="true" size={13} /></button><button aria-label={`Edit ${item.productName} alert`} onClick={() => setDialog({ mode: "edit", item })} type="button"><Pencil aria-hidden="true" size={13} /></button><button aria-label={`${item.reorderPending ? "View pending reorder for" : "Create reorder for"} ${item.productName}`} className={item.reorderPending ? styles.pendingAction : ""} onClick={() => setDialog({ mode: "reorder", item })} type="button"><Plus aria-hidden="true" size={14} /></button></div></td>
                  </tr>
                );
              })}
              {!visibleItems.length ? <tr><td className={styles.emptyState} colSpan={8}><CircleAlert aria-hidden="true" size={28} /><strong>No stock alerts found</strong><span>Try another search or clear the selected filters.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>Showing {filtered.length ? startIndex + 1 : 0} to {Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString("en-US")} items</p>
          <nav aria-label="Stock alerts pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {paginationItems(activePage, pageCount).map((entry, index) => entry === "ellipsis" ? <span aria-hidden="true" key={`ellipsis-${index}`}>…</span> : <button aria-current={entry === activePage ? "page" : undefined} className={entry === activePage ? styles.currentPage : ""} key={entry} onClick={() => setPage(entry)} type="button">{entry}</button>)}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog?.mode === "settings" ? <ModalShell description="Choose when and how inventory managers receive stock warnings." onClose={() => setDialog(null)} title="Alert Settings"><SettingsForm current={settings} onCancel={() => setDialog(null)} onSave={(next) => { setSettings(next); setDialog(null); setMessage("Stock alert settings saved successfully."); }} /></ModalShell> : null}
      {dialog?.mode === "view" ? <ModalShell description="Current availability, branch and reorder information." onClose={() => setDialog(null)} title="Stock Alert Details"><div className={styles.details}><div className={styles.detailsHero}><span><BellRing aria-hidden="true" size={25} /></span><div><strong>{dialog.item.productName}</strong><small>{dialog.item.code} · {dialog.item.branch}</small></div><StatusBadge status={getStockAlertStatus(dialog.item)} /></div><dl><div><dt>Current stock</dt><dd>{dialog.item.currentStock} pcs</dd></div><div><dt>Minimum level</dt><dd>{dialog.item.minimumLevel} pcs</dd></div><div><dt>Category</dt><dd>{dialog.item.category}</dd></div><div><dt>Last alert</dt><dd>{dialog.item.lastAlert}</dd></div><div><dt>Reorder</dt><dd>{dialog.item.reorderPending ? "Pending" : "Not created"}</dd></div></dl><footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Close</button><button className="button button--primary" onClick={() => setDialog({ mode: "reorder", item: dialog.item })} type="button"><ShoppingCart aria-hidden="true" size={15} />{dialog.item.reorderPending ? "Review Reorder" : "Create Reorder"}</button></footer></div></ModalShell> : null}
      {dialog?.mode === "edit" ? <ModalShell description={`Set the alert threshold for ${dialog.item.productName}.`} onClose={() => setDialog(null)} title="Edit Stock Alert"><form className={styles.editForm} onSubmit={(event) => saveMinimumLevel(event, dialog.item)}><label><span>Product</span><input className="field" disabled value={`${dialog.item.productName} (${dialog.item.code})`} /></label><label><span>Minimum stock level</span><input autoFocus className="field" defaultValue={dialog.item.minimumLevel} min={dialog.item.currentStock + 1} name="minimumLevel" required type="number" /></label><p>The alert remains active while stock is below this level.</p><footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Cancel</button><button className="button button--primary" type="submit">Save Alert</button></footer></form></ModalShell> : null}
      {dialog?.mode === "reorder" ? <ModalShell description={dialog.item.reorderPending ? "Review or update the current reorder draft." : "Create a purchase reorder draft for this item."} onClose={() => setDialog(null)} title={dialog.item.reorderPending ? "Pending Reorder" : "Create Reorder"}><form className={styles.reorderForm} onSubmit={(event) => createReorder(event, dialog.item)}><div className={styles.reorderProduct}><span><ShoppingCart aria-hidden="true" size={21} /></span><div><strong>{dialog.item.productName}</strong><small>{dialog.item.currentStock} pcs available · minimum {dialog.item.minimumLevel} pcs</small></div></div><label><span>Reorder quantity</span><input autoFocus className="field" defaultValue={Math.max(dialog.item.minimumLevel * 2 - dialog.item.currentStock, 1)} min="1" name="quantity" required type="number" /></label><label><span>Preferred supplier</span><select className="select" defaultValue="Ali Gold Traders" name="supplier"><option>Ali Gold Traders</option><option>Diamond House Ltd.</option><option>Gold Line BD</option></select></label><label><span>Expected delivery</span><input className="field" defaultValue="2025-05-07" min="2025-04-30" name="delivery" required type="date" /></label><footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Cancel</button><button className="button button--primary" type="submit"><ShoppingCart aria-hidden="true" size={15} />{dialog.item.reorderPending ? "Update Draft" : "Create Draft"}</button></footer></form></ModalShell> : null}
    </div>
  );
}
