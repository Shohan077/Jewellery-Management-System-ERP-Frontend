"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Eye, FilePenLine, Filter, Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Notice, Pagination } from "./shared";
import styles from "./gold-rates-screen.module.css";

type Rate = {
  id: number;
  date: string;
  pure24: number;
  gold22: number;
  gold21: number;
  gold18: number;
  updatedBy: string;
};

const initialRates: Rate[] = [
  { id: 1, date: "31 May 2025", pure24: 9650, gold22: 8950, gold21: 8540, gold18: 7240, updatedBy: "Admin" },
  { id: 2, date: "30 May 2025", pure24: 9580, gold22: 8880, gold21: 8470, gold18: 7180, updatedBy: "Admin" },
  { id: 3, date: "29 May 2025", pure24: 9520, gold22: 8820, gold21: 8410, gold18: 7120, updatedBy: "Admin" },
  { id: 4, date: "28 May 2025", pure24: 9480, gold22: 8780, gold21: 8370, gold18: 7080, updatedBy: "Admin" },
  { id: 5, date: "27 May 2025", pure24: 9430, gold22: 8730, gold21: 8320, gold18: 7030, updatedBy: "Admin" },
];

const gramsPerUnit: Record<string, number> = { Gram: 1, Vori: 8.584, Ana: 0.537, Ratti: 0.0894 };
const formatRate = (value: number) => `৳ ${value.toLocaleString("en-IN")} / gm`;

function RateDialog({ rate, onClose, onSave }: { rate?: Rate; onClose: () => void; onSave: (rate: Rate) => void }) {
  const [pure24, setPure24] = useState(String(rate?.pure24 ?? 9650));
  const [gold22, setGold22] = useState(String(rate?.gold22 ?? 8950));
  const [gold21, setGold21] = useState(String(rate?.gold21 ?? 8540));
  const [gold18, setGold18] = useState(String(rate?.gold18 ?? 7240));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: rate?.id ?? Date.now(),
      date: rate?.date ?? "01 Jun 2025",
      pure24: Number(pure24),
      gold22: Number(gold22),
      gold21: Number(gold21),
      gold18: Number(gold18),
      updatedBy: "Admin",
    });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="rate-dialog-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
        <header><div><h2 id="rate-dialog-title">{rate ? "Edit Gold Rate" : "Add New Gold Rate"}</h2><p>Set the per-gram rate for each purity.</p></div><button aria-label="Close" onClick={onClose} type="button"><X size={17} /></button></header>
        <form onSubmit={submit}>
          <label><span>24K (Pure Gold)</span><input className="field" min="1" onChange={(event) => setPure24(event.target.value)} required type="number" value={pure24} /></label>
          <label><span>22K (91.6%)</span><input className="field" min="1" onChange={(event) => setGold22(event.target.value)} required type="number" value={gold22} /></label>
          <label><span>21K (87.5%)</span><input className="field" min="1" onChange={(event) => setGold21(event.target.value)} required type="number" value={gold21} /></label>
          <label><span>18K (75.0%)</span><input className="field" min="1" onChange={(event) => setGold18(event.target.value)} required type="number" value={gold18} /></label>
          <footer><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><button className={styles.primaryButton} type="submit">Save Rate</button></footer>
        </form>
      </Card>
    </div>
  );
}

