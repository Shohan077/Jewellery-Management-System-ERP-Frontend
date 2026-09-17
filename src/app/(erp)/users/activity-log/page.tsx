import type { Metadata } from "next";

import { ActivityLog } from "@/features/activity-log/activity-log";

export const metadata: Metadata = {
  title: "System Activity Log",
  description: "Review Jewellery ERP user activities and system changes.",
};

export default function ActivityLogPage() {
  return <ActivityLog />;
}
