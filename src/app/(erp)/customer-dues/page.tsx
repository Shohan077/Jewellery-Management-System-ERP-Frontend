import type { Metadata } from "next";
import { CustomerDueList } from "@/features/customer-dues/customer-due-list";
export const metadata: Metadata = { title: "Customer Due & Collection" };
export default function CustomerDuePage() { return <CustomerDueList />; }
