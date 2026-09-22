import type { Metadata } from "next";

import { ProductionMaterialReturnCreate } from "@/features/production-material-return/production-material-return-create";

export const metadata: Metadata = {
  title: "Material Return | Jewellery Manager",
  description: "Record materials returned by a production karigar.",
};

export default function NewProductionMaterialReturnPage() {
  return <ProductionMaterialReturnCreate />;
}
