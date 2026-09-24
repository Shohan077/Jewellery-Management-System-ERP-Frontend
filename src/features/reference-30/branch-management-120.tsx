"use client";

import { Building2, Eye, GitCompareArrows, Pencil, Plus, Save, Search, UsersRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { initialBranches, type BranchRecord } from "./reference-30-data";
import styles from "./reference-30.module.css";

type BranchDraft = Omit<BranchRecord, "id" | "openingDate">;
const emptyDraft: BranchDraft = { code: "", name: "", manager: "", phone: "", city: "Ahmedabad", active: true, email: "", address: "", warehouse: "Main Warehouse", invoicePrefix: "", goldRateSource: "Manual Entry" };

export function BranchManagement120() {
  const [branches, setBranches] = useState<BranchRecord[]>(initialBranches);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [editingId, setEditingId] = useState<number | null>(2);
  const [draft, setDraft] = useState<BranchDraft>(() => { const branch = initialBranches[1]; const { id: _id, openingDate: _openingDate, ...rest } = branch; void _id; void _openingDate; return rest; });
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => branches.filter((branch) => {
    const matchText = `${branch.name} ${branch.code} ${branch.city} ${branch.manager}`.toLowerCase().includes(query.toLowerCase());
    const matchStatus = status === "All" || (status === "Active" ? branch.active : !branch.active);
    return matchText && matchStatus;
  }), [branches, query, status]);

  function edit(branch: BranchRecord) { const { id, openingDate, ...rest } = branch; void openingDate; setEditingId(id); setDraft(rest); setMessage(`Editing ${branch.name}.`); }
  function startNew() { setEditingId(null); setDraft({ ...emptyDraft, code: `BR${String(branches.length + 1).padStart(3, "0")}` }); setMessage("New branch form ready."); }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name || !draft.code || !draft.manager || !draft.phone || !draft.address) { setMessage("Complete all required branch fields."); return; }
    if (editingId) { setBranches((current) => current.map((branch) => branch.id === editingId ? { ...branch, ...draft } : branch)); setMessage(`${draft.name} updated.`); }
    else { const next: BranchRecord = { id: Date.now(), openingDate: new Intl.DateTimeFormat("en-GB").format(new Date()), ...draft }; setBranches((current) => [...current, next]); setEditingId(next.id); setMessage(`${next.name} added.`); }
    localStorage.setItem("reference-30-branches", JSON.stringify(branches));
  }

  return <div className={styles.page}>
    <header className={styles.screenTitle}><h1>Screen 120 – Branch Management</h1></header>
    <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    <section className={styles.branchMetrics}><Card><Building2 size={26} /><div><small>Total Branches</small><strong>{branches.length}</strong></div></Card><Card><Building2 size={26} /><div><small>Active Branches</small><strong>{branches.filter((branch) => branch.active).length}</strong></div></Card><Card><UsersRound size={26} /><div><small>Total Staff</small><strong>42</strong></div></Card><Card><GitCompareArrows size={26} /><div><small>Branch Transfers <span>(This Month)</span></small><strong>12</strong></div></Card></section>
    <div className={styles.branchLayout}><Card className={styles.branchList}><h2>Branch List</h2><div className={styles.branchToolbar}><label><Search size={14} /><input placeholder="Search branch by name, code, city..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><select aria-label="Filter branches by status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option>All</option><option>Active</option><option>Inactive</option></select><button className={styles.primaryButton} onClick={startNew} type="button"><Plus size={14} />Add Branch</button></div><div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Branch Code</th><th>Branch Name</th><th>Manager</th><th>Phone</th><th>City</th><th>Opening Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((branch) => <tr key={branch.id}><td><strong>{branch.code}</strong></td><td>{branch.name}</td><td>{branch.manager}</td><td>{branch.phone}</td><td>{branch.city}</td><td>{branch.openingDate}</td><td><span className={branch.active ? styles.activeText : styles.inactiveText}>{branch.active ? "Active" : "Inactive"}</span></td><td><div className={styles.iconActions}><button aria-label={`View ${branch.name}`} onClick={() => setMessage(`${branch.name}: ${branch.address}`)} type="button"><Eye size={12} /></button><button aria-label={`Edit ${branch.name}`} onClick={() => edit(branch)} type="button"><Pencil size={12} /></button></div></td></tr>)}</tbody></table></div><footer className={styles.branchFooter}><span>Showing 1 to {filtered.length} of {filtered.length} entries</span><div><button disabled type="button">First</button><button className={styles.currentPage} type="button">1</button><button disabled type="button">Last</button></div></footer></Card>
      <Card className={styles.branchEditor}><h2>Add / Edit Branch</h2><form onSubmit={save}><div className={styles.twoFields}><Field label="Branch Name" required><input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></Field><Field label="Branch Code" required><input value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} /></Field></div><Field label="Manager" required><select value={draft.manager} onChange={(event) => setDraft((current) => ({ ...current, manager: event.target.value }))}><option value="">Select manager</option>{["Amit Shah", "Rajesh Patel", "Meena Joshi", "Vikram Desai", "Pooja Sharma"].map((item) => <option key={item}>{item}</option>)}</select></Field><div className={styles.twoFields}><Field label="Contact Number" required><input value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /></Field><Field label="Email"><input type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /></Field></div><Field label="Address" required><textarea value={draft.address} onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))} /></Field><Field label="Warehouse / Stock Link"><select value={draft.warehouse} onChange={(event) => setDraft((current) => ({ ...current, warehouse: event.target.value }))}><option>Main Warehouse</option><option>CG Warehouse</option><option>Surat Warehouse</option><option>Vadodara Warehouse</option></select></Field><div className={styles.twoFields}><Field label="Default Invoice Prefix"><input value={draft.invoicePrefix} onChange={(event) => setDraft((current) => ({ ...current, invoicePrefix: event.target.value }))} /></Field><Field label="Audit"><input readOnly value={editingId ? "Updated today" : "New branch"} /></Field></div><Field label="Default Gold Rate Source"><select value={draft.goldRateSource} onChange={(event) => setDraft((current) => ({ ...current, goldRateSource: event.target.value }))}><option>Manual Entry</option><option>Head Office</option></select></Field><Toggle checked={draft.active} label="Status" onChange={(value) => setDraft((current) => ({ ...current, active: value }))} /><footer><button className={styles.primaryButton} type="submit"><Save size={14} />Save Branch</button><button className={styles.secondaryButton} onClick={() => editingId && edit(branches.find((branch) => branch.id === editingId) ?? branches[0])} type="button">Cancel</button></footer></form></Card>
    </div>
  </div>;
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) { return <label className={styles.field}><span>{label}{required ? <b> *</b> : null}</span>{children}</label>; }
function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <label className={styles.toggle}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i /></label>; }
