"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Download, Eye, Filter, Pencil, Plus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  base,
  Button,
  Donut,
  Feedback,
  Intro,
  type Metric,
  Metrics,
  Modal,
  Pager,
  SearchBox,
  Status,
  Tabs,
  exportCsv,
} from "../reference-73/shared";
import styles from "./reference-76.module.css";

type Supplier = {
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  purchases: string;
  payable: string;
};

type Customer = {
  name: string;
  phone: string;
  email: string;
  purchases: string;
  outstanding: string;
  lastPurchase: string;
  status: "Active" | "Inactive";
  segment: "VIP Customers" | "Regular Customers" | "New Customers";
};

const supplierMetrics: Metric[] = [
  { label: "Total Suppliers", value: "86", note: "All Suppliers" },
  { label: "Active Suppliers", value: "72", trend: "83.72%", note: "" },
  { label: "Inactive Suppliers", value: "14", trend: "16.28%", note: "" },
  { label: "Total Purchases (This Month)", value: "৳ 24,85,600", note: "23 Orders" },
  { label: "Total Payable", value: "৳ 6,75,400", note: "To Suppliers" },
];

const supplierSeed: Supplier[] = [
  { name: "Rahim Jewellers", contact: "Rahim Ahmed", phone: "01712-345678", email: "rahim@example.com", status: "Active", purchases: "6,25,600", payable: "1,25,400" },
  { name: "Sadik Gold Supply", contact: "Sadik Akter", phone: "01723-456789", email: "sadik@example.com", status: "Active", purchases: "4,65,400", payable: "98,600" },
  { name: "Diamond World Ltd.", contact: "Karim Uddin", phone: "01734-567890", email: "info@diamondworld.com", status: "Active", purchases: "3,65,200", payable: "1,45,300" },
  { name: "Gold Touch", contact: "Monir Hossain", phone: "01745-678901", email: "goldtouch@example.com", status: "Active", purchases: "3,25,000", payable: "78,200" },
  { name: "Silver Star Traders", contact: "Jahid Hasan", phone: "01756-789012", email: "silverstar@example.com", status: "Active", purchases: "1,85,650", payable: "35,600" },
  { name: "M/S Jewelry House", contact: "Arif Hossain", phone: "01767-890123", email: "info@jewelryhouse.com", status: "Inactive", purchases: "1,48,450", payable: "89,450" },
  { name: "Gold City", contact: "Salim Karigar", phone: "01770-901234", email: "goldcity@example.com", status: "Active", purchases: "2,75,200", payable: "1,25,400" },
  { name: "Nusrat Gems", contact: "Nusrat Jahan", phone: "01789-012345", email: "nusratgems@example.com", status: "Inactive", purchases: "95,100", payable: "26,450" },
];

const customerMetrics: Metric[] = [
  { label: "Total Customers", value: "1,248", note: "All Customers" },
  { label: "Active Customers", value: "948", trend: "75.96%", note: "" },
  { label: "New Customers (This Month)", value: "58", note: "This Month" },
  { label: "Total Sales (This Month)", value: "৳ 18,75,400", trend: "↑ 16.45%", note: "vs last month" },
  { label: "Outstanding Receivable", value: "৳ 3,65,200", note: "From Customers" },
];

const customerSeed: Customer[] = [
  { name: "Karim Uddin", phone: "01712-345678", email: "karim@example.com", purchases: "2,45,600", outstanding: "45,600", lastPurchase: "25 May 2025", status: "Active", segment: "VIP Customers" },
  { name: "Rahim Akter", phone: "01723-456789", email: "rahima@example.com", purchases: "1,85,400", outstanding: "25,300", lastPurchase: "24 May 2025", status: "Active", segment: "Regular Customers" },
  { name: "Sadia Akter", phone: "01734-567890", email: "sadia@example.com", purchases: "3,25,000", outstanding: "75,200", lastPurchase: "26 May 2025", status: "Active", segment: "VIP Customers" },
  { name: "Nusrat Jahan", phone: "01745-678901", email: "nusrat@example.com", purchases: "2,15,600", outstanding: "65,400", lastPurchase: "24 May 2025", status: "Active", segment: "VIP Customers" },
  { name: "Arif Hossain", phone: "01756-789012", email: "arif@example.com", purchases: "1,48,000", outstanding: "18,700", lastPurchase: "22 May 2025", status: "Active", segment: "Regular Customers" },
  { name: "Monir Hossain", phone: "01767-890123", email: "monir@example.com", purchases: "1,95,600", outstanding: "35,600", lastPurchase: "21 May 2025", status: "Inactive", segment: "Regular Customers" },
  { name: "Salma Akter", phone: "01778-901234", email: "salma@example.com", purchases: "2,35,000", outstanding: "45,000", lastPurchase: "25 May 2025", status: "Active", segment: "New Customers" },
  { name: "Jahid Hasan", phone: "01789-012345", email: "jahid@example.com", purchases: "1,25,300", outstanding: "12,200", lastPurchase: "20 May 2025", status: "Inactive", segment: "New Customers" },
];

