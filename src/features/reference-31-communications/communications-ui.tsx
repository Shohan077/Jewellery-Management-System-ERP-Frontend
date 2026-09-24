"use client";

import { ChevronRight, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { settingsRailItems } from "./communications-data";
import styles from "./communications.module.css";

export function CommunicationPageHeader({
  actions,
  subtitle,
  title,
}: {
  actions: ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/settings">Settings</Link>
          <ChevronRight aria-hidden="true" size={11} />
          <span>{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className={styles.headerActions}>{actions}</div>
    </header>
  );
}

export function CommunicationSettingsRail({ active }: { active: "Email Configuration" | "SMS Configuration" }) {
  return (
    <nav aria-label="Settings sections" className={styles.settingsRail}>
      {settingsRailItems.map((item) => (
        <Link
          aria-current={item.label === active ? "page" : undefined}
          className={item.label === active ? styles.activeRail : ""}
          href={item.href}
          key={item.label}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function FormField({
  children,
  label,
  required = false,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className={styles.field}>
      <span>
        {label}
        {required ? <b> *</b> : null}
      </span>
      {children}
    </label>
  );
}

export function PasswordInput({
  ariaLabel,
  onChange,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <span className={styles.passwordInput}>
      <input aria-label={ariaLabel} onChange={(event) => onChange(event.target.value)} type={visible ? "text" : "password"} value={value} />
      <button aria-label={visible ? `Hide ${ariaLabel}` : `Show ${ariaLabel}`} onClick={() => setVisible((current) => !current)} type="button">
        {visible ? <EyeOff aria-hidden="true" size={13} /> : <Eye aria-hidden="true" size={13} />}
      </button>
    </span>
  );
}

export function StatusPill({ status }: { status: "Delivered" | "Failed" | "Queued" }) {
  return <span className={`${styles.statusPill} ${styles[`status${status}`]}`}>{status}</span>;
}

export function FeedbackToast({ message }: { message: string }) {
  return <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message || "No new notifications"}</p>;
}

export function DetailModal({
  children,
  onClose,
  subtitle,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="communication-modal-title" aria-modal="true" className={styles.modal} role="dialog">
        <header>
          <div>
            <h2 id="communication-modal-title">{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button aria-label="Close dialog" onClick={onClose} type="button"><X aria-hidden="true" size={16} /></button>
        </header>
        <div className={styles.modalBody}>{children}</div>
      </section>
    </div>
  );
}
