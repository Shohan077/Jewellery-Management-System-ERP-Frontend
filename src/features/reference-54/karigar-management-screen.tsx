"use client";

import { useMemo, useState, type FormEvent } from "react";
import { BriefcaseBusiness, Eye, FilePenLine, Filter, Plus, Trash2, UserCheck, Users, WalletCards, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard, Notice, Pagination, StatusPill } from "@/features/reference-53/shared";
import { RingChart } from "./analytics";
import styles from "./karigar-management-screen.module.css";

type Karigar = {
  id: string;
  name: string;
  skill: string;
  phone: string;
  status: "Active" | "Inactive";
  today: string;
  pending: string;
};

const initialKarigars: Karigar[] = [
  { id: "KAR-1001", name: "Abdul Karim", skill: "Gold Smith", phone: "01872-123456", status: "Active", today: "2 Orders", pending: "৳ 12,500" },
  { id: "KAR-1002", name: "Jalal Uddin", skill: "Diamond Setting", phone: "01711-234567", status: "Active", today: "1 Order", pending: "৳ 8,000" },
  { id: "KAR-1003", name: "Rafiqul Islam", skill: "Polish", phone: "01822-345678", status: "Active", today: "2 Orders", pending: "৳ 6,000" },
  { id: "KAR-1004", name: "Mofizur Rahman", skill: "Gold Smith", phone: "01633-456789", status: "Inactive", today: "0 Order", pending: "৳ 0" },
  { id: "KAR-1005", name: "Masud Rana", skill: "Engraving", phone: "01645-567890", status: "Active", today: "1 Order", pending: "৳ 5,000" },
  { id: "KAR-1006", name: "Harun Or Rashid", skill: "Mould Maker", phone: "01788-678001", status: "Active", today: "3 Orders", pending: "৳ 15,500" },
  { id: "KAR-1007", name: "Shahidul Islam", skill: "Stone Setting", phone: "01966-789012", status: "Active", today: "2 Orders", pending: "৳ 7,000" },
];

type DialogState = { mode: "add" | "edit" | "view"; row?: Karigar } | null;

function KarigarDialog({ state, onClose, onSave }: { state: NonNullable<DialogState>; onClose: () => void; onSave: (row: Karigar) => void }) {
  const readOnly = state.mode === "view";
  const [name, setName] = useState(state.row?.name ?? "");
  const [skill, setSkill] = useState(state.row?.skill ?? "Gold Smith");
  const [phone, setPhone] = useState(state.row?.phone ?? "");
  const [status, setStatus] = useState<Karigar["status"]>(state.row?.status ?? "Active");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ id: state.row?.id ?? "", name, skill, phone, status, today: state.row?.today ?? "0 Order", pending: state.row?.pending ?? "৳ 0" });
  }
  return <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card aria-modal="true" as="section" className={styles.dialog} role="dialog"><header><div><h2>{state.mode === "add" ? "Add Karigar" : state.mode === "edit" ? "Edit Karigar" : "Karigar Details"}</h2><p>{state.row?.id ?? "Create a new craftsman profile"}</p></div><button aria-label="Close" onClick={onClose} type="button"><X size={17} /></button></header><form onSubmit={submit}><label><span>Name</span><input className="field" disabled={readOnly} onChange={(event) => setName(event.target.value)} required value={name} /></label><label><span>Phone</span><input className="field" disabled={readOnly} onChange={(event) => setPhone(event.target.value)} required value={phone} /></label><label><span>Skill Type</span><select className="select" disabled={readOnly} onChange={(event) => setSkill(event.target.value)} value={skill}><option>Gold Smith</option><option>Diamond Setting</option><option>Polish</option><option>Engraving</option><option>Mould Maker</option><option>Stone Setting</option></select></label><label><span>Status</span><select className="select" disabled={readOnly} onChange={(event) => setStatus(event.target.value as Karigar["status"])} value={status}><option>Active</option><option>Inactive</option></select></label><footer><button className={styles.secondaryButton} onClick={onClose} type="button">{readOnly ? "Close" : "Cancel"}</button>{readOnly ? null : <button className={styles.primaryButton} type="submit">Save Karigar</button>}</footer></form></Card></div>;
}

