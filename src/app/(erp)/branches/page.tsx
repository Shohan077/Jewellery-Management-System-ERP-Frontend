import type { Metadata } from "next";
import { BranchManagement } from "@/features/branches/branch-management";
export const metadata: Metadata = { title: "Branch Management" };
export default function BranchManagementPage() { return <BranchManagement />; }
