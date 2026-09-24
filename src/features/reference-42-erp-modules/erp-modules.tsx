"use client";

import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Eye,
  FileText,
  Filter,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./erp-modules.module.css";

type Row = readonly string[];

const inventoryRows: Row[] = [
  ["ITM1001", "22K Gold Ring", "Rings", "Main Warehouse", "45", "Pcs", "In Stock"],
  ["ITM1002", "24K Gold Chain", "Chains", "Main Warehouse", "18", "Pcs", "Low Stock"],
  ["ITM1003", "Diamond Necklace", "Necklaces", "Branch Warehouse", "32", "Pcs", "In Stock"],
  ["ITM1004", "Gold Bangles (2.4)", "Bangles", "Main Warehouse", "8", "Pcs", "Low Stock"],
  ["ITM1005", "Silver Anklet", "Silver", "Branch Warehouse", "0", "Pcs", "Out of Stock"],
];

const goldRows: Row[] = [
  ["31 May 2024", "Purchase", "GP240531001", "Ramesh S.", "125.500", "22K", "9,75,625.00", "Completed"],
  ["30 May 2024", "Usage", "GU240530002", "Suresh K.", "85.250", "22K", "6,62,587.50", "Completed"],
  ["29 May 2024", "Purchase", "GP240529003", "Mahesh P.", "200.000", "24K", "16,28,000.00", "Completed"],
  ["28 May 2024", "Usage", "GU240528004", "Ramesh S.", "60.750", "22K", "4,72,102.50", "Completed"],
  ["27 May 2024", "Purchase", "GP240527005", "Suresh K.", "150.000", "22K", "11,62,500.00", "Completed"],
];

const workRows: Row[] = [
  ["WO24050101", "22K Gold Ring", "Ramesh Soni", "01 May 2024", "08 May 2024", "Completed"],
  ["WO24050102", "Diamond Necklace", "Suresh K.", "02 May 2024", "12 May 2024", "In Progress"],
  ["WO24050103", "Gold Bangles (2.4)", "Mahesh P.", "03 May 2024", "15 May 2024", "Pending"],
  ["WO24050104", "24K Gold Chain", "Ramesh S.", "05 May 2024", "10 May 2024", "Delayed"],
  ["WO24050105", "Silver Anklet", "Suresh K.", "06 May 2024", "18 May 2024", "In Progress"],
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}

function Stat({ icon, label, value, meta }: { icon: ReactNode; label: string; value: string; meta?: string }) {
  return <Card className={styles.stat}><span className={styles.statIcon}>{icon}</span><div><p>{label}</p><h2>{value}</h2>{meta ? <small>{meta}</small> : null}</div></Card>;
}

function Badge({ value }: { value: string }) {
  const tone = ["In Stock", "Completed", "Available"].includes(value)
    ? styles.good
    : ["Low Stock", "Pending", "In Progress"].includes(value)
      ? styles.warn
      : styles.bad;
  return <span className={`${styles.status} ${tone}`}>{value}</span>;
}

function Modal({ row, title, onClose }: { row: Row; title: string; onClose: () => void }) {
  return <div className={styles.modalBackdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()}><Card className={styles.modal}><h2>{title}</h2><dl>{row.map((value, index) => <div key={`${value}-${index}`}><dt>Field {index + 1}</dt><dd>{value}</dd></div>)}</dl><div className={styles.modalFooter}><button className="button" onClick={onClose} type="button">Close</button></div></Card></div>;
}

function Filters({ children, onSearch, onReset }: { children: ReactNode; onSearch: () => void; onReset: () => void }) {
  return <Card className={styles.filters}><div className={styles.filterGrid}>{children}<div className={styles.filterActions}><button className={`button ${styles.primary}`} onClick={onSearch} type="button"><Filter size={13} />Filter</button><button className="button" onClick={onReset} type="button"><RotateCcw size={13} />Reset</button></div></div></Card>;
}

function RecordTable({ headers, rows, total, onView }: { headers: string[]; rows: Row[]; total: string; onView: (row: Row) => void }) {
  return <Card className={styles.tableCard}><div className={styles.tableScroll}><table className={styles.table}><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{index === row.length - 1 ? <Badge value={cell} /> : cell}</td>)}<td><button className={styles.view} onClick={() => onView(row)} type="button"><Eye size={11} />View</button></td></tr>)}</tbody></table></div><div className={styles.footer}><span>Showing 1 to {rows.length} of {total}</span><div className={styles.pager}><button type="button">‹</button><button className={styles.current} type="button">1</button><button type="button">›</button></div></div></Card>;
}

