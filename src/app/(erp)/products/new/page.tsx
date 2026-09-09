import type { Metadata } from "next";
import { ProductForm } from "@/features/products/product-form";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Create a new jewellery product.",
};

export default function NewProductPage() {
  return <ProductForm />;
}
