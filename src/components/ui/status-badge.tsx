import styles from "./status-badge.module.css";

export type PaymentStatus = "Paid" | "Due" | "Returned";

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>{status}</span>;
}
