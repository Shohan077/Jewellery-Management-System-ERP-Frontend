"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Coins,
  Download,
  Eye,
  Gem,
  Layers3,
  PackageOpen,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { Card } from "@/components/ui/card";

import {
  finishedItemCategories,
  finishedItemMaterials,
  finishedItemStatuses,
  finishedItemsSummary,
  formatBdt,
  formatFinishedItemDate,
  initialFinishedItems,
  type FinishedItem,
  type FinishedItemCategory,
  type FinishedItemMaterial,
  type FinishedItemStatus,
} from "./finished-items-data";
import styles from "./finished-items-list.module.css";

type Filters = {
  from: string;
  to: string;
  category: "All" | FinishedItemCategory;
  status: "All" | FinishedItemStatus;
};

type Feedback = { tone: "error" | "success"; message: string } | null;

const defaultFilters: Filters = {
  from: "2025-04-01",
  to: "2025-04-30",
  category: "All",
  status: "All",
};

function DialogShell({
  children,
  description,
  onClose,
  title,
}: {
  children: ReactNode;
  description: string;
  onClose: () => void;
  title: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      ref={dialogRef}
    >
      <Card
        aria-describedby="finished-item-dialog-description"
        aria-labelledby="finished-item-dialog-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <header className={styles.modalHeader}>
          <div>
            <h2 id="finished-item-dialog-title">{title}</h2>
            <p id="finished-item-dialog-description">{description}</p>
          </div>
          <button aria-label={`Close ${title}`} onClick={onClose} ref={closeButtonRef} type="button">
            <X aria-hidden="true" size={18} />
          </button>
        </header>
        {children}
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: FinishedItemStatus }) {
  const statusStyle = status === "Ready"
    ? styles.ready
    : status === "Stocked"
      ? styles.stocked
      : styles.pending;

  return <span className={`${styles.status} ${statusStyle}`}>{status}</span>;
}

function ViewDialog({ item, onClose }: { item: FinishedItem; onClose: () => void }) {
  return (
    <DialogShell
      description="Review the completed production item and its stock-ready details."
      onClose={onClose}
      title={item.itemCode}
    >
      <div className={styles.detailBody}>
        <div className={styles.detailHero}>
          <div>
            <span>Finished item</span>
            <strong>{item.itemName}</strong>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <dl className={styles.detailGrid}>
          <div><dt>Category</dt><dd>{item.category}</dd></div>
          <div><dt>Primary material</dt><dd>{item.material}</dd></div>
          <div><dt>Completion date</dt><dd>{formatFinishedItemDate(item.completionDate)}</dd></div>
          <div><dt>Weight</dt><dd>{item.weight.toFixed(3)} gm</dd></div>
          <div><dt>Quantity</dt><dd>{item.quantity}</dd></div>
          <div><dt>Production value</dt><dd>৳ {formatBdt(item.productionValue)}</dd></div>
          <div><dt>Inventory state</dt><dd>Ready for stock entry</dd></div>
        </dl>
        <button className={`button button--primary ${styles.primaryAction}`} onClick={onClose} type="button">Done</button>
      </div>
    </DialogShell>
  );
}

function AddFinishedItemDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (item: Omit<FinishedItem, "id" | "itemCode">) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      itemName: String(form.get("itemName")),
      category: String(form.get("category")) as FinishedItemCategory,
      material: String(form.get("material")) as FinishedItemMaterial,
      weight: Math.max(0, Number(form.get("weight"))),
      quantity: Math.max(1, Number(form.get("quantity"))),
      status: String(form.get("status")) as FinishedItemStatus,
      completionDate: String(form.get("completionDate")),
      productionValue: Math.max(0, Number(form.get("productionValue"))),
    });
  }

  return (
    <DialogShell
      description="Record a completed item and make it available in the finished-items list."
      onClose={onClose}
      title="Add Finished Item"
    >
      <form className={styles.itemForm} onSubmit={submit}>
        <label>
          <span>Item name <em>*</em></span>
          <input autoFocus className="field" name="itemName" placeholder="Enter finished item name" required />
        </label>
        <label>
          <span>Category <em>*</em></span>
          <select className="select" defaultValue="Necklace" name="category" required>
            {finishedItemCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>Primary material <em>*</em></span>
          <select className="select" defaultValue="Gold" name="material" required>
            {finishedItemMaterials.map((material) => <option key={material}>{material}</option>)}
          </select>
        </label>
        <label>
          <span>Weight (gm) <em>*</em></span>
          <input className="field" min="0.001" name="weight" required step="0.001" type="number" />
        </label>
        <label>
          <span>Quantity <em>*</em></span>
          <input className="field" min="1" name="quantity" required type="number" />
        </label>
        <label>
          <span>Completion date <em>*</em></span>
          <input className="field" defaultValue="2025-04-30" name="completionDate" required type="date" />
        </label>
        <label>
          <span>Status <em>*</em></span>
          <select className="select" defaultValue="Ready" name="status" required>
            {finishedItemStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className={styles.valueField}>
          <span>Production value (৳) <em>*</em></span>
          <input className="field" min="0" name="productionValue" required type="number" />
        </label>
        <footer className={styles.modalActions}>
          <button className={`button ${styles.secondaryAction}`} onClick={onClose} type="button">Cancel</button>
          <button className={`button button--primary ${styles.primaryAction}`} type="submit">
            <CheckCircle2 aria-hidden="true" size={16} />Save Finished Item
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}

export function FinishedItemsList() {
  const [records, setRecords] = useState(initialFinishedItems);
  const [draftFilters, setDraftFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedItem, setSelectedItem] = useState<FinishedItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredItems = useMemo(() => records.filter((item) => (
    item.completionDate >= appliedFilters.from
    && item.completionDate <= appliedFilters.to
    && (appliedFilters.category === "All" || item.category === appliedFilters.category)
    && (appliedFilters.status === "All" || item.status === appliedFilters.status)
  )), [appliedFilters, records]);

  const addedItems = Math.max(0, records.length - initialFinishedItems.length);
  const addedGoldWeight = records
    .slice(0, addedItems)
    .filter((item) => item.material === "Gold")
    .reduce((total, item) => total + item.weight, 0);
  const addedDiamonds = records
    .slice(0, addedItems)
    .filter((item) => item.material === "Diamond")
    .reduce((total, item) => total + item.quantity, 0);
  const addedValue = records.slice(0, addedItems).reduce((total, item) => total + item.productionValue, 0);

  const metrics = {
    totalFinishedItems: finishedItemsSummary.totalFinishedItems + addedItems,
    totalGoldWeight: finishedItemsSummary.totalGoldWeight + addedGoldWeight,
    totalDiamonds: finishedItemsSummary.totalDiamonds + addedDiamonds,
    totalProductionValue: finishedItemsSummary.totalProductionValue + addedValue,
  };

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function applyFilters() {
    if (!draftFilters.from || !draftFilters.to) {
      setFeedback({ tone: "error", message: "Choose both dates before searching." });
      return;
    }
    if (draftFilters.from > draftFilters.to) {
      setFeedback({ tone: "error", message: "Date From must be before Date To." });
      return;
    }
    setAppliedFilters(draftFilters);
    setFeedback({ tone: "success", message: `${records.filter((item) => (
      item.completionDate >= draftFilters.from
      && item.completionDate <= draftFilters.to
      && (draftFilters.category === "All" || item.category === draftFilters.category)
      && (draftFilters.status === "All" || item.status === draftFilters.status)
    )).length} finished items match the selected filters.` });
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setFeedback({ tone: "success", message: "Filters reset to April 2025." });
  }

  function addFinishedItem(item: Omit<FinishedItem, "id" | "itemCode">) {
    const year = item.completionDate.slice(0, 4) || "2025";
    const codePrefix = `FI-${year}-`;
    const largestNumber = records.reduce((largest, record) => {
      if (!record.itemCode.startsWith(codePrefix)) return largest;
      const value = Number(record.itemCode.slice(codePrefix.length));
      return Number.isFinite(value) ? Math.max(largest, value) : largest;
    }, 0);
    const sequence = largestNumber + 1;
    const nextItem: FinishedItem = {
      ...item,
      id: `finished-item-${sequence}`,
      itemCode: `${codePrefix}${String(sequence).padStart(3, "0")}`,
    };
    setRecords((current) => [nextItem, ...current]);
    setShowAddDialog(false);
    setFeedback({ tone: "success", message: `${nextItem.itemCode} was added successfully.` });
  }

  function exportItems() {
    const headers = ["Item Code", "Item Name", "Category", "Weight (gm)", "Quantity", "Status", "Completion Date", "Production Value (BDT)"];
    const rows = filteredItems.map((item) => [
      item.itemCode,
      item.itemName,
      item.category,
      item.weight.toFixed(3),
      item.quantity,
      item.status,
      item.completionDate,
      item.productionValue,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => {
        const value = String(cell);
        const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
        return `"${safeValue.replaceAll('"', '""')}"`;
      }).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `finished-items-${appliedFilters.from}-to-${appliedFilters.to}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setFeedback({ tone: "success", message: `${filteredItems.length} finished items exported.` });
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Finished Items</h1>
          <nav aria-label="Breadcrumb">
            <Link href="/dashboard">Home</Link><span aria-hidden="true">›</span>
            <span>Production Management</span><span aria-hidden="true">›</span>
            <span aria-current="page">Finished Items</span>
          </nav>
        </div>
        <div className={styles.headerActions}>
          <button className={`button button--primary ${styles.primaryAction}`} onClick={() => setShowAddDialog(true)} type="button">
            <Plus aria-hidden="true" size={16} />Add Finished
          </button>
          <button className={`button ${styles.secondaryAction}`} onClick={exportItems} type="button">
            <Download aria-hidden="true" size={15} />Export
          </button>
        </div>
      </header>

      <Card aria-label="Finished item filters" className={styles.filterCard}>
        <label>
          <span>Date From</span>
          <input className="field" onChange={(event) => updateFilter("from", event.target.value)} type="date" value={draftFilters.from} />
        </label>
        <label>
          <span>Date To</span>
          <input className="field" onChange={(event) => updateFilter("to", event.target.value)} type="date" value={draftFilters.to} />
        </label>
        <label>
          <span>Category</span>
          <select className="select" onChange={(event) => updateFilter("category", event.target.value as Filters["category"])} value={draftFilters.category}>
            <option value="All">All</option>
            {finishedItemCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select className="select" onChange={(event) => updateFilter("status", event.target.value as Filters["status"])} value={draftFilters.status}>
            <option value="All">All</option>
            {finishedItemStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <div className={styles.filterActions}>
          <button className={`button button--primary ${styles.primaryAction}`} onClick={applyFilters} type="button">
            <Search aria-hidden="true" size={15} />Search
          </button>
          <button className={`button ${styles.secondaryAction}`} onClick={resetFilters} type="button">
            <RotateCcw aria-hidden="true" size={15} />Reset
          </button>
        </div>
      </Card>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.message ?? ""}
      </p>

      <section aria-label="Finished item summary" className={styles.metrics}>
        <Card as="article" className={styles.metric}>
          <span className={`${styles.metricIcon} ${styles.blue}`}><PackageOpen aria-hidden="true" size={26} /></span>
          <div><strong>{metrics.totalFinishedItems}</strong><small>Total Finished Items</small></div>
        </Card>
        <Card as="article" className={styles.metric}>
          <span className={`${styles.metricIcon} ${styles.gold}`}><Layers3 aria-hidden="true" size={26} /></span>
          <div><strong>{metrics.totalGoldWeight.toFixed(3)} gm</strong><small>Total Gold Weight</small></div>
        </Card>
        <Card as="article" className={styles.metric}>
          <span className={`${styles.metricIcon} ${styles.cyan}`}><Gem aria-hidden="true" size={26} /></span>
          <div><strong>{metrics.totalDiamonds} pcs</strong><small>Total Diamond</small></div>
        </Card>
        <Card as="article" className={styles.metric}>
          <span className={`${styles.metricIcon} ${styles.orange}`}><Coins aria-hidden="true" size={26} /></span>
          <div><strong>৳ {formatBdt(metrics.totalProductionValue)}</strong><small>Total Production Value</small></div>
        </Card>
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Finished items matching the selected filters</caption>
            <thead>
              <tr>
                <th scope="col">SL</th>
                <th scope="col">Item Code</th>
                <th scope="col">Item Name</th>
                <th scope="col">Category</th>
                <th scope="col">Weight</th>
                <th scope="col">Quantity</th>
                <th scope="col">Status</th>
                <th scope="col">Completion Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><strong>{item.itemCode}</strong></td>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.weight.toFixed(3)} gm</td>
                  <td>{item.quantity}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{formatFinishedItemDate(item.completionDate)}</td>
                  <td>
                    <button className={styles.viewButton} onClick={() => setSelectedItem(item)} type="button">
                      <Eye aria-hidden="true" size={14} />View
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredItems.length ? (
                <tr>
                  <td className={styles.emptyState} colSpan={9}>
                    <strong>No finished items found</strong>
                    <span>Adjust the date, category, or status filters and search again.</span>
                    <button className="button" onClick={resetFilters} type="button">Reset filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}>
          Showing {filteredItems.length ? 1 : 0} to {filteredItems.length} of {filteredItems.length} finished items
        </footer>
      </Card>

      {selectedItem ? <ViewDialog item={selectedItem} onClose={() => setSelectedItem(null)} /> : null}
      {showAddDialog ? <AddFinishedItemDialog onClose={() => setShowAddDialog(false)} onSave={addFinishedItem} /> : null}
    </div>
  );
}
