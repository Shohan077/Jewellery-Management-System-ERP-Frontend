"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CircleDollarSign, Clock3, Eye, FilePenLine, Filter, Plus, Scale, WalletCards, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard, Notice, Pagination, StatusPill } from "@/features/reference-53/shared";
import { RingChart } from "./analytics";
import styles from "./screen.module.css";

type MortgageStatus = "Active" | "Overdue" | "Closed";
type Mortgage = {
  id: string;
  customer: string;
  goldWeight: string;
  loanAmount: string;
  interest: string;
  issueDate: string;
  dueDate: string;
  status: MortgageStatus;
};

const initialMortgages: Mortgage[] = [
  { id: "MOR-1001", customer: "Rahim Uddin", goldWeight: "12.250 gm", loanAmount: "৳ 1,20,000", interest: "2.00%", issueDate: "01 May 2025", dueDate: "01 Jun 2025", status: "Active" },
  { id: "MOR-1002", customer: "Farhana Islam", goldWeight: "8.500 gm", loanAmount: "৳ 80,000", interest: "2.00%", issueDate: "03 May 2025", dueDate: "03 Jun 2025", status: "Active" },
  { id: "MOR-1003", customer: "Dipak Saha", goldWeight: "15.300 gm", loanAmount: "৳ 1,50,000", interest: "2.00%", issueDate: "05 May 2025", dueDate: "05 Jun 2025", status: "Active" },
  { id: "MOR-1004", customer: "Mst. Jannat", goldWeight: "10.120 gm", loanAmount: "৳ 90,000", interest: "2.00%", issueDate: "06 May 2025", dueDate: "06 Jun 2025", status: "Overdue" },
  { id: "MOR-1005", customer: "Abul Hasan", goldWeight: "7.750 gm", loanAmount: "৳ 70,000", interest: "2.00%", issueDate: "07 May 2025", dueDate: "07 Jun 2025", status: "Active" },
  { id: "MOR-1006", customer: "Sathi Akter", goldWeight: "9.800 gm", loanAmount: "৳ 95,000", interest: "2.00%", issueDate: "10 May 2025", dueDate: "10 Jun 2025", status: "Active" },
  { id: "MOR-1007", customer: "Mehedi Hasan", goldWeight: "13.250 gm", loanAmount: "৳ 1,25,000", interest: "2.00%", issueDate: "11 May 2025", dueDate: "11 Jun 2025", status: "Active" },
];

type DialogState = { mode: "add" | "edit" | "view"; row?: Mortgage } | null;

function MortgageDialog({ state, onClose, onSave }: { state: NonNullable<DialogState>; onClose: () => void; onSave: (row: Mortgage) => void }) {
  const readOnly = state.mode === "view";
  const [customer, setCustomer] = useState(state.row?.customer ?? "");
  const [goldWeight, setGoldWeight] = useState(state.row?.goldWeight ?? "");
  const [loanAmount, setLoanAmount] = useState(state.row?.loanAmount ?? "");
  const [status, setStatus] = useState<MortgageStatus>(state.row?.status ?? "Active");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: state.row?.id ?? "",
      customer,
      goldWeight: goldWeight.includes("gm") ? goldWeight : `${goldWeight} gm`,
      loanAmount: loanAmount.startsWith("৳") ? loanAmount : `৳ ${loanAmount}`,
      interest: state.row?.interest ?? "2.00%",
      issueDate: state.row?.issueDate ?? "31 May 2025",
      dueDate: state.row?.dueDate ?? "30 Jun 2025",
      status,
    });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-modal="true" as="section" className={styles.dialog} role="dialog">
        <header className={styles.dialogHeader}>
          <div><h2>{state.mode === "add" ? "Add Mortgage" : state.mode === "edit" ? "Edit Mortgage" : "Mortgage Details"}</h2><p>{state.row?.id ?? "Create a new pawn record"}</p></div>
          <button aria-label="Close" className={styles.closeButton} onClick={onClose} type="button"><X size={17} /></button>
        </header>
        <form className={styles.dialogForm} onSubmit={submit}>
          <label><span>Customer</span><input className="field" disabled={readOnly} onChange={(event) => setCustomer(event.target.value)} required value={customer} /></label>
          <label><span>Gold Weight</span><input className="field" disabled={readOnly} onChange={(event) => setGoldWeight(event.target.value)} placeholder="12.250 gm" required value={goldWeight} /></label>
          <label><span>Loan Amount</span><input className="field" disabled={readOnly} onChange={(event) => setLoanAmount(event.target.value)} placeholder="1,20,000" required value={loanAmount} /></label>
          <label><span>Status</span><select className="select" disabled={readOnly} onChange={(event) => setStatus(event.target.value as MortgageStatus)} value={status}><option>Active</option><option>Overdue</option><option>Closed</option></select></label>
          <footer className={styles.dialogActions}><button className={styles.secondaryButton} onClick={onClose} type="button">{readOnly ? "Close" : "Cancel"}</button>{readOnly ? null : <button className={styles.primaryButton} type="submit">Save Mortgage</button>}</footer>
        </form>
      </Card>
    </div>
  );
}

