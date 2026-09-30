"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, Download, Eye, Filter, Pencil, Plus, Save, Trash2 } from "lucide-react";
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
import styles from "./reference-76.module.css";

type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";
type InventoryRow = {
  sku: string;
  name: string;
  category: string;
  purity: string;
  unit: string;
  stock: number;
  reserved: number;
  available: number;
  status: InventoryStatus;
};

const inventoryMetrics: Metric[] = [
  { label: "Total Items", value: "12,548", note: "All Items" },
  { label: "In Stock Items", value: "10,235", trend: "81.56%", note: "" },
  { label: "Low Stock Items", value: "1,245", trend: "9.91%", note: "", tone: "danger" },
  { label: "Out of Stock Items", value: "1,068", trend: "8.53%", note: "", tone: "danger" },
  { label: "Total Inventory Value", value: "৳ 85,45,300", note: "At Cost" },
];

const inventoryRows: InventoryRow[] = [
  { sku: "SKU-1001", name: "Gold Necklace 22K", category: "Necklace", purity: "22K (916)", unit: "Pcs", stock: 18, reserved: 2, available: 16, status: "In Stock" },
  { sku: "SKU-1002", name: "Gold Chain 22K", category: "Chain", purity: "22K (916)", unit: "Pcs", stock: 25, reserved: 3, available: 22, status: "In Stock" },
  { sku: "SKU-1003", name: "Gold Ring 22K", category: "Ring", purity: "22K (916)", unit: "Pcs", stock: 32, reserved: 4, available: 28, status: "In Stock" },
  { sku: "SKU-1004", name: "Gold Bangle 22K", category: "Bangle", purity: "22K (916)", unit: "Pcs", stock: 12, reserved: 1, available: 11, status: "In Stock" },
  { sku: "SKU-1005", name: "Silver Payal", category: "Payal", purity: "Silver (925)", unit: "Pcs", stock: 20, reserved: 0, available: 20, status: "In Stock" },
  { sku: "SKU-1006", name: "Gold Pendant 22K", category: "Pendant", purity: "22K (916)", unit: "Pcs", stock: 10, reserved: 1, available: 9, status: "Low Stock" },
  { sku: "SKU-1007", name: "Diamond Ring", category: "Ring", purity: "18K (750)", unit: "Pcs", stock: 6, reserved: 0, available: 6, status: "Low Stock" },
  { sku: "SKU-1008", name: "Gold Earrings 22K", category: "Earring", purity: "22K (916)", unit: "Pcs", stock: 0, reserved: 0, available: 0, status: "Out of Stock" },
];

const inventoryTabs = ["All Items", "Low Stock", "Out of Stock", "Category Wise"] as const;

