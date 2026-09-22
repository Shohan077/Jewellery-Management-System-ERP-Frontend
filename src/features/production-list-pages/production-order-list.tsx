"use client";

import { CheckCircle2, ClipboardList, Cog, PauseCircle, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import {
  defaultListFilters,
  productionKarigars,
  productionOrders,
  productionOrderStatuses,
  productionSummary,
  type ProductionOrderListItem,
} from "./production-list-data";
import { DetailsDialog, ProductionPageHeader, SummaryCard, ViewButton } from "./production-list-ui";
import styles from "./production-list-pages.module.css";

type Filters = typeof defaultListFilters;

const metricIcons = [<ClipboardList key="orders" size={26} />, <Cog key="progress" size={27} />, <CheckCircle2 key="completed" size={27} />, <PauseCircle key="hold" size={27} />];

function StatusPill({ status }: { status: ProductionOrderListItem["status"] }) {
  const statusClass = status === "Completed" ? styles.completed : status === "On Hold" ? styles.onHold : styles.inProgress;
  return <span className={`${styles.statusPill} ${statusClass}`}>{status}</span>;
}

export function ProductionOrderListPage() {
  const [draftFilters, setDraftFilters] = useState<Filters>(defaultListFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultListFilters);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrderListItem | null>(null);
  const [feedback, setFeedback] = useState("");

  const visibleOrders = useMemo(() => productionOrders.filter((order) => {
    const matchesDate = order.orderDateIso >= appliedFilters.fromDate && order.orderDateIso <= appliedFilters.toDate;
    const matchesStatus = appliedFilters.status === "All" || order.status === appliedFilters.status;
    const matchesKarigar = appliedFilters.karigar === "All" || order.karigar === appliedFilters.karigar;
    return matchesDate && matchesStatus && matchesKarigar;
  }), [appliedFilters]);

  function applyFilters() {
    if (draftFilters.fromDate > draftFilters.toDate) {
      setFeedback("Date From must be before or equal to Date To.");
      return;
    }
    setAppliedFilters({ ...draftFilters });
    setFeedback("Production order filters applied.");
  }

  function resetFilters() {
    setDraftFilters(defaultListFilters);
    setAppliedFilters(defaultListFilters);
    setFeedback("Production order filters were reset.");
  }

  return (
    <div className={styles.page}>
      <ProductionPageHeader actionHref="/manufacturing/work-orders/new" actionLabel="Create Production Order" title="Production Order" />

      <Card className={styles.filterCard}>
        <div className={styles.filters}>
          <label><span>Date From</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label><span>Date To</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label><span>Order Status</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))} value={draftFilters.status}>{productionOrderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label><span>Karigar</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, karigar: event.target.value }))} value={draftFilters.karigar}>{productionKarigars.map((karigar) => <option key={karigar}>{karigar}</option>)}</select></label>
          <button className={styles.searchButton} onClick={applyFilters} type="button"><Search aria-hidden="true" size={15} />Search</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw aria-hidden="true" size={15} />Reset</button>
        </div>
        <p aria-live="polite" className={feedback.startsWith("Date") ? styles.filterError : "sr-only"} role={feedback.startsWith("Date") ? "alert" : "status"}>{feedback}</p>
      </Card>

      <section aria-label="Production order summary" className={styles.summaryGrid}>
        {productionSummary.map((metric, index) => <SummaryCard icon={metricIcons[index]} key={metric.label} label={metric.label} tone={metric.tone} value={metric.value} />)}
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <caption className="sr-only">Production orders</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Order No</th><th scope="col">Item Name</th><th scope="col">Category</th><th scope="col">Quantity</th><th scope="col">Karigar</th><th scope="col">Status</th><th scope="col">Order Date</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleOrders.map((order, index) => <tr key={order.id}><td>{index + 1}</td><td><strong>{order.orderNo}</strong></td><td>{order.itemName}</td><td>{order.category}</td><td>{order.quantity}</td><td>{order.karigar}</td><td><StatusPill status={order.status} /></td><td>{order.orderDate}</td><td><ViewButton label={`View ${order.orderNo}`} onClick={() => setSelectedOrder(order)} /></td></tr>)}
              {!visibleOrders.length ? <tr><td className={styles.emptyState} colSpan={9}><strong>No production orders found</strong><span>Adjust the date, status, or karigar filters and search again.</span><button onClick={resetFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOrder ? <DetailsDialog description="Production order details and current workflow status." onClose={() => setSelectedOrder(null)} title={selectedOrder.orderNo}>
        <div className={styles.detailsBody}>
          <div className={styles.detailsLead}><div><span>Item</span><strong>{selectedOrder.itemName}</strong><small>{selectedOrder.category}</small></div><StatusPill status={selectedOrder.status} /></div>
          <dl><div><dt>Karigar</dt><dd>{selectedOrder.karigar}</dd></div><div><dt>Quantity</dt><dd>{selectedOrder.quantity} pcs</dd></div><div><dt>Order Date</dt><dd>{selectedOrder.orderDate}</dd></div><div><dt>Order Number</dt><dd>{selectedOrder.orderNo}</dd></div></dl>
          <footer><button className={styles.searchButton} onClick={() => setSelectedOrder(null)} type="button">Done</button></footer>
        </div>
      </DetailsDialog> : null}
    </div>
  );
}
