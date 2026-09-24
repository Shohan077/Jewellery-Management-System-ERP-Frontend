export type SalesTransaction = {
  invoice: string;
  date: string;
  customer: string;
  customerType: "Retail" | "Wholesale";
  branch: "Main Branch" | "Gulshan Branch" | "Uttara Branch";
  item: string;
  amount: number;
  status: "Paid" | "Due";
};

export const salesTransactions: SalesTransaction[] = [
  { invoice: "INV-2025-001", date: "2025-04-10", customer: "Abdul Rahman", customerType: "Retail", branch: "Main Branch", item: "Gold Necklace (1)", amount: 120_000, status: "Paid" },
  { invoice: "INV-2025-002", date: "2025-04-09", customer: "Sharmin Akter", customerType: "Retail", branch: "Gulshan Branch", item: "Diamond Ring (1)", amount: 95_000, status: "Paid" },
  { invoice: "INV-2025-003", date: "2025-04-08", customer: "Karim Ahmed", customerType: "Wholesale", branch: "Main Branch", item: "Gold Bracelet (2)", amount: 75_000, status: "Due" },
  { invoice: "INV-2025-004", date: "2025-04-07", customer: "Nusrat Jahan", customerType: "Retail", branch: "Uttara Branch", item: "Gold Earring (1)", amount: 45_000, status: "Paid" },
  { invoice: "INV-2025-005", date: "2025-04-06", customer: "Tanvir Hossain", customerType: "Wholesale", branch: "Gulshan Branch", item: "Pendant (1)", amount: 38_000, status: "Paid" },
];

export const salesTrend = [58, 74, 96, 128, 114, 158, 189, 102, 143, 161, 170, 146, 185, 166, 183, 152, 169, 182, 196] as const;

export const salesCategories = [
  { label: "Necklace", value: 28, color: "#1685dd" },
  { label: "Ring", value: 22, color: "#f4a21a" },
  { label: "Bracelet", value: 18, color: "#ef6a42" },
  { label: "Earring", value: 10, color: "#7b49d3" },
  { label: "Pendant", value: 10, color: "#12a266" },
  { label: "Others", value: 12, color: "#95a0ad" },
] as const;

export type UserStatus = "Active" | "Inactive";

export type ManagedUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  lastLoginDate: string;
  lastLoginTime: string;
};

export const userRoles = [
  "Administrator",
  "Manager",
  "Karigar",
  "Accountant",
  "Store Keeper",
  "Sales Executive",
  "Receptionist",
  "Purchase Officer",
] as const;

export const userDepartments = [
  "Management",
  "Sales",
  "Production",
  "Finance",
  "Inventory",
  "Administration",
  "Purchase",
  "Customer Service",
] as const;

export const initialManagedUsers: ManagedUser[] = [
  { id: 1, name: "Admin User", email: "admin@jewellery.com", role: "Administrator", department: "Management", status: "Active", lastLoginDate: "10 Apr 2025", lastLoginTime: "10:30 AM" },
  { id: 2, name: "Rahim Uddin", email: "rahim@jewellery.com", role: "Manager", department: "Sales", status: "Active", lastLoginDate: "10 Apr 2025", lastLoginTime: "09:15 AM" },
  { id: 3, name: "Karim Ali", email: "karim@jewellery.com", role: "Karigar", department: "Production", status: "Active", lastLoginDate: "09 Apr 2025", lastLoginTime: "06:45 PM" },
  { id: 4, name: "Jamal Hossain", email: "jamal@jewellery.com", role: "Accountant", department: "Finance", status: "Active", lastLoginDate: "09 Apr 2025", lastLoginTime: "04:20 PM" },
  { id: 5, name: "Salim Khan", email: "salim@jewellery.com", role: "Store Keeper", department: "Inventory", status: "Active", lastLoginDate: "08 Apr 2025", lastLoginTime: "11:10 AM" },
  { id: 6, name: "Rafiq Mia", email: "rafiq@jewellery.com", role: "Sales Executive", department: "Sales", status: "Inactive", lastLoginDate: "05 Apr 2025", lastLoginTime: "02:30 AM" },
  { id: 7, name: "Nusrat Jahan", email: "nusrat@jewellery.com", role: "Receptionist", department: "Administration", status: "Active", lastLoginDate: "10 Apr 2025", lastLoginTime: "08:50 AM" },
  { id: 8, name: "Tanvir Hossain", email: "tanvir@jewellery.com", role: "Manager", department: "Purchase", status: "Active", lastLoginDate: "09 Apr 2025", lastLoginTime: "05:35 PM" },
  { id: 9, name: "Farzana Akter", email: "farzana@jewellery.com", role: "Administrator", department: "Management", status: "Active", lastLoginDate: "08 Apr 2025", lastLoginTime: "03:42 PM" },
  { id: 10, name: "Imran Ahmed", email: "imran@jewellery.com", role: "Sales Executive", department: "Sales", status: "Active", lastLoginDate: "08 Apr 2025", lastLoginTime: "01:15 PM" },
  { id: 11, name: "Sabiha Noor", email: "sabiha@jewellery.com", role: "Accountant", department: "Finance", status: "Active", lastLoginDate: "07 Apr 2025", lastLoginTime: "10:12 AM" },
  { id: 12, name: "Mahmud Hasan", email: "mahmud@jewellery.com", role: "Store Keeper", department: "Inventory", status: "Inactive", lastLoginDate: "02 Apr 2025", lastLoginTime: "04:22 PM" },
  { id: 13, name: "Laila Begum", email: "laila@jewellery.com", role: "Manager", department: "Customer Service", status: "Active", lastLoginDate: "07 Apr 2025", lastLoginTime: "09:05 AM" },
  { id: 14, name: "Arif Chowdhury", email: "arif@jewellery.com", role: "Karigar", department: "Production", status: "Active", lastLoginDate: "06 Apr 2025", lastLoginTime: "07:40 PM" },
  { id: 15, name: "Nabila Islam", email: "nabila@jewellery.com", role: "Administrator", department: "Management", status: "Active", lastLoginDate: "06 Apr 2025", lastLoginTime: "10:00 AM" },
  { id: 16, name: "Hasan Mahmud", email: "hasan@jewellery.com", role: "Purchase Officer", department: "Purchase", status: "Active", lastLoginDate: "05 Apr 2025", lastLoginTime: "01:55 PM" },
  { id: 17, name: "Sadia Rahman", email: "sadia@jewellery.com", role: "Receptionist", department: "Administration", status: "Inactive", lastLoginDate: "01 Apr 2025", lastLoginTime: "12:35 PM" },
  { id: 18, name: "Omar Faruk", email: "omar@jewellery.com", role: "Administrator", department: "Management", status: "Active", lastLoginDate: "04 Apr 2025", lastLoginTime: "08:25 AM" },
];
