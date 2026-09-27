"use client";

import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserRoundMinus,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./karigar-management.module.css";

type KarigarStatus = "Active" | "Inactive" | "On Leave";
type KarigarSkill = "Gold Casting" | "Stone Setting" | "Polishing" | "Engraving";

type Karigar = {
  id: string;
  name: string;
  skill: KarigarSkill;
  phone: string;
  joined: string;
  status: KarigarStatus;
};

type EditorState = { mode: "add" } | { mode: "edit"; record: Karigar } | null;

const PAGE_SIZE = 8;
const skills: KarigarSkill[] = ["Gold Casting", "Stone Setting", "Polishing", "Engraving"];
const statuses: KarigarStatus[] = ["Active", "Inactive", "On Leave"];

const featuredKarigars: Karigar[] = [
  { id: "KRG-1001", name: "Ramesh Sharma", skill: "Gold Casting", phone: "9876543210", joined: "10 Jan 2022", status: "Active" },
  { id: "KRG-1002", name: "Suresh Patel", skill: "Stone Setting", phone: "9876543211", joined: "15 Feb 2022", status: "Active" },
  { id: "KRG-1003", name: "Mahesh Kumar", skill: "Polishing", phone: "9876543212", joined: "20 Mar 2022", status: "Active" },
  { id: "KRG-1004", name: "Gopal Mehta", skill: "Engraving", phone: "9876543213", joined: "05 Apr 2022", status: "On Leave" },
  { id: "KRG-1005", name: "Vijay Tiwari", skill: "Gold Casting", phone: "9876543214", joined: "18 Jun 2022", status: "Active" },
  { id: "KRG-1006", name: "Arjun Singh", skill: "Stone Setting", phone: "9876543215", joined: "22 Jul 2022", status: "Inactive" },
  { id: "KRG-1007", name: "Rohit Verma", skill: "Polishing", phone: "9876543216", joined: "12 Aug 2022", status: "Active" },
  { id: "KRG-1008", name: "Deepak Joshi", skill: "Engraving", phone: "9876543217", joined: "30 Sep 2022", status: "On Leave" },
];

const firstNames = ["Amit", "Nitin", "Rajesh", "Karan", "Vikas", "Sunil", "Manoj", "Pradeep", "Anil", "Dinesh", "Ajay", "Mukesh"];
const lastNames = ["Soni", "Shah", "Gupta", "Yadav", "Rana", "Chauhan", "Jain", "Mishra", "Pawar", "Desai", "Khatri", "Agarwal"];

const supportingKarigars: Karigar[] = Array.from({ length: 134 }, (_, index) => {
  const numericId = 1009 + index;
  const status: KarigarStatus = index < 107 ? "Active" : index < 126 ? "Inactive" : "On Leave";
  const day = String((index % 28) + 1).padStart(2, "0");
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index % 12];
  return {
    id: `KRG-${numericId}`,
    name: `${firstNames[index % firstNames.length]} ${lastNames[(index * 5) % lastNames.length]}`,
    skill: skills[index % skills.length],
    phone: String(9876543218 + index),
    joined: `${day} ${month} ${2022 + (index % 3)}`,
    status,
  };
});

const initialKarigars = [...featuredKarigars, ...supportingKarigars];

function statusClass(status: KarigarStatus) {
  if (status === "Active") return styles.active;
  if (status === "Inactive") return styles.inactive;
  return styles.leave;
}

function Metric({ icon, label, value, trend }: { icon: ReactNode; label: string; value: number; trend: string }) {
  return (
    <Card className={styles.metric}>
      <span className={styles.metricIcon}>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>↗ {trend} from last month</small>
      </div>
    </Card>
  );
}

function readForm(event: FormEvent<HTMLFormElement>, fallbackId: string): Karigar {
  const data = new FormData(event.currentTarget);
  return {
    id: String(data.get("id") || fallbackId).trim().toUpperCase(),
    name: String(data.get("name") || "").trim(),
    skill: String(data.get("skill") || skills[0]) as KarigarSkill,
    phone: String(data.get("phone") || "").trim(),
    joined: String(data.get("joined") || "").trim(),
    status: String(data.get("status") || statuses[0]) as KarigarStatus,
  };
}

function Editor({ state, onClose, onSave }: { state: NonNullable<EditorState>; onClose: () => void; onSave: (record: Karigar) => void }) {
  const current = state.mode === "edit" ? state.record : undefined;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(readForm(event, `KRG-${Date.now().toString().slice(-4)}`));
  }
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <Card aria-labelledby="karigar-editor-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2 id="karigar-editor-title">{state.mode === "add" ? "Add Karigar" : "Edit Karigar"}</h2><p>Maintain the craftsman profile and availability.</p></div>
          <button aria-label="Close" onClick={onClose} type="button"><X size={18} /></button>
        </header>
        <form className={styles.form} onSubmit={submit}>
          <label><span>Karigar ID</span><input className="field" defaultValue={current?.id} name="id" placeholder="KRG-1143" readOnly={state.mode === "edit"} required /></label>
          <label><span>Name</span><input autoFocus className="field" defaultValue={current?.name} name="name" placeholder="Enter full name" required /></label>
          <label><span>Skill Type</span><select className="select" defaultValue={current?.skill ?? skills[0]} name="skill">{skills.map((skill) => <option key={skill}>{skill}</option>)}</select></label>
          <label><span>Phone</span><input className="field" defaultValue={current?.phone} inputMode="tel" name="phone" pattern="[0-9]{10}" placeholder="9876543210" required /></label>
          <label><span>Join Date</span><input className="field" defaultValue={current?.joined ?? "25 Sep 2026"} name="joined" required /></label>
          <label><span>Status</span><select className="select" defaultValue={current?.status ?? "Active"} name="status">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">{state.mode === "add" ? "Add Karigar" : "Save Changes"}</button></div>
        </form>
      </Card>
    </div>
  );
}

