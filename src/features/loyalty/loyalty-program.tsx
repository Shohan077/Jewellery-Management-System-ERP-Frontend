"use client";

import {
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Gift,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  campaigns as initialCampaigns,
  formatNumber,
  initialMembers,
  loyaltyTiers,
  memberStatuses,
  pointHistory,
  rewardSchemes as initialRewardSchemes,
} from "./loyalty-data";
import type {
  LoyaltyCampaign,
  LoyaltyMember,
  LoyaltyTier,
  MemberStatus,
  RewardScheme,
} from "./loyalty-data";
import styles from "./loyalty-program.module.css";

const PAGE_SIZE = 10;
const REDEEMED_POINTS = 123_450;
const tabs = ["Members List", "Point History", "Reward Schemes", "Campaigns"] as const;

type Tab = (typeof tabs)[number];
type MemberDraft = Omit<LoyaltyMember, "id"> & { id?: string };
type MemberDialog =
  | { mode: "add" }
  | { mode: "view" | "edit" | "delete"; member: LoyaltyMember };

const emptyMember: MemberDraft = {
  name: "",
  phone: "",
  tier: "Silver",
  points: 0,
  status: "Active",
};

function nextMemberId(members: LoyaltyMember[]) {
  const largest = members.reduce((maximum, member) => {
    const value = Number(member.id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(maximum, value) : maximum;
  }, 0);
  return `C-${String(largest + 1).padStart(6, "0")}`;
}

function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>
      {status}
    </span>
  );
}

function TierBadge({ tier }: { tier: LoyaltyTier }) {
  return <span className={`${styles.tierBadge} ${styles[`tier${tier}`]}`}>{tier}</span>;
}

function paginationItems(activePage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (activePage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount];
  if (activePage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis-start", activePage - 1, activePage, activePage + 1, "ellipsis-end", pageCount];
}

type MemberFormProps = {
  initialValue?: LoyaltyMember;
  onCancel: () => void;
  onSubmit: (draft: MemberDraft) => void;
};

function MemberForm({ initialValue, onCancel, onSubmit }: MemberFormProps) {
  const [draft, setDraft] = useState<MemberDraft>(initialValue ?? emptyMember);

  function updateDraft<Key extends keyof MemberDraft>(key: Key, value: MemberDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...draft,
      id: draft.id?.trim(),
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      points: Math.max(0, Number(draft.points) || 0),
    });
  }

  return (
    <form className={styles.memberForm} onSubmit={submit}>
      <label className={styles.fullField}>
        <span>Customer name <em>*</em></span>
        <input autoFocus className="field" onChange={(event) => updateDraft("name", event.target.value)} placeholder="Enter customer name" required value={draft.name} />
      </label>
      <label>
        <span>Customer ID</span>
        <input className="field" onChange={(event) => updateDraft("id", event.target.value)} placeholder="Generated automatically" value={draft.id ?? initialValue?.id ?? ""} />
      </label>
      <label>
        <span>Phone <em>*</em></span>
        <input className="field" inputMode="tel" onChange={(event) => updateDraft("phone", event.target.value)} pattern="[0-9+ -]{10,18}" placeholder="01712-345678" required value={draft.phone} />
      </label>
      <label>
        <span>Membership tier</span>
        <select className="select" onChange={(event) => updateDraft("tier", event.target.value as LoyaltyTier)} value={draft.tier}>
          {loyaltyTiers.map((tier) => <option key={tier}>{tier}</option>)}
        </select>
      </label>
      <label>
        <span>Loyalty points</span>
        <input className="field" min={0} onChange={(event) => updateDraft("points", Number(event.target.value))} type="number" value={draft.points} />
      </label>
      <label className={styles.fullField}>
        <span>Status</span>
        <select className="select" onChange={(event) => updateDraft("status", event.target.value as MemberStatus)} value={draft.status}>
          {memberStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit"><Sparkles aria-hidden="true" size={15} /> {initialValue ? "Save Changes" : "Add Member"}</button>
      </div>
    </form>
  );
}

