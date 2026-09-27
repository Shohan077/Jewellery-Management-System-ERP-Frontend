"use client";

import {
  BadgeCheck,
  CalendarDays,
  ListChecks,
  Pencil,
  Percent,
  Plus,
  Tags,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./tax-vat-settings.module.css";

type RuleStatus = "Active" | "Inactive";

type TaxRule = {
  id: number;
  name: string;
  rate: string;
  appliesTo: string;
  status: RuleStatus;
  effectiveDate: string;
  updatedBy: string;
  includeInReport: boolean;
  applyOnDiscount: boolean;
  compoundTax: boolean;
};

type RuleDraft = Omit<TaxRule, "id" | "updatedBy">;

const SETTINGS_TABS = ["General", "Invoice", "Tax & VAT", "Units & Conversion", "Notifications", "Backup", "Integrations"] as const;

const INITIAL_RULES: TaxRule[] = [
  { id: 1, name: "Standard VAT", rate: "5.00", appliesTo: "All Items", status: "Active", effectiveDate: "2025-01-01", updatedBy: "Admin User", includeInReport: true, applyOnDiscount: false, compoundTax: false },
  { id: 2, name: "Gold Ornament VAT", rate: "3.00", appliesTo: "Gold Ornaments", status: "Active", effectiveDate: "2025-01-01", updatedBy: "Admin User", includeInReport: true, applyOnDiscount: false, compoundTax: false },
  { id: 3, name: "Diamond VAT", rate: "1.50", appliesTo: "Diamond Items", status: "Active", effectiveDate: "2025-02-01", updatedBy: "Admin User", includeInReport: true, applyOnDiscount: false, compoundTax: false },
  { id: 4, name: "Making Charges VAT", rate: "5.00", appliesTo: "Making Charges", status: "Active", effectiveDate: "2025-01-01", updatedBy: "Admin User", includeInReport: true, applyOnDiscount: true, compoundTax: false },
  { id: 5, name: "Old Gold Purchase VAT", rate: "0.00", appliesTo: "Old Gold Purchase", status: "Active", effectiveDate: "2025-01-01", updatedBy: "Admin User", includeInReport: false, applyOnDiscount: false, compoundTax: false },
  { id: 6, name: "Silver Items VAT", rate: "5.00", appliesTo: "Silver Items", status: "Inactive", effectiveDate: "2025-03-01", updatedBy: "Admin User", includeInReport: true, applyOnDiscount: false, compoundTax: false },
];

const EMPTY_RULE: RuleDraft = {
  name: "",
  rate: "",
  appliesTo: "All Items",
  status: "Active",
  effectiveDate: "2025-05-15",
  includeInReport: true,
  applyOnDiscount: false,
  compoundTax: false,
};

function draftFromRule(rule: TaxRule): RuleDraft {
  return {
    name: rule.name,
    rate: rule.rate,
    appliesTo: rule.appliesTo,
    status: rule.status,
    effectiveDate: rule.effectiveDate,
    includeInReport: rule.includeInReport,
    applyOnDiscount: rule.applyOnDiscount,
    compoundTax: rule.compoundTax,
  };
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(month) - 1];
  return `${day}-${monthName}-${year}`;
}

function SettingsTabs({ onSelect }: { onSelect: (tab: string) => void }) {
  return (
    <nav aria-label="System settings sections" className={styles.tabs}>
      {SETTINGS_TABS.map((tab) => <button aria-current={tab === "Tax & VAT" ? "page" : undefined} className={tab === "Tax & VAT" ? styles.activeTab : ""} key={tab} onClick={() => onSelect(tab)} type="button">{tab}</button>)}
    </nav>
  );
}

