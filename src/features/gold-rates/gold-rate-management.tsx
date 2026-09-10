"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  Coins,
  Minus,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  calculateRateChange,
  formatGoldRate,
  formatRateDate,
  initialGoldRates,
  sortRatesNewestFirst,
  type GoldRateRecord,
} from "./gold-rate-data";
import styles from "./gold-rate-management.module.css";

const CHART_WIDTH = 620;
const CHART_HEIGHT = 166;

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function getChangeLabel(change: number) {
  if (change > 0) {
    return `+${Math.abs(change).toFixed(1)}%`;
  }

  if (change < 0) {
    return `-${Math.abs(change).toFixed(1)}%`;
  }

  return "0.0%";
}

function RateChange({ change, compact = false }: { change: number; compact?: boolean }) {
  const direction = change > 0 ? "increase" : change < 0 ? "decrease" : "no change";
  const Icon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : Minus;

  return (
    <span
      aria-label={`${direction} of ${Math.abs(change).toFixed(1)} percent`}
      className={`${styles.rateChange} ${change > 0 ? styles.positive : change < 0 ? styles.negative : styles.neutral} ${compact ? styles.compactChange : ""}`}
    >
      <Icon aria-hidden="true" size={compact ? 13 : 18} strokeWidth={2.5} />
      {getChangeLabel(change)}
    </span>
  );
}

type ChartModel = {
  areaPath: string;
  axisLabels: number[];
  dates: string[];
  endPoint: { x: number; y: number } | null;
  linePath: string;
  summary: string;
};

