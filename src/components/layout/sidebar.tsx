"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Building2,
  CircleDollarSign,
  ContactRound,
  Gem,
  Hammer,
  LayoutDashboard,
  LockKeyhole,
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
  children?: ReadonlyArray<{ label: string; href?: string }>;
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "POS & Sales", icon: ReceiptText, href: "/sales/invoices" },
  {
    label: "Purchase",
    icon: ShoppingBag,
    href: "/purchases",
    children: [
      { label: "Purchase Invoice", href: "/purchases" },
      { label: "Supplier Invoice" },
      { label: "Supplier" },
      { label: "Purchase Return" },
    ],
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/products",
    children: [
      { label: "Product List", href: "/products" },
      { label: "Category" },
      { label: "Brand" },
      { label: "Material" },
      { label: "Stock Transfer" },
    ],
  },
  { label: "Gold Management", icon: CircleDollarSign },
  { label: "Diamond Management", icon: Gem },
  { label: "Manufacturing", icon: Hammer },
  { label: "Karigar Management", icon: UserRoundCog },
  {
    label: "Customer Management",
    icon: UsersRound,
    href: "/customers",
    children: [
      { label: "Customer List", href: "/customers" },
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
  { label: "Accounts", icon: WalletCards },
  { label: "Reports", icon: BarChart3 },
  { label: "Branch Management", icon: Building2 },
  { label: "Users & Security", icon: LockKeyhole },
  { label: "System Settings", icon: Settings },
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
                : pathname.startsWith(item.href)
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
                    {item.children.map((child, index) => child.href ? (
                      <Link
                        aria-current={index === 0 ? "page" : undefined}
                        className={index === 0 ? styles.subnavActive : ""}
                        href={child.href}
                        key={child.label}
                        onClick={onClose}
                      >
                        {child.label}
                      </Link>
                    ) : (
                      <span aria-disabled="true" key={child.label}>{child.label}</span>
                    ))}
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
