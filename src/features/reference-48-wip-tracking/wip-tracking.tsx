"use client";

import {
  Boxes,
  Check,
  CircleAlert,
  CircleCheckBig,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Eye,
  Gem,
  PackageCheck,
  Pencil,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./wip-tracking.module.css";

type WipStage = "Material Issued" | "In Process" | "Quality Check" | "On Hold" | "Completed";
type WipStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

type WipOrder = {
  id: string;
  design: string;
  karigar: string;
  stage: WipStage;
  progress: number;
  expected: string;
  status: WipStatus;
};

type Metric = {
  label: string;
  value: string;
  note: string;
  tone: "blue" | "cyan" | "violet" | "red" | "green";
  icon: LucideIcon;
};

const metrics: Metric[] = [
  { label: "Total WIP Orders", value: "68", note: "Active", tone: "blue", icon: ClipboardList },
  { label: "Materials Issued", value: "₹ 24,85,760", note: "This Month", tone: "cyan", icon: Boxes },
  { label: "WIP Value", value: "₹ 18,76,320", note: "In Process", tone: "violet", icon: CircleDollarSign },
  { label: "At Risk", value: "12", note: "Delayed Orders", tone: "red", icon: CircleAlert },
  { label: "Completed This Month", value: "24", note: "Orders", tone: "green", icon: CircleCheckBig },
];

const materials = [
  { material: "Gold 916", unit: "gram", required: "845.250", issued: "612.750", balance: "232.500", value: "₹ 33,21,550.00" },
  { material: "Gold 750", unit: "gram", required: "210.000", issued: "154.000", balance: "56.000", value: "₹ 7,48,600.00" },
  { material: "Silver", unit: "gram", required: "100.000", issued: "68.500", balance: "31.500", value: "₹ 5,47,800.00" },
  { material: "Stone (CZ)", unit: "pcs", required: "3,250", issued: "2,180", balance: "1,070", value: "₹ 47,966.00" },
  { material: "Solder 916", unit: "gram", required: "45.000", issued: "32.000", balance: "13.000", value: "₹ 16,644.00" },
];

const initialOrders: WipOrder[] = [
  { id: "PO-2505-001", design: "Gold Necklace", karigar: "Ramesh Kumar", stage: "In Process", progress: 65, expected: "22/05/2025", status: "On Track" },
  { id: "PO-2505-002", design: "Diamond Ring", karigar: "Suresh Babu", stage: "In Process", progress: 40, expected: "23/05/2025", status: "On Track" },
  { id: "PO-2505-003", design: "Gold Bangle", karigar: "Murugan M.", stage: "Quality Check", progress: 90, expected: "21/05/2025", status: "At Risk" },
  { id: "PO-2505-006", design: "Gold Earrings", karigar: "Lakshmi M.", stage: "In Process", progress: 30, expected: "24/05/2025", status: "Delayed" },
];

const progressSteps = [
  { label: "Order Created", value: "68 Orders", tone: "neutral" },
  { label: "Material Issued", value: "62 Orders", tone: "neutral" },
  { label: "In Process", value: "38 Orders", tone: "active" },
  { label: "Quality Check", value: "18 Orders", tone: "neutral" },
  { label: "Completed", value: "24 Orders", tone: "complete" },
] as const;

const stageBreakdown = [
  ["In Process", "38 (55.88%)", "#1575e6"],
  ["Quality Check", "18 (26.47%)", "#7544df"],
  ["Material Issued", "6 (8.82%)", "#f0a22a"],
  ["On Hold", "4 (5.88%)", "#ef5e51"],
  ["Delayed", "2 (2.94%)", "#d93636"],
] as const;

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <Card as="article" className={`${styles.metricCard} ${styles[metric.tone]}`}>
      <span className={styles.metricIcon}><Icon aria-hidden="true" size={21} /></span>
      <div><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></div>
    </Card>
  );
}

function StagePill({ stage }: { stage: WipStage }) {
  const tone = stage === "In Process" ? styles.inProcess : stage === "Quality Check" ? styles.quality : stage === "Completed" ? styles.complete : stage === "On Hold" ? styles.onHold : styles.issued;
  return <span className={`${styles.pill} ${tone}`}>{stage}</span>;
}

function StatusPill({ status }: { status: WipStatus }) {
  const tone = status === "On Track" ? styles.onTrack : status === "Completed" ? styles.complete : status === "At Risk" ? styles.atRisk : styles.delayed;
  return <span className={`${styles.pill} ${tone}`}>{status}</span>;
}

