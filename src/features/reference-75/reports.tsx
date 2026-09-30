"use client";

import { useState, type FormEvent } from "react";
import { Download, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { base, Button, Donut, Feedback, Intro, type Metric, Metrics, Modal, Status, Tabs, exportCsv } from "../reference-73/shared";
import styles from "./reference-75.module.css";

const metrics: Metric[] = [
  { label: "Total Sales (This Month)", value: "৳ 18,75,400", trend: "↑ 16.45%", note: "vs last month" },
  { label: "Total Purchase (This Month)", value: "৳ 11,25,300", trend: "↑ 12.34%", note: "vs last month" },
  { label: "Gross Profit (This Month)", value: "৳ 7,50,100", trend: "↑ 20.12%", note: "vs last month" },
  { label: "Net Profit (This Month)", value: "৳ 5,25,200", trend: "↑ 18.78%", note: "vs last month" },
  { label: "Total Expenses (This Month)", value: "৳ 2,24,900", trend: "↑ 9.45%", note: "vs last month" },
];
const tabs = ["Overview", "Sales Report", "Purchase Report", "Inventory Report", "Financial Report", "Customer Report"] as const;
const products = [["Gold Necklace 22K","4,25,000"],["Gold Chain 22K","3,15,000"],["Diamond Ring","2,45,000"],["Gold Bangle 22K","2,10,000"],["Gold Earring 22K","1,85,000"]] as const;
const transactions = [["Sales","INV-10078","26 May 2025","48,500","Completed"],["Purchase","PUR-10056","24 May 2025","35,000","Completed"],["Sales","INV-10077","26 May 2025","32,400","Completed"],["Purchase","PUR-10055","25 May 2025","18,750","Completed"]] as const;

function SalesTrend() {
  const values = [280, 320, 430, 390, 550, 670, 620, 710, 590, 760, 650];
  const points = values.map((value, index) => `${35 + index * 30},${112 - value / 9}`).join(" ");
  return <div className={styles.chart}><svg viewBox="0 0 365 140">{[200,400,600,800].map((value) => <g key={value}><line x1="35" x2="340" y1={112-value/9} y2={112-value/9}/><text x="0" y={115-value/9}>৳ {value}K</text></g>)}<polyline className={styles.lineBlue} points={points}/>{values.map((value,index) => <circle cx={35+index*30} cy={112-value/9} key={index} r="2.5"/>)}{["01 May","06 May","11 May","16 May","21 May","26 May"].map((label,index) => <text key={label} x={35+index*61} y="134">{label}</text>)}</svg></div>;
}

function CustomReportForm({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSave(String(new FormData(event.currentTarget).get("name"))); }
  return <Modal description="Configure and save a tailored business report." onClose={onClose} title="Create Custom Report"><form className={base.modalForm} onSubmit={submit}><label><span>Report name</span><input name="name" required/></label><label><span>Report type</span><select><option>Sales</option><option>Purchase</option><option>Financial</option></select></label><label><span>Date from</span><input type="date" required/></label><label><span>Date to</span><input type="date" required/></label><footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit">Create Report</Button></footer></form></Modal>;
}

export function Reference75ReportsAnalytics() {
  const [tab,setTab]=useState<(typeof tabs)[number]>("Overview"); const [open,setOpen]=useState(false); const [message,setMessage]=useState("");
  return <div className={base.page}><Intro actions={<Button onClick={()=>setOpen(true)} primary><Plus size={13}/>Custom Report</Button>} description="View business insights and performance analytics." title="Reports & Analytics"/><Card className={base.tableCard}><Tabs active={tab} onChange={setTab} tabs={tabs}/></Card>{tab==="Overview"?<><Metrics rows={metrics}/><section className={styles.reportTop}><Card className={styles.panel}><header><h2>Sales Trend (This Month)</h2><select className={styles.select}><option>This Month</option><option>Last Month</option></select></header><SalesTrend/></Card><Card className={styles.panel}><h2>Sales by Category</h2><Donut center="৳ 18,75,400" label="Total Sales" slices={[{label:"Gold Jewellery",value:45.2,color:"#126fe8"},{label:"Diamond Jewellery",value:25.7,color:"#258ddf"},{label:"Silver Jewellery",value:15.3,color:"#28aa73"},{label:"Old Gold / Exchange",value:7.4,color:"#f19a22"},{label:"Others",value:6.4,color:"#ef5548"}]}/></Card><Card className={styles.panel}><h2>Top 5 Products by Sales</h2><ol className={styles.ranking}>{products.map(([name,value])=><li key={name}><span>{name}</span><b>৳ {value}</b></li>)}</ol></Card></section><section className={styles.reportBottom}><Card className={styles.panel}><h2>Recent Transactions</h2><div className={base.tableScroller}><table className={`${base.dataTable} ${styles.compactTable}`}><thead><tr><th>Type</th><th>Invoice No</th><th>Date</th><th>Amount (৳)</th><th>Status</th></tr></thead><tbody>{transactions.map((row)=><tr key={row[1]}><td>{row[0]}</td><td><b>{row[1]}</b></td><td>{row[2]}</td><td>{row[3]}</td><td><Status>{row[4]}</Status></td></tr>)}</tbody></table></div><Button className={styles.panelButton} onClick={()=>{exportCsv("recent-transactions.csv",["Type","Invoice","Date","Amount","Status"],transactions.map((row)=>[...row]));setMessage("Transactions exported.");}}><Download size={12}/>View All Transactions</Button></Card><Card className={styles.panel}><h2>Sales by Payment Method</h2><Donut center="৳ 18.75L" label="Sales" slices={[{label:"Cash",value:48.5,color:"#126fe8"},{label:"Card",value:26.2,color:"#2968c7"},{label:"Bank Transfer",value:16.1,color:"#29aa73"},{label:"Others",value:9.2,color:"#974ed2"}]}/></Card><Card className={styles.panel}><h2>Profit vs Expense (This Month)</h2><div className={styles.groupedBars}>{[[64,42,"Week 1"],[61,38,"Week 2"],[67,43,"Week 3"],[70,44,"Week 4"]].map(([profit,expense,label])=><div className={styles.barGroup} key={label}><i style={{height:`${profit}%`}}/><i style={{height:`${expense}%`}}/><span>{label}</span></div>)}</div></Card></section></>:<Card className={styles.placeholder}><strong>{tab}</strong><span>Detailed report filters and results are ready for this module.</span><Button onClick={()=>setTab("Overview")}>Return to Overview</Button></Card>}<Feedback text={message}/>{open?<CustomReportForm onClose={()=>setOpen(false)} onSave={(name)=>{setOpen(false);setMessage(`${name} report created.`);}}/>:null}</div>;
}
