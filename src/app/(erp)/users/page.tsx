import type { Metadata } from "next";

import { UserManagement } from "@/features/user-management/user-management";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage ERP users, roles, branches and account access.",
};

export default function UserManagementPage() {
  return <UserManagement />;
}
