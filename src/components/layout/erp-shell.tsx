"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import styles from "./erp-shell.module.css";

export function ErpShell({ children }: { children: React.ReactNode }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar open={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} />
      <div className={styles.workspace}>
        <Topbar onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
