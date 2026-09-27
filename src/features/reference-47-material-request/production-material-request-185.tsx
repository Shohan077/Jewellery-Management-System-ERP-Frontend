"use client";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  PackageCheck,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./production-material-request-185.module.css";

type RequestStatus = "Approved" | "Pending" | "Rejected";

type MaterialRequest = {
  id: string;
  workOrder: string;
  product: string;
  productType: "Gold" | "Diamond";
  karigar: string;
  material: string;
  quantity: string;
  requestedQuantity: string;
  requestDate: string;
  requestDateIso: string;
  estimatedCost: string;
  approver: string;
  status: RequestStatus;
};

const requests: MaterialRequest[] = [
  { id: "MR-2025-128", workOrder: "WO-2025-231", product: "Gold Necklace", productType: "Gold", karigar: "Ramesh S.", material: "Gold", quantity: "18.250 g", requestedQuantity: "18.250 g", requestDate: "31 May 2025", requestDateIso: "2025-05-31", estimatedCost: "₹ 1,36,875.00", approver: "Vikram Mehta", status: "Approved" },
  { id: "MR-2025-127", workOrder: "WO-2025-230", product: "Diamond Ring", productType: "Diamond", karigar: "Suresh K.", material: "Diamond", quantity: "12 pcs", requestedQuantity: "12 pcs", requestDate: "30 May 2025", requestDateIso: "2025-05-30", estimatedCost: "₹ 96,000.00", approver: "—", status: "Pending" },
  { id: "MR-2025-126", workOrder: "WO-2025-229", product: "Gold Bangles", productType: "Gold", karigar: "Mahesh P.", material: "Gold", quantity: "22.100 g", requestedQuantity: "22.100 g", requestDate: "29 May 2025", requestDateIso: "2025-05-29", estimatedCost: "₹ 1,65,750.00", approver: "Vikram Mehta", status: "Approved" },
  { id: "MR-2025-125", workOrder: "WO-2025-228", product: "Pendant Set", productType: "Gold", karigar: "Ramesh S.", material: "Gold", quantity: "15.600 g", requestedQuantity: "15.600 g", requestDate: "29 May 2025", requestDateIso: "2025-05-29", estimatedCost: "₹ 1,17,000.00", approver: "Vikram Mehta", status: "Rejected" },
  { id: "MR-2025-124", workOrder: "WO-2025-227", product: "Diamond Earring", productType: "Diamond", karigar: "Suresh K.", material: "Diamond", quantity: "18 pcs", requestedQuantity: "18 pcs", requestDate: "28 May 2025", requestDateIso: "2025-05-28", estimatedCost: "₹ 1,44,000.00", approver: "—", status: "Pending" },
  { id: "MR-2025-123", workOrder: "WO-2025-226", product: "Gold Chain", productType: "Gold", karigar: "Mahesh P.", material: "Gold", quantity: "22.450 g", requestedQuantity: "22.450 g", requestDate: "27 May 2025", requestDateIso: "2025-05-27", estimatedCost: "₹ 1,68,375.00", approver: "Vikram Mehta", status: "Approved" },
  { id: "MR-2025-122", workOrder: "WO-2025-225", product: "Gold Ring", productType: "Gold", karigar: "Ramesh S.", material: "Gold", quantity: "8.750 g", requestedQuantity: "8.750 g", requestDate: "26 May 2025", requestDateIso: "2025-05-26", estimatedCost: "₹ 65,625.00", approver: "Vikram Mehta", status: "Approved" },
  { id: "MR-2025-121", workOrder: "WO-2025-224", product: "Diamond Pendant", productType: "Diamond", karigar: "Suresh K.", material: "Diamond", quantity: "10 pcs", requestedQuantity: "10 pcs", requestDate: "25 May 2025", requestDateIso: "2025-05-25", estimatedCost: "₹ 80,000.00", approver: "Vikram Mehta", status: "Rejected" },
];

type Filters = {
  from: string;
  to: string;
  productType: string;
  karigar: string;
  status: string;
};

const initialFilters: Filters = { from: "2025-05-01", to: "2025-05-31", productType: "All", karigar: "All", status: "All" };

const summary = [
  { label: "Total Requests", value: "128", note: "All time requests", tone: "blue", icon: ClipboardList },
  { label: "Approved", value: "76", note: "59.38% of total", tone: "green", icon: CheckCircle2 },
  { label: "Pending", value: "34", note: "26.56% of total", tone: "amber", icon: PackageCheck },
  { label: "Rejected", value: "18", note: "14.06% of total", tone: "red", icon: XCircle },
] as const;

