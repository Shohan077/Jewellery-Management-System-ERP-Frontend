"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Gem, ImagePlus, Printer, RotateCcw, Save, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./invoice-settings.module.css";

const settingsTabs = ["General", "Invoice", "Tax & VAT", "Units & Conversion", "Notifications", "Backup", "Integrations"] as const;
type SettingsTab = (typeof settingsTabs)[number];

type InvoiceSettings = {
  prefix: string;
  startNumber: string;
  numberingFormat: string;
  paperSize: string;
  orientation: "Portrait" | "Landscape";
  printTemplate: string;
  footerNote: string;
};

const defaultSettings: InvoiceSettings = {
  prefix: "INV",
  startNumber: "1001",
  numberingFormat: "INV-YYYY-NNNN",
  paperSize: "A4 (210 x 297 mm)",
  orientation: "Portrait",
  printTemplate: "Classic Template",
  footerNote: "Thank you for your business!\nGoods once sold will not be taken back or exchanged.",
};

const terms = [
  "Goods sold are not refundable.",
  "Exchange allowed within 7 days with original bill.",
  "Company is not responsible for any loss of gold.",
  "All disputes are subject to Hyderabad jurisdiction.",
];

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}

function invoiceNumber(settings: InvoiceSettings) {
  const prefix = settings.prefix.trim().toUpperCase() || "INV";
  const numeric = settings.startNumber.replace(/\D/g, "") || "1";
  const number = numeric.padStart(4, "0");
  return settings.numberingFormat
    .replace("INV", prefix)
    .replace("YYYY", "2025")
    .replace("NNNN", number);
}

function SignatureMark() {
  return (
    <svg aria-label="Authorized signature sample" className={styles.signatureMark} role="img" viewBox="0 0 190 72">
      <path d="M11 54c15-5 21-28 27-41-2 27-7 42-2 43 7 2 16-28 22-33-2 15-8 30-1 31 7 1 18-25 21-24 5 1-12 25-3 25 8 0 14-15 20-15 5 1-8 14 0 15 8 0 18-16 22-14 4 2-5 12 1 13 12 2 25-5 35-10M5 61c36-4 83-4 143 0" />
    </svg>
  );
}

