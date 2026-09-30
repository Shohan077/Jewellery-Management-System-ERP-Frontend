"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Download, Eye, Filter, Link2, Plus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  base,
  Button,
  Feedback,
  Intro,
  Modal,
  Pager,
  SearchBox,
  Status,
  Tabs,
  exportCsv,
} from "../reference-73/shared";
import styles from "./order-management.module.css";

type OrderStatus = "In Progress" | "Completed" | "Pending" | "Cancelled";

type SalesOrder = {
  orderNo: string;
  customer: string;
  item: string;
  weight: string;
  orderDate: string;
  dueDate: string;
  status: OrderStatus;
};

const orders: SalesOrder[] = [
  { orderNo: "ORD-1001", customer: "Rahim Ahmed", item: "Gold Necklace 22K", weight: "12.450", orderDate: "24 May 2025", dueDate: "28 May 2025", status: "In Progress" },
  { orderNo: "ORD-1002", customer: "Sadia Akter", item: "Diamond Ring", weight: "2.850", orderDate: "24 May 2025", dueDate: "27 May 2025", status: "Completed" },
  { orderNo: "ORD-1003", customer: "Karim Uddin", item: "Gold Bracelet 22K", weight: "8.620", orderDate: "23 May 2025", dueDate: "27 May 2025", status: "In Progress" },
  { orderNo: "ORD-1004", customer: "Nusrat Jahan", item: "Gold Earrings 22K", weight: "5.260", orderDate: "23 May 2025", dueDate: "26 May 2025", status: "Pending" },
  { orderNo: "ORD-1005", customer: "Arif Hossain", item: "Gold Chain 22K", weight: "18.400", orderDate: "22 May 2025", dueDate: "29 May 2025", status: "In Progress" },
  { orderNo: "ORD-1006", customer: "Salim Karigar", item: "Silver Payal", weight: "15.600", orderDate: "22 May 2025", dueDate: "26 May 2025", status: "Completed" },
  { orderNo: "ORD-1007", customer: "Monir Islam", item: "Gold Pendant 22K", weight: "6.780", orderDate: "21 May 2025", dueDate: "27 May 2025", status: "In Progress" },
  { orderNo: "ORD-1008", customer: "Fahim Ahmed", item: "Diamond Bracelet", weight: "4.560", orderDate: "21 May 2025", dueDate: "28 May 2025", status: "Pending" },
];

const orderTabs = ["All Orders (128)", "In Progress (46)", "Completed (56)", "Pending (18)", "Cancelled (8)"] as const;
type OrderTab = (typeof orderTabs)[number];

const summaries = [
  { label: "Total Orders", value: "128", note: "All Orders" },
  { label: "In Progress", value: "46", note: "35.9%" },
  { label: "Completed", value: "56", note: "43.8%" },
  { label: "Pending", value: "18", note: "14.1%" },
  { label: "Cancelled", value: "8", note: "6.2%" },
] as const;

function statusFromTab(tab: OrderTab): OrderStatus | null {
  if (tab.startsWith("In Progress")) return "In Progress";
  if (tab.startsWith("Completed")) return "Completed";
  if (tab.startsWith("Pending")) return "Pending";
  if (tab.startsWith("Cancelled")) return "Cancelled";
  return null;
}

function statusTone(status: OrderStatus) {
  if (status === "Completed") return "success" as const;
  if (status === "In Progress") return "info" as const;
  if (status === "Pending") return "warning" as const;
  return "danger" as const;
}

function NewOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (order: SalesOrder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dueDateValue = String(data.get("dueDate"));
    const dueDate = dueDateValue
      ? new Date(`${dueDateValue}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "30 May 2025";

    onSave({
      orderNo: `ORD-${1009 + Math.floor(Math.random() * 8000)}`,
      customer: String(data.get("customer")),
      item: String(data.get("item")),
      weight: Number(data.get("weight")).toFixed(3),
      orderDate: "26 May 2025",
      dueDate,
      status: "Pending",
    });
  }

  return (
    <Modal description="Create a new customer jewellery order." onClose={onClose} title="New Order">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Customer</span><input name="customer" placeholder="Customer name" required /></label>
        <label><span>Item / Design</span><input name="item" placeholder="Jewellery item or design" required /></label>
        <label><span>Weight (g)</span><input min="0.001" name="weight" required step="0.001" type="number" /></label>
        <label><span>Due date</span><input name="dueDate" required type="date" /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Create Order</Button></footer>
      </form>
    </Modal>
  );
}

export function Reference77OrderManagement() {
  const [rows, setRows] = useState(orders);
  const [tab, setTab] = useState<OrderTab>("All Orders (128)");
  const [query, setQuery] = useState("");
  const [itemType, setItemType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => rows.filter((row) => {
    const searchText = `${row.orderNo} ${row.customer} ${row.item}`.toLowerCase();
    const selectedStatus = statusFromTab(tab);
    const matchesTab = selectedStatus === null || row.status === selectedStatus;
    const matchesStatus = status === "All Status" || row.status === status;
    const matchesType = itemType === "All Types"
      || (itemType === "Gold Jewellery" && row.item.includes("Gold"))
      || (itemType === "Diamond Jewellery" && row.item.includes("Diamond"))
      || (itemType === "Silver Jewellery" && row.item.includes("Silver"));
    const matchesUrgent = !urgentOnly || ["26 May 2025", "27 May 2025"].includes(row.dueDate);
    return searchText.includes(query.toLowerCase()) && matchesTab && matchesStatus && matchesType && matchesUrgent;
  }), [itemType, query, rows, status, tab, urgentOnly]);

  return (
    <div className={base.page}>
      <Intro
        actions={<Button onClick={() => setOpen(true)} primary><Plus size={13} />New Order</Button>}
        description="Track and manage customer orders"
        title="Order Management"
      />

      <Card className={`${base.tableCard} ${styles.ordersCard}`}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={orderTabs} />
        <div className={`${base.tableToolbar} ${styles.toolbar}`}>
          <SearchBox onChange={setQuery} placeholder="Search by order no, customer name..." value={query} />
          <select aria-label="Filter by item type" onChange={(event) => setItemType(event.target.value)} value={itemType}>
            <option>All Types</option>
            <option>Gold Jewellery</option>
            <option>Diamond Jewellery</option>
            <option>Silver Jewellery</option>
          </select>
          <select aria-label="Filter by status" onChange={(event) => setStatus(event.target.value)} value={status}>
            <option>All Status</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          <span className={styles.toolbarSpacer} />
          <Button className={urgentOnly ? styles.activeFilter : ""} onClick={() => setUrgentOnly((value) => !value)}><Filter size={12} />Filters</Button>
          <Button onClick={() => {
            exportCsv(
              "sales-orders.csv",
              ["Order No", "Customer", "Item / Design", "Weight (g)", "Order Date", "Due Date", "Status"],
              visible.map((row) => [row.orderNo, row.customer, row.item, row.weight, row.orderDate, row.dueDate, row.status]),
            );
            setMessage("Order list exported.");
          }}><Download size={12} />Export</Button>
        </div>

        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.orderTable}`}>
            <thead><tr><th>#</th><th>Order No</th><th>Customer</th><th>Item / Design</th><th>Weight (g)</th><th>Order Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{visible.length ? visible.map((order, index) => (
              <tr key={order.orderNo}>
                <td>{index + 1}</td>
                <td><b>{order.orderNo}</b></td>
                <td>{order.customer}</td>
                <td>{order.item}</td>
                <td>{order.weight}</td>
                <td>{order.orderDate}</td>
                <td>{order.dueDate}</td>
                <td><Status tone={statusTone(order.status)}>{order.status}</Status></td>
                <td><span className={base.rowActions}>
                  <button aria-label={`Open ${order.orderNo}`} className={base.iconButton} onClick={() => setMessage(`${order.orderNo} opened for editing.`)}><Link2 size={12} /></button>
                  <button aria-label={`View ${order.orderNo}`} className={base.iconButton} onClick={() => setMessage(`${order.orderNo}: ${order.customer}, due ${order.dueDate}.`)}><Eye size={12} /></button>
                </span></td>
              </tr>
            )) : <tr><td className={base.emptyCell} colSpan={9}>No orders match the selected filters.</td></tr>}</tbody>
          </table>
        </div>

        <footer className={base.tableFooter}>
          <span>Showing 1 to {visible.length} of 128 entries</span>
          <Pager current={page} last={16} onChange={setPage} />
        </footer>
      </Card>

      <section className={styles.summaryGrid}>
        {summaries.map((summary) => (
          <Card as="article" className={styles.summaryCard} key={summary.label}>
            <span>{summary.label}</span>
            <strong>{summary.value}</strong>
            <small className={summary.label === "Total Orders" ? styles.neutral : ""}>{summary.note}</small>
          </Card>
        ))}
      </section>

      <Feedback text={message} />
      {open ? <NewOrderForm onClose={() => setOpen(false)} onSave={(order) => {
        setRows((current) => [order, ...current]);
        setOpen(false);
        setMessage(`${order.orderNo} created successfully.`);
      }} /> : null}
    </div>
  );
}