export function Reference54MortgagePawn() {
  const [rows, setRows] = useState(initialMortgages);
  const [status, setStatus] = useState("All Status");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => rows.filter((row) => status === "All Status" || row.status === status), [rows, status]);

  function save(row: Mortgage) {
    setRows((current) => dialog?.mode === "add"
      ? [...current, { ...row, id: `MOR-${1001 + current.length}` }]
      : current.map((item) => item.id === row.id ? row : item));
    setMessage(`${row.customer}'s mortgage was saved.`);
    setDialog(null);
  }

  return (
    <div className={styles.page}>
      <section className={styles.metrics5}>
        <MetricCard accent="blue" icon={<WalletCards size={17} />} label="Total Mortgage" note="" value="48" />
        <MetricCard accent="green" icon={<CircleDollarSign size={17} />} label="Active Mortgage" note="" value="38" />
        <MetricCard accent="orange" icon={<Scale size={17} />} label="Total Loan Amount" note="" value="৳ 28,75,000" />
        <MetricCard accent="blue" icon={<CircleDollarSign size={17} />} label="Total Interest" note="" value="৳ 3,25,400" />
        <div className={styles.dangerMetric}><MetricCard accent="orange" icon={<Clock3 size={17} />} label="Overdue Amount" note="" value="৳ 2,15,000" /></div>
      </section>

      <Card className={styles.tableCard}>
        <header className={styles.cardHeader}>
          <h2>Mortgage List</h2>
          <div className={styles.headerControls}>
            <select aria-label="Mortgage status" className={styles.control} onChange={(event) => setStatus(event.target.value)} value={status}><option>All Status</option><option>Active</option><option>Overdue</option><option>Closed</option></select>
            <input aria-label="Mortgage date range" className={`${styles.control} ${styles.dateControl}`} readOnly value="01/05/2025 - 31/05/2025" />
            <button className={styles.filterButton} onClick={() => setMessage(`${filtered.length} mortgage records found.`)} type="button"><Filter size={12} />Filter</button>
            <button className={styles.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={13} />Add Mortgage</button>
          </div>
        </header>
        {message ? <div className={styles.noticeWrap}><Notice>{message}</Notice></div> : null}
        <div className={styles.tableScroller}>
          <table className={`${styles.dataTable} ${styles.mortgageTable}`}>
            <caption className="sr-only">Mortgage list</caption>
            <thead><tr><th>#</th><th>Mortgage ID</th><th>Customer</th><th>Gold Weight</th><th>Loan Amount</th><th>Interest %</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{filtered.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td><strong>{row.id}</strong></td><td>{row.customer}</td><td>{row.goldWeight}</td><td>{row.loanAmount}</td><td>{row.interest}</td><td>{row.issueDate}</td><td>{row.dueDate}</td><td><StatusPill tone={row.status === "Active" ? "success" : row.status === "Overdue" ? "danger" : "info"}>{row.status}</StatusPill></td><td><div className={styles.actions}><button aria-label={`View ${row.id}`} onClick={() => setDialog({ mode: "view", row })} type="button"><Eye size={13} /></button><button aria-label={`Edit ${row.id}`} onClick={() => setDialog({ mode: "edit", row })} type="button"><FilePenLine size={13} /></button></div></td></tr>)}</tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><span>Showing 1 to {filtered.length} of 38 entries</span><Pagination current={page} onChange={setPage} /></footer>
      </Card>

      <section className={styles.bottomGrid3}>
        <Card className={styles.sectionCard}><h2>Loan &amp; Interest Summary</h2><div className={styles.summaryList}><div className={styles.summaryRow}><span className={styles.summaryIcon}><WalletCards size={14} /></span><span>Total Loan Amount</span><strong>৳ 28,75,000</strong></div><div className={styles.summaryRow}><span className={styles.summaryIcon}><CircleDollarSign size={14} /></span><span>Total Interest</span><strong>৳ 3,25,400</strong></div><div className={styles.summaryRow}><span className={styles.summaryIcon}><Scale size={14} /></span><span>Total Payable</span><strong>৳ 32,00,400</strong></div><div className={styles.summaryRow}><span className={styles.summaryIcon}><Clock3 size={14} /></span><span>Overdue Amount</span><strong>৳ 2,15,000</strong></div></div></Card>
        <Card className={styles.sectionCard}><h2>Mortgage Status</h2><RingChart centerLabel="Active" centerValue="38" segments={[{ label: "Active", value: 79, color: "#1769df", detail: "38 (79%)" }, { label: "Closed", value: 13, color: "#92a9df", detail: "6 (13%)" }, { label: "Overdue", value: 8, color: "#df9da5", detail: "4 (8%)" }]} /></Card>
        <Card className={styles.sectionCard}><h2>Recent Mortgage Payments</h2><div className={styles.tableScroller}><table className={styles.recentTable}><thead><tr><th>Mortgage ID</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead><tbody><tr><td>MOR-1002</td><td>Farhana Islam</td><td>৳ 20,000</td><td>29 May 2025</td></tr><tr><td>MOR-1003</td><td>Dipak Saha</td><td>৳ 25,000</td><td>28 May 2025</td></tr><tr><td>MOR-1001</td><td>Rahim Uddin</td><td>৳ 15,000</td><td>27 May 2025</td></tr><tr><td>MOR-1006</td><td>Sathi Akter</td><td>৳ 18,000</td><td>26 May 2025</td></tr></tbody></table></div></Card>
      </section>
      {dialog ? <MortgageDialog onClose={() => setDialog(null)} onSave={save} state={dialog} /> : null}
    </div>
  );
}
