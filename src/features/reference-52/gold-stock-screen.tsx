"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Funnel,
  Pencil,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import styles from "./gold-stock-screen.module.css";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type StockRow = {
  id: number;
  purity: "24K" | "22K" | "18K" | "14K";
  category: "Gold Bar" | "Gold Jewellery" | "Gold Coin";
  weight: number;
  rate: number;
  value: number;
  status: StockStatus;
};

type StockEditor =
  | { kind: "add" }
  | { kind: "edit"; row: StockRow }
  | { kind: "view"; row: StockRow }
  | null;

type AppliedFilters = {
  purity: string;
  category: string;
  status: string;
};

const initialStock: StockRow[] = [
  { id: 1, purity: "24K", category: "Gold Bar", weight: 250, rate: 9_150, value: 2_287_500, status: "In Stock" },
  { id: 2, purity: "22K", category: "Gold Bar", weight: 420.25, rate: 8_950, value: 3_761_738, status: "In Stock" },
  { id: 3, purity: "22K", category: "Gold Jewellery", weight: 365.78, rate: 8_950, value: 3_274_631, status: "In Stock" },
  { id: 4, purity: "18K", category: "Gold Jewellery", weight: 220.5, rate: 7_450, value: 1_642_225, status: "In Stock" },
  { id: 5, purity: "14K", category: "Gold Jewellery", weight: 95.15, rate: 5_950, value: 566_143, status: "In Stock" },
  { id: 6, purity: "24K", category: "Gold Coin", weight: 15, rate: 9_150, value: 137_250, status: "In Stock" },
  { id: 7, purity: "22K", category: "Gold Coin", weight: 30, rate: 8_950, value: 268_500, status: "In Stock" },
];

const initialVisibleWeight = initialStock.reduce((total, row) => total + row.weight, 0);
const initialVisibleValue = initialStock.reduce((total, row) => total + row.value, 0);
const undisplayedWeight = 1_435.68 - initialVisibleWeight;
const undisplayedValue = 128_540_000 - initialVisibleValue;

const integerFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const weightFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function formatMoney(value: number) {
  return `৳ ${integerFormatter.format(value)}`;
}

function escapeCsv(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span
      className={`${styles.statusBadge} ${
        status === "In Stock"
          ? styles.inStock
          : status === "Low Stock"
            ? styles.lowStock
            : styles.outOfStock
      }`}
    >
      {status}
    </span>
  );
}

