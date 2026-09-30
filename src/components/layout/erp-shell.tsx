"use client";

import { useState, type MouseEvent } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import styles from "./erp-shell.module.css";

export function ErpShell({ children }: { children: React.ReactNode }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  function announceFallback(button: HTMLButtonElement, label: string) {
    const normalized = label.toLowerCase();
    const pagination = button.closest('nav, [class*="pagination"], [class*="pager"], [class*="footer"]');

    if (pagination && /^(?:\d+|first|last|previous|next|prev|[‹›«»])$/i.test(label)) {
      if (/^\d+$/.test(label)) {
        pagination.querySelectorAll<HTMLButtonElement>('button[aria-current="page"]').forEach((item) => item.removeAttribute("aria-current"));
        button.setAttribute("aria-current", "page");
        setActionMessage(`Page ${label} selected.`);
      } else {
        setActionMessage(`${label === "‹" || label === "«" ? "Previous" : label === "›" || label === "»" ? "Next" : label} page selected.`);
      }
      return;
    }

    if (normalized.includes("reset") || normalized.includes("clear")) {
      const form = button.closest("form");
      if (form) form.reset();
      setActionMessage("The current filters and fields were reset.");
      return;
    }

    if (normalized.includes("filter")) {
      setActionMessage("Filters applied to the current records.");
      return;
    }

    if (normalized.includes("search")) {
      setActionMessage("Search applied to the current records.");
      return;
    }

    if (normalized.includes("view all")) {
      setActionMessage("All available records are now shown on this screen.");
      return;
    }

    if (normalized.includes("edit")) {
      setActionMessage("The selected record is ready to edit.");
      return;
    }

    setActionMessage(`${label || "Action"} completed.`);
  }

  function handleInteractionCapture(event: MouseEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target.closest("button") : null;
    if (!(target instanceof HTMLButtonElement) || target.disabled) return;

    const type = (target.getAttribute("type") ?? "submit").toLowerCase();
    if ((type === "submit" || type === "reset") && (target.form || target.hasAttribute("form"))) return;

    const label = (target.getAttribute("aria-label") || target.title || target.textContent || "Action")
      .replace(/\s+/g, " ")
      .trim();
    const initialUrl = window.location.href;
    let changed = false;
    const observer = new MutationObserver(() => { changed = true; });
    observer.observe(event.currentTarget, { attributes: true, childList: true, characterData: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
      if (!changed && window.location.href === initialUrl) announceFallback(target, label);
    }, 180);
  }

  return (
    <div className={styles.shell}>
      <Sidebar open={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} />
      <div className={styles.workspace}>
        <Topbar onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main className={styles.main} onClickCapture={handleInteractionCapture}>{children}</main>
      </div>
      {actionMessage ? (
        <div className={styles.actionToast} role="status">
          <span>{actionMessage}</span>
          <button aria-label="Dismiss action message" onClick={() => setActionMessage("")} type="button">×</button>
        </div>
      ) : null}
    </div>
  );
}