function UploadPreview({
  kind,
  onChange,
  onRemove,
  src,
}: {
  kind: "seal" | "signature";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  src: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const title = kind === "seal" ? "Shop Seal" : "Authorized Signature";

  return (
    <div className={styles.uploadRow}>
      <div className={styles.assetPreview}>
        {src ? <img alt={`${title} upload`} src={src} /> : kind === "seal" ? (
          <div aria-label="Sri Venkateswara Jewellers shop seal" className={styles.seal} role="img">
            <span>SRI VENKATESWARA</span><b>SVJ</b><span>JEWELLERS</span>
          </div>
        ) : <SignatureMark />}
      </div>
      <div className={styles.assetActions}>
        <input accept="image/png,image/jpeg" hidden onChange={onChange} ref={inputRef} type="file" />
        <button onClick={() => inputRef.current?.click()} type="button"><ImagePlus aria-hidden="true" size={12} />Change</button>
        <button className={styles.removeButton} onClick={onRemove} type="button"><Trash2 aria-hidden="true" size={12} />Remove</button>
      </div>
    </div>
  );
}

function InvoicePaper({
  number,
  orientation,
  settings,
  signatureSrc,
}: {
  number: string;
  orientation: InvoiceSettings["orientation"];
  settings: InvoiceSettings;
  signatureSrc: string | null;
}) {
  const templateClass = settings.printTemplate === "Modern Template"
    ? styles.modernTemplate
    : settings.printTemplate === "Compact Template"
      ? styles.compactTemplate
      : "";

  return (
    <article className={`${styles.invoicePaper} ${orientation === "Landscape" ? styles.landscapePaper : ""} ${templateClass}`}>
      <header className={styles.invoiceBrand}>
        <div className={styles.invoiceLogo}><Gem aria-hidden="true" size={24} /></div>
        <div>
          <h3>Sri Venkateswara Jewellers</h3>
          <p>12-3-51, Main Road, Kothapet,</p>
          <p>Hyderabad - 500035, Telangana</p>
          <p>Ph: 040-12345678</p>
          <p>GSTIN: 36ABCDE0125F1Z5</p>
        </div>
      </header>

      <h4>TAX INVOICE</h4>
      <dl className={styles.invoiceMeta}>
        <div><dt>Invoice No</dt><dd>{number}</dd></div>
        <div><dt>Date</dt><dd>15-May-2025</dd></div>
        <div><dt>Customer</dt><dd>Walk-in Customer</dd></div>
      </dl>

      <table className={styles.invoiceTable}>
        <thead><tr><th>S.No</th><th>Description</th><th>Qty</th><th>Wt. (g)</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>22K Gold Necklace</td><td>1</td><td>20.120</td><td>1,25,840.00</td></tr>
          <tr><td>2</td><td>Gold Earrings</td><td>1</td><td>5.250</td><td>31,500.00</td></tr>
          <tr><td>3</td><td>Making Charges</td><td>1</td><td>-</td><td>8,000.00</td></tr>
        </tbody>
      </table>

      <dl className={styles.invoiceTotals}>
        <div><dt>Sub Total</dt><dd>1,65,340.00</dd></div>
        <div><dt>CGST (3%)</dt><dd>4,960.20</dd></div>
        <div><dt>SGST (3%)</dt><dd>4,960.20</dd></div>
        <div><dt>Grand Total</dt><dd>1,75,260.40</dd></div>
      </dl>

      <p className={styles.amountWords}><b>Amount in Words:</b> One Lakh Seventy Five Thousand Two Hundred Sixty and Paise Forty Only</p>
      <div className={styles.previewFooterNote}>{settings.footerNote || "Goods once sold will not be taken back or exchanged."}</div>
      <footer className={styles.invoiceSignatures}>
        <span>Customer Signature</span>
        <div>{signatureSrc ? <img alt="Authorized signature" src={signatureSrc} /> : <SignatureMark />}<span>Authorized Signature</span></div>
      </footer>
    </article>
  );
}

export function InvoiceSettings201() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Invoice");
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [sealSrc, setSealSrc] = useState<string | null>(null);
  const [signatureSrc, setSignatureSrc] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const number = useMemo(() => invoiceNumber(settings), [settings]);

  function update<Key extends keyof InvoiceSettings>(key: Key, value: InvoiceSettings[Key]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function readUpload(kind: "seal" | "signature", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const source = typeof reader.result === "string" ? reader.result : null;
      if (kind === "seal") setSealSrc(source);
      else setSignatureSrc(source);
      setMessage(`${kind === "seal" ? "Shop seal" : "Authorized signature"} updated with ${file.name}.`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem("reference-51-invoice-settings", JSON.stringify(settings));
      setMessage("Invoice settings saved successfully.");
    } catch {
      setMessage("Settings are applied for this session, but browser storage is unavailable.");
    }
  }

  function resetSettings() {
    setSettings(defaultSettings);
    setSealSrc(null);
    setSignatureSrc(null);
    localStorage.removeItem("reference-51-invoice-settings");
    setMessage("Invoice settings reset to their defaults.");
  }

  function previewPrint() {
    setMessage("Print preview opened for the current invoice settings.");
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        description="Configure invoice template, numbering, tax, print layout and branding"
        title="Invoice Settings"
      />

      <nav aria-label="System setting categories" className={styles.tabs} role="tablist">
        {settingsTabs.map((tab) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? styles.activeTab : ""}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMessage(`${tab} settings tab selected.`);
            }}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <form className={styles.settingsGrid} onSubmit={saveSettings}>
        <div className={styles.column}>
          <Card className={styles.settingsCard}>
            <h2>Invoice Prefix &amp; Numbering</h2>
            <Field label="Invoice Prefix">
              <input maxLength={8} onChange={(event) => update("prefix", event.target.value.toUpperCase())} value={settings.prefix} />
            </Field>
            <Field label="Invoice Start Number">
              <input min="1" onChange={(event) => update("startNumber", event.target.value)} type="number" value={settings.startNumber} />
            </Field>
            <Field label="Numbering Format">
              <select onChange={(event) => update("numberingFormat", event.target.value)} value={settings.numberingFormat}>
                <option>INV-YYYY-NNNN</option>
                <option>YYYY/INV/NNNN</option>
                <option>INV-NNNN</option>
                <option>NNNN</option>
              </select>
            </Field>
            <Field label="Example"><input className={styles.readOnly} readOnly value={number} /></Field>
          </Card>

          <Card className={styles.settingsCard}>
            <h2>Paper &amp; Print Settings</h2>
            <Field label="Paper Size">
              <select onChange={(event) => update("paperSize", event.target.value)} value={settings.paperSize}>
                <option>A4 (210 x 297 mm)</option>
                <option>A5 (148 x 210 mm)</option>
                <option>Letter (216 x 279 mm)</option>
              </select>
            </Field>
            <fieldset className={styles.orientation}>
              <legend>Orientation</legend>
              {(["Portrait", "Landscape"] as const).map((orientation) => (
                <label key={orientation}>
                  <input
                    checked={settings.orientation === orientation}
                    name="orientation"
                    onChange={() => update("orientation", orientation)}
                    type="radio"
                  />
                  {orientation}
                </label>
              ))}
            </fieldset>
            <Field label="Print Template">
              <select onChange={(event) => update("printTemplate", event.target.value)} value={settings.printTemplate}>
                <option>Classic Template</option>
                <option>Modern Template</option>
                <option>Compact Template</option>
              </select>
            </Field>
          </Card>

          <Card className={styles.settingsCard}>
            <h2>Footer Note</h2>
            <textarea aria-label="Invoice footer note" onChange={(event) => update("footerNote", event.target.value)} rows={3} value={settings.footerNote} />
          </Card>

          <button className={styles.primaryButton} type="submit"><Save aria-hidden="true" size={14} />Save Settings</button>
        </div>

        <div className={styles.column}>
          <Card className={styles.settingsCard}>
            <h2>Default Terms &amp; Conditions</h2>
            <ol className={styles.terms}>{terms.map((term) => <li key={term}>{term}</li>)}</ol>
          </Card>

          <Card className={`${styles.settingsCard} ${styles.brandingCard}`}>
            <h2>Shop Seal / Signature</h2>
            <h3>Shop Seal</h3>
            <UploadPreview
              kind="seal"
              onChange={(event) => readUpload("seal", event)}
              onRemove={() => { setSealSrc(null); setMessage("Shop seal removed."); }}
              src={sealSrc}
            />
            <h3>Authorized Signature</h3>
            <UploadPreview
              kind="signature"
              onChange={(event) => readUpload("signature", event)}
              onRemove={() => { setSignatureSrc(null); setMessage("Authorized signature removed."); }}
              src={signatureSrc}
            />
            <p>Recommended size: 300×100px, PNG/JPG</p>
          </Card>

          <div className={styles.secondaryActions}>
            <button className={styles.primaryButton} onClick={previewPrint} type="button"><Printer aria-hidden="true" size={14} />Preview Print</button>
            <button className={styles.resetButton} onClick={resetSettings} type="button"><RotateCcw aria-hidden="true" size={13} />Reset to Default</button>
          </div>
        </div>

        <Card className={styles.invoicePreviewCard}>
          <h2>Invoice Preview</h2>
          <InvoicePaper number={number} orientation={settings.orientation} settings={settings} signatureSrc={signatureSrc} />
        </Card>
      </form>

      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    </div>
  );
}
