export const expenseCategories = [
  "Rent",
  "Salary",
  "Utilities",
  "Marketing",
  "Maintenance",
  "Office",
  "Transport",
  "Miscellaneous",
  "Bank Charge",
  "Software",
] as const;

export const paymentMethods = ["Bank", "Cash", "bKash", "Card", "Cheque"] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];
export type PaymentMethod = (typeof paymentMethods)[number];
export type PaymentStatus = "Paid" | "Pending";

export type LedgerExpense = {
  id: string;
  voucherNo: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes: string;
};

export const expenseKpis = {
  total: 400_000,
  thisMonth: 120_500,
  lastMonth: 105_300,
  pendingBills: 35_200,
} as const;

const featuredExpenses: LedgerExpense[] = [
  { id: "EXP-001", voucherNo: "EXP-001", date: "2025-04-30", category: "Rent", description: "Shop Rent", amount: 50_000, paymentMethod: "Bank", status: "Paid", notes: "Main showroom rent for April 2025." },
  { id: "EXP-002", voucherNo: "EXP-002", date: "2025-04-28", category: "Salary", description: "Staff Salary", amount: 75_000, paymentMethod: "Bank", status: "Paid", notes: "Monthly staff salary payment." },
  { id: "EXP-003", voucherNo: "EXP-003", date: "2025-04-26", category: "Utilities", description: "Electricity Bill", amount: 12_500, paymentMethod: "Cash", status: "Paid", notes: "Electricity bill for the main branch." },
  { id: "EXP-004", voucherNo: "EXP-004", date: "2025-04-24", category: "Marketing", description: "Advertising", amount: 18_000, paymentMethod: "Bank", status: "Paid", notes: "Digital and local advertising expense." },
  { id: "EXP-005", voucherNo: "EXP-005", date: "2025-04-21", category: "Maintenance", description: "Equipment Repair", amount: 8_500, paymentMethod: "Cash", status: "Paid", notes: "Workshop equipment servicing and repair." },
  { id: "EXP-006", voucherNo: "EXP-006", date: "2025-04-20", category: "Office", description: "Stationery", amount: 4_200, paymentMethod: "Cash", status: "Paid", notes: "Office stationery and printing supplies." },
  { id: "EXP-007", voucherNo: "EXP-007", date: "2025-04-18", category: "Transport", description: "Delivery Cost", amount: 6_800, paymentMethod: "Bank", status: "Paid", notes: "Product delivery and courier charges." },
  { id: "EXP-008", voucherNo: "EXP-008", date: "2025-04-15", category: "Miscellaneous", description: "Other Expense", amount: 3_500, paymentMethod: "Cash", status: "Paid", notes: "Other operating expense." },
  { id: "EXP-009", voucherNo: "EXP-009", date: "2025-04-12", category: "Bank Charge", description: "Bank Fee", amount: 1_200, paymentMethod: "Bank", status: "Paid", notes: "Monthly banking and transaction fees." },
  { id: "EXP-010", voucherNo: "EXP-010", date: "2025-04-10", category: "Software", description: "ERP Subscription", amount: 5_800, paymentMethod: "Bank", status: "Paid", notes: "Jewellery ERP software subscription." },
];

const categoryDescriptions: Record<ExpenseCategory, readonly string[]> = {
  Rent: ["Branch Rent", "Storage Rent"],
  Salary: ["Staff Salary", "Overtime Payment"],
  Utilities: ["Electricity Bill", "Internet Bill", "Water Bill"],
  Marketing: ["Social Campaign", "Print Advertising"],
  Maintenance: ["Shop Maintenance", "Equipment Service"],
  Office: ["Stationery", "Office Supplies"],
  Transport: ["Courier Charge", "Delivery Cost"],
  Miscellaneous: ["Other Expense", "Service Charge"],
  "Bank Charge": ["Bank Fee", "Transfer Charge"],
  Software: ["Software Renewal", "Cloud Subscription"],
};

function historicDate(index: number): string {
  const date = new Date(Date.UTC(2025, 2, 31 - index));
  return date.toISOString().slice(0, 10);
}

function createHistoricExpenses(): LedgerExpense[] {
  return Array.from({ length: 118 }, (_, index) => {
    const sequence = index + 11;
    const category = expenseCategories[index % expenseCategories.length];
    const descriptions = categoryDescriptions[category];
    const voucherNo = `EXP-${String(sequence).padStart(3, "0")}`;

    return {
      id: voucherNo,
      voucherNo,
      date: historicDate(index),
      category,
      description: descriptions[index % descriptions.length],
      amount: 1_100 + ((index * 1_275) % 44_000),
      paymentMethod: paymentMethods[index % 2],
      status: index % 9 === 0 ? "Pending" : "Paid",
      notes: "Recorded business operating expense.",
    };
  });
}

export const initialLedgerExpenses: LedgerExpense[] = [
  ...featuredExpenses,
  ...createHistoricExpenses(),
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const amountFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatExpenseDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function formatExpenseAmount(amount: number): string {
  return amountFormatter.format(amount);
}

export function formatExpenseCurrency(amount: number): string {
  return `৳ ${formatExpenseAmount(amount)}`;
}
