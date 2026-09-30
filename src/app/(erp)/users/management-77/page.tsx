import type { Metadata } from "next";
import { Reference77UserRoleManagement } from "@/features/reference-77/user-role-management";

export const metadata: Metadata = {
  title: "User & Role Management | Jewellery ERP",
  description: "Manage users, roles, permissions and security activity.",
};

export default function UserRoleManagement77Page() {
  return <Reference77UserRoleManagement />;
}
