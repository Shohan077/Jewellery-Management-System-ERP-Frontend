export type Accent = "blue" | "green" | "orange" | "violet" | "red" | "teal";

export type Metric = {
  label: string;
  value: string;
  note: string;
  accent: Accent;
  trend?: string;
};

export type ProductionStatus = "In Progress" | "Completed" | "Cancelled";

export type ProductionOrder = {
  id: string;
  product: string;
  karigar: string;
  dueDate: string;
  quantity: number;
  unit: "Pcs";
  status: ProductionStatus;
  progress: number;
};

export const productionMetrics: readonly Metric[] = [
  { label: "Total Orders", value: "156", note: "This Month", accent: "blue" },
  { label: "In Progress", value: "48", note: "", trend: "30.77%", accent: "green" },
  { label: "Completed", value: "96", note: "", trend: "61.54%", accent: "green" },
  { label: "Cancelled", value: "12", note: "", trend: "7.69%", accent: "green" },
  { label: "Wastage (g)", value: "245.60 g", note: "This Month", accent: "orange" },
];

export const productionTabs = ["All Orders", "In Progress", "Completed", "Cancelled"] as const;

export const productionOrders: readonly ProductionOrder[] = [
  { id: "PROD-10056", product: "Gold Ring (22K)", karigar: "Rashid Karigar", dueDate: "30 May 2025", quantity: 5, unit: "Pcs", status: "In Progress", progress: 35 },
  { id: "PROD-10055", product: "Gold Necklace (22K)", karigar: "Jahirul Karigar", dueDate: "28 May 2025", quantity: 2, unit: "Pcs", status: "In Progress", progress: 25 },
  { id: "PROD-10054", product: "Gold Bangle (22K)", karigar: "Salim Karigar", dueDate: "27 May 2025", quantity: 10, unit: "Pcs", status: "Completed", progress: 100 },
  { id: "PROD-10053", product: "Gold Earrings (22K)", karigar: "Rashid Karigar", dueDate: "26 May 2025", quantity: 12, unit: "Pcs", status: "Completed", progress: 100 },
  { id: "PROD-10052", product: "Gold Pendant (22K)", karigar: "Jahirul Karigar", dueDate: "25 May 2025", quantity: 8, unit: "Pcs", status: "Completed", progress: 100 },
  { id: "PROD-10051", product: "Gold Chain (22K)", karigar: "Monir Karigar", dueDate: "24 May 2025", quantity: 6, unit: "Pcs", status: "In Progress", progress: 60 },
  { id: "PROD-10050", product: "Gold Ring (22K)", karigar: "Salim Karigar", dueDate: "23 May 2025", quantity: 7, unit: "Pcs", status: "Cancelled", progress: 0 },
];

export type KarigarStatus = "Active" | "On Leave";

export type KarigarRow = {
  id: string;
  name: string;
  specialisation: string;
  phone: string;
  status: KarigarStatus;
  dueAmount: string;
  onWork: boolean;
};

export const karigarMetrics: readonly Metric[] = [
  { label: "Total Karigar", value: "24", note: "All Karigar", accent: "blue" },
  { label: "Active Karigar", value: "20", note: "", trend: "83.33%", accent: "green" },
  { label: "On Work", value: "15", note: "", trend: "62.50%", accent: "green" },
  { label: "Total Payable", value: "৳ 2,45,600", note: "This Month", accent: "violet" },
  { label: "Paid This Month", value: "৳ 1,78,250", note: "This Month", accent: "teal" },
];

export const karigarTabs = ["All Karigar", "On Work", "Payment Due"] as const;

export const karigarRows: readonly KarigarRow[] = [
  { id: "KAR-1001", name: "Rashid Karigar", specialisation: "Ring & Pendant", phone: "01712-345678", status: "Active", dueAmount: "৳ 25,600", onWork: true },
  { id: "KAR-1002", name: "Jahirul Karigar", specialisation: "Necklace & Chain", phone: "01723-456789", status: "Active", dueAmount: "৳ 32,450", onWork: true },
  { id: "KAR-1003", name: "Salim Karigar", specialisation: "Bangle & Bracelet", phone: "01734-567890", status: "Active", dueAmount: "৳ 18,200", onWork: true },
  { id: "KAR-1004", name: "Monir Karigar", specialisation: "Earrings", phone: "01745-678901", status: "Active", dueAmount: "৳ 22,100", onWork: true },
  { id: "KAR-1005", name: "Aminul Karigar", specialisation: "All Rounder", phone: "01756-789012", status: "On Leave", dueAmount: "৳ 0", onWork: false },
  { id: "KAR-1006", name: "Hossain Karigar", specialisation: "Ring & Chain", phone: "01767-890123", status: "Active", dueAmount: "৳ 28,300", onWork: true },
];

