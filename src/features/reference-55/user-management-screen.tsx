"use client";

import { useState, type FormEvent } from "react";
import { Eye, FilePenLine, Plus, ShieldCheck, Trash2, UserCheck, UserRoundCog, UserX } from "lucide-react";
import { initialUsers, type UserRecord } from "./data";
import { DataTable, Feedback, IconAction, Modal, StatCard, StatusBadge, type TableColumn } from "./shared";
import styles from "./reference-55.module.css";

type UserDialog = { mode: "add" | "edit" | "view"; row?: UserRecord } | null;

function UserDialogPanel({ dialog, onClose, onSave }: { dialog: NonNullable<UserDialog>; onClose: () => void; onSave: (row: UserRecord) => void }) {
  const row = dialog.row;

  if (dialog.mode === "view" && row) {
    return (
      <Modal description={`@${row.username}`} onClose={onClose} title={row.name}>
        <div className={styles.viewDetails}>
          <p><span>Role</span><strong>{row.role}</strong></p><p><span>Branch</span><strong>{row.branch}</strong></p>
          <p><span>Status</span><strong>{row.status}</strong></p><p><span>Last Login</span><strong>{row.lastLogin}</strong></p>
        </div>
      </Modal>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: row?.id ?? 0,
      name: String(form.get("name") ?? ""),
      username: String(form.get("username") ?? ""),
      role: String(form.get("role") ?? "Sales Executive"),
      branch: String(form.get("branch") ?? "Head Office"),
      status: form.get("status") as UserRecord["status"],
      lastLogin: row?.lastLogin ?? "—",
    });
  }

  return (
    <Modal description={dialog.mode === "add" ? "Create a user and assign access" : `Update @${row?.username}`} onClose={onClose} title={dialog.mode === "add" ? "Add user" : "Edit user"}>
      <form className={styles.formGrid} onSubmit={submit}>
        <label><span>Full Name</span><input defaultValue={row?.name ?? ""} name="name" placeholder="Enter full name" required /></label>
        <label><span>Username</span><input defaultValue={row?.username ?? ""} name="username" pattern="[a-z0-9._]+" placeholder="first.last" required /></label>
        <label><span>Role</span><select defaultValue={row?.role ?? "Sales Executive"} name="role"><option>Administrator</option><option>Manager</option><option>Sales Executive</option><option>Accountant</option><option>Cashier</option><option>Store Incharge</option></select></label>
        <label><span>Branch</span><select defaultValue={row?.branch ?? "Head Office"} name="branch"><option>Head Office</option><option>Uttara Branch</option><option>Dhanmondi Branch</option><option>Mirpur Branch</option><option>Chattogram Branch</option><option>Sylhet Branch</option></select></label>
        <label className={styles.fullField}><span>Status</span><select defaultValue={row?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
        <footer className={styles.modalActions}><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><button className={styles.primaryButton} type="submit">Save User</button></footer>
      </form>
    </Modal>
  );
}

export function Reference55UserManagement() {
  const [rows, setRows] = useState<UserRecord[]>([...initialUsers]);
  const [dialog, setDialog] = useState<UserDialog>(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  function saveUser(user: UserRecord) {
    if (dialog?.mode === "edit") {
      setRows((current) => current.map((row) => row.id === user.id ? user : row));
    } else {
      const id = Math.max(0, ...rows.map((row) => row.id)) + 1;
      setRows((current) => [...current, { ...user, id }]);
    }
    setMessage(`${user.name} saved successfully.`);
    setDialog(null);
  }

  function deleteUser(user: UserRecord) {
    setRows((current) => current.filter((row) => row.id !== user.id));
    setMessage(`${user.name} removed from the user list.`);
  }

  const activeCount = 21 + rows.filter((row) => row.status === "Active").length;
  const inactiveCount = 3 + rows.filter((row) => row.status === "Inactive").length;
  const adminCount = 5 + rows.filter((row) => row.role === "Administrator").length;

  const columns: readonly TableColumn<UserRecord>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "name", label: "Name", render: (row) => <strong>{row.name}</strong> },
    { key: "username", label: "Username", render: (row) => row.username },
    { key: "role", label: "Role", render: (row) => row.role },
    { key: "branch", label: "Branch", render: (row) => row.branch },
    { key: "status", label: "Status", align: "center", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusBadge> },
    { key: "lastLogin", label: "Last Login", render: (row) => row.lastLogin },
    { key: "action", label: "Action", align: "center", render: (row) => <span className={styles.rowActions}><IconAction label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction><IconAction label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction><IconAction danger label={`Delete ${row.name}`} onClick={() => deleteUser(row)}><Trash2 size={12} /></IconAction></span> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.actionRow}><button className={styles.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add User</button></div>

      <section aria-label="User management summary" className={styles.metrics}>
        <StatCard icon={<UserRoundCog size={17} />} label="Total Users" value={String(24 + rows.length)} />
        <StatCard accent="green" icon={<UserCheck size={17} />} label="Active Users" value={String(activeCount)} />
        <StatCard accent="orange" icon={<UserX size={17} />} label="Inactive Users" value={String(inactiveCount)} />
        <StatCard accent="violet" icon={<ShieldCheck size={17} />} label="Administrators" value={String(adminCount)} />
      </section>

      {message ? <Feedback>{message}</Feedback> : null}

      <DataTable columns={columns} currentPage={page} minWidth={1020} onPageChange={setPage} pageCount={4} rowKey={(row) => row.id} rows={rows} title="User List" total={32} />
      {dialog ? <UserDialogPanel dialog={dialog} onClose={() => setDialog(null)} onSave={saveUser} /> : null}
    </div>
  );
}
