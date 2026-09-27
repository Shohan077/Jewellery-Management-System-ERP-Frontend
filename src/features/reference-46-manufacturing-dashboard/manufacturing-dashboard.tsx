"use client";

import {
  BadgeCheck,
  ClipboardList,
  Clock3,
  Eye,
  PackageOpen,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./manufacturing-dashboard.module.css";

type WorkOrderStatus = "Completed" | "In Production" | "Delayed" | "Not Started";

type WorkOrder = {
  id: string;
  product: string;
  karigar: string;
  startDate: string;
  dueDate: string;
  status: WorkOrderStatus;
};

type Metric = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  { label: "Total Work Orders", value: "128", trend: "12.5%", icon: ClipboardList },
  { label: "In Production", value: "68", trend: "8.3%", icon: PackageOpen },
  { label: "Completed", value: "45", trend: "15.7%", icon: BadgeCheck },
  { label: "Delayed", value: "15", trend: "25.0%", icon: Clock3 },
];

const initialOrders: WorkOrder[] = [
  { id: "WO-1001", product: "Gold Necklace", karigar: "Ramesh S.", startDate: "01 May 2024", dueDate: "10 May 2024", status: "Completed" },
  { id: "WO-1002", product: "Diamond Ring", karigar: "Suresh P.", startDate: "02 May 2024", dueDate: "12 May 2024", status: "In Production" },
  { id: "WO-1003", product: "Gold Bangles", karigar: "Mahesh K.", startDate: "03 May 2024", dueDate: "15 May 2024", status: "In Production" },
  { id: "WO-1004", product: "Platinum Chain", karigar: "Gopal M.", startDate: "25 Apr 2024", dueDate: "05 May 2024", status: "Delayed" },
  { id: "WO-1005", product: "Gold Earrings", karigar: "Vijay T.", startDate: "28 Apr 2024", dueDate: "08 May 2024", status: "Completed" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const production = [61, 56, 59, 69, 82, 96, 108, 102, 65, 73, 88, 64];
const workOrders = [69, 86, 108, 93, 124, 139, 151, 132, 103, 119, 98, 79];

function StatCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <Card as="article" className={styles.statCard}>
      <span className={styles.statIcon}><Icon aria-hidden="true" size={21} strokeWidth={1.9} /></span>
      <div className={styles.statCopy}>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        <small><b>↗ {metric.trend}</b> from last month</small>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const tone = status === "Completed"
    ? styles.completed
    : status === "In Production"
      ? styles.inProduction
      : status === "Delayed"
        ? styles.delayed
        : styles.notStarted;
  return <span className={`${styles.status} ${tone}`}>{status}</span>;
}

function ProductionStatus() {
  const items: Array<{ label: WorkOrderStatus; value: string }> = [
    { label: "Completed", value: "45 (35.2%)" },
    { label: "In Production", value: "46 (35.9%)" },
    { label: "Delayed", value: "15 (11.7%)" },
    { label: "Not Started", value: "22 (17.2%)" },
  ];

  return (
    <Card className={styles.chartCard}>
      <h2>Production Status</h2>
      <div className={styles.donutArea}>
        <div aria-label="Production status: 35.2 percent completed, 35.9 percent in production, 11.7 percent delayed, and 17.2 percent not started" className={styles.donut} role="img" />
        <div className={styles.donutLegend}>
          {items.map((item, index) => (
            <div key={item.label}>
              <i className={styles[`legend${index + 1}`]} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ProductionTrend() {
  const max = 160;
  const chartWidth = 720;
  const chartHeight = 178;
  const horizontalPadding = 24;
  const innerWidth = chartWidth - horizontalPadding * 2;
  const points = workOrders.map((value, index) => {
    const x = horizontalPadding + (innerWidth / (workOrders.length - 1)) * index;
    const y = chartHeight - (value / max) * (chartHeight - 12);
    return `${x},${y}`;
  }).join(" ");

  return (
    <Card className={styles.chartCard}>
      <div className={styles.chartTitle}>
        <h2>Monthly Production Trend</h2>
        <div className={styles.chartLegend} aria-label="Chart legend">
          <span><i className={styles.productionKey} />Production (Nos)</span>
          <span><i className={styles.ordersKey} />Work Orders (Nos)</span>
        </div>
      </div>
      <div className={styles.trendScroll}>
        <div className={styles.trendChart}>
          <div className={styles.yAxis} aria-hidden="true"><span>160</span><span>120</span><span>80</span><span>40</span><span>0</span></div>
          <div className={styles.plot}>
            <div className={styles.bars} aria-hidden="true">
              {production.map((value, index) => (
                <span key={months[index]} style={{ height: `${(value / max) * 100}%` }} />
              ))}
            </div>
            <svg aria-label="Monthly production and work-order totals from January through December" className={styles.line} preserveAspectRatio="none" role="img" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <polyline fill="none" points={points} stroke="#28a55f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              {workOrders.map((value, index) => {
                const x = horizontalPadding + (innerWidth / (workOrders.length - 1)) * index;
                const y = chartHeight - (value / max) * (chartHeight - 12);
                return <circle cx={x} cy={y} fill="#fff" key={months[index]} r="4" stroke="#28a55f" strokeWidth="3" />;
              })}
            </svg>
            <div className={styles.xAxis}>{months.map((month) => <span key={month}>{month}</span>)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={`${styles.field} ${full ? styles.full : ""}`}><span>{label}</span>{children}</label>;
}

function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()} role="presentation">
      <Card aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <h2>{title}</h2>
          <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button"><X size={17} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}

function CreateWorkOrderModal({ onClose, onSave }: { onClose: () => void; onSave: (order: WorkOrder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: `WO-${1001 + initialOrders.length}`,
      product: String(form.get("product")),
      karigar: String(form.get("karigar")),
      startDate: String(form.get("startDate")),
      dueDate: String(form.get("dueDate")),
      status: String(form.get("status")) as WorkOrderStatus,
    });
  }

  return (
    <Modal onClose={onClose} title="Create Work Order">
      <form className={styles.modalForm} onSubmit={submit}>
        <Field label="Product"><select className="select" defaultValue="Gold Necklace" name="product"><option>Gold Necklace</option><option>Diamond Ring</option><option>Gold Bangles</option><option>Gold Earrings</option></select></Field>
        <Field label="Karigar"><select className="select" defaultValue="Ramesh S." name="karigar"><option>Ramesh S.</option><option>Suresh P.</option><option>Mahesh K.</option><option>Vijay T.</option></select></Field>
        <Field label="Start Date"><input className="field" defaultValue="01 Jun 2024" name="startDate" required /></Field>
        <Field label="Due Date"><input className="field" defaultValue="12 Jun 2024" name="dueDate" required /></Field>
        <Field full label="Status"><select className="select" defaultValue="Not Started" name="status"><option>Not Started</option><option>In Production</option><option>Completed</option><option>Delayed</option></select></Field>
        <div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">Create Work Order</button></div>
      </form>
    </Modal>
  );
}

function WorkOrderDetails({ onClose, order }: { onClose: () => void; order: WorkOrder }) {
  const details = [["Work Order", order.id], ["Product", order.product], ["Karigar", order.karigar], ["Start Date", order.startDate], ["Due Date", order.dueDate]];
  return (
    <Modal onClose={onClose} title="Work Order Details">
      <dl className={styles.details}>
        {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        <div><dt>Status</dt><dd><StatusBadge status={order.status} /></dd></div>
      </dl>
      <div className={styles.modalActions}><button className={`button ${styles.primary}`} onClick={onClose} type="button">Close</button></div>
    </Modal>
  );
}

export function ManufacturingDashboard181() {
  const [orders, setOrders] = useState(initialOrders);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<WorkOrder | null>(null);
  const [message, setMessage] = useState("");

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.primary}`} onClick={() => setCreateOpen(true)} type="button"><Plus size={15} />Create Work Order</button>}
        description="Production status, output trends, and recent work orders"
        title="Manufacturing Dashboard"
      />

      {message ? <p className={styles.notice} role="status">{message}</p> : null}

      <section aria-label="Manufacturing summary" className={styles.stats}>
        {metrics.map((metric) => <StatCard key={metric.label} metric={metric} />)}
      </section>

      <section aria-label="Manufacturing charts" className={styles.charts}>
        <ProductionStatus />
        <ProductionTrend />
      </section>

      <Card className={styles.tableCard}>
        <h2>Recent Work Orders</h2>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>WO No</th><th>Product Name</th><th>Karigar</th><th>Start Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td><td>{order.product}</td><td>{order.karigar}</td><td>{order.startDate}</td><td>{order.dueDate}</td><td><StatusBadge status={order.status} /></td>
                  <td><button aria-label={`View ${order.id}`} className={styles.viewButton} onClick={() => setSelected(order)} type="button"><Eye size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {createOpen ? <CreateWorkOrderModal onClose={() => setCreateOpen(false)} onSave={(order) => { setOrders((current) => [order, ...current]); setCreateOpen(false); setMessage(`${order.id} created successfully.`); }} /> : null}
      {selected ? <WorkOrderDetails onClose={() => setSelected(null)} order={selected} /> : null}
    </div>
  );
}
