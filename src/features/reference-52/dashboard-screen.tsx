import Link from "next/link";
import { CategoryDonutChart, SalesTrendChart } from "./reference-charts";
import styles from "./dashboard-screen.module.css";

type MetricAccent = "blue" | "red" | "green" | "orange";
type MetricIcon = "sales" | "purchase" | "profit" | "gold";

type SummaryMetric = {
  accent: MetricAccent;
  change: string;
  comparison: string;
  icon: MetricIcon;
  label: string;
  negative?: boolean;
  value: string;
};

const SUMMARY_METRICS: SummaryMetric[] = [
  {
    accent: "blue",
    change: "+18.6%",
    comparison: "vs last month",
    icon: "sales",
    label: "Total Sales",
    value: "৳ 2,45,80,000",
  },
  {
    accent: "red",
    change: "+12.4%",
    comparison: "vs last month",
    icon: "purchase",
    label: "Total Purchase",
    value: "৳ 1,85,40,000",
  },
  {
    accent: "green",
    change: "+24.8%",
    comparison: "vs last month",
    icon: "profit",
    label: "Total Profit",
    value: "৳ 60,40,000",
  },
  {
    accent: "orange",
    change: "-1.2%",
    comparison: "vs yesterday",
    icon: "gold",
    label: "Gold Rate (22K)",
    negative: true,
    value: "৳ 8,950 /gm",
  },
];

const RECENT_TRANSACTIONS = [
  { invoice: "INV-250501", date: "31 May 2025", customer: "Arif Hossain", amount: "৳ 1,25,000", method: "Cash", status: "Paid" },
  { invoice: "INV-250500", date: "31 May 2025", customer: "Nusrat Jahan", amount: "৳ 85,500", method: "bKash", status: "Paid" },
  { invoice: "INV-250499", date: "30 May 2025", customer: "Rashed Alam", amount: "৳ 45,000", method: "Card", status: "Paid" },
  { invoice: "INV-250498", date: "30 May 2025", customer: "Mehedi Hasan", amount: "৳ 78,000", method: "Cash", status: "Pending" },
  { invoice: "INV-250497", date: "29 May 2025", customer: "Jannatul Ferdous", amount: "৳ 65,000", method: "Nagad", status: "Paid" },
] as const;

const TOP_SELLING_ITEMS = [
  { item: "22K Gold Necklace", sales: "৳ 68,50,000" },
  { item: "Gold Chain (22K)", sales: "৳ 45,20,000" },
  { item: "Diamond Ring", sales: "৳ 28,40,000" },
  { item: "Gold Earrings", sales: "৳ 22,10,000" },
  { item: "Silver Pendant", sales: "৳ 10,30,000" },
] as const;

function MetricGlyph({ icon }: { icon: MetricIcon }) {
  if (icon === "sales") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 4v15h15" />
        <path d="m7.5 14 3.1-3.4 2.8 2.1 4.4-5.2" />
        <path d="M15.5 7.5h2.3v2.3" />
      </svg>
    );
  }

  if (icon === "purchase") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.5 8h11l-.7 11H7.2L6.5 8Z" />
        <path d="M9 9V6.8A3 3 0 0 1 12 4a3 3 0 0 1 3 2.8V9" />
        <path d="m9.2 13 1.8 1.8 3.9-4" />
      </svg>
    );
  }

  if (icon === "profit") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 19V14h3v5H5Zm5.5 0v-8h3v8h-3Zm5.5 0V8h3v11h-3Z" />
        <path d="m5.5 10 4-4 3 2.4L18.8 3" />
        <path d="M16.5 3h2.3v2.4" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m12 3 6 5.7-2.2 9.5H8.2L6 8.7 12 3Z" />
      <path d="m6.2 8.7 3.4 3.1L12 3l2.4 8.8 3.4-3.1" />
      <path d="M9.6 11.8 12 18.2l2.4-6.4" />
    </svg>
  );
}

function SummaryCard({ metric }: { metric: SummaryMetric }) {
  return (
    <article className={styles.summaryCard}>
      <span className={`${styles.metricIcon} ${styles[metric.accent]}`}>
        <MetricGlyph icon={metric.icon} />
      </span>
      <div className={styles.metricContent}>
        <span className={styles.metricLabel}>{metric.label}</span>
        <strong>{metric.value}</strong>
        <p>
          <span className={metric.negative ? styles.negativeTrend : styles.positiveTrend}>
            {metric.change}
          </span>{" "}
          {metric.comparison}
        </p>
      </div>
    </article>
  );
}

function RecentTransactions() {
  return (
    <section aria-labelledby="recent-transactions-title" className={styles.tableCard} id="recent-transactions">
      <header className={styles.cardHeader}>
        <h2 id="recent-transactions-title">Recent Transactions</h2>
        <Link className={styles.viewAllButton} href="/sales/invoices">View All</Link>
      </header>
      <div className={styles.tableScroller}>
        <table className={styles.transactionsTable}>
          <caption className={styles.visuallyHidden}>Five most recent sales transactions</caption>
          <thead>
            <tr>
              <th scope="col">Invoice No</th>
              <th scope="col">Date</th>
              <th scope="col">Customer</th>
              <th scope="col">Amount</th>
              <th scope="col">Payment Mode</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_TRANSACTIONS.map((transaction) => (
              <tr key={transaction.invoice}>
                <td className={styles.invoice}>{transaction.invoice}</td>
                <td>{transaction.date}</td>
                <td>{transaction.customer}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.method}</td>
                <td>
                  <span className={transaction.status === "Paid" ? styles.paid : styles.pending}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TopSellingItems() {
  return (
    <section aria-labelledby="top-selling-title" className={styles.tableCard}>
      <header className={styles.cardHeader}>
        <h2 id="top-selling-title">Top Selling Items</h2>
      </header>
      <div className={styles.tableScroller}>
        <table className={styles.sellingTable}>
          <caption className={styles.visuallyHidden}>Top five selling jewellery items</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Sales (৳)</th>
            </tr>
          </thead>
          <tbody>
            {TOP_SELLING_ITEMS.map((item) => (
              <tr key={item.item}>
                <td>{item.item}</td>
                <td>{item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Reference52Dashboard() {
  return (
    <div className={styles.dashboard}>
      <section aria-label="Business summary" className={styles.summaryGrid}>
        {SUMMARY_METRICS.map((metric) => (
          <SummaryCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section aria-label="Sales analytics" className={styles.analyticsGrid}>
        <SalesTrendChart title="Sales Overview" />
        <CategoryDonutChart />
      </section>

      <section aria-label="Recent sales activity" className={styles.activityGrid}>
        <RecentTransactions />
        <TopSellingItems />
      </section>
    </div>
  );
}
