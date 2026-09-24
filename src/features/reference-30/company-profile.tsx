"use client";

import { ImageUp, LockKeyhole, MapPin, RotateCcw, Save } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { BrandLockup, BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/ui/card";

import { initialCompanyProfile, type CompanyProfileState } from "./reference-30-data";
import { SettingsRail } from "./settings-rail";
import styles from "./reference-30.module.css";

export function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfileState>(initialCompanyProfile);
  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef<HTMLInputElement>(null);

  function update<Key extends keyof CompanyProfileState>(key: Key, value: CompanyProfileState[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function pickImage(event: ChangeEvent<HTMLInputElement>, target: "logo" | "signature") {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { setMessage("Choose a JPG or PNG image up to 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => target === "logo" ? setLogo(String(reader.result)) : setSignature(String(reader.result));
    reader.readAsDataURL(file);
    setMessage(`${file.name} selected.`);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("reference-30-company-profile", JSON.stringify(profile));
    setMessage("Company profile saved successfully.");
  }

  function reset() { setProfile(initialCompanyProfile); setLogo(""); setSignature(""); setMessage("Company profile reset."); }

  return (
    <form className={styles.page} onSubmit={save}>
      <header className={styles.screenTitle}><h1>Screen 117 – Company Profile</h1></header>
      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
      <Card className={styles.settingsShell}>
        <SettingsRail active="Company Profile" />
        <section className={styles.companyForm}>
          <h2>Company Profile Information</h2>
          <div className={styles.companyTop}>
            <div className={styles.logoBlock}><span>Company Logo</span><div className={styles.logoBox}>{logo ? <img alt="Company logo preview" src={logo} /> : <BrandLockup />}</div><button className={styles.secondaryButton} onClick={() => logoRef.current?.click()} type="button"><ImageUp size={14} />Change Logo</button><small>JPG, PNG (Max 2MB)</small><input accept="image/png,image/jpeg" className="sr-only" onChange={(event) => pickImage(event, "logo")} ref={logoRef} type="file" /></div>
            <div className={styles.companyFields}><Field label="Company Name" required><input value={profile.companyName} onChange={(event) => update("companyName", event.target.value)} /></Field><Field label="Shop Name" required><input value={profile.shopName} onChange={(event) => update("shopName", event.target.value)} /></Field><Field label="Business Type" required><select value={profile.businessType} onChange={(event) => update("businessType", event.target.value)}><option>Jewellery Retail & Wholesale</option><option>Jewellery Retail</option><option>Jewellery Manufacturing</option></select></Field></div>
          </div>
          <div className={styles.threeFields}><Field label="Phone Number" required><input value={profile.phone} onChange={(event) => update("phone", event.target.value)} /></Field><Field label="Email Address" required><input type="email" value={profile.email} onChange={(event) => update("email", event.target.value)} /></Field><Field label="Website"><input value={profile.website} onChange={(event) => update("website", event.target.value)} /></Field><Field label="Trade License No."><input value={profile.tradeLicense} onChange={(event) => update("tradeLicense", event.target.value)} /></Field><Field label="Tax / VAT Number"><input value={profile.taxNumber} onChange={(event) => update("taxNumber", event.target.value)} /></Field></div>
          <Field label="Address Line 1" required><textarea value={profile.address} onChange={(event) => update("address", event.target.value)} /></Field>
          <div className={styles.fiveFields}><Field label="City" required><select value={profile.city} onChange={(event) => update("city", event.target.value)}><option>Ahmedabad</option><option>Surat</option><option>Vadodara</option></select></Field><Field label="District" required><select value={profile.district} onChange={(event) => update("district", event.target.value)}><option>Ahmedabad</option><option>Surat</option></select></Field><Field label="State" required><select value={profile.state} onChange={(event) => update("state", event.target.value)}><option>Gujarat</option><option>Maharashtra</option></select></Field><Field label="PIN Code" required><input value={profile.pinCode} onChange={(event) => update("pinCode", event.target.value)} /></Field><Field label="Country" required><select value={profile.country} onChange={(event) => update("country", event.target.value)}><option>India</option><option>Bangladesh</option></select></Field></div>
          <div className={styles.mediaGrid}><section><h3>Shop Location (Map)</h3><div className={styles.mapMock}><i /><MapPin size={28} /><span>Shree Hari Jewellers</span></div></section><section><h3>Signature / Stamp</h3><button className={styles.signatureBox} onClick={() => signatureRef.current?.click()} type="button">{signature ? <img alt="Signature preview" src={signature} /> : <><LockKeyhole size={26} /><strong>Upload Signature / Stamp</strong><small>JPG, PNG (Max 2MB)</small></>}</button><input accept="image/*" className="sr-only" onChange={(event) => pickImage(event, "signature")} ref={signatureRef} type="file" /></section></div>
          <footer className={styles.formActions}><button className={styles.primaryButton} type="submit"><Save size={14} />Save Changes</button><button className={styles.secondaryButton} onClick={reset} type="button"><RotateCcw size={14} />Reset</button></footer>
        </section>
        <aside className={styles.companyPreview}><h2>Company Preview</h2><div className={styles.previewBrand}>{logo ? <img alt="Company logo" src={logo} /> : <BrandMark size={58} />}<strong>JEWELLERY<br />MANAGER</strong></div><h3>{profile.companyName}</h3><p>{profile.shopName}</p><p>{profile.businessType}</p><ul><li>☎ {profile.phone}</li><li>✉ {profile.email}</li><li>⌘ {profile.website}</li><li>⌖ {profile.address.replace("\n", ", ")}, {profile.city} - {profile.pinCode}</li><li>▣ {profile.tradeLicense}</li><li>▤ {profile.taxNumber}</li></ul></aside>
      </Card>
    </form>
  );
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) { return <label className={styles.field}><span>{label}{required ? <b> *</b> : null}</span>{children}</label>; }
