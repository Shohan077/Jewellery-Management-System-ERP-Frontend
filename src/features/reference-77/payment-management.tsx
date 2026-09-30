"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Download, Eye, Filter, Pencil, Plus, Save } from "lucide-react";
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
import styles from "./payment-management.module.css";

type TransactionKind = "Received" | "Paid";
type PaymentMethod = "Cash" | "Card" | "Bank" | "Bank Transfer";

type PaymentTransaction = {
  id: string;
  date: string;
  type: TransactionKind;
  description: string;
  reference: string;
  method: PaymentMethod;
  amount: string;
};

const metrics: Metric[] = [
  { label: "Total Received (This Month)", value: "৳ 6,45,200", trend: "↑ 14.6%", note: "vs last month" },
  { label: "Total Paid (This Month)", value: "৳ 4,25,600", trend: "↑ 8.3%", note: "vs last month" },
  { label: "Net Balance", value: "৳ 2,19,600", note: "Current Month" },
  { label: "Cash in Hand", value: "৳ 1,25,400", note: "Current Balance" },
];

const initialTransactions: PaymentTransaction[] = [
  { id: "PAY-1008", date: "26 May 2025", type: "Received", description: "Sales Payment - Sadia Akter", reference: "INV-1002", method: "Card", amount: "1,85,000" },
  { id: "PAY-1007", date: "26 May 2025", type: "Received", description: "Sales Payment - Karim Uddin", reference: "INV-1001", method: "Bank", amount: "1,25,400" },
  { id: "PAY-1006", date: "26 May 2025", type: "Paid", description: "Gold Purchase", reference: "PUR-88", method: "Bank", amount: "95,000" },
  { id: "PAY-1005", date: "25 May 2025", type: "Received", description: "Sales Payment - Nusrat Jahan", reference: "INV-1004", method: "Cash", amount: "62,750" },
  { id: "PAY-1004", date: "24 May 2025", type: "Paid", description: "Karigar Payment", reference: "PAY-45", method: "Cash", amount: "45,000" },
  { id: "PAY-1003", date: "24 May 2025", type: "Received", description: "Sales Payment - Arif Hossain", reference: "INV-1005", method: "Card", amount: "1,48,500" },
  { id: "PAY-1002", date: "23 May 2025", type: "Received", description: "Sales Payment - Salim", reference: "INV-1006", method: "Cash", amount: "31,200" },
  { id: "PAY-1001", date: "23 May 2025", type: "Paid", description: "Diamond Purchase", reference: "PUR-87", method: "Bank", amount: "1,20,000" },
];

const tabs = ["All Transactions", "Received", "Paid", "Bank", "Cash"] as const;
type PaymentTab = (typeof tabs)[number];

function PaymentForm({
  kind,
  onClose,
  onSave,
}: {
  kind: TransactionKind;
  onClose: () => void;
  onSave: (row: PaymentTransaction) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      id: `PAY-${1100 + Math.floor(Math.random() * 800)}`,
      date: "26 May 2025",
      type: kind,
      description: String(data.get("description")),
      reference: String(data.get("reference")),
      method: String(data.get("method")) as PaymentMethod,
      amount: Number(data.get("amount")).toLocaleString("en-IN"),
    });
  }

  return (
    <Modal
      description={kind === "Received" ? "Record money received from a customer." : "Record a business payment."}
      onClose={onClose}
      title={kind === "Received" ? "Receive Payment" : "Make Payment"}
    >
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Description</span><input name="description" placeholder={kind === "Received" ? "Customer or invoice" : "Supplier or expense"} required /></label>
        <label><span>Reference No</span><input name="reference" placeholder="INV-1007" required /></label>
        <label><span>Payment Method</span><select name="method"><option>Cash</option><option>Card</option><option>Bank</option><option>Bank Transfer</option></select></label>
        <label><span>Amount (৳)</span><input min="1" name="amount" required type="number" /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Save Payment</Button></footer>
      </form>
    </Modal>
  );
}

