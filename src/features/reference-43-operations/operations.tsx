"use client";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Eye,
  FileText,
  Filter,
  PackageCheck,
  Plus,
  ShoppingCart,
  TrendingUp,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./operations.module.css";

type Row = readonly string[];
type StatData = { label: string; value: string; icon: ReactNode; meta?: string };

const transferRows: Row[] = [
  ["TRF2024-001", "01 May 2024", "Main Warehouse", "South Branch", "25", "2,450.75 g", "Ramesh S.", "Pending"],
  ["TRF2024-002", "03 May 2024", "North Branch", "West Branch", "18", "1,280.40 g", "Suresh K.", "In Transit"],
  ["TRF2024-003", "06 May 2024", "Main Warehouse", "East Branch", "32", "3,650.20 g", "Mahesh P.", "Completed"],
  ["TRF2024-004", "08 May 2024", "South Branch", "Main Warehouse", "14", "980.30 g", "Ramesh S.", "Completed"],
  ["TRF2024-005", "10 May 2024", "West Branch", "North Branch", "9", "420.15 g", "Suresh K.", "Cancelled"],
  ["TRF2024-006", "12 May 2024", "East Branch", "Main Warehouse", "27", "2,180.60 g", "Mahesh P.", "In Transit"],
  ["TRF2024-007", "15 May 2024", "Main Warehouse", "North Branch", "21", "1,750.35 g", "Ramesh S.", "Pending"],
  ["TRF2024-008", "18 May 2024", "South Branch", "West Branch", "16", "1,320.10 g", "Suresh K.", "Completed"],
];

const orderRows: Row[] = [
  ["SO2034-1001", "Priya Jewellers", "01 May 2024", "5", "₹ 1,85,400.00", "Paid", "Delivered", "Ramesh S."],
  ["SO2034-1002", "Shree Gold House", "02 May 2024", "3", "₹ 98,750.00", "Partial", "Processing", "Suresh K."],
  ["SO2034-1003", "Kalyan Ornaments", "03 May 2024", "8", "₹ 2,65,600.00", "Paid", "Delivered", "Mahesh P."],
  ["SO2034-1004", "Mehta Jewellers", "05 May 2024", "2", "₹ 45,200.00", "Unpaid", "Processing", "Ramesh S."],
  ["SO2034-1005", "Gupta Jewellers", "07 May 2024", "6", "₹ 1,22,150.00", "Partial", "Processing", "Suresh K."],
  ["SO2034-1006", "Royal Ornaments", "10 May 2024", "4", "₹ 75,650.00", "Paid", "Delivered", "Mahesh P."],
  ["SO2034-1007", "Soni Jewellers", "12 May 2024", "7", "₹ 2,14,800.00", "Partial", "Processing", "Ramesh S."],
  ["SO2034-1008", "Diamond World", "15 May 2024", "3", "₹ 1,05,200.00", "Unpaid", "Pending", "Suresh K."],
];

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={`${styles.field} ${wide ? styles.wide : ""}`}><span>{label}</span>{children}</label>;
}

function Stat({ data }: { data: StatData }) {
  return <Card className={styles.stat}><span className={styles.statIcon}>{data.icon}</span><div><p>{data.label}</p><h2>{data.value}</h2>{data.meta ? <small>{data.meta}</small> : null}</div></Card>;
}

function Badge({ value }: { value: string }) {
  const tone = ["Completed", "Delivered", "Paid", "Approved"].includes(value) ? styles.good : ["Pending", "Partial"].includes(value) ? styles.warn : ["Cancelled", "Unpaid"].includes(value) ? styles.bad : styles.info;
  return <span className={`${styles.status} ${tone}`}>{value}</span>;
}

