import type { Metadata } from "next";
import { ProductCatalog } from "@/features/product-catalog/product-catalog";

export const metadata: Metadata = {
  title: "Product Management | Jewellery ERP",
  description: "Manage the jewellery product catalogue.",
};

export default function ProductCatalogPage() {
  return <ProductCatalog />;
}
