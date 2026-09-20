"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  calculateItemAmount,
  formatPurchaseOrderMoney,
  INITIAL_PURCHASE_ORDER_SNAPSHOT,
  initialPurchaseOrders,
  parsePurchaseOrders,
  PURCHASE_ORDER_STORAGE_EVENT,
  PURCHASE_ORDER_STORAGE_KEY,
  supplierOptions,
  type PurchaseOrder,
  type PurchaseOrderItem,
} from "./purchase-order-data";
import styles from "./purchase-orders.module.css";

const defaultOrder = initialPurchaseOrders[0];
const blankItem = { name: "", category: "", purity: "22K", weight: "", rate: "" };

type ItemDraft = typeof blankItem;

export function PurchaseOrderForm() {
  const router = useRouter();
  const [orderNo, setOrderNo] = useState(defaultOrder.orderNo);
  const [orderDate, setOrderDate] = useState(defaultOrder.orderDate);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(defaultOrder.expectedDeliveryDate);
  const [supplier, setSupplier] = useState(defaultOrder.supplier);
  const [purchaseType, setPurchaseType] = useState(defaultOrder.purchaseType);
  const [remarks, setRemarks] = useState(defaultOrder.remarks);
  const [additionalNotes, setAdditionalNotes] = useState(defaultOrder.additionalNotes);
  const [items, setItems] = useState<PurchaseOrderItem[]>(defaultOrder.items);
  const [status, setStatus] = useState<PurchaseOrder["status"]>(defaultOrder.status);
  const [editingOriginalNo, setEditingOriginalNo] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [itemDraft, setItemDraft] = useState<ItemDraft>(blankItem);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const editNumber = new URLSearchParams(window.location.search).get("edit");
    if (!editNumber) return;
    const snapshot = window.localStorage.getItem(PURCHASE_ORDER_STORAGE_KEY) ?? INITIAL_PURCHASE_ORDER_SNAPSHOT;
    const order = parsePurchaseOrders(snapshot).find((entry) => entry.orderNo === editNumber);
    const timer = window.setTimeout(() => {
      if (!order) {
        setError(`Purchase order ${editNumber} could not be found.`);
        return;
      }
      setEditingOriginalNo(order.orderNo);
      setOrderNo(order.orderNo);
      setOrderDate(order.orderDate);
      setExpectedDeliveryDate(order.expectedDeliveryDate);
      setSupplier(order.supplier);
      setPurchaseType(order.purchaseType);
      setRemarks(order.remarks);
      setAdditionalNotes(order.additionalNotes);
      setItems(order.items.length ? order.items : [{ id: `${order.orderNo}-SUMMARY`, name: "Jewellery assortment", category: order.purchaseType, purity: "22K", weight: 1, rate: order.totalAmount }]);
      setStatus(order.status);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!addDialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAddDialogOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [addDialogOpen]);

  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + item.weight, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + calculateItemAmount(item), 0), [items]);

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weight = Number(itemDraft.weight);
    const rate = Number(itemDraft.rate);
    if (!itemDraft.name.trim() || !itemDraft.category.trim() || weight <= 0 || rate <= 0) {
      setError("Enter an item name, category, weight, and rate greater than zero.");
      return;
    }
    setItems((current) => [...current, {
      id: `POI-${Date.now()}`,
      name: itemDraft.name.trim(),
      category: itemDraft.category.trim(),
      purity: itemDraft.purity,
      weight,
      rate,
    }]);
    setItemDraft(blankItem);
    setAddDialogOpen(false);
    setError("");
    setMessage(`${itemDraft.name.trim()} was added to the order.`);
  }

  function removeItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.filter((entry) => entry.id !== id));
    setMessage(item ? `${item.name} was removed.` : "Item removed.");
    setError("");
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderNo.trim() || !supplier || !orderDate || !expectedDeliveryDate) {
      setError("Complete all required order details before saving.");
      return;
    }
    if (expectedDeliveryDate < orderDate) {
      setError("Expected delivery date cannot be before the order date.");
      return;
    }
    if (!items.length) {
      setError("Add at least one item before saving the purchase order.");
      return;
    }

    let orders = initialPurchaseOrders;
    try {
      orders = parsePurchaseOrders(window.localStorage.getItem(PURCHASE_ORDER_STORAGE_KEY) ?? INITIAL_PURCHASE_ORDER_SNAPSHOT);
    } catch {
      // Continue with the seeded records if storage is unavailable.
    }
    const normalizedNo = orderNo.trim().toUpperCase();
    const duplicate = orders.some((order) => order.orderNo === normalizedNo && order.orderNo !== editingOriginalNo && order.orderNo !== defaultOrder.orderNo);
    if (duplicate) {
      setError(`${normalizedNo} already exists. Use a unique purchase order number.`);
      return;
    }
    const order: PurchaseOrder = {
      orderNo: normalizedNo,
      orderDate,
      expectedDeliveryDate,
      supplier,
      purchaseType,
      remarks: remarks.trim(),
      additionalNotes: additionalNotes.trim(),
      itemCount: items.length,
      items,
      totalAmount,
      status,
    };
    const next = [order, ...orders.filter((entry) => entry.orderNo !== normalizedNo && entry.orderNo !== editingOriginalNo)];
    try {
      window.localStorage.setItem(PURCHASE_ORDER_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(PURCHASE_ORDER_STORAGE_EVENT));
    } catch {
      setError("The order is valid, but browser storage is unavailable.");
      return;
    }
    router.push(`/purchases/orders?saved=${encodeURIComponent(normalizedNo)}`);
  }

  return (
    <div className={styles.formPage}>
      <PageHeader description="Create and manage supplier purchase orders" title={editingOriginalNo ? "Edit Purchase Order" : "Purchase Order"} />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/dashboard">Home</Link><span aria-hidden="true">›</span><Link href="/purchases">Purchase</Link><span aria-hidden="true">›</span><span aria-current="page">Purchase Order</span>
      </nav>

      {message ? <p aria-live="polite" className={`${styles.feedback} ${styles.success}`}><CheckCircle2 aria-hidden="true" size={16} />{message}</p> : null}
      {error ? <p aria-live="assertive" className={`${styles.feedback} ${styles.error}`}>{error}</p> : null}

      <Card className={styles.formCard}>
        <form onSubmit={saveOrder}>
          <div className={styles.orderFields}>
            <label><span>Supplier <b>*</b></span><select className="select" onChange={(event) => setSupplier(event.target.value)} required value={supplier}>{supplierOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Order Date <b>*</b></span><input className="field" onChange={(event) => setOrderDate(event.target.value)} required type="date" value={orderDate} /></label>
            <label><span>Expected Delivery Date</span><input className="field" min={orderDate} onChange={(event) => setExpectedDeliveryDate(event.target.value)} type="date" value={expectedDeliveryDate} /></label>
            <label><span>Reference No</span><input className="field" onChange={(event) => setOrderNo(event.target.value)} required value={orderNo} /></label>
            <label><span>Purchase Type <b>*</b></span><select className="select" onChange={(event) => setPurchaseType(event.target.value)} value={purchaseType}><option>Gold Jewellery</option><option>Diamond Jewellery</option><option>Silver Jewellery</option><option>Raw Material</option><option>Gemstone Jewellery</option></select></label>
            <label><span>Remarks</span><input className="field" onChange={(event) => setRemarks(event.target.value)} placeholder="Enter remarks..." value={remarks} /></label>
            {editingOriginalNo ? <label><span>Status</span><select className="select" onChange={(event) => setStatus(event.target.value as PurchaseOrder["status"])} value={status}><option>Pending</option><option>Approved</option><option>Received</option><option>Cancelled</option></select></label> : null}
          </div>

          <div className={styles.sectionHeading}><h2>Items</h2><button className="button button--primary" onClick={() => { setAddDialogOpen(true); setError(""); }} type="button"><Plus aria-hidden="true" size={16} />Add Item</button></div>
          <div className={styles.tableScroller}>
            <table className={styles.itemTable}>
              <caption className="sr-only">Purchase order items</caption>
              <thead><tr><th scope="col">SL</th><th scope="col">Item Name</th><th scope="col">Category</th><th scope="col">Purity</th><th scope="col">Weight (gm)</th><th scope="col">Expected Rate (৳)</th><th scope="col">Amount (৳)</th><th scope="col">Action</th></tr></thead>
              <tbody>{items.length ? items.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td><strong>{item.name}</strong></td><td>{item.category}</td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{formatPurchaseOrderMoney(item.rate)}</td><td>{formatPurchaseOrderMoney(calculateItemAmount(item))}</td><td><button aria-label={`Remove ${item.name}`} className={styles.deleteButton} onClick={() => removeItem(item.id)} type="button"><Trash2 aria-hidden="true" size={16} /></button></td></tr>) : <tr><td className={styles.emptyItems} colSpan={8}>No items added. Use Add Item to continue.</td></tr>}</tbody>
            </table>
          </div>

          <div className={styles.orderBottom}>
            <label><span>Additional Notes</span><textarea className="textarea" onChange={(event) => setAdditionalNotes(event.target.value)} placeholder="Enter additional notes..." value={additionalNotes} /></label>
            <dl className={styles.summary}><div><dt>Total Items</dt><dd>{items.length}</dd></div><div><dt>Total Weight</dt><dd>{totalWeight.toFixed(3)} gm</dd></div><div><dt>Estimated Amount</dt><dd>৳ {formatPurchaseOrderMoney(totalAmount)}</dd></div></dl>
          </div>
          <div className={styles.formActions}><Link className="button" href="/purchases/orders">Cancel</Link><button className="button button--primary" type="submit"><Save aria-hidden="true" size={17} />Save Purchase Order</button></div>
        </form>
      </Card>

      {addDialogOpen ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setAddDialogOpen(false); }}><Card aria-labelledby="add-order-item-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><header className={styles.modalHeader}><div><h2 id="add-order-item-title">Add order item</h2><p>Enter the product and expected purchase details.</p></div><button aria-label="Close add item dialog" onClick={() => setAddDialogOpen(false)} type="button"><X aria-hidden="true" size={18} /></button></header><form className={styles.modalForm} onSubmit={addItem}><label><span>Item Name <b>*</b></span><input autoFocus className="field" onChange={(event) => setItemDraft((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Gold Ring" required value={itemDraft.name} /></label><label><span>Category <b>*</b></span><input className="field" onChange={(event) => setItemDraft((current) => ({ ...current, category: event.target.value }))} placeholder="e.g. Ring" required value={itemDraft.category} /></label><label><span>Purity</span><select className="select" onChange={(event) => setItemDraft((current) => ({ ...current, purity: event.target.value }))} value={itemDraft.purity}><option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>N/A</option></select></label><label><span>Weight (gm) <b>*</b></span><input className="field" min="0.001" onChange={(event) => setItemDraft((current) => ({ ...current, weight: event.target.value }))} required step="0.001" type="number" value={itemDraft.weight} /></label><label className={styles.fullField}><span>Expected Rate (৳/gm) <b>*</b></span><input className="field" min="1" onChange={(event) => setItemDraft((current) => ({ ...current, rate: event.target.value }))} required step="1" type="number" value={itemDraft.rate} /></label><div className={styles.modalActions}><button className="button" onClick={() => setAddDialogOpen(false)} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />Add Item</button></div></form></Card></div> : null}
    </div>
  );
}
