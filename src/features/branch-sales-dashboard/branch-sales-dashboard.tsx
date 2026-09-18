"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  FilePenLine,
  Plus,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatCurrency,
  formatNumber,
  initialBranchSales,
  salesPeriods,
  type BranchSalesRow,
} from "./branch-sales-dashboard-data";
import styles from "./branch-sales-dashboard.module.css";

type DialogState =
  | { mode: "view" | "edit" | "sale"; branch: BranchSalesRow }
  | null;

type MetricProps = {
  label: string;
  value: string;
  trend?: number;
};

function MetricCard({ label, value, trend }: MetricProps) {
  return (
    <Card className={styles.metricCard}>
      <p>{label}</p>
      <strong>{value}</strong>
      {trend ? (
        <span className={styles.trend}>
          <TrendingUp aria-hidden="true" size={12} /> {trend}%
        </span>
      ) : null}
    </Card>
  );
}

function scaledBranch(branch: BranchSalesRow, factor: number): BranchSalesRow {
  return {
    ...branch,
    sales: Math.round(branch.sales * factor),
    orders: Math.round(branch.orders * factor),
    customers: Math.round(branch.customers * factor),
    chartMillions: branch.chartMillions * factor,
  };
}

export function BranchSalesDashboard() {
  const [periodIndex, setPeriodIndex] = useState(0);
  const [branches, setBranches] = useState<BranchSalesRow[]>(() => initialBranchSales.map((branch) => ({ ...branch })));
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");

  const period = salesPeriods[periodIndex];
  const factor = period?.factor ?? 1;
  const visibleBranches = useMemo(() => branches.map((branch) => scaledBranch(branch, factor)), [branches, factor]);
  const totals = useMemo(() => {
    const sales = visibleBranches.reduce((total, branch) => total + branch.sales, 0);
    const orders = visibleBranches.reduce((total, branch) => total + branch.orders, 0);
    const customers = visibleBranches.reduce((total, branch) => total + branch.customers, 0);
    const salesRatio = sales / 2_845_600;
    const orderRatio = orders / 1_248;
    return {
      sales,
      orders,
      customers,
      averageOrder: Math.round(22_780 * (salesRatio / Math.max(orderRatio, 0.01))),
    };
  }, [visibleBranches]);
  const maximumChartValue = Math.max(...visibleBranches.map((branch) => branch.chartMillions), 1);
  const totalChartMillions = 28.45 * factor;

  function changePeriod(nextIndex: number) {
    setPeriodIndex(nextIndex);
    setMessage(`Dashboard updated for ${salesPeriods[nextIndex]?.label ?? "the selected period"}.`);
  }

  function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog || dialog.mode === "view") return;
    const form = new FormData(event.currentTarget);
    const visibleSales = Number(form.get("sales")) || 0;
    const visibleOrders = Number(form.get("orders")) || 0;
    const visibleCustomers = Number(form.get("customers")) || 0;
    const growth = Number(form.get("growth")) || 0;

    setBranches((current) => current.map((branch) => {
      if (branch.id !== dialog.branch.id) return branch;
      if (dialog.mode === "sale") {
        const baselineSale = visibleSales / factor;
        return {
          ...branch,
          sales: branch.sales + baselineSale,
          orders: branch.orders + visibleOrders / factor,
          customers: branch.customers + visibleCustomers / factor,
          chartMillions: branch.chartMillions * ((branch.sales + baselineSale) / Math.max(branch.sales, 1)),
        };
      }
      const baselineSales = visibleSales / factor;
      return {
        ...branch,
        sales: baselineSales,
        orders: visibleOrders / factor,
        customers: visibleCustomers / factor,
        growth,
        chartMillions: branch.chartMillions * (baselineSales / Math.max(branch.sales, 1)),
      };
    }));
    setMessage(dialog.mode === "sale" ? `New sales recorded for ${dialog.branch.name}.` : `${dialog.branch.name} performance updated.`);
    setDialog(null);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <label className={styles.periodSelect}>
            <CalendarDays aria-hidden="true" size={15} />
            <span className="sr-only">Dashboard date range</span>
            <select
              onChange={(event) => changePeriod(Number(event.target.value))}
              value={periodIndex}
            >
              {salesPeriods.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={14} />
          </label>
        )}
        description="View sales performance across all branches"
        title="Multi-Branch Sales Dashboard"
      />

      <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

      <section aria-label="Sales overview" className={styles.metrics}>
        <MetricCard label="Total Sales (All Branches)" trend={12} value={formatCurrency(totals.sales)} />
        <MetricCard label="Total Orders" trend={8} value={formatNumber(totals.orders)} />
        <MetricCard label="Total Customers" trend={15} value={formatNumber(totals.customers)} />
        <MetricCard label="Avg. Order Value" trend={6} value={formatCurrency(totals.averageOrder)} />
      </section>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <h2>Branch-wise Sales</h2>
          <div aria-label="Branch-wise sales bar chart" className={styles.barChart} role="img">
            <div className={styles.yAxis}><span>15M</span><span>10M</span><span>5M</span><span>0</span></div>
            <div className={styles.plot}>
              {visibleBranches.map((branch) => (
                <div className={styles.barColumn} key={branch.id}>
                  <div className={styles.barVisual}>
                    <strong>৳ {branch.chartMillions.toFixed(1)}M</strong>
                    <span className={styles.bar} style={{ height: `${Math.max(8, branch.chartMillions / maximumChartValue * 88)}%` }} />
                  </div>
                  <small>{branch.name.replace(" Branch", "")}</small>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className={styles.chartCard}>
          <h2>Sales Distribution</h2>
          <div className={styles.distribution}>
            <div aria-label="Dhaka 65 percent, Uttara 24 percent, Chittagong 11 percent" className={styles.donut} role="img">
              <span>৳ {totalChartMillions.toFixed(2)}M</span>
            </div>
            <ul aria-label="Sales distribution legend">
              {visibleBranches.map((branch, index) => (
                <li key={branch.id}>
                  <i style={{ background: branch.color }} />
                  <span>{branch.name.replace(" Branch", "")}</span>
                  <strong>{[65, 24, 11][index]}.0%</strong>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className={styles.performanceCard}>
        <h2>Branch Performance</h2>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Sales performance for all jewellery branches</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Branch Name</th><th scope="col">Location</th><th scope="col">Sales (৳)</th><th scope="col">Orders</th><th scope="col">Customers</th><th scope="col">Growth</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleBranches.map((branch, index) => (
                <tr key={branch.id}>
                  <td>{index + 1}</td>
                  <td><strong>{branch.name}</strong></td>
                  <td>{branch.location}</td>
                  <td>{formatNumber(branch.sales)}</td>
                  <td>{formatNumber(branch.orders)}</td>
                  <td>{formatNumber(branch.customers)}</td>
                  <td><span className={styles.growth}><TrendingUp aria-hidden="true" size={12} /> {branch.growth}%</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${branch.name} performance`} onClick={() => setDialog({ mode: "view", branch })} title="View performance" type="button"><Eye aria-hidden="true" size={14} /></button>
                      <button aria-label={`Edit ${branch.name} performance`} onClick={() => setDialog({ mode: "edit", branch })} title="Edit performance" type="button"><FilePenLine aria-hidden="true" size={14} /></button>
                      <button aria-label={`Record a sale for ${branch.name}`} onClick={() => setDialog({ mode: "sale", branch })} title="Record branch sale" type="button"><Plus aria-hidden="true" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {dialog ? <BranchPerformanceDialog dialog={dialog} onClose={() => setDialog(null)} onSubmit={saveBranch} /> : null}
    </div>
  );
}

function BranchPerformanceDialog({ dialog, onClose, onSubmit }: {
  dialog: Exclude<DialogState, null>;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isView = dialog.mode === "view";
  const isSale = dialog.mode === "sale";
  const title = isView ? "Branch Performance" : isSale ? "Record Branch Sale" : "Edit Branch Performance";

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="branch-performance-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <div className={styles.modalHeader}>
          <div><h2 id="branch-performance-title">{title}</h2><p>{dialog.branch.name} · {dialog.branch.location}</p></div>
          <button aria-label="Close branch performance dialog" onClick={onClose} type="button"><X aria-hidden="true" size={19} /></button>
        </div>

        {isView ? (
          <dl className={styles.details}>
            <div><dt>Sales</dt><dd>{formatCurrency(dialog.branch.sales)}</dd></div>
            <div><dt>Orders</dt><dd>{formatNumber(dialog.branch.orders)}</dd></div>
            <div><dt>Customers</dt><dd>{formatNumber(dialog.branch.customers)}</dd></div>
            <div><dt>Growth</dt><dd className={styles.growth}>+{dialog.branch.growth}%</dd></div>
          </dl>
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formGrid}>
              <label><span>{isSale ? "Sale Amount" : "Sales"}</span><input autoFocus className="field" defaultValue={isSale ? 0 : Math.round(dialog.branch.sales)} min="0" name="sales" required type="number" /></label>
              <label><span>{isSale ? "New Orders" : "Orders"}</span><input className="field" defaultValue={isSale ? 1 : dialog.branch.orders} min="0" name="orders" required type="number" /></label>
              <label><span>{isSale ? "New Customers" : "Customers"}</span><input className="field" defaultValue={isSale ? 0 : dialog.branch.customers} min="0" name="customers" required type="number" /></label>
              {!isSale ? <label><span>Growth (%)</span><input className="field" defaultValue={dialog.branch.growth} name="growth" step="0.1" type="number" /></label> : <input name="growth" type="hidden" value={dialog.branch.growth} />}
            </div>
            <div className={styles.modalActions}>
              <button className="button" onClick={onClose} type="button">Cancel</button>
              <button className="button button--primary" type="submit"><Check aria-hidden="true" size={15} />{isSale ? "Record Sale" : "Save Changes"}</button>
            </div>
          </form>
        )}

        {isView ? <div className={styles.modalActions}><button className="button button--primary" onClick={onClose} type="button">Done</button></div> : null}
      </Card>
    </div>
  );
}
