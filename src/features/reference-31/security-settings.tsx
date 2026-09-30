"use client";

import Link from "next/link";
import { Ban, KeyRound, MonitorCheck, Save, ShieldCheck, Siren } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { SettingsRail } from "@/features/reference-30/settings-rail";

import { securityEvents, type SecurityEvent } from "./reference-31-data";
import styles from "./reference-31.module.css";

type SecurityState = {
  strongPasswords: boolean;
  passwordExpiry: string;
  minimumLength: string;
  loginAttempts: string;
  lockoutDuration: string;
  admin2fa: boolean;
  staff2fa: boolean;
  manager2fa: boolean;
  karigar2fa: boolean;
  emailOtp: boolean;
  sessionTimeout: string;
  singleDevice: boolean;
  rememberDays: string;
  forcePasswordLogout: boolean;
  ipWhitelisting: boolean;
  ipList: string;
  logActivities: boolean;
  logChanges: boolean;
  logFailed: boolean;
  suspiciousAlerts: boolean;
  restrictByRole: boolean;
  maskSensitive: boolean;
  exportPermission: string;
  deletePermission: string;
};

const initialState: SecurityState = {
  strongPasswords: true,
  passwordExpiry: "90",
  minimumLength: "8",
  loginAttempts: "5",
  lockoutDuration: "30",
  admin2fa: true,
  staff2fa: true,
  manager2fa: false,
  karigar2fa: false,
  emailOtp: true,
  sessionTimeout: "60",
  singleDevice: false,
  rememberDays: "7",
  forcePasswordLogout: true,
  ipWhitelisting: true,
  ipList: "103.21.244.0/24\n105.21.245.0/24\n203.0.113.5",
  logActivities: true,
  logChanges: true,
  logFailed: true,
  suspiciousAlerts: true,
  restrictByRole: true,
  maskSensitive: true,
  exportPermission: "Managers Only",
  deletePermission: "Admins Only",
};

