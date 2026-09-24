import type { Metadata } from "next";
import { ProductAttributes } from "@/features/reference-32-catalog/product-attributes";

export const metadata: Metadata = { title: "Product Attributes | Jewellery ERP" };

export default function ProductAttributesPage() {
  return <ProductAttributes />;
}
