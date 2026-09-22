"use client";

import { Eye, Save } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  defaultInvoiceSettings,
  getSettingsSnapshot,
  INITIAL_SETTINGS_SNAPSHOT,
  parseInvoiceSettings,
  persistInvoiceSettings,
  subscribeBarcodeInvoice,
  type InvoiceSettings as InvoiceSettingsData,
} from "./barcode-invoice-data";
import { BarcodeVisual, JewelleryMark } from "./barcode-visual";
import styles from "./barcode-invoice.module.css";

const invoiceLayouts: InvoiceSettingsData["invoiceLayout"][] = ["Standard", "Modern", "Compact", "Thermal Print (Small)"];

export function InvoiceSettings() {
  const snapshot = useSyncExternalStore(subscribeBarcodeInvoice, getSettingsSnapshot, () => INITIAL_SETTINGS_SNAPSHOT);
  const settings = useMemo(() => parseInvoiceSettings(snapshot), [snapshot]);
  const [message, setMessage] = useState("");

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const next: InvoiceSettingsData = {
      shopName: String(data.get("shopName") || defaultInvoiceSettings.shopName),
      address: String(data.get("address") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      invoicePrefix: String(data.get("invoicePrefix") || "INV").toUpperCase(),
      startingNumber: String(data.get("startingNumber") || "100001"),
      invoiceLayout: String(data.get("invoiceLayout") || "Standard") as InvoiceSettingsData["invoiceLayout"],
      showBarcode: data.get("showBarcode") === "on",
      showItemImage: data.get("showItemImage") === "on",
      showTerms: data.get("showTerms") === "on",
    };
    persistInvoiceSettings(next);
    setMessage(submitter?.value === "preview" ? "Invoice preview refreshed with the current settings." : "Invoice settings saved successfully.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Invoice Settings</h1><p>Home <span>›</span> Barcode &amp; Invoice <span>›</span> Invoice Settings</p></header>
      <section className={`${styles.twoColumn} ${styles.settingsColumns}`}>
        <Card as="form" className={`${styles.panel} ${styles.settingsForm}`} key={snapshot} onSubmit={saveSettings}>
          <h2>Invoice Configuration</h2>
          <label><span>Shop Name <b>*</b></span><input className="field" defaultValue={settings.shopName} name="shopName" required /></label>
          <label><span>Address</span><input className="field" defaultValue={settings.address} name="address" /></label>
          <label><span>Phone</span><input className="field" defaultValue={settings.phone} name="phone" /></label>
          <label><span>Email</span><input className="field" defaultValue={settings.email} name="email" type="email" /></label>
          <label><span>Invoice Prefix</span><input className="field" defaultValue={settings.invoicePrefix} maxLength={8} name="invoicePrefix" /></label>
          <label><span>Starting Number</span><input className="field" defaultValue={settings.startingNumber} min="1" name="startingNumber" type="number" /></label>
          <label><span>Invoice Layout</span><select className="select" defaultValue={settings.invoiceLayout} name="invoiceLayout">{invoiceLayouts.map((layout) => <option key={layout}>{layout}</option>)}</select></label>
          <label className={styles.toggleRow}><span>Show Barcode</span><input defaultChecked={settings.showBarcode} name="showBarcode" type="checkbox" /><i aria-hidden="true" /></label>
          <label className={styles.toggleRow}><span>Show Item Image</span><input defaultChecked={settings.showItemImage} name="showItemImage" type="checkbox" /><i aria-hidden="true" /></label>
          <label className={styles.toggleRow}><span>Show Terms &amp;<br />Conditions</span><input defaultChecked={settings.showTerms} name="showTerms" type="checkbox" /><i aria-hidden="true" /></label>
          <div className={styles.settingsActions}><button className={styles.greenButton} name="intent" type="submit" value="save"><Save size={16} />Save Settings</button><button className={styles.secondaryButton} name="intent" type="submit" value="preview"><Eye size={16} />Preview Invoice</button></div>
          <p aria-live="polite" className={message ? styles.inlineFeedback : "sr-only"}>{message}</p>
        </Card>

        <Card className={`${styles.panel} ${styles.invoicePreviewPanel}`}>
          <h2>Preview</h2>
          <article className={styles.invoicePaper}>
            <header><JewelleryMark /><h3>{settings.shopName}</h3><p>{settings.address}</p><p>{settings.phone}</p></header>
            <div className={styles.invoiceMeta}><section><strong>INVOICE</strong><span>Invoice No :</span><span>Date</span><span>Customer :</span><span>Phone :</span></section><section><strong>INVOICE</strong><span>{settings.invoicePrefix}-{settings.startingNumber}</span><span>16 Apr 2025</span><span>Mahfuz Rahman</span><span>01712-345678</span></section></div>
            <table><thead><tr><th>SL</th><th>Item Description</th><th>Wt.</th><th>Rate</th><th>Amount</th></tr></thead><tbody><tr><td>1</td><td>Gold Necklace</td><td>12.500</td><td>8,500</td><td>106,250</td></tr><tr><td>2</td><td>Gold Ring</td><td>3.260</td><td>8,500</td><td>27,625</td></tr></tbody></table>
            <dl><div><dt>Subtotal</dt><dd>133,875</dd></div><div><dt>Discount</dt><dd>0</dd></div><div><dt>Total</dt><dd>133,875</dd></div></dl>
            {settings.showBarcode ? <BarcodeVisual compact value={`${settings.invoicePrefix}-${settings.startingNumber}`} /> : null}
            {settings.showTerms ? <footer>Thank You for Your Purchase!</footer> : null}
          </article>
        </Card>
      </section>
    </div>
  );
}

