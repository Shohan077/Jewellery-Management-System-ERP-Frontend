export type Metric = { label: string; value: string; note: string; trend?: string; tone?: "up" | "down" };

export const posMetrics: readonly Metric[] = [
  { label: "Today’s Sales", value: "৳ 2,48,750", note: "5 Invoices" },
  { label: "Today’s Collection", value: "৳ 2,10,000", note: "4 Receipts" },
  { label: "Today’s Return", value: "৳ 18,250", note: "2 Returns" },
  { label: "Due Collection", value: "৳ 1,38,400", note: "17 Customers" },
];

export type InvoiceItem = { id: number; product: string; sku: string; purity: string; weight: string; unitPrice: string; discount: string; amount: string };

export const invoiceItems: readonly InvoiceItem[] = [
  { id: 1, product: "Gold Necklace (22K)", sku: "NK-0022", purity: "22K", weight: "22.500 g", unitPrice: "৳ 9,200", discount: "৳ 2,000", amount: "৳ 2,05,000" },
  { id: 2, product: "Gold Earrings (22K)", sku: "ER-0021", purity: "22K", weight: "4.200 g", unitPrice: "৳ 9,100", discount: "৳ 0", amount: "৳ 38,220" },
  { id: 3, product: "Gold Ring (22K)", sku: "RG-0015", purity: "22K", weight: "3.800 g", unitPrice: "৳ 9,100", discount: "৳ 0", amount: "৳ 34,580" },
  { id: 4, product: "Making Charge", sku: "MC-01", purity: "–", weight: "–", unitPrice: "৳ 0", discount: "৳ 2,000", amount: "৳ 2,000" },
];

export const supplierMetrics: readonly Metric[] = [
  { label: "Total Suppliers", value: "128", note: "All Suppliers" },
  { label: "Active Suppliers", value: "96", note: "", trend: "75.00%", tone: "up" },
  { label: "Total Payable", value: "৳ 18,45,600", note: "All Suppliers" },
  { label: "Overdue Amount", value: "৳ 5,78,250", note: "36 Suppliers" },
  { label: "Paid This Month", value: "৳ 8,67,300", note: "All Suppliers" },
];

export type SupplierStatus = "Active" | "Paid" | "Overdue";
export type Supplier = { id: string; name: string; phone: string; type: string; totalPurchase: string; payable: string; status: SupplierStatus };
export const suppliers: readonly Supplier[] = [
  { id: "SUP-1001", name: "M/S Gold Palace", phone: "01712-345678", type: "Gold Supplier", totalPurchase: "৳ 12,45,600", payable: "৳ 3,45,200", status: "Active" },
  { id: "SUP-1002", name: "Shree Diamond", phone: "01723-456789", type: "Diamond Supplier", totalPurchase: "৳ 8,75,400", payable: "৳ 1,25,600", status: "Active" },
  { id: "SUP-1003", name: "Rahim Jewellers", phone: "01734-567890", type: "Gold Supplier", totalPurchase: "৳ 6,85,200", payable: "৳ 2,05,300", status: "Overdue" },
  { id: "SUP-1004", name: "J.P. Gold & Sons", phone: "01745-678901", type: "Gold Supplier", totalPurchase: "৳ 5,45,300", payable: "৳ 0", status: "Paid" },
  { id: "SUP-1005", name: "Classic Diamonds", phone: "01756-789012", type: "Diamond Supplier", totalPurchase: "৳ 4,15,600", payable: "৳ 95,000", status: "Active" },
  { id: "SUP-1006", name: "Royal Gold House", phone: "01767-890123", type: "Gold Supplier", totalPurchase: "৳ 3,25,400", payable: "৳ 0", status: "Paid" },
  { id: "SUP-1007", name: "Star Bullion", phone: "01778-901234", type: "Gold Supplier", totalPurchase: "৳ 2,85,600", payable: "৳ 50,000", status: "Active" },
  { id: "SUP-1008", name: "Sunrise Jewellers", phone: "01789-012345", type: "Gold Supplier", totalPurchase: "৳ 2,35,500", payable: "৳ 57,150", status: "Overdue" },
];

export const goldMetrics: readonly Metric[] = [
  { label: "Today’s Gold Rate (22K)", value: "৳ 10,980 /gram", note: "from yesterday", trend: "↑ 0.85%", tone: "up" },
  { label: "Today’s Gold Rate (24K)", value: "৳ 11,980 /gram", note: "from yesterday", trend: "↑ 0.90%", tone: "up" },
  { label: "Today’s Silver Rate (1g)", value: "৳ 128 /gram", note: "from yesterday", trend: "↑ 0.40%", tone: "down" },
  { label: "Total Gold Stock", value: "2,458.750 g", note: "All Purity" },
  { label: "Gold Value (Approx.)", value: "৳ 27,85,36,000", note: "At Current Rate" },
];

export type GoldStock = { purity: string; description: string; weight: string; pieces: number; rate: string; value: string; updated: string };
export const goldStock: readonly GoldStock[] = [
  { purity: "24K (999)", description: "24K Gold", weight: "785.650", pieces: 320, rate: "৳ 11,980", value: "৳ 94,03,987", updated: "26 May 2025 10:30 AM" },
  { purity: "22K (916)", description: "22K Gold", weight: "1,248.320", pieces: 542, rate: "৳ 10,980", value: "৳ 1,36,98,772", updated: "26 May 2025 10:30 AM" },
  { purity: "21K (875)", description: "21K Gold", weight: "245.300", pieces: 125, rate: "৳ 10,520", value: "৳ 25,77,456", updated: "26 May 2025 10:30 AM" },
  { purity: "18K (750)", description: "18K Gold", weight: "179.480", pieces: 98, rate: "৳ 8,980", value: "৳ 16,11,110", updated: "26 May 2025 10:30 AM" },
];

export const goldSlices = [
  { label: "24K (999)", value: 31.96, amount: "785.650 g", color: "#1476ed" },
  { label: "22K (916)", value: 50.82, amount: "1,248.320 g", color: "#29b6d9" },
  { label: "21K (875)", value: 9.98, amount: "245.300 g", color: "#f5a719" },
  { label: "18K (750)", value: 7.24, amount: "179.480 g", color: "#31b878" },
] as const;

export const goldTransactions = [
  { id: "GTR-10045", type: "Gold Purchase", amount: "250.000 g", tone: "normal" },
  { id: "GTR-10044", type: "Gold Sale", amount: "-120.000 g", tone: "danger" },
  { id: "GTR-10043", type: "Old Gold Purchase", amount: "75.000 g", tone: "normal" },
  { id: "GTR-10042", type: "Gold Transfer In", amount: "50.000 g", tone: "normal" },
  { id: "GTR-10041", type: "Gold Melting", amount: "-25.000 g", tone: "danger" },
] as const;
