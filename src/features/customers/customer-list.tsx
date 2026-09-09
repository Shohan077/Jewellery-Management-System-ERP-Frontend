"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  customerStats,
  customers,
  formatCustomerCurrency,
  getInitials,
  type Customer,
  type CustomerGroup,
  type CustomerStatus,
} from "./customer-data";
import styles from "./customer-list.module.css";

const PAGE_SIZE = 10;
const groups = ["All Groups", "VIP", "Regular", "Wholesale"] as const;
const statuses = ["All Status", "Active", "Inactive"] as const;
type GroupFilter = (typeof groups)[number];
type StatusFilter = (typeof statuses)[number];

const summaryCards = [
  { label: "Total Customers", value: customerStats.total, icon: Users, tone: "blue" },
  { label: "Active Customers", value: customerStats.active, icon: UserCheck, tone: "green" },
  { label: "VIP Customers", value: customerStats.vip, icon: Crown, tone: "gold" },
  { label: "New This Month", value: customerStats.newThisMonth, icon: UserPlus, tone: "purple" },
] as const;

function getPaginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function CustomerBadge({ customer }: { customer: Customer }) {
  if (customer.customerId === "C-000125") return <span className={`${styles.badge} ${styles.vipBadge}`}>VIP</span>;
  return (
    <span className={`${styles.badge} ${customer.status === "Active" ? styles.activeBadge : styles.inactiveBadge}`}>
      {customer.status}
    </span>
  );
}