function StatusPill({ status }: { status: RequestStatus }) {
  return <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

export function ProductionMaterialRequest185() {
  const [items, setItems] = useState(requests);
  const [selectedId, setSelectedId] = useState(requests[0].id);
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const visibleItems = useMemo(() => items.filter((item) => (
    item.requestDateIso >= applied.from
    && item.requestDateIso <= applied.to
    && (applied.productType === "All" || item.productType === applied.productType)
    && (applied.karigar === "All" || item.karigar === applied.karigar)
    && (applied.status === "All" || item.status === applied.status)
  )), [applied, items]);

  function updateStatus(status: RequestStatus) {
    setItems((current) => current.map((item) => item.id === selected.id
      ? { ...item, status, approver: status === "Pending" ? "—" : "Vikram Mehta" }
      : item));
    setMessage(`${selected.id} was ${status.toLowerCase()}.`);
  }

  function resetFilters() {
    setDraft(initialFilters);
    setApplied(initialFilters);
    setMessage("Filters reset.");
  }

  return (
    <main className={styles.page}>
      <PageHeader title="Production Material Request" description="Manufacturing  ›  Material Request" />

      <section aria-label="Material request summary" className={styles.summaryGrid}>
        {summary.map(({ icon: Icon, ...metric }) => (
          <Card className={`${styles.metricCard} ${styles[metric.tone]}`} key={metric.label}>
            <div><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></div>
            <span className={styles.metricIcon}><Icon aria-hidden="true" size={22} /></span>
          </Card>
        ))}
      </section>

      <Card className={styles.filterCard}>
        <div className={styles.filters}>
          <fieldset className={styles.dateRange}>
            <legend>Date Range</legend>
            <label><span className="sr-only">From date</span><input aria-label="From date" className="field" onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} /></label>
            <span aria-hidden="true">–</span>
            <label><span className="sr-only">To date</span><input aria-label="To date" className="field" onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} /></label>
          </fieldset>
          <label><span>Product Type</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, productType: event.target.value }))} value={draft.productType}><option>All</option><option>Gold</option><option>Diamond</option></select></label>
          <label><span>Karigar</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, karigar: event.target.value }))} value={draft.karigar}><option>All</option><option>Ramesh S.</option><option>Suresh K.</option><option>Mahesh P.</option></select></label>
          <label><span>Status</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} value={draft.status}><option>All</option><option>Approved</option><option>Pending</option><option>Rejected</option></select></label>
          <button className={styles.filterButton} onClick={() => { setApplied({ ...draft }); setMessage("Filters applied."); }} type="button"><Search size={15} />Filter</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw size={14} />Reset</button>
        </div>
      </Card>

      <div className={styles.contentGrid}>
        <Card className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table>
              <caption className="sr-only">Production material requests</caption>
              <thead><tr><th>Request ID</th><th>Work Order</th><th>Product</th><th>Karigar</th><th>Material Type</th><th>Quantity</th><th>Request Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr className={item.id === selected.id ? styles.selectedRow : undefined} key={item.id}>
                    <td><button className={styles.idButton} onClick={() => setSelectedId(item.id)} type="button">{item.id}</button></td>
                    <td>{item.workOrder}</td><td>{item.product}</td><td>{item.karigar}</td><td>{item.material}</td><td>{item.quantity}</td><td>{item.requestDate}</td><td><StatusPill status={item.status} /></td>
                    <td><button aria-label={`View ${item.id}`} className={styles.eyeButton} onClick={() => setSelectedId(item.id)} type="button"><Eye size={15} /></button></td>
                  </tr>
                ))}
                {!visibleItems.length && <tr><td className={styles.empty} colSpan={9}>No requests match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <footer className={styles.tableFooter}><span>Showing 1 to {visibleItems.length} of {visibleItems.length} entries</span><nav aria-label="Pagination"><button disabled type="button">‹</button><button aria-current="page" type="button">1</button><button type="button">2</button><button type="button">3</button><span>…</span><button type="button">14</button><button type="button">›</button></nav></footer>
        </Card>

        <Card className={styles.detailsCard}>
          <header><h2>Selected Request Details</h2></header>
          <dl>
            <div><dt>Request ID</dt><dd>{selected.id}</dd></div>
            <div><dt>Work Order</dt><dd>{selected.workOrder}</dd></div>
            <div><dt>Product</dt><dd>{selected.product}</dd></div>
            <div><dt>Karigar</dt><dd>{selected.karigar}</dd></div>
            <div><dt>Requested Gold</dt><dd>{selected.requestedQuantity}</dd></div>
            <div><dt>Requested Stones</dt><dd>{selected.productType === "Diamond" ? selected.quantity : "0 pcs"}</dd></div>
            <div><dt>Estimated Cost</dt><dd>{selected.estimatedCost}</dd></div>
            <div><dt>Approver</dt><dd>{selected.approver}</dd></div>
            <div><dt>Request Date</dt><dd>{selected.requestDate}</dd></div>
          </dl>
          <div className={styles.detailActions}>
            <button className={styles.approveButton} disabled={selected.status === "Approved"} onClick={() => updateStatus("Approved")} type="button"><CheckCircle2 size={14} />Approve</button>
            <button className={styles.rejectButton} disabled={selected.status === "Rejected"} onClick={() => updateStatus("Rejected")} type="button"><XCircle size={14} />Reject</button>
            <button className={styles.viewButton} onClick={() => setDialogOpen(true)} type="button"><Eye size={15} />View</button>
          </div>
        </Card>
      </div>

      <p aria-live="polite" className="sr-only">{message}</p>

      {dialogOpen && (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) setDialogOpen(false); }} role="presentation">
          <Card aria-describedby="request-dialog-description" aria-labelledby="request-dialog-title" aria-modal="true" className={styles.dialog} role="dialog">
            <header><span><FileText size={20} /><span><h2 id="request-dialog-title">{selected.id}</h2><p id="request-dialog-description">Material request review</p></span></span><button aria-label="Close details" onClick={() => setDialogOpen(false)} type="button"><X size={18} /></button></header>
            <div className={styles.dialogBody}>
              <div className={styles.dialogHero}><div><span>Product</span><strong>{selected.product}</strong><small>{selected.workOrder} · {selected.karigar}</small></div><StatusPill status={selected.status} /></div>
              <dl><div><dt>Material</dt><dd>{selected.material}</dd></div><div><dt>Quantity</dt><dd>{selected.quantity}</dd></div><div><dt>Estimated Cost</dt><dd>{selected.estimatedCost}</dd></div><div><dt>Requested</dt><dd><CalendarDays size={13} />{selected.requestDate}</dd></div></dl>
              <footer><button className={styles.secondaryButton} onClick={() => setDialogOpen(false)} type="button">Close</button><button className={styles.approveButton} disabled={selected.status === "Approved"} onClick={() => { updateStatus("Approved"); setDialogOpen(false); }} type="button">Approve request</button></footer>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
