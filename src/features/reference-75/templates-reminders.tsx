"use client";

import { useState, type FormEvent } from "react";
import { Download, Eye, Filter, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  base,
  Button,
  Donut,
  Feedback,
  Intro,
  type Metric,
  Metrics,
  Modal,
  Pager,
  SearchBox,
  Status,
  Tabs,
  exportCsv,
} from "../reference-73/shared";
import styles from "./reference-75.module.css";

type TemplateChannel = "SMS" | "WhatsApp";
type TemplateStatus = "Approved" | "Pending";
type MessageTemplate = {
  name: string;
  type: TemplateChannel;
  category: string;
  language: string;
  status: TemplateStatus;
  preview: string;
  updated: string;
};

const templateMetrics: Metric[] = [
  { label: "Total Templates", value: "42", note: "All Templates" },
  { label: "SMS Templates", value: "21", trend: "50.00%", note: "" },
  { label: "WhatsApp Templates", value: "21", trend: "50.00%", note: "" },
  { label: "Approved Templates", value: "38", trend: "90.48%", note: "" },
  { label: "Pending Templates", value: "4", trend: "9.52%", note: "" },
];

const initialTemplates: MessageTemplate[] = [
  { name: "Akshaya Tritiya Offer", type: "SMS", category: "Promotion", language: "English", status: "Approved", preview: "Dear [name], Celebrate Akshaya Tritiya with special offers...", updated: "24 May 2025" },
  { name: "Wedding Season Offer", type: "WhatsApp", category: "Promotion", language: "English", status: "Approved", preview: "Hi [name], Make your wedding special with our exclusive...", updated: "23 May 2025" },
  { name: "Order Confirmation", type: "SMS", category: "Transaction", language: "English", status: "Approved", preview: "Dear [name], Your order #[order_id] has been confirmed...", updated: "22 May 2025" },
  { name: "Diamond Collection", type: "WhatsApp", category: "Promotion", language: "English", status: "Approved", preview: "Dear [name], Explore our new diamond collection...", updated: "21 May 2025" },
  { name: "Payment Reminder", type: "SMS", category: "Reminder", language: "English", status: "Approved", preview: "Dear [name], This is a friendly reminder for payment...", updated: "20 May 2025" },
  { name: "New Arrival Alert", type: "WhatsApp", category: "Promotion", language: "English", status: "Pending", preview: "Hi [name], New arrivals are here! Check out our latest...", updated: "19 May 2025" },
  { name: "Birthday Wishes", type: "SMS", category: "Greetings", language: "English", status: "Approved", preview: "Happy Birthday [name]! Get special discount on your...", updated: "18 May 2025" },
  { name: "Survey Feedback", type: "WhatsApp", category: "Engagement", language: "English", status: "Pending", preview: "Hi [name], We value your feedback. Please take a moment...", updated: "17 May 2025" },
];

const templateTabs = ["All Templates", "SMS Templates", "WhatsApp Templates"] as const;

function TemplateForm({ channel, onClose, onSave }: { channel: TemplateChannel; onClose: () => void; onSave: (row: MessageTemplate) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      name: String(data.get("name")),
      type: String(data.get("channel")) as TemplateChannel,
      category: String(data.get("category")),
      language: "English",
      status: "Pending",
      preview: String(data.get("content")),
      updated: "26 May 2025",
    });
  }

  return (
    <Modal description="Create a reusable campaign message." onClose={onClose} title={`New ${channel} Template`}>
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Template name</span><input name="name" required /></label>
        <label><span>Channel</span><select defaultValue={channel} name="channel"><option>SMS</option><option>WhatsApp</option></select></label>
        <label><span>Category</span><select name="category"><option>Promotion</option><option>Transaction</option><option>Reminder</option><option>Engagement</option><option>Greetings</option></select></label>
        <label><span>Message content</span><input name="content" placeholder="Dear [name], ..." required /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Save Template</Button></footer>
      </form>
    </Modal>
  );
}

