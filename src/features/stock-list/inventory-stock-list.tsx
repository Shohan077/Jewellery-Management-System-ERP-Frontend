"use client";

import { Boxes, Eye, MoreHorizontal, PackagePlus, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { stockListItems, type StockListItem, type StockListStatus } from "./stock-list-data";
import styles from "../management-lists/table-list.module.css";

const categoryOptions = ["All Categories", "Gold Jewellery", "Diamond Jewellery", "Silver Jewellery"] as const;
const statusOptions = ["All Status", "In Stock", "Low Stock", "Out of Stock"] as const;

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

const statusClass: Record<StockListStatus, string> = {
  "In Stock": styles.inStock,
  "Low Stock": styles.lowStock,
  "Out of Stock": styles.outOfStock,
};

export function InventoryStockList() {
  const [records, setRecords] = useState<StockListItem[]>(stockListItems);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("All Categories");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All Status");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("1");
  const [quantityToAdd, setQuantityToAdd] = useState("1");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return records.filter((item) => {
      const matchesQuery = !search || item.code.toLowerCase().includes(search) || item.name.toLowerCase().includes(search);
      const matchesCategory = category === "All Categories" || item.category === category;
      const matchesStatus = status === "All Status" || item.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, deferredQuery, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const first = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const last = Math.min(safePage * pageSize, filtered.length);

  function openStockDialog(itemId?: number) {
    setSelectedItemId(String(itemId ?? records[0].id));
    setQuantityToAdd("1");
    setOpenMenu(null);
    setModalOpen(true);
  }

  function addStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(selectedItemId);
    const added = Math.max(0, Number.parseFloat(quantityToAdd) || 0);
    const selected = records.find((item) => item.id === id);
    setRecords((current) => current.map((item) => {
      if (item.id !== id) return item;
      const quantity = item.quantity + added;
      return { ...item, quantity, status: quantity <= 0 ? "Out of Stock" : quantity <= 3 ? "Low Stock" : "In Stock" };
    }));
    setModalOpen(false);
    setMessage(`${added.toFixed(3)} ${selected?.unit ?? "units"} added to ${selected?.name ?? "stock"}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader description="View and manage your current stock" title="Inventory Stock List" />
      <div className={styles.toolbar}>
        <select aria-label="Filter stock by category" className="select" onChange={(event) => { setCategory(event.target.value as typeof category); setCurrentPage(1); }} value={category}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <select aria-label="Filter stock by status" className="select" onChange={(event) => { setStatus(event.target.value as typeof status); setCurrentPage(1); }} value={status}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <label className={styles.search}><Search size={17} /><span className="sr-only">Search inventory stock</span><input onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search item name or code..." type="search" value={query} /></label>
        <button className={`button ${styles.addButton}`} onClick={() => openStockDialog()} type="button"><Plus size={17} />Add Stock</button>
      </div>
      <Card className={styles.card}>
        <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Inventory stock list</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Item Code</th><th scope="col">Item Name</th><th scope="col">Category</th><th scope="col">Purity</th><th scope="col">Stock Qty</th><th scope="col">Unit</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id}>
                  <td>{first + index}</td><td className={styles.code}>{item.code}</td><td><strong>{item.name}</strong></td><td>{item.category}</td><td>{item.purity}</td><td>{item.quantity.toFixed(3)}</td><td>{item.unit}</td><td><span className={`${styles.status} ${statusClass[item.status]}`}>{item.status}</span></td>
                  <td className={styles.actionCell}>
                    <button aria-expanded={openMenu === item.id} aria-label={`Actions for ${item.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === item.id ? null : item.id)} type="button"><MoreHorizontal size={18} /></button>
                    {openMenu === item.id ? <div className={styles.menu} role="menu"><button onClick={() => { setMessage(`${item.name}: ${item.quantity.toFixed(3)} ${item.unit} available.`); setOpenMenu(null); }} role="menuitem" type="button"><Eye size={14} />View stock</button><button onClick={() => openStockDialog(item.id)} role="menuitem" type="button"><PackagePlus size={14} />Adjust stock</button></div> : null}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.empty} colSpan={9}><Boxes size={22} /> No stock items match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      <footer className={styles.footer}>
        <p>Showing {first} to {last} of {filtered.length} records</p>
        <div className={styles.footerControls}>
          <nav aria-label="Stock list pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">«</button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span className={styles.ellipsis} key={`e-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">»</button>
          </nav>
          <select aria-label="Rows per page" className={styles.pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} value={pageSize}><option value="10">10 / page</option><option value="20">20 / page</option><option value="50">50 / page</option></select>
        </div>
      </footer>

      {modalOpen ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><Card aria-labelledby="add-stock-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="add-stock-title">Add Stock</h2><p>Increase the on-hand quantity for an inventory item.</p></div><button aria-label="Close add stock dialog" className={styles.closeButton} onClick={() => setModalOpen(false)} type="button"><X size={19} /></button></div><form className={styles.modalForm} onSubmit={addStock}><label><span>Item</span><select className="select" onChange={(event) => setSelectedItemId(event.target.value)} value={selectedItemId}>{records.slice(0, 20).map((item) => <option key={item.id} value={item.id}>{item.code} — {item.name}</option>)}</select></label><label><span>Quantity to add</span><input className="field" min="0.001" onChange={(event) => setQuantityToAdd(event.target.value)} required step="0.001" type="number" value={quantityToAdd} /></label><div className={styles.modalActions}><button className="button" onClick={() => setModalOpen(false)} type="button">Cancel</button><button className={`button ${styles.addButton}`} type="submit"><SlidersHorizontal size={15} />Update Stock</button></div></form></Card></div> : null}
    </div>
  );
}
