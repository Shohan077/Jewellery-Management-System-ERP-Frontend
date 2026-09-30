"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Filter, ReceiptText, RotateCcw, Search } from "lucide-react";
import { Button, PageHeader, Pager } from "../reference-78/shared";
import base from "../reference-78/reference-78.module.css";
import styles from "./customer-dues.module.css";

type DueStatus = "Partial" | "Overdue";
type CustomerType = "Regular" | "VIP";

type DueCustomer = {
  code: string;
  name: string;
  phone: string;
  type: CustomerType;
  due: number;
  overdue: number;
  lastSale: string;
  status: DueStatus;
};

const dueCustomers: DueCustomer[] = [
  { code: "CUS-0002", name: "Rahim Hossain", phone: "01711-223344", type: "Regular", due: 158750, overdue: 56750, lastSale: "28 May 2025", status: "Partial" },
  { code: "CUS-0006", name: "Mizanur Rahman", phone: "01620-123456", type: "VIP", due: 245300, overdue: 110300, lastSale: "25 May 2025", status: "Overdue" },
  { code: "CUS-0003", name: "Abul Kalam", phone: "01819-445566", type: "Regular", due: 45200, overdue: 0, lastSale: "20 May 2025", status: "Partial" },
  { code: "CUS-0005", name: "Mst. Jannatul", phone: "01733-998877", type: "Regular", due: 12600, overdue: 0, lastSale: "18 May 2025", status: "Partial" },
  { code: "CUS-0008", name: "Sakib Ahmed", phone: "01786-665544", type: "Regular", due: 36850, overdue: 0, lastSale: "15 May 2025", status: "Partial" },
  { code: "CUS-0009", name: "Fahim Uddin", phone: "01924-771122", type: "Regular", due: 85600, overdue: 45600, lastSale: "10 Apr 2025", status: "Overdue" },
  { code: "CUS-0011", name: "Tamanna Akter", phone: "01851-224466", type: "VIP", due: 22300, overdue: 0, lastSale: "05 May 2025", status: "Partial" },
  { code: "CUS-0012", name: "Nusrat Jahan", phone: "01792-336699", type: "Regular", due: 18850, overdue: 0, lastSale: "02 May 2025", status: "Partial" },
];

const money = (value: number) => value.toLocaleString("en-IN");

export function Reference80CustomerDueList() {
  const [query, setQuery] = useState("");
  const [customerType, setCustomerType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [applied, setApplied] = useState({ query: "", customerType: "All Types", status: "All Status" });
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => dueCustomers.filter((customer) => {
    const textMatch = `${customer.code} ${customer.name} ${customer.phone}`.toLowerCase().includes(applied.query.toLowerCase());
    const typeMatch = applied.customerType === "All Types" || customer.type === applied.customerType;
    const statusMatch = applied.status === "All Status" || customer.status === applied.status;
    return textMatch && typeMatch && statusMatch;
  }), [applied]);

  const applyFilters = () => {
    setApplied({ query, customerType, status });
    setPage(1);
    setMessage("");
  };

  const resetFilters = () => {
    setQuery("");
    setCustomerType("All Types");
    setStatus("All Status");
    setApplied({ query: "", customerType: "All Types", status: "All Status" });
    setPage(1);
    setMessage("");
  };

  return (
    <main className={base.page}>
      <PageHeader crumbs={["Customers", "Customer Due List"]} title="Customer Due List" />

      <section className={styles.filters}>
        <label className={styles.searchWrap}>
          <span>Search Customer</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") applyFilters(); }}
            placeholder="Search by name, phone..."
            value={query}
          />
          <i aria-hidden="true" className={styles.searchIcon}><Search size={13} /></i>
        </label>
        <label><span>Customer Type</span><select onChange={(event) => setCustomerType(event.target.value)} value={customerType}><option>All Types</option><option>Regular</option><option>VIP</option></select></label>
        <label><span>Status</span><select onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Partial</option><option>Overdue</option></select></label>
        <Button onClick={applyFilters} tone="primary"><Filter size={13} />Filter</Button>
        <Button onClick={resetFilters}><RotateCcw size={13} />Reset</Button>
      </section>

      <section className={base.metrics}>
        <article className={`${base.metric} ${styles.summaryMetric}`}><span>Total Customers</span><strong>42</strong><small>All Customers</small></article>
        <article className={`${base.metric} ${styles.summaryMetric} ${styles.summaryMetricRed}`}><span>Total Due Amount</span><strong>৳ 12,85,450</strong><small>All Outstanding</small></article>
        <article className={`${base.metric} ${styles.summaryMetric} ${styles.summaryMetricOrange}`}><span>Overdue Amount</span><strong>৳ 3,45,300</strong><small>Overdue Outstanding</small></article>
        <article className={`${base.metric} ${styles.summaryMetric} ${styles.summaryMetricGreen}`}><span>Today Collection</span><strong>৳ 85,600</strong><small>Today Received</small></article>
      </section>

      <section className={base.panel}>
        <div className={base.tableWrap}>
          <table className={`${base.table} ${styles.dueTable}`}>
            <thead><tr><th>#</th><th>Customer Code</th><th>Customer Name</th><th>Due Amount (৳)</th><th>Overdue Amount (৳)</th><th>Last Sale Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((customer, index) => (
                <tr key={customer.code}>
                  <td>{index + 1}</td>
                  <td>{customer.code}</td>
                  <td>{customer.name}</td>
                  <td className={styles.money}>{money(customer.due)}</td>
                  <td className={styles.money}>{money(customer.overdue)}</td>
                  <td>{customer.lastSale}</td>
                  <td><span className={`${styles.status} ${customer.status === "Overdue" ? styles.overdue : styles.partial}`}>{customer.status}</span></td>
                  <td><div className={base.actions}><Link aria-label={`View ${customer.name}`} className={base.iconButton} href="/customers/details-80"><Eye size={13} /></Link><button aria-label={`Receive payment from ${customer.name}`} className={`${base.iconButton} ${styles.paymentButton}`} onClick={() => setMessage(`Payment entry opened for ${customer.name}.`)}><ReceiptText size={13} /></button></div></td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.emptyState} colSpan={8}>No customers match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={base.tableFooter}>
          <span>Showing {rows.length ? 1 : 0} to {rows.length} of {applied.query || applied.customerType !== "All Types" || applied.status !== "All Status" ? rows.length : 18} entries</span>
          <div className={styles.footerTools}><Pager current={page} onChange={setPage} pages={3} /><select aria-label="Rows per page" className={styles.pageSelect} defaultValue="10"><option>10 / page</option><option>25 / page</option></select></div>
        </footer>
      </section>
      <p aria-live="polite" className={base.feedback}>{message}</p>
    </main>
  );
}
