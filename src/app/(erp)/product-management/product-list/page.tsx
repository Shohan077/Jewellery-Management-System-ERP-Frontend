import type { Metadata } from "next";
import { ProductList126 } from "@/features/product-management-125-126/product-list-126";

export const metadata: Metadata = {
  title: "Product List | Jewellery ERP",
  description: "View and manage jewellery products.",
};

export default function ProductListPage() {
  return <ProductList126 />;
}
