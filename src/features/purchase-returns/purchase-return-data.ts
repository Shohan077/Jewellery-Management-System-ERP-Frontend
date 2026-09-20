export const PURCHASE_RETURNS_STORAGE_KEY = "jewellery-erp:purchase-returns";
export const PURCHASE_RETURNS_DELETED_STORAGE_KEY = "jewellery-erp:purchase-returns:deleted";
export const PURCHASE_RETURNS_STORAGE_EVENT = "jewellery-erp:purchase-returns-changed";
export const PURCHASE_RETURNS_FLASH_KEY = "jewellery-erp:purchase-returns:flash";

export type PurchaseReturnStatus = "Completed" | "Pending" | "Rejected";

export type PurchaseReturnItem = {
  id: string;
  itemName: string;
  category: string;
  purity: string;
  weight: number;
  rate: number;
};

export type PurchaseReturnRecord = {
  id: string;
  returnNo: string;
  returnDate: string;
  returnDateIso: string;
  supplier: string;
  referenceNo: string;
  remarks: string;
  total: number;
  status: PurchaseReturnStatus;
  items?: PurchaseReturnItem[];
};

export const purchaseReturnSuppliers = [
  "Amin Jewellery Supply",
  "Diamond World Ltd.",
  "Rahman Gold House",
  "Karim & Sons",
  "Shine Metal Supply",
  "Brilliant Gems",
] as const;

export const purchaseReturnCatalog = [
  { itemName: "Gold Ring", category: "22K", purity: "22K", rate: 9_200 },
  { itemName: "Gold Chain", category: "22K", purity: "22K", rate: 9_100 },
  { itemName: "Gold Bracelet", category: "21K", purity: "21K", rate: 8_800 },
  { itemName: "Diamond Ring", category: "Diamond", purity: "18K", rate: 12_500 },
  { itemName: "Silver Bangle", category: "Silver", purity: "925", rate: 1_150 },
] as const;

export const initialPurchaseReturnItems: PurchaseReturnItem[] = [
  { id: "return-item-1", itemName: "Gold Ring", category: "22K", purity: "22K", weight: 5, rate: 9_200 },
  { id: "return-item-2", itemName: "Gold Chain", category: "22K", purity: "22K", weight: 3, rate: 9_100 },
  { id: "return-item-3", itemName: "Gold Bracelet", category: "21K", purity: "21K", weight: 2.5, rate: 8_800 },
];

export const initialPurchaseReturns: PurchaseReturnRecord[] = [
  {
    id: "PR-2025-0001",
    returnNo: "PR-2025-0001",
    returnDate: "05 Apr 2025",
    returnDateIso: "2025-04-05",
    supplier: "Amin Jewellery Supply",
    referenceNo: "PO-2025-0018",
    remarks: "Damaged item returned",
    total: 25_000,
    status: "Completed",
  },
  {
    id: "PR-2025-0002",
    returnNo: "PR-2025-0002",
    returnDate: "10 Apr 2025",
    returnDateIso: "2025-04-10",
    supplier: "Diamond World Ltd.",
    referenceNo: "PO-2025-0019",
    remarks: "Quality mismatch",
    total: 12_500,
    status: "Completed",
  },
  {
    id: "PR-2025-0003",
    returnNo: "PR-2025-0003",
    returnDate: "15 Apr 2025",
    returnDateIso: "2025-04-15",
    supplier: "Karim & Sons",
    referenceNo: "PO-2025-0021",
    remarks: "Return awaiting confirmation",
    total: 18_000,
    status: "Pending",
  },
  {
    id: "PR-2025-0004",
    returnNo: "PR-2025-0004",
    returnDate: "18 Apr 2025",
    returnDateIso: "2025-04-18",
    supplier: "Shine Metal Supply",
    referenceNo: "PO-2025-0022",
    remarks: "Supplier rejected the return",
    total: 6_500,
    status: "Rejected",
  },
];

export function formatPurchaseReturnDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatPurchaseReturnCurrency(value: number) {
  return `\u09F3 ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`;
}

export function getPurchaseReturnItemAmount(item: PurchaseReturnItem) {
  return item.weight * item.rate;
}

export function isPurchaseReturnRecord(value: unknown): value is PurchaseReturnRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PurchaseReturnRecord>;
  return typeof record.id === "string"
    && typeof record.returnNo === "string"
    && typeof record.returnDate === "string"
    && typeof record.returnDateIso === "string"
    && typeof record.supplier === "string"
    && typeof record.referenceNo === "string"
    && typeof record.remarks === "string"
    && typeof record.total === "number"
    && (record.status === "Completed" || record.status === "Pending" || record.status === "Rejected");
}
