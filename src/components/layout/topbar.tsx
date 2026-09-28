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
  "/branches": "Branch List",
  "/diamonds": "Diamond List",
  "/diamond-management/inventory": "Diamond Inventory",
  "/settings/activity-log": "Audit Log",
  "/settings": "System Settings",
  "/customers": "Customer Management",
  "/karigars": "Karigar List",
  "/karigars/management": "Karigar Management",
  "/mortgages": "Mortgage / Pawn",
  "/mortgages/management": "Mortgage / Pawn",
  "/purchases": "Purchase Management",
  "/accounts/daily-closing": "Daily Cash Book",
  "/settings/user-management": "User Management",
  "/sales/invoices": "Sales Invoice",
  "/sales/invoice-management": "Sales Invoice",
  "/suppliers": "Supplier List",
  "/purchases/suppliers": "Supplier List",
  "/inventory/gold-stock": "Gold Stock",
  "/inventory/gold-lots": "Gold Stock",
  "/inventory/stock": "Stock Overview",
  "/inventory/stock-list": "Inventory Stock",
  "/gold-rates/stock": "Gold Stock",
  "/reports/profit-loss": "Profit & Loss Report",
  "/manufacturing/production-orders": "Production Orders",
  "/production-management/orders": "Production Orders",
  "/accounts/journal-entry": "Journal Entries",
  "/reports/inventory": "Stock Report",
  "/users": "User List",
  "/analytics/sales-report": "Sales Report",
  "/pos-sales/pos-billing": "POS Billing",
  "/pos/new": "POS & Sales",
  "/reports/sales-report": "Sales Report",
  "/mortgages/management-legacy": "Mortgage / Pawn",
  "/accounts/legacy": "Accounts Dashboard",
  "/users/security-legacy": "Users & Security",
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
  const reference64Route = [
    "/accounts/cash-ledger",
    "/reports/profit-loss",
    "/users",
    "/branches",
  ].includes(pathname);
  const reference65Route = ["/dashboard", "/pos/new", "/inventory/management-65", "/reports/analytics-65"].includes(pathname);
  const reference66Route = ["/purchases", "/gold-rates/transactions", "/inventory/management", "/reports/analytics-66"].includes(pathname);
  const reference67Route = ["/mortgages/management", "/accounts", "/reports/analytics", "/users/security"].includes(pathname);
  const reference68Route = [
    "/manufacturing/production-68",
    "/karigars/management-68",
    "/customers/management-68",
    "/reports/inventory-valuation-68",
  ].includes(pathname);
  const reference69Route = [
    "/pos/sales-69",
    "/suppliers/management-69",
    "/gold-rates/management-69",
    "/settings/system-69",
  ].includes(pathname);
  const reference70Route = [
    "/old-gold/management-70",
    "/manufacturing/production-70",
    "/reports/analytics-70",
    "/users/security-70",
  ].includes(pathname);
  const reference71Route = [
    "/notifications/center-71",
    "/branches/management-71",
    "/dashboard/executive-71",
    "/settings/activity-log-71",
  ].includes(pathname);
  const reference72Route = [
    "/gold-rates/rates-72",
    "/karigars/ledger-72",
    "/customers/dues-72",
    "/settings/backup-restore-72",
  ].includes(pathname);
  const datedCompactRoute = reference66Route || reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route;
  const usesContentHeading = pathname === "/dashboard"
    || pathname === "/pos/new"
    || pathname === "/inventory/management"
    || pathname === "/reports/analytics"
    || pathname === "/inventory/management-65"
    || pathname === "/reports/analytics-65"
    || pathname === "/purchases"
    || pathname === "/gold-rates/transactions"
    || pathname === "/mortgages/management"
    || pathname === "/accounts"
    || pathname === "/users/security"
    || pathname === "/manufacturing/production-68"
    || pathname === "/karigars/management-68"
    || pathname === "/customers/management-68"
    || pathname === "/reports/inventory-valuation-68"
    || pathname === "/pos/sales-69"
    || pathname === "/suppliers/management-69"
    || pathname === "/gold-rates/management-69"
    || pathname === "/settings/system-69"
    || pathname === "/old-gold/management-70"
    || pathname === "/manufacturing/production-70"
    || pathname === "/reports/analytics-70"
    || pathname === "/users/security-70"
    || pathname === "/notifications/center-71"
    || pathname === "/branches/management-71"
    || pathname === "/dashboard/executive-71"
    || pathname === "/settings/activity-log-71"
    || pathname === "/gold-rates/rates-72"
    || pathname === "/karigars/ledger-72"
    || pathname === "/customers/dues-72"
    || pathname === "/settings/backup-restore-72"
    || pathname === "/inventory/gold-lots"
    || pathname === "/reports/sales-report";
  const searchPlaceholder = datedCompactRoute
    ? pathname === "/mortgages/management"
      ? "Search transactions, invoices, customers..."
      : pathname === "/pos/sales-69"
        ? "Search by invoice, customer, product..."
        : pathname === "/suppliers/management-69"
          ? "Search by supplier name, phone, ID..."
          : pathname === "/gold-rates/management-69"
            ? "Search gold rate, purity, or transaction..."
            : pathname === "/settings/system-69"
              ? "Search settings, preference, backup..."
              : pathname === "/old-gold/management-70"
                ? "Search old gold, customer, invoice..."
                : pathname === "/manufacturing/production-70"
                  ? "Search production order, item, karigar..."
                  : pathname === "/reports/analytics-70"
                    ? "Search reports..."
                    : pathname === "/users/security-70"
                      ? "Search user, role, permission..."
                      : pathname === "/notifications/center-71"
                        ? "Search notifications..."
                        : pathname === "/branches/management-71"
                          ? "Search branch..."
                          : pathname === "/dashboard/executive-71"
                            ? "Search anything..."
                            : pathname === "/settings/activity-log-71"
                              ? "Search activity, user, module..."
                              : pathname === "/gold-rates/rates-72"
                                ? "Search gold rate, purity, date..."
                                : pathname === "/karigars/ledger-72"
                                  ? "Search karigar name, ID, phone..."
                                  : pathname === "/customers/dues-72"
                                    ? "Search customer name, phone, invoice..."
                                    : pathname === "/settings/backup-restore-72"
                                      ? "Search settings, backup..."
              : "Search here..."
    : usesContentHeading
    ? "Search anything..."
    : pathname === "/pos-sales/pos-billing"
    ? "Search invoice or scan barcode..."
    : pathname === "/inventory/stock"
      ? "Search stock..."
      : pathname === "/analytics/sales-report"
        ? "Search sales..."
        : pathname.startsWith("/customers")
    ? "Search customers..."
    : pathname.startsWith("/karigars")
      ? "Search karigar..."
      : pathname.startsWith("/mortgages")
        ? "Search mortgage..."
        : pathname === "/users"
          ? "Search by name, email or phone..."
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
    <header className={`${styles.topbar} ${reference64Route ? styles.contextTopbar : ""} ${reference65Route ? styles.reference65Topbar : ""} ${datedCompactRoute ? styles.reference66Topbar : ""}`}>
      <div className={styles.titleGroup}>
        <button aria-label="Open navigation" className={styles.menuButton} onClick={onOpenNavigation} type="button">
          <Menu size={20} />
        </button>
        {usesContentHeading ? null : <strong className={styles.pageTitle}>{getPageTitle(pathname)}</strong>}
      </div>

      {reference64Route ? (
        <div className={styles.contextControls}>
          <select aria-label="Current branch" defaultValue="Main Branch">
            <option>Main Branch</option>
            <option>Uttara Branch</option>
            <option>Dhanmondi Branch</option>
          </select>
          {pathname === "/accounts/cash-ledger" || pathname === "/reports/profit-loss" ? (
            <select aria-label="Reporting period" defaultValue={pathname === "/accounts/cash-ledger" ? "May 18, 2024" : "May 1, 2024 - May 18, 2024"}>
              <option>{pathname === "/accounts/cash-ledger" ? "May 18, 2024" : "May 1, 2024 - May 18, 2024"}</option>
              <option>Previous Period</option>
            </select>
          ) : (
            <form aria-label="Search this page" className={styles.contextSearch} onSubmit={submitSearch} role="search">
              <Search aria-hidden="true" size={13} />
              <input
                aria-label="Search this page"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={pathname === "/branches" ? "Search by branch name..." : searchPlaceholder}
                type="search"
                value={query}
              />
            </form>
          )}
        </div>
      ) : datedCompactRoute ? (
        <div className={styles.reference66Controls}>
          <form aria-label="Search the ERP" className={styles.search} onSubmit={submitSearch} role="search">
            <Search aria-hidden="true" size={14} />
            <input aria-label="Search anything" onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} type="search" value={query} />
          </form>
          {pathname === "/reports/analytics-70" || pathname === "/settings/activity-log-71" ? (
            <select aria-label="Reporting period" defaultValue="01 May 2025 - 26 May 2025">
              <option>01 May 2025 - 26 May 2025</option>
              <option>Previous period</option>
            </select>
          ) : (
            <select aria-label="Business date" defaultValue="26 May 2025"><option>26 May 2025</option><option>25 May 2025</option></select>
          )}
        </div>
      ) : (
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
      )}

      <div className={styles.actions}>
        {!reference64Route ? <div className={styles.popoverWrap}>
          <button
            aria-expanded={openPanel === "notifications"}
            aria-label={hasUnreadNotification ? "Notifications, one unread" : "Notifications"}
            className={styles.iconButton}
            onClick={() => setOpenPanel((current) => current === "notifications" ? null : "notifications")}
            type="button"
          >
            <Bell size={18} strokeWidth={1.8} />
            {hasUnreadNotification ? <span className={`${styles.notificationDot} ${datedCompactRoute ? styles.notificationCount : ""}`}>{datedCompactRoute ? reference69Route || reference71Route || reference72Route ? "4" : "3" : null}</span> : null}
          </button>
          {openPanel === "notifications" ? (
            <div className={styles.popover} role="status">
              <strong>Notifications</strong>
              <p>Invoice INV-250498 has a payment pending.</p>
              <button onClick={() => { setHasUnreadNotification(false); setOpenPanel(null); }} type="button">Mark as read</button>
            </div>
          ) : null}
        </div> : null}

        {!datedCompactRoute ? <div className={styles.popoverWrap}>
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
        </div> : null}

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
            {!datedCompactRoute ? <ChevronDown className={styles.chevron} size={14} /> : null}
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
