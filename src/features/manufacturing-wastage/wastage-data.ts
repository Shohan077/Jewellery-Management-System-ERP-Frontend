export type WastageStatus = "Approved" | "Pending" | "Rejected";

export type WastageRecord = {
  id: string;
  wastageNo: string;
  date: string;
  dateIso: string;
  manufacturingOrder: string;
  karigar: string;
  product: string;
  totalIssued: number;
  totalReturned: number;
  netWastage: number;
  approvedWastage: number;
  wastageType: string;
  remarks: string;
  status: WastageStatus;
};

export type ManufacturingOrderOption = {
  orderNo: string;
  orderDate: string;
  orderDateIso: string;
  product: string;
  karigar: string;
  targetWeight: number;
  issuedWeight: number;
  returnedWeight: number;
};

export const WASTAGE_STORAGE_KEY = "jewellery-erp:manufacturing-wastage:v1";
export const WASTAGE_DELETED_STORAGE_KEY = "jewellery-erp:manufacturing-wastage-deleted:v1";
export const WASTAGE_STORAGE_EVENT = "jewellery-erp:manufacturing-wastage-updated";

export const manufacturingOrderOptions: ManufacturingOrderOption[] = [
  { orderNo: "MO-2025-001", orderDate: "12 Apr 2025", orderDateIso: "2025-04-12", product: "Gold Ring (22K)", karigar: "Mohammad Ali", targetWeight: 50, issuedWeight: 50, returnedWeight: 48.75 },
  { orderNo: "MO-2025-002", orderDate: "11 Apr 2025", orderDateIso: "2025-04-11", product: "Gold Necklace (22K)", karigar: "Rafiq Islam", targetWeight: 83.35, issuedWeight: 83.35, returnedWeight: 82.5 },
  { orderNo: "MO-2025-003", orderDate: "10 Apr 2025", orderDateIso: "2025-04-10", product: "Gold Bangle (22K)", karigar: "Kalim Uddin", targetWeight: 26.1, issuedWeight: 26.1, returnedWeight: 25 },
  { orderNo: "MO-2025-004", orderDate: "09 Apr 2025", orderDateIso: "2025-04-09", product: "Diamond Ring", karigar: "Jabbar Hossain", targetWeight: 19.2, issuedWeight: 19.2, returnedWeight: 18.75 },
  { orderNo: "MO-2025-005", orderDate: "08 Apr 2025", orderDateIso: "2025-04-08", product: "Gold Chain (22K)", karigar: "Selim Mia", targetWeight: 62.65, issuedWeight: 62.65, returnedWeight: 62 },
  { orderNo: "MO-2025-006", orderDate: "07 Apr 2025", orderDateIso: "2025-04-07", product: "Gold Pendant", karigar: "Rahin Khan", targetWeight: 13.4, issuedWeight: 13.4, returnedWeight: 12.5 },
  { orderNo: "MO-2025-007", orderDate: "06 Apr 2025", orderDateIso: "2025-04-06", product: "Gold Ring (22K)", karigar: "Kalim Hossain", targetWeight: 38.9, issuedWeight: 38.9, returnedWeight: 38.2 },
  { orderNo: "MO-2025-008", orderDate: "05 Apr 2025", orderDateIso: "2025-04-05", product: "Silver Anklet", karigar: "Rafiq Islam", targetWeight: 9.3, issuedWeight: 9.3, returnedWeight: 9 },
];

export const karigarOptions = [
  "Mohammad Ali",
  "Rafiq Islam",
  "Kalim Uddin",
  "Jabbar Hossain",
  "Selim Mia",
  "Rahin Khan",
  "Kalim Hossain",
] as const;

export const productOptions = [
  "Gold Ring (22K)",
  "Gold Necklace (22K)",
  "Gold Bangle (22K)",
  "Diamond Ring",
  "Gold Chain (22K)",
  "Gold Pendant",
  "Silver Anklet",
] as const;

