"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Eye, FilePenLine, Filter, Landmark, Plus, ReceiptText, RotateCcw, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { initialCashTransactions, type CashTransaction } from "./data";
import { DataTable, Feedback, IconAction, Modal, StatCard, StatusBadge, type TableColumn } from "./shared";
import styles from "./reference-55.module.css";

type CashDialog = { mode: "add" | "edit" | "view"; row?: CashTransaction } | null;

function CashEntryDialog({ dialog, onClose, onSave }: { dialog: NonNullable<CashDialog>; onClose: () => void; onSave: (row: CashTransaction) => void }) {
  const row = dialog.row;
  const readOnly = dialog.mode === "view";

  if (readOnly && row) {
    return (
      <Modal description={row.voucher} onClose={onClose} title="Cash transaction details">
        <div className={styles.viewDetails}>
          <p><span>Date</span><strong>{row.date}</strong></p><p><span>Particulars</span><strong>{row.particulars}</strong></p>
          <p><span>Type</span><strong>{row.type}</strong></p><p><span>Payment Mode</span><strong>{row.paymentMode}</strong></p>
          <p><span>Receipt</span><strong>{row.receipt}</strong></p><p><span>Payment</span><strong>{row.payment}</strong></p>
        </div>
      </Modal>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = form.get("type") as CashTransaction["type"];
    const amount = String(form.get("amount") ?? "0");
    onSave({
      id: row?.id ?? 0,
      date: String(form.get("date") ?? "01 May 2025"),
      voucher: String(form.get("voucher") ?? ""),
      particulars: String(form.get("particulars") ?? ""),
      type,
      paymentMode: form.get("paymentMode") as CashTransaction["paymentMode"],
      receipt: type === "Receipt" ? amount : "—",
      payment: type === "Payment" ? amount : "—",
      balance: row?.balance ?? "6,20,350",
    });
  }

  return (
    <Modal description={dialog.mode === "add" ? "Record a receipt or payment" : row?.voucher} onClose={onClose} title={dialog.mode === "add" ? "Add cash entry" : "Edit cash entry"}>
      <form className={styles.formGrid} onSubmit={submit}>
        <label><span>Date</span><input defaultValue={row?.date ?? "08 May 2025"} name="date" required /></label>
        <label><span>Voucher No</span><input defaultValue={row?.voucher ?? "RCPT-0007"} name="voucher" required /></label>
        <label className={styles.fullField}><span>Particulars</span><input defaultValue={row?.particulars ?? ""} name="particulars" placeholder="Enter transaction details" required /></label>
        <label><span>Type</span><select defaultValue={row?.type ?? "Receipt"} name="type"><option>Receipt</option><option>Payment</option></select></label>
        <label><span>Payment Mode</span><select defaultValue={row?.paymentMode ?? "Cash"} name="paymentMode"><option>Cash</option><option>Card</option><option>Bank</option></select></label>
        <label className={styles.fullField}><span>Amount (৳)</span><input defaultValue={row?.receipt !== "—" ? row?.receipt : row?.payment !== "—" ? row?.payment : ""} name="amount" placeholder="0" required /></label>
        <footer className={styles.modalActions}><button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button><button className={styles.primaryButton} type="submit">Save Entry</button></footer>
      </form>
    </Modal>
  );
}

export function Reference55CashBook() {
  const [rows, setRows] = useState<CashTransaction[]>([...initialCashTransactions]);
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [branch, setBranch] = useState("All Branches");
  const [type, setType] = useState("All");
  const [paymentMode, setPaymentMode] = useState("All");
  const [applied, setApplied] = useState({ type: "All", paymentMode: "All" });
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<CashDialog>(null);
  const [message, setMessage] = useState("");

  const filteredRows = useMemo(() => rows.filter((row) =>
    (applied.type === "All" || row.type === applied.type) &&
    (applied.paymentMode === "All" || row.paymentMode === applied.paymentMode)
  ), [applied, rows]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplied({ type, paymentMode });
    setPage(1);
    setMessage(`Cash book updated for ${branch} (${dateRange}).`);
  }

  function resetFilters() {
    setDateRange("01/05/2025 - 31/05/2025");
    setBranch("All Branches");
    setType("All");
    setPaymentMode("All");
    setApplied({ type: "All", paymentMode: "All" });
    setPage(1);
    setMessage("Cash book filters reset.");
  }

  function saveEntry(entry: CashTransaction) {
    if (dialog?.mode === "edit") {
      setRows((current) => current.map((row) => row.id === entry.id ? entry : row));
    } else {
      const id = Math.max(0, ...rows.map((row) => row.id)) + 1;
      setRows((current) => [...current, { ...entry, id }]);
    }
    setMessage(`${entry.voucher} saved successfully.`);
    setDialog(null);
  }

  const columns: readonly TableColumn<CashTransaction>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "date", label: "Date", render: (row) => row.date },
    { key: "voucher", label: "Voucher No", render: (row) => <strong>{row.voucher}</strong> },
    { key: "particulars", label: "Particulars", render: (row) => row.particulars },
    { key: "type", label: "Type", align: "center", render: (row) => <StatusBadge tone={row.type === "Receipt" ? "success" : "danger"}>{row.type}</StatusBadge> },
    { key: "mode", label: "Payment Mode", render: (row) => row.paymentMode },
    { key: "receipt", label: "Receipt (৳)", align: "right", render: (row) => row.receipt },
    { key: "payment", label: "Payment (৳)", align: "right", render: (row) => row.payment },
    { key: "balance", label: "Balance (৳)", align: "right", render: (row) => row.balance },
    { key: "action", label: "Action", align: "center", render: (row) => <span className={styles.rowActions}><IconAction label={`View ${row.voucher}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction><IconAction label={`Edit ${row.voucher}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction></span> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.actionRow}><button className={styles.successButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add Entry</button></div>
      <Card as="form" className={styles.filterBar} onSubmit={applyFilters}>
        <label><span>Date Range</span><span className={styles.dateInput}><input onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays size={13} /></span></label>
        <label><span>Branch</span><select onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branches</option><option>Head Office</option><option>Uttara Branch</option></select></label>
        <label><span>Type</span><select onChange={(event) => setType(event.target.value)} value={type}><option>All</option><option>Receipt</option><option>Payment</option></select></label>
        <label><span>Payment Mode</span><select onChange={(event) => setPaymentMode(event.target.value)} value={paymentMode}><option>All</option><option>Cash</option><option>Card</option><option>Bank</option></select></label>
        <button className={styles.primaryButton} type="submit"><Filter size={12} />Filter</button>
        <button className={styles.secondaryButton} onClick={resetFilters} type="button"><RotateCcw size={12} />Reset</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}

      <section aria-label="Cash book summary" className={styles.metrics}>
        <StatCard accent="green" icon={<Landmark size={17} />} label="Opening Balance" value="৳ 5,48,750" />
        <StatCard icon={<ReceiptText size={17} />} label="Total Receipt" value="৳ 12,85,600" />
        <StatCard accent="orange" icon={<WalletCards size={17} />} label="Total Payment" value="৳ 10,75,300" />
        <StatCard accent="violet" icon={<Landmark size={17} />} label="Closing Balance" value="৳ 7,59,050" />
      </section>

      <DataTable columns={columns} currentPage={page} minWidth={1080} onPageChange={setPage} pageCount={5} rowKey={(row) => row.id} rows={filteredRows} title="Cash Transactions" total={42} />
      {dialog ? <CashEntryDialog dialog={dialog} onClose={() => setDialog(null)} onSave={saveEntry} /> : null}
    </div>
  );
}
