export type PurchaseExpenseRecord = {
  id: string;
  date: string;
  category: string;
  supplier: string;
  referenceNo: string;
  amount: number;
  remarks: string;
};

export const PURCHASE_EXPENSE_REPORTING_STORAGE_KEY = "jewellery-erp:purchase-expense-reporting:v1";
export const PURCHASE_EXPENSE_REPORTING_EVENT = "jewellery-erp:purchase-expense-reporting-change";

export const suppliers = [
  "Shree Gems Suppliers",
  "Shree Packagers",
  "IGI Lab",
] as const;

export const expenseCategories = [
  "Transportation",
  "Packing Material",
  "Lab Charges",
  "Miscellaneous",
] as const;

// The last two zero-value audit records make the reference dashboard's eight
// transactions while keeping its displayed period total at INR 21,900.
export const initialPurchaseExpenses: PurchaseExpenseRecord[] = [
  { id: "expense-0042", date: "2025-05-20", category: "Transportation", supplier: "Shree Gems Suppliers", referenceNo: "EXP/2025/0042", amount: 5_200, remarks: "Transport charges for gold purchase." },
  { id: "expense-0041", date: "2025-05-19", category: "Transportation", supplier: "Shree Gems Suppliers", referenceNo: "EXP/2025/0041", amount: 4_850, remarks: "Transport charges" },
  { id: "expense-0040", date: "2025-05-18", category: "Packing Material", supplier: "Shree Packagers", referenceNo: "EXP/2025/0040", amount: 2_300, remarks: "Packing boxes and materials" },
  { id: "expense-0039", date: "2025-05-16", category: "Lab Charges", supplier: "IGI Lab", referenceNo: "EXP/2025/0039", amount: 3_750, remarks: "Diamond testing charges" },
  { id: "expense-0038", date: "2025-05-15", category: "Miscellaneous", supplier: "-", referenceNo: "EXP/2025/0038", amount: 1_200, remarks: "Office miscellaneous" },
  { id: "expense-0037", date: "2025-05-14", category: "Transportation", supplier: "Shree Gems Suppliers", referenceNo: "EXP/2025/0037", amount: 4_600, remarks: "Transport charges" },
  { id: "expense-0036", date: "2025-05-10", category: "Miscellaneous", supplier: "-", referenceNo: "EXP/2025/0036", amount: 0, remarks: "Waived courier charge" },
  { id: "expense-0035", date: "2025-05-08", category: "Packing Material", supplier: "Shree Packagers", referenceNo: "EXP/2025/0035", amount: 0, remarks: "Complimentary packaging" },
];

export function isPurchaseExpenseRecord(value: unknown): value is PurchaseExpenseRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PurchaseExpenseRecord>;
  return typeof record.id === "string"
    && typeof record.date === "string"
    && typeof record.category === "string"
    && typeof record.supplier === "string"
    && typeof record.referenceNo === "string"
    && typeof record.amount === "number"
    && Number.isFinite(record.amount)
    && typeof record.remarks === "string";
}

export const INITIAL_EXPENSE_SNAPSHOT = JSON.stringify(initialPurchaseExpenses);

export function parseExpenseSnapshot(snapshot: string): PurchaseExpenseRecord[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isPurchaseExpenseRecord) : initialPurchaseExpenses;
  } catch {
    return initialPurchaseExpenses;
  }
}

export function subscribeToExpenses(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PURCHASE_EXPENSE_REPORTING_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PURCHASE_EXPENSE_REPORTING_EVENT, onChange);
  };
}

export function getExpenseSnapshot() {
  try {
    return window.localStorage.getItem(PURCHASE_EXPENSE_REPORTING_STORAGE_KEY) ?? INITIAL_EXPENSE_SNAPSHOT;
  } catch {
    return INITIAL_EXPENSE_SNAPSHOT;
  }
}

export function persistExpenses(records: PurchaseExpenseRecord[]) {
  window.localStorage.setItem(PURCHASE_EXPENSE_REPORTING_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(PURCHASE_EXPENSE_REPORTING_EVENT));
}

const currency = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatRupees(value: number) {
  return `₹ ${currency.format(value)}`;
}

export function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
