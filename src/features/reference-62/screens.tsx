"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Eye, FilePenLine, Filter, Plus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import { DonutReport } from "@/features/reference-ui/report-visuals";
import { cashRows, inventoryRows, mortgageRows, mortgageSlices, purchaseRows, purchaseSlices } from "./data";
import base from "@/features/reference-55/reference-55.module.css";
import styles from "./reference-62.module.css";

function Metric({ label, note, trend, value }: { label: string; note: string; trend?: string; value: string }) {
  return <Card className={styles.metric}><small>{label}</small><strong>{value}</strong>{trend ? <span><b>{trend}</b> {note}</span> : <span>{note}</span>}</Card>;
}

function Actions({ label, onEdit, onView, onDelete }: { label: string; onDelete?: () => void; onEdit: () => void; onView: () => void }) {
  return <span className={base.rowActions}><IconAction label={`View ${label}`} onClick={onView}><Eye size={12} /></IconAction><IconAction label={`Edit ${label}`} onClick={onEdit}><FilePenLine size={12} /></IconAction>{onDelete ? <IconAction danger label={`Delete ${label}`} onClick={onDelete}><Trash2 size={12} /></IconAction> : null}</span>;
}

function SimpleModal({ onClose, title }: { onClose: () => void; title: string }) {
  return <Modal onClose={onClose} title={title}><form className={base.formGrid} onSubmit={(event) => { event.preventDefault(); onClose(); }}><label><span>Name / Reference</span><input required /></label><label><span>Amount</span><input required type="number" /></label><label className={base.fullField}><span>Notes</span><input /></label><footer className={base.modalActions}><button className={base.secondaryButton} onClick={onClose} type="button">Cancel</button><button className={base.primaryButton} type="submit">Save</button></footer></form></Modal>;
}

