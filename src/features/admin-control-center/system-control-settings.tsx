"use client";

import { Bell, Building2, DatabaseBackup, FileCog, ImageUp, Link2, Mail, Palette, Save, Settings2, ShieldCheck, Smartphone, Tags, UserCog } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/ui/card";

import styles from "./admin-control-center.module.css";

const sections = [
  ["General Settings", Settings2], ["Company Profile", Building2], ["Business Settings", FileCog], ["Tax & Currency", Tags], ["Notification Settings", Bell], ["Email Configuration", Mail], ["SMS Configuration", Smartphone], ["Integration", Link2], ["Appearance", Palette], ["Security Settings", ShieldCheck], ["System Maintenance", DatabaseBackup],
] as const;

export function SystemControlSettings() {
  const [active, setActive] = useState("General Settings");
  const [settings, setSettings] = useState({ systemName: "Jewellery Manager", timezone: "(GMT+05:30) Asia/Kolkata", language: "English", dateFormat: "DD/MM/YYYY", timeFormat: "12 Hour (AM/PM)", currency: "INR - Indian Rupee (₹)", currencyPosition: "Before Amount (₹ 1,234.56)", decimals: "2", darkMode: false, autoLogout: true, timeout: "30 Minutes", maintenance: false, twoFactor: true });
  const [logoName, setLogoName] = useState("");
  const [faviconName, setFaviconName] = useState("");
  const [message, setMessage] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) { setSettings((current) => ({ ...current, [key]: value })); }
  function fileChange(event: ChangeEvent<HTMLInputElement>, kind: "logo" | "favicon") { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) { setMessage("Choose a valid image file."); return; } if (kind === "logo") setLogoName(file.name); else setFaviconName(file.name); setMessage(`${file.name} selected.`); }
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); localStorage.setItem("jewellery-system-control-settings", JSON.stringify(settings)); setMessage(`${active} saved successfully.`); }

  return <form className={styles.page} onSubmit={save}>
    <header className={styles.pageHeader}><div><h1>System Settings</h1><p>Home <b>›</b> Settings <b>›</b> System Settings</p></div><button className={styles.primaryButton} type="submit"><Save size={15} />Save Changes</button></header>
    <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    <div className={styles.settingsLayout}><Card className={styles.settingsNav} aria-label="System setting sections">{sections.map(([label, Icon]) => <button className={active === label ? styles.activeSetting : ""} key={label} onClick={() => setActive(label)} type="button"><Icon size={15} /><span>{label}</span></button>)}</Card>
      {active === "General Settings" ? <div className={styles.settingsContent}><Card className={styles.settingsCard}><h2>General Settings</h2><div className={styles.settingsGrid}><Field label="System Name"><input value={settings.systemName} onChange={(event) => update("systemName", event.target.value)} /></Field><Field label="Timezone"><select value={settings.timezone} onChange={(event) => update("timezone", event.target.value)}><option>(GMT+05:30) Asia/Kolkata</option><option>(GMT+06:00) Asia/Dhaka</option><option>(GMT+00:00) UTC</option></select></Field><Field label="Default Language"><select value={settings.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>Bangla</option><option>Hindi</option></select></Field><Field label="Date Format"><select value={settings.dateFormat} onChange={(event) => update("dateFormat", event.target.value)}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></Field><Field label="Time Format"><select value={settings.timeFormat} onChange={(event) => update("timeFormat", event.target.value)}><option>12 Hour (AM/PM)</option><option>24 Hour</option></select></Field><Field label="Default Currency"><select value={settings.currency} onChange={(event) => update("currency", event.target.value)}><option>INR - Indian Rupee (₹)</option><option>BDT - Bangladeshi Taka (৳)</option><option>USD - US Dollar ($)</option></select></Field><Field label="Currency Position"><select value={settings.currencyPosition} onChange={(event) => update("currencyPosition", event.target.value)}><option>Before Amount (₹ 1,234.56)</option><option>After Amount (1,234.56 ₹)</option></select></Field><Field label="Decimal Places"><select value={settings.decimals} onChange={(event) => update("decimals", event.target.value)}><option>0</option><option>2</option><option>3</option></select></Field></div></Card>
        <div className={styles.brandingGrid}><Card className={styles.brandingCard}><h2>Branding</h2><div><UploadTile label="Company Logo" name={logoName} onBrowse={() => logoRef.current?.click()} size="Recommended: 300 × 100 px" /><UploadTile label="Favicon" name={faviconName} onBrowse={() => faviconRef.current?.click()} size="Recommended: 32 × 32 px" /></div><input accept="image/*" className="sr-only" onChange={(event) => fileChange(event, "logo")} ref={logoRef} type="file" /><input accept="image/*" className="sr-only" onChange={(event) => fileChange(event, "favicon")} ref={faviconRef} type="file" /></Card><Card className={styles.preferenceCard}><Toggle checked={settings.darkMode} label="Dark Mode" onChange={(value) => update("darkMode", value)} /><Toggle checked={settings.autoLogout} label="Auto Logout" onChange={(value) => update("autoLogout", value)} /><Field label="Session Timeout"><select value={settings.timeout} onChange={(event) => update("timeout", event.target.value)}><option>15 Minutes</option><option>30 Minutes</option><option>60 Minutes</option></select></Field><Toggle checked={settings.maintenance} label="Maintenance Mode" onChange={(value) => update("maintenance", value)} /><Toggle checked={settings.twoFactor} label="Two-Factor Authentication" onChange={(value) => update("twoFactor", value)} /></Card></div>
      </div> : <Card className={styles.placeholderSettings}><span><UserCog size={28} /></span><h2>{active}</h2><p>Configure {active.toLowerCase()} options for the Jewellery Manager workspace.</p><label><span>Configuration Mode</span><select><option>Standard</option><option>Custom</option></select></label><label><span>Notes</span><textarea placeholder={`Add notes for ${active.toLowerCase()}...`} /></label><button className={styles.primaryButton} type="submit"><Save size={14} />Save {active}</button></Card>}
    </div>
  </form>;
}

function Field({ children, label }: { children: React.ReactNode; label: string }) { return <label className={styles.settingField}><span>{label}</span>{children}</label>; }
function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <label className={styles.preferenceToggle}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i /></label>; }
function UploadTile({ label, name, onBrowse, size }: { label: string; name: string; onBrowse: () => void; size: string }) { return <section className={styles.uploadTile}><h3>{label}</h3><div><BrandMark size={42} /><span>{name || "JEWELLERY MANAGER"}</span></div><button onClick={onBrowse} type="button"><ImageUp size={13} />{name ? "Change" : "Upload"}</button><small>{size}</small></section>; }
