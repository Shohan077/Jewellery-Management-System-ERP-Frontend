"use client";

import {
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Hourglass,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Scale,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  FINISHED_PRODUCTS_STORAGE_EVENT,
  FINISHED_PRODUCTS_STORAGE_KEY,
  finishedProductKarigars,
  finishedProductOptions,
  formatFinishedProductDate,
  initialFinishedProducts,
  isFinishedProductRecord,
  type FinishedProductRecord,
  type FinishedProductStatus,
  type InventorySyncStatus,
} from "./finished-product-data";
import styles from "./finished-products.module.css";

const PAGE_SIZE = 8;
const EMPTY_SNAPSHOT = "[]";

type AppliedFilters = {
  from: string;
  to: string;
  product: string;
  karigar: string;
} | null;

type Feedback = { tone: "error" | "success"; message: string } | null;

function subscribeToFinishedProducts(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(FINISHED_PRODUCTS_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(FINISHED_PRODUCTS_STORAGE_EVENT, handleChange);
  };
}

function getFinishedProductsSnapshot() {
  return window.localStorage.getItem(FINISHED_PRODUCTS_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function parseSavedProducts(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isFinishedProductRecord) : [];
  } catch {
    return [];
  }
}

function mergeProducts(saved: FinishedProductRecord[]) {
  const savedNumbers = new Set(saved.map((record) => record.completionNo));
  return [...saved, ...initialFinishedProducts.filter((record) => !savedNumbers.has(record.completionNo))]
    .sort((first, second) => second.completionDate.localeCompare(first.completionDate)
      || first.completionNo.localeCompare(second.completionNo, undefined, { numeric: true }));
}

function visiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  let start = Math.max(1, currentPage - 2);
  start = Math.min(start, pageCount - 4);
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function StatusBadge({ status }: { status: FinishedProductStatus }) {
  return <span className={`${styles.statusBadge} ${status === "Completed" ? styles.completed : styles.qcPending}`}>{status}</span>;
}

function SyncBadge({ status }: { status: InventorySyncStatus }) {
  return <span className={`${styles.syncBadge} ${status === "Synced" ? styles.synced : styles.syncPending}`}>{status}</span>;
}

function ProductMark({ kind }: { kind: FinishedProductRecord["productKind"] }) {
  return <span aria-hidden="true" className={`${styles.productMark} ${styles[kind]}`} />;
}

function DetailsDialog({ product, onClose }: { product: FinishedProductRecord; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }} ref={dialogRef}>
      <Card aria-describedby="finished-product-details-description" aria-labelledby="finished-product-details-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="finished-product-details-title">{product.completionNo}</h2>
            <p id="finished-product-details-description">Finished product completion details</p>
          </div>
          <button aria-label="Close finished product details" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.detailsHero}>
            <ProductMark kind={product.productKind} />
            <div><span>Product</span><strong>{product.product}</strong></div>
            <StatusBadge status={product.status} />
          </div>
          <dl className={styles.detailsGrid}>
            <div><dt>Completion Date</dt><dd>{formatFinishedProductDate(product.completionDate)}</dd></div>
            <div><dt>Manufacturing Order</dt><dd>{product.manufacturingOrder}</dd></div>
            <div><dt>Karigar</dt><dd>{product.karigar}</dd></div>
            <div><dt>Purity</dt><dd>{product.purity}</dd></div>
            <div><dt>Final Weight</dt><dd>{product.finalWeight.toFixed(3)} g</dd></div>
            <div><dt>Making Charge</dt><dd>BDT {product.makingCharge.toFixed(2)}</dd></div>
            <div><dt>Total Issued</dt><dd>{product.totalIssued.toFixed(3)} g</dd></div>
            <div><dt>Total Returned</dt><dd>{product.totalReturned.toFixed(3)} g</dd></div>
            <div><dt>Stone Weight</dt><dd>{product.stoneWeight.toFixed(3)} g</dd></div>
            <div><dt>Inventory Sync</dt><dd><SyncBadge status={product.inventorySync} /></dd></div>
          </dl>
          {product.remarks ? <p className={styles.detailsRemarks}><strong>Remarks</strong>{product.remarks}</p> : null}
          <button className="button button--primary" onClick={onClose} type="button">Done</button>
        </div>
      </Card>
    </div>
  );
}

