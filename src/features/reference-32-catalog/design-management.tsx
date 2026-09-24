"use client";

import {
  Archive,
  CircleDashed,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Edit3,
  Filter,
  Flower2,
  Gem,
  Heart,
  Link2,
  Plus,
  Search,
  Sparkles,
  ToggleLeft,
  X,
  type LucideIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { designCategories as initialCategories, designRecords as initialRecords, designStatusOptions, type DesignIcon, type DesignRecord, type DesignStatus } from "./reference-32-data";
import styles from "./reference-32-catalog.module.css";

const PAGE_SIZE = 8;
type Category = { name: string; count: number };
type EditorState = { mode: "add"; design?: never } | { mode: "edit"; design: DesignRecord } | null;

const icons: Record<DesignIcon, LucideIcon> = {
  necklace: Gem,
  ring: CircleDot,
  earring: Flower2,
  pendant: Heart,
  bracelet: CircleDashed,
  chain: Link2,
};

function pages(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
}

function DesignEditor({ editor, categories, nextCode, onClose, onSubmit }: { editor: Exclude<EditorState, null>; categories: Category[]; nextCode: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const design = editor.mode === "edit" ? editor.design : undefined;
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="design-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <div className={styles.modalHeader}><div><h2 id="design-editor-title">{design ? "Edit Design" : "Add Design"}</h2><p>{design ? `Update ${design.code} design details.` : "Add a new design to the gallery."}</p></div><button aria-label="Close design editor" className={styles.close} onClick={onClose} type="button"><X size={18} /></button></div>
        <form className={styles.form} onSubmit={onSubmit}>
          <input name="id" type="hidden" value={design?.id ?? ""} />
          <label><span>Design Name <b>*</b></span><input autoFocus className="field" defaultValue={design?.name ?? ""} name="name" placeholder="e.g. Royal Necklace" required /></label>
          <label><span>Design Code <b>*</b></span><input className="field" defaultValue={design?.code ?? nextCode} name="code" required /></label>
          <label><span>Design Category <b>*</b></span><select className="select" defaultValue={design?.category ?? categories[0]?.name} name="category">{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label>
          <label><span>Design Type</span><select className="select" defaultValue={design?.icon ?? "necklace"} name="icon"><option value="necklace">Necklace</option><option value="ring">Ring</option><option value="earring">Earring</option><option value="pendant">Pendant</option><option value="bracelet">Bracelet</option><option value="chain">Chain</option></select></label>
          <label><span>Status</span><select className="select" defaultValue={design?.status ?? "Active"} name="status"><option>Active</option><option>In Production</option><option>Archived</option></select></label>
          <div className={styles.formActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus size={15} />{design ? "Save Changes" : "Add Design"}</button></div>
        </form>
      </Card>
    </div>
  );
}

function CategoryEditor({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card aria-labelledby="design-category-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="design-category-title">Add Design Category</h2><p>Create a gallery category for new designs.</p></div><button aria-label="Close category editor" className={styles.close} onClick={onClose} type="button"><X size={18} /></button></div><form className={styles.form} onSubmit={onSubmit}><label><span>Category Name <b>*</b></span><input autoFocus className="field" name="name" placeholder="e.g. Vintage Designs" required /></label><div className={styles.formActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus size={15} />Add Category</button></div></form></Card></div>
  );
}

export function DesignManagement() {
  const [records, setRecords] = useState<DesignRecord[]>(initialRecords);
  const [categories, setCategories] = useState<Category[]>(initialCategories.map((item) => ({ ...item })));
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [status, setStatus] = useState<(typeof designStatusOptions)[number]>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [editor, setEditor] = useState<EditorState>(null);
  const [categoryEditor, setCategoryEditor] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    return records.filter((design) => {
      const matchesTerm = !term || design.name.toLowerCase().includes(term) || design.code.toLowerCase().includes(term) || design.category.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "All Categories" || design.category === categoryFilter;
      const matchesStatus = status === "All Status" || design.status === status;
      return matchesTerm && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, deferredQuery, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);
  const active = records.filter((record) => record.status === "Active").length;
  const production = records.filter((record) => record.status === "In Production").length;
  const archived = records.filter((record) => record.status === "Archived").length;

  function resetList() { setCurrentPage(1); }
  function saveDesign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = Number(data.get("id"));
    const design: DesignRecord = {
      id: id || records.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name: String(data.get("name") ?? "").trim(),
      code: String(data.get("code") ?? "").trim().toUpperCase(),
      category: String(data.get("category") ?? "Necklace Designs"),
      icon: String(data.get("icon") ?? "necklace") as DesignIcon,
      status: String(data.get("status") ?? "Active") as DesignStatus,
    };
    setRecords((current) => id ? current.map((item) => item.id === id ? design : item) : [design, ...current]);
    setEditor(null); resetList(); setMessage(`${design.name} ${id ? "updated" : "added"} successfully.`);
  }
  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!name) return;
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) { setMessage(`${name} already exists.`); setCategoryEditor(false); return; }
    setCategories((current) => [...current, { name, count: 0 }]); setCategoryEditor(false); setMessage(`${name} category added.`);
  }
  function toggleStatus(record: DesignRecord) {
    const next: DesignStatus = record.status === "Archived" ? "Active" : record.status === "Active" ? "Archived" : "Active";
    setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: next } : item)); setMessage(`${record.name} marked ${next.toLowerCase()}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader action={<div className={styles.headerActions}><button className="button button--primary" onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={16} />Add Design</button></div>} description="Manage jewellery design library" title="Product Management" />
      {message ? <p aria-live="polite" className={styles.message}>{message}</p> : null}
      <div className={styles.stats}>
        <Card className={styles.stat}><span className={styles.statIcon}><Gem size={19} /></span><div><strong>{records.length}</strong><span>Total Designs</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><CircleDot size={19} /></span><div><strong>{active}</strong><span>Active Designs</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><Sparkles size={19} /></span><div><strong>{production}</strong><span>In Production</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><Archive size={19} /></span><div><strong>{archived}</strong><span>Archived</span></div></Card>
      </div>
      <div className={`${styles.contentSplit} ${styles.designSplit}`}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}><h2>Design Categories</h2><button className="button button--primary" onClick={() => setCategoryEditor(true)} type="button"><Plus size={14} />Add Category</button></div>
          <div className={styles.groupList}>
            <button className={`${styles.groupButton} ${categoryFilter === "All Categories" ? styles.groupButtonActive : ""}`} onClick={() => { setCategoryFilter("All Categories"); resetList(); }} type="button"><span><strong>All Designs</strong><small>{records.length} designs</small></span><span>›</span></button>
            {categories.map((category) => <button className={`${styles.groupButton} ${categoryFilter === category.name ? styles.groupButtonActive : ""}`} key={category.name} onClick={() => { setCategoryFilter(category.name); resetList(); }} type="button"><span><strong>{category.name}</strong><small>{category.count || records.filter((item) => item.category === category.name).length} designs</small></span><span>›</span></button>)}
          </div>
        </Card>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}><h2>Design Gallery</h2></div>
          <div className={`${styles.toolbar} ${styles.galleryToolbar}`}>
            <label className={styles.searchField}><Search size={15} /><span className="sr-only">Search designs</span><input onChange={(event) => { setQuery(event.target.value); resetList(); }} placeholder="Search design..." type="search" value={query} /></label>
            <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => { setStatus(event.target.value as typeof status); resetList(); }} value={status}>{designStatusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <button className="button" onClick={() => setMessage(`${filtered.length} designs match your filters.`)} type="button"><Filter size={14} />Filter</button>
          </div>
          <div className={styles.gallery}>
            {rows.map((design) => { const Icon = icons[design.icon]; const statusClass = design.status === "Active" ? styles.active : design.status === "Archived" ? styles.inactive : styles.production; return <article className={styles.designCard} key={design.id}><div className={styles.designVisual}><Icon aria-hidden="true" size={68} strokeWidth={1.2} /></div><div className={styles.designDetails}><strong>{design.name}</strong><small>{design.code}</small><span className={`${styles.status} ${statusClass}`}>{design.status}</span><div className={styles.rowActions}><button aria-label={`Edit ${design.name}`} className={styles.iconButton} onClick={() => setEditor({ mode: "edit", design })} title="Edit design" type="button"><Edit3 size={13} /></button><button aria-label={`Toggle ${design.name}`} className={styles.iconButton} onClick={() => toggleStatus(design)} title="Toggle status" type="button"><ToggleLeft size={14} /></button></div></div></article>; })}
            {!rows.length ? <p className={styles.empty}>No designs match the current filters.</p> : null}
          </div>
          <footer className={styles.tableFooter}><p>Showing {first} to {last} of {filtered.length} designs</p><nav aria-label="Design pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft size={15} /></button>{pages(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span key={`dots-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.current : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight size={15} /></button></nav></footer>
        </Card>
      </div>
      {editor ? <DesignEditor categories={categories} editor={editor} nextCode={`DS-${String(records.length + 1).padStart(3, "0")}`} onClose={() => setEditor(null)} onSubmit={saveDesign} /> : null}
      {categoryEditor ? <CategoryEditor onClose={() => setCategoryEditor(false)} onSubmit={addCategory} /> : null}
    </div>
  );
}