export function Reference54KarigarManagement() {
  const [rows, setRows] = useState(initialKarigars);
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => rows.filter((row) => status === "All Status" || row.status === status), [rows, status]);

  function save(row: Karigar) {
    setRows((current) => dialog?.mode === "add" ? [...current, { ...row, id: `KAR-${1001 + current.length}` }] : current.map((item) => item.id === row.id ? row : item));
    setDialog(null);
    setMessage(`${row.name} was saved.`);
  }

  return <div className={styles.page}>
    <section className={styles.metrics}>
      <Card className={styles.dualMetric}><span className={styles.dualIcon}><Users size={18} /></span><div><small>Total Karigar</small><strong>{35 + rows.length - initialKarigars.length}</strong></div><div><small>Active</small><strong>{32 + rows.length - initialKarigars.length}</strong></div></Card>
      <MetricCard accent="blue" icon={<BriefcaseBusiness size={17} />} label="Today’s Labour Cost" note="" value="৳ 18,750" />
      <MetricCard accent="orange" icon={<WalletCards size={17} />} label="This Month Cost" note="" value="৳ 4,25,600" />
      <MetricCard accent="orange" icon={<WalletCards size={17} />} label="Pending Payment" note="" value="৳ 1,12,000" />
    </section>

    <Card className={styles.tableCard}>
      <header className={styles.tableTitle}><h2>Karigar List</h2><div><select aria-label="Karigar status" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Active</option><option>Inactive</option></select><button className={styles.filterButton} onClick={() => setMessage(`${filtered.length} karigars found.`)} type="button"><Filter size={12} />Filter</button><button className={styles.addButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={13} />Add Karigar</button></div></header>
      {message ? <div className={styles.notice}><Notice>{message}</Notice></div> : null}
      <div className={styles.tableScroller}><table><caption className="sr-only">Karigar list</caption><thead><tr><th>#</th><th>Karigar ID</th><th>Name</th><th>Skill Type</th><th>Phone</th><th>Status</th><th>Today Work</th><th>Pending</th><th>Action</th></tr></thead><tbody>{filtered.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td><strong>{row.id}</strong></td><td>{row.name}</td><td>{row.skill}</td><td>{row.phone}</td><td><StatusPill tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusPill></td><td>{row.today}</td><td>{row.pending}</td><td><div className={styles.actions}><button aria-label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })} type="button"><Eye size={13} /></button><button aria-label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })} type="button"><FilePenLine size={13} /></button><button aria-label={`Delete ${row.name}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setMessage(`${row.name} removed.`); }} type="button"><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div>
      <footer className={styles.tableFooter}><span>Showing 1 to {filtered.length} of 35 entries</span><Pagination current={page} onChange={setPage} /></footer>
    </Card>

    <section className={styles.bottomGrid}>
      <Card className={styles.chartCard}><h2>Labour Cost Overview (This Month)</h2><RingChart centerLabel="Total Cost" centerValue="৳ 4,25,600" segments={[{ label: "Gold Smith", value: 49, color: "#1769df", detail: "৳ 2,10,000 (49%)" },{ label: "Diamond Setting", value: 28, color: "#7696ea", detail: "৳ 1,20,000 (28%)" },{ label: "Polish", value: 13, color: "#a9b8f5", detail: "৳ 55,000 (13%)" },{ label: "Others", value: 10, color: "#d1d9ea", detail: "৳ 40,600 (10%)" }]} /></Card>
      <Card className={styles.paymentCard}><h2>Payment Status</h2><div className={styles.paymentGrid}><article><span className={styles.greenIcon}><UserCheck size={15} /></span><small>Total Payable</small><strong>৳ 1,12,000</strong></article><article><span className={styles.greenIcon}><UserCheck size={15} /></span><small>Paid</small><strong className={styles.green}>৳ 3,13,600</strong></article><article><span className={styles.redIcon}><WalletCards size={15} /></span><small>Due</small><strong className={styles.red}>৳ 1,12,000</strong></article><article><span className={styles.orangeIcon}><WalletCards size={15} /></span><small>Overdue</small><strong className={styles.red}>৳ 26,500</strong></article></div></Card>
    </section>
    {dialog ? <KarigarDialog onClose={() => setDialog(null)} onSave={save} state={dialog} /> : null}
  </div>;
}
