export type MaterialReturnStatus = "Received" | "Verified" | "Pending";

export type MaterialReturnType = "Partial Return" | "Full Return" | "Wastage Return";

export type ReturnedMaterial = {
  id: string;
  material: string;
  purity: string;
  returnedWeight: number;
  usableWeight: number;
  wastage: number;
  remarks: string;
};

export type MaterialReturnRecord = {
  id: string;
  returnNo: string;
  date: string;
  dateIso: string;
  karigar: string;
  manufacturingOrder: string;
  returnType: MaterialReturnType;
  totalMaterials: number;
  returnedWeight: number;
  wastage: number;
  status: MaterialReturnStatus;
  materials?: ReturnedMaterial[];
  remarks?: string;
  note?: string;
};

export const MATERIAL_RETURNS_STORAGE_KEY = "jewellery-erp:material-returns:v1";
export const MATERIAL_RETURNS_DELETED_STORAGE_KEY = "jewellery-erp:material-returns-deleted:v1";
export const MATERIAL_RETURNS_STORAGE_EVENT = "jewellery-erp:material-returns-updated";

export const karigarOptions = [
  "Mohammad Ali",
  "Rafiq Islam",
  "Kalim Uddin",
  "Jabbar Hossain",
  "Selim Mia",
  "Rahin Khan",
  "Kalim Hossain",
  "Abdul Karim",
] as const;

export const manufacturingOrderOptions = [
  "MO-2025-001",
  "MO-2025-002",
  "MO-2025-003",
  "MO-2025-004",
  "MO-2025-005",
  "MO-2025-006",
] as const;

export const materialOptions = [
  "Gold (Raw)",
  "Silver (Alloy)",
  "Diamond Stone",
  "Copper Alloy",
  "Platinum (Raw)",
] as const;

export const purityOptions = ["24K", "22K", "21K", "18K", "N/A"] as const;

export const initialReturnedMaterials: ReturnedMaterial[] = [
  {
    id: "returned-material-1",
    material: "Gold (Raw)",
    purity: "22K",
    returnedWeight: 5,
    usableWeight: 4.85,
    wastage: 0.15,
    remarks: "For Ring",
  },
  {
    id: "returned-material-2",
    material: "Silver (Alloy)",
    purity: "N/A",
    returnedWeight: 1.2,
    usableWeight: 1.15,
    wastage: 0.05,
    remarks: "Polish Loss",
  },
  {
    id: "returned-material-3",
    material: "Diamond Stone",
    purity: "N/A",
    returnedWeight: 0.03,
    usableWeight: 0.03,
    wastage: 0,
    remarks: "Main Stone",
  },
];