function DetailDialog({ title, row, onClose }: { title: string; row: Row; onClose: () => void }) {
  return <div className={styles.modalBackdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><Card className={styles.modal}><h2>{title}</h2>{row.map((value, index) => <Field key={`${value}-${index}`} label={`Field ${index + 1}`}><input className="field" readOnly value={value} /></Field>)}<div className={styles.modalFooter}><button className="button" onClick={onClose} type="button">Close</button></div></Card></div>;
}

function CreateDialog({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSave(); }
  return <div className={styles.modalBackdrop}><Card className={styles.modal}><h2>{title}</h2><form onSubmit={submit}><Field label="Reference"><input className="field" placeholder="Auto generated" required /></Field><Field label="Customer / Destination"><select className="select" required><option value="">Select option</option><option>Main Branch</option><option>Priya Jewellers</option></select></Field><Field label="Date"><input className="field" defaultValue="2024-05-22" type="date" /></Field><div className={styles.modalFooter}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">Save</button></div></form></Card></div>;
}

function OperationList({ title, description, actionLabel, headers, source, total, stats, filterKind }: { title: string; description: string; actionLabel: string; headers: string[]; source: Row[]; total: string; stats: StatData[]; filterKind: "transfer" | "order" }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = useMemo(() => source.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase())), [query, source]);
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setCreating(true)} type="button"><Plus size={14} />{actionLabel}</button>} description={description} title={title} />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.stats}>{stats.map((stat) => <Stat data={stat} key={stat.label} />)}</section><Card className={styles.filters}><div className={styles.filterGrid}>{filterKind === "transfer" ? <><Field label="From Date"><input className="field" defaultValue="2024-05-01" type="date" /></Field><Field label="To Date"><input className="field" defaultValue="2024-05-31" type="date" /></Field><Field label="From Location"><select className="select"><option>All Branches</option><option>Main Warehouse</option></select></Field><Field label="To Location"><select className="select"><option>All Branches</option><option>South Branch</option></select></Field><Field label="Status"><select className="select"><option>All Status</option><option>Pending</option><option>Completed</option></select></Field></> : <><Field label="Date Range"><input className="field" defaultValue="01 May 2024 - 31 May 2024" /></Field><Field label="Customer"><select className="select"><option>All Customers</option><option>Priya Jewellers</option></select></Field><Field label="Payment Status"><select className="select"><option>All Status</option><option>Paid</option><option>Unpaid</option></select></Field><Field label="Delivery Status"><select className="select"><option>All Status</option><option>Delivered</option><option>Processing</option></select></Field></>}<Field label="Search"><input className="field" onChange={(event) => setQuery(event.target.value)} placeholder="Search..." value={query} /></Field><button className={`button ${styles.primary} ${styles.filterButton}`} onClick={() => setMessage(`${rows.length} matching records found.`)} type="button"><Filter size={13} />Filter</button></div></Card><Card className={styles.tableCard}><div className={styles.tableScroll}><table className={styles.table}><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{index >= row.length - (filterKind === "order" ? 3 : 1) && ["Completed", "Delivered", "Paid", "Approved", "Pending", "Partial", "Cancelled", "Unpaid", "Processing", "In Transit"].includes(cell) ? <Badge value={cell} /> : cell}</td>)}<td><button className={styles.view} onClick={() => setSelected(row)} type="button"><Eye size={10} />View</button></td></tr>)}</tbody></table></div><div className={styles.footer}><span>Showing 1 to {rows.length} of {total}</span><div className={styles.pager}><button type="button">‹</button><button className={styles.current} type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">›</button></div></div></Card>{selected ? <DetailDialog onClose={() => setSelected(null)} row={selected} title={`${title} Details`} /> : null}{creating ? <CreateDialog onClose={() => setCreating(false)} onSave={() => { setCreating(false); setMessage(`${actionLabel} saved.`); }} title={actionLabel} /> : null}</div>;
}

export function StockTransferManagement169() {
  const stats: StatData[] = [{ label: "Total Transfers", value: "356", icon: <Boxes size={20} /> }, { label: "Pending Transfers", value: "58", icon: <Clock3 size={20} /> }, { label: "Completed Transfers", value: "248", icon: <CheckCircle2 size={20} /> }, { label: "Cancelled Transfers", value: "50", icon: <XCircle size={20} /> }];
  return <OperationList actionLabel="Create Transfer" description="Home  ›  Inventory Management  ›  Stock Transfers" filterKind="transfer" headers={["Transfer ID", "Date", "From Branch", "To Branch", "Item Count", "Total Weight", "Requested By", "Status"]} source={transferRows} stats={stats} title="Stock Transfer Management" total="356 entries" />;
}

