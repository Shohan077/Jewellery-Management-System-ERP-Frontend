"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Eye, Pencil, Plus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  base,
  Button,
  Donut,
  Feedback,
  Intro,
  type Metric,
  Metrics,
  Modal,
  Pager,
  Status,
  Tabs,
} from "../reference-73/shared";
import styles from "./user-role-management.module.css";

type UserStatus = "Active" | "Inactive";
type User = {
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  lastLogin: string;
};

const tabs = ["All Users", "Roles & Permissions", "Login History"] as const;
type Tab = (typeof tabs)[number];

const metrics: Metric[] = [
  { label: "Total Users", value: "24", note: "All Users" },
  { label: "Active Users", value: "20", trend: "83.3%", note: "" },
  { label: "Inactive Users", value: "4", trend: "16.7%", note: "" },
  { label: "Admin Users", value: "6", trend: "25.0%", note: "" },
  { label: "Staff Users", value: "18", trend: "75.0%", note: "" },
];

const seedUsers: User[] = [
  { name: "Admin", email: "admin@example.com", role: "Super Admin", department: "Management", status: "Active", lastLogin: "26 May 2025 10:30 AM" },
  { name: "Rahim Ahmed", email: "rahim@example.com", role: "Manager", department: "Sales", status: "Active", lastLogin: "26 May 2025 06:45 AM" },
  { name: "Sadia Akter", email: "sadia@example.com", role: "Sales Executive", department: "POS", status: "Active", lastLogin: "26 May 2025 09:20 AM" },
  { name: "Karim Uddin", email: "karim@example.com", role: "Purchase Manager", department: "Purchase", status: "Active", lastLogin: "26 May 2025 06:15 PM" },
  { name: "Nusrat Jahan", email: "nusrat@example.com", role: "Accountant", department: "Accounts", status: "Active", lastLogin: "25 May 2025 05:40 PM" },
  { name: "Arif Hossain", email: "arif@example.com", role: "Karigar", department: "Manufacturing", status: "Active", lastLogin: "25 May 2025 04:20 PM" },
  { name: "Salim Karigar", email: "salim@example.com", role: "Karigar", department: "Manufacturing", status: "Active", lastLogin: "25 May 2025 03:10 PM" },
  { name: "Monir Islam", email: "monir@example.com", role: "Staff", department: "Inventory", status: "Inactive", lastLogin: "24 May 2025 11:25 AM" },
  { name: "Farhana Islam", email: "farhana@example.com", role: "Sales Executive", department: "Sales", status: "Active", lastLogin: "24 May 2025 10:05 AM" },
  { name: "Mahmud Hasan", email: "mahmud@example.com", role: "Manager", department: "Operations", status: "Active", lastLogin: "24 May 2025 09:48 AM" },
  { name: "Jannatul Ferdous", email: "jannatul@example.com", role: "Accountant", department: "Accounts", status: "Active", lastLogin: "23 May 2025 06:40 PM" },
  { name: "Shakil Ahmed", email: "shakil@example.com", role: "Sales Executive", department: "POS", status: "Active", lastLogin: "23 May 2025 05:30 PM" },
  { name: "Ayesha Khan", email: "ayesha@example.com", role: "Staff", department: "Inventory", status: "Inactive", lastLogin: "23 May 2025 03:22 PM" },
  { name: "Fahim Ahmed", email: "fahim@example.com", role: "Sales Executive", department: "Sales", status: "Active", lastLogin: "22 May 2025 02:50 PM" },
  { name: "Abdul Karim", email: "abdul@example.com", role: "Super Admin", department: "Management", status: "Active", lastLogin: "22 May 2025 01:30 PM" },
  { name: "Mizanur Rahman", email: "mizanur@example.com", role: "Manager", department: "Purchase", status: "Active", lastLogin: "22 May 2025 11:15 AM" },
  { name: "Nabila Sultana", email: "nabila@example.com", role: "Accountant", department: "Accounts", status: "Active", lastLogin: "21 May 2025 05:10 PM" },
  { name: "Imran Hossain", email: "imran@example.com", role: "Karigar", department: "Manufacturing", status: "Active", lastLogin: "21 May 2025 03:45 PM" },
  { name: "Tahmina Akter", email: "tahmina@example.com", role: "Sales Executive", department: "POS", status: "Active", lastLogin: "21 May 2025 02:25 PM" },
  { name: "Kamal Uddin", email: "kamal@example.com", role: "Manager", department: "Operations", status: "Inactive", lastLogin: "20 May 2025 06:05 PM" },
  { name: "Rafiq Islam", email: "rafiq@example.com", role: "Sales Executive", department: "Sales", status: "Active", lastLogin: "20 May 2025 04:20 PM" },
  { name: "Molla Hossain", email: "molla@example.com", role: "Super Admin", department: "Management", status: "Active", lastLogin: "20 May 2025 01:40 PM" },
  { name: "Abu Sayed", email: "abusayed@example.com", role: "Super Admin", department: "Management", status: "Active", lastLogin: "19 May 2025 11:30 AM" },
  { name: "Nasima Begum", email: "nasima@example.com", role: "Super Admin", department: "Management", status: "Inactive", lastLogin: "19 May 2025 09:18 AM" },
];

