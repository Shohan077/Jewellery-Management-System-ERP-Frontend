export type MaterialIssueStatus = "Issued" | "Returned";

export type MaterialLine = {
  id: string;
  material: string;
  purity: string;
  weight: number;
  remarks: string;
};

export type MaterialIssueRecord = {
  id: string;
  issueNo: string;
  date: string;
  dateIso: string;
  karigar: string;
  manufacturingOrder: string;
  totalMaterial: number;
  totalWeight: number;
  status: MaterialIssueStatus;
  materials?: MaterialLine[];
  note?: string;
};

export const MATERIAL_ISSUES_STORAGE_KEY = "jewellery-erp:material-issues:v1";
export const MATERIAL_ISSUES_DELETED_STORAGE_KEY = "jewellery-erp:material-issues-deleted:v1";
export const MATERIAL_ISSUES_STORAGE_EVENT = "jewellery-erp:material-issues-updated";

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
] as const;

export const materialOptions = [
  "Gold (Raw)",
  "Silver (Alloy)",
  "Diamond Stone",
  "Copper Alloy",
  "Platinum (Raw)",
] as const;

export const purityOptions = ["24K", "22K", "21K", "18K", "N/A"] as const;

export const initialMaterialLines: MaterialLine[] = [
  { id: "material-1", material: "Gold (Raw)", purity: "22K", weight: 40, remarks: "For Ring" },
  { id: "material-2", material: "Silver (Alloy)", purity: "N/A", weight: 5, remarks: "For Polish" },
  { id: "material-3", material: "Diamond Stone", purity: "N/A", weight: 0.25, remarks: "Main Stone" },
];

const featuredIssues: MaterialIssueRecord[] = [
  { id: "MI-2025-001", issueNo: "MI-2025-001", date: "12 Apr 2025", dateIso: "2025-04-12", karigar: "Mohammad Ali", manufacturingOrder: "MO-2025-001", totalMaterial: 3, totalWeight: 45.25, status: "Issued", materials: initialMaterialLines },
  { id: "MI-2025-002", issueNo: "MI-2025-002", date: "11 Apr 2025", dateIso: "2025-04-11", karigar: "Rafiq Islam", manufacturingOrder: "MO-2025-002", totalMaterial: 4, totalWeight: 82.5, status: "Issued" },
  { id: "MI-2025-003", issueNo: "MI-2025-003", date: "10 Apr 2025", dateIso: "2025-04-10", karigar: "Kalim Uddin", manufacturingOrder: "MO-2025-003", totalMaterial: 2, totalWeight: 25, status: "Returned" },
  { id: "MI-2025-004", issueNo: "MI-2025-004", date: "09 Apr 2025", dateIso: "2025-04-09", karigar: "Jabbar Hossain", manufacturingOrder: "MO-2025-004", totalMaterial: 3, totalWeight: 18.75, status: "Issued" },
  { id: "MI-2025-005", issueNo: "MI-2025-005", date: "08 Apr 2025", dateIso: "2025-04-08", karigar: "Selim Mia", manufacturingOrder: "MO-2025-005", totalMaterial: 5, totalWeight: 62, status: "Issued" },
  { id: "MI-2025-006", issueNo: "MI-2025-006", date: "07 Apr 2025", dateIso: "2025-04-07", karigar: "Rahin Khan", manufacturingOrder: "MO-2025-001", totalMaterial: 2, totalWeight: 12.5, status: "Issued" },
  { id: "MI-2025-007", issueNo: "MI-2025-007", date: "06 Apr 2025", dateIso: "2025-04-06", karigar: "Kalim Hossain", manufacturingOrder: "MO-2025-002", totalMaterial: 4, totalWeight: 38.2, status: "Returned" },
  { id: "MI-2025-008", issueNo: "MI-2025-008", date: "05 Apr 2025", dateIso: "2025-04-05", karigar: "Rafiq Islam", manufacturingOrder: "MO-2025-003", totalMaterial: 1, totalWeight: 8.5, status: "Issued" },
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

const generatedIssues: MaterialIssueRecord[] = Array.from({ length: 90 }, (_, offset) => {
  const numericId = offset + 9;
  const date = new Date(Date.UTC(2025, 3, 4 - offset));
  const totalMaterial = (offset % 5) + 1;
  return {
    id: `MI-2025-${String(numericId).padStart(3, "0")}`,
    issueNo: `MI-2025-${String(numericId).padStart(3, "0")}`,
    date: formatDate(date),
    dateIso: toIsoDate(date),
    karigar: karigarOptions[(offset * 3) % karigarOptions.length],
    manufacturingOrder: manufacturingOrderOptions[offset % manufacturingOrderOptions.length],
    totalMaterial,
    totalWeight: Number((6.75 + ((offset * 13.125) % 92)).toFixed(3)),
    status: numericId % 7 === 0 ? "Returned" : "Issued",
  };
});

export const initialMaterialIssues: MaterialIssueRecord[] = [...featuredIssues, ...generatedIssues];

export function formatIssueDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
}

export function isMaterialIssueRecord(value: unknown): value is MaterialIssueRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MaterialIssueRecord>;
  return typeof item.id === "string"
    && typeof item.issueNo === "string"
    && typeof item.date === "string"
    && typeof item.dateIso === "string"
    && typeof item.karigar === "string"
    && typeof item.manufacturingOrder === "string"
    && typeof item.totalMaterial === "number"
    && typeof item.totalWeight === "number"
    && (item.status === "Issued" || item.status === "Returned");
}
