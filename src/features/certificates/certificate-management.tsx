"use client";

import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileBadge2,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  certificateStatuses,
  certificateTypes,
  initialCertificates,
  nextCertificateId,
} from "./certificate-data";
import type {
  CertificateRecord,
  CertificateStatus,
  CertificateType,
} from "./certificate-data";
import styles from "./certificate-management.module.css";

const PAGE_SIZE = 10;

type CertificateDraft = Omit<CertificateRecord, "id">;
type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit" | "delete"; certificate: CertificateRecord };
type TypeFilter = "All Types" | CertificateType;
type StatusFilter = "All Status" | CertificateStatus;

const emptyDraft: CertificateDraft = {
  certificateNo: "",
  productName: "",
  type: "Hallmark",
  purity: "22K",
  issueDate: "2025-04-30",
  status: "Valid",
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(month) - 1];
  return `${day} ${monthName} ${year}`;
}

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function StatusBadge({ status }: { status: CertificateStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Valid" ? styles.validStatus : styles.expiredStatus}`}>
      {status}
    </span>
  );
}

type CertificateFormProps = {
  initialValue?: CertificateRecord;
  onCancel: () => void;
  onSubmit: (draft: CertificateDraft) => void;
};

function CertificateForm({ initialValue, onCancel, onSubmit }: CertificateFormProps) {
  const [draft, setDraft] = useState<CertificateDraft>(initialValue ?? emptyDraft);

  function updateDraft<Key extends keyof CertificateDraft>(key: Key, value: CertificateDraft[Key]) {
    setDraft((current) => {
      if (key === "type") {
        const type = value as CertificateType;
        return { ...current, type, purity: type === "Hallmark" ? "22K" : "VS1" };
      }
      return { ...current, [key]: value };
    });
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...draft,
      certificateNo: draft.certificateNo.trim().toUpperCase(),
      productName: draft.productName.trim(),
    });
  }

  const purityOptions = draft.type === "Hallmark"
    ? ["24K", "22K", "21K", "18K"]
    : ["VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

  return (
    <form className={styles.modalForm} onSubmit={submitForm}>
      <label>
        <span>Certificate No <em>*</em></span>
        <input
          autoFocus
          className="field"
          onChange={(event) => updateDraft("certificateNo", event.target.value)}
          placeholder="e.g. HUID224470"
          required
          value={draft.certificateNo}
        />
      </label>
      <label>
        <span>Product Name <em>*</em></span>
        <input
          className="field"
          onChange={(event) => updateDraft("productName", event.target.value)}
          placeholder="Enter product name"
          required
          value={draft.productName}
        />
      </label>
      <label>
        <span>Certificate Type</span>
        <select className="select" onChange={(event) => updateDraft("type", event.target.value as CertificateType)} value={draft.type}>
          {certificateTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>
        <span>Purity / Grade</span>
        <select className="select" onChange={(event) => updateDraft("purity", event.target.value)} value={draft.purity}>
          {purityOptions.map((purity) => <option key={purity}>{purity}</option>)}
        </select>
      </label>
      <label>
        <span>Issue Date <em>*</em></span>
        <input className="field" onChange={(event) => updateDraft("issueDate", event.target.value)} required type="date" value={draft.issueDate} />
      </label>
      <label>
        <span>Status</span>
        <select className="select" onChange={(event) => updateDraft("status", event.target.value as CertificateStatus)} value={draft.status}>
          {certificateStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">
          <BadgeCheck aria-hidden="true" size={16} /> {initialValue ? "Save Changes" : "Add Certificate"}
        </button>
      </div>
    </form>
  );
}

export function CertificateManagement() {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [typeDraft, setTypeDraft] = useState<TypeFilter>("All Types");
  const [statusDraft, setStatusDraft] = useState<StatusFilter>("All Status");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({
    total: certificates.length,
    hallmarked: certificates.filter((certificate) => certificate.type === "Hallmark").length,
    nonHallmarked: certificates.filter((certificate) => certificate.type !== "Hallmark").length,
    expired: certificates.filter((certificate) => certificate.status === "Expired").length,
  }), [certificates]);

  const filteredCertificates = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return certificates.filter((certificate) => {
      const matchesSearch = !search || [certificate.certificateNo, certificate.productName, certificate.type, certificate.purity]
        .some((value) => value.toLowerCase().includes(search));
      const matchesType = typeFilter === "All Types" || certificate.type === typeFilter;
      const matchesStatus = statusFilter === "All Status" || certificate.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [certificates, deferredQuery, statusFilter, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredCertificates.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const visibleCertificates = filteredCertificates.slice(startIndex, startIndex + PAGE_SIZE);

  function applyFilters() {
    setTypeFilter(typeDraft);
    setStatusFilter(statusDraft);
    setPage(1);
    setMessage(typeDraft === "All Types" && statusDraft === "All Status" ? "Certificate filters cleared." : "Certificate filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setTypeDraft("All Types");
    setStatusDraft("All Status");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setPage(1);
    setMessage("All filters cleared.");
  }

  function addCertificate(draft: CertificateDraft) {
    const duplicate = certificates.some((certificate) => certificate.certificateNo.toLowerCase() === draft.certificateNo.toLowerCase());
    if (duplicate) {
      setMessage(`Certificate ${draft.certificateNo} already exists.`);
      return;
    }
    const certificate: CertificateRecord = { id: nextCertificateId(certificates), ...draft };
    setCertificates((current) => [...current, certificate]);
    setDialog(null);
    setTypeDraft("All Types");
    setStatusDraft("All Status");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setQuery("");
    setPage(Math.ceil((certificates.length + 1) / PAGE_SIZE));
    setMessage(`${certificate.certificateNo} was added successfully.`);
  }

  function updateCertificate(original: CertificateRecord, draft: CertificateDraft) {
    const duplicate = certificates.some((certificate) => certificate.id !== original.id && certificate.certificateNo.toLowerCase() === draft.certificateNo.toLowerCase());
    if (duplicate) {
      setMessage(`Certificate ${draft.certificateNo} already exists.`);
      return;
    }
    setCertificates((current) => current.map((certificate) => certificate.id === original.id ? { ...certificate, ...draft } : certificate));
    setDialog(null);
    setMessage(`${draft.certificateNo} was updated successfully.`);
  }

  function deleteCertificate(certificate: CertificateRecord) {
    setCertificates((current) => current.filter((item) => item.id !== certificate.id));
    setDialog(null);
    setMessage(`${certificate.certificateNo} was deleted.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => setDialog({ mode: "add" })} type="button">
            <Plus aria-hidden="true" size={16} /> Add Certificate
          </button>
        )}
        description="Manage product certificates and hallmark information"
        title="Certificate Management"
      />

      <section aria-label="Certificate overview" className={styles.metrics}>
        <Card className={styles.metricCard}>
          <span>Total Certificates</span>
          <div><strong className={styles.blueMetric}>{metrics.total}</strong><small className={styles.positiveMetric}>↑ 12%</small></div>
        </Card>
        <Card className={styles.metricCard}>
          <span>Hallmarked Items</span>
          <div><strong className={styles.greenMetric}>{metrics.hallmarked}</strong><small className={styles.positiveMetric}>↑ 8%</small></div>
        </Card>
        <Card className={styles.metricCard}><span>Non-Hallmarked</span><strong className={styles.redMetric}>{metrics.nonHallmarked}</strong></Card>
        <Card className={styles.metricCard}><span>Expired Certificates</span><strong className={styles.redMetric}>{metrics.expired}</strong></Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={16} />
            <span className="sr-only">Search certificates</span>
            <input
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search by certificate no, product, or barcode..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by certificate type</span>
            <select onChange={(event) => setTypeDraft(event.target.value as TypeFilter)} value={typeDraft}>
              <option>All Types</option>
              {certificateTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter by certificate status</span>
            <select onChange={(event) => setStatusDraft(event.target.value as StatusFilter)} value={statusDraft}>
              <option>All Status</option>
              {certificateStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <button className="button" onClick={applyFilters} type="button"><Filter aria-hidden="true" size={15} /> Filter</button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Product certificates and hallmark records</caption>
            <thead>
              <tr>
                <th scope="col">#</th><th scope="col">Certificate No</th><th scope="col">Product Name</th><th scope="col">Type</th>
                <th scope="col">Purity</th><th scope="col">Issue Date</th><th scope="col">Status</th><th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleCertificates.map((certificate, index) => (
                <tr key={certificate.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{certificate.certificateNo}</strong></td>
                  <td>{certificate.productName}</td>
                  <td>{certificate.type}</td>
                  <td>{certificate.purity}</td>
                  <td>{formatDate(certificate.issueDate)}</td>
                  <td><StatusBadge status={certificate.status} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${certificate.certificateNo}`} onClick={() => setDialog({ mode: "view", certificate })} type="button"><Eye aria-hidden="true" size={13} /></button>
                      <button aria-label={`Edit ${certificate.certificateNo}`} onClick={() => setDialog({ mode: "edit", certificate })} type="button"><Pencil aria-hidden="true" size={13} /></button>
                      <button aria-label={`Delete ${certificate.certificateNo}`} className={styles.deleteAction} onClick={() => setDialog({ mode: "delete", certificate })} type="button"><Trash2 aria-hidden="true" size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleCertificates.length ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={24} /><strong>No certificates found</strong><span>Try another search or clear the selected filters.</span>
                    <button className="button" onClick={clearFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>Showing {filteredCertificates.length ? startIndex + 1 : 0} to {Math.min(startIndex + PAGE_SIZE, filteredCertificates.length)} of {filteredCertificates.length.toLocaleString("en-US")} certificates</p>
          <nav aria-label="Certificate pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {paginationItems(activePage, pageCount).map((item, index) => item === "ellipsis"
              ? <span aria-hidden="true" key={`ellipsis-${index}`}>…</span>
              : <button aria-current={activePage === item ? "page" : undefined} className={activePage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div className={styles.modalBackdrop} onKeyDown={(event) => { if (event.key === "Escape") setDialog(null); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section
            aria-describedby="certificate-dialog-description"
            aria-labelledby="certificate-dialog-title"
            aria-modal="true"
            className={styles.modal}
            role={dialog.mode === "delete" ? "alertdialog" : "dialog"}
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="certificate-dialog-title">{dialog.mode === "add" ? "Add Certificate" : dialog.mode === "edit" ? "Edit Certificate" : dialog.mode === "delete" ? "Delete Certificate" : "Certificate Details"}</h2>
                <p id="certificate-dialog-description">{dialog.mode === "delete" ? "This certificate record will be permanently removed." : dialog.mode === "view" ? "Certificate, product, purity and validity information." : "Enter the product certificate and hallmark details."}</p>
              </div>
              <button aria-label="Close certificate dialog" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>

            {dialog.mode === "add" ? (
              <CertificateForm onCancel={() => setDialog(null)} onSubmit={addCertificate} />
            ) : dialog.mode === "edit" ? (
              <CertificateForm initialValue={dialog.certificate} key={dialog.certificate.id} onCancel={() => setDialog(null)} onSubmit={(draft) => updateCertificate(dialog.certificate, draft)} />
            ) : dialog.mode === "view" ? (
              <div className={styles.details}>
                <div className={styles.detailsHero}>
                  <span className={styles.certificateIcon}><FileBadge2 aria-hidden="true" size={30} /></span>
                  <div><small>{dialog.certificate.type} certificate</small><strong>{dialog.certificate.certificateNo}</strong><span>{dialog.certificate.productName}</span></div>
                  <StatusBadge status={dialog.certificate.status} />
                </div>
                <dl>
                  <div><dt>Certificate Type</dt><dd>{dialog.certificate.type}</dd></div>
                  <div><dt>Purity / Grade</dt><dd>{dialog.certificate.purity}</dd></div>
                  <div><dt>Issue Date</dt><dd>{formatDate(dialog.certificate.issueDate)}</dd></div>
                </dl>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => setDialog({ mode: "edit", certificate: dialog.certificate })} type="button"><Pencil aria-hidden="true" size={15} /> Edit Certificate</button>
                </div>
              </div>
            ) : (
              <div className={styles.deleteDialog}>
                <span><Trash2 aria-hidden="true" size={24} /></span>
                <p>Delete <strong>{dialog.certificate.certificateNo}</strong> for {dialog.certificate.productName}? This action cannot be undone.</p>
                <div className={styles.modalActions}>
                  <button autoFocus className="button" onClick={() => setDialog(null)} type="button">Cancel</button>
                  <button className={`${styles.dangerButton} button`} onClick={() => deleteCertificate(dialog.certificate)} type="button">Delete Certificate</button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}