export function Reference53GoldRates() {
  const [rates, setRates] = useState(initialRates);
  const [fromUnit, setFromUnit] = useState("Gram");
  const [toUnit, setToUnit] = useState("Vori");
  const [weight, setWeight] = useState("10");
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Rate | "new" | null>(null);
  const [message, setMessage] = useState("");

  const converted = useMemo(() => {
    const amount = Math.max(0, Number(weight) || 0);
    return amount * gramsPerUnit[fromUnit] / gramsPerUnit[toUnit];
  }, [fromUnit, toUnit, weight]);

  function saveRate(rate: Rate) {
    setRates((current) => current.some((item) => item.id === rate.id)
      ? current.map((item) => item.id === rate.id ? rate : item)
      : [rate, ...current]);
    setEditing(null);
    setMessage(`Gold rates for ${rate.date} were saved.`);
  }

  return (
    <div className={styles.page}>
      <section className={styles.summaryGrid}>
        <Card className={styles.liveCard}>
          <h2>Live Gold Rate (22K)</h2>
          <div className={styles.liveMain}><div aria-hidden="true" className={styles.goldArt}><i /><i /></div><div><strong>{formatRate(rates[0]?.gold22 ?? 8950).replace(" / gm", "")}</strong><span>per gram</span><b>+1.25%</b></div></div>
          <footer><span>Updated: 31 May 2025, 10:30 AM</span><em>● Live</em></footer>
        </Card>

        <Card className={styles.rateSummary}>
          <h2>Rate Summary</h2>
          <dl><div><dt>24K (Pure Gold)</dt><dd>{formatRate(rates[0]?.pure24 ?? 9650)}</dd></div><div><dt>22K (91.6%)</dt><dd>{formatRate(rates[0]?.gold22 ?? 8950)}</dd></div><div><dt>21K (87.5%)</dt><dd>{formatRate(rates[0]?.gold21 ?? 8540)}</dd></div><div><dt>18K (75.0%)</dt><dd>{formatRate(rates[0]?.gold18 ?? 7240)}</dd></div></dl>
          <button onClick={() => setMessage("Rate history is shown in the table below.")} type="button">View Rate History</button>
        </Card>

        <Card className={styles.converter}>
          <h2>Rate Conversion</h2>
          <div className={styles.conversionUnits}><label><span>From</span><select onChange={(event) => setFromUnit(event.target.value)} value={fromUnit}>{Object.keys(gramsPerUnit).map((unit) => <option key={unit}>{unit}</option>)}</select></label><label><span>To</span><select onChange={(event) => setToUnit(event.target.value)} value={toUnit}>{Object.keys(gramsPerUnit).map((unit) => <option key={unit}>{unit}</option>)}</select></label></div>
          <label><span>Weight ({fromUnit})</span><input min="0" onChange={(event) => setWeight(event.target.value)} type="number" value={weight} /></label>
          <label><span>Converted Weight</span><output>{converted.toFixed(3)} {toUnit}</output></label>
        </Card>
      </section>

      <Card className={styles.tableCard}>
        <header className={styles.tableTitle}><h2>Gold Rate List</h2><button className={styles.addButton} onClick={() => setEditing("new")} type="button"><Plus size={14} />Add New Rate</button></header>
        <div className={styles.toolbar}><label><span className="sr-only">Date range</span><input onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays size={13} /></label><button onClick={() => setMessage(`Showing gold rates for ${dateRange}.`)} type="button"><Filter size={12} />Filter</button></div>
        {message ? <div className={styles.notice}><Notice>{message}</Notice></div> : null}
        <div className={styles.tableScroller}>
          <table><caption className="sr-only">Daily gold rates</caption><thead><tr><th>#</th><th>Date</th><th>24K (৳/gm)</th><th>22K (৳/gm)</th><th>21K (৳/gm)</th><th>18K (৳/gm)</th><th>Updated By</th><th>Action</th></tr></thead><tbody>{rates.map((rate, index) => <tr key={rate.id}><td>{index + 1}</td><td><strong>{rate.date}</strong></td><td>{rate.pure24.toLocaleString("en-IN")}</td><td>{rate.gold22.toLocaleString("en-IN")}</td><td>{rate.gold21.toLocaleString("en-IN")}</td><td>{rate.gold18.toLocaleString("en-IN")}</td><td>{rate.updatedBy}</td><td><div className={styles.actions}><button aria-label={`View rates for ${rate.date}`} onClick={() => setMessage(`${rate.date}: 22K gold was ${formatRate(rate.gold22)}.`)} type="button"><Eye size={13} /></button><button aria-label={`Edit rates for ${rate.date}`} onClick={() => setEditing(rate)} type="button"><FilePenLine size={13} /></button><button aria-label={`Delete rates for ${rate.date}`} onClick={() => { setRates((current) => current.filter((item) => item.id !== rate.id)); setMessage(`${rate.date} was removed.`); }} type="button"><Trash2 size={13} /></button></div></td></tr>)}</tbody></table>
        </div>
        <footer className={styles.tableFooter}><span>Showing 1 to {rates.length} of 25 entries</span><Pagination current={page} onChange={setPage} /></footer>
      </Card>

      {editing ? <RateDialog onClose={() => setEditing(null)} onSave={saveRate} rate={editing === "new" ? undefined : editing} /> : null}
    </div>
  );
}
