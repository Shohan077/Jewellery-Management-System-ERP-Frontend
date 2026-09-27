"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Eye,
  FilePenLine,
  Filter,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Trash2,
  UserCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard, Notice, Pagination, StatusPill } from "./shared";
import styles from "./customer-list-screen.module.css";

type CustomerStatus = "Active" | "Inactive";
type CustomerGroup = "Regular" | "VIP";
type Customer = {
  id: string;
  name: string;
  phone: string;
  group: CustomerGroup;
  totalPurchase: string;
  due: string;
  status: CustomerStatus;
};

const initialCustomers: Customer[] = [
  { id: "CUS-1001", name: "Rahim Uddin", phone: "01712-345678", group: "Regular", totalPurchase: "৳ 2,45,300", due: "৳ 15,000", status: "Active" },
  { id: "CUS-1002", name: "Farhana Islam", phone: "01823-456789", group: "VIP", totalPurchase: "৳ 5,75,400", due: "৳ 0", status: "Active" },
  { id: "CUS-1003", name: "Dipak Saha", phone: "01798-765432", group: "Regular", totalPurchase: "৳ 1,25,800", due: "৳ 8,200", status: "Active" },
  { id: "CUS-1004", name: "Mst. Jannat", phone: "01675-123456", group: "VIP", totalPurchase: "৳ 3,85,600", due: "৳ 12,500", status: "Active" },
  { id: "CUS-1005", name: "Abul Hasan", phone: "01933-987654", group: "Regular", totalPurchase: "৳ 98,700", due: "৳ 2,300", status: "Inactive" },
  { id: "CUS-1006", name: "Sathi Akter", phone: "01844-332211", group: "Regular", totalPurchase: "৳ 1,56,900", due: "৳ 0", status: "Active" },
  { id: "CUS-1007", name: "Mehedi Hasan", phone: "01766-554433", group: "VIP", totalPurchase: "৳ 6,45,200", due: "৳ 18,600", status: "Active" },
  { id: "CUS-1008", name: "Nasima Begum", phone: "01911-223344", group: "Regular", totalPurchase: "৳ 87,650", due: "৳ 1,500", status: "Inactive" },
];

type EditorState = { mode: "add" | "edit" | "view"; customer?: Customer } | null;

function CustomerDialog({ editor, onClose, onSave }: { editor: NonNullable<EditorState>; onClose: () => void; onSave: (customer: Customer) => void }) {
  const readOnly = editor.mode === "view";
  const [name, setName] = useState(editor.customer?.name ?? "");
  const [phone, setPhone] = useState(editor.customer?.phone ?? "");
  const [group, setGroup] = useState<CustomerGroup>(editor.customer?.group ?? "Regular");
  const [status, setStatus] = useState<CustomerStatus>(editor.customer?.status ?? "Active");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: editor.customer?.id ?? `CUS-${1001 + initialCustomers.length}`,
      name,
      phone,
      group,
      status,
      totalPurchase: editor.customer?.totalPurchase ?? "৳ 0",
      due: editor.customer?.due ?? "৳ 0",
    });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="customer-dialog-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
        <header><div><h2 id="customer-dialog-title">{editor.mode === "add" ? "Add Customer" : editor.mode === "edit" ? "Edit Customer" : "Customer Details"}</h2><p>{editor.customer?.id ?? "Create a new customer profile"}</p></div><button aria-label="Close dialog" onClick={onClose} type="button"><X size={17} /></button></header>
        <form onSubmit={submit}>
          <label><span>Customer Name</span><input className="field" disabled={readOnly} onChange={(event) => setName(event.target.value)} required value={name} /></label>
          <label><span>Phone</span><input className="field" disabled={readOnly} onChange={(event) => setPhone(event.target.value)} required value={phone} /></label>
          <label><span>Group</span><select className="select" disabled={readOnly} onChange={(event) => setGroup(event.target.value as CustomerGroup)} value={group}><option>Regular</option><option>VIP</option></select></label>
          <label><span>Status</span><select className="select" disabled={readOnly} onChange={(event) => setStatus(event.target.value as CustomerStatus)} value={status}><option>Active</option><option>Inactive</option></select></label>
          <footer><button className={styles.secondaryButton} onClick={onClose} type="button">{readOnly ? "Close" : "Cancel"}</button>{readOnly ? null : <button className={styles.primaryButton} type="submit">Save Customer</button>}</footer>
        </form>
      </Card>
    </div>
  );
}

