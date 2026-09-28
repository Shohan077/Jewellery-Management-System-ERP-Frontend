export type CashTransactionKind = "Income" | "Expense" | "Opening";

export type CashTransaction = {
  id: number;
  date: string;
  particulars: string;
  type: CashTransactionKind;
  cashIn: number;
  cashOut: number;
  balance: number;
  paymentMethod: "Cash" | "Bank" | "Card" | "-";
};

export const cashTransactionSeed: CashTransaction[] = [
  { id: 1, date: "18 May, 2024", particulars: "Opening Balance", type: "Opening", cashIn: 0, cashOut: 0, balance: 125650, paymentMethod: "-" },
  { id: 2, date: "18 May, 2024", particulars: "Sales Invoice - INV-10045", type: "Income", cashIn: 85000, cashOut: 0, balance: 210650, paymentMethod: "Cash" },
  { id: 3, date: "18 May, 2024", particulars: "Gold Purchase - GP-20012", type: "Expense", cashIn: 0, cashOut: 65000, balance: 145650, paymentMethod: "Cash" },
  { id: 4, date: "18 May, 2024", particulars: "Customer Advance - Rahim Khan", type: "Income", cashIn: 45000, cashOut: 0, balance: 190650, paymentMethod: "Cash" },
  { id: 5, date: "18 May, 2024", particulars: "Electricity Bill Payment", type: "Expense", cashIn: 0, cashOut: 8750, balance: 181900, paymentMethod: "Cash" },
  { id: 6, date: "18 May, 2024", particulars: "Salary Payment", type: "Expense", cashIn: 0, cashOut: 55000, balance: 126900, paymentMethod: "Cash" },
  { id: 7, date: "18 May, 2024", particulars: "Diamond Sale - INV-10046", type: "Income", cashIn: 125000, cashOut: 0, balance: 251900, paymentMethod: "Card" },
  { id: 8, date: "18 May, 2024", particulars: "Miscellaneous - GP-20012", type: "Expense", cashIn: 0, cashOut: 3400, balance: 248500, paymentMethod: "Cash" },
  { id: 9, date: "18 May, 2024", particulars: "Bank Deposit", type: "Expense", cashIn: 0, cashOut: 55500, balance: 193000, paymentMethod: "Bank" },
];

export const cashFlowSeries = [
  { color: "#16a65a", label: "Cash In", values: [235, 330, 225, 310, 220, 295, 275] },
  { color: "#f04e55", label: "Cash Out", values: [145, 225, 95, 180, 85, 155, 215] },
] as const;

export type ProfitLossRow = {
  label: string;
  current: string;
  previous: string;
  change: string;
  percent: string;
  emphasis?: "medium" | "strong";
};

export const profitLossRows: ProfitLossRow[] = [
  { label: "Total Sales", current: "18,75,000", previous: "15,62,500", change: "3,12,500", percent: "+20.01%" },
  { label: "Less: Sales Return", current: "(45,000)", previous: "(32,500)", change: "(12,500)", percent: "+38.46%" },
  { label: "Net Sales", current: "18,30,000", previous: "15,30,000", change: "3,00,000", percent: "+19.61%", emphasis: "strong" },
  { label: "Total Purchase", current: "11,25,000", previous: "9,75,000", change: "1,50,000", percent: "+15.38%" },
  { label: "Less: Purchase Return", current: "(25,000)", previous: "(20,000)", change: "(5,000)", percent: "+25.00%" },
  { label: "Gross Profit", current: "7,30,000", previous: "5,75,000", change: "1,55,000", percent: "+26.96%", emphasis: "medium" },
  { label: "Total Expenses", current: "2,45,000", previous: "2,10,000", change: "35,000", percent: "+16.67%" },
  { label: "Operating Profit", current: "4,85,000", previous: "3,65,000", change: "1,20,000", percent: "+32.88%", emphasis: "medium" },
  { label: "Other Income", current: "55,000", previous: "40,000", change: "15,000", percent: "+37.50%" },
  { label: "Net Profit", current: "5,40,000", previous: "4,05,000", change: "1,35,000", percent: "+33.33%", emphasis: "strong" },
];

export const profitTrendSeries = [
  { color: "#146ff0", label: "This Period", values: [2.2, 2.7, 3.6, 3.7, 4.3, 3.1, 3.9, 4.3, 3.7, 4.2, 4.6, 4.1, 3.8, 4.2, 4.7, 4.2, 4.3, 4.8, 4.5, 5.2, 4.4, 4.6, 4.0, 4.2] },
  { color: "#a9afb8", label: "Previous Period", values: [1.0, 1.3, 1.6, 2.0, 2.5, 1.9, 2.2, 2.5, 2.2, 2.4, 2.5, 2.1, 2.4, 2.7, 3.0, 2.7, 3.1, 3.5, 3.4, 3.9, 3.2, 3.5, 3.4, 3.6] },
] as const;

export const expenseSlices = [
  { color: "#1769df", label: "Salary", value: 40 },
  { color: "#5c91e7", label: "Rent", value: 15 },
  { color: "#f2a926", label: "Utilities", value: 10 },
  { color: "#58c790", label: "Marketing", value: 10 },
  { color: "#f28542", label: "Miscellaneous", value: 25 },
] as const;

export const expenseAmounts: Readonly<Record<string, string>> = {
  Salary: "98,000",
  Rent: "36,750",
  Utilities: "24,500",
  Marketing: "24,500",
  Miscellaneous: "61,250",
};

export const topExpenses = [
  ["Salary Expense", "98,000"],
  ["Rent Expense", "36,750"],
  ["Electricity Bill", "18,500"],
  ["Advertisement", "15,000"],
  ["Miscellaneous", "14,750"],
] as const;

