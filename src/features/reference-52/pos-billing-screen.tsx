"use client";

import {
  Barcode,
  CheckCircle2,
  CircleDot,
  CreditCard,
  Gem,
  Pause,
  Printer,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import styles from "./pos-billing-screen.module.css";

type ProductKind = "necklace" | "earrings" | "ring" | "bracelet";

type SaleItem = {
  id: string;
  name: string;
  purity: string;
  weight: number;
  rate: number;
  makingPercent: number;
  makingCharge: number;
  amount: number;
  kind: ProductKind;
};

type DiscountType = "fixed" | "percent";

const initialItems: SaleItem[] = [
  {
    id: "GN-2201",
    name: "Gold Necklace",
    purity: "22K",
    weight: 18.25,
    rate: 8_950,
    makingPercent: 15,
    makingCharge: 27_000,
    amount: 183_431,
    kind: "necklace",
  },
  {
    id: "GE-2208",
    name: "Gold Earrings",
    purity: "22K",
    weight: 6.12,
    rate: 8_950,
    makingPercent: 15,
    makingCharge: 9_000,
    amount: 61_808,
    kind: "earrings",
  },
  {
    id: "GR-2214",
    name: "Gold Ring",
    purity: "22K",
    weight: 4.75,
    rate: 8_950,
    makingPercent: 15,
    makingCharge: 7_062,
    amount: 47_848,
    kind: "ring",
  },
];

const productCatalog: SaleItem[] = [
  ...initialItems,
  {
    id: "GB-1812",
    name: "Gold Bracelet",
    purity: "18K",
    weight: 8.4,
    rate: 7_450,
    makingPercent: 12,
    makingCharge: 7_510,
    amount: 70_090,
    kind: "bracelet",
  },
];

const formatMoney = (value: number) => new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
}).format(Math.round(value));

