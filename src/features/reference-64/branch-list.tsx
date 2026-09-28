"use client";

import { useMemo, useState, type FormEvent } from "react";
import { BadgeCheck, Building2, CircleDollarSign, FilePenLine, PackageOpen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal, StatusBadge } from "@/features/reference-55/shared";
import base from "@/features/reference-55/reference-55.module.css";
import { DonutReport } from "@/features/reference-ui/report-visuals";
import { branchSeed, type BranchRecord } from "./data";
import { BranchBarChart, MetricCard, PanelHeading, ResponsiveTable } from "./shared";
import styles from "./reference-64.module.css";

const branchColors = ["#1769df", "#4d91e5", "#f2aa22", "#ef5b4d", "#55c38b", "#8d78db"] as const;

function number(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function Reference64BranchList() {
  const [rows, setRows] = useState<BranchRecord[]>(branchSeed);
  const [editing, setEditing] = useState<BranchRecord | null>(null);
  const [message, setMessage] = useState("");
  const totalSales = rows.reduce((sum, row) => sum + row.sales, 0);
  const totalStock = rows.reduce((sum, row) => sum + row.stock, 0);
  const activeBranches = rows.filter((row) => row.status === "Active").length;
  const stockSlices = useMemo(() => rows.map((row, index) => ({ color: branchColors[index % branchColors.length], label: row.name, value: totalStock ? Number((row.stock / totalStock * 100).toFixed(2)) : 0 })), [rows, totalStock]);

  function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const next: BranchRecord = {
      ...editing,
      name: String(form.get("name")), manager: String(form.get("manager")), phone: String(form.get("phone")), email: String(form.get("email")),
      sales: Number(form.get("sales")), stock: Number(form.get("stock")), status: String(form.get("status")) as BranchRecord["status"],
    };
    setRows((current) => current.map((row) => row.id === next.id ? next : row));
    setMessage(`${next.name} updated successfully.`);
    setEditing(null);
  }

  function removeBranch(row: BranchRecord) {
    setRows((current) => current.filter((item) => item.id !== row.id));
    setMessage(`${row.name} removed from the branch list.`);
  }

  return (
    <div className={styles.page}>
      <section className={styles.fourMetrics}>
        <MetricCard icon={<Building2 size={18} />} label="Total Branches" note="All Branches" value={rows.length} />
        <MetricCard accent="green" icon={<BadgeCheck size={18} />} label="Active Branches" note={`${rows.length ? Math.round(activeBranches / rows.length * 100) : 0}%`} value={activeBranches} />
        <MetricCard icon={<CircleDollarSign size={18} />} label="Total Sales (This Month)" value={`৳ ${number(totalSales)}`} />
        <MetricCard accent="violet" icon={<PackageOpen size={18} />} label="Total Stock Value" value={`৳ ${number(totalStock)}`} />
      </section>

      {message ? <Feedback>{message}</Feedback> : null}

      <Card className={styles.tableCard}>
        <ResponsiveTable label="Jewellery branches" minWidth={1040}>
          <thead><tr><th>#</th><th>Branch Name</th><th>Manager</th><th>Phone</th><th>Email</th><th className={styles.numeric}>Total Sales (৳)</th><th className={styles.numeric}>Stock Value (৳)</th><th>Status</th><th className={styles.centered}>Action</th></tr></thead>
          <tbody>
            {rows.length ? rows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td><strong>{row.name}</strong></td><td>{row.manager}</td><td>{row.phone}</td><td>{row.email}</td><td className={styles.numeric}>৳ {number(row.sales)}</td><td className={styles.numeric}>৳ {number(row.stock)}</td><td><StatusBadge tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusBadge></td><td className={styles.centered}><span className={base.rowActions}><IconAction label={`Edit ${row.name}`} onClick={() => setEditing(row)}><FilePenLine size={12} /></IconAction><IconAction danger label={`Delete ${row.name}`} onClick={() => removeBranch(row)}><Trash2 size={12} /></IconAction></span></td></tr>) : <tr><td className={styles.emptyCell} colSpan={9}>No branches are available.</td></tr>}
          </tbody>
        </ResponsiveTable>
      </Card>

      <section className={styles.branchBottom}>
        <Card className={styles.branchChartCard}><PanelHeading meta="(This Month)">Sales by Branch</PanelHeading><BranchBarChart rows={rows} /></Card>
        <Card className={styles.stockCard}><PanelHeading>Stock Value by Branch</PanelHeading><div className={styles.stockDonut}><DonutReport centerLabel="Total Stock Value" centerValue={`৳ ${number(totalStock)}`} slices={stockSlices} /></div></Card>
      </section>

      {editing ? (
        <Modal description={editing.email} onClose={() => setEditing(null)} title={`Edit ${editing.name}`}>
          <form className={base.formGrid} onSubmit={saveBranch}>
            <label><span>Branch Name</span><input defaultValue={editing.name} name="name" required /></label><label><span>Manager</span><input defaultValue={editing.manager} name="manager" required /></label>
            <label><span>Phone</span><input defaultValue={editing.phone} name="phone" required /></label><label><span>Email</span><input defaultValue={editing.email} name="email" required type="email" /></label>
            <label><span>Total Sales (৳)</span><input defaultValue={editing.sales} min="0" name="sales" required type="number" /></label><label><span>Stock Value (৳)</span><input defaultValue={editing.stock} min="0" name="stock" required type="number" /></label>
            <label className={base.fullField}><span>Status</span><select defaultValue={editing.status} name="status"><option>Active</option><option>Inactive</option></select></label>
            <footer className={base.modalActions}><button className={base.secondaryButton} onClick={() => setEditing(null)} type="button">Cancel</button><button className={base.primaryButton} type="submit">Save Branch</button></footer>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

