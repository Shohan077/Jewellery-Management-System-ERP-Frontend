export const userRoles = [
  "Admin",
  "Manager",
  "Sales",
  "Accounts",
  "Inventory",
  "Karigar",
  "Purchase",
] as const;

export const userBranches = ["Main", "Uttara", "Chittagong", "Sylhet", "Khulna"] as const;
export const userStatuses = ["Active", "Inactive"] as const;

export type UserRole = (typeof userRoles)[number];
export type UserBranch = (typeof userBranches)[number];
export type UserStatus = (typeof userStatuses)[number];

export type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: UserBranch;
  status: UserStatus;
};

export const initialUsers: SystemUser[] = [
  { id: "U-001", name: "Rahim Uddin", email: "rahim@aarohan.com", role: "Admin", branch: "Main", status: "Active" },
  { id: "U-002", name: "Nusrat Jahan", email: "nusrat@aarohan.com", role: "Manager", branch: "Main", status: "Active" },
  { id: "U-003", name: "Tanvir Ahmed", email: "tanvir@aarohan.com", role: "Sales", branch: "Uttara", status: "Active" },
  { id: "U-004", name: "Farzana Akter", email: "farzana@aarohan.com", role: "Accounts", branch: "Main", status: "Active" },
  { id: "U-005", name: "Md. Selim", email: "selim@aarohan.com", role: "Inventory", branch: "Chittagong", status: "Active" },
  { id: "U-006", name: "Amirul Islam", email: "amirul@aarohan.com", role: "Karigar", branch: "Sylhet", status: "Active" },
  { id: "U-007", name: "Sabrina Khan", email: "sabrina@aarohan.com", role: "Sales", branch: "Uttara", status: "Inactive" },
  { id: "U-008", name: "Jahid Hasan", email: "jahid@aarohan.com", role: "Accounts", branch: "Main", status: "Active" },
  { id: "U-009", name: "Laila Begum", email: "laila@aarohan.com", role: "Manager", branch: "Khulna", status: "Active" },
  { id: "U-010", name: "Karim Hossain", email: "karim@aarohan.com", role: "Purchase", branch: "Main", status: "Active" },
  { id: "U-011", name: "Shamim Rahman", email: "shamim@aarohan.com", role: "Admin", branch: "Main", status: "Active" },
  { id: "U-012", name: "Nabila Sultana", email: "nabila@aarohan.com", role: "Admin", branch: "Uttara", status: "Inactive" },
];

export function nextUserId(users: SystemUser[]) {
  const highestId = users.reduce((highest, user) => {
    const numericId = Number.parseInt(user.id.replace(/\D/g, ""), 10);
    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
  }, 0);

  return `U-${String(highestId + 1).padStart(3, "0")}`;
}
