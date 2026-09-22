"use client";

import { CheckCircle2, CircleDollarSign, Printer, Search, ShoppingCart, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";

import { EMPTY_CASH_SNAPSHOT, formatMoney, getCashSnapshot, parseCashTransactions, subscribeCash } from "./cash-data";
import styles from "./cash-management.module.css";

const checklist = ["All sales invoices are recorded", "All purchases are recorded", "Cash In/Out entries are verified", "Bank deposits are verified", "Expenses are verified", "Cash count is matched"];
const closingKey = "jewellery-erp:cash-management:daily-closing:v1";

export function DailyClosing() {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot), [snapshot]);
  const [date, setDate] = useState("2025-04-16");
  const [branch, setBranch] = useState("Main Branch");
  const [checks, setChecks] = useState(() => checklist.map(() => true));
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const savedForDate = saved.filter((item) => item.date === date);
  const addedIn = savedForDate.filter((item) => item.direction === "Cash In").reduce((sum, item) => sum + item.amount, 0);
  const addedOut = savedForDate.filter((item) => item.direction === "Cash Out").reduce((sum, item) => sum + item.amount, 0);
  const openingCash = 585_150;
  const totalCollection = 275_400 + addedIn;
  const totalExpense = 82_350 + addedOut;
  const closingCash = openingCash + totalCollection - totalExpense;

  function confirmClosing() {
    if (checks.some((checked) => !checked)) {
      setMessage("Complete every checklist item before confirming daily closing.");
      return;
    }
    window.localStorage.setItem(closingKey, JSON.stringify({ date, branch, notes, closingCash, confirmedAt: new Date().toISOString() }));
    setMessage(`Daily closing confirmed for ${branch} on 16 Apr 2025.`);
  }

  function printClosing() {
    setMessage("Daily closing report is ready to print or export as PDF.");
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div className={`${styles.page} ${styles.closingPage}`}>
      <header className={styles.pageHeader}><h1>Daily Closing</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> Daily Closing</p></header>
      <Card className={styles.closingFilters}><label><span>Closing Date <b>*</b></span><input className="field" onChange={(event) => setDate(event.target.value)} type="date" value={date} /></label><label><span>Branch <b>*</b></span><select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}><option>Main Branch</option><option>Uttara Branch</option><option>Chittagong Branch</option></select></label><button className={styles.primaryButton} onClick={() => setMessage(`Closing summary refreshed for ${branch}.`)} type="button"><Search size={15} />Search</button><button className={styles.outlineButton} onClick={printClosing} type="button"><Printer size={15} />Print / Export</button></Card>

      <section className={styles.kpiGrid}>
        <Card className={styles.kpi}><i className={styles.greenIcon}><CircleDollarSign /></i><div><span>Opening Cash</span><strong>{formatMoney(openingCash)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.greenIcon}><ShoppingCart /></i><div><span>Total Sales Collection</span><strong className={styles.greenText}>{formatMoney(totalCollection)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.redIcon}><WalletCards /></i><div><span>Total Expense</span><strong className={styles.redText}>{formatMoney(totalExpense)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.blueIcon}><WalletCards /></i><div><span>Net Closing Cash</span><strong className={styles.blueText}>{formatMoney(closingCash)}</strong></div></Card>
      </section>

      <section className={styles.closingSummaries}>
        <Card className={styles.breakdown}><h2>Sales Summary</h2><dl><div><dt>Gold Sales</dt><dd>{formatMoney(185_000)}</dd></div><div><dt>Diamond Sales</dt><dd>{formatMoney(60_000)}</dd></div><div><dt>Old Gold Purchase</dt><dd>{formatMoney(30_000)}</dd></div><div><dt>Other Collections</dt><dd>{formatMoney(addedIn)}</dd></div><div className={styles.greenTotal}><dt>Total Collection</dt><dd>{formatMoney(totalCollection)}</dd></div></dl></Card>
        <Card className={styles.breakdown}><h2>Cash Summary</h2><dl><div><dt>Opening Cash</dt><dd>{formatMoney(openingCash)}</dd></div><div><dt>Total Cash In</dt><dd className={styles.greenText}>{formatMoney(totalCollection)}</dd></div><div><dt>Total Cash Out</dt><dd className={styles.redText}>{formatMoney(totalExpense)}</dd></div><div className={styles.blueTotal}><dt>Net Closing Cash</dt><dd>{formatMoney(closingCash)}</dd></div></dl></Card>
        <Card className={styles.breakdown}><h2>Expense Summary</h2><dl><div><dt>Purchase Payment</dt><dd>{formatMoney(45_000)}</dd></div><div><dt>Wages</dt><dd>{formatMoney(12_500)}</dd></div><div><dt>Rent</dt><dd>{formatMoney(15_000)}</dd></div><div><dt>Utilities</dt><dd>{formatMoney(9_850 + addedOut)}</dd></div><div className={styles.redTotal}><dt>Total Expense</dt><dd>{formatMoney(totalExpense)}</dd></div></dl></Card>
      </section>

      <Card className={styles.checklistCard}><section><h2>Daily Closing Checklist</h2><div className={styles.checklist}>{checklist.map((item, index) => <label key={item}><input checked={checks[index]} onChange={() => setChecks((current) => current.map((value, position) => position === index ? !value : value))} type="checkbox" /><CheckCircle2 size={15} />{item}</label>)}</div></section><label className={styles.notes}><span>Notes (Optional)</span><textarea className="textarea" onChange={(event) => setNotes(event.target.value)} placeholder="Enter any closing notes here..." value={notes} /></label></Card>
      <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
      <button className={styles.confirmButton} onClick={confirmClosing} type="button"><CheckCircle2 size={18} />Confirm Daily Closing</button>
    </div>
  );
}