export function Reference62InventoryStock() {
  const [tab, setTab] = useState("Gold Stock");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const rows = useMemo(() => inventoryRows.filter((row) => `${row[0]} ${row[1]} ${row[2]}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className={styles.page}>
    <section className={styles.fourMetrics}><Metric label="Total Gold Stock" note="Market Value ৳ 10,25,48,700" value="12,345.680 gm" /><Metric label="Total Jewellery Items" note="Market Value ৳ 8,45,32,100" value="2,345 Pcs" /><Metric label="Total Diamond Stock" note="Market Value ৳ 2,35,60,000" value="856 Pcs" /><Metric label="Raw Material Stock" note="Market Value ৳ 45,32,600" value="1,245.500 gm" /></section>
    <Card className={styles.tabs}>{["Gold Stock", "Jewellery Stock", "Diamond Stock", "Raw Material Stock"].map((item) => <button aria-current={tab === item ? "page" : undefined} key={item} onClick={() => { setTab(item); setMessage(`${item} selected.`); }} type="button">{item}</button>)}</Card>
    <Card className={styles.toolbar}><label className={styles.search}><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by Item, Purity, SKU..." value={query} /><Search size={13} /></label><select aria-label="Purity"><option>All Purity</option></select><select aria-label="Category"><option>All Category</option></select><button className={base.secondaryButton} type="button"><Filter size={12} />Filters</button></Card>
    {message ? <Feedback>{message}</Feedback> : null}
    <Card className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>SKU</th><th>Item Name</th><th>Purity</th><th>Weight (gm)</th><th>Rate (৳/gm)</th><th>Total Value (৳)</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td>{row[5]}</td><td><StatusBadge tone={row[6] === "In Stock" ? "success" : "warning"}>{row[6]}</StatusBadge></td><td><Actions label={row[0]} onEdit={() => setModal(`Edit ${row[0]}`)} onView={() => setModal(row[0])} /></td></tr>)}</tbody></table></div><footer className={styles.tableFooter}><span>Showing 1 to {rows.length} of 58 entries</span><nav><button>‹</button><button aria-current="page">1</button><button>2</button><button>3</button><button>4</button><button>5</button><span>…</span><button>8</button><button>›</button></nav></footer></Card>
    {modal ? <SimpleModal onClose={() => setModal(null)} title={modal} /> : null}
  </div>;
}

export function Reference62MortgageManagement() {
  const [queryStatus, setQueryStatus] = useState("All Status"); const [modal, setModal] = useState<string | null>(null); const [message, setMessage] = useState("");
  const rows = mortgageRows.filter((row) => queryStatus === "All Status" || row[7] === queryStatus);
  return <div className={styles.page}>
    <section className={styles.fiveMetrics}><Metric label="Total Mortgage" note="This Month" value="125" /><Metric label="Total Loan Amount" note="This Month" value="৳ 62,45,000" /><Metric label="Total Interest" note="This Month" value="৳ 8,75,200" /><Metric label="Active Mortgage" note="Current" value="98" /><Metric label="Overdue Items" note="Overdue" value="27" /></section>
    <Card className={styles.mortgageToolbar}><select onChange={(event) => setQueryStatus(event.target.value)} value={queryStatus}><option>All Status</option><option>Active</option><option>Overdue</option></select><select><option>All Loan Types</option></select><label className={styles.dateInput}><input defaultValue="May 1, 2024 - May 18, 2024" /><CalendarDays size={12} /></label><span/><button className={base.secondaryButton}><Filter size={12}/>Filters</button><button className={base.primaryButton} onClick={() => setModal("New Mortgage")}><Plus size={12}/>New Mortgage</button></Card>
    {message ? <Feedback>{message}</Feedback> : null}
    <Card className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Mortgage No</th><th>Date</th><th>Customer</th><th>Item Details</th><th>Weight (gm)</th><th>Loan Amount (৳)</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td className={styles.link}>{row[0]}</td>{row.slice(1,7).map((cell,index)=><td key={index}>{cell}</td>)}<td><StatusBadge tone={row[7] === "Active" ? "success" : "danger"}>{row[7]}</StatusBadge></td><td><Actions label={row[0]} onEdit={() => setModal(`Edit ${row[0]}`)} onView={() => setModal(row[0])}/></td></tr>)}</tbody></table></div></Card>
    <section className={styles.mortgageBottom}><Card className={styles.panel}><h2>Loan Type Distribution</h2><DonutReport centerLabel="Total" centerValue="125" slices={mortgageSlices}/></Card><Card className={styles.overdue}><h2>Overdue Summary</h2><small>Total Overdue Items</small><strong>27</strong><small>Overdue Amount</small><strong>৳ 8,75,000</strong></Card><Card className={styles.upcoming}><h2>Upcoming Due (Next 7 Days)</h2>{mortgageRows.slice(0,3).map((row)=><p key={row[0]}><b>{row[0]}</b><span>{row[6]}</span><strong>৳ {row[5]}</strong></p>)}<button onClick={()=>setMessage("Showing all upcoming dues.")}>View All Upcoming Due</button></Card></section>
    {modal ? <SimpleModal onClose={() => setModal(null)} title={modal}/> : null}
  </div>;
}

export function Reference62PurchaseManagement() {
  const [query,setQuery]=useState(""); const [modal,setModal]=useState<string|null>(null); const [message,setMessage]=useState(""); const rows=purchaseRows.filter((row)=>`${row[0]} ${row[2]}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={styles.page}>
    <section className={styles.fiveMetrics}><Metric label="Total Purchase (This Month)" note="from last month" trend="+16.45%" value="৳ 36,85,000"/><Metric label="Gold Purchase" note="from last month" trend="+16.22%" value="৳ 24,25,000"/><Metric label="Diamond Purchase" note="from last month" trend="+22.20%" value="৳ 8,75,000"/><Metric label="Other Purchase" note="from last month" trend="+12.15%" value="৳ 3,85,000"/><Metric label="Total Bills" note="This Month" value="42"/></section>
    <Card className={styles.purchaseToolbar}><label className={styles.search}><input onChange={e=>setQuery(e.target.value)} placeholder="Search by Invoice, Supplier..." value={query}/><Search size={13}/></label><select><option>All Purchase Types</option></select><select><option>All Suppliers</option></select><label className={styles.dateInput}><input defaultValue="May 1, 2024 - May 18, 2024"/><CalendarDays size={12}/></label><button className={base.secondaryButton}><Filter size={12}/>Filters</button><button className={base.primaryButton} onClick={()=>setModal("New Purchase")}><Plus size={12}/>New Purchase</button></Card>
    {message?<Feedback>{message}</Feedback>:null}<Card className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Invoice No</th><th>Date</th><th>Supplier</th><th>Type</th><th>Total Amount (৳)</th><th>Payment Method</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]}><td className={styles.link}>{row[0]}</td>{row.slice(1,6).map((cell,index)=><td key={index}>{cell}</td>)}<td><StatusBadge tone={row[6]==="Paid"?"success":"warning"}>{row[6]}</StatusBadge></td><td><Actions label={row[0]} onEdit={()=>setModal(`Edit ${row[0]}`)} onView={()=>setModal(row[0])}/></td></tr>)}</tbody></table></div></Card>
    <section className={styles.purchaseBottom}><Card className={styles.panel}><h2>Purchase by Type (This Month)</h2><DonutReport centerLabel="Total" centerValue="৳ 36,85,000" slices={purchaseSlices}/></Card><Card className={styles.rankList}><h2>Top Suppliers (By Amount)</h2><p><b>1</b><span>Gold Supplier Ltd.</span><strong>৳ 24,25,000</strong></p><p><b>2</b><span>Diamond World</span><strong>৳ 8,75,000</strong></p><p><b>3</b><span>Silver House</span><strong>৳ 3,85,000</strong></p></Card><Card className={styles.rankList}><h2>Recent Purchase Return</h2><p><b className={styles.link}>RET-2024-005</b><span>16 May, 2024</span><strong>৳ 45,000</strong></p><p><b className={styles.link}>RET-2024-004</b><span>12 May, 2024</span><strong>৳ 35,000</strong></p><p><b className={styles.link}>RET-2024-003</b><span>08 May, 2024</span><strong>৳ 25,000</strong></p><button onClick={()=>setMessage("Showing all purchase returns.")}>View All Returns</button></Card></section>
    {modal?<SimpleModal onClose={()=>setModal(null)} title={modal}/>:null}
  </div>;
}

