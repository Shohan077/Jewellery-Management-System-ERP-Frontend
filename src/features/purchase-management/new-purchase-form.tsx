"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatAmount,
  getLineAmount,
  getProduct,
  initialPurchaseLines,
  initialSuppliers,
  purchaseProducts,
  purityOptions,
  type PurchaseLine,
  type PurchaseSupplier,
} from "./purchase-data";
import styles from "./new-purchase-form.module.css";

type FieldName = "productId" | "purity" | "weight" | "rate";

const DEFAULT_DATE = "2025-04-30";
const DEFAULT_INVOICE = "PI-2025-001";
const STORAGE_KEY = "jewellery-erp.purchase-management.v1";

function NumberField({
  label,
  min = 0,
  onChange,
  step,
  value,
}: {
  label: string;
  min?: number;
  onChange: (value: number) => void;
  step: string;
  value: number;
}) {
  return (
    <input
      aria-label={label}
      className={styles.tableInput}
      inputMode="decimal"
      min={min}
      onChange={(event) => onChange(Number(event.target.value))}
      step={step}
      type="number"
      value={value}
    />
  );
}

export function NewPurchaseForm() {
  const nextLineId = useRef(4);
  const [suppliers, setSuppliers] = useState<PurchaseSupplier[]>(initialSuppliers);
  const [supplierId, setSupplierId] = useState(initialSuppliers[0].id);
  const [purchaseDate, setPurchaseDate] = useState(DEFAULT_DATE);
  const [invoiceNo, setInvoiceNo] = useState(DEFAULT_INVOICE);
  const [lines, setLines] = useState<PurchaseLine[]>(() => initialPurchaseLines.map((line) => ({ ...line })));
  const [notes, setNotes] = useState("");
  const [otherCharge, setOtherCharge] = useState(0);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "" });

  let subtotal = 0;
  for (const line of lines) subtotal += getLineAmount(line);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat + Math.max(0, otherCharge);

  function announce(text: string, tone: "success" | "error" = "success") {
    setMessage(text);
    setMessageTone(tone);
  }

  function updateLine(lineId: number, field: FieldName, value: string | number) {
    setLines((current) => current.map((line) => {
      if (line.id !== lineId) return line;
      if (field === "productId") {
        const product = getProduct(String(value));
        return {
          ...line,
          productId: product.id,
          purity: product.purity,
          weight: product.weight,
          rate: product.rate,
        };
      }
      if (field === "purity") return { ...line, purity: String(value) };
      return { ...line, [field]: Math.max(0, Number(value) || 0) };
    }));
    setMessage("");
  }

  function addLine() {
    const usedProducts = new Set(lines.map((line) => line.productId));
    const product = purchaseProducts.find((candidate) => !usedProducts.has(candidate.id)) ?? purchaseProducts[0];
    setLines((current) => [...current, {
      id: nextLineId.current++,
      productId: product.id,
      purity: product.purity,
      weight: product.weight,
      rate: product.rate,
    }]);
    announce(`${product.name} added to the purchase.`);
  }

  function removeLine(lineId: number) {
    const line = lines.find((candidate) => candidate.id === lineId);
    setLines((current) => current.filter((candidate) => candidate.id !== lineId));
    announce(`${line ? getProduct(line.productId).name : "Item"} removed from the purchase.`);
  }

  function resetForm() {
    setSupplierId(initialSuppliers[0].id);
    setPurchaseDate(DEFAULT_DATE);
    setInvoiceNo(DEFAULT_INVOICE);
    setLines(initialPurchaseLines.map((line) => ({ ...line })));
    setNotes("");
    setOtherCharge(0);
    nextLineId.current = 4;
    announce("Purchase form reset to its original details.");
  }

  function validatePurchase() {
    if (!supplierId) return "Select a supplier before saving.";
    if (!purchaseDate) return "Choose a purchase date before saving.";
    if (!invoiceNo.trim()) return "Enter an invoice number before saving.";
    if (lines.length === 0) return "Add at least one item before saving.";
    if (lines.some((line) => line.weight <= 0 || line.rate <= 0)) return "Every item needs a weight and rate greater than zero.";
    return "";
  }

  function savePurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validatePurchase();
    if (error) {
      announce(error, "error");
      return;
    }

    const selectedSupplier = suppliers.find((supplier) => supplier.id === supplierId);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        invoiceNo: invoiceNo.trim(),
        purchaseDate,
        supplierId,
        lines,
        notes: notes.trim(),
        otherCharge,
        total,
      }));
      announce(`${invoiceNo.trim()} saved for ${selectedSupplier?.name ?? "the selected supplier"} — total ${formatAmount(total)}.`);
    } catch {
      announce("The purchase is valid, but this browser could not store the local draft.", "error");
    }
  }

  function saveNewSupplier() {
    const name = newSupplier.name.trim();
    if (!name) {
      announce("Enter the supplier name before adding it.", "error");
      return;
    }
    const id = `S-${String(suppliers.length + 1).padStart(4, "0")}`;
    const supplier = { id, name };
    setSuppliers((current) => [...current, supplier]);
    setSupplierId(id);
    setNewSupplier({ name: "", phone: "" });
    setSupplierModalOpen(false);
    announce(`${name} added and selected as the supplier.`);
  }

  return (
    <>
      <form className={styles.page} noValidate onSubmit={savePurchase}>
        <PageHeader
          action={(
            <Link className={`button ${styles.backButton}`} href="/purchases">
              <ArrowLeft aria-hidden="true" size={15} />
              Back to List
            </Link>
          )}
          description="Create a new purchase entry"
          title="New Purchase"
        />

        <Card className={styles.purchaseCard}>
          <section aria-label="Purchase details" className={styles.purchaseFields}>
            <label className={styles.fieldLabel}>
              <span>Supplier <em>*</em></span>
              <select className="select" onChange={(event) => setSupplierId(event.target.value)} value={supplierId}>
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name} ({supplier.id})</option>
                ))}
              </select>
            </label>
            <button className={`button button--primary ${styles.newSupplierButton}`} onClick={() => setSupplierModalOpen(true)} type="button">
              <Plus aria-hidden="true" size={15} />
              New Supplier
            </button>
            <label className={styles.fieldLabel}>
              <span>Purchase Date <em>*</em></span>
              <input className="field" onChange={(event) => setPurchaseDate(event.target.value)} type="date" value={purchaseDate} />
            </label>
            <label className={styles.fieldLabel}>
              <span>Invoice No <em>*</em></span>
              <input className="field" onChange={(event) => setInvoiceNo(event.target.value)} placeholder="Enter invoice number" value={invoiceNo} />
            </label>
          </section>

          <div className={styles.tableScroller}>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product</th>
                  <th scope="col">Purity</th>
                  <th scope="col">Weight (g)</th>
                  <th scope="col">Rate ({"\u09F3"}/g)</th>
                  <th scope="col">Amount ({"\u09F3"})</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const product = getProduct(line.productId);
                  return (
                    <tr key={line.id}>
                      <td>{index + 1}</td>
                      <td>
                        <label>
                          <span className="sr-only">Product for item {index + 1}</span>
                          <select className={styles.productSelect} onChange={(event) => updateLine(line.id, "productId", event.target.value)} value={line.productId}>
                            {purchaseProducts.map((option) => (
                              <option key={option.id} value={option.id}>{option.name} ({option.code})</option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          <span className="sr-only">Purity for {product.name}</span>
                          <select className={styles.tableSelect} onChange={(event) => updateLine(line.id, "purity", event.target.value)} value={line.purity}>
                            {purityOptions.map((purity) => <option key={purity}>{purity}</option>)}
                          </select>
                        </label>
                      </td>
                      <td><NumberField label={`Weight for ${product.name}`} onChange={(value) => updateLine(line.id, "weight", value)} step="0.01" value={line.weight} /></td>
                      <td><NumberField label={`Rate for ${product.name}`} onChange={(value) => updateLine(line.id, "rate", value)} step="1" value={line.rate} /></td>
                      <td className={styles.amount}>{formatAmount(getLineAmount(line))}</td>
                      <td>
                        <button aria-label={`Remove ${product.name}`} className={styles.removeButton} onClick={() => removeLine(line.id)} title={`Remove ${product.name}`} type="button">
                          <Trash2 aria-hidden="true" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {lines.length === 0 ? (
                  <tr><td className={styles.emptyRow} colSpan={7}>No items added. Use Add Item to continue.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <button className={`button button--primary ${styles.addItemButton}`} onClick={addLine} type="button">
            <Plus aria-hidden="true" size={16} />
            Add Item
          </button>

          <div className={styles.checkoutGrid}>
            <label className={styles.notesField}>
              <span>Notes</span>
              <textarea className="textarea" onChange={(event) => setNotes(event.target.value)} placeholder="Enter notes (optional)..." value={notes} />
            </label>

            <section aria-label="Purchase total" className={styles.summary}>
              <dl>
                <div><dt>Subtotal</dt><dd>{formatAmount(subtotal)}</dd></div>
                <div><dt>VAT (5%)</dt><dd>{formatAmount(vat)}</dd></div>
                <div>
                  <dt><label htmlFor="purchase-other-charge">Other Charge</label></dt>
                  <dd>
                    <span className={styles.chargeInput}>
                      <span aria-hidden="true">{"\u09F3"}</span>
                      <input id="purchase-other-charge" inputMode="decimal" min="0" onChange={(event) => setOtherCharge(Math.max(0, Number(event.target.value) || 0))} step="1" type="number" value={otherCharge} />
                    </span>
                  </dd>
                </div>
                <div className={styles.totalRow}><dt>Total Amount</dt><dd>{formatAmount(total)}</dd></div>
              </dl>
            </section>
          </div>

          <footer className={styles.footer}>
            <p aria-live="polite" className={message ? styles.feedback : "sr-only"} data-tone={messageTone}>
              {message ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
              {message}
            </p>
            <div className={styles.actions}>
              <button className="button" onClick={resetForm} type="button">
                <RotateCcw aria-hidden="true" size={15} />
                Reset
              </button>
              <button className="button button--primary" type="submit">
                <Save aria-hidden="true" size={15} />
                Save Purchase
              </button>
            </div>
          </footer>
        </Card>
      </form>

      {supplierModalOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <form aria-labelledby="new-supplier-title" aria-modal="true" className={styles.modal} onSubmit={(event) => { event.preventDefault(); saveNewSupplier(); }} role="dialog">
            <header>
              <div>
                <h2 id="new-supplier-title">Add New Supplier</h2>
                <p>Create and select a supplier for this purchase.</p>
              </div>
              <button aria-label="Close supplier dialog" className={styles.closeButton} onClick={() => setSupplierModalOpen(false)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <div className={styles.modalFields}>
              <label className={styles.fieldLabel}>
                <span>Supplier Name <em>*</em></span>
                <input autoFocus className="field" onChange={(event) => setNewSupplier((current) => ({ ...current, name: event.target.value }))} placeholder="Enter supplier name" value={newSupplier.name} />
              </label>
              <label className={styles.fieldLabel}>
                <span>Phone</span>
                <input className="field" inputMode="tel" onChange={(event) => setNewSupplier((current) => ({ ...current, phone: event.target.value }))} placeholder="Enter phone number" value={newSupplier.phone} />
              </label>
            </div>
            <footer>
              <button className="button" onClick={() => setSupplierModalOpen(false)} type="button">Cancel</button>
              <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={15} />Add Supplier</button>
            </footer>
          </form>
        </div>
      ) : null}
    </>
  );
}
