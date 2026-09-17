"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatLongDate,
  formatMoney,
  formatShortDate,
  goldTypes,
  initialManagedRates,
  sortManagedRates,
  type GoldType,
  type ManagedGoldRate,
} from "./gold-rate-manager-data";
import styles from "./gold-rate-manager.module.css";

const CHART_WIDTH = 680;
const CHART_HEIGHT = 136;

type RateDraft = {
  date: string;
  goldType: GoldType;
  notes: string;
  rate: string;
};

type DialogState =
  | { mode: "view"; record: ManagedGoldRate }
  | { mode: "delete"; record: ManagedGoldRate }
  | null;

const initialDraft: RateDraft = {
  date: "2025-04-30",
  goldType: "22K",
  notes: "",
  rate: "8420",
};

function createTrendModel(records: ReadonlyArray<ManagedGoldRate>) {
  const points = [...records]
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(-7);

  if (!points.length) {
    return { axis: [] as number[], labels: [] as string[], line: "", circles: [] as Array<{ x: number; y: number }> };
  }

  const values = points.map((point) => point.rate);
  const low = Math.floor((Math.min(...values) - 100) / 100) * 100;
  const high = Math.ceil((Math.max(...values) + 100) / 100) * 100;
  const range = Math.max(high - low, 1);
  const circles = points.map((point, index) => ({
    x: points.length === 1 ? CHART_WIDTH / 2 : (index / (points.length - 1)) * CHART_WIDTH,
    y: CHART_HEIGHT - ((point.rate - low) / range) * CHART_HEIGHT,
  }));

  return {
    axis: [high, high - range / 2, low],
    labels: points.map((point) => formatShortDate(point.date)),
    line: circles.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" "),
    circles,
  };
}

