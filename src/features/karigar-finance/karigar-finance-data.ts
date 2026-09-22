export type KarigarTransactionType = "Work" | "Payment" | "Material Issue" | "Material Return";
export type KarigarLedgerTab = "All Transactions" | "Work Assignment" | "Material Issue" | "Material Return" | "Payment History";
export type KarigarPaymentMethod = "Cash" | "Bank Transfer" | "bKash";

export type KarigarFinanceProfile = {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  workValue: number;
  totalPayment: number;
  totalOrders: number;
};

export type KarigarLedgerTransaction = {
  id: string;
  karigarId: string;
  date: string;
  type: KarigarTransactionType;
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
  note: string;
};

export type KarigarFinancePayment = {
  id: string;
  paymentNo: string;
  date: string;
  karigarId: string;
  method: KarigarPaymentMethod;
  amount: number;
  referenceNo: string;
  remarks: string;
  savedAt: string;
};

export const KARIGAR_FINANCE_STORAGE_KEY = "jewellery-erp:karigar-finance-payments:v1";
export const KARIGAR_FINANCE_STORAGE_EVENT = "jewellery-erp:karigar-finance-payments-updated";

export const karigarFinanceProfiles: KarigarFinanceProfile[] = [
  {
    id: "K-001",
    code: "K-001",
    name: "Rahim Uddin",
    phone: "01314-985798",
    address: "Cumilla, Bangladesh",
    workValue: 256_800,
    totalPayment: 198_500,
    totalOrders: 18,
  },
  {
    id: "K-002",
    code: "K-002",
    name: "Karim Ali",
    phone: "01722-456789",
    address: "Dhaka, Bangladesh",
    workValue: 214_500,
    totalPayment: 164_000,
    totalOrders: 15,
  },
  {
    id: "K-003",
    code: "K-003",
    name: "Jamal Hossain",
    phone: "01818-223344",
    address: "Narayanganj, Bangladesh",
    workValue: 189_000,
    totalPayment: 151_500,
    totalOrders: 12,
  },
];

export const karigarLedgerTabs: KarigarLedgerTab[] = [
  "All Transactions",
  "Work Assignment",
  "Material Issue",
  "Material Return",
  "Payment History",
];

export const karigarPaymentMethods: KarigarPaymentMethod[] = ["Cash", "Bank Transfer", "bKash"];

export const baseLedgerTransactions: KarigarLedgerTransaction[] = [
  {
    id: "rahim-work-001",
    karigarId: "K-001",
    date: "2025-04-10",
    type: "Work",
    referenceNo: "PO-2025-001",
    description: "Gold Necklace",
    debit: 50_000,
    credit: 0,
    note: "Production order assigned for a gold necklace.",
  },
  {
    id: "rahim-work-002",
    karigarId: "K-001",
    date: "2025-04-12",
    type: "Work",
    referenceNo: "PO-2025-002",
    description: "Gold Ring",
    debit: 40_000,
    credit: 0,
    note: "Production order assigned for a gold ring.",
  },
  {
    id: "rahim-payment-001",
    karigarId: "K-001",
    date: "2025-04-15",
    type: "Payment",
    referenceNo: "PAY-2025-001",
    description: "Advance Payment",
    debit: 0,
    credit: 30_000,
    note: "Cash advance against active production orders.",
  },
  {
    id: "rahim-work-003",
    karigarId: "K-001",
    date: "2025-04-20",
    type: "Work",
    referenceNo: "PO-2025-003",
    description: "Gold Bracelet",
    debit: 35_000,
    credit: 0,
    note: "Production order assigned for a gold bracelet.",
  },
  {
    id: "rahim-payment-002",
    karigarId: "K-001",
    date: "2025-04-25",
    type: "Payment",
    referenceNo: "PAY-2025-002",
    description: "Partial Payment",
    debit: 0,
    credit: 20_000,
    note: "Partial payment made by bank transfer.",
  },
  {
    id: "rahim-return-001",
    karigarId: "K-001",
    date: "2025-04-28",
    type: "Material Return",
    referenceNo: "MR-2025-001",
    description: "Unused Gold Return",
    debit: 0,
    credit: 16_700,
    note: "Unused gold returned after completion of the assigned work.",
  },
  {
    id: "karim-work-001",
    karigarId: "K-002",
    date: "2025-03-18",
    type: "Work",
    referenceNo: "PO-2025-014",
    description: "Diamond Ring",
    debit: 62_000,
    credit: 0,
    note: "Production order assigned for a diamond ring.",
  },
  {
    id: "karim-issue-001",
    karigarId: "K-002",
    date: "2025-03-19",
    type: "Material Issue",
    referenceNo: "MI-2025-011",
    description: "Gold and Diamond Issue",
    debit: 18_000,
    credit: 0,
    note: "Materials issued for PO-2025-014.",
  },
  {
    id: "karim-payment-001",
    karigarId: "K-002",
    date: "2025-04-02",
    type: "Payment",
    referenceNo: "PAY-2025-014",
    description: "Work Payment",
    debit: 0,
    credit: 45_000,
    note: "Payment made by bank transfer.",
  },
  {
    id: "jamal-work-001",
    karigarId: "K-003",
    date: "2025-03-24",
    type: "Work",
    referenceNo: "PO-2025-021",
    description: "Gold Chain",
    debit: 58_500,
    credit: 0,
    note: "Production order assigned for a gold chain.",
  },
  {
    id: "jamal-payment-001",
    karigarId: "K-003",
    date: "2025-04-11",
    type: "Payment",
    referenceNo: "PAY-2025-021",
    description: "Work Payment",
    debit: 0,
    credit: 36_000,
    note: "Cash payment against completed work.",
  },
];

