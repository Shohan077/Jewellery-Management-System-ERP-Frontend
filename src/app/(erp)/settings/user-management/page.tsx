import type { Metadata } from "next";
import { Reference55UserManagement } from "@/features/reference-55/user-management-screen";

export const metadata: Metadata = {
  title: "User Management",
  description: "Search, filter and manage jewellery ERP users.",
};

export default function UserManagementPage() {
  return <Reference55UserManagement />;
}
