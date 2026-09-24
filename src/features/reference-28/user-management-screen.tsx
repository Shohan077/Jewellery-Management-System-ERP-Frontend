"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  UserRoundX,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  initialManagedUsers,
  userDepartments,
  userRoles,
  type ManagedUser,
  type UserStatus,
} from "./reference-data";
import styles from "./reference-pages.module.css";

const PAGE_SIZE = 8;

type UserDraft = Omit<ManagedUser, "id" | "lastLoginDate" | "lastLoginTime">;
type UserDialog =
  | { mode: "add" }
  | { mode: "edit" | "view" | "delete"; user: ManagedUser };

const emptyUser: UserDraft = {
  name: "",
  email: "",
  role: "Manager",
  department: "Sales",
  status: "Active",
};

function UserForm({ initial, onCancel, onSave }: { initial?: ManagedUser; onCancel: () => void; onSave: (draft: UserDraft) => void }) {
  const [draft, setDraft] = useState<UserDraft>(initial ? {
    name: initial.name,
    email: initial.email,
    role: initial.role,
    department: initial.department,
    status: initial.status,
  } : emptyUser);

  function update<Key extends keyof UserDraft>(key: Key, value: UserDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim().toLowerCase() });
  }

  return (
    <form className={styles.modalForm} onSubmit={submit}>
      <label className={styles.span2}><span>Full Name <b>*</b></span><input autoFocus onChange={(event) => update("name", event.target.value)} placeholder="Enter full name" required value={draft.name} /></label>
      <label className={styles.span2}><span>Email Address <b>*</b></span><input onChange={(event) => update("email", event.target.value)} placeholder="name@jewellery.com" required type="email" value={draft.email} /></label>
      <label><span>Role</span><select onChange={(event) => update("role", event.target.value)} value={draft.role}>{userRoles.map((role) => <option key={role}>{role}</option>)}</select></label>
      <label><span>Department</span><select onChange={(event) => update("department", event.target.value)} value={draft.department}>{userDepartments.map((department) => <option key={department}>{department}</option>)}</select></label>
      <label className={styles.span2}><span>Status</span><select onChange={(event) => update("status", event.target.value as UserStatus)} value={draft.status}><option>Active</option><option>Inactive</option></select></label>
      <div className={styles.modalActions}><button className={styles.resetButton} onClick={onCancel} type="button">Cancel</button><button className={styles.primaryButton} type="submit"><UserCheck aria-hidden="true" size={14} />{initial ? "Save Changes" : "Add User"}</button></div>
    </form>
  );
}