export const initialWastageRecords: WastageRecord[] = [
  { id: "WST-2025-001", wastageNo: "WST-2025-001", date: "12 Apr 2025", dateIso: "2025-04-12", manufacturingOrder: "MO-2025-001", karigar: "Mohammad Ali", product: "Gold Ring (22K)", totalIssued: 50, totalReturned: 48.75, netWastage: 1.25, approvedWastage: 1.25, wastageType: "Normal Wastage", remarks: "Stone setting wastage during polishing.", status: "Approved" },
  { id: "WST-2025-002", wastageNo: "WST-2025-002", date: "11 Apr 2025", dateIso: "2025-04-11", manufacturingOrder: "MO-2025-002", karigar: "Rafiq Islam", product: "Gold Necklace (22K)", totalIssued: 83.35, totalReturned: 82.5, netWastage: 0.85, approvedWastage: 0.8, wastageType: "Normal Wastage", remarks: "Routine finishing loss.", status: "Pending" },
  { id: "WST-2025-003", wastageNo: "WST-2025-003", date: "10 Apr 2025", dateIso: "2025-04-10", manufacturingOrder: "MO-2025-003", karigar: "Kalim Uddin", product: "Gold Bangle (22K)", totalIssued: 26.1, totalReturned: 25, netWastage: 1.1, approvedWastage: 1, wastageType: "Excess Wastage", remarks: "Approval threshold exceeded.", status: "Rejected" },
  { id: "WST-2025-004", wastageNo: "WST-2025-004", date: "09 Apr 2025", dateIso: "2025-04-09", manufacturingOrder: "MO-2025-004", karigar: "Jabbar Hossain", product: "Diamond Ring", totalIssued: 19.2, totalReturned: 18.75, netWastage: 0.45, approvedWastage: 0.45, wastageType: "Normal Wastage", remarks: "Stone setting and polishing loss.", status: "Approved" },
  { id: "WST-2025-005", wastageNo: "WST-2025-005", date: "08 Apr 2025", dateIso: "2025-04-08", manufacturingOrder: "MO-2025-005", karigar: "Selim Mia", product: "Gold Chain (22K)", totalIssued: 62.65, totalReturned: 62, netWastage: 0.65, approvedWastage: 0.65, wastageType: "Normal Wastage", remarks: "Chain finishing loss.", status: "Approved" },
  { id: "WST-2025-006", wastageNo: "WST-2025-006", date: "07 Apr 2025", dateIso: "2025-04-07", manufacturingOrder: "MO-2025-006", karigar: "Rahin Khan", product: "Gold Pendant", totalIssued: 13.4, totalReturned: 12.5, netWastage: 0.9, approvedWastage: 0.9, wastageType: "Normal Wastage", remarks: "Pending supervisor review.", status: "Pending" },
  { id: "WST-2025-007", wastageNo: "WST-2025-007", date: "06 Apr 2025", dateIso: "2025-04-06", manufacturingOrder: "MO-2025-007", karigar: "Kalim Hossain", product: "Gold Ring (22K)", totalIssued: 38.9, totalReturned: 38.2, netWastage: 0.7, approvedWastage: 0.6, wastageType: "Normal Wastage", remarks: "Awaiting final approval.", status: "Pending" },
  { id: "WST-2025-008", wastageNo: "WST-2025-008", date: "05 Apr 2025", dateIso: "2025-04-05", manufacturingOrder: "MO-2025-008", karigar: "Rafiq Islam", product: "Silver Anklet", totalIssued: 9.3, totalReturned: 9, netWastage: 0.3, approvedWastage: 0.25, wastageType: "Excess Wastage", remarks: "Reported variance requires correction.", status: "Rejected" },
];

export function formatWastageDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function isWastageRecord(value: unknown): value is WastageRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<WastageRecord>;
  return typeof record.id === "string"
    && typeof record.wastageNo === "string"
    && typeof record.date === "string"
    && typeof record.dateIso === "string"
    && typeof record.manufacturingOrder === "string"
    && typeof record.karigar === "string"
    && typeof record.product === "string"
    && typeof record.totalIssued === "number"
    && typeof record.totalReturned === "number"
    && typeof record.netWastage === "number"
    && typeof record.approvedWastage === "number"
    && typeof record.wastageType === "string"
    && typeof record.remarks === "string"
    && (record.status === "Approved" || record.status === "Pending" || record.status === "Rejected");
}
