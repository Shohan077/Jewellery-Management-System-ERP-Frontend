"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUp,
  BadgeDollarSign,
  Boxes,
  CalendarDays,
  ChevronDown,
  Factory,
  Gem,
  PackagePlus,
  ReceiptText,
  ShoppingCart,
  Sparkles,
  UserRoundPlus,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, type PaymentStatus } from "@/components/ui/status-badge";
import styles from "./dashboard-overview.module.css";

type Accent = "green" | "blue" | "gold" | "purple";

type SummaryMetric = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  accent: Accent;
};

const summaryMetrics: SummaryMetric[] = [
  {
    label: "Total Sales",
    value: "৳ 12,48,500",
    trend: "12%",
    icon: WalletCards,
    accent: "green",
  },
  {
    label: "Total Purchase",
    value: "৳ 8,92,300",
    trend: "8%",
    icon: ShoppingCart,
    accent: "blue",
  },
  {
    label: "Total Stock Value",
    value: "৳ 2,56,78,900",
    trend: "12%",
    icon: Gem,
    accent: "gold",
  },
  {
    label: "Total Customers",
    value: "1,980",
    trend: "18%",
    icon: UsersRound,
    accent: "purple",
  },
];

const monthlyPerformance = [
  { month: "Jan", sales: 15.2, purchases: 2.1 },
  { month: "Feb", sales: 11.1, purchases: 5.0 },
  { month: "Mar", sales: 16.2, purchases: 5.4 },
  { month: "Apr", sales: 11.2, purchases: 5.3 },
  { month: "May", sales: 12.8, purchases: 5.7 },
  { month: "Jun", sales: 13.8, purchases: 4.0 },
] as const;

type RecentSale = {
  id: number;
  date: string;
  invoice: string;
  customer: string;
  amount: string;
  status: PaymentStatus;
};

const recentSales: RecentSale[] = [
  { id: 1, date: "30 Apr 2025", invoice: "S-000125", customer: "Rahim Uddin", amount: "৳ 72,500", status: "Paid" },
  { id: 2, date: "30 Apr 2025", invoice: "S-000124", customer: "Nusrat Jahan", amount: "৳ 1,20,000", status: "Paid" },
  { id: 3, date: "29 Apr 2025", invoice: "S-000123", customer: "Tanvir Ahmed", amount: "৳ 45,800", status: "Due" },
  { id: 4, date: "29 Apr 2025", invoice: "S-000122", customer: "Farzana Akter", amount: "৳ 88,000", status: "Paid" },
  { id: 5, date: "28 Apr 2025", invoice: "S-000121", customer: "Md. Selim", amount: "৳ 66,200", status: "Paid" },
];

const quickActions = [
  { label: "New Sale", icon: ReceiptText, accent: "green", href: "/sales/invoices/new" },
  { label: "New Purchase", icon: ShoppingCart, accent: "blue", href: "/purchases/new" },
  { label: "Add Product", icon: PackagePlus, accent: "gold", href: "/products/new" },
  { label: "Quick Customer", icon: UserRoundPlus, accent: "purple", href: "/customers" },
] as const;

const stockItems = [
  { label: "Gold Jewellery", value: "1,250 pcs", icon: Gem, accent: "gold" },
  { label: "Diamond Jewellery", value: "320 pcs", icon: Sparkles, accent: "blue" },
  { label: "Other Jewellery", value: "980 pcs", icon: Boxes, accent: "purple" },
  { label: "Raw Material", value: "12.5 kg", icon: BadgeDollarSign, accent: "gold" },
  { label: "In Production", value: "450 pcs", icon: Factory, accent: "green" },
] as const;

function SummaryCard({ metric }: { metric: SummaryMetric }) {
  const Icon = metric.icon;

  return (
    <Card as="article" className={styles.summaryCard}>
      <div className={styles.metricHeading}>
        <span className={`${styles.iconTile} ${styles[metric.accent]}`}>
          <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
        </span>
        <span>{metric.label}</span>
      </div>
      <strong className={styles.metricValue}>{metric.value}</strong>
      <div className={styles.metricMeta}>
        <span className={styles.trend}>
          <ArrowUp aria-hidden="true" size={12} strokeWidth={2.4} />
          {metric.trend}
        </span>
        <span>vs last month</span>
      </div>
    </Card>
  );
}