export function FinishedProductList() {
  const snapshot = useSyncExternalStore(
    subscribeToFinishedProducts,
    getFinishedProductsSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const savedProducts = useMemo(() => parseSavedProducts(snapshot), [snapshot]);
  const records = useMemo(() => mergeProducts(savedProducts), [savedProducts]);

  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-04-12");
  const [productFilter, setProductFilter] = useState("All Products");
  const [karigarFilter, setKarigarFilter] = useState("All Karigar");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(null);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<FinishedProductRecord | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const metrics = useMemo(() => ({
    completedToday: records.filter((record) => record.completionDate === "2025-04-12").length,
    totalCompleted: records.length,
    totalWeight: records.reduce((total, record) => total + record.finalWeight, 0),
    pendingQc: records.filter((record) => record.status === "QC Pending").length,
  }), [records]);

  const filteredRecords = useMemo(() => {
    if (!appliedFilters) return records;
    return records.filter((record) => (
      record.completionDate >= appliedFilters.from
      && record.completionDate <= appliedFilters.to
      && (appliedFilters.product === "All Products" || record.product === appliedFilters.product)
      && (appliedFilters.karigar === "All Karigar" || record.karigar === appliedFilters.karigar)
    ));
  }, [appliedFilters, records]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE);

  function searchProducts() {
    if (!fromDate || !toDate) {
      setFeedback({ tone: "error", message: "Choose both a from date and a to date." });
      return;
    }
    if (fromDate > toDate) {
      setFeedback({ tone: "error", message: "The from date must be before the to date." });
      return;
    }
    setAppliedFilters({ from: fromDate, to: toDate, product: productFilter, karigar: karigarFilter });
    setPage(1);
    setFeedback({ tone: "success", message: "Finished product filters applied." });
  }

  function clearFilters() {
    setFromDate("2025-04-01");
    setToDate("2025-04-12");
    setProductFilter("All Products");
    setKarigarFilter("All Karigar");
    setAppliedFilters(null);
    setPage(1);
    setFeedback({ tone: "success", message: "Filters cleared. All finished products are shown." });
  }

  function persistProduct(nextRecord: FinishedProductRecord, message: string) {
    try {
      const saved = parseSavedProducts(window.localStorage.getItem(FINISHED_PRODUCTS_STORAGE_KEY) ?? EMPTY_SNAPSHOT);
      const next = [nextRecord, ...saved.filter((record) => record.completionNo !== nextRecord.completionNo)];
      window.localStorage.setItem(FINISHED_PRODUCTS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(FINISHED_PRODUCTS_STORAGE_EVENT));
      setSelectedProduct((current) => current?.completionNo === nextRecord.completionNo ? nextRecord : current);
      setFeedback({ tone: "success", message });
    } catch {
      setFeedback({ tone: "error", message: "The record could not be updated in browser storage." });
    }
  }

  function toggleStatus(record: FinishedProductRecord) {
    const status: FinishedProductStatus = record.status === "Completed" ? "QC Pending" : "Completed";
    const next = {
      ...record,
      status,
      inventorySync: status === "Completed" ? "Synced" as const : "Pending" as const,
    };
    persistProduct(next, `${record.completionNo} marked as ${status.toLowerCase()}.`);
  }

  function toggleSync(record: FinishedProductRecord) {
    if (record.status !== "Completed") {
      setFeedback({ tone: "error", message: `${record.completionNo} must pass QC before it can be synced.` });
      return;
    }
    const inventorySync: InventorySyncStatus = record.inventorySync === "Synced" ? "Pending" : "Synced";
    persistProduct({ ...record, inventorySync }, `${record.completionNo} inventory status changed to ${inventorySync.toLowerCase()}.`);
  }

  return (
    <div className={styles.listPage}>
      <PageHeader description="View all completed finished products" title="Finished Product List" />

      <section aria-label="Finished product summary" className={styles.kpiGrid}>
        <Card className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div><span>Completed Today</span><strong>{metrics.completedToday}</strong><small>Items</small></div><CalendarCheck2 aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div><span>Total Completed</span><strong>{metrics.totalCompleted}</strong><small>Items</small></div><BadgeCheck aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div><span>Total Weight</span><strong>{metrics.totalWeight.toFixed(3)}</strong><small>Gram</small></div><Scale aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiAmber}`}>
          <div><span>Pending QC</span><strong>{metrics.pendingQc}</strong><small>Items</small></div><Hourglass aria-hidden="true" />
        </Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filterBar}>
          <label className={styles.control}><span>From Date</span><input className="field" onChange={(event) => { setFromDate(event.target.value); setFeedback(null); }} type="date" value={fromDate} /></label>
          <label className={styles.control}><span>To Date</span><input className="field" onChange={(event) => { setToDate(event.target.value); setFeedback(null); }} type="date" value={toDate} /></label>
          <label className={styles.control}><span>Product</span><select className="select" onChange={(event) => { setProductFilter(event.target.value); setFeedback(null); }} value={productFilter}><option>All Products</option>{finishedProductOptions.map((option) => <option key={option.name}>{option.name}</option>)}</select></label>
          <label className={styles.control}><span>Karigar</span><select className="select" onChange={(event) => { setKarigarFilter(event.target.value); setFeedback(null); }} value={karigarFilter}><option>All Karigar</option>{finishedProductKarigars.map((option) => <option key={option}>{option}</option>)}</select></label>
          <button className="button button--primary" onClick={searchProducts} type="button"><Search aria-hidden="true" size={16} />Search</button>
        </div>

        <p
          aria-live="polite"
          className={feedback ? `${styles.feedback} ${styles[feedback.tone]} ${styles.listFeedback}` : "sr-only"}
          role={feedback?.tone === "error" ? "alert" : "status"}
        >
          {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
          {feedback?.message ?? ""}
          {appliedFilters ? <button onClick={clearFilters} type="button"><RotateCcw aria-hidden="true" size={14} />Clear filters</button> : null}
        </p>

        <div className={styles.tableScroller}>
          <table className={styles.productsTable}>
            <caption className="sr-only">Finished product records</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Completion No</th><th scope="col">Date</th><th scope="col">Product</th><th scope="col">Karigar</th><th scope="col">Final Weight<br />(Gram)</th><th scope="col">Purity</th><th scope="col">Status</th><th scope="col">Inventory<br />Sync</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td>
                  <td><strong>{record.completionNo}</strong></td>
                  <td>{formatFinishedProductDate(record.completionDate)}</td>
                  <td><span className={styles.productCell}><ProductMark kind={record.productKind} /><strong>{record.product}</strong></span></td>
                  <td>{record.karigar}</td>
                  <td>{record.finalWeight.toFixed(3)}</td>
                  <td>{record.purity}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td><SyncBadge status={record.inventorySync} /></td>
                  <td className={styles.actionCell}>
                    <details className={styles.actionMenu}>
                      <summary aria-label={`Actions for ${record.completionNo}`} title={`Actions for ${record.completionNo}`}><MoreHorizontal aria-hidden="true" size={17} /></summary>
                      <div role="menu">
                        <button onClick={(event) => { setSelectedProduct(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Eye aria-hidden="true" size={14} />View details</button>
                        <button onClick={(event) => { toggleStatus(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><ClipboardCheck aria-hidden="true" size={14} />{record.status === "Completed" ? "Send to QC" : "Mark completed"}</button>
                        <button disabled={record.status !== "Completed"} onClick={(event) => { toggleSync(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" title={record.status !== "Completed" ? "Complete quality control before syncing" : undefined} type="button"><RefreshCw aria-hidden="true" size={14} />{record.status !== "Completed" ? "Complete QC before sync" : `Mark ${record.inventorySync === "Synced" ? "pending" : "synced"}`}</button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 ? <tr><td className={styles.emptyState} colSpan={10}><strong>No finished products found</strong><span>Adjust the dates, product, or karigar and search again.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.listFooter}>
        <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} records</p>
        <nav aria-label="Finished product pagination" className={styles.pagination}>
          <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
          {visiblePages(currentPage, pageCount).map((number) => <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
          <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
        </nav>
      </footer>

      {selectedProduct ? <DetailsDialog onClose={() => setSelectedProduct(null)} product={selectedProduct} /> : null}
    </div>
  );
}
