"use client";

import { Save, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  defaultSupplierPayment,
  formatInr,
  isSupplierPaymentRecord,
  outstandingInvoices,
  suppliers,
  SUPPLIER_PAYMENT_EVENT,
  SUPPLIER_PAYMENTS_STORAGE_KEY,
  type SupplierPaymentRecord,
} from "./supplier-finance-data";
import styles from "./supplier-finance.module.css";

type PaymentDraft = Omit<SupplierPaymentRecord, "id" | "allocations">;

const initialDraft: PaymentDraft = {
  supplier: defaultSupplierPayment.supplier,
  referenceNo: defaultSupplierPayment.referenceNo,
  date: defaultSupplierPayment.date,
  method: defaultSupplierPayment.method,
  amount: defaultSupplierPayment.amount,
  remarks: defaultSupplierPayment.remarks,
};

const initialAllocations = Object.fromEntries(
  defaultSupplierPayment.allocations.map((allocation) => [allocation.invoiceNo, allocation.amount]),
) as Record<string, number>;

function readSavedPayments() {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(SUPPLIER_PAYMENTS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isSupplierPaymentRecord) : [];
  } catch {
    return [];
  }
}

export function SupplierPaymentEntry() {
  const [draft, setDraft] = useState<PaymentDraft>(initialDraft);
  const [allocations, setAllocations] = useState<Record<string, number>>(initialAllocations);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error">("success");

  const allocatedTotal = outstandingInvoices.reduce(
    (sum, invoice) => sum + (allocations[invoice.invoiceNo] ?? 0),
    0,
  );

  function updateAllocation(invoiceNo: string, nextValue: number) {
    const invoice = outstandingInvoices.find((item) => item.invoiceNo === invoiceNo);
    const amount = Math.max(0, Math.min(invoice?.due ?? 0, Number.isFinite(nextValue) ? nextValue : 0));
    const next = { ...allocations, [invoiceNo]: amount };
    setAllocations(next);
    setDraft((current) => ({
      ...current,
      amount: outstandingInvoices.reduce((sum, item) => sum + (next[item.invoiceNo] ?? 0), 0),
    }));
    setMessage("");
  }

  function distributePayment(nextValue: number) {
    let remaining = Math.max(0, Math.min(95_000, Number.isFinite(nextValue) ? nextValue : 0));
    const next: Record<string, number> = {};
    outstandingInvoices.forEach((invoice) => {
      next[invoice.invoiceNo] = Math.min(invoice.due, remaining);
      remaining -= next[invoice.invoiceNo];
    });
    setAllocations(next);
    setDraft((current) => ({ ...current, amount: nextValue }));
    setMessage("");
  }

  function clearForm() {
    setDraft({ supplier: "", referenceNo: "", date: "", method: "", amount: 0, remarks: "" });
    setAllocations(Object.fromEntries(outstandingInvoices.map((invoice) => [invoice.invoiceNo, 0])));
    setMessageKind("success");
    setMessage("Payment form cleared.");
  }

  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.supplier || !draft.referenceNo || !draft.date || !draft.method) {
      setMessageKind("error");
      setMessage("Complete all required payment fields.");
      return;
    }
    if (draft.amount <= 0 || allocatedTotal !== draft.amount) {
      setMessageKind("error");
      setMessage("The invoice allocation must equal the paid amount.");
      return;
    }

    const record: SupplierPaymentRecord = {
      ...draft,
      id: `supplier-payment-${draft.referenceNo.replaceAll("/", "-")}`,
      allocations: outstandingInvoices
        .map((invoice) => ({ invoiceNo: invoice.invoiceNo, amount: allocations[invoice.invoiceNo] ?? 0 }))
        .filter((allocation) => allocation.amount > 0),
    };

    try {
      const stored = readSavedPayments();
      const next = [record, ...stored.filter((item) => item.referenceNo !== record.referenceNo)];
      window.localStorage.setItem(SUPPLIER_PAYMENTS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SUPPLIER_PAYMENT_EVENT));
      setMessageKind("success");
      setMessage(`${record.referenceNo} saved. The supplier ledger has been updated.`);
    } catch {
      setMessageKind("error");
      setMessage("This browser blocked local storage. The payment was not saved.");
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader description="Record and allocate a payment against supplier invoices" title="Supplier Payment Entry" />

      <form className={styles.entryForm} onSubmit={savePayment}>
        <Card className={styles.formCard}>
          <div className={styles.formGrid}>
            <label className={styles.fieldLabel}>
              <span>Supplier <b>*</b></span>
              <select className="select" onChange={(event) => setDraft((current) => ({ ...current, supplier: event.target.value }))} required value={draft.supplier}>
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}
              </select>
            </label>
            <label className={styles.fieldLabel}>
              <span>Reference No</span>
              <input className="field" onChange={(event) => setDraft((current) => ({ ...current, referenceNo: event.target.value }))} placeholder="PAY/2025/0000" value={draft.referenceNo} />
            </label>
            <label className={styles.fieldLabel}>
              <span>Payment Date <b>*</b></span>
              <input className="field" onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} required type="date" value={draft.date} />
            </label>
            <label className={styles.fieldLabel}>
              <span>Paid Amount <b>*</b></span>
              <input className="field" min="0" onChange={(event) => distributePayment(Number(event.target.value))} required step="0.01" type="number" value={draft.amount} />
            </label>
            <label className={styles.fieldLabel}>
              <span>Payment Method <b>*</b></span>
              <select className="select" onChange={(event) => setDraft((current) => ({ ...current, method: event.target.value }))} required value={draft.method}>
                <option value="">Select method</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
                <option>Mobile Banking</option>
              </select>
            </label>
            <label className={styles.fieldLabel}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => setDraft((current) => ({ ...current, remarks: event.target.value }))} value={draft.remarks} />
            </label>
          </div>
        </Card>

        <Card className={styles.invoiceCard}>
          <header className={styles.cardTitle}><h2>Outstanding Invoices</h2><span>{outstandingInvoices.length} invoices</span></header>
          <div className={styles.tableScroller}>
            <table>
              <caption className="sr-only">Outstanding supplier invoices and allocated payments</caption>
              <thead><tr><th scope="col">Invoice No</th><th scope="col">Invoice Date</th><th scope="col">Total Amount</th><th scope="col">Paid</th><th scope="col">Due</th><th scope="col">Payment</th></tr></thead>
              <tbody>
                {outstandingInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNo}>
                    <td className={styles.reference}>{invoice.invoiceNo}</td>
                    <td>{invoice.invoiceDate}</td>
                    <td>{formatInr(invoice.totalAmount)}</td>
                    <td>{formatInr(invoice.paid)}</td>
                    <td className={styles.due}>{formatInr(invoice.due)}</td>
                    <td><input aria-label={`Payment for ${invoice.invoiceNo}`} className={styles.amountInput} max={invoice.due} min="0" onChange={(event) => updateAllocation(invoice.invoiceNo, Number(event.target.value))} step="0.01" type="number" value={allocations[invoice.invoiceNo] ?? 0} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.totalBar}><span>Total Payment</span><strong>{formatInr(allocatedTotal)}</strong></div>
        </Card>

        <p aria-live="polite" className={`${styles.message} ${messageKind === "error" ? styles.errorMessage : ""} ${message ? "" : "sr-only"}`}>{message}</p>

        <footer className={styles.entryActions}>
          <button className={`button ${styles.clearButton}`} onClick={clearForm} type="button"><Trash2 aria-hidden="true" size={16} />Clear</button>
          <button className={`button ${styles.primaryButton}`} type="submit"><Save aria-hidden="true" size={16} />Save Payment</button>
        </footer>
      </form>
    </div>
  );
}
