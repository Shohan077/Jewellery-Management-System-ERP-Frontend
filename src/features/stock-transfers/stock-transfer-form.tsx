"use client";

import {
  ArrowLeftRight,
  CheckCircle2,
  PackagePlus,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  initialStockTransferQuantities,
  recentStockTransfers,
  stockProductCatalog,
  stockTransferBranches,
  type RecentTransfer,
  type StockProduct,
} from "./stock-transfer-data";
import styles from "./stock-transfer-form.module.css";

type TransferLine = StockProduct & {
  quantity: string;
};

type Feedback = {
  tone: "error" | "success";
  text: string;
};

const INITIAL_FROM_BRANCH = "main";
const INITIAL_TO_BRANCH = "uttara";
const INITIAL_DATE = "2025-04-30";
const INITIAL_REMARKS = "Transfer for showroom display";

function createInitialLines(): TransferLine[] {
  return stockProductCatalog
    .filter((product) => product.id in initialStockTransferQuantities)
    .map((product) => ({
      ...product,
      quantity: String(initialStockTransferQuantities[product.id]),
    }));
}

function formatTransferDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function branchLabel(branchId: string) {
  return stockTransferBranches.find((branch) => branch.id === branchId)?.name ?? branchId;
}

export function StockTransferForm() {
  const [fromBranch, setFromBranch] = useState(INITIAL_FROM_BRANCH);
  const [toBranch, setToBranch] = useState(INITIAL_TO_BRANCH);
  const [transferDate, setTransferDate] = useState(INITIAL_DATE);
  const [productQuery, setProductQuery] = useState("");
  const [lines, setLines] = useState<TransferLine[]>(createInitialLines);
  const [remarks, setRemarks] = useState(INITIAL_REMARKS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [transfers, setTransfers] = useState<RecentTransfer[]>(() => [...recentStockTransfers]);
  const [showAllTransfers, setShowAllTransfers] = useState(false);

  const selectedProductIds = useMemo(() => new Set(lines.map((line) => line.id)), [lines]);
  const availableProducts = useMemo(
    () => stockProductCatalog.filter((product) => !selectedProductIds.has(product.id)),
    [selectedProductIds],
  );
  const visibleTransfers = showAllTransfers ? transfers : transfers.slice(0, 4);

  function clearError(key: string) {
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function swapBranches() {
    setFromBranch(toBranch);
    setToBranch(fromBranch);
    clearError("branches");
    setFeedback(null);
  }

  function updateQuantity(productId: string, quantity: string) {
    setLines((current) => current.map((line) => line.id === productId ? { ...line, quantity } : line));
    clearError(productId);
    setFeedback(null);
  }

  function removeProduct(productId: string) {
    const removedProduct = lines.find((line) => line.id === productId);
    setLines((current) => current.filter((line) => line.id !== productId));
    clearError(productId);
    setFeedback(removedProduct ? { tone: "success", text: `${removedProduct.name} removed from this transfer.` } : null);
  }

  function addProduct() {
    const normalizedQuery = productQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      setFeedback({ tone: "error", text: "Enter a product name or code before adding it." });
      return;
    }

    const matchingProduct = stockProductCatalog.find((product) => {
      const searchable = `${product.name} ${product.code} ${product.name} (${product.code})`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });

    if (!matchingProduct) {
      setFeedback({ tone: "error", text: `No product matches “${productQuery.trim()}”.` });
      return;
    }

    if (selectedProductIds.has(matchingProduct.id)) {
      setFeedback({ tone: "error", text: `${matchingProduct.name} is already in this transfer.` });
      return;
    }

    setLines((current) => [...current, { ...matchingProduct, quantity: "1" }]);
    setProductQuery("");
    clearError("items");
    setFeedback({ tone: "success", text: `${matchingProduct.name} added to this transfer.` });
  }

  function handleProductSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addProduct();
  }

  function resetTransfer() {
    setFromBranch(INITIAL_FROM_BRANCH);
    setToBranch(INITIAL_TO_BRANCH);
    setTransferDate(INITIAL_DATE);
    setProductQuery("");
    setLines(createInitialLines());
    setRemarks(INITIAL_REMARKS);
    setErrors({});
    setFeedback({ tone: "success", text: "Transfer form reset to its original values." });
  }

  function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!fromBranch || !toBranch) nextErrors.branches = "Choose both branches.";
    else if (fromBranch === toBranch) nextErrors.branches = "Source and destination branches must be different.";
    if (!transferDate) nextErrors.date = "Choose a transfer date.";
    if (lines.length === 0) nextErrors.items = "Add at least one product to the transfer.";

    lines.forEach((line) => {
      const quantity = Number(line.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        nextErrors[line.id] = "Enter a whole number of at least 1.";
      } else if (quantity > line.availableStock) {
        nextErrors[line.id] = `Only ${line.availableStock} ${line.unit} are available.`;
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ tone: "error", text: "Please correct the highlighted transfer details." });
      return;
    }

    const totalItems = lines.reduce((sum, line) => sum + Number(line.quantity), 0);
    const submittedTransfer: RecentTransfer = {
      id: `ST-${Date.now()}`,
      date: formatTransferDate(transferDate),
      fromBranch: branchLabel(fromBranch),
      toBranch: branchLabel(toBranch),
      totalItems,
      status: "Pending",
    };

    setTransfers((current) => [submittedTransfer, ...current]);
    setFeedback({ tone: "success", text: `Stock transfer submitted successfully with ${totalItems} items.` });
  }

  function printLabel() {
    setFeedback({ tone: "success", text: "The transfer label is ready to print." });
    window.print();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className={`button ${styles.printButton}`} onClick={printLabel} type="button">
            <Printer aria-hidden="true" size={15} />
            Print Label
          </button>
        )}
        description="Transfer stock between branches"
        title="Stock Transfer"
      />

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.text ?? ""}
      </p>

      <form className={styles.form} noValidate onSubmit={submitTransfer}>
        <Card className={styles.transferCard}>
          <div className={styles.branchFields}>
            <label className={styles.control}>
              <span>From Branch <b>*</b></span>
              <select
                aria-describedby={errors.branches ? "branch-transfer-error" : undefined}
                aria-invalid={Boolean(errors.branches)}
                className="select"
                onChange={(event) => {
                  setFromBranch(event.target.value);
                  clearError("branches");
                  setFeedback(null);
                }}
                value={fromBranch}
              >
                {stockTransferBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}{branch.location ? ` (${branch.location})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <button aria-label="Swap source and destination branches" className={styles.swapButton} onClick={swapBranches} title="Swap branches" type="button">
              <ArrowLeftRight aria-hidden="true" size={17} />
            </button>

            <label className={styles.control}>
              <span>To Branch <b>*</b></span>
              <select
                aria-describedby={errors.branches ? "branch-transfer-error" : undefined}
                aria-invalid={Boolean(errors.branches)}
                className="select"
                onChange={(event) => {
                  setToBranch(event.target.value);
                  clearError("branches");
                  setFeedback(null);
                }}
                value={toBranch}
              >
                {stockTransferBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}{branch.location ? ` (${branch.location})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.control}>
              <span>Transfer Date <b>*</b></span>
              <input
                aria-describedby={errors.date ? "transfer-date-error" : undefined}
                aria-invalid={Boolean(errors.date)}
                className="field"
                onChange={(event) => {
                  setTransferDate(event.target.value);
                  clearError("date");
                  setFeedback(null);
                }}
                type="date"
                value={transferDate}
              />
            </label>
          </div>
          {errors.branches ? <p className={styles.fieldError} id="branch-transfer-error">{errors.branches}</p> : null}
          {errors.date ? <p className={styles.fieldError} id="transfer-date-error">{errors.date}</p> : null}

          <section aria-labelledby="add-products-title" className={styles.productsSection}>
            <h2 id="add-products-title">Add Products</h2>
            <div className={styles.productToolbar}>
              <label className={styles.searchField}>
                <span className="sr-only">Search product by name, code or barcode</span>
                <Search aria-hidden="true" size={16} />
                <input
                  list="stock-transfer-products"
                  onChange={(event) => {
                    setProductQuery(event.target.value);
                    setFeedback(null);
                  }}
                  onKeyDown={handleProductSearchKeyDown}
                  placeholder="Search product by name, code or scan barcode..."
                  type="search"
                  value={productQuery}
                />
              </label>
              <datalist id="stock-transfer-products">
                {availableProducts.map((product) => <option key={product.id} value={`${product.name} (${product.code})`} />)}
              </datalist>
              <button className={`button button--primary ${styles.addButton}`} onClick={addProduct} type="button">
                <Plus aria-hidden="true" size={16} />
                Add Product
              </button>
            </div>
            {errors.items ? <p className={styles.fieldError}>{errors.items}</p> : null}

            <div className={styles.tableScroller}>
              <table className={styles.productTable}>
                <caption className="sr-only">Products included in this stock transfer</caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Code</th>
                    <th scope="col">Available Stock</th>
                    <th scope="col">Transfer Qty</th>
                    <th scope="col">Unit</th>
                    <th scope="col"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={line.id}>
                      <td>{index + 1}</td>
                      <td><strong>{line.name}</strong></td>
                      <td>{line.code}</td>
                      <td>{line.availableStock}</td>
                      <td>
                        <input
                          aria-describedby={errors[line.id] ? `${line.id}-quantity-error` : undefined}
                          aria-invalid={Boolean(errors[line.id])}
                          aria-label={`Transfer quantity for ${line.name}`}
                          className={styles.quantityInput}
                          inputMode="numeric"
                          max={line.availableStock}
                          min="1"
                          onChange={(event) => updateQuantity(line.id, event.target.value)}
                          step="1"
                          type="number"
                          value={line.quantity}
                        />
                        {errors[line.id] ? <span className={styles.quantityError} id={`${line.id}-quantity-error`}>{errors[line.id]}</span> : null}
                      </td>
                      <td>{line.unit}</td>
                      <td>
                        <button aria-label={`Remove ${line.name}`} className={styles.removeButton} onClick={() => removeProduct(line.id)} title={`Remove ${line.name}`} type="button">
                          <Trash2 aria-hidden="true" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lines.length === 0 ? (
                    <tr>
                      <td className={styles.emptyState} colSpan={7}>
                        <PackagePlus aria-hidden="true" size={20} />
                        Search for a product and add it to this transfer.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <div className={styles.transferFooter}>
            <label className={`${styles.control} ${styles.remarks}`}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} value={remarks} />
            </label>
            <div className={styles.actions}>
              <button className="button" onClick={resetTransfer} type="button">
                <RotateCcw aria-hidden="true" size={15} />
                Reset
              </button>
              <button className={`button button--primary ${styles.submitButton}`} type="submit">
                <Send aria-hidden="true" size={15} />
                Submit Transfer
              </button>
            </div>
          </div>
        </Card>
      </form>

      <Card className={styles.recentCard}>
        <div className={styles.sectionHeader}>
          <h2>Recent Transfers</h2>
          <button className={styles.viewAllButton} onClick={() => setShowAllTransfers((current) => !current)} type="button">
            {showAllTransfers ? "Show Recent" : "View All"}
          </button>
        </div>
        <div className={styles.tableScroller}>
          <table className={styles.recentTable}>
            <caption className="sr-only">Recent branch stock transfers</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">From Branch</th>
                <th scope="col">To Branch</th>
                <th scope="col">Total Items</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransfers.map((transfer, index) => (
                <tr key={transfer.id}>
                  <td>{index + 1}</td>
                  <td>{transfer.date}</td>
                  <td>{transfer.fromBranch}</td>
                  <td>{transfer.toBranch}</td>
                  <td>{transfer.totalItems}</td>
                  <td>
                    <span className={`${styles.status} ${transfer.status === "Completed" ? styles.completed : styles.pending}`}>
                      {transfer.status === "Completed" ? <CheckCircle2 aria-hidden="true" size={12} /> : null}
                      {transfer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
