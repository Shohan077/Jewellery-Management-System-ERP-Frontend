import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

import styles from "./finance-management.module.css";

type FinancePageHeaderProps = {
  title: string;
  current: string;
  action?: ReactNode;
};

export function FinancePageHeader({ title, current, action }: FinancePageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <span>Home</span><i aria-hidden="true">›</i><span>Accounts &amp; Finance</span><i aria-hidden="true">›</i><strong>{current}</strong>
        </nav>
      </div>
      {action ? <div className={styles.headerActions}>{action}</div> : null}
    </header>
  );
}

type MetricCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
  tone: "indigo" | "green" | "rose" | "blue" | "amber";
};

export function MetricCard({ label, value, icon, tone }: MetricCardProps) {
  return (
    <Card className={styles.metricCard}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</span>
      <span className={styles.metricCopy}><small>{label}</small><strong>{value}</strong></span>
    </Card>
  );
}

export function FinanceFeedback({ children }: { children: ReactNode }) {
  return <p aria-live="polite" className={children ? styles.feedback : "sr-only"}>{children}</p>;
}

type FinanceModalProps = {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
};

export function FinanceModal({ title, description, children, onClose }: FinanceModalProps) {
  return (
    <div
      className={styles.modalBackdrop}
      onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section aria-describedby="finance-modal-description" aria-labelledby="finance-modal-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2 id="finance-modal-title">{title}</h2><p id="finance-modal-description">{description}</p></div>
          <button aria-label="Close dialog" onClick={onClose} type="button">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}