const supplierTabs = ["All Suppliers", "Active", "Inactive"] as const;
const customerTabs = ["All Customers", "Active", "Inactive", "VIP Customers"] as const;

function SupplierEditor({ onClose, onSave, supplier }: { onClose: () => void; onSave: (supplier: Supplier) => void; supplier?: Supplier }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      name: String(form.get("name")), contact: String(form.get("contact")), phone: String(form.get("phone")), email: String(form.get("email")),
      status: String(form.get("status")) as Supplier["status"], purchases: supplier?.purchases ?? "0", payable: supplier?.payable ?? "0",
    });
  }
  return <Modal description="Maintain supplier contact and account information." onClose={onClose} title={supplier ? "Edit Supplier" : "Add Supplier"}><form className={base.modalForm} onSubmit={submit}><label><span>Supplier name</span><input defaultValue={supplier?.name} name="name" required/></label><label><span>Contact person</span><input defaultValue={supplier?.contact} name="contact" required/></label><label><span>Phone</span><input defaultValue={supplier?.phone} name="phone" required/></label><label><span>Email</span><input defaultValue={supplier?.email} name="email" required type="email"/></label><label><span>Status</span><select defaultValue={supplier?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label><footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12}/>Save Supplier</Button></footer></form></Modal>;
}

function CustomerEditor({ customer, onClose, onSave }: { customer?: Customer; onClose: () => void; onSave: (customer: Customer) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      name: String(form.get("name")), phone: String(form.get("phone")), email: String(form.get("email")),
      status: String(form.get("status")) as Customer["status"], segment: String(form.get("segment")) as Customer["segment"],
      purchases: customer?.purchases ?? "0", outstanding: customer?.outstanding ?? "0", lastPurchase: customer?.lastPurchase ?? "—",
    });
  }
  return <Modal description="Maintain customer profile and segment information." onClose={onClose} title={customer ? "Edit Customer" : "Add Customer"}><form className={base.modalForm} onSubmit={submit}><label><span>Customer name</span><input defaultValue={customer?.name} name="name" required/></label><label><span>Phone</span><input defaultValue={customer?.phone} name="phone" required/></label><label><span>Email</span><input defaultValue={customer?.email} name="email" required type="email"/></label><label><span>Segment</span><select defaultValue={customer?.segment ?? "Regular Customers"} name="segment"><option>VIP Customers</option><option>Regular Customers</option><option>New Customers</option></select></label><label><span>Status</span><select defaultValue={customer?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label><footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12}/>Save Customer</Button></footer></form></Modal>;
}

