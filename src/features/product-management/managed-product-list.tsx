"use client";

import { Eye, FilePenLine, MoreHorizontal, PackageSearch, Plus, Search, ToggleLeft, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { managedProducts, type ManagedProduct, type ManagedProductStatus } from "./managed-product-data";
import styles from "../management-lists/table-list.module.css";

const categoryOptions = ["All Categories", "Chain", "Ring", "Pendant", "Bangle", "Nose Pin", "Bracelet", "Earring", "Set", "Anklet", "Locket"] as const;
const statusOptions = ["All Status", "Active", "Inactive"] as const;

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function ManagedProductList() {
  const [records, setRecords] = useState<ManagedProduct[]>(managedProducts);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All Status");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((product) => {
      const matchesQuery = !search || product.code.toLowerCase().includes(search) || product.name.toLowerCase().includes(search);
      const matchesCategory = category === "All Categories" || product.category === category;
      const matchesStatus = status === "All Status" || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, deferredQuery, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const first = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const last = Math.min(safePage * pageSize, filtered.length);

  function toggleStatus(product: ManagedProduct) {
    const nextStatus: ManagedProductStatus = product.status === "Active" ? "Inactive" : "Active";
    setRecords((current) => current.map((item) => item.id === product.id ? { ...item, status: nextStatus } : item));
    setOpenMenu(null);
    setMessage(`${product.name} marked ${nextStatus.toLowerCase()}.`);
  }

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const nextId = records.reduce((largest, product) => Math.max(largest, product.id), 0) + 1;
    const record: ManagedProduct = {
      id: nextId,
      code: String(form.get("code") ?? "").trim(),
      name,
      category: String(form.get("category") ?? "Chain"),
      metalType: String(form.get("metalType") ?? "Gold") as ManagedProduct["metalType"],
      purity: String(form.get("purity") ?? "22K"),
      weight: Number(form.get("weight")),
      salesPrice: Number(form.get("salesPrice")),
      status: "Active",
    };
    setRecords((current) => [record, ...current]);
    setQuery(""); setCategory("All Categories"); setStatus("All Status"); setCurrentPage(1); setModalOpen(false);
    setMessage(`${name} added as ${record.code}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader description="View and manage all jewellery products" title="Product List" />
      <div className={styles.toolbar}>
        <select aria-label="Filter products by category" className="select" onChange={(event) => { setCategory(event.target.value); setCurrentPage(1); }} value={category}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <select aria-label="Filter products by status" className="select" onChange={(event) => { setStatus(event.target.value as typeof status); setCurrentPage(1); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <label className={styles.search}><Search size={17} /><span className="sr-only">Search managed products</span><input onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search product name or code..." type="search" value={query} /></label>
        <button className={`button ${styles.addButton}`} onClick={() => setModalOpen(true)} type="button"><Plus size={17} />Add Product</button>
      </div>
      <Card className={styles.card}>
        <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Managed jewellery products</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Product Code</th><th scope="col">Product Name</th><th scope="col">Category</th><th scope="col">Metal Type</th><th scope="col">Purity</th><th scope="col">Weight (g)</th><th scope="col">Sales Price (৳)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((product, index) => (
                <tr key={product.id}>
                  <td>{first + index}</td><td className={styles.code}>{product.code}</td><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{product.metalType}</td><td>{product.purity}</td><td>{product.weight.toFixed(3)}</td><td className={styles.amount}>{product.salesPrice.toLocaleString("en-IN")}</td><td><span className={`${styles.status} ${product.status === "Active" ? styles.active : styles.inactive}`}>{product.status}</span></td>
                  <td className={styles.actionCell}>
                    <button aria-expanded={openMenu === product.id} aria-label={`Actions for ${product.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === product.id ? null : product.id)} type="button"><MoreHorizontal size={18} /></button>
                    {openMenu === product.id ? <div className={styles.menu} role="menu"><button onClick={() => { setMessage(`Viewing ${product.code}: ${product.name}.`); setOpenMenu(null); }} role="menuitem" type="button"><Eye size={14} />View product</button><button onClick={() => { setMessage(`Editing tools opened for ${product.name}.`); setOpenMenu(null); }} role="menuitem" type="button"><FilePenLine size={14} />Edit product</button><button onClick={() => toggleStatus(product)} role="menuitem" type="button"><ToggleLeft size={14} />Mark {product.status === "Active" ? "inactive" : "active"}</button></div> : null}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.empty} colSpan={10}><PackageSearch size={22} /> No products match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      <footer className={styles.footer}><p>Showing {first} to {last} of {filtered.length} records</p><div className={styles.footerControls}><nav aria-label="Product pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">«</button>{paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span className={styles.ellipsis} key={`e-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">»</button></nav><select aria-label="Rows per page" className={styles.pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} value={pageSize}><option value="10">10 / page</option><option value="20">20 / page</option><option value="50">50 / page</option></select></div></footer>

      {modalOpen ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><Card aria-labelledby="add-managed-product-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="add-managed-product-title">Add Product</h2><p>Create a product in the managed catalogue.</p></div><button aria-label="Close add product dialog" className={styles.closeButton} onClick={() => setModalOpen(false)} type="button"><X size={19} /></button></div><form className={styles.modalForm} onSubmit={addProduct}><label><span>Product Code</span><input className="field" defaultValue={`PRD-${String(records.length + 1).padStart(3, "0")}`} name="code" required /></label><label><span>Product Name</span><input autoFocus className="field" name="name" placeholder="Enter product name" required /></label><label><span>Category</span><select className="select" name="category">{categoryOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Metal Type</span><select className="select" name="metalType"><option>Gold</option><option>Silver</option><option>Diamond</option></select></label><label><span>Purity</span><select className="select" name="purity"><option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>925</option></select></label><label><span>Weight (g)</span><input className="field" min="0.001" name="weight" required step="0.001" type="number" /></label><label><span>Sales Price (৳)</span><input className="field" min="1" name="salesPrice" required step="1" type="number" /></label><div className={styles.modalActions}><button className="button" onClick={() => setModalOpen(false)} type="button">Cancel</button><button className={`button ${styles.addButton}`} type="submit"><Plus size={15} />Add Product</button></div></form></Card></div> : null}
    </div>
  );
}