export function UserManagementScreen() {
  const [users, setUsers] = useState(initialManagedUsers);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [roleDraft, setRoleDraft] = useState("All");
  const [role, setRole] = useState("All");
  const [statusDraft, setStatusDraft] = useState<"All" | UserStatus>("All");
  const [status, setStatus] = useState<"All" | UserStatus>("All");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [dialog, setDialog] = useState<UserDialog | null>(null);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    inactive: users.filter((user) => user.status === "Inactive").length,
    admins: users.filter((user) => user.role === "Administrator").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !term || [user.name, user.email, user.role, user.department].some((value) => value.toLowerCase().includes(term));
      return matchesSearch && (role === "All" || user.role === role) && (status === "All" || user.status === status);
    });
  }, [role, search, status, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const start = (activePage - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(start, start + PAGE_SIZE);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchDraft);
    setRole(roleDraft);
    setStatus(statusDraft);
    setPage(1);
    setMessage("User filters applied.");
  }

  function resetFilters() {
    setSearchDraft("");
    setSearch("");
    setRoleDraft("All");
    setRole("All");
    setStatusDraft("All");
    setStatus("All");
    setPage(1);
    setMessage("User filters reset.");
  }

  function addUser(draft: UserDraft) {
    const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
    const user: ManagedUser = { ...draft, id: nextId, lastLoginDate: "Never", lastLoginTime: "—" };
    setUsers((current) => [...current, user]);
    setDialog(null);
    setMessage(`${user.name} was added.`);
  }

  function editUser(userId: number, draft: UserDraft) {
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, ...draft } : user));
    setDialog(null);
    setMessage(`${draft.name} was updated.`);
  }

  function toggleUser(user: ManagedUser) {
    const nextStatus: UserStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: nextStatus } : item));
    setOpenMenu(null);
    setMessage(`${user.name} is now ${nextStatus.toLowerCase()}.`);
  }

  function deleteUser(user: ManagedUser) {
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setDialog(null);
    setMessage(`${user.name} was removed.`);
  }

  return (
    <div className={`${styles.page} ${styles.userPage}`}>
      <PageHeader
        action={<button className={styles.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus aria-hidden="true" size={15} />Add User</button>}
        description="Home  ›  Settings  ›  User Management"
        title="User Management"
      />

      <section aria-label="User overview" className={`${styles.metricGrid} ${styles.userMetricGrid}`}>
        <Card className={styles.userMetric}><span className={`${styles.metricIcon} ${styles.blueIcon}`}><UsersRound aria-hidden="true" /></span><div><small>Total Users</small><strong>{metrics.total}</strong></div></Card>
        <Card className={styles.userMetric}><span className={`${styles.metricIcon} ${styles.greenIcon}`}><UserCheck aria-hidden="true" /></span><div><small>Active Users</small><strong>{metrics.active}</strong></div></Card>
        <Card className={styles.userMetric}><span className={`${styles.metricIcon} ${styles.redIcon}`}><UserRoundX aria-hidden="true" /></span><div><small>Inactive Users</small><strong>{metrics.inactive}</strong></div></Card>
        <Card className={styles.userMetric}><span className={`${styles.metricIcon} ${styles.violetIcon}`}><ShieldCheck aria-hidden="true" /></span><div><small>Administrators</small><strong>{metrics.admins}</strong></div></Card>
      </section>

      <Card className={styles.filterCard}>
        <form className={styles.userFilters} onSubmit={applyFilters}>
          <label className={styles.searchBox}><Search aria-hidden="true" size={15} /><span className="sr-only">Search users</span><input onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search by name, email or role..." type="search" value={searchDraft} /></label>
          <label><span>Role</span><select onChange={(event) => setRoleDraft(event.target.value)} value={roleDraft}><option>All</option>{userRoles.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Status</span><select onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}><option>All</option><option>Active</option><option>Inactive</option></select></label>
          <button className={styles.primaryButton} type="submit"><Search aria-hidden="true" size={14} />Search</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw aria-hidden="true" size={14} />Reset</button>
        </form>
      </Card>

      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>

      <Card className={`${styles.tableCard} ${styles.userTableCard}`}>
        <div className={styles.tableScroller}>
          <table className={`${styles.dataTable} ${styles.userTable}`}>
            <caption className="sr-only">System users</caption>
            <thead><tr><th>SL</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Action</th></tr></thead>
            <tbody>
              {visibleUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{start + index + 1}</td><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{user.role}</td><td>{user.department}</td><td><span className={`${styles.statusBadge} ${user.status === "Active" ? styles.active : styles.inactive}`}>{user.status}</span></td><td><span className={styles.lastLogin}>{user.lastLoginDate}<small>{user.lastLoginTime}</small></span></td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={styles.editButton} onClick={() => { setOpenMenu(null); setDialog({ mode: "edit", user }); }} type="button"><Pencil aria-hidden="true" size={12} />Edit</button>
                      <button aria-expanded={openMenu === user.id} aria-label={`More actions for ${user.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === user.id ? null : user.id)} type="button"><MoreVertical aria-hidden="true" size={15} /></button>
                      {openMenu === user.id ? <div className={styles.rowMenu} role="menu"><button onClick={() => { setOpenMenu(null); setDialog({ mode: "view", user }); }} role="menuitem" type="button"><Eye aria-hidden="true" size={13} />View details</button><button onClick={() => toggleUser(user)} role="menuitem" type="button"><Power aria-hidden="true" size={13} />Mark {user.status === "Active" ? "inactive" : "active"}</button><button className={styles.deleteMenuItem} onClick={() => { setOpenMenu(null); setDialog({ mode: "delete", user }); }} role="menuitem" type="button"><Trash2 aria-hidden="true" size={13} />Delete user</button></div> : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleUsers.length ? <tr><td className={styles.emptyRow} colSpan={8}>No users match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.paginationFooter}>
          <p>Showing {filteredUsers.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} entries</p>
          <nav aria-label="User table pages" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={14} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button aria-current={item === activePage ? "page" : undefined} key={item} onClick={() => setPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={14} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div className={styles.modalBackdrop} onKeyDown={(event) => { if (event.key === "Escape") setDialog(null); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section aria-labelledby="user-dialog-title" aria-modal="true" className={styles.modal} role={dialog.mode === "delete" ? "alertdialog" : "dialog"}>
            <header><div><h2 id="user-dialog-title">{dialog.mode === "add" ? "Add User" : dialog.mode === "edit" ? "Edit User" : dialog.mode === "view" ? "User Details" : "Delete User"}</h2><p>{dialog.mode === "delete" ? "This action removes the user from the mock list." : "Manage account and access information."}</p></div><button aria-label="Close user dialog" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={18} /></button></header>
            {dialog.mode === "add" ? <UserForm onCancel={() => setDialog(null)} onSave={addUser} /> : dialog.mode === "edit" ? <UserForm initial={dialog.user} key={dialog.user.id} onCancel={() => setDialog(null)} onSave={(draft) => editUser(dialog.user.id, draft)} /> : dialog.mode === "view" ? <div className={styles.detailUser}><span className={styles.userAvatar}><UserRound aria-hidden="true" size={28} /></span><strong>{dialog.user.name}</strong><small>{dialog.user.email}</small><dl className={styles.detailsList}><div><dt>Role</dt><dd>{dialog.user.role}</dd></div><div><dt>Department</dt><dd>{dialog.user.department}</dd></div><div><dt>Status</dt><dd><span className={`${styles.statusBadge} ${dialog.user.status === "Active" ? styles.active : styles.inactive}`}>{dialog.user.status}</span></dd></div><div><dt>Last Login</dt><dd>{dialog.user.lastLoginDate}, {dialog.user.lastLoginTime}</dd></div></dl><footer><button className={styles.resetButton} onClick={() => setDialog(null)} type="button">Close</button><button className={styles.primaryButton} onClick={() => setDialog({ mode: "edit", user: dialog.user })} type="button"><Pencil aria-hidden="true" size={13} />Edit User</button></footer></div> : <div className={styles.deleteConfirmation}><span><Trash2 aria-hidden="true" size={24} /></span><p>Delete <strong>{dialog.user.name}</strong>? This can be restored only by resetting the page.</p><div className={styles.modalActions}><button className={styles.resetButton} onClick={() => setDialog(null)} type="button">Cancel</button><button className={styles.dangerButton} onClick={() => deleteUser(dialog.user)} type="button">Delete User</button></div></div>}
          </section>
        </div>
      ) : null}
    </div>
  );
}