const formatWeight = (value: number) => value.toLocaleString("en-US", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function ProductArtwork({ kind }: { kind: ProductKind }) {
  const icon = kind === "necklace"
    ? <Gem aria-hidden="true" />
    : kind === "earrings"
      ? <Sparkles aria-hidden="true" />
      : <CircleDot aria-hidden="true" />;

  return <span className={`${styles.productArtwork} ${styles[kind]}`}>{icon}</span>;
}

export function Reference52PosBilling() {
  const [items, setItems] = useState<SaleItem[]>(initialItems);
  const [customer, setCustomer] = useState("Walk-in Customer");
  const [phone, setPhone] = useState("017XXXXXXXX");
  const [salesPerson, setSalesPerson] = useState("Select Sales Person");
  const [productQuery, setProductQuery] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("fixed");
  const [discountInput, setDiscountInput] = useState("5000");
  const [vatRate, setVatRate] = useState("5");
  const [paidInput, setPaidInput] = useState("0");
  const [feedback, setFeedback] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const makingCharge = items.reduce((sum, item) => sum + item.makingCharge, 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const enteredDiscount = Math.max(0, Number.parseFloat(discountInput) || 0);
    const discount = discountType === "percent"
      ? Math.min(subtotal, subtotal * Math.min(enteredDiscount, 100) / 100)
      : Math.min(subtotal, enteredDiscount);
    const taxableAmount = Math.max(0, subtotal - discount);
    const vat = taxableAmount * Math.max(0, Number.parseFloat(vatRate) || 0) / 100;
    const grandTotal = Math.round(taxableAmount + vat);
    const paid = Math.max(0, Number.parseFloat(paidInput) || 0);
    const due = Math.max(0, grandTotal - paid);

    return { subtotal, makingCharge, totalWeight, discount, vat, grandTotal, paid, due };
  }, [discountInput, discountType, items, paidInput, vatRate]);

  function removeItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.filter((entry) => entry.id !== id));
    setFeedback(item ? `${item.name} removed from the cart.` : "Item removed from the cart.");
  }

  function clearCart() {
    setItems([]);
    setPaidInput("0");
    setFeedback("Cart cleared.");
  }

  function addProduct(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const query = productQuery.trim().toLowerCase();
    const matches = productCatalog.filter((entry) => !query
      || entry.id.toLowerCase().includes(query)
      || entry.name.toLowerCase().includes(query)
      || `${entry.name} (${entry.id})`.toLowerCase().includes(query));
    const product = matches.find((entry) => !items.some((item) => item.id === entry.id)) ?? matches[0];

    if (!product) {
      setFeedback(query ? "No matching product was found." : "Every demo product is already in the cart.");
      return;
    }
    if (items.some((item) => item.id === product.id)) {
      setFeedback(`${product.name} is already in the cart.`);
      return;
    }
    setItems((current) => [...current, product]);
    setProductQuery("");
    setFeedback(`${product.name} added to the cart.`);
  }

  function holdSale() {
    setFeedback(`Sale held with ${items.length} item${items.length === 1 ? "" : "s"}.`);
  }

  function saveDraft() {
    setFeedback(`Draft saved for ${customer}.`);
  }

  function takePayment() {
    if (items.length === 0) {
      setFeedback("Add an item before taking payment.");
      return;
    }
    setPaidInput(String(totals.grandTotal));
    setFeedback(`Payment of ৳ ${formatMoney(totals.grandTotal)} recorded successfully.`);
  }

  function preparePrint() {
    if (items.length === 0) {
      setFeedback("There is no invoice to print.");
      return;
    }
    setFeedback("Invoice is ready to print.");
  }

  return (
    <section aria-label="POS billing workspace" className={styles.page}>
      <div className={styles.customerCard}>
        <label className={styles.field}>
          <span>Customer</span>
          <select onChange={(event) => setCustomer(event.target.value)} value={customer}>
            <option>Walk-in Customer</option>
            <option>Nusrat Jahan</option>
            <option>Arif Hossain</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Phone</span>
          <input
            inputMode="tel"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter phone number"
            type="tel"
            value={phone}
          />
        </label>
        <label className={styles.field}>
          <span>Sales Person</span>
          <select onChange={(event) => setSalesPerson(event.target.value)} value={salesPerson}>
            <option>Select Sales Person</option>
            <option>Masud Rana</option>
            <option>Farhana Akter</option>
          </select>
        </label>
      </div>

      <div className={styles.billingGrid}>
        <div className={styles.checkoutColumn}>
          <section className={styles.itemsCard}>
            <form className={styles.productSearch} onSubmit={addProduct}>
              <Search aria-hidden="true" />
              <input
                aria-label="Scan barcode or search item"
                list="reference-52-pos-products"
                onChange={(event) => setProductQuery(event.target.value)}
                placeholder="Scan Barcode / Search Item (F3)"
                type="search"
                value={productQuery}
              />
              <datalist id="reference-52-pos-products">
                {productCatalog.map((product) => (
                  <option key={product.id} value={`${product.name} (${product.id})`} />
                ))}
              </datalist>
              <button aria-label="Add scanned product" title="Add scanned product" type="submit">
                <Barcode aria-hidden="true" />
              </button>
            </form>

            <div className={styles.tableScroller}>
              <table className={styles.itemsTable}>
                <caption className="sr-only">Products currently included in this sale</caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Purity</th>
                    <th scope="col">Weight (gm)</th>
                    <th scope="col">Rate (৳/gm)</th>
                    <th scope="col">Making (%)</th>
                    <th scope="col">Amount (৳)</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.purity}</td>
                      <td>{formatWeight(item.weight)}</td>
                      <td>{formatMoney(item.rate)}</td>
                      <td>{item.makingPercent}%</td>
                      <td><strong>{formatMoney(item.amount)}</strong></td>
                      <td>
                        <button
                          aria-label={`Remove ${item.name}`}
                          className={styles.deleteButton}
                          onClick={() => removeItem(item.id)}
                          title={`Remove ${item.name}`}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 ? (
                    <tr><td className={styles.emptyCart} colSpan={8}>The cart is empty. Search or scan a product to begin.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className={styles.itemFooter}>
              <div className={styles.itemButtons}>
                <button onClick={holdSale} type="button"><Pause aria-hidden="true" />Hold (F6)</button>
                <button disabled={items.length === 0} onClick={clearCart} type="button">Clear Cart (F7)</button>
              </div>
              <dl className={styles.itemTotals}>
                <div><dt>Total Weight</dt><dd>{formatWeight(totals.totalWeight)} gm</dd></div>
                <div><dt>Making Charge</dt><dd>{formatMoney(totals.makingCharge)}</dd></div>
                <div><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
              </dl>
            </div>
          </section>

          <section className={styles.paymentCard}>
            <div className={styles.paymentControls}>
              <div className={styles.discountBlock}>
                <span className={styles.controlLabel}>Discount</span>
                <div className={styles.discountControl}>
                  <input
                    aria-label={`Discount ${discountType === "fixed" ? "amount" : "percentage"}`}
                    min="0"
                    onChange={(event) => setDiscountInput(event.target.value)}
                    step={discountType === "fixed" ? "1" : "0.1"}
                    type="number"
                    value={discountInput}
                  />
                  <div className={styles.typeToggle} role="group" aria-label="Discount type">
                    <button
                      aria-pressed={discountType === "percent"}
                      className={discountType === "percent" ? styles.activeType : ""}
                      onClick={() => {
                        setDiscountType("percent");
                        setDiscountInput("5");
                      }}
                      type="button"
                    >%</button>
                    <button
                      aria-pressed={discountType === "fixed"}
                      className={discountType === "fixed" ? styles.activeType : ""}
                      onClick={() => {
                        setDiscountType("fixed");
                        setDiscountInput("5000");
                      }}
                      type="button"
                    >৳</button>
                  </div>
                  <output aria-label="Applied discount">{formatMoney(totals.discount)}</output>
                </div>
              </div>

              <label className={styles.vatBlock}>
                <span className={styles.controlLabel}>Tax (VAT) {vatRate}%</span>
                <span className={styles.vatControl}>
                  <select onChange={(event) => setVatRate(event.target.value)} value={vatRate}>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                  </select>
                  <output aria-label="VAT amount">{formatMoney(totals.vat)}</output>
                </span>
              </label>
            </div>

            <div className={styles.grandTotal}>
              <span>Grand Total</span>
              <strong><small>৳</small> {formatMoney(totals.grandTotal)}</strong>
            </div>

            <div className={styles.checkoutActions}>
              <button className={styles.draftButton} onClick={saveDraft} type="button">
                <Save aria-hidden="true" />Draft (F8)
              </button>
              <button className={styles.paymentButton} onClick={takePayment} type="button">
                <CreditCard aria-hidden="true" />Payment (F9)
              </button>
              <button className={styles.printButton} onClick={preparePrint} type="button">
                <Printer aria-hidden="true" />Print (F10)
              </button>
            </div>
          </section>
        </div>

        <aside aria-label="Cart and payment summary" className={styles.summaryColumn}>
          <section className={styles.cartCard}>
            <header><h2>Cart ({items.length} item{items.length === 1 ? "" : "s"})</h2></header>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <article className={styles.cartItem} key={item.id}>
                  <ProductArtwork kind={item.kind} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.purity} | {formatWeight(item.weight)} gm</p>
                    <strong>৳ {formatMoney(item.amount)}</strong>
                  </div>
                  <button aria-label={`Remove ${item.name} from cart`} onClick={() => removeItem(item.id)} type="button">×</button>
                </article>
              ))}
              {items.length === 0 ? <p className={styles.cartEmpty}>No items in cart</p> : null}
            </div>
          </section>

          <section className={styles.summaryCard}>
            <h2>Summary</h2>
            <dl className={styles.summaryList}>
              <div><dt>Subtotal</dt><dd>৳ {formatMoney(totals.subtotal)}</dd></div>
              <div><dt>Making Charge</dt><dd>৳ {formatMoney(totals.makingCharge)}</dd></div>
              <div><dt>Discount</dt><dd>৳ {formatMoney(totals.discount)}</dd></div>
              <div><dt>VAT ({vatRate}%)</dt><dd>৳ {formatMoney(totals.vat)}</dd></div>
              <div className={styles.summaryGrand}><dt>Grand Total</dt><dd>৳ {formatMoney(totals.grandTotal)}</dd></div>
              <div className={styles.paidRow}>
                <dt><label htmlFor="reference-52-paid">Paid Amount</label></dt>
                <dd><span>৳</span><input id="reference-52-paid" min="0" onChange={(event) => setPaidInput(event.target.value)} type="number" value={paidInput} /></dd>
              </div>
              <div className={styles.dueRow}><dt>Due Amount</dt><dd>৳ {formatMoney(totals.due)}</dd></div>
            </dl>
          </section>
        </aside>
      </div>

      <p aria-live="polite" className={`${styles.feedback} ${feedback ? styles.feedbackVisible : ""}`}>
        {feedback ? <CheckCircle2 aria-hidden="true" /> : null}
        {feedback}
      </p>
    </section>
  );
}
