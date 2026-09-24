export type SecurityEvent = {
  id: number;
  time: string;
  user: string;
  event: string;
  device: string;
  ip: string;
  status: "Success" | "Failed" | "Locked";
};

export const securityEvents: SecurityEvent[] = [
  { id: 1, time: "19 May 2025 10:52 AM", user: "Admin / Owner", event: "Successful Login", device: "Chrome on Windows", ip: "103.21.244.25", status: "Success" },
  { id: 2, time: "19 May 2025 10:47 AM", user: "Staff - Ramesh", event: "Failed Login", device: "Chrome on Android", ip: "203.0.113.45", status: "Failed" },
  { id: 3, time: "19 May 2025 10:43 AM", user: "Manager - Anita", event: "Password Change", device: "Chrome on Windows", ip: "103.21.244.25", status: "Success" },
  { id: 4, time: "19 May 2025 10:35 AM", user: "Staff - Suresh", event: "Account Locked", device: "Unknown Device", ip: "198.51.100.12", status: "Locked" },
  { id: 5, time: "19 May 2025 10:28 AM", user: "Admin / Owner", event: "2FA Enabled", device: "Chrome on Windows", ip: "103.21.244.25", status: "Success" },
];

export type ScheduledJob = {
  id: number;
  name: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  duration: string;
  status: "Success" | "Running";
};

export const initialJobs: ScheduledJob[] = [
  { id: 1, name: "Backup Database", frequency: "Daily", lastRun: "19 May 10:00 AM", nextRun: "20 May 10:00 AM", duration: "00:00:45", status: "Success" },
  { id: 2, name: "Clear Cache", frequency: "Daily", lastRun: "19 May 12:00 PM", nextRun: "20 May 12:00 PM", duration: "00:00:30", status: "Success" },
  { id: 3, name: "Send Due Reminder", frequency: "Hourly", lastRun: "19 May 10:00 AM", nextRun: "19 May 11:00 AM", duration: "00:00:10", status: "Success" },
  { id: 4, name: "Optimize Database", frequency: "Weekly", lastRun: "18 May 10:00 AM", nextRun: "25 May 10:00 AM", duration: "00:19:22", status: "Success" },
  { id: 5, name: "Log Cleanup", frequency: "Daily", lastRun: "19 May 01:00 AM", nextRun: "20 May 01:00 AM", duration: "00:00:40", status: "Success" },
];

export type MaintenanceLog = {
  id: number;
  time: string;
  task: string;
  status: "Success" | "Running";
  details: string;
};

export const initialMaintenanceLogs: MaintenanceLog[] = [
  { id: 1, time: "19 May 2025 10:52 AM", task: "Cache Clear", status: "Success", details: "Cache cleared successfully" },
  { id: 2, time: "19 May 2025 10:35 AM", task: "Database Optimize", status: "Success", details: "Optimized 28 tables" },
  { id: 3, time: "19 May 2025 08:15 AM", task: "Log Cleanup", status: "Success", details: "Deleted 134 old log files" },
  { id: 4, time: "18 May 2025 02:00 AM", task: "Backup Database", status: "Success", details: "Backup completed successfully" },
  { id: 5, time: "17 May 2025 02:00 AM", task: "Backup Database", status: "Success", details: "Backup completed successfully" },
];
