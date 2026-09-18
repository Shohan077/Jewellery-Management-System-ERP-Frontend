"use client";

import { Bell, Building2, CheckCircle2, DatabaseBackup, Plug, Save, ShieldCheck, UsersRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./system-preferences.module.css";

const tabs = ["General", "Company", "Branches", "Users & Roles", "Notifications", "Backup & Restore", "Integration"] as const;
type SettingsTab = (typeof tabs)[number];
type Theme = "light" | "dark";

type GeneralSettings = {
  companyName: string;
  currency: string;
  dateFormat: string;
  timeZone: string;
  language: string;
  multiBranch: boolean;
  theme: Theme;
  emailNotifications: boolean;
  smsNotifications: boolean;
  automaticBackup: boolean;
};

const initialGeneral: GeneralSettings = {
  companyName: "Aarohan Jewellery",
  currency: "BDT (৳)",
  dateFormat: "DD MMM YYYY",
  timeZone: "(GMT+6) Dhaka",
  language: "English",
  multiBranch: true,
  theme: "light",
  emailNotifications: true,
  smsNotifications: true,
  automaticBackup: true,
};

const STORAGE_KEY = "jewellery-erp:system-preferences:v1";

const auxiliarySettings: Record<Exclude<SettingsTab, "General">, {
  icon: typeof Building2;
  description: string;
  fields: Array<{ label: string; name: string; type: "text" | "email" | "select" | "checkbox"; value: string; options?: string[] }>;
}> = {
  Company: {
    icon: Building2,
    description: "Manage legal identity and public contact details.",
    fields: [
      { label: "Registered Business Name", name: "businessName", type: "text", value: "Aarohan Jewellery" },
      { label: "Business Email", name: "businessEmail", type: "email", value: "info@aarohanjewellery.com" },
      { label: "Business Phone", name: "businessPhone", type: "text", value: "01712-345678" },
      { label: "Business Address", name: "businessAddress", type: "text", value: "House 12, Road 5, Dhanmondi, Dhaka" },
    ],
  },
  Branches: {
    icon: Building2,
    description: "Set branch defaults and transfer controls.",
    fields: [
      { label: "Default Branch", name: "defaultBranch", type: "select", value: "Main Branch", options: ["Main Branch", "Uttara Branch", "Chittagong Branch"] },
      { label: "Require Transfer Approval", name: "transferApproval", type: "checkbox", value: "true" },
      { label: "Share Product Catalogue", name: "sharedCatalogue", type: "checkbox", value: "true" },
    ],
  },
  "Users & Roles": {
    icon: UsersRound,
    description: "Configure account protection and access defaults.",
    fields: [
      { label: "Default User Role", name: "defaultRole", type: "select", value: "Sales", options: ["Admin", "Manager", "Sales", "Inventory", "Accounts"] },
      { label: "Session Timeout", name: "sessionTimeout", type: "select", value: "30 minutes", options: ["15 minutes", "30 minutes", "1 hour", "4 hours"] },
      { label: "Require Two-Factor Authentication", name: "twoFactor", type: "checkbox", value: "true" },
    ],
  },
  Notifications: {
    icon: Bell,
    description: "Choose how operational alerts are delivered.",
    fields: [
      { label: "Daily Summary", name: "dailySummary", type: "checkbox", value: "true" },
      { label: "Low-Stock Alerts", name: "stockAlerts", type: "checkbox", value: "true" },
      { label: "Payment Reminders", name: "paymentAlerts", type: "checkbox", value: "true" },
      { label: "Digest Time", name: "digestTime", type: "select", value: "09:00 AM", options: ["09:00 AM", "12:00 PM", "06:00 PM"] },
    ],
  },
  "Backup & Restore": {
    icon: DatabaseBackup,
    description: "Manage automatic backup and recovery preferences.",
    fields: [
      { label: "Backup Frequency", name: "backupFrequency", type: "select", value: "Daily", options: ["Daily", "Weekly", "Monthly"] },
      { label: "Backup Time", name: "backupTime", type: "select", value: "12:00 AM", options: ["12:00 AM", "02:00 AM", "04:00 AM"] },
      { label: "Encrypt Backups", name: "encryptBackup", type: "checkbox", value: "true" },
    ],
  },
  Integration: {
    icon: Plug,
    description: "Manage API access and connected business services.",
    fields: [
      { label: "Enable API Access", name: "apiAccess", type: "checkbox", value: "false" },
      { label: "Webhook URL", name: "webhook", type: "text", value: "https://example.com/webhooks/jewellery" },
      { label: "Accounting Provider", name: "accounting", type: "select", value: "None", options: ["None", "QuickBooks", "Xero"] },
    ],
  },
};

export function SystemPreferences() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [settings, setSettings] = useState<GeneralSettings>(initialGeneral);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoName, setLogoName] = useState("");
  const [message, setMessage] = useState("");

  function updateSetting<Key extends keyof GeneralSettings>(key: Key, value: GeneralSettings[Key]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function selectLogo(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Choose a logo smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(typeof reader.result === "string" ? reader.result : "");
      setLogoName(file.name);
      setMessage(`${file.name} selected as the company logo.`);
    };
    reader.readAsDataURL(file);
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        activeTab,
        general: settings,
        auxiliary: Object.fromEntries(form.entries()),
        logoName,
      }));
      setMessage(`${activeTab} settings saved successfully.`);
    } catch {
      setMessage("Settings are valid, but this browser could not save them locally.");
    }
  }

  return (
    <form className={`${styles.page} ${settings.theme === "dark" ? styles.darkPreview : ""}`} onSubmit={saveSettings}>
      <PageHeader
        action={<button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Settings</button>}
        description="Configure system preferences and settings"
        title="System Settings"
      />

      <Card className={styles.settingsCard}>
        <div aria-label="Settings sections" className={styles.tabs} role="tablist">
          {tabs.map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} key={tab} onClick={() => { setActiveTab(tab); setMessage(""); }} role="tab" type="button">{tab}</button>)}
        </div>

        <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message ? <CheckCircle2 aria-hidden="true" size={15} /> : null}{message}</p>

        {activeTab === "General" ? (
          <div className={styles.generalPanel} role="tabpanel">
            <section className={styles.generalFields}>
              <label><span>Company Name <b>*</b></span><input className="field" onChange={(event) => updateSetting("companyName", event.target.value)} required value={settings.companyName} /></label>
              <label><span>Currency <b>*</b></span><select className="select" onChange={(event) => updateSetting("currency", event.target.value)} value={settings.currency}><option>BDT (৳)</option><option>USD ($)</option><option>EUR (€)</option></select></label>
              <label><span>Date Format</span><select className="select" onChange={(event) => updateSetting("dateFormat", event.target.value)} value={settings.dateFormat}><option>DD MMM YYYY</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option></select></label>
              <label><span>Time Zone</span><select className="select" onChange={(event) => updateSetting("timeZone", event.target.value)} value={settings.timeZone}><option>(GMT+6) Dhaka</option><option>(GMT+5:30) Kolkata</option><option>(GMT+0) London</option></select></label>
              <label><span>Language</span><select className="select" onChange={(event) => updateSetting("language", event.target.value)} value={settings.language}><option>English</option><option>বাংলা</option></select></label>
              <label className={styles.checkRow}><input checked={settings.multiBranch} onChange={(event) => updateSetting("multiBranch", event.target.checked)} type="checkbox" /><span><strong>Enable Multi-Branch</strong><small>Manage multiple branches and locations</small></span></label>
            </section>

            <section className={styles.visualSettings}>
              <div className={styles.logoBlock}>
                <span>Company Logo</span>
                <label className={styles.logoUpload} style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : undefined}>
                  {logoPreview ? null : <><BrandMark size={48} /><strong>Click to upload logo</strong><small>PNG, JPG (Max 2MB)</small></>}
                  <input accept="image/png,image/jpeg" onChange={(event) => selectLogo(event.target.files?.[0])} type="file" />
                </label>
              </div>
              <fieldset className={styles.themePicker}><legend>System Theme</legend><div><label className={settings.theme === "light" ? styles.selectedTheme : ""}><input checked={settings.theme === "light"} name="theme" onChange={() => updateSetting("theme", "light")} type="radio" />Light Mode</label><label className={settings.theme === "dark" ? styles.selectedTheme : ""}><input checked={settings.theme === "dark"} name="theme" onChange={() => updateSetting("theme", "dark")} type="radio" />Dark Mode</label></div></fieldset>
              <div className={styles.notificationChecks}>
                <label><input checked={settings.emailNotifications} onChange={(event) => updateSetting("emailNotifications", event.target.checked)} type="checkbox" /><span><strong>Enable Email Notifications</strong><small>Send system notifications via email</small></span></label>
                <label><input checked={settings.smsNotifications} onChange={(event) => updateSetting("smsNotifications", event.target.checked)} type="checkbox" /><span><strong>Enable SMS Notifications</strong><small>Send alerts via SMS</small></span></label>
                <label><input checked={settings.automaticBackup} onChange={(event) => updateSetting("automaticBackup", event.target.checked)} type="checkbox" /><span><strong>Enable Automatic Backup</strong><small>Daily backup at 12:00 AM</small></span></label>
              </div>
            </section>
          </div>
        ) : <AuxiliaryPanel tab={activeTab} />}
      </Card>
    </form>
  );
}

function AuxiliaryPanel({ tab }: { tab: Exclude<SettingsTab, "General"> }) {
  const config = auxiliarySettings[tab];
  const Icon = config.icon;
  return <section className={styles.auxiliaryPanel} role="tabpanel"><div className={styles.auxiliaryHeader}><span><Icon aria-hidden="true" size={22} /></span><div><h2>{tab}</h2><p>{config.description}</p></div></div><div className={styles.auxiliaryGrid}>{config.fields.map((field) => field.type === "checkbox" ? <label className={styles.auxiliaryCheck} key={field.name}><input defaultChecked={field.value === "true"} name={field.name} type="checkbox" /><span>{field.label}</span></label> : <label key={field.name}><span>{field.label}</span>{field.type === "select" ? <select className="select" defaultValue={field.value} name={field.name}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input className="field" defaultValue={field.value} name={field.name} type={field.type} />}</label>)}</div><div className={styles.securityNote}><ShieldCheck aria-hidden="true" size={18} /><span>Changes are stored locally in this frontend prototype and are ready to connect to a settings API.</span></div></section>;
}
