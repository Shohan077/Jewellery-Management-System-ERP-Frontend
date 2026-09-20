"use client";

import { CheckCircle2, CircleAlert, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  FINISHED_PRODUCTS_STORAGE_EVENT,
  FINISHED_PRODUCTS_STORAGE_KEY,
  finishedProductKarigars,
  finishedProductOptions,
  finishedProductOrders,
  finishedProductStatuses,
  formatFinishedProductDate,
  isFinishedProductRecord,
  productionOrderSummaries,
  purityOptions,
  type FinishedProductOrder,
  type FinishedProductRecord,
  type FinishedProductStatus,
} from "./finished-product-data";
import styles from "./finished-products.module.css";

type FinishedProductForm = {
  completionNo: string;
  completionDate: string;
  manufacturingOrder: FinishedProductOrder;
  product: string;
  karigar: string;
  finalWeight: string;
  purity: string;
  makingCharge: string;
  stoneWeight: string;
  wastageAdjustment: string;
  status: FinishedProductStatus;
  remarks: string;
};

const initialForm: FinishedProductForm = {
  completionNo: "FP-2025-001",
  completionDate: "2025-04-12",
  manufacturingOrder: "MO-2025-001",
  product: "Gold Ring (22K)",
  karigar: "Mohammad Ali",
  finalWeight: "48.750",
  purity: "22K",
  makingCharge: "350.00",
  stoneWeight: "0.250",
  wastageAdjustment: "0.050",
  status: "Completed" as FinishedProductStatus,
  remarks: "",
};

type Feedback = { tone: "error" | "success"; message: string } | null;

function readSavedProducts() {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(FINISHED_PRODUCTS_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isFinishedProductRecord) : [];
  } catch {
    return [];
  }
}