function SalesChart() {
  return (
    <Card aria-labelledby="performance-title" className={styles.chartCard}>
      <div className={styles.cardHeading}>
        <h2 id="performance-title">Sales vs Purchase</h2>
        <div aria-label="Chart legend" className={styles.legend}>
          <span><i className={styles.salesKey} />Sales</span>
          <span><i className={styles.purchaseKey} />Purchase</span>
        </div>
      </div>

      <div
        aria-label="Sales and purchase values from January to June 2025, shown in lakhs"
        className={styles.chartScroller}
        role="img"
      >
        <div className={styles.chart}>
          <div aria-hidden="true" className={styles.yAxis}>
            <span>20L</span>
            <span>15L</span>
            <span>10L</span>
            <span>5L</span>
            <span>0</span>
          </div>
          <div className={styles.plot}>
            {monthlyPerformance.map((point) => (
              <div className={styles.barGroup} key={point.month}>
                <div className={styles.barArea}>
                  <span
                    className={`${styles.bar} ${styles.salesBar}`}
                    style={{ height: `${(point.sales / 20) * 100}%` }}
                  />
                  <span
                    className={`${styles.bar} ${styles.purchaseBar}`}
                    style={{ height: `${(point.purchases / 20) * 100}%` }}
                  />
                </div>
                <span className={styles.month}>{point.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function GoldRateCard() {
  return (
    <Card aria-labelledby="gold-rate-title" className={styles.goldRateCard}>
      <h2 id="gold-rate-title">Gold Rate (BDT)</h2>
      <div className={styles.rateRow}>
        <span className={`${styles.iconTile} ${styles.gold} ${styles.rateIcon}`}>
          <Gem aria-hidden="true" size={24} strokeWidth={1.8} />
        </span>
        <strong>৳ 8,420</strong>
        <span className={styles.perUnit}>/ gram</span>
        <span className={`${styles.trend} ${styles.rateTrend}`}>
          <ArrowUp aria-hidden="true" size={13} strokeWidth={2.4} />
          1.2%
        </span>
      </div>
      <p>Last updated: 30 Apr 2025, 10:20 AM</p>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card aria-labelledby="quick-actions-title" className={styles.quickCard}>
      <h2 id="quick-actions-title">Quick Actions</h2>
      <div className={styles.quickGrid}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <span className={`${styles.quickIcon} ${styles[action.accent]}`}>
                <Icon aria-hidden="true" size={21} strokeWidth={1.9} />
              </span>
              <span>{action.label}</span>
            </>
          );

          return (
            <Link className={styles.quickAction} href={action.href} key={action.label}>
              {content}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function RecentSalesCard() {
  return (
    <Card aria-labelledby="recent-sales-title" className={styles.tableCard}>
      <div className={`${styles.cardHeading} ${styles.tableHeading}`}>
        <h2 id="recent-sales-title">Recent Sales</h2>
        <Link href="/sales/invoices">View All</Link>
      </div>
      <div className={styles.tableScroller}>
        <table>
          <caption className="sr-only">Five most recent sales invoices</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Invoice No</th>
              <th scope="col">Customer</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => (
              <tr key={sale.invoice}>
                <td>{sale.id}</td>
                <td>{sale.date}</td>
                <td className={styles.invoiceNo}>{sale.invoice}</td>
                <td>{sale.customer}</td>
                <td>{sale.amount}</td>
                <td><StatusBadge status={sale.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function StockSummaryCard({ onViewAll }: { onViewAll: () => void }) {
  return (
    <Card aria-labelledby="stock-summary-title" className={styles.stockCard}>
      <div className={`${styles.cardHeading} ${styles.tableHeading}`}>
        <h2 id="stock-summary-title">Stock Summary</h2>
        <button onClick={onViewAll} type="button">View All</button>
      </div>
      <ul className={styles.stockList}>
        {stockItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <span className={`${styles.stockIcon} ${styles[item.accent]}`}>
                <Icon aria-hidden="true" size={15} strokeWidth={1.9} />
              </span>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function DashboardOverview() {
  const [selectedRange, setSelectedRange] = useState("01 Apr 2025 - 30 Apr 2025");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const ranges = [
    "01 Apr 2025 - 30 Apr 2025",
    "01 Mar 2025 - 31 Mar 2025",
    "01 Jan 2025 - 30 Apr 2025",
  ];

  return (
    <div className={styles.dashboard}>
      <PageHeader
        action={(
          <div className={styles.dateControl}>
            <button
              aria-expanded={dateMenuOpen}
              aria-label="Select reporting period"
              className={styles.dateRange}
              onClick={() => setDateMenuOpen((open) => !open)}
              type="button"
            >
              <CalendarDays aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{selectedRange}</span>
              <ChevronDown aria-hidden="true" size={15} />
            </button>
            {dateMenuOpen ? (
              <div className={styles.dateMenu} role="menu">
                {ranges.map((range) => (
                  <button
                    aria-current={selectedRange === range ? "date" : undefined}
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setDateMenuOpen(false);
                      setFeedback(`Dashboard period updated to ${range}.`);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    {range}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
        description="Overview of your business performance"
        title="Dashboard"
      />

      <section aria-label="Business summary" className={styles.summaryGrid}>
        {summaryMetrics.map((metric) => <SummaryCard key={metric.label} metric={metric} />)}
      </section>

      <section aria-label="Sales performance and shortcuts" className={styles.insightsGrid}>
        <SalesChart />
        <div className={styles.sideStack}>
          <GoldRateCard />
          <QuickActionsCard />
        </div>
      </section>

      <section aria-label="Recent sales and stock" className={styles.activityGrid}>
        <RecentSalesCard />
        <StockSummaryCard onViewAll={() => setFeedback("All stock categories are shown in this dashboard preview.")} />
      </section>
      <p aria-live="polite" className={feedback ? styles.feedback : "sr-only"}>{feedback}</p>
    </div>
  );
}
