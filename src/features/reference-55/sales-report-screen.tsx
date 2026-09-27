"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, ChevronDown, Download, FileChartColumn, Filter, ReceiptText, RotateCcw, TrendingUp, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryDonutChart, SalesTrendChart, type CategoryDatum } from "@/features/reference-52/reference-charts";
import { salesItems, type SalesItem } from "./data";
import { DataTable, Feedback, StatCard, type TableColumn } from "./shared";
import styles from "./reference-55.module.css";

const categories: readonly CategoryDatum[] = [
  { label: "Gold Jewellery", value: 60 },
  { label: "Diamond Jewellery", value: 20 },
  { label: "Silver Jewellery", value: 12 },
  { label: "Others", value: 8 },
];

const columns: readonly TableColumn<SalesItem>[] = [
  { key: "number", label: "#", align: "center", render: (row) => row.id },
  { key: "item", label: "Item Name", render: (row) => <strong>{row.item}</strong> },
  { key: "category", label: "Category", render: (row) => row.category },
  { key: "quantity", label: "Quantity", align: "right", render: (row) => row.quantity },
  { key: "weight", label: "Total Weight (gm)", align: "right", render: (row) => row.weight },
  { key: "sales", label: "Total Sales (৳)", align: "right", render: (row) => row.sales },
  { key: "profit", label: "Profit (৳)", align: "right", render: (row) => row.profit },
];

export function Reference55SalesReport() {
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");
  const [branch, setBranch] = useState("All Branches");
  const [salesPerson, setSalesPerson] = useState("All Sales Persons");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  function filterReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setMessage(`Sales report updated for ${branch} and ${salesPerson} (${dateRange}).`);
  }

  function resetReport() {
    setDateRange("01/05/2025 - 31/05/2025");
    setBranch("All Branches");
    setSalesPerson("All Sales Persons");
    setPage(1);
    setMessage("Sales report filters reset.");
  }

  function exportReport() {
    const rows = [
      ["Item Name", "Category", "Quantity", "Total Weight (gm)", "Total Sales", "Profit"],
      ...salesItems.map((row) => [row.item, row.category, String(row.quantity), row.weight, row.sales, row.profit]),
    ];
    const blob = new Blob([rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sales-report-may-2025.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Sales report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <Card as="form" className={`${styles.filterBar} ${styles.salesFilters}`} onSubmit={filterReport}>
        <label><span>Date Range</span><span className={styles.dateInput}><input aria-label="Sales report date range" onChange={(event) => setDateRange(event.target.value)} value={dateRange} /><CalendarDays aria-hidden="true" size={13} /></span></label>
        <label><span>Branch</span><select onChange={(event) => setBranch(event.target.value)} value={branch}><option>All Branches</option><option>Head Office</option><option>Uttara Branch</option><option>Dhanmondi Branch</option></select></label>
        <label><span>Sales Person</span><select onChange={(event) => setSalesPerson(event.target.value)} value={salesPerson}><option>All Sales Persons</option><option>Farhana Islam</option><option>Shahida Akter</option></select></label>
        <button className={styles.primaryButton} type="submit"><Filter aria-hidden="true" size={12} />Filter</button>
        <button className={styles.secondaryButton} onClick={resetReport} type="button"><RotateCcw aria-hidden="true" size={12} />Reset</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}

      <section aria-label="Sales report summary" className={styles.metrics}>
        <StatCard icon={<WalletCards size={17} />} label="Total Sales" trend="+18.6%" value="৳ 2,95,40,600" />
        <StatCard icon={<ReceiptText size={17} />} label="Total Invoice" trend="+12.4%" value="1,462" />
        <StatCard accent="green" icon={<FileChartColumn size={17} />} label="Average Invoice" trend="+8.5%" value="৳ 20,200" />
        <StatCard accent="orange" icon={<TrendingUp size={17} />} label="Total Profit" trend="+21.7%" value="৳ 62,45,300" />
      </section>

      <section className={styles.charts}>
        <SalesTrendChart className={styles.chartCard} compact title="Sales Trend" />
        <CategoryDonutChart categories={categories} className={styles.chartCard} compact title="Sales by Category" total="৳ 2,95,40,600" />
      </section>

      <DataTable
        columns={columns}
        currentPage={page}
        headerAction={<button className={styles.exportButton} onClick={exportReport} type="button"><Download aria-hidden="true" size={12} />Export<ChevronDown aria-hidden="true" size={11} /></button>}
        minWidth={820}
        onPageChange={setPage}
        pageCount={5}
        rowKey={(row) => row.id}
        rows={salesItems}
        title="Top Selling Items"
        total={25}
      />
    </div>
  );
}
