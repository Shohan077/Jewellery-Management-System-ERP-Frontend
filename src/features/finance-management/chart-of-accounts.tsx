"use client";

import {
  Archive,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  accountStatuses,
  accountTypes,
  initialAccounts,
  nextAccountCode,
  type AccountStatus,
  type AccountType,
  type FinanceAccount,
} from "./finance-data";
import { FinanceFeedback, FinanceModal, FinancePageHeader, MetricCard } from "./finance-ui";
import styles from "./finance-management.module.css";

const PAGE_SIZE = 8;

type AccountDraft = Omit<FinanceAccount, "id">;
type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit"; account: FinanceAccount };

function AccountForm({ account, suggestedCode, onCancel, onSave }: {
  account?: FinanceAccount;
  suggestedCode: string;
  onCancel: () => void;
  onSave: (draft: AccountDraft) => void;
}) {
  const [draft, setDraft] = useState<AccountDraft>(account ?? {
    code: suggestedCode,
    name: "",
    type: "Assets",
    parent: "-",
    status: "Active",
  });

  function update<Key extends keyof AccountDraft>(key: Key, value: AccountDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ ...draft, code: draft.code.trim(), name: draft.name.trim(), parent: draft.parent.trim() || "-" });
  }

  return (
    <form className={styles.accountForm} onSubmit={submit}>
      <label><span>Account Code <b>*</b></span><input autoFocus className="field" onChange={(event) => update("code", event.target.value)} required value={draft.code} /></label>
      <label><span>Account Name <b>*</b></span><input className="field" onChange={(event) => update("name", event.target.value)} placeholder="Enter account name" required value={draft.name} /></label>
      <label><span>Account Type</span><select className="select" onChange={(event) => update("type", event.target.value as AccountType)} value={draft.type}>{accountTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label><span>Parent Account</span><input className="field" onChange={(event) => update("parent", event.target.value)} value={draft.parent} /></label>
      <label className={styles.formWide}><span>Status</span><select className="select" onChange={(event) => update("status", event.target.value as AccountStatus)} value={draft.status}>{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <footer className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">{account ? "Save Changes" : "Add Account"}</button>
      </footer>
    </form>
  );
}

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchDraft, setSearchDraft] = useState("");
  const [typeDraft, setTypeDraft] = useState<"All" | AccountType>("All");
  const [statusDraft, setStatusDraft] = useState<"All" | AccountStatus>("All");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | AccountType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => ({
    Assets: accounts.filter((account) => account.type === "Assets").length,
    Liabilities: accounts.filter((account) => account.type === "Liabilities").length,
    Income: accounts.filter((account) => account.type === "Income").length,
    Expenses: accounts.filter((account) => account.type === "Expenses").length,
  }), [accounts]);

  const filteredAccounts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch = !search || [account.code, account.name, account.parent].some((value) => value.toLowerCase().includes(search));
      return matchesSearch && (typeFilter === "All" || account.type === typeFilter) && (statusFilter === "All" || account.status === statusFilter);
    });
  }, [accounts, query, statusFilter, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const visibleAccounts = filteredAccounts.slice(startIndex, startIndex + PAGE_SIZE);

  function applyFilters(event?: FormEvent) {
    event?.preventDefault();
    setQuery(searchDraft);
    setTypeFilter(typeDraft);
    setStatusFilter(statusDraft);
    setPage(1);
    setMessage("Account filters applied.");
  }

  function resetFilters() {
    setSearchDraft("");
    setTypeDraft("All");
    setStatusDraft("All");
    setQuery("");
    setTypeFilter("All");
    setStatusFilter("All");
    setPage(1);
    setMessage("Account filters reset.");
  }

  function saveAccount(draft: AccountDraft) {
    if (dialog?.mode === "edit") {
      setAccounts((current) => current.map((account) => account.id === dialog.account.id ? { ...account, ...draft } : account));
      setMessage(`${draft.name} was updated.`);
    } else {
      const account: FinanceAccount = { ...draft, id: `account-${crypto.randomUUID()}` };
      setAccounts((current) => [...current, account]);
      setMessage(`${account.name} was added to the chart of accounts.`);
    }
    setDialog(null);
  }

  function toggleStatus(account: FinanceAccount) {
    const status: AccountStatus = account.status === "Active" ? "Inactive" : "Active";
    setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, status } : item));
    setOpenMenu(null);
    setMessage(`${account.name} is now ${status.toLowerCase()}.`);
  }

  function removeAccount(account: FinanceAccount) {
    setAccounts((current) => current.filter((item) => item.id !== account.id));
    setOpenMenu(null);
    setMessage(`${account.name} was removed.`);
  }

  const paginationItems = pageCount <= 7
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : activePage <= 4
      ? [1, 2, 3, 4, 5, "ellipsis", pageCount]
      : activePage >= pageCount - 3
        ? [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
        : [1, "ellipsis", activePage - 1, activePage, activePage + 1, "ellipsis-2", pageCount];

  return (
    <div className={styles.page}>
      <FinancePageHeader
        action={<button className={styles.blueButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus aria-hidden="true" size={15} />Add Account</button>}
        current="Chart of Accounts"
        title="Chart of Accounts"
      />

      <section aria-label="Account summary" className={styles.metricsFive}>
        <MetricCard icon={<Archive size={20} />} label="Total Accounts" tone="indigo" value={accounts.length} />
        <MetricCard icon={<WalletCards size={20} />} label="Assets" tone="green" value={totals.Assets} />
        <MetricCard icon={<Banknote size={20} />} label="Liabilities" tone="rose" value={totals.Liabilities} />
        <MetricCard icon={<CircleDollarSign size={20} />} label="Income" tone="blue" value={totals.Income} />
        <MetricCard icon={<Banknote size={20} />} label="Expenses" tone="amber" value={totals.Expenses} />
      </section>

      <Card className={styles.accountCard}>
        <form className={styles.accountFilters} onSubmit={applyFilters}>
          <label className={styles.searchControl}>
            <Search aria-hidden="true" size={15} />
            <span className="sr-only">Search by account name or code</span>
            <input onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search by account name or code..." value={searchDraft} />
          </label>
          <label className={styles.filterField}><span>Account Type</span><select onChange={(event) => setTypeDraft(event.target.value as typeof typeDraft)} value={typeDraft}><option>All</option>{accountTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className={styles.filterField}><span>Status</span><select onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)} value={statusDraft}><option>All</option>{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <button className={styles.blueButton} type="submit"><Search aria-hidden="true" size={14} />Search</button>
          <button className={styles.mutedButton} onClick={resetFilters} type="button"><RefreshCcw aria-hidden="true" size={14} />Reset</button>
        </form>
        <FinanceFeedback>{message}</FinanceFeedback>

        <div className={styles.tableScroller}>
          <table className={styles.accountsTable}>
            <caption className="sr-only">Chart of accounts</caption>
            <thead><tr><th>SL</th><th>Account Code</th><th>Account Name</th><th>Account Type</th><th>Parent Account</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visibleAccounts.map((account, index) => (
                <tr key={account.id}>
                  <td>{startIndex + index + 1}</td><td>{account.code}</td><td>{account.name}</td><td>{account.type}</td><td>{account.parent}</td>
                  <td><span className={`${styles.statusBadge} ${account.status === "Active" ? styles.statusActive : styles.statusInactive}`}>{account.status}</span></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.viewButton} onClick={() => setDialog({ mode: "view", account })} type="button"><Eye aria-hidden="true" size={12} />View</button>
                      <span className={styles.menuWrap}>
                        <button aria-expanded={openMenu === account.id} aria-label={`More actions for ${account.name}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === account.id ? null : account.id)} type="button"><MoreVertical aria-hidden="true" size={14} /></button>
                        {openMenu === account.id ? <span className={styles.rowMenu}><button onClick={() => { setDialog({ mode: "edit", account }); setOpenMenu(null); }} type="button">Edit account</button><button onClick={() => toggleStatus(account)} type="button">Mark {account.status === "Active" ? "inactive" : "active"}</button><button className={styles.menuDanger} onClick={() => removeAccount(account)} type="button">Delete</button></span> : null}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleAccounts.length ? <tr><td className={styles.emptyCell} colSpan={7}>No accounts match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}>
          <p>Showing {filteredAccounts.length ? startIndex + 1 : 0} to {Math.min(startIndex + PAGE_SIZE, filteredAccounts.length)} of {filteredAccounts.length} entries</p>
          <nav aria-label="Account pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={13} /></button>
            {paginationItems.map((item) => typeof item === "number" ? <button aria-current={item === activePage ? "page" : undefined} key={item} onClick={() => setPage(item)} type="button">{item}</button> : <span aria-hidden="true" key={item}>…</span>)}
            <button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight size={13} /></button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <FinanceModal
          description={dialog.mode === "view" ? "Account classification and hierarchy details." : "Enter the account classification and status."}
          onClose={() => setDialog(null)}
          title={dialog.mode === "add" ? "Add Account" : dialog.mode === "edit" ? "Edit Account" : "Account Details"}
        >
          {dialog.mode === "view" ? (
            <div className={styles.accountDetails}>
              <dl><div><dt>Account Code</dt><dd>{dialog.account.code}</dd></div><div><dt>Account Name</dt><dd>{dialog.account.name}</dd></div><div><dt>Account Type</dt><dd>{dialog.account.type}</dd></div><div><dt>Parent Account</dt><dd>{dialog.account.parent}</dd></div><div><dt>Status</dt><dd><span className={`${styles.statusBadge} ${dialog.account.status === "Active" ? styles.statusActive : styles.statusInactive}`}>{dialog.account.status}</span></dd></div></dl>
              <footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Close</button><button className="button button--primary" onClick={() => setDialog({ mode: "edit", account: dialog.account })} type="button">Edit Account</button></footer>
            </div>
          ) : <AccountForm account={dialog.mode === "edit" ? dialog.account : undefined} onCancel={() => setDialog(null)} onSave={saveAccount} suggestedCode={nextAccountCode(accounts)} />}
        </FinanceModal>
      ) : null}
    </div>
  );
}
