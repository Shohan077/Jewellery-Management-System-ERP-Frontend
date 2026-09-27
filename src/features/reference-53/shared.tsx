import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import styles from "./shared.module.css";

export type MetricAccent = "blue" | "green" | "orange" | "violet";

export function MetricCard({
  accent = "blue",
  icon,
  label,
  note = "vs last month",
  trend,
  value,
}: {
  accent?: MetricAccent;
  icon: ReactNode;
  label: string;
  note?: string;
  trend?: string;
  value: string;
}) {
  return (
    <Card as="article" className={styles.metricCard}>
      <span className={`${styles.metricIcon} ${styles[accent]}`}>{icon}</span>
      <span className={styles.metricBody}>
        <small>{label}</small>
        <strong>{value}</strong>
        {trend || note ? <span><b>{trend}</b>{trend && note ? " " : null}{note}</span> : null}
      </span>
    </Card>
  );
}

export function StatusPill({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "warning" | "info" | "danger" }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

export function Pagination({ current, onChange, pages = 5 }: { current: number; onChange: (page: number) => void; pages?: number }) {
  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      <button aria-label="First page" disabled={current === 1} onClick={() => onChange(1)} type="button">«</button>
      <button aria-label="Previous page" disabled={current === 1} onClick={() => onChange(Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={13} /></button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
        <button aria-current={current === page ? "page" : undefined} key={page} onClick={() => onChange(page)} type="button">{page}</button>
      ))}
      <button aria-label="Next page" disabled={current === pages} onClick={() => onChange(Math.min(pages, current + 1))} type="button"><ChevronRight aria-hidden="true" size={13} /></button>
      <button aria-label="Last page" disabled={current === pages} onClick={() => onChange(pages)} type="button">»</button>
    </nav>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p aria-live="polite" className={styles.notice}>{children}</p>;
}
