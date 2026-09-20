"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileBarChart,
  FilePenLine,
  Landmark,
  Plus,
  ReceiptText,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  aminPurchaseHistory,
  aminSupplierProfile,
  directorySuppliers,
  formatPurchaseSupplierMoney,
  managementSuppliers,
  type PurchaseSupplier,
  type SupplierPurchaseHistory,
} from "./supplier-data";
import { useSupplierStore } from "./use-supplier-store";
import styles from "./supplier-details.module.css";

function DetailModal({ children, labelId, onClose }: { children: ReactNode; labelId: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => ref.current?.querySelector<HTMLElement>("button, input")?.focus(), 0);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", keydown);
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div aria-labelledby={labelId} aria-modal="true" className={`surface-card ${styles.modal}`} ref={ref} role="dialog">{children}</div>
    </div>
  );
}

function ModalHeader({ children, id, onClose }: { children: ReactNode; id: string; onClose: () => void }) {
  return (
    <div className={styles.modalHeader}>
      <div><h2 id={id}>{children}</h2><p>Supplier account information</p></div>
      <button aria-label="Close dialog" onClick={onClose} type="button"><X size={18} /></button>
    </div>
  );
}

export function SupplierDetails({ supplierId }: { supplierId: string }) {
  const directoryStore = useSupplierStore("directory");
  const managementStore = useSupplierStore("management");
  const fallback = directorySuppliers.find((item) => item.code === supplierId)
    ?? managementSuppliers.find((item) => item.code === supplierId)
    ?? directorySuppliers[0];
  const supplier = directoryStore.records.find((item) => item.code === supplierId)
    ?? managementStore.records.find((item) => item.code === supplierId)
    ?? fallback;
  const belongsToManagement = managementStore.records.some((item) => item.code === supplier.code)
    || supplier.code.startsWith("MGT-");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<SupplierPurchaseHistory | null>(null);
  const [quickPanel, setQuickPanel] = useState<"ledger" | "report" | null>(null);
  const [message, setMessage] = useState("");

  const financials = useMemo(() => {
    if (supplier.code === "SUP-001" || supplier.code === "MGT-001") return aminSupplierProfile;
    const dueAmount = supplier.dueAmount;
    return {
      ...aminSupplierProfile,
      totalPurchase: 1_475_000,
      totalReturn: 0,
      totalPayment: Math.max(0, 1_475_000 - dueAmount),
      dueAmount,
    };
  }, [supplier.code, supplier.dueAmount]);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated: PurchaseSupplier = {
      ...supplier,
      name: String(form.get("name") ?? "").trim(),
      contactPerson: String(form.get("contactPerson") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      status: String(form.get("status")) as PurchaseSupplier["status"],
    };
    const store = belongsToManagement ? managementStore : directoryStore;
    store.saveRecords(store.records.map((item) => item.code === updated.code ? updated : item));
    setEditOpen(false);
    setMessage("Supplier information updated successfully.");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <Link className="button" href={belongsToManagement ? "/purchases/suppliers" : "/purchases/supplier-directory"}><ArrowLeft size={15} />Back to List</Link>
            <button className="button button--primary" onClick={() => setEditOpen(true)} type="button"><FilePenLine size={15} />Edit Supplier</button>
          </div>
        )}
        description="View supplier profile, account summary and purchase activity"
        title="Supplier Details"
      />
      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <Card className={styles.identityCard}>
        <div className={styles.avatar}><Landmark aria-hidden="true" size={21} /></div>
        <div className={styles.identityCopy}>
          <div><h2>{supplier.name}</h2><span className={`${styles.status} ${supplier.status === "Active" ? styles.active : styles.inactive}`}>{supplier.status}</span></div>
          <p>{supplier.code === "SUP-001" || supplier.code === "MGT-001" ? aminSupplierProfile.tagline : "Trusted Jewellery Material Supplier"}</p>
        </div>
      </Card>

      <div className={styles.summaryGrid}>
        <Card className={styles.infoCard}>
          <h2>Basic Information</h2>
          <dl>
            <div><dt>Supplier Code</dt><dd>{supplier.code}</dd></div>
            <div><dt>Supplier Name</dt><dd>{supplier.name}</dd></div>
            <div><dt>Contact Person</dt><dd>{supplier.contactPerson}</dd></div>
            <div><dt>Phone</dt><dd>{supplier.phone}</dd></div>
            <div><dt>Email</dt><dd>{supplier.email}</dd></div>
            <div><dt>Address</dt><dd>{supplier.address}</dd></div>
            <div><dt>TIN Number</dt><dd>{aminSupplierProfile.tin}</dd></div>
            <div><dt>Business Type</dt><dd>{aminSupplierProfile.businessType}</dd></div>
            <div><dt>Status</dt><dd><span className={`${styles.status} ${supplier.status === "Active" ? styles.active : styles.inactive}`}>{supplier.status}</span></dd></div>
            <div><dt>Remarks</dt><dd>{aminSupplierProfile.remarks}</dd></div>
          </dl>
        </Card>

        <div className={styles.rightColumn}>
          <Card className={styles.financialCard}>
            <h2>Financial Summary</h2>
            <dl>
              <div><dt>Total Purchase</dt><dd>{formatPurchaseSupplierMoney(financials.totalPurchase)}</dd></div>
              <div><dt>Total Return</dt><dd>{formatPurchaseSupplierMoney(financials.totalReturn)}</dd></div>
              <div><dt>Total Payment</dt><dd>{formatPurchaseSupplierMoney(financials.totalPayment)}</dd></div>
              <div className={styles.dueRow}><dt>Due Amount</dt><dd>{formatPurchaseSupplierMoney(financials.dueAmount)}</dd></div>
            </dl>
          </Card>
          <Card className={styles.quickCard}>
            <h2>Quick Actions</h2>
            <div className={styles.quickGrid}>
              <Link className={styles.greenAction} href="/purchases/new"><Plus size={15} />New Purchase</Link>
              <Link className={styles.blueAction} href="/accounts/payments"><WalletCards size={15} />Payment Entry</Link>
              <button className={styles.orangeAction} onClick={() => setQuickPanel("ledger")} type="button"><ReceiptText size={15} />View Ledger</button>
              <button className={styles.grayAction} onClick={() => setQuickPanel("report")} type="button"><FileBarChart size={15} />View Reports</button>
            </div>
          </Card>
        </div>
      </div>

      <Card className={styles.historyCard}>
        <h2>Recent Purchase History</h2>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Recent purchases for {supplier.name}</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Purchase No</th><th scope="col">Total Amount (৳)</th><th scope="col">Payment (৳)</th><th scope="col">Due (৳)</th><th scope="col">Action</th></tr></thead>
            <tbody>{aminPurchaseHistory.map((purchase) => (
              <tr key={purchase.purchaseNo}>
                <td>{purchase.date}</td><td className={styles.linkText}>{purchase.purchaseNo}</td><td>{formatPurchaseSupplierMoney(purchase.totalAmount).replace("৳ ", "")}</td><td>{formatPurchaseSupplierMoney(purchase.payment).replace("৳ ", "")}</td><td className={purchase.due ? styles.dueText : ""}>{formatPurchaseSupplierMoney(purchase.due).replace("৳ ", "")}</td>
                <td><button aria-label={`View ${purchase.purchaseNo}`} className={styles.viewButton} onClick={() => setSelectedPurchase(purchase)} type="button"><Eye size={15} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      {editOpen ? (
        <DetailModal labelId="edit-supplier-title" onClose={() => setEditOpen(false)}>
          <ModalHeader id="edit-supplier-title" onClose={() => setEditOpen(false)}>Edit Supplier</ModalHeader>
          <form className={styles.editForm} onSubmit={saveProfile}>
            <label><span>Supplier Name</span><input autoFocus className="field" defaultValue={supplier.name} name="name" required /></label>
            <label><span>Contact Person</span><input className="field" defaultValue={supplier.contactPerson} name="contactPerson" required /></label>
            <label><span>Phone</span><input className="field" defaultValue={supplier.phone} name="phone" required /></label>
            <label><span>Email</span><input className="field" defaultValue={supplier.email} name="email" required type="email" /></label>
            <label><span>Location</span><input className="field" defaultValue={supplier.location} name="location" required /></label>
            <label><span>Status</span><select className="select" defaultValue={supplier.status} name="status"><option>Active</option><option>Inactive</option></select></label>
            <label className={styles.fullField}><span>Address</span><input className="field" defaultValue={supplier.address} name="address" required /></label>
            <div className={styles.modalActions}><button className="button" onClick={() => setEditOpen(false)} type="button">Cancel</button><button className="button button--primary" type="submit"><CheckCircle2 size={15} />Save Changes</button></div>
          </form>
        </DetailModal>
      ) : null}

      {selectedPurchase ? (
        <DetailModal labelId="purchase-details-title" onClose={() => setSelectedPurchase(null)}>
          <ModalHeader id="purchase-details-title" onClose={() => setSelectedPurchase(null)}>{selectedPurchase.purchaseNo}</ModalHeader>
          <dl className={styles.purchaseDetails}>
            <div><dt>Supplier</dt><dd>{supplier.name}</dd></div><div><dt>Date</dt><dd>{selectedPurchase.date}</dd></div>
            <div><dt>Total Amount</dt><dd>{formatPurchaseSupplierMoney(selectedPurchase.totalAmount)}</dd></div><div><dt>Payment</dt><dd>{formatPurchaseSupplierMoney(selectedPurchase.payment)}</dd></div>
            <div><dt>Due</dt><dd className={selectedPurchase.due ? styles.dueText : ""}>{formatPurchaseSupplierMoney(selectedPurchase.due)}</dd></div><div><dt>Status</dt><dd><span className={`${styles.status} ${styles.active}`}>{selectedPurchase.due ? "Partial" : "Paid"}</span></dd></div>
          </dl>
          <div className={styles.modalFooter}><button className="button button--primary" onClick={() => setSelectedPurchase(null)} type="button">Done</button></div>
        </DetailModal>
      ) : null}

      {quickPanel ? (
        <DetailModal labelId="quick-panel-title" onClose={() => setQuickPanel(null)}>
          <ModalHeader id="quick-panel-title" onClose={() => setQuickPanel(null)}>{quickPanel === "ledger" ? "Supplier Ledger" : "Purchase Report"}</ModalHeader>
          <div className={styles.quickPanelBody}>
            {quickPanel === "ledger" ? (
              aminPurchaseHistory.map((item) => <div className={styles.ledgerRow} key={item.purchaseNo}><span>{item.date}<small>{item.purchaseNo}</small></span><strong>{formatPurchaseSupplierMoney(item.totalAmount)}</strong></div>)
            ) : (
              <div className={styles.reportSummary}><FileBarChart aria-hidden="true" size={34} /><h3>Supplier purchase summary</h3><p>{supplier.name} has {aminPurchaseHistory.length} recent invoices totalling {formatPurchaseSupplierMoney(aminPurchaseHistory.reduce((sum, item) => sum + item.totalAmount, 0))}.</p></div>
            )}
          </div>
          <div className={styles.modalFooter}><button className="button" onClick={() => window.print()} type="button">Print</button><button className="button button--primary" onClick={() => setQuickPanel(null)} type="button">Done</button></div>
        </DetailModal>
      ) : null}
    </div>
  );
}
