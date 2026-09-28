export type Accent = "blue" | "green" | "orange" | "violet" | "red" | "teal";

export type Metric = {
  label: string;
  value: string;
  note: string;
  accent: Accent;
  trend?: string;
};

export type MortgageStatus = "Active" | "Overdue" | "Released" | "Closed";

export type MortgageRow = {
  id: string;
  customer: string;
  weight: string;
  purity: string;
  amount: string;
  interest: string;
  dueDate: string;
  status: MortgageStatus;
};

export const mortgageMetrics: readonly Metric[] = [
  { label: "Total Mortgage", value: "৳ 18,45,320", note: "128 Active", accent: "blue" },
  { label: "Total Loan Amount", value: "৳ 12,65,500", note: "128 Active", accent: "green" },
  { label: "Total Interest", value: "৳ 2,35,820", note: "This Month", accent: "violet" },
  { label: "Released Today", value: "12", note: "Pledges Released", accent: "green" },
];

export const mortgageTabs = ["Active Mortgages", "Released", "Overdue", "Closed"] as const;

export const mortgageRows: readonly MortgageRow[] = [
  { id: "MOR-10058", customer: "Rahim Ahmed", weight: "22.50 g", purity: "22K", amount: "৳ 1,80,000", interest: "18%", dueDate: "10 Jun 2025", status: "Active" },
  { id: "MOR-10057", customer: "Sadia Akter", weight: "15.30 g", purity: "21K", amount: "৳ 1,20,000", interest: "18%", dueDate: "05 Jun 2025", status: "Active" },
  { id: "MOR-10056", customer: "Karim Uddin", weight: "18.20 g", purity: "22K", amount: "৳ 1,45,000", interest: "18%", dueDate: "02 Jun 2025", status: "Active" },
  { id: "MOR-10055", customer: "Nur Jahan", weight: "31.60 g", purity: "24K", amount: "৳ 2,50,000", interest: "18%", dueDate: "30 May 2025", status: "Active" },
  { id: "MOR-10054", customer: "Jamal Hossain", weight: "12.80 g", purity: "21K", amount: "৳ 1,00,000", interest: "18%", dueDate: "28 May 2025", status: "Overdue" },
  { id: "MOR-10053", customer: "Ayesha Khan", weight: "20.10 g", purity: "22K", amount: "৳ 1,60,000", interest: "18%", dueDate: "25 May 2025", status: "Active" },
  { id: "MOR-10052", customer: "Mohammad Ali", weight: "25.40 g", purity: "22K", amount: "৳ 2,00,000", interest: "18%", dueDate: "20 May 2025", status: "Active" },
  { id: "MOR-10051", customer: "Nasrin Akter", weight: "10.60 g", purity: "21K", amount: "৳ 80,000", interest: "18%", dueDate: "18 May 2025", status: "Active" },
];

export type CashType = "Income" | "Expense";

export type CashRow = {
  date: string;
  reference: string;
  description: string;
  type: CashType;
  income: string;
  expense: string;
  balance: string;
  paymentMode: "Cash" | "Bank";
};

export const cashMetrics: readonly Metric[] = [
  { label: "Cash in Hand", value: "৳ 2,45,780", note: "Updated just now", accent: "blue" },
  { label: "Today’s Income", value: "৳ 1,25,600", note: "5 Transactions", accent: "green" },
  { label: "Today’s Expense", value: "৳ 78,450", note: "8 Transactions", accent: "orange" },
  { label: "Bank Balance", value: "৳ 8,95,200", note: "3 Accounts", accent: "violet" },
];

export const cashTabs = ["Cashbook", "Income", "Expense", "Bank Accounts", "Ledger"] as const;

export const cashRows: readonly CashRow[] = [
  { date: "26 May 2025", reference: "INC-10078", description: "Sales Collection", type: "Income", income: "৳ 48,750", expense: "–", balance: "৳ 2,45,780", paymentMode: "Cash" },
  { date: "26 May 2025", reference: "EXP-10045", description: "Gold Purchase", type: "Expense", income: "–", expense: "৳ 35,000", balance: "৳ 1,97,030", paymentMode: "Cash" },
  { date: "26 May 2025", reference: "INC-10077", description: "Old Gold Sale", type: "Income", income: "৳ 25,000", expense: "–", balance: "৳ 2,32,030", paymentMode: "Cash" },
  { date: "25 May 2025", reference: "EXP-10044", description: "Salary Payment", type: "Expense", income: "–", expense: "৳ 28,500", balance: "৳ 2,03,530", paymentMode: "Bank" },
  { date: "25 May 2025", reference: "INC-10076", description: "Diamond Sale", type: "Income", income: "৳ 75,000", expense: "–", balance: "৳ 2,32,030", paymentMode: "Bank" },
  { date: "25 May 2025", reference: "EXP-10043", description: "Electricity Bill", type: "Expense", income: "–", expense: "৳ 5,200", balance: "৳ 1,56,030", paymentMode: "Cash" },
  { date: "25 May 2025", reference: "EXP-10042", description: "Office Expense", type: "Expense", income: "–", expense: "৳ 3,800", balance: "৳ 1,60,430", paymentMode: "Cash" },
  { date: "24 May 2025", reference: "INC-10075", description: "Customer Advance", type: "Income", income: "৳ 15,000", expense: "–", balance: "৳ 1,64,230", paymentMode: "Cash" },
];

