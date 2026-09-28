export type Accent = "blue" | "green" | "amber" | "violet" | "red" | "cyan";

export type Metric = {
  label: string;
  value: string;
  note?: string;
  trend?: string;
  accent: Accent;
};

export const dashboardMetrics: readonly Metric[] = [
  { label: "Total Sales", value: "৳ 2,48,750", trend: "↑ 12.5%", note: "from last week", accent: "blue" },
  { label: "Total Purchase", value: "৳ 1,32,600", trend: "↑ 8.3%", note: "from last week", accent: "green" },
  { label: "Total Stock Value", value: "৳ 12,45,200", trend: "↑ 5.7%", note: "from last week", accent: "violet" },
  { label: "Total Profit", value: "৳ 82,320", trend: "↑ 15.2%", note: "from last week", accent: "amber" },
];

export const salesOverview = [62, 76, 112, 98, 139, 121, 154, 182] as const;
export const salesOverviewLabels = ["May 20", "May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"] as const;

export const goldRates = [
  { purity: "24K (999)", price: "৳ 11,980 /gm" },
  { purity: "22K (916)", price: "৳ 10,980 /gm" },
  { purity: "21K (875)", price: "৳ 10,520 /gm" },
  { purity: "18K (750)", price: "৳ 8,980 /gm" },
] as const;

export type RecentSale = {
  invoice: string;
  customer: string;
  date: string;
  amount: string;
  status: "Paid" | "Due";
};

export const recentSales: readonly RecentSale[] = [
  { invoice: "INV-10045", customer: "Rahim Ahmed", date: "26 May 2025 11:24 AM", amount: "৳ 48,750", status: "Paid" },
  { invoice: "INV-10044", customer: "Sadia Akter", date: "26 May 2025 10:35 AM", amount: "৳ 32,600", status: "Paid" },
  { invoice: "INV-10043", customer: "Karim Uddin", date: "26 May 2025 09:12 AM", amount: "৳ 18,450", status: "Paid" },
  { invoice: "INV-10042", customer: "Nusrat Jahan", date: "25 May 2025 04:18 PM", amount: "৳ 27,300", status: "Due" },
];

export const topSellingProducts = [
  { product: "Gold Ring (22K)", quantity: 12, kind: "ring" },
  { product: "Necklace (21K)", quantity: 8, kind: "necklace" },
  { product: "Diamond Pendant", quantity: 5, kind: "pendant" },
  { product: "Bangle (18K)", quantity: 4, kind: "bangle" },
  { product: "Earrings (22K)", quantity: 3, kind: "earrings" },
] as const;

export type ProductKind = "ring" | "necklace" | "pendant" | "bangle" | "earrings" | "chain" | "bracelet" | "set";

export type SaleProduct = {
  sku: string;
  name: string;
  category: "Gold" | "Diamond";
  rate: number;
  kind: ProductKind;
};

export const saleProducts: readonly SaleProduct[] = [
  { sku: "GR-001", name: "Gold Ring", category: "Gold", rate: 45000, kind: "ring" },
  { sku: "NK-002", name: "Necklace", category: "Gold", rate: 85000, kind: "necklace" },
  { sku: "DP-003", name: "Diamond Pendant", category: "Diamond", rate: 120000, kind: "pendant" },
  { sku: "BG-004", name: "Bangle", category: "Gold", rate: 65000, kind: "bangle" },
  { sku: "ER-005", name: "Earrings", category: "Gold", rate: 42000, kind: "earrings" },
  { sku: "CH-006", name: "Chain", category: "Gold", rate: 38000, kind: "chain" },
  { sku: "BR-007", name: "Bracelet", category: "Gold", rate: 55000, kind: "bracelet" },
  { sku: "MR-008", name: "Men's Ring", category: "Gold", rate: 48000, kind: "ring" },
  { sku: "PS-009", name: "Pendant Set", category: "Gold", rate: 110000, kind: "set" },
];

export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type InventoryRow = {
  id: number;
  name: string;
  category: "Jewelry" | "Diamond" | "Gold";
  sku: string;
  quantity: number;
  location: "Main Store" | "Showroom" | "Warehouse";
  status: InventoryStatus;
};