function createChartModel(rates: ReadonlyArray<GoldRateRecord>): ChartModel {
  const points = [...rates].reverse().slice(-30);

  if (points.length === 0) {
    return {
      areaPath: "",
      axisLabels: [],
      dates: [],
      endPoint: null,
      linePath: "",
      summary: "No gold rate history is available.",
    };
  }

  const values = points.map((point) => point.rate);
  const minimum = Math.floor(Math.min(...values) / 500) * 500;
  let maximum = Math.ceil(Math.max(...values) / 500) * 500;
  maximum = Math.max(maximum, minimum + 1500);
  const range = maximum - minimum;
  const coordinates = points.map((point, index) => ({
    x: points.length === 1 ? CHART_WIDTH / 2 : (index / (points.length - 1)) * CHART_WIDTH,
    y: CHART_HEIGHT - ((point.rate - minimum) / range) * CHART_HEIGHT,
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
  const lastPoint = coordinates.at(-1) ?? null;
  const dateIndexes = points.length < 4
    ? points.map((_, index) => index)
    : [0, Math.round((points.length - 1) / 3), Math.round(((points.length - 1) * 2) / 3), points.length - 1];

  return {
    areaPath: `${linePath} L ${lastPoint?.x ?? CHART_WIDTH} ${CHART_HEIGHT} L ${coordinates[0]?.x ?? 0} ${CHART_HEIGHT} Z`,
    axisLabels: Array.from({ length: 4 }, (_, index) => maximum - (range / 3) * index),
    dates: [...new Set(dateIndexes.map((index) => formatChartDate(points[index].date)))],
    endPoint: lastPoint,
    linePath,
    summary: `Gold rate trend from ${formatChartDate(points[0].date)} at ${formatGoldRate(points[0].rate)} BDT per gram to ${formatChartDate(points.at(-1)?.date ?? points[0].date)} at ${formatGoldRate(points.at(-1)?.rate ?? points[0].rate)} BDT per gram.`,
  };
}

function RateTrendChart({ rates }: { rates: ReadonlyArray<GoldRateRecord> }) {
  const chart = useMemo(() => createChartModel(rates), [rates]);

  if (!chart.linePath) {
    return <p className={styles.emptyChart}>Add a gold rate to begin the trend chart.</p>;
  }

  return (
    <div className={styles.chartLayout}>
      <div aria-hidden="true" className={styles.yAxis}>
        {chart.axisLabels.map((label) => <span key={label}>{formatGoldRate(label)}</span>)}
      </div>
      <div className={styles.plotArea}>
        <svg
          aria-label={chart.summary}
          className={styles.chartSvg}
          preserveAspectRatio="none"
          role="img"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        >
          <defs>
            <linearGradient id="gold-rate-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#d8ad40" stopOpacity="0.24" />
              <stop offset="1" stopColor="#d8ad40" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {chart.axisLabels.map((label, index) => (
            <line
              className={styles.gridLine}
              key={label}
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={CHART_WIDTH}
              y1={(CHART_HEIGHT / 3) * index}
              y2={(CHART_HEIGHT / 3) * index}
            />
          ))}
          <path d={chart.areaPath} fill="url(#gold-rate-area)" />
          <path className={styles.trendLine} d={chart.linePath} fill="none" vectorEffect="non-scaling-stroke" />
          {chart.endPoint ? (
            <>
              <circle
                className={styles.endPointHalo}
                cx={chart.endPoint.x}
                cy={chart.endPoint.y}
                r="8"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                className={styles.endPoint}
                cx={chart.endPoint.x}
                cy={chart.endPoint.y}
                r="4"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}
        </svg>
        <div aria-hidden="true" className={styles.xAxis}>
          {chart.dates.map((date) => <span key={date}>{date}</span>)}
        </div>
      </div>
    </div>
  );
}

export function GoldRateManagement() {
  const [rates, setRates] = useState<GoldRateRecord[]>(() => [...initialGoldRates]);
  const [rateInput, setRateInput] = useState("8420");
  const [effectiveDate, setEffectiveDate] = useState("2025-04-30");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [pendingDeleteDate, setPendingDeleteDate] = useState<string | null>(null);
  const rateInputRef = useRef<HTMLInputElement>(null);
  const confirmDeleteRef = useRef<HTMLButtonElement>(null);
  const tableHeadingRef = useRef<HTMLHeadingElement>(null);

  const currentRate = rates[0];
  const currentChange = currentRate
    ? calculateRateChange(currentRate.rate, rates[1]?.rate)
    : 0;
  const recentRates = rates.slice(0, 8);
  const pendingRate = pendingDeleteDate
    ? rates.find((rate) => rate.date === pendingDeleteDate)
    : undefined;

  useEffect(() => {
    if (pendingDeleteDate) {
      confirmDeleteRef.current?.focus();
    }
  }, [pendingDeleteDate]);

  function focusUpdateForm() {
    document.getElementById("gold-rate-update-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => rateInputRef.current?.focus({ preventScroll: true }));
  }

  function updateGoldRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedRate = Number.parseFloat(rateInput);

    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      setMessage("Enter a valid gold rate greater than zero.");
      rateInputRef.current?.focus();
      return;
    }

    const normalizedRate = Math.round(parsedRate * 100) / 100;
    const existed = rates.some((rate) => rate.date === effectiveDate);
    const nextRecord: GoldRateRecord = {
      date: effectiveDate,
      rate: normalizedRate,
      notes: notes.trim(),
      updatedAt: `${formatRateDate(effectiveDate)}, just now`,
    };

    setRates((current) => sortRatesNewestFirst([
      ...current.filter((rate) => rate.date !== effectiveDate),
      nextRecord,
    ]));
    setRateInput(String(normalizedRate));
    setNotes("");
    setPendingDeleteDate(null);
    setMessage(
      `Gold rate for ${formatRateDate(effectiveDate)} ${existed ? "updated" : "added"} at ৳ ${formatGoldRate(normalizedRate)} per gram.`,
    );
  }

  function deleteRate() {
    if (!pendingRate) {
      return;
    }

    setRates((current) => current.filter((rate) => rate.date !== pendingRate.date));
    setPendingDeleteDate(null);
    setMessage(`Gold rate for ${formatRateDate(pendingRate.date)} deleted.`);
    requestAnimationFrame(() => tableHeadingRef.current?.focus());
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={focusUpdateForm} type="button">
            <Plus aria-hidden="true" size={16} />
            Update Gold Rate
          </button>
        )}
        description="Update and manage daily gold rates"
        title="Gold Rate Management"
      />

      <p aria-live="polite" className={message ? styles.feedback : "sr-only"} role="status">
        {message ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
        {message}
      </p>

      <section aria-label="Current gold rate and trend" className={styles.summaryGrid}>
        <Card className={styles.currentRateCard}>
          <h2>Current Gold Rate (BDT)</h2>
          {currentRate ? (
            <>
              <div className={styles.currentRateRow}>
                <span aria-hidden="true" className={styles.rateIcon}><Coins size={29} strokeWidth={1.9} /></span>
                <strong aria-label={`${formatGoldRate(currentRate.rate)} Bangladeshi taka per gram`}>
                  <span aria-hidden="true">৳</span> {formatGoldRate(currentRate.rate)}<small>/gram</small>
                </strong>
                <RateChange change={currentChange} />
              </div>
              <p className={styles.lastUpdated}>Last updated: {currentRate.updatedAt}</p>
            </>
          ) : (
            <p className={styles.noCurrentRate}>No current gold rate. Use the form below to add one.</p>
          )}
        </Card>

        <Card aria-labelledby="rate-trend-title" className={styles.trendCard}>
          <h2 id="rate-trend-title">Rate Trend <span>(Last 30 Days)</span></h2>
          <RateTrendChart rates={rates} />
        </Card>
      </section>

      <section className={styles.managementGrid}>
        <Card
          as="form"
          className={styles.updateCard}
          id="gold-rate-update-form"
          onSubmit={updateGoldRate}
        >
          <h2>Update Gold Rate</h2>
          <div className={styles.formFields}>
            <label>
              <span>Rate Per Gram (BDT) <b aria-hidden="true">*</b></span>
              <input
                className="field"
                inputMode="decimal"
                min="0.01"
                onChange={(event) => setRateInput(event.target.value)}
                ref={rateInputRef}
                required
                step="0.01"
                type="number"
                value={rateInput}
              />
            </label>
            <label>
              <span>Effective Date <b aria-hidden="true">*</b></span>
              <span className={styles.dateField}>
                <CalendarDays aria-hidden="true" size={16} />
                <input
                  className="field"
                  onChange={(event) => setEffectiveDate(event.target.value)}
                  required
                  type="date"
                  value={effectiveDate}
                />
              </span>
            </label>
            <label>
              <span>Notes</span>
              <textarea
                className="textarea"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Enter notes (optional)..."
                rows={6}
                value={notes}
              />
            </label>
          </div>
          <button className={`button button--primary ${styles.submitButton}`} type="submit">
            <RefreshCw aria-hidden="true" size={15} />
            Update Rate
          </button>
        </Card>

        <Card aria-labelledby="recent-rates-title" className={styles.ratesCard}>
          <h2 id="recent-rates-title" ref={tableHeadingRef} tabIndex={-1}>Recent Gold Rates</h2>

          {pendingRate ? (
            <div
              aria-describedby="delete-rate-description"
              aria-labelledby="delete-rate-title"
              className={styles.deleteConfirmation}
              role="alertdialog"
            >
              <AlertTriangle aria-hidden="true" size={19} />
              <div>
                <strong id="delete-rate-title">Delete this gold rate?</strong>
                <p id="delete-rate-description">
                  {formatRateDate(pendingRate.date)} at ৳ {formatGoldRate(pendingRate.rate)} per gram will be removed.
                </p>
              </div>
              <div className={styles.confirmActions}>
                <button className="button" onClick={() => setPendingDeleteDate(null)} type="button">Cancel</button>
                <button className={styles.confirmDelete} onClick={deleteRate} ref={confirmDeleteRef} type="button">
                  <Trash2 aria-hidden="true" size={14} />
                  Delete
                </button>
              </div>
            </div>
          ) : null}

          <div className={styles.tableScroller}>
            <table>
              <caption className="sr-only">Eight most recent daily gold rates in Bangladeshi taka per gram</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Rate (BDT/gram)</th>
                  <th scope="col">Change</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRates.map((rate, index) => {
                  const change = calculateRateChange(rate.rate, rates[index + 1]?.rate);
                  return (
                    <tr key={rate.date}>
                      <td>{index + 1}</td>
                      <td><strong>{formatRateDate(rate.date)}</strong></td>
                      <td>{formatGoldRate(rate.rate)}</td>
                      <td><RateChange change={change} compact /></td>
                      <td>
                        <button
                          aria-haspopup="dialog"
                          aria-label={`Delete gold rate for ${formatRateDate(rate.date)}`}
                          className={styles.deleteButton}
                          onClick={() => setPendingDeleteDate(rate.date)}
                          title="Delete rate"
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {recentRates.length === 0 ? (
                  <tr><td className={styles.emptyRates} colSpan={5}>No gold rates have been added yet.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
