"use client";

import {
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  PauseCircle,
  Printer,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  detailedReportSummary,
  karigarOptions,
  productionReportOrders,
  productionReportStatuses,
  reportTypes,
  type ProductionReportOrder,
  type ProductionReportStatus,
  type ProductionReportType,
} from "./production-report-data";
import styles from "./production-report.module.css";

type DetailedFilters = {
  reportType: ProductionReportType;
  dateFrom: string;
  dateTo: string;
  karigar: string;
  status: "All" | ProductionReportStatus;
};

type ReportTab = "Production Orders" | "Karigar Wise" | "Item Wise" | "Material Consumption" | "Production Value";

const tabs: ReportTab[] = ["Production Orders", "Karigar Wise", "Item Wise", "Material Consumption", "Production Value"];

const initialFilters: DetailedFilters = {
  reportType: "Production Summary",
  dateFrom: "2025-04-01",
  dateTo: "2025-04-30",
  karigar: "All Karigars",
  status: "All",
};

const materials = [
  { name: "Gold", issued: "48.250 gm", returned: "12.600 gm", consumed: "35.650 gm" },
  { name: "Diamond", issued: "120 pcs", returned: "18 pcs", consumed: "102 pcs" },
  { name: "Silver Alloy", issued: "25.500 gm", returned: "6.200 gm", consumed: "19.300 gm" },
];

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadReport(rows: ProductionReportOrder[], filters: DetailedFilters) {
  const headers = ["PO No", "Item Name", "Karigar", "Assigned Date", "Expected Date", "Status", "Produced Qty", "Production Value"];
  const body = rows.map((row) => [row.orderNo, row.itemName, row.karigar, row.assignedDate, row.expectedDate, row.status, row.producedQuantity, row.productionValue]);
  const metadata = [["Production Report"], ["Report Type", filters.reportType], ["Date Range", `${filters.dateFrom} to ${filters.dateTo}`], []];
  const csv = [...metadata, headers, ...body].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `production-orders-${filters.dateFrom}-${filters.dateTo}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: ProductionReportStatus }) {
  const className = status === "Completed" ? styles.detailCompleted : status === "In Progress" ? styles.detailProgress : styles.detailPending;
  return <span className={`${styles.detailStatus} ${className}`}>{status}</span>;
}

function SummaryMetric({ icon: Icon, label, value, tone, note }: {
  icon: typeof Settings2;
  label: string;
  value: number;
  tone: "blue" | "green" | "orange" | "indigo";
  note: string;
}) {
  return (
    <Card as="article" className={styles.detailMetric}>
      <span className={`${styles.detailMetricIcon} ${styles[tone]}`}><Icon aria-hidden="true" size={23} /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
    </Card>
  );
}

export function DetailedProductionReport() {
  const [draft, setDraft] = useState<DetailedFilters>(initialFilters);
  const [applied, setApplied] = useState<DetailedFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState<ReportTab>("Production Orders");
  const [selected, setSelected] = useState<ProductionReportOrder | null>(null);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => productionReportOrders.filter((row) => (
    row.assignedDateIso >= applied.dateFrom
    && row.assignedDateIso <= applied.dateTo
    && (applied.karigar === "All Karigars" || row.karigar === applied.karigar)
    && (applied.status === "All" || row.status === applied.status)
  )), [applied]);

  const karigarRows = useMemo(() => {
    const grouped = new Map<string, { orders: number; completed: number; quantity: number; value: number }>();
    rows.forEach((row) => {
      const current = grouped.get(row.karigar) ?? { orders: 0, completed: 0, quantity: 0, value: 0 };
      current.orders += 1;
      current.completed += row.status === "Completed" ? 1 : 0;
      current.quantity += row.producedQuantity;
      current.value += row.productionValue;
      grouped.set(row.karigar, current);
    });
    return [...grouped.entries()];
  }, [rows]);

  const itemRows = useMemo(() => {
    const grouped = new Map<string, { orders: number; quantity: number; value: number }>();
    rows.forEach((row) => {
      const current = grouped.get(row.itemName) ?? { orders: 0, quantity: 0, value: 0 };
      current.orders += 1;
      current.quantity += row.producedQuantity;
      current.value += row.productionValue;
      grouped.set(row.itemName, current);
    });
    return [...grouped.entries()];
  }, [rows]);

  const defaultView = applied.karigar === "All Karigars" && applied.status === "All" && applied.dateFrom === "2025-04-01" && applied.dateTo === "2025-04-30";
  const summary = defaultView ? detailedReportSummary : {
    total: rows.length,
    completed: rows.filter((row) => row.status === "Completed").length,
    inProgress: rows.filter((row) => row.status === "In Progress").length,
    pending: rows.filter((row) => row.status === "Pending").length,
  };

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.dateFrom > draft.dateTo) {
      setMessage("Date From must be before Date To.");
      return;
    }
    setApplied({ ...draft });
    setMessage("Production report generated successfully.");
  }

  function exportPdf() {
    setMessage("Print dialog opened. Choose Save as PDF to export the report.");
    window.print();
  }

  return (
    <div className={styles.detailedPage}>
      <header className={styles.detailHeader}>
        <div><h1>Production Report</h1><p>Home <b aria-hidden="true">›</b> Production Management <b aria-hidden="true">›</b> Production Report</p></div>
        <div className={styles.reportActions}>
          <button className={styles.pdfButton} onClick={exportPdf} type="button"><FileText aria-hidden="true" size={15} />Export PDF</button>
          <button className={styles.excelButton} onClick={() => { downloadReport(rows, applied); setMessage("Excel-compatible production report exported."); }} type="button"><FileSpreadsheet aria-hidden="true" size={15} />Export Excel</button>
          <button className={styles.printButton} onClick={() => window.print()} type="button"><Printer aria-hidden="true" size={15} />Print</button>
        </div>
      </header>

      <Card className={styles.detailFilterCard}>
        <form onSubmit={generate}>
          <label><span>Report Type</span><select onChange={(event) => setDraft((current) => ({ ...current, reportType: event.target.value as ProductionReportType }))} value={draft.reportType}>{reportTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Date From</span><input onChange={(event) => setDraft((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={draft.dateFrom} /></label>
          <label><span>Date To</span><input onChange={(event) => setDraft((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={draft.dateTo} /></label>
          <label><span>Karigar</span><select onChange={(event) => setDraft((current) => ({ ...current, karigar: event.target.value }))} value={draft.karigar}>{karigarOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Status</span><select onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as DetailedFilters["status"] }))} value={draft.status}>{productionReportStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className={styles.detailGenerateButton} type="submit"><Search aria-hidden="true" size={14} />Generate</button>
        </form>
      </Card>

      <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

      <section aria-label="Production report totals" className={styles.detailMetrics}>
        <SummaryMetric icon={Settings2} label="Total Production Orders" note="↑ 12% vs last month" tone="blue" value={summary.total} />
        <SummaryMetric icon={CheckCircle2} label="Completed" note="↑ 18% vs last month" tone="green" value={summary.completed} />
        <SummaryMetric icon={LoaderCircle} label="In Progress" note="↓ 5% vs last month" tone="orange" value={summary.inProgress} />
        <SummaryMetric icon={PauseCircle} label="Pending" note="— 0%" tone="indigo" value={summary.pending} />
      </section>

      <Card className={styles.detailTableCard}>
        <div className={styles.reportTabs} role="tablist" aria-label="Production report views">
          {tabs.map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeReportTab : ""} key={tab} onClick={() => setActiveTab(tab)} role="tab" type="button">{tab}</button>)}
        </div>

        {activeTab === "Production Orders" ? (
          <div className={styles.detailTableScroller}><table className={styles.detailTable}><caption className="sr-only">Production order report</caption><thead><tr><th>SL</th><th>PO No</th><th>Item Name</th><th>Karigar</th><th>Assigned Date</th><th>Expected Date</th><th>Status</th><th>Produced Qty</th><th>Action</th></tr></thead><tbody>
            {rows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td><strong>{row.orderNo}</strong></td><td>{row.itemName}</td><td>{row.karigar}</td><td>{row.assignedDate}</td><td>{row.expectedDate}</td><td><StatusBadge status={row.status} /></td><td>{row.producedQuantity} pcs</td><td><button className={styles.detailViewButton} onClick={() => setSelected(row)} type="button"><Eye aria-hidden="true" size={13} />View</button></td></tr>)}
            {!rows.length ? <tr><td className={styles.detailEmpty} colSpan={9}>No production orders match these filters.</td></tr> : null}
          </tbody></table></div>
        ) : null}

        {activeTab === "Karigar Wise" ? <div className={styles.detailTableScroller}><table className={styles.detailTable}><thead><tr><th>SL</th><th>Karigar</th><th>Total Orders</th><th>Completed</th><th>Produced Qty</th><th>Production Value</th></tr></thead><tbody>{karigarRows.map(([name, item], index) => <tr key={name}><td>{index + 1}</td><td><strong>{name}</strong></td><td>{item.orders}</td><td>{item.completed}</td><td>{item.quantity} pcs</td><td>৳ {item.value.toLocaleString("en-IN")}</td></tr>)}</tbody></table></div> : null}
        {activeTab === "Item Wise" ? <div className={styles.detailTableScroller}><table className={styles.detailTable}><thead><tr><th>SL</th><th>Item</th><th>Orders</th><th>Produced Qty</th><th>Production Value</th></tr></thead><tbody>{itemRows.map(([name, item], index) => <tr key={name}><td>{index + 1}</td><td><strong>{name}</strong></td><td>{item.orders}</td><td>{item.quantity} pcs</td><td>৳ {item.value.toLocaleString("en-IN")}</td></tr>)}</tbody></table></div> : null}
        {activeTab === "Material Consumption" ? <div className={styles.detailTableScroller}><table className={styles.detailTable}><thead><tr><th>SL</th><th>Material</th><th>Issued</th><th>Returned</th><th>Consumed</th></tr></thead><tbody>{materials.map((item, index) => <tr key={item.name}><td>{index + 1}</td><td><strong>{item.name}</strong></td><td>{item.issued}</td><td>{item.returned}</td><td>{item.consumed}</td></tr>)}</tbody></table></div> : null}
        {activeTab === "Production Value" ? <div className={styles.valueSummary}>{itemRows.map(([name, item]) => <article key={name}><span>{name}</span><strong>৳ {item.value.toLocaleString("en-IN")}</strong><small>{item.quantity} finished items</small></article>)}</div> : null}
      </Card>

      {selected ? <div className={styles.detailModalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><Card aria-modal="true" className={styles.detailModal} role="dialog"><header><div><h2>{selected.orderNo}</h2><p>Production order report details</p></div><button aria-label="Close report details" onClick={() => setSelected(null)} type="button"><X aria-hidden="true" size={18} /></button></header><div className={styles.detailModalBody}><div><span>Item</span><strong>{selected.itemName}</strong></div><div><span>Karigar</span><strong>{selected.karigar}</strong></div><div><span>Status</span><StatusBadge status={selected.status} /></div><div><span>Produced</span><strong>{selected.producedQuantity} pcs</strong></div><div><span>Expected Date</span><strong>{selected.expectedDate}</strong></div><div><span>Production Value</span><strong>৳ {selected.productionValue.toLocaleString("en-IN")}</strong></div><button className={styles.printButton} onClick={() => setSelected(null)} type="button">Done</button></div></Card></div> : null}
    </div>
  );
}