export function Reference76InventoryDashboard() {
  const [tab, setTab] = useState<(typeof inventoryTabs)[number]>("All Items");
  const [query, setQuery] = useState("");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => inventoryRows.filter((row) => {
    const matchesQuery = `${row.sku} ${row.name} ${row.category} ${row.purity}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = tab === "All Items" || tab === "Category Wise" || row.status === tab;
    return matchesQuery && matchesTab && (!attentionOnly || row.status !== "In Stock");
  }), [attentionOnly, query, tab]);

  return (
    <div className={base.page}>
      <Intro description="Overview of inventory stock and item availability." title="Inventory Dashboard" />
      <Metrics rows={inventoryMetrics} />
      <Card className={base.tableCard}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={inventoryTabs} />
        {tab === "Category Wise" ? (
          <div className={styles.placeholder}>
            <strong>Inventory by Category</strong>
            <span>Switch to all items to inspect individual stock records.</span>
            <Button onClick={() => setTab("All Items")}>View All Items</Button>
          </div>
        ) : (
          <>
            <div className={base.tableToolbar}>
              <SearchBox onChange={setQuery} placeholder="Search by item name, SKU or barcode..." value={query} />
              <span className={styles.toolbarSpacer} />
              <Button onClick={() => setAttentionOnly((value) => !value)}><Filter size={12} />Filters</Button>
              <Button onClick={() => { exportCsv("inventory-dashboard.csv", ["SKU", "Item", "Category", "Purity", "Unit", "In Stock", "Reserved", "Available", "Status"], visible.map((row) => [row.sku, row.name, row.category, row.purity, row.unit, String(row.stock), String(row.reserved), String(row.available), row.status])); setMessage("Inventory list exported."); }}><Download size={12} />Export</Button>
            </div>
            <div className={base.tableScroller}>
              <table className={`${base.dataTable} ${styles.tableWide}`}>
                <thead><tr><th>#</th><th>SKU</th><th>Item Name</th><th>Category</th><th>Purity</th><th>Unit</th><th>In Stock</th><th>Reserved</th><th>Available</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{visible.map((row, index) => (
                  <tr key={row.sku}>
                    <td>{index + 1}</td><td><b>{row.sku}</b></td><td>{row.name}</td><td>{row.category}</td><td>{row.purity}</td><td>{row.unit}</td><td>{row.stock}</td><td>{row.reserved}</td><td>{row.available}</td>
                    <td><Status tone={row.status === "In Stock" ? "success" : row.status === "Low Stock" ? "warning" : "danger"}>{row.status}</Status></td>
                    <td><span className={base.rowActions}><button aria-label={`Edit ${row.name}`} className={base.iconButton} onClick={() => setMessage(`Editing ${row.name}.`)}><Pencil size={12} /></button><button aria-label={`View ${row.name}`} className={base.iconButton} onClick={() => setMessage(`${row.name}: ${row.available} units available.`)}><Eye size={12} /></button></span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 12,548 entries</span><Pager current={page} last={157} onChange={setPage} /></footer>
          </>
        )}
      </Card>
      <section className={styles.bottomFour}>
        <Card className={styles.summaryCard}><span>Inventory Value (This Month)</span><strong>৳ 85,45,300</strong><small>At Cost</small><small><b>↑ 12.45%</b> vs last month</small></Card>
        <Card className={styles.panel}><h2>Stock by Purity</h2><Donut center="12,548" label="Total Items" slices={[{ label: "22K (916)", value: 68.5, color: "#126fe8", note: "68.5%" }, { label: "18K (750)", value: 15.2, color: "#23aa72", note: "15.2%" }, { label: "Silver (925)", value: 10.1, color: "#f19820", note: "10.1%" }, { label: "Others", value: 6.2, color: "#ef5a48", note: "6.2%" }]} /></Card>
        <Card className={styles.panel}><h2>Stock Movement (This Month)</h2><div className={styles.stockMovement}><div><span>Added</span><b>1,245</b></div><div><span>Used</span><b>984</b></div><div><span>Adjusted</span><b>128</b></div></div></Card>
        <Card className={styles.panel}><h2>Low Stock Alert</h2><ul className={styles.alertList}>{[["Gold Pendant 22K", "9"], ["Diamond Ring", "6"], ["Gold Chain 22K", "22"]].map(([name, count]) => <li key={name}><i><AlertTriangle size={10} /></i><span>{name}</span><b>{count}</b></li>)}</ul><Button className={styles.panelButton} onClick={() => { setTab("Low Stock"); setMessage("Showing low stock items."); }}>View All Low Stock</Button></Card>
      </section>
      <Feedback text={message} />
    </div>
  );
}

type PurchaseStatus = "Pending" | "Partially Received" | "Completed" | "Cancelled";
type PurchaseOrder = {
  po: string;
  date: string;
  supplier: string;
  items: number;
  total: string;
  received: string;
  status: PurchaseStatus;
  expected: string;
};

const purchaseMetrics: Metric[] = [
  { label: "Total POs", value: "156", note: "All Time" },
  { label: "Pending POs", value: "28", trend: "17.95%", note: "" },
  { label: "Partially Received", value: "18", trend: "11.54%", note: "" },
  { label: "Completed POs", value: "98", trend: "62.82%", note: "" },
  { label: "Total PO Value", value: "৳ 1,25,45,600", note: "All Time" },
];

const startingOrders: PurchaseOrder[] = [
  { po: "PO-1001", date: "26 May 2025", supplier: "Rahim Jewellers", items: 12, total: "2,45,600", received: "2,45,600", status: "Completed", expected: "28 May 2025" },
  { po: "PO-1002", date: "25 May 2025", supplier: "Sadik Gold Supply", items: 18, total: "3,65,400", received: "1,25,600", status: "Partially Received", expected: "27 May 2025" },
  { po: "PO-1003", date: "24 May 2025", supplier: "Diamond World Ltd.", items: 8, total: "4,85,000", received: "-", status: "Pending", expected: "30 May 2025" },
  { po: "PO-1004", date: "23 May 2025", supplier: "Gold Touch", items: 15, total: "2,15,300", received: "2,15,300", status: "Completed", expected: "25 May 2025" },
  { po: "PO-1005", date: "22 May 2025", supplier: "Silver Star Traders", items: 20, total: "1,85,600", received: "900", status: "Partially Received", expected: "24 May 2025" },
  { po: "PO-1006", date: "21 May 2025", supplier: "M/S Jewelry House", items: 10, total: "2,25,200", received: "-", status: "Pending", expected: "29 May 2025" },
  { po: "PO-1007", date: "20 May 2025", supplier: "Gold City", items: 14, total: "3,25,000", received: "3,25,000", status: "Completed", expected: "22 May 2025" },
  { po: "PO-1008", date: "19 May 2025", supplier: "Rahim Jewellers", items: 9, total: "1,46,450", received: "-", status: "Pending", expected: "28 May 2025" },
];

const purchaseTabs = ["All Orders", "Pending", "Partially Received", "Completed", "Cancelled"] as const;

function PurchaseOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (row: PurchaseOrder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dateValue = String(data.get("expected"));
    const expected = dateValue ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "30 May 2025";
    onSave({
      po: `PO-${1001 + Math.floor(Math.random() * 8998)}`,
      date: "26 May 2025",
      supplier: String(data.get("supplier")),
      items: Number(data.get("items")),
      total: String(data.get("total")),
      received: "-",
      status: "Pending",
      expected,
    });
  }

  return (
    <Modal description="Create an order for a jewellery supplier." onClose={onClose} title="New Purchase Order">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Supplier</span><input name="supplier" placeholder="Supplier name" required /></label>
        <label><span>Total items</span><input min="1" name="items" required type="number" /></label>
        <label><span>Total value (৳)</span><input inputMode="numeric" name="total" placeholder="0" required /></label>
        <label><span>Expected date</span><input name="expected" required type="date" /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Create Order</Button></footer>
      </form>
    </Modal>
  );
}

export function Reference76PurchaseOrders() {
  const [rows, setRows] = useState(startingOrders);
  const [tab, setTab] = useState<(typeof purchaseTabs)[number]>("All Orders");
  const [query, setQuery] = useState("");
  const [recentOnly, setRecentOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.po} ${row.supplier}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = tab === "All Orders" || row.status === tab;
    return matchesQuery && matchesTab && (!recentOnly || ["26 May 2025", "25 May 2025"].includes(row.date));
  }), [query, recentOnly, rows, tab]);

  return (
    <div className={base.page}>
      <Intro actions={<Button onClick={() => setOpen(true)} primary><Plus size={13} />New Purchase Order</Button>} description="Manage and track all purchase orders." title="Purchase Orders" />
      <Metrics rows={purchaseMetrics} />
      <Card className={base.tableCard}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={purchaseTabs} />
        <div className={base.tableToolbar}>
          <SearchBox onChange={setQuery} placeholder="Search by PO no, supplier..." value={query} />
          <span className={styles.toolbarSpacer} />
          <Button onClick={() => setRecentOnly((value) => !value)}><Filter size={12} />Filters</Button>
          <Button onClick={() => { exportCsv("purchase-orders.csv", ["PO No", "PO Date", "Supplier", "Items", "Total Value", "Received Value", "Status", "Expected Date"], visible.map((row) => [row.po, row.date, row.supplier, String(row.items), row.total, row.received, row.status, row.expected])); setMessage("Purchase orders exported."); }}><Download size={12} />Export</Button>
        </div>
        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.tableWide}`}>
            <thead><tr><th>#</th><th>PO No</th><th>PO Date</th><th>Supplier</th><th>Total Items</th><th>Total Value (৳)</th><th>Received Value (৳)</th><th>Status</th><th>Expected Date</th><th>Actions</th></tr></thead>
            <tbody>{visible.map((row, index) => (
              <tr key={row.po}>
                <td>{index + 1}</td><td><b>{row.po}</b></td><td>{row.date}</td><td>{row.supplier}</td><td>{row.items}</td><td>{row.total}</td><td>{row.received}</td>
                <td><Status tone={row.status === "Completed" ? "success" : row.status === "Pending" || row.status === "Partially Received" ? "warning" : "danger"}>{row.status}</Status></td><td>{row.expected}</td>
                <td><span className={base.rowActions}><button aria-label={`Edit ${row.po}`} className={base.iconButton} onClick={() => setMessage(`Editing ${row.po}.`)}><Pencil size={12} /></button><button aria-label={`Delete ${row.po}`} className={`${base.iconButton} ${base.iconDanger}`} onClick={() => { setRows((items) => items.filter((item) => item.po !== row.po)); setMessage(`${row.po} deleted.`); }}><Trash2 size={12} /></button></span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 156 entries</span><Pager current={page} last={20} onChange={setPage} /></footer>
      </Card>
      <section className={styles.bottomFour}>
        <Card className={styles.summaryCard}><span>Total Ordered (This Month)</span><strong>৳ 24,85,600</strong><small>23 Orders</small></Card>
        <Card className={styles.summaryCard}><span>Total Received (This Month)</span><strong>৳ 15,65,200</strong><small>14 Orders</small></Card>
        <Card className={styles.summaryCard}><span>Total Pending (This Month)</span><strong>৳ 9,20,400</strong><small>9 Orders</small></Card>
        <Card className={styles.summaryCard}><span>Avg. Order Value</span><strong>৳ 2,07,133</strong><small>This Month</small></Card>
      </section>
      <Feedback text={message} />
      {open ? <PurchaseOrderForm onClose={() => setOpen(false)} onSave={(row) => { setRows((items) => [row, ...items]); setOpen(false); setMessage(`${row.po} created.`); }} /> : null}
    </div>
  );
}
