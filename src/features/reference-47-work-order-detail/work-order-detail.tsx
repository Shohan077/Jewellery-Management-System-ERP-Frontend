"use client";

import {
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Droplets,
  FilePenLine,
  FileText,
  PackageCheck,
  Pencil,
  Printer,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./work-order-detail.module.css";

type TabId = "overview" | "materials" | "timeline" | "qc";
type OrderStatus = "In Progress" | "Completed";

type WorkOrder = {
  product: string;
  karigar: string;
  startDate: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  productCode: string;
  designCode: string;
  customer: string;
  quantity: string;
};

const initialOrder: WorkOrder = {
  product: "Gold Necklace",
  karigar: "Ramesh S.",
  startDate: "2025-05-28",
  dueDate: "2025-06-07",
  priority: "High",
  description: "22K Gold Necklace with Floral Design",
  productCode: "GN-22K-FL-001",
  designCode: "DES-2025-098",
  customer: "Walk-in Customer",
  quantity: "1 pcs",
};

const materials = [
  { material: "Gold", type: "22K Gold", quantity: "18.250", unit: "g", date: "28 May 2025" },
  { material: "Solder", type: "18K Solder", quantity: "1.200", unit: "g", date: "28 May 2025" },
  { material: "Polish", type: "Compound", quantity: "0.050", unit: "kg", date: "28 May 2025" },
  { material: "Clasp", type: "Gold Clasp", quantity: "1", unit: "pcs", date: "28 May 2025" },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "materials", label: "Materials Issued" },
  { id: "timeline", label: "Task Timeline" },
  { id: "qc", label: "QC Notes" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function Fact({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children ?? value}</dd>
    </div>
  );
}

function MetricCard({ icon, label, tone, children }: { icon: ReactNode; label: string; tone: "blue" | "amber" | "green"; children: ReactNode }) {
  return (
    <Card as="article" className={styles.metricCard}>
      <span aria-hidden="true" className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</span>
      <div className={styles.metricText}>
        <span>{label}</span>
        {children}
      </div>
    </Card>
  );
}

function MaterialsTable({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.materialTable}>
        <thead>
          <tr>
            <th>Material</th>
            <th>Type</th>
            <th>Issued Qty</th>
            <th>Unit</th>
            <th>Issue Date</th>
            {expanded ? <th>Issued By</th> : null}
          </tr>
        </thead>
        <tbody>
          {materials.map((item) => (
            <tr key={item.material}>
              <td><strong>{item.material}</strong></td>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.date}</td>
              {expanded ? <td>Varun Mehta</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Timeline({ completed, detailed = false }: { completed: boolean; detailed?: boolean }) {
  const steps = [
    { label: "Work Order Created", time: "27 May 2025, 10:15 AM", state: "done" },
    { label: "Materials Issued", time: "28 May 2025, 11:30 AM", state: "done" },
    { label: "Manufacturing In Progress", time: "29 May 2025, 09:45 AM", state: "current" },
    { label: "QC Inspection", time: completed ? "Completed with production" : "Pending", state: completed ? "done" : "pending" },
    { label: "Completed", time: completed ? "Marked complete just now" : "Pending", state: completed ? "done" : "pending" },
  ] as const;

  return (
    <ol className={`${styles.timeline} ${detailed ? styles.timelineDetailed : ""}`}>
      {steps.map((step) => (
        <li className={styles[step.state]} key={step.label}>
          <span aria-hidden="true" className={styles.timelineDot}>
            {step.state === "done" ? <Check size={11} strokeWidth={3} /> : step.state === "current" ? <Clock3 size={11} /> : <Circle size={10} />}
          </span>
          <div>
            <strong>{step.label}</strong>
            <time>{step.time}</time>
            {detailed && step.state === "current" ? <p>Goldsmithing and stone-setting work is currently underway.</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function EditDialog({ onClose, onSave, order }: { onClose: () => void; onSave: (order: WorkOrder) => void; order: WorkOrder }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      product: String(data.get("product")),
      karigar: String(data.get("karigar")),
      startDate: String(data.get("startDate")),
      dueDate: String(data.get("dueDate")),
      priority: String(data.get("priority")) as WorkOrder["priority"],
      description: String(data.get("description")),
      productCode: order.productCode,
      designCode: order.designCode,
      customer: String(data.get("customer")),
      quantity: String(data.get("quantity")),
    });
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-describedby="edit-work-order-description" aria-labelledby="edit-work-order-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="edit-work-order-title">Edit Work Order</h2>
            <p id="edit-work-order-description">Update production details for WO-2025-231.</p>
          </div>
          <button aria-label="Close edit dialog" onClick={onClose} type="button"><X size={19} /></button>
        </header>
        <form className={styles.editForm} onSubmit={submit}>
          <label><span>Product Name</span><input autoFocus className="field" defaultValue={order.product} name="product" required /></label>
          <label><span>Assigned Karigar</span><input className="field" defaultValue={order.karigar} name="karigar" required /></label>
          <label><span>Start Date</span><input className="field" defaultValue={order.startDate} name="startDate" required type="date" /></label>
          <label><span>Due Date</span><input className="field" defaultValue={order.dueDate} min={order.startDate} name="dueDate" required type="date" /></label>
          <label><span>Priority</span><select className="select" defaultValue={order.priority} name="priority"><option>High</option><option>Medium</option><option>Low</option></select></label>
          <label><span>Order Quantity</span><input className="field" defaultValue={order.quantity} name="quantity" required /></label>
          <label className={styles.wideField}><span>Customer</span><input className="field" defaultValue={order.customer} name="customer" required /></label>
          <label className={styles.wideField}><span>Description</span><textarea className="textarea" defaultValue={order.description} name="description" required /></label>
          <footer className={styles.modalActions}>
            <button className="button" onClick={onClose} type="button">Cancel</button>
            <button className={`button ${styles.primaryButton}`} type="submit"><Check size={15} />Save Changes</button>
          </footer>
        </form>
      </Card>
    </div>
  );
}

export function WorkOrderDetail186() {
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState<OrderStatus>("In Progress");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([
    "Verify the floral clasp alignment before final polish.",
    "Confirm finished weight remains within the approved tolerance.",
  ]);

  function saveOrder(nextOrder: WorkOrder) {
    setOrder(nextOrder);
    setEditOpen(false);
    setMessage("Work order WO-2025-231 was updated successfully.");
  }

  function completeOrder() {
    setStatus("Completed");
    setMessage("Work order WO-2025-231 has been marked complete.");
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const note = String(data.get("note") ?? "").trim();
    if (!note) return;
    setNotes((current) => [...current, note]);
    form.reset();
    setMessage("QC note added.");
  }

  const completed = status === "Completed";

  return (
    <div className={styles.page}>
      <PageHeader
        action={
          <div className={styles.headerActions}>
            <button className={`button ${styles.editButton}`} onClick={() => setEditOpen(true)} type="button"><Pencil size={14} />Edit Work Order</button>
            <button className="button" onClick={() => window.print()} type="button"><Printer size={14} />Print</button>
            <button className={`button ${styles.completeButton}`} disabled={completed} onClick={completeOrder} type="button"><CheckCircle2 size={15} />{completed ? "Completed" : "Mark Complete"}</button>
          </div>
        }
        description="Manufacturing  ›  Work Orders  ›  WO-2025-231"
        title="Work Order Detail"
      />

      {message ? <div className={styles.notice} role="status"><CheckCircle2 size={15} /><span>{message}</span><button aria-label="Dismiss notification" onClick={() => setMessage("")} type="button"><X size={14} /></button></div> : null}

      <Card className={styles.orderSummary}>
        <div className={styles.orderLead}>
          <span aria-hidden="true"><FilePenLine size={22} /></span>
          <div><small>Work Order No.</small><strong>WO-2025-231</strong></div>
        </div>
        <dl className={styles.facts}>
          <Fact label="Product Name" value={order.product} />
          <Fact label="Assigned Karigar" value={order.karigar} />
          <Fact label="Start Date" value={formatDate(order.startDate)} />
          <Fact label="Due Date" value={formatDate(order.dueDate)} />
          <Fact label="Priority"><span className={`${styles.statusBadge} ${styles.priority}`}>{order.priority}</span></Fact>
          <Fact label="Order Status"><span className={`${styles.statusBadge} ${completed ? styles.statusComplete : styles.statusProgress}`}>{status}</span></Fact>
        </dl>
      </Card>

      <section aria-label="Work order metrics" className={styles.metricGrid}>
        <Card as="article" className={styles.metricCard}>
          <div aria-label={`${completed ? 100 : 45}% complete`} className={`${styles.progressRing} ${completed ? styles.progressRingComplete : ""}`} role="img"><span>{completed ? "100%" : "45%"}</span></div>
          <div className={styles.metricText}><span>Completion</span><strong>{status}</strong></div>
        </Card>
        <MetricCard icon={<Droplets size={21} />} label="Issued Materials" tone="blue"><strong>18.250 g Gold</strong><small><b>0.000 g</b> Remaining</small></MetricCard>
        <MetricCard icon={<Scale size={21} />} label="Expected Weight" tone="amber"><strong>18.250 g</strong></MetricCard>
        <MetricCard icon={<Banknote size={21} />} label="Estimated Making Charge" tone="green"><strong>₹ 6,480.00</strong></MetricCard>
      </section>

      <div className={styles.tabs} role="tablist" aria-label="Work order sections">
        {tabs.map((tab) => (
          <button aria-controls={`panel-${tab.id}`} aria-selected={activeTab === tab.id} className={activeTab === tab.id ? styles.activeTab : ""} id={`tab-${tab.id}`} key={tab.id} onClick={() => setActiveTab(tab.id)} role="tab" type="button">{tab.label}</button>
        ))}
      </div>

      <section aria-labelledby={`tab-${activeTab}`} className={styles.tabPanel} id={`panel-${activeTab}`} role="tabpanel">
        {activeTab === "overview" ? (
          <div className={styles.overviewGrid}>
            <Card className={styles.detailCard}>
              <h2>Description</h2>
              <p className={styles.description}>{order.description}</p>
              <dl className={styles.detailList}>
                <Fact label="Product Code" value={order.productCode} />
                <Fact label="Design Code" value={order.designCode} />
                <Fact label="Customer" value={order.customer} />
                <Fact label="Order Date" value="27 May 2025" />
                <Fact label="Order Quantity" value={order.quantity} />
              </dl>
            </Card>
            <Card className={styles.materialCard}>
              <div className={styles.cardHeading}><h2>Materials Issued</h2><span><PackageCheck size={14} />4 items</span></div>
              <MaterialsTable />
              <button className={styles.inlineLink} onClick={() => setActiveTab("materials")} type="button">View All Materials Issued <span aria-hidden="true">→</span></button>
            </Card>
            <Card className={styles.timelineCard}>
              <h2>Task Timeline</h2>
              <Timeline completed={completed} />
            </Card>
          </div>
        ) : null}

        {activeTab === "materials" ? (
          <Card className={styles.fullPanel}>
            <div className={styles.panelHeader}>
              <div><h2>Materials Issued</h2><p>Material consumption recorded against WO-2025-231.</p></div>
              <span className={styles.infoChip}><PackageCheck size={14} />4 material types</span>
            </div>
            <MaterialsTable expanded />
            <div className={styles.materialTotals}><span>Total gold issued</span><strong>18.250 g</strong><span>Remaining</span><strong>0.000 g</strong></div>
          </Card>
        ) : null}

        {activeTab === "timeline" ? (
          <Card className={styles.fullPanel}>
            <div className={styles.panelHeader}><div><h2>Task Timeline</h2><p>Live production milestones and recorded activity.</p></div><span className={styles.infoChip}><CalendarDays size={14} />Started 28 May</span></div>
            <Timeline completed={completed} detailed />
          </Card>
        ) : null}

        {activeTab === "qc" ? (
          <div className={styles.qcGrid}>
            <Card className={styles.fullPanel}>
              <div className={styles.panelHeader}><div><h2>Quality Control Notes</h2><p>Inspection guidance and production observations.</p></div><span className={styles.infoChip}><Sparkles size={14} />{notes.length} notes</span></div>
              <ul className={styles.noteList}>{notes.map((note, index) => <li key={`${note}-${index}`}><CheckCircle2 size={16} /><span>{note}</span></li>)}</ul>
            </Card>
            <Card className={styles.noteComposer}>
              <h2>Add QC Note</h2>
              <form onSubmit={addNote}><label htmlFor="qc-note">Note</label><textarea className="textarea" id="qc-note" name="note" placeholder="Add an inspection note…" required /><button className={`button ${styles.primaryButton}`} type="submit">Save Note</button></form>
            </Card>
          </div>
        ) : null}
      </section>

      {editOpen ? <EditDialog onClose={() => setEditOpen(false)} onSave={saveOrder} order={order} /> : null}
    </div>
  );
}
