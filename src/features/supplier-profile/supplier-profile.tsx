"use client";

import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  Download,
  FileDown,
  FilePenLine,
  FileText,
  FolderOpen,
  Mail,
  MapPin,
  PackageSearch,
  Phone,
  Printer,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatSupplierProfileCurrency,
  getSupplierProfile,
  purchaseTrend,
  recentSupplierPurchases,
  type SupplierProfileRecord,
  type SupplierPurchase,
  type SupplierStatus,
} from "./supplier-profile-data";
import styles from "./supplier-profile.module.css";

const detailTabs = ["Overview", "Purchase History", "Payment History", "Products", "Documents"] as const;
type DetailTab = (typeof detailTabs)[number];
type TrendRange = "3" | "6" | "12";

const rangeLabels: Record<TrendRange, string> = {
  "3": "Last 3 Months",
  "6": "Last 6 Months",
  "12": "Last 12 Months",
};

const paymentHistory = [
  { date: "26 Apr 2025", reference: "PAY-000082", method: "Bank Transfer", amount: 280_000 },
  { date: "15 Apr 2025", reference: "PAY-000079", method: "Cash", amount: 195_000 },
  { date: "02 Mar 2025", reference: "PAY-000068", method: "Cheque", amount: 320_000 },
  { date: "18 Feb 2025", reference: "PAY-000061", method: "Bank Transfer", amount: 170_000 },
];

const suppliedProducts = [
  { name: "22K Gold Bar", code: "GB-22K", orders: 18, value: 3_820_000 },
  { name: "Gold Necklace", code: "GN-001", orders: 12, value: 1_540_000 },
  { name: "Gold Ring", code: "GR-002", orders: 10, value: 1_120_000 },
  { name: "Gold Chain", code: "GC-005", orders: 8, value: 1_040_000 },
];

const supplierDocuments = [
  { name: "Supplier Agreement.pdf", detail: "Updated 10 Jan 2025" },
  { name: "Trade License.pdf", detail: "Expires 31 Dec 2026" },
  { name: "VAT Registration.pdf", detail: "Verified document" },
];

