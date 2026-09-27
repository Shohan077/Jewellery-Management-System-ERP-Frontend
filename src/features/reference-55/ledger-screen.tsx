"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Eye, Filter, RotateCcw, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ledgerTransactions, type LedgerTransaction } from "./data";
import { DataTable, Feedback, IconAction, type TableColumn } from "./shared";
import styles from "./reference-55.module.css";

export function Reference55Ledger() {
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [branch, setBranch] = useState("All Branches");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const normalized = appliedQuery.trim().toLowerCase();
    if (!normalized) return ledgerTransactions;
    return ledgerTransactions.filter((row) => [row.date, row.voucher, row.particulars, row.paymentMode].some((value) => value.toLowerCase().includes(normalized)));
  }, [appliedQuery]);

  function filterLedger(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedQuery(query);
    setPage(1);
    setMessage(`Ledger updated for ${branch} (${dateRange}).`);
  }

  function resetLedger() {
    setDateRange("01/05/2025 - 31/05/2025");
    setBranch("All Branches");
    setQuery("");
    setAppliedQuery("");
    setPage(1);
    setMessage("Ledger filters reset.");
  }

  const columns: readonly TableColumn<LedgerTransaction>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "date", label: "Date", render: (row) => row.date },
    { key: "voucher", label: "Voucher No", render: (row) => <strong>{row.voucher}</strong> },
    { key: "particulars", label: "Particulars", render: (row) => row.particulars },
    { key: "debit", label: "Debit (৳)", align: "right", render: (row) => row.debit },
    { key: "credit", label: "Credit (৳)", align: "right", render: (row) => row.credit },
    { key: "balance", label: "Balance (৳)", align: "right", render: (row) => <strong>{row.balance}</strong> },
    { key: "mode", label: "Payment Mode", align: "center", render: (row) => row.paymentMode },
    { key: "action", label: "Action", align: "center", render: (row) => <IconAction label={`View ${row.voucher}`} onClick={() => setMessage(`${row.voucher}: ${row.particulars}, balance ${row.balance}.`)}><Eye size={12} /></IconAction> },
  ];

  return (
    <div className={styles.page}>
      <section aria-label="Customer ledger summary" className={styles.customerOverview}>
        <Card as="article" className={styles.customerCard}><span className={styles.customerAvatar}>C</span><span className={styles.customerCopy}><strong>Customer: Rahim Uddin</strong><span>Contact: 01712-345678</span><span>Group: Regular Customer</span></span></Card>
        <Card as="article" className={styles.compactStat}><small>Opening Balance</small><strong>৳ 15,000</strong></Card>
        <Card as="article" className={`${styles.compactStat} ${styles.compactStatGreen}`}><small>Total Debit</small><strong>৳ 2,45,300</strong></Card>
        <Card as="article" className={`${styles.compactStat} ${styles.compactStatOrange}`}><small>Total Credit</small><strong>৳ 2,20,300</strong></Card>
        <Card as="article" className={`${styles.compactStat} ${styles.compactStatViolet}`}><small>Closing Balance</small><strong>৳ 40,000</strong></Card>
      </section>

      <Card as="form" className={`${styles.filterBar} ${styles.ledgerFilters}`} onSubmit={filterLedger}>
        <label><span>Date Range</span><span className={styles.dateInput}><input onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays size={13} /></span></label>
        <label><span>Branch</span><select onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branches</option><option>Head Office</option><option>Uttara Branch</option></select></label>
        <label><span className="sr-only">Search transactions</span><span className={styles.searchInput}><input aria-label="Search transactions" onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions..." type="search" value={query} /><Search size={13} /></span></label>
        <button className={styles.primaryButton} type="submit"><Filter size={12} />Filter</button>
        <button className={styles.secondaryButton} onClick={resetLedger} type="button"><RotateCcw size={12} />Reset</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}

      <DataTable
        columns={columns}
        currentPage={page}
        footer={`Showing 1 to ${rows.length} of 8 entries`}
        minWidth={940}
        onPageChange={setPage}
        pageCount={1}
        rowKey={(row) => row.id}
        rows={rows}
        summaryRow={<tr><td colSpan={4}>Total</td><td className={styles.right}>3,35,300</td><td className={styles.right}>3,10,300</td><td className={styles.right}>40,000 Dr</td><td colSpan={2} /></tr>}
        title="Ledger Transactions"
        total={8}
      />
    </div>
  );
}
