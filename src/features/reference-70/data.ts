export type Metric = {
  label: string;
  value: string;
  note: string;
  trend?: string;
  tone?: "success" | "danger";
};

export type OldGoldType = "Purchase" | "Exchange";
export type OldGoldStatus = "Completed" | "Pending";

export type OldGoldEntry = {
  id: string;
  date: string;
  customer: string;
  type: OldGoldType;
  weight: string;
  rate: string;
  value: string;
  profit: string;
  status: OldGoldStatus;
};

export const oldGoldMetrics: readonly Metric[] = [
  { label: "Today’s Purchase (g)", value: "152.750 g", note: "6 Entries" },
  { label: "Today’s Value", value: "৳ 18,45,600", note: "6 Entries" },
  { label: "Today’s Exchange", value: "8.250 g", note: "2 Exchanges" },
  { label: "Making Charge", value: "৳ 2,850", note: "This Month" },
  { label: "Total Profit", value: "৳ 1,26,450", note: "This Month" },
];

export const oldGoldTabs = ["All Entries", "Old Gold Purchase", "Exchange", "Valuation", "Adjustments"] as const;

export const oldGoldEntries: readonly OldGoldEntry[] = [
  { id: "OGP-10078", date: "26 May 2025", customer: "Rahim Ahmed", type: "Purchase", weight: "22.350", rate: "7,650", value: "1,70,828", profit: "8,450", status: "Completed" },
  { id: "OGX-10077", date: "26 May 2025", customer: "Sadia Akter", type: "Exchange", weight: "10.250", rate: "7,620", value: "78,105", profit: "5,250", status: "Completed" },
  { id: "OGP-10076", date: "25 May 2025", customer: "Karim Uddin", type: "Purchase", weight: "18.600", rate: "7,610", value: "1,41,546", profit: "7,346", status: "Completed" },
  { id: "OGX-10075", date: "25 May 2025", customer: "Nusrat Jahan", type: "Exchange", weight: "5.500", rate: "7,600", value: "41,800", profit: "2,800", status: "Completed" },
  { id: "OGP-10074", date: "24 May 2025", customer: "Amirul Hoque", type: "Purchase", weight: "25.300", rate: "7,580", value: "1,92,274", profit: "9,274", status: "Completed" },
  { id: "OGP-10073", date: "24 May 2025", customer: "Shafiqul Islam", type: "Purchase", weight: "15.750", rate: "7,560", value: "1,19,070", profit: "5,670", status: "Completed" },
  { id: "OGX-10072", date: "23 May 2025", customer: "Jannatul Ferdous", type: "Exchange", weight: "8.250", rate: "7,540", value: "62,205", profit: "3,205", status: "Completed" },
  { id: "OGP-10071", date: "23 May 2025", customer: "Monir Hossain", type: "Purchase", weight: "12.500", rate: "7,520", value: "94,000", profit: "4,500", status: "Completed" },
];

export type ProductionStatus = "In Progress" | "Completed" | "Pending";

export type ProductionOrder = {
  id: string;
  item: string;
  karigar: string;
  quantity: number;
  weight: string;
  status: ProductionStatus;
  startDate: string;
  dueDate: string;
};

export const productionMetrics: readonly Metric[] = [
  { label: "Total Orders", value: "72", note: "All Orders" },
  { label: "In Progress", value: "18", note: "", trend: "25.00%", tone: "success" },
  { label: "Completed", value: "42", note: "", trend: "58.33%", tone: "success" },
  { label: "Pending", value: "12", note: "", trend: "16.67%", tone: "success" },
  { label: "Wastage (g)", value: "126.750 g", note: "This Month" },
  { label: "Production Value", value: "৳ 28,65,400", note: "This Month" },
];

export const productionTabs = ["All Orders", "In Progress", "Completed", "Pending", "Material Issue", "Wastage"] as const;

export const productionOrders: readonly ProductionOrder[] = [
  { id: "PROD-10058", item: "Gold Necklace 22K", karigar: "Jahirul Karigar", quantity: 5, weight: "125.300", status: "In Progress", startDate: "24 May 2025", dueDate: "30 May 2025" },
  { id: "PROD-10057", item: "Gold Chain 22K", karigar: "Salim Karigar", quantity: 10, weight: "85.600", status: "In Progress", startDate: "24 May 2025", dueDate: "29 May 2025" },
  { id: "PROD-10056", item: "Gold Bangle 22K", karigar: "Monir Karigar", quantity: 8, weight: "64.200", status: "Completed", startDate: "20 May 2025", dueDate: "24 May 2025" },
  { id: "PROD-10055", item: "Gold Ring 22K", karigar: "Jahirul Karigar", quantity: 15, weight: "33.750", status: "Completed", startDate: "18 May 2025", dueDate: "22 May 2025" },
  { id: "PROD-10054", item: "Gold Earrings 22K", karigar: "Salim Karigar", quantity: 20, weight: "28.400", status: "Completed", startDate: "16 May 2025", dueDate: "20 May 2025" },
  { id: "PROD-10053", item: "Gold Pendant 22K", karigar: "Monir Karigar", quantity: 12, weight: "22.800", status: "Pending", startDate: "25 May 2025", dueDate: "31 May 2025" },
  { id: "PROD-10052", item: "Gold Bracelet 22K", karigar: "Jahirul Karigar", quantity: 6, weight: "41.250", status: "Pending", startDate: "26 May 2025", dueDate: "02 Jun 2025" },
  { id: "PROD-10051", item: "Gold Anklet 22K", karigar: "Salim Karigar", quantity: 8, weight: "18.600", status: "Pending", startDate: "26 May 2025", dueDate: "03 Jun 2025" },
];