export const netMarginValues = [18, 21, 27, 25, 21, 19, 26, 34, 30, 27, 35, 31, 34, 36] as const;

export type UserStatus = "Active" | "Inactive";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Branch Manager" | "Sales Manager" | "Accountant" | "Store Keeper" | "Cashier" | "Karigar Incharge" | "Sales Executive";
  phone: string;
  status: UserStatus;
  lastLogin: string;
};

export const userSeed: UserRecord[] = [
  { id: 1, name: "Rahim Khan", email: "rahim.khan@email.com", role: "Super Admin", phone: "01712-345678", status: "Active", lastLogin: "May 18, 2024 10:30 AM" },
  { id: 2, name: "Sadiq Akter", email: "sadiq.akter@email.com", role: "Branch Manager", phone: "01823-456789", status: "Active", lastLogin: "May 18, 2024 09:15 AM" },
  { id: 3, name: "Fahim Ahmed", email: "fahim.ahmed@email.com", role: "Sales Manager", phone: "01798-765432", status: "Active", lastLogin: "May 18, 2024 11:05 AM" },
  { id: 4, name: "Jannat Islam", email: "jannat.islam@email.com", role: "Accountant", phone: "01911-223344", status: "Active", lastLogin: "May 18, 2024 08:40 AM" },
  { id: 5, name: "Nurul Hasan", email: "nurul.hasan@email.com", role: "Store Keeper", phone: "01671-334455", status: "Active", lastLogin: "May 17, 2024 06:20 PM" },
  { id: 6, name: "Mahmud Hasan", email: "mahmud.hasan@email.com", role: "Cashier", phone: "01844-667788", status: "Active", lastLogin: "May 18, 2024 10:10 AM" },
  { id: 7, name: "Biplob Roy", email: "biplob.roy@email.com", role: "Karigar Incharge", phone: "01733-556677", status: "Inactive", lastLogin: "May 16, 2024 05:45 PM" },
  { id: 8, name: "Suresh Kumar", email: "suresh.kumar@email.com", role: "Sales Executive", phone: "01552-998877", status: "Active", lastLogin: "May 18, 2024 09:00 AM" },
];

export const roleSlices = [
  { color: "#1769df", label: "Super Admin", value: 21.43 },
  { color: "#4992e9", label: "Branch Manager", value: 10.71 },
  { color: "#54c58e", label: "Sales Manager", value: 14.29 },
  { color: "#f2ac21", label: "Accountant", value: 10.71 },
  { color: "#f17b43", label: "Other Roles", value: 42.86 },
] as const;

export const roleCounts: Readonly<Record<string, number>> = {
  "Super Admin": 6,
  "Branch Manager": 3,
  "Sales Manager": 4,
  Accountant: 3,
  "Other Roles": 12,
};

export type ActivityTone = "blue" | "green" | "orange" | "violet";

export type RecentActivity = {
  id: number;
  person: string;
  detail: string;
  time: string;
  action: string;
  tone: ActivityTone;
};

export const recentActivities: RecentActivity[] = [
  { id: 1, person: "Rahim Khan", detail: "logged in", time: "May 18, 2024 10:30 AM", action: "Login", tone: "violet" },
  { id: 2, person: "Sadiq Akter", detail: "updated invoice INV-10045", time: "May 18, 2024 10:20 AM", action: "Update", tone: "blue" },
  { id: 3, person: "Fahim Ahmed", detail: "created new customer", time: "May 18, 2024 09:20 AM", action: "Create", tone: "green" },
  { id: 4, person: "Jannat Islam", detail: "downloaded Sales Report", time: "May 18, 2024 09:05 AM", action: "Download", tone: "orange" },
  { id: 5, person: "Mahmud Hasan", detail: "received payment", time: "May 18, 2024 08:35 AM", action: "Payment", tone: "green" },
];

export type BranchRecord = {
  id: number;
  name: string;
  manager: string;
  phone: string;
  email: string;
  sales: number;
  stock: number;
  status: "Active" | "Inactive";
};

export const branchSeed: BranchRecord[] = [
  { id: 1, name: "Main Branch", manager: "Rahim Khan", phone: "01712-345678", email: "main@jewellery.com", sales: 1245000, stock: 5230000, status: "Active" },
  { id: 2, name: "Uttara Branch", manager: "Sadiq Akter", phone: "01823-456789", email: "uttara@jewellery.com", sales: 485000, stock: 1875000, status: "Active" },
  { id: 3, name: "Dhanmondi Branch", manager: "Fahim Ahmed", phone: "01798-765432", email: "dhanmondi@jewellery.com", sales: 395000, stock: 1620000, status: "Active" },
  { id: 4, name: "Chattogram Branch", manager: "Nurul Hasan", phone: "01671-334455", email: "ctg@jewellery.com", sales: 325000, stock: 1410000, status: "Active" },
  { id: 5, name: "Sylhet Branch", manager: "Jannat Islam", phone: "01911-223344", email: "sylhet@jewellery.com", sales: 275000, stock: 1135000, status: "Active" },
  { id: 6, name: "Khulna Branch", manager: "Mahmud Hasan", phone: "01844-667788", email: "khulna@jewellery.com", sales: 150000, stock: 1290000, status: "Active" },
];

export const branchStockSlices = [
  { color: "#1769df", label: "Main Branch", value: 41.67 },
  { color: "#4d91e5", label: "Uttara Branch", value: 14.94 },
  { color: "#f2aa22", label: "Dhanmondi Branch", value: 12.9 },
  { color: "#ef5b4d", label: "Chattogram Branch", value: 11.22 },
  { color: "#55c38b", label: "Sylhet Branch", value: 9.03 },
  { color: "#8d78db", label: "Khulna Branch", value: 10.24 },
] as const;

