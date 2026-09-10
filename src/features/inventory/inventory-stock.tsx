"use client";

import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  CircleDot,
  Eye,
  FilePenLine,
  Filter,
  Gem,
  Link2,
  Medal,
  PackagePlus,
  Plus,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatBdt,
  INITIAL_STOCK_VALUE,
  inventoryCategories,
  inventoryItems,
  statusForQuantity,
  type InventoryItem,
  type InventoryKind,
  type InventoryStatus,
} from "./inventory-data";
import styles from "./inventory-stock.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "In Stock", "Low Stock", "Out of Stock"] as const;
type StatusFilter = (typeof statusOptions)[number];
type AdjustmentOperation = "add" | "remove" | "set";
type StockDialogState = { kind: "adjust" | "add"; targetIds: number[] };

const itemIcons: Record<InventoryKind, LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  earring: Sparkles,
  bracelet: CircleDashed,
  chain: Link2,
  pendant: Medal,
  bangle: Circle,
  "nose-pin": Sparkles,
};

const statusClasses: Record<InventoryStatus, string> = {
  "In Stock": styles.inStock,
  "Low Stock": styles.lowStock,
  "Out of Stock": styles.outOfStock,
};

function paginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) {
    return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function ProductThumbnail({ item, large = false }: { item: InventoryItem; large?: boolean }) {
  const Icon = itemIcons[item.kind];
  const diamond = item.name.toLowerCase().includes("diamond");

  return (
    <span className={`${styles.thumbnail} ${large ? styles.largeThumbnail : ""} ${diamond ? styles.diamondThumbnail : ""}`}>
      <Icon aria-hidden="true" size={large ? 31 : 23} strokeWidth={1.35} />
    </span>
  );
}

function StockStatusBadge({ status }: { status: InventoryStatus }) {
  return <span className={`${styles.statusBadge} ${statusClasses[status]}`}>{status}</span>;
}

type DialogShellProps = {
  children: ReactNode;
  description: string;
  onClose: () => void;
  title: string;
};

function DialogShell({ children, description, onClose, title }: DialogShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={headingId}
      className={styles.dialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      ref={dialogRef}
    >
      <div className={styles.dialogSurface}>
        <header className={styles.dialogHeader}>
          <div>
            <h2 id={headingId}>{title}</h2>
            <p id={descriptionId}>{description}</p>
          </div>
          <button aria-label={`Close ${title}`} className={styles.closeButton} onClick={onClose} type="button">
            <X aria-hidden="true" size={19} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

type StockDialogProps = {
  items: InventoryItem[];
  kind: "adjust" | "add";
  onApply: (ids: number[], operation: AdjustmentOperation, quantity: number, note: string) => void;
  onClose: () => void;
  targetIds: number[];
};

function StockDialog({ items, kind, onApply, onClose, targetIds }: StockDialogProps) {
  const [productId, setProductId] = useState(String(targetIds[0] ?? items[0]?.id ?? ""));
  const [operation, setOperation] = useState<AdjustmentOperation>("add");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const multipleTargets = targetIds.length > 1;
  const selectedItems = targetIds.map((id) => items.find((item) => item.id === id)).filter(Boolean) as InventoryItem[];
  const title = kind === "add" ? "Add Stock" : "Stock Adjustment";

  function submitAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    const ids = targetIds.length > 0 ? targetIds : [Number(productId)];
    if (ids.some((id) => !Number.isInteger(id)) || !Number.isInteger(parsedQuantity) || parsedQuantity < (operation === "set" ? 0 : 1)) return;
    onApply(ids, kind === "add" ? "add" : operation, parsedQuantity, note.trim());
  }

  return (
    <DialogShell
      description={kind === "add" ? "Receive new pieces into the selected product stock." : "Add, remove, or set the on-hand stock level."}
      onClose={onClose}
      title={title}
    >
      <form className={styles.dialogForm} onSubmit={submitAdjustment}>
        {multipleTargets ? (
          <div className={styles.selectedSummary}>
            <span>Selected products</span>
            <strong>{selectedItems.length} products</strong>
            <small>{selectedItems.slice(0, 3).map((item) => item.name).join(", ")}{selectedItems.length > 3 ? ` and ${selectedItems.length - 3} more` : ""}</small>
          </div>
        ) : (
          <label className={styles.dialogField}>
            <span>Product <b aria-hidden="true">*</b></span>
            <select autoFocus onChange={(event) => setProductId(event.target.value)} required value={productId}>
              {items.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code}) · {item.stockQty} {item.unit}</option>)}
            </select>
          </label>
        )}

        {kind === "adjust" ? (
          <label className={styles.dialogField}>
            <span>Adjustment type <b aria-hidden="true">*</b></span>
            <select autoFocus={multipleTargets} onChange={(event) => setOperation(event.target.value as AdjustmentOperation)} value={operation}>
              <option value="add">Add to current stock</option>
              <option value="remove">Remove from current stock</option>
              <option value="set">Set exact stock level</option>
            </select>
          </label>
        ) : null}

        <label className={styles.dialogField}>
          <span>Quantity <b aria-hidden="true">*</b></span>
          <div className={styles.quantityField}>
            <input
              autoFocus={kind === "add" && multipleTargets}
              inputMode="numeric"
              min={operation === "set" && kind === "adjust" ? 0 : 1}
              onChange={(event) => setQuantity(event.target.value)}
              required
              step="1"
              type="number"
              value={quantity}
            />
            <span>pcs</span>
          </div>
        </label>

        <label className={styles.dialogField}>
          <span>{kind === "add" ? "Reference / notes" : "Reason / notes"}</span>
          <textarea onChange={(event) => setNote(event.target.value)} placeholder="Add an optional note..." rows={3} value={note} />
        </label>

        <footer className={styles.dialogFooter}>
          <button className="button" onClick={onClose} type="button">Cancel</button>
          <button className="button button--primary" type="submit">
            {kind === "add" ? <PackagePlus aria-hidden="true" size={16} /> : <FilePenLine aria-hidden="true" size={16} />}
            {kind === "add" ? "Add to Stock" : "Update Stock"}
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}

