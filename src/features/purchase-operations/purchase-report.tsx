"use client";

import { ChevronDown, Download, Eye, FileDown, PackageCheck, RotateCcw, Search, WalletCards } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OperationDialog } from "./operation-dialog";
import { formatCurrency, formatDate, purchaseReportRows, supplierOptions, type PurchaseReportRow } from "./purchase-operations-data";
import styles from "./purchase-operations.module.css";

type ReportFilters = {
  fromDate: string;
  toDate: string;
  supplier: string;
  category: string;
};

const initialFilters: ReportFilters = {
  fromDate: "2025-04-01",
  toDate: "2025-04-20",
  supplier: "All Suppliers",
  category: "All Categories",
};

const categories = ["All Categories", "Gold Jewellery", "Diamond", "Raw Material"];

function createReportCsv(rows: PurchaseReportRow[]) {
  const headings = ["Date", "Purchase No", "Supplier", "Category", "Total Amount", "Return", "Net Amount", "Due"];
  return [
    headings,
    ...rows.map((row) => [formatDate(row.date), row.purchaseNo, row.supplier, row.category, row.totalAmount, row.returnAmount, row.totalAmount - row.returnAmount, row.dueAmount]),
  ].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function PurchaseReport() {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedRow, setSelectedRow] = useState<PurchaseReportRow | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => purchaseReportRows.filter((row) => (
    row.date >= filters.fromDate
    && row.date <= filters.toDate
    && (filters.supplier === "All Suppliers" || row.supplier === filters.supplier)
    && (filters.category === "All Categories" || row.category === filters.category)
  )), [filters]);

  const totals = useMemo(() => rows.reduce((summary, row) => ({
    purchase: summary.purchase + row.totalAmount,
    returned: summary.returned + row.returnAmount,
    due: summary.due + row.dueAmount,
  }), { purchase: 0, returned: 0, due: 0 }), [rows]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage("Purchase report filters applied.");
  }

  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([createReportCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "purchase-report-april-2025.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    setMessage("Purchase report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.exportWrap}>
            <button aria-expanded={exportOpen} aria-haspopup="menu" className={`button ${styles.primaryButton}`} onClick={() => setExportOpen((value) => !value)} type="button"><Download aria-hidden="true" size={16} />Export<ChevronDown aria-hidden="true" size={14} /></button>
            {exportOpen ? <div className={styles.exportMenu} role="menu"><button onClick={downloadCsv} role="menuitem" type="button">Export CSV</button><button onClick={() => { window.print(); setExportOpen(false); }} role="menuitem" type="button">Print / Save PDF</button></div> : null}
          </div>
        )}
        description="Review purchases, returns, net value, and outstanding supplier dues"
        title="Purchase Report"
      />

      <Card as="form" className={styles.filterCard} onSubmit={applyFilters}>
        <div className={styles.filterBar}>
          <label className={styles.fieldLabel}><span>From Date</span><input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label className={styles.fieldLabel}><span>To Date</span><input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label className={styles.fieldLabel}><span>Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All Suppliers</option>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <label className={styles.fieldLabel}><span>Item Category</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))} value={draftFilters.category}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <button className={`button ${styles.primaryButton} ${styles.searchButton}`} type="submit"><Search aria-hidden="true" size={16} />Search</button>
        </div>
      </Card>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <section aria-label="Purchase report totals" className={styles.metrics}>
        <Card as="article" className={styles.metricCard}><span className={styles.metricIcon}><PackageCheck aria-hidden="true" size={19} /></span><div><span>Total Purchase</span><strong>{formatCurrency(totals.purchase)}</strong><small>{rows.length === 6 ? "From 12 invoices" : `From ${rows.length} records`}</small></div></Card>
        <Card as="article" className={styles.metricCard}><span className={styles.metricIcon}><RotateCcw aria-hidden="true" size={19} /></span><div><span>Total Return</span><strong>{formatCurrency(totals.returned)}</strong><small>{rows.length === 6 ? "From 2 returns" : "For matching records"}</small></div></Card>
        <Card as="article" className={styles.metricCard}><span className={styles.metricIcon}><FileDown aria-hidden="true" size={19} /></span><div><span>Net Purchase</span><strong>{formatCurrency(totals.purchase - totals.returned)}</strong><small>After returns</small></div></Card>
        <Card as="article" className={styles.metricCard}><span className={styles.metricIcon}><WalletCards aria-hidden="true" size={19} /></span><div><span>Total Due</span><strong>{formatCurrency(totals.due)}</strong><small>Outstanding balance</small></div></Card>
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Purchase report for the selected period</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Date</th><th scope="col">Purchase No</th><th scope="col">Supplier Name</th><th scope="col">Total Amount (৳)</th><th scope="col">Return (৳)</th><th scope="col">Net Amount (৳)</th><th scope="col">Due (৳)</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((row, index) => <tr key={row.purchaseNo}><td>{index + 1}</td><td>{formatDate(row.date)}</td><td className={styles.numberLink}>{row.purchaseNo}</td><td>{row.supplier}</td><td>{formatCurrency(row.totalAmount)}</td><td>{formatCurrency(row.returnAmount)}</td><td>{formatCurrency(row.totalAmount - row.returnAmount)}</td><td className={row.dueAmount ? styles.due : undefined}>{formatCurrency(row.dueAmount)}</td><td><button aria-label={`View ${row.purchaseNo}`} className={styles.iconButton} onClick={() => setSelectedRow(row)} type="button"><Eye aria-hidden="true" size={16} /></button></td></tr>)}
              {!rows.length ? <tr><td className={styles.emptyState} colSpan={9}>No purchase records match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><p>Showing 1 to {rows.length} of {rows.length} entries</p><nav aria-label="Purchase report pagination" className={styles.pagination}><button disabled type="button">Previous</button><button aria-current="page" className={styles.currentPage} type="button">1</button><button disabled type="button">Next</button></nav></footer>
      </Card>

      {selectedRow ? <OperationDialog description={`Purchase from ${selectedRow.supplier}`} onClose={() => setSelectedRow(null)} title={selectedRow.purchaseNo}><dl className={styles.details}><div><dt>Date</dt><dd>{formatDate(selectedRow.date)}</dd></div><div><dt>Category</dt><dd>{selectedRow.category}</dd></div><div><dt>Total Purchase</dt><dd>{formatCurrency(selectedRow.totalAmount)}</dd></div><div><dt>Return</dt><dd>{formatCurrency(selectedRow.returnAmount)}</dd></div><div><dt>Net Amount</dt><dd>{formatCurrency(selectedRow.totalAmount - selectedRow.returnAmount)}</dd></div><div><dt>Due</dt><dd>{formatCurrency(selectedRow.dueAmount)}</dd></div></dl><footer className={styles.viewActions}><button className="button" onClick={() => setSelectedRow(null)} type="button">Close</button></footer></OperationDialog> : null}
    </div>
  );
}
