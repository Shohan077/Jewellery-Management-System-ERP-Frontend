"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Mail,
  Megaphone,
  MessageSquareText,
  Pencil,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
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
  SearchBox,
  Status,
  Tabs,
  exportCsv,
} from "../reference-73/shared";
import styles from "./reference-75.module.css";

const metrics: Metric[] = [
  { label: "Total Customers", value: "1,248", note: "All Customers" },
  { label: "Active Customers", value: "948", trend: "75.96%", note: "" },
  { label: "Loyal Customers", value: "412", trend: "32.05%", note: "" },
  { label: "Campaigns This Month", value: "8", note: "Total Campaigns" },
  { label: "Conversion Rate", value: "18.62%", note: "This Month" },
];

const tabs = [
  "Customer Segments",
  "Campaigns",
  "Recent Activities",
  "Communications",
  "Loyalty Overview",
] as const;

type CampaignStatus = "Active" | "Completed" | "Scheduled";
type Campaign = {
  name: string;
  type: "SMS" | "WhatsApp" | "Email";
  audience: string;
  sent: string;
  responded: string;
  ctr: string;
  status: CampaignStatus;
  startDate: string;
};

const initialCampaigns: Campaign[] = [
  { name: "Akshaya Tritiya Offer", type: "SMS", audience: "All Customers", sent: "3,245", responded: "625", ctr: "19.26%", status: "Completed", startDate: "25 May 2025" },
  { name: "Wedding Season Offer", type: "WhatsApp", audience: "Loyal Customers", sent: "2,150", responded: "512", ctr: "23.81%", status: "Active", startDate: "20 May 2025" },
  { name: "Diamond Festival", type: "Email", audience: "Diamond Buyers", sent: "1,280", responded: "312", ctr: "24.38%", status: "Active", startDate: "05 May 2025" },
  { name: "Gold Savings Plan", type: "SMS", audience: "New Customers", sent: "2,090", responded: "423", ctr: "14.64%", status: "Active", startDate: "18 May 2025" },
  { name: "Diwali Dhamaka", type: "WhatsApp", audience: "All Customers", sent: "2,450", responded: "438", ctr: "17.88%", status: "Scheduled", startDate: "01 Jun 2025" },
  { name: "Silver Collection", type: "Email", audience: "Silver Buyers", sent: "1,150", responded: "198", ctr: "17.22%", status: "Completed", startDate: "10 May 2025" },
  { name: "Loyalty Bonus", type: "SMS", audience: "Loyal Customers", sent: "1,285", responded: "214", ctr: "16.67%", status: "Active", startDate: "22 May 2025" },
];

function CampaignForm({ onClose, onSave }: { onClose: () => void; onSave: (campaign: Campaign) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      name: String(data.get("name")),
      type: String(data.get("type")) as Campaign["type"],
      audience: String(data.get("audience")),
      sent: "0",
      responded: "0",
      ctr: "0.00%",
      status: "Scheduled",
      startDate: String(data.get("startDate")),
    });
  }

  return (
    <Modal description="Set the audience, channel and schedule for a customer campaign." onClose={onClose} title="New Campaign">
      <form className={base.modalForm} onSubmit={submit}>
        <label><span>Campaign name</span><input name="name" placeholder="Campaign name" required /></label>
        <label><span>Campaign type</span><select name="type"><option>SMS</option><option>WhatsApp</option><option>Email</option></select></label>
        <label><span>Audience</span><select name="audience"><option>All Customers</option><option>Loyal Customers</option><option>New Customers</option><option>Diamond Buyers</option><option>Silver Buyers</option></select></label>
        <label><span>Start date</span><input defaultValue="26 May 2025" name="startDate" required /></label>
        <footer><Button onClick={onClose}>Cancel</Button><Button primary type="submit"><Send size={12} />Create Campaign</Button></footer>
      </form>
    </Modal>
  );
}

function CustomerGrowthChart() {
  const values = [250, 340, 420, 390, 510, 580, 560, 640, 590, 680, 760, 710, 820, 900];
  const points = values.map((value, index) => `${28 + index * 24},${126 - value / 9}`).join(" ");
  const dates = ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"];
  return (
    <div className={styles.chart}>
      <svg aria-label="Customer growth from 1 May to 26 May" role="img" viewBox="0 0 355 145">
        {[200, 400, 600, 800, 1000].map((value) => (
          <g key={value}><line x1="28" x2="340" y1={126 - value / 9} y2={126 - value / 9} /><text x="2" y={129 - value / 9}>{value === 1000 ? "1K" : value}</text></g>
        ))}
        <polyline className={styles.lineBlue} points={points} />
        {values.map((value, index) => <circle cx={28 + index * 24} cy={126 - value / 9} key={`${value}-${index}`} r="2.3" />)}
        {dates.map((date, index) => <text key={date} textAnchor="middle" x={28 + index * 62} y="141">{date}</text>)}
      </svg>
    </div>
  );
}

