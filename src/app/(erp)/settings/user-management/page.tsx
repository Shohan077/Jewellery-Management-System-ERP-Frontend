import type { Metadata } from "next";

import { UserManagementScreen } from "@/features/reference-28/user-management-screen";

export const metadata: Metadata = {
  title: "User Management",
  description: "Search, filter and manage jewellery ERP users.",
};

export default function UserManagementPage() {
  return <UserManagementScreen />;
}