function ProductDetailsDialog({ item, onAdjust, onClose }: { item: InventoryItem; onAdjust: () => void; onClose: () => void }) {
  return (
    <DialogShell description={`Current inventory details for ${item.code}.`} onClose={onClose} title="Stock Details">
      <div className={styles.detailsBody}>
        <div className={styles.detailsHero}>
          <ProductThumbnail item={item} large />
          <div>
            <h3>{item.name}</h3>
            <button className={styles.codeButton} onClick={onAdjust} type="button">{item.code}</button>
          </div>
          <StockStatusBadge status={item.status} />
        </div>
        <dl className={styles.detailsGrid}>
          <div><dt>Category</dt><dd>{item.category}</dd></div>
          <div><dt>Stock quantity</dt><dd>{item.stockQty} {item.unit}</dd></div>
          <div><dt>Unit value</dt><dd>{formatBdt(item.unitValue)}</dd></div>
          <div><dt>Stock value</dt><dd>{formatBdt(item.unitValue * item.stockQty)}</dd></div>
        </dl>
      </div>
      <footer className={styles.detailsFooter}>
        <button autoFocus className="button" onClick={onClose} type="button">Close</button>
        <button className="button button--primary" onClick={onAdjust} type="button">
          <FilePenLine aria-hidden="true" size={16} /> Adjust Stock
        </button>
      </footer>
    </DialogShell>
  );
}

