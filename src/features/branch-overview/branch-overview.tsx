"use client";

import { ArrowRightLeft, CheckCircle2, Eye, FilePenLine, Plus, Send, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatBranchCurrency,
  initialBranchTransfers,
  initialOverviewBranches,
  type BranchTransfer,
  type OverviewBranch,
} from "./branch-overview-data";
import styles from "./branch-overview.module.css";

type BranchDialog = { mode: "view" | "edit"; branch: OverviewBranch } | { mode: "add" } | null;

function branchShortName(name: string) {
  if (name.startsWith("Main")) return "Dhaka";
  return name.replace(" Branch", "").replace(" (Dhaka)", "");
}

export function BranchOverview() {
  const [branches, setBranches] = useState<OverviewBranch[]>(() => initialOverviewBranches.map((branch) => ({ ...branch })));
  const [transfers, setTransfers] = useState<BranchTransfer[]>(() => [...initialBranchTransfers]);
  const [branchDialog, setBranchDialog] = useState<BranchDialog>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [prefilledFromId, setPrefilledFromId] = useState(initialOverviewBranches[0].id);
  const [selectedTransfer, setSelectedTransfer] = useState<BranchTransfer | null>(null);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => ({
    total: branches.length,
    active: branches.filter((branch) => branch.status === "Active").length,
    stockValue: branches.reduce((sum, branch) => sum + branch.stockValue, 0),
    staff: branches.reduce((sum, branch) => sum + branch.staff, 0),
  }), [branches]);
  const maxStock = Math.max(...branches.map((branch) => branch.stockValue), 1);
  const firstShare = totals.stockValue ? (branches[0]?.stockValue ?? 0) / totals.stockValue * 100 : 0;
  const secondShare = totals.stockValue ? (branches[1]?.stockValue ?? 0) / totals.stockValue * 100 : 0;
  const thirdShare = totals.stockValue ? (branches[2]?.stockValue ?? 0) / totals.stockValue * 100 : 0;
  const secondStop = firstShare + secondShare;
  const thirdStop = secondStop + thirdShare;
  const distributionBackground = `conic-gradient(#bd8215 0 ${firstShare}%, #347bdd ${firstShare}% ${secondStop}%, #1eb96c ${secondStop}% ${thirdStop}%, #d5d8dd ${thirdStop}% 100%)`;

  function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!branchDialog || branchDialog.mode === "view") return;
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id") ?? "");
    const nextBranch: OverviewBranch = {
      id: id || `BR-${String(branches.length + 1).padStart(3, "0")}`,
      name: String(form.get("name") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      manager: String(form.get("manager") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      status: String(form.get("status")) as OverviewBranch["status"],
      stockValue: Number(form.get("stockValue")) || 0,
      staff: Number(form.get("staff")) || 0,
    };
    setBranches((current) => id ? current.map((branch) => branch.id === id ? nextBranch : branch) : [...current, nextBranch]);
    setBranchDialog(null);
    setMessage(`${nextBranch.name} ${id ? "updated" : "added"} successfully.`);
  }

  function openTransfer(branch?: OverviewBranch) {
    setPrefilledFromId(branch?.id ?? branches[0]?.id ?? "");
    setTransferOpen(true);
  }

  function saveTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fromId = String(form.get("fromBranch"));
    const toId = String(form.get("toBranch"));
    const from = branches.find((branch) => branch.id === fromId);
    const to = branches.find((branch) => branch.id === toId);
    const items = Number(form.get("items"));
    if (!from || !to || from.id === to.id || !Number.isInteger(items) || items < 1) {
      setMessage("Choose different source and destination branches and enter at least one item.");
      return;
    }
    const dateValue = String(form.get("date"));
    const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateValue}T00:00:00Z`));
    const transfer: BranchTransfer = {
      id: `BT-${Date.now()}`,
      date,
      fromBranch: from.name.replace(" (Dhaka)", ""),
      toBranch: to.name,
      items,
      status: "Pending",
    };
    setTransfers((current) => [transfer, ...current]);
    setTransferOpen(false);
    setMessage(`${items} items queued for transfer from ${from.name} to ${to.name}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className="button button--primary" onClick={() => setBranchDialog({ mode: "add" })} type="button"><Plus aria-hidden="true" size={16} />Add Branch</button>}
        description="Manage multiple branches and their settings"
        title="Branch Management"
      />
      <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

      <section aria-label="Branch overview" className={styles.metrics}>
        <Card><p>Total Branches</p><strong>{totals.total}</strong></Card>
        <Card><p>Active Branches</p><strong className={styles.greenValue}>{totals.active}</strong></Card>
        <Card><p>Total Stock Value</p><strong>{formatBranchCurrency(totals.stockValue)}</strong></Card>
        <Card><p>Total Staff</p><strong>{totals.staff}</strong></Card>
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table className={styles.branchTable}>
            <caption className="sr-only">Jewellery branches</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Branch Name</th><th scope="col">Location</th><th scope="col">Manager</th><th scope="col">Phone</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>{branches.map((branch, index) => <tr key={branch.id}><td>{index + 1}</td><td><strong>{branch.name}</strong></td><td>{branch.location}</td><td>{branch.manager}</td><td>{branch.phone}</td><td><span className={`${styles.status} ${branch.status === "Active" ? styles.active : styles.inactive}`}>{branch.status}</span></td><td><div className={styles.rowActions}><button aria-label={`View ${branch.name}`} onClick={() => setBranchDialog({ mode: "view", branch })} title="View branch" type="button"><Eye size={14} /></button><button aria-label={`Edit ${branch.name}`} onClick={() => setBranchDialog({ mode: "edit", branch })} title="Edit branch" type="button"><FilePenLine size={14} /></button><button aria-label={`Transfer stock from ${branch.name}`} onClick={() => openTransfer(branch)} title="Create transfer" type="button"><Plus size={14} /></button></div></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <h2>Stock Value by Branch</h2>
          <div aria-label="Stock value by branch bar chart" className={styles.barChart} role="img">
            <div className={styles.yAxis}><span>200M</span><span>150M</span><span>100M</span><span>50M</span><span>0</span></div>
            <div className={styles.plot}>{branches.slice(0, 5).map((branch) => <div className={styles.barColumn} key={branch.id}><strong>{formatBranchCurrency(branch.stockValue)}</strong><span className={styles.bar} style={{ height: `${Math.max(7, branch.stockValue / maxStock * 100)}%` }} /><small>{branchShortName(branch.name)}</small></div>)}</div>
          </div>
        </Card>
        <Card className={styles.chartCard}>
          <h2>Stock Distribution</h2>
          <div className={styles.distribution}>
            <div aria-label="Branch stock distribution donut chart" className={styles.donut} role="img" style={{ background: distributionBackground }}><span>৳ {(Math.floor(totals.stockValue / 100_000) / 100).toFixed(2)}Cr</span></div>
            <ul>{branches.slice(0, 3).map((branch, index) => <li key={branch.id}><i className={styles[`key${index + 1}`]} /><span>{branchShortName(branch.name)}</span><strong>{totals.stockValue ? (branch.stockValue / totals.stockValue * 100).toFixed(1) : "0.0"}%</strong></li>)}</ul>
          </div>
        </Card>
      </div>

      <Card className={styles.transferCard}>
        <div className={styles.sectionHeader}><h2>Branch Transfer</h2><button onClick={() => openTransfer()} type="button"><ArrowRightLeft size={14} />New Transfer</button></div>
        <div className={styles.tableScroller}><table className={styles.transferTable}><caption className="sr-only">Recent branch transfers</caption><thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">From Branch</th><th scope="col">To Branch</th><th scope="col">Items</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>{transfers.map((transfer, index) => <tr key={transfer.id}><td>{index + 1}</td><td>{transfer.date}</td><td>{transfer.fromBranch}</td><td>{transfer.toBranch}</td><td>{transfer.items}</td><td><span className={`${styles.status} ${transfer.status === "Completed" ? styles.active : styles.pending}`}>{transfer.status}</span></td><td><button aria-label={`View transfer ${transfer.id}`} className={styles.viewTransfer} onClick={() => setSelectedTransfer(transfer)} title="View transfer" type="button"><Eye size={14} /></button></td></tr>)}</tbody></table></div>
      </Card>

      {branchDialog ? <BranchModal dialog={branchDialog} onClose={() => setBranchDialog(null)} onSubmit={saveBranch} /> : null}
      {transferOpen ? <TransferModal branches={branches} fromId={prefilledFromId} onClose={() => setTransferOpen(false)} onSubmit={saveTransfer} /> : null}
      {selectedTransfer ? <TransferDetails onClose={() => setSelectedTransfer(null)} transfer={selectedTransfer} /> : null}
    </div>
  );
}

