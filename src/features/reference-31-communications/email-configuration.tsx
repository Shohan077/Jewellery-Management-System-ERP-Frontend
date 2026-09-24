"use client";

import { CheckCircle2, CircleX, Mail, RefreshCcw, Save, Send, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  emailTemplates,
  initialEmailConfiguration,
  initialEmailLogs,
  type EmailConfigurationState,
  type EmailLog,
  type EmailTemplateName,
} from "./communications-data";
import {
  CommunicationPageHeader,
  CommunicationSettingsRail,
  DetailModal,
  FeedbackToast,
  FormField,
  PasswordInput,
  StatusPill,
} from "./communications-ui";
import styles from "./communications.module.css";

type EmailModal =
  | { kind: "template"; template: EmailTemplateName }
  | { kind: "log"; log: EmailLog }
  | null;

const replaceEmailVariables = (value: string) => value
  .replaceAll("{customer_name}", "Rajesh Patel")
  .replaceAll("{invoice_no}", "INV-2458")
  .replaceAll("{due_date}", "25 May 2025")
  .replaceAll("{amount}", "₹25,430.00")
  .replaceAll("{order_no}", "ORD-1048");

export function EmailConfiguration() {
  const [configuration, setConfiguration] = useState<EmailConfigurationState>(initialEmailConfiguration);
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateName>("Invoice Email");
  const [logs, setLogs] = useState<EmailLog[]>(initialEmailLogs);
  const [modal, setModal] = useState<EmailModal>(null);
  const [message, setMessage] = useState("");

  const deliverySummary = useMemo(() => {
    const delivered = logs.filter((log) => log.status === "Delivered").length;
    return { delivered, failed: logs.filter((log) => log.status === "Failed").length };
  }, [logs]);

  function updateConfiguration(key: keyof EmailConfigurationState, value: string) {
    setConfiguration((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function saveConfiguration() {
    localStorage.setItem("jewellery-manager-email-configuration", JSON.stringify(configuration));
    setMessage("Email configuration saved successfully.");
  }

  function resetConfiguration() {
    setConfiguration(initialEmailConfiguration);
    setTestEmail("test@example.com");
    setSelectedTemplate("Invoice Email");
    setMessage("Email configuration reset to default values.");
  }

  function sendTestEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!testEmail.trim() || !testEmail.includes("@")) {
      setMessage("Enter a valid email address before sending.");
      return;
    }

    const log: EmailLog = {
      id: Date.now(),
      date: "Just now",
      recipient: testEmail.trim(),
      sentBy: "Admin / Owner",
      status: "Delivered",
      template: selectedTemplate,
    };
    setLogs((current) => [log, ...current].slice(0, 7));
    setMessage(`Test email sent to ${testEmail.trim()}.`);
  }

  return (
    <div className={styles.page}>
      <CommunicationPageHeader
        actions={<>
          <button className={styles.primaryButton} onClick={saveConfiguration} type="button"><Save aria-hidden="true" size={13} />Save Settings</button>
          <button className={styles.secondaryButton} onClick={resetConfiguration} type="button"><RefreshCcw aria-hidden="true" size={13} />Reset</button>
        </>}
        subtitle="Configure outgoing email settings, templates and delivery preferences."
        title="Email Configuration"
      />

      <FeedbackToast message={message} />

      <div className={styles.emailTop}>
        <Card className={styles.railCard}><CommunicationSettingsRail active="Email Configuration" /></Card>

        <Card className={styles.panel}>
          <h2>SMTP Settings</h2>
          <div className={styles.formStack}>
            <FormField label="SMTP Host"><input onChange={(event) => updateConfiguration("smtpHost", event.target.value)} value={configuration.smtpHost} /></FormField>
            <FormField label="Port"><input inputMode="numeric" onChange={(event) => updateConfiguration("port", event.target.value)} value={configuration.port} /></FormField>
            <FormField label="Username"><input onChange={(event) => updateConfiguration("username", event.target.value)} value={configuration.username} /></FormField>
            <FormField label="Password"><PasswordInput ariaLabel="SMTP password" onChange={(value) => updateConfiguration("password", value)} value={configuration.password} /></FormField>
            <FormField label="Encryption"><select onChange={(event) => updateConfiguration("encryption", event.target.value)} value={configuration.encryption}><option>TLS</option><option>SSL</option><option>None</option></select></FormField>
            <FormField label="From Name"><input onChange={(event) => updateConfiguration("fromName", event.target.value)} value={configuration.fromName} /></FormField>
            <FormField label="From Email"><input onChange={(event) => updateConfiguration("fromEmail", event.target.value)} type="email" value={configuration.fromEmail} /></FormField>
            <FormField label="Reply-To Email"><input onChange={(event) => updateConfiguration("replyToEmail", event.target.value)} type="email" value={configuration.replyToEmail} /></FormField>
          </div>
        </Card>

        <Card className={`${styles.panel} ${styles.templatePanel}`}>
          <h2>Email Templates</h2>
          <div className={styles.templateList}>
            {(Object.entries(emailTemplates) as [EmailTemplateName, (typeof emailTemplates)[EmailTemplateName]][]).map(([name, template]) => (
              <article className={styles.templateRow} key={name}>
                <span className={styles.templateIcon}><Mail aria-hidden="true" size={15} /></span>
                <div><strong>{name}</strong><small>{template.description}</small></div>
                <button className={styles.tinyButton} onClick={() => setModal({ kind: "template", template: name })} type="button">Preview Template</button>
              </article>
            ))}
          </div>
        </Card>

        <Card className={`${styles.panel} ${styles.testPanel}`}>
          <h2>Test Email</h2>
          <p className={styles.helperText}>Send a test email to verify your settings.</p>
          <form className={styles.formStack} onSubmit={sendTestEmail}>
            <FormField label="To Email"><input onChange={(event) => setTestEmail(event.target.value)} placeholder="name@example.com" type="email" value={testEmail} /></FormField>
            <FormField label="Select Template"><select onChange={(event) => setSelectedTemplate(event.target.value as EmailTemplateName)} value={selectedTemplate}>{Object.keys(emailTemplates).map((name) => <option key={name}>{name}</option>)}</select></FormField>
            <button className={`${styles.primaryButton} ${styles.fullButton}`} type="submit"><Send aria-hidden="true" size={13} />Send Test Email</button>
          </form>

          <div className={styles.summarySection}>
            <h2>Delivery Status Summary</h2>
            <div className={styles.summaryGrid}>
              <SummaryItem icon={<CheckCircle2 size={14} />} label="Sent Today" tone="green" value="152" />
              <SummaryItem icon={<CircleX size={14} />} label="Failed Today" tone="red" value="12" />
              <SummaryItem icon={<TrendingUp size={14} />} label="Delivery Rate" tone="green" value="98.2%" />
              <SummaryItem label="Sent last 7d" value="1,245" />
              <SummaryItem label="Sent (30 Days)" value="4,245" />
            </div>
            <span className="sr-only">{deliverySummary.delivered} delivered and {deliverySummary.failed} failed entries shown</span>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <h2>Recent Email Logs</h2>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <thead><tr><th>Date</th><th>Recipient</th><th>Template</th><th>Status</th><th>Sent By</th><th>Action</th></tr></thead>
            <tbody>{logs.map((log) => <tr key={log.id}><td>{log.date}</td><td>{log.recipient}</td><td>{log.template}</td><td><StatusPill status={log.status} /></td><td>{log.sentBy}</td><td><button className={styles.viewButton} onClick={() => setModal({ kind: "log", log })} type="button">View</button></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      {modal?.kind === "template" ? <DetailModal onClose={() => setModal(null)} subtitle={emailTemplates[modal.template].description} title={modal.template}>
        <PreviewEmail template={modal.template} />
      </DetailModal> : null}
      {modal?.kind === "log" ? <DetailModal onClose={() => setModal(null)} subtitle={`${modal.log.status} • ${modal.log.date}`} title="Email delivery details">
        <dl className={styles.detailList}>
          <div><dt>Recipient</dt><dd>{modal.log.recipient}</dd></div>
          <div><dt>Template</dt><dd>{modal.log.template}</dd></div>
          <div><dt>Sent by</dt><dd>{modal.log.sentBy}</dd></div>
          <div><dt>Status</dt><dd><StatusPill status={modal.log.status} /></dd></div>
        </dl>
        <PreviewEmail template={modal.log.template} />
      </DetailModal> : null}
    </div>
  );
}

function SummaryItem({ icon, label, tone = "blue", value }: { icon?: React.ReactNode; label: string; tone?: "blue" | "green" | "red"; value: string }) {
  return <div className={`${styles.summaryItem} ${styles[`summary${tone}`]}`}>{icon}<strong>{value}</strong><small>{label}</small></div>;
}

function PreviewEmail({ template }: { template: EmailTemplateName }) {
  const content = emailTemplates[template];
  return <article className={styles.emailPreview}><strong>Subject: {replaceEmailVariables(content.subject)}</strong><p>{replaceEmailVariables(content.body)}</p></article>;
}
