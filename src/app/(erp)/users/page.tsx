import type { Metadata } from "next";
import { Reference64UserList } from "@/features/reference-64/screens";

export const metadata: Metadata = {
  title: "User List",
  description: "Manage ERP users, roles, branches and account access.",
};

export default function UserManagementPage() {
  return <Reference64UserList />;
}
