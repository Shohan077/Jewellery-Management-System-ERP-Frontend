export const FINISHED_PRODUCTS_STORAGE_KEY = "jewellery-erp:finished-products:v1";
export const FINISHED_PRODUCTS_STORAGE_EVENT = "jewellery-erp:finished-products-updated";

export const finishedProductStatuses = ["Completed", "QC Pending"] as const;
export type FinishedProductStatus = (typeof finishedProductStatuses)[number];

export const inventorySyncStatuses = ["Synced", "Pending"] as const;
export type InventorySyncStatus = (typeof inventorySyncStatuses)[number];

export const finishedProductOptions = [
  { name: "Gold Ring (22K)", kind: "ring", purity: "22K" },
  { name: "Gold Necklace (22K)", kind: "necklace", purity: "22K" },
  { name: "Gold Bangle (22K)", kind: "bangle", purity: "22K" },
  { name: "Diamond Ring", kind: "diamond", purity: "18K" },
  { name: "Gold Chain (22K)", kind: "chain", purity: "22K" },
  { name: "Gold Earrings (22K)", kind: "earrings", purity: "22K" },
  { name: "Gold Pendant (22K)", kind: "pendant", purity: "22K" },
  { name: "Silver Anklet", kind: "anklet", purity: "N/A" },
] as const;

export type FinishedProductKind = (typeof finishedProductOptions)[number]["kind"];

export const finishedProductKarigars = [
  "Mohammad Ali",
  "Rafiq Islam",
  "Kalim Uddin",
  "Jabbar Hossain",
  "Selim Mia",
  "Rahin Khan",
  "Kalim Hossain",
  "Abdul Karim",
] as const;

export const finishedProductOrders = [
  "MO-2025-001",
  "MO-2025-002",
  "MO-2025-003",
  "MO-2025-004",
  "MO-2025-005",
  "MO-2025-006",
  "MO-2025-007",
  "MO-2025-008",
] as const;

export type FinishedProductOrder = (typeof finishedProductOrders)[number];

export type ProductionOrderSummary = {
  orderDate: string;
  product: (typeof finishedProductOptions)[number]["name"];
  karigar: (typeof finishedProductKarigars)[number];
  targetWeight: number;
  totalIssued: number;
  totalReturned: number;
  expectedCompletion: string;
};

/**
 * The completion form is driven by its manufacturing order. Keeping this in
 * one data map prevents the editable form and the production summary from
 * drifting apart when another order is selected.
 */
export const productionOrderSummaries: Record<FinishedProductOrder, ProductionOrderSummary> = {
  "MO-2025-001": { orderDate: "2025-04-12", product: "Gold Ring (22K)", karigar: "Mohammad Ali", targetWeight: 50, totalIssued: 50, totalReturned: 1.25, expectedCompletion: "2025-04-20" },
  "MO-2025-002": { orderDate: "2025-04-10", product: "Gold Necklace (22K)", karigar: "Rafiq Islam", targetWeight: 84, totalIssued: 84, totalReturned: 1.5, expectedCompletion: "2025-04-18" },
  "MO-2025-003": { orderDate: "2025-04-09", product: "Gold Bangle (22K)", karigar: "Kalim Uddin", targetWeight: 26, totalIssued: 26, totalReturned: 1, expectedCompletion: "2025-04-17" },
  "MO-2025-004": { orderDate: "2025-04-08", product: "Diamond Ring", karigar: "Jabbar Hossain", targetWeight: 19.5, totalIssued: 19.5, totalReturned: 0.75, expectedCompletion: "2025-04-16" },
  "MO-2025-005": { orderDate: "2025-04-07", product: "Gold Chain (22K)", karigar: "Selim Mia", targetWeight: 64, totalIssued: 64, totalReturned: 2, expectedCompletion: "2025-04-15" },
  "MO-2025-006": { orderDate: "2025-04-07", product: "Gold Earrings (22K)", karigar: "Rahin Khan", targetWeight: 13.2, totalIssued: 13.2, totalReturned: 0.7, expectedCompletion: "2025-04-14" },
  "MO-2025-007": { orderDate: "2025-04-06", product: "Gold Pendant (22K)", karigar: "Kalim Uddin", targetWeight: 39.5, totalIssued: 39.5, totalReturned: 1.3, expectedCompletion: "2025-04-14" },
  "MO-2025-008": { orderDate: "2025-04-06", product: "Silver Anklet", karigar: "Rafiq Islam", targetWeight: 9.5, totalIssued: 9.5, totalReturned: 0.5, expectedCompletion: "2025-04-13" },
};

