"use client";

import Image from "next/image";
import {
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  APPRAISAL_ADJUSTMENT,
  CURRENT_GOLD_RATE,
  calculateOldGoldValue,
  createInitialOldGoldPurchase,
  formatTaka,
  initialOldGoldCustomers,
  purityOptions,
  type OldGoldCustomer,
  type OldGoldPurchaseState,
} from "./old-gold-data";
import styles from "./old-gold-purchase-form.module.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type FormField = keyof OldGoldPurchaseState | "image";
type FormErrors = Partial<Record<FormField, string>>;
type Feedback = { tone: "error" | "success" | "info"; message: string };

function RequiredMark() {
  return <span aria-hidden="true" className={styles.required}>*</span>;
}

function FieldError({ error, id }: { error?: string; id: string }) {
  return <span className={error ? styles.fieldError : "sr-only"} id={id}>{error ?? ""}</span>;
}

function GoldNecklaceIllustration() {
  return (
    <svg
      aria-label="Gold chain placeholder"
      className={styles.necklaceIllustration}
      role="img"
      viewBox="0 0 240 150"
    >
      <defs>
        <linearGradient id="old-gold-chain" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f5d267" />
          <stop offset="0.5" stopColor="#b87808" />
          <stop offset="1" stopColor="#f0bd35" />
        </linearGradient>
        <filter id="old-gold-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" floodColor="#6d4300" floodOpacity="0.24" stdDeviation="3" />
        </filter>
      </defs>
      <path
        d="M30 27c8 58 39 94 90 96 51-2 82-38 90-96"
        fill="none"
        filter="url(#old-gold-shadow)"
        stroke="url(#old-gold-chain)"
        strokeDasharray="1 10"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <path
        d="M36 27c10 50 39 82 84 84 45-2 74-34 84-84"
        fill="none"
        stroke="#f7d76c"
        strokeDasharray="2 9"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path d="M108 112h24l-4 20-8 10-8-10z" fill="url(#old-gold-chain)" filter="url(#old-gold-shadow)" />
      <circle cx="120" cy="128" fill="#fff3b8" r="4" />
    </svg>
  );
}

