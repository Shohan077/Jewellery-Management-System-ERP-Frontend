"use client";

import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  UserCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./karigar-management.module.css";

type Status = "Active" | "Inactive";

type Karigar = {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  status: Status;
  payment: number;
  due: number;
};

type Tab = "All Karigar" | "Active" | "Inactive" | "Payment Due";

const featuredKarigars: Karigar[] = [
  { id: "KRG-001", name: "Rashid Ali", specialization: "Gold Making", phone: "01712-345678", status: "Active", payment: 45200, due: 0 },
  { id: "KRG-002", name: "Mohammad Salim", specialization: "Diamond Setting", phone: "01823-456789", status: "Active", payment: 38500, due: 5000 },
  { id: "KRG-003", name: "Harun Mia", specialization: "Polishing", phone: "01798-765432", status: "Active", payment: 28300, due: 0 },
  { id: "KRG-004", name: "Jewel Khan", specialization: "Designing", phone: "01911-223344", status: "Active", payment: 41800, due: 8500 },
  { id: "KRG-005", name: "Babul Das", specialization: "Casting", phone: "01670-998877", status: "Inactive", payment: 12000, due: 12000 },
  { id: "KRG-006", name: "Selim Uddin", specialization: "Stone Setting", phone: "01844-556677", status: "Active", payment: 36500, due: 0 },
  { id: "KRG-007", name: "Nuru Miah", specialization: "Engraving", phone: "01933-667788", status: "Active", payment: 29400, due: 7300 },
  { id: "KRG-008", name: "Kamal Hossain", specialization: "Repairing", phone: "01755-443322", status: "Active", payment: 16800, due: 0 },
];

const firstNames = ["Rahim", "Karim", "Hasan", "Masud", "Faruk", "Iqbal", "Sohel", "Shakil", "Alam", "Kabir"];
const lastNames = ["Uddin", "Miah", "Hossain", "Ahmed", "Khan", "Islam", "Sarker", "Molla", "Das", "Roy"];
const specializations = ["Gold Making", "Diamond Setting", "Polishing", "Designing", "Casting", "Stone Setting", "Engraving", "Repairing"];

const supportingKarigars: Karigar[] = Array.from({ length: 20 }, (_, index) => ({
  id: `KRG-${String(index + 9).padStart(3, "0")}`,
  name: `${firstNames[index % firstNames.length]} ${lastNames[(index * 3) % lastNames.length]}`,
  specialization: specializations[index % specializations.length],
  phone: `01${String(620000000 + index * 13791).padStart(9, "0").slice(-9)}`,
  status: index < 17 ? "Active" : "Inactive",
  payment: 0,
  due: 0,
}));

const initialKarigars = [...featuredKarigars, ...supportingKarigars];
const tabs: Tab[] = ["All Karigar", "Active", "Inactive", "Payment Due"];

function formatMoney(value: number) {
  return `৳ ${value.toLocaleString("en-IN")}`;
}

function Metric({ icon, label, value, meta, tone }: { icon: ReactNode; label: string; value: string; meta: string; tone?: string }) {
  return (
    <Card className={`${styles.metric} ${tone ?? ""}`}>
      <span className={styles.metricIcon}>{icon}</span>
      <div><p>{label}</p><strong>{value}</strong><small>↑ {meta} from last month</small></div>
    </Card>
  );
}

function DetailModal({ record, onClose, onEdit }: { record: Karigar; onClose: () => void; onEdit: () => void }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <Card aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><span className={styles.avatar}>{record.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><h2>{record.name}</h2><p>{record.id} · {record.specialization}</p></div></div>
          <button aria-label="Close details" onClick={onClose} type="button"><X size={18} /></button>
        </header>
        <dl className={styles.details}>
          <div><dt>Phone</dt><dd>{record.phone}</dd></div>
          <div><dt>Status</dt><dd><span className={`${styles.status} ${record.status === "Active" ? styles.active : styles.inactive}`}>{record.status}</span></dd></div>
          <div><dt>Total Payment</dt><dd>{formatMoney(record.payment)}</dd></div>
          <div><dt>Pending Payment</dt><dd>{formatMoney(record.due)}</dd></div>
        </dl>
        <div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Close</button><button className={`button ${styles.primary}`} onClick={onEdit} type="button"><Pencil size={14} />Edit Karigar</button></div>
      </Card>
    </div>
  );
}

function KarigarEditor({ current, onClose, onSave }: { current?: Karigar; onClose: () => void; onSave: (record: Karigar) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      id: current?.id ?? `KRG-${String(Date.now()).slice(-3)}`,
      name: String(data.get("name") ?? "").trim(),
      specialization: String(data.get("specialization") ?? "Gold Making"),
      phone: String(data.get("phone") ?? "").trim(),
      status: String(data.get("status") ?? "Active") as Status,
      payment: current?.payment ?? 0,
      due: current?.due ?? 0,
    });
  }
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <Card aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}><div><h2>{current ? "Edit Karigar" : "Add Karigar"}</h2><p>Enter the karigar profile and work specialization.</p></div><button aria-label="Close editor" onClick={onClose} type="button"><X size={18} /></button></header>
        <form className={styles.form} onSubmit={submit}>
          <label><span>Full Name</span><input autoFocus className="field" defaultValue={current?.name} name="name" placeholder="Enter karigar name" required /></label>
          <label><span>Phone</span><input className="field" defaultValue={current?.phone} name="phone" placeholder="01XXX-XXXXXX" required /></label>
          <label><span>Specialization</span><select className="select" defaultValue={current?.specialization ?? specializations[0]} name="specialization">{specializations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Status</span><select className="select" defaultValue={current?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
          <div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">{current ? "Save Changes" : "Add Karigar"}</button></div>
        </form>
      </Card>
    </div>
  );
}