export function Reference75Templates() {
  const [rows, setRows] = useState(initialTemplates);
  const [tab, setTab] = useState<(typeof templateTabs)[number]>("All Templates");
  const [query, setQuery] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<TemplateChannel | null>(null);
  const [message, setMessage] = useState("");
  const channel = tab === "SMS Templates" ? "SMS" : tab === "WhatsApp Templates" ? "WhatsApp" : null;
  const visible = rows.filter((row) => {
    const matchesSearch = `${row.name} ${row.preview} ${row.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (!channel || row.type === channel) && (!pendingOnly || row.status === "Pending");
  });

  return (
    <div className={base.page}>
      <Intro
        actions={<><Button onClick={() => setModal("SMS")} primary><Plus size={13} />New SMS Template</Button><Button onClick={() => setModal("WhatsApp")} primary><Plus size={13} />New WhatsApp Template</Button></>}
        description="Create and manage message templates for campaigns."
        title="SMS / WhatsApp Templates"
      />
      <Metrics rows={templateMetrics} />
      <Card className={base.tableCard}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={templateTabs} />
        <div className={base.tableToolbar}>
          <SearchBox onChange={setQuery} placeholder="Search template by name or content..." value={query} />
          <span className={styles.toolbarSpacer} />
          <Button onClick={() => setPendingOnly((value) => !value)}><Filter size={12} />Filters</Button>
          <Button onClick={() => { exportCsv("message-templates.csv", ["Name", "Type", "Category", "Language", "Status", "Content", "Updated"], visible.map((row) => [row.name, row.type, row.category, row.language, row.status, row.preview, row.updated])); setMessage("Template list exported."); }}><Download size={12} />Export</Button>
        </div>
        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.tableWide}`}>
            <thead><tr><th>#</th><th>Template Name</th><th>Type</th><th>Category</th><th>Language</th><th>Status</th><th>Content Preview</th><th>Updated On</th><th>Actions</th></tr></thead>
            <tbody>{visible.map((row, index) => <tr key={`${row.name}-${row.type}`}><td>{index + 1}</td><td><b>{row.name}</b></td><td>{row.type}</td><td>{row.category}</td><td>{row.language}</td><td><Status tone={row.status === "Approved" ? "success" : "warning"}>{row.status}</Status></td><td>{row.preview}</td><td>{row.updated}</td><td><span className={styles.actionPair}><button aria-label={`Preview ${row.name}`} className={base.iconButton} onClick={() => setMessage(row.preview)}><Eye size={12} /></button><button aria-label={`Delete ${row.name}`} className={`${base.iconButton} ${base.iconDanger}`} onClick={() => { setRows((items) => items.filter((item) => item !== row)); setMessage(`${row.name} deleted.`); }}><Trash2 size={12} /></button></span></td></tr>)}</tbody>
          </table>
        </div>
        <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 42 entries</span><Pager current={page} last={6} onChange={setPage} /></footer>
      </Card>
      <section className={styles.bottomThree}>
        <Card className={styles.panel}><h2>Templates by Type</h2><Donut center="42" label="Total Templates" slices={[{ label: "SMS", value: 50, color: "#126fe8", note: "21 (50.00%)" }, { label: "WhatsApp", value: 50, color: "#15955f", note: "21 (50.00%)" }]} /></Card>
        <Card className={styles.panel}><h2>Templates by Status</h2><div className={styles.barRows}><div><span>Approved</span><i style={{ width: "90.48%" }} /><b>38 (90.48%)</b></div><div><span>Pending</span><i style={{ width: "9.52%", minWidth: 12 }} /><b>4 (9.52%)</b></div></div></Card>
        <Card className={styles.panel}><h2>Top Categories</h2><ol className={styles.ranking}>{[["Promotion", "18 (42.86%)"], ["Transaction", "8 (19.05%)"], ["Reminder", "6 (14.29%)"], ["Engagement", "5 (11.90%)"], ["Greetings", "5 (11.90%)"]].map(([name, value]) => <li key={name}><span>{name}</span><b>{value}</b></li>)}</ol></Card>
      </section>
      <Feedback text={message} />
      {modal ? <TemplateForm channel={modal} onClose={() => setModal(null)} onSave={(row) => { setRows((items) => [row, ...items]); setModal(null); setMessage(`${row.name} created and submitted for approval.`); }} /> : null}
    </div>
  );
}