export function OldGoldPurchaseForm() {
  const [form, setForm] = useState<OldGoldPurchaseState>(createInitialOldGoldPurchase);
  const [customers, setCustomers] = useState<OldGoldCustomer[]>(() => [...initialOldGoldCustomers]);
  const [customerQuery, setCustomerQuery] = useState(initialOldGoldCustomers[0].name);
  const [customerResultsOpen, setCustomerResultsOpen] = useState(false);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerError, setNewCustomerError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const selectedCustomer = customers.find((customer) => customer.id === form.customerId);
  const estimatedValue = calculateOldGoldValue(form.netWeight, form.grossWeight, form.purity);
  const normalizedCustomerQuery = customerQuery.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedCustomerQuery) return true;
    return `${customer.name} ${customer.phone} ${customer.id}`.toLowerCase().includes(normalizedCustomerQuery);
  });

  function clearError(field: FormField) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateField<Field extends keyof OldGoldPurchaseState>(
    field: Field,
    value: OldGoldPurchaseState[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    clearError(field);
    setFeedback(null);
  }

  function updateValuationField(
    field: "grossWeight" | "netWeight" | "purity",
    value: string,
  ) {
    setForm((current) => {
      const next = { ...current, [field]: value } as OldGoldPurchaseState;
      const nextAmount = calculateOldGoldValue(next.netWeight, next.grossWeight, next.purity);
      return { ...next, paymentAmount: nextAmount > 0 ? String(nextAmount) : "" };
    });
    clearError(field);
    clearError("paymentAmount");
    setFeedback(null);
  }

  function selectCustomer(customer: OldGoldCustomer) {
    setForm((current) => ({ ...current, customerId: customer.id }));
    setCustomerQuery(customer.name);
    setCustomerResultsOpen(false);
    clearError("customerId");
    setFeedback(null);
  }

  function changeCustomerQuery(value: string) {
    setCustomerQuery(value);
    setCustomerResultsOpen(true);
    const exactMatch = customers.find((customer) => (
      customer.name.toLowerCase() === value.trim().toLowerCase()
      || customer.phone === value.trim()
      || customer.id.toLowerCase() === value.trim().toLowerCase()
    ));
    setForm((current) => ({ ...current, customerId: exactMatch?.id ?? "" }));
    clearError("customerId");
    setFeedback(null);
  }

  function openNewCustomer() {
    setCustomerResultsOpen(false);
    setNewCustomerName(customerQuery.trim());
    setNewCustomerPhone("");
    setNewCustomerError("");
    setNewCustomerOpen(true);
  }

  function closeNewCustomer() {
    setNewCustomerOpen(false);
    setNewCustomerError("");
  }

  function createCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = newCustomerName.trim();
    const phoneDigits = newCustomerPhone.replace(/\D/g, "");

    if (cleanName.length < 2) {
      setNewCustomerError("Enter the customer’s full name.");
      return;
    }
    if (!/^01\d{9}$/.test(phoneDigits)) {
      setNewCustomerError("Enter a valid 11-digit Bangladeshi mobile number.");
      return;
    }
    if (customers.some((customer) => customer.phone.replace(/\D/g, "") === phoneDigits)) {
      setNewCustomerError("A customer with this phone number already exists.");
      return;
    }

    const nextSequence = 126 + customers.length - initialOldGoldCustomers.length;
    const newCustomer: OldGoldCustomer = {
      id: `C-${String(nextSequence).padStart(6, "0")}`,
      name: cleanName,
      phone: `${phoneDigits.slice(0, 5)}-${phoneDigits.slice(5)}`,
    };
    setCustomers((current) => [newCustomer, ...current]);
    selectCustomer(newCustomer);
    setNewCustomerOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setFeedback({ tone: "success", message: `${newCustomer.name} was added and selected.` });
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setErrors((current) => ({ ...current, image: "Upload a JPG, PNG, or WebP image." }));
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, image: "The image must be 5 MB or smaller." }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") return;
      setImagePreview(reader.result);
      setImageName(file.name);
      clearError("image");
      setFeedback({ tone: "success", message: `${file.name} is ready to attach to this purchase.` });
    });
    reader.addEventListener("error", () => {
      setErrors((current) => ({ ...current, image: "The image could not be read. Try another file." }));
    });
    reader.readAsDataURL(file);
  }

  function resetForm(message = "The form has been reset to the reference purchase.") {
    const initialForm = createInitialOldGoldPurchase();
    setForm(initialForm);
    setCustomerQuery(initialOldGoldCustomers[0].name);
    setCustomerResultsOpen(false);
    setImagePreview("");
    setImageName("");
    setErrors({});
    setFeedback({ tone: "info", message });
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function startNewPurchase() {
    resetForm("A fresh old-gold purchase form is ready.");
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};
    const grossWeight = Number.parseFloat(form.grossWeight);
    const netWeight = Number.parseFloat(form.netWeight);
    const paymentAmount = Number.parseFloat(form.paymentAmount);

    if (!form.customerId) nextErrors.customerId = "Select a customer before saving.";
    if (!form.itemType) nextErrors.itemType = "Select an item type.";
    if (!Number.isFinite(grossWeight) || grossWeight <= 0) nextErrors.grossWeight = "Enter a valid gross weight.";
    if (!Number.isFinite(netWeight) || netWeight <= 0) nextErrors.netWeight = "Enter a valid net weight.";
    if (Number.isFinite(grossWeight) && Number.isFinite(netWeight) && netWeight > grossWeight) {
      nextErrors.netWeight = "Net weight cannot exceed gross weight.";
    }
    if (!form.condition) nextErrors.condition = "Select the item condition.";
    if (!form.paymentMethod) nextErrors.paymentMethod = "Select a payment method.";
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) nextErrors.paymentAmount = "Enter a valid payment amount.";
    if (form.description.trim().length < 3) nextErrors.description = "Add a short item description.";

    return nextErrors;
  }

  function savePurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ tone: "error", message: "Review the highlighted fields before saving this purchase." });
      return;
    }

    setFeedback({
      tone: "success",
      message: `Purchase OGP-000126 saved for ${selectedCustomer?.name ?? "the selected customer"} at ${formatTaka(Number(form.paymentAmount))}.`,
    });
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={startNewPurchase} type="button">
            <Plus aria-hidden="true" size={16} />
            New Purchase
          </button>
        )}
        description="Purchase old gold from customer"
        title="Old Gold Purchase"
      />

      {feedback ? (
        <div
          aria-live="polite"
          className={`${styles.feedback} ${styles[`feedback${feedback.tone[0].toUpperCase()}${feedback.tone.slice(1)}`]}`}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.tone === "error" ? <CircleAlert aria-hidden="true" size={18} /> : <CheckCircle2 aria-hidden="true" size={18} />}
          <span>{feedback.message}</span>
          <button aria-label="Dismiss message" onClick={() => setFeedback(null)} type="button"><X size={16} /></button>
        </div>
      ) : null}

      <form className={styles.form} noValidate onSubmit={savePurchase}>
        <div className={styles.topGrid}>
          <Card className={styles.card}>
            <div className={styles.sectionHeading}>
              <div>
                <h2>Customer Information</h2>
                <p>Find an existing customer or create a new profile.</p>
              </div>
            </div>

            <div className={styles.customerSearchRow}>
              <div className={styles.customerSearch}>
                <Search aria-hidden="true" size={17} />
                <input
                  aria-autocomplete="list"
                  aria-controls="old-gold-customer-results"
                  aria-describedby={errors.customerId ? "old-gold-customer-error" : undefined}
                  aria-expanded={customerResultsOpen}
                  aria-invalid={Boolean(errors.customerId)}
                  autoComplete="off"
                  onBlur={() => window.setTimeout(() => setCustomerResultsOpen(false), 120)}
                  onChange={(event) => changeCustomerQuery(event.target.value)}
                  onFocus={() => setCustomerResultsOpen(true)}
                  placeholder="Search customer by name, phone, or ID..."
                  role="combobox"
                  value={customerQuery}
                />
                {customerResultsOpen ? (
                  <div className={styles.customerResults} id="old-gold-customer-results" role="listbox">
                    {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                      <button
                        aria-selected={customer.id === form.customerId}
                        className={customer.id === form.customerId ? styles.customerResultActive : ""}
                        key={customer.id}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectCustomer(customer)}
                        role="option"
                        type="button"
                      >
                        <span><strong>{customer.name}</strong><small>{customer.phone}</small></span>
                        <em>{customer.id}</em>
                      </button>
                    )) : (
                      <div className={styles.noCustomer}>No matching customer. Use <strong>New</strong> to add one.</div>
                    )}
                  </div>
                ) : null}
              </div>
              <button className={`button button--primary ${styles.newCustomerButton}`} onClick={openNewCustomer} type="button">
                <Plus aria-hidden="true" size={15} />
                New
              </button>
            </div>
            <FieldError error={errors.customerId} id="old-gold-customer-error" />

            <dl className={styles.customerDetails}>
              <div><dt>Name</dt><dd>{selectedCustomer?.name ?? "—"}</dd></div>
              <div><dt>Phone</dt><dd>{selectedCustomer?.phone ?? "—"}</dd></div>
              <div><dt>Customer ID</dt><dd>{selectedCustomer?.id ?? "—"}</dd></div>
            </dl>
          </Card>

          <Card className={`${styles.card} ${styles.valuationCard}`}>
            <div className={styles.sectionHeading}>
              <div>
                <h2>Gold Rate &amp; Valuation</h2>
                <p>Live valuation based on net gold weight.</p>
              </div>
              <Sparkles aria-hidden="true" className={styles.goldSparkle} size={18} />
            </div>

            <div className={styles.valuationContent}>
              <div className={styles.rateSummary}>
                <span>Current Gold Rate (BDT/gram)</span>
                <strong>{formatTaka(CURRENT_GOLD_RATE)}</strong>
                <small>22K reference rate</small>
              </div>
              <div className={styles.weightFields}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="old-gold-gross-weight">Gross Weight (gram) <RequiredMark /></label>
                  <input
                    aria-describedby={errors.grossWeight ? "old-gold-gross-weight-error" : undefined}
                    aria-invalid={Boolean(errors.grossWeight)}
                    className="field"
                    id="old-gold-gross-weight"
                    inputMode="decimal"
                    min="0.001"
                    onChange={(event) => updateValuationField("grossWeight", event.target.value)}
                    step="0.001"
                    type="number"
                    value={form.grossWeight}
                  />
                  <FieldError error={errors.grossWeight} id="old-gold-gross-weight-error" />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="old-gold-net-weight">Net Weight (gram) <RequiredMark /></label>
                  <input
                    aria-describedby={errors.netWeight ? "old-gold-net-weight-error" : "old-gold-net-weight-hint"}
                    aria-invalid={Boolean(errors.netWeight)}
                    className="field"
                    id="old-gold-net-weight"
                    inputMode="decimal"
                    min="0.001"
                    onChange={(event) => updateValuationField("netWeight", event.target.value)}
                    step="0.001"
                    type="number"
                    value={form.netWeight}
                  />
                  <span className="sr-only" id="old-gold-net-weight-hint">Changing the weight updates the estimated value and payment amount.</span>
                  <FieldError error={errors.netWeight} id="old-gold-net-weight-error" />
                </div>
              </div>
            </div>

            <div aria-live="polite" className={styles.estimatedValue}>
              <span>Estimated Value</span>
              <strong>{formatTaka(estimatedValue)}</strong>
              <small>Includes {formatTaka(APPRAISAL_ADJUSTMENT)} appraisal adjustment</small>
            </div>
          </Card>
        </div>

        <Card className={styles.card}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Item Details</h2>
              <p>Record the jewellery, assessed purity, condition, and reference image.</p>
            </div>
          </div>

          <div className={styles.itemLayout}>
            <div className={styles.itemFields}>
              <label className={styles.fieldGroup}>
                <span>Item Type <RequiredMark /></span>
                <select
                  aria-describedby={errors.itemType ? "old-gold-item-type-error" : undefined}
                  aria-invalid={Boolean(errors.itemType)}
                  className="select"
                  onChange={(event) => updateField("itemType", event.target.value)}
                  value={form.itemType}
                >
                  <option>Old Gold Jewellery</option>
                  <option>Gold Coin</option>
                  <option>Gold Bar</option>
                  <option>Mixed Gold Items</option>
                </select>
                <FieldError error={errors.itemType} id="old-gold-item-type-error" />
              </label>

              <label className={styles.fieldGroup}>
                <span>Purity (Karat) <RequiredMark /></span>
                <select
                  className="select"
                  onChange={(event) => updateValuationField("purity", event.target.value)}
                  value={form.purity}
                >
                  {purityOptions.map((purity) => <option key={purity}>{purity}</option>)}
                </select>
              </label>

              <label className={styles.fieldGroup}>
                <span>Condition <RequiredMark /></span>
                <select
                  aria-describedby={errors.condition ? "old-gold-condition-error" : undefined}
                  aria-invalid={Boolean(errors.condition)}
                  className="select"
                  onChange={(event) => updateField("condition", event.target.value)}
                  value={form.condition}
                >
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Damaged</option>
                  <option>Scrap</option>
                </select>
                <FieldError error={errors.condition} id="old-gold-condition-error" />
              </label>

              <label className={`${styles.fieldGroup} ${styles.descriptionField}`}>
                <span>Item Description <RequiredMark /></span>
                <textarea
                  aria-describedby={errors.description ? "old-gold-description-error" : undefined}
                  aria-invalid={Boolean(errors.description)}
                  className="textarea"
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe the old gold item..."
                  value={form.description}
                />
                <FieldError error={errors.description} id="old-gold-description-error" />
              </label>
            </div>

            <div className={styles.imagePanel}>
              <span className={styles.imageLabel}>Item Image</span>
              <div className={styles.imagePreview}>
                {imagePreview ? (
                  <Image
                    alt={`Preview of ${imageName}`}
                    fill
                    sizes="(max-width: 760px) 100vw, 240px"
                    src={imagePreview}
                    unoptimized
                  />
                ) : <GoldNecklaceIllustration />}
              </div>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id="old-gold-image"
                onChange={handleImageUpload}
                ref={imageInputRef}
                type="file"
              />
              <label className={`button ${styles.uploadButton}`} htmlFor="old-gold-image">
                {imagePreview ? <ImagePlus aria-hidden="true" size={15} /> : <Upload aria-hidden="true" size={15} />}
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              <span className={styles.imageHint}>{imageName || "JPG, PNG, or WebP · max 5 MB"}</span>
              <FieldError error={errors.image} id="old-gold-image-error" />
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Payment Information</h2>
              <p>Choose how the customer is paid and add an internal note.</p>
            </div>
          </div>

          <div className={styles.paymentGrid}>
            <label className={styles.fieldGroup}>
              <span>Payment Method <RequiredMark /></span>
              <select
                aria-describedby={errors.paymentMethod ? "old-gold-payment-method-error" : undefined}
                aria-invalid={Boolean(errors.paymentMethod)}
                className="select"
                onChange={(event) => updateField("paymentMethod", event.target.value)}
                value={form.paymentMethod}
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Mobile Banking</option>
                <option>Exchange Credit</option>
              </select>
              <FieldError error={errors.paymentMethod} id="old-gold-payment-method-error" />
            </label>

            <div className={styles.fieldGroup}>
              <label htmlFor="old-gold-payment-amount">Payment Amount <RequiredMark /></label>
              <div className={styles.moneyInput}>
                <span aria-hidden="true">৳</span>
                <input
                  aria-describedby={errors.paymentAmount ? "old-gold-payment-amount-error" : undefined}
                  aria-invalid={Boolean(errors.paymentAmount)}
                  id="old-gold-payment-amount"
                  inputMode="decimal"
                  min="1"
                  onChange={(event) => updateField("paymentAmount", event.target.value)}
                  step="1"
                  type="number"
                  value={form.paymentAmount}
                />
              </div>
              <FieldError error={errors.paymentAmount} id="old-gold-payment-amount-error" />
            </div>

            <label className={styles.fieldGroup}>
              <span>Remarks</span>
              <input
                className="field"
                onChange={(event) => updateField("remarks", event.target.value)}
                placeholder="Add a payment note..."
                value={form.remarks}
              />
            </label>
          </div>

          <footer className={styles.formFooter}>
            <button className="button" onClick={() => resetForm()} type="button">
              <RotateCcw aria-hidden="true" size={15} />
              Reset
            </button>
            <button className="button button--primary" type="submit">
              <Save aria-hidden="true" size={15} />
              Save Purchase
            </button>
          </footer>
        </Card>
      </form>

      {newCustomerOpen ? (
        <div
          className={styles.modalBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeNewCustomer();
          }}
          role="presentation"
        >
          <section
            aria-describedby="old-gold-new-customer-description"
            aria-labelledby="old-gold-new-customer-title"
            aria-modal="true"
            className={styles.modal}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeNewCustomer();
            }}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <span className={styles.modalIcon}><UserPlus aria-hidden="true" size={20} /></span>
              <div>
                <h2 id="old-gold-new-customer-title">New Customer</h2>
                <p id="old-gold-new-customer-description">Add a customer without leaving this old-gold purchase.</p>
              </div>
              <button aria-label="Close new customer dialog" className={styles.modalClose} onClick={closeNewCustomer} type="button">
                <X size={19} />
              </button>
            </header>
            <form className={styles.modalForm} noValidate onSubmit={createCustomer}>
              <label className={styles.fieldGroup}>
                <span>Customer Name <RequiredMark /></span>
                <input
                  autoFocus
                  className="field"
                  onChange={(event) => {
                    setNewCustomerName(event.target.value);
                    setNewCustomerError("");
                  }}
                  placeholder="Enter full name"
                  value={newCustomerName}
                />
              </label>
              <label className={styles.fieldGroup}>
                <span>Phone <RequiredMark /></span>
                <input
                  className="field"
                  inputMode="tel"
                  onChange={(event) => {
                    setNewCustomerPhone(event.target.value);
                    setNewCustomerError("");
                  }}
                  placeholder="01XXX-XXXXXX"
                  type="tel"
                  value={newCustomerPhone}
                />
              </label>
              <p aria-live="assertive" className={newCustomerError ? styles.modalError : "sr-only"}>{newCustomerError}</p>
              <footer className={styles.modalActions}>
                <button className="button" onClick={closeNewCustomer} type="button">Cancel</button>
                <button className="button button--primary" type="submit">
                  <Plus aria-hidden="true" size={16} />
                  Add Customer
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
