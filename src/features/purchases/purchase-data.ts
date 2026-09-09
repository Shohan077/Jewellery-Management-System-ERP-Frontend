export type PurchaseStage = "Draft" | "Posted" | "Returned" | "Pending";
export type PurchasePaymentStatus = "Paid" | "Partial" | "Due";

export type PurchaseInvoice = {
  id: number;
  date: string;
  isoDate: string;
  invoiceNo: string;
  supplier: string;
  totalAmount: number;
  paymentStatus: PurchasePaymentStatus;
  stage: PurchaseStage;
};

const featuredPurchases: PurchaseInvoice[] = [
  { id: 1, date: "30 Apr 2025", isoDate: "2025-04-30", invoiceNo: "PI-000125", supplier: "Ali Gold Traders", totalAmount: 875_000, paymentStatus: "Paid", stage: "Posted" },
  { id: 2, date: "29 Apr 2025", isoDate: "2025-04-29", invoiceNo: "PI-000124", supplier: "Diamond House Ltd.", totalAmount: 1_240_000, paymentStatus: "Partial", stage: "Posted" },
  { id: 3, date: "28 Apr 2025", isoDate: "2025-04-28", invoiceNo: "PI-000123", supplier: "Rahman Jewellers", totalAmount: 620_000, paymentStatus: "Paid", stage: "Posted" },
  { id: 4, date: "27 Apr 2025", isoDate: "2025-04-27", invoiceNo: "PI-000122", supplier: "Shah Gold", totalAmount: 910_000, paymentStatus: "Due", stage: "Posted" },
  { id: 5, date: "26 Apr 2025", isoDate: "2025-04-26", invoiceNo: "PI-000121", supplier: "Khan & Sons", totalAmount: 716_000, paymentStatus: "Paid", stage: "Posted" },
  { id: 6, date: "25 Apr 2025", isoDate: "2025-04-25", invoiceNo: "PI-000120", supplier: "Gold Line BD", totalAmount: 375_000, paymentStatus: "Partial", stage: "Posted" },
  { id: 7, date: "24 Apr 2025", isoDate: "2025-04-24", invoiceNo: "PI-000119", supplier: "Diamond World", totalAmount: 1_120_000, paymentStatus: "Paid", stage: "Posted" },
  { id: 8, date: "23 Apr 2025", isoDate: "2025-04-23", invoiceNo: "PI-000118", supplier: "M/S. Jewel Mart", totalAmount: 560_000, paymentStatus: "Due", stage: "Posted" },
  { id: 9, date: "22 Apr 2025", isoDate: "2025-04-22", invoiceNo: "PI-000117", supplier: "Trust Gold Supply", totalAmount: 795_000, paymentStatus: "Paid", stage: "Posted" },
  { id: 10, date: "21 Apr 2025", isoDate: "2025-04-21", invoiceNo: "PI-000116", supplier: "Prime Diamond", totalAmount: 425_000, paymentStatus: "Paid", stage: "Posted" },
];

const supplierNames = [
  "Bengal Gold Traders",
  "Royal Bullion House",
  "Eastern Jewels Ltd.",
  "Dhaka Diamond Co.",
  "Safa Gold Enterprise",
  "New Market Jewellers",
  "Ornament Supply BD",
  "Heritage Gems",
];

const generatedPurchases = Array.from({ length: 1_235 }, (_, generatedIndex): PurchaseInvoice => {
  const day = 30 - (generatedIndex % 30);
  const stage: PurchaseStage = generatedIndex < 970
    ? "Posted"
    : generatedIndex < 995
      ? "Draft"
      : generatedIndex < 1_050
        ? "Returned"
        : "Pending";
  const paymentStatus: PurchasePaymentStatus = generatedIndex % 9 === 0
    ? "Due"
    : generatedIndex % 5 === 0
      ? "Partial"
      : "Paid";

  return {
    id: featuredPurchases.length + generatedIndex + 1,
    date: `${String(day).padStart(2, "0")} Apr 2025`,
    isoDate: `2025-04-${String(day).padStart(2, "0")}`,
    invoiceNo: `PI-${String(1_245 - generatedIndex).padStart(6, "0")}`,
    supplier: supplierNames[generatedIndex % supplierNames.length],
    totalAmount: 285_000 + (generatedIndex % 19) * 47_500,
    paymentStatus,
    stage,
  };
});

export const purchaseInvoices: PurchaseInvoice[] = [...featuredPurchases, ...generatedPurchases];

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
};

export const suppliers: Supplier[] = [
  { id: "ali-gold", name: "Ali Gold Traders", contactPerson: "Ali Hossain", phone: "01711-223344", address: "New Market, Dhaka, Bangladesh" },
  { id: "diamond-house", name: "Diamond House Ltd.", contactPerson: "Karim Uddin", phone: "01812-556677", address: "Bashundhara City, Dhaka" },
  { id: "rahman", name: "Rahman Jewellers", contactPerson: "Abdul Rahman", phone: "01914-887766", address: "Baitul Mukarram, Dhaka" },
  { id: "gold-line", name: "Gold Line BD", contactPerson: "Nizam Uddin", phone: "01675-112233", address: "Chattogram, Bangladesh" },
];

export type PurchaseProduct = {
  id: string;
  name: string;
  code: string;
  purity: string;
  weight: number;
  rate: number;
};

export const purchaseProductCatalog: PurchaseProduct[] = [
  { id: "gold-necklace", name: "Gold Necklace", code: "GN-001", purity: "22K", weight: 12.5, rate: 7_800 },
  { id: "gold-ring", name: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, rate: 7_900 },
  { id: "gold-earring", name: "Gold Earring", code: "GE-003", purity: "21K", weight: 6.3, rate: 7_650 },
  { id: "gold-bracelet", name: "Gold Bracelet", code: "GB-004", purity: "22K", weight: 8.2, rate: 7_850 },
  { id: "gold-chain", name: "Gold Chain", code: "GC-005", purity: "22K", weight: 10, rate: 7_750 },
];

export const initialPurchaseProducts = purchaseProductCatalog.slice(0, 2);

export const materialPurchaseProducts: PurchaseProduct[] = [
  { id: "gold-bar-material", name: "Gold Bar", code: "GB-001", purity: "22K", weight: 50, rate: 8_420 },
  { id: "gold-chain-material", name: "Gold Chain", code: "GC-002", purity: "22K", weight: 25, rate: 8_450 },
  { id: "raw-gold-material", name: "Raw Gold", code: "GC-003", purity: "24K", weight: 100, rate: 8_600 },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPurchaseCurrency(value: number) {
  return `৳ ${currencyFormatter.format(value)}`;
}

export function getPurchaseProductTotal(product: PurchaseProduct) {
  return Math.round(product.weight * product.rate);
}
