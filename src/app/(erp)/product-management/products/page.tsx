import type { Metadata } from "next";
import { ManagedProductList } from "@/features/product-management/managed-product-list";
export const metadata: Metadata = { title: "Product Management" };
export default function ManagedProductListPage() { return <ManagedProductList />; }
