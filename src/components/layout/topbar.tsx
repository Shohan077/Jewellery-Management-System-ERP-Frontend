"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Bell, ChevronDown, Mail, Menu, Search } from "lucide-react";
import styles from "./topbar.module.css";

const routeTitles: ReadonlyArray<[string, string]> = [
  ["/manufacturing/production-orders/detail", "Production Order Details"],
  ["/customers/list", "Customer List"],
  ["/customers", "Customer List"],
  ["/gold-rates/stock", "Gold Stock"],
  ["/inventory/gold-stock", "Gold Stock"],
  ["/reports/sales-report", "Sales Report"],
  ["/reports/sales", "Sales Report"],
  ["/pos-sales/pos-billing", "POS Billing"],
  ["/pos/new", "POS Billing"],
  ["/dashboard", "Dashboard"],
];

const exactRouteTitles: Readonly<Record<string, string>> = {
  "/accounts": "Accounts Dashboard",
  "/accounts/account-ledger": "Ledger",
  "/accounts/cash-ledger": "Cash Book",
  "/branches": "Branch Management",
  "/karigars": "Karigar Management",
  "/karigars/management": "Karigar Management",
  "/mortgages": "Mortgage / Pawn",
  "/mortgages/management": "Mortgage / Pawn",
  "/settings/user-management": "User Management",
  "/users": "User Management",
};

function getPageTitle(pathname: string) {
  if (exactRouteTitles[pathname]) return exactRouteTitles[pathname];
  const route = routeTitles.find(([path]) => pathname.startsWith(path));
  if (route) return route[1];

  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "Dashboard";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Topbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchPlaceholder = pathname.startsWith("/customers")
    ? "Search customers..."
    : pathname.startsWith("/karigars")
      ? "Search karigar..."
      : pathname.startsWith("/mortgages")
        ? "Search mortgage..."
        : pathname.startsWith("/branches")
          ? "Search branches..."
          : pathname === "/accounts"
            ? "Search accounts..."
            : "Search...";
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState<"notifications" | "messages" | "profile" | null>(null);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/sales/invoices?search=${encodeURIComponent(search)}` : "/sales/invoices");
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.titleGroup}>
        <button aria-label="Open navigation" className={styles.menuButton} onClick={onOpenNavigation} type="button">
          <Menu size={20} />
        </button>
        <strong className={styles.pageTitle}>{getPageTitle(pathname)}</strong>
      </div>

      <form aria-label="Search the ERP" className={styles.search} onSubmit={submitSearch} role="search">
        <Search aria-hidden="true" size={14} />
        <input
          aria-label="Search anything"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          type="search"
          value={query}
        />
      </form>

      <div className={styles.actions}>
        <div className={styles.popoverWrap}>
          <button
            aria-expanded={openPanel === "notifications"}
            aria-label={hasUnreadNotification ? "Notifications, one unread" : "Notifications"}
            className={styles.iconButton}
            onClick={() => setOpenPanel((current) => current === "notifications" ? null : "notifications")}
            type="button"
          >
            <Bell size={18} strokeWidth={1.8} />
            {hasUnreadNotification ? <span className={styles.notificationDot} /> : null}
          </button>
          {openPanel === "notifications" ? (
            <div className={styles.popover} role="status">
              <strong>Notifications</strong>
              <p>Invoice INV-250498 has a payment pending.</p>
              <button onClick={() => { setHasUnreadNotification(false); setOpenPanel(null); }} type="button">Mark as read</button>
            </div>
          ) : null}
        </div>

        <div className={styles.popoverWrap}>
          <button
            aria-expanded={openPanel === "messages"}
            aria-label="Messages"
            className={styles.iconButton}
            onClick={() => setOpenPanel((current) => current === "messages" ? null : "messages")}
            type="button"
          >
            <Mail size={18} strokeWidth={1.8} />
          </button>
          {openPanel === "messages" ? (
            <div className={styles.popover} role="status">
              <strong>Messages</strong>
              <p>You have no unread messages.</p>
              <span className={styles.allRead}>All caught up</span>
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
            <span className={styles.admin}><strong>Admin</strong><small>Super Admin</small></span>
            <ChevronDown className={styles.chevron} size={14} />
          </button>
          {openPanel === "profile" ? (
            <div className={`${styles.popover} ${styles.profilePopover}`} role="menu">
              <strong>Admin</strong>
              <p>admin@jewelleryerp.com</p>
              <Link href="/login" role="menuitem">Sign out</Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
