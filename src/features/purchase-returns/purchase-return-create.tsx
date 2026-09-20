"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  PURCHASE_RETURNS_DELETED_STORAGE_KEY,
  PURCHASE_RETURNS_FLASH_KEY,
  PURCHASE_RETURNS_STORAGE_EVENT,
  PURCHASE_RETURNS_STORAGE_KEY,
  formatPurchaseReturnCurrency,
  formatPurchaseReturnDate,
  getPurchaseReturnItemAmount,
  initialPurchaseReturnItems,
  isPurchaseReturnRecord,
  purchaseReturnCatalog,
  purchaseReturnSuppliers,
  type PurchaseReturnItem,
  type PurchaseReturnRecord,
} from "./purchase-return-data";
import styles from "./purchase-returns.module.css";

type Feedback = { tone: "error" | "success"; message: string } | null;

type NewItemDraft = {
  itemName: string;
  category: string;
  purity: string;
  weight: string;
  rate: string;
};

const INITIAL_RETURN_NO = "PR-2025-0008";
const INITIAL_RETURN_DATE = "2025-04-20";
const INITIAL_SUPPLIER = "Amin Jewellery Supply";
const INITIAL_REFERENCE = "PUR-2025-0142";
const INITIAL_REMARKS = "Defective items return";

function freshInitialItems() {
  return initialPurchaseReturnItems.map((item) => ({ ...item }));
}

function freshItemDraft(): NewItemDraft {
  const first = purchaseReturnCatalog[0];
  return {
    itemName: first.itemName,
    category: first.category,
    purity: first.purity,
    weight: "1.000",
    rate: String(first.rate),
  };
}

function readStoredReturns() {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(PURCHASE_RETURNS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isPurchaseReturnRecord) : [];
  } catch {
    return [];
  }
}