export function StockAdjustmentEntry170() {
  const [type, setType] = useState("Stock Adjustment");
  const [quantity, setQuantity] = useState("0.000");
  const [before, setBefore] = useState("0.000");
  const [message, setMessage] = useState("");
  const after = (Number(before || 0) + Number(quantity || 0)).toFixed(3);
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("Stock adjustment saved for approval."); }
  const recent = [["ADJ0034-101", "22K Gold Ring", "Increase", "15.000 g", "Stock Count", "Approved"], ["ADJ0034-100", "Silver Anklet", "Decrease", "5.000 g", "Damaged", "Approved"], ["ADJ0034-099", "Diamond Necklace", "Increase", "2.000 g", "Purchase", "Approved"], ["ADJ0034-098", "Gold Bangles", "Decrease", "10.000 g", "Scrap", "Approved"], ["ADJ0034-097", "24K Gold Chain", "Increase", "8.000 g", "Stock Count", "Pending"]];
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} form="adjustment-form" type="submit">Save Adjustment</button>} description="Home  ›  Inventory Management  ›  Stock Adjustment" title="Stock Adjustment Entry" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={styles.adjustGrid}><Card className={styles.adjustForm}><form id="adjustment-form" onSubmit={save}><div className={styles.formSection}><h2>Adjustment Info</h2><Field label="Adjustment Type"><select className="select" onChange={(event) => setType(event.target.value)} value={type}><option>Stock Adjustment</option><option>Stock Reconciliation</option></select></Field><Field label="Adjustment Date"><input className="field" defaultValue="2024-05-22" type="date" /></Field></div><div className={styles.formSection}><h2>Item Details</h2><Field label="Item Name / Code" wide><select className="select" required><option value="">Search item by name or code...</option><option>22K Gold Ring</option><option>Silver Anklet</option></select></Field><Field label="Reason"><select className="select"><option>Stock Count</option><option>Damaged</option><option>Scrap</option></select></Field><Field label="Quantity / Weight"><input className="field" min="0" onChange={(event) => setQuantity(event.target.value)} step="0.001" type="number" value={quantity} /></Field><Field label="Before Stock"><input className="field" onChange={(event) => setBefore(event.target.value)} step="0.001" type="number" value={before} /></Field><Field label="After Stock"><input className="field" readOnly value={after} /></Field><Field label="Branch"><select className="select"><option>Select Branch</option><option>Main Branch</option></select></Field><Field label="Approved By"><select className="select"><option>Select Approver</option><option>Admin</option></select></Field><Field label="Notes" wide><textarea className="field" placeholder="Enter notes (optional)..." /></Field></div></form></Card><div className={styles.sideStack}><Card className={styles.summary}><h2 className={styles.cardTitle}>Adjustment Summary</h2><div className={styles.summaryRows}><div><span>Adjustment Type</span><strong>{type}</strong></div><div><span>Total Items</span><strong>{Number(quantity) ? 1 : 0}</strong></div><div><span>Net Impact</span><strong className={styles.positive}>{Number(quantity || 0).toFixed(3)} g</strong></div><div><span>Last Adjustment Date</span><strong>20 May 2024</strong></div></div></Card><Card className={styles.recent}><h2 className={styles.cardTitle}>Recent Adjustments</h2><div className={styles.tableScroll}><table><thead><tr><th>Adj ID</th><th>Item Name</th><th>Type</th><th>Qty</th><th>Reason</th><th>Status</th></tr></thead><tbody>{recent.map((row) => <tr key={row[0]}>{row.slice(0, 5).map((cell) => <td key={cell}>{cell}</td>)}<td><Badge value={row[5]} /></td></tr>)}</tbody></table></div></Card></div></section></div>;
}

export function SalesOrderManagement171() {
  const stats: StatData[] = [{ label: "Total Orders", value: "1,287", icon: <FileText size={20} /> }, { label: "Draft Orders", value: "156", icon: <FileText size={20} /> }, { label: "Confirmed Orders", value: "789", icon: <CheckCircle2 size={20} /> }, { label: "Delivered Orders", value: "342", icon: <PackageCheck size={20} /> }];
  return <OperationList actionLabel="Create Sales Order" description="Home  ›  Sales Management  ›  Sales Orders" filterKind="order" headers={["Order No", "Customer Name", "Order Date", "Items", "Amount", "Payment Status", "Delivery Status", "Salesperson"]} source={orderRows} stats={stats} title="Sales Order Management" total="1,287 entries" />;
}