export const purityOptions = ["24K", "22K", "21K", "18K", "N/A"] as const;

export type FinishedProductRecord = {
  id: string;
  completionNo: string;
  completionDate: string;
  product: string;
  productKind: FinishedProductKind;
  karigar: string;
  finalWeight: number;
  purity: string;
  status: FinishedProductStatus;
  inventorySync: InventorySyncStatus;
  manufacturingOrder: string;
  orderDate: string;
  targetWeight: number;
  totalIssued: number;
  totalReturned: number;
  stoneWeight: number;
  makingCharge: number;
  wastageAdjustment: number;
  remarks: string;
  expectedCompletion: string;
};

const featuredFinishedProducts: FinishedProductRecord[] = [
  { id: "FP-2025-001", completionNo: "FP-2025-001", completionDate: "2025-04-12", product: "Gold Ring (22K)", productKind: "ring", karigar: "Mohammad Ali", finalWeight: 48.75, purity: "22K", status: "Completed", inventorySync: "Synced", manufacturingOrder: "MO-2025-001", orderDate: "2025-04-12", targetWeight: 50, totalIssued: 50, totalReturned: 1.25, stoneWeight: 0.25, makingCharge: 350, wastageAdjustment: 0.05, remarks: "", expectedCompletion: "2025-04-20" },
  { id: "FP-2025-002", completionNo: "FP-2025-002", completionDate: "2025-04-12", product: "Gold Necklace (22K)", productKind: "necklace", karigar: "Rafiq Islam", finalWeight: 82.5, purity: "22K", status: "QC Pending", inventorySync: "Pending", manufacturingOrder: "MO-2025-002", orderDate: "2025-04-10", targetWeight: 84, totalIssued: 84, totalReturned: 1.5, stoneWeight: 0, makingCharge: 680, wastageAdjustment: 0, remarks: "Awaiting quality review.", expectedCompletion: "2025-04-18" },
  { id: "FP-2025-003", completionNo: "FP-2025-003", completionDate: "2025-04-11", product: "Gold Bangle (22K)", productKind: "bangle", karigar: "Kalim Uddin", finalWeight: 25, purity: "22K", status: "Completed", inventorySync: "Synced", manufacturingOrder: "MO-2025-003", orderDate: "2025-04-09", targetWeight: 26, totalIssued: 26, totalReturned: 1, stoneWeight: 0, makingCharge: 430, wastageAdjustment: 0, remarks: "", expectedCompletion: "2025-04-17" },
  { id: "FP-2025-004", completionNo: "FP-2025-004", completionDate: "2025-04-11", product: "Diamond Ring", productKind: "diamond", karigar: "Jabbar Hossain", finalWeight: 18.75, purity: "18K", status: "QC Pending", inventorySync: "Pending", manufacturingOrder: "MO-2025-004", orderDate: "2025-04-08", targetWeight: 19.5, totalIssued: 19.5, totalReturned: 0.75, stoneWeight: 1.2, makingCharge: 750, wastageAdjustment: 0.02, remarks: "Stone setting inspection pending.", expectedCompletion: "2025-04-16" },
  { id: "FP-2025-005", completionNo: "FP-2025-005", completionDate: "2025-04-10", product: "Gold Chain (22K)", productKind: "chain", karigar: "Selim Mia", finalWeight: 62, purity: "22K", status: "Completed", inventorySync: "Synced", manufacturingOrder: "MO-2025-005", orderDate: "2025-04-07", targetWeight: 64, totalIssued: 64, totalReturned: 2, stoneWeight: 0, makingCharge: 520, wastageAdjustment: 0, remarks: "", expectedCompletion: "2025-04-15" },
  { id: "FP-2025-006", completionNo: "FP-2025-006", completionDate: "2025-04-10", product: "Gold Earrings (22K)", productKind: "earrings", karigar: "Rahin Khan", finalWeight: 12.5, purity: "22K", status: "Completed", inventorySync: "Synced", manufacturingOrder: "MO-2025-006", orderDate: "2025-04-07", targetWeight: 13.2, totalIssued: 13.2, totalReturned: 0.7, stoneWeight: 0, makingCharge: 280, wastageAdjustment: 0, remarks: "", expectedCompletion: "2025-04-14" },
  { id: "FP-2025-007", completionNo: "FP-2025-007", completionDate: "2025-04-09", product: "Gold Pendant (22K)", productKind: "pendant", karigar: "Kalim Uddin", finalWeight: 38.2, purity: "22K", status: "QC Pending", inventorySync: "Pending", manufacturingOrder: "MO-2025-007", orderDate: "2025-04-06", targetWeight: 39.5, totalIssued: 39.5, totalReturned: 1.3, stoneWeight: 0.45, makingCharge: 390, wastageAdjustment: 0.03, remarks: "Awaiting final polish check.", expectedCompletion: "2025-04-14" },
  { id: "FP-2025-008", completionNo: "FP-2025-008", completionDate: "2025-04-09", product: "Silver Anklet", productKind: "anklet", karigar: "Rafiq Islam", finalWeight: 9, purity: "N/A", status: "Completed", inventorySync: "Synced", manufacturingOrder: "MO-2025-008", orderDate: "2025-04-06", targetWeight: 9.5, totalIssued: 9.5, totalReturned: 0.5, stoneWeight: 0, makingCharge: 120, wastageAdjustment: 0, remarks: "", expectedCompletion: "2025-04-13" },
];

