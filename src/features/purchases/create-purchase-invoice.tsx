"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatPurchaseCurrency,
  getPurchaseProductTotal,
  initialPurchaseProducts,
  materialPurchaseProducts,
  purchaseProductCatalog,
  suppliers,
  type PurchaseProduct,
} from "./purchase-data";
import styles from "./create-purchase-invoice.module.css";

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function SupplierDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.supplierDetail}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

type CreatePurchaseInvoiceProps = {
  variant?: "jewellery" | "materials";
};

export function CreatePurchaseInvoice({ variant = "jewellery" }: CreatePurchaseInvoiceProps) {
  const isMaterials = variant === "materials";
  const productCatalog = isMaterials ? materialPurchaseProducts : purchaseProductCatalog;
  const startingProducts = isMaterials ? materialPurchaseProducts : initialPurchaseProducts;
  const startingInvoiceNo = isMaterials ? "PI-000127" : "PI-000126";
  const startingReferenceNo = isMaterials ? "PO-000127" : "AGT-2025-0430";
  const startingRemarks = isMaterials ? "Purchased for new collection." : "";
  const [supplierQuery, setSupplierQuery] = useState("Ali Gold Traders");
  const [selectedSupplierId, setSelectedSupplierId] = useState("ali-gold");
  const [invoiceNo, setInvoiceNo] = useState(startingInvoiceNo);
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState(startingReferenceNo);
  const [invoiceDate, setInvoiceDate] = useState("2025-04-30");
  const [purchaseType, setPurchaseType] = useState("Gold Purchase");
  const [branch, setBranch] = useState("Main Branch");
  const [products, setProducts] = useState<PurchaseProduct[]>(() => [...startingProducts]);
  const [productQuery, setProductQuery] = useState("");
  const [discountInput, setDiscountInput] = useState("0");
  const [remarks, setRemarks] = useState(startingRemarks);
  const [message, setMessage] = useState("");

  const selectedSupplier = suppliers.find((supplier) => supplier.id === selectedSupplierId) ?? suppliers[0];
  const subtotal = useMemo(
    () => products.reduce((total, product) => total + getPurchaseProductTotal(product), 0),
    [products],
  );
  const discount = Math.min(subtotal, Math.max(0, Math.round(Number.parseFloat(discountInput) || 0)));
  const totalAmount = subtotal - discount;

  function updateSupplier(value: string) {
    setSupplierQuery(value);
    const normalizedValue = value.trim().toLowerCase();
    const match = suppliers.find((supplier) => supplier.name.toLowerCase() === normalizedValue);
    if (match) {
      setSelectedSupplierId(match.id);
      setMessage(`${match.name} selected as the supplier.`);
    }
  }

  function addProduct() {
    const selectedIds = new Set(products.map((product) => product.id));
    const availableProducts = productCatalog.filter((product) => !selectedIds.has(product.id));
    const normalizedQuery = productQuery.trim().toLowerCase();
    const candidate = availableProducts.find((product) =>
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
    setMessage(`${candidate.name} added to this purchase.`);
  }

  function removeProduct(productToRemove: PurchaseProduct) {
    setProducts((current) => current.filter((product) => product.id !== productToRemove.id));
    setMessage(`${productToRemove.name} removed. It remains available in product search.`);
  }

  function resetPurchase() {
    setSupplierQuery("Ali Gold Traders");
    setSelectedSupplierId("ali-gold");
    setInvoiceNo(startingInvoiceNo);
    setSupplierInvoiceNo(startingReferenceNo);
    setInvoiceDate("2025-04-30");
    setPurchaseType("Gold Purchase");
    setBranch("Main Branch");
    setProducts([...startingProducts]);
    setProductQuery("");
    setDiscountInput("0");
    setRemarks(startingRemarks);
    setMessage("Purchase invoice reset to the original sample details.");
  }

  function postPurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supplierQuery.trim()) {
      setMessage("Select a supplier before posting this purchase invoice.");
      return;
    }
    if (products.length === 0) {
      setMessage("Add at least one product before posting this purchase invoice.");
      return;
    }
    setMessage(`${invoiceNo || "Purchase invoice"} is ready to post for ${formatPurchaseCurrency(totalAmount)}.`);
  }

  return (
    <form className={styles.page} onSubmit={postPurchase}>
      <PageHeader
        action={(
          <Link className={`button ${styles.backButton}`} href="/purchases">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to List
          </Link>
        )}
        description="Add supplier and products to create a new purchase invoice"
        title="Create Purchase Invoice"
      />

      <div className={styles.topGrid}>
        <Card className={styles.supplierCard}>
          <SectionTitle title="Supplier Information" />
          <div className={styles.supplierSearchRow}>
            <label className={styles.searchField}>
              <Search aria-hidden="true" size={16} />
              <span className="sr-only">Search and select supplier</span>
              <input
                list="supplier-options"
                onChange={(event) => updateSupplier(event.target.value)}
                placeholder="Select supplier"
                type="search"
                value={supplierQuery}
              />
              <datalist id="supplier-options">
                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.name} />)}
              </datalist>
            </label>
            <button
              aria-label="Add a new supplier"
              className={`button button--primary ${styles.addSupplierButton}`}
              onClick={() => setMessage("New supplier details can be added before saving the invoice.")}
              title="Add supplier"
              type="button"
            >
              <Plus aria-hidden="true" size={17} />
            </button>
          </div>
          <dl className={styles.supplierDetails}>
            <SupplierDetail label="Supplier Name" value={selectedSupplier.name} />
            <SupplierDetail label="Contact Person" value={selectedSupplier.contactPerson} />
            <SupplierDetail label="Phone" value={selectedSupplier.phone} />
            <SupplierDetail label="Address" value={selectedSupplier.address} />
          </dl>
        </Card>

        <Card className={styles.invoiceCard}>
          <SectionTitle title="Invoice Information" />
          <div className={styles.invoiceFields}>
            <label>
              <span>Invoice No</span>
              <input className="field" onChange={(event) => setInvoiceNo(event.target.value)} required value={invoiceNo} />
            </label>
            <label>
              <span>Date</span>
              <span className={styles.dateInput}>
                <input className="field" onChange={(event) => setInvoiceDate(event.target.value)} required type="date" value={invoiceDate} />
                <CalendarDays aria-hidden="true" size={15} />
              </span>
            </label>
            <label>
              <span>{isMaterials ? "Reference / PO No" : "Supplier Invoice No"}</span>
              <input className="field" onChange={(event) => setSupplierInvoiceNo(event.target.value)} value={supplierInvoiceNo} />
            </label>
            <label>
              <span>Purchase Type</span>
              <select className="select" onChange={(event) => setPurchaseType(event.target.value)} value={purchaseType}>
                <option>Gold Purchase</option>
                <option>Diamond Purchase</option>
                <option>Other Purchase</option>
              </select>
            </label>
            <label className={styles.fullField}>
              <span>Branch</span>
              <select className="select" onChange={(event) => setBranch(event.target.value)} value={branch}>
                <option>Main Branch</option>
                <option>Gulshan Branch</option>
              </select>
            </label>
          </div>
        </Card>
      </div>

      <Card className={styles.productsCard}>
        <div className={styles.productsHeading}>
          <SectionTitle title="Add Products" />
          <button className="button button--primary" onClick={addProduct} type="button">
            <Plus aria-hidden="true" size={16} />
            Add Product
          </button>
        </div>
        <label className={`${styles.searchField} ${styles.productSearch}`}>
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">Search products</span>
          <input
            list="purchase-product-options"
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
          <datalist id="purchase-product-options">
            {productCatalog.map((product) => <option key={product.id} value={`${product.name} — ${product.code}`} />)}
          </datalist>
        </label>

        <div className={styles.tableScroller}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Code</th>
                <th scope="col">Purity</th>
                <th scope="col">Weight</th>
                <th scope="col">Rate (৳)</th>
                <th scope="col">Total (৳)</th>
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
                  <td>{formatPurchaseCurrency(product.rate)}</td>
                  <td className={styles.lineTotal}>{formatPurchaseCurrency(getPurchaseProductTotal(product))}</td>
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
                  <td className={styles.emptyProducts} colSpan={8}>No products added yet. Search the catalogue to begin.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className={styles.checkoutCard}>
        <section className={styles.additionalInfo}>
          <SectionTitle title="Additional Information" />
          <label className={styles.remarks}>
            <span>Remarks</span>
            <textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} placeholder="Enter remarks..." value={remarks} />
          </label>
        </section>

        <section aria-live="polite" className={styles.summary}>
          <SectionTitle title="Amount Summary" />
          <dl>
            <div>
              <dt>Sub Total</dt>
              <dd>{formatPurchaseCurrency(subtotal)}</dd>
            </div>
            <div className={styles.discountRow}>
              <dt><label htmlFor="purchase-discount">Discount (৳)</label></dt>
              <dd>
                <input
                  className="field"
                  id="purchase-discount"
                  inputMode="decimal"
                  min="0"
                  onChange={(event) => setDiscountInput(event.target.value)}
                  step="1"
                  type="number"
                  value={discountInput}
                />
              </dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Total Amount</dt>
              <dd>{formatPurchaseCurrency(totalAmount)}</dd>
            </div>
          </dl>
        </section>

        <footer className={styles.formFooter}>
          <p aria-live="polite" className={message ? styles.message : "sr-only"}>
            {message ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
            {message}
          </p>
          <div className={styles.footerActions}>
            <button className="button" onClick={resetPurchase} type="button">
              <RotateCcw aria-hidden="true" size={15} />
              Reset
            </button>
            <button className="button button--outline-gold" onClick={() => setMessage(`${invoiceNo || "Purchase invoice"} saved as a draft.`)} type="button">
              <Save aria-hidden="true" size={15} />
              Save as Draft
            </button>
            <button className="button button--primary" disabled={products.length === 0} type="submit">
              <Send aria-hidden="true" size={15} />
              {isMaterials ? "Post Purchase" : "Post Invoice"}
            </button>
          </div>
        </footer>
      </Card>
    </form>
  );
}
