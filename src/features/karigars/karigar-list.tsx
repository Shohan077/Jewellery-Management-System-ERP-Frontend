"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatJoiningDate,
  initialKarigars,
  karigarInitials,
  karigarSkills,
} from "./karigar-data";
import type { KarigarRecord, KarigarSkill, KarigarStatus } from "./karigar-data";
import styles from "./karigar-list.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;

type StatusFilter = (typeof statusOptions)[number];
type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit"; karigar: KarigarRecord }
  | null;

function paginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) {
    return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function KarigarStatusBadge({ status }: { status: KarigarStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>
      {status}
    </span>
  );
}

function KarigarAvatar({ karigar }: { karigar: KarigarRecord }) {
  return (
    <span
      aria-label={`${karigar.name} profile photo placeholder`}
      className={`${styles.avatar} ${styles[`avatarTone${karigar.id % 8}`]}`}
      role="img"
    >
      {karigarInitials(karigar.name)}
    </span>
  );
}

type KarigarFormProps = {
  initialValue?: KarigarRecord;
  mode: "add" | "edit";
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function KarigarForm({ initialValue, mode, onCancel, onSubmit }: KarigarFormProps) {
  return (
    <form className={styles.modalForm} onSubmit={onSubmit}>
      <label className={styles.wideField}>
        <span>Karigar Name</span>
        <input
          autoFocus
          className="field"
          defaultValue={initialValue?.name}
          name="name"
          placeholder="Enter full name"
          required
        />
      </label>
      <label>
        <span>Primary Skill</span>
        <select className="select" defaultValue={initialValue?.skill ?? "Gold Smith"} name="skill">
          {karigarSkills.map((skill) => <option key={skill}>{skill}</option>)}
        </select>
      </label>
      <label>
        <span>Phone</span>
        <input
          className="field"
          defaultValue={initialValue?.phone}
          inputMode="tel"
          name="phone"
          pattern="[0-9]{5}-[0-9]{6}"
          placeholder="01712-345678"
          required
        />
      </label>
      <label>
        <span>Joining Date</span>
        <input className="field" defaultValue={initialValue?.joiningDate ?? "2026-09-09"} name="joiningDate" required type="date" />
      </label>
      <label>
        <span>Status</span>
        <select className="select" defaultValue={initialValue?.status ?? "Active"} name="status">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">
          {mode === "add" ? <Plus aria-hidden="true" size={16} /> : <FilePenLine aria-hidden="true" size={16} />}
          {mode === "add" ? "Add Karigar" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export function KarigarList() {
  const [records, setRecords] = useState<KarigarRecord[]>(initialKarigars);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [skill, setSkill] = useState<"All Skills" | KarigarSkill>("All Skills");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [activityMessage, setActivityMessage] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);

  const filteredKarigars = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();

    return records.filter((karigar) => {
      const matchesQuery =
        searchTerm.length === 0 ||
        karigar.name.toLowerCase().includes(searchTerm) ||
        karigar.phone.includes(searchTerm) ||
        karigar.skill.toLowerCase().includes(searchTerm);
      const matchesSkill = skill === "All Skills" || karigar.skill === skill;
      const matchesStatus = status === "All Status" || karigar.status === status;

      return matchesQuery && matchesSkill && matchesStatus;
    });
  }, [deferredQuery, records, skill, status]);

  const pageCount = Math.max(1, Math.ceil(filteredKarigars.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const firstVisible = filteredKarigars.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredKarigars.length);
  const pageRows = filteredKarigars.slice(firstVisible === 0 ? 0 : firstVisible - 1, lastVisible);

  useEffect(() => {
    if (!dialog) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDialog(null);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dialog]);

  function resetFilters() {
    setQuery("");
    setSkill("All Skills");
    setStatus("All Status");
    setCurrentPage(1);
  }

  function readKarigarForm(event: FormEvent<HTMLFormElement>): Omit<KarigarRecord, "id"> {
    const form = new FormData(event.currentTarget);

    return {
      name: String(form.get("name") ?? "").trim(),
      skill: String(form.get("skill") ?? "Gold Smith") as KarigarSkill,
      phone: String(form.get("phone") ?? "").trim(),
      joiningDate: String(form.get("joiningDate") ?? ""),
      status: String(form.get("status") ?? "Active") as KarigarStatus,
    };
  }

  function addKarigar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newKarigar = readKarigarForm(event);
    const nextId = records.reduce((largest, karigar) => Math.max(largest, karigar.id), 0) + 1;

    setRecords((previous) => [{ id: nextId, ...newKarigar }, ...previous]);
    resetFilters();
    setDialog(null);
    setActivityMessage(`${newKarigar.name} was added to the karigar list.`);
  }

  function updateKarigar(event: FormEvent<HTMLFormElement>, karigarId: number) {
    event.preventDefault();
    const updatedKarigar = readKarigarForm(event);

    setRecords((previous) => previous.map((karigar) => (
      karigar.id === karigarId ? { id: karigarId, ...updatedKarigar } : karigar
    )));
    setDialog(null);
    setActivityMessage(`${updatedKarigar.name}'s profile was updated.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => setDialog({ mode: "add" })} type="button">
            <Plus aria-hidden="true" size={17} />
            Add Karigar
          </button>
        )}
        description="Manage all karigars (craftsmen)"
        title="Karigar List"
      />

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search karigars by name, phone, or skill</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, phone or skill..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter karigars by skill</span>
            <select
              onChange={(event) => {
                setSkill(event.target.value as "All Skills" | KarigarSkill);
                setCurrentPage(1);
              }}
              value={skill}
            >
              <option>All Skills</option>
              {karigarSkills.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter karigars by status</span>
            <select
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              value={status}
            >
              {statusOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            className={`button ${styles.filterButton}`}
            onClick={() => setActivityMessage(`${filteredKarigars.length.toLocaleString("en-US")} karigars match the current filters.`)}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Karigar list</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Photo</th>
                <th scope="col">Name</th>
                <th scope="col">Skill</th>
                <th scope="col">Phone</th>
                <th scope="col">Joining Date</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((karigar, index) => (
                <tr key={karigar.id}>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td><KarigarAvatar karigar={karigar} /></td>
                  <td><strong className={styles.karigarName}>{karigar.name}</strong></td>
                  <td>{karigar.skill}</td>
                  <td className={styles.numeric}>{karigar.phone}</td>
                  <td className={styles.numeric}>{formatJoiningDate(karigar.joiningDate)}</td>
                  <td><KarigarStatusBadge status={karigar.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        aria-label={`View ${karigar.name}`}
                        onClick={() => {
                          setDialog({ mode: "view", karigar });
                          setActivityMessage(`Viewing ${karigar.name}'s profile.`);
                        }}
                        title="View karigar"
                        type="button"
                      >
                        <Eye aria-hidden="true" size={15} />
                      </button>
                      <button
                        aria-label={`Edit ${karigar.name}`}
                        onClick={() => setDialog({ mode: "edit", karigar })}
                        title="Edit karigar"
                        type="button"
                      >
                        <FilePenLine aria-hidden="true" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={26} />
                    <strong>No karigars found</strong>
                    <span>Try a different search, skill, or status.</span>
                    <button className="button button--outline-gold" onClick={resetFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {firstVisible} to {lastVisible} of {filteredKarigars.length.toLocaleString("en-US")} karigars</p>
          <nav aria-label="Karigar list pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">
              <ChevronLeft aria-hidden="true" size={17} />
            </button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button
                aria-current={safePage === item ? "page" : undefined}
                className={safePage === item ? styles.currentPage : ""}
                key={item}
                onClick={() => setCurrentPage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">
              <ChevronRight aria-hidden="true" size={17} />
            </button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
        >
          <section
            aria-labelledby="karigar-dialog-title"
            aria-modal="true"
            className={styles.modal}
            role="dialog"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="karigar-dialog-title">
                  {dialog.mode === "add" ? "Add Karigar" : dialog.mode === "edit" ? "Edit Karigar" : "Karigar Profile"}
                </h2>
                <p>
                  {dialog.mode === "add"
                    ? "Create a new craftsman profile."
                    : dialog.mode === "edit"
                      ? `Update ${dialog.karigar.name}'s details.`
                      : "Craftsman contact and employment details."}
                </p>
              </div>
              <button aria-label="Close dialog" className={styles.closeButton} onClick={() => setDialog(null)} type="button">
                <X aria-hidden="true" size={19} />
              </button>
            </div>

            {dialog.mode === "view" ? (
              <div className={styles.profile}>
                <div className={styles.profileIdentity}>
                  <KarigarAvatar karigar={dialog.karigar} />
                  <div>
                    <strong>{dialog.karigar.name}</strong>
                    <span>{dialog.karigar.skill}</span>
                  </div>
                </div>
                <dl>
                  <div><dt>Phone</dt><dd>{dialog.karigar.phone}</dd></div>
                  <div><dt>Joining Date</dt><dd>{formatJoiningDate(dialog.karigar.joiningDate)}</dd></div>
                  <div><dt>Status</dt><dd><KarigarStatusBadge status={dialog.karigar.status} /></dd></div>
                  <div><dt>Karigar ID</dt><dd>KRG-{String(dialog.karigar.id).padStart(3, "0")}</dd></div>
                </dl>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => setDialog({ mode: "edit", karigar: dialog.karigar })} type="button">
                    <FilePenLine aria-hidden="true" size={16} /> Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <KarigarForm
                initialValue={dialog.mode === "edit" ? dialog.karigar : undefined}
                key={dialog.mode === "edit" ? dialog.karigar.id : "new"}
                mode={dialog.mode}
                onCancel={() => setDialog(null)}
                onSubmit={dialog.mode === "add" ? addKarigar : (event) => updateKarigar(event, dialog.karigar.id)}
              />
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
