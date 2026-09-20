export type KarigarPaymentStatus = "Paid" | "Partial";
export type KarigarPaymentMethod = "Cash" | "Bank Transfer" | "bKash";

export type KarigarPaymentRecord = {
  id: string;
  paymentNo: string;
  date: string;
  dateIso: string;
  karigar: string;
  reference: string;
  labourAmount: number;
  bonus: number;
  deduction: number;
  previousDue: number;
  paidAmount: number;
  dueAmount: number;
  method: KarigarPaymentMethod;
  status: KarigarPaymentStatus;
  remarks?: string;
};

export type KarigarProfile = {
  id: string;
  specialization: string;
  completedJobs: number;
  currentBalance: number;
};

export const KARIGAR_PAYMENTS_STORAGE_KEY = "jewellery-erp:karigar-payments:v1";
export const KARIGAR_PAYMENTS_STORAGE_EVENT = "jewellery-erp:karigar-payments-updated";

export const karigarPaymentBaselineMetrics = {
  totalPayments: 256,
  paidThisMonth: 485_750,
  totalDue: 128_600,
  activeKarigars: 42,
} as const;

export const karigarProfiles: Record<string, KarigarProfile> = {
  "Mohammad Ali": { id: "KAR-0001", specialization: "Gold Jewellery", completedJobs: 128, currentBalance: 2_000 },
  "Rafiq Islam": { id: "KAR-0002", specialization: "Stone Setting", completedJobs: 112, currentBalance: 1_500 },
  "Kalim Uddin": { id: "KAR-0003", specialization: "Gold Jewellery", completedJobs: 104, currentBalance: 0 },
  "Jabbar Hossain": { id: "KAR-0004", specialization: "Diamond Setting", completedJobs: 89, currentBalance: 2_000 },
  "Selim Mia": { id: "KAR-0005", specialization: "Polishing", completedJobs: 96, currentBalance: 0 },
  "Rahin Khan": { id: "KAR-0006", specialization: "Casting", completedJobs: 82, currentBalance: 1_000 },
  "Kalim Hossain": { id: "KAR-0007", specialization: "Gold Jewellery", completedJobs: 77, currentBalance: 0 },
};

export const karigarNames = Object.keys(karigarProfiles);
export const paymentMethods: KarigarPaymentMethod[] = ["Cash", "Bank Transfer", "bKash"];

