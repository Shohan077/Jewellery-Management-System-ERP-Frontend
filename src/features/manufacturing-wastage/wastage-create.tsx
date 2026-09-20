"use client";

import { CheckCircle2, CircleAlert, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  WASTAGE_DELETED_STORAGE_KEY,
  WASTAGE_STORAGE_EVENT,
  WASTAGE_STORAGE_KEY,
  formatWastageDate,
  isWastageRecord,
  manufacturingOrderOptions,
  type WastageRecord,
} from "./wastage-data";
import styles from "./wastage.module.css";

type WastageForm = {
  wastageNo: string;
  date: string;
  manufacturingOrder: string;
  karigar: string;
  product: string;
  totalIssued: string;
  totalReturned: string;
  approvedWastage: string;
  wastageType: string;
  remarks: string;
};

type Feedback = { tone: "error" | "success"; message: string } | null;

const initialOrder = manufacturingOrderOptions[0];
const initialForm: WastageForm = {
  wastageNo: "WST-2025-001",
  date: "2025-04-12",
  manufacturingOrder: initialOrder.orderNo,
  karigar: initialOrder.karigar,
  product: initialOrder.product,
  totalIssued: initialOrder.issuedWeight.toFixed(3),
  totalReturned: initialOrder.returnedWeight.toFixed(3),
  approvedWastage: (initialOrder.issuedWeight - initialOrder.returnedWeight).toFixed(3),
  wastageType: "Normal Wastage",
  remarks: "Stone setting wastage during polishing.",
};

function readStoredRecords() {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(WASTAGE_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isWastageRecord) : [];
  } catch {
    return [];
  }
}

