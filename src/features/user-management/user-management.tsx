"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  initialUsers,
  nextUserId,
  userBranches,
  userRoles,
  userStatuses,
} from "./user-management-data";
import type {
  SystemUser,
  UserBranch,
  UserRole,
  UserStatus,
} from "./user-management-data";
import styles from "./user-management.module.css";

const PAGE_SIZE = 10;

type UserDraft = Omit<SystemUser, "id">;
type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit" | "delete"; user: SystemUser };

const emptyDraft: UserDraft = {
  name: "",
  email: "",
  role: "Sales",
  branch: "Main",
  status: "Active",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>
      {status}
    </span>
  );
}

type UserFormProps = {
  initialValue?: SystemUser;
  onCancel: () => void;
  onSubmit: (draft: UserDraft) => void;
};

function UserForm({ initialValue, onCancel, onSubmit }: UserFormProps) {
  const [draft, setDraft] = useState<UserDraft>(initialValue ?? emptyDraft);

  function updateDraft<Key extends keyof UserDraft>(key: Key, value: UserDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ ...draft, name: draft.name.trim(), email: draft.email.trim().toLowerCase() });
  }

  return (
    <form className={styles.modalForm} onSubmit={submitForm}>
      <label className={styles.wideField}>
        <span>Name <em>*</em></span>
        <input
          autoFocus
          className="field"
          onChange={(event) => updateDraft("name", event.target.value)}
          placeholder="Enter full name"
          required
          value={draft.name}
        />
      </label>
      <label className={styles.wideField}>
        <span>Email <em>*</em></span>
        <input
          className="field"
          onChange={(event) => updateDraft("email", event.target.value)}
          placeholder="name@aarohan.com"
          required
          type="email"
          value={draft.email}
        />
      </label>
      <label>
        <span>Role</span>
        <select className="select" onChange={(event) => updateDraft("role", event.target.value as UserRole)} value={draft.role}>
          {userRoles.map((role) => <option key={role}>{role}</option>)}
        </select>
      </label>
      <label>
        <span>Branch</span>
        <select className="select" onChange={(event) => updateDraft("branch", event.target.value as UserBranch)} value={draft.branch}>
          {userBranches.map((branch) => <option key={branch}>{branch}</option>)}
        </select>
      </label>
      <label className={styles.wideField}>
        <span>Status</span>
        <select className="select" onChange={(event) => updateDraft("status", event.target.value as UserStatus)} value={draft.status}>
          {userStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">
          <ShieldCheck aria-hidden="true" size={15} />
          {initialValue ? "Save Changes" : "Add User"}
        </button>
      </div>
    </form>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [roleDraft, setRoleDraft] = useState<"All Roles" | UserRole>("All Roles");
  const [statusDraft, setStatusDraft] = useState<"All Status" | UserStatus>("All Status");
  const [roleFilter, setRoleFilter] = useState<"All Roles" | UserRole>("All Roles");
  const [statusFilter, setStatusFilter] = useState<"All Status" | UserStatus>("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    inactive: users.filter((user) => user.status === "Inactive").length,
    admins: users.filter((user) => user.role === "Admin").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !search || [user.name, user.email, user.role, user.branch]
        .some((value) => value.toLowerCase().includes(search));
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All Status" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [deferredQuery, roleFilter, statusFilter, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  function applyFilters() {
    setRoleFilter(roleDraft);
    setStatusFilter(statusDraft);
    setPage(1);
    setMessage(roleDraft === "All Roles" && statusDraft === "All Status"
      ? "Role and status filters cleared."
      : "User filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setRoleDraft("All Roles");
    setStatusDraft("All Status");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setPage(1);
    setMessage("All filters cleared.");
  }

  function addUser(draft: UserDraft) {
    const user: SystemUser = { id: nextUserId(users), ...draft };
    setUsers((current) => [...current, user]);
    setDialog(null);
    setPage(Math.ceil((filteredUsers.length + 1) / PAGE_SIZE));
    setMessage(`${user.name} was added successfully.`);
  }

  function updateUser(id: string, draft: UserDraft) {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, ...draft } : user));
    setDialog(null);
    setMessage(`${draft.name} was updated successfully.`);
  }

  function deleteUser(user: SystemUser) {
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setDialog(null);
    setMessage(`${user.name} was removed from user access.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => setDialog({ mode: "add" })} type="button">
            <Plus aria-hidden="true" size={16} /> Add User
          </button>
        )}
        description="View and manage system users, roles and permissions"
        title="User Management"
      />

      <section aria-label="User overview" className={styles.metrics}>
        <Card className={styles.metricCard}><span>Total Users</span><strong className={styles.blueMetric}>{metrics.total}</strong></Card>
        <Card className={styles.metricCard}><span>Active Users</span><strong className={styles.greenMetric}>{metrics.active}</strong></Card>
        <Card className={styles.metricCard}><span>Inactive Users</span><strong className={styles.redMetric}>{metrics.inactive}</strong></Card>
        <Card className={styles.metricCard}><span>Admin Users</span><strong>{metrics.admins}</strong></Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={16} />
            <span className="sr-only">Search users</span>
            <input
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search by name, email or role..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by role</span>
            <select onChange={(event) => setRoleDraft(event.target.value as typeof roleDraft)} value={roleDraft}>
              <option>All Roles</option>
              {userRoles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by status</span>
            <select onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}>
              <option>All Status</option>
              {userStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <button className={`button ${styles.filterButton}`} onClick={applyFilters} type="button">
            <Filter aria-hidden="true" size={15} /> Filter
          </button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">System users</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Branch</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.branch}</td>
                  <td><StatusBadge status={user.status} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${user.name}`} onClick={() => setDialog({ mode: "view", user })} type="button"><Eye aria-hidden="true" size={13} /></button>
                      <button aria-label={`Edit ${user.name}`} onClick={() => setDialog({ mode: "edit", user })} type="button"><Pencil aria-hidden="true" size={13} /></button>
                      <button aria-label={`Delete ${user.name}`} className={styles.deleteAction} onClick={() => setDialog({ mode: "delete", user })} type="button"><Trash2 aria-hidden="true" size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleUsers.length ? (
                <tr>
                  <td className={styles.emptyState} colSpan={7}>
                    <Search aria-hidden="true" size={24} />
                    <strong>No users found</strong>
                    <span>Try another search or clear the selected filters.</span>
                    <button className="button" onClick={clearFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>
            Showing {filteredUsers.length ? startIndex + 1 : 0} to {Math.min(startIndex + PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <nav aria-label="User pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <button aria-current={activePage === item ? "page" : undefined} className={activePage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>
            ))}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div
          className={styles.modalBackdrop}
          onKeyDown={(event) => { if (event.key === "Escape") setDialog(null); }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}
        >
          <section
            aria-describedby="user-dialog-description"
            aria-labelledby="user-dialog-title"
            aria-modal="true"
            className={styles.modal}
            role={dialog.mode === "delete" ? "alertdialog" : "dialog"}
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="user-dialog-title">
                  {dialog.mode === "add" ? "Add User" : dialog.mode === "edit" ? "Edit User" : dialog.mode === "delete" ? "Delete User" : "User Details"}
                </h2>
                <p id="user-dialog-description">
                  {dialog.mode === "delete" ? "This user will no longer have access to the ERP." : dialog.mode === "view" ? "Account, role and branch information." : "Enter the user's account and access details."}
                </p>
              </div>
              <button autoFocus={dialog.mode === "view"} aria-label="Close user dialog" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>

            {dialog.mode === "add" ? (
              <UserForm onCancel={() => setDialog(null)} onSubmit={addUser} />
            ) : dialog.mode === "edit" ? (
              <UserForm initialValue={dialog.user} key={dialog.user.id} onCancel={() => setDialog(null)} onSubmit={(draft) => updateUser(dialog.user.id, draft)} />
            ) : dialog.mode === "view" ? (
              <div className={styles.profile}>
                <div className={styles.profileIdentity}>
                  <span className={styles.profileAvatar}><UserRound aria-hidden="true" size={28} /></span>
                  <div><strong>{dialog.user.name}</strong><span>{dialog.user.email}</span></div>
                </div>
                <dl>
                  <div><dt>Role</dt><dd>{dialog.user.role}</dd></div>
                  <div><dt>Branch</dt><dd>{dialog.user.branch}</dd></div>
                  <div><dt>Status</dt><dd><StatusBadge status={dialog.user.status} /></dd></div>
                </dl>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => setDialog({ mode: "edit", user: dialog.user })} type="button"><Pencil aria-hidden="true" size={14} /> Edit User</button>
                </div>
              </div>
            ) : (
              <div className={styles.deleteDialog}>
                <span className={styles.warningIcon}><Trash2 aria-hidden="true" size={24} /></span>
                <p>Delete <strong>{dialog.user.name}</strong>? Their account data will be removed from this list.</p>
                <div className={styles.modalActions}>
                  <button autoFocus className="button" onClick={() => setDialog(null)} type="button">Cancel</button>
                  <button className={`button ${styles.dangerButton}`} onClick={() => deleteUser(dialog.user)} type="button">Delete User</button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
