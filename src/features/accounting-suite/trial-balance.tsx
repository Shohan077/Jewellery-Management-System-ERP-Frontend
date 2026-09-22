"use client";

import { CheckCircle2, Download, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import { downloadAccountingCsv, formatAccountingMoney, trialBalanceRows } from "./accounting-data";
import styles from "./accounting-suite.module.css";

const PAGE_SIZE = 8;
const allTrialRows = [
  ...trialBalanceRows,
  ...Array.from({ length: 78 }, (_, index) => {
    const amount = (index + 1) * 12_500;
    return {
      code: String(7001 + index),
      name: `Operating Account ${index + 1}`,
      opening: index % 3 === 0 ? amount / 2 : 0,
      debit: index % 2 === 0 ? amount : amount / 4,
      credit: index % 2 === 0 ? amount / 4 : amount,
      closing: index % 3 === 0 ? amount * .75 : amount,
    };
  }),
];

export function TrialBalance() {
  const [from, setFrom] = useState("2025-04-01");
  const [to, setTo] = useState("2025-04-30");
  const [branch, setBranch] = useState("Main Branch");
  const [reportType, setReportType] = useState("Exclude Zero Balance");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(allTrialRows.length / PAGE_SIZE);
  const visibleRows = allTrialRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from > to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setPage(1);
    setMessage(`${reportType} report generated for ${branch}.`);
  }

  function exportReport() {
    downloadAccountingCsv("trial-balance-april-2025.csv", [["Account Code", "Account Name", "Opening", "Debit", "Credit", "Closing"], ...allTrialRows.map((row) => [row.code, row.name, row.opening, row.debit, row.credit, row.closing])]);
    setMessage("Trial balance exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Trial Balance</h1><p>View trial balance of all accounts.</p></header>
      <Card as="form" className={`${styles.filters} ${styles.trialFilters}`} onSubmit={search}><label><span>From Date <b>*</b></span><input className="field" max={to} onChange={(event) => setFrom(event.target.value)} type="date" value={from} /></label><label><span>To Date <b>*</b></span><input className="field" min={from} onChange={(event) => setTo(event.target.value)} type="date" value={to} /></label><label><span>Branch</span><select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}><option>Main Branch</option><option>Uttara Branch</option><option>Chittagong Branch</option></select></label><label><span>Report Type</span><select className="select" onChange={(event) => setReportType(event.target.value)} value={reportType}><option>Exclude Zero Balance</option><option>Include Zero Balance</option></select></label><button className={styles.primaryButton} type="submit"><Search size={15} />Search</button><button className={styles.outlineButton} onClick={exportReport} type="button"><Download size={15} />Export</button></Card>
      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
      <section className={styles.metrics}><Card><span>Total Accounts</span><strong className={styles.green}>86</strong></Card><Card><span>Total Debit</span><strong className={styles.blue}>₹ 45,78,250.00</strong></Card><Card><span>Total Credit</span><strong className={styles.red}>₹ 45,78,250.00</strong></Card><Card><span>Difference</span><strong className={styles.green}>₹ 0.00</strong><small><CheckCircle2 size={13} />Balanced</small></Card></section>
      <Card className={styles.tableCard}><div className={styles.tableScroller}><table className={`${styles.table} ${styles.trialTable}`}><caption className="sr-only">Trial balance accounts</caption><thead><tr><th>Account Code</th><th>Account Name</th><th>Opening (₹)</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Closing (₹)</th></tr></thead><tbody>{visibleRows.map((row) => <tr key={row.code}><td>{row.code}</td><td>{row.name}</td><td>{row.opening ? formatAccountingMoney(row.opening).replace("₹ ", "") : "-"}</td><td>{row.debit ? formatAccountingMoney(row.debit).replace("₹ ", "") : "-"}</td><td>{row.credit ? formatAccountingMoney(row.credit).replace("₹ ", "") : "-"}</td><td>{formatAccountingMoney(row.closing).replace("₹ ", "")}</td></tr>)}</tbody><tfoot><tr><th colSpan={2}>Total</th><th>34,35,400.00</th><th>1,17,40,750.00</th><th>1,17,40,750.00</th><th>34,35,400.00</th></tr></tfoot></table></div><footer className={styles.tableFooter}><span>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, allTrialRows.length)} of {allTrialRows.length} entries</span><nav aria-label="Trial balance pages"><button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">‹</button>{[1, 2, 3, 4, 5].map((number) => <button aria-current={page === number ? "page" : undefined} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}<button disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button">›</button></nav></footer></Card>
    </div>
  );
}
