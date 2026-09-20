export type PurchaseReportRow = {
  id: number;
  date: string;
  purchaseNo: string;
  supplier: string;
  category: string;
  totalAmount: number;
  returnAmount: number;
  dueAmount: number;
};

export type PurchaseOrderStatus = "Pending" | "Approved" | "Ordered" | "Cancelled";

export type ManagedPurchaseOrder = {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
};

export type PurchaseExpense = {
  id: string;
  date: string;
  category: string;
  supplier: string;
  referenceNo: string;
  amount: number;
  remarks: string;
};

export const purchaseReportRows: PurchaseReportRow[] = [
  { id: 1, date: "2025-04-18", purchaseNo: "PUR-2025-0142", supplier: "Amin Jewellery Supply", category: "Gold Jewellery", totalAmount: 450_000, returnAmount: 0, dueAmount: 125_000 },
  { id: 2, date: "2025-04-15", purchaseNo: "PUR-2025-0140", supplier: "Diamond World Ltd.", category: "Diamond", totalAmount: 320_000, returnAmount: 0, dueAmount: 0 },
  { id: 3, date: "2025-04-12", purchaseNo: "PUR-2025-0138", supplier: "Rahman Gold House", category: "Gold Jewellery", totalAmount: 280_000, returnAmount: 0, dueAmount: 0 },
  { id: 4, date: "2025-04-10", purchaseNo: "PUR-2025-0135", supplier: "Karim & Sons", category: "Raw Material", totalAmount: 620_000, returnAmount: 95_300, dueAmount: 12_300 },
  { id: 5, date: "2025-04-05", purchaseNo: "PUR-2025-0131", supplier: "Gold Line BD", category: "Gold Jewellery", totalAmount: 510_000, returnAmount: 0, dueAmount: 0 },
  { id: 6, date: "2025-04-02", purchaseNo: "PUR-2025-0128", supplier: "Shah Ali Traders", category: "Raw Material", totalAmount: 1_000_000, returnAmount: 0, dueAmount: 0 },
];

export const initialManagedPurchaseOrders: ManagedPurchaseOrder[] = [
  { id: "po-18", poNumber: "PO-2025-0018", supplier: "Amin Jewellery Supply", orderDate: "2025-04-01", expectedDate: "2025-04-08", totalAmount: 450_000, status: "Pending" },
  { id: "po-19", poNumber: "PO-2025-0019", supplier: "Diamond World Ltd.", orderDate: "2025-04-03", expectedDate: "2025-04-10", totalAmount: 320_000, status: "Approved" },
  { id: "po-20", poNumber: "PO-2025-0020", supplier: "Rahman Gold House", orderDate: "2025-04-05", expectedDate: "2025-04-12", totalAmount: 280_000, status: "Ordered" },
  { id: "po-21", poNumber: "PO-2025-0021", supplier: "Karim & Sons", orderDate: "2025-04-08", expectedDate: "2025-04-15", totalAmount: 620_000, status: "Pending" },
  { id: "po-22", poNumber: "PO-2025-0022", supplier: "Shine Metal Supply", orderDate: "2025-04-10", expectedDate: "2025-04-18", totalAmount: 125_000, status: "Cancelled" },
  { id: "po-23", poNumber: "PO-2025-0023", supplier: "Brilliant Gems", orderDate: "2025-04-12", expectedDate: "2025-04-20", totalAmount: 780_000, status: "Approved" },
];

export const initialPurchaseExpenses: PurchaseExpense[] = [
  { id: "expense-1", date: "2025-04-01", category: "Transportation", supplier: "Amin Jewellery Supply", referenceNo: "EXP-2025-001", amount: 12_500, remarks: "Delivery charge" },
  { id: "expense-2", date: "2025-04-05", category: "Loading Charge", supplier: "Diamond World Ltd.", referenceNo: "EXP-2025-002", amount: 8_000, remarks: "Loading & unloading" },
  { id: "expense-3", date: "2025-04-10", category: "Custom Fee", supplier: "Rahman Gold House", referenceNo: "EXP-2025-003", amount: 15_000, remarks: "Custom clearance" },
  { id: "expense-4", date: "2025-04-18", category: "Other", supplier: "Karim & Sons", referenceNo: "EXP-2025-004", amount: 6_500, remarks: "Miscellaneous" },
];

export const supplierOptions = [
  "Amin Jewellery Supply",
  "Diamond World Ltd.",
  "Rahman Gold House",
  "Karim & Sons",
  "Gold Line BD",
  "Shah Ali Traders",
  "Shine Metal Supply",
  "Brilliant Gems",
] as const;

export const expenseCategories = ["Transportation", "Loading Charge", "Custom Fee", "Other"] as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCurrency(value: number) {
  return `৳ ${currencyFormatter.format(value)}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export function isManagedPurchaseOrder(value: unknown): value is ManagedPurchaseOrder {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ManagedPurchaseOrder>;
  return typeof record.id === "string"
    && typeof record.poNumber === "string"
    && typeof record.supplier === "string"
    && typeof record.orderDate === "string"
    && typeof record.expectedDate === "string"
    && typeof record.totalAmount === "number"
    && ["Pending", "Approved", "Ordered", "Cancelled"].includes(record.status ?? "");
}

export function isPurchaseExpense(value: unknown): value is PurchaseExpense {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PurchaseExpense>;
  return typeof record.id === "string"
    && typeof record.date === "string"
    && typeof record.category === "string"
    && typeof record.supplier === "string"
    && typeof record.referenceNo === "string"
    && typeof record.amount === "number"
    && typeof record.remarks === "string";
}

export const PURCHASE_ORDER_STORAGE_KEY = "jewellery-erp:managed-purchase-orders:v1";
export const PURCHASE_EXPENSE_STORAGE_KEY = "jewellery-erp:purchase-expenses:v1";
