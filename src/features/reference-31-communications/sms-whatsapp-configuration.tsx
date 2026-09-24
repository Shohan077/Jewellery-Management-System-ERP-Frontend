"use client";

import { MessageCircle, Save, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  initialCommunicationHistory,
  initialSmsConfiguration,
  type CommunicationHistoryRow,
  type SmsConfigurationState,
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

type GatewayTab = "SMS Gateway" | "WhatsApp Business";
type Channel = "SMS" | "WhatsApp";
type RecipientRole = "Customers" | "Suppliers" | "Karigars" | "Managers" | "Staff";

const smsPreview = "Dear {customer_name},\nYour payment of {amount} is due on {due_date}. Please clear it at the earliest.\n- Jewellery Manager";
const whatsappPreview = "Dear {customer_name},\nThis is a friendly reminder for your pending payment of {amount}. Please make the payment at the earliest.\n- Jewellery Manager";

export function SmsWhatsappConfiguration() {
  const [activeTab, setActiveTab] = useState<GatewayTab>("SMS Gateway");
  const [configuration, setConfiguration] = useState<SmsConfigurationState>(initialSmsConfiguration);
  const [channel, setChannel] = useState<Channel>("SMS");
  const [mobileNumber, setMobileNumber] = useState("+91 98765 43210");
  const [testTemplate, setTestTemplate] = useState("Due Reminder");
  const [roles, setRoles] = useState<Record<RecipientRole, boolean>>({ Customers: true, Suppliers: true, Karigars: true, Managers: true, Staff: false });
  const [history, setHistory] = useState<CommunicationHistoryRow[]>(initialCommunicationHistory);
  const [selectedHistory, setSelectedHistory] = useState<CommunicationHistoryRow | null>(null);
  const [message, setMessage] = useState("");

  const enabledRecipients = useMemo(() => (Object.entries(roles) as [RecipientRole, boolean][]).filter(([, enabled]) => enabled).map(([role]) => role), [roles]);

  function updateConfiguration(key: keyof SmsConfigurationState, value: string) {
    setConfiguration((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function saveConfiguration() {
    localStorage.setItem("jewellery-manager-sms-whatsapp-configuration", JSON.stringify({ activeTab, configuration, roles }));
    setMessage(`${activeTab} configuration saved successfully.`);
  }

  function sendTest(selectedChannel: Channel) {
    if (mobileNumber.replace(/\D/g, "").length < 10) {
      setMessage("Enter a valid mobile number before sending.");
      return;
    }
    if (enabledRecipients.length === 0) {
      setMessage("Select at least one recipient role before sending.");
      return;
    }

    const template = testTemplate === "Payment Reminder"
      ? configuration.paymentTemplate
      : testTemplate === "OTP"
        ? configuration.otpTemplate
        : configuration.dueTemplate;
    const entry: CommunicationHistoryRow = {
      channel: selectedChannel,
      id: Date.now(),
      messageType: testTemplate,
      recipient: mobileNumber.trim(),
      sentTime: "Just now",
      status: "Delivered",
      template,
    };
    setHistory((current) => [entry, ...current].slice(0, 7));
    setChannel(selectedChannel);
    setMessage(`Test ${selectedChannel} message sent to ${mobileNumber.trim()} for ${enabledRecipients.join(", ")}.`);
  }

  return (
    <div className={styles.page}>
      <CommunicationPageHeader
        actions={<button className={styles.primaryButton} onClick={saveConfiguration} type="button"><Save aria-hidden="true" size={13} />Save Configuration</button>}
        subtitle="Configure SMS gateway and WhatsApp Business API settings."
        title="SMS/WhatsApp Configuration"
      />

      <FeedbackToast message={message} />

      <div className={styles.smsTop}>
        <Card className={styles.railCard}><CommunicationSettingsRail active="SMS Configuration" /></Card>

        <Card className={styles.smsWorkspace}>
          <div className={styles.gatewayTabs} role="tablist">
            {(["SMS Gateway", "WhatsApp Business"] as GatewayTab[]).map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeGatewayTab : ""} key={tab} onClick={() => { setActiveTab(tab); setMessage(""); }} role="tab" type="button">{tab}</button>)}
          </div>

          <div className={styles.smsPanels}>
            <section className={styles.innerPanel}>
              <h2>{activeTab === "SMS Gateway" ? "SMS Gateway Settings" : "WhatsApp Business Settings"}</h2>
              {activeTab === "SMS Gateway" ? <SmsGatewayFields configuration={configuration} update={updateConfiguration} /> : <WhatsAppFields configuration={configuration} update={updateConfiguration} />}
              <h2 className={styles.sectionHeading}>Template Mapping</h2>
              <div className={styles.formStack}>
                <FormField label="Due Reminder"><select onChange={(event) => updateConfiguration("dueTemplate", event.target.value)} value={configuration.dueTemplate}><option>Due_Reminder_Template</option><option>Payment_Due_Template</option><option>General_Reminder_Template</option></select></FormField>
                <FormField label="Payment Reminder"><select onChange={(event) => updateConfiguration("paymentTemplate", event.target.value)} value={configuration.paymentTemplate}><option>Payment_Reminder_Template</option><option>Payment_Due_Template</option><option>General_Reminder_Template</option></select></FormField>
                <FormField label="OTP Template"><select onChange={(event) => updateConfiguration("otpTemplate", event.target.value)} value={configuration.otpTemplate}><option>OTP_Template</option><option>Login_OTP_Template</option><option>Verification_Template</option></select></FormField>
              </div>
            </section>

            <section className={styles.innerPanel}>
              <h2>Live Message Preview</h2>
              <MessagePreview count="160 Chars" text={smsPreview} title="SMS Preview (Due Reminder)" />
              <MessagePreview count="173 Chars" green text={whatsappPreview} title="WhatsApp Preview (Payment Reminder)" />
            </section>

            <section className={styles.innerPanel}>
              <h2>Send Test Message</h2>
              <div className={styles.formStack}>
                <FormField label="Select Channel"><select onChange={(event) => setChannel(event.target.value as Channel)} value={channel}><option>SMS</option><option>WhatsApp</option></select></FormField>
                <FormField label="Mobile Number"><input inputMode="tel" onChange={(event) => setMobileNumber(event.target.value)} value={mobileNumber} /></FormField>
                <FormField label="Select Template"><select onChange={(event) => setTestTemplate(event.target.value)} value={testTemplate}><option>Due Reminder</option><option>Payment Reminder</option><option>OTP</option></select></FormField>
              </div>
              <fieldset className={styles.recipientChecks}>
                <legend>Recipient Roles</legend>
                {(Object.entries(roles) as [RecipientRole, boolean][]).map(([role, enabled]) => <label key={role}><input checked={enabled} onChange={(event) => setRoles((current) => ({ ...current, [role]: event.target.checked }))} type="checkbox" />{role}</label>)}
              </fieldset>
              <div className={styles.testActions}>
                <button className={styles.primaryButton} onClick={() => sendTest(channel)} type="button"><Send aria-hidden="true" size={13} />Send Test {channel}</button>
                <button className={styles.whatsappButton} onClick={() => sendTest("WhatsApp")} type="button"><MessageCircle aria-hidden="true" size={13} />Send Test WhatsApp</button>
              </div>
            </section>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <h2>Communication History</h2>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <thead><tr><th>Message Type</th><th>Recipient</th><th>Template</th><th>Channel</th><th>Delivery Status</th><th>Sent Time</th><th>Action</th></tr></thead>
            <tbody>{history.map((entry) => <tr key={entry.id}><td>{entry.messageType}</td><td>{entry.recipient}</td><td>{entry.template}</td><td>{entry.channel}</td><td><StatusPill status={entry.status} /></td><td>{entry.sentTime}</td><td><button className={styles.viewButton} onClick={() => setSelectedHistory(entry)} type="button">View</button></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      {selectedHistory ? <DetailModal onClose={() => setSelectedHistory(null)} subtitle={`${selectedHistory.channel} • ${selectedHistory.sentTime}`} title="Communication details">
        <dl className={styles.detailList}>
          <div><dt>Message type</dt><dd>{selectedHistory.messageType}</dd></div>
          <div><dt>Recipient</dt><dd>{selectedHistory.recipient}</dd></div>
          <div><dt>Template</dt><dd>{selectedHistory.template}</dd></div>
          <div><dt>Status</dt><dd><StatusPill status={selectedHistory.status} /></dd></div>
        </dl>
        <article className={`${styles.messageBubble} ${selectedHistory.channel === "WhatsApp" ? styles.greenBubble : ""}`}><p>{selectedHistory.channel === "WhatsApp" ? whatsappPreview : smsPreview}</p></article>
      </DetailModal> : null}
    </div>
  );
}

function SmsGatewayFields({ configuration, update }: { configuration: SmsConfigurationState; update: (key: keyof SmsConfigurationState, value: string) => void }) {
  return <div className={styles.formStack}>
    <FormField label="Provider Name"><select onChange={(event) => update("provider", event.target.value)} value={configuration.provider}><option>Twilio</option><option>Msg91</option><option>Textlocal</option></select></FormField>
    <FormField label="API Key"><PasswordInput ariaLabel="SMS API key" onChange={(value) => update("apiKey", value)} value={configuration.apiKey} /></FormField>
    <FormField label="Sender ID"><input onChange={(event) => update("senderId", event.target.value)} value={configuration.senderId} /></FormField>
    <FormField label="Authentication Token"><PasswordInput ariaLabel="authentication token" onChange={(value) => update("authToken", value)} value={configuration.authToken} /></FormField>
    <FormField label="Callback URL"><input onChange={(event) => update("callbackUrl", event.target.value)} value={configuration.callbackUrl} /></FormField>
    <FormField label="Default Country Code"><select onChange={(event) => update("countryCode", event.target.value)} value={configuration.countryCode}><option>+91 (India)</option><option>+1 (United States)</option><option>+44 (United Kingdom)</option></select></FormField>
  </div>;
}

function WhatsAppFields({ configuration, update }: { configuration: SmsConfigurationState; update: (key: keyof SmsConfigurationState, value: string) => void }) {
  return <div className={styles.formStack}>
    <FormField label="Business Account ID"><input onChange={(event) => update("whatsappAccountId", event.target.value)} value={configuration.whatsappAccountId} /></FormField>
    <FormField label="Phone Number ID"><input onChange={(event) => update("whatsappPhoneId", event.target.value)} value={configuration.whatsappPhoneId} /></FormField>
    <FormField label="Access Token"><PasswordInput ariaLabel="WhatsApp access token" onChange={(value) => update("whatsappAccessToken", value)} value={configuration.whatsappAccessToken} /></FormField>
    <FormField label="Business Phone"><input inputMode="tel" onChange={(event) => update("whatsappNumber", event.target.value)} value={configuration.whatsappNumber} /></FormField>
    <FormField label="Webhook URL"><input onChange={(event) => update("whatsappWebhook", event.target.value)} value={configuration.whatsappWebhook} /></FormField>
    <FormField label="Template Namespace"><input onChange={(event) => update("whatsappNamespace", event.target.value)} value={configuration.whatsappNamespace} /></FormField>
  </div>;
}

function MessagePreview({ count, green = false, text, title }: { count: string; green?: boolean; text: string; title: string }) {
  return <article className={styles.previewBlock}><h3>{title}</h3><div className={`${styles.messageBubble} ${green ? styles.greenBubble : ""}`}><p>{text}</p><small>{count}</small></div></article>;
}
