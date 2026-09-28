export type Accent = "blue" | "green" | "amber" | "violet" | "red" | "cyan";

export type Metric = {
  label: string;
  value: string;
  note: string;
  trend?: string;
  accent: Accent;
};

export type PurchaseStatus = "Paid" | "Partial" | "Due";
export type PurchaseType = "Gold" | "Diamond" | "Other" | "Return";

export type PurchaseRow = {
  bill: string;
  supplier: string;
  type: PurchaseType;
  date: string;
  amount: string;
  paid: string;
  due: string;
  status: PurchaseStatus;
};

export const purchaseMetrics: readonly Metric[] = [
  { label: "Total Purchases", value: "৳ 10,32,600", trend: "↑ 9.8%", note: "from last month", accent: "blue" },
  { label: "Total Suppliers", value: "38", note: "Active Suppliers", accent: "green" },
  { label: "Pending Bills", value: "৳ 1,24,500", note: "Due Amount", accent: "amber" },
  { label: "Returned Amount", value: "৳ 32,450", note: "This Month", accent: "red" },
];

export const purchaseTabs = ["All Purchases", "Gold Purchase", "Diamond Purchase", "Other Purchase", "Purchase Return"] as const;

export const purchaseRows: readonly PurchaseRow[] = [
  { bill: "PUR-10056", supplier: "M/S Gold Palace", type: "Gold", date: "26 May 2025", amount: "৳ 2,45,000", paid: "৳ 1,50,000", due: "৳ 95,000", status: "Partial" },
  { bill: "PUR-10055", supplier: "Shree Diamond", type: "Diamond", date: "26 May 2025", amount: "৳ 1,85,000", paid: "৳ 1,85,000", due: "৳ 0", status: "Paid" },
  { bill: "PUR-10054", supplier: "Gold World Ltd.", type: "Gold", date: "25 May 2025", amount: "৳ 1,32,000", paid: "৳ 1,00,000", due: "৳ 32,000", status: "Partial" },
  { bill: "PUR-10053", supplier: "R.K. Jewellers", type: "Other", date: "25 May 2025", amount: "৳ 65,000", paid: "৳ 65,000", due: "৳ 0", status: "Paid" },
  { bill: "PUR-10052", supplier: "Shree Diamond", type: "Diamond", date: "24 May 2025", amount: "৳ 2,15,000", paid: "৳ 1,00,000", due: "৳ 1,15,000", status: "Partial" },
  { bill: "PUR-10051", supplier: "M/S Gold Palace", type: "Gold", date: "24 May 2025", amount: "৳ 2,90,000", paid: "৳ 2,90,000", due: "৳ 0", status: "Paid" },
  { bill: "PUR-10050", supplier: "R.K. Jewellers", type: "Other", date: "23 May 2025", amount: "৳ 50,600", paid: "৳ 25,600", due: "৳ 25,000", status: "Partial" },
  { bill: "PUR-10049", supplier: "Gold World Ltd.", type: "Gold", date: "23 May 2025", amount: "৳ 1,50,000", paid: "৳ 0", due: "৳ 1,50,000", status: "Due" },
];

export const goldMetrics: readonly Metric[] = [
  { label: "Today’s Gold Rate (22K)", value: "৳ 10,980", trend: "↑ 0.85%", note: "from yesterday", accent: "blue" },
  { label: "Today’s Gold Rate (24K)", value: "৳ 11,980", trend: "↑ 0.90%", note: "from yesterday", accent: "green" },
  { label: "Today’s Silver Rate", value: "৳ 128", trend: "↑ 0.40%", note: "from yesterday", accent: "cyan" },
  { label: "Active Purities", value: "4", note: "18K, 21K, 22K, 24K", accent: "violet" },
];

export const goldTabs = ["Gold Rates", "Purity", "Unit Conversion", "Making Charge"] as const;

export type GoldRate = {
  date: string;
  eighteen: string;
  twentyOne: string;
  twentyTwo: string;
  twentyFour: string;
  silver: string;
};

export const goldRateRows: readonly GoldRate[] = [
  { date: "26 May 2025", eighteen: "8,980", twentyOne: "10,520", twentyTwo: "10,980", twentyFour: "11,980", silver: "128" },
  { date: "25 May 2025", eighteen: "8,900", twentyOne: "10,420", twentyTwo: "10,890", twentyFour: "11,890", silver: "127" },
  { date: "24 May 2025", eighteen: "8,850", twentyOne: "10,350", twentyTwo: "10,795", twentyFour: "11,795", silver: "126" },
  { date: "23 May 2025", eighteen: "8,820", twentyOne: "10,300", twentyTwo: "10,740", twentyFour: "11,740", silver: "125" },
  { date: "22 May 2025", eighteen: "8,760", twentyOne: "10,230", twentyTwo: "10,660", twentyFour: "11,660", silver: "125" },
];

export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type InventoryRow = {
  sku: string;
  name: string;
  category: string;
  purity: string;
  weight: string;
  quantity: number;
  unit: "Gram" | "Carat";
  stockValue: string;
  status: InventoryStatus;
  location: "Main Store" | "Showroom" | "Warehouse";
};

