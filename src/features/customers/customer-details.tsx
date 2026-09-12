"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Crown,
  Download,
  Eye,
  FilePenLine,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ReceiptText,
  Send,
  Star,
  StickyNote,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatCustomerCurrency,
  getCustomer,
  purchaseTrend,
  recentPurchases,
  type CustomerStatus,
} from "./customer-data";
import styles from "./customer-details.module.css";

const detailTabs = ["Overview", "Purchase History", "Due & Payment", "Loyalty", "Documents"] as const;
type DetailTab = (typeof detailTabs)[number];
type ComposeMode = "sms" | "note" | null;

const tabDescriptions: Record<Exclude<DetailTab, "Overview">, string> = {
  "Purchase History": "All invoices and purchases for this customer will appear here.",
  "Due & Payment": "Track outstanding balances, payment history, and account adjustments.",
  Loyalty: "Review loyalty activity, point earnings, and available rewards.",
  Documents: "Store identity records, receipts, and customer attachments.",
};

export function CustomerDetails({ customerId, profileVariant = false }: { customerId: string; profileVariant?: boolean }) {
  const initialCustomer = getCustomer(customerId);
  const [profile, setProfile] = useState(() => ({
    name: initialCustomer.name,
    phone: initialCustomer.phone,
    email: initialCustomer.email,
    status: initialCustomer.status,
  }));
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
  const [range, setRange] = useState("6");
  const [moreOpen, setMoreOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<ComposeMode>(null);
  const [composeText, setComposeText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState(() => ({ name: profile.name, phone: profile.phone, email: profile.email }));
  const [activityMessage, setActivityMessage] = useState("");

  const visibleTrend = useMemo(() => range === "3" ? purchaseTrend.slice(-3) : purchaseTrend, [range]);
  const chartMaximum = 200_000;

  function openEditDialog() {
    setEditDraft({ name: profile.name, phone: profile.phone, email: profile.email });
    setEditOpen(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile((current) => ({ ...current, ...editDraft }));
    setEditOpen(false);
    setActivityMessage("Customer profile updated successfully.");
  }

  function sendComposerMessage() {
    const action = composeMode === "sms" ? "SMS queued" : "Note added";
    setActivityMessage(`${action}${composeText.trim() ? `: ${composeText.trim()}` : "."}`);
    setComposeMode(null);
    setComposeText("");
  }

  function toggleStatus() {
    const nextStatus: CustomerStatus = profile.status === "Active" ? "Inactive" : "Active";
    setProfile((current) => ({ ...current, status: nextStatus }));
    setMoreOpen(false);
    setActivityMessage(`Customer marked ${nextStatus.toLowerCase()}.`);
  }

  function exportProfile() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ customerId, ...profile }, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${customerId}-profile.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMoreOpen(false);
    setActivityMessage("Customer profile exported.");
  }

  return (
    <div className={styles.page}>
      <div className={styles.detailToolbar}>
        <Link className={styles.backLink} href="/customers">
          <ArrowLeft aria-hidden="true" size={16} />
          Back to List
        </Link>
        <div className={styles.topActions}>
          <button className="button" onClick={openEditDialog} type="button">
            <FilePenLine aria-hidden="true" size={15} />
            Edit Customer
          </button>
          <div className={styles.moreControl}>
            <button aria-expanded={moreOpen} className="button" onClick={() => setMoreOpen((open) => !open)} type="button">
              More
              <ChevronDown aria-hidden="true" size={14} />
            </button>
            {moreOpen ? (
              <div className={styles.moreMenu} role="menu">
                <button onClick={() => {
                  setMoreOpen(false);
                  setActivityMessage("Customer print view prepared.");
                }} role="menuitem" type="button"><ReceiptText size={15} /> Print profile</button>
                <button onClick={exportProfile} role="menuitem" type="button"><Download size={15} /> Export data</button>
                <button onClick={toggleStatus} role="menuitem" type="button"><Check size={15} /> Mark {profile.status === "Active" ? "inactive" : "active"}</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

      <div className={styles.detailGrid}>
        <Card className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <span className={styles.largeAvatar}><UserRound aria-hidden="true" size={50} strokeWidth={1.35} /></span>
            {initialCustomer.group === "VIP" ? <span className={styles.crownBadge} title="VIP customer"><Crown size={14} /></span> : null}
          </div>
          <h1>{profile.name}</h1>
          <p className={styles.customerCode}>{initialCustomer.customerId}</p>
          {profileVariant ? (
            <button className={styles.vipButton} onClick={() => setActivityMessage(`${profile.name} is enrolled in the VIP customer group.`)} type="button">
              <Crown aria-hidden="true" size={14} /> VIP Customer
            </button>
          ) : null}

          <dl className={styles.profileDetails}>
            <div><Phone aria-hidden="true" size={15} /><dt className="sr-only">Phone</dt><dd>{profile.phone}</dd></div>
            {profileVariant ? <div><Phone aria-hidden="true" size={15} /><dt className="sr-only">Secondary phone</dt><dd>01711-233510</dd></div> : null}
            <div><Mail aria-hidden="true" size={15} /><dt className="sr-only">Email</dt><dd>{profile.email}</dd></div>
            <div><MapPin aria-hidden="true" size={15} /><dt className="sr-only">Address</dt><dd>{profileVariant ? "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh" : "Dhanmondi, Dhaka, Bangladesh"}</dd></div>
          </dl>

          <dl className={styles.accountDetails}>
            <div><dt>Member Since</dt><dd>12 Jan 2023</dd></div>
            <div><dt>Customer Group</dt><dd>{initialCustomer.group}</dd></div>
            <div><dt>Status</dt><dd><span className={`${styles.statusBadge} ${profile.status === "Active" ? styles.active : styles.inactive}`}>{profile.status}</span></dd></div>
            <div><dt>Loyalty Points</dt><dd>2,450</dd></div>
          </dl>

          {!profileVariant ? <div className={styles.profileActions}>
            <button className="button button--primary" onClick={() => {
              setComposeMode("sms");
              setComposeText("");
            }} type="button"><MessageSquareText size={15} /> Send SMS</button>
            <button className="button" onClick={() => {
              setComposeMode("note");
              setComposeText("");
            }} type="button"><StickyNote size={15} /> Add Note</button>
          </div> : null}

          {composeMode ? (
            <div className={styles.composer}>
              <div className={styles.composerHeader}>
                <strong>{composeMode === "sms" ? `Message ${profile.name.split(" ")[0]}` : "Add a private note"}</strong>
                <button aria-label="Close composer" onClick={() => setComposeMode(null)} type="button"><X size={15} /></button>
              </div>
              <textarea
                aria-label={composeMode === "sms" ? "SMS message" : "Customer note"}
                className="textarea"
                onChange={(event) => setComposeText(event.target.value)}
                placeholder={composeMode === "sms" ? "Type your message..." : "Write a note..."}
                value={composeText}
              />
              <button className="button button--primary" disabled={!composeText.trim()} onClick={sendComposerMessage} type="button">
                <Send size={14} /> {composeMode === "sms" ? "Send Message" : "Save Note"}
              </button>
            </div>
          ) : null}
        </Card>

        <section className={styles.content}>
          <div aria-label="Customer detail sections" className={styles.tabs} role="tablist">
            {detailTabs.map((tab) => (
              <button
                aria-selected={activeTab === tab}
                className={activeTab === tab ? styles.activeTab : ""}
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" ? (
            <div className={styles.overview}>
              <section aria-label="Customer account summary" className={styles.summaryGrid}>
                <Card className={styles.summaryCard}>
                  <span className={`${styles.summaryIcon} ${styles.goldIcon}`}><CircleDollarSign size={17} /></span>
                  <p>Total Purchase</p>
                  <strong>{formatCustomerCurrency(875_000)}</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <span className={`${styles.summaryIcon} ${styles.blueIcon}`}><ReceiptText size={17} /></span>
                  <p>Total Invoice</p>
                  <strong>12</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <span className={`${styles.summaryIcon} ${styles.redIcon}`}><WalletCards size={17} /></span>
                  <p>Total Due</p>
                  <strong>{formatCustomerCurrency(0)}</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <span className={`${styles.summaryIcon} ${styles.purpleIcon}`}><CalendarDays size={17} /></span>
                  <p>Last Purchase</p>
                  <strong className={styles.dateValue}>20 Apr 2025</strong>
                </Card>
              </section>

              <Card className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2>Purchase Trend</h2>
                    <p>Customer spending over the selected period</p>
                  </div>
                  <select aria-label="Purchase trend date range" className="select" onChange={(event) => setRange(event.target.value)} value={range}>
                    <option value="6">Last 6 Months</option>
                    <option value="3">Last 3 Months</option>
                    <option value="12">This Year</option>
                  </select>
                </div>
                <div aria-label="Bar chart of monthly purchase totals" className={styles.chart} role="img">
                  <div className={styles.yAxis} aria-hidden="true"><span>200K</span><span>150K</span><span>100K</span><span>50K</span><span>0</span></div>
                  <div className={styles.plot}>
                    {visibleTrend.map((item) => (
                      <div className={styles.barColumn} key={item.month} title={`${item.month}: ${formatCustomerCurrency(item.amount)}`}>
                        <div className={styles.barTrack}><span className={styles.bar} style={{ height: `${Math.max(7, item.amount / chartMaximum * 100)}%` }} /></div>
                        <span>{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className={styles.purchasesCard}>
                <div className={styles.cardHeader}>
                  <div><h2>Recent Purchases</h2><p>Latest invoices for this customer</p></div>
                  <button className={styles.viewAll} onClick={() => setActiveTab("Purchase History")} type="button">View All</button>
                </div>
                <div className={styles.tableScroller}>
                  <table className={styles.purchaseTable}>
                    <thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Invoice No</th><th scope="col">Amount</th><th scope="col">Payment Status</th><th scope="col">Action</th></tr></thead>
                    <tbody>
                      {recentPurchases.map((purchase, index) => (
                        <tr key={purchase.id}>
                          <td>{index + 1}</td>
                          <td>{purchase.date}</td>
                          <td><span className={styles.invoiceNo}>{purchase.invoiceNo}</span></td>
                          <td>{formatCustomerCurrency(purchase.amount)}</td>
                          <td><StatusBadge status="Paid" /></td>
                          <td><button aria-label={`View ${purchase.invoiceNo}`} onClick={() => setActivityMessage(`Viewing invoice ${purchase.invoiceNo}.`)} title="View invoice" type="button"><Eye size={15} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <Card className={styles.tabPanel}>
              <span className={styles.tabPanelIcon}>{activeTab === "Loyalty" ? <Star size={24} /> : activeTab === "Documents" ? <StickyNote size={24} /> : <ReceiptText size={24} />}</span>
              <h2>{activeTab}</h2>
              <p>{tabDescriptions[activeTab]}</p>
              <button className="button button--outline-gold" onClick={() => setActivityMessage(`${activeTab} tools opened for ${profile.name}.`)} type="button">Open {activeTab}</button>
            </Card>
          )}
        </section>
      </div>

      {editOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditOpen(false);
        }}>
          <Card aria-labelledby="edit-customer-title" aria-modal="true" as="div" className={styles.modal} role="dialog">
            <div className={styles.modalHeader}>
              <div><h2 id="edit-customer-title">Edit Customer</h2><p>Update the customer’s contact information.</p></div>
              <button aria-label="Close edit dialog" onClick={() => setEditOpen(false)} type="button"><X size={19} /></button>
            </div>
            <form onSubmit={saveProfile}>
              <label><span>Name</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, name: event.target.value }))} required value={editDraft.name} /></label>
              <label><span>Phone</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, phone: event.target.value }))} required value={editDraft.phone} /></label>
              <label><span>Email</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, email: event.target.value }))} required type="email" value={editDraft.email} /></label>
              <div className={styles.modalActions}>
                <button className="button" onClick={() => setEditOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Check size={16} /> Save Changes</button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
