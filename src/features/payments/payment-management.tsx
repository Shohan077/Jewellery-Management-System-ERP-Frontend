"use client";

import {
  CheckCircle2,
  CircleAlert,
  Eye,
  Plus,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatPaymentAmount,
  formatPaymentDate,
  initialPayments,
  paymentCustomers,
  paymentSuppliers,
  type PaymentPartyType,
  type PaymentRecord,
} from "./payment-data";
import styles from "./payment-management.module.css";

const STORAGE_KEY = "jewellery-erp:payments:v1";
const STORAGE_EVENT = "jewellery-erp:payments-updated";
const EMPTY_SAVED_PAYMENTS = "[]";

type PaymentKind = "Customer Payment" | "Supplier Payment";
type PaymentForm = {
  paymentType: PaymentKind;
  partyId: string;
  invoiceNo: string;
  paymentDate: string;
  paymentMethod: string;
  amount: string;
  referenceNo: string;
  bankName: string;
  remarks: string;
};

type FormErrors = Partial<Record<"partyId" | "invoiceNo" | "paymentDate" | "paymentMethod" | "amount", string>>;
type Feedback = { tone: "error" | "success" | "info"; message: string } | null;

function createInitialForm(): PaymentForm {
  return {
    paymentType: "Customer Payment",
    partyId: "C-000125",
    invoiceNo: "S-2025-00125",
    paymentDate: "2025-04-30",
    paymentMethod: "Bank Transfer",
    amount: "1,25,300",
    referenceNo: "TXN123456",
    bankName: "BRAC Bank",
    remarks: "Payment received against invoice S-2025-00125",
  };
}

function readPaymentsSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SAVED_PAYMENTS;
  } catch {
    return EMPTY_SAVED_PAYMENTS;
  }
}

function subscribeToSavedPayments(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(STORAGE_EVENT, handleChange);
  };
}

function isSavedPayment(value: unknown): value is PaymentRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PaymentRecord>;
  return typeof item.id === "string"
    && typeof item.date === "string"
    && (item.type === "Customer" || item.type === "Supplier")
    && typeof item.partyId === "string"
    && typeof item.partyName === "string"
    && typeof item.invoiceNo === "string"
    && typeof item.amount === "number"
    && typeof item.method === "string"
    && (item.status === "Received" || item.status === "Paid")
    && typeof item.referenceNo === "string"
    && typeof item.bankName === "string"
    && typeof item.remarks === "string";
}

function parseSavedPayments(raw: string) {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isSavedPayment) : [];
  } catch {
    return [];
  }
}

function parseAmount(value: string) {
  const normalized = value.replaceAll(",", "").trim();
  return normalized ? Number(normalized) : Number.NaN;
}

function RequiredMark() {
  return <span aria-hidden="true" className={styles.required}>*</span>;
}

function FieldError({ error, id }: { error?: string; id: string }) {
  return error ? <span className={styles.fieldError} id={id}>{error}</span> : null;
}

