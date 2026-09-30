"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, BookOpen, CreditCard, Eye, Filter, Pencil, Plus, RotateCcw, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Button, Modal, PageHeader, Pager, Status } from "../reference-78/shared";
import base from "../reference-78/reference-78.module.css";
import { reference80Customers, reference80PurchaseHistory, type Customer } from "./customer-data";
import styles from "./reference-80.module.css";

function CustomerActions({ customer, onEdit, onDelete }: { customer: Customer; onEdit: () => void; onDelete: () => void }) {
  return <div className={base.actions}>
    <Link aria-label={`View ${customer.name}`} className={base.iconButton} href="/customers/details-80"><Eye size={13} /></Link>
    <button aria-label={`Edit ${customer.name}`} className={base.iconButton} onClick={onEdit}><Pencil size={13} /></button>
    <button aria-label={`Delete ${customer.name}`} className={`${base.iconButton} ${base.dangerIcon}`} onClick={onDelete}><Trash2 size={13} /></button>
  </div>;
}

export function Reference80CustomerList() {
  const [rows, setRows] = useState<Customer[]>(reference80Customers);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => rows.filter((customer) => {
    const queryMatch = `${customer.code} ${customer.name} ${customer.phone}`.toLowerCase().includes(query.toLowerCase());
    return queryMatch && (type === "All Types" || customer.type === type) && (status === "All Status" || customer.status === status);
  }), [query, rows, status, type]);

  function addCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRows((current) => [{
      code: `CUS-${String(current.length + 1).padStart(4, "0")}`,
      name: String(data.get("name")),
      phone: String(data.get("phone")),
      type: String(data.get("type")) as Customer["type"],
      due: "0",
      status: "Active",
    }, ...current]);
    setAddOpen(false);
    setMessage("Customer added successfully.");
  }

  function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editCustomer) return;
    const data = new FormData(event.currentTarget);
    setRows((current) => current.map((customer) => customer.code === editCustomer.code ? {
      ...customer,
      name: String(data.get("name")),
      phone: String(data.get("phone")),
      type: String(data.get("type")) as Customer["type"],
    } : customer));
    setEditCustomer(null);
    setMessage("Customer information updated.");
  }

  return <main className={base.page}>
    <PageHeader actions={<Button onClick={() => setAddOpen(true)} tone="primary"><Plus size={13} />Add New Customer</Button>} crumbs={["Customers", "Customer List"]} title="Customer List" />
    <section className={styles.filters}>
      <label className={styles.searchWrap}><span>Search Customer</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone..." value={query} /><i className={styles.searchIcon}><Search size={13} /></i></label>
      <label><span>Customer Type</span><select onChange={(event) => setType(event.target.value)} value={type}><option>All Types</option><option>Walk-in</option><option>Regular</option><option>VIP</option></select></label>
      <label><span>Status</span><select onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Active</option><option>Inactive</option></select></label>
      <Button onClick={() => setPage(1)} tone="primary"><Filter size={13} />Filter</Button>
      <Button onClick={() => { setQuery(""); setType("All Types"); setStatus("All Status"); setPage(1); }}><RotateCcw size={13} />Reset</Button>
    </section>
    <section className={base.panel}>
      <div className={base.tableWrap}><table className={`${base.table} ${styles.customerTable}`}><thead><tr><th>#</th><th>Customer Code</th><th>Customer Name</th><th>Phone</th><th>Customer Type</th><th>Due Amount (৳)</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((customer, index) => <tr key={customer.code}><td>{index + 1}</td><td>{customer.code}</td><td>{customer.name}</td><td>{customer.phone}</td><td>{customer.type}</td><td>{customer.due}</td><td><Status tone={customer.status === "Active" ? "active" : "inactive"}>{customer.status}</Status></td><td><CustomerActions customer={customer} onDelete={() => setDeleteCustomer(customer)} onEdit={() => setEditCustomer(customer)} /></td></tr>)}</tbody></table></div>
      <footer className={base.tableFooter}><span>Showing 1 to {filtered.length} of 42 entries</span><div className={styles.footerTools}><Pager current={page} onChange={setPage} pages={5} /><select aria-label="Rows per page" className={styles.pageSelect} defaultValue="10"><option>10 / page</option><option>25 / page</option></select></div></footer>
    </section>
    <p className={base.feedback}>{message}</p>
    {addOpen ? <Modal onClose={() => setAddOpen(false)} title="Add New Customer"><CustomerForm onCancel={() => setAddOpen(false)} onSubmit={addCustomer} submitLabel="Add Customer" /></Modal> : null}
    {editCustomer ? <Modal onClose={() => setEditCustomer(null)} title="Edit Customer"><CustomerForm customer={editCustomer} onCancel={() => setEditCustomer(null)} onSubmit={saveCustomer} submitLabel="Save Changes" /></Modal> : null}
    {deleteCustomer ? <Modal onClose={() => setDeleteCustomer(null)} title="Delete Customer"><div className={styles.confirmBody}><p>Remove <strong>{deleteCustomer.name}</strong> from the customer list?</p><div className={styles.confirmActions}><Button onClick={() => setDeleteCustomer(null)}>Cancel</Button><Button className={styles.dangerButton} onClick={() => { setRows((current) => current.filter((customer) => customer.code !== deleteCustomer.code)); setDeleteCustomer(null); setMessage("Customer removed."); }}>Delete</Button></div></div></Modal> : null}
  </main>;
}