export function KarigarManagement193() {
  const [records, setRecords] = useState(initialKarigars);
  const [activeTab, setActiveTab] = useState<Tab>("All Karigar");
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("All Specializations");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Karigar | null>(null);
  const [editing, setEditing] = useState<Karigar | "new" | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return records.filter((record) => {
      const tabMatch = activeTab === "All Karigar" || (activeTab === "Payment Due" ? record.due > 0 : record.status === activeTab);
      const textMatch = !term || [record.id, record.name, record.specialization, record.phone].some((value) => value.toLowerCase().includes(term));
      const skillMatch = specialization === "All Specializations" || record.specialization === specialization;
      return tabMatch && textMatch && skillMatch;
    });
  }, [activeTab, query, records, specialization]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  function save(record: Karigar) {
    if (editing === "new") {
      setRecords((current) => [record, ...current]);
      setMessage(`${record.name} added successfully.`);
      setActiveTab("All Karigar");
      setPage(1);
    } else {
      setRecords((current) => current.map((item) => item.id === record.id ? record : item));
      setMessage(`${record.name} updated successfully.`);
    }
    setEditing(null);
  }

  function changeTab(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
    setMenuId(null);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.primary}`} onClick={() => setEditing("new")} type="button"><Plus size={15} />Add Karigar</button>}
        description="Manage karigar profiles, work orders, payments and performance"
        title="Karigar Management"
      />
      {message ? <p className={styles.notice} role="status">{message}<button aria-label="Dismiss message" onClick={() => setMessage("")} type="button"><X size={13} /></button></p> : null}

      <section className={styles.metrics}>
        <Metric icon={<Users size={20} />} label="Total Karigar" meta="12%" value="28" />
        <Metric icon={<UserCheck size={20} />} label="Active Karigar" meta="9%" tone={styles.teal} value="24" />
        <Metric icon={<WalletCards size={20} />} label="Total Payment" meta="18%" tone={styles.blue} value="৳ 2,48,500" />
        <Metric icon={<Banknote size={20} />} label="Pending Payment" meta="3%" tone={styles.red} value="৳ 32,800" />
      </section>

      <Card className={styles.listCard}>
        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist">{tabs.map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} key={tab} onClick={() => changeTab(tab)} role="tab" type="button">{tab}</button>)}</div>
          <div className={styles.searchGroup}>
            <label className={styles.search}><Search size={14} /><span className="sr-only">Search karigars</span><input onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search karigar..." type="search" value={query} /></label>
            <button aria-expanded={showFilters} className="button" onClick={() => setShowFilters((current) => !current)} type="button"><Filter size={14} />Filter</button>
          </div>
        </div>
        {showFilters ? <div className={styles.filterPanel}><label><span>Specialization</span><select className="select" onChange={(event) => { setSpecialization(event.target.value); setPage(1); }} value={specialization}><option>All Specializations</option>{specializations.map((item) => <option key={item}>{item}</option>)}</select></label><button className="button" onClick={() => { setSpecialization("All Specializations"); setQuery(""); setPage(1); }} type="button">Reset filters</button></div> : null}

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>#</th><th>Karigar ID</th><th>Name</th><th>Specialization</th><th>Phone</th><th>Status</th><th>Total Payment</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td><td>{record.id}</td><td>{record.name}</td><td>{record.specialization}</td><td>{record.phone}</td>
                  <td><span className={`${styles.status} ${record.status === "Active" ? styles.active : styles.inactive}`}>{record.status}</span></td><td>{formatMoney(record.payment)}</td>
                  <td className={styles.actionCell}><button aria-expanded={menuId === record.id} aria-label={`Actions for ${record.name}`} className={styles.menuButton} onClick={() => setMenuId((current) => current === record.id ? null : record.id)} type="button"><MoreHorizontal size={16} /></button>{menuId === record.id ? <div className={styles.rowMenu}><button onClick={() => { setSelected(record); setMenuId(null); }} type="button"><Eye size={13} />View details</button><button onClick={() => { setEditing(record); setMenuId(null); }} type="button"><Pencil size={13} />Edit karigar</button><button onClick={() => { setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item)); setMenuId(null); setMessage(`${record.name}'s status changed.`); }} type="button"><UserCheck size={13} />Change status</button></div> : null}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td className={styles.empty} colSpan={8}>No karigars match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.footer}>
          <span>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + pageSize, filtered.length)} of {filtered.length} entries</span>
          <div className={styles.footerControls}>
            <nav aria-label="Karigar pages" className={styles.pagination}><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} type="button"><ChevronLeft size={14} /></button>{Array.from({ length: Math.min(pageCount, 4) }, (_, index) => index + 1).map((number) => <button aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}{pageCount > 4 ? <><span>…</span><button onClick={() => setPage(pageCount)} type="button">{pageCount}</button></> : null}<button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} type="button"><ChevronRight size={14} /></button></nav>
            <label className={styles.pageSize}><span className="sr-only">Rows per page</span><select onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} value={pageSize}><option value={8}>8 per page</option><option value={10}>10 per page</option></select></label>
          </div>
        </footer>
      </Card>

      {selected ? <DetailModal onClose={() => setSelected(null)} onEdit={() => { setEditing(selected); setSelected(null); }} record={selected} /> : null}
      {editing ? <KarigarEditor current={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={save} /> : null}
    </div>
  );
}
