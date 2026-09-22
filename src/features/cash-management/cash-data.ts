export type CashDirection = "Cash In" | "Cash Out";

export type CashTransaction = {
  id: string;
  date: string;
  direction: CashDirection;
  party: string;
  category: string;
  reference: string;
  amount: number;
  method: string;
  remarks: string;
};

export type LedgerRow = {
  id: string;
  date: string;
  type: "Opening Balance" | CashDirection;
  reference: string;
  description: string;
  cashIn: number;
  cashOut: number;
};

export const CASH_STORAGE_KEY = "jewellery-erp:cash-management:transactions:v1";
export const CASH_EVENT = "jewellery-erp:cash-management:change";
export const EMPTY_CASH_SNAPSHOT = "[]";

export const recentCashIn: CashTransaction[] = [
  { id: "cash-in-034", date: "2025-04-16", direction: "Cash In", party: "Gold Sale", category: "Sales Collection", reference: "CIN-2025-034", amount: 65_400, method: "Cash", remarks: "Gold jewellery sale collection" },
  { id: "cash-in-033", date: "2025-04-16", direction: "Cash In", party: "Advance Received", category: "Customer Advance", reference: "CIN-2025-033", amount: 25_000, method: "Cash", remarks: "Customer advance received" },
  { id: "cash-in-032", date: "2025-04-15", direction: "Cash In", party: "Diamond Sale", category: "Sales Collection", reference: "CIN-2025-032", amount: 75_000, method: "Cash", remarks: "Diamond sale collection" },
  { id: "cash-in-031", date: "2025-04-15", direction: "Cash In", party: "Old Gold Purchase", category: "Old Gold", reference: "CIN-2025-031", amount: 40_000, method: "Cash", remarks: "Old gold settlement" },
];

export const recentCashOut: CashTransaction[] = [
  { id: "cash-out-021", date: "2025-04-16", direction: "Cash Out", party: "Ramesh Suppliers", category: "Purchase Payment", reference: "COUT-2025-021", amount: 45_000, method: "Cash", remarks: "Supplier purchase payment" },
  { id: "cash-out-020", date: "2025-04-16", direction: "Cash Out", party: "Suresh Karigar", category: "Wages", reference: "COUT-2025-020", amount: 12_500, method: "Cash", remarks: "Karigar wages" },
  { id: "cash-out-019", date: "2025-04-15", direction: "Cash Out", party: "Rent Payment", category: "Rent", reference: "COUT-2025-019", amount: 15_000, method: "Cash", remarks: "Showroom rent" },
  { id: "cash-out-018", date: "2025-04-15", direction: "Cash Out", party: "Electricity Bill", category: "Utilities", reference: "COUT-2025-018", amount: 9_850, method: "Cash", remarks: "Electricity bill" },
];

export const ledgerRows: LedgerRow[] = [
  { id: "opening", date: "2025-04-01", type: "Opening Balance", reference: "-", description: "Opening Cash Balance", cashIn: 0, cashOut: 0 },
  { id: "ledger-in-028", date: "2025-04-14", type: "Cash In", reference: "CIN-2025-028", description: "Gold Sale", cashIn: 85_000, cashOut: 0 },
  { id: "ledger-out-017", date: "2025-04-14", type: "Cash Out", reference: "COUT-2025-017", description: "Purchase Payment", cashIn: 0, cashOut: 60_000 },
  { id: "ledger-in-029", date: "2025-04-15", type: "Cash In", reference: "CIN-2025-029", description: "Diamond Sale", cashIn: 120_000, cashOut: 0 },
  { id: "ledger-out-018", date: "2025-04-15", type: "Cash Out", reference: "COUT-2025-018", description: "Electricity Bill", cashIn: 0, cashOut: 9_850 },
  { id: "ledger-in-034", date: "2025-04-16", type: "Cash In", reference: "CIN-2025-034", description: "Advance Received", cashIn: 25_000, cashOut: 0 },
  { id: "ledger-out-021", date: "2025-04-16", type: "Cash Out", reference: "COUT-2025-021", description: "Ramesh Suppliers", cashIn: 0, cashOut: 45_000 },
  { id: "ledger-in-035", date: "2025-04-16", type: "Cash In", reference: "CIN-2025-035", description: "Old Gold Purchase", cashIn: 75_000, cashOut: 0 },
  { id: "ledger-out-022", date: "2025-04-16", type: "Cash Out", reference: "COUT-2025-022", description: "Daily Expenses", cashIn: 0, cashOut: 7_700 },
];

export const openingBalance = 450_000;
export const baseTotalCashIn = 625_400;
export const baseTotalCashOut = 387_550;
export const baseClosingBalance = 687_250;

export const cashInSources = ["Gold Sale", "Diamond Sale", "Advance Received", "Old Gold Purchase", "Other Collection"];
export const cashInTypes = ["Sales Collection", "Customer Advance", "Old Gold", "Other Income"];
export const cashOutPayees = ["Ramesh Suppliers", "Suresh Karigar", "Rent Payment", "Electricity Bill", "Other Payee"];
export const cashOutTypes = ["Purchase Payment", "Wages", "Rent", "Utilities", "Daily Expense"];
export const paymentMethods = ["Cash", "Bank Transfer", "Card", "Cheque", "Mobile Banking"];