export function LoyaltyProgram() {
  const [members, setMembers] = useState<LoyaltyMember[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<Tab>("Members List");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tierDraft, setTierDraft] = useState<"All Tiers" | LoyaltyTier>("All Tiers");
  const [statusDraft, setStatusDraft] = useState<"All Status" | MemberStatus>("All Status");
  const [tierFilter, setTierFilter] = useState<"All Tiers" | LoyaltyTier>("All Tiers");
  const [statusFilter, setStatusFilter] = useState<"All Status" | MemberStatus>("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<MemberDialog | null>(null);
  const [message, setMessage] = useState("");
  const [rewardSchemes, setRewardSchemes] = useState(initialRewardSchemes);
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const metrics = useMemo(() => ({
    total: members.length,
    active: members.filter((member) => member.status === "Active").length,
    points: members.reduce((total, member) => total + member.points, 0),
  }), [members]);

  const filteredMembers = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch = !search || [member.name, member.id, member.phone].some((value) => value.toLowerCase().includes(search));
      const matchesTier = tierFilter === "All Tiers" || member.tier === tierFilter;
      const matchesStatus = statusFilter === "All Status" || member.status === statusFilter;
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [deferredQuery, members, statusFilter, tierFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const visibleMembers = filteredMembers.slice(startIndex, startIndex + PAGE_SIZE);

  function applyFilters() {
    setTierFilter(tierDraft);
    setStatusFilter(statusDraft);
    setPage(1);
    setMessage(tierDraft === "All Tiers" && statusDraft === "All Status" ? "Membership filters cleared." : "Membership filters applied.");
  }

  function clearFilters() {
    setQuery("");
    setTierDraft("All Tiers");
    setStatusDraft("All Status");
    setTierFilter("All Tiers");
    setStatusFilter("All Status");
    setPage(1);
    setMessage("All membership filters cleared.");
  }

  function addMember(draft: MemberDraft) {
    const preferredId = draft.id && !members.some((member) => member.id.toLowerCase() === draft.id?.toLowerCase()) ? draft.id : undefined;
    const member: LoyaltyMember = { ...draft, id: preferredId || nextMemberId(members) };
    setMembers((current) => [member, ...current]);
    setDialog(null);
    setPage(1);
    setActiveTab("Members List");
    setMessage(`${member.name} was added to the loyalty program.`);
  }

  function updateMember(memberId: string, draft: MemberDraft) {
    setMembers((current) => current.map((member) => member.id === memberId ? { ...member, ...draft, id: memberId } : member));
    setDialog(null);
    setMessage(`${draft.name} was updated successfully.`);
  }

  function deleteMember(member: LoyaltyMember) {
    setMembers((current) => current.filter((item) => item.id !== member.id));
    setDialog(null);
    setMessage(`${member.name} was removed from the loyalty program.`);
  }

  function chooseTab(tab: Tab) {
    setActiveTab(tab);
    setMessage("");
  }

  function toggleReward(scheme: RewardScheme) {
    setRewardSchemes((current) => current.map((item) => item.id === scheme.id ? { ...item, active: !item.active } : item));
    setMessage(`${scheme.title} is now ${scheme.active ? "inactive" : "active"}.`);
  }

  function advanceCampaign(campaign: LoyaltyCampaign) {
    const nextStatus = campaign.status === "Scheduled" ? "Active" : campaign.status === "Active" ? "Completed" : "Scheduled";
    setCampaigns((current) => current.map((item) => item.id === campaign.id ? { ...item, status: nextStatus } : item));
    setMessage(`${campaign.name} moved to ${nextStatus}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className="button button--primary" onClick={() => setDialog({ mode: "add" })} type="button"><Plus aria-hidden="true" size={16} /> Add Member</button>}
        description="Manage customer loyalty points and membership"
        title="Loyalty Program"
      />

      <section aria-label="Loyalty overview" className={styles.metrics}>
        <Card className={styles.metricCard}><span>Total Members</span><div><strong>{formatNumber(metrics.total)}</strong><small className={styles.growth}>↑ 12%</small></div></Card>
        <Card className={styles.metricCard}><span>Active Members</span><div><strong className={styles.greenMetric}>{formatNumber(metrics.active)}</strong><small className={styles.growth}>↑ 8%</small></div></Card>
        <Card className={styles.metricCard}><span>Total Points Issued</span><div><strong>{formatNumber(metrics.points)}</strong></div></Card>
        <Card className={styles.metricCard}><span>Rewards Redeemed</span><div><strong>{formatNumber(REDEEMED_POINTS)}</strong></div></Card>
      </section>

      <Card className={styles.contentCard}>
        <div aria-label="Loyalty sections" className={styles.tabs} role="tablist">
          {tabs.map((tab) => (
            <button aria-controls={`panel-${tab.replaceAll(" ", "-").toLowerCase()}`} aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} id={`tab-${tab.replaceAll(" ", "-").toLowerCase()}`} key={tab} onClick={() => chooseTab(tab)} role="tab" type="button">{tab}</button>
          ))}
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        {activeTab === "Members List" ? (
          <div aria-labelledby="tab-members-list" id="panel-members-list" role="tabpanel">
            <div className={styles.filters}>
              <label className={styles.searchField}>
                <Search aria-hidden="true" size={16} />
                <span className="sr-only">Search loyalty members</span>
                <input onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by name, phone or customer ID..." type="search" value={query} />
              </label>
              <label className={styles.selectField}>
                <span className="sr-only">Filter by membership tier</span>
                <select onChange={(event) => setTierDraft(event.target.value as typeof tierDraft)} value={tierDraft}>
                  <option>All Tiers</option>
                  {loyaltyTiers.map((tier) => <option key={tier}>{tier}</option>)}
                </select>
              </label>
              <label className={styles.selectField}>
                <span className="sr-only">Filter by status</span>
                <select onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}>
                  <option>All Status</option>
                  {memberStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <button className={`button ${styles.filterButton}`} onClick={applyFilters} type="button"><Filter aria-hidden="true" size={15} /> Filter</button>
            </div>

            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <caption className="sr-only">Loyalty program members</caption>
                <thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Customer ID</th><th scope="col">Phone</th><th scope="col">Tier</th><th scope="col">Points</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
                <tbody>
                  {visibleMembers.map((member, index) => (
                    <tr key={member.id}>
                      <td>{startIndex + index + 1}</td>
                      <td><strong>{member.name}</strong></td>
                      <td>{member.id}</td>
                      <td>{member.phone}</td>
                      <td><TierBadge tier={member.tier} /></td>
                      <td>{formatNumber(member.points)}</td>
                      <td><StatusBadge status={member.status} /></td>
                      <td><div className={styles.actions}>
                        <button aria-label={`View ${member.name}`} onClick={() => setDialog({ mode: "view", member })} type="button"><Eye aria-hidden="true" size={13} /></button>
                        <button aria-label={`Edit ${member.name}`} onClick={() => setDialog({ mode: "edit", member })} type="button"><Pencil aria-hidden="true" size={13} /></button>
                        <button aria-label={`Delete ${member.name}`} className={styles.deleteAction} onClick={() => setDialog({ mode: "delete", member })} type="button"><Trash2 aria-hidden="true" size={13} /></button>
                      </div></td>
                    </tr>
                  ))}
                  {!visibleMembers.length ? <tr><td className={styles.emptyState} colSpan={8}><Search aria-hidden="true" size={25} /><strong>No loyalty members found</strong><span>Try another search or clear the selected filters.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
                </tbody>
              </table>
            </div>

            <footer className={styles.footer}>
              <p>Showing {filteredMembers.length ? startIndex + 1 : 0} to {Math.min(startIndex + PAGE_SIZE, filteredMembers.length)} of {formatNumber(filteredMembers.length)} members</p>
              <nav aria-label="Loyalty member pagination" className={styles.pagination}>
                <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
                {paginationItems(activePage, pageCount).map((item) => typeof item === "number" ? (
                  <button aria-current={activePage === item ? "page" : undefined} className={activePage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>
                ) : <span aria-hidden="true" className={styles.ellipsis} key={item}>…</span>)}
                <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
              </nav>
            </footer>
          </div>
        ) : null}

        {activeTab === "Point History" ? (
          <div aria-labelledby="tab-point-history" className={styles.tabPanel} id="panel-point-history" role="tabpanel">
            <div className={styles.panelHeading}><div><h2>Point History</h2><p>Recent points earned and redeemed by members</p></div><span className={styles.panelIcon}><Award aria-hidden="true" size={18} /></span></div>
            <div className={styles.tableScroller}><table className={`${styles.table} ${styles.secondaryTable}`}><caption className="sr-only">Recent loyalty point activity</caption><thead><tr><th scope="col">Date</th><th scope="col">Member</th><th scope="col">Customer ID</th><th scope="col">Activity</th><th scope="col">Type</th><th scope="col">Points</th></tr></thead><tbody>{pointHistory.map((entry) => <tr key={entry.id}><td>{entry.date}</td><td><strong>{entry.member}</strong></td><td>{entry.customerId}</td><td>{entry.activity}</td><td><span className={`${styles.transactionType} ${entry.kind === "Earned" ? styles.earned : styles.redeemed}`}>{entry.kind}</span></td><td className={entry.points > 0 ? styles.positivePoints : styles.negativePoints}>{entry.points > 0 ? "+" : ""}{formatNumber(entry.points)}</td></tr>)}</tbody></table></div>
          </div>
        ) : null}

        {activeTab === "Reward Schemes" ? (
          <div aria-labelledby="tab-reward-schemes" className={styles.tabPanel} id="panel-reward-schemes" role="tabpanel">
            <div className={styles.panelHeading}><div><h2>Reward Schemes</h2><p>Configure rewards available to loyalty members</p></div><span className={styles.panelIcon}><Gift aria-hidden="true" size={18} /></span></div>
            <div className={styles.rewardGrid}>{rewardSchemes.map((scheme) => <article className={styles.rewardCard} key={scheme.id}><div className={styles.rewardTop}><span><Gift aria-hidden="true" size={18} /></span><small className={scheme.active ? styles.livePill : styles.pausedPill}>{scheme.active ? "Active" : "Paused"}</small></div><h3>{scheme.title}</h3><p>{scheme.reward}</p><dl><div><dt>Tier</dt><dd>{scheme.tier}</dd></div><div><dt>Points</dt><dd>{formatNumber(scheme.points)}</dd></div></dl><button className="button" onClick={() => toggleReward(scheme)} type="button">{scheme.active ? "Pause reward" : "Activate reward"}</button></article>)}</div>
          </div>
        ) : null}

        {activeTab === "Campaigns" ? (
          <div aria-labelledby="tab-campaigns" className={styles.tabPanel} id="panel-campaigns" role="tabpanel">
            <div className={styles.panelHeading}><div><h2>Loyalty Campaigns</h2><p>Schedule and monitor member engagement campaigns</p></div><span className={styles.panelIcon}><Megaphone aria-hidden="true" size={18} /></span></div>
            <div className={styles.campaignList}>{campaigns.map((campaign) => <article className={styles.campaignCard} key={campaign.id}><div><small>{campaign.id}</small><h3>{campaign.name}</h3><p>{campaign.audience} · {campaign.period}</p></div><div className={styles.campaignMeta}><strong>{formatNumber(campaign.members)}</strong><span>members</span></div><span className={`${styles.campaignStatus} ${styles[`campaign${campaign.status}`]}`}>{campaign.status}</span><button className="button" onClick={() => advanceCampaign(campaign)} type="button">Change status</button></article>)}</div>
          </div>
        ) : null}
      </Card>

      {dialog ? (
        <div className={styles.modalBackdrop} onKeyDown={(event) => { if (event.key === "Escape") setDialog(null); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section aria-describedby="loyalty-dialog-description" aria-labelledby="loyalty-dialog-title" aria-modal="true" className={styles.modal} role={dialog.mode === "delete" ? "alertdialog" : "dialog"}>
            <header className={styles.modalHeader}>
              <div><h2 id="loyalty-dialog-title">{dialog.mode === "add" ? "Add Member" : dialog.mode === "edit" ? "Edit Member" : dialog.mode === "delete" ? "Remove Member" : "Member Details"}</h2><p id="loyalty-dialog-description">{dialog.mode === "delete" ? "This membership will be removed from the loyalty program." : dialog.mode === "view" ? "Customer membership, tier and available points." : "Enter the customer's loyalty membership details."}</p></div>
              <button autoFocus={dialog.mode === "view"} aria-label="Close loyalty dialog" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            {dialog.mode === "add" ? <MemberForm onCancel={() => setDialog(null)} onSubmit={addMember} /> : dialog.mode === "edit" ? <MemberForm initialValue={dialog.member} key={dialog.member.id} onCancel={() => setDialog(null)} onSubmit={(draft) => updateMember(dialog.member.id, draft)} /> : dialog.mode === "view" ? <div className={styles.memberProfile}><div className={styles.profileIdentity}><span><UserRound aria-hidden="true" size={28} /></span><div><strong>{dialog.member.name}</strong><small>{dialog.member.id}</small></div></div><dl><div><dt>Phone</dt><dd>{dialog.member.phone}</dd></div><div><dt>Tier</dt><dd><TierBadge tier={dialog.member.tier} /></dd></div><div><dt>Points</dt><dd>{formatNumber(dialog.member.points)}</dd></div><div><dt>Status</dt><dd><StatusBadge status={dialog.member.status} /></dd></div></dl><div className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Close</button><button className="button button--primary" onClick={() => setDialog({ mode: "edit", member: dialog.member })} type="button"><Pencil aria-hidden="true" size={14} /> Edit Member</button></div></div> : <div className={styles.deleteDialog}><span><Trash2 aria-hidden="true" size={24} /></span><p>Remove <strong>{dialog.member.name}</strong> from the loyalty program? Their current points will no longer appear in this list.</p><div className={styles.modalActions}><button autoFocus className="button" onClick={() => setDialog(null)} type="button">Cancel</button><button className={`button ${styles.dangerButton}`} onClick={() => deleteMember(dialog.member)} type="button">Remove Member</button></div></div>}
          </section>
        </div>
      ) : null}
    </div>
  );
}