export const inventoryRows: readonly InventoryRow[] = [
  { id: 1, name: "Gold Ring (22K)", category: "Jewelry", sku: "GR-001", quantity: 15, location: "Main Store", status: "In Stock" },
  { id: 2, name: "Necklace (21K)", category: "Jewelry", sku: "NK-002", quantity: 8, location: "Main Store", status: "In Stock" },
  { id: 3, name: "Diamond Pendant", category: "Diamond", sku: "DP-003", quantity: 5, location: "Showroom", status: "In Stock" },
  { id: 4, name: "Bangle (18K)", category: "Jewelry", sku: "BG-004", quantity: 12, location: "Main Store", status: "In Stock" },
  { id: 5, name: "Earrings (22K)", category: "Jewelry", sku: "ER-005", quantity: 3, location: "Main Store", status: "Low Stock" },
  { id: 6, name: "Chain (21K)", category: "Jewelry", sku: "CH-006", quantity: 20, location: "Warehouse", status: "In Stock" },
  { id: 7, name: "Bracelet (18K)", category: "Jewelry", sku: "BR-007", quantity: 8, location: "Main Store", status: "In Stock" },
  { id: 8, name: "Men's Ring", category: "Jewelry", sku: "MR-008", quantity: 0, location: "Main Store", status: "Out of Stock" },
  { id: 9, name: "Pendant Set", category: "Jewelry", sku: "PS-009", quantity: 6, location: "Showroom", status: "In Stock" },
  { id: 10, name: "Gold Bar (24K)", category: "Gold", sku: "GB-010", quantity: 25, location: "Warehouse", status: "In Stock" },
];

export const reportMetrics: readonly Metric[] = [
  { label: "Total Sales", value: "৳ 18,45,320", trend: "↑ 14.2%", note: "vs. previous period", accent: "blue" },
  { label: "Total Purchase", value: "৳ 10,32,600", trend: "↑ 9.8%", note: "vs. previous period", accent: "green" },
  { label: "Total Profit", value: "৳ 8,12,720", trend: "↑ 18.6%", note: "vs. previous period", accent: "violet" },
  { label: "Total Orders", value: "186", trend: "↑ 11.3%", note: "vs. previous period", accent: "amber" },
];

export const salesPurchaseComparison = {
  labels: ["May 01", "May 05", "May 10", "May 15", "May 20", "May 25"],
  sales: [10, 13.5, 12.2, 12.8, 18.1, 12.3],
  purchase: [7.5, 9.2, 9.8, 8.6, 10.9, 9.1],
} as const;

export const categorySlices = [
  { color: "#1673ed", label: "Gold", value: 42 },
  { color: "#3b8eee", label: "Diamond", value: 22 },
  { color: "#f1a526", label: "Jewellery", value: 18 },
  { color: "#f36c51", label: "Bangles", value: 10 },
  { color: "#ad61d7", label: "Others", value: 8 },
] as const;

export const topCustomers = [
  { name: "Rahim Ahmed", purchase: "৳ 2,48,750", orders: 12 },
  { name: "Sadia Akter", purchase: "৳ 1,85,200", orders: 9 },
  { name: "Karim Uddin", purchase: "৳ 1,42,600", orders: 7 },
  { name: "Nusrat Jahan", purchase: "৳ 1,23,450", orders: 6 },
  { name: "Mohammad Ali", purchase: "৳ 98,200", orders: 5 },
] as const;

export const reportActivities = [
  { text: "Sale completed - INV-10045", date: "26 May 2025 11:24 AM", accent: "blue" as const },
  { text: "Purchase added - Supplier: Rahman Jewellers", date: "26 May 2025 10:12 AM", accent: "cyan" as const },
  { text: "Stock updated - Gold Ring (22K)", date: "26 May 2025 09:45 AM", accent: "green" as const },
  { text: "New customer registered - Ayesha Khan", date: "26 May 2025 09:20 AM", accent: "violet" as const },
  { text: "Payment received - INV-10042", date: "25 May 2025 05:10 PM", accent: "green" as const },
  { text: "Stock alert resolved - Earrings (22K)", date: "25 May 2025 03:40 PM", accent: "amber" as const },
] as const;

