"use client";

import { CalendarClock, Database, Download, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import { backupRecords } from "./admin-control-data";
import styles from "./admin-control-center.module.css";

type BackupRecord = { id: number; name: string; type: string; size: string; date: string; status: string; storage: string };

export function BackupRestore() {
  const [records, setRecords] = useState<BackupRecord[]>(backupRecords.map((item) => ({ ...item })));
  const [form, setForm] = useState({ type: "Full Backup", name: "Manual Backup - 31 May 2024", includeDatabase: true, includeFiles: true, remarks: "Manual backup before monthly closing." });
  const [schedule, setSchedule] = useState({ enabled: true, frequency: "Daily", time: "02:00", retention: "Keep last 30 backups", destination: "Local Storage", email: true });
  const [message, setMessage] = useState("");

  function createBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: BackupRecord = { id: Date.now(), name: form.name || "Manual Backup", type: form.type, size: form.type === "Full Backup" ? "1.27 GB" : "245 MB", date: "31/05/2024 12:00 PM", status: "Completed", storage: schedule.destination };
    setRecords((current) => [next, ...current]); setMessage(`${next.name} created successfully.`);
  }

  function saveSchedule(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("Backup schedule saved successfully."); }
  function downloadBackup(record: BackupRecord) { const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${record.name.replaceAll(" ", "-").toLowerCase()}.json`; anchor.click(); URL.revokeObjectURL(url); setMessage(`${record.name} downloaded.`); }

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><h1>Backup &amp; Restore</h1><p>Home <b>›</b> Settings <b>›</b> Backup &amp; Restore</p></div></header>
    <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    <div className={styles.backupForms}>
      <Card className={styles.formPanel}><h2>Create New Backup</h2><form onSubmit={createBackup}><label><span>Backup Type</span><select onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} value={form.type}><option>Full Backup</option><option>Database Only</option><option>Files Only</option></select></label><label><span>Backup Name</span><input onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} /></label><Toggle checked={form.includeDatabase} label="Include Database" onChange={(value) => setForm((current) => ({ ...current, includeDatabase: value }))} /><Toggle checked={form.includeFiles} label="Include Files" onChange={(value) => setForm((current) => ({ ...current, includeFiles: value }))} /><label><span>Remarks (Optional)</span><textarea onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))} value={form.remarks} /></label><button className={styles.widePrimary} type="submit"><UploadCloud size={15} />Create Backup Now</button></form></Card>
      <Card className={styles.formPanel}><h2>Backup Schedule</h2><form onSubmit={saveSchedule}><Toggle checked={schedule.enabled} label="Enable Automatic Backup" onChange={(value) => setSchedule((current) => ({ ...current, enabled: value }))} /><label><span>Frequency</span><select onChange={(event) => setSchedule((current) => ({ ...current, frequency: event.target.value }))} value={schedule.frequency}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label><label><span>Time</span><input onChange={(event) => setSchedule((current) => ({ ...current, time: event.target.value }))} type="time" value={schedule.time} /></label><label><span>Retention Policy</span><select onChange={(event) => setSchedule((current) => ({ ...current, retention: event.target.value }))} value={schedule.retention}><option>Keep last 30 backups</option><option>Keep last 14 backups</option><option>Keep last 7 backups</option></select></label><label><span>Backup Destination</span><select onChange={(event) => setSchedule((current) => ({ ...current, destination: event.target.value }))} value={schedule.destination}><option>Local Storage</option><option>External Drive</option><option>Network Storage</option></select></label><Toggle checked={schedule.email} label="Email Notification" onChange={(value) => setSchedule((current) => ({ ...current, email: value }))} /><button className={styles.widePrimary} type="submit"><Save size={15} />Save Schedule</button></form></Card>
    </div>
    <div className={styles.backupBottom}><Card className={styles.backupHistory}><h2>Backup History</h2><div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Backup Name</th><th>Type</th><th>Size</th><th>Date &amp; Time</th><th>Status</th><th>Storage</th><th>Action</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td><strong>{record.name}</strong></td><td>{record.type}</td><td>{record.size}</td><td>{record.date}</td><td><span className={`${styles.badge} ${record.status === "Completed" ? styles.activeBadge : styles.failedBadge}`}>{record.status}</span></td><td>{record.storage}</td><td><div className={styles.rowActions}><button onClick={() => downloadBackup(record)} type="button"><Download size={12} />Download</button><button className={styles.restoreButton} onClick={() => setMessage(`${record.name} restored in preview mode.`)} type="button"><RotateCcw size={12} />Restore</button><button className={styles.removeButton} onClick={() => { setRecords((current) => current.filter((item) => item.id !== record.id)); setMessage(`${record.name} removed.`); }} type="button"><Trash2 size={12} />Remove</button></div></td></tr>)}</tbody></table></div></Card><Card className={styles.backupStats}><article><CalendarClock size={24} /><div><span>Last Backup</span><strong>31/05/2024 02:00 AM</strong><small>Completed</small></div></article><article><Database size={24} /><div><span>Total Storage Used</span><strong>38.45 GB</strong><small>of 100 GB</small></div></article><article><CalendarClock size={24} /><div><span>Next Scheduled Backup</span><strong>01/06/2024 02:00 AM</strong></div></article></Card></div>
  </div>;
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <label className={styles.toggleRow}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i aria-hidden="true" /></label>;
}