function CustomerForm({ customer, onCancel, onSubmit, submitLabel }: { customer?: Customer; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; submitLabel: string }) {
  return <form className={base.modalForm} onSubmit={onSubmit}><label className={base.field}><span>Customer name</span><input defaultValue={customer?.name} name="name" required /></label><label className={base.field}><span>Phone</span><input defaultValue={customer?.phone === "—" ? "" : customer?.phone} name="phone" required /></label><label className={base.field}><span>Customer type</span><select defaultValue={customer?.type ?? "Regular"} name="type"><option>Walk-in</option><option>Regular</option><option>VIP</option></select></label><footer><Button onClick={onCancel}>Cancel</Button><Button tone="primary" type="submit">{submitLabel}</Button></footer></form>;
}

function CustomerAvatar() {
  return <div className={styles.avatar} aria-label="Rahim Hossain profile"><svg viewBox="0 0 100 100" role="img"><circle cx="50" cy="50" r="50" fill="#e7e9eb"/><circle cx="50" cy="33" r="15" fill="#e7b98d"/><path d="M35 29c2-18 28-18 30 0-6-6-24-6-30 0Z" fill="#24282d"/><path d="M28 82c1-23 11-33 22-33s21 10 22 33Z" fill="#162a3a"/><path d="m43 51 7 9 7-9-7 31Z" fill="#fff"/><path d="m48 61 2-3 2 3-2 15Z" fill="#1e69b5"/></svg></div>;
}

export function Reference80CustomerDetails() {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const customer = reference80Customers[1];
  return <main className={base.page}>
    <PageHeader actions={<><Link className={`${base.button} ${base.secondary}`} href="/customers/list-80"><ArrowLeft size={13} />Back to List</Link><Button onClick={() => setEditing(true)} tone="primary"><Pencil size={13} />Edit Customer</Button><Button className={styles.dangerButton} onClick={() => setDeleting(true)}><Trash2 size={13} />Delete Customer</Button></>} crumbs={["Customers", "Customer Details"]} title="Customer Details" />
    <section className={styles.detailsTop}>
      <article className={base.panel}><div className={styles.profileBody}><div className={styles.avatarColumn}><CustomerAvatar /></div><dl className={styles.customerDefinition}><dt>Customer Code</dt><dd>CUS-0002</dd><dt>Customer Name</dt><dd>Rahim Hossain</dd><dt>Customer Type</dt><dd>Regular</dd><dt>Phone</dt><dd>01711-223344</dd><dt>Email</dt><dd>rahimhossain@email.com</dd><dt>Address</dt><dd>House #12, Road #5<br />Dhanmondi, Dhaka-1205</dd><dt>Status</dt><dd><Status>Active</Status></dd><dt>Join Date</dt><dd>15 Jan 2025</dd></dl></div></article>
      <article className={base.panel}><h2 className={base.panelTitle}>Financial Summary</h2><div className={styles.financeBody}><dl className={styles.financeDefinition}><dt>Total Purchase (৳)</dt><dd>5,86,750</dd><dt>Total Payment (৳)</dt><dd>4,28,000</dd><dt>Total Return (৳)</dt><dd>35,000</dd><dt>Due Amount (৳)</dt><dd>1,58,750</dd><dt>Loyalty Points</dt><dd>120</dd><dt>Last Purchase</dt><dd>28 May 2025</dd></dl></div></article>
      <div className={styles.rightStack}><article className={base.panel}><h2 className={base.panelTitle}>Quick Actions</h2><div className={styles.quickActions}><Button onClick={() => setMessage("New POS sale opened.")} tone="success"><ShoppingCart size={13} />New Sale (POS)</Button><Button onClick={() => setMessage("New sales invoice opened.")} tone="primary"><BookOpen size={13} />New Sale Invoice</Button><Button onClick={() => setMessage("Receive payment opened.")} tone="purple"><CreditCard size={13} />Receive Payment</Button><Button onClick={() => setMessage("Customer ledger opened.")} tone="warning"><BookOpen size={13} />Customer Ledger</Button></div></article><article className={base.panel}><h2 className={base.panelTitle}>Notes</h2><div className={styles.notes}><p>{"Good customer.\nPrefers lightweight gold jewellery.\nRegular buyer.\n— Admin User"}</p></div></article></div>
    </section>
    <section className={base.panel}><h2 className={base.panelTitle}>Recent Purchase History</h2><div className={base.tableWrap}><table className={`${base.table} ${styles.historyTable}`}><thead><tr><th>Invoice No</th><th>Date</th><th>Total Amount (৳)</th><th>Paid (৳)</th><th>Due (৳)</th><th>Status</th><th>Action</th></tr></thead><tbody>{reference80PurchaseHistory.map((row) => <tr key={row[0]}><td><Link href="/sales/invoices">{row[0]}</Link></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><Status tone={row[5] === "Due" ? "inactive" : "partial"}>{row[5]}</Status></td><td><Link aria-label={`View ${row[0]}`} className={base.iconButton} href="/sales/invoices"><Eye size={13} /></Link></td></tr>)}</tbody></table></div><div className={styles.centerLink}><Link href="/sales/invoices">View All Purchases →</Link></div></section>
    <p className={base.feedback}>{message}</p>
    {editing ? <Modal onClose={() => setEditing(false)} title="Edit Customer"><CustomerForm customer={customer} onCancel={() => setEditing(false)} onSubmit={(event) => { event.preventDefault(); setEditing(false); setMessage("Customer information updated."); }} submitLabel="Save Changes" /></Modal> : null}
    {deleting ? <Modal onClose={() => setDeleting(false)} title="Delete Customer"><div className={styles.confirmBody}><p>Delete <strong>Rahim Hossain</strong>? This preview keeps the action safely local.</p><div className={styles.confirmActions}><Button onClick={() => setDeleting(false)}>Cancel</Button><Button className={styles.dangerButton} onClick={() => { setDeleting(false); setMessage("Deletion preview confirmed; no server data was changed."); }}>Confirm Delete</Button></div></div></Modal> : null}
  </main>;
}
