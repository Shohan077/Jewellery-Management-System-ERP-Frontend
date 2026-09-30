"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, X } from "lucide-react";
import styles from "./reference-78.module.css";

export function PageHeader({
  title,
  crumbs,
  actions,
}: {
  title: string;
  crumbs: readonly string[];
  actions?: ReactNode;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          {crumbs.map((crumb, index) => (
            <span key={crumb}>{crumb}{index < crumbs.length - 1 ? <ChevronRight size={10} /> : null}</span>
          ))}
        </nav>
      </div>
      {actions ? <div className={styles.headerActions}>{actions}</div> : null}
    </header>
  );
}

export function Button({
  children,
  tone = "secondary",
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "success" | "purple" | "warning";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return <button className={`${styles.button} ${styles[tone]} ${className}`} onClick={onClick} type={type}>{children}</button>;
}

export function Status({ children, tone = "active" }: { children: ReactNode; tone?: "active" | "inactive" | "partial" | "paid" }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

export function Pager({ current, pages, onChange }: { current: number; pages: number; onChange: (page: number) => void }) {
  return (
    <nav aria-label="Pagination" className={styles.pager}>
      <button disabled={current === 1} onClick={() => onChange(1)}>«</button>
      <button disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))}>‹</button>
      {Array.from({ length: Math.min(pages, 3) }, (_, index) => index + 1).map((page) => <button aria-current={page === current ? "page" : undefined} key={page} onClick={() => onChange(page)}>{page}</button>)}
      <button disabled={current === pages} onClick={() => onChange(Math.min(pages, current + 1))}>›</button>
      <button disabled={current === pages} onClick={() => onChange(pages)}>»</button>
    </nav>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-modal="true" className={styles.modal} role="dialog">
        <header><h2>{title}</h2><button aria-label="Close" onClick={onClose}><X size={16} /></button></header>
        {children}
      </section>
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className={`${styles.button} ${styles.primary}`} href={href}>{children}</Link>;
}

export function downloadCsv(name: string, headers: readonly string[], rows: readonly (readonly string[])[]) {
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
