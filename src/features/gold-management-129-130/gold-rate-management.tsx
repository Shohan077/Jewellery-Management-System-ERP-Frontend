"use client";

import { ArrowDown, ArrowUp, BarChart3, Edit3, MoreVertical, Plus, RotateCcw, Search, TrendingDown, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { formatBdt, initialGoldRates, type GoldPurity, type GoldRateRow } from "./gold-management-data";
import styles from "./gold-management-129-130.module.css";

type Editor = GoldRateRow | "new" | null;

export function GoldRateManagement129() {
  const [records, setRecords] = useState(initialGoldRates);
  const [from, setFrom] = useState("2025-04-01");
  const [to, setTo] = useState("2025-04-30");
  const [purity, setPurity] = useState("All Purity");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [editor, setEditor] = useState<Editor>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => records.filter((row) => {
    const matchesPurity = purity === "All Purity" || row.purity === purity;
    const matchesQuery = !deferredQuery || `${row.date} ${row.source} ${row.purity}`.toLowerCase().includes(deferredQuery.toLowerCase());
    return row.date >= from && row.date <= to && matchesPurity && matchesQuery;
  }), [deferredQuery, from, purity, records, to]);

  function reset() { setFrom("2025-04-01"); setTo("2025-04-30"); setPurity("All Purity"); setQuery(""); setMessage("Filters reset."); }
  function saveRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const id = String(data.get("id") || `gr-${Date.now()}`);
    const record: GoldRateRow = { id, date: String(data.get("date")), purity: String(data.get("purity")) as GoldPurity, rate: Number(data.get("rate")), change: Number(data.get("change")), source: String(data.get("source")) };
    setRecords((current) => current.some((item) => item.id === id) ? current.map((item) => item.id === id ? record : item) : [record, ...current]); setEditor(null); setMessage(`${record.purity} gold rate saved.`);
  }

  return <div className={styles.page}>
    <PageHeader action={<button className={`button ${styles.primaryButton}`} onClick={() => setEditor("new")} type="button"><Plus size={16} />Add Gold Rate</button>} description="Home  ›  Gold Management  ›  Gold Rate Management" title="Gold Rate Management" />
    {message ? <p className={styles.notice}>{message}</p> : null}
    <section className={styles.statsGrid}>
      <Stat icon={<span>▰</span>} title="Current Gold Rate" value="৳ 9,850" meta="per gram, 22K" extra="↑ 1.2%" />
      <Stat icon={<BarChart3 size={23} />} title="Highest This Month" value="৳ 9,920" meta="12 Apr 2025" />
      <Stat icon={<TrendingDown size={23} />} title="Lowest This Month" value="৳ 9,650" meta="02 Apr 2025" />
    </section>
    <Card className={styles.filterCard}><div className={styles.filterForm}>
      <Label text="Date From"><input className="field" onChange={(event) => setFrom(event.target.value)} type="date" value={from} /></Label>
      <Label text="Date To"><input className="field" onChange={(event) => setTo(event.target.value)} type="date" value={to} /></Label>
      <Label text="Gold Purity"><select className="select" onChange={(event) => setPurity(event.target.value)} value={purity}><option>All Purity</option><option>24K</option><option>22K</option><option>18K</option></select></Label>
      <Label className={styles.searchField} text="Search"><Search size={15} /><input className="field" onChange={(event) => setQuery(event.target.value)} placeholder="Date, purity or source" value={query} /></Label>
      <div className={styles.filterActions}><button className={`button ${styles.primaryButton}`} onClick={() => setMessage(`${filtered.length} rates found.`)} type="button"><Search size={14} />Search</button><button className="button" onClick={reset} type="button"><RotateCcw size={14} />Reset</button></div>
    </div></Card>
    <Card className={styles.tableCard}><div className={styles.tableScroller}><table className={styles.dataTable}><thead><tr><th>SL</th><th>Date</th><th>Gold Purity</th><th>Rate (per gram)</th><th>Change</th><th>Source</th><th>Action</th></tr></thead><tbody>{filtered.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{formatDate(row.date)}</td><td>{row.purity}</td><td>৳ {formatBdt(row.rate)}</td><td><span className={row.change >= 0 ? styles.ratePositive : styles.rateNegative}>{row.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{Math.abs(row.change).toFixed(1)}%</span></td><td>{row.source}</td><td><div className={styles.rowActions}><button onClick={() => setEditor(row)} type="button"><Edit3 size={12} />Edit</button><button className={styles.iconOnly} onClick={() => setMessage(`${row.purity} rate details selected.`)} type="button"><MoreVertical size={13} /></button></div></td></tr>)}</tbody></table></div></Card>
    {editor ? <RateEditor initial={editor === "new" ? null : editor} onClose={() => setEditor(null)} onSubmit={saveRate} /> : null}
  </div>;
}

function Stat({ extra, icon, meta, title, value }: { extra?: string; icon: React.ReactNode; meta: string; title: string; value: string }) { return <Card className={styles.statCard}><span className={styles.statIcon}>{icon}</span><div><p>{title}</p><h2>{value}</h2><small>{meta}</small></div>{extra ? <span className={styles.up}>{extra}</span> : null}</Card>; }
function Label({ children, className = "", text }: { children: React.ReactNode; className?: string; text: string }) { return <label className={className}><span>{text}</span>{children}</label>; }
function formatDate(date: string) { return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
function RateEditor({ initial, onClose, onSubmit }: { initial: GoldRateRow | null; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) { return <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2>{initial ? "Edit Gold Rate" : "Add Gold Rate"}</h2><p>Enter the daily per gram rate.</p></div><button className={styles.closeButton} onClick={onClose} type="button"><X size={17} /></button></div><form className={styles.editorForm} onSubmit={onSubmit}><input name="id" type="hidden" value={initial?.id ?? ""} /><div className={styles.editorGrid}><Label text="Date"><input className="field" defaultValue={initial?.date ?? "2025-04-30"} name="date" required type="date" /></Label><Label text="Gold Purity"><select className="select" defaultValue={initial?.purity ?? "22K"} name="purity"><option>24K</option><option>22K</option><option>18K</option></select></Label><Label text="Rate"><input className="field" defaultValue={initial?.rate ?? 9850} min="1" name="rate" required type="number" /></Label><Label text="Change (%)"><input className="field" defaultValue={initial?.change ?? 0} name="change" step="0.1" type="number" /></Label></div><Label text="Source"><input className="field" defaultValue={initial?.source ?? "Local Market"} name="source" required /></Label><div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} type="submit">Save Rate</button></div></form></Card></div>; }
