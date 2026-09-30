"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Building2, CreditCard, Pencil, Plus, ShoppingCart } from "lucide-react";
import { Button, Modal, PageHeader, Status } from "./shared";
import { purchaseHistory } from "./supplier-data";
import styles from "./reference-78.module.css";

export function Reference78SupplierDetails() {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <main className={styles.page}>
      <PageHeader
        actions={<><Button onClick={() => setEditing(true)} tone="purple"><Pencil size={13} />Edit Supplier</Button><Button onClick={() => setMessage("A new purchase workflow was opened.")} tone="success"><Plus size={13} />New Purchase</Button></>}
        crumbs={["Purchase", "Supplier List", "Supplier Details"]}
        title="Supplier Details"
      />
      <section className={styles.detailsGrid}>
        <article className={styles.panel}>
          <h2 className={styles.panelTitle}>Supplier Information</h2>
          <div className={styles.supplierInfo}>
            <div className={styles.supplierAvatar}><Building2 size={34} /></div>
            <dl className={styles.definitionList}>
              <dt>Supplier Code</dt><dd>SUP-0001</dd>
              <dt>Supplier Name</dt><dd>Gold Palace</dd>
              <dt>Contact Person</dt><dd>Mr. Imran Hossain</dd>
              <dt>Phone</dt><dd>01711-223344</dd>
              <dt>Email</dt><dd>imran@goldpalace.com</dd>
              <dt>Address</dt><dd>123, Abdul Gani Road<br />Dhaka - 1100, Bangladesh</dd>
              <dt>Status</dt><dd><Status>Active</Status></dd>
              <dt>Join Date</dt><dd>05 Jan 2025</dd>
            </dl>
          </div>
        </article>
        <div className={styles.financePanel}>
          <article className={styles.panel}><h2 className={styles.panelTitle}>Financial Summary</h2><div className={styles.summaryGrid} style={{ padding: 12 }}><div className={styles.summaryCard}><span>Total Purchase (৳)</span><strong>25,86,750</strong></div><div className={`${styles.summaryCard} ${styles.orange}`}><span>Total Return (৳)</span><strong>1,71,323</strong></div><div className={`${styles.summaryCard} ${styles.green}`}><span>Total Payment (৳)</span><strong>24,56,500</strong></div><div className={`${styles.summaryCard} ${styles.red}`}><span>Due Amount (৳)</span><strong>1,58,750</strong></div></div></article>
          <article className={styles.panel}><h2 className={styles.panelTitle}>Quick Actions</h2><div className={styles.quickActions} style={{ padding: 12 }}><Button onClick={() => setMessage("New purchase opened.")} tone="primary"><ShoppingCart size={13} />New Purchase</Button><Button onClick={() => setMessage("New payment opened.")} tone="success"><CreditCard size={13} />New Payment</Button><Button onClick={() => setMessage("Payment history opened.")} tone="purple"><BookOpen size={13} />Payment History</Button><Button onClick={() => setMessage("Supplier ledger opened.")} tone="warning"><BookOpen size={13} />Ledger View</Button></div></article>
        </div>
      </section>
      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Recent Purchase History</h2>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>#</th><th>Purchase No</th><th>Purchase Date</th><th>Total Amount (৳)</th><th>Paid Amount (৳)</th><th>Due Amount (৳)</th><th>Status</th><th>Action</th></tr></thead><tbody>{purchaseHistory.map((row, index) => <tr key={row[0]}><td>{index + 1}</td><td><Link href="/reports/purchase-78">{row[0]}</Link></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><Status tone={row[5] === "Paid" ? "paid" : "partial"}>{row[5]}</Status></td><td><Link aria-label={`View ${row[0]}`} className={styles.iconButton} href="/reports/purchase-78"><BookOpen size={13} /></Link></td></tr>)}</tbody></table></div>
        <div className={styles.centerLink}><Link className={styles.linkButton} href="/reports/purchase-78">View All Purchases →</Link></div>
      </section>
      <p className={styles.feedback}>{message}</p>
      {editing ? <Modal onClose={() => setEditing(false)} title="Edit Supplier"><form className={styles.modalForm} onSubmit={(event) => { event.preventDefault(); setEditing(false); setMessage("Supplier information updated."); }}><label className={styles.field}><span>Supplier name</span><input defaultValue="Gold Palace" /></label><label className={styles.field}><span>Contact person</span><input defaultValue="Mr. Imran Hossain" /></label><label className={styles.field}><span>Phone</span><input defaultValue="01711-223344" /></label><label className={styles.field}><span>Email</span><input defaultValue="imran@goldpalace.com" /></label><footer><Button onClick={() => setEditing(false)}>Cancel</Button><Button tone="primary" type="submit">Save Changes</Button></footer></form></Modal> : null}
    </main>
  );
}
