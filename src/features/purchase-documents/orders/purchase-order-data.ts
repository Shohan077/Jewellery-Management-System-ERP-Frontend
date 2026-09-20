export type PurchaseOrderStatus = "Pending" | "Approved" | "Received" | "Cancelled";

export type PurchaseOrderItem = {
  id: string;
  name: string;
  category: string;
  purity: string;
  weight: number;
  rate: number;
};

export type PurchaseOrder = {
  orderNo: string;
  orderDate: string;
  expectedDeliveryDate: string;
  supplier: string;
  purchaseType: string;
  remarks: string;
  additionalNotes: string;
  itemCount: number;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
};

export const PURCHASE_ORDER_STORAGE_KEY = "jewellery-erp.purchase-orders.v1";
export const PURCHASE_ORDER_STORAGE_EVENT = "jewellery-erp:purchase-orders-changed";

const featuredItems: PurchaseOrderItem[] = [
  { id: "POI-001", name: "Gold Ring", category: "Ring", purity: "22K", weight: 10, rate: 9_200 },
  { id: "POI-002", name: "Gold Chain", category: "Chain", purity: "22K", weight: 5, rate: 9_100 },
  { id: "POI-003", name: "Gold Bracelet", category: "Bracelet", purity: "21K", weight: 3, rate: 8_800 },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    orderNo: "PO-2025-0018",
    orderDate: "2025-04-20",
    expectedDeliveryDate: "2025-04-25",
    supplier: "Rahman Gold House",
    purchaseType: "Gold Jewellery",
    remarks: "",
    additionalNotes: "",
    itemCount: 3,
    items: featuredItems,
    totalAmount: 163_900,
    status: "Pending",
  },
  { orderNo: "PO-2025-0017", orderDate: "2025-04-18", expectedDeliveryDate: "2025-04-24", supplier: "Amin Jewellery Supply", purchaseType: "Gold Jewellery", remarks: "", additionalNotes: "", itemCount: 5, items: [], totalAmount: 248_500, status: "Approved" },
  { orderNo: "PO-2025-0016", orderDate: "2025-04-15", expectedDeliveryDate: "2025-04-22", supplier: "Diamond World Ltd.", purchaseType: "Diamond Jewellery", remarks: "", additionalNotes: "", itemCount: 4, items: [], totalAmount: 320_000, status: "Pending" },
  { orderNo: "PO-2025-0015", orderDate: "2025-04-12", expectedDeliveryDate: "2025-04-19", supplier: "Karim & Sons", purchaseType: "Gold Jewellery", remarks: "", additionalNotes: "", itemCount: 6, items: [], totalAmount: 512_700, status: "Received" },
  { orderNo: "PO-2025-0014", orderDate: "2025-04-10", expectedDeliveryDate: "2025-04-18", supplier: "Beauty Gems", purchaseType: "Gemstone Jewellery", remarks: "", additionalNotes: "", itemCount: 2, items: [], totalAmount: 95_300, status: "Cancelled" },
  { orderNo: "PO-2025-0013", orderDate: "2025-04-05", expectedDeliveryDate: "2025-04-15", supplier: "Shah Ali Traders", purchaseType: "Gold Jewellery", remarks: "", additionalNotes: "", itemCount: 8, items: [], totalAmount: 420_600, status: "Approved" },
  { orderNo: "PO-2025-0012", orderDate: "2025-04-02", expectedDeliveryDate: "2025-04-12", supplier: "Royal Jewellery Ltd.", purchaseType: "Gold Jewellery", remarks: "", additionalNotes: "", itemCount: 3, items: [], totalAmount: 187_200, status: "Received" },
];

export const supplierOptions = [
  "Rahman Gold House",
  "Amin Jewellery Supply",
  "Diamond World Ltd.",
  "Karim & Sons",
  "Beauty Gems",
  "Shah Ali Traders",
  "Royal Jewellery Ltd.",
];

export const INITIAL_PURCHASE_ORDER_SNAPSHOT = JSON.stringify(initialPurchaseOrders);

export function isPurchaseOrderItem(value: unknown): value is PurchaseOrderItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PurchaseOrderItem>;
  return typeof item.id === "string"
    && typeof item.name === "string"
    && typeof item.category === "string"
    && typeof item.purity === "string"
    && typeof item.weight === "number"
    && typeof item.rate === "number";
}

export function isPurchaseOrder(value: unknown): value is PurchaseOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<PurchaseOrder>;
  return typeof order.orderNo === "string"
    && typeof order.orderDate === "string"
    && typeof order.expectedDeliveryDate === "string"
    && typeof order.supplier === "string"
    && typeof order.purchaseType === "string"
    && typeof order.remarks === "string"
    && typeof order.additionalNotes === "string"
    && typeof order.itemCount === "number"
    && Array.isArray(order.items)
    && order.items.every(isPurchaseOrderItem)
    && typeof order.totalAmount === "number"
    && ["Pending", "Approved", "Received", "Cancelled"].includes(order.status ?? "");
}

export function parsePurchaseOrders(snapshot: string): PurchaseOrder[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isPurchaseOrder) : initialPurchaseOrders;
  } catch {
    return initialPurchaseOrders;
  }
}

export function formatPurchaseOrderDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function formatPurchaseOrderMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));
}

export function calculateItemAmount(item: PurchaseOrderItem) {
  return Math.round(item.weight * item.rate);
}
