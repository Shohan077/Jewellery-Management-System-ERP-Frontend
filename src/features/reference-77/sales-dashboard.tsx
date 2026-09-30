"use client";

import { useState, type FormEvent } from "react";
import { Eye, Plus, Save } from "lucide-react";
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
  Status,
} from "../reference-73/shared";
import styles from "./sales-dashboard.module.css";

type Sale = {
  invoice: string;
  customer: string;
  item: string;
  weight: string;
  amount: string;
  payment: "Cash" | "Card" | "Bank";
};

const metrics: Metric[] = [
  { label: "Total Sales (Today)", value: "৳ 12,45,600", trend: "↑ 12.5%", note: "vs yesterday" },
  { label: "Total Orders (Today)", value: "42", trend: "↑ 7.7%", note: "vs yesterday" },
  { label: "Average Order Value", value: "৳ 29,657", trend: "↑ 4.3%", note: "vs yesterday" },
  { label: "Total Sales (This Month)", value: "৳ 3,48,76,500", trend: "↑ 18.6%", note: "vs last month" },
];

const initialSales: Sale[] = [
  { invoice: "INV-20250526-1001", customer: "Sadia Akter", item: "Gold Necklace", weight: "12.450", amount: "1,25,400", payment: "Card" },
  { invoice: "INV-20250526-1002", customer: "Karim Uddin", item: "Diamond Ring", weight: "2.850", amount: "3,85,000", payment: "Bank" },
  { invoice: "INV-20250526-1003", customer: "Rahim Ahmed", item: "Gold Bracelet", weight: "8.320", amount: "84,600", payment: "Cash" },
  { invoice: "INV-20250526-1004", customer: "Nusrat Jahan", item: "Gold Earrings", weight: "5.260", amount: "62,760", payment: "Cash" },
  { invoice: "INV-20250526-1005", customer: "Monir Karigar", item: "Silver Payal", weight: "15.600", amount: "33,200", payment: "Card" },
];

function SalesTrend({ range }: { range: string }) {
  const values = range === "Last 30 Days"
    ? [7.1, 8.8, 10.4, 12.2, 11.6, 14.8, 16.1]
    : [6.4, 8.1, 11.7, 13.1, 15.4, 16.8, 18.6];
  const points = values.map((value, index) => `${44 + index * 52},${122 - value * 5}`).join(" ");
  const labels = ["20 May", "21 May", "22 May", "23 May", "24 May", "25 May", "26 May"];

  return (
    <div className={styles.trendChart}>
      <svg aria-label="Daily sales trend" role="img" viewBox="0 0 390 150">
        {[0, 5, 10, 15, 20].map((value) => (
          <g key={value}>
            <line x1="42" x2="367" y1={122 - value * 5} y2={122 - value * 5} />
            <text x="0" y={125 - value * 5}>{value === 0 ? "৳ 0" : `৳ ${value},00,000`}</text>
          </g>
        ))}
        {labels.map((label, index) => <text key={label} x={30 + index * 52} y="145">{label}</text>)}
        <polyline points={points} />
        {values.map((value, index) => <circle cx={44 + index * 52} cy={122 - value * 5} key={index} r="3" />)}
      </svg>
    </div>
  );
}

function NewSaleForm({ onClose, onSave }: { onClose: () => void; onSave: (sale: Sale) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      invoice: `INV-20250526-${1006 + Math.floor(Math.random() * 80)}`,
      customer: String(data.get("customer")),
      item: String(data.get("item")),
      weight: Number(data.get("weight")).toFixed(3),
      amount: Number(data.get("amount")).toLocaleString("en-IN"),
      payment: String(data.get("payment")) as Sale["payment"],
    });
  }

  return (
    <Modal description="Record a completed sale in the dashboard." onClose={onClose} title="New Sale">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Customer</span><input name="customer" placeholder="Customer name" required /></label>
        <label><span>Item / Design</span><input name="item" placeholder="Jewellery item" required /></label>
        <label><span>Weight (g)</span><input min="0.001" name="weight" required step="0.001" type="number" /></label>
        <label><span>Amount (৳)</span><input min="1" name="amount" required type="number" /></label>
        <label><span>Payment method</span><select name="payment"><option>Cash</option><option>Card</option><option>Bank</option></select></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Save Sale</Button></footer>
      </form>
    </Modal>
  );
}

export function Reference77SalesDashboard() {
  const [sales, setSales] = useState(initialSales);
  const [range, setRange] = useState("Last 7 Days");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className={base.page}>
      <Intro
        actions={<Button onClick={() => setOpen(true)} primary><Plus size={13} />New Sale</Button>}
        description="Real-time overview of sales performance"
        title="Sales Dashboard"
      />
      <Metrics rows={metrics} />
      <section className={styles.analyticsGrid}>
        <Card className={styles.panel}>
          <header>
            <h2>Daily Sales Trend (Last 7 Days)</h2>
            <select aria-label="Sales trend period" onChange={(event) => setRange(event.target.value)} value={range}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </header>
          <SalesTrend range={range} />
        </Card>
        <Card className={`${styles.panel} ${styles.categoryPanel}`}>
          <h2>Sales by Category (This Month)</h2>
          <Donut
            center="৳ 3.49"
            label="Crore"
            slices={[
              { label: "Gold Jewellery", value: 48.2, color: "#126fe8", note: "48.2%" },
              { label: "Diamond Jewellery", value: 22.6, color: "#1f8dd7", note: "22.6%" },
              { label: "Silver", value: 12.4, color: "#28aa73", note: "12.4%" },
              { label: "Old Gold", value: 9.8, color: "#ef4d4e", note: "9.8%" },
              { label: "Others", value: 7, color: "#9751d5", note: "7.0%" },
            ]}
          />
        </Card>
      </section>
      <Card className={styles.salesCard}>
        <header className={styles.salesHeader}><h2>Recent Sales</h2><button onClick={() => setShowAll((value) => !value)}>{showAll ? "Show Recent" : "View All"}</button></header>
        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.salesTable}`}>
            <thead><tr><th>#</th><th>Invoice No</th><th>Customer</th><th>Type</th><th>Weight (g)</th><th>Amount (৳)</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{sales.slice(0, showAll ? sales.length : 5).map((sale, index) => (
              <tr key={sale.invoice}>
                <td>{index + 1}</td><td><b>{sale.invoice}</b></td><td>{sale.customer}</td><td>{sale.item}</td><td>{sale.weight}</td><td>{sale.amount}</td>
                <td><Status tone="info">{sale.payment}</Status></td><td><Status>Completed</Status></td>
                <td><button aria-label={`View ${sale.invoice}`} className={base.iconButton} onClick={() => setMessage(`${sale.invoice}: ৳ ${sale.amount} paid by ${sale.payment}.`)}><Eye size={13} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Feedback text={message} />
      {open ? <NewSaleForm onClose={() => setOpen(false)} onSave={(sale) => { setSales((rows) => [sale, ...rows]); setOpen(false); setMessage(`${sale.invoice} created successfully.`); }} /> : null}
    </div>
  );
}
