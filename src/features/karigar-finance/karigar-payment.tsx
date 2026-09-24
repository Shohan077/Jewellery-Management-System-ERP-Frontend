"use client";

import Link from "next/link";
import { BookOpen, MapPin, RotateCcw, Save, WalletCards } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  baseRecentPayments,
  formatKarigarDate,
  formatTaka,
  getKarigarProfile,
  karigarFinanceProfiles,
  karigarInitials,
  karigarPaymentMethods,
  type KarigarFinancePayment,
  type KarigarPaymentMethod,
} from "./karigar-finance-data";
import styles from "./karigar-finance.module.css";
import { persistKarigarFinancePayment, useKarigarFinancePayments } from "./use-karigar-finance-payments";

type PaymentDraft = {
  paymentNo: string;
  date: string;
  karigarId: string;
  method: KarigarPaymentMethod;
  amount: string;
  referenceNo: string;
  remarks: string;
};

const INITIAL_PAYMENT: PaymentDraft = {
  paymentNo: "PAY-2025-003",
  date: "2025-04-30",
  karigarId: "K-001",
  method: "Cash",
  amount: "25000",
  referenceNo: "REF-1234",
  remarks: "Monthly payment for completed items",
};

export function KarigarPayment() {
  const savedPayments = useKarigarFinancePayments();
  const [draft, setDraft] = useState<PaymentDraft>({ ...INITIAL_PAYMENT });
  const [feedback, setFeedback] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  const profile = getKarigarProfile(draft.karigarId);

  const savedForKarigar = savedPayments.filter((payment) => payment.karigarId === draft.karigarId);
  const addedPayments = savedForKarigar.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayment = profile.totalPayment + addedPayments;
  const currentDue = Math.max(0, profile.workValue - totalPayment);

  const recentPayments = useMemo(() => {
    const customKeys = new Set(savedPayments.map((payment) => `${payment.karigarId}:${payment.paymentNo}`));
    return [
      ...savedPayments,
      ...baseRecentPayments.filter((payment) => !customKeys.has(`${payment.karigarId}:${payment.paymentNo}`)),
    ]
      .filter((payment) => payment.karigarId === draft.karigarId)
      .sort((first, second) => second.date.localeCompare(first.date) || second.savedAt.localeCompare(first.savedAt))
      .slice(0, 6);
  }, [draft.karigarId, savedPayments]);

  function resetForm() {
    setDraft({ ...INITIAL_PAYMENT });
    setFeedback({ kind: "info", text: "Payment form reset to the original values." });
  }

  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(draft.amount);
    if (!draft.paymentNo.trim() || !draft.date || !draft.karigarId || !draft.method || !draft.amount.trim()) {
      setFeedback({ kind: "error", text: "Complete all required payment fields." });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback({ kind: "error", text: "Enter a payment amount greater than zero." });
      return;
    }
    const existing = savedPayments.find((payment) => payment.karigarId === draft.karigarId && payment.paymentNo === draft.paymentNo.trim());
    if (amount > currentDue + (existing?.amount ?? 0)) {
      setFeedback({ kind: "error", text: `Amount cannot exceed the current due of ৳ ${formatTaka(currentDue + (existing?.amount ?? 0))}.` });
      return;
    }

    const payment: KarigarFinancePayment = {
      id: existing?.id ?? `karigar-payment-${draft.karigarId}-${draft.paymentNo.trim().replaceAll("/", "-")}`,
      paymentNo: draft.paymentNo.trim(),
      date: draft.date,
      karigarId: draft.karigarId,
      method: draft.method,
      amount,
      referenceNo: draft.referenceNo.trim(),
      remarks: draft.remarks.trim(),
      savedAt: new Date().toISOString(),
    };

    if (!persistKarigarFinancePayment(payment)) {
      setFeedback({ kind: "error", text: "This browser blocked local storage. The payment was not saved." });
      return;
    }
    setFeedback({ kind: "success", text: `${payment.paymentNo} saved. The karigar ledger has been updated.` });
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div><h1>Karigar Payment</h1><nav aria-label="Breadcrumb"><Link href="/dashboard">Home</Link><span aria-hidden="true">›</span><Link href="/karigars">Karigar Management</Link><span aria-hidden="true">›</span><span aria-current="page">Karigar Payment</span></nav></div>
      </header>

      <div className={styles.paymentLayout}>
        <Card as="form" className={styles.paymentForm} noValidate onSubmit={savePayment}>
          <h2>Payment Information</h2>
          <div className={styles.paymentFields}>
            <label><span>Payment No <b>*</b></span><input onChange={(event) => { setDraft((current) => ({ ...current, paymentNo: event.target.value })); setFeedback(null); }} value={draft.paymentNo} /></label>
            <label><span>Payment Date <b>*</b></span><input onChange={(event) => { setDraft((current) => ({ ...current, date: event.target.value })); setFeedback(null); }} type="date" value={draft.date} /></label>
            <label><span>Karigar <b>*</b></span><select onChange={(event) => { setDraft((current) => ({ ...current, karigarId: event.target.value })); setFeedback(null); }} value={draft.karigarId}>{karigarFinanceProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select></label>
            <label><span>Payment Method <b>*</b></span><select onChange={(event) => { setDraft((current) => ({ ...current, method: event.target.value as KarigarPaymentMethod })); setFeedback(null); }} value={draft.method}>{karigarPaymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
            <label><span>Amount <b>*</b></span><input inputMode="decimal" min="0" onChange={(event) => { setDraft((current) => ({ ...current, amount: event.target.value })); setFeedback(null); }} step="0.01" type="number" value={draft.amount} /></label>
            <label><span>Reference No</span><input onChange={(event) => { setDraft((current) => ({ ...current, referenceNo: event.target.value })); setFeedback(null); }} value={draft.referenceNo} /></label>
            <label><span>Remarks</span><textarea onChange={(event) => { setDraft((current) => ({ ...current, remarks: event.target.value })); setFeedback(null); }} value={draft.remarks} /></label>
          </div>
          <footer>
            <button className={styles.savePaymentButton} type="submit"><Save aria-hidden="true" size={14} />Save Payment</button>
            <button className={styles.resetButton} onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={14} />Reset</button>
          </footer>
        </Card>

        <div className={styles.paymentAside}>
          <Card className={styles.summaryCard}>
            <h2>Karigar Summary</h2>
            <div className={styles.summaryTop}>
              <div className={styles.summaryIdentity}><span aria-hidden="true" className={styles.avatar}>{karigarInitials(profile.name)}</span><div><strong>{profile.name}</strong><small>{profile.code}</small><span><MapPin aria-hidden="true" size={11} />{profile.address}</span></div></div>
              <Link className={styles.viewLedgerButton} href="/karigar-management/ledger"><BookOpen aria-hidden="true" size={14} />View Ledger</Link>
            </div>
            <div className={styles.summaryMetrics}><div><span>Total Work Value</span><strong>৳ {formatTaka(profile.workValue)}</strong></div><div><span>Total Payment</span><strong>৳ {formatTaka(totalPayment)}</strong></div><div><span>Current Due</span><strong>৳ {formatTaka(currentDue)}</strong></div></div>
          </Card>

          <Card className={styles.recentCard}>
            <h2>Recent Payments</h2>
            <div className={styles.tableScroller}>
              <table>
                <caption className="sr-only">Recent payments for {profile.name}</caption>
                <thead><tr><th scope="col">Date</th><th scope="col">Payment No</th><th scope="col">Amount (৳)</th><th scope="col">Method</th></tr></thead>
                <tbody>{recentPayments.map((payment) => <tr key={`${payment.karigarId}-${payment.paymentNo}`}><td>{formatKarigarDate(payment.date)}</td><td>{payment.paymentNo}</td><td>{formatTaka(payment.amount)}</td><td>{payment.method}</td></tr>)}{!recentPayments.length ? <tr><td className={styles.emptyState} colSpan={4}>No recent payments.</td></tr> : null}</tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {feedback ? <p aria-live="polite" className={`${styles.feedback} ${styles[feedback.kind]}`}><WalletCards aria-hidden="true" size={15} />{feedback.text}</p> : null}
    </div>
  );
}
