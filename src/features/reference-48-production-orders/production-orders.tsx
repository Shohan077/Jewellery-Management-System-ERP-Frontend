"use client";

import Link from "next/link";
import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Eye,
  Gem,
  MoreVertical,
  PackageOpen,
  PauseCircle,
  Plus,
  RotateCcw,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./production-orders.module.css";

type OrderStatus =
  | "Draft"
  | "In Progress"
  | "Quality Check"
  | "Completed"
  | "On Hold"
  | "Cancelled"
  | "Overdue";

type Order = {
  id: string;
  design: "Necklace" | "Ring" | "Bangle" | "Earrings" | "Pendant";
  purity: "916" | "750";
  weight: string;
  karigar: string;
  dueDate: string;
  status: OrderStatus;
};

const orders: Order[] = [
  { id: "PO-2505-001", design: "Necklace", purity: "916", weight: "22.350", karigar: "Ramesh K.", dueDate: "20/05/2025", status: "In Progress" },
  { id: "PO-2505-002", design: "Ring", purity: "916", weight: "18.760", karigar: "Suresh B.", dueDate: "21/05/2025", status: "In Progress" },
  { id: "PO-2505-003", design: "Bangle", purity: "750", weight: "31.450", karigar: "Murugan M.", dueDate: "22/05/2025", status: "Quality Check" },
  { id: "PO-2505-004", design: "Earrings", purity: "916", weight: "15.880", karigar: "Ramesh K.", dueDate: "18/05/2025", status: "Completed" },
  { id: "PO-2505-005", design: "Necklace", purity: "916", weight: "27.240", karigar: "Suresh B.", dueDate: "17/05/2025", status: "Completed" },
  { id: "PO-2505-006", design: "Ring", purity: "916", weight: "12.500", karigar: "Lakshmi M.", dueDate: "16/05/2025", status: "Overdue" },
  { id: "PO-2505-007", design: "Pendant", purity: "750", weight: "9.850", karigar: "Murugan M.", dueDate: "19/05/2025", status: "On Hold" },
];

const statusTabs: Array<"All" | OrderStatus> = ["All", "Draft", "In Progress", "Quality Check", "Completed", "On Hold", "Cancelled"];

const metrics: Array<{ label: string; value: string; meta: string; icon: LucideIcon }> = [
  { label: "Total Orders", value: "156", meta: "This Month", icon: ClipboardList },
  { label: "In Progress", value: "68", meta: "43.59%", icon: PackageOpen },
  { label: "Completed", value: "62", meta: "39.74%", icon: CheckCircle2 },
  { label: "Overdue", value: "26", meta: "16.67%", icon: CircleAlert },
  { label: "On Hold", value: "8", meta: "5.13%", icon: PauseCircle },
];

function MetricCard({ icon: Icon, label, meta, value }: (typeof metrics)[number]) {
  return (
    <Card as="article" className={styles.metricCard}>
      <span className={styles.metricIcon}><Icon aria-hidden="true" size={20} /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>
    </Card>
  );
}

function StatusBadge({ value }: { value: OrderStatus }) {
  return <span className={`${styles.badge} ${styles[value.replaceAll(" ", "").toLowerCase()]}`}>{value}</span>;
}

function Field({ children, label }: { children: ReactNode; label?: string }) {
  return <label className={styles.fieldLabel}>{label ? <span>{label}</span> : null}{children}</label>;
}

function OrderDialog({ onClose, order, onStatusChange }: { onClose: () => void; order: Order; onStatusChange: (status: OrderStatus) => void }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()} role="presentation">
      <Card aria-modal="true" className={styles.dialog} role="dialog">
        <header><div><p>Production order</p><h2>{order.id}</h2></div><button aria-label="Close details" onClick={onClose} type="button"><X size={18} /></button></header>
        <div className={styles.dialogDesign}><span><Gem size={28} /></span><div><small>Design</small><strong>{order.design}</strong></div><StatusBadge value={order.status} /></div>
        <dl className={styles.details}>
          <div><dt>Purity</dt><dd>{order.purity} Hallmark</dd></div>
          <div><dt>Estimated Weight</dt><dd>{order.weight} g</dd></div>
          <div><dt>Assigned Karigar</dt><dd>{order.karigar}</dd></div>
          <div><dt>Due Date</dt><dd>{order.dueDate}</dd></div>
        </dl>
        <div className={styles.dialogActions}>
          <button className="button" onClick={() => onStatusChange("On Hold")} type="button">Put On Hold</button>
          <button className={`button ${styles.primary}`} onClick={() => onStatusChange("Completed")} type="button"><CheckCircle2 size={14} />Mark Completed</button>
        </div>
      </Card>
    </div>
  );
}

