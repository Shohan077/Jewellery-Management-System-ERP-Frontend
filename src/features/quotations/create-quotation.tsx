"use client";

import {
  CheckCircle2,
  Eye,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatQuotationCurrency,
  getQuotationLineAmount,
  initialQuotationProducts,
  quotationCustomers,
  quotationProducts,
  type QuotationCustomer,
  type QuotationProduct,
} from "./quotation-data";
import styles from "./create-quotation.module.css";

const DEFAULT_QUOTATION_NO = "Q-2025-001";
const DEFAULT_DATE = "2025-04-30";
const DEFAULT_VALID_UNTIL = "2025-05-07";
const DEFAULT_REMARKS = "Prices are valid for 7 days.";
const STORAGE_KEY = "jewellery-erp.quotation-draft.v1";

type Feedback = { tone: "success" | "error"; message: string } | null;

export function CreateQuotation() {
  const customerIdCounter = useRef(129);
  const [customers, setCustomers] = useState<QuotationCustomer[]>(quotationCustomers);
  const [customer, setCustomer] = useState<QuotationCustomer>(quotationCustomers[0]);
  const [customerQuery, setCustomerQuery] = useState(quotationCustomers[0].name);
  const [quotationNo, setQuotationNo] = useState(DEFAULT_QUOTATION_NO);
  const [quotationDate, setQuotationDate] = useState(DEFAULT_DATE);
  const [validUntil, setValidUntil] = useState(DEFAULT_VALID_UNTIL);
  const [products, setProducts] = useState<QuotationProduct[]>(() => [...initialQuotationProducts]);
  const [productQuery, setProductQuery] = useState("");
  const [remarks, setRemarks] = useState(DEFAULT_REMARKS);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

  const subtotal = products.reduce((total, product) => total + getQuotationLineAmount(product), 0);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;

  function announce(message: string, tone: "success" | "error" = "success") {
    setFeedback({ tone, message });
  }

  function chooseCustomer(value: string) {
    setCustomerQuery(value);
    const normalized = value.trim().toLowerCase();
    const match = customers.find((candidate) =>
      candidate.name.toLowerCase() === normalized ||
      candidate.phone === value.trim() ||
      candidate.id.toLowerCase() === normalized,
    );
    if (match) {
      setCustomer(match);
      setCustomerQuery(match.name);
      announce(`${match.name} selected for this quotation.`);
    }
  }

  function addProduct() {
    const usedIds = new Set(products.map((product) => product.id));
    const available = quotationProducts.filter((product) => !usedIds.has(product.id));
    const normalized = productQuery.trim().toLowerCase();
    const product = available.find((candidate) =>
      !normalized ||
      candidate.name.toLowerCase().includes(normalized) ||
      candidate.code.toLowerCase().includes(normalized),
    );

    if (!product) {
      announce(
        available.length === 0
          ? "All catalogue products are already in this quotation."
          : "No available product matches your search.",
        "error",
      );
      return;
    }

    setProducts((current) => [...current, product]);
    setProductQuery("");
    announce(`${product.name} added to the quotation.`);
  }

  function removeProduct(product: QuotationProduct) {
    setProducts((current) => current.filter((candidate) => candidate.id !== product.id));
    announce(`${product.name} removed from the quotation.`);
  }

  function validateQuotation() {
    if (!customer?.id) return "Select a customer before saving the quotation.";
    if (!quotationNo.trim()) return "Enter a quotation number before saving.";
    if (!quotationDate || !validUntil) return "Choose the quotation and validity dates.";
    if (validUntil < quotationDate) return "Valid Until cannot be earlier than the quotation date.";
    if (products.length === 0) return "Add at least one item before saving the quotation.";
    return "";
  }

  function persistQuotation(action: "saved" | "sent") {
    const validationError = validateQuotation();
    if (validationError) {
      announce(validationError, "error");
      return false;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        quotationNo: quotationNo.trim(),
        quotationDate,
        validUntil,
        customer,
        products,
        remarks: remarks.trim(),
        subtotal,
        vat,
        total,
        status: action,
      }));
      announce(
        action === "sent"
          ? `${quotationNo.trim()} was saved and marked as sent to ${customer.name}.`
          : `${quotationNo.trim()} saved locally for ${customer.name}.`,
      );
      return true;
    } catch {
      announce("The quotation is valid, but this browser could not store it locally.", "error");
      return false;
    }
  }

  function saveQuotation(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    persistQuotation("saved");
  }

  function openPreview() {
    const validationError = validateQuotation();
    if (validationError) {
      announce(validationError, "error");
      return;
    }
    setPreviewOpen(true);
  }

  function resetQuotation() {
    setCustomer(quotationCustomers[0]);
    setCustomerQuery(quotationCustomers[0].name);
    setQuotationNo(DEFAULT_QUOTATION_NO);
    setQuotationDate(DEFAULT_DATE);
    setValidUntil(DEFAULT_VALID_UNTIL);
    setProducts([...initialQuotationProducts]);
    setProductQuery("");
    setRemarks(DEFAULT_REMARKS);
    announce("Quotation reset to the original sample details.");
  }

  function addCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newCustomer.name.trim();
    const phone = newCustomer.phone.trim();
    if (!name || !phone) {
      announce("Enter the new customer name and phone number.", "error");
      return;
    }

    const createdCustomer: QuotationCustomer = {
      id: `C-${String(customerIdCounter.current++).padStart(6, "0")}`,
      name,
      phone,
    };
    setCustomers((current) => [...current, createdCustomer]);
    setCustomer(createdCustomer);
    setCustomerQuery(createdCustomer.name);
    setNewCustomer({ name: "", phone: "" });
    setCustomerModalOpen(false);
    announce(`${createdCustomer.name} was added and selected.`);
  }

  return (
    <>
      <form className={styles.page} noValidate onSubmit={saveQuotation}>
        <PageHeader
          action={(
            <div className={styles.headerActions}>
              <button className="button" onClick={openPreview} type="button">
                <Eye aria-hidden="true" size={15} />
                Preview
              </button>
              <button className="button button--primary" onClick={() => persistQuotation("saved")} type="button">
                <Save aria-hidden="true" size={15} />
                Save Quotation
              </button>
            </div>
          )}
          description="Create and send quotation to customer"
          title="Create Quotation"
        />

        <div className={styles.topGrid}>
          <Card className={styles.customerCard}>
            <h2>Customer Information</h2>
            <div className={styles.customerSearchRow}>
              <label className={styles.searchField}>
                <Search aria-hidden="true" size={15} />
                <span className="sr-only">Search customer by name, phone or ID</span>
                <input
                  list="quotation-customer-options"
                  onChange={(event) => chooseCustomer(event.target.value)}
                  placeholder="Search customer by name, phone or ID..."
                  type="search"
                  value={customerQuery}
                />
                <datalist id="quotation-customer-options">
                  {customers.map((option) => (
                    <option key={option.id} value={option.name}>{option.phone} · {option.id}</option>
                  ))}
                </datalist>
              </label>
              <button className="button button--primary" onClick={() => setCustomerModalOpen(true)} type="button">
                <Plus aria-hidden="true" size={15} />
                New
              </button>
            </div>
            <dl className={styles.customerDetails}>
              <div><dt>Name</dt><dd>{customer.name}</dd></div>
              <div><dt>Phone</dt><dd>{customer.phone}</dd></div>
              <div><dt>Customer ID</dt><dd>{customer.id}</dd></div>
            </dl>
          </Card>

          <Card className={styles.detailsCard}>
            <h2>Quotation Details</h2>
            <div className={styles.detailsGrid}>
              <label>
                <span>Quotation No</span>
                <input className="field" onChange={(event) => setQuotationNo(event.target.value)} value={quotationNo} />
              </label>
              <label>
                <span>Date</span>
                <input className="field" onChange={(event) => setQuotationDate(event.target.value)} type="date" value={quotationDate} />
              </label>
              <label>
                <span>Valid Until</span>
                <input className="field" min={quotationDate} onChange={(event) => setValidUntil(event.target.value)} type="date" value={validUntil} />
              </label>
            </div>
          </Card>
        </div>

        <Card className={styles.itemsCard}>
          <h2>Add Items</h2>
          <div className={styles.itemToolbar}>
            <label className={styles.searchField}>
              <Search aria-hidden="true" size={15} />
              <span className="sr-only">Search product by name, code or barcode</span>
              <input
                list="quotation-product-options"
                onChange={(event) => setProductQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addProduct();
                  }
                }}
                placeholder="Search product by name, code or barcode..."
                type="search"
                value={productQuery}
              />
              <datalist id="quotation-product-options">
                {quotationProducts.map((product) => <option key={product.id} value={`${product.name} (${product.code})`} />)}
              </datalist>
            </label>
            <button className="button button--primary" onClick={addProduct} type="button">
              <Plus aria-hidden="true" size={15} />
              Add Item
            </button>
          </div>

          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <caption className="sr-only">Items included in quotation {quotationNo}</caption>
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
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td><strong>{product.name} ({product.code})</strong></td>
                    <td>{product.purity}</td>
                    <td>{product.weight.toFixed(2)}</td>
                    <td>{product.rate.toLocaleString("en-IN")}</td>
                    <td><strong>{getQuotationLineAmount(product).toLocaleString("en-IN")}</strong></td>
                    <td>
                      <button
                        aria-label={`Remove ${product.name}`}
                        className={styles.removeButton}
                        onClick={() => removeProduct(product)}
                        title={`Remove ${product.name}`}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 ? (
                  <tr><td className={styles.emptyRow} colSpan={7}>No items added. Search the catalogue to continue.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={styles.checkoutGrid}>
            <label className={styles.remarksField}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} value={remarks} />
            </label>
            <section aria-label="Quotation total" aria-live="polite" className={styles.summary}>
              <dl>
                <div><dt>Subtotal</dt><dd>{formatQuotationCurrency(subtotal)}</dd></div>
                <div><dt>VAT (5%)</dt><dd>{formatQuotationCurrency(vat)}</dd></div>
                <div className={styles.totalRow}><dt>Total Amount</dt><dd>{formatQuotationCurrency(total)}</dd></div>
              </dl>
            </section>
          </div>

          <footer className={styles.footer}>
            <p
              aria-live="polite"
              className={feedback ? styles.feedback : "sr-only"}
              data-tone={feedback?.tone}
              role={feedback?.tone === "error" ? "alert" : "status"}
            >
              {feedback ? <CheckCircle2 aria-hidden="true" size={15} /> : null}
              {feedback?.message ?? ""}
            </p>
            <div className={styles.footerActions}>
              <button className="button" onClick={resetQuotation} type="button">
                <RotateCcw aria-hidden="true" size={15} />
                Reset
              </button>
              <button className="button button--primary" type="submit">
                <Save aria-hidden="true" size={15} />
                Save Quotation
              </button>
              <button className="button button--primary" onClick={() => persistQuotation("sent")} type="button">
                <Send aria-hidden="true" size={15} />
                Send to Customer
              </button>
            </div>
          </footer>
        </Card>
      </form>

      {customerModalOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <form aria-labelledby="new-customer-title" aria-modal="true" className={styles.modal} onSubmit={addCustomer} role="dialog">
            <header>
              <div>
                <h2 id="new-customer-title">Add New Customer</h2>
                <p>Create and select a customer for this quotation.</p>
              </div>
              <button aria-label="Close customer dialog" className={styles.closeButton} onClick={() => setCustomerModalOpen(false)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </header>
            <div className={styles.modalFields}>
              <label>
                <span>Customer Name <em>*</em></span>
                <input autoFocus className="field" onChange={(event) => setNewCustomer((current) => ({ ...current, name: event.target.value }))} placeholder="Enter customer name" value={newCustomer.name} />
              </label>
              <label>
                <span>Phone <em>*</em></span>
                <input className="field" inputMode="tel" onChange={(event) => setNewCustomer((current) => ({ ...current, phone: event.target.value }))} placeholder="Enter phone number" value={newCustomer.phone} />
              </label>
            </div>
            <footer>
              <button className="button" onClick={() => setCustomerModalOpen(false)} type="button">Cancel</button>
              <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={15} />Add Customer</button>
            </footer>
          </form>
        </div>
      ) : null}

      {previewOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section aria-labelledby="quotation-preview-title" aria-modal="true" className={`${styles.modal} ${styles.previewModal}`} role="dialog">
            <header>
              <div>
                <span className={styles.previewEyebrow}>Aarohan Jewellery</span>
                <h2 id="quotation-preview-title">Quotation {quotationNo}</h2>
                <p>Prepared for {customer.name} · valid until {validUntil}</p>
              </div>
              <button aria-label="Close quotation preview" className={styles.closeButton} onClick={() => setPreviewOpen(false)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </header>
            <div className={styles.previewBody}>
              <dl className={styles.previewCustomer}>
                <div><dt>Customer</dt><dd>{customer.name}</dd></div>
                <div><dt>Phone</dt><dd>{customer.phone}</dd></div>
                <div><dt>Date</dt><dd>{quotationDate}</dd></div>
              </dl>
              <div className={styles.previewLines}>
                {products.map((product) => (
                  <div key={product.id}>
                    <span>{product.name} ({product.code})</span>
                    <strong>{formatQuotationCurrency(getQuotationLineAmount(product))}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.previewTotal}><span>Total including VAT</span><strong>{formatQuotationCurrency(total)}</strong></div>
              {remarks ? <p className={styles.previewRemarks}>{remarks}</p> : null}
            </div>
            <footer>
              <button className="button" onClick={() => setPreviewOpen(false)} type="button">Close</button>
              <button className="button button--primary" onClick={() => window.print()} type="button">
                <Printer aria-hidden="true" size={15} />Print Preview
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
