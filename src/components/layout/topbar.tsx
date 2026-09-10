"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import styles from "./topbar.module.css";

export function Topbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState<"notifications" | "profile" | null>(null);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/sales/invoices?search=${encodeURIComponent(search)}` : "/sales/invoices");
  }

  return (
    <header className={styles.topbar}>
      <button aria-label="Open navigation" className={styles.menuButton} onClick={onOpenNavigation} type="button">
        <Menu size={21} />
      </button>

      <div className={styles.branch}>
        <span className={styles.branchMark}>AJ</span>
        <span>
          <strong>Aarohan Jewellery</strong>
          <small>Main Branch</small>
        </span>
      </div>

      <form aria-label="Search the ERP" className={styles.search} onSubmit={submitSearch} role="search">
        <button aria-label="Search invoices" className={styles.searchSubmit} type="submit">
          <Search aria-hidden="true" size={17} />
        </button>
        <input
          aria-label="Search anything"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search anything..."
          type="search"
          value={query}
        />
        <kbd>⌘ K</kbd>
      </form>

      <div className={styles.actions}>
        <div className={styles.popoverWrap}>
          <button
            aria-expanded={openPanel === "notifications"}
            aria-label={hasUnreadNotification ? "Notifications, 1 unread" : "Notifications, no unread items"}
            className={styles.iconButton}
            onClick={() => setOpenPanel((current) => current === "notifications" ? null : "notifications")}
            type="button"
          >
            <Bell size={20} strokeWidth={1.8} />
            {hasUnreadNotification ? <span className={styles.notificationDot} /> : null}
          </button>
          {openPanel === "notifications" ? (
            <div className={styles.popover} role="status">
              <strong>Notifications</strong>
              <p>Invoice S-000123 has a payment due.</p>
              {hasUnreadNotification ? (
                <button onClick={() => {
                  setHasUnreadNotification(false);
                  setOpenPanel(null);
                }} type="button">Mark as read</button>
              ) : (
                <span className={styles.allRead}>All caught up</span>
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.popoverWrap}>
          <button
            aria-expanded={openPanel === "profile"}
            aria-label="Open account menu"
            className={styles.profile}
            onClick={() => setOpenPanel((current) => current === "profile" ? null : "profile")}
            type="button"
          >
            <span className={styles.avatar}>A</span>
            <span className={styles.admin}>Admin</span>
            <ChevronDown className={styles.chevron} size={15} />
          </button>
          {openPanel === "profile" ? (
            <div className={`${styles.popover} ${styles.profilePopover}`} role="menu">
              <strong>Admin</strong>
              <p>admin@aarohanjewellery.com</p>
              <Link href="/login" role="menuitem">Sign out</Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
