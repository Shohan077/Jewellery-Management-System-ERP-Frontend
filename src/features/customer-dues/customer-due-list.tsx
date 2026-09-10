"use client";

import { Eye, FilePenLine, Filter, Plus, Search, WalletCards, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { dueCustomers, formatDueCurrency, type DueCustomer, type DueStatus } from "./customer-due-data";
import tableStyles from "../management-lists/table-list.module.css";
import styles from "./customer-due-list.module.css";

const branches = ["All Branches", "Main Branch", "Uttara Branch", "Chittagong Branch", "Sylhet Branch", "Khulna Branch"] as const;
const statuses = ["All Status", "Overdue", "Due", "Paid"] as const;

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function DueBadge({ status }: { status: DueStatus }) {
  const className = status === "Paid" ? styles.paidStatus : status === "Overdue" ? styles.overdueStatus : styles.dueStatus;
  return <span className={className}>{status}</span>;
}

export function CustomerDueList() {
  const [records, setRecords] = useState<DueCustomer[]>(dueCustomers);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [branch, setBranch] = useState<(typeof branches)[number]>("All Branches");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionCustomerId, setCollectionCustomerId] = useState("C-000125");
  const [collectionAmount, setCollectionAmount] = useState("10000");
  const [totalCollected, setTotalCollected] = useState(0);
  const [overdueCollected, setOverdueCollected] = useState(0);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((customer) => {
      const matchesQuery = !search || customer.name.toLowerCase().includes(search) || customer.customerId.toLowerCase().includes(search);
      return matchesQuery && (branch === "All Branches" || customer.branch === branch) && (status === "All Status" || customer.status === status);
    });
  }, [branch, deferredQuery, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * 10, safePage * 10);
  const first = filtered.length ? (safePage - 1) * 10 + 1 : 0;
  const last = Math.min(safePage * 10, filtered.length);
  const selectedCustomer = records.find((customer) => customer.customerId === collectionCustomerId) ?? records[0];

  function openCollection(customer?: DueCustomer) {
    const target = customer?.dueAmount ? customer : records.find((record) => record.dueAmount > 0) ?? records[0];
    setCollectionCustomerId(target.customerId);
    setCollectionAmount(String(Math.min(10_000, target.dueAmount)));
    setCollectionOpen(true);
  }

  function recordCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Math.min(selectedCustomer.dueAmount, Math.max(0, Number.parseFloat(collectionAmount) || 0));
    if (amount <= 0) return;
    const wasOverdue = selectedCustomer.status === "Overdue";
    setRecords((current) => current.map((customer) => {
      if (customer.id !== selectedCustomer.id) return customer;
      const dueAmount = Math.max(0, customer.dueAmount - amount);
      return { ...customer, totalPaid: customer.totalPaid + amount, dueAmount, status: dueAmount === 0 ? "Paid" : "Due" };
    }));
    setTotalCollected((current) => current + amount);
    if (wasOverdue) setOverdueCollected((current) => current + amount);
    setCollectionOpen(false);
    setMessage(`${formatDueCurrency(amount)} collected from ${selectedCustomer.name}.`);
  }

  return (
    <div className={tableStyles.page}>
      <PageHeader action={<button className="button button--primary" onClick={() => openCollection()} type="button"><Plus size={16} />Record Collection</button>} description="View and manage customer dues and collections" title="Customer Due List" />
      <section aria-label="Customer due overview" className={styles.metrics}>
        <Card className={styles.metric}><p>Total Receivable</p><strong className={styles.receivable}>{formatDueCurrency(1_845_600 - totalCollected)}</strong></Card>
        <Card className={styles.metric}><p>Overdue Amount</p><strong className={styles.overdue}>{formatDueCurrency(624_300 - overdueCollected)}</strong></Card>
        <Card className={styles.metric}><p>Active Customers</p><strong>142</strong></Card>
        <Card className={styles.metric}><p>Total Customers</p><strong className={styles.customers}>1,983</strong></Card>
      </section>
      <div className={styles.toolbar}>
        <label className={tableStyles.search}><Search size={17} /><span className="sr-only">Search customer dues</span><input onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search by name, phone or customer ID..." type="search" value={query} /></label>
        <select aria-label="Filter dues by branch" className="select" onChange={(event) => { setBranch(event.target.value as typeof branch); setCurrentPage(1); }} value={branch}>{branches.map((option) => <option key={option}>{option}</option>)}</select>
        <select aria-label="Filter dues by status" className="select" onChange={(event) => { setStatus(event.target.value as typeof status); setCurrentPage(1); }} value={status}>{statuses.map((option) => <option key={option}>{option}</option>)}</select>
        <button className={`button ${styles.filterButton}`} onClick={() => setMessage(`${filtered.length} customers match the selected filters.`)} type="button"><Filter size={16} />Filter</button>
      </div>
      <Card className={tableStyles.card}>
        <p aria-live="polite" className={message ? tableStyles.message : "sr-only"}>{message}</p>
        <div className={tableStyles.tableScroller}><table className={tableStyles.table}><caption className="sr-only">Customers with payment balances</caption><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Customer ID</th><th scope="col">Total Purchase</th><th scope="col">Total Paid</th><th scope="col">Due Amount</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>
          {rows.map((customer, index) => <tr key={customer.id}><td>{first + index}</td><td><span className={styles.identity}><span className={styles.avatar}>{customer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><strong>{customer.name}</strong></span></td><td className={tableStyles.code}>{customer.customerId}</td><td>{formatDueCurrency(customer.totalPurchase)}</td><td>{formatDueCurrency(customer.totalPaid)}</td><td><strong>{formatDueCurrency(customer.dueAmount)}</strong></td><td><DueBadge status={customer.status} /></td><td><div className={tableStyles.menuActions}><button aria-label={`View ${customer.name}`} onClick={() => setMessage(`Viewing due ledger for ${customer.name}.`)} title="View ledger" type="button"><Eye size={15} /></button><button aria-label={`Edit ${customer.name}`} onClick={() => setMessage(`Editing collection details for ${customer.name}.`)} title="Edit customer due" type="button"><FilePenLine size={15} /></button><button aria-label={`Record collection from ${customer.name}`} disabled={customer.dueAmount === 0} onClick={() => openCollection(customer)} title="Record collection" type="button"><Plus size={15} /></button></div></td></tr>)}
          {rows.length === 0 ? <tr><td className={tableStyles.empty} colSpan={8}>No customer dues match the current filters.</td></tr> : null}
        </tbody></table></div>
      </Card>
      <footer className={tableStyles.footer}><p>Showing {first} to {last} of {filtered.length} customers</p><nav aria-label="Customer due pagination" className={tableStyles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">«</button>{paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span className={tableStyles.ellipsis} key={`e-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? tableStyles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">»</button></nav></footer>

      {collectionOpen ? <div className={tableStyles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setCollectionOpen(false); }}><Card aria-labelledby="collection-title" aria-modal="true" as="section" className={tableStyles.modal} role="dialog"><div className={tableStyles.modalHeader}><div><h2 id="collection-title">Record Collection</h2><p>Apply a payment to a customer&apos;s outstanding balance.</p></div><button aria-label="Close collection dialog" className={tableStyles.closeButton} onClick={() => setCollectionOpen(false)} type="button"><X size={19} /></button></div><form className={tableStyles.modalForm} onSubmit={recordCollection}><label><span>Customer</span><select className="select" onChange={(event) => { setCollectionCustomerId(event.target.value); const next = records.find((record) => record.customerId === event.target.value); setCollectionAmount(String(Math.min(10_000, next?.dueAmount ?? 0))); }} value={collectionCustomerId}>{records.filter((customer) => customer.dueAmount > 0).map((customer) => <option key={customer.id} value={customer.customerId}>{customer.name} — {formatDueCurrency(customer.dueAmount)} due</option>)}</select></label><p className={styles.collectionNote}>Available due: {formatDueCurrency(selectedCustomer.dueAmount)}</p><label><span>Collection Amount</span><input className="field" max={selectedCustomer.dueAmount} min="1" onChange={(event) => setCollectionAmount(event.target.value)} required type="number" value={collectionAmount} /></label><div className={tableStyles.modalActions}><button className="button" onClick={() => setCollectionOpen(false)} type="button">Cancel</button><button className="button button--primary" type="submit"><WalletCards size={15} />Record Payment</button></div></form></Card></div> : null}
    </div>
  );
}
