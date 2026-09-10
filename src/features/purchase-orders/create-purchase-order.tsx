"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatPurchaseOrderCurrency,
  purchaseOrderItemCatalog,
  purchaseOrderSuppliers,
} from "./purchase-order-data";
import styles from "./create-purchase-order.module.css";

type DraftItem = {
  rowId: number;
  itemId: string;
  purity: string;
  unit: string;
  quantity: string;
  unitPrice: string;
};

const blankRow = (rowId: number): DraftItem => ({ rowId, itemId: "", purity: "", unit: "Gram", quantity: "", unitPrice: "" });

export function CreatePurchaseOrder() {
  const router = useRouter();
  const [supplier, setSupplier] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("2025-04-12");
  const [expectedDate, setExpectedDate] = useState("");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<DraftItem[]>(() => [blankRow(1), blankRow(2)]);
  const [discount, setDiscount] = useState("0");

  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const quantity = Number.parseFloat(item.quantity) || 0;
    const price = Number.parseFloat(item.unitPrice) || 0;
    return sum + quantity * price;
  }, 0), [items]);
  const discountAmount = Math.min(subtotal, Math.max(0, Number.parseFloat(discount) || 0));
  const total = subtotal - discountAmount;

  function updateItem(rowId: number, change: Partial<DraftItem>) {
    setItems((current) => current.map((item) => item.rowId === rowId ? { ...item, ...change } : item));
  }

  function selectCatalogItem(rowId: number, itemId: string) {
    const template = purchaseOrderItemCatalog.find((item) => item.id === itemId);
    updateItem(rowId, template ? {
      itemId,
      purity: template.purity,
      unit: template.unit,
      unitPrice: String(template.unitPrice),
    } : { itemId, purity: "", unitPrice: "" });
  }

  function addItem() {
    const nextId = Math.max(0, ...items.map((item) => item.rowId)) + 1;
    setItems((current) => [...current, blankRow(nextId)]);
  }

  function removeItem(rowId: number) {
    setItems((current) => current.length === 1 ? [blankRow(current[0].rowId)] : current.filter((item) => item.rowId !== rowId));
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (total <= 0) return;
    const params = new URLSearchParams({ created: "PO-2025-007", supplier, total: String(Math.round(total)) });
    router.push(`/purchase-orders?${params.toString()}`);
  }

  return (
    <form className={styles.page} onSubmit={saveOrder}>
      <PageHeader description="Create a new purchase order for suppliers" title="Create Purchase Order" />

      <Card className={styles.detailsCard}>
        <div className={styles.detailsGrid}>
          <label><span>Supplier <b>*</b></span><select className="select" onChange={(event) => setSupplier(event.target.value)} required value={supplier}><option value="">Select Supplier</option>{purchaseOrderSuppliers.map((name) => <option key={name}>{name}</option>)}</select></label>
          <label><span>Purchase Date <b>*</b></span><span className={styles.dateField}><input className="field" onChange={(event) => setPurchaseDate(event.target.value)} required type="date" value={purchaseDate} /><CalendarDays size={15} /></span></label>
          <label><span>Reference No</span><input className="field" onChange={(event) => setReference(event.target.value)} placeholder="Enter reference no (optional)" value={reference} /></label>
          <label><span>Expected Delivery Date <b>*</b></span><span className={styles.dateField}><input className="field" min={purchaseDate} onChange={(event) => setExpectedDate(event.target.value)} required type="date" value={expectedDate} /><CalendarDays size={15} /></span></label>
          <label className={styles.remarks}><span>Remarks</span><textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} placeholder="Enter remarks (optional)..." value={remarks} /></label>
        </div>
      </Card>

      <Card className={styles.itemsCard}>
        <h2>Items</h2>
        <div className={styles.tableScroller}>
          <table>
            <thead><tr><th scope="col">#</th><th scope="col">Item <b>*</b></th><th scope="col">Purity</th><th scope="col">Unit</th><th scope="col">Quantity <b>*</b></th><th scope="col">Unit Price (৳) <b>*</b></th><th scope="col">Total (৳)</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {items.map((item, index) => {
                const lineTotal = (Number.parseFloat(item.quantity) || 0) * (Number.parseFloat(item.unitPrice) || 0);
                return (
                  <tr key={item.rowId}>
                    <td>{index + 1}</td>
                    <td><select aria-label={`Item ${index + 1}`} onChange={(event) => selectCatalogItem(item.rowId, event.target.value)} required value={item.itemId}><option value="">Select Item</option>{purchaseOrderItemCatalog.map((catalogItem) => <option key={catalogItem.id} value={catalogItem.id}>{catalogItem.name}</option>)}</select></td>
                    <td><select aria-label={`Purity for item ${index + 1}`} onChange={(event) => updateItem(item.rowId, { purity: event.target.value })} required value={item.purity}><option value="">Purity</option><option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>925</option></select></td>
                    <td><select aria-label={`Unit for item ${index + 1}`} onChange={(event) => updateItem(item.rowId, { unit: event.target.value })} value={item.unit}><option>Gram</option><option>Pcs</option><option>Set</option></select></td>
                    <td><input aria-label={`Quantity for item ${index + 1}`} inputMode="decimal" min="0.001" onChange={(event) => updateItem(item.rowId, { quantity: event.target.value })} required step="0.001" type="number" value={item.quantity} /></td>
                    <td><input aria-label={`Unit price for item ${index + 1}`} inputMode="decimal" min="0.01" onChange={(event) => updateItem(item.rowId, { unitPrice: event.target.value })} required step="0.01" type="number" value={item.unitPrice} /></td>
                    <td className={styles.lineTotal}>{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td><button aria-label={`Remove item ${index + 1}`} className={styles.remove} onClick={() => removeItem(item.rowId)} type="button"><Trash2 size={15} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.belowTable}>
          <button className={`button ${styles.addItem}`} onClick={addItem} type="button"><Plus size={16} />Add Item</button>
          <dl className={styles.totals}>
            <div><dt>Subtotal</dt><dd>{formatPurchaseOrderCurrency(subtotal)}</dd></div>
            <div><dt><label htmlFor="po-discount">Discount</label></dt><dd><input id="po-discount" min="0" onChange={(event) => setDiscount(event.target.value)} step="0.01" type="number" value={discount} /></dd></div>
            <div><dt>Total Amount (৳)</dt><dd>{formatPurchaseOrderCurrency(total)}</dd></div>
          </dl>
        </div>
      </Card>

      <footer className={styles.actions}>
        <Link className="button" href="/purchase-orders">Cancel</Link>
        <button className={`button button--primary ${styles.saveButton}`} disabled={total <= 0} type="submit"><Save size={16} />Save Purchase Order</button>
      </footer>
    </form>
  );
}