export function SecuritySettings() {
  const [settings, setSettings] = useState(initialState);
  const [activeSessions, setActiveSessions] = useState(24);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<SecurityEvent | null>(null);

  function set<K extends keyof SecurityState>(key: K, value: SecurityState[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function save() {
    localStorage.setItem("reference-31-security-settings", JSON.stringify(settings));
    setMessage("Security settings saved successfully.");
  }

  function forceLogout() {
    setActiveSessions(1);
    setMessage("All other devices have been logged out.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.screenTitle}><h1>Screen 123</h1></header>
      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.breadcrumbs}><span>Settings</span><span>Security Settings</span></div>
          <h2>Security Settings</h2>
          <p>Manage system security policies, authentication and access control.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={save} type="button"><Save size={13} />Save Security Settings</button>
          <button className={styles.dangerButton} onClick={forceLogout} type="button"><Ban size={13} />Force Logout All Devices</button>
        </div>
      </div>
      <div className={styles.settingsLayout}>
        <SettingsRail active="Security Settings" />
        <main className={styles.content}>
          <div className={styles.securityGrid}>
            <Card className={styles.settingCard}>
              <h3>Login Security</h3>
              <Toggle checked={settings.strongPasswords} label="Require Strong Passwords" onChange={(value) => set("strongPasswords", value)} />
              <CompactField label="Password Expiry Days"><input min="0" onChange={(event) => set("passwordExpiry", event.target.value)} type="number" value={settings.passwordExpiry} /></CompactField>
              <CompactField label="Minimum Length"><input min="6" onChange={(event) => set("minimumLength", event.target.value)} type="number" value={settings.minimumLength} /></CompactField>
              <CompactField label="Allowed Login Attempts"><input min="1" onChange={(event) => set("loginAttempts", event.target.value)} type="number" value={settings.loginAttempts} /></CompactField>
              <CompactField label="Lockout Duration (Minutes)"><input min="1" onChange={(event) => set("lockoutDuration", event.target.value)} type="number" value={settings.lockoutDuration} /></CompactField>
            </Card>
            <Card className={styles.settingCard}>
              <h3>Two-Factor Authentication</h3>
              <Toggle checked={settings.admin2fa} label="2FA for Admins" onChange={(value) => set("admin2fa", value)} />
              <Toggle checked={settings.staff2fa} label="2FA for Staff" onChange={(value) => set("staff2fa", value)} />
              <Toggle checked={settings.manager2fa} label="2FA for Managers" onChange={(value) => set("manager2fa", value)} />
              <Toggle checked={settings.karigar2fa} label="2FA for Karigars" onChange={(value) => set("karigar2fa", value)} />
              <Toggle checked={settings.emailOtp} label="2FA via Email OTP" onChange={(value) => set("emailOtp", value)} />
            </Card>
            <Card className={styles.settingCard}>
              <h3>Session &amp; Device Management</h3>
              <CompactField label="Session Timeout (Minutes)"><input min="5" onChange={(event) => set("sessionTimeout", event.target.value)} type="number" value={settings.sessionTimeout} /></CompactField>
              <Toggle checked={settings.singleDevice} label="Allow Single Device Login" onChange={(value) => set("singleDevice", value)} />
              <CompactField label="Remember Me (Days)"><input min="0" onChange={(event) => set("rememberDays", event.target.value)} type="number" value={settings.rememberDays} /></CompactField>
              <Toggle checked={settings.forcePasswordLogout} label="Force Logout on Password Change" onChange={(value) => set("forcePasswordLogout", value)} />
            </Card>
            <Card className={styles.settingCard}>
              <h3>IP Whitelisting</h3>
              <Toggle checked={settings.ipWhitelisting} label="Enable IP Whitelisting" onChange={(value) => set("ipWhitelisting", value)} />
              <label className={styles.compactField}><span>Restricted IP Range</span></label>
              <textarea aria-label="Restricted IP addresses" className={styles.ipBox} disabled={!settings.ipWhitelisting} onChange={(event) => set("ipList", event.target.value)} value={settings.ipList} />
              <p style={{ color: "#737e8b", fontSize: 7, margin: "5px 0 0" }}>Enter one IP or range per line</p>
            </Card>
            <Card className={styles.settingCard}>
              <h3>Activity Monitoring</h3>
              <Toggle checked={settings.logActivities} label="Log User Activities" onChange={(value) => set("logActivities", value)} />
              <Toggle checked={settings.logChanges} label="Log Data Changes" onChange={(value) => set("logChanges", value)} />
              <Toggle checked={settings.logFailed} label="Log Failed Logins" onChange={(value) => set("logFailed", value)} />
              <Toggle checked={settings.suspiciousAlerts} label="Alert on Suspicious Activity" onChange={(value) => set("suspiciousAlerts", value)} />
            </Card>
            <Card className={styles.settingCard}>
              <h3>Data Access Rules</h3>
              <Toggle checked={settings.restrictByRole} label="Restrict Data by Role" onChange={(value) => set("restrictByRole", value)} />
              <Toggle checked={settings.maskSensitive} label="Mask Sensitive Data" onChange={(value) => set("maskSensitive", value)} />
              <CompactField label="Export Data Permission"><select onChange={(event) => set("exportPermission", event.target.value)} value={settings.exportPermission}><option>Managers Only</option><option>Admins Only</option><option>All Staff</option></select></CompactField>
              <CompactField label="Delete Data Permission"><select onChange={(event) => set("deletePermission", event.target.value)} value={settings.deletePermission}><option>Admins Only</option><option>Managers Only</option><option>Disabled</option></select></CompactField>
            </Card>
          </div>
          <div className={styles.summaryGrid}>
            <Metric icon={<MonitorCheck size={19} />} label="Active Sessions" value={String(activeSessions)} />
            <Metric icon={<Siren size={19} />} label="Failed Logins (24h)" value="8" />
            <Metric icon={<Ban size={19} />} label="Blocked IPs" value="3" />
            <Metric icon={<KeyRound size={19} />} label="2FA Enabled Users" value="18" />
          </div>
          <Card className={styles.tableCard}>
            <header><h3>Recent Security Events</h3><ShieldCheck color="#168b42" size={17} /></header>
            <div className={styles.tableScroller}><table className={styles.table}><thead><tr><th>Event Time</th><th>User</th><th>Event Type</th><th>Device</th><th>IP Address</th><th>Status</th><th>Action</th></tr></thead><tbody>{securityEvents.map((event) => <tr key={event.id}><td>{event.time}</td><td>{event.user}</td><td>{event.event}</td><td>{event.device}</td><td>{event.ip}</td><td><span className={`${styles.status} ${event.status === "Failed" ? styles.failed : event.status === "Locked" ? styles.locked : ""}`}>{event.status}</span></td><td><button className={styles.viewButton} onClick={() => setSelected(event)} type="button">View</button></td></tr>)}</tbody></table></div>
          </Card>
        </main>
      </div>
      {selected ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><Card className={styles.modal} role="dialog" aria-modal="true"><h3>{selected.event}</h3><p>{selected.user} · {selected.device}<br />{selected.time}<br />IP address: {selected.ip}<br />Status: {selected.status}</p><footer><button className={styles.primaryButton} onClick={() => setSelected(null)} type="button">Close</button></footer></Card></div> : null}
    </div>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <label className={styles.toggle}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i /></label>;
}

function CompactField({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className={styles.compactField}><span>{label}</span>{children}</label>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <Card className={styles.metric}><span className={styles.metricIcon}>{icon}</span><div><small>{label}</small><strong>{value}</strong><Link href="/users/activity-log">View Details</Link></div></Card>;
}