export const baseRecentPayments: KarigarFinancePayment[] = [
  {
    id: "recent-rahim-002",
    paymentNo: "PAY-2025-002",
    date: "2025-04-28",
    karigarId: "K-001",
    method: "Bank Transfer",
    amount: 20_000,
    referenceNo: "REF-1202",
    remarks: "Partial payment for completed items.",
    savedAt: "2025-04-28T10:00:00.000Z",
  },
  {
    id: "recent-rahim-001",
    paymentNo: "PAY-2025-001",
    date: "2025-04-15",
    karigarId: "K-001",
    method: "Cash",
    amount: 30_000,
    referenceNo: "REF-1188",
    remarks: "Advance payment.",
    savedAt: "2025-04-15T10:00:00.000Z",
  },
  {
    id: "recent-rahim-000",
    paymentNo: "PAY-2025-000",
    date: "2025-04-05",
    karigarId: "K-001",
    method: "bKash",
    amount: 25_000,
    referenceNo: "REF-1164",
    remarks: "Monthly payment.",
    savedAt: "2025-04-05T10:00:00.000Z",
  },
  {
    id: "recent-karim-014",
    paymentNo: "PAY-2025-014",
    date: "2025-04-02",
    karigarId: "K-002",
    method: "Bank Transfer",
    amount: 45_000,
    referenceNo: "REF-1140",
    remarks: "Work payment.",
    savedAt: "2025-04-02T10:00:00.000Z",
  },
  {
    id: "recent-jamal-021",
    paymentNo: "PAY-2025-021",
    date: "2025-04-11",
    karigarId: "K-003",
    method: "Cash",
    amount: 36_000,
    referenceNo: "REF-1192",
    remarks: "Work payment.",
    savedAt: "2025-04-11T10:00:00.000Z",
  },
];

export function getKarigarProfile(id: string) {
  return karigarFinanceProfiles.find((profile) => profile.id === id) ?? karigarFinanceProfiles[0];
}

export function karigarInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function formatTaka(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function formatKarigarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function isKarigarFinancePayment(value: unknown): value is KarigarFinancePayment {
  if (!value || typeof value !== "object") return false;
  const payment = value as Partial<KarigarFinancePayment>;
  return typeof payment.id === "string"
    && typeof payment.paymentNo === "string"
    && typeof payment.date === "string"
    && typeof payment.karigarId === "string"
    && (payment.method === "Cash" || payment.method === "Bank Transfer" || payment.method === "bKash")
    && typeof payment.amount === "number"
    && Number.isFinite(payment.amount)
    && typeof payment.referenceNo === "string"
    && typeof payment.remarks === "string"
    && typeof payment.savedAt === "string";
}

export function parseKarigarFinancePayments(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isKarigarFinancePayment) : [];
  } catch {
    return [];
  }
}

export function paymentToLedgerTransaction(payment: KarigarFinancePayment): KarigarLedgerTransaction {
  return {
    id: payment.id,
    karigarId: payment.karigarId,
    date: payment.date,
    type: "Payment",
    referenceNo: payment.paymentNo,
    description: payment.remarks || `${payment.method} Payment`,
    debit: 0,
    credit: payment.amount,
    note: payment.referenceNo
      ? `${payment.method} payment. Reference: ${payment.referenceNo}.`
      : `${payment.method} payment.`,
  };
}

export function tabMatchesTransaction(tab: KarigarLedgerTab, type: KarigarTransactionType) {
  if (tab === "All Transactions") return true;
  if (tab === "Work Assignment") return type === "Work";
  if (tab === "Payment History") return type === "Payment";
  return tab === type;
}