const featuredPayments: KarigarPaymentRecord[] = [
  { id: "PAY-2025-001", paymentNo: "PAY-2025-001", date: "12 Apr 2025", dateIso: "2025-04-12", karigar: "Mohammad Ali", reference: "MO-2025-001", labourAmount: 12_500, bonus: 1_000, deduction: 500, previousDue: 2_000, paidAmount: 15_000, dueAmount: 0, method: "Cash", status: "Paid", remarks: "Payment for Gold Ring (22K) order completion." },
  { id: "PAY-2025-002", paymentNo: "PAY-2025-002", date: "12 Apr 2025", dateIso: "2025-04-12", karigar: "Rafiq Islam", reference: "MO-2025-002", labourAmount: 12_500, bonus: 1_000, deduction: 0, previousDue: 0, paidAmount: 12_000, dueAmount: 1_500, method: "Bank Transfer", status: "Partial" },
  { id: "PAY-2025-003", paymentNo: "PAY-2025-003", date: "11 Apr 2025", dateIso: "2025-04-11", karigar: "Kalim Uddin", reference: "MO-2025-003", labourAmount: 18_000, bonus: 500, deduction: 0, previousDue: 0, paidAmount: 18_500, dueAmount: 0, method: "Cash", status: "Paid" },
  { id: "PAY-2025-004", paymentNo: "PAY-2025-004", date: "11 Apr 2025", dateIso: "2025-04-11", karigar: "Jabbar Hossain", reference: "MO-2025-004", labourAmount: 9_000, bonus: 1_000, deduction: 0, previousDue: 0, paidAmount: 8_000, dueAmount: 2_000, method: "Bank Transfer", status: "Partial" },
  { id: "PAY-2025-005", paymentNo: "PAY-2025-005", date: "10 Apr 2025", dateIso: "2025-04-10", karigar: "Selim Mia", reference: "MO-2025-005", labourAmount: 9_000, bonus: 500, deduction: 0, previousDue: 0, paidAmount: 9_500, dueAmount: 0, method: "Cash", status: "Paid" },
  { id: "PAY-2025-006", paymentNo: "PAY-2025-006", date: "10 Apr 2025", dateIso: "2025-04-10", karigar: "Rahin Khan", reference: "MO-2025-006", labourAmount: 7_500, bonus: 500, deduction: 0, previousDue: 0, paidAmount: 7_000, dueAmount: 1_000, method: "Cash", status: "Partial" },
  { id: "PAY-2025-007", paymentNo: "PAY-2025-007", date: "09 Apr 2025", dateIso: "2025-04-09", karigar: "Kalim Hossain", reference: "MO-2025-007", labourAmount: 10_500, bonus: 500, deduction: 0, previousDue: 0, paidAmount: 11_000, dueAmount: 0, method: "Bank Transfer", status: "Paid" },
  { id: "PAY-2025-008", paymentNo: "PAY-2025-008", date: "09 Apr 2025", dateIso: "2025-04-09", karigar: "Rafiq Islam", reference: "MO-2025-008", labourAmount: 6_000, bonus: 500, deduction: 0, previousDue: 0, paidAmount: 6_000, dueAmount: 500, method: "Cash", status: "Partial" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

const generatedPayments: KarigarPaymentRecord[] = Array.from({ length: 248 }, (_, offset) => {
  const number = offset + 9;
  const date = new Date(Date.UTC(2025, 3, 8 - Math.floor(offset / 3)));
  const labourAmount = 5_500 + ((offset * 1_375) % 18_000);
  const bonus = offset % 4 === 0 ? 1_000 : 500;
  const deduction = offset % 7 === 0 ? 500 : 0;
  const previousDue = offset % 3 === 0 ? 1_500 : 0;
  const totalPayable = labourAmount + bonus - deduction + previousDue;
  const dueAmount = offset % 4 === 1 ? 1_000 + (offset % 3) * 500 : 0;
  const paymentNo = `PAY-2025-${String(number).padStart(3, "0")}`;
  return {
    id: paymentNo,
    paymentNo,
    date: formatDate(date),
    dateIso: date.toISOString().slice(0, 10),
    karigar: karigarNames[offset % karigarNames.length],
    reference: `MO-2025-${String((offset % 125) + 9).padStart(3, "0")}`,
    labourAmount,
    bonus,
    deduction,
    previousDue,
    paidAmount: totalPayable - dueAmount,
    dueAmount,
    method: paymentMethods[offset % paymentMethods.length],
    status: dueAmount > 0 ? "Partial" : "Paid",
  };
});

export const initialKarigarPayments = [...featuredPayments, ...generatedPayments];

export function formatPaymentDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
}

export function formatTaka(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

export function isKarigarPaymentRecord(value: unknown): value is KarigarPaymentRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<KarigarPaymentRecord>;
  return typeof item.id === "string"
    && typeof item.paymentNo === "string"
    && typeof item.dateIso === "string"
    && typeof item.karigar === "string"
    && typeof item.reference === "string"
    && typeof item.labourAmount === "number"
    && typeof item.bonus === "number"
    && typeof item.deduction === "number"
    && typeof item.previousDue === "number"
    && typeof item.paidAmount === "number"
    && typeof item.dueAmount === "number"
    && (item.method === "Cash" || item.method === "Bank Transfer" || item.method === "bKash")
    && (item.status === "Paid" || item.status === "Partial");
}
