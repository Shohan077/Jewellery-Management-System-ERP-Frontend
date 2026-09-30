"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Printer } from "lucide-react";
import { Button, downloadCsv, PageHeader } from "./shared";
import styles from "./reference-78.module.css";

type Purchase = {
  no: string;
  date: string;
  supplier: string;
  category: "Gold" | "Diamond" | "Other";
  total: number;
  returned: number;
  due: number;
};

const purchases: Purchase[] = [
  { no: "PUR-2025-05-0012", date: "28 May 2025", supplier: "Gold Palace", category: "Gold", total: 275600, returned: 56850, due: 158750 },
  { no: "PUR-2025-05-0011", date: "27 May 2025", supplier: "Diamond World Ltd.", category: "Diamond", total: 385200, returned: 0, due: 45200 },
  { no: "PUR-2025-05-0010", date: "24 May 2025", supplier: "Shyamoli Jewellers", category: "Gold", total: 192450, returned: 0, due: 0 },
  { no: "PUR-2025-05-0009", date: "20 May 2025", supplier: "Gold Palace", category: "Gold", total: 485200, returned: 65000, due: 0 },
  { no: "PUR-2025-05-0008", date: "18 May 2025", supplier: "Rahim Jewellers", category: "Other", total: 145300, returned: 0, due: 35300 },
  { no: "PUR-2025-05-0007", date: "15 May 2025", supplier: "M/S Gold & Sons", category: "Gold", total: 215450, returned: 49473, due: 102700 },
  { no: "PUR-2025-05-0006", date: "10 May 2025", supplier: "Diamond World Ltd.", category: "Diamond", total: 175000, returned: 0, due: 60000 },
];

const money = (value: number) => value.toLocaleString("en-IN");

export function Reference78PurchaseReport() {
  const [supplier, setSupplier] = useState("All Suppliers");
  const [category, setCategory] = useState("All Categories");
  const [appliedSupplier, setAppliedSupplier] = useState("All Suppliers");
  const [appliedCategory, setAppliedCategory] = useState("All Categories");
  const rows = useMemo(() => purchases.filter((row) => (appliedSupplier === "All Suppliers" || row.supplier === appliedSupplier) && (appliedCategory === "All Categories" || row.category === appliedCategory)), [appliedCategory, appliedSupplier]);
  const totals = useMemo(() => rows.reduce((sum, row) => ({ total: sum.total + row.total, returned: sum.returned + row.returned, due: sum.due + row.due }), { total: 0, returned: 0, due: 0 }), [rows]);
  const net = totals.total - totals.returned;
  const unfiltered = appliedSupplier === "All Suppliers" && appliedCategory === "All Categories";
  const displayTotals = unfiltered ? { total: 1875300, returned: 171323, net: 1703977, due: 586950 } : { ...totals, net };

  const exportRows = () => downloadCsv("purchase-report.csv", ["Purchase No", "Purchase Date", "Supplier", "Total Amount", "Return Amount", "Net Amount", "Due Amount"], rows.map((row) => [row.no, row.date, row.supplier, String(row.total), String(row.returned), String(row.total - row.returned), String(row.due)]));

  return (
    <main className={styles.page}>
      <PageHeader actions={<><Button onClick={exportRows}><Download size={13} />Export</Button><Button onClick={() => window.print()} tone="primary"><Printer size={13} />Print</Button></>} crumbs={["Reports & Analytics", "Purchase Report"]} title="Purchase Report" />
      <section className={styles.toolbar} style={{ gridTemplateColumns: "minmax(260px, 1.15fr) minmax(170px, .8fr) minmax(170px, .8fr) auto" }}>
        <label><span>Date Range</span><div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 7 }}><input defaultValue="2025-05-01" type="date" /><span>To</span><input defaultValue="2025-05-31" type="date" /></div></label>
        <label><span>Supplier</span><select onChange={(event) => setSupplier(event.target.value)} value={supplier}><option>All Suppliers</option>{[...new Set(purchases.map((row) => row.supplier))].map((name) => <option key={name}>{name}</option>)}</select></label>
        <label><span>Item Category</span><select onChange={(event) => setCategory(event.target.value)} value={category}><option>All Categories</option><option>Gold</option><option>Diamond</option><option>Other</option></select></label>
        <Button onClick={() => { setAppliedSupplier(supplier); setAppliedCategory(category); }} tone="primary"><Eye size={13} />View Report</Button>
      </section>
      <section className={styles.metrics}>
        <article className={styles.metric}><span>Total Purchase (৳)</span><strong>{money(displayTotals.total)}</strong><small><b>↑ 18.6%</b> from 01 Apr - 30 Apr</small></article>
        <article className={styles.metric}><span>Total Return (৳)</span><strong>{money(displayTotals.returned)}</strong><small><b className={styles.negative}>↓ 4.2%</b> from 01 Apr - 30 Apr</small></article>
        <article className={styles.metric}><span>Net Purchase (৳)</span><strong>{money(displayTotals.net)}</strong><small><b>↑ 16.3%</b> from 01 Apr - 30 Apr</small></article>
        <article className={styles.metric}><span>Total Due (৳)</span><strong>{money(displayTotals.due)}</strong><small><b className={styles.neutral}>— No change</b></small></article>
      </section>
      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Purchase Details</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>#</th><th>Purchase No</th><th>Purchase Date</th><th>Supplier</th><th>Total Amount (৳)</th><th>Return Amount (৳)</th><th>Net Amount (৳)</th><th>Due Amount (৳)</th></tr></thead>
            <tbody>{rows.map((row, index) => <tr key={row.no}><td>{index + 1}</td><td><button className={styles.linkButton}>{row.no}</button></td><td>{row.date}</td><td>{row.supplier}</td><td>{money(row.total)}</td><td>{money(row.returned)}</td><td>{money(row.total - row.returned)}</td><td>{money(row.due)}</td></tr>)}</tbody>
            <tfoot><tr><th colSpan={4}>Total</th><th>{money(displayTotals.total)}</th><th>{money(displayTotals.returned)}</th><th>{money(displayTotals.net)}</th><th>{money(displayTotals.due)}</th></tr></tfoot>
          </table>
        </div>
      </section>
    </main>
  );
}
