export type AccountLedgerRow = {
  id: string;
  date: string;
  voucher: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
};

export type TrialBalanceRow = {
  code: string;
  name: string;
  opening: number;
  debit: number;
  credit: number;
  closing: number;
};

export type JournalLine = {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  costCenter: string;
};

export const accountOptions = ["HDFC Bank - Current A/c", "Cash In Hand", "Sundry Debtors", "Inventory - Gold", "Sundry Creditors"];

export const accountLedgerRows: AccountLedgerRow[] = [
  { id: "ledger-1", date: "2025-04-01", voucher: "RCPT-2025-001", particulars: "Opening Balance", debit: 0, credit: 0, balance: 585_000 },
  { id: "ledger-2", date: "2025-04-03", voucher: "PAY-2025-005", particulars: "Paid to Suresh Suppliers", debit: 0, credit: 180_000, balance: 405_000 },
  { id: "ledger-3", date: "2025-04-07", voucher: "RCPT-2025-010", particulars: "Received from Gold Palace", debit: 275_000, credit: 0, balance: 680_000 },
  { id: "ledger-4", date: "2025-04-12", voucher: "PAY-2025-012", particulars: "Bank Charges", debit: 0, credit: 850, balance: 679_150 },
  { id: "ledger-5", date: "2025-04-18", voucher: "RCPT-2025-018", particulars: "Received from Diamond World", debit: 450_000, credit: 0, balance: 1_129_150 },
  { id: "ledger-6", date: "2025-04-25", voucher: "PAY-2025-025", particulars: "Paid to Rent", debit: 0, credit: 459_150, balance: 670_000 },
];

export const accountInformation = {
  name: "HDFC Bank - Current A/c",
  type: "Bank",
  number: "53000102345678",
  ifsc: "HDFC0001234",
  branch: "MG Road, Bengaluru",
  status: "Active",
  reconciled: "28 Apr 2025",
};

export const initialJournalLines: JournalLine[] = [
  { id: "line-1", account: "Prepaid Rent", description: "Adjustment of Prepaid Rent", debit: 25_000, credit: 0, costCenter: "Main Office" },
  { id: "line-2", account: "Office Supplies", description: "Adjustment of Office Supplies", debit: 12_500, credit: 0, costCenter: "Main Office" },
  { id: "line-3", account: "Rent Expense", description: "Transfer to Rent Expense", debit: 0, credit: 25_000, costCenter: "Main Office" },
  { id: "line-4", account: "Office Supplies Expense", description: "Transfer to Supplies Expense", debit: 0, credit: 12_500, costCenter: "Main Office" },
];

export const journalAccounts = ["Prepaid Rent", "Office Supplies", "Rent Expense", "Office Supplies Expense", "Cash In Hand", "HDFC Bank - Current A/c", "Sales Account", "Purchase Account"];
export const costCenters = ["Main Office", "Sales", "Production", "Administration"];
export const JOURNAL_STORAGE_KEY = "jewellery-erp:accounting-suite:journal:v1";

export const trialBalanceRows: TrialBalanceRow[] = [
  { code: "1001", name: "Cash In Hand", opening: 125_400, debit: 1_245_750, credit: 1_168_250, closing: 202_900 },
  { code: "1002", name: "HDFC Bank - Current A/c", opening: 585_000, debit: 2_160_000, credit: 2_075_000, closing: 670_000 },
  { code: "2001", name: "Sundry Debtors", opening: 850_000, debit: 1_575_000, credit: 1_420_000, closing: 1_005_000 },
  { code: "2002", name: "Inventory - Gold", opening: 1_200_000, debit: 50_000, credit: 125_000, closing: 1_125_000 },
  { code: "3001", name: "Sundry Creditors", opening: 675_000, debit: 850_000, credit: 915_000, closing: 640_000 },
  { code: "4001", name: "Sales Account", opening: 0, debit: 0, credit: 3_245_000, closing: 3_245_000 },
  { code: "5001", name: "Purchase Account", opening: 0, debit: 2_710_000, credit: 0, closing: 2_710_000 },
  { code: "6001", name: "Rent Expense", opening: 0, debit: 150_000, credit: 0, closing: 150_000 },
];

export const profitTrend = [
  { month: "Nov '24", value: 5.2 },
  { month: "Dec '24", value: 6.1 },
  { month: "Jan '25", value: 5.8 },
  { month: "Feb '25", value: 6.75 },
  { month: "Mar '25", value: 7.2 },
  { month: "Apr '25", value: 7.95 },
];

export function formatAccountingMoney(value: number) {
  return `₹ ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
}

export function formatAccountingDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function downloadAccountingCsv(filename: string, rows: Array<Array<string | number>>) {
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = rows.map((row) => row.map(quote).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