function CreateModal({ kind, onClose, onSave }: { kind: string; onClose: () => void; onSave: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSave(); }
  return <div className={styles.modalBackdrop}><Card className={styles.modal}><h2>Add {kind}</h2><form onSubmit={submit}><Field label="Name / Reference"><input className="field" name="name" placeholder={`Enter ${kind.toLowerCase()}`} required /></Field><Field label="Status"><select className="select" name="status"><option>Active</option><option>Pending</option></select></Field><div className={styles.modalFooter}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">Save</button></div></form></Card></div>;
}

export function InventoryManagement165() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = useMemo(() => inventoryRows.filter((row) => (!query || row.join(" ").toLowerCase().includes(query.toLowerCase())) && (status === "All Status" || row[6] === status)), [query, status]);
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setCreating(true)} type="button"><Plus size={15} />Add Item</button>} description="Home  ›  Inventory Management" title="Inventory Management" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.stats}><Stat icon={<Boxes size={20} />} label="Total Items" value="1,245" /><Stat icon={<PackageCheck size={20} />} label="In Stock" value="980" /><Stat icon={<AlertTriangle size={20} />} label="Low Stock" value="145" /><Stat icon={<AlertTriangle size={20} />} label="Out of Stock" value="120" /></section><Filters onReset={() => { setQuery(""); setStatus("All Status"); setMessage("Filters reset."); }} onSearch={() => setMessage(`${rows.length} matching inventory items found.`)}><Field label="Search items"><div className="input-with-icon"><Search size={14} /><input className="field" onChange={(event) => setQuery(event.target.value)} placeholder="Search items..." value={query} /></div></Field><Field label="Category"><select className="select"><option>All Categories</option><option>Rings</option><option>Chains</option></select></Field><Field label="Location"><select className="select"><option>All Locations</option><option>Main Warehouse</option><option>Branch Warehouse</option></select></Field><Field label="Status"><select className="select" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></Field></Filters><RecordTable headers={["Item Code", "Item Name", "Category", "Location", "Stock Qty", "Unit", "Status"]} onView={setSelected} rows={rows} total="1,245 items" />{selected ? <Modal onClose={() => setSelected(null)} row={selected} title="Inventory Item" /> : null}{creating ? <CreateModal kind="Inventory Item" onClose={() => setCreating(false)} onSave={() => { setCreating(false); setMessage("Inventory item saved."); }} /> : null}</div>;
}

export function GoldManagement166() {
  const [type, setType] = useState("All Transaction Types");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = goldRows.filter((row) => type === "All Transaction Types" || row[1] === type);
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setCreating(true)} type="button"><Plus size={15} />Add Gold Transaction</button>} description="Home  ›  Gold Management" title="Gold Management" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.stats}><Stat icon={<Boxes size={20} />} label="Total Gold Stock" value="12,450.75 g" /><Stat icon={<ShoppingCart size={20} />} label="Gold Purchase" value="3,250.40 g" /><Stat icon={<TrendingUp size={20} />} label="Gold Usage" value="2,180.35 g" /><Stat icon={<CircleDollarSign size={20} />} label="Current Value" value="₹ 8,95,48,750" /></section><Filters onReset={() => { setType("All Transaction Types"); setMessage("Filters reset."); }} onSearch={() => setMessage(`${rows.length} transactions found.`)}><Field label="Date Range"><input className="field" defaultValue="01 May 2024 - 31 May 2024" /></Field><Field label="Transaction Type"><select className="select" onChange={(event) => setType(event.target.value)} value={type}><option>All Transaction Types</option><option>Purchase</option><option>Usage</option></select></Field><Field label="Karigar"><select className="select"><option>All Karigar</option><option>Ramesh S.</option><option>Suresh K.</option></select></Field><Field label="Branch"><select className="select"><option>All Branches</option><option>Main Branch</option></select></Field></Filters><RecordTable headers={["Date", "Type", "Reference No", "Karigar", "Weight (g)", "Purity", "Total Value (₹)", "Status"]} onView={setSelected} rows={rows} total="5 records" />{selected ? <Modal onClose={() => setSelected(null)} row={selected} title="Gold Transaction" /> : null}{creating ? <CreateModal kind="Gold Transaction" onClose={() => setCreating(false)} onSave={() => { setCreating(false); setMessage("Gold transaction saved."); }} /> : null}</div>;
}

