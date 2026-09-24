"use client";

import { ChevronLeft, ChevronRight, Download, ListChecks, LockKeyhole, Search, ShieldAlert, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import { adminActivities, type AdminActivity, type LogAction } from "./admin-control-data";
import styles from "./admin-control-center.module.css";

const PAGE_SIZE = 10;

function csvCell(value: string | number) { return `"${String(value).replaceAll('"', '""')}"`; }

function exportLog(rows: AdminActivity[]) {
  const csv = [["Date & Time", "User", "Module", "Action", "Details", "IP Address", "Device/Browser"], ...rows.map((row) => [row.dateTime, row.user, row.module, row.action, row.details, row.ipAddress, row.device])].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = "activity-log-may-2024.csv"; anchor.click(); URL.revokeObjectURL(url);
}

export function AdminActivityLog() {
  const [draft, setDraft] = useState({ from: "2024-05-01", to: "2024-05-31", user: "All Users", module: "All Modules", action: "All Actions" });
  const [applied, setApplied] = useState(draft);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const users = useMemo(() => [...new Set(adminActivities.map((item) => item.user))], []);
  const modules = useMemo(() => [...new Set(adminActivities.map((item) => item.module))], []);
  const filtered = useMemo(() => adminActivities.filter((item) => item.isoDate >= applied.from && item.isoDate <= applied.to && (applied.user === "All Users" || item.user === applied.user) && (applied.module === "All Modules" || item.module === applied.module) && (applied.action === "All Actions" || item.action === applied.action)), [applied]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const pageItems = pages <= 6 ? Array.from({ length: pages }, (_, index) => index + 1) : [1, 2, 3, 4, 5, pages];

  function search() {
    if (draft.from > draft.to) { setMessage("From Date must be before To Date."); return; }
    setApplied({ ...draft }); setPage(1); setMessage("Activity filters applied.");
  }

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><h1>Activity Log</h1><p>Home <b>›</b> Reports <b>›</b> Activity Log</p></div></header>
    <Card className={styles.activityFilter}><label><span>From Date</span><input onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} /></label><label><span>To Date</span><input onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} /></label><label><span>User</span><select onChange={(event) => setDraft((current) => ({ ...current, user: event.target.value }))} value={draft.user}><option>All Users</option>{users.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Module</span><select onChange={(event) => setDraft((current) => ({ ...current, module: event.target.value }))} value={draft.module}><option>All Modules</option>{modules.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Action</span><select onChange={(event) => setDraft((current) => ({ ...current, action: event.target.value }))} value={draft.action}><option>All Actions</option>{(["Create", "Update", "Delete", "Login", "Export"] satisfies LogAction[]).map((item) => <option key={item}>{item}</option>)}</select></label><button className={styles.primaryButton} onClick={search} type="button"><Search size={14} />Search</button><button className={styles.secondaryButton} onClick={() => { exportLog(filtered); setMessage(`${filtered.length} activities exported.`); }} type="button"><Download size={14} />Export</button></Card>
    <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    <section className={styles.fourMetrics}><Card className={styles.metric}><span className={styles.blueIcon}><ListChecks size={23} /></span><div><small>Total Activities</small><strong>1,256</strong></div></Card><Card className={styles.metric}><span className={styles.greenIcon}><LockKeyhole size={22} /></span><div><small>Logins Today</small><strong>24</strong></div></Card><Card className={styles.metric}><span className={styles.redIcon}><ShieldAlert size={22} /></span><div><small>Critical Actions</small><strong>18</strong></div></Card><Card className={styles.metric}><span className={styles.purpleIcon}><UsersRound size={22} /></span><div><small>Active Users</small><strong>32</strong></div></Card></section>
    <Card className={styles.logTableCard}><div className={styles.tableScroller}><table className={`${styles.table} ${styles.logTable}`}><thead><tr><th>Date &amp; Time</th><th>User</th><th>Module</th><th>Action</th><th>Details</th><th>IP Address</th><th>Device/Browser</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td>{item.dateTime}</td><td><strong>{item.user}</strong></td><td>{item.module}</td><td><span className={`${styles.actionBadge} ${styles[`action${item.action}`]}`}>{item.action}</span></td><td>{item.details}</td><td>{item.ipAddress}</td><td>{item.device}</td></tr>)}</tbody></table></div><footer className={styles.tableFooter}><p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} entries</p><nav><button disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={14} /></button>{pageItems.map((item, index) => <span key={`${item}-${index}`}>{index === pageItems.length - 1 && pages > 6 ? "…" : null}<button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} onClick={() => setPage(item)} type="button">{item}</button></span>)}<button disabled={safePage === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))} type="button"><ChevronRight size={14} /></button></nav></footer></Card>
  </div>;
}
