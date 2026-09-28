export type Metric = { label: string; value: string; note: string; trend?: string };

export const goldMetrics: readonly Metric[] = [
  { label: "22K Gold (per gram)", value: "৳ 10,980", trend: "↑ 0.85%", note: "vs yesterday" },
  { label: "21K Gold (per gram)", value: "৳ 10,480", trend: "↑ 0.75%", note: "vs yesterday" },
  { label: "18K Gold (per gram)", value: "৳ 8,920", trend: "↑ 0.65%", note: "vs yesterday" },
  { label: "24K Gold (per gram)", value: "৳ 12,500", trend: "↑ 0.90%", note: "vs yesterday" },
  { label: "Last Updated", value: "26 May 2025", note: "10:30 AM" },
];

export type GoldRate = {
  purity: string; description: string; unit: string; buy: string; sell: string; making: string; status: "Active";
};
export const goldRates: readonly GoldRate[] = [
  { purity: "24K (999)", description: "24K Gold (99.9%)", unit: "Gram", buy: "12,400", sell: "12,500", making: "300", status: "Active" },
  { purity: "22K (916)", description: "22K Gold (91.6%)", unit: "Gram", buy: "10,880", sell: "10,980", making: "280", status: "Active" },
  { purity: "21K (875)", description: "21K Gold (87.5%)", unit: "Gram", buy: "10,380", sell: "10,480", making: "250", status: "Active" },
  { purity: "18K (750)", description: "18K Gold (75.0%)", unit: "Gram", buy: "8,850", sell: "8,920", making: "200", status: "Active" },
  { purity: "14K (585)", description: "14K Gold (58.5%)", unit: "Gram", buy: "6,750", sell: "6,820", making: "150", status: "Active" },
];
export const goldTrend = [10420, 10570, 10720, 10730, 10660, 10840, 10920] as const;
export const goldTrendLabels = ["20 May", "21 May", "22 May", "23 May", "24 May", "25 May", "26 May"] as const;

export const karigarMetrics: readonly Metric[] = [
  { label: "Total Karigar", value: "24", note: "All Karigar" },
  { label: "Total Payable", value: "৳ 2,45,600", note: "All Karigar" },
  { label: "Paid This Month", value: "৳ 1,78,250", note: "This Month" },
  { label: "Due This Month", value: "৳ 67,350", note: "This Month" },
  { label: "Total Payment", value: "৳ 1,15,500", note: "This Month" },
];
export type KarigarLedger = {
  id: string; name: string; phone: string; work: string; paid: string; due: string; status: "Due" | "Paid";
};
export const karigarLedger: readonly KarigarLedger[] = [
  { id: "KAR-1001", name: "Jahirul Karigar", phone: "01712-345678", work: "48,500", paid: "38,500", due: "10,000", status: "Due" },
  { id: "KAR-1002", name: "Salim Karigar", phone: "01723-456789", work: "32,000", paid: "20,000", due: "12,000", status: "Due" },
  { id: "KAR-1003", name: "Monir Karigar", phone: "01734-567890", work: "28,600", paid: "28,600", due: "0", status: "Paid" },
  { id: "KAR-1004", name: "Aminul Karigar", phone: "01756-789012", work: "18,750", paid: "10,000", due: "8,750", status: "Due" },
  { id: "KAR-1005", name: "Nurul Islam", phone: "01765-432109", work: "22,400", paid: "20,400", due: "2,000", status: "Due" },
  { id: "KAR-1006", name: "Hossain Karigar", phone: "01780-012345", work: "16,200", paid: "16,200", due: "0", status: "Paid" },
];

