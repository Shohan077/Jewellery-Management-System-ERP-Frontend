import Link from "next/link";
import { settingsSections } from "./reference-30-data";
import styles from "./reference-30.module.css";

export function SettingsRail({ active }: { active: string }) {
  return (
    <nav aria-label="Settings sections" className={styles.settingsRail}>
      <strong>SETTINGS</strong>
      {settingsSections.map((item) => (
        <Link aria-current={active === item.label ? "page" : undefined} className={active === item.label ? styles.activeRail : ""} href={item.href} key={item.label}>{item.label}</Link>
      ))}
    </nav>
  );
}
