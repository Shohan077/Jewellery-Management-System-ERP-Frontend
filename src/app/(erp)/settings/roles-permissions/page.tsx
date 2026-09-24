import type { Metadata } from "next";
import { RolePermissionManagement } from "@/features/admin-control-center/role-permission-management";

export const metadata: Metadata = { title: "Roles & Permissions | Jewellery Manager" };
export default function RolesPermissionsPage() { return <RolePermissionManagement />; }