type ReminderType = "Payment" | "Follow Up" | "Birthday" | "Custom" | "Anniversary";
type ReminderStatus = "Sent" | "Pending" | "Scheduled";
type Reminder = {
  title: string;
  type: ReminderType;
  target: string;
  schedule: string;
  channel: TemplateChannel;
  status: ReminderStatus;
};

const reminderMetrics: Metric[] = [
  { label: "Total Reminders", value: "56", note: "All Reminders" },
  { label: "Pending", value: "18", note: "Pending Reminders" },
  { label: "Sent Today", value: "12", note: "Sent Today" },
  { label: "Upcoming", value: "26", note: "Next 7 Days" },
  { label: "Completion Rate", value: "78.57%", note: "This Month" },
];

const initialReminders: Reminder[] = [
  { title: "Payment Reminder - May", type: "Payment", target: "Rahim Ahmed", schedule: "26 May 2025 10:00 AM", channel: "SMS", status: "Sent" },
  { title: "Follow Up - Diamond Ring", type: "Follow Up", target: "Sadia Akter", schedule: "26 May 2025 11:30 AM", channel: "WhatsApp", status: "Pending" },
  { title: "Birthday Wish", type: "Birthday", target: "Karim Uddin", schedule: "26 May 2025 09:00 AM", channel: "SMS", status: "Sent" },
  { title: "Gold Savings Plan Reminder", type: "Custom", target: "Loyal Customers", schedule: "26 May 2025 02:00 PM", channel: "SMS", status: "Pending" },
  { title: "Anniversary Offer", type: "Anniversary", target: "Couple Segment", schedule: "27 May 2025 10:00 AM", channel: "WhatsApp", status: "Scheduled" },
  { title: "Payment Reminder - June", type: "Payment", target: "Pending Customers", schedule: "27 May 2025 11:00 AM", channel: "SMS", status: "Scheduled" },
  { title: "New Collection Alert", type: "Custom", target: "Diamond Buyers", schedule: "27 May 2025 03:00 PM", channel: "WhatsApp", status: "Scheduled" },
  { title: "Survey Feedback Reminder", type: "Custom", target: "Recent Buyers", schedule: "28 May 2025 10:00 AM", channel: "WhatsApp", status: "Scheduled" },
];

const reminderTabs = ["All Reminders", "Payment Reminders", "Follow Ups", "Birthdays", "Anniversaries", "Custom Reminders"] as const;

function ReminderForm({ onClose, onSave }: { onClose: () => void; onSave: (row: Reminder) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({ title: String(data.get("title")), type: String(data.get("type")) as ReminderType, target: String(data.get("target")), schedule: String(data.get("schedule")).replace("T", " "), channel: String(data.get("channel")) as TemplateChannel, status: "Scheduled" });
  }

  return (
    <Modal description="Schedule an automated customer reminder." onClose={onClose} title="Add Reminder">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Reminder title</span><input name="title" required /></label>
        <label><span>Customer / Target</span><input name="target" required /></label>
        <label><span>Reminder type</span><select name="type"><option>Payment</option><option>Follow Up</option><option>Birthday</option><option>Anniversary</option><option>Custom</option></select></label>
        <label><span>Channel</span><select name="channel"><option>SMS</option><option>WhatsApp</option></select></label>
        <label><span>Schedule time</span><input name="schedule" type="datetime-local" required /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Save size={12} />Add Reminder</Button></footer>
      </form>
    </Modal>
  );
}

