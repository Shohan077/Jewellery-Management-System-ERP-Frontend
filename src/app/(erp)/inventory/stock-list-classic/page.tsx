import type { Metadata } from "next";
import { InventoryStockList } from "@/features/stock-list/inventory-stock-list";
export const metadata: Metadata = { title: "Classic Inventory Stock List" };
export default function Page() { return <InventoryStockList />; }