function MonthlyCollectionChart() {
  const values = [2.8, 3.5, 4.3, 5.6, 6.45];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];

  return (
    <div className={styles.barChart} aria-label="Monthly collection trend" role="img">
      <div className={styles.barPlot}>
        {[8, 6, 4, 2, 0].map((value) => <span className={styles.axisLabel} key={value}>৳ {value}L</span>)}
        <div className={styles.gridLines} aria-hidden="true" />
        <div className={styles.bars}>
          {values.map((value, index) => (
            <div className={styles.barColumn} key={labels[index]}>
              <i style={{ height: `${(value / 8) * 100}%` }} />
              <span>{labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reference77PaymentManagement() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [tab, setTab] = useState<PaymentTab>("All Transactions");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [query, setQuery] = useState("");
  const [completedOnly, setCompletedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<TransactionKind | null>(null);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => transactions.filter((row) => {
    const searchable = `${row.type} ${row.description} ${row.reference} ${row.method}`.toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase());
    const matchesTab = tab === "All Transactions"
      || (tab === "Received" || tab === "Paid" ? row.type === tab : row.method === tab);
    const matchesType = typeFilter === "All Types" || row.type === typeFilter;
    return matchesQuery && matchesTab && matchesType && (!completedOnly || row.date === "26 May 2025");
  }), [completedOnly, query, tab, transactions, typeFilter]);

  function savePayment(row: PaymentTransaction) {
    setTransactions((current) => [row, ...current]);
    setModal(null);
    setTab("All Transactions");
    setMessage(`${row.type} payment ${row.reference} saved successfully.`);
  }

  return (
    <div className={base.page}>
      <Intro
        actions={(
          <>
            <Button onClick={() => setModal("Received")} primary><Plus size={13} />Receive Payment</Button>
            <Button onClick={() => setModal("Paid")}><Plus size={13} />Make Payment</Button>
          </>
        )}
        description="Track all payments and transactions."
        title="Payment Management"
      />

      <Card className={styles.tabsCard}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={tabs} />
      </Card>

      <Metrics rows={metrics} />

      <Card className={base.tableCard}>
        <div className={`${base.tableToolbar} ${styles.toolbar}`}>
          <label className={styles.dateField}>
            <CalendarDays size={12} />
            <input aria-label="Payment date range" readOnly value="01 May 2025 - 26 May 2025" />
            <CalendarDays size={11} />
          </label>
          <select aria-label="Payment type" className={styles.typeSelect} onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }} value={typeFilter}>
            <option>All Types</option><option>Received</option><option>Paid</option>
          </select>
          <SearchBox onChange={setQuery} placeholder="Search by description..." value={query} />
          <Button onClick={() => setCompletedOnly((value) => !value)}><Filter size={12} />Filters</Button>
          <Button onClick={() => { exportCsv("payment-transactions.csv", ["Date", "Type", "Description", "Reference", "Method", "Amount", "Status"], visible.map((row) => [row.date, row.type, row.description, row.reference, row.method, row.amount, "Completed"])); setMessage("Payment transactions exported."); }}><Download size={12} />Export</Button>
        </div>
        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.paymentTable}`}>
            <thead><tr><th>#</th><th>Date</th><th>Type</th><th>Description</th><th>Reference No</th><th>Method</th><th>Amount (৳)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visible.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td><td>{row.date}</td>
                  <td><Status tone={row.type === "Received" ? "success" : "danger"}>{row.type}</Status></td>
                  <td>{row.description}</td><td><b>{row.reference}</b></td><td>{row.method}</td><td>{row.amount}</td><td><Status>Completed</Status></td>
                  <td><span className={base.rowActions}><button aria-label={`Edit ${row.reference}`} className={base.iconButton} onClick={() => setMessage(`Editing payment ${row.reference}.`)}><Pencil size={12} /></button><button aria-label={`View ${row.reference}`} className={base.iconButton} onClick={() => setMessage(`${row.reference}: ৳ ${row.amount} ${row.type.toLowerCase()} by ${row.method}.`)}><Eye size={12} /></button></span></td>
                </tr>
              ))}
              {!visible.length ? <tr><td className={base.emptyCell} colSpan={9}>No transactions match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 124 entries</span><Pager current={page} last={16} onChange={setPage} /></footer>
      </Card>

      <section className={styles.bottomGrid}>
        <Card className={styles.panel}>
          <h2>Payment Method (This Month)</h2>
          <Donut
            center="৳ 6.45"
            label="Lakh"
            slices={[
              { label: "Cash", value: 42.5, color: "#0874ec", note: "42.5%" },
              { label: "Bank Transfer", value: 28.7, color: "#23a9e4", note: "28.7%" },
              { label: "Card", value: 18.9, color: "#28aa73", note: "18.9%" },
              { label: "Others", value: 9.9, color: "#f7a51a", note: "9.9%" },
            ]}
          />
        </Card>
        <Card className={styles.panel}><h2>Monthly Collection Trend</h2><MonthlyCollectionChart /></Card>
        <Card className={styles.panel}>
          <h2>Outstanding Summary</h2>
          <div className={styles.outstanding}>
            <div><span>Receivable</span><strong>৳ 3,65,200</strong><small>From Customers</small></div>
            <div><span>Payable</span><strong>৳ 2,45,600</strong><small>To Suppliers</small></div>
          </div>
        </Card>
      </section>

      <Feedback text={message} />
      {modal ? <PaymentForm kind={modal} onClose={() => setModal(null)} onSave={savePayment} /> : null}
    </div>
  );
}