export function Reference53CustomerList() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All Groups");
  const [status, setStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [editor, setEditor] = useState<EditorState>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return customers.filter((customer) =>
      (group === "All Groups" || customer.group === group)
      && (status === "All Status" || customer.status === status)
      && (!search || [customer.id, customer.name, customer.phone].some((value) => value.toLowerCase().includes(search))),
    );
  }, [customers, group, query, status]);

  function saveCustomer(customer: Customer) {
    setCustomers((current) => editor?.mode === "add"
      ? [...current, { ...customer, id: `CUS-${1001 + current.length}` }]
      : current.map((item) => item.id === customer.id ? customer : item));
    setEditor(null);
    setMessage(`${customer.name} was saved successfully.`);
  }

  function deleteCustomer(customer: Customer) {
    setCustomers((current) => current.filter((item) => item.id !== customer.id));
    setMessage(`${customer.name} was removed from this preview.`);
  }

  function resetFilters() {
    setQuery("");
    setGroup("All Groups");
    setStatus("All Status");
    setCurrentPage(1);
    setMessage("Customer filters reset.");
  }

  return (
    <div className={styles.page}>
      <section aria-label="Customer summary" className={styles.metrics}>
        <MetricCard accent="blue" icon={<Users size={17} />} label="Total Customers" trend="+12.6%" value={(1248 + customers.length - initialCustomers.length).toLocaleString()} />
        <MetricCard accent="green" icon={<UserCheck size={17} />} label="Active Customers" trend="+8.4%" value={(1086 + customers.length - initialCustomers.length).toLocaleString()} />
        <MetricCard accent="green" icon={<WalletCards size={17} />} label="Total Sales (This Month)" trend="+15.3%" value="৳ 98,45,210" />
        <MetricCard accent="orange" icon={<ShoppingBag size={17} />} label="Avg. Purchase Value" trend="+5.7%" value="৳ 28,450" />
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.search}><Search aria-hidden="true" size={14} /><span className="sr-only">Search customers</span><input onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search by name, phone, email..." type="search" value={query} /></label>
          <select aria-label="Customer group" onChange={(event) => setGroup(event.target.value)} value={group}><option>All Groups</option><option>Regular</option><option>VIP</option></select>
          <select aria-label="Customer status" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Active</option><option>Inactive</option></select>
          <button className={styles.filterButton} onClick={() => setMessage(`${filtered.length} matching customers found.`)} type="button"><Filter size={13} />Filter</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw size={13} />Reset</button>
          <button className={styles.addButton} onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={14} />Add Customer</button>
        </div>

        {message ? <Notice>{message}</Notice> : null}

        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Customer list</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Customer ID</th><th scope="col">Name</th><th scope="col">Phone</th><th scope="col">Group</th><th scope="col">Total Purchase</th><th scope="col">Due Amount</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {filtered.map((customer, index) => (
                <tr key={customer.id}><td>{index + 1}</td><td><strong>{customer.id}</strong></td><td>{customer.name}</td><td>{customer.phone}</td><td>{customer.group}</td><td>{customer.totalPurchase}</td><td>{customer.due}</td><td><StatusPill tone={customer.status === "Active" ? "success" : "danger"}>{customer.status}</StatusPill></td><td><div className={styles.actions}><button aria-label={`View ${customer.name}`} onClick={() => setEditor({ mode: "view", customer })} type="button"><Eye size={13} /></button><button aria-label={`Edit ${customer.name}`} onClick={() => setEditor({ mode: "edit", customer })} type="button"><FilePenLine size={13} /></button><button aria-label={`Delete ${customer.name}`} onClick={() => deleteCustomer(customer)} type="button"><Trash2 size={13} /></button></div></td></tr>
              ))}
              {filtered.length === 0 ? <tr><td className={styles.empty} colSpan={9}>No customers match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing 1 to {filtered.length} of {filtered.length === customers.length ? "1,248" : filtered.length} entries</span><Pagination current={currentPage} onChange={setCurrentPage} /></footer>
      </Card>

      {editor ? <CustomerDialog editor={editor} onClose={() => setEditor(null)} onSave={saveCustomer} /> : null}
    </div>
  );
}
