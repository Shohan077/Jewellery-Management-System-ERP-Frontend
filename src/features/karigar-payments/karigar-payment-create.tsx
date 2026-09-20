"use client";

import { CheckCircle2, CircleAlert, RotateCcw, Save, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  KARIGAR_PAYMENTS_STORAGE_EVENT,
  KARIGAR_PAYMENTS_STORAGE_KEY,
  formatPaymentDate,
  formatTaka,
  isKarigarPaymentRecord,
  karigarNames,
  karigarProfiles,
  paymentMethods,
  type KarigarPaymentMethod,
  type KarigarPaymentRecord,
} from "./karigar-payment-data";
import styles from "./karigar-payments.module.css";

type PaymentForm = {
  paymentNo: string;
  paymentDate: string;
  karigar: string;
  method: KarigarPaymentMethod;
  reference: string;
  labourAmount: string;
  bonus: string;
  deduction: string;
  previousDue: string;
  paidAmount: string;
  remarks: string;
};

type Feedback = { tone: "error" | "success"; message: string } | null;

const initialForm: PaymentForm = {
  paymentNo: "PAY-2025-001",
  paymentDate: "2025-04-12",
  karigar: "Mohammad Ali",
  method: "Cash",
  reference: "MO-2025-001",
  labourAmount: "12500.00",
  bonus: "1000.00",
  deduction: "500.00",
  previousDue: "2000.00",
  paidAmount: "15000.00",
  remarks: "Payment for Gold Ring (22K) order completion.",
};

function readStoredPayments() {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(KARIGAR_PAYMENTS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed.filter(isKarigarPaymentRecord) : [];
  } catch {
    return [];
  }
}

