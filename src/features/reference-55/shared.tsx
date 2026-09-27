"use client";

import type { CSSProperties, Key, ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import styles from "./reference-55.module.css";

export type Accent = "blue" | "green" | "orange" | "violet";

export function StatCard({
  accent = "blue",
  icon,
  label,
  value,
  trend,
}: {
  accent?: Accent;
  icon: ReactNode;
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card as="article" className={styles.statCard}>
      <span className={`${styles.statIcon} ${styles[accent]}`}>{icon}</span>
      <span className={styles.statCopy}>
        <small>{label}</small>
        <strong>{value}</strong>
        {trend ? <span><b>{trend}</b> vs last month</span> : null}
      </span>
    </Card>
  );
}

export function StatusBadge({ children, tone }: { children: ReactNode; tone: "success" | "danger" | "info" }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

export function IconAction({
  children,
  danger = false,
  label,
  onClick,
}: {
  children: ReactNode;
  danger?: boolean;
  label: string;
  onClick: () => void;
}) {
  return <button aria-label={label} className={`${styles.iconAction} ${danger ? styles.iconDanger : ""}`} onClick={onClick} title={label} type="button">{children}</button>;
}

export type TableColumn<T> = {
  key: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  render: (row: T, index: number) => ReactNode;
};

function TablePager({ current, onChange, pages }: { current: number; onChange: (page: number) => void; pages: number }) {
  return (
    <nav aria-label="Table pagination" className={styles.pagination}>
      <button disabled={current === 1} onClick={() => onChange(1)} type="button">First</button>
      <button aria-label="Previous page" disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))} type="button"><ChevronLeft size={13} /></button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
        <button aria-current={page === current ? "page" : undefined} key={page} onClick={() => onChange(page)} type="button">{page}</button>
      ))}
      <button aria-label="Next page" disabled={current === pages} onClick={() => onChange(Math.min(pages, current + 1))} type="button"><ChevronRight size={13} /></button>
      <button disabled={current === pages} onClick={() => onChange(pages)} type="button">Last</button>
    </nav>
  );
}

export function DataTable<T>({
  columns,
  currentPage,
  emptyMessage = "No matching records found.",
  footer,
  headerAction,
  minWidth = 880,
  onPageChange,
  pageCount,
  rowKey,
  rows,
  summaryRow,
  title,
  total,
}: {
  columns: readonly TableColumn<T>[];
  currentPage: number;
  emptyMessage?: string;
  footer?: string;
  headerAction?: ReactNode;
  minWidth?: number;
  onPageChange: (page: number) => void;
  pageCount: number;
  rowKey: (row: T) => Key;
  rows: readonly T[];
  summaryRow?: ReactNode;
  title: string;
  total: number;
}) {
  const countLabel = footer ?? `Showing 1 to ${rows.length} of ${total} entries`;
  const tableStyle = { "--table-min-width": `${minWidth}px` } as CSSProperties;

  return (
    <Card className={styles.tableCard}>
      <header className={styles.tableHeader}><h2>{title}</h2>{headerAction}</header>
      <div className={styles.tableScroller}>
        <table style={tableStyle}>
          <caption className="sr-only">{title}</caption>
          <thead><tr>{columns.map((column) => <th className={column.align ? styles[column.align] : undefined} key={column.key}>{column.label}</th>)}</tr></thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={rowKey(row)}>{columns.map((column) => <td className={column.align ? styles[column.align] : undefined} key={column.key}>{column.render(row, index)}</td>)}</tr>
            )) : <tr><td className={styles.emptyCell} colSpan={columns.length}>{emptyMessage}</td></tr>}
          </tbody>
          {summaryRow ? <tfoot>{summaryRow}</tfoot> : null}
        </table>
      </div>
      <footer className={styles.tableFooter}><span>{countLabel}</span><TablePager current={currentPage} onChange={onPageChange} pages={pageCount} /></footer>
    </Card>
  );
}

export function Feedback({ children }: { children: ReactNode }) {
  return <p aria-live="polite" className={styles.feedback}>{children}</p>;
}

export function Modal({
  children,
  description,
  onClose,
  title,
}: {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button aria-label="Close dialog" onClick={onClose} type="button"><X size={17} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}