export function BusinessPerformanceDashboard172() {
  const [message, setMessage] = useState("");
  const products = [["1", "22K Gold Ring", "48,75,600", "1,250", "22.4%"], ["2", "Gold Chains", "35,60,200", "980", "18.7%"], ["3", "Diamond Necklaces", "28,45,800", "420", "21.3%"], ["4", "Gold Bangles (2.4)", "24,75,300", "860", "15.6%"], ["5", "Silver Anklets", "12,60,750", "1,540", "12.1%"]];
  const branches = [["Main Branch", "1,02,45,300", "18,75,650", "19.2%"], ["South Branch", "45,60,200", "6,65,400", "16.0%"], ["North Branch", "38,25,800", "6,65,250", "14.6%"], ["West Branch", "35,40,000", "6,25,460", "13.9%"], ["East Branch", "33,05,700", "5,55,700", "12.7%"]];
  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setMessage("Business dashboard exported.")} type="button">Export Dashboard</button>} description="Home  ›  Reports & Analytics  ›  Business Performance" title="Business Performance Dashboard" />{message ? <p className={styles.notice}>{message}</p> : null}<section className={`${styles.stats} ${styles.dashboardStats}`}><Stat data={{ label: "Total Revenue", value: "₹ 2,54,78,600", meta: "↑ 18.6% vs Last Month", icon: <TrendingUp size={20} /> }} /><Stat data={{ label: "Gross Profit", value: "₹ 76,45,250", meta: "↑ 15.2% vs Last Month", icon: <CircleDollarSign size={20} /> }} /><Stat data={{ label: "Net Profit", value: "₹ 42,18,930", meta: "↑ 20.4% vs Last Month", icon: <ShoppingCart size={20} /> }} /><Stat data={{ label: "Active Customers", value: "2,845", meta: "↑ 12.8% vs Last Month", icon: <UsersRound size={20} /> }} /></section><section className={styles.charts}><Card className={styles.chartCard}><h2>Revenue vs Expense Trend</h2><div className={styles.lineChart}><svg aria-label="Revenue and expense trend" role="img" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" points="2,72 18,52 35,46 52,32 66,48 82,27 98,46" stroke="#1875d1" strokeWidth="2" /><polyline fill="none" points="2,88 18,70 35,64 52,54 66,68 82,49 98,66" stroke="#21a661" strokeWidth="2" /></svg><div className={styles.axis}><span>Dec 2023</span><span>Jan 2024</span><span>Feb 2024</span><span>Mar 2024</span><span>Apr 2024</span><span>May 2024</span></div></div></Card><Card className={styles.chartCard}><h2>Revenue by Category</h2><div className={styles.donutLayout}><div className={styles.donut} /><div className={styles.legend}>{[["Gold Jewellery", "55.0%"], ["Diamond Jewellery", "20.0%"], ["Silver Jewellery", "15.0%"], ["Others", "10.0%"]].map(([name, value]) => <div key={name}><span>{name}</span><b>{value}</b></div>)}</div></div></Card></section><section className={styles.dashboardLower}><Card className={styles.panel}><h2>Top Performing Products</h2><table><thead><tr><th>#</th><th>Product Name</th><th>Revenue</th><th>Units Sold</th><th>Growth</th></tr></thead><tbody>{products.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card><Card className={styles.panel}><h2>Branch Performance</h2><table><thead><tr><th>Branch</th><th>Revenue</th><th>Profit</th><th>Growth</th></tr></thead><tbody>{branches.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card><Card className={styles.panel}><h2>Recent Alerts & Activity</h2><div className={styles.activity}><div><b>High value order received</b>Order SO0006 ₹35,000 · 10 mins ago</div><div><b>Low stock alert</b>22K Gold Ring below threshold · 25 mins ago</div><div><b>Payment received</b>Priya Jewellers · 1 hour ago</div><div><b>Stock transfer completed</b>Main → South branch · 2 hours ago</div><div><b>New customer added</b>Mr. Vardhman Jewellers · 3 hours ago</div></div></Card></section></div>;
}
