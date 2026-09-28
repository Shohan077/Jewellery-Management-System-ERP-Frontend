export type Metric = { label: string; value: string; note: string; trend?: string };

export type NotificationRow = { id: number; title: string; message: string; type: string; date: string; status: "Read" | "Unread" };
export const notificationMetrics: readonly Metric[] = [
  { label: "All Notifications", value: "68", note: "All Time" },
  { label: "Unread", value: "15", note: "Requires Attention" },
  { label: "Today", value: "8", note: "New Today" },
  { label: "This Week", value: "32", note: "New This Week" },
];
export const notifications: readonly NotificationRow[] = [
  { id: 1, title: "Low Gold Stock Alert", message: "Gold Ring (22K) stock is below minimum level.", type: "Inventory", date: "26 May 2025 10:30 AM", status: "Unread" },
  { id: 2, title: "Customer Due Reminder", message: "Rahim Ahmed has due of ৳ 25,600.", type: "Customer", date: "26 May 2025 09:45 AM", status: "Unread" },
  { id: 3, title: "Payment Received", message: "Received ৳ 18,500 from Sadia Akter.", type: "Payment", date: "26 May 2025 09:20 AM", status: "Read" },
  { id: 4, title: "New Sales Order", message: "New POS invoice INV-10078 created.", type: "Sales", date: "26 May 2025 09:15 AM", status: "Read" },
  { id: 5, title: "Gold Rate Updated", message: "Today’s gold rate (22K) updated: ৳ 10,980/gm", type: "System", date: "26 May 2025 08:30 AM", status: "Read" },
  { id: 6, title: "Supplier Payment Due", message: "M/S Gold Palace payment due in 3 days.", type: "Supplier", date: "26 May 2025 07:50 AM", status: "Unread" },
  { id: 7, title: "Low Diamond Stock", message: "Diamond 0.50 CT stock is low.", type: "Inventory", date: "25 May 2025 06:40 PM", status: "Read" },
  { id: 8, title: "Backup Completed", message: "Daily backup completed successfully.", type: "System", date: "25 May 2025 02:10 PM", status: "Read" },
];

export type BranchRow = { code: string; name: string; manager: string; phone: string; city: string; status: "Active" | "Inactive"; sales: string };
export const branchMetrics: readonly Metric[] = [
  { label: "Total Branches", value: "6", note: "All Branches" },
  { label: "Active Branches", value: "5", note: "", trend: "83.33%" },
  { label: "Total Sales (This Month)", value: "৳ 18,45,320", note: "All Branches" },
  { label: "Total Stock Value", value: "৳ 12,85,600", note: "All Branches" },
];
export const branches: readonly BranchRow[] = [
  { code: "BR-001", name: "Main Branch", manager: "Shakil Ahmed", phone: "01712-345678", city: "Dhaka", status: "Active", sales: "৳ 7,85,450" },
  { code: "BR-002", name: "Mirpur Branch", manager: "Salma Akter", phone: "01723-456789", city: "Dhaka", status: "Active", sales: "৳ 3,25,500" },
  { code: "BR-003", name: "Uttara Branch", manager: "Arif Hossain", phone: "01734-567890", city: "Dhaka", status: "Active", sales: "৳ 2,45,120" },
  { code: "BR-004", name: "Chittagong Branch", manager: "Jannatul Ferdous", phone: "01876-543210", city: "Chittagong", status: "Active", sales: "৳ 2,15,300" },
  { code: "BR-005", name: "Sylhet Branch", manager: "Nurul Islam", phone: "01765-422109", city: "Sylhet", status: "Inactive", sales: "৳ 85,250" },
  { code: "BR-006", name: "Khulna Branch", manager: "Monir Hossain", phone: "01798-765432", city: "Khulna", status: "Active", sales: "৳ 3,88,600" },
];
export const branchFooterMetrics: readonly Metric[] = [
  { label: "Total Stock (All Branches)", value: "৳ 12,85,600", note: "At Cost" },
  { label: "Stock Transfer (This Month)", value: "৳ 4,25,750", note: "8 Transfers" },
  { label: "Pending Transfers", value: "3", note: "Pending" },
  { label: "Total Employees", value: "48", note: "All Branches" },
];