function isoDateFromOffset(offset: number) {
  const date = new Date(Date.UTC(2025, 3, 8 - offset));
  return date.toISOString().slice(0, 10);
}

const generatedFinishedProducts: FinishedProductRecord[] = Array.from({ length: 150 }, (_, offset) => {
  const sequence = offset + 9;
  const product = finishedProductOptions[offset % finishedProductOptions.length];
  const status: FinishedProductStatus = offset < 15 ? "QC Pending" : "Completed";
  const completionDate = offset < 10 ? "2025-04-12" : isoDateFromOffset(Math.floor((offset - 10) / 2));
  const finalWeight = 2.905;
  const issued = Number((finalWeight + 1.25).toFixed(3));
  return {
    id: `FP-2025-${String(sequence).padStart(3, "0")}`,
    completionNo: `FP-2025-${String(sequence).padStart(3, "0")}`,
    completionDate,
    product: product.name,
    productKind: product.kind,
    karigar: finishedProductKarigars[(offset * 3) % finishedProductKarigars.length],
    finalWeight,
    purity: product.purity,
    status,
    inventorySync: status === "Completed" ? "Synced" : "Pending",
    manufacturingOrder: `MO-2025-${String(sequence).padStart(3, "0")}`,
    orderDate: isoDateFromOffset(Math.floor(offset / 2) + 3),
    targetWeight: issued,
    totalIssued: issued,
    totalReturned: 1.25,
    stoneWeight: product.kind === "diamond" ? 0.75 : 0,
    makingCharge: 250 + (offset % 8) * 55,
    wastageAdjustment: Number(((offset % 4) * 0.025).toFixed(3)),
    remarks: status === "QC Pending" ? "Awaiting quality review." : "Completed production entry.",
    expectedCompletion: isoDateFromOffset(Math.floor(offset / 2) - 2),
  };
});

export const initialFinishedProducts: FinishedProductRecord[] = [
  ...featuredFinishedProducts,
  ...generatedFinishedProducts,
];

export function formatFinishedProductDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function isFinishedProductRecord(value: unknown): value is FinishedProductRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<FinishedProductRecord>;
  return typeof record.id === "string"
    && typeof record.completionNo === "string"
    && typeof record.completionDate === "string"
    && typeof record.product === "string"
    && finishedProductOptions.some((option) => option.kind === record.productKind)
    && typeof record.karigar === "string"
    && Number.isFinite(record.finalWeight)
    && typeof record.purity === "string"
    && (record.status === "Completed" || record.status === "QC Pending")
    && (record.inventorySync === "Synced" || record.inventorySync === "Pending")
    && typeof record.manufacturingOrder === "string"
    && typeof record.orderDate === "string"
    && Number.isFinite(record.targetWeight)
    && Number.isFinite(record.totalIssued)
    && Number.isFinite(record.totalReturned)
    && Number.isFinite(record.stoneWeight)
    && Number.isFinite(record.makingCharge)
    && Number.isFinite(record.wastageAdjustment)
    && typeof record.remarks === "string"
    && typeof record.expectedCompletion === "string";
}
