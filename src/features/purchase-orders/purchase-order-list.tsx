"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Plus, Search, XCircle } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatPurchaseOrderCurrency,
  purchaseOrders,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "./purchase-order-data";
import styles from "./purchase-order-list.module.css";

const statuses = ["All Status", "Pending", "Approved", "Received", "Partial", "Cancelled"] as const;
type StatusFilter = (typeof statuses)[number];

function StatusBadge({ status }: { status: PurchaseOrderStatus }) {
  return <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

export function PurchaseOrderList() {
  const params = useSearchParams();
  const createdNo = params.get("created");
  const createdSupplier = params.get("supplier");
  const createdTotal = Number(params.get("total"));
  const initialRecords = useMemo<PurchaseOrder[]>(() => {
    if (!createdNo || !createdSupplier || !Number.isFinite(createdTotal)) return purchaseOrders;
    return [{ id: 7, poNo: createdNo, supplier: createdSupplier, purchaseDate: "12 Apr 2025", expectedDate: "15 Apr 2025", total: createdTotal, status: "Pending" }, ...purchaseOrders];
  }, [createdNo, createdSupplier, createdTotal]);
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [dateRange, setDateRange] = useState("01 Apr 2025 - 12 Apr 2025");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [message, setMessage] = useState(createdNo ? `${createdNo} was saved successfully.` : "");

  const filteredRecords = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((order) => {
      const matchesSearch = !search || order.poNo.toLowerCase().includes(search) || order.supplier.toLowerCase().includes(search);
      const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
      const matchesDate = dateRange === "All Dates" || order.purchaseDate.endsWith("Apr 2025");
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [dateRange, deferredQuery, records, statusFilter]);

  function updateStatus(id: number, status: PurchaseOrderStatus) {
    const selected = records.find((order) => order.id === id);
    setRecords((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setOpenMenu(null);
    setMessage(`${selected?.poNo ?? "Purchase order"} marked ${status.toLowerCase()}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<Link className={`button button--primary ${styles.blueButton}`} href="/purchase-orders/new"><Plus size={17} />New Purchase Order</Link>}
        description="View and manage all purchase orders"
        title="Purchase Order List"
      />

      <Card className={styles.card}>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search purchase orders</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Search by PO no, supplier..." type="search" value={query} />
          </label>
          <label className={styles.selectWrap}>
            <CalendarDays aria-hidden="true" size={16} />
            <span className="sr-only">Purchase order date range</span>
            <select onChange={(event) => setDateRange(event.target.value)} value={dateRange}>
              <option>01 Apr 2025 - 12 Apr 2025</option><option>All Dates</option><option>Last 7 Days</option>
            </select>
          </label>
          <select aria-label="Filter purchase orders by status" className="select" onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} value={statusFilter}>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Purchase orders</caption>
            <thead><tr><th scope="col">#</th><th scope="col">PO No</th><th scope="col">Supplier</th><th scope="col">Purchase Date</th><th scope="col">Expected Date</th><th scope="col">Total (৳)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {filteredRecords.map((order, index) => (
                <tr key={`${order.poNo}-${order.id}`}>
                  <td>{index + 1}</td><td><strong>{order.poNo}</strong></td><td>{order.supplier}</td><td>{order.purchaseDate}</td><td>{order.expectedDate}</td><td>{formatPurchaseOrderCurrency(order.total)}</td><td><StatusBadge status={order.status} /></td>
                  <td className={styles.actionCell}>
                    <button aria-expanded={openMenu === order.id} aria-label={`Actions for ${order.poNo}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === order.id ? null : order.id)} type="button"><MoreHorizontal size={18} /></button>
                    {openMenu === order.id ? (
                      <div className={styles.menu} role="menu">
                        <button onClick={() => { setMessage(`Viewing ${order.poNo} for ${order.supplier}.`); setOpenMenu(null); }} role="menuitem" type="button"><Eye size={14} />View details</button>
                        <button onClick={() => updateStatus(order.id, "Approved")} role="menuitem" type="button"><Check size={14} />Approve</button>
                        <button onClick={() => updateStatus(order.id, "Cancelled")} role="menuitem" type="button"><XCircle size={14} />Cancel order</button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? <tr><td className={styles.empty} colSpan={8}>No purchase orders match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.footer}>
        <p>Showing 1 to {filteredRecords.length} of {filteredRecords.length} records</p>
        <nav aria-label="Purchase order pagination" className={styles.pagination}>
          <button aria-label="First page" disabled type="button">«</button><button aria-label="Previous page" disabled type="button"><ChevronLeft size={15} /></button><button aria-current="page" className={styles.currentPage} type="button">1</button><button aria-label="Next page" disabled type="button"><ChevronRight size={15} /></button><button aria-label="Last page" disabled type="button">»</button>
        </nav>
      </footer>
    </div>
  );
}
