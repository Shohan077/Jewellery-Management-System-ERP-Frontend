"use client";

import { Activity, ArchiveRestore, CalendarClock, CircleCheck, Database, Download, HardDrive, Play, RefreshCcw, Save, ServerCog, Settings2, Trash2, Wrench } from "lucide-react";
import { useState, type CSSProperties } from "react";

import { Card } from "@/components/ui/card";
import { SettingsRail } from "@/features/reference-30/settings-rail";

import { initialJobs, initialMaintenanceLogs, type MaintenanceLog, type ScheduledJob } from "./reference-31-data";
import styles from "./reference-31.module.css";

const systemHealth = [["Application", "Online"], ["Database", "Online"], ["Queue", "Running"], ["Cron Jobs", "Running"], ["Storage", "Healthy"]];
const databaseStatus = [["Connection", "Active"], ["Status", "Operational"], ["Uptime", "5d 12h 41m"], ["Open Connections", "12"], ["Slow Queries", "0"]];
const apiServices = [["SMS Gateway", "Operational"], ["WhatsApp API", "Operational"], ["Payment Gateway", "Operational"], ["Email Service", "Operational"], ["Backup Service", "Operational"]];

export function SystemMaintenance() {
  const [jobs, setJobs] = useState(initialJobs);
  const [logs, setLogs] = useState(initialMaintenanceLogs);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backup, setBackup] = useState({ date: "19 May 2025", time: "10:00 AM", size: "258.6 MB", type: "Full Backup" });
  const [message, setMessage] = useState("");
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);

  function addLog(task: string, details: string, status: MaintenanceLog["status"] = "Success") {
    setLogs((current) => {
      const nextId = current.reduce((largestId, log) => Math.max(largestId, log.id), 0) + 1;
      const entry: MaintenanceLog = { id: nextId, time: "Now", task, status, details };
      return [entry, ...current].slice(0, 8);
    });
    setMessage(`${task} completed successfully.`);
  }

  function runJob(job: ScheduledJob) {
    setJobs((current) => current.map((item) => item.id === job.id ? { ...item, lastRun: "Just now", status: "Success" } : item));
    addLog(job.name, `${job.name} completed on demand.`);
  }

  function downloadLogs() {
    const csv = ["Date Time,Task,Status,Details", ...logs.map((log) => [log.time, log.task, log.status, log.details].map((value) => `"${value.replaceAll('"', '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Maintenance logs downloaded.");
  }

  function backupNow() {
    setBackup({ date: "Today", time: "Just now", size: "260.1 MB", type: "Full Backup" });
    addLog("Backup Database", "Manual full backup completed successfully.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.screenTitle}><h1>Screen 124</h1></header>
      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.breadcrumbs}><span>Settings</span><span>System Maintenance</span></div>
          <h2>System Maintenance</h2>
          <p>Monitor system health, run maintenance tasks and manage scheduled jobs.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={() => addLog("Full Maintenance", "All maintenance routines completed successfully.")} type="button"><Play size={13} />Run Maintenance</button>
          <button className={styles.secondaryButton} onClick={downloadLogs} type="button"><Download size={13} />Download Logs</button>
          <button className={styles.primaryButton} onClick={() => { localStorage.setItem("reference-31-maintenance", JSON.stringify({ maintenanceMode, jobs })); setMessage("Maintenance settings saved."); }} type="button"><Save size={13} />Save Maintenance Settings</button>
        </div>
      </div>
      <div className={styles.settingsLayout}>
        <SettingsRail active="System Maintenance" />
        <main className={styles.content}>
          <div className={styles.maintenanceTop}>
            <StatusCard badge="Healthy" rows={systemHealth} title="System Health" />
            <StatusCard badge="MySQL 8.0" rows={databaseStatus} title="Database Status" />
            <Card className={styles.statusCard}>
              <h3>Storage Usage</h3>
              <div className={styles.storageBody}><div className={styles.donut} data-label="66%" style={{ "--value": 66 } as CSSProperties} /><div className={styles.storageLegend}><div><span>Total</span><b>500 GB</b></div><div><span>Used</span><b>340 GB</b></div><div><span>Free</span><b>160 GB</b></div><div><span>Inodes</span><b>78%</b></div></div></div>
            </Card>
            <StatusCard rows={apiServices} title="API Service Status" />
          </div>
          <div className={styles.maintenanceBody}>
            <div className={styles.controlColumn}>
              <Card className={styles.controlCard}>
                <h3>Maintenance Controls</h3>
                <div className={styles.controlGrid}>
                  <Control icon={<Trash2 size={15} />} label="Clear Cache" onClick={() => addLog("Cache Clear", "Application and browser caches cleared.")} />
                  <Control icon={<RefreshCcw size={15} />} label="Rebuild Index" onClick={() => addLog("Rebuild Index", "Search and inventory indexes rebuilt.")} />
                  <Control icon={<Database size={15} />} label="Database Optimize" onClick={() => addLog("Database Optimize", "Optimized 28 database tables.")} />
                  <Control icon={<Activity size={15} />} label="Run Diagnostics" onClick={() => addLog("Run Diagnostics", "No system issues were detected.")} />
                  <Control icon={<Wrench size={15} />} label="Maintenance Info" onClick={() => setMessage("Scheduled maintenance window: Sunday at 2:00 AM.")} />
                  <Control icon={<ArchiveRestore size={15} />} label="Log Cleanup" onClick={() => addLog("Log Cleanup", "Old logs were archived and removed.")} />
                </div>
                <div className={styles.maintenanceToggle}><Toggle checked={maintenanceMode} label="Enable Maintenance Mode" onChange={(value) => { setMaintenanceMode(value); setMessage(value ? "Maintenance mode enabled." : "Maintenance mode disabled."); }} /></div>
              </Card>
              <Card className={styles.gaugeGrid}>
                <GaugeMetric label="CPU Usage" value={28} note="2.8 GHz / 100%" />
                <GaugeMetric label="Memory Usage" value={54} note="8.6 GB / 16 GB" />
                <GaugeMetric label="Database Size" value={68} note="340 GB / 500 GB" />
              </Card>
            </div>
            <Card className={`${styles.tableCard} ${styles.jobTable}`}>
              <header><h3>Scheduled Jobs</h3><CalendarClock color="#0d70d1" size={17} /></header>
              <div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Job Name</th><th>Frequency</th><th>Last Run</th><th>Next Run</th><th>Duration</th><th>Status</th><th>Action</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id}><td>{job.name}</td><td>{job.frequency}</td><td>{job.lastRun}</td><td>{job.nextRun}</td><td>{job.duration}</td><td><span className={styles.status}>{job.status}</span></td><td><div className={styles.jobActions}><button aria-label={`Run ${job.name}`} onClick={() => runJob(job)} type="button"><Play size={11} /></button><button aria-label={`Configure ${job.name}`} onClick={() => setMessage(`${job.name} schedule selected for configuration.`)} type="button"><Settings2 size={11} /></button></div></td></tr>)}</tbody></table></div>
            </Card>
            <Card className={styles.backupCard}>
              <h3>Last Backup</h3>
              <div className={styles.backupIcon}><div><HardDrive size={21} /></div><span><strong>Success</strong><small>Local storage</small></span></div>
              <div className={styles.backupDetails}><div><span>Date</span><b>{backup.date}</b></div><div><span>Time</span><b>{backup.time}</b></div><div><span>Size</span><b>{backup.size}</b></div><div><span>Type</span><b>{backup.type}</b></div></div>
              <button className={styles.primaryButton} onClick={backupNow} type="button"><ArchiveRestore size={13} />Backup Now</button>
            </Card>
            <Card className={`${styles.tableCard} ${styles.logArea}`}>
              <header><h3>Recent Maintenance Logs</h3><ServerCog color="#0d70d1" size={17} /></header>
              <div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Date Time</th><th>Task</th><th>Status</th><th>Details</th><th>Action</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{log.time}</td><td>{log.task}</td><td><span className={styles.status}>{log.status}</span></td><td>{log.details}</td><td><button className={styles.viewButton} onClick={() => setSelectedLog(log)} type="button">View</button></td></tr>)}</tbody></table></div>
            </Card>
          </div>
        </main>
      </div>
      {selectedLog ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedLog(null); }}><Card className={styles.modal} role="dialog" aria-modal="true"><h3>{selectedLog.task}</h3><p>{selectedLog.time}<br />Status: {selectedLog.status}<br />{selectedLog.details}</p><footer><button className={styles.primaryButton} onClick={() => setSelectedLog(null)} type="button">Close</button></footer></Card></div> : null}
    </div>
  );
}

function StatusCard({ badge, rows, title }: { badge?: string; rows: string[][]; title: string }) {
  return <Card className={styles.statusCard}><div className={styles.statusHead}><h3>{title}</h3>{badge ? <span className={styles.tag}>{badge}</span> : null}</div><div className={styles.statusList}>{rows.map(([label, value]) => <div className={styles.statusRow} key={label}><span><CircleCheck color="#1a9b4c" size={10} />{label}</span><b>{value}</b></div>)}</div></Card>;
}

function Control({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button className={styles.controlButton} onClick={onClick} type="button">{icon}<span>{label}</span></button>;
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <label className={styles.toggle}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i /></label>;
}

function GaugeMetric({ label, note, value }: { label: string; note: string; value: number }) {
  return <div className={styles.gaugeWrap}><span>{label}</span><div className={styles.gauge} data-label={`${value}%`} style={{ "--value": value } as CSSProperties} /><small>{note}</small></div>;
}