const roleCards = [
  ["Super Admin", "6 users", "Full system access"],
  ["Manager", "4 users", "Business operations"],
  ["Sales Executive", "6 users", "Sales and customer access"],
  ["Accountant", "3 users", "Accounting and reports"],
  ["Karigar", "3 users", "Production access"],
  ["Staff", "2 users", "Limited operational access"],
] as const;

function LoginChart({ className = "" }: { className?: string }) {
  const values = [8, 12, 15, 17, 18, 20, 24];
  const labels = ["20 May", "21 May", "22 May", "23 May", "24 May", "25 May", "26 May"];
  const points = values.map((value, index) => `${42 + index * 43},${117 - value * 4}`).join(" ");

  return (
    <div className={`${styles.chart} ${className}`.trim()}>
      <svg aria-label="Login activity during the last seven days" role="img" viewBox="0 0 320 145">
        {[0, 5, 10, 15, 20, 25].map((value) => (
          <g key={value}>
            <line x1="38" x2="303" y1={117 - value * 4} y2={117 - value * 4} />
            <text x="10" y={120 - value * 4}>{value}</text>
          </g>
        ))}
        {labels.map((label, index) => <text key={label} x={29 + index * 43} y="139">{label}</text>)}
        <polyline points={points} />
        {values.map((value, index) => <circle cx={42 + index * 43} cy={117 - value * 4} key={labels[index]} r="2.6" />)}
      </svg>
    </div>
  );
}

function AddUserForm({ onClose, onSave }: { onClose: () => void; onSave: (user: User) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      name: String(form.get("name")),
      email: String(form.get("email")),
      role: String(form.get("role")),
      department: String(form.get("department")),
      status: String(form.get("status")) as UserStatus,
      lastLogin: "Never",
    });
  }

  return (
    <Modal description="Create a user account and assign its access level." onClose={onClose} title="Add New User">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Full name</span><input autoFocus name="name" placeholder="User name" required /></label>
        <label><span>Email address</span><input name="email" placeholder="name@example.com" required type="email" /></label>
        <label><span>Role</span><select name="role"><option>Staff</option><option>Sales Executive</option><option>Accountant</option><option>Karigar</option><option>Manager</option><option>Super Admin</option></select></label>
        <label><span>Department</span><select name="department"><option>Inventory</option><option>Sales</option><option>POS</option><option>Purchase</option><option>Accounts</option><option>Manufacturing</option><option>Management</option></select></label>
        <label><span>Status</span><select name="status"><option>Active</option><option>Inactive</option></select></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Save User</Button></footer>
      </form>
    </Modal>
  );
}

function RolesView() {
  return (
    <Card className={styles.alternatePanel}>
      <header><h2>Roles &amp; Permissions</h2><p>Review role assignments and access scope.</p></header>
      <div className={styles.roleGrid}>{roleCards.map(([role, users, note]) => <article key={role}><strong>{role}</strong><b>{users}</b><span>{note}</span></article>)}</div>
    </Card>
  );
}

