export const RETURN_ORDER_STORAGE_KEY = "jewellery-erp:return-orders:v1";
export const RETURN_ORDER_DELETED_KEY = "jewellery-erp:return-orders:deleted:v1";
export const RETURN_ORDER_EVENT = "jewellery-erp:return-orders-changed";
export const RETURN_ORDER_FLASH_KEY = "jewellery-erp:return-orders:flash";

export type ReturnOrderStatus = "Completed" | "Pending" | "Cancelled";

export type ReturnOrderItem = {
  id: string;
  itemName: string;
  category: string;
  purity: string;
  weight: number;
  rate: number;
};

export type ReturnOrder = {
  id: string;
  returnNo: string;
  returnDate: string;
  returnDateIso: string;
  supplier: string;
  originalPo: string;
  returnReason: string;
  remarks: string;
  notes: string;
  status: ReturnOrderStatus;
  items: ReturnOrderItem[];
};

export const returnOrderSuppliers = [
  "Amin Jewellery Supply",
  "Rahman Gold House",
  "Diamond World Ltd.",
  "Karim & Sons",
  "Beauty Gems",
  "Shah Ali Traders",
] as const;

export const returnReasons = [
  "Defective items",
  "Quality mismatch",
  "Wrong item supplied",
  "Damaged in transit",
  "Other",
] as const;

export const returnItemCatalog = [
  { itemName: "Gold Ring", category: "Ring", purity: "22K", rate: 9_200 },
  { itemName: "Gold Chain", category: "Chain", purity: "22K", rate: 9_100 },
  { itemName: "Gold Bracelet", category: "Bracelet", purity: "21K", rate: 8_800 },
  { itemName: "Diamond Ring", category: "Ring", purity: "18K", rate: 12_500 },
] as const;

export const defaultReturnItems: ReturnOrderItem[] = [
  { id: "return-order-item-1", itemName: "Gold Ring", category: "Ring", purity: "22K", weight: 2, rate: 9_200 },
  { id: "return-order-item-2", itemName: "Gold Chain", category: "Chain", purity: "22K", weight: 1, rate: 9_100 },
];

function placeholderItem(id: string, amount: number): ReturnOrderItem {
  return { id, itemName: "Returned item", category: "Jewellery", purity: "22K", weight: 1, rate: amount };
}

export const initialReturnOrders: ReturnOrder[] = [
  {
    id: "PR-2025-0009", returnNo: "PR-2025-0009", returnDate: "20 Apr 2025", returnDateIso: "2025-04-20",
    supplier: "Amin Jewellery Supply", originalPo: "PO-2025-0018", returnReason: "Defective items", remarks: "Quality issue", notes: "",
    status: "Completed", items: defaultReturnItems.map((item) => ({ ...item })),
  },
  {
    id: "PR-2025-0008", returnNo: "PR-2025-0008", returnDate: "18 Apr 2025", returnDateIso: "2025-04-18",
    supplier: "Rahman Gold House", originalPo: "PO-2025-0017", returnReason: "Quality mismatch", remarks: "Supplier notified", notes: "",
    status: "Pending", items: [placeholderItem("return-order-item-8", 12_300)],
  },
  {
    id: "PR-2025-0007", returnNo: "PR-2025-0007", returnDate: "15 Apr 2025", returnDateIso: "2025-04-15",
    supplier: "Diamond World Ltd.", originalPo: "PO-2025-0016", returnReason: "Defective items", remarks: "Stone quality issue", notes: "",
    status: "Completed", items: [placeholderItem("return-order-item-7", 45_000)],
  },
  {
    id: "PR-2025-0006", returnNo: "PR-2025-0006", returnDate: "10 Apr 2025", returnDateIso: "2025-04-10",
    supplier: "Karim & Sons", originalPo: "PO-2025-0015", returnReason: "Wrong item supplied", remarks: "Return cancelled", notes: "",
    status: "Cancelled", items: [placeholderItem("return-order-item-6", 18_600)],
  },
  {
    id: "PR-2025-0005", returnNo: "PR-2025-0005", returnDate: "05 Apr 2025", returnDateIso: "2025-04-05",
    supplier: "Beauty Gems", originalPo: "PO-2025-0014", returnReason: "Defective items", remarks: "Return completed", notes: "",
    status: "Completed", items: [placeholderItem("return-order-item-5", 9_100)],
  },
  {
    id: "PR-2025-0004", returnNo: "PR-2025-0004", returnDate: "02 Apr 2025", returnDateIso: "2025-04-02",
    supplier: "Shah Ali Traders", originalPo: "PO-2025-0013", returnReason: "Quality mismatch", remarks: "Awaiting collection", notes: "",
    status: "Pending", items: [placeholderItem("return-order-item-4", 22_000)],
  },
];

export function lineAmount(item: ReturnOrderItem) {
  return item.weight * item.rate;
}

export function returnOrderTotal(order: Pick<ReturnOrder, "items">) {
  return order.items.reduce((total, item) => total + lineAmount(item), 0);
}

export function formatBdt(value: number) {
  return `\u09F3 ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`;
}

export function formatReturnDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

export function isReturnOrder(value: unknown): value is ReturnOrder {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ReturnOrder>;
  return typeof record.id === "string"
    && typeof record.returnNo === "string"
    && typeof record.returnDate === "string"
    && typeof record.returnDateIso === "string"
    && typeof record.supplier === "string"
    && typeof record.originalPo === "string"
    && typeof record.returnReason === "string"
    && typeof record.remarks === "string"
    && typeof record.notes === "string"
    && Array.isArray(record.items)
    && (record.status === "Completed" || record.status === "Pending" || record.status === "Cancelled");
}

export function readSavedReturnOrders() {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RETURN_ORDER_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isReturnOrder) : [];
  } catch {
    return [];
  }
}
