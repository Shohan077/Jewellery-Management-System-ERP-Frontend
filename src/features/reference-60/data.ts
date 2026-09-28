export const recentSales = [
  { id: 1, invoice: "INV-10045", date: "18 May, 2024", customer: "Rahim Khan", amount: "85,000", payment: "Cash", status: "Paid" },
  { id: 2, invoice: "INV-10044", date: "18 May, 2024", customer: "Sadia Akter", amount: "1,25,000", payment: "Card", status: "Paid" },
  { id: 3, invoice: "INV-10043", date: "17 May, 2024", customer: "Fahim Ahmed", amount: "65,000", payment: "Cash", status: "Paid" },
  { id: 4, invoice: "INV-10042", date: "17 May, 2024", customer: "Jannat Islam", amount: "45,000", payment: "bKash", status: "Paid" },
  { id: 5, invoice: "INV-10041", date: "16 May, 2024", customer: "Aminul Haque", amount: "95,000", payment: "Cash", status: "Paid" },
] as const;

export const lowStockItems = [
  { item: "Gold Chain 22K", stock: "12.25 gm", minimum: "20 gm" },
  { item: "Diamond Ring", stock: "2 Pcs", minimum: "5 Pcs" },
  { item: "Gold Earring 21K", stock: "5.42 gm", minimum: "15 gm" },
  { item: "Silver Necklace", stock: "3 Pcs", minimum: "8 Pcs" },
] as const;

export type PosItem = {
  id: number;
  name: string;
  purity: string;
  weight: number;
  rate: number;
  making: number;
  amount: number;
};

export const posSeed: PosItem[] = [
  { id: 1, name: "Gold Chain 22K", purity: "22K", weight: 10.250, rate: 7950, making: 1200, amount: 82238 },
  { id: 2, name: "Gold Ring 21K", purity: "21K", weight: 3.500, rate: 7700, making: 800, amount: 27750 },
  { id: 3, name: "Gold Earring 22K", purity: "22K", weight: 4.200, rate: 7950, making: 600, amount: 33390 },
];

export type StockRecord = {
  id: number;
  sku: string;
  item: string;
  category: string;
  purity: string;
  quantity: string;
  unit: string;
  rate: string;
  total: string;
  status: "In Stock" | "Low Stock";
};

export const stockRecords: StockRecord[] = [
  { id: 1, sku: "GCH-22K-001", item: "Gold Chain 22K", category: "Gold Jewellery", purity: "22K", quantity: "10.250", unit: "gm", rate: "7,950", total: "81,487", status: "In Stock" },
  { id: 2, sku: "GRN-21K-002", item: "Gold Ring 21K", category: "Gold Jewellery", purity: "21K", quantity: "3.500", unit: "gm", rate: "7,700", total: "26,950", status: "In Stock" },
  { id: 3, sku: "GER-22K-003", item: "Gold Earring 22K", category: "Gold Jewellery", purity: "22K", quantity: "4.200", unit: "gm", rate: "7,950", total: "33,390", status: "In Stock" },
  { id: 4, sku: "DIA-RNG-001", item: "Diamond Ring", category: "Diamond Jewellery", purity: "–", quantity: "1 Pcs", unit: "Pcs", rate: "45,000", total: "45,000", status: "In Stock" },
  { id: 5, sku: "DIA-NCK-001", item: "Diamond Necklace", category: "Diamond Jewellery", purity: "–", quantity: "1 Pcs", unit: "Pcs", rate: "1,25,000", total: "1,25,000", status: "In Stock" },
  { id: 6, sku: "SIL-NCK-001", item: "Silver Necklace", category: "Silver Jewellery", purity: "–", quantity: "1 Pcs", unit: "Pcs", rate: "2,500", total: "2,500", status: "In Stock" },
  { id: 7, sku: "RM-GOLD-001", item: "Gold Raw Material", category: "Raw Material", purity: "22K", quantity: "50.000", unit: "gm", rate: "7,950", total: "3,97,500", status: "In Stock" },
  { id: 8, sku: "RM-SILV-001", item: "Silver Raw Material", category: "Raw Material", purity: "–", quantity: "200.000", unit: "gm", rate: "95", total: "19,000", status: "In Stock" },
];

export type SalesDetail = {
  id: number;
  date: string;
  invoice: string;
  customer: string;
  category: string;
  amount: string;
  payment: string;
  status: "Paid";
};

export const salesDetails: SalesDetail[] = [
  { id: 1, date: "18 May, 2024", invoice: "INV-10045", customer: "Rahim Khan", category: "Gold Jewellery", amount: "85,000", payment: "Cash", status: "Paid" },
  { id: 2, date: "18 May, 2024", invoice: "INV-10044", customer: "Sadia Akter", category: "Diamond Jewellery", amount: "1,25,000", payment: "Card", status: "Paid" },
  { id: 3, date: "17 May, 2024", invoice: "INV-10043", customer: "Fahim Ahmed", category: "Gold Jewellery", amount: "65,000", payment: "Cash", status: "Paid" },
  { id: 4, date: "17 May, 2024", invoice: "INV-10042", customer: "Jannat Islam", category: "Silver Jewellery", amount: "45,000", payment: "bKash", status: "Paid" },
  { id: 5, date: "16 May, 2024", invoice: "INV-10041", customer: "Aminul Haque", category: "Gold Jewellery", amount: "95,000", payment: "Cash", status: "Paid" },
];

export const dashboardSlices = [
  { color: "#1687e8", label: "Gold Jewellery", value: 45 },
  { color: "#26a5dd", label: "Diamond Jewellery", value: 25 },
  { color: "#f6b51c", label: "Silver Jewellery", value: 15 },
  { color: "#f36b3d", label: "Others", value: 15 },
] as const;

export const stockSlices = [
  { color: "#1687e8", label: "Gold Jewellery", value: 45 },
  { color: "#2f9cdb", label: "Diamond Jewellery", value: 25 },
  { color: "#ffb914", label: "Raw Material", value: 15 },
  { color: "#ef4776", label: "Silver Jewellery", value: 10 },
  { color: "#9aa8b6", label: "Others", value: 5 },
] as const;

export const salesSlices = [
  { color: "#1687e8", label: "Gold Jewellery", value: 55 },
  { color: "#259fdd", label: "Diamond Jewellery", value: 25 },
  { color: "#f5b51d", label: "Silver Jewellery", value: 10 },
  { color: "#f36b3d", label: "Others", value: 10 },
] as const;
