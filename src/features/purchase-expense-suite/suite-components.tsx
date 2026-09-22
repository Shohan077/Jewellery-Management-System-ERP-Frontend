"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import styles from "./purchase-expense-suite.module.css";

export function SuiteHeader({ action, title }: { action?: ReactNode; title: string }) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <p>Home <span>›</span> Purchase <span>›</span> {title}</p>
      </div>
      {action ? <div className={styles.headerAction}>{action}</div> : null}
    </header>
  );
}

export function SuiteDialog({ children, description, onClose, title }: { children: ReactNode; description?: string; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section aria-describedby={description ? "expense-dialog-description" : undefined} aria-modal="true" className={styles.dialog} role="dialog">
        <header className={styles.dialogHeader}>
          <div><h2>{title}</h2>{description ? <p id="expense-dialog-description">{description}</p> : null}</div>
          <button aria-label="Close dialog" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}
