"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Barcode,
  CalendarDays,
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatCurrency,
  getProductTotal,
  initialProducts,
  productCatalog,
  type Product,
} from "./invoice-data";
import styles from "./invoice-form.module.css";

type DiscountType = "percentage" | "flat";

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function InvoiceForm() {
  const [products, setProducts] = useState<Product[]>(() => [...initialProducts]);
  const [productQuery, setProductQuery] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountInput, setDiscountInput] = useState("5");
  const [remarks, setRemarks] = useState("Happy Customer");
  const [message, setMessage] = useState("");

  const subtotal = useMemo(
    () => products.reduce((total, product) => total + getProductTotal(product), 0),
    [products],
  );
  const discountNumber = Math.max(0, Number.parseFloat(discountInput) || 0);
  const discount = Math.min(
    subtotal,
    discountType === "percentage"
      ? Math.round(subtotal * Math.min(discountNumber, 100) / 100)
      : Math.round(discountNumber),
  );
  const totalAmount = subtotal - discount;

  function addProduct(mode: "search" | "barcode" = "search") {
    const addedProductIds = new Set(products.map((product) => product.id));
    const availableProducts = productCatalog.filter((product) => !addedProductIds.has(product.id));
    const normalizedQuery = productQuery.trim().toLowerCase();
    const candidate = mode === "barcode"
      ? availableProducts[0]
      : availableProducts.find((product) =>
          normalizedQuery.length === 0 ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.code.toLowerCase().includes(normalizedQuery) ||
          normalizedQuery.includes(product.name.toLowerCase()) ||
          normalizedQuery.includes(product.code.toLowerCase()),
        );

    if (!candidate) {
      setMessage(
        availableProducts.length === 0
          ? "All sample products have already been added."
          : "No available product matches that name or code.",
      );
      return;
    }

    setProducts((current) => [...current, candidate]);
    setProductQuery("");
    setMessage(`${candidate.name} added to this invoice.`);
  }

  function removeProduct(productToRemove: Product) {
    setProducts((current) => current.filter((product) => product.id !== productToRemove.id));
    setMessage(`${productToRemove.name} removed. You can add it again from the product search.`);
  }

  function resetInvoice() {
    setProducts([...initialProducts]);
    setProductQuery("");
    setDiscountType("percentage");
    setDiscountInput("5");
    setRemarks("Happy Customer");
    setMessage("Invoice reset to the original sample details.");
  }

  function submitInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (products.length === 0) {
      setMessage("Add at least one product before creating the invoice.");
      return;
    }
    setMessage(`Invoice S-000126 is ready with a total of ${formatCurrency(totalAmount)}.`);
  }

  return (
    <form className={styles.page} onSubmit={submitInvoice}>
      <PageHeader
        action={(
          <Link className={`button ${styles.backButton}`} href="/sales/invoices">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to List
          </Link>
        )}
        description="Add customer and products to create a new sales invoice"
        title="Create Sales Invoice"
      />

      <div className={styles.topGrid}>
        <Card className={styles.customerCard}>
          <SectionTitle title="Customer Information" />
          <div className={styles.customerSearchRow}>
            <label className={styles.searchField}>
              <Search aria-hidden="true" size={16} />
              <span className="sr-only">Search customer</span>
              <input list="customer-options" placeholder="Search customer by name or mobile..." type="search" />
              <datalist id="customer-options">
                <option value="Rahim Uddin" />
                <option value="Nusrat Jahan" />
                <option value="Tanvir Ahmed" />
              </datalist>
            </label>
            <button className="button button--primary" onClick={() => setMessage("New customer details can be added before saving the invoice.")} type="button">
              <Plus aria-hidden="true" size={15} />
              New Customer
            </button>
          </div>
          <dl className={styles.customerDetails}>
            <InfoItem label="Name" value="Rahim Uddin" />
            <InfoItem label="Mobile" value="017XXXXXXXX" />
            <InfoItem label="Customer Type" value="Regular" />
            <InfoItem label="Address" value="Dhaka, Bangladesh" />
          </dl>
        </Card>

        <Card className={styles.invoiceInfoCard}>
          <SectionTitle title="Invoice Information" />
          <div className={styles.invoiceFields}>
            <label className={styles.fullField}>
              <span>Invoice No</span>
              <input className="field" defaultValue="S-000126" readOnly />
            </label>
            <label>
              <span>Date</span>
              <span className={styles.dateInput}>
                <input aria-label="Invoice date" className="field" defaultValue="2025-04-30" type="date" />
                <CalendarDays aria-hidden="true" size={15} />
              </span>
            </label>
            <label>
              <span>Due Date</span>
              <span className={styles.dateInput}>
                <input aria-label="Invoice due date" className="field" defaultValue="2025-04-30" type="date" />
                <CalendarDays aria-hidden="true" size={15} />
              </span>
            </label>
            <label>
              <span>Sale Person</span>
              <select className="select" defaultValue="Admin">
                <option>Admin</option>
                <option>Sales Executive</option>
              </select>
            </label>
            <label>
              <span>Branch</span>
              <select className="select" defaultValue="Main Branch">
                <option>Main Branch</option>
                <option>Gulshan Branch</option>
              </select>
            </label>
          </div>
        </Card>
      </div>

      <Card className={styles.productsCard}>
        <div className={styles.productsHeading}>
          <SectionTitle description="Search the catalogue or scan a barcode" title="Add Products" />
          <div className={styles.productActions}>
            <button className="button button--outline-gold" onClick={() => addProduct("barcode")} type="button">
              <Barcode aria-hidden="true" size={16} />
              Barcode Scan
            </button>
            <button className="button button--primary" onClick={() => addProduct()} type="button">
              <Plus aria-hidden="true" size={16} />
              Add Product
            </button>
          </div>
        </div>

        <label className={`${styles.searchField} ${styles.productSearch}`}>
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">Search product</span>
          <input
            list="product-options"
            onChange={(event) => setProductQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addProduct();
              }
            }}
            placeholder="Search product by name, code or scan barcode..."
            type="search"
            value={productQuery}
          />
          <datalist id="product-options">
            {productCatalog.map((product) => <option key={product.id} value={`${product.name} — ${product.code}`} />)}
          </datalist>
        </label>

        <div className={styles.productTableScroller}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Code</th>
                <th scope="col">Purity</th>
                <th scope="col">Weight</th>
                <th scope="col">Making Charge</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Total</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td><strong>{product.name}</strong></td>
                  <td className={styles.code}>{product.code}</td>
                  <td>{product.purity}</td>
                  <td>{product.weight.toFixed(2)} g</td>
                  <td>{formatCurrency(product.makingCharge)}</td>
                  <td>{formatCurrency(product.unitPrice)}</td>
                  <td className={styles.lineTotal}>{formatCurrency(getProductTotal(product))}</td>
                  <td>
                    <button
                      aria-label={`Remove ${product.name}`}
                      className={styles.removeButton}
                      onClick={() => removeProduct(product)}
                      title="Remove product"
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td className={styles.emptyProducts} colSpan={9}>No products added yet. Search the catalogue to begin.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className={styles.checkoutCard}>
        <section className={styles.additionalInfo}>
          <SectionTitle title="Additional Information" />
          <div className={styles.discountFields}>
            <label>
              <span>Discount Type</span>
              <select className="select" onChange={(event) => setDiscountType(event.target.value as DiscountType)} value={discountType}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </label>
            <label>
              <span>Discount</span>
              <span className={styles.discountInput}>
                <input
                  aria-label="Discount value"
                  className="field"
                  inputMode="decimal"
                  min="0"
                  onChange={(event) => setDiscountInput(event.target.value)}
                  step="0.01"
                  type="number"
                  value={discountInput}
                />
                <span>{discountType === "percentage" ? "%" : "৳"}</span>
              </span>
            </label>
          </div>
          <label className={styles.remarks}>
            <span>Remarks</span>
            <textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} value={remarks} />
          </label>
        </section>

        <section aria-live="polite" className={styles.summary}>
          <SectionTitle title="Invoice Summary" />
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div>
              <dt>Discount {discountType === "percentage" ? `(${Math.min(discountNumber, 100)}%)` : ""}</dt>
              <dd>− {formatCurrency(discount)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Total Amount</dt>
              <dd>{formatCurrency(totalAmount)}</dd>
            </div>
          </dl>
        </section>

        <div className={styles.formFooter}>
          <p aria-live="polite" className={message ? styles.message : "sr-only"}>
            {message ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
            {message}
          </p>
          <div className={styles.footerActions}>
            <button className="button" onClick={resetInvoice} type="button">
              <RotateCcw aria-hidden="true" size={15} />
              Reset
            </button>
            <button className="button button--outline-gold" onClick={() => setMessage("Invoice S-000126 saved as a draft.")} type="button">
              <Save aria-hidden="true" size={15} />
              Save as Draft
            </button>
            <button className="button button--primary" disabled={products.length === 0} type="submit">
              <CheckCircle2 aria-hidden="true" size={16} />
              Create Invoice
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
}