export function ProductionOrders189() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");
  const [purity, setPurity] = useState("All");
  const [karigar, setKarigar] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updates, setUpdates] = useState<Record<string, OrderStatus>>({});
  const [notice, setNotice] = useState("");

  const liveOrders = useMemo(() => orders.map((order) => ({ ...order, status: updates[order.id] ?? order.status })), [updates]);
  const filtered = useMemo(() => liveOrders.filter((order) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || `${order.id} ${order.design} ${order.karigar}`.toLowerCase().includes(search);
    const matchesStatus = status === "All" || order.status === status;
    const matchesPurity = purity === "All" || order.purity === purity;
    const matchesKarigar = karigar === "All" || order.karigar === karigar;
    return matchesQuery && matchesStatus && matchesPurity && matchesKarigar;
  }), [karigar, liveOrders, purity, query, status]);

  function resetFilters() {
    setQuery(""); setStatus("All"); setPurity("All"); setKarigar("All");
  }

  function updateOrder(nextStatus: OrderStatus) {
    if (!selected) return;
    setUpdates((current) => ({ ...current, [selected.id]: nextStatus }));
    setNotice(`${selected.id} updated to ${nextStatus}.`);
    setSelected(null);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<Link className={`button ${styles.primary}`} href="/manufacturing/production-orders/new"><Plus size={15} />Create Order</Link>}
        description="Manufacturing  ›  Production Orders"
        title="Production Orders"
      />

      {notice ? <p className={styles.notice} role="status">{notice}</p> : null}

      <section aria-label="Production order summary" className={styles.metrics}>
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <Card className={styles.workspace}>
        <div className={styles.filters}>
          <Field><span className={styles.searchBox}><Search aria-hidden="true" size={14} /><input aria-label="Search orders" onChange={(event) => setQuery(event.target.value)} placeholder="Search Order / Design / Karigar" value={query} /></span></Field>
          <Field label="Status"><select className="select" onChange={(event) => setStatus(event.target.value as "All" | OrderStatus)} value={status}>{statusTabs.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Purity"><select className="select" onChange={(event) => setPurity(event.target.value)} value={purity}><option>All</option><option>916</option><option>750</option></select></Field>
          <Field label="Karigar"><select className="select" onChange={(event) => setKarigar(event.target.value)} value={karigar}><option>All</option><option>Ramesh K.</option><option>Suresh B.</option><option>Murugan M.</option><option>Lakshmi M.</option></select></Field>
          <Field label="Date Range"><input className="field" defaultValue="01/05/2025 - 31/05/2025" type="text" /></Field>
          <button className={styles.reset} onClick={resetFilters} type="button"><RotateCcw size={14} />Reset</button>
        </div>

        <div aria-label="Filter by order status" className={styles.statusTabs} role="tablist">
          {statusTabs.map((item) => <button aria-selected={status === item} className={status === item ? styles.activeTab : ""} key={item} onClick={() => setStatus(item)} role="tab" type="button">{item}</button>)}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>Order No</th><th>Design</th><th>Purity</th><th>Weight (g)</th><th>Karigar</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td><span className={styles.design}><Gem size={22} /><span>{order.design}</span></span></td>
                  <td>{order.purity}</td><td>{order.weight}</td><td>{order.karigar}</td><td>{order.dueDate}</td><td><StatusBadge value={order.status} /></td>
                  <td><span className={styles.rowActions}><button aria-label={`View ${order.id}`} onClick={() => setSelected(order)} type="button"><Eye size={14} /></button><button aria-label={`Manage ${order.id}`} onClick={() => setSelected(order)} type="button"><MoreVertical size={14} /></button></span></td>
                </tr>
              ))}
              {!filtered.length ? <tr><td className={styles.empty} colSpan={8}>No production orders match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}><span>Showing 1 to {filtered.length} of {filtered.length || 0} entries</span><div className={styles.pagination}><button aria-label="Previous page" disabled>‹</button><button aria-current="page" className={styles.current}>1</button><button>2</button><button>3</button><span>…</span><button>23</button><button aria-label="Next page">›</button></div></footer>
      </Card>

      {selected ? <OrderDialog onClose={() => setSelected(null)} onStatusChange={updateOrder} order={selected} /> : null}
    </div>
  );
}
