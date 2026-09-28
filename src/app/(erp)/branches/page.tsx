import type { Metadata } from "next";
import { Reference64BranchList } from "@/features/reference-64/screens";
export const metadata: Metadata = { title: "Branch List" };
export default function BranchManagementPage() { return <Reference64BranchList />; }
