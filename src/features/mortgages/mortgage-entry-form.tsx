"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Coins,
  Plus,
  RotateCcw,
  Save,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  CURRENT_GOLD_RATE,
  createInitialMortgageForm,
  formatTaka,
  initialCustomers,
  type MortgageCustomer,
  type MortgageFormState,
} from "./mortgage-data";
import styles from "./mortgage-entry-form.module.css";

type FormErrors = Partial<Record<keyof MortgageFormState, string>>;
type Feedback = { tone: "error" | "success" | "info"; text: string } | null;

const goldTypes = ["Gold Jewellery", "Gold Bar", "Gold Coin", "Old Gold"];
const purities = ["24K", "22K", "21K", "18K", "14K"];

function RequiredMark() {
  return <span aria-hidden="true" className={styles.required}>*</span>;
}

function FieldError({ error, id }: { error?: string; id: string }) {
  return error ? <span className={styles.fieldError} id={id}>{error}</span> : null;
}

function nextCustomerId(customers: MortgageCustomer[]) {
  const highestId = customers.reduce((highest, customer) => {
    const value = Number.parseInt(customer.id.replace(/\D/g, ""), 10);
    return Number.isNaN(value) ? highest : Math.max(highest, value);
  }, 0);
  return `C-${String(highestId + 1).padStart(6, "0")}`;
}

