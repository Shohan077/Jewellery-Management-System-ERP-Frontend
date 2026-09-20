"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatPurchaseSupplierMoney,
  type PurchaseSupplier,
  type PurchaseSupplierStatus,
} from "./supplier-data";
import { useSupplierStore, type SupplierCollection } from "./use-supplier-store";
import styles from "./supplier-list.module.css";

type SupplierListVariant = "directory" | "management";
type SupplierDialogState = { mode: "add" } | { mode: "edit"; supplier: PurchaseSupplier } | null;

const PAGE_SIZES: Record<SupplierListVariant, number> = { directory: 8, management: 7 };

function DialogShell({ children, labelId, onClose }: { children: React.ReactNode; labelId: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div aria-labelledby={labelId} aria-modal="true" className={styles.dialog} ref={dialogRef} role="dialog">
        {children}
      </div>
    </div>
  );
}

function SupplierFormDialog({
  state,
  onClose,
  onSave,
}: {
  state: Exclude<SupplierDialogState, null>;
  onClose: () => void;
  onSave: (supplier: Omit<PurchaseSupplier, "code">) => void;
}) {
  const supplier = state.mode === "edit" ? state.supplier : undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const location = String(form.get("location") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    onSave({
      name: String(form.get("name") ?? "").trim(),
      contactPerson: String(form.get("contactPerson") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      location,
      address: address || location,
      dueAmount: Number(form.get("dueAmount") ?? 0),
      status: String(form.get("status")) as PurchaseSupplierStatus,
    });
  }

  return (
    <DialogShell labelId="supplier-form-title" onClose={onClose}>
      <div className={styles.dialogHeader}>
        <div>
          <h2 id="supplier-form-title">{state.mode === "add" ? "Add Supplier" : "Edit Supplier"}</h2>
          <p>{state.mode === "add" ? "Create a supplier record for purchase management." : `Update ${supplier?.name}.`}</p>
        </div>
        <button aria-label="Close supplier form" className={styles.iconButton} onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form className={styles.dialogForm} onSubmit={submit}>
        <label><span>Supplier Name</span><input autoFocus className="field" defaultValue={supplier?.name} name="name" required /></label>
        <label><span>Contact Person</span><input className="field" defaultValue={supplier?.contactPerson} name="contactPerson" required /></label>
        <label><span>Phone</span><input className="field" defaultValue={supplier?.phone} inputMode="tel" name="phone" required /></label>
        <label><span>Email</span><input className="field" defaultValue={supplier?.email} name="email" required type="email" /></label>
        <label><span>Location</span><input className="field" defaultValue={supplier?.location} name="location" required /></label>
        <label><span>Due Amount (৳)</span><input className="field" defaultValue={supplier?.dueAmount ?? 0} min="0" name="dueAmount" step="1" type="number" /></label>
        <label className={styles.fullField}><span>Address</span><input className="field" defaultValue={supplier?.address} name="address" /></label>
        <label className={styles.fullField}><span>Status</span><select className="select" defaultValue={supplier?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
        <div className={styles.dialogActions}>
          <button className="button" onClick={onClose} type="button">Cancel</button>
          <button className="button button--primary" type="submit">{state.mode === "add" ? "Add Supplier" : "Save Changes"}</button>
        </div>
      </form>
    </DialogShell>
  );
}

function DeleteDialog({ supplier, onClose, onConfirm }: { supplier: PurchaseSupplier; onClose: () => void; onConfirm: () => void }) {
  return (
    <DialogShell labelId="delete-supplier-title" onClose={onClose}>
      <div className={styles.dialogHeader}>
        <div><h2 id="delete-supplier-title">Delete supplier?</h2><p>This removes {supplier.name} from this list. The change is saved in this browser.</p></div>
        <button aria-label="Close delete confirmation" className={styles.iconButton} onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <div className={styles.confirmActions}>
        <button className="button" onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.dangerButton} button`} onClick={onConfirm} type="button"><Trash2 size={15} />Delete</button>
      </div>
    </DialogShell>
  );
}

function StatusBadge({ status }: { status: PurchaseSupplierStatus }) {
  return <span className={`${styles.status} ${status === "Active" ? styles.active : styles.inactive}`}>{status}</span>;
}

export function SupplierListPage({ variant }: { variant: SupplierListVariant }) {
  const collection: SupplierCollection = variant;
  const { records, saveRecords } = useSupplierStore(collection);
  const pageSize = PAGE_SIZES[variant];
  const management = variant === "management";
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [statusDraft, setStatusDraft] = useState<"All Status" | PurchaseSupplierStatus>("All Status");
  const [status, setStatus] = useState<"All Status" | PurchaseSupplierStatus>("All Status");
  const [locationDraft, setLocationDraft] = useState("All Locations");
  const [location, setLocation] = useState("All Locations");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<SupplierDialogState>(null);
  const [pendingDelete, setPendingDelete] = useState<PurchaseSupplier | null>(null);
  const [message, setMessage] = useState("");

  const locations = useMemo(() => [...new Set(records.map((supplier) => supplier.location))].sort(), [records]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((supplier) => {
      const matchesSearch = !needle || [supplier.name, supplier.contactPerson, supplier.phone, supplier.email, supplier.location]
        .some((value) => value.toLowerCase().includes(needle));
      const matchesStatus = status === "All Status" || supplier.status === status;
      const matchesLocation = location === "All Locations" || supplier.location === location;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [location, query, records, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const first = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const last = Math.min(safePage * pageSize, filtered.length);
  const pageRows = filtered.slice(first ? first - 1 : 0, last);

  function applyFilters(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setQuery(queryDraft);
    setStatus(statusDraft);
    setLocation(locationDraft);
    setPage(1);
    setFilterOpen(false);
    setMessage("Supplier filters applied.");
  }

  function saveSupplier(value: Omit<PurchaseSupplier, "code">) {
    if (dialog?.mode === "edit") {
      saveRecords(records.map((record) => record.code === dialog.supplier.code ? { ...value, code: record.code } : record));
      setMessage(`${value.name} was updated.`);
    } else {
      const prefix = management ? "MGT" : "SUP";
      const nextNumber = records.reduce((highest, item) => Math.max(highest, Number(item.code.split("-").at(-1)) || 0), 0) + 1;
      saveRecords([{ ...value, code: `${prefix}-${String(nextNumber).padStart(3, "0")}` }, ...records]);
      setPage(1);
      setMessage(`${value.name} was added.`);
    }
    setDialog(null);
  }

  function deleteSupplier() {
    if (!pendingDelete) return;
    saveRecords(records.filter((supplier) => supplier.code !== pendingDelete.code));
    setMessage(`${pendingDelete.name} was deleted.`);
    setPendingDelete(null);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button button--primary ${styles.primaryAction}`} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={16} />{management ? "Add Supplier" : "Add Supplier"}</button>}
        description={management ? "Manage purchase suppliers, contacts and account status" : "View and manage purchase suppliers"}
        title={management ? "Supplier Management" : "Supplier List"}
      />

      <Card className={styles.tableCard}>
        <form className={`${styles.toolbar} ${management ? styles.managementToolbar : styles.directoryToolbar}`} onSubmit={applyFilters}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={16} />
            <span className="sr-only">Search suppliers</span>
            <input onChange={(event) => setQueryDraft(event.target.value)} placeholder={management ? "Search supplier name, contact, etc..." : "Search supplier..."} type="search" value={queryDraft} />
          </label>
          {management ? (
            <>
              <label className={styles.selectField}><span className="sr-only">Status</span><select onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}><option>All Status</option><option>Active</option><option>Inactive</option></select></label>
              <label className={styles.selectField}><span className="sr-only">Location</span><select onChange={(event) => setLocationDraft(event.target.value)} value={locationDraft}><option>All Locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
              <button className={`${styles.searchButton} button button--primary`} type="submit"><Search size={15} />Search</button>
            </>
          ) : (
            <div className={styles.filterControl}>
              <button aria-expanded={filterOpen} className="button" onClick={() => setFilterOpen((open) => !open)} type="button"><Filter size={15} />Filter</button>
              {filterOpen ? (
                <div className={styles.filterMenu}>
                  <label><span>Status</span><select className="select" onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}><option>All Status</option><option>Active</option><option>Inactive</option></select></label>
                  <label><span>Location</span><select className="select" onChange={(event) => setLocationDraft(event.target.value)} value={locationDraft}><option>All Locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <button className="button button--primary" onClick={() => applyFilters()} type="button">Apply Filters</button>
                </div>
              ) : null}
            </div>
          )}
        </form>

        <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={`${styles.table} ${management ? styles.managementTable : ""}`}>
            <caption className="sr-only">{management ? "Supplier management records" : "Purchase supplier directory"}</caption>
            <thead>
              <tr>
                <th scope="col">SL</th><th scope="col">Supplier Name</th><th scope="col">Contact Person</th><th scope="col">Phone</th>
                {management ? <><th scope="col">Email</th><th scope="col">Location</th></> : <><th scope="col">Address</th><th scope="col">Due Amount (৳)</th></>}
                <th scope="col">Status</th><th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((supplier, index) => (
                <tr key={supplier.code}>
                  <td>{first + index}</td>
                  <td><strong>{supplier.name}</strong></td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.phone}</td>
                  {management ? <><td>{supplier.email}</td><td>{supplier.location}</td></> : <><td>{supplier.address}</td><td className={styles.money}>{formatPurchaseSupplierMoney(supplier.dueAmount).replace("৳ ", "")}</td></>}
                  <td><StatusBadge status={supplier.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link aria-label={`View ${supplier.name}`} href={`/purchases/supplier-directory/${supplier.code}`} title="View supplier"><Eye size={15} /></Link>
                      <button aria-label={`Edit ${supplier.name}`} onClick={() => setDialog({ mode: "edit", supplier })} title="Edit supplier" type="button"><FilePenLine size={15} /></button>
                      <button aria-label={`Delete ${supplier.name}`} className={styles.deleteAction} onClick={() => setPendingDelete(supplier)} title="Delete supplier" type="button"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pageRows.length ? <tr><td className={styles.empty} colSpan={8}>No suppliers match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}>
          <p>Showing {first} to {last} of {filtered.length} {management ? "entries" : "entries"}</p>
          <nav aria-label="Supplier pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={16} />{management ? null : <span>Previous</span>}</button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button">{management ? null : <span>Next</span>}<ChevronRight size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? <SupplierFormDialog key={dialog.mode === "edit" ? dialog.supplier.code : "new"} onClose={() => setDialog(null)} onSave={saveSupplier} state={dialog} /> : null}
      {pendingDelete ? <DeleteDialog onClose={() => setPendingDelete(null)} onConfirm={deleteSupplier} supplier={pendingDelete} /> : null}
    </div>
  );
}
