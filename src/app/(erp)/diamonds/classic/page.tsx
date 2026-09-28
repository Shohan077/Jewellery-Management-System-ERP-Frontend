import type { Metadata } from "next";
import { DiamondList } from "@/features/diamonds/diamond-list";
export const metadata: Metadata = { title: "Classic Diamond List" };
export default function Page() { return <DiamondList />; }
