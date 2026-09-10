"use client";

import Image from "next/image";
import { Bell, CheckCircle2, Cloud, FileText, ImageUp, Save, Settings2, Tags } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./system-settings.module.css";

const tabs = ["General", "Shop Profile", "Invoice Settings", "Units & Conversion", "Tax & VAT", "Notifications", "Backup"] as const;
type SettingsTab = (typeof tabs)[number];

const auxiliaryTabs: Record<Exclude<SettingsTab, "General" | "Shop Profile">, { icon: typeof Bell; title: string; description: string }> = {
  "Invoice Settings": { icon: FileText, title: "Invoice Settings", description: "Control invoice numbering, notes, and payment terms." },
  "Units & Conversion": { icon: Settings2, title: "Units & Conversion", description: "Configure weight units and jewellery conversions." },
  "Tax & VAT": { icon: Tags, title: "Tax & VAT", description: "Set the default tax and VAT rules for transactions." },
  Notifications: { icon: Bell, title: "Notifications", description: "Choose which operational alerts the team receives." },
  Backup: { icon: Cloud, title: "Backup", description: "Configure automatic backup cadence and retention." },
};

export function SystemSettings() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [logo, setLogo] = useState("");
  const [profile, setProfile] = useState({
    name: "Aarohan Jewellery",
    address: "House 12, Road 5, Dhanmondi\nDhaka, Bangladesh",
    phone: "01712-345678",
    email: "info@aarohanjewellery.com",
    website: "www.aarohanjewellery.com",
    currency: "BDT (৳)",
    businessType: "Jewellery Retail & Manufacturing",
    tin: "123456789012",
    tradeLicense: "TL-2025-001245",
  });
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [defaultUnit, setDefaultUnit] = useState("Gram");
  const [vatRate, setVatRate] = useState("5");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("Daily");
  const [message, setMessage] = useState("");

  function updateProfile(field: keyof typeof profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function selectLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setMessage("Choose an image file smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(String(reader.result));
      setMessage(`${file.name} selected as the new shop logo.`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`${activeTab} settings saved successfully.`);
  }

  const isProfileTab = activeTab === "General" || activeTab === "Shop Profile";

  return (
    <form className={styles.page} onSubmit={saveSettings}>
      <PageHeader description="Manage system configuration and preferences" title="System Settings" />
      <div aria-label="Settings sections" className={styles.tabs} role="tablist">
        {tabs.map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} key={tab} onClick={() => { setActiveTab(tab); setMessage(""); }} role="tab" type="button">{tab}</button>)}
      </div>
      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      {isProfileTab ? (
        <>
          <Card className={styles.profileCard}>
            <div className={styles.cardHeading}><div><h2>Shop Profile</h2><p>Update your shop information and business details</p></div><button className="button button--primary" type="submit"><Save size={15} />Save Settings</button></div>
            <div className={styles.profileGrid}>
              <section className={styles.logoSection}>
                <h3>Logo</h3>
                <div className={styles.logoPreview}>
                  {logo ? <Image alt="Selected shop logo" height={130} src={logo} unoptimized width={170} /> : <><BrandMark size={68} /><strong>Aarohan Jewellery</strong></>}
                </div>
                <input accept="image/*" className="sr-only" onChange={selectLogo} ref={logoInputRef} type="file" />
                <button className="button" onClick={() => logoInputRef.current?.click()} type="button"><ImageUp size={15} />Change Logo</button>
                <small>Recommended size: 200 × 300 px (PNG)</small>
              </section>
              <div className={styles.shopFields}>
                <label className={styles.fullField}><span>Shop Name <b>*</b></span><input className="field" onChange={(event) => updateProfile("name", event.target.value)} required value={profile.name} /></label>
                <label className={styles.fullField}><span>Address</span><textarea className="textarea" onChange={(event) => updateProfile("address", event.target.value)} value={profile.address} /></label>
                <label><span>Phone</span><input className="field" onChange={(event) => updateProfile("phone", event.target.value)} value={profile.phone} /></label>
                <label><span>Email</span><input className="field" onChange={(event) => updateProfile("email", event.target.value)} type="email" value={profile.email} /></label>
                <label><span>Website</span><input className="field" onChange={(event) => updateProfile("website", event.target.value)} value={profile.website} /></label>
                <label><span>Currency</span><select className="select" onChange={(event) => updateProfile("currency", event.target.value)} value={profile.currency}><option>BDT (৳)</option><option>USD ($)</option><option>INR (₹)</option></select></label>
              </div>
            </div>
          </Card>
          <Card className={styles.businessCard}>
            <h2>Business Information</h2>
            <div className={styles.businessGrid}>
              <label><span>Business Type</span><select className="select" onChange={(event) => updateProfile("businessType", event.target.value)} value={profile.businessType}><option>Jewellery Retail & Manufacturing</option><option>Jewellery Retail</option><option>Jewellery Manufacturing</option></select></label>
              <label><span>TIN / VAT No</span><input className="field" onChange={(event) => updateProfile("tin", event.target.value)} value={profile.tin} /></label>
              <label><span>Trade License No</span><input className="field" onChange={(event) => updateProfile("tradeLicense", event.target.value)} value={profile.tradeLicense} /></label>
            </div>
          </Card>
        </>
      ) : (
        <Card className={styles.auxiliaryCard}>
          {(() => { const config = auxiliaryTabs[activeTab]; const Icon = config.icon; return <><span className={styles.auxIcon}><Icon size={25} /></span><div><h2>{config.title}</h2><p>{config.description}</p></div></>; })()}
          <div className={styles.auxFields}>
            {activeTab === "Invoice Settings" ? <label><span>Invoice prefix</span><input className="field" onChange={(event) => setInvoicePrefix(event.target.value)} value={invoicePrefix} /></label> : null}
            {activeTab === "Units & Conversion" ? <label><span>Default weight unit</span><select className="select" onChange={(event) => setDefaultUnit(event.target.value)} value={defaultUnit}><option>Gram</option><option>Vori</option><option>Ounce</option></select></label> : null}
            {activeTab === "Tax & VAT" ? <label><span>Default VAT rate (%)</span><input className="field" min="0" onChange={(event) => setVatRate(event.target.value)} type="number" value={vatRate} /></label> : null}
            {activeTab === "Notifications" ? <label className={styles.toggle}><input checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} type="checkbox" /><span>Enable operational notifications</span></label> : null}
            {activeTab === "Backup" ? <label><span>Automatic backup</span><select className="select" onChange={(event) => setBackupFrequency(event.target.value)} value={backupFrequency}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label> : null}
          </div>
          <button className="button button--primary" type="submit"><CheckCircle2 size={15} />Save {activeTab}</button>
        </Card>
      )}
    </form>
  );
}