export function Reference62DailyCashBook(){const [rows,setRows]=useState(cashRows.map((row,index)=>({id:index+1,row})));const [modal,setModal]=useState<string|null>(null);return <div className={styles.page}>
  <section className={styles.fourMetrics}><Metric label="Opening Balance" note="" value="৳ 1,25,650"/><Metric label="Total Cash In" note="" value="৳ 2,45,300"/><Metric label="Total Cash Out" note="" value="৳ 1,86,750"/><Metric label="Closing Balance" note="" value="৳ 1,84,200"/></section>
  <Card className={styles.cashToolbar}><label className={styles.dateInput}><input defaultValue="May 18, 2024"/><CalendarDays size={12}/></label><select><option>All Types</option></select><label className={styles.search}><input placeholder="Search Particulars..."/><Search size={13}/></label><span/><button className={base.primaryButton} onClick={()=>setModal("Add Transaction")}><Plus size={12}/>Add Transaction</button></Card>
  <Card className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>#</th><th>Date</th><th>Particulars</th><th>Type</th><th>Cash In (৳)</th><th>Cash Out (৳)</th><th>Balance (৳)</th><th>Payment Method</th><th>Action</th></tr></thead><tbody>{rows.map(({id,row})=><tr key={id}><td>{id}</td>{row.slice(0,2).map((cell,index)=><td key={index}>{cell}</td>)}<td className={row[2]==="Income"?styles.income:row[2]==="Expense"?styles.expense:""}>{row[2]}</td>{row.slice(3).map((cell,index)=><td key={index}>{cell}</td>)}<td>{id===1?"-":<Actions label={row[1]} onDelete={()=>setRows(current=>current.filter(item=>item.id!==id))} onEdit={()=>setModal(`Edit ${row[1]}`)} onView={()=>setModal(row[1])}/>}</td></tr>)}</tbody></table></div></Card>
  <section className={styles.cashSummary}><Metric label="Cash In Summary" note="" value="৳ 2,45,300"/><Metric label="Cash Out Summary" note="" value="৳ 1,86,750"/><Metric label="Closing Balance" note="" value="৳ 1,84,200"/></section>{modal?<SimpleModal onClose={()=>setModal(null)} title={modal}/>:null}
  </div>}
