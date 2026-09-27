import Link from "next/link";
import { ChevronDown, CircleDollarSign, Landmark, ReceiptText, TrendingUp, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard, StatusPill } from "@/features/reference-53/shared";
import { MultiLineChart, RingChart } from "./analytics";
import styles from "./screen.module.css";

const cashFlow = [
  { label: "Cash Inflow", color: "#16a067", values: [1.15, 1.35, 1.56, 1.46, 1.38, 1.64, 1.49, 1.71, 1.43, 1.39, 1.64, 1.55, 1.91, 1.72, 2.13, 1.72, 1.88, 1.79, 1.64, 1.70, 1.62, 1.98] },
  { label: "Cash Outflow", color: "#ef4444", values: [0.55, 0.69, 0.86, 1.03, 0.91, 0.82, 0.96, 0.88, 0.76, 0.84, 0.96, 1.08, 1.29, 1.13, 0.97, 1.17, 1.24, 1.17, 0.92, 0.79, 0.65, 1.01] },
] as const;

const transactions = [
  { date: "31 May 2025", type: "Receipt", tone: "success" as const, account: "Cash in Hand", description: "POS Sales Collection", debit: "50,000", credit: "–", balance: "5,48,750" },
  { date: "31 May 2025", type: "Payment", tone: "success" as const, account: "Sonali Bank", description: "Supplier Payment", debit: "–", credit: "80,000", balance: "18,75,300" },
  { date: "30 May 2025", type: "Journal", tone: "info" as const, account: "Purchase A/C", description: "Gold Purchase", debit: "2,45,000", credit: "–", balance: "–" },
  { date: "30 May 2025", type: "Payment", tone: "warning" as const, account: "Cash in Hand", description: "Salary Payment", debit: "–", credit: "1,20,000", balance: "5,48,750" },
  { date: "29 May 2025", type: "Receipt", tone: "success" as const, account: "Sonali Bank", description: "Customer Payment", debit: "1,75,000", credit: "–", balance: "19,55,300" },
];

export function Reference54AccountsDashboard() {
  return (
    <div className={styles.page}>
      <section className={styles.metrics5}>
        <MetricCard accent="blue" icon={<WalletCards size={17} />} label="Total Cash in Hand" note="" value="৳ 5,48,750" />
        <MetricCard accent="blue" icon={<Landmark size={17} />} label="Total Bank Balance" note="" value="৳ 18,75,300" />
        <MetricCard accent="orange" icon={<ReceiptText size={17} />} label="Total Receivables" note="" value="৳ 12,45,000" />
        <MetricCard accent="blue" icon={<CircleDollarSign size={17} />} label="Total Payables" note="" value="৳ 7,85,600" />
        <div className={styles.successMetric}><MetricCard accent="green" icon={<TrendingUp size={17} />} label="Net Profit (MTD)" note="" value="৳ 6,25,400" /></div>
      </section>

      <section className={styles.analyticsGrid}>
        <Card className={styles.sectionCard}>
          <h2>Cash Flow (This Month)</h2>
          <div className={styles.chartBody}><MultiLineChart labels={["01 May", "06 May", "11 May", "16 May", "21 May", "26 May", "31 May"]} max={2.5} series={cashFlow} /></div>
        </Card>
        <Card className={styles.sectionCard}>
          <h2>Expense by Category</h2>
          <RingChart centerLabel="Total Expense" centerValue="৳ 6,20,500" segments={[{ label: "Purchase", value: 45, color: "#1769df" }, { label: "Manufacturing", value: 20, color: "#4d88e9" }, { label: "Salary", value: 15, color: "#f16066" }, { label: "Rent & Utility", value: 10, color: "#81afe9" }, { label: "Others", value: 10, color: "#c1cbe2" }]} />
        </Card>
      </section>

      <section className={styles.accountBottom}>
        <Card className={styles.sectionCard}>
          <h2>Recent Transactions</h2>
          <div className={styles.tableScroller}>
            <table className={`${styles.dataTable} ${styles.transactionTable}`}>
              <caption className="sr-only">Recent account transactions</caption>
              <thead><tr><th>Date</th><th>Type</th><th>Account</th><th>Description</th><th>Debit (৳)</th><th>Credit (৳)</th><th>Balance (৳)</th></tr></thead>
              <tbody>{transactions.map((row) => <tr key={`${row.date}-${row.type}-${row.description}`}><td>{row.date}</td><td><StatusPill tone={row.tone}>{row.type}</StatusPill></td><td>{row.account}</td><td>{row.description}</td><td>{row.debit}</td><td>{row.credit}</td><td>{row.balance}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <Card className={styles.sectionCard}>
          <h2>Account Summary</h2>
          <div className={styles.accountSummary}><p><span>Total Assets</span><strong>৳ 42,56,300</strong></p><p><span>Total Liabilities</span><strong>৳ 15,25,600</strong></p><p><span>Total Equity</span><strong>৳ 27,30,700</strong></p><p><span>Profit This Month</span><strong>৳ 6,25,400</strong></p></div>
          <Link className={`${styles.primaryButton} ${styles.fullReport}`} href="/reports/profit-loss">View Full Report <ChevronDown size={13} /></Link>
        </Card>
      </section>
    </div>
  );
}