function StockDialog({
  editor,
  onClose,
  onSave,
}: {
  editor: Exclude<StockEditor, null>;
  onClose: () => void;
  onSave: (row: StockRow) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const existing = editor.kind === "add" ? null : editor.row;
  const isView = editor.kind === "view";

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const weight = Number(form.get("weight"));
    const rate = Number(form.get("rate"));

    onSave({
      id: existing?.id ?? Date.now(),
      purity: form.get("purity") as StockRow["purity"],
      category: form.get("category") as StockRow["category"],
      weight,
      rate,
      value: Math.round(weight * rate),
      status: form.get("status") as StockStatus,
    });
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <div
        aria-describedby="stock-dialog-description"
        aria-labelledby="stock-dialog-title"
        aria-modal="true"
        className={styles.modal}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className={styles.modalHeader}>
          <div>
            <h2 id="stock-dialog-title">
              {isView ? "Stock Details" : editor.kind === "edit" ? "Edit Stock" : "Add Stock"}
            </h2>
            <p id="stock-dialog-description">
              {isView ? "Review the selected gold stock record." : "Enter the purity, category, weight, and current rate."}
            </p>
          </div>
          <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        {isView && existing ? (
          <>
            <dl className={styles.detailsGrid}>
              <div><dt>Purity</dt><dd>{existing.purity}</dd></div>
              <div><dt>Category</dt><dd>{existing.category}</dd></div>
              <div><dt>Weight</dt><dd>{weightFormatter.format(existing.weight)} gm</dd></div>
              <div><dt>Rate</dt><dd>{formatMoney(existing.rate)} / gm</dd></div>
              <div><dt>Stock Value</dt><dd>{formatMoney(existing.value)}</dd></div>
              <div><dt>Status</dt><dd><StatusBadge status={existing.status} /></dd></div>
            </dl>
            <footer className={styles.modalActions}>
              <button className={styles.secondaryButton} onClick={onClose} type="button">Close</button>
            </footer>
          </>
        ) : (
          <form className={styles.stockForm} onSubmit={submit}>
            <label>
              <span>Purity</span>
              <select defaultValue={existing?.purity ?? "22K"} name="purity">
                <option>24K</option>
                <option>22K</option>
                <option>18K</option>
                <option>14K</option>
              </select>
            </label>
            <label>
              <span>Category</span>
              <select defaultValue={existing?.category ?? "Gold Jewellery"} name="category">
                <option>Gold Bar</option>
                <option>Gold Jewellery</option>
                <option>Gold Coin</option>
              </select>
            </label>
            <label>
              <span>Weight (gm)</span>
              <input defaultValue={existing?.weight ?? ""} min="0.001" name="weight" required step="0.001" type="number" />
            </label>
            <label>
              <span>Rate (৳/gm)</span>
              <input defaultValue={existing?.rate ?? ""} min="1" name="rate" required step="1" type="number" />
            </label>
            <label className={styles.wideField}>
              <span>Status</span>
              <select defaultValue={existing?.status ?? "In Stock"} name="status">
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </label>
            <footer className={styles.modalActions}>
              <button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button>
              <button className={styles.primaryButton} type="submit">
                {editor.kind === "edit" ? "Save Changes" : "Add Stock"}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}

export function Reference52GoldStock() {
  const [stock, setStock] = useState<StockRow[]>(initialStock);
  const [purity, setPurity] = useState("All Purity");
  const [category, setCategory] = useState("All Category");
  const [status, setStatus] = useState("In Stock");
  const [filters, setFilters] = useState<AppliedFilters>({
    purity: "All Purity",
    category: "All Category",
    status: "In Stock",
  });
  const [editor, setEditor] = useState<StockEditor>(null);
  const [feedback, setFeedback] = useState("");

  const filteredStock = useMemo(() => stock.filter((row) => (
    (filters.purity === "All Purity" || row.purity === filters.purity)
    && (filters.category === "All Category" || row.category === filters.category)
    && (filters.status === "All Status" || row.status === filters.status)
  )), [filters, stock]);

  const totals = useMemo(() => ({
    weight: undisplayedWeight + stock.reduce((total, row) => total + row.weight, 0),
    value: undisplayedValue + stock.reduce((total, row) => total + row.value, 0),
  }), [stock]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters({ purity, category, status });
    setFeedback("Stock filters applied.");
  }

  function resetFilters() {
    setPurity("All Purity");
    setCategory("All Category");
    setStatus("All Status");
    setFilters({ purity: "All Purity", category: "All Category", status: "All Status" });
    setFeedback("Stock filters reset.");
  }

  function exportStock() {
    const rows = [
      ["#", "Purity", "Category", "Weight (gm)", "Rate (BDT/gm)", "Value (BDT)", "Status"],
      ...filteredStock.map((row, index) => [
        index + 1,
        row.purity,
        row.category,
        row.weight.toFixed(3),
        row.rate,
        row.value,
        row.status,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gold-stock.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback(`${filteredStock.length} stock ${filteredStock.length === 1 ? "entry" : "entries"} exported.`);
  }

  function saveStock(row: StockRow) {
    const editing = editor?.kind === "edit";
    setStock((current) => editing
      ? current.map((item) => item.id === row.id ? row : item)
      : [...current, row]);
    setEditor(null);
    setFeedback(editing ? "Stock entry updated successfully." : "New stock added successfully.");
  }

  return (
    <section aria-labelledby="gold-stock-title" className={styles.page}>
      <h1 className={styles.srOnly} id="gold-stock-title">Gold Stock</h1>

      <form className={styles.filterCard} onSubmit={applyFilters}>
        <label>
          <span>Purity</span>
          <select onChange={(event) => setPurity(event.target.value)} value={purity}>
            <option>All Purity</option>
            <option>24K</option>
            <option>22K</option>
            <option>18K</option>
            <option>14K</option>
          </select>
        </label>
        <label>
          <span>Category</span>
          <select onChange={(event) => setCategory(event.target.value)} value={category}>
            <option>All Category</option>
            <option>Gold Bar</option>
            <option>Gold Jewellery</option>
            <option>Gold Coin</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select onChange={(event) => setStatus(event.target.value)} value={status}>
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </label>
        <div className={styles.filterActions}>
          <button className={styles.filterButton} type="submit">
            <Funnel aria-hidden="true" size={14} />
            Filter
          </button>
          <button className={styles.resetButton} onClick={resetFilters} type="button">
            <RotateCcw aria-hidden="true" size={13} />
            Reset
          </button>
        </div>
      </form>

      <section aria-label="Gold stock records" className={styles.stockCard}>
        <header className={styles.stockHeader}>
          <div className={styles.totals}>
            <p>Total Stock Value: <strong>{formatMoney(totals.value)}</strong></p>
            <span aria-hidden="true" className={styles.divider} />
            <p>Total Weight: <strong>{weightFormatter.format(totals.weight)} gm</strong></p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.exportButton} onClick={exportStock} type="button">
              <Download aria-hidden="true" size={14} />
              Export
            </button>
            <button className={styles.addButton} onClick={() => setEditor({ kind: "add" })} type="button">
              <Plus aria-hidden="true" size={15} />
              Add Stock
            </button>
          </div>
        </header>

        <div className={styles.tableScroller}>
          <table className={styles.stockTable}>
            <caption className={styles.srOnly}>Filtered gold stock inventory</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Purity</th>
                <th scope="col">Category</th>
                <th scope="col">Weight (gm)</th>
                <th scope="col">Rate (৳/gm)</th>
                <th scope="col">Value (৳)</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.length ? filteredStock.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.purity}</td>
                  <td>{row.category}</td>
                  <td>{weightFormatter.format(row.weight)}</td>
                  <td>{integerFormatter.format(row.rate)}</td>
                  <td>{formatMoney(row.value)}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`View ${row.purity} ${row.category}`} onClick={() => setEditor({ kind: "view", row })} title="View stock" type="button">
                        <Eye aria-hidden="true" size={14} />
                      </button>
                      <button aria-label={`Edit ${row.purity} ${row.category}`} onClick={() => setEditor({ kind: "edit", row })} title="Edit stock" type="button">
                        <Pencil aria-hidden="true" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>No stock entries match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>
            Showing {filteredStock.length ? 1 : 0} to {filteredStock.length} of {filteredStock.length} entries
          </p>
          <nav aria-label="Gold stock pagination" className={styles.pagination}>
            <button aria-label="First page" disabled type="button"><ChevronsLeft aria-hidden="true" size={14} /></button>
            <button aria-label="Previous page" disabled type="button"><ChevronLeft aria-hidden="true" size={14} /></button>
            <button aria-current="page" className={styles.currentPage} type="button">1</button>
            <button aria-label="Next page" disabled type="button"><ChevronRight aria-hidden="true" size={14} /></button>
            <button aria-label="Last page" disabled type="button"><ChevronsRight aria-hidden="true" size={14} /></button>
          </nav>
        </footer>
      </section>

      {editor ? <StockDialog editor={editor} onClose={() => setEditor(null)} onSave={saveStock} /> : null}
      <p aria-live="polite" className={feedback ? styles.toast : styles.srOnly}>{feedback}</p>
    </section>
  );
}
