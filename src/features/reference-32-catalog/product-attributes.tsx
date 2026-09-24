"use client";

import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Plus,
  Search,
  ToggleLeft,
  X,
  Layers3,
  SlidersHorizontal,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { attributeGroups as initialGroups, attributeRecords as initialRecords, type AttributeRecord } from "./reference-32-data";
import styles from "./reference-32-catalog.module.css";

const PAGE_SIZE = 10;

type Group = { name: string; count: number };
type EditorState = { mode: "add" } | { mode: "edit"; record: AttributeRecord } | null;

function pages(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
}

function AttributeEditor({
  editor,
  groups,
  nextId,
  onClose,
  onSubmit,
}: {
  editor: Exclude<EditorState, null>;
  groups: Group[];
  nextId: number;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const record = editor.mode === "edit" ? editor.record : undefined;
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="attribute-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <div className={styles.modalHeader}>
          <div><h2 id="attribute-editor-title">{record ? "Edit Attribute" : "Add Attribute"}</h2><p>{record ? `Update ${record.name}.` : "Create a reusable product attribute."}</p></div>
          <button aria-label="Close attribute editor" className={styles.close} onClick={onClose} type="button"><X size={18} /></button>
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <input name="id" type="hidden" value={record?.id ?? ""} />
          <label><span>Attribute Name <b>*</b></span><input autoFocus className="field" defaultValue={record?.name ?? ""} name="name" placeholder="e.g. Metal Type" required /></label>
          <label><span>Attribute Group <b>*</b></span><select className="select" defaultValue={record?.group ?? groups[0]?.name} name="group">{groups.map((group) => <option key={group.name}>{group.name}</option>)}</select></label>
          <label><span>Input Type</span><select className="select" defaultValue={record?.inputType ?? "Dropdown"} name="inputType"><option>Dropdown</option><option>Number</option><option>Text</option><option>Yes / No</option></select></label>
          <label><span>Status</span><select className="select" defaultValue={record?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input defaultChecked={record?.required ?? false} name="required" type="checkbox" /> <span>Required attribute</span></label>
          <div className={styles.formActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus size={15} />{record ? "Save Changes" : `Add Attribute ${nextId}`}</button></div>
        </form>
      </Card>
    </div>
  );
}

function GroupEditor({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="group-editor-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <div className={styles.modalHeader}><div><h2 id="group-editor-title">Add Attribute Group</h2><p>Organize attributes for quick product entry.</p></div><button aria-label="Close group editor" className={styles.close} onClick={onClose} type="button"><X size={18} /></button></div>
        <form className={styles.form} onSubmit={onSubmit}><label><span>Group Name <b>*</b></span><input autoFocus className="field" name="name" placeholder="e.g. Material" required /></label><div className={styles.formActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus size={15} />Add Group</button></div></form>
      </Card>
    </div>
  );
}

export function ProductAttributes() {
  const [records, setRecords] = useState<AttributeRecord[]>(initialRecords);
  const [groups, setGroups] = useState<Group[]>(initialGroups.map((item) => ({ ...item })));
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [currentPage, setCurrentPage] = useState(1);
  const [editor, setEditor] = useState<EditorState>(null);
  const [groupEditor, setGroupEditor] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    return records.filter((record) => {
      const matchesTerm = !term || record.name.toLowerCase().includes(term) || record.group.toLowerCase().includes(term) || record.inputType.toLowerCase().includes(term);
      const matchesGroup = groupFilter === "All Groups" || record.group === groupFilter;
      return matchesTerm && matchesGroup;
    });
  }, [deferredQuery, groupFilter, records]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);
  const activeCount = records.filter((record) => record.status === "Active").length;

  function resetList() { setCurrentPage(1); }
  function saveAttribute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = Number(data.get("id"));
    const record: AttributeRecord = {
      id: id || records.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name: String(data.get("name") ?? "").trim(),
      group: String(data.get("group") ?? "General"),
      inputType: String(data.get("inputType") ?? "Dropdown") as AttributeRecord["inputType"],
      required: data.get("required") === "on",
      status: String(data.get("status") ?? "Active") as AttributeRecord["status"],
    };
    setRecords((current) => id ? current.map((item) => item.id === id ? record : item) : [record, ...current]);
    setEditor(null); resetList(); setMessage(`${record.name} ${id ? "updated" : "added"} successfully.`);
  }
  function addGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!name) return;
    if (groups.some((group) => group.name.toLowerCase() === name.toLowerCase())) { setMessage(`${name} already exists.`); setGroupEditor(false); return; }
    setGroups((current) => [...current, { name, count: 0 }]); setGroupEditor(false); setMessage(`${name} group added.`);
  }
  function toggleStatus(record: AttributeRecord) {
    const status = record.status === "Active" ? "Inactive" : "Active";
    setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status } : item));
    setMessage(`${record.name} marked ${status.toLowerCase()}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader action={<div className={styles.headerActions}><button className="button button--primary" onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={16} />Add Attribute</button></div>} description="Manage reusable product attributes" title="Product Management" />
      {message ? <p aria-live="polite" className={styles.message}>{message}</p> : null}
      <div className={styles.stats}>
        <Card className={styles.stat}><span className={styles.statIcon}><SlidersHorizontal size={19} /></span><div><strong>{records.length}</strong><span>Total Attributes</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><Layers3 size={19} /></span><div><strong>{groups.length}</strong><span>Attribute Groups</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><CircleCheck size={20} /></span><div><strong>{activeCount}</strong><span>Active Attributes</span></div></Card>
        <Card className={styles.stat}><span className={styles.statIcon}><CircleX size={20} /></span><div><strong>{records.length - activeCount}</strong><span>Inactive Attributes</span></div></Card>
      </div>
      <div className={styles.contentSplit}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}><h2>Attribute Groups</h2><button className="button button--primary" onClick={() => setGroupEditor(true)} type="button"><Plus size={14} />Add Group</button></div>
          <div className={styles.groupList}>
            <button className={`${styles.groupButton} ${groupFilter === "All Groups" ? styles.groupButtonActive : ""}`} onClick={() => { setGroupFilter("All Groups"); resetList(); }} type="button"><span><strong>All Groups</strong><small>{records.length} attributes</small></span><span>›</span></button>
            {groups.map((group) => <button className={`${styles.groupButton} ${groupFilter === group.name ? styles.groupButtonActive : ""}`} key={group.name} onClick={() => { setGroupFilter(group.name); resetList(); }} type="button"><span><strong>{group.name}</strong><small>{group.count || records.filter((item) => item.group === group.name).length} attributes</small></span><span>›</span></button>)}
          </div>
        </Card>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}><h2>Attributes List</h2></div>
          <div className={styles.toolbar}>
            <label className={styles.searchField}><Search size={15} /><span className="sr-only">Search attributes</span><input onChange={(event) => { setQuery(event.target.value); resetList(); }} placeholder="Search attribute..." type="search" value={query} /></label>
            <label className={styles.selectField}><span className="sr-only">Filter by group</span><select onChange={(event) => { setGroupFilter(event.target.value); resetList(); }} value={groupFilter}><option>All Groups</option>{groups.map((group) => <option key={group.name}>{group.name}</option>)}</select></label>
            <button className="button" onClick={() => setMessage(`${filtered.length} attributes match your filters.`)} type="button"><Filter size={14} />Filter</button>
          </div>
          <div className={styles.tableScroller}><table className={styles.table}><caption className="sr-only">Product attributes</caption><thead><tr><th className={styles.number}>#</th><th>Attribute Name</th><th>Group</th><th>Input Type</th><th>Required</th><th>Status</th><th>Action</th></tr></thead><tbody>
            {rows.map((record, index) => <tr key={record.id}><td className={styles.number}>{first + index}</td><td><strong>{record.name}</strong></td><td>{record.group}</td><td className={styles.type}>{record.inputType}</td><td className={record.required ? styles.required : styles.optional}>{record.required ? "Yes" : "No"}</td><td><span className={`${styles.status} ${record.status === "Active" ? styles.active : styles.inactive}`}>{record.status}</span></td><td><div className={styles.rowActions}><button aria-label={`Edit ${record.name}`} className={styles.iconButton} onClick={() => setEditor({ mode: "edit", record })} title="Edit" type="button"><Edit3 size={14} /></button><button aria-label={`Toggle ${record.name}`} className={styles.iconButton} onClick={() => toggleStatus(record)} title="Toggle status" type="button"><ToggleLeft size={15} /></button></div></td></tr>)}
            {!rows.length ? <tr><td className={styles.empty} colSpan={7}>No attributes match the current filters.</td></tr> : null}
          </tbody></table></div>
          <footer className={styles.tableFooter}><p>Showing {first} to {last} of {filtered.length} entries</p><nav aria-label="Attribute pagination" className={styles.pagination}><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft size={15} /></button>{pages(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span key={`dots-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.current : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}<button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight size={15} /></button></nav></footer>
        </Card>
      </div>
      {editor ? <AttributeEditor editor={editor} groups={groups} nextId={records.length + 1} onClose={() => setEditor(null)} onSubmit={saveAttribute} /> : null}
      {groupEditor ? <GroupEditor onClose={() => setGroupEditor(false)} onSubmit={addGroup} /> : null}
    </div>
  );
}
