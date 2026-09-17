"use client";

import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  CircleDot,
  Download,
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
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatBdt,
  INITIAL_STOCK_VALUE,
  stockStatusFor,
  stockViewCategories,
  stockViewItems,
  type StockViewItem,
  type StockViewKind,
  type StockViewStatus,
} from "./inventory-stock-view-data";
import styles from "./inventory-stock-view.module.css";

const PAGE_SIZE = 10;
const ORIGINAL_DATA_VALUE = stockViewItems.reduce((total, item) => total + item.value, 0);
const statusOptions = ["All Status", "In Stock", "Low Stock", "Out of Stock"] as const;
type StatusFilter = (typeof statusOptions)[number];

const kindByCategory: Record<string, StockViewKind> = {
  Necklace: "necklace",
  Ring: "ring",
  Earring: "earring",
  Bracelet: "bracelet",
  Chain: "chain",
  Pendant: "pendant",
  Bangle: "bangle",
  "Nose Pin": "nose-pin",
};

const itemIcons: Record<StockViewKind, LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  earring: Sparkles,
  bracelet: CircleDashed,
  chain: Link2,
  pendant: Medal,
  bangle: Circle,
  "nose-pin": Sparkles,
};

const statusClasses: Record<StockViewStatus, string> = {
  "In Stock": styles.inStock,
  "Low Stock": styles.lowStock,
  "Out of Stock": styles.outOfStock,
};

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadStock(records: StockViewItem[]) {
  const header = ["Product Name", "Code", "Category", "Available Stock", "Unit", "Value (BDT)", "Status"];
  const rows = records.map((item) => [item.name, item.code, item.category, item.quantity, item.unit, item.value, item.status]);
  const content = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "inventory-stock.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function ProductThumbnail({ item, large = false }: { item: StockViewItem; large?: boolean }) {
  const Icon = itemIcons[item.kind];
  const diamond = item.name.toLowerCase().includes("diamond");

  return (
    <span className={`${styles.thumbnail} ${large ? styles.largeThumbnail : ""} ${diamond ? styles.diamondThumbnail : ""}`}>
      <Icon aria-hidden="true" size={large ? 29 : 21} strokeWidth={1.4} />
    </span>
  );
}

function StatusBadge({ status }: { status: StockViewStatus }) {
  return <span className={`${styles.statusBadge} ${statusClasses[status]}`}>{status}</span>;
}

function ModalShell({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-describedby="stock-modal-description" aria-labelledby="stock-modal-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2 id="stock-modal-title">{title}</h2><p id="stock-modal-description">{description}</p></div>
          <button aria-label={`Close ${title}`} className={styles.closeButton} onClick={onClose} type="button"><X aria-hidden="true" size={19} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}

function StockEditor({
  items,
  initialItemId,
  selectedIds,
  onClose,
  onSubmit,
}: {
  items: StockViewItem[];
  initialItemId?: number;
  selectedIds: number[];
  onClose: () => void;
  onSubmit: (ids: number[], quantity: number, reference: string) => void;
}) {
  const [itemId, setItemId] = useState(String(initialItemId ?? items[0]?.id ?? ""));
  const multiple = selectedIds.length > 1;
  const targets = selectedIds.length ? selectedIds : [Number(itemId)];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const quantity = Number(form.get("quantity"));
    if (!Number.isInteger(quantity) || quantity < 1) return;
    onSubmit(selectedIds.length ? selectedIds : [Number(itemId)], quantity, String(form.get("reference")).trim());
  }

  return (
    <ModalShell description="Increase the available quantity for one or more inventory products." onClose={onClose} title="Add Stock">
      <form className={styles.editorForm} onSubmit={submit}>
        {multiple ? (
          <div className={styles.selectedSummary}><span>Selected products</span><strong>{targets.length} products</strong><small>The same quantity will be added to every selected product.</small></div>
        ) : (
          <label><span>Product <b>*</b></span><select autoFocus className="select" onChange={(event) => setItemId(event.target.value)} value={itemId}>{items.map((item) => <option key={item.id} value={item.id}>{item.code} — {item.name} ({item.quantity} pcs)</option>)}</select></label>
        )}
        <label><span>Quantity to add <b>*</b></span><input autoFocus={multiple} className="field" min="1" name="quantity" placeholder="Enter quantity" required step="1" type="number" /></label>
        <label><span>Reference / notes</span><input className="field" name="reference" placeholder="Optional stock reference" /></label>
        <footer className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><PackagePlus aria-hidden="true" size={16} />Update Stock</button></footer>
      </form>
    </ModalShell>
  );
}