export const reportTabs = ["Overview", "Sales Report", "Purchase Report", "Stock Report", "Profit & Loss", "Cash Flow", "Customer Report", "Karigar Report"] as const;

export const reportMetrics: readonly Metric[] = [
  { label: "Total Sales", value: "৳ 18,45,320", trend: "↑ 14.2%", note: "vs last period", accent: "blue" },
  { label: "Total Purchase", value: "৳ 10,32,600", trend: "↑ 9.8%", note: "vs last period", accent: "teal" },
  { label: "Gross Profit", value: "৳ 8,12,720", trend: "↑ 16.6%", note: "vs last period", accent: "green" },
  { label: "Net Profit", value: "৳ 6,21,450", trend: "↑ 16.3%", note: "vs last period", accent: "green" },
];

export const salesTrend = {
  labels: ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"],
  sales: [1.52, 1.42, 1.48, 1.55, 1.48, 1.45],
  purchase: [0.92, 0.86, 0.91, 1.08, 1.02, 1.17],
} as const;

export const profitTrend = {
  labels: ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"],
  profit: [0.72, 1.10, 1.23, 0.83, 1.45, 1.08, 1.35, 1.55, 1.10, 1.36, 1.58, 1.23, 1.50, 1.08, 0.92, 1.16],
  loss: [0.27, 0.63, 0.78, 0.42, 0.91, 0.61, 0.75, 0.98, 0.55, 0.67, 1.00, 0.57, 0.80, 0.50, 0.39, 0.50],
} as const;

export const categorySlices = [
  { color: "#1673e8", label: "Rings", value: 32 },
  { color: "#3c91ed", label: "Necklaces", value: 26 },
  { color: "#f2a521", label: "Bangles", value: 18 },
  { color: "#f47b42", label: "Earrings", value: 14 },
  { color: "#b052ca", label: "Others", value: 10 },
] as const;

export const topProducts = [
  { product: "Gold Ring (22K)", category: "Ring", quantity: 125, amount: "৳ 4,25,000" },
  { product: "Gold Necklace (22K)", category: "Necklace", quantity: 68, amount: "৳ 3,20,000" },
  { product: "Gold Bangle (22K)", category: "Bangle", quantity: 82, amount: "৳ 2,45,000" },
  { product: "Gold Earrings (22K)", category: "Earring", quantity: 96, amount: "৳ 1,85,000" },
  { product: "Diamond Ring", category: "Ring", quantity: 41, amount: "৳ 1,45,000" },
] as const;

export const topCustomers = [
  { customer: "Rahim Ahmed", purchase: "৳ 2,48,750" },
  { customer: "Sadia Akter", purchase: "৳ 1,85,200" },
  { customer: "Karim Uddin", purchase: "৳ 1,42,400" },
  { customer: "Nur Jahan", purchase: "৳ 1,23,450" },
  { customer: "Mohammad Ali", purchase: "৳ 98,200" },
] as const;

export type UserStatus = "Active" | "Inactive";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
};

export const userTabs = ["Users", "Roles", "Permissions", "Activity Log", "Login History"] as const;

export const userRows: readonly UserRow[] = [
  { id: 1, name: "Admin", email: "admin@jewelleryerp.com", role: "Super Admin", status: "Active", lastLogin: "26 May 2025 11:32 AM" },
  { id: 2, name: "Mahbub Hossain", email: "mahbub@jewelleryerp.com", role: "Manager", status: "Active", lastLogin: "26 May 2025 10:15 AM" },
  { id: 3, name: "Salma Akter", email: "salma@jewelleryerp.com", role: "Accountant", status: "Active", lastLogin: "26 May 2025 09:48 AM" },
  { id: 4, name: "Rafiq Uddin", email: "rafiq@jewelleryerp.com", role: "Sales Executive", status: "Active", lastLogin: "26 May 2025 09:20 AM" },
  { id: 5, name: "Jannatul Ferdous", email: "jannatul@jewelleryerp.com", role: "Inventory Incharge", status: "Active", lastLogin: "25 May 2025 06:40 PM" },
  { id: 6, name: "Shakil Ahmed", email: "shakil@jewelleryerp.com", role: "Cashier", status: "Active", lastLogin: "25 May 2025 05:30 PM" },
  { id: 7, name: "Arif Hossain", email: "arif@jewelleryerp.com", role: "Sales Executive", status: "Inactive", lastLogin: "24 May 2025 04:10 PM" },
  { id: 8, name: "Nusrat Jahan", email: "nusrat@jewelleryerp.com", role: "Viewer", status: "Active", lastLogin: "24 May 2025 03:22 PM" },
];

export const userMetrics: readonly Metric[] = [
  { label: "Total Users", value: "8", note: "All Users", accent: "blue" },
  { label: "Active Users", value: "7", note: "Currently Active", accent: "green" },
  { label: "Inactive Users", value: "1", note: "Not Active", accent: "red" },
  { label: "Roles", value: "6", note: "System Roles", accent: "violet" },
];