export type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  totalPurchase: string;
  totalDue: string;
  loyaltyPoints: number;
};

export const customerMetrics: readonly Metric[] = [
  { label: "Total Customers", value: "1,248", note: "All Customers", accent: "blue" },
  { label: "New This Month", value: "48", note: "", trend: "+10.34%", accent: "green" },
  { label: "Total Due", value: "৳ 6,78,900", note: "From 210 Customers", accent: "red" },
  { label: "Loyal Customers", value: "312", note: "", trend: "24.04%", accent: "violet" },
];

export const customerTabs = ["All Customers", "With Due", "Loyal Customers"] as const;

export const customerRows: readonly CustomerRow[] = [
  { id: "CUS-10001", name: "Rahim Ahmed", phone: "01712-111111", totalPurchase: "৳ 2,48,750", totalDue: "৳ 12,500", loyaltyPoints: 350 },
  { id: "CUS-10002", name: "Sadia Akter", phone: "01723-222222", totalPurchase: "৳ 1,85,200", totalDue: "৳ 0", loyaltyPoints: 820 },
  { id: "CUS-10003", name: "Karim Uddin", phone: "01734-333333", totalPurchase: "৳ 1,42,400", totalDue: "৳ 25,600", loyaltyPoints: 420 },
  { id: "CUS-10004", name: "Nusrat Jahan", phone: "01745-444444", totalPurchase: "৳ 1,23,450", totalDue: "৳ 8,900", loyaltyPoints: 610 },
  { id: "CUS-10005", name: "Mohammad Ali", phone: "01756-555555", totalPurchase: "৳ 98,200", totalDue: "৳ 15,800", loyaltyPoints: 210 },
  { id: "CUS-10006", name: "Anika Rahman", phone: "01767-666666", totalPurchase: "৳ 85,600", totalDue: "৳ 0", loyaltyPoints: 145 },
];

export const valuationMetrics: readonly Metric[] = [
  { label: "Total Stock Items", value: "1,145", note: "All Items", accent: "blue" },
  { label: "Total Quantity", value: "12,458.650 g", note: "All Units", accent: "green" },
  { label: "Total Stock Value", value: "৳ 12,45,200", note: "At Current Rate", accent: "blue" },
  { label: "Gold Stock Value", value: "৳ 9,85,600", note: "", trend: "79.17%", accent: "orange" },
  { label: "Diamond Stock Value", value: "৳ 2,39,600", note: "", trend: "↑ 19.23%", accent: "violet" },
  { label: "Others Stock Value", value: "৳ 20,000", note: "", trend: "↑ 1.60%", accent: "teal" },
];

export const valuationSlices = [
  { label: "Gold Jewellery", value: 79.17, displayValue: "৳ 9,85,600 (79.17%)", color: "#1174ed" },
  { label: "Diamond", value: 19.23, displayValue: "৳ 2,39,600 (19.23%)", color: "#38b77b" },
  { label: "Others", value: 1.6, displayValue: "৳ 20,000 (1.60%)", color: "#f1a51c" },
] as const;

export const valuationTrend = {
  labels: ["Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"],
  values: [8.2, 10.1, 11.8, 10.1, 11.9, 14.0],
} as const;

export const stockSummary = [
  { category: "Gold Jewellery", items: "785", quantity: "9,856.450 g", unit: "Gram", averageRate: "৳ 9,998", value: "৳ 9,85,600", percentage: "79.17%" },
  { category: "Diamond", items: "245", quantity: "2,150.300 ct", unit: "Carat", averageRate: "৳ 1,11,400", value: "৳ 2,39,600", percentage: "19.23%" },
  { category: "Others", items: "115", quantity: "452.000 pcs", unit: "Pcs", averageRate: "৳ 44.25", value: "৳ 20,000", percentage: "1.60%" },
] as const;
