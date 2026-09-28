import type { Metadata } from "next";
import { Reference52PosBilling } from "@/features/reference-52/pos-billing-screen";

export const metadata: Metadata = { title: "Classic POS Billing" };
export default function ClassicPosPage() { return <Reference52PosBilling />; }
