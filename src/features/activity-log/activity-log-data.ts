export type ActivityAction = "Login" | "Update" | "Create" | "Delete" | "View";

export type ActivityEntry = {
  id: number;
  dateTime: string;
  isoDate: string;
  user: string;
  action: ActivityAction;
  module: string;
  details: string;
  ipAddress: string;
};

const featuredActivities: ActivityEntry[] = [
  { id: 1, dateTime: "30 Apr 2025 10:32", isoDate: "2025-04-30", user: "Admin", action: "Login", module: "System", details: "User logged in", ipAddress: "192.168.1.10" },
  { id: 2, dateTime: "30 Apr 2025 10:25", isoDate: "2025-04-30", user: "Nusrat Jahan", action: "Update", module: "Customer", details: "Updated customer C-000125", ipAddress: "192.168.1.15" },
  { id: 3, dateTime: "30 Apr 2025 09:18", isoDate: "2025-04-30", user: "Tanvir Ahmed", action: "Create", module: "Sales", details: "Created invoice S-2025-00125", ipAddress: "192.168.1.18" },
  { id: 4, dateTime: "29 Apr 2025 16:45", isoDate: "2025-04-29", user: "Farzana Akter", action: "Delete", module: "Inventory", details: "Deleted stock item GN-015", ipAddress: "192.168.1.12" },
  { id: 5, dateTime: "29 Apr 2025 14:20", isoDate: "2025-04-29", user: "Rahim Uddin", action: "Update", module: "Gold Rate", details: "Updated gold rate to 8,420", ipAddress: "192.168.1.10" },
  { id: 6, dateTime: "28 Apr 2025 11:05", isoDate: "2025-04-28", user: "Md. Selim", action: "Create", module: "Purchase", details: "Created purchase P-2025-001", ipAddress: "192.168.1.20" },
  { id: 7, dateTime: "27 Apr 2025 09:32", isoDate: "2025-04-27", user: "Aminul Islam", action: "Update", module: "Karigar", details: "Updated karigar K-005", ipAddress: "192.168.1.25" },
  { id: 8, dateTime: "26 Apr 2025 15:18", isoDate: "2025-04-26", user: "Sabrina Khan", action: "Login", module: "System", details: "User logged in", ipAddress: "192.168.1.22" },
  { id: 9, dateTime: "25 Apr 2025 12:40", isoDate: "2025-04-25", user: "Admin", action: "Update", module: "System", details: "Changed system settings", ipAddress: "192.168.1.10" },
  { id: 10, dateTime: "24 Apr 2025 10:15", isoDate: "2025-04-24", user: "Laila Begum", action: "Create", module: "Supplier", details: "Added new supplier S-00020", ipAddress: "192.168.1.28" },
];

const users = ["Admin", "Nusrat Jahan", "Tanvir Ahmed", "Farzana Akter", "Rahim Uddin", "Md. Selim", "Aminul Islam", "Sabrina Khan", "Laila Begum"] as const;
const actions: ActivityAction[] = ["Login", "Update", "Create", "Delete", "View"];
const modules = ["System", "Customer", "Sales", "Inventory", "Gold Rate", "Purchase", "Karigar", "Supplier"] as const;
const detailTemplates = ["Viewed customer account", "Updated inventory quantity", "Created a sales invoice", "Reviewed report data", "Updated branch settings", "Viewed supplier ledger"] as const;

const generatedActivities = Array.from({ length: 238 }, (_, index): ActivityEntry => {
  const id = index + 11;
  const day = 23 - (index % 23);
  const hour = 8 + (index % 10);
  const minute = (index * 7) % 60;
  const action = actions[index % actions.length];
  return {
    id,
    dateTime: `${String(day).padStart(2, "0")} Apr 2025 ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    isoDate: `2025-04-${String(day).padStart(2, "0")}`,
    user: users[index % users.length],
    action,
    module: modules[index % modules.length],
    details: detailTemplates[index % detailTemplates.length],
    ipAddress: `192.168.1.${30 + (index % 90)}`,
  };
});

export const activityEntries: ActivityEntry[] = [...featuredActivities, ...generatedActivities];
export const activityUsers = [...new Set(activityEntries.map((entry) => entry.user))];
export const activityActions: ActivityAction[] = actions;
