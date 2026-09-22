"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Barcode,
  BadgeCheck,
  Boxes,
  Building2,
  CircleDollarSign,
  ContactRound,
  Gem,
  Hammer,
  LayoutDashboard,
  LockKeyhole,
  PackageSearch,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRoundCog,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLockup } from "@/components/brand-mark";
import styles from "./sidebar.module.css";

type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  activePrefixes?: ReadonlyArray<string>;
  children?: ReadonlyArray<{ label: string; href?: string }>;
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "POS & Sales",
    icon: ReceiptText,
    href: "/sales/invoices",
    activePrefixes: ["/sales", "/pos"],
    children: [
      { label: "POS (New Sale)", href: "/pos/new" },
      { label: "Sales Invoice", href: "/sales/invoices" },
      { label: "Quotation", href: "/sales/quotations/new" },
      { label: "Sales Return", href: "/sales/returns/new" },
    ],
  },
  {
    label: "Purchase",
    icon: ShoppingBag,
    href: "/purchases",
    activePrefixes: ["/purchases", "/purchase-orders", "/purchase-management"],
    children: [
      { label: "Purchase Invoice", href: "/purchases" },
      { label: "Purchase Orders", href: "/purchase-orders" },
      { label: "Purchase Order Documents", href: "/purchases/orders" },
      { label: "New Purchase", href: "/purchase-management/new" },
      { label: "Purchase Returns", href: "/purchases/returns" },
      { label: "Purchase Return Orders", href: "/purchases/return-orders" },
      { label: "New Purchase Return", href: "/purchases/returns/new" },
      { label: "Supplier Directory", href: "/purchases/supplier-directory" },
      { label: "Supplier Management", href: "/purchases/suppliers" },
      { label: "Purchase Report", href: "/purchases/reports" },
      { label: "Order Management", href: "/purchases/order-management" },
      { label: "Purchase Expense", href: "/purchases/expenses" },
      { label: "Purchase Expense Entry", href: "/purchases/expense-entry" },
      { label: "Purchase Expense Report", href: "/purchases/expense-report" },
      { label: "Expense Categories", href: "/purchases/expense-categories" },
      { label: "BDT Expense Entry", href: "/purchases/expenses/new" },
      { label: "BDT Expense Report", href: "/purchases/expenses/report" },
    ],
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/inventory/stock",
    activePrefixes: ["/inventory", "/products"],
    children: [
      { label: "Stock Overview", href: "/inventory/stock" },
      { label: "Stock View", href: "/inventory/stock-view" },
      { label: "Stock List", href: "/inventory/stock-list" },
      { label: "Stock Alerts", href: "/inventory/alerts" },
      { label: "Product List", href: "/products" },
      { label: "Category" },
      { label: "Brand" },
      { label: "Material" },
      { label: "Stock Transfer" },
    ],
  },
  {
    label: "Product Management",
    icon: PackageSearch,
    href: "/product-management/products",
    activePrefixes: ["/product-management"],
    children: [
      { label: "Product List", href: "/product-management/products" },
      { label: "Product Catalogue", href: "/product-management/catalog" },
    ],
  },
  {
    label: "Gold Management",
    icon: CircleDollarSign,
    href: "/gold-rates",
    children: [
      { label: "Gold Rate", href: "/gold-rates" },
      { label: "Gold Rate Manager", href: "/gold-rates/manage" },
      { label: "Purity & Karat" },
      { label: "Unit Conversion" },
      { label: "Gold Purchase" },
      { label: "Old Gold / Exchange" },
    ],
  },
  {
    label: "Diamond Management",
    icon: Gem,
    href: "/diamonds",
    children: [
      { label: "Diamond List", href: "/diamonds" },
      { label: "Diamond Purchase" },
      { label: "Certificate Management" },
      { label: "Diamond Stock" },
      { label: "Diamond Sale" },
      { label: "Reports" },
    ],
  },
  {
    label: "Old Gold / Exchange",
    icon: CircleDollarSign,
    href: "/old-gold/new",
    children: [
      { label: "Old Gold Purchase", href: "/old-gold/new" },
      { label: "Exchange Entry" },
      { label: "Valuation" },
      { label: "Purity Test" },
      { label: "Adjustment" },
    ],
  },
  {
    label: "Production Management",
    icon: Hammer,
    href: "/production-management/orders",
    activePrefixes: ["/production-management", "/manufacturing"],
    children: [
      { label: "Production Order", href: "/production-management/orders" },
      { label: "Work in Progress" },
      { label: "Finished Items", href: "/production-management/finished-items" },
      { label: "Material Issue", href: "/production-management/material-issues" },
      { label: "Material Return", href: "/production-management/material-returns/new" },
      { label: "Production Report", href: "/production-management/reports/detailed" },
      { label: "Production Analytics", href: "/production-management/reports" },
      { label: "Manufacturing Orders", href: "/manufacturing/work-orders" },
      { label: "Create Manufacturing Order", href: "/manufacturing/work-orders/new" },
      { label: "Create Material Issue", href: "/manufacturing/material-issues/new" },
      { label: "Material Return Records", href: "/manufacturing/material-returns" },
      { label: "Legacy Material Return", href: "/manufacturing/material-returns/new" },
      { label: "Finished Product Entry", href: "/manufacturing/finished-products/new" },
      { label: "Wastage List", href: "/manufacturing/wastage" },
      { label: "Wastage Entry", href: "/manufacturing/wastage/new" },
      { label: "Karigar Payments", href: "/manufacturing/karigar-payments" },
      { label: "Karigar Payment Entry", href: "/manufacturing/karigar-payments/new" },
    ],
  },
  {
    label: "Karigar Management",
    icon: UserRoundCog,
    href: "/karigars",
    activePrefixes: ["/karigars", "/karigar-management"],
    children: [
      { label: "Karigar List", href: "/karigars" },
      { label: "Karigar Management", href: "/karigars/manage" },
      { label: "Work Order" },
      { label: "Material Issue" },
      { label: "Material Return" },
      { label: "Karigar Payment", href: "/karigar-management/payments/new" },
      { label: "Karigar Ledger", href: "/karigar-management/ledger" },
    ],
  },
  {
    label: "Customer Management",
    icon: UsersRound,
    href: "/customers",
    activePrefixes: ["/customers", "/customer-dues", "/loyalty"],
    children: [
      { label: "Customer List", href: "/customers" },
      { label: "Customer Due", href: "/customer-dues" },
      { label: "Add Customer" },
      { label: "Customer Group" },
      { label: "Loyalty Program", href: "/loyalty" },
    ],
  },
  {
    label: "Supplier Management",
    icon: ContactRound,
    href: "/suppliers",
    children: [
      { label: "Supplier List", href: "/suppliers" },
      { label: "Supplier Payment", href: "/suppliers/payments/new" },
      { label: "Supplier Ledger", href: "/suppliers/ledger" },
      { label: "Supplier Statement", href: "/suppliers/statement" },
      { label: "Add Supplier" },
      { label: "Supplier Category" },
      { label: "Supplier Ledger" },
    ],
  },
  {
    label: "Mortgage / Pawn",
    icon: CircleDollarSign,
    href: "/mortgages/new",
    activePrefixes: ["/mortgages"],
    children: [
      { label: "New Mortgage", href: "/mortgages/new" },
      { label: "Mortgage List" },
      { label: "Payment / Release" },
      { label: "Overdue List" },
    ],
  },
  {
    label: "Accounts & Cash",
    icon: WalletCards,
    href: "/accounts/cash-in",
    activePrefixes: ["/expenses", "/accounts"],
    children: [
      { label: "Expense", href: "/expenses" },
      { label: "Expense Ledger", href: "/accounts/expenses" },
      { label: "Cash In Entry", href: "/accounts/cash-in" },
      { label: "Cash Out Entry", href: "/accounts/cash-out" },
      { label: "Cash Ledger", href: "/accounts/cash-ledger" },
      { label: "Daily Closing", href: "/accounts/daily-closing" },
      { label: "Receipt Entry", href: "/accounts/receipt-entry" },
      { label: "Payment Entry", href: "/accounts/payment-entry" },
      { label: "Expense Entry", href: "/accounts/expense-entry" },
      { label: "Expense Report", href: "/accounts/expense-report" },
      { label: "Payment", href: "/accounts/payments" },
      { label: "Journal Entry", href: "/accounts/journal-entry" },
      { label: "Account Ledger", href: "/accounts/account-ledger" },
      { label: "Trial Balance", href: "/accounts/trial-balance" },
      { label: "Profit & Loss", href: "/accounts/profit-loss" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports/sales",
    activePrefixes: ["/reports"],
    children: [
      { label: "Reports Dashboard", href: "/reports/dashboard" },
      { label: "Sales Report", href: "/reports/sales" },
      { label: "Profit & Loss", href: "/reports/profit-loss" },
      { label: "Purchase Report" },
      { label: "Stock Report" },
      { label: "Customer Report" },
      { label: "Financial Report" },
      { label: "Tax Report" },
    ],
  },
  {
    label: "Certificate Management",
    icon: BadgeCheck,
    href: "/certificates",
    children: [
      { label: "Certificate List", href: "/certificates" },
      { label: "Add Certificate" },
      { label: "Hallmark Verification" },
    ],
  },
  {
    label: "Branch Management",
    icon: Building2,
    href: "/branches",
    activePrefixes: ["/branches", "/stock-transfers"],
    children: [
      { label: "Branch List", href: "/branches" },
      { label: "Branch Overview", href: "/branches/overview" },
      { label: "Multi-Branch Dashboard", href: "/branches/sales-dashboard" },
      { label: "Branch Stock" },
      { label: "Stock Transfer", href: "/stock-transfers/new" },
    ],
  },
  {
    label: "Barcode & Invoice",
    icon: Barcode,
    href: "/barcodes",
    children: [
      { label: "Barcode Studio", href: "/barcodes" },
      { label: "Barcode Generation", href: "/barcodes/generate" },
      { label: "Barcode Printing", href: "/barcodes/print" },
      { label: "Invoice Settings", href: "/barcodes/invoice-settings" },
      { label: "Invoice Template", href: "/barcodes/invoice-templates" },
      { label: "QR Code" },
      { label: "Print Settings" },
    ],
  },
  {
    label: "Users & Security",
    icon: LockKeyhole,
    href: "/users",
    activePrefixes: ["/users"],
    children: [
      { label: "User List", href: "/users" },
      { label: "Roles & Permissions" },
      { label: "Activity Log", href: "/users/activity-log" },
      { label: "Login History" },
      { label: "Password Policy" },
    ],
  },
  {
    label: "System Settings",
    icon: Settings,
    href: "/settings",
    children: [
      { label: "General Settings", href: "/settings" },
      { label: "System Preferences", href: "/settings/system" },
      { label: "Invoice Settings", href: "/barcodes/invoice-settings" },
      { label: "Units & Conversion" },
      { label: "Tax & VAT" },
      { label: "Backup & Restore" },
      { label: "Notifications" },
    ],
  },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Close navigation"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
        type="button"
      />
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.brandRow}>
          <Link aria-label="Jewellery ERP dashboard" className={styles.brand} href="/dashboard" onClick={onClose}>
            <span className={styles.brandWide}><BrandLockup /></span>
            <span className={styles.brandCompact}><BrandLockup compact /></span>
          </Link>
          <button aria-label="Close navigation" className={styles.close} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Main navigation" className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href
              ? item.href === "/dashboard"
                ? pathname === item.href
                : (item.activePrefixes ?? [item.href]).some((prefix) => pathname.startsWith(prefix))
              : false;
            const activeChildHref = item.children
              ?.map((child) => child.href)
              .filter((href): href is string => Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)))
              .sort((first, second) => second.length - first.length)[0];
            const content = (
              <>
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.children || item.label === "Accounts" ? (
                  <span aria-hidden="true" className={`${styles.chevron} ${active ? styles.chevronOpen : ""}`}>›</span>
                ) : null}
              </>
            );

            return (
              <div className={styles.navGroup} key={item.label}>
                {item.href ? (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`${styles.navItem} ${active ? styles.active : ""}`}
                    href={item.href}
                    onClick={onClose}
                    title={item.label}
                  >
                    {content}
                  </Link>
                ) : (
                  <span aria-disabled="true" className={styles.navItem} title={item.label}>
                    {content}
                  </span>
                )}
                {active && item.children ? (
                  <div aria-label={`${item.label} navigation`} className={styles.subnav}>
                    {item.children.map((child) => {
                      const childActive = child.href === activeChildHref;
                      return child.href ? (
                        <Link
                          aria-current={childActive ? "page" : undefined}
                          className={childActive ? styles.subnavActive : ""}
                          href={child.href}
                          key={child.label}
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <span aria-disabled="true" key={child.label}>{child.label}</span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Sparkles size={16} />
          <span>Made for modern jewellers</span>
        </div>
      </aside>
    </>
  );
}
