"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Barcode,
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
      { label: "New Purchase", href: "/purchase-management/new" },
      { label: "Supplier Invoice" },
      { label: "Supplier" },
      { label: "Purchase Return" },
    ],
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/inventory/stock",
    activePrefixes: ["/inventory", "/products"],
    children: [
      { label: "Stock Overview", href: "/inventory/stock" },
      { label: "Stock List", href: "/inventory/stock-list" },
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
  { label: "Manufacturing", icon: Hammer },
  {
    label: "Karigar Management",
    icon: UserRoundCog,
    href: "/karigars",
    children: [
      { label: "Karigar List", href: "/karigars" },
      { label: "Work Order" },
      { label: "Material Issue" },
      { label: "Material Return" },
      { label: "Labour Payment" },
      { label: "Karigar Ledger" },
    ],
  },
  {
    label: "Customer Management",
    icon: UsersRound,
    href: "/customers",
    activePrefixes: ["/customers", "/customer-dues"],
    children: [
      { label: "Customer List", href: "/customers" },
      { label: "Customer Due", href: "/customer-dues" },
      { label: "Add Customer" },
      { label: "Customer Group" },
      { label: "Loyalty Program" },
    ],
  },
  {
    label: "Supplier Management",
    icon: ContactRound,
    href: "/suppliers",
    children: [
      { label: "Supplier List", href: "/suppliers" },
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
    label: "Accounts",
    icon: WalletCards,
    href: "/expenses",
    children: [
      { label: "Expense", href: "/expenses" },
      { label: "Cashbook" },
      { label: "Income" },
      { label: "Payment" },
      { label: "Journal" },
      { label: "Ledger" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports/sales",
    activePrefixes: ["/reports"],
    children: [
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
    label: "Branch Management",
    icon: Building2,
    href: "/branches",
    activePrefixes: ["/branches", "/stock-transfers"],
    children: [
      { label: "Branch List", href: "/branches" },
      { label: "Branch Stock" },
      { label: "Stock Transfer", href: "/stock-transfers/new" },
    ],
  },
  {
    label: "Barcode & Printing",
    icon: Barcode,
    href: "/barcodes",
    children: [
      { label: "Generate Barcode", href: "/barcodes" },
      { label: "Label Print" },
      { label: "Invoice Print" },
      { label: "QR Code" },
      { label: "Print Settings" },
    ],
  },
  { label: "Users & Security", icon: LockKeyhole },
  {
    label: "System Settings",
    icon: Settings,
    href: "/settings",
    children: [
      { label: "General Settings", href: "/settings" },
      { label: "Invoice Settings" },
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
                      const childActive = child.href
                        ? pathname === child.href || pathname.startsWith(`${child.href}/`)
                        : false;
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