function HistoryView() {
  return (
    <Card className={styles.alternatePanel}>
      <header><h2>Login History</h2><p>Successful user logins during the last seven days.</p></header>
      <LoginChart className={styles.largeChart} />
    </Card>
  );
}

export function Reference77UserRoleManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("All Users");
  const [users, setUsers] = useState(seedUsers);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [message, setMessage] = useState("");
  const pageCount = Math.max(1, Math.ceil(users.length / 8));
  const activePage = Math.min(page, pageCount);
  const visibleUsers = useMemo(() => users.slice((activePage - 1) * 8, activePage * 8), [activePage, users]);

  function addUser(user: User) {
    setUsers((current) => [...current, user]);
    setShowAdd(false);
    setPage(Math.ceil((users.length + 1) / 8));
    setMessage(`${user.name} was added successfully.`);
  }

  return (
    <div className={base.page}>
      <Intro
        actions={<Button onClick={() => setShowAdd(true)} primary><Plus size={13} />Add New User</Button>}
        description="Manage system users, roles and permissions."
        title="User & Role Management"
      />
      <Card className={styles.tabCard}><Tabs active={activeTab} onChange={(tab) => setActiveTab(tab)} tabs={tabs} /></Card>
      {activeTab === "All Users" ? (
        <>
          <Metrics rows={metrics} />
          <Card className={styles.userCard}>
            <div className={base.tableScroller}>
              <table className={`${base.dataTable} ${styles.userTable}`}>
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Action</th></tr></thead>
                <tbody>{visibleUsers.map((user, index) => (
                  <tr key={user.email}>
                    <td>{(activePage - 1) * 8 + index + 1}</td><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.department}</td>
                    <td><Status tone={user.status === "Active" ? "success" : "danger"}>{user.status}</Status></td><td>{user.lastLogin}</td>
                    <td><span className={base.rowActions}><button aria-label={`Edit ${user.name}`} className={base.iconButton} onClick={() => setMessage(`${user.name} is ready to edit.`)}><Pencil size={12} /></button><button aria-label={`View ${user.name}`} className={base.iconButton} onClick={() => setMessage(`${user.name}: ${user.role}, ${user.department}.`)}><Eye size={12} /></button></span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <footer className={base.tableFooter}><span>Showing {(activePage - 1) * 8 + 1} to {Math.min(activePage * 8, users.length)} of {users.length} entries</span><Pager current={activePage} last={pageCount} onChange={setPage} /></footer>
          </Card>
          <section className={styles.bottomGrid}>
            <Card className={`${styles.panel} ${styles.rolePanel}`}><h2>Users by Role</h2><Donut center={String(users.length)} label="Total Users" slices={[
              { label: "Super Admin", value: 25, color: "#126de8", note: "25.0% (6)" },
              { label: "Manager", value: 16.7, color: "#25a6e5", note: "16.7% (4)" },
              { label: "Sales Executive", value: 25, color: "#11a566", note: "25.0% (6)" },
              { label: "Accountant", value: 12.5, color: "#f4ac20", note: "12.5% (3)" },
              { label: "Karigar", value: 12.5, color: "#ef6d2d", note: "12.5% (3)" },
              { label: "Staff", value: 8.3, color: "#8b55d8", note: "8.3% (2)" },
            ]} /></Card>
            <Card className={styles.panel}><h2>Login Activity (Last 7 Days)</h2><LoginChart /></Card>
            <Card className={`${styles.panel} ${styles.securityPanel}`}><h2>System Security</h2><ul>
              <li><CheckCircle2 size={13} /><span>Two Factor Auth</span><b>Enabled</b></li>
              <li><CheckCircle2 size={13} /><span>Login Protection</span><b>Active</b></li>
              <li><CheckCircle2 size={13} /><span>Data Encryption</span><b>Active</b></li>
              <li><CheckCircle2 size={13} /><span>Auto Backup</span><b>Active</b></li>
            </ul></Card>
          </section>
        </>
      ) : activeTab === "Roles & Permissions" ? <RolesView /> : <HistoryView />}
      <Feedback text={message} />
      {showAdd ? <AddUserForm onClose={() => setShowAdd(false)} onSave={addUser} /> : null}
    </div>
  );
}