export function CustomerList() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("All Groups");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [activityMessage, setActivityMessage] = useState("");
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerGroup, setNewCustomerGroup] = useState<CustomerGroup>("Regular");

  const filteredCustomers = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesGroup = groupFilter === "All Groups" || customer.group === groupFilter;
      const matchesStatus = statusFilter === "All Status" || customer.status === statusFilter;
      const matchesSearch =
        searchTerm.length === 0 ||
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.customerId.toLowerCase().includes(searchTerm) ||
        customer.phone.replaceAll("-", "").includes(searchTerm.replaceAll("-", "")) ||
        customer.email.toLowerCase().includes(searchTerm);
      return matchesGroup && matchesStatus && matchesSearch;
    });
  }, [deferredQuery, groupFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageRows = filteredCustomers.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const firstVisible = filteredCustomers.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safeCurrentPage * PAGE_SIZE, filteredCustomers.length);
  const allPageRowsSelected = pageRows.length > 0 && pageRows.every((customer) => selected.has(customer.id));
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);

  function resetPageState() {
    setCurrentPage(1);
    setSelected(new Set());
  }

  function toggleAllPageRows() {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allPageRowsSelected) {
        for (const customer of pageRows) next.delete(customer.id);
      } else {
        for (const customer of pageRows) next.add(customer.id);
      }
      return next;
    });
  }

  function toggleRow(id: number) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveNewCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActivityMessage(`${newCustomerName} is ready to be added as a ${newCustomerGroup.toLowerCase()} customer.`);
    setNewCustomerOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerGroup("Regular");
  }

  function showAction(action: string, customer: Customer) {
    setActivityMessage(`${action}: ${customer.name} (${customer.customerId}).`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => setNewCustomerOpen(true)} type="button">
            <Plus aria-hidden="true" size={17} />
            New Customer
          </button>
        )}
        description="View and manage all your customers"
        title="Customers"
      />

      <section aria-label="Customer overview" className={styles.summaryGrid}>
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card className={styles.summaryCard} key={item.label}>
              <div className={`${styles.summaryIcon} ${styles[item.tone]}`}><Icon aria-hidden="true" size={17} /></div>
              <div>
                <p>{item.label}</p>
                <strong>{item.value.toLocaleString("en-US")}</strong>
                <span>vs last month</span>
              </div>
            </Card>
          );
        })}
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search customers</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                resetPageState();
              }}
              placeholder="Search by name, phone, ID..."
              type="search"
              value={query}
            />
          </label>
          <select
            aria-label="Filter by customer group"
            className={`select ${styles.filterSelect}`}
            onChange={(event) => {
              setGroupFilter(event.target.value as GroupFilter);
              resetPageState();
            }}
            value={groupFilter}
          >
            {groups.map((group) => <option key={group}>{group}</option>)}
          </select>
          <select
            aria-label="Filter by customer status"
            className={`select ${styles.filterSelect}`}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              resetPageState();
            }}
            value={statusFilter}
          >
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <button
            className={`button ${styles.filterButton}`}
            onClick={() => setActivityMessage(`Filters applied: ${groupFilter}, ${statusFilter}.`)}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell} scope="col">
                  <input aria-label="Select all customers on this page" checked={allPageRowsSelected} onChange={toggleAllPageRows} type="checkbox" />
                </th>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Customer ID</th>
                <th scope="col">Total Purchase</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((customer, index) => (
                <tr key={customer.id}>
                  <td className={styles.checkboxCell}>
                    <input aria-label={`Select ${customer.name}`} checked={selected.has(customer.id)} onChange={() => toggleRow(customer.id)} type="checkbox" />
                  </td>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td>
                    <Link className={styles.customerIdentity} href={`/customers/${customer.customerId}`}>
                      <span className={`${styles.avatar} ${styles[`avatar${customer.id % 5}`]}`}>{getInitials(customer.name)}</span>
                      <strong>{customer.name}</strong>
                    </Link>
                  </td>
                  <td className={styles.numeric}>{customer.phone}</td>
                  <td><span className={styles.customerId}>{customer.customerId}</span></td>
                  <td className={`${styles.numeric} ${styles.amount}`}>{formatCustomerCurrency(customer.totalPurchase)}</td>
                  <td><CustomerBadge customer={customer} /></td>
                  <td>
                    <div className={styles.actions}>
                      <Link aria-label={`View ${customer.name}`} href={`/customers/${customer.customerId}`} title="View customer"><Eye size={15} /></Link>
                      <button aria-label={`Edit ${customer.name}`} onClick={() => showAction("Editing", customer)} title="Edit customer" type="button"><FilePenLine size={15} /></button>
                      <button aria-label={`Create invoice for ${customer.name}`} onClick={() => showAction("New invoice for", customer)} title="Create invoice" type="button"><Plus size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={24} />
                    <strong>No customers found</strong>
                    <span>Try another search, group, or status.</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>
            Showing {firstVisible} to {lastVisible} of {filteredCustomers.length.toLocaleString("en-US")} customers
            {selected.size > 0 ? <span> · {selected.size} selected</span> : null}
          </p>
          <nav aria-label="Customer pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft size={17} /></button>
            {paginationItems.map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button aria-current={safeCurrentPage === item ? "page" : undefined} className={safeCurrentPage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>
            ))}
            <button aria-label="Next page" disabled={safeCurrentPage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button"><ChevronRight size={17} /></button>
          </nav>
        </footer>
      </Card>

      {newCustomerOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setNewCustomerOpen(false);
        }}>
          <Card aria-labelledby="new-customer-title" as="div" className={styles.modal} role="dialog">
            <div className={styles.modalHeader}>
              <div>
                <h2 id="new-customer-title">Add New Customer</h2>
                <p>Create a customer profile for future invoices.</p>
              </div>
              <button aria-label="Close new customer dialog" onClick={() => setNewCustomerOpen(false)} type="button"><X size={19} /></button>
            </div>
            <form onSubmit={saveNewCustomer}>
              <label>
                <span>Customer Name</span>
                <input className="field" onChange={(event) => setNewCustomerName(event.target.value)} placeholder="Enter full name" required value={newCustomerName} />
              </label>
              <label>
                <span>Phone</span>
                <input className="field" onChange={(event) => setNewCustomerPhone(event.target.value)} placeholder="01XXX-XXXXXX" required value={newCustomerPhone} />
              </label>
              <label>
                <span>Customer Group</span>
                <select className="select" onChange={(event) => setNewCustomerGroup(event.target.value as CustomerGroup)} value={newCustomerGroup}>
                  <option>Regular</option>
                  <option>VIP</option>
                  <option>Wholesale</option>
                </select>
              </label>
              <div className={styles.modalActions}>
                <button className="button" onClick={() => setNewCustomerOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Plus size={16} /> Add Customer</button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