export const receiptHistory: CashTransaction[] = [
  { id: "receipt-421", date: "2025-04-16", direction: "Cash In", party: "Sales - Walk In", category: "Sales Receipt", reference: "INV-2025-421", amount: 45_000, method: "Cash", remarks: "Walk-in sales receipt" },
  { id: "receipt-058", date: "2025-04-16", direction: "Cash In", party: "Customer Advance", category: "Advance Receipt", reference: "ADV-2025-058", amount: 25_000, method: "Bank", remarks: "Customer advance" },
  { id: "receipt-418", date: "2025-04-15", direction: "Cash In", party: "Diamond Sale", category: "Sales Receipt", reference: "INV-2025-418", amount: 75_000, method: "UPI", remarks: "Diamond sale" },
  { id: "receipt-031", date: "2025-04-15", direction: "Cash In", party: "Old Gold Purchase", category: "Old Gold", reference: "OGP-2025-031", amount: 20_750, method: "Cash", remarks: "Old gold purchase receipt" },
  { id: "receipt-012", date: "2025-04-14", direction: "Cash In", party: "Interest Received", category: "Other Receipt", reference: "INT-2025-012", amount: 5_000, method: "Bank", remarks: "Interest received" },
];

export const paymentHistory: CashTransaction[] = [
  { id: "payment-089", date: "2025-04-16", direction: "Cash Out", party: "Sunita Karigar", category: "Wages", reference: "WGS-2025-089", amount: 12_000, method: "Cash", remarks: "Monthly wages" },
  { id: "payment-112", date: "2025-04-16", direction: "Cash Out", party: "Ramesh Suppliers", category: "Raw Materials", reference: "PUR-2025-112", amount: 45_000, method: "Bank", remarks: "Gold ware purchase" },
  { id: "payment-033", date: "2025-04-15", direction: "Cash Out", party: "Electricity Board", category: "Utilities", reference: "UTL-2025-033", amount: 8_250, method: "Bank", remarks: "Electricity bill" },
  { id: "payment-016", date: "2025-04-15", direction: "Cash Out", party: "Rent Payment", category: "Rent", reference: "RNT-2025-016", amount: 15_000, method: "Cash", remarks: "April rent" },
  { id: "payment-021", date: "2025-04-14", direction: "Cash Out", party: "Transport Service", category: "Transport", reference: "TRP-2025-021", amount: 7_500, method: "UPI", remarks: "Material transport" },
];

export const expenseHistory: CashTransaction[] = [
  { id: "expense-054", date: "2025-04-16", direction: "Cash Out", party: "Kiran Stationers", category: "Office Supplies", reference: "EXP-2025-054", amount: 2_350, method: "Cash", remarks: "Office stationery" },
  { id: "expense-053", date: "2025-04-16", direction: "Cash Out", party: "Cafe Delight", category: "Refreshments", reference: "EXP-2025-053", amount: 1_850, method: "Cash", remarks: "Office refreshments" },
  { id: "expense-052", date: "2025-04-15", direction: "Cash Out", party: "BSNL", category: "Telephone", reference: "EXP-2025-052", amount: 1_200, method: "Bank", remarks: "Telephone bill" },
  { id: "expense-051", date: "2025-04-15", direction: "Cash Out", party: "Indian Oil", category: "Vehicle Fuel", reference: "EXP-2025-051", amount: 3_400, method: "Cash", remarks: "Vehicle fuel" },
  { id: "expense-050", date: "2025-04-14", direction: "Cash Out", party: "Print Point", category: "Printing & Stationery", reference: "EXP-2025-050", amount: 1_150, method: "Cash", remarks: "Invoice printing" },
  { id: "expense-049", date: "2025-04-14", direction: "Cash Out", party: "DTDC", category: "Courier Charges", reference: "EXP-2025-049", amount: 680, method: "Cash", remarks: "Courier charge" },
  { id: "expense-048", date: "2025-04-13", direction: "Cash Out", party: "SBI Bank", category: "Bank Charges", reference: "EXP-2025-048", amount: 550, method: "Bank", remarks: "Bank service charge" },
];

export const expenseReportSeed: CashTransaction[] = [
  paymentHistory[1],
  paymentHistory[0],
  paymentHistory[3],
  paymentHistory[2],
  paymentHistory[4],
  expenseHistory[0],
  expenseHistory[4],
];

export function subscribeCash(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CASH_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CASH_EVENT, onChange);
  };
}

export function getCashSnapshot() {
  try {
    return window.localStorage.getItem(CASH_STORAGE_KEY) ?? EMPTY_CASH_SNAPSHOT;
  } catch {
    return EMPTY_CASH_SNAPSHOT;
  }
}

export function parseCashTransactions(snapshot: string): CashTransaction[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value as CashTransaction[] : [];
  } catch {
    return [];
  }
}

export function persistCashTransactions(transactions: CashTransaction[]) {
  window.localStorage.setItem(CASH_STORAGE_KEY, JSON.stringify(transactions));
  window.dispatchEvent(new Event(CASH_EVENT));
}

export function formatMoney(value: number) {
  return `₹ ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`;
}

export function formatCashDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