function downloadJson(filename: string, payload: object) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PurchaseTable({
  purchases,
  onOpenPurchase,
}: {
  purchases: SupplierPurchase[];
  onOpenPurchase: (purchase: SupplierPurchase) => void;
}) {
  return (
    <div className={styles.tableScroller}>
      <table className={styles.purchaseTable}>
        <caption className="sr-only">Recent purchases from Ali Gold Traders</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Invoice No</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase, index) => (
            <tr key={purchase.id}>
              <td>{index + 1}</td>
              <td>{purchase.date}</td>
              <td><span className={styles.invoiceNo}>{purchase.invoiceNo}</span></td>
              <td>{formatSupplierProfileCurrency(purchase.amount)}</td>
              <td><span className={styles.receivedBadge}>{purchase.status}</span></td>
              <td>
                <button
                  aria-label={`View ${purchase.invoiceNo}`}
                  className={styles.invoiceAction}
                  onClick={() => onOpenPurchase(purchase)}
                  title="View purchase"
                  type="button"
                >
                  <ReceiptText aria-hidden="true" size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SupplierProfile({ supplierId }: { supplierId: string }) {
  const initialSupplier = getSupplierProfile(supplierId);
  const [profile, setProfile] = useState<SupplierProfileRecord>(initialSupplier);
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
  const [range, setRange] = useState<TrendRange>("6");
  const [moreOpen, setMoreOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<SupplierPurchase | null>(null);
  const [activityMessage, setActivityMessage] = useState("");
  const [editDraft, setEditDraft] = useState(() => ({
    name: initialSupplier.name,
    contactPerson: initialSupplier.contactPerson,
    phone: initialSupplier.phone,
    email: initialSupplier.email,
    address: initialSupplier.address,
    supplierType: initialSupplier.supplierType,
  }));

  const trendChart = useMemo(() => {
    const items = range === "12" ? purchaseTrend : purchaseTrend.slice(-Number(range));
    const points = items.map((item, index) => {
      const x = items.length === 1 ? 50 : (index / (items.length - 1)) * 100;
      const y = Math.max(8, 92 - (item.amount / 1_500_000) * 82);
      return { ...item, x, y };
    });

    return {
      areaPath: `M 0 92 ${points.map((point) => `L ${point.x} ${point.y}`).join(" ")} L 100 92 Z`,
      linePoints: points.map((point) => `${point.x},${point.y}`).join(" "),
      points,
    };
  }, [range]);

  function openEditDialog() {
    setEditDraft({
      name: profile.name,
      contactPerson: profile.contactPerson,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      supplierType: profile.supplierType,
    });
    setEditOpen(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile((current) => ({ ...current, ...editDraft }));
    setEditOpen(false);
    setActivityMessage("Supplier profile updated successfully.");
  }

  function toggleStatus() {
    const nextStatus: SupplierStatus = profile.status === "Active" ? "Inactive" : "Active";
    setProfile((current) => ({ ...current, status: nextStatus }));
    setMoreOpen(false);
    setActivityMessage(`Supplier marked ${nextStatus.toLowerCase()}.`);
  }

  function exportProfile() {
    downloadJson(`${profile.supplierId}-supplier-profile.json`, profile);
    setMoreOpen(false);
    setActivityMessage("Supplier profile exported.");
  }

  function printProfile() {
    setMoreOpen(false);
    setActivityMessage("Supplier profile is ready to print.");
    window.print();
  }

  function showDocument(name: string) {
    setActivityMessage(`${name} opened in the document viewer.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.topActions}>
            <Link className={`button ${styles.backLink}`} href="/suppliers">
              <ArrowLeft aria-hidden="true" size={15} />
              Back to List
            </Link>
            <button className="button button--primary" onClick={openEditDialog} type="button">
              <FilePenLine aria-hidden="true" size={15} />
              Edit Supplier
            </button>
            <div className={styles.moreControl}>
              <button
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className="button"
                onClick={() => setMoreOpen((open) => !open)}
                type="button"
              >
                More
                <ChevronDown aria-hidden="true" size={14} />
              </button>
              {moreOpen ? (
                <div className={styles.moreMenu} role="menu">
                  <button onClick={printProfile} role="menuitem" type="button"><Printer aria-hidden="true" size={15} /> Print profile</button>
                  <button onClick={exportProfile} role="menuitem" type="button"><Download aria-hidden="true" size={15} /> Export data</button>
                  <button onClick={toggleStatus} role="menuitem" type="button"><BadgeCheck aria-hidden="true" size={15} /> Mark {profile.status === "Active" ? "inactive" : "active"}</button>
                </div>
              ) : null}
            </div>
          </div>
        )}
        description="View and manage supplier information"
        title="Supplier Details"
      />

      {activityMessage ? <p aria-live="polite" className={styles.activity}>{activityMessage}</p> : <span aria-live="polite" className="sr-only" />}

      <div className={styles.detailGrid}>
        <Card as="aside" className={styles.profileCard}>
          <div aria-label="Ali Gold Traders logo" className={styles.supplierLogo} role="img"><span>A</span></div>
          <h1>{profile.name}</h1>
          <div className={styles.identityLine}>
            <span>{profile.supplierId}</span>
            <span className={`${styles.profileStatus} ${profile.status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>{profile.status}</span>
          </div>

          <dl className={styles.contactDetails}>
            <div><UserRound aria-hidden="true" size={15} /><dt className="sr-only">Contact person</dt><dd>{profile.contactPerson}</dd></div>
            <div><Phone aria-hidden="true" size={15} /><dt className="sr-only">Phone</dt><dd>{profile.phone}</dd></div>
            <div><Mail aria-hidden="true" size={15} /><dt className="sr-only">Email</dt><dd>{profile.email}</dd></div>
            <div><MapPin aria-hidden="true" size={15} /><dt className="sr-only">Address</dt><dd>{profile.address}</dd></div>
          </dl>

          <dl className={styles.accountDetails}>
            <div><dt>Supplier Type</dt><dd>{profile.supplierType}</dd></div>
            <div><dt>Opening Balance</dt><dd>{formatSupplierProfileCurrency(profile.openingBalance)}</dd></div>
            <div><dt>Total Purchase</dt><dd>{formatSupplierProfileCurrency(profile.totalPurchase)}</dd></div>
            <div><dt>Outstanding Due</dt><dd className={styles.dueText}>{formatSupplierProfileCurrency(profile.outstandingDue)}</dd></div>
            <div><dt>Member Since</dt><dd>{profile.memberSince}</dd></div>
          </dl>
        </Card>

        <section className={styles.content}>
          <Card aria-label="Supplier detail sections" as="nav" className={styles.tabs} role="tablist">
            {detailTabs.map((tab) => (
              <button
                aria-controls="supplier-tab-panel"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? styles.activeTab : ""}
                id={`supplier-tab-${tab.toLowerCase().replaceAll(" ", "-").replace("&", "and")}`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                type="button"
              >
                {tab}
              </button>
            ))}
          </Card>

          {activeTab === "Overview" ? (
            <div aria-labelledby="supplier-tab-overview" className={styles.overview} id="supplier-tab-panel" role="tabpanel">
              <section aria-label="Supplier account summary" className={styles.summaryGrid}>
                <Card className={styles.summaryCard}>
                  <p>Total Purchase</p>
                  <strong>{formatSupplierProfileCurrency(profile.totalPurchase)}</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <p>Total Invoices</p>
                  <strong>{profile.totalInvoices}</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <p>Outstanding Due</p>
                  <strong className={styles.dueValue}>{formatSupplierProfileCurrency(profile.outstandingDue)}</strong>
                </Card>
                <Card className={styles.summaryCard}>
                  <p>Last Purchase</p>
                  <strong className={styles.dateValue}>{profile.lastPurchase}</strong>
                </Card>
              </section>

              <Card className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h2>Purchase Trend ({rangeLabels[range]})</h2>
                  <select
                    aria-label="Purchase trend range"
                    className="select"
                    onChange={(event) => setRange(event.target.value as TrendRange)}
                    value={range}
                  >
                    <option value="6">Last 6 Months</option>
                    <option value="3">Last 3 Months</option>
                    <option value="12">Last 12 Months</option>
                  </select>
                </div>
                <div aria-label={`Area chart showing supplier purchases for ${rangeLabels[range].toLowerCase()}`} className={styles.chart} role="img">
                  <div aria-hidden="true" className={styles.yAxis}><span>1.5M</span><span>1M</span><span>500K</span><span>0</span></div>
                  <div className={styles.plotArea}>
                    <div className={styles.graphPlane}>
                      <svg aria-hidden="true" className={styles.chartSvg} preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="supplier-chart-fill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#c89424" stopOpacity="0.34" />
                            <stop offset="100%" stopColor="#c89424" stopOpacity="0.03" />
                          </linearGradient>
                        </defs>
                        <path d={trendChart.areaPath} fill="url(#supplier-chart-fill)" />
                        <polyline fill="none" points={trendChart.linePoints} stroke="#b77f17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                        {trendChart.points.map((point) => (
                          <circle cx={point.x} cy={point.y} fill="#ffffff" key={point.month} r="1.15" stroke="#b77f17" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                        ))}
                      </svg>
                    </div>
                    <div aria-hidden="true" className={styles.monthLabels}>
                      {trendChart.points.map((point) => <span key={point.month}>{point.month}</span>)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className={styles.purchasesCard}>
                <div className={styles.cardHeader}>
                  <h2>Recent Purchases</h2>
                  <button className={styles.viewAll} onClick={() => setActiveTab("Purchase History")} type="button">View All</button>
                </div>
                <PurchaseTable onOpenPurchase={setSelectedPurchase} purchases={recentSupplierPurchases} />
              </Card>
            </div>
          ) : null}

          {activeTab === "Purchase History" ? (
            <Card aria-labelledby="supplier-tab-purchase-history" className={styles.tabPanel} id="supplier-tab-panel" role="tabpanel">
              <div className={styles.panelHeader}>
                <div><h2>Purchase History</h2><p>All recent invoices received from {profile.name}.</p></div>
                <button className="button" onClick={() => downloadJson(`${profile.supplierId}-purchases.json`, { purchases: recentSupplierPurchases })} type="button"><FileDown size={15} /> Export</button>
              </div>
              <PurchaseTable onOpenPurchase={setSelectedPurchase} purchases={recentSupplierPurchases} />
            </Card>
          ) : null}

          {activeTab === "Payment History" ? (
            <Card aria-labelledby="supplier-tab-payment-history" className={styles.tabPanel} id="supplier-tab-panel" role="tabpanel">
              <div className={styles.panelHeader}><div><h2>Payment History</h2><p>Settlements made against supplier invoices.</p></div></div>
              <div className={styles.tableScroller}>
                <table className={styles.purchaseTable}>
                  <thead><tr><th>Date</th><th>Reference</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>{paymentHistory.map((payment) => (
                    <tr key={payment.reference}><td>{payment.date}</td><td><span className={styles.invoiceNo}>{payment.reference}</span></td><td>{payment.method}</td><td>{formatSupplierProfileCurrency(payment.amount)}</td><td><span className={styles.receivedBadge}>Completed</span></td></tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          ) : null}

          {activeTab === "Products" ? (
            <Card aria-labelledby="supplier-tab-products" className={styles.tabPanel} id="supplier-tab-panel" role="tabpanel">
              <div className={styles.panelHeader}><div><h2>Supplied Products</h2><p>Products most frequently purchased from this supplier.</p></div></div>
              <div className={styles.productGrid}>
                {suppliedProducts.map((product) => (
                  <button className={styles.productCard} key={product.code} onClick={() => setActivityMessage(`${product.name} details opened.`)} type="button">
                    <span><PackageSearch aria-hidden="true" size={19} /></span>
                    <strong>{product.name}</strong>
                    <small>{product.code} · {product.orders} orders</small>
                    <b>{formatSupplierProfileCurrency(product.value)}</b>
                  </button>
                ))}
              </div>
            </Card>
          ) : null}

          {activeTab === "Documents" ? (
            <Card aria-labelledby="supplier-tab-documents" className={styles.tabPanel} id="supplier-tab-panel" role="tabpanel">
              <div className={styles.panelHeader}><div><h2>Documents</h2><p>Verified files attached to the supplier account.</p></div></div>
              <div className={styles.documentList}>
                {supplierDocuments.map((document) => (
                  <button key={document.name} onClick={() => showDocument(document.name)} type="button">
                    <span><FileText aria-hidden="true" size={18} /></span>
                    <span><strong>{document.name}</strong><small>{document.detail}</small></span>
                    <FolderOpen aria-hidden="true" size={17} />
                  </button>
                ))}
              </div>
            </Card>
          ) : null}
        </section>
      </div>

      {editOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditOpen(false);
        }}>
          <Card aria-labelledby="edit-supplier-title" aria-modal="true" as="div" className={styles.modal} role="dialog">
            <div className={styles.modalHeader}>
              <div><h2 id="edit-supplier-title">Edit Supplier</h2><p>Update the supplier contact and account details.</p></div>
              <button aria-label="Close edit supplier dialog" onClick={() => setEditOpen(false)} type="button"><X aria-hidden="true" size={19} /></button>
            </div>
            <form onSubmit={saveProfile}>
              <div className={styles.formGrid}>
                <label><span>Supplier Name</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, name: event.target.value }))} required value={editDraft.name} /></label>
                <label><span>Contact Person</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, contactPerson: event.target.value }))} required value={editDraft.contactPerson} /></label>
                <label><span>Phone</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, phone: event.target.value }))} required value={editDraft.phone} /></label>
                <label><span>Email</span><input className="field" onChange={(event) => setEditDraft((draft) => ({ ...draft, email: event.target.value }))} required type="email" value={editDraft.email} /></label>
                <label className={styles.fullField}><span>Address</span><textarea className="textarea" onChange={(event) => setEditDraft((draft) => ({ ...draft, address: event.target.value }))} required value={editDraft.address} /></label>
                <label className={styles.fullField}><span>Supplier Type</span><select className="select" onChange={(event) => setEditDraft((draft) => ({ ...draft, supplierType: event.target.value }))} value={editDraft.supplierType}><option>Gold Supplier</option><option>Diamond Supplier</option><option>Jewellery Supplier</option><option>Bullion Supplier</option></select></label>
              </div>
              <div className={styles.modalActions}>
                <button className="button" onClick={() => setEditOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Check aria-hidden="true" size={16} /> Save Changes</button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {selectedPurchase ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedPurchase(null);
        }}>
          <Card aria-labelledby="purchase-detail-title" aria-modal="true" as="div" className={`${styles.modal} ${styles.purchaseModal}`} role="dialog">
            <div className={styles.modalHeader}>
              <div><h2 id="purchase-detail-title">{selectedPurchase.invoiceNo}</h2><p>Purchase invoice details</p></div>
              <button aria-label="Close purchase details" onClick={() => setSelectedPurchase(null)} type="button"><X aria-hidden="true" size={19} /></button>
            </div>
            <dl className={styles.invoiceDetails}>
              <div><dt>Supplier</dt><dd>{profile.name}</dd></div>
              <div><dt>Invoice Date</dt><dd>{selectedPurchase.date}</dd></div>
              <div><dt>Amount</dt><dd>{formatSupplierProfileCurrency(selectedPurchase.amount)}</dd></div>
              <div><dt>Status</dt><dd><span className={styles.receivedBadge}>{selectedPurchase.status}</span></dd></div>
            </dl>
            <div className={styles.modalActions}>
              <button className="button" onClick={() => setSelectedPurchase(null)} type="button">Close</button>
              <button className="button button--primary" onClick={() => {
                downloadJson(`${selectedPurchase.invoiceNo}.json`, selectedPurchase);
                setActivityMessage(`${selectedPurchase.invoiceNo} downloaded.`);
              }} type="button"><Download aria-hidden="true" size={15} /> Download Invoice</button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
