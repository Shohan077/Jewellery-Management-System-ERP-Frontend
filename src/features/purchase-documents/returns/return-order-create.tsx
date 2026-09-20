"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  RETURN_ORDER_DELETED_KEY,
  RETURN_ORDER_EVENT,
  RETURN_ORDER_FLASH_KEY,
  RETURN_ORDER_STORAGE_KEY,
  defaultReturnItems,
  formatReturnDate,
  lineAmount,
  readSavedReturnOrders,
  returnItemCatalog,
  returnOrderSuppliers,
  returnReasons,
  type ReturnOrder,
  type ReturnOrderItem,
} from "./return-order-data";
import styles from "./return-orders.module.css";

type ItemDraft = { itemName: string; category: string; purity: string; weight: string; rate: string };

function freshItems() {
  return defaultReturnItems.map((item) => ({ ...item }));
}

function freshDraft(): ItemDraft {
  const item = returnItemCatalog[0];
  return { itemName: item.itemName, category: item.category, purity: item.purity, weight: "1.000", rate: String(item.rate) };
}

export function ReturnOrderCreate() {
  const router = useRouter();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [returnNo, setReturnNo] = useState("PR-2025-0009");
  const [returnDate, setReturnDate] = useState("2025-04-20");
  const [supplier, setSupplier] = useState("Amin Jewellery Supply");
  const [originalPo, setOriginalPo] = useState("PO-2025-0018");
  const [returnReason, setReturnReason] = useState("Defective items");
  const [remarks, setRemarks] = useState("Quality issue");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ReturnOrderItem[]>(freshItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<ItemDraft>(freshDraft);
  const [message, setMessage] = useState("");

  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + item.weight, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + lineAmount(item), 0), [items]);

  useEffect(() => {
    if (!dialogOpen) return;
    const returnFocusTo = addButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialogOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [dialogOpen]);

  function chooseItem(itemName: string) {
    const selected = returnItemCatalog.find((item) => item.itemName === itemName);
    if (!selected) return;
    setDraft((current) => ({ ...current, itemName, category: selected.category, purity: selected.purity, rate: String(selected.rate) }));
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weight = Number(draft.weight);
    const rate = Number(draft.rate);
    if (!draft.itemName || !draft.category.trim() || !draft.purity || weight <= 0 || rate <= 0) {
      setMessage("Complete the item details with positive weight and rate values.");
      return;
    }
    setItems((current) => [...current, { id: `return-order-item-${Date.now()}`, itemName: draft.itemName, category: draft.category.trim(), purity: draft.purity, weight, rate }]);
    setDraft(freshDraft());
    setDialogOpen(false);
    setMessage(`${draft.itemName} added to this purchase return.`);
  }

  function saveReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!returnNo.trim() || !returnDate || !supplier || !originalPo || !returnReason || !items.length) {
      setMessage("Complete all required fields and add at least one item.");
      return;
    }
    const record: ReturnOrder = {
      id: returnNo.trim(), returnNo: returnNo.trim(), returnDate: formatReturnDate(returnDate), returnDateIso: returnDate,
      supplier, originalPo, returnReason, remarks: remarks.trim(), notes: notes.trim(), status: "Completed", items,
    };
    try {
      const stored = readSavedReturnOrders();
      window.localStorage.setItem(RETURN_ORDER_STORAGE_KEY, JSON.stringify([record, ...stored.filter((item) => item.id !== record.id)]));
      const deletedValue: unknown = JSON.parse(window.localStorage.getItem(RETURN_ORDER_DELETED_KEY) ?? "[]");
      const deletedIds = Array.isArray(deletedValue)
        ? deletedValue.filter((value): value is string => typeof value === "string" && value !== record.id)
        : [];
      window.localStorage.setItem(RETURN_ORDER_DELETED_KEY, JSON.stringify(deletedIds));
      window.sessionStorage.setItem(RETURN_ORDER_FLASH_KEY, `${record.returnNo} saved successfully.`);
      window.dispatchEvent(new Event(RETURN_ORDER_EVENT));
      router.push("/purchases/return-orders");
    } catch {
      setMessage("The purchase return could not be saved in browser storage.");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Purchase Return</h1>
        <nav aria-label="Breadcrumb"><Link href="/dashboard">Home</Link><span>›</span><Link href="/purchases">Purchase</Link><span>›</span><span aria-current="page">Purchase Return</span></nav>
      </header>

      <form onSubmit={saveReturn}>
        <Card className={styles.createCard}>
          {message ? <p aria-live="polite" className={styles.message}><CircleAlert aria-hidden="true" size={15} />{message}</p> : null}
          <div className={styles.detailsGrid}>
            <label><span>Return No <b>*</b></span><input className="field" onChange={(event) => setReturnNo(event.target.value)} required value={returnNo} /></label>
            <label><span>Return Date <b>*</b></span><input className="field" onChange={(event) => setReturnDate(event.target.value)} required type="date" value={returnDate} /></label>
            <label><span>Supplier <b>*</b></span><select className="select" onChange={(event) => setSupplier(event.target.value)} value={supplier}>{returnOrderSuppliers.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Original Purchase No</span><select className="select" onChange={(event) => setOriginalPo(event.target.value)} value={originalPo}><option>PO-2025-0018</option><option>PO-2025-0017</option><option>PO-2025-0016</option></select></label>
            <label><span>Return Reason <b>*</b></span><select className="select" onChange={(event) => setReturnReason(event.target.value)} value={returnReason}>{returnReasons.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Remarks</span><input className="field" onChange={(event) => setRemarks(event.target.value)} value={remarks} /></label>
          </div>

          <div className={styles.sectionHeading}><h2>Items</h2><button className={`${styles.violetButton} button`} onClick={() => { setDialogOpen(true); setMessage(""); }} ref={addButtonRef} type="button"><Plus size={16} />Add Item</button></div>
          <div className={styles.tableScroller}>
            <table className={styles.itemsTable}>
              <caption className="sr-only">Items in this purchase return</caption>
              <thead><tr><th>SL</th><th>Item Name</th><th>Category</th><th>Purity</th><th>Weight (gm)</th><th>Rate (৳)</th><th>Amount (৳)</th><th>Action</th></tr></thead>
              <tbody>
                {items.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td><strong>{item.itemName}</strong></td><td>{item.category}</td><td>{item.purity}</td><td>{item.weight.toFixed(3)}</td><td>{item.rate.toLocaleString("en-IN")}</td><td>{lineAmount(item).toLocaleString("en-IN")}</td><td><button aria-label={`Delete ${item.itemName}`} className={styles.deleteButton} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} type="button"><Trash2 size={15} /></button></td></tr>)}
                {!items.length ? <tr><td className={styles.empty} colSpan={8}>No items have been added.</td></tr> : null}
              </tbody>
            </table>
          </div>

          <div className={styles.bottomGrid}>
            <label><span>Additional Notes</span><textarea className="textarea" onChange={(event) => setNotes(event.target.value)} placeholder="Enter additional notes..." value={notes} /></label>
            <dl className={styles.totals}>
              <div><dt>Total Items</dt><dd>{items.length}</dd></div>
              <div><dt>Total Weight</dt><dd>{totalWeight.toFixed(3)} gm</dd></div>
              <div><dt>Total Return Amount</dt><dd>৳ {totalAmount.toLocaleString("en-IN")}</dd></div>
            </dl>
          </div>
          <footer className={styles.formActions}><Link className="button" href="/purchases/return-orders">Cancel</Link><button className={`${styles.violetButton} button`} type="submit"><Save size={16} />Save Purchase Return</button></footer>
        </Card>
      </form>

      {dialogOpen ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }} ref={dialogRef}>
        <Card aria-labelledby="add-return-order-item" aria-modal="true" as="section" className={styles.modal} role="dialog">
          <header className={styles.modalHeader}><div><h2 id="add-return-order-item">Add Return Item</h2><p>Add another product to the return.</p></div><button aria-label="Close dialog" onClick={() => setDialogOpen(false)} type="button"><X size={18} /></button></header>
          <form className={styles.modalForm} onSubmit={addItem}>
            <label><span>Item Name</span><select autoFocus className="select" onChange={(event) => chooseItem(event.target.value)} value={draft.itemName}>{returnItemCatalog.map((item) => <option key={item.itemName}>{item.itemName}</option>)}</select></label>
            <label><span>Category</span><input className="field" onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} value={draft.category} /></label>
            <label><span>Purity</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, purity: event.target.value }))} value={draft.purity}><option>24K</option><option>22K</option><option>21K</option><option>18K</option></select></label>
            <label><span>Weight (gm)</span><input className="field" min="0.001" onChange={(event) => setDraft((current) => ({ ...current, weight: event.target.value }))} step="0.001" type="number" value={draft.weight} /></label>
            <label className={styles.fullSpan}><span>Rate (৳)</span><input className="field" min="1" onChange={(event) => setDraft((current) => ({ ...current, rate: event.target.value }))} type="number" value={draft.rate} /></label>
            <footer className={styles.modalActions}><button className="button" onClick={() => setDialogOpen(false)} type="button">Cancel</button><button className={`${styles.violetButton} button`} type="submit"><Plus size={16} />Add Item</button></footer>
          </form>
        </Card>
      </div> : null}
    </div>
  );
}
