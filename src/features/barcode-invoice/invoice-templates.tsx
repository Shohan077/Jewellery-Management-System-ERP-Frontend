"use client";

import { Save } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";

import {
  getTemplateSnapshot,
  persistInvoiceTemplate,
  subscribeBarcodeInvoice,
  type InvoiceTemplateId,
} from "./barcode-invoice-data";
import { BarcodeVisual, JewelleryMark } from "./barcode-visual";
import styles from "./barcode-invoice.module.css";

const templates: Array<{ id: InvoiceTemplateId; label: string }> = [
  { id: "standard", label: "Standard Template" },
  { id: "modern", label: "Modern Template" },
  { id: "compact", label: "Compact Template" },
  { id: "thermal", label: "Thermal Print (Small)" },
];

function TemplatePreview({ template }: { template: InvoiceTemplateId }) {
  return (
    <div className={`${styles.templatePaper} ${styles[`template_${template}`]}`}>
      <header><JewelleryMark small /><strong>স্বর্ণ নিবেদন জুয়েলারী</strong><small>INVOICE</small></header>
      <section><span>Invoice: INV-100001</span><span>Date: 16 Apr 2025</span><span>Customer: Mahfuz Rahman</span></section>
      <div className={styles.miniTable}><b>Item</b><b>Wt.</b><b>Amount</b><span>Gold Necklace</span><span>12.50</span><span>106,250</span><span>Gold Ring</span><span>3.26</span><span>27,625</span></div>
      <dl><dt>Total</dt><dd>133,875</dd></dl>
      <BarcodeVisual compact value="INV-100001" />
    </div>
  );
}

export function InvoiceTemplates() {
  const selected = useSyncExternalStore(subscribeBarcodeInvoice, getTemplateSnapshot, () => "standard" as InvoiceTemplateId);
  const [message, setMessage] = useState("");

  function choose(template: InvoiceTemplateId) {
    persistInvoiceTemplate(template);
    setMessage("");
  }

  function save() {
    const label = templates.find((template) => template.id === selected)?.label ?? "Template";
    persistInvoiceTemplate(selected);
    setMessage(`${label} saved as the active invoice template.`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Invoice Template</h1><p>Home <span>›</span> Barcode &amp; Invoice <span>›</span> Invoice Template</p></header>
      <Card className={styles.templateSelector}>
        <div><h2>Select Template</h2><fieldset>{templates.filter((template) => template.id !== "modern").map((template) => <label key={template.id}><input checked={selected === template.id} onChange={() => choose(template.id)} type="radio" />{template.label}</label>)}</fieldset></div>
        <button className={styles.greenButton} onClick={save} type="button"><Save size={16} />Save Template</button>
      </Card>
      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>
      <section className={styles.templateGrid}>{templates.map((template) => <button aria-pressed={selected === template.id} className={`${styles.templateCard} ${selected === template.id ? styles.selectedTemplate : ""}`} key={template.id} onClick={() => choose(template.id)} type="button"><TemplatePreview template={template.id} /><strong>{template.label}</strong></button>)}</section>
    </div>
  );
}

