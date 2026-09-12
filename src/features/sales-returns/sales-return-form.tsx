"use client";

import { CheckCircle2, FileSearch, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatReturnCurrency,
  initialReturnLines,
  invoiceDetails,
  type ReturnLine,
} from "./sales-return-data";
import styles from "./sales-return-form.module.css";

type AdjustmentType = "Refund (Cash)" | "Store Credit";
type Feedback = { tone: "error" | "success"; message: string } | null;

function freshLines() {
  return initialReturnLines.map((line) => ({ ...line }));
}

export function SalesReturnForm() {
  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [lines, setLines] = useState<ReturnLine[]>(freshLines);
  const [reason, setReason] = useState("Product defect");
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("Refund (Cash)");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [submittedReference, setSubmittedReference] = useState("");

  const totalReturnAmount = useMemo(
    () => lines.reduce((total, line) => total + line.returnQuantity * line.unitRefund, 0),
    [lines],
  );

  function findInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = invoiceQuery.trim().toLowerCase();
    if (!query) {
      setFeedback({ tone: "error", message: "Enter an invoice number, customer name, or date." });
      return;
    }

    const matches = [invoiceDetails.invoiceNo, invoiceDetails.customer, invoiceDetails.customerId, invoiceDetails.invoiceDate]
      .some((value) => value.toLowerCase().includes(query));
    setFeedback(matches
      ? { tone: "success", message: `${invoiceDetails.invoiceNo} loaded for ${invoiceDetails.customer}.` }
      : { tone: "error", message: `No invoice matched “${invoiceQuery.trim()}”. Try S-2025-00125.` });
  }

  function updateReturnQuantity(id: number, nextValue: string) {
    const parsed = Number(nextValue);
    setLines((current) => current.map((line) => line.id === id
      ? { ...line, returnQuantity: Number.isFinite(parsed) ? Math.max(0, Math.min(line.purchasedQuantity, Math.trunc(parsed))) : 0 }
      : line));
    setSubmittedReference("");
    setFeedback(null);
  }

  function removeLine(line: ReturnLine) {
    setLines((current) => current.filter((item) => item.id !== line.id));
    setSubmittedReference("");
    setFeedback({ tone: "success", message: `${line.product} removed from this return.` });
  }

  function resetForm() {
    setInvoiceQuery("");
    setLines(freshLines());
    setReason("Product defect");
    setAdjustmentType("Refund (Cash)");
    setSubmittedReference("");
    setFeedback({ tone: "success", message: "Sales return reset to the original invoice values." });
  }

  function submitReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) {
      setFeedback({ tone: "error", message: "Enter a reason for this return." });
      return;
    }
    if (totalReturnAmount <= 0) {
      setFeedback({ tone: "error", message: "Select a return quantity for at least one product." });
      return;
    }

    const reference = `SR-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    setSubmittedReference(reference);
    setFeedback({
      tone: "success",
      message: `${reference} submitted. ${formatReturnCurrency(totalReturnAmount)} will be processed as ${adjustmentType.toLowerCase()}.`,
    });
  }

  return (
    <div className={styles.page}>
      <PageHeader description="Create a new sales return" title="Sales Return" />

      <form className={styles.lookup} onSubmit={findInvoice}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search invoice</span>
          <input
            onChange={(event) => {
              setInvoiceQuery(event.target.value);
              setFeedback(null);
            }}
            placeholder="Search by invoice no, customer name or date..."
            type="search"
            value={invoiceQuery}
          />
        </label>
        <button className="button button--primary" type="submit">
          <FileSearch aria-hidden="true" size={16} />
          Find Invoice
        </button>
      </form>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.message ?? ""}
      </p>

      <Card className={styles.invoiceCard}>
        <h2>Original Invoice Details</h2>
        <dl className={styles.invoiceGrid}>
          <div><dt>Invoice No</dt><dd>{invoiceDetails.invoiceNo}</dd></div>
          <div><dt>Invoice Date</dt><dd>{invoiceDetails.invoiceDate}</dd></div>
          <div><dt>Customer</dt><dd>{invoiceDetails.customer} ({invoiceDetails.customerId})</dd></div>
          <div><dt>Total Amount</dt><dd>{formatReturnCurrency(invoiceDetails.totalAmount)}</dd></div>
        </dl>
      </Card>

      <form noValidate onSubmit={submitReturn}>
        <Card className={styles.returnCard}>
          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <caption className="sr-only">Products available on the original invoice</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product</th>
                  <th scope="col">Purity</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Rate (৳)</th>
                  <th scope="col">Return Qty</th>
                  <th scope="col">Return Amount (৳)</th>
                  <th scope="col"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={line.id}>
                    <td>{index + 1}</td>
                    <td><strong>{line.product} ({line.code})</strong></td>
                    <td>{line.purity}</td>
                    <td>{line.weight.toFixed(2)} g</td>
                    <td>{line.rate.toLocaleString("en-IN")}</td>
                    <td>
                      <input
                        aria-label={`Return quantity for ${line.product}`}
                        className={styles.quantity}
                        max={line.purchasedQuantity}
                        min="0"
                        onChange={(event) => updateReturnQuantity(line.id, event.target.value)}
                        step="1"
                        type="number"
                        value={line.returnQuantity}
                      />
                    </td>
                    <td><strong>{formatReturnCurrency(line.returnQuantity * line.unitRefund)}</strong></td>
                    <td>
                      <button aria-label={`Remove ${line.product}`} className={styles.removeButton} onClick={() => removeLine(line)} title="Remove product" type="button">
                        <Trash2 aria-hidden="true" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {lines.length === 0 ? <tr><td className={styles.emptyRow} colSpan={8}>All invoice products were removed. Reset to restore them.</td></tr> : null}
              </tbody>
            </table>
          </div>

          <div className={styles.returnFooter}>
            <label className={styles.reasonField}>
              <span>Reason for Return <b>*</b></span>
              <textarea
                aria-invalid={!reason.trim()}
                className="textarea"
                onChange={(event) => {
                  setReason(event.target.value);
                  setSubmittedReference("");
                  setFeedback(null);
                }}
                placeholder="Enter a reason for this return"
                required
                value={reason}
              />
            </label>
            <section aria-labelledby="adjustment-title" className={styles.summary}>
              <div className={styles.totalRow}><span>Total Return Amount</span><strong>{formatReturnCurrency(totalReturnAmount)}</strong></div>
              <fieldset>
                <legend id="adjustment-title">Adjustment Type</legend>
                <label><input checked={adjustmentType === "Refund (Cash)"} name="adjustment" onChange={() => setAdjustmentType("Refund (Cash)")} type="radio" /> Refund (Cash)</label>
                <label><input checked={adjustmentType === "Store Credit"} name="adjustment" onChange={() => setAdjustmentType("Store Credit")} type="radio" /> Store Credit</label>
              </fieldset>
              {submittedReference ? <p className={styles.reference}><CheckCircle2 aria-hidden="true" size={15} /> Submitted as {submittedReference}</p> : null}
            </section>
          </div>

          <div className={styles.actions}>
            <button className="button" onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={15} /> Reset</button>
            <button className="button button--primary" type="submit"><CheckCircle2 aria-hidden="true" size={15} /> Submit Return</button>
          </div>
        </Card>
      </form>
    </div>
  );
}