export function PaymentManagement() {
  const [form, setForm] = useState<PaymentForm>(createInitialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showAll, setShowAll] = useState(false);
  const [volatilePayments, setVolatilePayments] = useState<PaymentRecord[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);

  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedPayments,
    readPaymentsSnapshot,
    () => EMPTY_SAVED_PAYMENTS,
  );
  const savedPayments = useMemo(() => parseSavedPayments(savedSnapshot), [savedSnapshot]);
  const payments = useMemo(
    () => [...volatilePayments, ...savedPayments, ...initialPayments],
    [savedPayments, volatilePayments],
  );
  const visiblePayments = showAll ? payments : payments.slice(0, 5);
  const partyType: PaymentPartyType = form.paymentType === "Customer Payment" ? "Customer" : "Supplier";
  const parties = partyType === "Customer" ? paymentCustomers : paymentSuppliers;
  const selectedParty = parties.find((party) => party.id === form.partyId) ?? parties[0];

  function clearError(field: keyof FormErrors) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateForm<Field extends keyof PaymentForm>(field: Field, value: PaymentForm[Field]) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field in errors) clearError(field as keyof FormErrors);
    setFeedback(null);
  }

  function changePaymentType(paymentType: PaymentKind) {
    const nextPartyType: PaymentPartyType = paymentType === "Customer Payment" ? "Customer" : "Supplier";
    const nextParty = nextPartyType === "Customer" ? paymentCustomers[0] : paymentSuppliers[0];
    setForm((current) => ({
      ...current,
      paymentType,
      partyId: nextParty.id,
      invoiceNo: nextParty.invoices[0],
      remarks: `${nextPartyType} payment against invoice ${nextParty.invoices[0]}`,
    }));
    setErrors({});
    setFeedback(null);
  }

  function changeParty(partyId: string) {
    const party = parties.find((candidate) => candidate.id === partyId) ?? parties[0];
    setForm((current) => ({
      ...current,
      partyId: party.id,
      invoiceNo: party.invoices[0],
      remarks: `${partyType} payment against invoice ${party.invoices[0]}`,
    }));
    clearError("partyId");
    clearError("invoiceNo");
    setFeedback(null);
  }

  function resetForm(message = "Payment form reset to the reference details.") {
    setForm(createInitialForm());
    setErrors({});
    setFeedback({ tone: "info", message });
  }

  function startNewPayment() {
    resetForm("A new payment form is ready.");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.requestAnimationFrame(() => firstFieldRef.current?.focus());
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const amount = parseAmount(form.amount);
    if (!form.partyId) nextErrors.partyId = `Select a ${partyType.toLowerCase()}.`;
    if (!form.invoiceNo) nextErrors.invoiceNo = "Select an invoice.";
    if (!form.paymentDate) nextErrors.paymentDate = "Select a payment date.";
    if (!form.paymentMethod) nextErrors.paymentMethod = "Select a payment method.";
    if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Enter an amount greater than zero.";
    return nextErrors;
  }

  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ tone: "error", message: "Review the highlighted payment fields before saving." });
      return;
    }

    const amount = parseAmount(form.amount);
    const record: PaymentRecord = {
      id: `PAY-${form.paymentDate.replaceAll("-", "")}-${String(savedPayments.length + volatilePayments.length + 1).padStart(3, "0")}`,
      date: form.paymentDate,
      type: partyType,
      partyId: selectedParty.id,
      partyName: selectedParty.name,
      invoiceNo: form.invoiceNo,
      amount,
      method: form.paymentMethod === "Bank Transfer" ? "Bank" : form.paymentMethod,
      status: partyType === "Customer" ? "Received" : "Paid",
      referenceNo: form.referenceNo.trim(),
      bankName: form.paymentMethod === "Bank Transfer" ? form.bankName : "",
      remarks: form.remarks.trim(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...savedPayments]));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      setVolatilePayments((current) => [record, ...current]);
    }
    setShowAll(false);
    setFeedback({
      tone: "success",
      message: `${record.status} payment of ৳ ${formatPaymentAmount(amount)} saved for ${record.partyName}.`,
    });
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={startNewPayment} type="button">
            <Plus aria-hidden="true" size={16} />
            New Payment
          </button>
        )}
        description="Record customer or supplier payment"
        title="Record Payment"
      />

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "error" ? <CircleAlert aria-hidden="true" size={16} /> : <CheckCircle2 aria-hidden="true" size={16} />}
        <span>{feedback?.message ?? ""}</span>
      </p>

      <Card className={styles.paymentCard}>
        <form noValidate onSubmit={savePayment} ref={formRef}>
          <div className={styles.sectionHeading}>
            <h2>Payment Information</h2>
          </div>

          <div className={styles.fieldsGrid}>
            <label className={styles.fieldGroup}>
              <span>Payment Type</span>
              <select
                className="select"
                onChange={(event) => changePaymentType(event.target.value as PaymentKind)}
                ref={firstFieldRef}
                value={form.paymentType}
              >
                <option>Customer Payment</option>
                <option>Supplier Payment</option>
              </select>
            </label>

            <label className={styles.fieldGroup}>
              <span>{partyType} <RequiredMark /></span>
              <select
                aria-describedby={errors.partyId ? "payment-party-error" : undefined}
                aria-invalid={Boolean(errors.partyId)}
                className="select"
                onChange={(event) => changeParty(event.target.value)}
                value={form.partyId}
              >
                {parties.map((party) => <option key={party.id} value={party.id}>{party.name} ({party.id})</option>)}
              </select>
              <FieldError error={errors.partyId} id="payment-party-error" />
            </label>

            <label className={styles.fieldGroup}>
              <span>Invoice No</span>
              <select
                aria-describedby={errors.invoiceNo ? "payment-invoice-error" : undefined}
                aria-invalid={Boolean(errors.invoiceNo)}
                className="select"
                onChange={(event) => updateForm("invoiceNo", event.target.value)}
                value={form.invoiceNo}
              >
                {selectedParty.invoices.map((invoice) => <option key={invoice}>{invoice}</option>)}
              </select>
              <FieldError error={errors.invoiceNo} id="payment-invoice-error" />
            </label>

            <label className={styles.fieldGroup}>
              <span>Payment Date <RequiredMark /></span>
              <input
                aria-describedby={errors.paymentDate ? "payment-date-error" : undefined}
                aria-invalid={Boolean(errors.paymentDate)}
                className="field"
                onChange={(event) => updateForm("paymentDate", event.target.value)}
                type="date"
                value={form.paymentDate}
              />
              <FieldError error={errors.paymentDate} id="payment-date-error" />
            </label>

            <label className={styles.fieldGroup}>
              <span>Payment Method <RequiredMark /></span>
              <select
                aria-describedby={errors.paymentMethod ? "payment-method-error" : undefined}
                aria-invalid={Boolean(errors.paymentMethod)}
                className="select"
                onChange={(event) => updateForm("paymentMethod", event.target.value)}
                value={form.paymentMethod}
              >
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>bKash</option>
                <option>Card</option>
                <option>Cheque</option>
              </select>
              <FieldError error={errors.paymentMethod} id="payment-method-error" />
            </label>

            <label className={styles.fieldGroup}>
              <span>Amount (৳) <RequiredMark /></span>
              <input
                aria-describedby={errors.amount ? "payment-amount-error" : undefined}
                aria-invalid={Boolean(errors.amount)}
                className="field"
                inputMode="decimal"
                onBlur={() => {
                  const amount = parseAmount(form.amount);
                  if (Number.isFinite(amount) && amount > 0) updateForm("amount", formatPaymentAmount(amount));
                }}
                onChange={(event) => updateForm("amount", event.target.value)}
                placeholder="0"
                value={form.amount}
              />
              <FieldError error={errors.amount} id="payment-amount-error" />
            </label>

            <label className={styles.fieldGroup}>
              <span>Reference No</span>
              <input className="field" onChange={(event) => updateForm("referenceNo", event.target.value)} value={form.referenceNo} />
            </label>

            <label className={styles.fieldGroup}>
              <span>Bank Name</span>
              <select
                className="select"
                disabled={form.paymentMethod !== "Bank Transfer" && form.paymentMethod !== "Cheque"}
                onChange={(event) => updateForm("bankName", event.target.value)}
                value={form.bankName}
              >
                <option>BRAC Bank</option>
                <option>City Bank</option>
                <option>Dutch-Bangla Bank</option>
                <option>Eastern Bank</option>
              </select>
            </label>
          </div>

          <div className={styles.formBottom}>
            <label className={styles.remarksField}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => updateForm("remarks", event.target.value)} value={form.remarks} />
            </label>
            <div className={styles.formActions}>
              <button className="button" onClick={() => resetForm()} type="button">
                <RotateCcw aria-hidden="true" size={15} /> Reset
              </button>
              <button className="button button--primary" type="submit">
                <Save aria-hidden="true" size={15} /> Save Payment
              </button>
            </div>
          </div>
        </form>
      </Card>

      <Card className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <h2>Recent Payments</h2>
          <button onClick={() => setShowAll((current) => !current)} type="button">
            {showAll ? "Show Recent" : "View All"}
          </button>
        </div>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Recent customer and supplier payments</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Customer/Supplier</th>
                <th scope="col">Invoice No</th>
                <th scope="col">Amount (৳)</th>
                <th scope="col">Method</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((payment, index) => (
                <tr key={payment.id}>
                  <td>{index + 1}</td>
                  <td>{formatPaymentDate(payment.date)}</td>
                  <td className={payment.type === "Supplier" ? styles.supplier : undefined}>{payment.type}</td>
                  <td><strong>{payment.partyName}</strong></td>
                  <td>{payment.invoiceNo}</td>
                  <td className={styles.amount}>{formatPaymentAmount(payment.amount)}</td>
                  <td>{payment.method}</td>
                  <td><span className={styles.status}>{payment.status}</span></td>
                  <td>
                    <button
                      aria-label={`View payment ${payment.id}`}
                      className={styles.viewButton}
                      onClick={() => setSelectedPayment(payment)}
                      title="View payment details"
                      type="button"
                    >
                      <Eye aria-hidden="true" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length > 5 ? <p className={styles.historyCount}>Showing {visiblePayments.length} of {payments.length} payments</p> : null}
      </Card>

      {selectedPayment ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPayment(null); }}>
          <Card aria-labelledby="payment-details-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <header>
              <div>
                <h2 id="payment-details-title">Payment Details</h2>
                <p>{selectedPayment.id}</p>
              </div>
              <button aria-label="Close payment details" onClick={() => setSelectedPayment(null)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <dl>
              <div><dt>Date</dt><dd>{formatPaymentDate(selectedPayment.date)}</dd></div>
              <div><dt>Type</dt><dd>{selectedPayment.type}</dd></div>
              <div><dt>Customer/Supplier</dt><dd>{selectedPayment.partyName}</dd></div>
              <div><dt>Invoice</dt><dd>{selectedPayment.invoiceNo}</dd></div>
              <div><dt>Amount</dt><dd>৳ {formatPaymentAmount(selectedPayment.amount)}</dd></div>
              <div><dt>Method</dt><dd>{selectedPayment.method}</dd></div>
              <div><dt>Reference</dt><dd>{selectedPayment.referenceNo || "—"}</dd></div>
              <div><dt>Bank</dt><dd>{selectedPayment.bankName || "—"}</dd></div>
              <div className={styles.modalRemarks}><dt>Remarks</dt><dd>{selectedPayment.remarks || "—"}</dd></div>
            </dl>
            <footer><button className="button" onClick={() => setSelectedPayment(null)} type="button">Close</button></footer>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