export function Reference76SupplierManagement() {
  const [rows, setRows] = useState(supplierSeed);
  const [tab, setTab] = useState<(typeof supplierTabs)[number]>("All Suppliers");
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Supplier | "new" | null>(null);
  const [viewing, setViewing] = useState<Supplier | null>(null);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => {
    const matchesTab = tab === "All Suppliers" || row.status === tab;
    const matchesSearch = `${row.name} ${row.contact} ${row.phone} ${row.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesSearch && (!filtered || Number(row.payable.replaceAll(",", "")) >= 100000);
  }), [filtered, query, rows, tab]);

  function saveSupplier(next: Supplier) {
    setRows((current) => editor === "new" ? [...current, next] : current.map((row) => row === editor ? next : row));
    setEditor(null); setMessage(`${next.name} saved.`);
  }

  return <div className={base.page}>
    <Intro actions={<Button onClick={() => setEditor("new")} primary><Plus size={13}/>Add Supplier</Button>} description="Manage supplier information and performance." title="Supplier Management"/>
    <Metrics rows={supplierMetrics}/>
    <Card className={base.tableCard}>
      <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={supplierTabs}/>
      <div className={base.tableToolbar}><SearchBox onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by supplier name, phone, email..." value={query}/><Button onClick={() => { setFiltered((value) => !value); setPage(1); }}><Filter size={12}/>Filters</Button><Button onClick={() => { exportCsv("suppliers.csv", ["Supplier", "Contact", "Phone", "Email", "Status", "Purchases", "Payable"], visible.map((row) => [row.name, row.contact, row.phone, row.email, row.status, row.purchases, row.payable])); setMessage("Supplier list exported."); }}><Download size={12}/>Export</Button></div>
      <div className={base.tableScroller}><table className={`${base.dataTable} ${styles.tableWide}`}><thead><tr><th>#</th><th>Supplier Name</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>Status</th><th>Total Purchases (৳)</th><th>Payable (৳)</th><th>Actions</th></tr></thead><tbody>{visible.map((row, index) => <tr key={`${row.name}-${row.phone}`}><td>{index + 1}</td><td><b>{row.name}</b></td><td>{row.contact}</td><td>{row.phone}</td><td>{row.email}</td><td><Status tone={row.status === "Active" ? "success" : "danger"}>{row.status}</Status></td><td>{row.purchases}</td><td>{row.payable}</td><td><span className={base.rowActions}><button aria-label={`Edit ${row.name}`} className={base.iconButton} onClick={() => setEditor(row)}><Pencil size={12}/></button><button aria-label={`View ${row.name}`} className={base.iconButton} onClick={() => setViewing(row)}><Eye size={12}/></button></span></td></tr>)}</tbody></table></div>
      <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 86 entries</span><Pager current={page} last={11} onChange={setPage}/></footer>
    </Card>
    <section className={styles.bottomThree}>
      <Card className={styles.panel}><h2>Top Suppliers by Purchase (This Month)</h2><ol className={styles.ranking}>{[["Rahim Jewellers", "৳ 6,25,600"], ["Sadik Gold Supply", "৳ 4,65,400"], ["Diamond World Ltd.", "৳ 3,65,200"], ["Gold Touch", "৳ 3,25,000"], ["Gold City", "৳ 2,75,200"]].map(([name, value]) => <li key={name}><span>{name}</span><b>{value}</b></li>)}</ol><Button className={styles.panelButton} onClick={() => setMessage("All supplier performance records opened.")}>View All</Button></Card>
      <Card className={styles.panel}><h2>Purchase by Supplier (This Month)</h2><Donut center="৳ 24,85,600" label="Total" slices={[{ label: "Rahim Jewellers", value: 25.2, color: "#1274e8", note: "25.2%" }, { label: "Sadik Gold Supply", value: 19.5, color: "#22ad74", note: "19.5%" }, { label: "Diamond World Ltd.", value: 14.7, color: "#ef4b45", note: "14.7%" }, { label: "Gold Touch", value: 13.1, color: "#f2a01c", note: "13.1%" }, { label: "Others", value: 27.5, color: "#d13f87", note: "27.5%" }]}/></Card>
      <Card className={styles.panel}><h2>Payable Aging Summary</h2><table className={styles.agingTable}><thead><tr><th>Aging</th><th>Amount (৳)</th><th>Suppliers</th></tr></thead><tbody>{[["0 - 30 Days", "3,25,400", "28"], ["31 - 60 Days", "2,15,600", "18"], ["61 - 90 Days", "1,05,300", "10"], ["Above 90 Days", "29,100", "4"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card>
    </section>
    <Feedback text={message}/>
    {editor ? <SupplierEditor onClose={() => setEditor(null)} onSave={saveSupplier} supplier={editor === "new" ? undefined : editor}/> : null}
    {viewing ? <Modal description={viewing.email} onClose={() => setViewing(null)} title={viewing.name}><form className={base.modalForm}><label><span>Contact person</span><input readOnly value={viewing.contact}/></label><label><span>Phone</span><input readOnly value={viewing.phone}/></label><label><span>Total purchases</span><input readOnly value={`৳ ${viewing.purchases}`}/></label><label><span>Payable</span><input readOnly value={`৳ ${viewing.payable}`}/></label><footer><Button onClick={() => setViewing(null)}>Close</Button></footer></form></Modal> : null}
  </div>;
}

export function Reference76CustomerManagement() {
  const [rows, setRows] = useState(customerSeed);
  const [tab, setTab] = useState<(typeof customerTabs)[number]>("All Customers");
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Customer | "new" | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => rows.filter((row) => {
    const matchesTab = tab === "All Customers" || tab === "VIP Customers" ? tab === "All Customers" || row.segment === tab : row.status === tab;
    const matchesSearch = `${row.name} ${row.phone} ${row.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesSearch && (!filtered || Number(row.outstanding.replaceAll(",", "")) >= 40000);
  }), [filtered, query, rows, tab]);

  function saveCustomer(next: Customer) {
    setRows((current) => editor === "new" ? [...current, next] : current.map((row) => row === editor ? next : row));
    setEditor(null); setMessage(`${next.name} saved.`);
  }

  return <div className={base.page}>
    <Intro actions={<Button onClick={() => setEditor("new")} primary><Plus size={13}/>Add Customer</Button>} description="Manage customer profiles and purchase history." title="Customer Management"/>
    <Metrics rows={customerMetrics}/>
    <Card className={base.tableCard}>
      <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={customerTabs}/>
      <div className={base.tableToolbar}><SearchBox onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by name, phone, email..." value={query}/><Button onClick={() => { setFiltered((value) => !value); setPage(1); }}><Filter size={12}/>Filters</Button><Button onClick={() => { exportCsv("customers.csv", ["Customer", "Phone", "Email", "Purchases", "Outstanding", "Last Purchase", "Status"], visible.map((row) => [row.name, row.phone, row.email, row.purchases, row.outstanding, row.lastPurchase, row.status])); setMessage("Customer list exported."); }}><Download size={12}/>Export</Button></div>
      <div className={base.tableScroller}><table className={`${base.dataTable} ${styles.tableWide}`}><thead><tr><th>#</th><th>Customer Name</th><th>Phone</th><th>Email</th><th>Total Purchases (৳)</th><th>Outstanding (৳)</th><th>Last Purchase</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map((row, index) => <tr key={`${row.name}-${row.phone}`}><td>{index + 1}</td><td><b>{row.name}</b></td><td>{row.phone}</td><td>{row.email}</td><td>{row.purchases}</td><td>{row.outstanding}</td><td>{row.lastPurchase}</td><td><Status tone={row.status === "Active" ? "success" : "danger"}>{row.status}</Status></td><td><span className={base.rowActions}><button aria-label={`Edit ${row.name}`} className={base.iconButton} onClick={() => setEditor(row)}><Pencil size={12}/></button><button aria-label={`View ${row.name}`} className={base.iconButton} onClick={() => setViewing(row)}><Eye size={12}/></button></span></td></tr>)}</tbody></table></div>
      <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 1,248 entries</span><Pager current={page} last={156} onChange={setPage}/></footer>
    </Card>
    <section className={styles.bottomThree}>
      <Card className={styles.panel}><h2>Sales by Customer Segment (This Month)</h2><Donut center="৳ 18,75,400" label="Total Sales" slices={[{ label: "VIP Customers", value: 35.2, color: "#1472e8", note: "35.2%" }, { label: "Regular Customers", value: 42.8, color: "#16a56f", note: "42.8%" }, { label: "New Customers", value: 15.6, color: "#1f9faf", note: "15.6%" }, { label: "Inactive Customers", value: 6.4, color: "#ef5c45", note: "6.4%" }]}/></Card>
      <Card className={styles.panel}><h2>Top Customers (This Month)</h2><ol className={styles.ranking}>{[["Sadia Akter", "৳ 3,25,000"], ["Nusrat Jahan", "৳ 2,15,600"], ["Salma Akter", "৳ 2,35,400"], ["Karim Uddin", "৳ 2,45,600"], ["Arif Hossain", "৳ 1,48,500"]].map(([name, value]) => <li key={name}><span>{name}</span><b>{value}</b></li>)}</ol><Button className={styles.panelButton} onClick={() => setMessage("All customer performance records opened.")}>View All</Button></Card>
      <Card className={styles.panel}><h2>Outstanding Aging Summary</h2><table className={styles.agingTable}><thead><tr><th>Aging</th><th>Amount (৳)</th><th>Customers</th></tr></thead><tbody>{[["0 - 30 Days", "1,85,600", "485"], ["31 - 60 Days", "1,05,300", "228"], ["61 - 90 Days", "55,200", "98"], ["Above 90 Days", "19,100", "45"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card>
    </section>
    <Feedback text={message}/>
    {editor ? <CustomerEditor customer={editor === "new" ? undefined : editor} onClose={() => setEditor(null)} onSave={saveCustomer}/> : null}
    {viewing ? <Modal description={viewing.email} onClose={() => setViewing(null)} title={viewing.name}><form className={base.modalForm}><label><span>Phone</span><input readOnly value={viewing.phone}/></label><label><span>Segment</span><input readOnly value={viewing.segment}/></label><label><span>Total purchases</span><input readOnly value={`৳ ${viewing.purchases}`}/></label><label><span>Outstanding</span><input readOnly value={`৳ ${viewing.outstanding}`}/></label><footer><Button onClick={() => setViewing(null)}>Close</Button></footer></form></Modal> : null}
  </div>;
}
