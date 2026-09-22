"use client";

import { Download, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import { accountInformation, accountLedgerRows, accountOptions, downloadAccountingCsv, formatAccountingDate, formatAccountingMoney } from "./accounting-data";
import styles from "./accounting-suite.module.css";

type Filters = { account: string; from: string; to: string };
const defaults: Filters = { account: accountOptions[0], from: "2025-04-01", to: "2025-04-30" };

export function AccountLedger() {
  const [draft, setDraft] = useState<Filters>(defaults);
  const [filters, setFilters] = useState<Filters>(defaults);
  const [message, setMessage] = useState("");
  const rows = accountLedgerRows.filter((row) => row.date >= filters.from && row.date <= filters.to);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.from > draft.to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draft });
    setMessage(`Ledger updated for ${draft.account}.`);
  }

  function exportLedger() {
    downloadAccountingCsv("account-ledger-april-2025.csv", [["Date", "Voucher No", "Particulars", "Debit", "Credit", "Balance"], ...rows.map((row) => [formatAccountingDate(row.date), row.voucher, row.particulars, row.debit, row.credit, row.balance])]);
    setMessage("Account ledger exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Account Ledger</h1><p>View and analyze account transactions in detail.</p></header>
      <Card as="form" className={styles.filters} onSubmit={search}>
        <label><span>Account <b>*</b></span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, account: event.target.value }))} value={draft.account}>{accountOptions.map((account) => <option key={account}>{account}</option>)}</select></label>
        <label><span>From Date <b>*</b></span><input className="field" max={draft.to} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} /></label>
        <label><span>To Date <b>*</b></span><input className="field" min={draft.from} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} /></label>
        <button className={styles.primaryButton} type="submit"><Search size={15} />Search</button><button className={styles.outlineButton} onClick={exportLedger} type="button"><Download size={15} />Export</button>
      </Card>
      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
      <section className={styles.metrics}><Card><span>Opening Balance</span><strong className={styles.green}>₹ 5,85,000.00</strong></Card><Card><span>Total Debit</span><strong className={styles.blue}>₹ 12,45,600.00</strong></Card><Card><span>Total Credit</span><strong className={styles.red}>₹ 13,36,600.00</strong></Card><Card><span>Closing Balance</span><strong className={styles.purple}>₹ 6,70,000.00</strong></Card></section>
      <section className={styles.ledgerLayout}>
        <Card className={styles.tableCard}><div className={styles.tableScroller}><table className={styles.table}><caption className="sr-only">Account ledger transactions</caption><thead><tr><th>Date</th><th>Voucher No.</th><th>Particulars</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Balance (₹)</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{formatAccountingDate(row.date)}</td><td>{row.voucher}</td><td>{row.particulars}</td><td>{row.debit ? formatAccountingMoney(row.debit).replace("₹ ", "") : "-"}</td><td>{row.credit ? formatAccountingMoney(row.credit).replace("₹ ", "") : "-"}</td><td>{formatAccountingMoney(row.balance).replace("₹ ", "")}</td></tr>)}</tbody></table></div><footer className={styles.tableFooter}><span>Showing 1 to {rows.length} of {rows.length} entries</span><nav aria-label="Ledger pages"><button disabled type="button">‹</button><button aria-current="page" type="button">1</button><button disabled type="button">2</button><button disabled type="button">›</button></nav></footer></Card>
        <Card className={styles.accountInfo}><h2>Account Information</h2><dl><div><dt>Account Name</dt><dd>{accountInformation.name}</dd></div><div><dt>Account Type</dt><dd>{accountInformation.type}</dd></div><div><dt>Account Number</dt><dd>{accountInformation.number}</dd></div><div><dt>IFSC Code</dt><dd>{accountInformation.ifsc}</dd></div><div><dt>Branch</dt><dd>{accountInformation.branch}</dd></div><div><dt>Status</dt><dd><span>{accountInformation.status}</span></dd></div><div><dt>Last Reconciled</dt><dd>{accountInformation.reconciled}</dd></div></dl></Card>
      </section>
    </div>
  );
}