export function Reference75Reminders() {
  const [rows, setRows] = useState(initialReminders);
  const [tab, setTab] = useState<(typeof reminderTabs)[number]>("All Reminders");
  const [query, setQuery] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const tabType: ReminderType | null = tab === "Payment Reminders" ? "Payment" : tab === "Follow Ups" ? "Follow Up" : tab === "Birthdays" ? "Birthday" : tab === "Anniversaries" ? "Anniversary" : tab === "Custom Reminders" ? "Custom" : null;
  const visible = rows.filter((row) => `${row.title} ${row.target} ${row.type}`.toLowerCase().includes(query.toLowerCase()) && (!tabType || row.type === tabType) && (!pendingOnly || row.status === "Pending"));

  return (
    <div className={base.page}>
      <Intro description="Manage automated reminders and schedules." title="Reminders" />
      <Metrics rows={reminderMetrics} />
      <Card className={base.tableCard}>
        <Tabs active={tab} onChange={(value) => { setTab(value); setPage(1); }} tabs={reminderTabs} />
        <div className={base.tableToolbar}>
          <SearchBox onChange={setQuery} placeholder="Search reminder..." value={query} />
          <span className={styles.toolbarSpacer} />
          <Button onClick={() => setPendingOnly((value) => !value)}><Filter size={12} />Filters</Button>
          <Button onClick={() => setOpen(true)} primary><Plus size={12} />Add Reminder</Button>
        </div>
        <div className={base.tableScroller}>
          <table className={`${base.dataTable} ${styles.tableWide}`}>
            <thead><tr><th>#</th><th>Reminder Title</th><th>Type</th><th>Customer / Target</th><th>Schedule Time</th><th>Channel</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{visible.map((row, index) => <tr key={`${row.title}-${row.schedule}`}><td>{index + 1}</td><td><b>{row.title}</b></td><td>{row.type}</td><td>{row.target}</td><td>{row.schedule}</td><td>{row.channel}</td><td><Status tone={row.status === "Sent" ? "success" : row.status === "Pending" ? "warning" : "info"}>{row.status}</Status></td><td><span className={styles.actionPair}><button aria-label={`Edit ${row.title}`} className={base.iconButton} onClick={() => setMessage(`Editing ${row.title}.`)}><Pencil size={12} /></button><button aria-label={`View ${row.title}`} className={base.iconButton} onClick={() => setMessage(`${row.title} is scheduled for ${row.schedule}.`)}><Eye size={12} /></button><button aria-label={`Delete ${row.title}`} className={`${base.iconButton} ${base.iconDanger}`} onClick={() => { setRows((items) => items.filter((item) => item !== row)); setMessage(`${row.title} deleted.`); }}><Trash2 size={12} /></button></span></td></tr>)}</tbody>
          </table>
        </div>
        <footer className={base.tableFooter}><span>Showing 1 to {visible.length} of 56 entries</span><Pager current={page} last={7} onChange={setPage} /></footer>
      </Card>
      <section className={styles.bottomThree}>
        <Card className={styles.panel}><h2>Reminders by Type</h2><Donut center="56" label="Total" slices={[{ label: "Payment", value: 28.57, color: "#126fe8", note: "16 (28.57%)" }, { label: "Follow Up", value: 25, color: "#24aa73", note: "14 (25.00%)" }, { label: "Birthday", value: 17.86, color: "#ef9a22", note: "10 (17.86%)" }, { label: "Anniversary", value: 14.29, color: "#f05b45", note: "8 (14.29%)" }, { label: "Custom", value: 14.28, color: "#914bd4", note: "8 (14.29%)" }]} /></Card>
        <Card className={styles.panel}><h2>Reminder Status</h2><div className={styles.barRows}><div><span>Pending</span><i style={{ width: "69%" }} /><b>18</b></div><div><span>Sent</span><i style={{ width: "46%" }} /><b>12</b></div><div><span>Scheduled</span><i style={{ width: "100%" }} /><b>26</b></div></div></Card>
        <Card className={styles.panel}><h2>Upcoming Reminders</h2><ul className={styles.upcomingList}>{[["26 May 2025 02:00 PM", "Gold Savings Plan Reminder"], ["27 May 2025 10:00 AM", "Anniversary Offer"], ["27 May 2025 03:00 PM", "New Collection Alert"], ["28 May 2025 10:00 AM", "Survey Feedback Reminder"]].map(([time, title]) => <li key={title}><time>{time}</time><span>{title}</span></li>)}</ul><Button onClick={() => { setTab("All Reminders"); setMessage("Showing all upcoming reminders."); }}>View All</Button></Card>
      </section>
      <Feedback text={message} />
      {open ? <ReminderForm onClose={() => setOpen(false)} onSave={(row) => { setRows((items) => [row, ...items]); setOpen(false); setMessage(`${row.title} scheduled.`); }} /> : null}
    </div>
  );
}