function readSavedMortgages(): unknown[] {
  try {
    const stored = window.localStorage.getItem("aarohan-mortgages");
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function MortgageEntryForm() {
  const [form, setForm] = useState<MortgageFormState>(() => createInitialMortgageForm());
  const [customers, setCustomers] = useState<MortgageCustomer[]>(() => [...initialCustomers]);
  const [customerQuery, setCustomerQuery] = useState(initialCustomers[0].name);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [activeCustomerIndex, setActiveCustomerIndex] = useState(0);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerError, setNewCustomerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const addCustomerButtonRef = useRef<HTMLButtonElement>(null);
  const newCustomerNameRef = useRef<HTMLInputElement>(null);

  const valuation = useMemo(() => {
    const weight = Number.parseFloat(form.weight);
    return Number.isFinite(weight) && weight > 0 ? weight * CURRENT_GOLD_RATE : 0;
  }, [form.weight]);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => (
      customer.name.toLowerCase().includes(query)
      || customer.phone.toLowerCase().includes(query)
      || customer.id.toLowerCase().includes(query)
    ));
  }, [customerQuery, customers]);

  function updateField<Key extends keyof MortgageFormState>(key: Key, value: MortgageFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (feedback?.tone === "error") setFeedback(null);
  }

  function selectCustomer(customer: MortgageCustomer) {
    setForm((current) => ({
      ...current,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
    }));
    setCustomerQuery(customer.name);
    setCustomerPickerOpen(false);
    setActiveCustomerIndex(0);
    setErrors((current) => ({
      ...current,
      customerId: undefined,
      customerName: undefined,
      customerPhone: undefined,
    }));
    setFeedback({ tone: "info", text: `${customer.name} selected for this mortgage.` });
  }

  function handleCustomerSearch(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setCustomerQuery(value);
    setCustomerPickerOpen(true);
    setActiveCustomerIndex(0);
    if (value !== form.customerName) {
      setForm((current) => ({
        ...current,
        customerId: "",
        customerName: "",
        customerPhone: "",
      }));
    }
  }

  function handleCustomerSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setCustomerPickerOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!customerPickerOpen) {
        setCustomerPickerOpen(true);
        return;
      }
      if (filteredCustomers.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveCustomerIndex((current) => (
        (current + direction + filteredCustomers.length) % filteredCustomers.length
      ));
      return;
    }

    if (event.key === "Enter" && customerPickerOpen && filteredCustomers.length > 0) {
      event.preventDefault();
      selectCustomer(filteredCustomers[activeCustomerIndex] ?? filteredCustomers[0]);
    }
  }

  function openNewCustomer() {
    setNewCustomerOpen(true);
    setNewCustomerError("");
    window.setTimeout(() => newCustomerNameRef.current?.focus(), 0);
  }

  function closeNewCustomer() {
    setNewCustomerOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerError("");
    window.setTimeout(() => addCustomerButtonRef.current?.focus(), 0);
  }

  function createCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newCustomerName.trim();
    const phone = newCustomerPhone.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (name.length < 2) {
      setNewCustomerError("Enter the customer’s full name.");
      newCustomerNameRef.current?.focus();
      return;
    }
    if (phoneDigits.length < 10) {
      setNewCustomerError("Enter a valid phone number with at least 10 digits.");
      return;
    }

    const customer: MortgageCustomer = { id: nextCustomerId(customers), name, phone };
    setCustomers((current) => [customer, ...current]);
    selectCustomer(customer);
    setNewCustomerOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerError("");
    setFeedback({ tone: "success", text: `${customer.name} was added as ${customer.id} and selected.` });
  }

  function validateMortgage() {
    const nextErrors: FormErrors = {};
    const weight = Number.parseFloat(form.weight);
    const loanAmount = Number.parseFloat(form.loanAmount);
    const interestRate = Number.parseFloat(form.interestRate);

    if (!form.customerId || !form.customerName) nextErrors.customerId = "Select a customer from the search results.";
    if (!form.goldType) nextErrors.goldType = "Select the pledged gold type.";
    if (!form.purity) nextErrors.purity = "Select the gold purity.";
    if (!Number.isFinite(weight) || weight <= 0) nextErrors.weight = "Enter a weight greater than zero.";
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      nextErrors.loanAmount = "Enter a valid loan amount.";
    } else if (loanAmount > valuation) {
      nextErrors.loanAmount = "Loan amount cannot exceed the current valuation.";
    }
    if (!Number.isFinite(interestRate) || interestRate < 0) nextErrors.interestRate = "Enter a valid interest rate.";
    if (!form.dueDate) nextErrors.dueDate = "Select a due date.";
    if (!form.branch) nextErrors.branch = "Select a branch.";
    if (!form.staff) nextErrors.staff = "Select the responsible staff member.";

    setErrors(nextErrors);
    return nextErrors;
  }

  function submitMortgage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateMortgage();
    const firstInvalidField = Object.keys(nextErrors)[0] as keyof MortgageFormState | undefined;

    if (firstInvalidField) {
      setFeedback({ tone: "error", text: "Please review the highlighted fields before saving." });
      const targetId = firstInvalidField === "customerId" ? "mortgage-customer-search" : `mortgage-${firstInvalidField}`;
      window.setTimeout(() => document.getElementById(targetId)?.focus(), 0);
      return;
    }

    const entryId = `MTG-${new Date().getFullYear()}-${String(readSavedMortgages().length + 1).padStart(4, "0")}`;
    const savedEntries = readSavedMortgages();
    savedEntries.push({
      ...form,
      entryId,
      goldRate: CURRENT_GOLD_RATE,
      loanAmount: Number.parseFloat(form.loanAmount),
      savedAt: new Date().toISOString(),
      valuation,
      weight: Number.parseFloat(form.weight),
    });

    try {
      window.localStorage.setItem("aarohan-mortgages", JSON.stringify(savedEntries));
      setFeedback({ tone: "success", text: `${entryId} saved successfully for ${form.customerName}.` });
    } catch {
      setFeedback({ tone: "success", text: "Mortgage details passed validation and are ready to save." });
    }
  }

  function resetMortgage() {
    const initialForm = createInitialMortgageForm();
    setForm(initialForm);
    setCustomerQuery(initialForm.customerName);
    setCustomerPickerOpen(false);
    setActiveCustomerIndex(0);
    setErrors({});
    setFeedback({ tone: "info", text: "Mortgage entry reset to the original sample details." });
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <Link className={`button ${styles.backButton}`} href="/mortgages">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to List
          </Link>
        )}
        description="Enter customer and gold details to create a new mortgage (pawn)"
        title="New Mortgage Entry"
      />

      <form className={styles.form} noValidate onSubmit={submitMortgage}>
        <div className={styles.entryGrid}>
          <div className={styles.detailsColumn}>
            <Card className={styles.card}>
              <div className={styles.sectionHeading}>
                <div>
                  <h2>Customer Information</h2>
                  <p>Find an existing customer or create a new profile.</p>
                </div>
              </div>

              <div className={styles.customerSearchRow}>
                <div
                  className={styles.customerPicker}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setCustomerPickerOpen(false);
                  }}
                >
                  <label className={`${styles.searchField} ${errors.customerId ? styles.invalidControl : ""}`} htmlFor="mortgage-customer-search">
                    <Search aria-hidden="true" size={17} />
                    <span className="sr-only">Search and select customer</span>
                    <input
                      aria-activedescendant={customerPickerOpen && filteredCustomers.length > 0 ? `mortgage-customer-${filteredCustomers[activeCustomerIndex]?.id}` : undefined}
                      aria-autocomplete="list"
                      aria-controls="mortgage-customer-options"
                      aria-describedby={errors.customerId ? "mortgage-customerId-error" : undefined}
                      aria-expanded={customerPickerOpen}
                      aria-haspopup="listbox"
                      id="mortgage-customer-search"
                      onChange={handleCustomerSearch}
                      onFocus={() => setCustomerPickerOpen(true)}
                      onKeyDown={handleCustomerSearchKeyDown}
                      placeholder="Search customer by name, phone or ID..."
                      role="combobox"
                      type="search"
                      value={customerQuery}
                    />
                  </label>
                  {customerPickerOpen ? (
                    <div className={styles.customerOptions} id="mortgage-customer-options" role="listbox">
                      {filteredCustomers.length > 0 ? filteredCustomers.map((customer, index) => (
                        <button
                          aria-selected={customer.id === form.customerId}
                          className={`${styles.customerOption} ${index === activeCustomerIndex ? styles.activeCustomerOption : ""}`}
                          id={`mortgage-customer-${customer.id}`}
                          key={customer.id}
                          onClick={() => selectCustomer(customer)}
                          onMouseEnter={() => setActiveCustomerIndex(index)}
                          role="option"
                          type="button"
                        >
                          <span className={styles.customerAvatar}>{customer.name.charAt(0)}</span>
                          <span>
                            <strong>{customer.name}</strong>
                            <small>{customer.phone} · {customer.id}</small>
                          </span>
                          {customer.id === form.customerId ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
                        </button>
                      )) : (
                        <p className={styles.noCustomers}>No customer found. Use “New Customer” to add one.</p>
                      )}
                    </div>
                  ) : null}
                  <FieldError error={errors.customerId} id="mortgage-customerId-error" />
                </div>
                <button
                  className={`button button--primary ${styles.newCustomerButton}`}
                  onClick={openNewCustomer}
                  ref={addCustomerButtonRef}
                  type="button"
                >
                  <Plus aria-hidden="true" size={16} />
                  New Customer
                </button>
              </div>

              <div className={styles.customerDetails}>
                <label>
                  <span>Name</span>
                  <input
                    aria-describedby={errors.customerName ? "mortgage-customerName-error" : undefined}
                    aria-invalid={Boolean(errors.customerName)}
                    className="field"
                    id="mortgage-customerName"
                    readOnly
                    value={form.customerName}
                  />
                  <FieldError error={errors.customerName} id="mortgage-customerName-error" />
                </label>
                <label>
                  <span>Phone</span>
                  <input className="field" id="mortgage-customerPhone" readOnly value={form.customerPhone} />
                </label>
                <label>
                  <span>Customer ID</span>
                  <input className={`field ${styles.customerId}`} id="mortgage-customerId" readOnly value={form.customerId} />
                </label>
              </div>
            </Card>

            <Card className={styles.card}>
              <div className={styles.sectionHeading}>
                <div>
                  <h2>Gold Item Details</h2>
                  <p>Describe and value the item being pledged.</p>
                </div>
                <span className={styles.sectionIcon}><Coins aria-hidden="true" size={18} /></span>
              </div>

              <div className={styles.goldFieldGrid}>
                <label className={styles.fieldGroup}>
                  <span>Gold Type <RequiredMark /></span>
                  <select
                    aria-describedby={errors.goldType ? "mortgage-goldType-error" : undefined}
                    aria-invalid={Boolean(errors.goldType)}
                    className="select"
                    id="mortgage-goldType"
                    onChange={(event) => updateField("goldType", event.target.value)}
                    value={form.goldType}
                  >
                    {goldTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                  <FieldError error={errors.goldType} id="mortgage-goldType-error" />
                </label>

                <label className={styles.fieldGroup}>
                  <span>Purity (Karat) <RequiredMark /></span>
                  <select
                    aria-describedby={errors.purity ? "mortgage-purity-error" : undefined}
                    aria-invalid={Boolean(errors.purity)}
                    className="select"
                    id="mortgage-purity"
                    onChange={(event) => updateField("purity", event.target.value)}
                    value={form.purity}
                  >
                    {purities.map((purity) => <option key={purity}>{purity}</option>)}
                  </select>
                  <FieldError error={errors.purity} id="mortgage-purity-error" />
                </label>

                <div className={`${styles.fieldGroup} ${styles.weightField}`}>
                  <label htmlFor="mortgage-weight">Weight <RequiredMark /></label>
                  <div className={styles.weightControl}>
                    <input
                      aria-describedby={errors.weight ? "mortgage-weight-error" : "mortgage-weight-hint"}
                      aria-invalid={Boolean(errors.weight)}
                      className="field"
                      id="mortgage-weight"
                      inputMode="decimal"
                      min="0.01"
                      onChange={(event) => updateField("weight", event.target.value)}
                      step="0.01"
                      type="number"
                      value={form.weight}
                    />
                    <select
                      aria-label="Weight unit"
                      className="select"
                      id="mortgage-unit"
                      onChange={(event) => updateField("unit", event.target.value)}
                      value={form.unit}
                    >
                      <option value="gram">gram</option>
                      <option value="tola">tola</option>
                    </select>
                  </div>
                  <span className="sr-only" id="mortgage-weight-hint">Valuation updates as weight changes.</span>
                  <FieldError error={errors.weight} id="mortgage-weight-error" />
                </div>

                <label className={`${styles.fieldGroup} ${styles.descriptionField}`}>
                  <span>Item Description</span>
                  <textarea
                    className="textarea"
                    id="mortgage-description"
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Describe the pledged gold item..."
                    value={form.description}
                  />
                </label>
              </div>
            </Card>

            <Card className={styles.card}>
              <div className={styles.sectionHeading}>
                <div>
                  <h2>Additional Information</h2>
                  <p>Assign the mortgage entry to a branch and staff member.</p>
                </div>
              </div>
              <div className={styles.additionalGrid}>
                <label className={styles.fieldGroup}>
                  <span>Branch</span>
                  <select
                    aria-describedby={errors.branch ? "mortgage-branch-error" : undefined}
                    aria-invalid={Boolean(errors.branch)}
                    className="select"
                    id="mortgage-branch"
                    onChange={(event) => updateField("branch", event.target.value)}
                    value={form.branch}
                  >
                    <option>Main Branch</option>
                    <option>Uttara Branch</option>
                    <option>Chittagong Branch</option>
                    <option>Sylhet Branch</option>
                    <option>Khulna Branch</option>
                  </select>
                  <FieldError error={errors.branch} id="mortgage-branch-error" />
                </label>
                <label className={styles.fieldGroup}>
                  <span>Staff</span>
                  <select
                    aria-describedby={errors.staff ? "mortgage-staff-error" : undefined}
                    aria-invalid={Boolean(errors.staff)}
                    className="select"
                    id="mortgage-staff"
                    onChange={(event) => updateField("staff", event.target.value)}
                    value={form.staff}
                  >
                    <option>Admin User</option>
                    <option>Rahim Uddin</option>
                    <option>Nusrat Jahan</option>
                  </select>
                  <FieldError error={errors.staff} id="mortgage-staff-error" />
                </label>
              </div>
            </Card>
          </div>

          <Card className={`${styles.card} ${styles.loanCard}`}>
            <div className={styles.sectionHeading}>
              <div>
                <h2>Loan Information</h2>
                <p>Set the terms and repayment date.</p>
              </div>
            </div>

            <div aria-live="polite" className={styles.loanSummary}>
              <div>
                <span>Current Gold Rate (BDT/gram)</span>
                <strong>{formatTaka(CURRENT_GOLD_RATE)}</strong>
              </div>
              <div>
                <span>Valuation Amount</span>
                <strong>{formatTaka(valuation)}</strong>
              </div>
            </div>

            <div className={styles.loanFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="mortgage-loanAmount">Loan Amount <RequiredMark /></label>
                <div className={styles.moneyField}>
                  <span aria-hidden="true">৳</span>
                  <input
                    aria-describedby={errors.loanAmount ? "mortgage-loanAmount-error" : undefined}
                    aria-invalid={Boolean(errors.loanAmount)}
                    id="mortgage-loanAmount"
                    inputMode="decimal"
                    min="1"
                    onChange={(event) => updateField("loanAmount", event.target.value)}
                    step="1"
                    type="number"
                    value={form.loanAmount}
                  />
                </div>
                <FieldError error={errors.loanAmount} id="mortgage-loanAmount-error" />
              </div>

              <label className={styles.fieldGroup}>
                <span>Interest Rate (Monthly %) <RequiredMark /></span>
                <select
                  aria-describedby={errors.interestRate ? "mortgage-interestRate-error" : undefined}
                  aria-invalid={Boolean(errors.interestRate)}
                  className="select"
                  id="mortgage-interestRate"
                  onChange={(event) => updateField("interestRate", event.target.value)}
                  value={form.interestRate}
                >
                  <option value="1">1%</option>
                  <option value="1.5">1.5%</option>
                  <option value="2">2%</option>
                  <option value="2.5">2.5%</option>
                  <option value="3">3%</option>
                </select>
                <FieldError error={errors.interestRate} id="mortgage-interestRate-error" />
              </label>

              <div className={styles.fieldGroup}>
                <label htmlFor="mortgage-dueDate">Due Date <RequiredMark /></label>
                <div className={styles.dateField}>
                  <input
                    aria-describedby={errors.dueDate ? "mortgage-dueDate-error" : undefined}
                    aria-invalid={Boolean(errors.dueDate)}
                    className="field"
                    id="mortgage-dueDate"
                    onChange={(event) => updateField("dueDate", event.target.value)}
                    type="date"
                    value={form.dueDate}
                  />
                  <CalendarDays aria-hidden="true" size={16} />
                </div>
                <FieldError error={errors.dueDate} id="mortgage-dueDate-error" />
              </div>

              <label className={`${styles.fieldGroup} ${styles.remarksField}`}>
                <span>Remarks</span>
                <textarea
                  className="textarea"
                  id="mortgage-remarks"
                  onChange={(event) => updateField("remarks", event.target.value)}
                  placeholder="Add any terms or notes..."
                  value={form.remarks}
                />
              </label>
            </div>

            <footer className={styles.loanFooter}>
              <button className={`button ${styles.resetButton}`} onClick={resetMortgage} type="button">
                <RotateCcw aria-hidden="true" size={15} />
                Reset
              </button>
              <button className="button button--primary" type="submit">
                <Save aria-hidden="true" size={15} />
                Save Mortgage Entry
              </button>
            </footer>
          </Card>
        </div>

        <div
          aria-live="polite"
          className={`${styles.feedback} ${feedback ? styles[`feedback${feedback.tone[0].toUpperCase()}${feedback.tone.slice(1)}`] : ""}`}
          role={feedback?.tone === "error" ? "alert" : "status"}
        >
          {feedback ? (
            feedback.tone === "error"
              ? <CircleAlert aria-hidden="true" size={17} />
              : <CheckCircle2 aria-hidden="true" size={17} />
          ) : null}
          <span>{feedback?.text ?? "Complete the form, then save the mortgage entry."}</span>
        </div>
      </form>

      {newCustomerOpen ? (
        <div
          className={styles.modalBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeNewCustomer();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeNewCustomer();
          }}
          role="presentation"
        >
          <section
            aria-describedby="new-customer-description"
            aria-labelledby="new-customer-title"
            aria-modal="true"
            className={styles.modal}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <span className={styles.modalIcon}><UserPlus aria-hidden="true" size={20} /></span>
              <div>
                <h2 id="new-customer-title">New Customer</h2>
                <p id="new-customer-description">Create a customer profile without leaving this mortgage.</p>
              </div>
              <button aria-label="Close new customer dialog" className={styles.modalClose} onClick={closeNewCustomer} type="button">
                <X size={19} />
              </button>
            </header>
            <form className={styles.modalForm} noValidate onSubmit={createCustomer}>
              <label className={styles.fieldGroup}>
                <span>Customer Name <RequiredMark /></span>
                <input
                  aria-invalid={Boolean(newCustomerError && newCustomerName.trim().length < 2)}
                  className="field"
                  onChange={(event) => {
                    setNewCustomerName(event.target.value);
                    setNewCustomerError("");
                  }}
                  placeholder="Enter full name"
                  ref={newCustomerNameRef}
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
              <p aria-live="assertive" className={newCustomerError ? styles.modalError : "sr-only"}>
                {newCustomerError}
              </p>
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
