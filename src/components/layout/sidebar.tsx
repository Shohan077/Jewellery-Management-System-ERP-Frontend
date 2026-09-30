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
  Megaphone,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
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
  children?: ReadonlyArray<{ label: string; href: string }>;
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "POS & Sales",
    icon: ReceiptText,
    href: "/sales/invoices",
    activePrefixes: ["/sales", "/pos"],
    children: [
      { label: "POS Billing", href: "/pos-sales/pos-billing" },
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
    activePrefixes: ["/inventory"],
    children: [
      { label: "Inventory Management", href: "/inventory/management" },
      { label: "Stock Adjustment Entry", href: "/inventory/adjustments" },
      { label: "Gold Stock", href: "/inventory/gold-lots" },
      { label: "Gold Item Stock", href: "/inventory/gold-stock" },
      { label: "Stock Overview", href: "/inventory/stock" },
      { label: "Stock View", href: "/inventory/stock-view" },
      { label: "Inventory Stock", href: "/inventory/stock-list" },
      { label: "Stock Alerts", href: "/inventory/alerts" },
    ],
  },
  {
    label: "Product Management",
    icon: PackageSearch,
    href: "/product-management/product-list",
    activePrefixes: ["/product-management", "/products"],
    children: [
      { label: "Management Overview", href: "/product-management/overview" },
      { label: "Product List", href: "/product-management/product-list" },
      { label: "Product Management", href: "/product-management/products" },
      { label: "Category Management", href: "/product-management/categories" },
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
      { label: "Gold Transactions", href: "/gold-rates/transactions-legacy" },
      { label: "Current Gold Rates", href: "/gold-rates/current" },
      { label: "Gold Rate Management", href: "/gold-rates/management-129" },
      { label: "Gold Stock", href: "/gold-rates/stock" },
      { label: "Gold Adjustment", href: "/gold-rates/adjustments" },
      { label: "Gold Report", href: "/gold-rates/reports" },
      { label: "Gold Rates", href: "/gold-rates" },
      { label: "Gold Rate Manager", href: "/gold-rates/manage" },
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
    ],
  },
  {
    label: "Old Gold / Exchange",
    icon: CircleDollarSign,
    href: "/old-gold/new",
    activePrefixes: ["/old-gold"],
    children: [
      { label: "Old Gold Purchase", href: "/old-gold/new" },
      { label: "Exchange Entry", href: "/old-gold/exchange" },
      { label: "Valuation", href: "/old-gold/valuation" },
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
    activePrefixes: ["/customers", "/loyalty"],
    children: [
      { label: "Customer List", href: "/customers" },
      { label: "Customer Management", href: "/customers/management" },
      { label: "Customer Profile", href: "/customers/profile" },
      { label: "Customer Ledger", href: "/customers/ledger" },
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
    ],
  },
  {
    label: "Supplier Management",
    icon: ContactRound,
    href: "/suppliers",
    children: [
      { label: "Supplier Management", href: "/suppliers/management" },
      { label: "Supplier List", href: "/suppliers" },
      { label: "Supplier Payment Entry", href: "/suppliers/payments/new" },
      { label: "Supplier Statement", href: "/suppliers/statement" },
    ],
  },
  {
    label: "Mortgage / Pawn",
    icon: CircleDollarSign,
    href: "/mortgages",
    activePrefixes: ["/mortgages"],
    children: [
      { label: "New Mortgage Entry", href: "/mortgages/new" },
      { label: "Mortgage Management", href: "/mortgages/management" },
      { label: "Mortgage List", href: "/mortgages" },
    ],
  },
  {
    label: "Accounts",
    icon: WalletCards,
    href: "/accounts",
    activePrefixes: ["/expenses", "/accounts", "/finance"],
    children: [
      { label: "Accounts Dashboard", href: "/accounts" },
      { label: "Cash Book", href: "/accounts/cash-ledger" },
      { label: "Cash In Entry", href: "/accounts/cash-in" },
      { label: "Cash Out Entry", href: "/accounts/cash-out" },
      { label: "Daily Cash Book", href: "/accounts/daily-closing" },
      { label: "Receipt Entry", href: "/accounts/receipt-entry" },
      { label: "Payment Entry", href: "/accounts/payment-entry" },
      { label: "Expense Entry", href: "/accounts/expense-entry" },
      { label: "Expense Management", href: "/accounts/expenses" },
      { label: "Expense Report", href: "/accounts/expense-report" },
      { label: "Payment Management", href: "/accounts/payments" },
      { label: "Journal Entries", href: "/accounts/journal-entry" },
      { label: "Account Ledger", href: "/accounts/account-ledger" },
      { label: "Chart of Accounts", href: "/finance/chart-of-accounts" },
      { label: "Finance Journal Entry", href: "/finance/journal-entry" },
      { label: "Trial Balance", href: "/accounts/trial-balance" },
      { label: "Profit & Loss", href: "/accounts/profit-loss" },
    ],
  },
  {
    label: "Quality Control",
    icon: ClipboardCheck,
    href: "/quality-control/inspection",
    activePrefixes: ["/quality-control"],
    children: [
      { label: "Quality Inspection", href: "/quality-control/inspection" },
      { label: "Quality Control Overview", href: "/quality-control/management" },
      { label: "Testing Management", href: "/quality-control/testing" },
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
    ],
  },
  {
    label: "Certificate Management",
    icon: BadgeCheck,
    href: "/certificates",
    children: [
      { label: "Certificate List", href: "/certificates" },
    ],
  },
  {
    label: "Branch Management",
    icon: Building2,
    href: "/branches",
    activePrefixes: ["/branches"],
    children: [
      { label: "Branch Management", href: "/branches/manage" },
      { label: "Branch Performance", href: "/branches/management-dashboard" },
      { label: "Branch List", href: "/branches" },
      { label: "Branch Overview", href: "/branches/overview" },
      { label: "Multi-Branch Dashboard", href: "/branches/sales-dashboard" },
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
    ],
  },
  {
    label: "Users & Roles",
    icon: LockKeyhole,
    href: "/users",
    activePrefixes: ["/users"],
    children: [
      { label: "Users & Security", href: "/users/security" },
      { label: "User List", href: "/users" },
      { label: "Activity Log", href: "/users/activity-log" },
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
  const reference73Route = [
    "/products/management-73",
    "/diamonds/management-73",
    "/old-gold/exchange-73",
    "/manufacturing/production-73",
  ].includes(pathname);
  const reference74Route = [
    "/loyalty/rewards-74",
    "/accounts/cashbook-74",
    "/accounts/expenses-74",
    "/crm/marketing-74",
  ].includes(pathname);
  const reference75Route = [
    "/crm/campaigns-75",
    "/crm/templates-75",
    "/crm/reminders-75",
    "/reports/analytics-75",
  ].includes(pathname);
  const reference76Route = [
    "/inventory/dashboard-76",
    "/purchases/orders-76",
    "/suppliers/management-76",
    "/customers/management-76",
  ].includes(pathname);
  const reference77Route = [
    "/dashboard/sales-77",
    "/sales/orders-77",
    "/accounts/payments-77",
    "/users/management-77",
  ].includes(pathname);
  const reference78Route = [
    "/purchases/returns-78",
    "/suppliers/list-78",
    "/suppliers/details-78",
    "/reports/purchase-78",
  ].includes(pathname);
  const reference79Route = [
    "/products/list-79",
    "/products/details-79",
    "/products/categories-79",
    "/inventory/transfers-79",
  ].includes(pathname);
  const reference80Route = [
    "/customers/list-80",
    "/customers/details-80",
    "/customers/dues-80",
    "/mortgages/entry-80",
  ].includes(pathname);
  const compactReferenceRoute = reference65Route || reference66Route || reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route || reference73Route || reference74Route || reference75Route || reference76Route || reference77Route || reference78Route || reference79Route || reference80Route;
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
    "Branch Management": "/branches/management-71",
    "Notifications": "/notifications/center-71",
    "Activity Log": "/settings/activity-log-71",
  };
  const reference72Hrefs: Readonly<Record<string, string>> = {
    ...reference70Hrefs,
    "Dashboard": "/dashboard/executive-71",
    "Gold Management": "/gold-rates/rates-72",
    "Karigar Management": "/karigars/ledger-72",
    "Due Management": "/customers/dues-72",
    "System Settings": "/settings/backup-restore-72",
  };
  const reference73Hrefs: Readonly<Record<string, string>> = {
    ...reference72Hrefs,
    "Product Management": "/products/management-73",
    "Diamond Management": "/diamonds/management-73",
    "Old Gold / Exchange": "/old-gold/exchange-73",
    "Manufacturing": "/manufacturing/production-73",
  };
  const reference73Navigation: NavigationItem[] = [
    ...reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item)),
    ...(pathname === "/products/management-73" ? [{ label: "Product Management", icon: PackageSearch, href: "/products/management-73" }] : []),
  ];
  const reference71Navigation: NavigationItem[] = [
    ...reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item)),
    ...(pathname === "/notifications/center-71" ? [{ label: "Notifications", icon: Bell, href: "/notifications/center-71" }] : []),
    ...(pathname === "/settings/activity-log-71" ? [{ label: "Activity Log", icon: ClipboardCheck, href: "/settings/activity-log-71" }] : []),
  ];
  const reference74Hrefs: Readonly<Record<string, string>> = {
    ...reference73Hrefs,
    "Accounts": pathname === "/accounts/expenses-74" ? "/accounts/expenses-74" : "/accounts/cashbook-74",
    "Loyalty & Rewards": "/loyalty/rewards-74",
    "CRM & Marketing": "/crm/marketing-74",
  };
  const reference74Navigation: NavigationItem[] = [
    ...reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item)),
    ...(pathname === "/loyalty/rewards-74" ? [{ label: "Loyalty & Rewards", icon: Star, href: "/loyalty/rewards-74" }] : []),
    ...(pathname === "/crm/marketing-74" ? [{ label: "CRM & Marketing", icon: Megaphone, href: "/crm/marketing-74" }] : []),
  ];
  const reference75Hrefs: Readonly<Record<string, string>> = {
    ...reference74Hrefs,
    "Reports": "/reports/analytics-75",
    "CRM & Marketing": "/crm/campaigns-75",
  };
  const reference75Navigation: NavigationItem[] = [
    ...reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item)),
    {
      label: "CRM & Marketing",
      icon: Megaphone,
      href: "/crm/campaigns-75",
      activePrefixes: ["/crm/campaigns-75", "/crm/templates-75", "/crm/reminders-75"],
      children: [
        { label: "Campaigns", href: "/crm/campaigns-75" },
        { label: "SMS / WhatsApp", href: "/crm/templates-75" },
        { label: "Reminders", href: "/crm/reminders-75" },
      ],
    },
  ];
  const reference76Hrefs: Readonly<Record<string, string>> = {
    ...reference75Hrefs,
    "Purchase": "/purchases/orders-76",
    "Inventory": "/inventory/dashboard-76",
    "Supplier Management": "/suppliers/management-76",
    "Customers": "/customers/management-76",
  };
  const reference77Hrefs: Readonly<Record<string, string>> = {
    ...reference76Hrefs,
    "Dashboard": "/dashboard/sales-77",
    "POS & Sales": "/sales/orders-77",
    "Accounts": "/accounts/payments-77",
    "Users & Roles": "/users/management-77",
  };
  const reference78Labels = [
    "Dashboard",
    "POS & Sales",
    "Purchase",
    "Inventory",
    "Gold Management",
    "Diamond Management",
    "Supplier Management",
    "Customers",
    "Reports",
    "Accounts",
    "Users & Roles",
    "Branch Management",
    "System Settings",
  ] as const;
  const reference78Hrefs: Readonly<Record<string, string>> = {
    ...reference77Hrefs,
    "Purchase": "/purchases/returns-78",
    "Inventory": "/inventory/dashboard-76",
    "Supplier Management": "/suppliers/list-78",
    "Customers": "/customers/management-76",
    "Reports": "/reports/purchase-78",
  };
  const reference78Navigation: NavigationItem[] = reference78Labels
    .map((label) => {
      const item = navigation.find((candidate) => candidate.label === label);
      if (!item) return item;
      if (label === "Purchase") return {
        ...item,
        children: [
          { label: "Purchase Entry", href: "/purchases/new" },
          { label: "Purchase List", href: "/purchases" },
          { label: "Purchase Return", href: "/purchases/returns-78" },
        ],
      };
      if (label === "Supplier Management") return {
        ...item,
        children: [
          { label: "Supplier List", href: "/suppliers/list-78" },
          { label: "Supplier Details", href: "/suppliers/details-78" },
        ],
      };
      return item;
    })
    .filter((item): item is NavigationItem => Boolean(item));
  const reference79Labels = [
    "Dashboard", "POS & Sales", "Purchase", "Inventory", "Product Management", "Gold Management", "Diamond Management", "Reports", "Accounts", "Users & Roles", "Branch Management", "System Settings",
  ] as const;
  const reference79Hrefs: Readonly<Record<string, string>> = {
    ...reference78Hrefs,
    "Inventory": "/inventory/transfers-79",
    "Product Management": "/products/list-79",
  };
  const reference79Navigation: NavigationItem[] = reference79Labels
    .map((label) => {
      const item = navigation.find((candidate) => candidate.label === label);
      if (!item) return item;
      if (label === "Product Management") return {
        ...item,
        children: [
          { label: "Product List", href: "/products/list-79" },
          { label: "Product Details", href: "/products/details-79" },
        ],
      };
      if (label === "Inventory") return {
        ...item,
        children: [
          { label: "Inventory Dashboard", href: "/inventory/dashboard-76" },
          { label: "Branch Transfer", href: "/inventory/transfers-79" },
        ],
      };
      return item;
    })
    .filter((item): item is NavigationItem => Boolean(item));
  const reference80Hrefs: Readonly<Record<string, string>> = {
    ...reference79Hrefs,
    "Customers": "/customers/list-80",
    "Inventory": "/inventory/dashboard-76",
    "Mortgage / Pawn": "/mortgages/entry-80",
  };
  const reference80Labels = [
    "Dashboard", "POS & Sales", "Purchase", "Inventory", "Product Management", "Gold Management", "Diamond Management", "Customers", "Mortgage / Pawn", "Reports", "Accounts", "Users & Roles", "Branch Management", "System Settings",
  ] as const;
  const reference80Navigation: NavigationItem[] = reference80Labels
    .map((label) => {
      const item = navigation.find((candidate) => candidate.label === label);
      if (!item) return item;
      if (label === "Customers") return {
        ...item,
        children: [
          { label: "Customer List", href: "/customers/list-80" },
          { label: "Customer Details", href: "/customers/details-80" },
          { label: "Customer Due List", href: "/customers/dues-80" },
          { label: "Customer Ledger", href: "/customers/ledger" },
        ],
      };
      if (label === "Inventory") return {
        ...item,
        children: [
          { label: "Stock Summary", href: "/inventory/dashboard-76" },
          { label: "Gold Stock", href: "/inventory/gold-stock" },
          { label: "Stock Overview", href: "/inventory/stock" },
        ],
      };
      if (label === "Mortgage / Pawn") return {
        ...item,
        children: [
          { label: "New Mortgage Entry", href: "/mortgages/entry-80" },
          { label: "Mortgage Management", href: "/mortgages/management" },
          { label: "Mortgage List", href: "/mortgages" },
        ],
      };
      return item;
    })
    .filter((item): item is NavigationItem => Boolean(item));
  const contextualNavigation = reference80Route
    ? reference80Navigation
    : reference79Route
    ? reference79Navigation
    : reference78Route
    ? reference78Navigation
    : reference77Route
    ? reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference76Route
    ? reference68Labels.map((label) => navigation.find((item) => item.label === label)).filter((item): item is NavigationItem => Boolean(item))
    : reference75Route
    ? reference75Navigation
    : reference74Route
    ? reference74Navigation
    : reference73Route
    ? reference73Navigation
    : reference72Route
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
  const contextualItemsByLabel = new Map(contextualNavigation.map((item) => [item.label, item]));
  const visibleNavigation = [
    ...navigation.map((item) => contextualItemsByLabel.get(item.label) ?? item),
    ...contextualNavigation.filter((item) => !navigation.some((baseItem) => baseItem.label === item.label)),
  ];

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
            <span className={styles.brandWide}><BrandLockup tagline={reference78Route || reference79Route || reference80Route ? "ERP System" : compactReferenceRoute ? "Jewellery Business Management" : undefined} title={reference78Route || reference79Route || reference80Route ? "Jewellery Manager" : reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route || reference73Route || reference74Route || reference75Route || reference76Route || reference77Route ? "JewelleryERP" : compactReferenceRoute ? "JewelERP" : undefined} /></span>
            <span className={styles.brandCompact}><BrandLockup compact /></span>
          </Link>
          <button aria-label="Close navigation" className={styles.close} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {reference78Route ? (
          <div className={styles.reference78User}>
            <span aria-hidden="true">A</span>
            <div><strong>Admin User</strong><small><i />Super Admin</small></div>
          </div>
        ) : null}

        <nav aria-label="Main navigation" className={styles.nav}>
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const compactLabel = reference67Route || reference68Route || reference69Route || reference70Route || reference71Route || reference72Route || reference73Route || reference74Route || reference75Route || reference76Route || reference77Route || reference78Route || reference79Route || reference80Route
              ? item.label === "Supplier Management"
                ? "Suppliers / Mahajon"
                : item.label === "Reports"
                  ? "Reports & Analytics"
                  : item.label === "Accounts"
                    ? reference78Route || reference79Route || reference80Route ? "Accounting" : "Cash & Accounting"
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
            const displayLabel = item.label === "Accounts"
              ? "Accounts"
              : compactReferenceRoute
              ? compactLabel
              : pathname === "/reports/profit-loss" && item.label === "Reports"
                ? "Reports & Analytics"
                : pathname === "/users" && item.label === "Users & Roles"
                  ? "Users & Security"
                  : pathname === "/branches" && item.label === "Branch Management"
                    ? "Branch List"
                    : item.label;
            const displayHref = reference80Route
              ? reference80Hrefs[item.label] ?? item.href
              : reference79Route
              ? reference79Hrefs[item.label] ?? item.href
              : reference78Route
              ? reference78Hrefs[item.label] ?? item.href
              : reference77Route
              ? reference77Hrefs[item.label] ?? item.href
              : reference76Route
              ? reference76Hrefs[item.label] ?? item.href
              : reference75Route
              ? reference75Hrefs[item.label] ?? item.href
              : reference74Route
              ? reference74Hrefs[item.label] ?? item.href
              : reference73Route
              ? reference73Hrefs[item.label] ?? item.href
              : reference72Route
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
            const reference75CrmActive = reference75Route && item.label === "CRM & Marketing" && pathname.startsWith("/crm/");
            const reference78SectionActive = reference78Route && (
              (pathname.startsWith("/purchases/") && item.label === "Purchase")
              || (pathname.startsWith("/suppliers/") && item.label === "Supplier Management")
              || (pathname.startsWith("/reports/") && item.label === "Reports")
            );
            const reference79SectionActive = reference79Route && ((pathname.startsWith("/products/") && item.label === "Product Management") || (pathname === "/inventory/transfers-79" && item.label === "Inventory"));
            const reference80SectionActive = reference80Route && ((pathname.startsWith("/customers/") && item.label === "Customers") || (pathname === "/mortgages/entry-80" && item.label === "Mortgage / Pawn"));
            const active = reference75CrmActive || reference78SectionActive || reference79SectionActive || reference80SectionActive || (displayHref
              ? displayHref === "/dashboard"
                ? pathname === displayHref
                : compactReferenceRoute
                  ? pathname === displayHref
                  : (item.activePrefixes ?? [displayHref]).some((prefix) => pathname.startsWith(prefix))
              : false);
            const showReference75Children = reference75Route && item.label === "CRM & Marketing";
            const showReference78Children = reference78Route && (item.label === "Purchase" || item.label === "Supplier Management") && active;
            const showReference79Children = reference79Route && (item.label === "Product Management" || item.label === "Inventory") && active;
            const showReference80Children = reference80Route && (item.label === "Customers" || item.label === "Inventory" || item.label === "Mortgage / Pawn") && active;
            const detectedChildHref = item.children
              ?.map((child) => child.href)
              .filter((href): href is string => Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)))
              .sort((first, second) => second.length - first.length)[0];
            const activeChildHref = detectedChildHref;
            const content = (
              <>
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{displayLabel}</span>
                {(!compactReferenceRoute || showReference75Children || showReference78Children || showReference79Children || showReference80Children) && (item.children || item.label === "Accounts") ? (
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
                {(!compactReferenceRoute || showReference75Children || showReference78Children || showReference79Children || showReference80Children) && active && item.children ? (
                  <div aria-label={`${item.label} navigation`} className={styles.subnav}>
                    {item.children.map((child, index) => {
                      const childActive = child.href === activeChildHref && item.children?.findIndex((candidate) => candidate.href === activeChildHref) === index;
                      const childLabel = pathname === "/branches" && child.href === "/branches" ? "Branch Management" : child.label;
                      return (
                        <Link
                          aria-current={childActive ? "page" : undefined}
                          className={childActive ? styles.subnavActive : ""}
                          href={child.href}
                          key={`${child.label}-${child.href}`}
                          onClick={onClose}
                        >
                          {childLabel}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        {reference78Route || reference79Route || reference80Route ? null : compactReferenceRoute ? (
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