export function WastageCreate() {
  const router = useRouter();
  const [form, setForm] = useState<WastageForm>({ ...initialForm });
  const [feedback, setFeedback] = useState<Feedback>(null);

  const selectedOrder = manufacturingOrderOptions.find((order) => order.orderNo === form.manufacturingOrder) ?? initialOrder;
  const issuedWeight = Number(form.totalIssued);
  const returnedWeight = Number(form.totalReturned);
  const approvedWeight = Number(form.approvedWastage);
  const netWastage = useMemo(() => {
    if (!Number.isFinite(issuedWeight) || !Number.isFinite(returnedWeight)) return 0;
    return Math.max(0, Number((issuedWeight - returnedWeight).toFixed(3)));
  }, [issuedWeight, returnedWeight]);
  const unapprovedWastage = Number.isFinite(approvedWeight)
    ? Math.max(0, Number((netWastage - approvedWeight).toFixed(3)))
    : netWastage;

  function updateField<Key extends keyof WastageForm>(key: Key, value: WastageForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function selectOrder(orderNo: string) {
    const order = manufacturingOrderOptions.find((item) => item.orderNo === orderNo) ?? initialOrder;
    const wastage = order.issuedWeight - order.returnedWeight;
    setForm((current) => ({
      ...current,
      manufacturingOrder: order.orderNo,
      karigar: order.karigar,
      product: order.product,
      totalIssued: order.issuedWeight.toFixed(3),
      totalReturned: order.returnedWeight.toFixed(3),
      approvedWastage: wastage.toFixed(3),
    }));
    setFeedback(null);
  }

  function resetForm() {
    setForm({ ...initialForm });
    setFeedback({ tone: "success", message: "Wastage entry reset to its original values." });
  }

  function saveWastage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.wastageNo.trim() || !form.date || !form.manufacturingOrder || !form.karigar || !form.product || !form.wastageType) {
      setFeedback({ tone: "error", message: "Complete every required wastage field before saving." });
      return;
    }
    if (!form.totalIssued.trim() || !form.totalReturned.trim() || !form.approvedWastage.trim()) {
      setFeedback({ tone: "error", message: "Issued, returned, and approved weights are required." });
      return;
    }
    if (![issuedWeight, returnedWeight, approvedWeight].every(Number.isFinite)
      || issuedWeight <= 0
      || returnedWeight < 0
      || returnedWeight > issuedWeight
      || approvedWeight < 0
      || approvedWeight > netWastage) {
      setFeedback({ tone: "error", message: "Weights must be valid, and approved wastage cannot exceed net wastage." });
      return;
    }

    const record: WastageRecord = {
      id: form.wastageNo.trim(),
      wastageNo: form.wastageNo.trim(),
      date: formatWastageDate(form.date),
      dateIso: form.date,
      manufacturingOrder: form.manufacturingOrder,
      karigar: form.karigar,
      product: form.product,
      totalIssued: Number(issuedWeight.toFixed(3)),
      totalReturned: Number(returnedWeight.toFixed(3)),
      netWastage,
      approvedWastage: Number(approvedWeight.toFixed(3)),
      wastageType: form.wastageType,
      remarks: form.remarks.trim(),
      status: Math.abs(approvedWeight - netWastage) < 0.0005 ? "Approved" : "Pending",
    };

    try {
      const stored = readStoredRecords();
      const next = [record, ...stored.filter((item) => item.wastageNo !== record.wastageNo)];
      window.localStorage.setItem(WASTAGE_STORAGE_KEY, JSON.stringify(next));

      const deletedValue: unknown = JSON.parse(window.localStorage.getItem(WASTAGE_DELETED_STORAGE_KEY) ?? "[]");
      const deletedIds = Array.isArray(deletedValue)
        ? deletedValue.filter((value): value is string => typeof value === "string" && value !== record.id)
        : [];
      window.localStorage.setItem(WASTAGE_DELETED_STORAGE_KEY, JSON.stringify(deletedIds));
      window.dispatchEvent(new Event(WASTAGE_STORAGE_EVENT));
      router.push(`/manufacturing/wastage?saved=${encodeURIComponent(record.wastageNo)}`);
    } catch {
      setFeedback({ tone: "error", message: "This entry could not be saved in browser storage. Please try again." });
    }
  }

  return (
    <div className={styles.createPage}>
      <header className={styles.createHeader}>
        <h1>Wastage Entry</h1>
        <nav aria-label="Breadcrumb"><span>Manufacturing</span><b aria-hidden="true">›</b><span aria-current="page">Wastage Entry</span></nav>
      </header>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form className={styles.createShell} noValidate onSubmit={saveWastage}>
        <Card className={styles.formCard}>
          <header className={styles.cardHeading}><h2>Wastage Details</h2></header>
          <div className={styles.formGrid}>
            <label className={styles.control}><span>Wastage No <b aria-hidden="true">*</b></span><input className="field" onChange={(event) => updateField("wastageNo", event.target.value)} required value={form.wastageNo} /></label>
            <label className={styles.control}><span>Date <b aria-hidden="true">*</b></span><input className="field" onChange={(event) => updateField("date", event.target.value)} required type="date" value={form.date} /></label>
            <label className={styles.control}><span>Manufacturing Order <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => selectOrder(event.target.value)} required value={form.manufacturingOrder}>{manufacturingOrderOptions.map((order) => <option key={order.orderNo}>{order.orderNo}</option>)}</select></label>
            <label className={styles.control}><span>Karigar <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => updateField("karigar", event.target.value)} required value={form.karigar}>{manufacturingOrderOptions.map((order) => order.karigar).filter((name, index, list) => list.indexOf(name) === index).map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className={`${styles.control} ${styles.fullField}`}><span>Product <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => updateField("product", event.target.value)} required value={form.product}>{manufacturingOrderOptions.map((order) => order.product).filter((name, index, list) => list.indexOf(name) === index).map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className={styles.control}><span>Total Issued Weight (Gram) <b aria-hidden="true">*</b></span><input className="field" min="0.001" onChange={(event) => updateField("totalIssued", event.target.value)} required step="0.001" type="number" value={form.totalIssued} /></label>
            <label className={styles.control}><span>Total Returned Weight (Gram) <b aria-hidden="true">*</b></span><input className="field" min="0" onChange={(event) => updateField("totalReturned", event.target.value)} required step="0.001" type="number" value={form.totalReturned} /></label>
            <label className={styles.control}><span>Net Wastage (Gram)</span><input aria-describedby="net-wastage-help" className="field" readOnly value={netWastage.toFixed(3)} /><small id="net-wastage-help">Calculated from issued minus returned weight.</small></label>
            <label className={styles.control}><span>Approved Wastage (Gram) <b aria-hidden="true">*</b></span><input className="field" max={netWastage} min="0" onChange={(event) => updateField("approvedWastage", event.target.value)} required step="0.001" type="number" value={form.approvedWastage} /></label>
            <label className={`${styles.control} ${styles.fullField}`}><span>Wastage Type <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => updateField("wastageType", event.target.value)} required value={form.wastageType}><option>Normal Wastage</option><option>Excess Wastage</option><option>Recoverable Wastage</option></select></label>
            <label className={`${styles.control} ${styles.fullField}`}><span>Remarks</span><textarea className="textarea" onChange={(event) => updateField("remarks", event.target.value)} placeholder="Enter remarks (optional)..." value={form.remarks} /></label>
          </div>
          <footer className={styles.formActions}>
            <button className={`button ${styles.resetButton}`} onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={17} />Reset</button>
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Wastage</button>
          </footer>
        </Card>

        <aside className={styles.summaryColumn}>
          <Card aria-labelledby="order-summary-title" className={styles.summaryCard}>
            <h2 id="order-summary-title">Order Summary</h2>
            <dl>
              <div><dt>Order No</dt><dd>{form.manufacturingOrder}</dd></div>
              <div><dt>Order Date</dt><dd>{formatWastageDate(selectedOrder.orderDateIso)}</dd></div>
              <div><dt>Product</dt><dd>{form.product}</dd></div>
              <div><dt>Karigar</dt><dd>{form.karigar}</dd></div>
              <div><dt>Target Weight (Gram)</dt><dd>{selectedOrder.targetWeight.toFixed(3)}</dd></div>
              <div><dt>Total Issued (Gram)</dt><dd>{Number.isFinite(issuedWeight) ? issuedWeight.toFixed(3) : "0.000"}</dd></div>
              <div><dt>Total Returned (Gram)</dt><dd>{Number.isFinite(returnedWeight) ? returnedWeight.toFixed(3) : "0.000"}</dd></div>
            </dl>
          </Card>
          <Card aria-labelledby="weight-breakdown-title" className={styles.summaryCard}>
            <h2 id="weight-breakdown-title">Weight Breakdown</h2>
            <dl className={styles.breakdown}>
              <div><dt>Total Issued</dt><dd>{Number.isFinite(issuedWeight) ? issuedWeight.toFixed(3) : "0.000"} g</dd></div>
              <div><dt>Total Returned</dt><dd>{Number.isFinite(returnedWeight) ? returnedWeight.toFixed(3) : "0.000"} g</dd></div>
              <div className={styles.netValue}><dt>Net Wastage</dt><dd>{netWastage.toFixed(3)} g</dd></div>
              <div className={styles.approvedValue}><dt>Approved Wastage</dt><dd>{Number.isFinite(approvedWeight) ? approvedWeight.toFixed(3) : "0.000"} g</dd></div>
              <div><dt>Unapproved Wastage</dt><dd>{unapprovedWastage.toFixed(3)} g</dd></div>
            </dl>
          </Card>
        </aside>
      </form>
    </div>
  );
}