function numericValue(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function KarigarPaymentCreate() {
  const router = useRouter();
  const [form, setForm] = useState<PaymentForm>(initialForm);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const profile = karigarProfiles[form.karigar] ?? karigarProfiles[karigarNames[0]];
  const totals = useMemo(() => {
    const labourAmount = numericValue(form.labourAmount);
    const bonus = numericValue(form.bonus);
    const deduction = numericValue(form.deduction);
    const previousDue = numericValue(form.previousDue);
    const paidAmount = numericValue(form.paidAmount);
    const totalPayable = Math.max(0, labourAmount + bonus - deduction + previousDue);
    return {
      labourAmount,
      bonus,
      deduction,
      previousDue,
      paidAmount,
      totalPayable,
      remainingDue: Math.max(0, totalPayable - paidAmount),
    };
  }, [form.bonus, form.deduction, form.labourAmount, form.paidAmount, form.previousDue]);

  function updateField<Key extends keyof PaymentForm>(key: Key, value: PaymentForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function selectKarigar(karigar: string) {
    const nextProfile = karigarProfiles[karigar];
    setForm((current) => ({
      ...current,
      karigar,
      previousDue: nextProfile.currentBalance.toFixed(2),
    }));
    setFeedback(null);
  }

  function resetForm() {
    setForm({ ...initialForm });
    setFeedback({ tone: "success", message: "Payment entry reset to the original values." });
  }

  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredText = [form.paymentNo, form.paymentDate, form.karigar, form.method, form.reference];
    if (requiredText.some((value) => !value.trim())) {
      setFeedback({ tone: "error", message: "Complete every required payment field." });
      return;
    }
    if (!form.labourAmount.trim() || !form.paidAmount.trim()) {
      setFeedback({ tone: "error", message: "Enter both the labour amount and the paid amount." });
      return;
    }

    const numericInputs = [
      Number(form.labourAmount),
      Number(form.bonus),
      Number(form.deduction),
      Number(form.previousDue),
      Number(form.paidAmount),
    ];
    if (!numericInputs.every(Number.isFinite) || numericInputs.some((value) => value < 0)) {
      setFeedback({ tone: "error", message: "Enter valid non-negative payment amounts." });
      return;
    }
    if (totals.totalPayable <= 0) {
      setFeedback({ tone: "error", message: "The total payable amount must be greater than zero." });
      return;
    }
    if (totals.paidAmount <= 0) {
      setFeedback({ tone: "error", message: "Enter an amount paid greater than zero." });
      return;
    }
    if (totals.paidAmount > totals.totalPayable) {
      setFeedback({ tone: "error", message: "Paid amount cannot be greater than total payable." });
      return;
    }

    const record: KarigarPaymentRecord = {
      id: form.paymentNo.trim(),
      paymentNo: form.paymentNo.trim(),
      date: formatPaymentDate(form.paymentDate),
      dateIso: form.paymentDate,
      karigar: form.karigar,
      reference: form.reference.trim(),
      labourAmount: totals.labourAmount,
      bonus: totals.bonus,
      deduction: totals.deduction,
      previousDue: totals.previousDue,
      paidAmount: totals.paidAmount,
      dueAmount: totals.remainingDue,
      method: form.method,
      status: totals.remainingDue > 0 ? "Partial" : "Paid",
      remarks: form.remarks.trim(),
    };

    try {
      const stored = readStoredPayments();
      const next = [record, ...stored.filter((item) => item.paymentNo !== record.paymentNo)];
      window.localStorage.setItem(KARIGAR_PAYMENTS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(KARIGAR_PAYMENTS_STORAGE_EVENT));
      router.push("/manufacturing/karigar-payments");
    } catch {
      setFeedback({
        tone: "error",
        message: "This payment could not be saved in browser storage. Please try again.",
      });
    }
  }

  return (
    <div className={styles.createPage}>
      <header className={styles.createHeader}>
        <h1>Karigar Payment Entry</h1>
        <nav aria-label="Breadcrumb">
          <span>Manufacturing</span>
          <b aria-hidden="true">›</b>
          <span aria-current="page">Karigar Payment Entry</span>
        </nav>
      </header>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success"
          ? <CheckCircle2 aria-hidden="true" size={16} />
          : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form className={styles.createShell} noValidate onSubmit={savePayment}>
        <Card className={styles.entryCard}>
          <h2>Payment Details</h2>
          <div className={styles.formGrid}>
            <label className={styles.control}>
              <span>Payment No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => updateField("paymentNo", event.target.value)} required value={form.paymentNo} />
            </label>
            <label className={styles.control}>
              <span>Payment Date <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => updateField("paymentDate", event.target.value)} required type="date" value={form.paymentDate} />
            </label>
            <label className={styles.control}>
              <span>Karigar <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => selectKarigar(event.target.value)} required value={form.karigar}>
                {karigarNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Payment Method <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => updateField("method", event.target.value as KarigarPaymentMethod)} required value={form.method}>
                {paymentMethods.map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
            <label className={`${styles.control} ${styles.fullField}`}>
              <span>Work Order / Reference <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => updateField("reference", event.target.value)} required value={form.reference} />
            </label>
            <label className={styles.control}>
              <span>Labour Amount (৳) <b aria-hidden="true">*</b></span>
              <input className="field" min="0" onChange={(event) => updateField("labourAmount", event.target.value)} required step="0.01" type="number" value={form.labourAmount} />
            </label>
            <label className={styles.control}>
              <span>Bonus (৳)</span>
              <input className="field" min="0" onChange={(event) => updateField("bonus", event.target.value)} step="0.01" type="number" value={form.bonus} />
            </label>
            <label className={styles.control}>
              <span>Deduction (৳)</span>
              <input className="field" min="0" onChange={(event) => updateField("deduction", event.target.value)} step="0.01" type="number" value={form.deduction} />
            </label>
            <label className={styles.control}>
              <span>Previous Due (৳)</span>
              <input className="field" min="0" onChange={(event) => updateField("previousDue", event.target.value)} step="0.01" type="number" value={form.previousDue} />
            </label>
            <label className={styles.control}>
              <span>Net Payable (৳)</span>
              <output className={styles.readonlyValue}>{formatTaka(totals.totalPayable)}</output>
            </label>
            <label className={styles.control}>
              <span>Paid Amount (৳) <b aria-hidden="true">*</b></span>
              <input className="field" max={totals.totalPayable} min="0" onChange={(event) => updateField("paidAmount", event.target.value)} required step="0.01" type="number" value={form.paidAmount} />
            </label>
            <label className={styles.control}>
              <span>Remaining Due (৳)</span>
              <output className={`${styles.readonlyValue} ${totals.remainingDue > 0 ? styles.dueValue : ""}`}>{formatTaka(totals.remainingDue)}</output>
            </label>
            <label className={`${styles.control} ${styles.fullField}`}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => updateField("remarks", event.target.value)} placeholder="Enter remarks (optional)..." value={form.remarks} />
            </label>
          </div>

          <footer className={styles.formActions}>
            <button className="button" onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={17} />Reset</button>
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Payment</button>
          </footer>
        </Card>

        <Card aria-labelledby="karigar-summary-title" className={styles.summaryCard}>
          <h2 id="karigar-summary-title">Karigar Summary</h2>
          <div className={styles.karigarIdentity}>
            <span aria-hidden="true"><UserRound size={32} /></span>
            <strong>{form.karigar}</strong>
          </div>
          <dl>
            <div><dt>Karigar ID</dt><dd>{profile.id}</dd></div>
            <div><dt>Specialization</dt><dd>{profile.specialization}</dd></div>
          </dl>
          <div className={styles.summaryMetric}>
            <span>Completed Jobs</span>
            <strong>{profile.completedJobs}</strong>
          </div>
          <div className={`${styles.summaryMetric} ${styles.balanceMetric}`}>
            <span>Current Balance (৳)</span>
            <strong>{formatTaka(totals.previousDue)}</strong>
          </div>
          <div className={`${styles.summaryMetric} ${styles.payableMetric}`}>
            <span>Total Payable (৳)</span>
            <strong>{formatTaka(totals.totalPayable)}</strong>
          </div>
        </Card>
      </form>
    </div>
  );
}
