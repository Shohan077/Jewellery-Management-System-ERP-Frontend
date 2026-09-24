"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Barcode,
  BadgeCheck,
  ClipboardCheck,
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
      { label: "Inventory Management", href: "/inventory/management" },
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
    href: "/product-management/product-list",
    activePrefixes: ["/product-management"],
    children: [
      { label: "Product List", href: "/product-management/product-list" },
      { label: "Product Management", href: "/product-management/products" },
      { label: "Category Management", href: "/product-management/categories" },
      { label: "Sub Category", href: "/product-management/categories#sub-categories" },
      { label: "Product Attributes", href: "/product-management/attributes" },
      { label: "Design Management", href: "/product-management/designs" },
      { label: "Product Catalogue", href: "/product-management/catalog" },
    ],
  },
  {
    label: "Gold Management",
    icon: CircleDollarSign,
    href: "/gold-rates/management-129",
    activePrefixes: ["/gold-rates"],
    children: [
      { label: "Gold Transactions", href: "/gold-rates/transactions" },
      { label: "Gold Rate Management", href: "/gold-rates/management-129" },
      { label: "Gold Stock", href: "/gold-rates/stock" },
      { label: "Gold Adjustment", href: "/gold-rates/adjustments" },
      { label: "Gold Report", href: "/gold-rates/reports" },
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
    href: "/diamond-management/inventory",
    activePrefixes: ["/diamonds", "/diamond-management"],
    children: [
      { label: "Diamond Inventory", href: "/diamond-management/inventory" },
      { label: "Diamond Purchase", href: "/diamond-management/purchase" },
      { label: "Diamond Details", href: "/diamond-management/details" },
      { label: "Diamond Report", href: "/diamond-management/report" },
      { label: "Diamond List", href: "/diamonds" },
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
      { label: "Exchange Entry", href: "/old-gold/exchange" },
      { label: "Valuation", href: "/old-gold/valuation" },
      { label: "Purity Test" },
      { label: "Adjustment" },
      { label: "Old Gold & Exchange Report", href: "/old-gold/report" },
    ],
  },
  {
    label: "Production Management",
    icon: Hammer,
    href: "/production-management/orders",
    activePrefixes: ["/production-management", "/manufacturing"],
    children: [
      { label: "Work Order Overview", href: "/manufacturing/work-orders/overview" },
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
      { label: "Karigar Profile", href: "/karigars/profile" },
      { label: "Work Assignment", href: "/karigar-management/assignments" },
      { label: "Work Order", href: "/manufacturing/work-orders" },
      { label: "Material Issue", href: "/karigar-management/material-issues" },
      { label: "Material Return", href: "/karigar-management/material-returns" },
      { label: "Karigar Payment", href: "/karigar-management/payments/new" },
      { label: "Karigar Ledger", href: "/karigar-management/ledger" },
      { label: "Wage Report", href: "/karigar-management/wages" },
      { label: "Performance Report", href: "/karigar-management/performance" },
    ],
  },
  {
    label: "Customers",
    icon: UsersRound,
    href: "/customers",
    activePrefixes: ["/customers", "/customer-dues", "/loyalty"],
    children: [
      { label: "Customer List", href: "/customers" },
      { label: "Customer Management", href: "/customers/management" },
      { label: "Customer Profile", href: "/customers/profile" },
      { label: "Customer Ledger", href: "/customers/ledger" },
      { label: "Customer Due", href: "/customer-dues" },
      { label: "Add Customer" },
      { label: "Customer Group" },
      { label: "Loyalty Program", href: "/loyalty" },
    ],
  },
  {
    label: "Due Management",
    icon: WalletCards,
    href: "/customer-dues/collection",
    activePrefixes: ["/customer-dues"],
    children: [
      { label: "Due Collection Entry", href: "/customer-dues/collection" },
      { label: "Customer Due List", href: "/customer-dues" },
      { label: "Customer Ledger", href: "/customers/ledger" },
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
    label: "Accounts & Finance",
    icon: WalletCards,
    href: "/accounts/cash-in",
    activePrefixes: ["/expenses", "/accounts", "/finance"],
    children: [
      { label: "Chart of Accounts", href: "/finance/chart-of-accounts" },
      { label: "Finance Journal Entry", href: "/finance/journal-entry" },
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
    label: "Quality Control",
    icon: ClipboardCheck,
    href: "/quality-control/inspection",
    activePrefixes: ["/quality-control", "/certificates"],
    children: [
      { label: "Quality Inspection", href: "/quality-control/inspection" },
      { label: "Testing Management", href: "/quality-control/testing" },
      { label: "Certifications", href: "/certificates" },
      { label: "Issue Tracking", href: "/quality-control/issues" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports/sales",
    activePrefixes: ["/reports", "/analytics"],
    children: [
      { label: "Reports & Analytics", href: "/reports/analytics" },
      { label: "Sales Analytics", href: "/analytics/sales-report" },
      { label: "Reports Dashboard", href: "/reports/dashboard" },
      { label: "Sales Report", href: "/reports/sales" },
      { label: "Profit & Loss", href: "/reports/profit-loss" },
      { label: "Purchase Report", href: "/reports/purchase" },
      { label: "Inventory Report", href: "/reports/inventory" },
      { label: "Stock Report", href: "/inventory/stock" },
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
      { label: "Branch Management", href: "/branches/manage" },
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
    label: "Users & Roles",
    icon: LockKeyhole,
    href: "/users",
    activePrefixes: ["/users", "/settings/user-management", "/settings/roles-permissions", "/settings/activity-log"],
    children: [
      { label: "User Management", href: "/settings/user-management" },
      { label: "Roles & Permissions", href: "/settings/roles-permissions" },
      { label: "Reference Activity Log", href: "/settings/activity-log" },
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
      { label: "Company Profile", href: "/settings/company-profile" },
      { label: "Tax & Currency", href: "/settings/tax-currency" },
      { label: "Notification Settings", href: "/settings/notifications" },
      { label: "Email Configuration", href: "/settings/email-configuration" },
      { label: "SMS / WhatsApp", href: "/settings/sms-whatsapp" },
      { label: "Security Settings", href: "/settings/security" },
      { label: "System Maintenance", href: "/settings/maintenance" },
      { label: "System Preferences", href: "/settings/system" },
      { label: "Advanced System Settings", href: "/settings/system-settings" },
      { label: "Backup & Restore", href: "/settings/backup-restore" },
      { label: "Invoice Settings", href: "/barcodes/invoice-settings" },
      { label: "Units & Conversion" },
      { label: "Tax & VAT", href: "/settings/tax-currency" },
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
