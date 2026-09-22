"use client";

import { Eye, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

import styles from "./production-list-pages.module.css";

export function ProductionPageHeader({ actionHref, actionLabel, title }: { actionHref: string; actionLabel: string; title: string }) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <nav aria-label="Breadcrumb"><span>Home</span><b aria-hidden="true">›</b><span>Production Management</span><b aria-hidden="true">›</b><span aria-current="page">{title}</span></nav>
      </div>
      <Link className={styles.primaryButton} href={actionHref}><span aria-hidden="true">＋</span>{actionLabel}</Link>
    </header>
  );
}

export function SummaryCard({ icon, label, tone, value }: { icon: ReactNode; label: string; tone: "blue" | "amber" | "cyan" | "indigo"; value: string }) {
  return (
    <Card as="article" className={styles.summaryCard}>
      <span aria-hidden="true" className={`${styles.summaryIcon} ${styles[tone]}`}>{icon}</span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </Card>
  );
}

export function ViewButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button aria-label={label} className={styles.viewButton} onClick={onClick} type="button"><Eye aria-hidden="true" size={14} />View</button>;
}

export function DetailsDialog({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-describedby="production-list-dialog-description" aria-labelledby="production-list-dialog-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
        <header className={styles.dialogHeader}>
          <div><h2 id="production-list-dialog-title">{title}</h2><p id="production-list-dialog-description">{description}</p></div>
          <button aria-label="Close details" autoFocus onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}
