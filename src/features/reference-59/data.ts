export type InventoryStatus = "In Stock" | "Low Stock";

export type DiamondRecord = {
  id: number;
  code: string;
  shape: string;
  carat: string;
  color: string;
  clarity: string;
  cut: string;
  certificate: string;
  rate: string;
  value: string;
  status: InventoryStatus;
};

export const diamondSeed: DiamondRecord[] = [
  { id: 1, code: "DIA-1001", shape: "Round", carat: "1.02", color: "D", clarity: "VVS1", cut: "Excellent", certificate: "GIA-24165123", rate: "8,45,000", value: "8,61,900", status: "In Stock" },
  { id: 2, code: "DIA-1002", shape: "Princess", carat: "0.75", color: "E", clarity: "VS1", cut: "Very Good", certificate: "IGI-34216512", rate: "5,25,000", value: "3,93,750", status: "In Stock" },
  { id: 3, code: "DIA-1003", shape: "Oval", carat: "1.25", color: "F", clarity: "VVS2", cut: "Excellent", certificate: "GIA-24165124", rate: "7,95,000", value: "9,93,750", status: "In Stock" },
  { id: 4, code: "DIA-1004", shape: "Marquise", carat: "0.60", color: "G", clarity: "VS2", cut: "Very Good", certificate: "IGI-34216513", rate: "4,15,000", value: "2,49,000", status: "Low Stock" },
  { id: 5, code: "DIA-1005", shape: "Pear", carat: "1.50", color: "E", clarity: "VVS1", cut: "Excellent", certificate: "GIA-24165125", rate: "8,90,000", value: "13,35,000", status: "In Stock" },
  { id: 6, code: "DIA-1006", shape: "Emerald", carat: "0.90", color: "F", clarity: "VS1", cut: "Very Good", certificate: "IGI-34216514", rate: "5,85,000", value: "5,26,500", status: "In Stock" },
  { id: 7, code: "DIA-1007", shape: "Cushion", carat: "1.10", color: "D", clarity: "VVS2", cut: "Excellent", certificate: "GIA-24165126", rate: "7,75,000", value: "8,52,500", status: "Low Stock" },
  { id: 8, code: "DIA-1008", shape: "Heart", carat: "0.50", color: "G", clarity: "SI1", cut: "Good", certificate: "IGI-34216515", rate: "3,10,000", value: "1,55,000", status: "In Stock" },
];

export type AuditAction = "Create" | "Update" | "Delete";

export type AuditRecord = {
  id: number;
  dateTime: string;
  user: string;
  module: string;
  action: AuditAction;
  description: string;
  ip: string;
};

export const auditRecords: AuditRecord[] = [
  { id: 1, dateTime: "31 May 2025 10:35 AM", user: "Abdul Karim", module: "Sales", action: "Create", description: "Created Sales Invoice INV-250501", ip: "192.168.1.10" },
  { id: 2, dateTime: "31 May 2025 10:22 AM", user: "Jalal Uddin", module: "Inventory", action: "Update", description: "Updated Gold Item GD-1002", ip: "192.168.1.12" },
  { id: 3, dateTime: "31 May 2025 09:58 AM", user: "Farhana Islam", module: "Customers", action: "Create", description: "Added New Customer CUS-1025", ip: "192.168.1.15" },
  { id: 4, dateTime: "31 May 2025 09:45 AM", user: "Sathi Akter", module: "Purchase", action: "Update", description: "Updated Purchase Bill PUR-250412", ip: "192.168.1.18" },
  { id: 5, dateTime: "31 May 2025 09:30 AM", user: "Mehedi Hasan", module: "Accounts", action: "Delete", description: "Deleted Journal Entry JV-250305", ip: "192.168.1.11" },
  { id: 6, dateTime: "31 May 2025 09:12 AM", user: "Rafiq Islam", module: "Inventory", action: "Update", description: "Adjusted Stock for Item GD-1005", ip: "192.168.1.17" },
  { id: 7, dateTime: "31 May 2025 08:55 AM", user: "Abu Sayed", module: "Gold Management", action: "Create", description: "Added Gold Rate 22K - 31 May 2025", ip: "192.168.1.14" },
  { id: 8, dateTime: "31 May 2025 08:40 AM", user: "Nasima Begum", module: "Sales", action: "Update", description: "Updated Sales Invoice INV-250489", ip: "192.168.1.13" },
];

export type BranchStatus = "Active" | "Inactive";

export type BranchRecord = {
  id: number;
  code: string;
  name: string;
  manager: string;
  phone: string;
  location: string;
  staff: number;
  status: BranchStatus;
};

export const branchSeed: BranchRecord[] = [
  { id: 1, code: "BR-001", name: "Head Office", manager: "Abdul Karim", phone: "01712-345678", location: "Dhaka", staff: 28, status: "Active" },
  { id: 2, code: "BR-002", name: "Uttara Branch", manager: "Jalal Uddin", phone: "01711-234567", location: "Uttara, Dhaka", staff: 15, status: "Active" },
  { id: 3, code: "BR-003", name: "Mirpur Branch", manager: "Farhana Islam", phone: "01798-765432", location: "Mirpur, Dhaka", staff: 12, status: "Active" },
  { id: 4, code: "BR-004", name: "Chattogram Branch", manager: "Sathi Akter", phone: "01844-332211", location: "Chattogram", staff: 18, status: "Active" },
  { id: 5, code: "BR-005", name: "Sylhet Branch", manager: "Mehedi Hasan", phone: "01766-554433", location: "Sylhet", staff: 10, status: "Inactive" },
  { id: 6, code: "BR-006", name: "Rajshahi Branch", manager: "Rafiq Islam", phone: "01722-778899", location: "Rajshahi", staff: 14, status: "Active" },
  { id: 7, code: "BR-007", name: "Khulna Branch", manager: "Nasima Begum", phone: "01911-223344", location: "Khulna", staff: 11, status: "Active" },
  { id: 8, code: "BR-008", name: "Barisal Branch", manager: "Abu Sayed", phone: "01788-665544", location: "Barisal", staff: 9, status: "Inactive" },
];