function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()} role="presentation">
      <Card aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}><div><h2>{title}</h2><p>Update manufacturing records using mock frontend data.</p></div><button aria-label="Close dialog" onClick={onClose} type="button"><X size={18} /></button></header>
        {children}
      </Card>
    </div>
  );
}

function Field({ children, label, wide = false }: { children: ReactNode; label: string; wide?: boolean }) {
  return <label className={`${styles.field} ${wide ? styles.wide : ""}`}><span>{label}</span>{children}</label>;
}

function IssueMaterialDialog({ onClose, onSave }: { onClose: () => void; onSave: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave(`${form.get("quantity")} ${form.get("unit")} of ${form.get("material")} issued to ${form.get("order")}.`);
  }

  return (
    <Modal onClose={onClose} title="Issue Material">
      <form className={styles.modalForm} onSubmit={submit}>
        <Field label="Production Order"><select className="select" name="order">{initialOrders.map((order) => <option key={order.id}>{order.id}</option>)}</select></Field>
        <Field label="Material"><select className="select" name="material">{materials.map((material) => <option key={material.material}>{material.material}</option>)}</select></Field>
        <Field label="Quantity"><input className="field" defaultValue="18.250" min="0" name="quantity" required step="0.001" type="number" /></Field>
        <Field label="Unit"><select className="select" name="unit"><option>gram</option><option>pcs</option></select></Field>
        <Field label="Issue Date"><input className="field" defaultValue="2025-05-20" name="date" required type="date" /></Field>
        <Field label="Issued By"><input className="field" defaultValue="Admin" name="issuer" required /></Field>
        <Field label="Remarks" wide><textarea className="textarea" defaultValue="Material issued for production." name="remarks" /></Field>
        <footer className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit"><Send size={14} />Issue Material</button></footer>
      </form>
    </Modal>
  );
}

function UpdateWipDialog({ onClose, onSave, order }: { onClose: () => void; onSave: (order: WipOrder) => void; order: WipOrder }) {
  const [stage, setStage] = useState<WipStage>(order.stage);
  const [progress, setProgress] = useState(order.progress);
  const [status, setStatus] = useState<WipStatus>(order.status);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ ...order, stage, progress, status });
  }

  return (
    <Modal onClose={onClose} title="Update WIP Progress">
      <form className={styles.modalForm} onSubmit={submit}>
        <Field label="Production Order"><input className="field" readOnly value={order.id} /></Field>
        <Field label="Karigar"><input className="field" readOnly value={order.karigar} /></Field>
        <Field label="Current Stage"><select className="select" onChange={(event) => setStage(event.target.value as WipStage)} value={stage}><option>Material Issued</option><option>In Process</option><option>Quality Check</option><option>On Hold</option><option>Completed</option></select></Field>
        <Field label="Status"><select className="select" onChange={(event) => setStatus(event.target.value as WipStatus)} value={status}><option>On Track</option><option>At Risk</option><option>Delayed</option><option>Completed</option></select></Field>
        <Field label={`Completion (${progress}%)`} wide><input className={styles.range} max="100" min="0" onChange={(event) => setProgress(Number(event.target.value))} type="range" value={progress} /></Field>
        <Field label="Update Notes" wide><textarea className="textarea" defaultValue="Production progress updated." /></Field>
        <footer className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit"><RefreshCw size={14} />Update WIP</button></footer>
      </form>
    </Modal>
  );
}

function OrderDetails({ onClose, order }: { onClose: () => void; order: WipOrder }) {
  return (
    <Modal onClose={onClose} title="WIP Order Details">
      <dl className={styles.details}>
        <div><dt>Order No</dt><dd>{order.id}</dd></div><div><dt>Design</dt><dd>{order.design}</dd></div><div><dt>Karigar</dt><dd>{order.karigar}</dd></div><div><dt>Stage</dt><dd><StagePill stage={order.stage} /></dd></div><div><dt>Completion</dt><dd>{order.progress}%</dd></div><div><dt>Expected Completion</dt><dd>{order.expected}</dd></div><div><dt>Status</dt><dd><StatusPill status={order.status} /></dd></div>
      </dl>
      <footer className={styles.modalActions}><button className={`button ${styles.primary}`} onClick={onClose} type="button">Close</button></footer>
    </Modal>
  );
}

