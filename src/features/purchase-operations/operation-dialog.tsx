"use client";

import { X } from "lucide-react";
import { useEffect, useId, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import styles from "./purchase-operations.module.css";

type OperationDialogProps = {
  children: ReactNode;
  title: string;
  description?: string;
  onClose: () => void;
};

export function OperationDialog({ children, title, description, onClose }: OperationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        as="section"
        className={styles.modal}
        role="dialog"
      >
        <header className={styles.modalHeader}>
          <div><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</div>
          <button aria-label="Close dialog" autoFocus onClick={onClose} type="button"><X aria-hidden="true" size={19} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}
