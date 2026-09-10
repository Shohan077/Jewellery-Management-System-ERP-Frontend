export type PurchaseOrderStatus = "Pending" | "Approved" | "Received" | "Partial" | "Cancelled";

export type PurchaseOrder = {
  id: number;
  poNo: string;
  supplier: string;
  purchaseDate: string;
  expectedDate: string;
  total: number;
  status: PurchaseOrderStatus;
};

export const purchaseOrders: PurchaseOrder[] = [
  { id: 1, poNo: "PO-2025-001", supplier: "Arif Jewellers", purchaseDate: "12 Apr 2025", expectedDate: "15 Apr 2025", total: 125_000, status: "Pending" },
  { id: 2, poNo: "PO-2025-002", supplier: "Rupashi Gold Ltd.", purchaseDate: "10 Apr 2025", expectedDate: "14 Apr 2025", total: 320_500, status: "Approved" },
  { id: 3, poNo: "PO-2025-003", supplier: "Diamond House", purchaseDate: "08 Apr 2025", expectedDate: "12 Apr 2025", total: 210_000, status: "Received" },
  { id: 4, poNo: "PO-2025-004", supplier: "Shah Jahan Traders", purchaseDate: "06 Apr 2025", expectedDate: "12 Apr 2025", total: 95_000, status: "Partial" },
  { id: 5, poNo: "PO-2025-005", supplier: "Gold Source BD", purchaseDate: "03 Apr 2025", expectedDate: "10 Apr 2025", total: 480_750, status: "Received" },
  { id: 6, poNo: "PO-2025-006", supplier: "M/S Karim & Co.", purchaseDate: "01 Apr 2025", expectedDate: "08 Apr 2025", total: 150_000, status: "Cancelled" },
];

export const purchaseOrderSuppliers = [
  "Arif Jewellers",
  "Rupashi Gold Ltd.",
  "Diamond House",
  "Shah Jahan Traders",
  "Gold Source BD",
  "M/S Karim & Co.",
] as const;

export type PurchaseOrderItemTemplate = {
  id: string;
  name: string;
  purity: string;
  unit: "Gram" | "Pcs" | "Set";
  unitPrice: number;
};

export const purchaseOrderItemCatalog: PurchaseOrderItemTemplate[] = [
  { id: "gold-chain", name: "Gold Chain", purity: "22K", unit: "Gram", unitPrice: 8_420 },
  { id: "diamond-ring", name: "Diamond Ring", purity: "18K", unit: "Pcs", unitPrice: 125_000 },
  { id: "gold-pendant", name: "Gold Pendant", purity: "21K", unit: "Gram", unitPrice: 8_250 },
  { id: "silver-bangle", name: "Silver Bangle", purity: "925", unit: "Gram", unitPrice: 1_180 },
  { id: "raw-gold", name: "Raw Gold", purity: "24K", unit: "Gram", unitPrice: 8_600 },
];

export const formatPurchaseOrderCurrency = (value: number) => `৳ ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`;
