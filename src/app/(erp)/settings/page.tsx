import type { Metadata } from "next";
import { SystemSettings } from "@/features/settings/system-settings";
export const metadata: Metadata = { title: "System Settings" };
export default function SystemSettingsPage() { return <SystemSettings />; }
