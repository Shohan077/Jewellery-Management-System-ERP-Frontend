"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { BackLink, Button, PageHeader } from "./shared";
import styles from "./reference-78.module.css";

type ReturnedItem = {
  name: string;
  category: string;
  purity: string;
  weight: number;
  rate: number;
  making: number;
  amount: number;
};

const initialItems: ReturnedItem[] = [
  { name: "Gold Chain 22K", category: "Gold Chain", purity: "22K", weight: 12.5, rate: 7450, making: 10, amount: 101988 },
  { name: "Gold Ring 22K", category: "Gold Ring", purity: "22K", weight: 5, rate: 7450, making: 8, amount: 42660 },
  { name: "Gold Pendant 22K", category: "Gold Pendant", purity: "22K", weight: 3.2, rate: 7450, making: 12, amount: 26675 },
];

const amountFor = (item: ReturnedItem) => item.amount;
const money = (value: number) => value.toLocaleString("en-IN");

export function Reference78PurchaseReturn() {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");
  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + item.weight, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + amountFor(item), 0), [items]);

  function addItem() {
    const next = items.length + 1;
    setItems((current) => [...current, { name: `Gold Item ${next}`, category: "Gold Jewellery", purity: "22K", weight: 2.5, rate: 7450, making: 8, amount: 20115 }]);
    setMessage("A new return item was added.");
  }

  return (
    <main className={styles.page}>
      <PageHeader
        actions={<BackLink href="/purchases"><ArrowLeft size={13} />Back To Purchase List</BackLink>}
        crumbs={["Purchase", "Purchase Return"]}
        title="Purchase Return"
      />

      <section className={styles.panel}>
        <div className={styles.formGrid}>
          <label className={styles.field}><span>Purchase Return No</span><input defaultValue="PR-2025-05-0007" /></label>
          <label className={styles.field}><span>Return Date</span><input defaultValue="2025-05-30" type="date" /></label>
          <label className={styles.field}><span>Supplier</span><select defaultValue="Gold Palace"><option>Gold Palace</option><option>Diamond World Ltd.</option><option>Rahim Jewellers</option></select></label>
          <label className={styles.field}><span>Reference (Purchase No)</span><input defaultValue="PUR-2025-05-0012" /></label>
          <label className={styles.field}><span>Return Type</span><select defaultValue="Against Purchase"><option>Against Purchase</option><option>Direct Return</option></select></label>
          <label className={styles.field}><span>Payment Type</span><select defaultValue="Cash"><option>Cash</option><option>Bank</option><option>Credit Adjustment</option></select></label>
          <label className={styles.field}><span>Return By</span><select defaultValue="Admin User"><option>Admin User</option><option>Purchase Manager</option></select></label>
          <label className={styles.field}><span>Remarks</span><input defaultValue="Goods received with damage" /></label>
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Returned Items</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>#</th><th>Item Name</th><th>Category</th><th>Purity</th><th>Weight (gm)</th><th>Rate/GM (৳)</th><th>Making (%)</th><th>Amount (৳)</th><th>Action</th></tr></thead>
            <tbody>{items.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td>{index + 1}</td><td>{item.name}</td><td>{item.category}</td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{money(item.rate)}</td><td>{item.making}%</td><td>{money(amountFor(item))}</td>
                <td><button aria-label={`Remove ${item.name}`} className={`${styles.iconButton} ${styles.dangerIcon}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}><Trash2 size={13} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ padding: "10px 12px" }}><Button onClick={addItem}><Plus size={13} />Add Item</Button></div>
        <footer className={styles.tableFooter}>
          <span><b>Total Items:</b> {items.length}</span>
          <span><b>Total Weight:</b> {totalWeight.toFixed(3)} gm</span>
          <span style={{ marginLeft: "auto" }}><small>Total Amount (৳)</small><strong style={{ display: "block", color: "#076be8", fontSize: 17 }}>{money(totalAmount)}</strong></span>
        </footer>
      </section>

      <p className={styles.feedback}>{message}</p>
      <div className={styles.headerActions}>
        <Button onClick={() => { setItems(initialItems); setMessage("Changes were reset."); }}>Cancel</Button>
        <Button onClick={() => setMessage("Purchase return saved successfully.")} tone="primary"><Save size={13} />Save Return</Button>
      </div>
    </main>
  );
}
