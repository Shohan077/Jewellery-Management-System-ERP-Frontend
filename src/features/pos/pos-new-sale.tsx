"use client";

import {
  Barcode,
  CheckCircle2,
  CreditCard,
  Landmark,
  Plus,
  Printer,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatPosCurrency,
  getPosLineTotal,
  initialPosProducts,
  posCustomers,
  posProductCatalog,
  type PosCustomer,
  type PosProduct,
} from "./pos-data";
import styles from "./pos-new-sale.module.css";

type PaymentMethod = "Cash" | "Card" | "Bank Transfer" | "Due / Credit";
type DiscountType = "percentage" | "flat";

const paymentMethods: Array<{ icon: ReactNode; value: PaymentMethod }> = [
  { icon: <WalletCards aria-hidden="true" size={15} />, value: "Cash" },
  { icon: <CreditCard aria-hidden="true" size={15} />, value: "Card" },
  { icon: <Landmark aria-hidden="true" size={15} />, value: "Bank Transfer" },
  { icon: <UserRound aria-hidden="true" size={15} />, value: "Due / Credit" },
];

function CustomerPicker({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (customer: PosCustomer) => void;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filteredCustomers = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    if (!search) return posCustomers;
    return posCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(search)
      || customer.phone.includes(search)
      || customer.id.toLowerCase().includes(search),
    );
  }, [deferredQuery]);

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Card aria-labelledby="customer-picker-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="customer-picker-title">Select Customer</h2>
            <p>Find an existing customer for this sale.</p>
          </div>
          <button aria-label="Close customer selection" className={styles.iconButton} onClick={onClose} type="button">
            <X aria-hidden="true" size={19} />
          </button>
        </header>
        <label className={styles.modalSearch}>
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search customers</span>
          <input
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, phone or customer ID..."
            type="search"
            value={query}
          />
        </label>
        <div className={styles.customerResults}>
          {filteredCustomers.map((customer) => (
            <button className={styles.customerResult} key={customer.id} onClick={() => onSelect(customer)} type="button">
              <span className={styles.customerAvatar}>{customer.name.split(" ").map((name) => name[0]).join("")}</span>
              <span>
                <strong>{customer.name}</strong>
                <small>{customer.phone} · {customer.id}</small>
              </span>
              <span className={styles.chooseLabel}>Choose</span>
            </button>
          ))}
          {filteredCustomers.length === 0 ? <p className={styles.noResults}>No customer matches that search.</p> : null}
        </div>
      </Card>
    </div>
  );
}

