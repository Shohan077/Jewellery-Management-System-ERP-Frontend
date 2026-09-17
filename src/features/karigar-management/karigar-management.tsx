"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  initialKarigars,
  karigarInitials,
  karigarSkills,
  karigarStatuses,
} from "./karigar-management-data";
import type { Karigar, KarigarSkill, KarigarStatus } from "./karigar-management-data";
import styles from "./karigar-management.module.css";

const PAGE_SIZE = 10;

type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit"; karigar: Karigar }
  | null;

function Avatar({ karigar }: { karigar: Karigar }) {
  return (
    <span
      aria-label={`${karigar.name} profile photo`}
      className={`${styles.avatar} ${styles[`avatarTone${karigar.numericId % 6}`]}`}
      role="img"
      title={karigarInitials(karigar.name)}
    >
      <UserRound aria-hidden="true" size={22} strokeWidth={1.8} />
    </span>
  );
}

function StatusBadge({ status }: { status: KarigarStatus }) {
  const statusClass = {
    Active: styles.activeStatus,
    "On Work": styles.workStatus,
    Inactive: styles.inactiveStatus,
    Others: styles.otherStatus,
  }[status];

  return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
}

type KarigarFormProps = {
  error: string;
  initialValue?: Karigar;
  mode: "add" | "edit";
  onCancel: () => void;
  onFieldChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function KarigarForm({ error, initialValue, mode, onCancel, onFieldChange, onSubmit }: KarigarFormProps) {
  return (
    <form className={styles.modalForm} onChange={onFieldChange} onSubmit={onSubmit}>
      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <label className={styles.wideField}>
        <span>Karigar Name <em>*</em></span>
        <input autoFocus className="field" defaultValue={initialValue?.name} name="name" placeholder="Enter full name" required />
      </label>
      <label>
        <span>Karigar ID <em>*</em></span>
        <input className="field" defaultValue={initialValue?.code} name="code" pattern="[A-Za-z]{1,3}-[0-9]{3}" placeholder="K-035" required />
      </label>
      <label>
        <span>Phone <em>*</em></span>
        <input className="field" defaultValue={initialValue?.phone} inputMode="tel" name="phone" pattern="[0-9]{5}-[0-9]{6}" placeholder="01712-345678" required />
      </label>
      <label>
        <span>Primary Skill</span>
        <select className="select" defaultValue={initialValue?.skill ?? "Gold Setting"} name="skill">
          {karigarSkills.map((skill) => <option key={skill}>{skill}</option>)}
        </select>
      </label>
      <label>
        <span>Status</span>
        <select className="select" defaultValue={initialValue?.status ?? "Active"} name="status">
          {karigarStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">
          {mode === "add" ? <Plus aria-hidden="true" size={16} /> : <Pencil aria-hidden="true" size={15} />}
          {mode === "add" ? "Add Karigar" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function readForm(event: FormEvent<HTMLFormElement>): Omit<Karigar, "numericId"> {
  const data = new FormData(event.currentTarget);
  return {
    code: String(data.get("code") ?? "").trim().toUpperCase(),
    name: String(data.get("name") ?? "").trim(),
    phone: String(data.get("phone") ?? "").trim(),
    skill: String(data.get("skill") ?? "Gold Setting") as KarigarSkill,
    status: String(data.get("status") ?? "Active") as KarigarStatus,
  };
}

export function KarigarManagement() {
  const [records, setRecords] = useState(initialKarigars);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [skill, setSkill] = useState<"All Skills" | KarigarSkill>("All Skills");
  const [status, setStatus] = useState<"All Status" | KarigarStatus>("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const filteredRecords = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    return records.filter((karigar) => {
      const matchesSearch = !term || [karigar.name, karigar.code, karigar.phone, karigar.skill]
        .some((value) => value.toLowerCase().includes(term));
      return matchesSearch
        && (skill === "All Skills" || karigar.skill === skill)
        && (status === "All Status" || karigar.status === status);
    });
  }, [deferredQuery, records, skill, status]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const start = filteredRecords.length ? (activePage - 1) * PAGE_SIZE : 0;
  const visibleRows = filteredRecords.slice(start, start + PAGE_SIZE);
  const metrics = useMemo(() => ({
    active: records.filter((karigar) => karigar.status !== "Inactive").length,
    inactive: records.filter((karigar) => karigar.status === "Inactive").length,
    onWork: records.filter((karigar) => karigar.status === "On Work").length,
    total: records.length,
  }), [records]);

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  function openAddDialog() {
    setFormError("");
    setDialog({ mode: "add" });
  }

  function clearFilters() {
    setQuery("");
    setSkill("All Skills");
    setStatus("All Status");
    setPage(1);
  }

  function addKarigar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry = readForm(event);
    if (records.some((karigar) => karigar.code.toLowerCase() === entry.code.toLowerCase())) {
      setFormError(`Karigar ID ${entry.code} is already in use.`);
      return;
    }
    const numericId = Math.max(...records.map((karigar) => karigar.numericId)) + 1;
    setRecords((current) => [{ numericId, ...entry }, ...current]);
    clearFilters();
    setFormError("");
    setDialog(null);
    setMessage(`${entry.name} was added successfully.`);
  }

  function updateKarigar(event: FormEvent<HTMLFormElement>, numericId: number) {
    event.preventDefault();
    const entry = readForm(event);
    if (records.some((karigar) => karigar.numericId !== numericId && karigar.code.toLowerCase() === entry.code.toLowerCase())) {
      setFormError(`Karigar ID ${entry.code} is already in use.`);
      return;
    }
    setRecords((current) => current.map((karigar) => karigar.numericId === numericId ? { numericId, ...entry } : karigar));
    setFormError("");
    setDialog(null);
    setMessage(`${entry.name}'s profile was updated.`);
  }

  function advanceStatus(karigar: Karigar) {
    const nextStatus = karigarStatuses[(karigarStatuses.indexOf(karigar.status) + 1) % karigarStatuses.length];
    setRecords((current) => current.map((item) => item.numericId === karigar.numericId ? { ...item, status: nextStatus } : item));
    setMessage(`${karigar.name}'s status changed to ${nextStatus}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={openAddDialog} type="button">
            <Plus aria-hidden="true" size={16} /> Add Karigar
          </button>
        )}
        description="Manage your karigars (craftsmen)"
        title="Karigar List"
      />

      <section aria-label="Karigar overview" className={styles.metrics}>
        <Card className={styles.metricCard}><span>Total Karigars</span><strong className={styles.blueMetric}>{metrics.total}</strong></Card>
        <Card className={styles.metricCard}><span>Active Karigars</span><strong className={styles.greenMetric}>{metrics.active}</strong></Card>
        <Card className={styles.metricCard}><span>On Work</span><strong className={styles.blueMetric}>{metrics.onWork}</strong></Card>
        <Card className={styles.metricCard}><span>Inactive</span><strong className={styles.redMetric}>{metrics.inactive}</strong></Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={16} />
            <span className="sr-only">Search karigars by name, phone, or ID</span>
            <input
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search by name, phone or ID..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by skill</span>
            <select onChange={(event) => { setSkill(event.target.value as typeof skill); setPage(1); }} value={skill}>
              <option>All Skills</option>
              {karigarSkills.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by status</span>
            <select onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} value={status}>
              <option>All Status</option>
              {karigarStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            className={`button ${styles.filterButton}`}
            onClick={() => setMessage(`${filteredRecords.length} karigars match the current filters.`)}
            type="button"
          >
            <Filter aria-hidden="true" size={15} /> Filter
          </button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Karigar list</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Photo</th>
                <th scope="col">Name</th>
                <th scope="col">ID</th>
                <th scope="col">Skill</th>
                <th scope="col">Phone</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((karigar, index) => (
                <tr key={karigar.numericId}>
                  <td>{start + index + 1}</td>
                  <td><Avatar karigar={karigar} /></td>
                  <td><strong>{karigar.name}</strong></td>
                  <td className={styles.code}>{karigar.code}</td>
                  <td>{karigar.skill}</td>
                  <td className={styles.numeric}>{karigar.phone}</td>
                  <td><StatusBadge status={karigar.status} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${karigar.name}`} onClick={() => { setFormError(""); setDialog({ mode: "view", karigar }); }} title="View profile" type="button"><Eye aria-hidden="true" size={14} /></button>
                      <button aria-label={`Edit ${karigar.name}`} onClick={() => { setFormError(""); setDialog({ mode: "edit", karigar }); }} title="Edit karigar" type="button"><Pencil aria-hidden="true" size={13} /></button>
                      <button aria-label={`Change ${karigar.name}'s status`} onClick={() => advanceStatus(karigar)} title="Change status" type="button"><Plus aria-hidden="true" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleRows.length ? (
                <tr><td className={styles.emptyState} colSpan={8}>
                  <Search aria-hidden="true" size={24} />
                  <strong>No karigars found</strong>
                  <span>Try another search or clear the filters.</span>
                  <button className="button" onClick={clearFilters} type="button">Clear filters</button>
                </td></tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} karigars</p>
          <nav aria-label="Karigar pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <button aria-current={activePage === item ? "page" : undefined} className={activePage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>
            ))}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section aria-labelledby="karigar-manage-dialog" aria-modal="true" className={styles.modal} role="dialog">
            <header className={styles.modalHeader}>
              <div>
                <h2 id="karigar-manage-dialog">{dialog.mode === "add" ? "Add Karigar" : dialog.mode === "edit" ? "Edit Karigar" : "Karigar Profile"}</h2>
                <p>{dialog.mode === "view" ? "Craftsman details and current availability." : "Enter the craftsman's employment details."}</p>
              </div>
              <button aria-label="Close dialog" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>

            {dialog.mode === "view" ? (
              <div className={styles.profile}>
                <div className={styles.profileIdentity}><Avatar karigar={dialog.karigar} /><div><strong>{dialog.karigar.name}</strong><span>{dialog.karigar.code}</span></div></div>
                <dl>
                  <div><dt>Skill</dt><dd>{dialog.karigar.skill}</dd></div>
                  <div><dt>Phone</dt><dd>{dialog.karigar.phone}</dd></div>
                  <div><dt>Status</dt><dd><StatusBadge status={dialog.karigar.status} /></dd></div>
                </dl>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => { setFormError(""); setDialog({ mode: "edit", karigar: dialog.karigar }); }} type="button"><Pencil aria-hidden="true" size={14} /> Edit Karigar</button>
                </div>
              </div>
            ) : (
              <KarigarForm
                error={formError}
                initialValue={dialog.mode === "edit" ? dialog.karigar : undefined}
                key={dialog.mode === "edit" ? dialog.karigar.numericId : "new"}
                mode={dialog.mode}
                onCancel={() => setDialog(null)}
                onFieldChange={() => { if (formError) setFormError(""); }}
                onSubmit={dialog.mode === "add" ? addKarigar : (event) => updateKarigar(event, dialog.karigar.numericId)}
              />
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