const featuredReturns: MaterialReturnRecord[] = [
  { id: "MR-2025-001", returnNo: "MR-2025-001", date: "12 Apr 2025", dateIso: "2025-04-12", karigar: "Mohammad Ali", manufacturingOrder: "MO-2025-001", returnType: "Partial Return", totalMaterials: 3, returnedWeight: 6.23, wastage: 0.2, status: "Received", materials: initialReturnedMaterials },
  { id: "MR-2025-002", returnNo: "MR-2025-002", date: "11 Apr 2025", dateIso: "2025-04-11", karigar: "Rafiq Islam", manufacturingOrder: "MO-2025-002", returnType: "Partial Return", totalMaterials: 2, returnedWeight: 2.5, wastage: 0.1, status: "Verified" },
  { id: "MR-2025-003", returnNo: "MR-2025-003", date: "10 Apr 2025", dateIso: "2025-04-10", karigar: "Kalim Uddin", manufacturingOrder: "MO-2025-003", returnType: "Full Return", totalMaterials: 4, returnedWeight: 8.75, wastage: 0.35, status: "Pending" },
  { id: "MR-2025-004", returnNo: "MR-2025-004", date: "09 Apr 2025", dateIso: "2025-04-09", karigar: "Jabbar Hossain", manufacturingOrder: "MO-2025-004", returnType: "Partial Return", totalMaterials: 3, returnedWeight: 3.6, wastage: 0.12, status: "Received" },
  { id: "MR-2025-005", returnNo: "MR-2025-005", date: "08 Apr 2025", dateIso: "2025-04-08", karigar: "Selim Mia", manufacturingOrder: "MO-2025-005", returnType: "Partial Return", totalMaterials: 2, returnedWeight: 1.8, wastage: 0.07, status: "Verified" },
  { id: "MR-2025-006", returnNo: "MR-2025-006", date: "07 Apr 2025", dateIso: "2025-04-07", karigar: "Rahin Khan", manufacturingOrder: "MO-2025-006", returnType: "Full Return", totalMaterials: 5, returnedWeight: 9.25, wastage: 0.4, status: "Pending" },
  { id: "MR-2025-007", returnNo: "MR-2025-007", date: "06 Apr 2025", dateIso: "2025-04-06", karigar: "Kalim Hossain", manufacturingOrder: "MO-2025-002", returnType: "Partial Return", totalMaterials: 3, returnedWeight: 4.2, wastage: 0.15, status: "Verified" },
  { id: "MR-2025-008", returnNo: "MR-2025-008", date: "05 Apr 2025", dateIso: "2025-04-05", karigar: "Rafiq Islam", manufacturingOrder: "MO-2025-003", returnType: "Partial Return", totalMaterials: 2, returnedWeight: 2.1, wastage: 0.08, status: "Received" },
  { id: "MR-2025-009", returnNo: "MR-2025-009", date: "04 Apr 2025", dateIso: "2025-04-04", karigar: "Mohammad Ali", manufacturingOrder: "MO-2025-004", returnType: "Wastage Return", totalMaterials: 4, returnedWeight: 7.45, wastage: 0.3, status: "Pending" },
  { id: "MR-2025-010", returnNo: "MR-2025-010", date: "03 Apr 2025", dateIso: "2025-04-03", karigar: "Selim Mia", manufacturingOrder: "MO-2025-005", returnType: "Partial Return", totalMaterials: 2, returnedWeight: 1.65, wastage: 0.06, status: "Verified" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

const statusCycle: MaterialReturnStatus[] = ["Received", "Verified", "Pending"];

const generatedReturns: MaterialReturnRecord[] = Array.from({ length: 32 }, (_, offset) => {
  const numericId = offset + 11;
  const date = new Date(Date.UTC(2025, 3, 2 - offset));
  const returnedWeight = Number((1.35 + ((offset * 1.825) % 9.2)).toFixed(3));
  const wastage = Number((0.04 + ((offset * 0.035) % 0.37)).toFixed(3));
  return {
    id: `MR-2025-${String(numericId).padStart(3, "0")}`,
    returnNo: `MR-2025-${String(numericId).padStart(3, "0")}`,
    date: formatDate(date),
    dateIso: toIsoDate(date),
    karigar: karigarOptions[(offset * 3 + 1) % karigarOptions.length],
    manufacturingOrder: manufacturingOrderOptions[offset % manufacturingOrderOptions.length],
    returnType: offset % 6 === 0 ? "Full Return" : "Partial Return",
    totalMaterials: (offset % 5) + 1,
    returnedWeight,
    wastage,
    status: statusCycle[offset % statusCycle.length],
  };
});

export const initialMaterialReturns: MaterialReturnRecord[] = [
  ...featuredReturns,
  ...generatedReturns,
];

export function formatReturnDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
}

export function isMaterialReturnRecord(value: unknown): value is MaterialReturnRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MaterialReturnRecord>;
  return typeof item.id === "string"
    && typeof item.returnNo === "string"
    && typeof item.date === "string"
    && typeof item.dateIso === "string"
    && typeof item.karigar === "string"
    && typeof item.manufacturingOrder === "string"
    && typeof item.totalMaterials === "number"
    && typeof item.returnedWeight === "number"
    && typeof item.wastage === "number"
    && (item.returnType === "Partial Return" || item.returnType === "Full Return" || item.returnType === "Wastage Return")
    && (item.status === "Received" || item.status === "Verified" || item.status === "Pending");
}
