"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Download, Eye, FilePenLine, Filter, HandCoins, LogIn, MoreVertical, ShieldCheck, UserCheck, UserPlus, UserRoundX, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import base from "@/features/reference-55/reference-55.module.css";
import { recentActivities, roleCounts, roleSlices, userSeed, type RecentActivity, type UserRecord } from "./data";
import { BreakdownDonut, MetricCard, PanelHeading, ResponsiveTable } from "./shared";
import styles from "./reference-64.module.css";

type UserDialog = { mode: "view" | "edit"; row: UserRecord } | null;

function ActivityIcon({ activity }: { activity: RecentActivity }) {
  const icon = activity.action === "Login" ? <LogIn size={11} /> : activity.action === "Update" ? <FilePenLine size={11} /> : activity.action === "Create" ? <UserPlus size={11} /> : activity.action === "Download" ? <Download size={11} /> : <HandCoins size={11} />;
  return <span aria-hidden="true" className={`${styles.activityIcon} ${styles[activity.tone]}`}>{icon}</span>;
}

export function Reference64UserList() {
  const [rows, setRows] = useState<UserRecord[]>(userSeed);
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [dialog, setDialog] = useState<UserDialog>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => (role === "All Roles" || row.role === role) && (status === "All Status" || row.status === status)), [role, rows, status]);

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog) return;
    const form = new FormData(event.currentTarget);
    const next: UserRecord = {
      ...dialog.row,
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      role: String(form.get("role")) as UserRecord["role"],
      status: String(form.get("status")) as UserRecord["status"],
    };
    setRows((current) => current.map((row) => row.id === next.id ? next : row));
    setMessage(`${next.name} updated successfully.`);
    setDialog(null);
  }

  function toggleStatus(row: UserRecord) {
    const nextStatus = row.status === "Active" ? "Inactive" : "Active";
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: nextStatus } : item));
    setMessage(`${row.name} marked ${nextStatus.toLowerCase()}.`);
  }

  return (
    <div className={styles.page}>
      <section className={styles.fourMetrics}>
        <MetricCard icon={<UsersRound size={18} />} label="Total Users" note="All Users" value="28" />
        <MetricCard accent="green" icon={<UserCheck size={18} />} label="Active Users" note="82.14%" value="23" />
        <MetricCard accent="orange" icon={<UserRoundX size={18} />} label="Inactive Users" note="17.86%" value="5" />
        <MetricCard accent="violet" icon={<ShieldCheck size={18} />} label="Admins" note="21.43%" value="6" />
      </section>

      <div className={styles.userToolbar}>
        <select aria-label="User role" onChange={(event) => setRole(event.target.value)} value={role}><option>All Roles</option><option>Super Admin</option><option>Branch Manager</option><option>Sales Manager</option><option>Accountant</option><option>Store Keeper</option><option>Cashier</option><option>Karigar Incharge</option><option>Sales Executive</option></select>
        <select aria-label="User status" onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Active</option><option>Inactive</option></select>
        <button className={base.secondaryButton} onClick={() => setMessage(`${visibleRows.length} users match the selected filters.`)} type="button"><Filter size={12} />Filters</button>
      </div>

      {message ? <Feedback>{message}</Feedback> : null}

      <Card className={styles.tableCard}>
        <ResponsiveTable label="ERP users" minWidth={1020}>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Last Login</th><th className={styles.centered}>Action</th></tr></thead>
          <tbody>
            {visibleRows.length ? visibleRows.map((row, index) => (
              <tr key={row.id}><td>{index + 1}</td><td><strong>{row.name}</strong></td><td>{row.email}</td><td>{row.role}</td><td>{row.phone}</td><td><StatusBadge tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusBadge></td><td>{row.lastLogin}</td><td className={styles.centered}><span className={base.rowActions}><IconAction label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction><IconAction label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction><IconAction label={`Toggle status for ${row.name}`} onClick={() => toggleStatus(row)}><MoreVertical size={12} /></IconAction></span></td></tr>
            )) : <tr><td className={styles.emptyCell} colSpan={8}>No users match the selected filters.</td></tr>}
          </tbody>
        </ResponsiveTable>
      </Card>

      <section className={styles.userBottom}>
        <Card className={styles.roleCard}>
          <PanelHeading>Role Distribution</PanelHeading>
          <BreakdownDonut centerLabel="Total Users" centerValue="28" items={roleSlices.map((slice) => ({ ...slice, detail: String(roleCounts[slice.label]) }))} />
        </Card>
        <Card className={styles.activityCard}>
          <PanelHeading>Recent Activity</PanelHeading>
          <ul>{recentActivities.map((activity) => <li key={activity.id}><ActivityIcon activity={activity} /><span><strong>{activity.person}</strong> {activity.detail}</span><time>{activity.time}</time><em className={`${styles.activityTag} ${styles[activity.tone]}`}>{activity.action}</em></li>)}</ul>
        </Card>
      </section>

      {dialog?.mode === "view" ? (
        <Modal description={dialog.row.email} onClose={() => setDialog(null)} title={dialog.row.name}>
          <div className={base.viewDetails}><p><span>Role</span><strong>{dialog.row.role}</strong></p><p><span>Phone</span><strong>{dialog.row.phone}</strong></p><p><span>Status</span><strong>{dialog.row.status}</strong></p><p><span>Last Login</span><strong>{dialog.row.lastLogin}</strong></p></div>
        </Modal>
      ) : dialog ? (
        <Modal onClose={() => setDialog(null)} title={`Edit ${dialog.row.name}`}>
          <form className={base.formGrid} onSubmit={saveUser}>
            <label><span>Name</span><input defaultValue={dialog.row.name} name="name" required /></label><label><span>Email</span><input defaultValue={dialog.row.email} name="email" required type="email" /></label>
            <label><span>Phone</span><input defaultValue={dialog.row.phone} name="phone" required /></label><label><span>Role</span><select defaultValue={dialog.row.role} name="role"><option>Super Admin</option><option>Branch Manager</option><option>Sales Manager</option><option>Accountant</option><option>Store Keeper</option><option>Cashier</option><option>Karigar Incharge</option><option>Sales Executive</option></select></label>
            <label className={base.fullField}><span>Status</span><select defaultValue={dialog.row.status} name="status"><option>Active</option><option>Inactive</option></select></label>
            <footer className={base.modalActions}><button className={base.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button><button className={base.primaryButton} type="submit">Save User</button></footer>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