function DiscountDialog({
  currentType,
  currentValue,
  onApply,
  onClose,
}: {
  currentType: DiscountType;
  currentValue: string;
  onApply: (type: DiscountType, value: string) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState(currentType);
  const [value, setValue] = useState(currentValue);

  function applyDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(type, value);
  }

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Card aria-labelledby="discount-title" aria-modal="true" as="section" className={`${styles.modal} ${styles.discountModal}`} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="discount-title">Apply Discount</h2>
            <p>Apply a percentage or a fixed amount to this sale.</p>
          </div>
          <button aria-label="Close discount dialog" className={styles.iconButton} onClick={onClose} type="button">
            <X aria-hidden="true" size={19} />
          </button>
        </header>
        <form className={styles.discountForm} onSubmit={applyDiscount}>
          <label>
            <span>Discount Type</span>
            <select className="select" onChange={(event) => setType(event.target.value as DiscountType)} value={type}>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Amount</option>
            </select>
          </label>
          <label>
            <span>{type === "percentage" ? "Percentage (%)" : "Amount (৳)"}</span>
            <input
              autoFocus
              className="field"
              inputMode="decimal"
              max={type === "percentage" ? 100 : undefined}
              min="0"
              onChange={(event) => setValue(event.target.value)}
              required
              step="0.01"
              type="number"
              value={value}
            />
          </label>
          <div className={styles.modalActions}>
            <button className="button" onClick={onClose} type="button">Cancel</button>
            <button className="button button--primary" type="submit">Apply Discount</button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function PosNewSale() {
  const [products, setProducts] = useState<PosProduct[]>(() => [...initialPosProducts]);
  const [productQuery, setProductQuery] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountInput, setDiscountInput] = useState("0");
  const [paidInput, setPaidInput] = useState("218450");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = useMemo(
    () => products.reduce((sum, product) => sum + getPosLineTotal(product), 0),
    [products],
  );
  const discountNumber = Math.max(0, Number.parseFloat(discountInput) || 0);
  const discountAmount = Math.min(
    subtotal,
    discountType === "percentage"
      ? Math.round(subtotal * Math.min(discountNumber, 100) / 100)
      : Math.round(discountNumber),
  );
  const vat = Math.round((subtotal - discountAmount) * 0.05);
  const roundOff = 0;
  const totalAmount = subtotal - discountAmount + vat + roundOff;
  const paidAmount = Math.max(0, Number.parseFloat(paidInput) || 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  function addProduct(mode: "search" | "scan" = "search") {
    const addedIds = new Set(products.map((product) => product.id));
    const availableProducts = posProductCatalog.filter((product) => !addedIds.has(product.id));
    const search = productQuery.trim().toLowerCase();
    const candidate = mode === "scan"
      ? availableProducts[0]
      : availableProducts.find((product) =>
          !search
          || product.name.toLowerCase().includes(search)
          || product.code.toLowerCase().includes(search)
          || search.includes(product.name.toLowerCase())
          || search.includes(product.code.toLowerCase()),
        );

    if (!candidate) {
      setMessage(availableProducts.length === 0 ? "Every sample product is already in this sale." : "No available product matches that search.");
      return;
    }
    setProducts((current) => [...current, candidate]);
    setProductQuery("");
    setMessage(mode === "scan" ? `Barcode read successfully — ${candidate.name} added.` : `${candidate.name} added to the sale.`);
  }

  function removeProduct(product: PosProduct) {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage(`${product.name} removed from the sale.`);
  }

  function chooseCustomer(customer: PosCustomer) {
    setCustomerName(customer.name);
    setPhone(customer.phone);
    setAddress(customer.address);
    setCustomerPickerOpen(false);
    setMessage(`${customer.name} selected for this sale.`);
  }

  function selectWalkIn() {
    setCustomerName("Walk-in Customer");
    setPhone("");
    setAddress("");
    setMessage("Walk-in customer selected.");
  }

  function validateSale() {
    if (products.length === 0) {
      setMessage("Add at least one product before saving this sale.");
      return false;
    }
    if (paidAmount > totalAmount) {
      setMessage("Paid amount cannot be greater than the invoice total.");
      return false;
    }
    if (paymentMethod !== "Due / Credit" && dueAmount > 0) {
      setMessage("Choose Due / Credit or enter the full paid amount before saving.");
      return false;
    }
    return true;
  }

  function persistSale(action: "save" | "save-print") {
    if (!validateSale()) return;
    const invoice = {
      id: "S-2025-00126",
      createdAt: new Date().toISOString(),
      customer: { name: customerName, phone, address },
      products,
      paymentMethod,
      subtotal,
      discountAmount,
      vat,
      totalAmount,
      paidAmount,
      dueAmount,
    };
    window.localStorage.setItem("jewellery-erp:pos:last-sale:v1", JSON.stringify(invoice));
    setMessage(`Sale S-2025-00126 saved successfully for ${formatPosCurrency(totalAmount)}.`);
    if (action === "save-print") window.setTimeout(() => window.print(), 120);
  }

  function printInvoice() {
    if (!validateSale()) return;
    setMessage("Invoice is ready to print.");
    window.print();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.customerButtons}>
            <button className={`button ${customerName === "Walk-in Customer" ? styles.activeCustomerButton : ""}`} onClick={selectWalkIn} type="button">
              <UserRound aria-hidden="true" size={16} />
              Walk-in Customer
            </button>
            <button className="button button--primary" onClick={() => setCustomerPickerOpen(true)} type="button">
              <Plus aria-hidden="true" size={16} />
              Select Customer
            </button>
          </div>
        )}
        description="Create a new sales invoice"
        title="POS - New Sale"
      />

      <Card className={styles.saleCard}>
        <div className={styles.productToolbar}>
          <label className={styles.productSearch}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Scan barcode or search product</span>
            <input
              list="pos-product-options"
              onChange={(event) => setProductQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addProduct();
                }
              }}
              placeholder="Scan barcode or search product..."
              type="search"
              value={productQuery}
            />
            <datalist id="pos-product-options">
              {posProductCatalog.map((product) => <option key={product.id} value={`${product.name} (${product.code})`} />)}
            </datalist>
          </label>
          <button aria-label="Scan a product barcode" className={styles.scanButton} onClick={() => addProduct("scan")} title="Scan barcode" type="button">
            <Barcode aria-hidden="true" size={19} />
          </button>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.productTable}>
            <caption className="sr-only">Products in the new POS sale</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Purity</th>
                <th scope="col">Weight</th>
                <th scope="col">Rate (৳)</th>
                <th scope="col">Amount (৳)</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td><span className={styles.productName}><span className={styles.productGlyph}>◊</span><strong>{product.name} ({product.code})</strong></span></td>
                  <td>{product.purity}</td>
                  <td>{product.weight.toFixed(2)} g</td>
                  <td>{product.rate.toLocaleString("en-IN")}</td>
                  <td className={styles.amount}>{getPosLineTotal(product).toLocaleString("en-IN")}</td>
                  <td>
                    <button aria-label={`Remove ${product.name}`} className={styles.removeButton} onClick={() => removeProduct(product)} title="Remove item" type="button">
                      <Trash2 aria-hidden="true" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? <tr><td className={styles.emptyTable} colSpan={7}>No products added. Use the product search or barcode scanner to begin.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className={styles.lineActions}>
          <button className="button button--primary" onClick={() => addProduct()} type="button"><Plus aria-hidden="true" size={16} />Add Item</button>
          <button className={styles.textButton} onClick={() => setDiscountDialogOpen(true)} type="button">%&nbsp; Apply Discount</button>
          <button className={styles.clearButton} disabled={products.length === 0} onClick={() => { setProducts([]); setPaidInput("0"); setMessage("All sale items cleared."); }} type="button"><X aria-hidden="true" size={15} />Clear All</button>
        </div>

        <div className={styles.checkoutGrid}>
          <section className={styles.customerSection}>
            <h2>Customer Information</h2>
            <label>
              <span>Customer</span>
              <select
                className="select"
                onChange={(event) => {
                  if (event.target.value === "Walk-in Customer") selectWalkIn();
                  else {
                    const customer = posCustomers.find((item) => item.name === event.target.value);
                    if (customer) chooseCustomer(customer);
                  }
                }}
                value={customerName}
              >
                <option>Walk-in Customer</option>
                {posCustomers.map((customer) => <option key={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <label>
              <span>Phone</span>
              <input className="field" onChange={(event) => setPhone(event.target.value)} placeholder="Enter phone number" type="tel" value={phone} />
            </label>
            <label>
              <span>Address</span>
              <input className="field" onChange={(event) => setAddress(event.target.value)} placeholder="Enter address (optional)" value={address} />
            </label>
            <fieldset className={styles.paymentMethods}>
              <legend>Payment Method</legend>
              <div>
                {paymentMethods.map((method) => (
                  <label className={paymentMethod === method.value ? styles.selectedPayment : ""} key={method.value}>
                    <input checked={paymentMethod === method.value} name="payment-method" onChange={() => setPaymentMethod(method.value)} type="radio" />
                    {method.icon}
                    <span>{method.value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section aria-label="Invoice totals" className={styles.summarySection}>
            <dl className={styles.summaryList}>
              <div><dt>Subtotal</dt><dd>{formatPosCurrency(subtotal)}</dd></div>
              <div><dt>Discount{discountAmount > 0 ? ` (${discountType === "percentage" ? `${Math.min(discountNumber, 100)}%` : "Flat"})` : ""}</dt><dd>− {formatPosCurrency(discountAmount)}</dd></div>
              <div><dt>VAT (5%)</dt><dd>{formatPosCurrency(vat)}</dd></div>
              <div><dt>Round Off</dt><dd>{formatPosCurrency(roundOff)}</dd></div>
              <div className={styles.totalRow}><dt>Total Amount</dt><dd>{formatPosCurrency(totalAmount)}</dd></div>
              <div className={styles.paidRow}>
                <dt><label htmlFor="paid-amount">Paid Amount</label></dt>
                <dd><input id="paid-amount" min="0" onChange={(event) => setPaidInput(event.target.value)} step="1" type="number" value={paidInput} /></dd>
              </div>
              <div className={styles.dueRow}><dt>Due Amount</dt><dd>{formatPosCurrency(dueAmount)}</dd></div>
            </dl>
          </section>
        </div>

        <footer className={styles.footer}>
          <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message ? <CheckCircle2 aria-hidden="true" size={16} /> : null}{message}</p>
          <div className={styles.footerActions}>
            <button className="button" onClick={printInvoice} type="button"><Printer aria-hidden="true" size={16} />Print Invoice</button>
            <button className="button button--primary" onClick={() => persistSale("save-print")} type="button"><Printer aria-hidden="true" size={16} />Save &amp; Print</button>
            <button className="button button--outline-gold" onClick={() => persistSale("save")} type="button">Save Only</button>
          </div>
        </footer>
      </Card>

      {customerPickerOpen ? <CustomerPicker onClose={() => setCustomerPickerOpen(false)} onSelect={chooseCustomer} /> : null}
      {discountDialogOpen ? (
        <DiscountDialog
          currentType={discountType}
          currentValue={discountInput}
          onApply={(type, value) => {
            const normalizedValue = String(Math.max(0, Number.parseFloat(value) || 0));
            setDiscountType(type);
            setDiscountInput(normalizedValue);
            setDiscountDialogOpen(false);
            setMessage("Discount applied to the sale.");
          }}
          onClose={() => setDiscountDialogOpen(false)}
        />
      ) : null}
    </div>
  );
}