export function MaterialWipTracking191() {
  const [orders, setOrders] = useState(initialOrders);
  const [issueOpen, setIssueOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<WipOrder | null>(null);
  const [selected, setSelected] = useState<WipOrder | null>(null);
  const [message, setMessage] = useState("");

  return (
    <main className={styles.page}>
      <PageHeader
        action={<div className={styles.headerActions}><button className={`button ${styles.primary}`} onClick={() => setIssueOpen(true)} type="button"><Send size={15} />Issue Material</button><button className={`button ${styles.outlineButton}`} onClick={() => setUpdateTarget(orders[0])} type="button"><RefreshCw size={15} />Update WIP</button></div>}
        description="Manufacturing  ›  Material Issue & WIP Tracking"
        title="Material Issue & WIP Tracking"
      />

      {message ? <p className={styles.notice} role="status">{message}</p> : null}

      <section aria-label="WIP summary" className={styles.metrics}>{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section>

      <Card className={styles.processCard}>
        <h2>Process Progress Overview</h2>
        <div className={styles.processFlow}>
          {progressSteps.map((step, index) => (
            <div className={styles.stepWrap} key={step.label}>
              <div className={`${styles.step} ${styles[step.tone]}`}><span>{index === 0 ? <ClipboardCheck size={18} /> : index === 1 ? <Boxes size={18} /> : index === 2 ? <RefreshCw size={18} /> : index === 3 ? <ShieldCheck size={18} /> : <Check size={18} />}</span><div><strong>{step.label}</strong><small>{step.value}</small></div></div>
              {index < progressSteps.length - 1 ? <span aria-hidden="true" className={styles.arrow}>→</span> : null}
            </div>
          ))}
        </div>
      </Card>

      <section className={styles.analyticsGrid}>
        <Card className={styles.panel}>
          <h2>Material Issue Summary</h2>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead><tr><th>Material</th><th>Unit</th><th>Required</th><th>Issued</th><th>Balance</th><th>Value (₹)</th></tr></thead>
              <tbody>{materials.map((row) => <tr key={row.material}><td>{row.material}</td><td>{row.unit}</td><td>{row.required}</td><td>{row.issued}</td><td>{row.balance}</td><td>{row.value}</td></tr>)}</tbody>
              <tfoot><tr><th colSpan={2}>Total</th><th>3,450.250</th><th>2,067.250</th><th>1,383.000</th><th>₹ 41,40,220.00</th></tr></tfoot>
            </table>
          </div>
        </Card>

        <Card className={styles.panel}>
          <h2>WIP Status by Stage</h2>
          <div className={styles.donutArea}>
            <div aria-label="68 total WIP orders by production stage" className={styles.donut} role="img"><span><strong>68</strong><small>Total Orders</small></span></div>
            <div className={styles.legend}>{stageBreakdown.map(([label, value, color]) => <div key={label}><i style={{ backgroundColor: color }} /><span>{label}</span><strong>{value}</strong></div>)}</div>
          </div>
        </Card>
      </section>

      <Card className={styles.ordersCard}>
        <h2>WIP Orders</h2>
        <div className={styles.tableScroll}>
          <table className={`${styles.table} ${styles.ordersTable}`}>
            <thead><tr><th>Order No</th><th>Design</th><th>Karigar</th><th>Stage</th><th>% Complete</th><th>Expected Completion</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{orders.map((order, index) => <tr key={order.id}><td>{order.id}</td><td><span className={styles.design}><Gem size={20} />{order.design}</span></td><td>{order.karigar}</td><td><StagePill stage={order.stage} /></td><td><span className={styles.progressValue}>{order.progress}%</span><span className={styles.progress}><i style={{ width: `${order.progress}%` }} /></span></td><td>{order.expected}</td><td><StatusPill status={order.status} /></td><td><span className={styles.rowActions}><button aria-label={`View ${order.id}`} onClick={() => setSelected(order)} type="button"><Eye size={14} /></button><button aria-label={`Edit ${order.id}`} onClick={() => setUpdateTarget(orders[index])} type="button"><Pencil size={14} /></button></span></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      {issueOpen ? <IssueMaterialDialog onClose={() => setIssueOpen(false)} onSave={(nextMessage) => { setMessage(nextMessage); setIssueOpen(false); }} /> : null}
      {updateTarget ? <UpdateWipDialog key={updateTarget.id} onClose={() => setUpdateTarget(null)} onSave={(updated) => { setOrders((current) => current.map((order) => order.id === updated.id ? updated : order)); setUpdateTarget(null); setMessage(`${updated.id} WIP progress updated to ${updated.progress}%.`); }} order={updateTarget} /> : null}
      {selected ? <OrderDetails onClose={() => setSelected(null)} order={selected} /> : null}
    </main>
  );
}
