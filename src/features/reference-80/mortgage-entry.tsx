"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, Save } from "lucide-react";
import { Button, PageHeader } from "../reference-78/shared";
import base from "../reference-78/reference-78.module.css";
import styles from "./mortgage-entry.module.css";

type MortgageForm = {
  customer: string;
  goldType: string;
  purity: string;
  weight: string;
  marketRate: string;
  mortgageDate: string;
  loanAmount: string;
  interestRate: string;
  duration: string;
  remarks: string;
};

const customers = {
  "Rahim Hossain": { phone: "01711-223344", address: "House # 12, Road # 5\nDhanmondi, Dhaka-1205" },
  "Abul Kalam": { phone: "01819-445566", address: "Mirpur, Dhaka" },
  "Shahin Akter": { phone: "01925-667788", address: "Uttara, Dhaka" },
} as const;

const initialForm: MortgageForm = {
  customer: "",
  goldType: "",
  purity: "",
  weight: "",
  marketRate: "",
  mortgageDate: "2025-05-30",
  loanAmount: "",
  interestRate: "",
  duration: "",
  remarks: "",
};

const numeric = (value: string) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
};

const money = (value: number) => value.toLocaleString("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function Reference80MortgageEntry() {
  const [form, setForm] = useState<MortgageForm>(initialForm);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const customer = customers[form.customer as keyof typeof customers];
  const goldValue = useMemo(() => numeric(form.weight) * numeric(form.marketRate), [form.marketRate, form.weight]);
  const interestAmount = useMemo(
    () => numeric(form.loanAmount) * (numeric(form.interestRate) / 100) * numeric(form.duration),
    [form.duration, form.interestRate, form.loanAmount],
  );
  const payableAmount = numeric(form.loanAmount) + interestAmount;

  function update<Key extends keyof MortgageForm>(key: Key, value: MortgageForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
    setSubmitted(false);
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
    setMessage("Mortgage form cleared.");
  }

  function saveMortgage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!form.customer || !form.goldType || !form.purity || numeric(form.weight) <= 0 || numeric(form.marketRate) <= 0 || numeric(form.loanAmount) <= 0 || numeric(form.interestRate) < 0 || numeric(form.duration) <= 0) {
      setMessage("Complete all required mortgage details before saving.");
      return;
    }
    setMessage(`Mortgage for ${form.customer} saved successfully.`);
  }

  const invalid = (key: keyof MortgageForm) => submitted && !form[key];

  return (
    <main className={base.page}>
      <PageHeader
        actions={<Button onClick={resetForm} tone="primary"><Plus size={13} />New Mortgage</Button>}
        crumbs={["Customers", "Mortgage", "Mortgage Entry"]}
        title="Mortgage Entry"
      />

      <form className={styles.form} noValidate onSubmit={saveMortgage}>
        <section className={styles.detailsGrid}>
          <fieldset className={styles.formCard}>
            <legend>Customer Information</legend>
            <label className={base.field}>
              <span>Customer <b>*</b></span>
              <select
                aria-invalid={invalid("customer")}
                onChange={(event) => update("customer", event.target.value)}
                value={form.customer}
              >
                <option value="">Select Customer</option>
                {Object.keys(customers).map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className={base.field}>
              <span>Phone</span>
              <input readOnly value={customer?.phone ?? ""} />
            </label>
            <label className={base.field}>
              <span>Address</span>
              <textarea className={styles.address} readOnly value={customer?.address ?? ""} />
            </label>
          </fieldset>

          <fieldset className={styles.formCard}>
            <legend>Gold Information</legend>
            <label className={base.field}>
              <span>Gold Type <b>*</b></span>
              <select aria-invalid={invalid("goldType")} onChange={(event) => update("goldType", event.target.value)} value={form.goldType}>
                <option value="">Select Type</option>
                <option>Gold Jewellery</option><option>Gold Bar</option><option>Gold Coin</option><option>Old Gold</option>
              </select>
            </label>
            <label className={base.field}>
              <span>Purity (Karat) <b>*</b></span>
              <select aria-invalid={invalid("purity")} onChange={(event) => update("purity", event.target.value)} value={form.purity}>
                <option value="">Select Purity</option>
                <option>24K</option><option>22K</option><option>21K</option><option>18K</option>
              </select>
            </label>
            <label className={base.field}>
              <span>Weight (gm) <b>*</b></span>
              <input aria-invalid={submitted && numeric(form.weight) <= 0} inputMode="decimal" min="0" onChange={(event) => update("weight", event.target.value)} placeholder="0.00" step="0.01" type="number" value={form.weight} />
            </label>
            <label className={base.field}>
              <span>Market Rate (৳/gm) <b>*</b></span>
              <input aria-invalid={submitted && numeric(form.marketRate) <= 0} inputMode="decimal" min="0" onChange={(event) => update("marketRate", event.target.value)} placeholder="0.00" step="0.01" type="number" value={form.marketRate} />
            </label>
            <label className={base.field}>
              <span>Gold Value (৳)</span>
              <input className={styles.readonly} readOnly value={money(goldValue)} />
            </label>
          </fieldset>

          <fieldset className={styles.formCard}>
            <legend>Mortgage Information</legend>
            <label className={base.field}>
              <span>Mortgage Date <b>*</b></span>
              <input onChange={(event) => update("mortgageDate", event.target.value)} type="date" value={form.mortgageDate} />
            </label>
            <label className={base.field}>
              <span>Loan Amount (৳) <b>*</b></span>
              <input aria-invalid={submitted && numeric(form.loanAmount) <= 0} inputMode="decimal" min="0" onChange={(event) => update("loanAmount", event.target.value)} placeholder="0.00" step="0.01" type="number" value={form.loanAmount} />
            </label>
            <label className={base.field}>
              <span>Interest Rate (%) <b>*</b></span>
              <input aria-invalid={submitted && form.interestRate === ""} inputMode="decimal" min="0" onChange={(event) => update("interestRate", event.target.value)} placeholder="0.00" step="0.01" type="number" value={form.interestRate} />
            </label>
            <label className={base.field}>
              <span>Duration (Months)</span>
              <input aria-invalid={submitted && numeric(form.duration) <= 0} inputMode="numeric" min="0" onChange={(event) => update("duration", event.target.value)} placeholder="0" step="1" type="number" value={form.duration} />
            </label>
          </fieldset>
        </section>

        <section className={styles.lowerGrid}>
          <label className={`${base.field} ${styles.remarks}`}>
            <span>Remarks</span>
            <textarea onChange={(event) => update("remarks", event.target.value)} value={form.remarks} />
          </label>
          <aside aria-label="Mortgage calculation summary" className={styles.summary}>
            <div><span>Total Gold Value (৳)</span><strong>{money(goldValue)}</strong></div>
            <div><span>Loan Amount (৳)</span><strong>{money(numeric(form.loanAmount))}</strong></div>
            <div><span>Interest Amount (৳)</span><strong>{money(interestAmount)}</strong></div>
            <div className={styles.payable}><span>Payable Amount (৳)</span><strong>{money(payableAmount)}</strong></div>
          </aside>
        </section>

        <p aria-live="polite" className={`${styles.feedback} ${message.includes("successfully") ? styles.successMessage : ""}`}>{message}</p>
        <footer className={styles.actions}>
          <Button onClick={resetForm}>Cancel</Button>
          <Button tone="primary" type="submit"><Save size={13} />Save Mortgage</Button>
        </footer>
      </form>
    </main>
  );
}