function TrendChart({ records }: { records: ReadonlyArray<ManagedGoldRate> }) {
  const trend = useMemo(() => createTrendModel(records), [records]);

  if (!trend.line) {
    return <p className={styles.emptyState}>Add a rate to start the seven-day trend.</p>;
  }

  return (
    <div className={styles.chartLayout}>
      <div aria-hidden="true" className={styles.yAxis}>
        {trend.axis.map((label) => <span key={label}>{formatMoney(label)}</span>)}
      </div>
      <div className={styles.plot}>
        <svg
          aria-label={`Seven-day gold rate trend from ${trend.labels[0]} to ${trend.labels.at(-1)}`}
          className={styles.chart}
          preserveAspectRatio="none"
          role="img"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        >
          {trend.axis.map((label, index) => (
            <line
              className={styles.gridLine}
              key={label}
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={CHART_WIDTH}
              y1={(CHART_HEIGHT / 2) * index}
              y2={(CHART_HEIGHT / 2) * index}
            />
          ))}
          <path className={styles.trendLine} d={trend.line} fill="none" vectorEffect="non-scaling-stroke" />
          {trend.circles.map((point, index) => (
            <circle
              className={styles.chartPoint}
              cx={point.x}
              cy={point.y}
              key={trend.labels[index]}
              r="5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <div aria-hidden="true" className={styles.xAxis}>
          {trend.labels.map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
    </div>
  );
}

function ChangeValue({ current, previous }: { current: number; previous?: number }) {
  const change = previous === undefined ? 0 : current - previous;
  const Icon = change >= 0 ? ArrowUp : ArrowDown;

  return (
    <span className={change >= 0 ? styles.positive : styles.negative}>
      <Icon aria-hidden="true" size={14} strokeWidth={2.8} />
      {formatMoney(Math.abs(change))}
    </span>
  );
}

export function GoldRateManager() {
  const [records, setRecords] = useState<ManagedGoldRate[]>(() => [...initialManagedRates]);
  const [draft, setDraft] = useState<RateDraft>(initialDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const rateRef = useRef<HTMLInputElement>(null);
  const sortedRecords = useMemo(() => sortManagedRates(records), [records]);
  const current = sortedRecords[0];
  const previous = sortedRecords[1];
  const currentPercent = current && previous ? ((current.rate - previous.rate) / previous.rate) * 100 : 0;

  useEffect(() => {
    if (!dialog) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialog]);

  function updateDraft<Key extends keyof RateDraft>(key: Key, value: RateDraft[Key]) {
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  }

  function focusForm() {
    document.getElementById("managed-gold-rate-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => rateRef.current?.focus({ preventScroll: true }));
  }

  function resetForm() {
    setDraft(current ? {
      date: current.date,
      goldType: current.goldType,
      notes: "",
      rate: String(current.rate),
    } : initialDraft);
    setEditingId(null);
    setError("");
  }

  function submitRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rate = Number(draft.rate.replaceAll(",", ""));

    if (!draft.date || !Number.isFinite(rate) || rate <= 0) {
      setError("Enter a valid rate and effective date.");
      rateRef.current?.focus();
      return;
    }

    const duplicate = records.find((record) => record.date === draft.date && record.goldType === draft.goldType && record.id !== editingId);
    const record: ManagedGoldRate = {
      id: editingId ?? duplicate?.id ?? `rate-${draft.date}-${draft.goldType}`,
      date: draft.date,
      goldType: draft.goldType,
      notes: draft.notes.trim(),
      rate: Math.round(rate * 100) / 100,
    };

    setRecords((currentRecords) => sortManagedRates([
      ...currentRecords.filter((item) => item.id !== record.id && item.id !== editingId && item.id !== duplicate?.id),
      record,
    ]));
    setMessage(`${editingId || duplicate ? "Updated" : "Added"} ${draft.goldType} rate for ${formatLongDate(draft.date)}.`);
    setError("");
    setEditingId(null);
    setDraft({ ...draft, notes: "", rate: String(record.rate) });
  }

  function editRecord(record: ManagedGoldRate) {
    setDraft({ date: record.date, goldType: record.goldType, notes: record.notes, rate: String(record.rate) });
    setEditingId(record.id);
    setDialog(null);
    setMessage(`Editing ${record.goldType} rate for ${formatLongDate(record.date)}.`);
    focusForm();
  }

  function deleteRecord(record: ManagedGoldRate) {
    setRecords((currentRecords) => currentRecords.filter((item) => item.id !== record.id));
    if (editingId === record.id) resetForm();
    setDialog(null);
    setMessage(`Deleted ${record.goldType} rate for ${formatLongDate(record.date)}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={focusForm} type="button">
            <Plus aria-hidden="true" size={16} /> Update Gold Rate
          </button>
        )}
        description="Update and manage daily gold rates"
        title="Gold Rate Management"
      />

      <div aria-live="polite" className={message || error ? `${styles.notice} ${error ? styles.errorNotice : ""}` : "sr-only"} role="status">
        {error ? <X aria-hidden="true" size={16} /> : <CheckCircle2 aria-hidden="true" size={16} />}
        {error || message}
      </div>

      <section aria-label="Current gold rate overview" className={styles.summaryGrid}>
        <Card className={styles.currentCard}>
          <h2>Current Gold Rate (BDT)</h2>
          {current ? (
            <>
              <div className={styles.currentValue}>
                <strong>৳ {formatMoney(current.rate)}<small>/gram</small></strong>
                <span className={currentPercent >= 0 ? styles.positive : styles.negative}>
                  {currentPercent >= 0 ? <ArrowUp aria-hidden="true" size={15} /> : <ArrowDown aria-hidden="true" size={15} />}
                  {Math.abs(currentPercent).toFixed(1)}%
                </span>
              </div>
              <p>Last updated: {formatLongDate(current.date)}, 10:30 AM</p>
            </>
          ) : <p className={styles.emptyState}>No gold rate has been added.</p>}
        </Card>

        <Card aria-labelledby="seven-day-trend" className={styles.trendCard}>
          <h2 id="seven-day-trend">Gold Rate Trend (Last 7 Days)</h2>
          <TrendChart records={sortedRecords} />
        </Card>
      </section>

      <Card as="form" className={styles.updateCard} id="managed-gold-rate-form" onSubmit={submitRate}>
        <div className={styles.cardHeading}>
          <div>
            <h2>{editingId ? "Edit Gold Rate" : "Update Gold Rate"}</h2>
            {editingId ? <p>Editing an existing history record</p> : null}
          </div>
          {editingId ? <button className="button" onClick={resetForm} type="button">Cancel edit</button> : null}
        </div>
        <div className={styles.formGrid}>
          <label>
            <span>Gold Type <b aria-hidden="true">*</b></span>
            <select className="select" onChange={(event) => updateDraft("goldType", event.target.value as GoldType)} value={draft.goldType}>
              {goldTypes.map((type) => <option key={type} value={type}>{type} (BDT/gram)</option>)}
            </select>
          </label>
          <label>
            <span>Rate (BDT) <b aria-hidden="true">*</b></span>
            <input
              className="field"
              inputMode="decimal"
              min="1"
              onChange={(event) => updateDraft("rate", event.target.value)}
              ref={rateRef}
              required
              step="0.01"
              type="number"
              value={draft.rate}
            />
          </label>
          <label>
            <span>Effective Date <b aria-hidden="true">*</b></span>
            <input className="field" onChange={(event) => updateDraft("date", event.target.value)} required type="date" value={draft.date} />
          </label>
          <label className={styles.notesField}>
            <span>Notes (optional)</span>
            <textarea className="textarea" onChange={(event) => updateDraft("notes", event.target.value)} placeholder="Add notes..." rows={2} value={draft.notes} />
          </label>
          <button className={`button button--primary ${styles.updateButton}`} type="submit">
            <RefreshCw aria-hidden="true" size={15} /> {editingId ? "Save Changes" : "Update Rate"}
          </button>
        </div>
      </Card>

      <Card aria-labelledby="history-heading" className={styles.historyCard}>
        <h2 id="history-heading">Gold Rate History</h2>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Recent gold rate history with view, edit and delete actions</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Gold Type</th>
                <th scope="col">Rate (BDT/gram)</th>
                <th scope="col">Change</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.slice(0, 8).map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{formatLongDate(record.date)}</td>
                  <td>{record.goldType}</td>
                  <td>{formatMoney(record.rate)}</td>
                  <td><ChangeValue current={record.rate} previous={sortedRecords[index + 1]?.rate} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View rate for ${formatLongDate(record.date)}`} onClick={() => setDialog({ mode: "view", record })} title="View" type="button"><Eye aria-hidden="true" size={15} /></button>
                      <button aria-label={`Edit rate for ${formatLongDate(record.date)}`} onClick={() => editRecord(record)} title="Edit" type="button"><Pencil aria-hidden="true" size={14} /></button>
                      <button aria-label={`Delete rate for ${formatLongDate(record.date)}`} className={styles.deleteAction} onClick={() => setDialog({ mode: "delete", record })} title="Delete" type="button"><Trash2 aria-hidden="true" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!sortedRecords.length ? <tr><td className={styles.tableEmpty} colSpan={6}>No history records found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      {dialog ? (
        <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <Card aria-labelledby="rate-dialog-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
            <div className={styles.dialogHeader}>
              <div>
                <h2 id="rate-dialog-title">{dialog.mode === "view" ? "Gold Rate Details" : "Delete Gold Rate?"}</h2>
                <p>{formatLongDate(dialog.record.date)}</p>
              </div>
              <button aria-label="Close dialog" autoFocus onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={19} /></button>
            </div>
            {dialog.mode === "view" ? (
              <>
                <dl className={styles.details}>
                  <div><dt>Gold Type</dt><dd>{dialog.record.goldType}</dd></div>
                  <div><dt>Rate</dt><dd>৳ {formatMoney(dialog.record.rate)} / gram</dd></div>
                  <div><dt>Effective Date</dt><dd>{formatLongDate(dialog.record.date)}</dd></div>
                  <div><dt>Notes</dt><dd>{dialog.record.notes || "No notes added"}</dd></div>
                </dl>
                <div className={styles.dialogActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => editRecord(dialog.record)} type="button"><Pencil aria-hidden="true" size={15} /> Edit Rate</button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.deleteMessage}>This will permanently remove the {dialog.record.goldType} rate of ৳ {formatMoney(dialog.record.rate)} from the history.</p>
                <div className={styles.dialogActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Cancel</button>
                  <button className={styles.deleteButton} onClick={() => deleteRecord(dialog.record)} type="button"><Trash2 aria-hidden="true" size={15} /> Delete Rate</button>
                </div>
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