export function Reference75CrmCampaigns() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Campaigns");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const visible = campaigns.filter((campaign) =>
    `${campaign.name} ${campaign.type} ${campaign.audience}`.toLowerCase().includes(query.toLowerCase())
    && (!activeOnly || campaign.status === "Active"),
  );

  const exportCampaigns = () => {
    exportCsv(
      "crm-campaigns.csv",
      ["Campaign Name", "Type", "Audience", "Sent", "Responded", "CTR", "Status", "Start Date"],
      visible.map((campaign) => [campaign.name, campaign.type, campaign.audience, campaign.sent, campaign.responded, campaign.ctr, campaign.status, campaign.startDate]),
    );
    setMessage("Campaign report exported.");
  };

  return (
    <div className={base.page}>
      <Intro
        description="Manage customers, campaigns and marketing activities."
        title="CRM & Marketing"
      />
      <Metrics rows={metrics} />

      <Card className={base.tableCard}>
        <Tabs active={activeTab} onChange={setActiveTab} tabs={tabs} />
        {activeTab === "Campaigns" ? (
          <>
            <section className={styles.summaryGrid}>
              <Card className={styles.summaryCard}><span><Megaphone size={12} /> Total Campaigns</span><strong>24</strong><small>All Campaigns</small></Card>
              <Card className={styles.summaryCard}><span><MessageSquareText size={12} /> Active Campaigns</span><strong>6</strong><small>Ongoing</small></Card>
              <Card className={styles.summaryCard}><span><CheckCircle2 size={12} /> Completed Campaigns</span><strong>16</strong><small>Completed</small></Card>
              <Card className={styles.summaryCard}><span><Send size={12} /> Total Sent</span><strong>12,450</strong><small>Messages / Emails</small></Card>
              <Card className={styles.summaryCard}><span><Mail size={12} /> Total Responses</span><strong>2,310</strong><small><b>18.56%</b> Response</small></Card>
            </section>

            <div className={base.tableToolbar}>
              <SearchBox onChange={setQuery} placeholder="Search campaign by name..." value={query} />
              <span className={styles.toolbarSpacer} />
              <Button onClick={() => setActiveOnly((value) => !value)}><Filter size={12} />{activeOnly ? "Active Only" : "Filters"}</Button>
              <Button onClick={exportCampaigns}><Download size={12} />Export</Button>
              <Button onClick={() => setModalOpen(true)} primary><Plus size={12} />New Campaign</Button>
            </div>
            <div className={base.tableScroller}>
              <table className={`${base.dataTable} ${styles.tableWide}`}>
                <thead><tr><th>#</th><th>Campaign Name</th><th>Type</th><th>Audience</th><th>Sent</th><th>Responded</th><th>CTR</th><th>Status</th><th>Start Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {visible.map((campaign, index) => (
                    <tr key={campaign.name}>
                      <td>{index + 1}</td><td><b>{campaign.name}</b></td><td>{campaign.type}</td><td>{campaign.audience}</td><td>{campaign.sent}</td><td>{campaign.responded}</td><td>{campaign.ctr}</td>
                      <td><Status tone={campaign.status === "Scheduled" ? "warning" : campaign.status === "Active" ? "info" : "success"}>{campaign.status}</Status></td>
                      <td>{campaign.startDate}</td>
                      <td><span className={base.rowActions}><button aria-label={`View ${campaign.name}`} className={base.iconButton} onClick={() => setMessage(`${campaign.name}: ${campaign.responded} customer responses.`)}><Eye size={12} /></button><button aria-label={`Edit ${campaign.name}`} className={base.iconButton} onClick={() => setMessage(`${campaign.name} is ready to edit.`)}><Pencil size={12} /></button><button aria-label={`Delete ${campaign.name}`} className={`${base.iconButton} ${base.iconDanger}`} onClick={() => { setCampaigns((rows) => rows.filter((row) => row.name !== campaign.name)); setMessage(`${campaign.name} removed.`); }}><Trash2 size={12} /></button></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <section className={styles.placeholder}><strong>{activeTab}</strong><span>Select Campaigns to return to the campaign workspace.</span><Button onClick={() => setActiveTab("Campaigns")}>View Campaigns</Button></section>
        )}
      </Card>

      <section className={styles.bottomThree}>
        <Card className={styles.panel}>
          <h2>Campaign Performance (This Month)</h2>
          <Donut center="18.62%" label="Conversion Rate" slices={[
            { label: "Sent", value: 36, color: "#176fe6", note: "12,450 (100%)" },
            { label: "Delivered", value: 30, color: "#20a76b", note: "10,240 (82.21%)" },
            { label: "Opened", value: 15, color: "#ef9c20", note: "5,210 (41.85%)" },
            { label: "Clicked", value: 10, color: "#ef5449", note: "2,310 (18.56%)" },
            { label: "Converted", value: 9, color: "#9250cf", note: "1,160 (9.31%)" },
          ]} />
        </Card>
        <Card className={styles.panel}>
          <h2>Top Performing Campaigns</h2>
          <ol className={styles.ranking}>
            {[
              ["Wedding Season Offer", "23.81%"],
              ["Diamond Festival", "24.38%"],
              ["Akshaya Tritiya Offer", "19.22%"],
              ["Gold Savings Plan", "14.64%"],
              ["Loyalty Bonus", "16.67%"],
            ].map(([name, value]) => <li key={name}><span>{name}</span><b>{value}</b></li>)}
          </ol>
        </Card>
        <Card className={styles.panel}>
          <header><h2>Customer Growth</h2><span>This Month⌄</span></header>
          <CustomerGrowthChart />
        </Card>
      </section>

      <Feedback text={message} />
      {modalOpen ? (
        <CampaignForm
          onClose={() => setModalOpen(false)}
          onSave={(campaign) => {
            setCampaigns((rows) => [campaign, ...rows]);
            setModalOpen(false);
            setMessage(`${campaign.name} scheduled.`);
          }}
        />
      ) : null}
    </div>
  );
}
