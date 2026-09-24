"use client";

import {
  Ban,
  Download,
  Eye,
  FilePenLine,
  FolderTree,
  Layers3,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ToggleLeft,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { productCategories, type CategoryStatus, type ProductCategory } from "./product-management-125-126-data";
import styles from "./product-management-125-126.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;
type StatusFilter = (typeof statusOptions)[number];
type EditorState = { mode: "add" } | { mode: "edit"; category: ProductCategory } | null;

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function downloadCategories(records: ProductCategory[]) {
  const rows = [
    ["Category Name", "Description", "Sub Categories", "Products", "Status"],
    ...records.map((category) => [category.name, category.description, category.subCategories, category.products, category.status]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "product-categories.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function CategoryManagement125() {
  const [records, setRecords] = useState<ProductCategory[]>(productCategories);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [availability, setAvailability] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [editor, setEditor] = useState<EditorState>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((category) => {
      const matchesSearch = !search || category.name.toLowerCase().includes(search) || category.description.toLowerCase().includes(search);
      const matchesStatus = status === "All Status" || category.status === status;
      const matchesAvailability = availability === "All Status" || (availability === "With Products" ? category.products > 0 : category.products === 0);
      return matchesSearch && matchesStatus && matchesAvailability;
    });
  }, [availability, deferredQuery, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const first = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const last = Math.min(safePage * pageSize, filtered.length);
  const totalProducts = records.reduce((sum, category) => sum + category.products, 0);
  const totalSubCategories = records.reduce((sum, category) => sum + category.subCategories, 0);
  const inactive = records.filter((category) => category.status === "Inactive").length;

  function resetList() {
    setCurrentPage(1);
  }

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = Number(form.get("id"));
    const category: ProductCategory = {
      id: id || records.reduce((largest, item) => Math.max(largest, item.id), 0) + 1,
      name: String(form.get("name") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      subCategories: Number(form.get("subCategories") ?? 0),
      products: Number(form.get("products") ?? 0),
      status: String(form.get("status") ?? "Active") as CategoryStatus,
    };
    setRecords((current) => id ? current.map((item) => item.id === id ? category : item) : [category, ...current]);
    setEditor(null);
    resetList();
    setMessage(`${category.name} was ${id ? "updated" : "added"} successfully.`);
  }

  function toggleStatus(category: ProductCategory) {
    const nextStatus: CategoryStatus = category.status === "Active" ? "Inactive" : "Active";
    setRecords((current) => current.map((item) => item.id === category.id ? { ...item, status: nextStatus } : item));
    setOpenMenu(null);
    setMessage(`${category.name} marked ${nextStatus.toLowerCase()}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<div className={styles.headerActions}><button className={`button ${styles.primaryButton}`} onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={16} />Add Category</button></div>}
        description="Home  ›  Product Management  ›  Category Management"
        title="Product Management"
      />

      <section aria-label="Category overview" className={styles.statsGrid}>
        <Card className={styles.statCard}><span className={styles.statIcon}><FolderTree size={22} /></span><div><h2>{records.length}</h2><p>Total Categories</p></div></Card>
        <Card className={styles.statCard}><span className={styles.statIcon}><Layers3 size={22} /></span><div><h2>{totalSubCategories}</h2><p>Total Sub Categories</p></div></Card>
        <Card className={styles.statCard}><span className={styles.statIcon}><Package size={22} /></span><div><h2>{totalProducts}</h2><p>Total Products</p></div></Card>
        <Card className={styles.statCard}><span className={styles.statIcon}><Ban size={22} /></span><div><h2>{inactive}</h2><p>Inactive Categories</p></div></Card>
      </section>

      <Card className={styles.listCard} id="sub-categories">
        <div className={styles.listHeading}><h2>Category List</h2></div>
        <div className={styles.toolbar}>
          <label className={styles.searchField}><Search size={16} /><span className="sr-only">Search categories</span><input onChange={(event) => { setQuery(event.target.value); resetList(); }} placeholder="Search category..." type="search" value={query} /></label>
          <label className={styles.selectField}><span className="sr-only">Filter categories by status</span><select onChange={(event) => { setStatus(event.target.value as StatusFilter); resetList(); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter categories by availability</span><select aria-label="Category availability" onChange={(event) => { setAvailability(event.target.value); resetList(); }} value={availability}><option>All Status</option><option>With Products</option><option>Empty</option></select></label>
          <div className={styles.headerActions}><button className="button" onClick={() => { downloadCategories(filtered); setMessage(`Exported ${filtered.length} categories.`); }} type="button"><Download size={15} />Export</button></div>
        </div>
        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Product category list</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Category Name</th><th scope="col">Description</th><th scope="col">Sub Categories</th><th scope="col">Products</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((category, index) => (
                <tr key={category.id}>
                  <td>{first + index}</td><td><strong>{category.name}</strong></td><td>{category.description}</td><td>{category.subCategories}</td><td>{category.products}</td>
                  <td><span className={`${styles.status} ${category.status === "Active" ? styles.active : styles.inactive}`}>{category.status}</span></td>
                  <td className={styles.actionCell}><div className={styles.actions}><button aria-label={`View ${category.name}`} className={styles.actionButton} onClick={() => { setMessage(`${category.name}: ${category.products} products in ${category.subCategories} sub categories.`); setOpenMenu(null); }} title="View category" type="button"><Eye size={14} /></button><button aria-label={`Edit ${category.name}`} className={styles.actionButton} onClick={() => setEditor({ mode: "edit", category })} title="Edit category" type="button"><FilePenLine size={14} /></button><button aria-expanded={openMenu === category.id} aria-label={`More actions for ${category.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === category.id ? null : category.id)} type="button"><MoreHorizontal size={16} /></button></div>
                    {openMenu === category.id ? <div className={styles.menu} role="menu"><button onClick={() => setEditor({ mode: "edit", category })} role="menuitem" type="button"><FilePenLine size={14} />Edit category</button><button onClick={() => toggleStatus(category)} role="menuitem" type="button"><ToggleLeft size={14} />Mark {category.status === "Active" ? "inactive" : "active"}</button></div> : null}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.empty} colSpan={7}><Search size={20} />No categories match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.footer}><p>Showing {first} to {last} of {filtered.length} entries</p><div className={styles.footerControls}><nav aria-label="Category pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">‹</button>{paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span className={styles.ellipsis} key={`ellipsis-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">›</button></nav><select aria-label="Rows per page" className={styles.pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); resetList(); }} value={pageSize}><option value="10">10 / page</option><option value="20">20 / page</option><option value="50">50 / page</option></select></div></footer>
      </Card>

      {editor ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}><Card aria-labelledby="category-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="category-editor-title">{editor.mode === "edit" ? "Edit Category" : "Add Category"}</h2><p>Keep category information organized for your catalogue.</p></div><button aria-label="Close category form" className={styles.closeButton} onClick={() => setEditor(null)} type="button"><X size={18} /></button></div><form className={styles.modalForm} onSubmit={saveCategory}><input name="id" type="hidden" value={editor.mode === "edit" ? editor.category.id : ""} /><label><span>Category name</span><input autoFocus className="field" defaultValue={editor.mode === "edit" ? editor.category.name : ""} name="name" placeholder="e.g. Necklace" required /></label><label><span>Description</span><input className="field" defaultValue={editor.mode === "edit" ? editor.category.description : ""} name="description" placeholder="Short description" required /></label><div className={styles.formGrid}><label><span>Sub categories</span><input className="field" defaultValue={editor.mode === "edit" ? editor.category.subCategories : 0} min="0" name="subCategories" required type="number" /></label><label><span>Products</span><input className="field" defaultValue={editor.mode === "edit" ? editor.category.products : 0} min="0" name="products" required type="number" /></label></div><label><span>Status</span><select className="select" defaultValue={editor.mode === "edit" ? editor.category.status : "Active"} name="status"><option>Active</option><option>Inactive</option></select></label><div className={styles.modalActions}><button className="button" onClick={() => setEditor(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} type="submit">{editor.mode === "edit" ? <FilePenLine size={15} /> : <Plus size={15} />}{editor.mode === "edit" ? "Save Changes" : "Add Category"}</button></div></form></Card></div> : null}
    </div>
  );
}
