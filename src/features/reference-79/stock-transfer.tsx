"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button, PageHeader } from "../reference-78/shared";
import base from "../reference-78/reference-78.module.css";
import styles from "./reference-79.module.css";

type TransferItem = { name: string; sku: string; purity: string; weight: number; quantity: number; rate: number };
const initialItems: TransferItem[] = [
  { name: "Gold Chain 22K", sku: "PRO-0001", purity: "22K", weight: 12.5, quantity: 2, rate: 7450 },
  { name: "Gold Ring 22K", sku: "PRO-0002", purity: "22K", weight: 5, quantity: 3, rate: 7450 },
  { name: "Gold Pendant 22K", sku: "PRO-0003", purity: "22K", weight: 3.2, quantity: 2, rate: 7450 },
];
const money = (value: number) => value.toLocaleString("en-IN");
const itemValue = (item: TransferItem) => Math.round(item.weight * item.quantity * item.rate);

export function Reference79StockTransfer() {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");
  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + item.weight, 0), [items]);
  const totalValue = useMemo(() => items.reduce((sum, item) => sum + itemValue(item), 0), [items]);
  function addItem() { const next = items.length + 1; setItems((rows) => [...rows, { name: `Gold Item ${next}`, sku: `PRO-${String(next).padStart(4, "0")}`, purity: "22K", weight: 2.5, quantity: 1, rate: 7450 }]); }
  return <main className={base.page}>
    <PageHeader actions={<Button onClick={() => setMessage("New transfer form is ready.")} tone="primary"><Plus size={13}/>New Transfer</Button>} crumbs={["Inventory", "Stock Transfer"]} title="Stock Transfer"/>
    <section className={base.panel}><div className={styles.transferFields}><label className={base.field}><span>Transfer No</span><input defaultValue="TRN-2025-05-0010"/></label><label className={base.field}><span>Transfer Date</span><input defaultValue="2025-05-30" type="date"/></label><label className={base.field}><span>From Branch</span><select defaultValue="Main Branch"><option>Main Branch</option><option>Uttara Branch</option></select></label><label className={base.field}><span>To Branch</span><select defaultValue="Uttara Branch"><option>Uttara Branch</option><option>Dhanmondi Branch</option></select></label><label className={`${base.field} ${styles.remarks}`}><span>Remarks</span><input defaultValue="Regular stock transfer"/></label></div></section>
    <section className={base.panel}><h2 className={base.panelTitle}>Transfer Items</h2><div className={base.tableWrap}><table className={base.table}><thead><tr><th>#</th><th>Product</th><th>SKU</th><th>Purity</th><th>Weight (gm)</th><th>Qty (Pcs)</th><th>Rate/GM (৳)</th><th>Total Value (৳)</th><th>Action</th></tr></thead><tbody>{items.map((item,index)=><tr key={`${item.sku}-${index}`}><td>{index+1}</td><td>{item.name}</td><td>{item.sku}</td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{item.quantity}</td><td>{money(item.rate)}</td><td>{money(itemValue(item))}</td><td><button aria-label={`Remove ${item.name}`} className={`${base.iconButton} ${base.dangerIcon}`} onClick={()=>setItems((rows)=>rows.filter((_,rowIndex)=>rowIndex!==index))}><Trash2 size={13}/></button></td></tr>)}</tbody></table></div><div style={{padding:"10px 12px"}}><Button onClick={addItem}><Plus size={13}/>Add Item</Button></div><footer className={styles.transferSummary}><span>Total Items: {items.length}</span><span>Total Weight: {totalWeight.toFixed(3)} gm</span><span>Total Value (৳): <strong>{money(totalValue)}</strong></span></footer></section>
    <p className={base.feedback}>{message}</p><div className={base.headerActions}><Button onClick={()=>{setItems(initialItems);setMessage("Transfer reset.");}}>Cancel</Button><Button onClick={()=>setMessage("Stock transfer saved successfully.")} tone="primary"><Save size={13}/>Save Transfer</Button></div>
  </main>;
}
