import type { Metadata } from "next";
import { ProductList } from "@/features/products/product-list";

export const metadata: Metadata = {
  title: "Products",
  description: "View and manage all jewellery products.",
};

export default function ProductsPage() {
  return <ProductList />;
}
