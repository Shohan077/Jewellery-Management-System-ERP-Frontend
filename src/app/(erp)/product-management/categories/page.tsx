import type { Metadata } from "next";
import { CategoryManagement125 } from "@/features/product-management-125-126/category-management";

export const metadata: Metadata = {
  title: "Category Management | Jewellery ERP",
  description: "Manage jewellery product categories.",
};

export default function CategoryManagementPage() {
  return <CategoryManagement125 />;
}