export const inventoryMetrics: readonly Metric[] = [
  { label: "Total Items", value: "1,248", note: "All Items", accent: "blue" },
  { label: "Total Stock Value", value: "৳ 12,45,200", note: "Current Value", accent: "blue" },
  { label: "Low Stock Items", value: "56", note: "Reorder Soon", accent: "amber" },
  { label: "Out of Stock Items", value: "12", note: "No Stock", accent: "red" },
];

export const inventoryRows: readonly InventoryRow[] = [
  { sku: "GR-001", name: "Gold Ring", category: "Ring", purity: "22K", weight: "5.250", quantity: 12, unit: "Gram", stockValue: "৳ 68,670", status: "In Stock", location: "Main Store" },
  { sku: "NK-002", name: "Gold Necklace", category: "Necklace", purity: "22K", weight: "18.600", quantity: 8, unit: "Gram", stockValue: "৳ 2,43,336", status: "In Stock", location: "Main Store" },
  { sku: "BN-003", name: "Gold Bangle", category: "Bangle", purity: "22K", weight: "10.200", quantity: 15, unit: "Gram", stockValue: "৳ 1,33,656", status: "In Stock", location: "Showroom" },
  { sku: "ER-004", name: "Gold Earrings", category: "Earring", purity: "22K", weight: "3.450", quantity: 20, unit: "Gram", stockValue: "৳ 45,214", status: "In Stock", location: "Main Store" },
  { sku: "PEN-005", name: "Gold Pendant", category: "Pendant", purity: "22K", weight: "2.750", quantity: 10, unit: "Gram", stockValue: "৳ 36,082", status: "Low Stock", location: "Showroom" },
  { sku: "CHN-006", name: "Gold Chain", category: "Chain", purity: "22K", weight: "12.300", quantity: 4, unit: "Gram", stockValue: "৳ 1,61,352", status: "Low Stock", location: "Warehouse" },
  { sku: "RM-007", name: "Gold Coin", category: "Coin", purity: "24K", weight: "1.000", quantity: 0, unit: "Gram", stockValue: "৳ 11,980", status: "Out of Stock", location: "Main Store" },
  { sku: "DM-008", name: "Diamond Ring", category: "Ring", purity: "—", weight: "1.250", quantity: 6, unit: "Carat", stockValue: "৳ 95,000", status: "In Stock", location: "Showroom" },
];

export const reportTabs = ["Overview", "Sales Report", "Purchase Report", "Stock Report", "Profit & Loss", "Cash Flow", "Customer Report"] as const;

export const reportMetrics: readonly Metric[] = [
  { label: "Total Sales", value: "৳ 18,45,320", trend: "↑ 14.2%", note: "vs last period", accent: "blue" },
  { label: "Total Purchase", value: "৳ 10,32,600", trend: "↑ 9.8%", note: "vs last period", accent: "cyan" },
  { label: "Gross Profit", value: "৳ 8,12,720", trend: "↑ 18.6%", note: "vs last period", accent: "green" },
  { label: "Net Profit", value: "৳ 6,21,450", trend: "↑ 16.3%", note: "vs last period", accent: "green" },
];

export const salesTrend = {
  labels: ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"],
  sales: [1.5, 1.35, 1.45, 1.62, 1.4, 1.68],
  purchase: [0.9, 1.02, 0.84, 1.04, 0.92, 1.22],
} as const;

export const categorySlices = [
  { color: "#1475ed", label: "Rings", value: 32 },
  { color: "#3c91ed", label: "Necklaces", value: 26 },
  { color: "#f2a521", label: "Bangles", value: 18 },
  { color: "#f36b5f", label: "Pendants", value: 14 },
  { color: "#aa63d7", label: "Others", value: 10 },
] as const;

export const topProducts = [
  { product: "Gold Ring (22K)", category: "Ring", quantity: 125, amount: "৳ 4,25,000" },
  { product: "Gold Necklace (22K)", category: "Necklace", quantity: 68, amount: "৳ 3,20,000" },
  { product: "Gold Bangle (22K)", category: "Bangle", quantity: 82, amount: "৳ 2,45,000" },
  { product: "Gold Earrings (22K)", category: "Earring", quantity: 96, amount: "৳ 1,85,000" },
  { product: "Gold Pendant (22K)", category: "Pendant", quantity: 74, amount: "৳ 1,45,000" },
] as const;

export const reportActivities = [
  { text: "Sales invoice INV-10057 created", date: "26 May 2025 11:20 AM", accent: "blue" as const },
  { text: "Purchase bill PUR-10056 added", date: "26 May 2025 10:45 AM", accent: "cyan" as const },
  { text: "Gold rate updated (22K)", date: "26 May 2025 09:30 AM", accent: "amber" as const },
  { text: "Stock item GR-001 quantity updated", date: "26 May 2025 09:15 AM", accent: "violet" as const },
  { text: "Customer payment received (RCPT-10026)", date: "26 May 2025 08:50 AM", accent: "green" as const },
] as const;