export function KarigarManagement182() {
  const [records, setRecords] = useState(initialKarigars);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleting, setDeleting] = useState<Karigar | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesText = !term || [record.id, record.name, record.phone, record.skill].some((value) => value.toLowerCase().includes(term));
      return matchesText && (skill === "All" || record.skill === skill) && (status === "All" || record.status === status);
    });
  }, [query, records, skill, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const start = (activePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const counts = useMemo(() => ({
    total: records.length,
    active: records.filter((item) => item.status === "Active").length,
    inactive: records.filter((item) => item.status === "Inactive").length,
    leave: records.filter((item) => item.status === "On Leave").length,
  }), [records]);

  function reset() {
    setQuery("");
    setSkill("All");
    setStatus("All");
    setPage(1);
    setMessage("Filters reset.");
  }

  function save(record: Karigar) {
    if (editor?.mode === "edit") {
      setRecords((current) => current.map((item) => item.id === editor.record.id ? record : item));
      setMessage(`${record.name} was updated.`);
    } else {
      setRecords((current) => [record, ...current]);
      setPage(1);
      setMessage(`${record.name} was added.`);
    }
    setEditor(null);
  }

  function remove() {
    if (!deleting) return;
    setRecords((current) => current.filter((item) => item.id !== deleting.id));
    setMessage(`${deleting.name} was removed.`);
    setDeleting(null);
  }

  const pageButtons = Array.from(new Set([1, activePage > 2 ? activePage - 1 : 2, activePage, activePage < pageCount - 1 ? activePage + 1 : pageCount - 1, pageCount])).filter((number) => number > 0 && number <= pageCount).sort((a, b) => a - b);

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.primary}`} onClick={() => setEditor({ mode: "add" })} type="button"><Plus size={16} />Add Karigar</button>}
        description="Home  ›  Karigar Management"
        title="Karigar Management"
      />
      {message ? <p className={styles.notice} role="status">{message}</p> : null}

      <section className={styles.metrics}>
        <Metric icon={<UsersRound size={22} />} label="Total Karigar" trend="10.4%" value={counts.total} />
        <Metric icon={<UserCheck size={22} />} label="Active Karigar" trend="9.8%" value={counts.active} />
        <Metric icon={<UserRoundMinus size={22} />} label="Inactive Karigar" trend="5.3%" value={counts.inactive} />
        <Metric icon={<BriefcaseBusiness size={22} />} label="On Leave" trend="11.1%" value={counts.leave} />
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.search}><Search size={15} /><span className="sr-only">Search karigars</span><input onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search karigar by name or ID..." type="search" value={query} /></label>
          <label className={styles.filterField}><span>Skill Type</span><select onChange={(event) => { setSkill(event.target.value); setPage(1); }} value={skill}><option value="All">All</option>{skills.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={styles.filterField}><span>Status</span><select onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option value="All">All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className={`button ${styles.primary}`} onClick={() => setMessage(`${filtered.length} matching karigars found.`)} type="button"><Filter size={15} />Filter</button>
          <button className="button" onClick={reset} type="button">Reset</button>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>Karigar ID</th><th>Name</th><th>Skill Type</th><th>Phone</th><th>Join Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td><td>{record.name}</td><td>{record.skill}</td><td>{record.phone}</td><td>{record.joined}</td>
                  <td><span className={`${styles.status} ${statusClass(record.status)}`}>{record.status}</span></td>
                  <td><div className={styles.actions}><button aria-label={`Edit ${record.name}`} onClick={() => setEditor({ mode: "edit", record })} type="button"><Pencil size={14} /></button><button aria-label={`Delete ${record.name}`} onClick={() => setDeleting(record)} type="button"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
              {!rows.length ? <tr><td className={styles.empty} colSpan={7}>No matching karigars. <button className="button" onClick={reset} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.footer}>
          <span>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
          <nav aria-label="Karigar pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage(Math.max(1, activePage - 1))} type="button"><ChevronLeft size={15} /></button>
            {pageButtons.map((number, index) => <span className={styles.pageGroup} key={number}>{index > 0 && number - pageButtons[index - 1] > 1 ? <i>…</i> : null}<button aria-current={number === activePage ? "page" : undefined} className={number === activePage ? styles.currentPage : ""} onClick={() => setPage(number)} type="button">{number}</button></span>)}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage(Math.min(pageCount, activePage + 1))} type="button"><ChevronRight size={15} /></button>
          </nav>
        </footer>
      </Card>

      {editor ? <Editor key={editor.mode === "edit" ? editor.record.id : "add"} onClose={() => setEditor(null)} onSave={save} state={editor} /> : null}
      {deleting ? <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && setDeleting(null)} role="presentation"><Card aria-modal="true" className={`${styles.modal} ${styles.confirm}`} role="alertdialog"><header className={styles.modalHeader}><div><h2>Delete Karigar?</h2><p>This will remove {deleting.name} from the management list.</p></div><button aria-label="Close" onClick={() => setDeleting(null)} type="button"><X size={18} /></button></header><div className={styles.modalActions}><button className="button" onClick={() => setDeleting(null)} type="button">Cancel</button><button className={`button ${styles.deleteButton}`} onClick={remove} type="button"><Trash2 size={15} />Delete</button></div></Card></div> : null}
    </div>
  );
}