function ItemEditor({ item, onClose, onSubmit }: { item: StockViewItem; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <ModalShell description={`Update inventory information for ${item.code}.`} onClose={onClose} title="Edit Stock Item">
      <form className={styles.editorForm} onSubmit={onSubmit}>
        <input name="id" type="hidden" value={item.id} />
        <label><span>Product name <b>*</b></span><input autoFocus className="field" defaultValue={item.name} name="name" required /></label>
        <div className={styles.formGrid}>
          <label><span>Product code <b>*</b></span><input className="field" defaultValue={item.code} name="code" required /></label>
          <label><span>Category <b>*</b></span><select className="select" defaultValue={item.category} name="category">{stockViewCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label><span>Available stock <b>*</b></span><input className="field" defaultValue={item.quantity} min="0" name="quantity" required step="1" type="number" /></label>
          <label><span>Total value (৳) <b>*</b></span><input className="field" defaultValue={item.value} min="0" name="value" required step="1" type="number" /></label>
        </div>
        <footer className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><FilePenLine aria-hidden="true" size={16} />Save Changes</button></footer>
      </form>
    </ModalShell>
  );
}

function ItemDetails({ item, onAddStock, onClose }: { item: StockViewItem; onAddStock: () => void; onClose: () => void }) {
  return (
    <ModalShell description="Current product availability and inventory value." onClose={onClose} title="Stock Details">
      <div className={styles.detailsBody}>
        <div className={styles.detailsHero}><ProductThumbnail item={item} large /><div><h3>{item.name}</h3><span>{item.code}</span></div><StatusBadge status={item.status} /></div>
        <dl className={styles.detailsGrid}><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Available stock</dt><dd>{item.quantity} {item.unit}</dd></div><div><dt>Inventory value</dt><dd>{formatBdt(item.value)}</dd></div><div><dt>Value per item</dt><dd>{formatBdt(item.quantity ? item.value / item.quantity : 0)}</dd></div></dl>
        <footer className={styles.modalActions}><button className="button" onClick={onClose} type="button">Close</button><button className="button button--primary" onClick={onAddStock} type="button"><Plus aria-hidden="true" size={16} />Add Stock</button></footer>
      </div>
    </ModalShell>
  );
}

export function InventoryStockView() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<StockViewItem[]>(stockViewItems);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");
  const [minStock, setMinStock] = useState<number | null>(null);
  const [maxStock, setMaxStock] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [viewing, setViewing] = useState<StockViewItem | null>(null);
  const [editing, setEditing] = useState<StockViewItem | null>(null);
  const [stockTargets, setStockTargets] = useState<number[] | null>(null);

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((item) => {
      const matchesSearch = !search || [item.name, item.code, item.category].some((value) => value.toLowerCase().includes(search));
      const matchesCategory = category === "All Categories" || item.category === category;
      const matchesStatus = status === "All Status" || item.status === status;
      const matchesMin = minStock === null || item.quantity >= minStock;
      const matchesMax = maxStock === null || item.quantity <= maxStock;
      return matchesSearch && matchesCategory && matchesStatus && matchesMin && matchesMax;
    });
  }, [category, deferredQuery, maxStock, minStock, records, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);
  const allVisibleSelected = rows.length > 0 && rows.every((item) => selected.has(item.id));
  const someVisibleSelected = rows.some((item) => selected.has(item.id));
  const statusSummary = useMemo(() => records.reduce((summary, item) => {
    if (item.status === "Low Stock") summary.low += 1;
    if (item.status === "Out of Stock") summary.out += 1;
    return summary;
  }, { low: 0, out: 0 }), [records]);
  const currentDataValue = useMemo(() => records.reduce((total, item) => total + item.value, 0), [records]);
  const displayedStockValue = INITIAL_STOCK_VALUE + currentDataValue - ORIGINAL_DATA_VALUE;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [allVisibleSelected, someVisibleSelected]);

  function resetListPosition() {
    setCurrentPage(1);
    setSelected(new Set());
  }

  function toggleVisibleSelection() {
    setSelected((previous) => {
      const next = new Set(previous);
      for (const item of rows) {
        if (allVisibleSelected) next.delete(item.id);
        else next.add(item.id);
      }
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

  function addStock(ids: number[], quantity: number, reference: string) {
    const targets = new Set(ids);
    setRecords((current) => current.map((item) => {
      if (!targets.has(item.id)) return item;
      const perItemValue = item.quantity > 0 ? item.value / item.quantity : 10_000;
      const nextQuantity = item.quantity + quantity;
      return { ...item, quantity: nextQuantity, value: item.value + perItemValue * quantity, status: stockStatusFor(nextQuantity) };
    }));
    setMessage(`${quantity} pcs added to ${ids.length} product${ids.length === 1 ? "" : "s"}.${reference ? ` Reference: ${reference}` : ""}`);
    setSelected(new Set());
    setStockTargets(null);
  }

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = Number(form.get("id"));
    const quantity = Math.max(0, Math.round(Number(form.get("quantity"))));
    const categoryValue = String(form.get("category"));
    const name = String(form.get("name")).trim();
    setRecords((current) => current.map((item) => item.id === id ? {
      ...item,
      name,
      code: String(form.get("code")).trim().toUpperCase(),
      category: categoryValue,
      quantity,
      value: Math.max(0, Number(form.get("value"))),
      status: stockStatusFor(quantity),
      kind: kindByCategory[categoryValue] ?? item.kind,
    } : item));
    setEditing(null);
    setMessage(`${name} was updated successfully.`);
  }

  function applyQuantityFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMin = draftMin === "" ? null : Math.max(0, Number(draftMin));
    const nextMax = draftMax === "" ? null : Math.max(0, Number(draftMax));
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setMessage("Minimum stock cannot be greater than maximum stock.");
      return;
    }
    setMinStock(nextMin);
    setMaxStock(nextMax);
    resetListPosition();
    setFiltersOpen(false);
    setMessage("Stock quantity filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setCategory("All Categories");
    setStatus("All Status");
    setDraftMin("");
    setDraftMax("");
    setMinStock(null);
    setMaxStock(null);
    resetListPosition();
    setFiltersOpen(false);
    setMessage("All inventory filters cleared.");
  }

  async function handleImport(file: File) {
    const content = await file.text();
    const dataRows = Math.max(0, content.split(/\r?\n/).filter((line) => line.trim()).length - 1);
    setMessage(`${file.name} imported successfully${dataRows ? ` — ${dataRows} data row${dataRows === 1 ? "" : "s"} read` : ""}.`);
  }

  const metrics = [
    { label: "Total Products", value: records.length.toLocaleString("en-US"), extra: "↑ 12%", tone: styles.positive },
    { label: "Total Stock Value", value: formatBdt(displayedStockValue), extra: "", tone: "" },
    { label: "Low Stock Items", value: statusSummary.low.toLocaleString("en-US"), extra: "", tone: styles.warningText },
    { label: "Out of Stock", value: statusSummary.out.toLocaleString("en-US"), extra: "", tone: styles.dangerText },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <input accept=".csv,text/csv" className={styles.hiddenInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.currentTarget.value = ""; }} ref={importInputRef} type="file" />
            <button className="button" onClick={() => importInputRef.current?.click()} type="button"><Upload aria-hidden="true" size={16} />Import</button>
            <button className="button" onClick={() => { downloadStock(filtered); setMessage(`Exported ${filtered.length.toLocaleString("en-US")} stock records.`); }} type="button"><Download aria-hidden="true" size={16} />Export</button>
            <button className="button button--primary" onClick={() => setStockTargets(selected.size ? Array.from(selected) : [])} type="button"><Plus aria-hidden="true" size={17} />Add Stock</button>
          </div>
        )}
        description="View and manage your current stock"
        title="Inventory Stock"
      />

      <section aria-label="Inventory summary" className={styles.metrics}>
        {metrics.map((metric) => <Card as="article" className={styles.metricCard} key={metric.label}><span>{metric.label}</span><div><strong className={metric.tone}>{metric.value}</strong>{metric.extra ? <small className={metric.tone}>{metric.extra}</small> : null}</div></Card>)}
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}><Search aria-hidden="true" size={17} /><span className="sr-only">Search inventory</span><input onChange={(event) => { setQuery(event.target.value); resetListPosition(); }} placeholder="Search by name, code or category..." type="search" value={query} /></label>
          <label className={styles.selectField}><span className="sr-only">Filter by category</span><select onChange={(event) => { setCategory(event.target.value); resetListPosition(); }} value={category}><option>All Categories</option>{stockViewCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => { setStatus(event.target.value as StatusFilter); resetListPosition(); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <button aria-controls="stock-view-filters" aria-expanded={filtersOpen} className={`button ${styles.filterButton} ${minStock !== null || maxStock !== null ? styles.filterActive : ""}`} onClick={() => setFiltersOpen((open) => !open)} type="button"><Filter aria-hidden="true" size={16} />Filter</button>
        </div>

        {filtersOpen ? <form className={styles.advancedFilters} id="stock-view-filters" onSubmit={applyQuantityFilters}><div><strong>Available stock range</strong><span>Narrow results by quantity.</span></div><label><span>Minimum</span><input className="field" min="0" onChange={(event) => setDraftMin(event.target.value)} placeholder="Any" type="number" value={draftMin} /></label><label><span>Maximum</span><input className="field" min="0" onChange={(event) => setDraftMax(event.target.value)} placeholder="Any" type="number" value={draftMax} /></label><div className={styles.filterActions}><button className="button button--ghost" onClick={clearFilters} type="button">Clear</button><button className="button button--outline-gold" type="submit">Apply</button></div></form> : null}

        {selected.size ? <div className={styles.selectionBar}><p><strong>{selected.size}</strong> product{selected.size === 1 ? "" : "s"} selected</p><div><button className="button button--ghost" onClick={() => setSelected(new Set())} type="button">Clear selection</button><button className="button button--outline-gold" onClick={() => setStockTargets(Array.from(selected))} type="button"><Plus size={15} />Add stock</button></div></div> : null}
        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Inventory stock products</caption>
            <thead><tr><th className={styles.checkboxCell} scope="col"><input aria-label="Select all products on this page" checked={allVisibleSelected} onChange={toggleVisibleSelection} ref={selectAllRef} type="checkbox" /></th><th scope="col">#</th><th scope="col">Image</th><th scope="col">Product Name</th><th scope="col">Code</th><th scope="col">Category</th><th scope="col">Available Stock</th><th scope="col">Unit</th><th scope="col">Value (৳)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((item, index) => (
                <tr className={selected.has(item.id) ? styles.selectedRow : ""} key={item.id}>
                  <td className={styles.checkboxCell}><input aria-label={`Select ${item.name}`} checked={selected.has(item.id)} onChange={() => toggleItem(item.id)} type="checkbox" /></td><td className={styles.rowNumber}>{first + index}</td><td><ProductThumbnail item={item} /></td><td><strong>{item.name}</strong></td><td><button className={styles.codeButton} onClick={() => setViewing(item)} type="button">{item.code}</button></td><td>{item.category}</td><td className={item.quantity === 0 ? styles.zeroStock : styles.numeric}>{item.quantity}</td><td>{item.unit}</td><td className={styles.numeric}>{new Intl.NumberFormat("en-IN").format(Math.round(item.value))}</td><td><StatusBadge status={item.status} /></td><td><div className={styles.rowActions}><button aria-label={`View ${item.name}`} onClick={() => setViewing(item)} title="View stock" type="button"><Eye aria-hidden="true" size={15} /></button><button aria-label={`Edit ${item.name}`} onClick={() => setEditing(item)} title="Edit stock item" type="button"><FilePenLine aria-hidden="true" size={15} /></button><button aria-label={`Add stock for ${item.name}`} onClick={() => setStockTargets([item.id])} title="Add stock" type="button"><Plus aria-hidden="true" size={15} /></button></div></td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.emptyState} colSpan={11}><Boxes aria-hidden="true" size={26} /><strong>No stock items found</strong><span>Try changing your search or filters.</span><button className="button button--outline-gold" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}><p>Showing {first} to {last} of {filtered.length.toLocaleString("en-US")} products</p><nav aria-label="Inventory pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft aria-hidden="true" size={17} /></button>{paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight aria-hidden="true" size={17} /></button></nav></footer>
      </Card>

      {viewing ? <ItemDetails item={viewing} onAddStock={() => { setViewing(null); setStockTargets([viewing.id]); }} onClose={() => setViewing(null)} /> : null}
      {editing ? <ItemEditor item={editing} onClose={() => setEditing(null)} onSubmit={saveItem} /> : null}
      {stockTargets ? <StockEditor initialItemId={stockTargets[0]} items={records} onClose={() => setStockTargets(null)} onSubmit={addStock} selectedIds={stockTargets} /> : null}
    </div>
  );
}
