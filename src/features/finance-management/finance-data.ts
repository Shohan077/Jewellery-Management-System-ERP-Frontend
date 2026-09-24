export type AccountType = "Assets" | "Liabilities" | "Income" | "Expenses";
export type AccountStatus = "Active" | "Inactive";

export type FinanceAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parent: string;
  status: AccountStatus;
};

export type JournalRow = {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
};

export const accountTypes: AccountType[] = ["Assets", "Liabilities", "Income", "Expenses"];
export const accountStatuses: AccountStatus[] = ["Active", "Inactive"];

const referenceAccounts: FinanceAccount[] = [
  { id: "account-1000", code: "1000", name: "Cash and Bank", type: "Assets", parent: "-", status: "Active" },
  { id: "account-1100", code: "1100", name: "Cash in Hand", type: "Assets", parent: "Cash and Bank", status: "Active" },
  { id: "account-1110", code: "1110", name: "Petty Cash", type: "Assets", parent: "Cash and Bank", status: "Active" },
  { id: "account-1120", code: "1120", name: "Bank Account - BRAC", type: "Assets", parent: "Cash and Bank", status: "Active" },
  { id: "account-1200", code: "1200", name: "Accounts Receivable", type: "Assets", parent: "-", status: "Active" },
  { id: "account-2000", code: "2000", name: "Accounts Payable", type: "Liabilities", parent: "-", status: "Active" },
  { id: "account-3000", code: "3000", name: "Sales Revenue", type: "Income", parent: "-", status: "Active" },
  { id: "account-4000", code: "4000", name: "Purchase Expense", type: "Expenses", parent: "-", status: "Active" },
];

const fillerNames: Record<AccountType, string[]> = {
  Assets: ["Bank Balance", "Gold Inventory", "Diamond Inventory", "Advance to Supplier", "Furniture & Fixtures"],
  Liabilities: ["Supplier Payable", "Accrued Expenses", "Tax Payable", "Customer Advance", "Short Term Loan"],
  Income: ["Making Charge Income", "Jewellery Sales", "Service Income", "Other Income", "Discount Received"],
  Expenses: ["Salary Expense", "Rent Expense", "Utilities Expense", "Marketing Expense", "Office Expense"],
};

function buildAccounts(type: AccountType, count: number, startCode: number, offset: number): FinanceAccount[] {
  return Array.from({ length: count }, (_, index) => {
    const code = String(startCode + index * 10);
    const baseName = fillerNames[type][index % fillerNames[type].length];
    return {
      id: `account-${type.toLowerCase()}-${index + offset}`,
      code,
      name: `${baseName}${index >= fillerNames[type].length ? ` ${Math.floor(index / fillerNames[type].length) + 1}` : ""}`,
      type,
      parent: index % 4 === 0 ? "-" : `${type} Group`,
      status: index % 9 === 8 ? "Inactive" : "Active",
    };
  });
}

export const initialAccounts: FinanceAccount[] = [
  ...referenceAccounts,
  ...buildAccounts("Assets", 37, 1210, 1),
  ...buildAccounts("Liabilities", 27, 2010, 1),
  ...buildAccounts("Income", 31, 3010, 1),
  ...buildAccounts("Expenses", 25, 4010, 1),
];

export const journalAccountOptions = [
  { code: "4000", name: "Purchase Expense" },
  { code: "1000", name: "Cash and Bank" },
  { code: "1100", name: "Cash in Hand" },
  { code: "1200", name: "Accounts Receivable" },
  { code: "2000", name: "Accounts Payable" },
  { code: "3000", name: "Sales Revenue" },
];

export const initialJournalRows: JournalRow[] = [
  {
    id: "journal-row-1",
    accountCode: "4000",
    accountName: "Purchase Expense",
    description: "Gold raw material purchase",
    debit: 250_000,
    credit: 0,
  },
  {
    id: "journal-row-2",
    accountCode: "1000",
    accountName: "Cash and Bank",
    description: "Payment via bank",
    debit: 0,
    credit: 250_000,
  },
];

export function nextAccountCode(accounts: FinanceAccount[]) {
  return String(Math.max(...accounts.map((account) => Number(account.code)), 0) + 10);
}

export function formatFinanceNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export function downloadFinanceFile(filename: string, content: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
