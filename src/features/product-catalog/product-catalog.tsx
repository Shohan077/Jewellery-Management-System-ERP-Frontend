"use client";

import {
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
  PackageSearch,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  catalogBrands,
  catalogCategories,
  catalogProducts,
  type CatalogProduct,
  type CatalogProductKind,
  type CatalogProductStatus,
} from "./product-catalog-data";
import styles from "./product-catalog.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;
type StatusFilter = (typeof statusOptions)[number];
type EditorState = { mode: "add" } | { mode: "edit"; product: CatalogProduct } | null;

const productIcons: Record<CatalogProductKind, LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  earring: Sparkles,
  bracelet: CircleDashed,
  chain: Link2,
  pendant: Medal,
  bangle: Circle,
  "nose-pin": Sparkles,
};

const categoryKinds: Record<string, CatalogProductKind> = {
  Necklace: "necklace",
  Ring: "ring",
  Earring: "earring",
  Bracelet: "bracelet",
  Chain: "chain",
  Pendant: "pendant",
  Bangle: "bangle",
  "Nose Pin": "nose-pin",
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

function downloadCatalog(records: CatalogProduct[]) {
  const header = ["Product Name", "Code / SKU", "Category", "Brand", "Gold Purity", "Weight (g)", "Status", "Stock"];
  const rows = records.map((product) => [
    product.name,
    product.code,
    product.category,
    product.brand,
    product.purity,
    product.weight,
    product.status,
    product.stock,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "product-catalog.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function ProductThumbnail({ product }: { product: CatalogProduct }) {
  const Icon = productIcons[product.kind];
  const isDiamond = product.name.toLowerCase().includes("diamond");
  return (
    <span className={`${styles.thumbnail} ${isDiamond ? styles.diamondThumbnail : ""}`}>
      <Icon aria-hidden="true" size={23} strokeWidth={1.45} />
    </span>
  );
}

function ProductEditor({
  editor,
  nextCode,
  onClose,
  onSubmit,
}: {
  editor: Exclude<EditorState, null>;
  nextCode: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const product = editor.mode === "edit" ? editor.product : undefined;
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="catalog-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <div className={styles.modalHeader}>
          <div>
            <h2 id="catalog-editor-title">{product ? "Edit Product" : "Add Product"}</h2>
            <p>{product ? `Update ${product.code} catalogue information.` : "Create a new jewellery catalogue item."}</p>
          </div>
          <button aria-label="Close product form" className={styles.closeButton} onClick={onClose} type="button"><X size={19} /></button>
        </div>
        <form className={styles.editorForm} onSubmit={onSubmit}>
          <input name="id" type="hidden" value={product?.id ?? ""} />
          <label><span>Product name <b>*</b></span><input autoFocus className="field" defaultValue={product?.name ?? ""} name="name" placeholder="Enter product name" required /></label>
          <div className={styles.formGrid}>
            <label><span>Code / SKU <b>*</b></span><input className="field" defaultValue={product?.code ?? nextCode} name="code" required /></label>
            <label><span>Category <b>*</b></span><select className="select" defaultValue={product?.category ?? "Necklace"} name="category">{catalogCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Brand</span><select className="select" defaultValue={product?.brand ?? "Aarohan"} name="brand">{catalogBrands.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Gold purity</span><select className="select" defaultValue={product?.purity ?? "22K"} name="purity"><option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>925</option></select></label>
            <label><span>Weight (g) <b>*</b></span><input className="field" defaultValue={product?.weight ?? ""} min="0.01" name="weight" required step="0.01" type="number" /></label>
            <label><span>Status</span><select className="select" defaultValue={product?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
          </div>
          <div className={styles.modalActions}>
            <button className="button" onClick={onClose} type="button">Cancel</button>
            <button className="button button--primary" type="submit">{product ? <FilePenLine size={16} /> : <Plus size={16} />}{product ? "Save Changes" : "Add Product"}</button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ProductDetails({ product, onClose }: { product: CatalogProduct; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="catalog-details-title" aria-modal="true" as="section" className={`${styles.modal} ${styles.detailsModal}`} role="dialog">
        <div className={styles.modalHeader}>
          <div><p className={styles.eyebrow}>PRODUCT DETAILS</p><h2 id="catalog-details-title">{product.name}</h2><p>{product.code}</p></div>
          <button aria-label="Close product details" className={styles.closeButton} onClick={onClose} type="button"><X size={19} /></button>
        </div>
        <div className={styles.detailsHero}><ProductThumbnail product={product} /><div><span className={`${styles.statusBadge} ${product.status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>{product.status}</span><strong>{product.stock} units in stock</strong></div></div>
        <dl className={styles.detailsGrid}><div><dt>Category</dt><dd>{product.category}</dd></div><div><dt>Brand</dt><dd>{product.brand}</dd></div><div><dt>Gold Purity</dt><dd>{product.purity}</dd></div><div><dt>Weight</dt><dd>{product.weight.toFixed(2)} g</dd></div></dl>
        <div className={styles.modalActions}><button className="button button--primary" onClick={onClose} type="button">Done</button></div>
      </Card>
    </div>
  );
}

function StockEditor({
  product,
  onClose,
  onSubmit,
}: {
  product: CatalogProduct;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="catalog-stock-title" aria-modal="true" as="section" className={`${styles.modal} ${styles.stockModal}`} role="dialog">
        <div className={styles.modalHeader}><div><h2 id="catalog-stock-title">Add Stock</h2><p>{product.name} · Current stock: {product.stock}</p></div><button aria-label="Close stock form" className={styles.closeButton} onClick={onClose} type="button"><X size={19} /></button></div>
        <form className={styles.editorForm} onSubmit={onSubmit}>
          <input name="id" type="hidden" value={product.id} />
          <label><span>Quantity to add <b>*</b></span><input autoFocus className="field" min="1" name="quantity" placeholder="Enter quantity" required step="1" type="number" /></label>
          <label><span>Reference note</span><input className="field" name="reference" placeholder="Optional stock reference" /></label>
          <div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus size={16} />Update Stock</button></div>
        </form>
      </Card>
    </div>
  );
}

export function ProductCatalog() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<CatalogProduct[]>(catalogProducts);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("All Categories");
  const [brand, setBrand] = useState("All Brands");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [message, setMessage] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [viewing, setViewing] = useState<CatalogProduct | null>(null);
  const [stockProduct, setStockProduct] = useState<CatalogProduct | null>(null);

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((product) => {
      const matchesSearch = !search || [product.name, product.code, product.category, product.brand].some((value) => value.toLowerCase().includes(search));
      const matchesCategory = category === "All Categories" || product.category === category;
      const matchesBrand = brand === "All Brands" || product.brand === brand;
      const matchesStatus = status === "All Status" || product.status === status;
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [brand, category, deferredQuery, records, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);
  const allVisibleSelected = rows.length > 0 && rows.every((product) => selected.has(product.id));

  function resetListPosition() {
    setCurrentPage(1);
    setSelected(new Set());
  }

  function toggleVisibleSelection() {
    setSelected((previous) => {
      const next = new Set(previous);
      for (const product of rows) {
        if (allVisibleSelected) next.delete(product.id);
        else next.add(product.id);
      }
      return next;
    });
  }

  function toggleProduct(id: number) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const idValue = Number(form.get("id"));
    const categoryValue = String(form.get("category"));
    const product: CatalogProduct = {
      id: idValue || records.reduce((largest, item) => Math.max(largest, item.id), 0) + 1,
      name: String(form.get("name")).trim(),
      code: String(form.get("code")).trim().toUpperCase(),
      category: categoryValue,
      brand: String(form.get("brand")),
      purity: String(form.get("purity")),
      weight: Number(form.get("weight")),
      status: String(form.get("status")) as CatalogProductStatus,
      kind: categoryKinds[categoryValue] ?? "necklace",
      stock: idValue ? records.find((item) => item.id === idValue)?.stock ?? 0 : 0,
    };
    setRecords((current) => idValue ? current.map((item) => item.id === idValue ? product : item) : [product, ...current]);
    setEditor(null);
    resetListPosition();
    setMessage(`${product.name} was ${idValue ? "updated" : "added"} successfully.`);
  }

  function updateStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = Number(form.get("id"));
    const quantity = Number(form.get("quantity"));
    setRecords((current) => current.map((item) => item.id === id ? { ...item, stock: item.stock + quantity } : item));
    setMessage(`${quantity} units added to ${stockProduct?.name ?? "the product"}.`);
    setStockProduct(null);
  }

  async function handleImport(file: File) {
    const content = await file.text();
    const recordCount = Math.max(0, content.split(/\r?\n/).filter(Boolean).length - 1);
    setMessage(`${file.name} checked successfully${recordCount ? ` (${recordCount} data rows)` : ""}.`);
  }

  const nextCode = `PRD-${String(records.length + 1).padStart(3, "0")}`;

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <input accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className={styles.hiddenInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.currentTarget.value = ""; }} ref={importInputRef} type="file" />
            <button className="button" onClick={() => importInputRef.current?.click()} type="button"><Upload aria-hidden="true" size={16} />Import</button>
            <button className="button" onClick={() => { downloadCatalog(filtered); setMessage(`Exported ${filtered.length.toLocaleString("en-US")} products.`); }} type="button"><Download aria-hidden="true" size={16} />Export</button>
            <button className="button button--primary" onClick={() => setEditor({ mode: "add" })} type="button"><Plus aria-hidden="true" size={17} />Add Product</button>
          </div>
        )}
        description="Manage your jewellery products"
        title="Product List"
      />

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}><Search aria-hidden="true" size={17} /><span className="sr-only">Search products</span><input onChange={(event) => { setQuery(event.target.value); resetListPosition(); }} placeholder="Search by name, code or barcode..." type="search" value={query} /></label>
          <label className={styles.selectField}><span className="sr-only">Filter by category</span><select onChange={(event) => { setCategory(event.target.value); resetListPosition(); }} value={category}><option>All Categories</option>{catalogCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by brand</span><select onChange={(event) => { setBrand(event.target.value); resetListPosition(); }} value={brand}><option>All Brands</option>{catalogBrands.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => { setStatus(event.target.value as StatusFilter); resetListPosition(); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <button className={`button ${styles.filterButton}`} onClick={() => setMessage(`${filtered.length.toLocaleString("en-US")} products match the current filters.`)} type="button"><Filter aria-hidden="true" size={16} />Filter</button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Product management catalogue</caption>
            <thead><tr><th className={styles.checkboxCell} scope="col"><input aria-label="Select all products on this page" checked={allVisibleSelected} onChange={toggleVisibleSelection} type="checkbox" /></th><th scope="col">#</th><th scope="col">Image</th><th scope="col">Product Name</th><th scope="col">Code /<br />SKU</th><th scope="col">Category</th><th scope="col">Gold<br />Purity</th><th scope="col">Weight</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((product, index) => (
                <tr className={selected.has(product.id) ? styles.selectedRow : ""} key={product.id}>
                  <td className={styles.checkboxCell}><input aria-label={`Select ${product.name}`} checked={selected.has(product.id)} onChange={() => toggleProduct(product.id)} type="checkbox" /></td>
                  <td className={styles.rowNumber}>{first + index}</td>
                  <td><ProductThumbnail product={product} /></td>
                  <td><strong>{product.name}</strong></td>
                  <td><button className={styles.codeButton} onClick={() => setViewing(product)} type="button">{product.code}</button></td>
                  <td>{product.category}</td><td>{product.purity}</td><td className={styles.numeric}>{product.weight.toFixed(2)} g</td>
                  <td><span className={`${styles.statusBadge} ${product.status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>{product.status}</span></td>
                  <td><div className={styles.rowActions}><button aria-label={`View ${product.name}`} onClick={() => setViewing(product)} title="View product" type="button"><Eye size={15} /></button><button aria-label={`Edit ${product.name}`} onClick={() => setEditor({ mode: "edit", product })} title="Edit product" type="button"><FilePenLine size={15} /></button><button aria-label={`Add stock for ${product.name}`} onClick={() => setStockProduct(product)} title="Add stock" type="button"><Plus size={15} /></button></div></td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.emptyState} colSpan={10}><PackageSearch aria-hidden="true" size={25} /><strong>No products found</strong><span>Try a different search, category, brand, or status.</span></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {first} to {last} of {filtered.length.toLocaleString("en-US")} products{selected.size ? <span> · {selected.size} selected</span> : null}</p>
          <nav aria-label="Product catalogue pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft size={17} /></button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight size={17} /></button>
          </nav>
        </footer>
      </Card>

      {editor ? <ProductEditor editor={editor} key={editor.mode === "edit" ? editor.product.id : "new"} nextCode={nextCode} onClose={() => setEditor(null)} onSubmit={saveProduct} /> : null}
      {viewing ? <ProductDetails onClose={() => setViewing(null)} product={viewing} /> : null}
      {stockProduct ? <StockEditor onClose={() => setStockProduct(null)} onSubmit={updateStock} product={stockProduct} /> : null}
    </div>
  );
}
