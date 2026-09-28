"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Barcode,
  BadgeCheck,
  Bell,
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
      { label: "POS Billing", href: "/pos/new" },
      { label: "Sales Order Management", href: "/sales/orders" },
      { label: "Invoice Management", href: "/sales/invoice-management" },
      { label: "Sales Return Entry", href: "/sales/return-entry" },
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
      { label: "Purchase List", href: "/purchases" },
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
    activePrefixes: ["/inventory", "/products", "/diamond-management/inventory"],
    children: [
      { label: "Inventory Management", href: "/inventory/management" },
      { label: "Stock Adjustment Entry", href: "/inventory/adjustments" },
      { label: "Gold Stock", href: "/inventory/gold-lots" },
      { label: "Gold Item Stock", href: "/inventory/gold-stock" },
      { label: "Diamond Stock", href: "/diamond-management/inventory" },
      { label: "Stock Overview", href: "/inventory/stock" },
      { label: "Stock View", href: "/inventory/stock-view" },
      { label: "Inventory Stock", href: "/inventory/stock-list" },
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
      { label: "Management Overview", href: "/product-management/overview" },
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
      { label: "Current Gold Rates", href: "/gold-rates/current" },
      { label: "Gold Rate Management", href: "/gold-rates/management-129" },
      { label: "Gold Stock", href: "/gold-rates/stock" },
      { label: "Gold Adjustment", href: "/gold-rates/adjustments" },
      { label: "Gold Report", href: "/gold-rates/reports" },
      { label: "Gold Rates", href: "/gold-rates" },
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
    activePrefixes: ["/diamonds", "/diamond-management/details", "/diamond-management/purchase", "/diamond-management/report"],
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
    label: "Manufacturing",
    icon: Hammer,
    href: "/production-management/orders",
    activePrefixes: ["/production-management", "/manufacturing"],
    children: [
      { label: "Work Order Overview", href: "/manufacturing/work-orders/overview" },
      { label: "Manufacturing Dashboard", href: "/manufacturing/dashboard" },
      { label: "Material Requests", href: "/manufacturing/material-requests" },
      { label: "Work Order Detail", href: "/manufacturing/work-orders/detail" },
      { label: "Final Quality Approval", href: "/manufacturing/final-quality" },
      { label: "Finished Goods QC", href: "/manufacturing/finished-goods-control" },
      { label: "Production Orders", href: "/manufacturing/production-orders" },
      { label: "Create Production Order", href: "/manufacturing/production-orders/new" },
      { label: "Material & WIP Tracking", href: "/manufacturing/wip-tracking" },
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
      { label: "Karigar Directory", href: "/karigars/management" },
      { label: "Karigar Overview", href: "/karigars/overview" },
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
      { label: "Customer Overview", href: "/customers/overview" },
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
      { label: "Due Management", href: "/customer-dues/management" },
      { label: "Customer Due List", href: "/customer-dues" },
      { label: "Customer Ledger", href: "/customers/ledger" },
    ],
  },
  {
    label: "Supplier Management",
    icon: ContactRound,
    href: "/suppliers",
    children: [
      { label: "Supplier Management", href: "/suppliers/management" },
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
    href: "/mortgages",
    activePrefixes: ["/mortgages"],
    children: [
      { label: "New Mortgage", href: "/mortgages/new" },
      { label: "Mortgage Management", href: "/mortgages/management" },
      { label: "Mortgage List", href: "/mortgages" },
      { label: "Payment / Release" },
      { label: "Overdue List" },
    ],
  },
  {
    label: "Accounts",
    icon: WalletCards,
    href: "/accounts",
    activePrefixes: ["/expenses", "/accounts", "/finance"],
    children: [
      { label: "Cash Book", href: "/accounts/cash-ledger" },
      { label: "Expense", href: "/accounts/expense-entry" },
      { label: "Income", href: "/accounts/cash-in" },
      { label: "Payment", href: "/accounts/payment-entry" },
      { label: "Receipt", href: "/accounts/receipt-entry" },
      { label: "Journal Entries", href: "/accounts/journal-entry" },
      { label: "Ledger", href: "/accounts/account-ledger" },
      { label: "Chart of Accounts", href: "/finance/chart-of-accounts" },
      { label: "Accounts Dashboard", href: "/accounts" },
      { label: "Bank Accounts", href: "/accounts/cash-in" },
      { label: "Finance Journal Entry", href: "/finance/journal-entry" },
      { label: "Expense", href: "/expenses" },
      { label: "Expense Ledger", href: "/accounts/expenses" },
      { label: "Cash In Entry", href: "/accounts/cash-in" },
      { label: "Cash Out Entry", href: "/accounts/cash-out" },
      { label: "Cash Ledger", href: "/accounts/cash-ledger" },
      { label: "Daily Cash Book", href: "/accounts/daily-closing" },
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
      { label: "Quality Control Overview", href: "/quality-control/management" },
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
      { label: "Sales Report", href: "/reports/sales-report" },
      { label: "Sales Analytics", href: "/reports/sales" },
      { label: "Purchase Report", href: "/reports/purchase" },
      { label: "Stock Report", href: "/reports/inventory" },
      { label: "Profit & Loss", href: "/reports/profit-loss" },
      { label: "Reports & Analytics", href: "/reports/analytics" },
      { label: "Enterprise Reports", href: "/reports/enterprise" },
      { label: "Business Performance", href: "/reports/business-performance" },
      { label: "Executive Summary", href: "/reports/executive-summary" },
      { label: "Analytics Overview", href: "/reports/overview" },
      { label: "Manufacturing Report", href: "/reports/manufacturing" },
      { label: "Manufacturing Profitability", href: "/reports/manufacturing-profitability" },
      { label: "Sales Analytics", href: "/analytics/sales-report" },
      { label: "Reports Dashboard", href: "/reports/dashboard" },
      { label: "Inventory Report", href: "/reports/inventory" },
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
      { label: "Branch Performance", href: "/branches/management-dashboard" },
      { label: "Branch List", href: "/branches" },
      { label: "Branch Overview", href: "/branches/overview" },
      { label: "Multi-Branch Dashboard", href: "/branches/sales-dashboard" },
      { label: "Branch Stock" },
      { label: "Stock Transfer", href: "/stock-transfers/new" },
      { label: "Stock Transfer Management", href: "/stock-transfers" },
    ],
  },
  {
    label: "Barcode & Invoice",
    icon: Barcode,
    href: "/barcodes",
    children: [
      { label: "Barcode Studio", href: "/barcodes" },
      { label: "Barcode & Printing", href: "/barcodes/management" },
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
    activePrefixes: ["/users", "/settings/user-management", "/settings/roles-permissions"],
    children: [
      { label: "Users", href: "/settings/user-management" },
      { label: "Users & Security", href: "/users/security" },
      { label: "Roles & Permissions", href: "/settings/roles-permissions" },
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
      { label: "Audit Log", href: "/settings/activity-log" },
      { label: "Shop Settings", href: "/settings/shop" },
      { label: "Company Profile", href: "/settings/company-profile" },
      { label: "Tax & Currency", href: "/settings/tax-currency" },
      { label: "Notification Settings", href: "/settings/notifications" },
      { label: "Notifications & Integrations", href: "/settings/notifications-integrations" },
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
  const compactReferenceRoute = reference65Route || reference66Route || reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route;
  const reference65Labels = new Set([
    "Dashboard",
    "POS & Sales",
    "Purchase",
    "Inventory",
    "Product Management",
    "Gold Management",
    "Diamond Management",
    "Customers",
    "Supplier Management",
    "Reports",
    "System Settings",
  ]);
  const reference66Labels = [
    "Dashboard",
    "POS & Sales",
    "Purchase",
    "Inventory",
    "Gold Management",
    "Diamond Management",
    "Old Gold / Exchange",
    "Manufacturing",
    "Supplier Management",
    "Reports",
    "Accounts",
    "Users & Roles",
    "Branch Management",
    "System Settings",
  ] as const;
  const reference67Labels = [
    "Dashboard",
    "POS & Sales",
    "Purchase",
    "Inventory",
    "Gold Management",
    "Diamond Management",
    "Old Gold / Exchange",
    "Manufacturing",
    "Supplier Management",
    "Customers",
    "Mortgage / Pawn",
    "Reports",
    "Accounts",
    "Users & Roles",
    "System Settings",
  ] as const;
  const reference68Labels = [
    "Dashboard",
    "POS & Sales",
    "Purchase",
    "Inventory",
    "Gold Management",
    "Diamond Management",
    "Old Gold / Exchange",
    "Manufacturing",
    "Karigar Management",
    "Customers",
    "Supplier Management",
    "Reports",
    "Accounts",
    "Users & Roles",
    "System Settings",
  ] as const;
  const reference69Labels = reference68Labels;
  const reference69Hrefs: Readonly<Record<string, string>> = {
    "Dashboard": "/dashboard",
    "POS & Sales": "/pos/sales-69",
    "Purchase": "/purchases",
    "Inventory": "/inventory/management",
    "Gold Management": "/gold-rates/management-69",
    "Diamond Management": "/diamond-management/inventory",
    "Old Gold / Exchange": "/old-gold/new",
    "Manufacturing": "/manufacturing/production-68",
    "Karigar Management": "/karigars/management-68",
    "Customers": "/customers/management-68",
    "Supplier Management": "/suppliers/management-69",
    "Reports": "/reports/analytics",
    "Accounts": "/accounts",
    "Users & Roles": "/users/security",
    "System Settings": "/settings/system-69",
  };
  const reference70Labels = reference68Labels;
  const reference70Hrefs: Readonly<Record<string, string>> = {
    "Dashboard": "/dashboard",
    "POS & Sales": "/pos/sales-69",
    "Purchase": "/purchases",
    "Inventory": "/inventory/management",
    "Gold Management": "/gold-rates/management-69",
    "Diamond Management": "/diamond-management/inventory",
    "Old Gold / Exchange": "/old-gold/management-70",
    "Manufacturing": "/manufacturing/production-70",
    "Karigar Management": "/karigars/management-68",
    "Customers": "/customers/management-68",
    "Supplier Management": "/suppliers/management-69",
    "Reports": "/reports/analytics-70",
    "Accounts": "/accounts",
    "Users & Roles": "/users/security-70",
    "System Settings": "/settings/system-69",
  };
  const reference71Hrefs: Readonly<Record<string, string>> = {
    ...reference70Hrefs,
    "Dashboard": "/dashboard/executive-71",
    "Notifications": "/notifications/center-71",
    "Activity Log": "/settings/activity-log-71",
  };
  const reference72Hrefs: Readonly<Record<string, string>> = {
    ...reference70Hrefs,
    "Dashboard": "/dashboard/executive-71",
    "Gold Management": "/gold-rates/rates-72",
    "Karigar Management": "/karigars/ledger-72",
    "Customers": "/customers/dues-72",
    "System Settings": "/settings/backup-restore-72",
  };
  const reference71Navigation: NavigationItem[] = [
    ...reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item)),
    ...(pathname === "/notifications/center-71" ? [{ label: "Notifications", icon: Bell, href: "/notifications/center-71" }] : []),
    ...(pathname === "/settings/activity-log-71" ? [{ label: "Activity Log", icon: ClipboardCheck, href: "/settings/activity-log-71" }] : []),
  ];
  const visibleNavigation = reference72Route
    ? reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference71Route
    ? reference71Navigation
    : reference70Route
    ? reference70Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference69Route
    ? reference69Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference68Route
    ? reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference67Route
    ? reference67Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference66Route
    ? reference66Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference65Route
      ? navigation.filter((item) => reference65Labels.has(item.label))
    : navigation;

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
            <span className={styles.brandWide}><BrandLockup tagline={compactReferenceRoute ? "Jewellery Business Management" : undefined} title={reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route ? "JewelleryERP" : compactReferenceRoute ? "JewelERP" : undefined} /></span>
            <span className={styles.brandCompact}><BrandLockup compact /></span>
          </Link>
          <button aria-label="Close navigation" className={styles.close} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Main navigation" className={styles.nav}>
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const compactLabel = reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route
              ? item.label === "Supplier Management"
                ? "Suppliers / Mahajon"
                : item.label === "Reports"
                  ? "Reports & Analytics"
                  : item.label === "Accounts"
                    ? "Cash & Accounting"
                    : item.label === "Users & Roles"
                      ? "Users & Security"
                      : item.label
              : item.label === "Customers"
              ? "Customer Management"
              : item.label === "Supplier Management"
                ? "Supplier / Mahajon"
                : item.label === "Reports"
                  ? "Reports & Analytics"
                  : item.label === "Accounts"
                    ? "Cash & Accounting"
                    : item.label === "Users & Roles"
                      ? "Users & Security"
                  : item.label === "System Settings"
                    ? "Settings"
                    : item.label;
            const displayLabel = compactReferenceRoute
              ? compactLabel
              : pathname === "/accounts/cash-ledger" && item.label === "Accounts"
              ? "Cash & Accounting"
              : pathname === "/reports/profit-loss" && item.label === "Reports"
                ? "Reports & Analytics"
                : pathname === "/users" && item.label === "Users & Roles"
                  ? "Users & Security"
                  : pathname === "/branches" && item.label === "Branch Management"
                    ? "Branch List"
                    : item.label;
            const displayHref = reference72Route
              ? reference72Hrefs[item.label] ?? item.href
              : reference71Route
              ? reference71Hrefs[item.label] ?? item.href
              : reference70Route
              ? reference70Hrefs[item.label] ?? item.href
              : reference69Route
              ? reference69Hrefs[item.label] ?? item.href
              : compactReferenceRoute && item.label === "POS & Sales"
              ? "/pos/new"
              : reference68Route && item.label === "Inventory"
                ? "/inventory/management"
                : reference68Route && item.label === "Gold Management"
                  ? "/gold-rates/transactions"
                  : reference68Route && item.label === "Manufacturing"
                    ? "/manufacturing/production-68"
                    : reference68Route && item.label === "Karigar Management"
                      ? "/karigars/management-68"
                      : reference68Route && item.label === "Customers"
                        ? "/customers/management-68"
                        : reference68Route && item.label === "Reports"
                          ? "/reports/inventory-valuation-68"
                          : reference68Route && item.label === "Accounts"
                            ? "/accounts"
                            : reference68Route && item.label === "Users & Roles"
                              ? "/users/security"
              : reference65Route && item.label === "Inventory"
                ? "/inventory/management-65"
                : reference65Route && item.label === "Reports"
                  ? "/reports/analytics-65"
                  : reference66Route && item.label === "Inventory"
                    ? "/inventory/management"
                      : reference66Route && item.label === "Reports"
                      ? "/reports/analytics-66"
                      : reference66Route && item.label === "Gold Management"
                        ? "/gold-rates/transactions"
                        : reference66Route && item.label === "Manufacturing"
                          ? "/production-management/orders"
                          : reference66Route && item.label === "Accounts"
                            ? "/accounts"
                            : reference66Route && item.label === "Users & Roles"
                              ? "/users"
                              : reference67Route && item.label === "POS & Sales"
                                ? "/pos/new"
                                : reference67Route && item.label === "Inventory"
                                  ? "/inventory/management"
                                  : reference67Route && item.label === "Gold Management"
                                    ? "/gold-rates/transactions"
                                    : reference67Route && item.label === "Manufacturing"
                                      ? "/production-management/orders"
                                      : reference67Route && item.label === "Mortgage / Pawn"
                                        ? "/mortgages/management"
                                        : reference67Route && item.label === "Reports"
                                          ? "/reports/analytics"
                                          : reference67Route && item.label === "Accounts"
                                            ? "/accounts"
                                            : reference67Route && item.label === "Users & Roles"
                                              ? "/users/security"
                  : item.href;
            const active = displayHref
              ? displayHref === "/dashboard"
                ? pathname === displayHref
                : compactReferenceRoute
                  ? pathname === displayHref
                  : (item.activePrefixes ?? [displayHref]).some((prefix) => pathname.startsWith(prefix))
              : false;
            const activeChildHref = item.children
              ?.map((child) => child.href)
              .filter((href): href is string => Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)))
              .sort((first, second) => second.length - first.length)[0];
            const content = (
              <>
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{displayLabel}</span>
                {!compactReferenceRoute && (item.children || item.label === "Accounts") ? (
                  <span aria-hidden="true" className={`${styles.chevron} ${active ? styles.chevronOpen : ""}`}>›</span>
                ) : null}
              </>
            );

            return (
              <div className={styles.navGroup} key={item.label}>
                {displayHref ? (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`${styles.navItem} ${active ? styles.active : ""}`}
                    href={displayHref}
                    onClick={onClose}
                    title={displayLabel}
                  >
                    {content}
                  </Link>
                ) : (
                  <span aria-disabled="true" className={styles.navItem} title={displayLabel}>
                    {content}
                  </span>
                )}
                {!compactReferenceRoute && active && item.children ? (
                  <div aria-label={`${item.label} navigation`} className={styles.subnav}>
                    {item.children.map((child, index) => {
                      const childActive = child.href === activeChildHref && item.children?.findIndex((candidate) => candidate.href === activeChildHref) === index;
                      const childLabel = pathname === "/branches" && child.href === "/branches" ? "Branch Management" : child.label;
                      return child.href ? (
                        <Link
                          aria-current={childActive ? "page" : undefined}
                          className={childActive ? styles.subnavActive : ""}
                          href={child.href}
                          key={`${child.label}-${child.href}`}
                          onClick={onClose}
                        >
                          {childLabel}
                        </Link>
                      ) : (
                        <span aria-disabled="true" key={`${child.label}-${index}`}>{childLabel}</span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        {compactReferenceRoute ? (
          <div className={styles.sidebarFooter}><span>Version 1.0.0</span></div>
        ) : (
          <div className={styles.sidebarFooter}>
            <Sparkles size={16} />
            <span>Made for modern jewellers</span>
          </div>
        )}
      </aside>
    </>
  );
}
