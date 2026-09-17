"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { activityActions, activityEntries, activityUsers, type ActivityAction, type ActivityEntry } from "./activity-log-data";
import styles from "./activity-log.module.css";

const PAGE_SIZE = 10;
type ActionFilter = "All Actions" | ActivityAction;

function paginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadActivityLog(entries: ActivityEntry[]) {
  const rows = [
    ["Date & Time", "User", "Action", "Module", "Details", "IP Address"],
    ...entries.map((entry) => [entry.dateTime, entry.user, entry.action, entry.module, entry.details, entry.ipAddress]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "system-activity-log.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ActivityLog() {
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-04-30");
  const [user, setUser] = useState("All Users");
  const [action, setAction] = useState<ActionFilter>("All Actions");
  const [appliedFilters, setAppliedFilters] = useState({ startDate, endDate, user, action });
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => activityEntries.filter((entry) => {
    const inRange = entry.isoDate >= appliedFilters.startDate && entry.isoDate <= appliedFilters.endDate;
    const matchesUser = appliedFilters.user === "All Users" || entry.user === appliedFilters.user;
    const matchesAction = appliedFilters.action === "All Actions" || entry.action === appliedFilters.action;
    return inRange && matchesUser && matchesAction;
  }), [appliedFilters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const first = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(safePage * PAGE_SIZE, filtered.length);

  function applyFilters() {
    if (startDate > endDate) {
      setMessage("Start date must be before the end date.");
      return;
    }
    setAppliedFilters({ startDate, endDate, user, action });
    setCurrentPage(1);
    setMessage("Activity filters applied successfully.");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => { downloadActivityLog(filtered); setMessage(`${filtered.length} activity records exported.`); }} type="button">
            <Download aria-hidden="true" size={16} /> Export Log
          </button>
        )}
        description="Track all user activities and system changes"
        title="System Activity Log"
      />

      <Card className={styles.logCard}>
        <div className={styles.toolbar}>
          <div className={styles.dateRange}>
            <CalendarDays aria-hidden="true" size={16} />
            <label><span className="sr-only">Activity start date</span><input max={endDate} onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} /></label>
            <span aria-hidden="true">–</span>
            <label><span className="sr-only">Activity end date</span><input min={startDate} onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} /></label>
          </div>
          <label className={styles.selectField}><span className="sr-only">Filter by user</span><select onChange={(event) => setUser(event.target.value)} value={user}><option>All Users</option>{activityUsers.map((name) => <option key={name}>{name}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by action</span><select onChange={(event) => setAction(event.target.value as ActionFilter)} value={action}><option>All Actions</option>{activityActions.map((name) => <option key={name}>{name}</option>)}</select></label>
          <button className={`button ${styles.filterButton}`} onClick={applyFilters} type="button"><Filter aria-hidden="true" size={15} />Filter</button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">System and user activity history</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Date &amp; Time</th><th scope="col">User</th><th scope="col">Action</th><th scope="col">Module</th><th scope="col">Details</th><th scope="col">IP Address</th></tr></thead>
            <tbody>
              {rows.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{first + index}</td><td>{entry.dateTime}</td><td><strong>{entry.user}</strong></td>
                  <td><span className={`${styles.actionLabel} ${styles[entry.action.toLowerCase()]}`}>{entry.action}</span></td>
                  <td>{entry.module}</td><td>{entry.details}</td><td className={styles.ipAddress}>{entry.ipAddress}</td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td className={styles.emptyState} colSpan={7}><Search aria-hidden="true" size={23} /><strong>No activity found</strong><span>Try a different user, action, or date range.</span></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>Showing {first} to {last} of {filtered.length.toLocaleString("en-US")} activities</p>
          <nav aria-label="Activity log pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? <span aria-hidden="true" key={`ellipsis-${index}`}>…</span> : <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>
    </div>
  );
}