function MetricCard({ icon, label, value, caption, tone }: { icon: ReactNode; label: string; value: string; caption: string; tone: string }) {
  return (
    <Card className={styles.metric}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</span>
      <div><p>{label}</p><strong>{value}</strong><small>{caption}</small></div>
    </Card>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className={styles.field}><span>{label}{required ? <b> *</b> : null}</span>{children}</label>;
}

export function TaxVatSettings202() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [editingId, setEditingId] = useState<number | null>(2);
  const [draft, setDraft] = useState<RuleDraft>(() => draftFromRule(INITIAL_RULES[1]));
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState("15-May-2025");

  const selectedRule = useMemo(() => rules.find((rule) => rule.id === editingId), [editingId, rules]);
  const activeRules = rules.filter((rule) => rule.status === "Active").length + 1;

  function beginAdd() {
    setEditingId(null);
    setDraft(EMPTY_RULE);
    setMessage("Add a new tax rule using the form.");
  }

  function beginEdit(rule: TaxRule) {
    setEditingId(rule.id);
    setDraft(draftFromRule(rule));
    setMessage(`Editing ${rule.name}.`);
  }

  function deleteRule(rule: TaxRule) {
    setRules((current) => current.filter((item) => item.id !== rule.id));
    if (editingId === rule.id) {
      setEditingId(null);
      setDraft(EMPTY_RULE);
    }
    setMessage(`${rule.name} was deleted.`);
  }

  function saveRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedRate = Number(draft.rate).toFixed(2);
    if (editingId === null) {
      const id = rules.reduce((largest, rule) => Math.max(largest, rule.id), 0) + 1;
      const created: TaxRule = { ...draft, id, rate: normalizedRate, updatedBy: "Admin User" };
      setRules((current) => [...current, created]);
      setEditingId(id);
      setDraft(draftFromRule(created));
      setMessage(`${created.name} was added successfully.`);
    } else {
      setRules((current) => current.map((rule) => rule.id === editingId ? { ...rule, ...draft, rate: normalizedRate, updatedBy: "Admin User" } : rule));
      setDraft((current) => ({ ...current, rate: normalizedRate }));
      setMessage(`${draft.name} was updated successfully.`);
    }
    setLastUpdated("27-Sep-2026");
  }

  function cancelEdit() {
    const fallback = rules.find((rule) => rule.id === 2) ?? rules[0];
    if (fallback) {
      setEditingId(fallback.id);
      setDraft(draftFromRule(fallback));
    } else {
      setEditingId(null);
      setDraft(EMPTY_RULE);
    }
    setMessage("Unsaved changes were cancelled.");
  }

  return (
    <div className={styles.page}>
      <PageHeader description="Manage tax rules, VAT structure and product tax configuration" title="Tax & VAT Settings" />
      <SettingsTabs onSelect={(tab) => tab !== "Tax & VAT" && setMessage(`${tab} settings are available from their dedicated tab.`)} />
      {message ? <p aria-live="polite" className={styles.notice}>{message}</p> : null}

      <section className={styles.metrics}>
        <MetricCard caption="Standard VAT Rate" icon={<Percent size={20} />} label="Default VAT" tone="blue" value="5%" />
        <MetricCard caption="Rules are active" icon={<ListChecks size={20} />} label="Active Tax Rules" tone="green" value={String(activeRules)} />
        <MetricCard caption="Categories configured" icon={<Tags size={20} />} label="Taxable Categories" tone="violet" value="12" />
        <MetricCard caption="By Admin User" icon={<CalendarDays size={20} />} label="Last Updated" tone="slate" value={lastUpdated} />
      </section>

      <section className={styles.contentGrid}>
        <Card className={styles.rulesCard}>
          <header className={styles.cardHeader}><h2>Tax Rules</h2><button className={`button ${styles.primary}`} onClick={beginAdd} type="button"><Plus size={13} />Add Tax Rule</button></header>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead><tr><th>Tax Name</th><th>Rate (%)</th><th>Applies To</th><th>Status</th><th>Effective Date</th><th>Updated By</th><th>Action</th></tr></thead>
              <tbody>
                {rules.map((rule) => <tr className={editingId === rule.id ? styles.selectedRow : ""} key={rule.id}>
                  <td><b>{rule.name}</b></td><td>{rule.rate}</td><td>{rule.appliesTo}</td>
                  <td><span className={`${styles.status} ${rule.status === "Active" ? styles.active : styles.inactive}`}>{rule.status}</span></td>
                  <td>{formatDate(rule.effectiveDate)}</td><td>{rule.updatedBy}</td>
                  <td><div className={styles.rowActions}><button aria-label={`Edit ${rule.name}`} onClick={() => beginEdit(rule)} type="button"><Pencil size={12} /></button><button aria-label={`Delete ${rule.name}`} onClick={() => deleteRule(rule)} type="button"><Trash2 size={12} /></button></div></td>
                </tr>)}
                {!rules.length ? <tr><td className={styles.empty} colSpan={7}>No tax rules have been configured.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <footer className={styles.tableFooter}>
            <span>Showing 1 to {rules.length} of {rules.length} entries</span>
            <div className={styles.pagination}><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">‹</button><button className={styles.currentPage} type="button">{page}</button><button aria-label="Next page" disabled type="button">›</button></div>
          </footer>
        </Card>

        <Card className={styles.formCard}>
          <div className={styles.formTitle}><span className={styles.formTitleIcon}><BadgeCheck size={16} /></span><div><h2>Add / Update Tax Rule</h2><p>{selectedRule ? `Editing ${selectedRule.name}` : "Create a new tax rule"}</p></div></div>
          <form className={styles.form} onSubmit={saveRule}>
            <Field label="Tax Name" required><input className="field" maxLength={50} name="taxName" onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Enter tax name" required value={draft.name} /></Field>
            <Field label="Rate (%)" required><input className="field" max="100" min="0" name="rate" onChange={(event) => setDraft((current) => ({ ...current, rate: event.target.value }))} placeholder="0.00" required step="0.01" type="number" value={draft.rate} /></Field>
            <Field label="Applies To" required><select className="select" name="appliesTo" onChange={(event) => setDraft((current) => ({ ...current, appliesTo: event.target.value }))} value={draft.appliesTo}><option>All Items</option><option>Gold Ornaments</option><option>Diamond Items</option><option>Making Charges</option><option>Old Gold Purchase</option><option>Silver Items</option></select></Field>
            <div className={styles.checks}>
              <label><input checked={draft.includeInReport} onChange={(event) => setDraft((current) => ({ ...current, includeInReport: event.target.checked }))} type="checkbox" />Include in Report</label>
              <label><input checked={draft.applyOnDiscount} onChange={(event) => setDraft((current) => ({ ...current, applyOnDiscount: event.target.checked }))} type="checkbox" />Apply on Discounted Value</label>
              <label><input checked={draft.compoundTax} onChange={(event) => setDraft((current) => ({ ...current, compoundTax: event.target.checked }))} type="checkbox" />Compound Tax</label>
            </div>
            <Field label="Effective Date" required><input className="field" name="effectiveDate" onChange={(event) => setDraft((current) => ({ ...current, effectiveDate: event.target.value }))} required type="date" value={draft.effectiveDate} /></Field>
            <Field label="Status" required><select className="select" name="status" onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as RuleStatus }))} value={draft.status}><option>Active</option><option>Inactive</option></select></Field>
            <div className={styles.formActions}><button className={`button ${styles.primary}`} type="submit">Save Tax Settings</button><button className="button" onClick={cancelEdit} type="button">Cancel</button></div>
          </form>
        </Card>
      </section>
    </div>
  );
}
