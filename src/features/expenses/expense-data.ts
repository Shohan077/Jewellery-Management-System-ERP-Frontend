export const expenseCategories = [
  "Office Rent",
  "Utility Bill",
  "Salary",
  "Marketing",
  "Repair & Maint.",
  "Transport",
  "Stationery",
  "Other",
  "Software",
  "Refreshment",
] as const;

export const paymentMethods = ["Cash", "Bank Transfer", "bKash", "Card", "Cheque"] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

export type ExpenseRecord = {
  id: string;
  voucherNo: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  note: string;
};

export type ExpenseKpis = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
};

export const initialExpenseKpis: ExpenseKpis = {
  total: 485_600,
  thisMonth: 125_300,
  lastMonth: 136_800,
  thisYear: 1_256_400,
};

const featuredExpenses: ExpenseRecord[] = [
  {
    id: "EXP-000125",
    voucherNo: "EXP-000125",
    date: "2025-04-30",
    category: "Office Rent",
    description: "April Rent",
    amount: 50_000,
    paymentMethod: "Bank Transfer",
    note: "Monthly office rent for the main branch.",
  },
  {
    id: "EXP-000124",
    voucherNo: "EXP-000124",
    date: "2025-04-28",
    category: "Utility Bill",
    description: "Electricity Bill",
    amount: 12_500,
    paymentMethod: "Cash",
    note: "April electricity bill.",
  },
  {
    id: "EXP-000123",
    voucherNo: "EXP-000123",
    date: "2025-04-25",
    category: "Salary",
    description: "Staff Salary",
    amount: 85_000,
    paymentMethod: "Bank Transfer",
    note: "Monthly staff payroll.",
  },
  {
    id: "EXP-000122",
    voucherNo: "EXP-000122",
    date: "2025-04-22",
    category: "Marketing",
    description: "Facebook Ads",
    amount: 15_000,
    paymentMethod: "bKash",
    note: "Social media advertising campaign.",
  },
  {
    id: "EXP-000121",
    voucherNo: "EXP-000121",
    date: "2025-04-20",
    category: "Repair & Maint.",
    description: "AC Service",
    amount: 8_500,
    paymentMethod: "Cash",
    note: "Air conditioner servicing.",
  },
  {
    id: "EXP-000120",
    voucherNo: "EXP-000120",
    date: "2025-04-18",
    category: "Transport",
    description: "Delivery Cost",
    amount: 6_200,
    paymentMethod: "Cash",
    note: "Local product delivery costs.",
  },
  {
    id: "EXP-000119",
    voucherNo: "EXP-000119",
    date: "2025-04-15",
    category: "Stationery",
    description: "Office Items",
    amount: 3_800,
    paymentMethod: "Cash",
    note: "Paper, printer supplies, and office items.",
  },
  {
    id: "EXP-000118",
    voucherNo: "EXP-000118",
    date: "2025-04-12",
    category: "Other",
    description: "Miscellaneous",
    amount: 4_300,
    paymentMethod: "Cash",
    note: "Miscellaneous operational costs.",
  },
  {
    id: "EXP-000117",
    voucherNo: "EXP-000117",
    date: "2025-04-10",
    category: "Software",
    description: "ERP Subscription",
    amount: 12_000,
    paymentMethod: "Bank Transfer",
    note: "Monthly ERP software subscription.",
  },
  {
    id: "EXP-000116",
    voucherNo: "EXP-000116",
    date: "2025-04-05",
    category: "Refreshment",
    description: "Guest Meeting",
    amount: 2_600,
    paymentMethod: "Cash",
    note: "Refreshments for a guest meeting.",
  },
];

const descriptions: Record<ExpenseCategory, readonly string[]> = {
  "Office Rent": ["Branch Rent", "Storage Rent"],
  "Utility Bill": ["Electricity Bill", "Internet Bill", "Water Bill"],
  Salary: ["Staff Salary", "Overtime Payment"],
  Marketing: ["Campaign Cost", "Print Advertising"],
  "Repair & Maint.": ["Equipment Service", "Shop Maintenance"],
  Transport: ["Courier Charge", "Delivery Cost"],
  Stationery: ["Printer Supplies", "Office Items"],
  Other: ["Miscellaneous", "Service Charge"],
  Software: ["Software Renewal", "Cloud Subscription"],
  Refreshment: ["Team Refreshment", "Guest Meeting"],
};

function dateBeforeApril(index: number): string {
  const date = new Date(Date.UTC(2025, 2, 31 - index));
  return date.toISOString().slice(0, 10);
}

function historicVoucher(index: number): string {
  if (index < 115) {
    return `EXP-${String(115 - index).padStart(6, "0")}`;
  }

  return `EXP-2024-${String(120 - (index - 115)).padStart(6, "0")}`;
}

function createHistoricExpenses(): ExpenseRecord[] {
  return Array.from({ length: 235 }, (_, index) => {
    const category = expenseCategories[index % expenseCategories.length];
    const categoryDescriptions = descriptions[category];
    const voucherNo = historicVoucher(index);

    return {
      id: voucherNo,
      voucherNo,
      date: dateBeforeApril(index),
      category,
      description: categoryDescriptions[index % categoryDescriptions.length],
      amount: 1_200 + ((index * 1_375) % 48_000),
      paymentMethod: paymentMethods[index % 3],
      note: "Recorded business expense.",
    };
  });
}

export const initialExpenses: ExpenseRecord[] = [
  ...featuredExpenses,
  ...createHistoricExpenses(),
];

const expenseDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatExpenseDate(date: string): string {
  return expenseDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function formatExpenseCurrency(amount: number): string {
  return `৳${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatExpenseAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}
