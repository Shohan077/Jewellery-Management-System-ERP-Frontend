export type EmailConfigurationState = {
  smtpHost: string;
  port: string;
  username: string;
  password: string;
  encryption: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
};

export const initialEmailConfiguration: EmailConfigurationState = {
  smtpHost: "smtp.gmail.com",
  port: "587",
  username: "jewellerymanager@gmail.com",
  password: "jewellery@2025",
  encryption: "TLS",
  fromName: "Jewellery Manager",
  fromEmail: "noreply@jewellerymanager.com",
  replyToEmail: "support@jewellerymanager.com",
};

export const emailTemplates = {
  "Invoice Email": {
    description: "Sent to customer with invoice",
    subject: "Your invoice from Jewellery Manager",
    body: "Dear {customer_name},\n\nThank you for your purchase. Your invoice {invoice_no} is attached for your records.\n\nRegards,\nJewellery Manager",
  },
  "Payment Reminder": {
    description: "Payment reminder to customer",
    subject: "Payment reminder - {invoice_no}",
    body: "Dear {customer_name},\n\nThis is a friendly reminder that payment for invoice {invoice_no} is due on {due_date}.\n\nRegards,\nJewellery Manager",
  },
  "Due Notice": {
    description: "Due notice for pending payment",
    subject: "Due notice for invoice {invoice_no}",
    body: "Dear {customer_name},\n\nAn amount of {amount} is currently due against invoice {invoice_no}. Please arrange payment at your earliest convenience.\n\nRegards,\nJewellery Manager",
  },
  "Order Confirmation": {
    description: "Order confirmation to customer",
    subject: "Your jewellery order is confirmed",
    body: "Dear {customer_name},\n\nYour order {order_no} has been confirmed. We will notify you when it is ready for collection.\n\nRegards,\nJewellery Manager",
  },
} as const;

export type EmailTemplateName = keyof typeof emailTemplates;

export type EmailLog = {
  id: number;
  date: string;
  recipient: string;
  template: EmailTemplateName;
  status: "Delivered" | "Failed" | "Queued";
  sentBy: string;
};

export const initialEmailLogs: EmailLog[] = [
  { id: 1, date: "19 May 2025 10:45 AM", recipient: "customer1@example.com", template: "Invoice Email", status: "Delivered", sentBy: "Admin / Owner" },
  { id: 2, date: "19 May 2025 10:43 AM", recipient: "customer2@example.com", template: "Payment Reminder", status: "Delivered", sentBy: "Admin / Owner" },
  { id: 3, date: "19 May 2025 10:41 AM", recipient: "supplier@example.com", template: "Due Notice", status: "Failed", sentBy: "Admin / Owner" },
  { id: 4, date: "19 May 2025 10:39 AM", recipient: "customer3@example.com", template: "Order Confirmation", status: "Delivered", sentBy: "Admin / Owner" },
  { id: 5, date: "19 May 2025 10:35 AM", recipient: "customer4@example.com", template: "Invoice Email", status: "Delivered", sentBy: "Admin / Owner" },
];

export type SmsConfigurationState = {
  provider: string;
  apiKey: string;
  senderId: string;
  authToken: string;
  callbackUrl: string;
  countryCode: string;
  dueTemplate: string;
  paymentTemplate: string;
  otpTemplate: string;
  whatsappAccountId: string;
  whatsappPhoneId: string;
  whatsappAccessToken: string;
  whatsappNumber: string;
  whatsappWebhook: string;
  whatsappNamespace: string;
};

export const initialSmsConfiguration: SmsConfigurationState = {
  provider: "Twilio",
  apiKey: "SK-jm-982346892",
  senderId: "JWMGR",
  authToken: "auth-jm-728346",
  callbackUrl: "https://jewellerymanager.com/callback",
  countryCode: "+91 (India)",
  dueTemplate: "Due_Reminder_Template",
  paymentTemplate: "Payment_Reminder_Template",
  otpTemplate: "OTP_Template",
  whatsappAccountId: "WABA-104589203",
  whatsappPhoneId: "109834572019",
  whatsappAccessToken: "EAAJWMGR-384920",
  whatsappNumber: "+91 98765 43210",
  whatsappWebhook: "https://jewellerymanager.com/whatsapp",
  whatsappNamespace: "jewellery_manager",
};

export type CommunicationHistoryRow = {
  id: number;
  messageType: string;
  recipient: string;
  template: string;
  channel: "SMS" | "WhatsApp";
  status: "Delivered" | "Failed" | "Queued";
  sentTime: string;
};

export const initialCommunicationHistory: CommunicationHistoryRow[] = [
  { id: 1, messageType: "Payment Reminder", recipient: "+91 98765 43210", template: "Payment_Reminder_Template", channel: "SMS", status: "Delivered", sentTime: "19 May 2025 10:50 AM" },
  { id: 2, messageType: "Due Reminder", recipient: "+91 91234 56789", template: "Due_Reminder_Template", channel: "WhatsApp", status: "Delivered", sentTime: "19 May 2025 10:45 AM" },
  { id: 3, messageType: "OTP", recipient: "+91 99876 54321", template: "OTP_Template", channel: "SMS", status: "Delivered", sentTime: "19 May 2025 10:47 AM" },
  { id: 4, messageType: "Promotional Alert", recipient: "+91 88776 66544", template: "Promo_Template", channel: "WhatsApp", status: "Failed", sentTime: "19 May 2025 10:45 AM" },
];

export const settingsRailItems = [
  { label: "General Settings", href: "/settings/system-settings" },
  { label: "Company Profile", href: "/settings/company-profile" },
  { label: "Tax & Currency", href: "/settings/tax-currency" },
  { label: "Notification Settings", href: "/settings/notifications" },
  { label: "Email Configuration", href: "/settings/email-configuration" },
  { label: "SMS Configuration", href: "/settings/sms-whatsapp" },
  { label: "Security Settings", href: "/settings/security" },
  { label: "System Maintenance", href: "/settings/system-maintenance" },
  { label: "Branch Management", href: "/branches/manage" },
] as const;