export function PurchaseReturnCreate() {
  const router = useRouter();
  const [returnNo, setReturnNo] = useState(INITIAL_RETURN_NO);
  const [returnDate, setReturnDate] = useState(INITIAL_RETURN_DATE);
  const [supplier, setSupplier] = useState(INITIAL_SUPPLIER);
  const [referenceNo, setReferenceNo] = useState(INITIAL_REFERENCE);
  const [remarks, setRemarks] = useState(INITIAL_REMARKS);
  const [items, setItems] = useState<PurchaseReturnItem[]>(freshInitialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<NewItemDraft>(freshItemDraft);
  const [dialogError, setDialogError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + getPurchaseReturnItemAmount(item), 0),
    [items],
  );

  useEffect(() => {
    if (!dialogOpen) return;
    const returnFocusTo = addButtonRef.current;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialogOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      returnFocusTo?.focus();
    };
  }, [dialogOpen]);

  function selectCatalogItem(itemName: string) {
    const selected = purchaseReturnCatalog.find((item) => item.itemName === itemName);
    setDraft((current) => selected
      ? {
          ...current,
          itemName: selected.itemName,
          category: selected.category,
          purity: selected.purity,
          rate: String(selected.rate),
        }
      : { ...current, itemName });
    setDialogError("");
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weight = Number(draft.weight);
    const rate = Number(draft.rate);
    if (!draft.itemName.trim() || !draft.category.trim() || !draft.purity.trim() || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(rate) || rate <= 0) {
      setDialogError("Complete all item fields with valid positive values.");
      return;
    }

    setItems((current) => [...current, {
      id: `purchase-return-item-${Date.now()}`,
      itemName: draft.itemName.trim(),
      category: draft.category.trim(),
      purity: draft.purity.trim(),
      weight,
      rate,
    }]);
    setDraft(freshItemDraft());
    setDialogError("");
    setDialogOpen(false);
    setFeedback({ tone: "success", message: `${draft.itemName} added to this purchase return.` });
  }

  function removeItem(item: PurchaseReturnItem) {
    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    setFeedback({ tone: "success", message: `${item.itemName} removed from this purchase return.` });
  }

  function saveReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!returnNo.trim() || !returnDate || !supplier || !referenceNo.trim()) {
      setFeedback({ tone: "error", message: "Complete all required purchase return fields." });
      return;
    }
    if (!items.length || total <= 0) {
      setFeedback({ tone: "error", message: "Add at least one valid item before saving the return." });
      return;
    }

    const record: PurchaseReturnRecord = {
      id: returnNo.trim(),
      returnNo: returnNo.trim(),
      returnDate: formatPurchaseReturnDate(returnDate),
      returnDateIso: returnDate,
      supplier,
      referenceNo: referenceNo.trim(),
      remarks: remarks.trim(),
      total,
      status: "Pending",
      items,
    };

    try {
      const stored = readStoredReturns();
      window.localStorage.setItem(
        PURCHASE_RETURNS_STORAGE_KEY,
        JSON.stringify([record, ...stored.filter((entry) => entry.returnNo !== record.returnNo)]),
      );

      const deletedValue: unknown = JSON.parse(
        window.localStorage.getItem(PURCHASE_RETURNS_DELETED_STORAGE_KEY) ?? "[]",
      );
      const deletedIds = Array.isArray(deletedValue)
        ? deletedValue.filter((value): value is string => typeof value === "string" && value !== record.id)
        : [];
      window.localStorage.setItem(PURCHASE_RETURNS_DELETED_STORAGE_KEY, JSON.stringify(deletedIds));
      window.sessionStorage.setItem(PURCHASE_RETURNS_FLASH_KEY, `${record.returnNo} saved successfully.`);
      window.dispatchEvent(new Event(PURCHASE_RETURNS_STORAGE_EVENT));
      router.push("/purchases/returns");
    } catch {
      setFeedback({ tone: "error", message: "This return could not be saved in browser storage. Please try again." });
    }
  }

  return (
    <div className={styles.createPage}>
      <header className={styles.createHeader}>
        <h1>Purchase Return</h1>
        <nav aria-label="Breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/purchases">Purchase</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Purchase Return</span>
        </nav>
      </header>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success"
          ? <CheckCircle2 aria-hidden="true" size={16} />
          : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form noValidate onSubmit={saveReturn}>
        <Card className={styles.createCard}>
          <div className={styles.returnFields}>
            <label className={styles.control}>
              <span>Return No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setReturnNo(event.target.value); setFeedback(null); }} required value={returnNo} />
            </label>
            <label className={styles.control}>
              <span>Return Date <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setReturnDate(event.target.value); setFeedback(null); }} required type="date" value={returnDate} />
            </label>
            <label className={styles.control}>
              <span>Supplier <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => { setSupplier(event.target.value); setFeedback(null); }} required value={supplier}>
                {purchaseReturnSuppliers.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={`${styles.control} ${styles.referenceField}`}>
              <span>Reference No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setReferenceNo(event.target.value); setFeedback(null); }} required value={referenceNo} />
            </label>
            <label className={`${styles.control} ${styles.remarksField}`}>
              <span>Remarks</span>
              <input className="field" onChange={(event) => setRemarks(event.target.value)} value={remarks} />
            </label>
          </div>

          <div className={styles.tableScroller}>
            <table className={styles.itemTable}>
              <caption className="sr-only">Items included in this purchase return</caption>
              <thead>
                <tr>
                  <th scope="col">SL</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Purity</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Rate ({"\u09F3"})</th>
                  <th scope="col">Amount ({"\u09F3"})</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><strong>{item.itemName}</strong></td>
                    <td>{item.category}</td>
                    <td>{item.purity}</td>
                    <td>{item.weight.toFixed(3)}</td>
                    <td>{item.rate.toLocaleString("en-IN")}</td>
                    <td>{getPurchaseReturnItemAmount(item).toLocaleString("en-IN")}</td>
                    <td>
                      <button aria-label={`Remove ${item.itemName}`} className={styles.deleteButton} onClick={() => removeItem(item)} title={`Remove ${item.itemName}`} type="button">
                        <Trash2 aria-hidden="true" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length ? <tr><td className={styles.emptyItems} colSpan={8}>No items added. Select “Add Item” to continue.</td></tr> : null}
              </tbody>
            </table>
          </div>

          <div className={styles.createSummary}>
            <button className="button button--primary" onClick={() => { setDialogOpen(true); setDialogError(""); setFeedback(null); }} ref={addButtonRef} type="button">
              <Plus aria-hidden="true" size={16} />Add Item
            </button>
            <div className={styles.totalAmount}><span>Total Amount</span><strong>{formatPurchaseReturnCurrency(total)}</strong></div>
          </div>

          <footer className={styles.formActions}>
            <Link className="button" href="/purchases/returns">Cancel</Link>
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Return</button>
          </footer>
        </Card>
      </form>

      {dialogOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }} ref={dialogRef}>
          <Card aria-describedby="add-return-item-description" aria-labelledby="add-return-item-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <header className={styles.modalHeader}>
              <div>
                <h2 id="add-return-item-title">Add Return Item</h2>
                <p id="add-return-item-description">Add another item to this supplier return.</p>
              </div>
              <button aria-label="Close add item dialog" onClick={() => setDialogOpen(false)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <form className={styles.modalForm} onSubmit={addItem}>
              {dialogError ? <p className={`${styles.feedback} ${styles.error} ${styles.modalError}`} role="alert">{dialogError}</p> : null}
              <label className={styles.control}>
                <span>Item Name <b aria-hidden="true">*</b></span>
                <select autoFocus className="select" onChange={(event) => selectCatalogItem(event.target.value)} value={draft.itemName}>
                  {purchaseReturnCatalog.map((item) => <option key={item.itemName}>{item.itemName}</option>)}
                </select>
              </label>
              <label className={styles.control}>
                <span>Category <b aria-hidden="true">*</b></span>
                <input className="field" onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} required value={draft.category} />
              </label>
              <label className={styles.control}>
                <span>Purity <b aria-hidden="true">*</b></span>
                <select className="select" onChange={(event) => setDraft((current) => ({ ...current, purity: event.target.value }))} value={draft.purity}>
                  <option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>925</option>
                </select>
              </label>
              <label className={styles.control}>
                <span>Weight <b aria-hidden="true">*</b></span>
                <input className="field" min="0.001" onChange={(event) => setDraft((current) => ({ ...current, weight: event.target.value }))} required step="0.001" type="number" value={draft.weight} />
              </label>
              <label className={`${styles.control} ${styles.fullField}`}>
                <span>Rate ({"\u09F3"}) <b aria-hidden="true">*</b></span>
                <input className="field" min="0.01" onChange={(event) => setDraft((current) => ({ ...current, rate: event.target.value }))} required step="0.01" type="number" value={draft.rate} />
              </label>
              <footer className={styles.modalActions}>
                <button className="button" onClick={() => setDialogOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />Add Item</button>
              </footer>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