function BranchModal({ dialog, onClose, onSubmit }: { dialog: Exclude<BranchDialog, null>; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const branch = dialog.mode === "add" ? undefined : dialog.branch;
  const viewOnly = dialog.mode === "view";
  return <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card aria-labelledby="branch-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="branch-dialog-title">{viewOnly ? "Branch Details" : branch ? "Edit Branch" : "Add Branch"}</h2><p>{branch?.id ?? "Create a new operational branch."}</p></div><button aria-label="Close branch dialog" onClick={onClose} type="button"><X size={19} /></button></div><form onSubmit={onSubmit}><input name="id" type="hidden" value={branch?.id ?? ""} /><div className={styles.formGrid}><label><span>Branch Name</span><input autoFocus={!viewOnly} className="field" defaultValue={branch?.name ?? ""} disabled={viewOnly} name="name" required /></label><label><span>Location</span><input className="field" defaultValue={branch?.location ?? ""} disabled={viewOnly} name="location" required /></label><label><span>Manager</span><input className="field" defaultValue={branch?.manager ?? ""} disabled={viewOnly} name="manager" required /></label><label><span>Phone</span><input className="field" defaultValue={branch?.phone ?? ""} disabled={viewOnly} name="phone" required /></label><label><span>Stock Value</span><input className="field" defaultValue={branch?.stockValue ?? 0} disabled={viewOnly} min="0" name="stockValue" type="number" /></label><label><span>Staff</span><input className="field" defaultValue={branch?.staff ?? 0} disabled={viewOnly} min="0" name="staff" type="number" /></label><label className={styles.fullField}><span>Status</span><select className="select" defaultValue={branch?.status ?? "Active"} disabled={viewOnly} name="status"><option>Active</option><option>Inactive</option></select></label></div><div className={styles.modalActions}><button className="button" onClick={onClose} type="button">{viewOnly ? "Close" : "Cancel"}</button>{viewOnly ? null : <button className="button button--primary" type="submit"><CheckCircle2 size={15} />Save Branch</button>}</div></form></Card></div>;
}

function TransferModal({ branches, fromId, onClose, onSubmit }: { branches: OverviewBranch[]; fromId: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const defaultTo = branches.find((branch) => branch.id !== fromId)?.id ?? "";
  return <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card aria-labelledby="transfer-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog"><div className={styles.modalHeader}><div><h2 id="transfer-dialog-title">New Branch Transfer</h2><p>Move inventory items between branches.</p></div><button aria-label="Close transfer dialog" onClick={onClose} type="button"><X size={19} /></button></div><form onSubmit={onSubmit}><div className={styles.formGrid}><label><span>From Branch</span><select className="select" defaultValue={fromId} name="fromBranch">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><label><span>To Branch</span><select className="select" defaultValue={defaultTo} name="toBranch">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><label><span>Transfer Date</span><input className="field" defaultValue="2025-04-30" name="date" required type="date" /></label><label><span>Total Items</span><input className="field" defaultValue="1" min="1" name="items" required step="1" type="number" /></label></div><div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className="button button--primary" type="submit"><Send size={15} />Submit Transfer</button></div></form></Card></div>;
}

function TransferDetails({ transfer, onClose }: { transfer: BranchTransfer; onClose: () => void }) {
  return <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><Card aria-labelledby="transfer-details-title" aria-modal="true" as="section" className={`${styles.modal} ${styles.detailsModal}`} role="dialog"><div className={styles.modalHeader}><div><h2 id="transfer-details-title">Transfer Details</h2><p>{transfer.id}</p></div><button aria-label="Close transfer details" onClick={onClose} type="button"><X size={19} /></button></div><dl className={styles.detailList}><div><dt>Date</dt><dd>{transfer.date}</dd></div><div><dt>From</dt><dd>{transfer.fromBranch}</dd></div><div><dt>To</dt><dd>{transfer.toBranch}</dd></div><div><dt>Items</dt><dd>{transfer.items}</dd></div><div><dt>Status</dt><dd>{transfer.status}</dd></div></dl><div className={styles.modalActions}><button className="button button--primary" onClick={onClose} type="button">Done</button></div></Card></div>;
}