export function FinishedProductCreate() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const summary = productionOrderSummaries[form.manufacturingOrder];
  const netConsumed = summary.totalIssued - summary.totalReturned;
  const balance = useMemo(() => {
    const finalWeight = Number(form.finalWeight);
    if (!Number.isFinite(finalWeight)) return 0;
    return Number((netConsumed - finalWeight).toFixed(3));
  }, [form.finalWeight, netConsumed]);

  function updateField<Key extends keyof FinishedProductForm>(key: Key, value: FinishedProductForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function selectOrder(order: FinishedProductOrder) {
    const nextSummary = productionOrderSummaries[order];
    const product = finishedProductOptions.find((option) => option.name === nextSummary.product);
    setForm((current) => ({
      ...current,
      manufacturingOrder: order,
      product: nextSummary.product,
      karigar: nextSummary.karigar,
      purity: product?.purity ?? current.purity,
      finalWeight: (nextSummary.totalIssued - nextSummary.totalReturned).toFixed(3),
    }));
    setFeedback(null);
  }

  function selectProduct(productName: string) {
    const product = finishedProductOptions.find((option) => option.name === productName);
    setForm((current) => ({
      ...current,
      product: productName,
      purity: product?.purity ?? current.purity,
    }));
    setFeedback(null);
  }

  function resetForm() {
    setForm({ ...initialForm });
    setFeedback({ tone: "success", message: "Finished product entry reset to the original values." });
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalWeight = Number(form.finalWeight);
    const makingCharge = Number(form.makingCharge);
    const stoneWeight = Number(form.stoneWeight);
    const wastageAdjustment = Number(form.wastageAdjustment);
    const product = finishedProductOptions.find((option) => option.name === form.product) ?? finishedProductOptions[0];

    if (!form.completionNo.trim() || !form.completionDate || !form.manufacturingOrder || !form.karigar) {
      setFeedback({ tone: "error", message: "Complete all required finished product fields." });
      return;
    }
    if (![finalWeight, makingCharge, stoneWeight, wastageAdjustment].every(Number.isFinite) || finalWeight <= 0 || makingCharge < 0 || stoneWeight < 0 || wastageAdjustment < 0) {
      setFeedback({ tone: "error", message: "Enter valid non-negative weight and making charge values." });
      return;
    }
    if (Math.abs(balance) > 0.0005) {
      setFeedback({ tone: "error", message: `Final weight must match the ${netConsumed.toFixed(3)} gram net-consumed weight before saving.` });
      return;
    }

    const record: FinishedProductRecord = {
      id: form.completionNo.trim(),
      completionNo: form.completionNo.trim(),
      completionDate: form.completionDate,
      product: form.product,
      productKind: product.kind,
      karigar: form.karigar,
      finalWeight,
      purity: form.purity,
      status: form.status,
      inventorySync: form.status === "Completed" ? "Synced" : "Pending",
      manufacturingOrder: form.manufacturingOrder,
      orderDate: summary.orderDate,
      targetWeight: summary.targetWeight,
      totalIssued: summary.totalIssued,
      totalReturned: summary.totalReturned,
      stoneWeight,
      makingCharge,
      wastageAdjustment,
      remarks: form.remarks.trim(),
      expectedCompletion: summary.expectedCompletion,
    };

    try {
      const saved = readSavedProducts();
      const next = [record, ...saved.filter((item) => item.completionNo !== record.completionNo)];
      window.localStorage.setItem(FINISHED_PRODUCTS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(FINISHED_PRODUCTS_STORAGE_EVENT));
      router.push("/manufacturing/finished-products");
    } catch {
      setFeedback({ tone: "error", message: "This entry could not be saved in browser storage. Please try again." });
    }
  }

  return (
    <div className={styles.createPage}>
      <header className={styles.createHeader}>
        <h1>Finished Product Entry</h1>
        <nav aria-label="Breadcrumb">
          <span>Manufacturing</span><b aria-hidden="true">›</b><span aria-current="page">Finished Product Entry</span>
        </nav>
      </header>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form className={styles.createShell} noValidate onSubmit={saveEntry}>
        <Card className={styles.entryCard}>
          <header className={styles.cardHeading}>
            <h2>Completion Information</h2>
            <p>Record completed finished product details</p>
          </header>

          <div className={styles.formGrid}>
            <label className={styles.control}>
              <span>Completion No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => updateField("completionNo", event.target.value)} required value={form.completionNo} />
            </label>
            <label className={styles.control}>
              <span>Completion Date <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => updateField("completionDate", event.target.value)} required type="date" value={form.completionDate} />
            </label>
            <label className={styles.control}>
              <span>Manufacturing Order <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => selectOrder(event.target.value as FinishedProductOrder)} required value={form.manufacturingOrder}>
                {finishedProductOrders.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Product <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => selectProduct(event.target.value)} required value={form.product}>
                {finishedProductOptions.map((option) => <option key={option.name}>{option.name}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Karigar <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => updateField("karigar", event.target.value)} required value={form.karigar}>
                {finishedProductKarigars.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Final Weight (Gram) <b aria-hidden="true">*</b></span>
              <input className="field" min="0.001" onChange={(event) => updateField("finalWeight", event.target.value)} required step="0.001" type="number" value={form.finalWeight} />
            </label>
            <label className={styles.control}>
              <span>Purity <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => updateField("purity", event.target.value)} required value={form.purity}>
                {purityOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Making Charge (BDT) <b aria-hidden="true">*</b></span>
              <input className="field" min="0" onChange={(event) => updateField("makingCharge", event.target.value)} required step="0.01" type="number" value={form.makingCharge} />
            </label>
            <label className={styles.control}>
              <span>Stone Weight (Gram)</span>
              <input className="field" min="0" onChange={(event) => updateField("stoneWeight", event.target.value)} step="0.001" type="number" value={form.stoneWeight} />
            </label>
            <label className={styles.control}>
              <span>Wastage Adjustment (Gram)</span>
              <input className="field" min="0" onChange={(event) => updateField("wastageAdjustment", event.target.value)} step="0.001" type="number" value={form.wastageAdjustment} />
            </label>
            <label className={styles.control}>
              <span>Status <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => updateField("status", event.target.value as FinishedProductStatus)} required value={form.status}>
                {finishedProductStatuses.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={`${styles.control} ${styles.remarksField}`}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => updateField("remarks", event.target.value)} placeholder="Enter remarks (optional)..." value={form.remarks} />
            </label>
          </div>

          <footer className={styles.formActions}>
            <button className={`button ${styles.resetButton}`} onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={17} />Reset</button>
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Entry</button>
          </footer>
        </Card>

        <Card aria-labelledby="order-summary-title" className={styles.summaryCard}>
          <h2 id="order-summary-title">Order / Production Summary</h2>
          <dl>
            <div><dt>Order No</dt><dd>{form.manufacturingOrder}</dd></div>
            <div><dt>Order Date</dt><dd>{formatFinishedProductDate(summary.orderDate)}</dd></div>
            <div><dt>Product</dt><dd>{form.product}</dd></div>
            <div><dt>Karigar</dt><dd>{form.karigar}</dd></div>
            <div className={styles.numericSummary}><dt>Target Weight (Gram)</dt><dd>{summary.targetWeight.toFixed(3)}</dd></div>
            <div className={styles.numericSummary}><dt>Total Issued (Gram)</dt><dd>{summary.totalIssued.toFixed(3)}</dd></div>
            <div className={styles.numericSummary}><dt>Total Returned (Gram)</dt><dd>{summary.totalReturned.toFixed(3)}</dd></div>
            <div className={styles.numericSummary}><dt>Net Consumed (Gram)</dt><dd>{netConsumed.toFixed(3)}</dd></div>
            <div className={styles.numericSummary}><dt>Expected Completion</dt><dd>{formatFinishedProductDate(summary.expectedCompletion)}</dd></div>
          </dl>
          <div className={`${styles.balanceCard} ${Math.abs(balance) > 0.0005 ? styles.balanceWarning : ""}`}>
            <span>Balance to Complete</span>
            <strong>{balance.toFixed(3)} Gram</strong>
          </div>
        </Card>
      </form>
    </div>
  );
}
