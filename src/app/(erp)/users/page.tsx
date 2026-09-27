import type { Metadata } from "next";
import { Reference55UserManagement } from "@/features/reference-55/user-management-screen";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage ERP users, roles, branches and account access.",
};

export default function UserManagementPage() {
  return <Reference55UserManagement />;
}
