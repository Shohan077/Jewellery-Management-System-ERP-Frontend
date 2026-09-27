"use client";

import {
  ArrowDown,
  ArrowUp,
  BadgeIndianRupee,
  CalendarClock,
  Coins,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./gold-rate-management.module.css";

type Purity = "24K (999)" | "22K (916)" | "18K (750)";

type RateHistory = {
  id: number;
  dateTime: string;
  rate24: number;
  rate22: number;
  rate18: number;
  change: number | null;
  updatedBy: string;
};

const initialHistory: RateHistory[] = [
  { id: 1, dateTime: "Oct 26, 2024 11:45 AM", rate24: 8920, rate22: 8180, rate18: 6890, change: 120, updatedBy: "Admin" },
  { id: 2, dateTime: "Oct 25, 2024 10:20 AM", rate24: 8800, rate22: 8070, rate18: 6800, change: 50, updatedBy: "Admin" },
  { id: 3, dateTime: "Oct 24, 2024 09:15 AM", rate24: 8750, rate22: 8020, rate18: 6760, change: -30, updatedBy: "Admin" },
  { id: 4, dateTime: "Oct 23, 2024 11:10 AM", rate24: 8780, rate22: 8050, rate18: 6780, change: 70, updatedBy: "Manager" },
  { id: 5, dateTime: "Oct 22, 2024 10:30 AM", rate24: 8710, rate22: 7980, rate18: 6720, change: 40, updatedBy: "Admin" },
  { id: 6, dateTime: "Oct 21, 2024 09:45 AM", rate24: 8670, rate22: 7940, rate18: 6680, change: -60, updatedBy: "Admin" },
  { id: 7, dateTime: "Oct 20, 2024 11:10 AM", rate24: 8730, rate22: 8000, rate18: 6740, change: 80, updatedBy: "Manager" },
  { id: 8, dateTime: "Oct 19, 2024 10:15 AM", rate24: 8650, rate22: 7920, rate18: 6680, change: null, updatedBy: "Admin" },
];

const purityKey: Record<Purity, "rate24" | "rate22" | "rate18"> = {
  "24K (999)": "rate24",
  "22K (916)": "rate22",
  "18K (750)": "rate18",
};

const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function MetricCard({
  accent,
  icon,
  label,
  rate,
  change,
}: {
  accent: "gold" | "amber" | "green";
  icon: ReactNode;
  label: string;
  rate: number;
  change: number;
}) {
  return (
    <Card className={styles.metricCard}>
      <span className={`${styles.metricIcon} ${styles[accent]}`}>{icon}</span>
      <div>
        <span className={styles.metricLabel}>{label}</span>
        <strong>৳ {money.format(rate)}</strong>
        <small className={change >= 0 ? styles.up : styles.down}>
          {change >= 0 ? <ArrowUp aria-hidden="true" size={11} /> : <ArrowDown aria-hidden="true" size={11} />}
          {change >= 0 ? "+" : ""}{money.format(change)} ({Math.abs((change / Math.max(rate - change, 1)) * 100).toFixed(2)}%)
        </small>
      </div>
    </Card>
  );
}

function Change({ value }: { value: number | null }) {
  if (value === null) return <span className={styles.noChange}>–</span>;
  const positive = value >= 0;
  return (
    <span className={positive ? styles.up : styles.down}>
      {positive ? <ArrowUp aria-hidden="true" size={12} /> : <ArrowDown aria-hidden="true" size={12} />}
      {positive ? "+" : ""}{money.format(value)}
    </span>
  );
}

export function GoldRateManagement194() {
  const [history, setHistory] = useState<RateHistory[]>(initialHistory);
  const [purity, setPurity] = useState<Purity>("22K (916)");
  const [rate, setRate] = useState("8180");
  const [effectiveDate, setEffectiveDate] = useState("2024-10-26");
  const [notes, setNotes] = useState("Rate updated as per market price");
  const [message, setMessage] = useState("");
  const rateRef = useRef<HTMLInputElement>(null);

  const latest = history[0];
  const previous = history[1];
  const currentChanges = useMemo(() => ({
    rate24: latest.rate24 - previous.rate24,
    rate22: latest.rate22 - previous.rate22,
    rate18: latest.rate18 - previous.rate18,
  }), [latest, previous]);

  function focusEditor() {
    document.getElementById("gold-rate-editor")?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => rateRef.current?.focus({ preventScroll: true }));
  }

  function submitRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(rate);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setMessage("Enter a valid rate greater than zero.");
      rateRef.current?.focus();
      return;
    }

    const field = purityKey[purity];
    const nextRates = { rate24: latest.rate24, rate22: latest.rate22, rate18: latest.rate18 };
    const change = parsed - nextRates[field];
    nextRates[field] = parsed;
    const next: RateHistory = {
      id: Date.now(),
      dateTime: `${formatDate(effectiveDate)} 11:45 AM`,
      ...nextRates,
      change,
      updatedBy: "Admin",
    };

    setHistory((current) => [next, ...current].slice(0, 12));
    setMessage(`${purity.split(" ")[0]} gold rate updated to ৳ ${money.format(parsed)} per gram.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.primary}`} onClick={focusEditor} type="button"><Plus size={15} />Update Gold Rate</button>}
        description="Update and manage gold rates, purity and unit conversion"
        title="Gold Rate Management"
      />

      {message ? <p aria-live="polite" className={styles.notice}>{message}</p> : null}

      <section aria-label="Current gold rates" className={styles.metrics}>
        <MetricCard accent="gold" change={currentChanges.rate24} icon={<BadgeIndianRupee size={18} />} label="Current Gold Rate (24K)" rate={latest.rate24} />
        <MetricCard accent="amber" change={currentChanges.rate22} icon={<Coins size={18} />} label="Current Gold Rate (22K)" rate={latest.rate22} />
        <MetricCard accent="green" change={currentChanges.rate18} icon={<BadgeIndianRupee size={18} />} label="Current Gold Rate (18K)" rate={latest.rate18} />
        <Card className={styles.updatedCard}>
          <CalendarClock aria-hidden="true" size={24} />
          <div><span>Last Updated</span><strong>{latest.dateTime.split(" ").slice(0, 3).join(" ")}</strong><small>{latest.dateTime.split(" ").slice(3).join(" ")}</small></div>
        </Card>
      </section>

      <section className={styles.contentGrid}>
        <Card as="form" className={styles.editor} id="gold-rate-editor" onSubmit={submitRate}>
          <h2>Update Gold Rate</h2>
          <label><span>Gold Type <b>*</b></span><select className="select" onChange={(event) => setPurity(event.target.value as Purity)} value={purity}><option>24K (999)</option><option>22K (916)</option><option>18K (750)</option></select></label>
          <label><span>Rate per Gram (৳) <b>*</b></span><input className="field" min="1" onChange={(event) => setRate(event.target.value)} ref={rateRef} required step="1" type="number" value={rate} /></label>
          <label><span>Effective Date <b>*</b></span><input className="field" onChange={(event) => setEffectiveDate(event.target.value)} required type="date" value={effectiveDate} /></label>
          <label><span>Notes</span><textarea className="textarea" maxLength={300} onChange={(event) => setNotes(event.target.value)} rows={5} value={notes} /></label>
          <button className={`button ${styles.primary} ${styles.submit}`} type="submit"><RefreshCw size={14} />Update Rate</button>
        </Card>

        <Card className={styles.historyCard}>
          <div className={styles.cardHead}><h2>Recent Gold Rate History</h2><button onClick={() => setMessage(`Showing ${history.length} gold rate updates.`)} type="button">View All</button></div>
          <div className={styles.tableScroll}>
            <table>
              <caption className="sr-only">Recent gold rate history</caption>
              <thead><tr><th>#</th><th>Date &amp; Time</th><th>24K (৳)</th><th>22K (৳)</th><th>18K (৳)</th><th>Change</th><th>Updated By</th></tr></thead>
              <tbody>{history.slice(0, 8).map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{item.dateTime}</td><td>{money.format(item.rate24)}</td><td>{money.format(item.rate22)}</td><td>{money.format(item.rate18)}</td><td><Change value={item.change} /></td><td>{item.updatedBy}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
