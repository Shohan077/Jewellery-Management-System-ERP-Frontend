export type ExpenseCategory = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
};

export type ExpenseAttachment = {
  name: string;
  size: number;
  type: string;
};

export type PurchaseExpense = {
  id: string;
  date: string;
  category: string;
  supplier: string;
  referenceNo: string;
  amount: number;
  remarks: string;
  attachment?: ExpenseAttachment;
};

export const CATEGORY_STORAGE_KEY = "jewellery-erp:purchase-expense-categories:v1";
export const EXPENSE_STORAGE_KEY = "jewellery-erp:purchase-expense-suite:v1";
export const PURCHASE_EXPENSE_EVENT = "jewellery-erp:purchase-expense-suite-change";

export const defaultCategories: ExpenseCategory[] = [
  { id: "category-transportation", name: "Transportation", description: "Vehicle and delivery cost", status: "Active" },
  { id: "category-loading", name: "Loading Charge", description: "Loading and unloading cost", status: "Active" },
  { id: "category-custom", name: "Custom Fee", description: "Customs and clearance charge", status: "Active" },
  { id: "category-insurance", name: "Insurance", description: "Insurance cost for goods", status: "Active" },
  { id: "category-bank", name: "Bank Charge", description: "Bank transfer and other charges", status: "Active" },
  { id: "category-miscellaneous", name: "Miscellaneous", description: "Other expenses", status: "Active" },
];

export const defaultExpenses: PurchaseExpense[] = [
  { id: "expense-001", date: "2025-04-18", category: "Transportation", supplier: "Amin Jewellery Supply", referenceNo: "EXP-2025-001", amount: 12_500, remarks: "Delivery charge" },
  { id: "expense-002", date: "2025-04-12", category: "Loading Charge", supplier: "Diamond World Ltd.", referenceNo: "EXP-2025-002", amount: 8_000, remarks: "Loading & unloading" },
  { id: "expense-003", date: "2025-04-05", category: "Custom Fee", supplier: "Rahman Gold House", referenceNo: "EXP-2025-003", amount: 15_000, remarks: "Custom clearance" },
  { id: "expense-004", date: "2025-04-02", category: "Other", supplier: "Karim & Sons", referenceNo: "EXP-2025-004", amount: 6_500, remarks: "Miscellaneous" },
];

export const suppliers = [
  "Amin Jewellery Supply",
  "Diamond World Ltd.",
  "Rahman Gold House",
  "Karim & Sons",
  "Shree Gems Suppliers",
] as const;

export const INITIAL_CATEGORY_SNAPSHOT = JSON.stringify(defaultCategories);
export const INITIAL_EXPENSE_SNAPSHOT = JSON.stringify(defaultExpenses);

export function subscribeToExpenseData(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PURCHASE_EXPENSE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PURCHASE_EXPENSE_EVENT, onChange);
  };
}

export function getCategorySnapshot() {
  try {
    return window.localStorage.getItem(CATEGORY_STORAGE_KEY) ?? INITIAL_CATEGORY_SNAPSHOT;
  } catch {
    return INITIAL_CATEGORY_SNAPSHOT;
  }
}

export function getExpenseSnapshot() {
  try {
    return window.localStorage.getItem(EXPENSE_STORAGE_KEY) ?? INITIAL_EXPENSE_SNAPSHOT;
  } catch {
    return INITIAL_EXPENSE_SNAPSHOT;
  }
}

function isCategory(value: unknown): value is ExpenseCategory {
  if (!value || typeof value !== "object") return false;
  const category = value as Partial<ExpenseCategory>;
  return typeof category.id === "string"
    && typeof category.name === "string"
    && typeof category.description === "string"
    && (category.status === "Active" || category.status === "Inactive");
}

function isExpense(value: unknown): value is PurchaseExpense {
  if (!value || typeof value !== "object") return false;
  const expense = value as Partial<PurchaseExpense>;
  return typeof expense.id === "string"
    && typeof expense.date === "string"
    && typeof expense.category === "string"
    && typeof expense.supplier === "string"
    && typeof expense.referenceNo === "string"
    && typeof expense.amount === "number"
    && Number.isFinite(expense.amount)
    && typeof expense.remarks === "string";
}

export function parseCategories(snapshot: string): ExpenseCategory[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isCategory) : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export function parseExpenses(snapshot: string): PurchaseExpense[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isExpense) : defaultExpenses;
  } catch {
    return defaultExpenses;
  }
}

function notify() {
  window.dispatchEvent(new Event(PURCHASE_EXPENSE_EVENT));
}

export function persistCategories(categories: ExpenseCategory[]) {
  window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  notify();
}

export function persistExpenses(expenses: PurchaseExpense[]) {
  window.localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses));
  notify();
}

const numberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function formatBdt(value: number) {
  return `৳ ${numberFormatter.format(value)}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
