"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Eye, Filter, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button, Modal, PageHeader, Pager, Status } from "./shared";
import { suppliers as seedSuppliers, type Supplier } from "./supplier-data";
import styles from "./reference-78.module.css";

export function Reference78SupplierList() {
  const [rows, setRows] = useState<Supplier[]>([...seedSuppliers]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.code} ${row.name} ${row.contact} ${row.phone}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All" || row.status === status);
  }), [query, rows, status]);

  function addSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRows((current) => [{
      code: `SUP-${String(current.length + 1).padStart(4, "0")}`,
      name: String(data.get("name")), contact: String(data.get("contact")), phone: String(data.get("phone")), address: String(data.get("address")), due: "0", status: "Active",
    }, ...current]);
    setOpen(false);
    setMessage("New supplier added successfully.");
  }

  return (
    <main className={styles.page}>
      <PageHeader actions={<Button onClick={() => setOpen(true)} tone="primary"><Plus size={13} />Add New Supplier</Button>} crumbs={["Purchase", "Supplier List"]} title="Supplier List" />
      <section className={styles.toolbar}>
        <label><span>Search Supplier</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, email..." value={query} /></label>
        <label><span>Status</span><select onChange={(event) => setStatus(event.target.value)} value={status}><option>All</option><option>Active</option><option>Inactive</option></select></label>
        <div className={styles.toolbarButtons}><Button onClick={() => setPage(1)}><Filter size={13} />Filter</Button></div>
        <div className={styles.toolbarButtons}><Button onClick={() => { setQuery(""); setStatus("All"); setPage(1); }}><RotateCcw size={13} />Reset</Button></div>
      </section>
      <section className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>#</th><th>Supplier Code</th><th>Supplier Name</th><th>Contact Person</th><th>Phone</th><th>Address</th><th>Due Amount (৳)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{filtered.map((supplier, index) => (
              <tr key={supplier.code}>
                <td>{index + 1}</td><td>{supplier.code}</td><td>{supplier.name}</td><td>{supplier.contact}</td><td>{supplier.phone}</td><td>{supplier.address}</td><td>{supplier.due}</td>
                <td><Status tone={supplier.status === "Active" ? "active" : "inactive"}>{supplier.status}</Status></td>
                <td><div className={styles.actions}><Link aria-label={`View ${supplier.name}`} className={styles.iconButton} href="/suppliers/details-78"><Eye size={13} /></Link><button aria-label={`Edit ${supplier.name}`} className={styles.iconButton} onClick={() => setMessage(`${supplier.name} is ready to edit.`)}><Pencil size={13} /></button><button aria-label={`Delete ${supplier.name}`} className={`${styles.iconButton} ${styles.dangerIcon}`} onClick={() => setRows((current) => current.filter((row) => row.code !== supplier.code))}><Trash2 size={13} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing 1 to {filtered.length} of 25 entries</span><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Pager current={page} onChange={setPage} pages={3} /><select aria-label="Rows per page" defaultValue="10"><option>10 / page</option><option>25 / page</option></select></div></footer>
      </section>
      <p className={styles.feedback}>{message}</p>
      {open ? <Modal onClose={() => setOpen(false)} title="Add New Supplier"><form className={styles.modalForm} onSubmit={addSupplier}><label className={styles.field}><span>Supplier name</span><input name="name" required /></label><label className={styles.field}><span>Contact person</span><input name="contact" required /></label><label className={styles.field}><span>Phone</span><input name="phone" required /></label><label className={styles.field}><span>Address</span><input name="address" required /></label><footer><Button onClick={() => setOpen(false)}>Cancel</Button><Button tone="primary" type="submit">Add Supplier</Button></footer></form></Modal> : null}
    </main>
  );
}
