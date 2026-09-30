export type RoleRecord = {
  id: string;
  name: string;
  description: string;
  users: number;
  active: boolean;
};

export const initialRoles: RoleRecord[] = [
  { id: "role-super-admin", name: "Super Admin", description: "Full access to all modules", users: 1, active: true },
  { id: "role-manager", name: "Manager", description: "Manage daily operations", users: 5, active: true },
  { id: "role-sales", name: "Sales Executive", description: "Handle sales & customers", users: 8, active: true },
  { id: "role-accountant", name: "Accountant", description: "Accounts & financial access", users: 3, active: true },
  { id: "role-karigar", name: "Karigar", description: "Manage production tasks", users: 6, active: true },
  { id: "role-store", name: "Store Keeper", description: "Inventory & stock handling", users: 4, active: true },
  { id: "role-viewer", name: "Viewer", description: "View only access", users: 9, active: false },
];

export const permissionGroups = [
  { module: "Dashboard", permissions: ["View Dashboard"] },
  { module: "Sales", permissions: ["View Sales", "Create Sales", "Edit Sales", "Delete Sales"] },
  { module: "Purchase", permissions: ["View Purchase", "Create Purchase", "Edit Purchase", "Delete Purchase"] },
  { module: "Inventory", permissions: [] },
  { module: "Customers", permissions: [] },
  { module: "Due Management", permissions: [] },
  { module: "Production", permissions: [] },
  { module: "Reports", permissions: [] },
  { module: "User Management", permissions: [] },
  { module: "Settings", permissions: [] },
] as const;

export type LogAction = "Create" | "Update" | "Delete" | "Login" | "Export";

export type AdminActivity = {
  id: number;
  dateTime: string;
  isoDate: string;
  user: string;
  module: string;
  action: LogAction;
  details: string;
  ipAddress: string;
  device: string;
};

const featuredActivities: AdminActivity[] = [
  { id: 1, dateTime: "31/05/2024 10:45 AM", isoDate: "2024-05-31", user: "Admin", module: "Sales", action: "Create", details: "Created Invoice INV-2024-0512", ipAddress: "192.168.1.10", device: "Windows / Chrome" },
  { id: 2, dateTime: "31/05/2024 10:22 AM", isoDate: "2024-05-31", user: "Ravi Sharma", module: "Inventory", action: "Update", details: "Updated Stock Item 22K-RING-001", ipAddress: "192.168.1.15", device: "Windows / Chrome" },
  { id: 3, dateTime: "31/05/2024 09:58 AM", isoDate: "2024-05-31", user: "Priya Mehta", module: "Users & Roles", action: "Delete", details: "Deleted Role: Temporary Staff", ipAddress: "192.168.1.18", device: "Windows / Edge" },
  { id: 4, dateTime: "31/05/2024 09:30 AM", isoDate: "2024-05-31", user: "Sanjay Patel", module: "Dashboard", action: "Login", details: "User logged in", ipAddress: "192.168.1.12", device: "Windows / Chrome" },
  { id: 5, dateTime: "31/05/2024 09:15 AM", isoDate: "2024-05-31", user: "Anita Verma", module: "Reports", action: "Export", details: "Exported Sales Report (May)", ipAddress: "192.168.1.10", device: "Windows / Chrome" },
  { id: 6, dateTime: "31/05/2024 09:00 AM", isoDate: "2024-05-31", user: "Admin", module: "Settings", action: "Update", details: "Modified System Settings", ipAddress: "192.168.1.10", device: "Windows / Chrome" },
  { id: 7, dateTime: "31/05/2024 08:25 AM", isoDate: "2024-05-31", user: "Vikram Singh", module: "Purchase", action: "Create", details: "Created Purchase Order PO-2024-069", ipAddress: "192.168.1.21", device: "Windows / Firefox" },
  { id: 8, dateTime: "31/05/2024 08:10 AM", isoDate: "2024-05-31", user: "Neha Gupta", module: "Customers", action: "Update", details: "Updated Customer Gold Palace", ipAddress: "192.168.1.17", device: "Windows / Edge" },
  { id: 9, dateTime: "31/05/2024 07:45 AM", isoDate: "2024-05-31", user: "Admin", module: "Users & Roles", action: "Update", details: "Updated User: Rahul Kumar", ipAddress: "192.168.1.10", device: "Windows / Chrome" },
  { id: 10, dateTime: "31/05/2024 07:20 AM", isoDate: "2024-05-31", user: "Ravi Sharma", module: "Inventory", action: "Delete", details: "Deleted Stock Item OLD-CHAIN-09", ipAddress: "192.168.1.15", device: "Windows / Chrome" },
];

const users = ["Admin", "Ravi Sharma", "Priya Mehta", "Sanjay Patel", "Anita Verma", "Vikram Singh", "Neha Gupta"];
const modules = ["Sales", "Inventory", "Users & Roles", "Dashboard", "Reports", "Settings", "Purchase", "Customers"];
const actions: LogAction[] = ["Create", "Update", "Delete", "Login", "Export"];

export const adminActivities: AdminActivity[] = [
  ...featuredActivities,
  ...Array.from({ length: 1246 }, (_, index): AdminActivity => {
    const id = index + 11;
    const day = 30 - (index % 30);
    const action = actions[index % actions.length];
    const moduleName = modules[index % modules.length];
    return {
      id,
      dateTime: `${String(day).padStart(2, "0")}/05/2024 ${String(8 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")} AM`,
      isoDate: `2024-05-${String(day).padStart(2, "0")}`,
      user: users[index % users.length],
      module: moduleName,
      action,
      details: `${action} action completed in ${moduleName}`,
      ipAddress: `192.168.1.${20 + (index % 90)}`,
      device: index % 4 === 0 ? "Windows / Edge" : "Windows / Chrome",
    };
  }),
];

export const backupRecords = [
  { id: 1, name: "Auto Backup - 31 May 2024", type: "Full Backup", size: "1.25 GB", date: "31/05/2024 02:00 AM", status: "Completed", storage: "Local Storage" },
  { id: 2, name: "Manual Backup - 30 May 2024", type: "Full Backup", size: "1.22 GB", date: "30/05/2024 11:45 PM", status: "Completed", storage: "Local Storage" },
  { id: 3, name: "Auto Backup - 30 May 2024", type: "Full Backup", size: "1.20 GB", date: "30/05/2024 02:00 AM", status: "Completed", storage: "Local Storage" },
  { id: 4, name: "Manual Backup - 29 May 2024", type: "Full Backup", size: "1.18 GB", date: "29/05/2024 10:30 PM", status: "Completed", storage: "Local Storage" },
  { id: 5, name: "Auto Backup - 29 May 2024", type: "Full Backup", size: "1.16 GB", date: "29/05/2024 02:00 AM", status: "Completed", storage: "Local Storage" },
  { id: 6, name: "Auto Backup - 28 May 2024", type: "Full Backup", size: "1.14 GB", date: "28/05/2024 02:00 AM", status: "Failed", storage: "Local Storage" },
] as const;