export function InventoryStock() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [stockValueAdjustment, setStockValueAdjustment] = useState(0);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [activityMessage, setActivityMessage] = useState("");
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [draftMinStock, setDraftMinStock] = useState("");
  const [draftMaxStock, setDraftMaxStock] = useState("");
  const [minStock, setMinStock] = useState<number | null>(null);
  const [maxStock, setMaxStock] = useState<number | null>(null);
  const [stockDialog, setStockDialog] = useState<StockDialogState | null>(null);
  const [viewedItemId, setViewedItemId] = useState<number | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const stockSummary = useMemo(() => items.reduce(
    (summary, item) => {
      if (item.status === "Low Stock") summary.low += 1;
      if (item.status === "Out of Stock") summary.out += 1;
      return summary;
    },
    { low: 0, out: 0 },
  ), [items]);

  const filteredItems = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = searchTerm.length === 0
        || item.name.toLowerCase().includes(searchTerm)
        || item.code.toLowerCase().includes(searchTerm)
        || item.category.toLowerCase().includes(searchTerm);
      const matchesCategory = category === "All Categories" || item.category === category;
      const matchesStatus = status === "All Status" || item.status === status;
      const matchesMinimum = minStock === null || item.stockQty >= minStock;
      const matchesMaximum = maxStock === null || item.stockQty <= maxStock;
      return matchesQuery && matchesCategory && matchesStatus && matchesMinimum && matchesMaximum;
    });
  }, [category, deferredQuery, items, maxStock, minStock, status]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const firstVisible = filteredItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredItems.length);
  const pageRows = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const allPageRowsSelected = pageRows.length > 0 && pageRows.every((item) => selected.has(item.id));
  const somePageRowsSelected = pageRows.some((item) => selected.has(item.id));
  const viewedItem = viewedItemId === null ? null : items.find((item) => item.id === viewedItemId) ?? null;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = somePageRowsSelected && !allPageRowsSelected;
  }, [allPageRowsSelected, somePageRowsSelected]);

  function resetListPosition() {
    setCurrentPage(1);
    setSelected(new Set());
  }

  function togglePageSelection() {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allPageRowsSelected) pageRows.forEach((item) => next.delete(item.id));
      else pageRows.forEach((item) => next.add(item.id));
      return next;
    });
  }

  function toggleItem(id: number) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openStockDialog(kind: "adjust" | "add", targetIds?: number[]) {
    setStockDialog({ kind, targetIds: targetIds ?? Array.from(selected) });
  }

  function applyStockChange(ids: number[], operation: AdjustmentOperation, quantity: number, note: string) {
    const idSet = new Set(ids);
    let valueDelta = 0;
    let changedCount = 0;

    setItems((previous) => previous.map((item) => {
      if (!idSet.has(item.id)) return item;
      const nextQuantity = operation === "add"
        ? item.stockQty + quantity
        : operation === "remove"
          ? Math.max(0, item.stockQty - quantity)
          : quantity;
      valueDelta += (nextQuantity - item.stockQty) * item.unitValue;
      changedCount += 1;
      return { ...item, stockQty: nextQuantity, status: statusForQuantity(nextQuantity) };
    }));

    setStockValueAdjustment((value) => value + valueDelta);
    setStockDialog(null);
    setSelected(new Set());
    const verb = operation === "add" ? "added to" : operation === "remove" ? "removed from" : "set for";
    setActivityMessage(`${quantity.toLocaleString("en-US")} pcs ${verb} ${changedCount.toLocaleString("en-US")} product${changedCount === 1 ? "" : "s"}.${note ? ` Note: ${note}` : ""}`);
  }

  function applyAdvancedFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMin = draftMinStock === "" ? null : Number(draftMinStock);
    const nextMax = draftMaxStock === "" ? null : Number(draftMaxStock);
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setActivityMessage("Minimum stock cannot be greater than maximum stock.");
      return;
    }
    setMinStock(nextMin);
    setMaxStock(nextMax);
    resetListPosition();
    setAdvancedFiltersOpen(false);
    setActivityMessage("Stock quantity filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setCategory("All Categories");
    setStatus("All Status");
    setDraftMinStock("");
    setDraftMaxStock("");
    setMinStock(null);
    setMaxStock(null);
    resetListPosition();
    setAdvancedFiltersOpen(false);
    setActivityMessage("All inventory filters cleared.");
  }

  const metrics = [
    { label: "Total Products", value: items.length.toLocaleString("en-US"), trend: "+ 12%", note: "vs last month", tone: "positive" },
    { label: "Total Stock Value", value: formatBdt(INITIAL_STOCK_VALUE + stockValueAdjustment), trend: "+ 8%", note: "vs last month", tone: "positive" },
    { label: "Low Stock Items", value: stockSummary.low.toLocaleString("en-US"), trend: "↓ 4.0%", note: "needs attention", tone: "negative" },
    { label: "Out of Stock", value: stockSummary.out.toLocaleString("en-US"), trend: "↓ 0%", note: "unavailable", tone: "negative" },
  ] as const;

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <button className="button" onClick={() => openStockDialog("adjust")} type="button">
              <FilePenLine aria-hidden="true" size={16} />
              Stock Adjustment
            </button>
            <button className="button button--primary" onClick={() => openStockDialog("add")} type="button">
              <Plus aria-hidden="true" size={17} />
              Add Stock
            </button>
          </div>
        )}
        description="View and manage your jewellery stock"
        title="Inventory Stock"
      />

      <section aria-label="Inventory summary" className={styles.metrics}>
        {metrics.map((metric) => (
          <Card as="article" className={styles.metricCard} key={metric.label}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p className={metric.tone === "positive" ? styles.positiveTrend : styles.negativeTrend}>
              <b>{metric.trend}</b> <span>{metric.note}</span>
            </p>
          </Card>
        ))}
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search inventory</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                resetListPosition();
              }}
              placeholder="Search by product name, code or barcode..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by category</span>
            <select
              onChange={(event) => {
                setCategory(event.target.value);
                resetListPosition();
              }}
              value={category}
            >
              <option>All Categories</option>
              {inventoryCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by stock status</span>
            <select
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter);
                resetListPosition();
              }}
              value={status}
            >
              {statusOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            aria-controls="inventory-advanced-filters"
            aria-expanded={advancedFiltersOpen}
            className={`button ${styles.filterButton} ${minStock !== null || maxStock !== null ? styles.filterButtonActive : ""}`}
            onClick={() => setAdvancedFiltersOpen((open) => !open)}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        {advancedFiltersOpen ? (
          <form className={styles.advancedFilters} id="inventory-advanced-filters" onSubmit={applyAdvancedFilters}>
            <div className={styles.advancedTitle}>
              <Boxes aria-hidden="true" size={17} />
              <div><strong>Stock quantity</strong><span>Show products within a quantity range.</span></div>
            </div>
            <label><span>Minimum stock</span><input min="0" onChange={(event) => setDraftMinStock(event.target.value)} placeholder="Any" type="number" value={draftMinStock} /></label>
            <label><span>Maximum stock</span><input min="0" onChange={(event) => setDraftMaxStock(event.target.value)} placeholder="Any" type="number" value={draftMaxStock} /></label>
            <div className={styles.advancedActions}>
              <button className="button button--ghost" onClick={clearFilters} type="button">Clear all</button>
              <button className="button button--outline-gold" type="submit">Apply filters</button>
            </div>
          </form>
        ) : null}

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        {selected.size > 0 ? (
          <div className={styles.selectionBar}>
            <p><strong>{selected.size.toLocaleString("en-US")}</strong> product{selected.size === 1 ? "" : "s"} selected</p>
            <div>
              <button onClick={() => openStockDialog("adjust", Array.from(selected))} type="button"><FilePenLine aria-hidden="true" size={14} /> Adjust selected</button>
              <button onClick={() => setSelected(new Set())} type="button">Clear selection</button>
            </div>
          </div>
        ) : null}

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Jewellery inventory stock list</caption>
            <thead>
              <tr>
                <th className={styles.checkboxCell} scope="col">
                  <input
                    aria-label="Select all products on this page"
                    checked={allPageRowsSelected}
                    onChange={togglePageSelection}
                    ref={selectAllRef}
                    type="checkbox"
                  />
                </th>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Product Name</th>
                <th scope="col">Code / SKU</th>
                <th scope="col">Category</th>
                <th scope="col">Stock Qty</th>
                <th scope="col">Unit</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item, index) => (
                <tr className={selected.has(item.id) ? styles.selectedRow : ""} key={item.id}>
                  <td className={styles.checkboxCell}>
                    <input aria-label={`Select ${item.name}`} checked={selected.has(item.id)} onChange={() => toggleItem(item.id)} type="checkbox" />
                  </td>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td><ProductThumbnail item={item} /></td>
                  <td><strong className={styles.productName}>{item.name}</strong></td>
                  <td><button className={styles.codeButton} onClick={() => setViewedItemId(item.id)} type="button">{item.code}</button></td>
                  <td>{item.category}</td>
                  <td className={styles.stockQuantity}>{item.stockQty}</td>
                  <td>{item.unit}</td>
                  <td><StockStatusBadge status={item.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`View ${item.name}`} onClick={() => setViewedItemId(item.id)} title="View stock details" type="button"><Eye aria-hidden="true" size={15} /></button>
                      <button aria-label={`Adjust stock for ${item.name}`} onClick={() => openStockDialog("adjust", [item.id])} title="Adjust stock" type="button"><FilePenLine aria-hidden="true" size={15} /></button>
                      <button aria-label={`Add stock for ${item.name}`} onClick={() => openStockDialog("add", [item.id])} title="Add stock" type="button"><Plus aria-hidden="true" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={10}>
                    <Search aria-hidden="true" size={26} />
                    <strong>No inventory items found</strong>
                    <span>Try changing the search or stock filters.</span>
                    <button className="button button--outline-gold" onClick={clearFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>
            Showing {firstVisible} to {lastVisible} of {filteredItems.length.toLocaleString("en-US")} products
            {selected.size > 0 ? <span> · {selected.size.toLocaleString("en-US")} selected</span> : null}
          </p>
          <nav aria-label="Inventory pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">
              <ChevronLeft aria-hidden="true" size={17} />
            </button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button
                aria-current={safePage === item ? "page" : undefined}
                className={safePage === item ? styles.currentPage : ""}
                key={item}
                onClick={() => setCurrentPage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">
              <ChevronRight aria-hidden="true" size={17} />
            </button>
          </nav>
        </footer>
      </Card>

      {stockDialog ? (
        <StockDialog
          items={items}
          kind={stockDialog.kind}
          onApply={applyStockChange}
          onClose={() => setStockDialog(null)}
          targetIds={stockDialog.targetIds}
        />
      ) : null}

      {viewedItem ? (
        <ProductDetailsDialog
          item={viewedItem}
          onAdjust={() => {
            setViewedItemId(null);
            openStockDialog("adjust", [viewedItem.id]);
          }}
          onClose={() => setViewedItemId(null)}
        />
      ) : null}
    </div>
  );
}