export function ManufacturingWorkOrder167() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = useMemo(() => workRows.filter((row) => (!query || row.join(" ").toLowerCase().includes(query.toLowerCase())) && (status === "All Statuses" || row[5] === status)), [query, status]);
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setCreating(true)} type="button"><Plus size={15} />Create Work Order</button>} description="Home  ›  Manufacturing  ›  Work Order" title="Manufacturing Work Order" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.stats}><Stat icon={<FileText size={20} />} label="Total Work Orders" value="128" /><Stat icon={<CircleDollarSign size={20} />} label="In Progress" value="48" /><Stat icon={<PackageCheck size={20} />} label="Completed" value="62" /><Stat icon={<AlertTriangle size={20} />} label="Delayed" value="18" /></section><Filters onReset={() => { setQuery(""); setStatus("All Statuses"); setMessage("Filters reset."); }} onSearch={() => setMessage(`${rows.length} work orders found.`)}><Field label="Search"><div className="input-with-icon"><Search size={14} /><input className="field" onChange={(event) => setQuery(event.target.value)} placeholder="Search work orders..." value={query} /></div></Field><Field label="Product"><select className="select"><option>All Products</option><option>Gold Ring</option></select></Field><Field label="Karigar"><select className="select"><option>All Karigar</option><option>Ramesh Soni</option></select></Field><Field label="Status"><select className="select" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Statuses</option><option>Completed</option><option>In Progress</option><option>Pending</option><option>Delayed</option></select></Field></Filters><RecordTable headers={["WO No", "Product Name", "Karigar Name", "Start Date", "Due Date", "Status"]} onView={setSelected} rows={rows} total="128 records" />{selected ? <Modal onClose={() => setSelected(null)} row={selected} title="Work Order" /> : null}{creating ? <CreateModal kind="Work Order" onClose={() => setCreating(false)} onSave={() => { setCreating(false); setMessage("Work order created."); }} /> : null}</div>;
}

export function ReportsAnalytics168() {
  const [message, setMessage] = useState("");
  const topProducts = [["1", "22K Gold Ring", "45,78,200", "1,254"], ["2", "Gold Chain", "31,22,450", "856"], ["3", "Gold Bangles", "28,75,600", "723"], ["4", "Diamond Necklace", "22,15,300", "412"], ["5", "Silver Anklet", "10,45,800", "1,145"]];
  const locations = [["1", "Main Branch", "1,02,45,600", "41.7%"], ["2", "South Branch", "62,78,450", "25.6%"], ["3", "West Branch", "48,20,300", "19.6%"], ["4", "North Branch", "32,34,300", "13.1%"]];
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setMessage("Analytics report exported.")} type="button">Export Report</button>} description="Home  ›  Reports & Analytics" title="Reports & Analytics" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.stats}><Stat icon={<TrendingUp size={20} />} label="Total Sales" value="₹ 2,45,78,650" meta="↑ 18.6% vs Last Month" /><Stat icon={<ShoppingCart size={20} />} label="Total Purchase" value="₹ 1,68,34,200" meta="↑ 12.4% vs Last Month" /><Stat icon={<CircleDollarSign size={20} />} label="Gross Profit" value="₹ 77,44,450" meta="↑ 22.1% vs Last Month" /><Stat icon={<UsersRound size={20} />} label="Total Customers" value="2,845" meta="↑ 9.8% vs Last Month" /></section><section className={styles.charts}><Card className={styles.chartCard}><h2>Sales & Purchase Trend</h2><div className={styles.lineChart}><svg aria-label="Sales and purchase trend" role="img" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" points="2,72 18,48 36,45 52,32 68,50 82,27 98,50" stroke="#1976d2" strokeWidth="2" /><polyline fill="none" points="2,88 18,67 36,68 52,58 68,72 82,53 98,68" stroke="#23a865" strokeWidth="2" /></svg><div className={styles.xAxis}><span>Dec 2023</span><span>Jan 2024</span><span>Feb 2024</span><span>Mar 2024</span><span>Apr 2024</span><span>May 2024</span></div></div></Card><Card className={styles.chartCard}><h2>Product Wise Sales</h2><div className={styles.donutLayout}><div className={styles.donut} /><div className={styles.legend}>{[["Gold Rings", "35.6%"], ["Gold Chains", "24.3%"], ["Gold Bangles", "18.7%"], ["Diamond Jewelry", "12.6%"], ["Silver Items", "8.8%"]].map(([name, value]) => <div key={name}><span>{name}</span><b>{value}</b></div>)}</div></div></Card></section><section className={styles.lowerGrid}><Card className={styles.smallTable}><h2>Top Selling Products</h2><table><thead><tr><th>#</th><th>Product Name</th><th>Sales (₹)</th><th>Qty Sold</th></tr></thead><tbody>{topProducts.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card><Card className={styles.smallTable}><h2>Sales by Location</h2><table><thead><tr><th>#</th><th>Location</th><th>Sales (₹)</th><th>% of Total</th></tr></thead><tbody>{locations.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card></section></div>;
}
