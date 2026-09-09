"use client";

import Link from "next/link";
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
  Plus,
  Search,
  Sparkles,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  formatCurrency,
  productCategories,
  products,
  type ProductKind,
  type ProductRecord,
  type ProductStatus,
} from "./product-data";
import styles from "./product-list.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;
type StatusFilter = (typeof statusOptions)[number];

const productIcons: Record<ProductKind, LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  earring: Sparkles,
  bracelet: CircleDashed,
  pendant: Medal,
  bangle: Circle,
  chain: Link2,
  "nose-pin": Sparkles,
};

function paginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) {
    return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadProducts(records: ProductRecord[]) {
  const header = ["Product", "Code / SKU", "Category", "Gold / Purity", "Weight (g)", "Selling Price", "Status"];
  const rows = records.map((product) => [
    product.name,
    product.code,
    product.category,
    product.purity,
    product.weight.toFixed(2),
    String(product.sellingPrice),
    product.status,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "jewellery-products.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function ProductThumbnail({ product }: { product: ProductRecord }) {
  const Icon = productIcons[product.kind];
  const diamond = product.name.toLowerCase().includes("diamond");

  return (
    <span className={`${styles.thumbnail} ${diamond ? styles.diamondThumbnail : ""}`}>
      <Icon aria-hidden="true" size={24} strokeWidth={1.35} />
    </span>
  );
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>
      {status}
    </span>
  );
}

export function ProductList() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [activityMessage, setActivityMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        searchTerm.length === 0 ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);
      const matchesCategory = category === "All Categories" || product.category === category;
      const matchesStatus = status === "All Status" || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, deferredQuery, status]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageRows = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstVisible = filteredProducts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredProducts.length);
  const allPageRowsSelected = pageRows.length > 0 && pageRows.every((product) => selected.has(product.id));

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    setCurrentPage(1);
    setSelected(new Set());
  }

  function changeStatus(nextStatus: StatusFilter) {
    setStatus(nextStatus);
    setCurrentPage(1);
    setSelected(new Set());
  }

  function togglePageSelection() {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allPageRowsSelected) {
        for (const product of pageRows) next.delete(product.id);
      } else {
        for (const product of pageRows) next.add(product.id);
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

  function showRowAction(action: string, product: ProductRecord) {
    setActivityMessage(`${action}: ${product.name} (${product.code})`);
  }

  function exportFilteredProducts() {
    downloadProducts(filteredProducts);
    setActivityMessage(`Exported ${filteredProducts.length.toLocaleString("en-US")} products to CSV.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <input
              accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className={styles.hiddenInput}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setActivityMessage(`${file.name} is ready to import.`);
                event.currentTarget.value = "";
              }}
              ref={importInputRef}
              type="file"
            />
            <button className="button" onClick={() => importInputRef.current?.click()} type="button">
              <Upload aria-hidden="true" size={16} />
              Import
            </button>
            <button className="button" onClick={exportFilteredProducts} type="button">
              <Download aria-hidden="true" size={16} />
              Export
            </button>
            <Link className="button button--primary" href="/products/new">
              <Plus aria-hidden="true" size={17} />
              Add Product
            </Link>
          </div>
        )}
        description="View and manage all jewellery products"
        title="Products"
      />

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search products</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
                setSelected(new Set());
              }}
              placeholder="Search by name, code, category..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by category</span>
            <select onChange={(event) => changeCategory(event.target.value)} value={category}>
              <option>All Categories</option>
              {productCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by status</span>
            <select onChange={(event) => changeStatus(event.target.value as StatusFilter)} value={status}>
              {statusOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            className={`button ${styles.filterButton}`}
            onClick={() => setActivityMessage(`${filteredProducts.length.toLocaleString("en-US")} products match the current filters.`)}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Jewellery product inventory</caption>
            <thead>
              <tr>
                <th className={styles.checkboxCell} scope="col">
                  <input
                    aria-label="Select all products on this page"
                    checked={allPageRowsSelected}
                    onChange={togglePageSelection}
                    type="checkbox"
                  />
                </th>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Product</th>
                <th scope="col">Code / SKU</th>
                <th scope="col">Category</th>
                <th scope="col">Gold / Purity</th>
                <th scope="col">Weight</th>
                <th scope="col">Selling</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((product, index) => (
                <tr className={selected.has(product.id) ? styles.selectedRow : ""} key={product.id}>
                  <td className={styles.checkboxCell}>
                    <input
                      aria-label={`Select ${product.name}`}
                      checked={selected.has(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td><ProductThumbnail product={product} /></td>
                  <td><strong className={styles.productName}>{product.name}</strong></td>
                  <td><button className={styles.codeButton} onClick={() => showRowAction("Viewing", product)} type="button">{product.code}</button></td>
                  <td>{product.category}</td>
                  <td>{product.purity}</td>
                  <td className={styles.numberCell}>{product.weight.toFixed(2)} g</td>
                  <td className={`${styles.numberCell} ${styles.price}`}>{formatCurrency(product.sellingPrice)}</td>
                  <td><ProductStatusBadge status={product.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`View ${product.name}`} onClick={() => showRowAction("Viewing", product)} title="View product" type="button"><Eye size={15} /></button>
                      <button aria-label={`Edit ${product.name}`} onClick={() => showRowAction("Editing", product)} title="Edit product" type="button"><FilePenLine size={15} /></button>
                      <button aria-label={`Adjust stock for ${product.name}`} onClick={() => showRowAction("Adjusting stock for", product)} title="Adjust stock" type="button"><Plus size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={11}>
                    <Search aria-hidden="true" size={25} />
                    <strong>No products found</strong>
                    <span>Try a different search, category, or status.</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>
            Showing {firstVisible} to {lastVisible} of {filteredProducts.length.toLocaleString("en-US")} products
            {selected.size > 0 ? <span> · {selected.size} selected</span> : null}
          </p>
          <nav aria-label="Product list pagination" className={styles.pagination}>
            <button
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
            >
              <ChevronLeft size={17} />
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
            <button
              aria-label="Next page"
              disabled={safePage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              type="button"
            >
              <ChevronRight size={17} />
            </button>
          </nav>
        </footer>
      </Card>
    </div>
  );
}
