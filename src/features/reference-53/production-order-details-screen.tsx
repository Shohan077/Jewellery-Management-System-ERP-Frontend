"use client";

import { useState } from "react";
import { ChevronDown, FilePenLine, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Notice, StatusPill } from "./shared";
import styles from "./production-order-details-screen.module.css";

const orderItems = [
  { code: "DS-1001", item: "Gold Necklace", purity: "22K", weight: "35.250", quantity: 1, totalWeight: "35.250", status: "In Progress" },
  { code: "DS-1002", item: "Gold Ring", purity: "22K", weight: "8.750", quantity: 2, totalWeight: "17.500", status: "In Progress" },
  { code: "DS-1003", item: "Gold Bracelet", purity: "22K", weight: "25.000", quantity: 1, totalWeight: "25.000", status: "Completed" },
  { code: "DS-1004", item: "Gold Earrings", purity: "22K", weight: "3.500", quantity: 4, totalWeight: "14.000", status: "In Progress" },
  { code: "DS-1005", item: "Gold Pendant", purity: "22K", weight: "6.000", quantity: 1, totalWeight: "6.000", status: "Pending" },
] as const;

const tabs = ["Order Items", "Material Issue", "WIP", "Costing", "Notes"] as const;
type Tab = (typeof tabs)[number];

function OrderItemsTable() {
  return (
    <div className={styles.tableScroller}>
      <table>
        <caption className="sr-only">Production order jewellery items</caption>
        <thead><tr><th>#</th><th>Design Code</th><th>Item Name</th><th>Purity</th><th>Weight (gm)</th><th>Quantity</th><th>Total Weight</th><th>Status</th></tr></thead>
        <tbody>{orderItems.map((item, index) => <tr key={item.code}><td>{index + 1}</td><td><strong>{item.code}</strong></td><td>{item.item}</td><td>{item.purity}</td><td>{item.weight}</td><td>{item.quantity}</td><td>{item.totalWeight}</td><td><StatusPill tone={item.status === "Completed" ? "success" : item.status === "Pending" ? "warning" : "info"}>{item.status}</StatusPill></td></tr>)}</tbody>
      </table>
    </div>
  );
}

function TabContent({ tab }: { tab: Exclude<Tab, "Order Items"> }) {
  const content = {
    "Material Issue": ["22K Gold — 128.400 gm issued", "Solder — 2.250 gm issued", "Findings — 9 sets issued"],
    WIP: ["Casting completed", "Stone setting in progress", "Polishing queued"],
    Costing: ["Gold value — ৳ 8,12,600", "Labour — ৳ 42,500", "Other costs — ৳ 20,330"],
    Notes: ["Priority order for June delivery.", "Final QC required before dispatch.", "Customer approved the supplied designs."],
  }[tab];
  return <div className={styles.tabPlaceholder}><h3>{tab}</h3><ul>{content.map((line) => <li key={line}>{line}</li>)}</ul></div>;
}

export function Reference53ProductionOrderDetails() {
  const [activeTab, setActiveTab] = useState<Tab>("Order Items");
  const [orderStatus, setOrderStatus] = useState("In Progress");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className={styles.page}>
      <Card className={styles.orderCard}>
        <section className={styles.orderMeta}>
          <div className={styles.primaryMeta}><span>Production Order</span><strong>PO-2025-00045</strong><StatusPill tone={orderStatus === "Completed" ? "success" : orderStatus === "On Hold" ? "warning" : "success"}>{orderStatus}</StatusPill></div>
          <div><span>Order Date</span><strong>28 May 2025</strong></div>
          <div><span>Delivery Date</span><strong>10 Jun 2025</strong></div>
          <div><span>Karigar</span><strong>Abdul Karim</strong></div>
          <div><span>Total Items</span><strong>5</strong></div>
          <div><span>Total Weight</span><strong>125.750 gm</strong></div>
        </section>

        <nav aria-label="Production order sections" className={styles.tabs}>{tabs.map((tab) => <button aria-current={activeTab === tab ? "page" : undefined} key={tab} onClick={() => setActiveTab(tab)} type="button">{tab}</button>)}</nav>
        {activeTab === "Order Items" ? <OrderItemsTable /> : <TabContent tab={activeTab} />}
      </Card>

      {message ? <Notice>{message}</Notice> : null}

      <section className={styles.bottomGrid}>
        <Card className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryNumbers}><span><small>Total Items</small><strong>5</strong></span><span><small>Total Quantity</small><strong>9</strong></span><span><small>Total Weight</small><strong>125.750 gm</strong></span></div>
          <div className={styles.estimated}><span>Total Estimated Cost</span><strong>৳ 8,75,430</strong></div>
        </Card>

        <Card className={styles.progressCard}>
          <h2>Progress Overview</h2>
          <div className={styles.progressRow}><div><i style={{ width: "60%" }} /></div><strong>60%</strong></div>
          <div className={styles.progressStats}><span><small>Completed</small><strong className={styles.green}>1</strong></span><span><small>In Progress</small><strong className={styles.blue}>3</strong></span><span><small>Pending</small><strong className={styles.orange}>1</strong></span><span><small>On Hold</small><strong>0</strong></span></div>
        </Card>
      </section>

      <Card className={styles.actionBar}>
        <button onClick={() => window.print()} type="button"><Printer size={14} />Print Order</button>
        <button onClick={() => setMessage("Order editing is enabled for this preview.")} type="button"><FilePenLine size={14} />Edit Order</button>
        <div className={styles.statusControl}>
          <button className={styles.updateButton} onClick={() => setStatusMenuOpen((open) => !open)} type="button">Update Status<ChevronDown size={14} /></button>
          {statusMenuOpen ? <div className={styles.statusMenu}>{["In Progress", "Completed", "On Hold"].map((status) => <button key={status} onClick={() => { setOrderStatus(status); setStatusMenuOpen(false); setMessage(`Order status updated to ${status}.`); }} type="button">{status}</button>)}</div> : null}
        </div>
      </Card>
    </div>
  );
}
