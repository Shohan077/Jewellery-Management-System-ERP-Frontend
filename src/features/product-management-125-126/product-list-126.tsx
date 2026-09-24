"use client";

import {
  CircleDot,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Gem,
  Link2,
  Medal,
  MoreHorizontal,
  Package,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  ToggleLeft,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  catalogManagementProducts,
  productCategoryOptions,
  productKarigarOptions,
  type ManagedCatalogProduct,
  type ProductStatus,
} from "./product-management-125-126-data";
import styles from "./product-management-125-126.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;
type StatusFilter = (typeof statusOptions)[number];
type EditorState = { mode: "add" } | { mode: "edit"; product: ManagedCatalogProduct } | null;

const productIcons: Record<ManagedCatalogProduct["kind"], LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  bracelet: Link2,
  earring: Sparkles,
  pendant: Medal,
  chain: Link2,
  set: Package,
};

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function ProductThumbnail({ product }: { product: ManagedCatalogProduct }) {
  const Icon = productIcons[product.kind];
  return <span aria-hidden="true" className={styles.thumbnail}><Icon size={21} strokeWidth={1.5} /></span>;
}

function downloadProducts(records: ManagedCatalogProduct[]) {
  const rows = [
    ["Product Code", "Product Name", "Category", "Karigar", "Weight (g)", "Making Charge", "Status"],
    ...records.map((product) => [product.code, product.name, product.category, product.karigar, product.weight, product.makingCharge, product.status]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "product-list.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ProductList126() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<ManagedCatalogProduct[]>(catalogManagementProducts);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<(typeof productCategoryOptions)[number]>("All Categories");
  const [subCategory, setSubCategory] = useState("All Sub Categories");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((product) => {
      const matchesSearch = !search || [product.code, product.name, product.category, product.karigar].some((value) => value.toLowerCase().includes(search));
      const matchesCategory = category === "All Categories" || product.category === category;
      const matchesSubCategory = subCategory === "All Sub Categories" || product.name.toLowerCase().includes(subCategory.toLowerCase());
      const matchesStatus = status === "All Status" || product.status === status;
      return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
    });
  }, [category, deferredQuery, records, status, subCategory]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);
  const allVisibleSelected = rows.length > 0 && rows.every((product) => selected.has(product.id));

  function resetList() {
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
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = Number(form.get("id"));
    const product: ManagedCatalogProduct = {
      id: id || records.reduce((largest, item) => Math.max(largest, item.id), 0) + 1,
      code: String(form.get("code") ?? "").trim().toUpperCase(),
      name: String(form.get("name") ?? "").trim(),
      category: String(form.get("category") ?? "Necklace"),
      karigar: String(form.get("karigar") ?? "Rahim Uddin"),
      weight: Number(form.get("weight") ?? 0),
      makingCharge: Number(form.get("makingCharge") ?? 0),
      status: String(form.get("status") ?? "Active") as ProductStatus,
      kind: "necklace",
    };
    setRecords((current) => id ? current.map((item) => item.id === id ? { ...product, kind: item.kind } : item) : [product, ...current]);
    setEditor(null);
    resetList();
    setMessage(`${product.name} was ${id ? "updated" : "added"} successfully.`);
  }

  function toggleStatus(product: ManagedCatalogProduct) {
    const nextStatus: ProductStatus = product.status === "Active" ? "Inactive" : "Active";
    setRecords((current) => current.map((item) => item.id === product.id ? { ...item, status: nextStatus } : item));
    setOpenMenu(null);
    setMessage(`${product.code} marked ${nextStatus.toLowerCase()}.`);
  }

  async function handleImport(file: File) {
    const content = await file.text();
    const rowsImported = Math.max(0, content.split(/\r?\n/).filter(Boolean).length - 1);
    setMessage(`${file.name} checked successfully${rowsImported ? ` (${rowsImported} data rows)` : ""}.`);
  }

  const nextCode = `PRD-${String(records.length + 1).padStart(3, "0")}`;

  return (
    <div className={styles.page}>
      <PageHeader
        action={<div className={styles.headerActions}><input accept=".csv,text/csv" className={styles.hiddenInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.currentTarget.value = ""; }} ref={importInputRef} type="file" /><button className="button" onClick={() => importInputRef.current?.click()} type="button"><Upload size={15} />Import</button><button className="button" onClick={() => { downloadProducts(filtered); setMessage(`Exported ${filtered.length} products.`); }} type="button"><Download size={15} />Export</button><button className={`button ${styles.primaryButton}`} onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={16} />Add Product</button></div>}
        description="Home  ›  Product Management  ›  Product List"
        title="Product Management"
      />

      <Card className={styles.listCard}>
        <div className={styles.toolbar}>
          <label className={styles.selectField}><span className="sr-only">Filter by category</span><select onChange={(event) => { setCategory(event.target.value as (typeof productCategoryOptions)[number]); resetList(); }} value={category}>{productCategoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by sub category</span><select onChange={(event) => { setSubCategory(event.target.value); resetList(); }} value={subCategory}><option>All Sub Categories</option><option>Classic</option><option>Premium</option><option>Elegant</option><option>Heritage</option></select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => { setStatus(event.target.value as StatusFilter); resetList(); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.searchField}><Search size={16} /><span className="sr-only">Search products</span><input onChange={(event) => { setQuery(event.target.value); resetList(); }} placeholder="Search product by name, code..." type="search" value={query} /></label>
          <button className={`button ${styles.primaryButton}`} onClick={() => setMessage(`${filtered.length} products match the current filters.`)} type="button"><Filter size={15} />Search</button>
          <button className="button" onClick={() => { setQuery(""); setCategory("All Categories"); setSubCategory("All Sub Categories"); setStatus("All Status"); resetList(); setMessage("Filters reset."); }} type="button"><RotateCcw size={14} />Reset</button>
        </div>
        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Product list</caption>
            <thead><tr><th className={styles.checkboxCell} scope="col"><input aria-label="Select all products on this page" checked={allVisibleSelected} onChange={toggleVisibleSelection} type="checkbox" /></th><th scope="col">#</th><th scope="col">Image</th><th scope="col">Product Code</th><th scope="col">Product Name</th><th scope="col">Category</th><th scope="col">Karigar</th><th scope="col">Weight (gm)</th><th scope="col">Making Charge</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((product, index) => (
                <tr className={selected.has(product.id) ? styles.selectedRow : ""} key={product.id}>
                  <td className={styles.checkboxCell}><input aria-label={`Select ${product.name}`} checked={selected.has(product.id)} onChange={() => toggleProduct(product.id)} type="checkbox" /></td><td>{first + index}</td><td><ProductThumbnail product={product} /></td><td className={styles.code}>{product.code}</td><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{product.karigar}</td><td className={styles.numeric}>{product.weight.toFixed(3)}</td><td className={styles.numeric}>৳ {product.makingCharge.toLocaleString("en-IN")}</td><td><span className={`${styles.status} ${product.status === "Active" ? styles.active : styles.inactive}`}>{product.status}</span></td><td className={styles.actionCell}><div className={styles.actions}><button aria-label={`View ${product.name}`} className={styles.actionButton} onClick={() => { setMessage(`${product.code}: ${product.name} · ${product.weight.toFixed(3)} gm.`); setOpenMenu(null); }} title="View product" type="button"><Eye size={14} /></button><button aria-label={`Edit ${product.name}`} className={styles.actionButton} onClick={() => setEditor({ mode: "edit", product })} title="Edit product" type="button"><FilePenLine size={14} /></button><button aria-expanded={openMenu === product.id} aria-label={`More actions for ${product.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === product.id ? null : product.id)} type="button"><MoreHorizontal size={16} /></button></div>{openMenu === product.id ? <div className={styles.menu} role="menu"><button onClick={() => setEditor({ mode: "edit", product })} role="menuitem" type="button"><FilePenLine size={14} />Edit product</button><button onClick={() => toggleStatus(product)} role="menuitem" type="button"><ToggleLeft size={14} />Mark {product.status === "Active" ? "inactive" : "active"}</button></div> : null}</td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.empty} colSpan={11}><Package size={21} />No products match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.footer}><p>Showing {first} to {last} of {filtered.length} products{selected.size ? ` · ${selected.size} selected` : ""}</p><div className={styles.footerControls}><nav aria-label="Product pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">‹</button>{paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span className={styles.ellipsis} key={`ellipsis-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">›</button></nav><span className={styles.pageSize}>10 / page</span></div></footer>
      </Card>

      {editor ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}><Card aria-labelledby="product-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="product-editor-title">{editor.mode === "edit" ? "Edit Product" : "Add Product"}</h2><p>Create and maintain catalogue product information.</p></div><button aria-label="Close product form" className={styles.closeButton} onClick={() => setEditor(null)} type="button"><X size={18} /></button></div><form className={styles.modalForm} onSubmit={saveProduct}><input name="id" type="hidden" value={editor.mode === "edit" ? editor.product.id : ""} /><label><span>Product name</span><input autoFocus className="field" defaultValue={editor.mode === "edit" ? editor.product.name : ""} name="name" placeholder="e.g. Gold Necklace" required /></label><div className={styles.formGrid}><label><span>Product code</span><input className="field" defaultValue={editor.mode === "edit" ? editor.product.code : nextCode} name="code" required /></label><label><span>Category</span><select className="select" defaultValue={editor.mode === "edit" ? editor.product.category : "Necklace"} name="category">{productCategoryOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Karigar</span><select className="select" defaultValue={editor.mode === "edit" ? editor.product.karigar : "Rahim Uddin"} name="karigar">{productKarigarOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Weight (gm)</span><input className="field" defaultValue={editor.mode === "edit" ? editor.product.weight : ""} min="0.001" name="weight" required step="0.001" type="number" /></label><label><span>Making charge (৳)</span><input className="field" defaultValue={editor.mode === "edit" ? editor.product.makingCharge : ""} min="0" name="makingCharge" required step="1" type="number" /></label><label><span>Status</span><select className="select" defaultValue={editor.mode === "edit" ? editor.product.status : "Active"} name="status"><option>Active</option><option>Inactive</option></select></label></div><div className={styles.modalActions}><button className="button" onClick={() => setEditor(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} type="submit">{editor.mode === "edit" ? <FilePenLine size={15} /> : <Plus size={15} />}{editor.mode === "edit" ? "Save Changes" : "Add Product"}</button></div></form></Card></div> : null}
    </div>
  );
}