export const dueMetrics: readonly Metric[] = [
  { label: "Total Customers", value: "1,248", note: "All Customers" },
  { label: "Total Due", value: "৳ 6,78,900", note: "All Customers" },
  { label: "Overdue Amount", value: "৳ 2,15,600", note: "87 Customers" },
  { label: "Collected This Month", value: "৳ 2,45,300", note: "This Month" },
  { label: "Due This Month", value: "৳ 98,750", note: "This Month" },
];
export type CustomerDue = {
  id: string; name: string; phone: string; purchase: string; paid: string; due: string; date: string; status: "Due" | "Overdue";
};
export const customerDues: readonly CustomerDue[] = [
  { id: "CUS-1001", name: "Rahim Ahmed", phone: "01712-111111", purchase: "2,48,750", paid: "1,48,750", due: "1,00,000", date: "15 Jun 2025", status: "Overdue" },
  { id: "CUS-1002", name: "Sadia Akter", phone: "01723-222222", purchase: "1,85,200", paid: "1,00,000", due: "85,200", date: "20 Jun 2025", status: "Due" },
  { id: "CUS-1003", name: "Karim Uddin", phone: "01734-333333", purchase: "1,42,400", paid: "62,400", due: "80,000", date: "10 Jun 2025", status: "Overdue" },
  { id: "CUS-1004", name: "Nusrat Jahan", phone: "01745-444444", purchase: "1,23,450", paid: "83,450", due: "40,000", date: "05 Jun 2025", status: "Due" },
  { id: "CUS-1005", name: "Mohammad Ali", phone: "01756-555555", purchase: "98,200", paid: "48,200", due: "50,000", date: "18 Jun 2025", status: "Due" },
  { id: "CUS-1006", name: "Anika Rahman", phone: "01767-666666", purchase: "85,000", paid: "35,000", due: "50,000", date: "25 Jun 2025", status: "Due" },
];
export const aging = [
  { label: "0 - 30 Days", amount: "৳ 2,56,900", percent: 37, color: "#0e7bea" },
  { label: "31 - 60 Days", amount: "৳ 1,44,700", percent: 21, color: "#25aa76" },
  { label: "61 - 90 Days", amount: "৳ 1,54,300", percent: 20, color: "#f39a25" },
  { label: "90+ Days", amount: "৳ 1,23,000", percent: 22, color: "#ee4c49" },
] as const;
export const paymentMethods = [
  { label: "Cash", percent: 45, color: "#0e71e8" },
  { label: "Bank", percent: 30, color: "#28a976" },
  { label: "Card", percent: 15, color: "#f2a01f" },
  { label: "Other", percent: 10, color: "#964ec8" },
] as const;

export const backupMetrics: readonly Metric[] = [
  { label: "Last Backup", value: "26 May 2025 11:45 PM", note: "2.45 GB" },
  { label: "Next Scheduled Backup", value: "27 May 2025 11:00 PM", note: "Daily at 11:00 PM" },
  { label: "Total Backups", value: "32", note: "All Time" },
  { label: "Storage Used", value: "24.6 GB / 100 GB", note: "24.6% Used" },
  { label: "Auto Backup", value: "Enabled", note: "Daily" },
];
export type BackupRow = { name: string; date: string; size: string; type: "Manual" | "Scheduled"; status: "Success" };
export const backups: readonly BackupRow[] = [
  { name: "backup_2025_05_26_2345.sql", date: "26 May 2025 11:45 PM", size: "2.45 GB", type: "Manual", status: "Success" },
  { name: "backup_2025_05_25_2300.sql", date: "25 May 2025 11:00 PM", size: "2.36 GB", type: "Scheduled", status: "Success" },
  { name: "backup_2025_05_24_2300.sql", date: "24 May 2025 11:00 PM", size: "2.41 GB", type: "Scheduled", status: "Success" },
  { name: "backup_2025_05_23_2300.sql", date: "23 May 2025 11:00 PM", size: "2.38 GB", type: "Scheduled", status: "Success" },
  { name: "backup_2025_05_22_2300.sql", date: "22 May 2025 11:00 PM", size: "2.31 GB", type: "Scheduled", status: "Success" },
];