export const executiveMetrics: readonly Metric[] = [
  { label: "Total Sales (This Month)", value: "৳ 18,45,320", note: "vs last month", trend: "↑ 14.21%" },
  { label: "Total Purchase (This Month)", value: "৳ 10,32,600", note: "vs last month", trend: "↑ 9.82%" },
  { label: "Gross Profit (This Month)", value: "৳ 8,12,720", note: "vs last month", trend: "↑ 16.48%" },
  { label: "Net Profit (This Month)", value: "৳ 6,21,450", note: "vs last month", trend: "↑ 16.34%" },
];
export const trendLabels = ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May"] as const;
export const salesTrend = [1.25, 1.55, 1.42, 2.05, 1.82, 1.95, 1.91, 1.92, 1.62, 1.87, 1.72, 2.14] as const;
export const purchaseTrend = [.55, .68, .49, .93, .78, .63, .80, 1.00, .72, .62, .87, 1.13] as const;
export const profitTrend = [.52, .64, .55, .45, .76, .73, .78, .82, .88, .92, .73, .82, .69, .61, .82, .96] as const;
export const categories = [
  { label: "Rings", value: 32, color: "#1475ef" }, { label: "Necklaces", value: 26, color: "#278fdf" },
  { label: "Bangles", value: 18, color: "#f4a01c" }, { label: "Pendants", value: 14, color: "#ef746e" },
  { label: "Earrings", value: 6, color: "#39b975" }, { label: "Others", value: 4, color: "#9a56c8" },
] as const;
export const products = [
  ["Gold Ring (22K)", "Ring", "125", "৳ 4,25,000"], ["Gold Necklace (22K)", "Necklace", "68", "৳ 3,20,000"],
  ["Gold Bangle (22K)", "Bangle", "82", "৳ 2,45,000"], ["Gold Earrings (22K)", "Earring", "96", "৳ 1,85,000"],
  ["Gold Pendant (22K)", "Pendant", "74", "৳ 1,45,000"],
] as const;
export const dashboardActivities = [
  ["Sales invoice INV-10078 created", "26 May 2025 11:32 AM"], ["Payment received ৳ 18,500", "26 May 2025 10:45 AM"],
  ["Gold rate updated (22K)", "26 May 2025 09:30 AM"], ["Purchase bill PUR-10056 added", "26 May 2025 08:45 AM"],
  ["Stock transfer BR-001 to BR-002", "26 May 2025 08:40 AM"],
] as const;

export type ActivityRow = { id: number; date: string; user: string; module: string; action: string; details: string; ip: string };
export const activities: readonly ActivityRow[] = [
  { id: 1, date: "26 May 2025 11:32 AM", user: "Admin", module: "POS & Sales", action: "Create", details: "Created invoice INV-10078", ip: "192.168.1.10" },
  { id: 2, date: "26 May 2025 11:15 AM", user: "Salma Akter", module: "Cash & Accounting", action: "Payment", details: "Received payment ৳ 18,500", ip: "192.168.1.11" },
  { id: 3, date: "26 May 2025 10:45 AM", user: "Mahbub Hossain", module: "Purchase", action: "Create", details: "Added purchase bill PUR-10056", ip: "192.168.1.11" },
  { id: 4, date: "26 May 2025 10:30 AM", user: "Shakil Ahmed", module: "Gold Management", action: "Update", details: "Updated gold rate (22K)", ip: "192.168.1.12" },
  { id: 5, date: "26 May 2025 09:58 AM", user: "Arif Hossain", module: "Inventory", action: "Update", details: "Stock updated for Gold Ring (22K)", ip: "192.168.1.10" },
  { id: 6, date: "26 May 2025 09:20 AM", user: "Jannatul Ferdous", module: "Customers", action: "Create", details: "Added new customer: Karim Uddin", ip: "192.168.1.13" },
  { id: 7, date: "26 May 2025 08:55 AM", user: "Nurul Islam", module: "Stock Transfer", action: "Create", details: "Transfer BR-001 to BR-002", ip: "192.168.1.12" },
  { id: 8, date: "26 May 2025 08:30 AM", user: "System", module: "Backup", action: "System", details: "Daily backup completed", ip: "192.168.1.1" },
  { id: 9, date: "25 May 2025 07:45 PM", user: "Monir Hossain", module: "Users & Security", action: "Login", details: "User logged in", ip: "192.168.1.14" },
  { id: 10, date: "25 May 2025 06:10 PM", user: "Admin", module: "Reports & Analytics", action: "Export", details: "Exported sales report", ip: "192.168.1.10" },
];
