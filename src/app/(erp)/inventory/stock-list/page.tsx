import type { Metadata } from "next";
import { InventoryStockList } from "@/features/stock-list/inventory-stock-list";
export const metadata: Metadata = { title: "Inventory Stock List" };
export default function InventoryStockListPage() { return <InventoryStockList />; }
