"use client";

import { KeyRound, Pencil, Plus, UsersRound, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import { initialRoles, permissionGroups, type RoleRecord } from "./admin-control-data";
import styles from "./admin-control-center.module.css";

type RoleDraft = Pick<RoleRecord, "name" | "description" | "users" | "active">;

const emptyRole: RoleDraft = { name: "", description: "", users: 0, active: true };

export function RolePermissionManagement() {
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState("role-manager");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(permissionGroups.flatMap((group) => [group.module, ...group.permissions].map((item) => [item, group.module !== "Purchase" || item !== "Delete Purchase"]))));
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; role?: RoleRecord } | null>(null);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({ total: roles.length, permissions: 142, users: roles.reduce((sum, role) => sum + role.users, 0) }), [roles]);

  function togglePermission(name: string) {
    setChecked((current) => ({ ...current, [name]: !current[name] }));
  }

  function saveRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: RoleDraft = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description")).trim(),
      users: Math.max(0, Number(form.get("users"))),
      active: form.get("active") === "on",
    };
    if (!next.name || !next.description) return;
    if (dialog?.mode === "edit" && dialog.role) {
      setRoles((current) => current.map((role) => role.id === dialog.role?.id ? { ...role, ...next } : role));
      setMessage(`${next.name} was updated.`);
    } else {
      const role: RoleRecord = { id: `role-${Date.now()}`, ...next };
      setRoles((current) => [...current, role]);
      setSelectedRoleId(role.id);
      setMessage(`${role.name} was created.`);
    }
    setDialog(null);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><div><h1>Role &amp; Permission Management</h1><p>Home <b>›</b> Users &amp; Roles <b>›</b> Role &amp; Permission Management</p></div><button className={styles.primaryButton} onClick={() => setDialog({ mode: "create" })} type="button"><Plus size={15} />Create Role</button></header>

      <section className={styles.metrics} aria-label="Role summary">
        <Card className={styles.metric}><span className={styles.blueIcon}><UsersRound size={24} /></span><div><small>Total Roles</small><strong>{metrics.total}</strong></div></Card>
        <Card className={styles.metric}><span className={styles.greenIcon}><KeyRound size={24} /></span><div><small>Total Permissions</small><strong>{metrics.permissions}</strong></div></Card>
        <Card className={styles.metric}><span className={styles.purpleIcon}><UsersRound size={24} /></span><div><small>Assigned Users</small><strong>{metrics.users}</strong></div></Card>
      </section>

      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>

      <div className={styles.roleGrid}>
        <Card className={styles.panel}><h2>Roles List</h2><div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Role Name</th><th>Description</th><th>Users</th><th>Status</th><th>Action</th></tr></thead><tbody>{roles.map((role) => <tr className={selectedRoleId === role.id ? styles.selectedRow : ""} key={role.id} onClick={() => setSelectedRoleId(role.id)}><td><strong>{role.name}</strong></td><td>{role.description}</td><td>{role.users}</td><td><span className={`${styles.badge} ${role.active ? styles.activeBadge : styles.inactiveBadge}`}>{role.active ? "Active" : "Inactive"}</span></td><td><button aria-label={`Edit ${role.name}`} className={styles.iconButton} onClick={(event) => { event.stopPropagation(); setDialog({ mode: "edit", role }); }} type="button"><Pencil size={13} /></button></td></tr>)}</tbody></table></div><footer>Showing 1 to {roles.length} of {roles.length} entries</footer></Card>

        <Card className={styles.permissionPanel}><h2>Role Permissions</h2><label className={styles.roleSelect}><span>Select Role</span><select onChange={(event) => setSelectedRoleId(event.target.value)} value={selectedRoleId}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><div className={styles.permissionTree}>{permissionGroups.map((group) => <section key={group.module}><label className={styles.moduleCheck}><input checked={Boolean(checked[group.module])} onChange={() => togglePermission(group.module)} type="checkbox" /><span>{group.module}</span></label>{group.permissions.length ? <div>{group.permissions.map((permission) => <label key={permission}><input checked={Boolean(checked[permission])} onChange={() => togglePermission(permission)} type="checkbox" /><span>{permission}</span></label>)}</div> : null}</section>)}</div><button className={styles.widePrimary} onClick={() => setMessage(`Permissions saved for ${roles.find((role) => role.id === selectedRoleId)?.name ?? "role"}.`)} type="button">Save Permissions</button></Card>
      </div>

      {dialog ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}><Card className={styles.modal} role="dialog" aria-modal="true"><header><div><h2>{dialog.mode === "create" ? "Create Role" : "Edit Role"}</h2><p>Configure the role name, users, and current status.</p></div><button aria-label="Close role editor" onClick={() => setDialog(null)} type="button"><X size={18} /></button></header><RoleForm initial={dialog.role ?? emptyRole} onCancel={() => setDialog(null)} onSubmit={saveRole} /></Card></div> : null}
    </div>
  );
}

function RoleForm({ initial, onCancel, onSubmit }: { initial: RoleDraft; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className={styles.modalForm} onSubmit={onSubmit}><label><span>Role Name</span><input className="field" defaultValue={initial.name} name="name" required /></label><label><span>Assigned Users</span><input className="field" defaultValue={initial.users} min="0" name="users" type="number" /></label><label className={styles.fullField}><span>Description</span><textarea className="textarea" defaultValue={initial.description} name="description" required /></label><label className={styles.checkField}><input defaultChecked={initial.active} name="active" type="checkbox" /><span>Active role</span></label><footer><button className="button" onClick={onCancel} type="button">Cancel</button><button className={styles.primaryButton} type="submit">Save Role</button></footer></form>;
}
