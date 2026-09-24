"use client";

import { CheckCircle2, Eye, EyeOff, Save, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import styles from "./reference-30.module.css";

const tabs = ["SMS", "Email", "WhatsApp", "In-App Notifications"] as const;
type NotificationTab = (typeof tabs)[number];

const templates = {
  "Due Reminder": "Dear {customer_name},\nThis is a reminder for your due amount of {due_amount} against invoice {invoice_no}.\nDue Date: {due_date}\n\nRegards,\n{company_name}",
  "Payment Receipt": "Dear {customer_name},\nWe received your payment for invoice {invoice_no}. Thank you.\n\nRegards,\n{company_name}",
  "Order Ready": "Dear {customer_name},\nYour jewellery order is ready for collection.\n\nRegards,\n{company_name}",
};

export function NotificationSettings() {
  const [active, setActive] = useState<NotificationTab>("SMS");
  const [showKey, setShowKey] = useState(false);
  const [config, setConfig] = useState({ sender: "JWMANAGER", provider: "Msg91", apiKey: "sk_live_jwm_123456", senderId: "JWMNGR", enabled: true });
  const [alerts, setAlerts] = useState({ lowStock: true, due: true, pawn: true, karigar: true, backup: true, closing: true });
  const [templateName, setTemplateName] = useState<keyof typeof templates>("Due Reminder");
  const [content, setContent] = useState(templates["Due Reminder"]);
  const [roles, setRoles] = useState({ Customers: true, Suppliers: false, Karigars: true, Managers: true, Admin: true });
  const [message, setMessage] = useState("");

  const preview = useMemo(() => content
    .replaceAll("{customer_name}", "Rajesh Patel")
    .replaceAll("{due_amount}", "₹25,430.00")
    .replaceAll("{invoice_no}", "INV-2458")
    .replaceAll("{due_date}", "15/05/2024")
    .replaceAll("{company_name}", "Shree Hari Jewellers"), [content]);

  function changeTemplate(name: keyof typeof templates) { setTemplateName(name); setContent(templates[name]); }
  function save() { localStorage.setItem("reference-30-notifications", JSON.stringify({ active, config, alerts, templateName, content, roles })); setMessage(`${active} notification settings saved.`); }
  function sendTest() { const recipients = Object.entries(roles).filter(([, value]) => value).map(([key]) => key); setMessage(`Test ${active} sent to ${recipients.join(", ") || "no recipients"}.`); }

  return <div className={styles.page}>
    <header className={styles.screenTitle}><h1>Screen 119 – Notification Settings</h1></header>
    <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>
    <Card className={styles.notificationCard}>
      <div className={styles.notificationTabs} role="tablist">{tabs.map((tab) => <button aria-selected={active === tab} className={active === tab ? styles.activeNotificationTab : ""} key={tab} onClick={() => { setActive(tab); setMessage(""); }} role="tab" type="button">{tab}</button>)}</div>
      <div className={styles.notificationGrid}>
        <section className={styles.configColumn}><h2>{active} Configuration</h2><Field label="Sender Name" required><input value={config.sender} onChange={(event) => setConfig((current) => ({ ...current, sender: event.target.value }))} /></Field><Field label={`${active} Gateway Provider`} required><select value={config.provider} onChange={(event) => setConfig((current) => ({ ...current, provider: event.target.value }))}><option>Msg91</option><option>Twilio</option><option>SendGrid</option><option>Meta Cloud API</option></select></Field><Field label="API Key" required><div className={styles.passwordField}><input type={showKey ? "text" : "password"} value={config.apiKey} onChange={(event) => setConfig((current) => ({ ...current, apiKey: event.target.value }))} /><button aria-label={showKey ? "Hide API key" : "Show API key"} onClick={() => setShowKey((value) => !value)} type="button">{showKey ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></Field><Field label="Sender ID"><input value={config.senderId} onChange={(event) => setConfig((current) => ({ ...current, senderId: event.target.value }))} /></Field><Toggle checked={config.enabled} label={`Enable ${active}`} onChange={(value) => setConfig((current) => ({ ...current, enabled: value }))} /><h2>Alert &amp; Reminder Settings</h2>{Object.entries(alerts).map(([key, value]) => <Toggle checked={value} key={key} label={({ lowStock: "Low Stock Alert", due: "Due Reminder", pawn: "Pawn Due Reminder", karigar: "Karigar Work Reminder", backup: "Backup Success Alert", closing: "Daily Closing Alert" } as Record<string, string>)[key]} onChange={(next) => setAlerts((current) => ({ ...current, [key]: next }))} />)}</section>
        <section className={styles.templateColumn}><h2>Message Templates</h2><Field label="Select Template"><select value={templateName} onChange={(event) => changeTemplate(event.target.value as keyof typeof templates)}>{Object.keys(templates).map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Template Content"><textarea value={content} onChange={(event) => setContent(event.target.value)} /></Field><span className={styles.availableLabel}>Available Variables:</span><div className={styles.variableChips}>{["{customer_name}", "{due_amount}", "{due_date}", "{invoice_no}", "{company_name}"].map((variable) => <button key={variable} onClick={() => setContent((current) => `${current} ${variable}`)} type="button">{variable}</button>)}</div><h2>Send To (Recipient Roles)</h2><div className={styles.roleChecks}>{Object.entries(roles).map(([role, checked]) => <label key={role}><input checked={checked} onChange={(event) => setRoles((current) => ({ ...current, [role]: event.target.checked }))} type="checkbox" />{role}</label>)}</div><footer><button className={styles.secondaryButton} onClick={sendTest} type="button"><Send size={14} />Send Test {active === "In-App Notifications" ? "Notice" : active}</button><button className={styles.primaryButton} onClick={save} type="button"><Save size={14} />Save Settings</button></footer></section>
        <aside className={styles.previewColumn}><h2>Live Preview</h2><Preview title={`${active} Preview`} tone="green" text={preview} count={`${preview.length} / 160`} /><Preview title="Email Preview" tone="blue" text={`Subject: Payment Reminder - INV-2458\n\n${preview}`} /><Preview title="WhatsApp Preview" tone="green" text={preview} /><div className={styles.previewSuccess}><CheckCircle2 size={16} />Preview updates as you type</div></aside>
      </div>
    </Card>
  </div>;
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) { return <label className={styles.field}><span>{label}{required ? <b> *</b> : null}</span>{children}</label>; }
function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <label className={styles.toggle}><span>{label}</span><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><i /></label>; }
function Preview({ title, tone, text, count }: { title: string; tone: "green" | "blue"; text: string; count?: string }) { return <section className={styles.previewBox}><h3>{title}</h3><div className={tone === "blue" ? styles.bluePreview : styles.greenPreview}><p>{text}</p>{count ? <small>{count}</small> : null}</div></section>; }