export const reportTabs = ["Overview", "Sales Report", "Purchase Report", "Stock Report", "Profit & Loss", "Cash Flow", "Gold Report", "Karigar Report"] as const;

export const reportMetrics: readonly Metric[] = [
  { label: "Total Sales", value: "৳ 18,45,320", note: "vs last period", trend: "↑ 14.21%", tone: "success" },
  { label: "Total Purchase", value: "৳ 10,32,600", note: "vs last period", trend: "↑ 9.83%", tone: "success" },
  { label: "Gross Profit", value: "৳ 8,12,720", note: "vs last period", trend: "↑ 18.45%", tone: "success" },
  { label: "Net Profit", value: "৳ 6,21,450", note: "vs last period", trend: "↑ 16.34%", tone: "success" },
  { label: "Total Expense", value: "৳ 1,91,270", note: "vs last period", trend: "↑ 7.25%", tone: "success" },
];

export const salesTrend = {
  labels: ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"],
  sales: [0.82, 1.12, 1.05, 1.38, 1.35, 1.68],
  purchase: [0.36, 0.58, 0.42, 0.76, 0.70, 0.92],
} as const;

export const salesCategories = [
  { label: "Rings", value: 32, color: "#0f6ee8" },
  { label: "Necklaces", value: 26, color: "#1685e9" },
  { label: "Bangles", value: 18, color: "#f3a31d" },
  { label: "Pendants", value: 14, color: "#ef746e" },
  { label: "Others", value: 10, color: "#995ac8" },
] as const;

export const paymentModes = [
  { label: "Cash", value: 58, color: "#1974ed" },
  { label: "Card", value: 24, color: "#28a6dd" },
  { label: "Bank Transfer", value: 12, color: "#31b979" },
  { label: "Others", value: 6, color: "#55c69a" },
] as const;

export const topSellingProducts = [
  { product: "Gold Ring (22K)", category: "Ring", quantity: 125, amount: "৳ 4,25,000" },
  { product: "Gold Necklace (22K)", category: "Necklace", quantity: 68, amount: "৳ 3,20,000" },
  { product: "Gold Bangle (22K)", category: "Bangle", quantity: 82, amount: "৳ 2,45,000" },
  { product: "Gold Earrings (22K)", category: "Earring", quantity: 96, amount: "৳ 1,85,000" },
  { product: "Gold Pendant (22K)", category: "Pendant", quantity: 74, amount: "৳ 1,45,000" },
] as const;

export const recentActivities = [
  { kind: "sale", title: "Sales invoice INV-10078 created", time: "26 May 2025 11:32 AM" },
  { kind: "purchase", title: "Purchase bill PUR-10056 added", time: "26 May 2025 10:45 AM" },
  { kind: "gold", title: "Gold rate updated (22K)", time: "26 May 2025 09:30 AM" },
  { kind: "stock", title: "Stock item GR-001 quantity updated", time: "26 May 2025 08:15 AM" },
  { kind: "payment", title: "Customer payment received (RCPT-10069)", time: "26 May 2025 08:50 AM" },
] as const;

export type UserStatus = "Active" | "Inactive";

export type SecurityUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
};

export const userTabs = ["Users", "Roles", "Permissions", "Activity Log", "Login History"] as const;

export const userMetrics: readonly Metric[] = [
  { label: "Total Users", value: "18", note: "All Users" },
  { label: "Active Users", value: "15", note: "", trend: "83.33%", tone: "success" },
  { label: "Inactive Users", value: "3", note: "", trend: "16.67%", tone: "success" },
  { label: "Total Roles", value: "7", note: "All Roles" },
  { label: "Total Permissions", value: "132", note: "All Permissions" },
];

export const securityUsers: readonly SecurityUser[] = [
  { id: 1, name: "Admin", email: "admin@jewelleryerp.com", role: "Super Admin", status: "Active", lastLogin: "26 May 2025 11:45 AM" },
  { id: 2, name: "Mahbub Hossain", email: "mahbub@jewelleryerp.com", role: "Manager", status: "Active", lastLogin: "26 May 2025 10:25 AM" },
  { id: 3, name: "Salma Akter", email: "salma@jewelleryerp.com", role: "Accountant", status: "Active", lastLogin: "26 May 2025 09:40 AM" },
  { id: 4, name: "Rafiqul Islam", email: "rafiq@jewelleryerp.com", role: "Sales Executive", status: "Active", lastLogin: "26 May 2025 09:15 AM" },
  { id: 5, name: "Jannatul Ferdous", email: "jannatul@jewelleryerp.com", role: "Inventory Incharge", status: "Active", lastLogin: "25 May 2025 06:20 PM" },
  { id: 6, name: "Shakil Ahmed", email: "shakil@jewelleryerp.com", role: "Cashier", status: "Active", lastLogin: "25 May 2025 05:10 PM" },
  { id: 7, name: "Arif Hossain", email: "arif@jewelleryerp.com", role: "Sales Executive", status: "Inactive", lastLogin: "24 May 2025 04:05 PM" },
  { id: 8, name: "Nusrat Jahan", email: "nusrat@jewelleryerp.com", role: "Viewer", status: "Active", lastLogin: "24 May 2025 03:10 PM" },
];

export const securityShortcuts = [
  { tab: "Roles", title: "Role Based Access", value: "7 Roles", description: "Manage user roles and access", tone: "blue" },
  { tab: "Permissions", title: "Permission Management", value: "132 Permissions", description: "Manage system permissions", tone: "blue" },
  { tab: "Activity Log", title: "Activity Log", value: "1,248 Logs", description: "View user activities", tone: "violet" },
  { tab: "Login History", title: "Login History", value: "3,652 Logins", description: "View login history", tone: "violet" },
] as const;
