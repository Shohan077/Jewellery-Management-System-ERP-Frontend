export const inventoryRows = [
  ["GCH-22K-001", "Gold Chain 22K", "22K (916)", "250.500", "8,750", "21,92,375", "In Stock"],
  ["GRN-21K-002", "Gold Ring 21K", "21K (875)", "150.250", "8,325", "12,51,831", "In Stock"],
  ["GBR-22K-003", "Gold Bracelet 22K", "22K (916)", "320.750", "8,750", "28,06,563", "In Stock"],
  ["GNG-24K-004", "Gold Bangle 24K", "24K (999)", "180.000", "8,950", "16,11,000", "In Stock"],
  ["GPN-22K-005", "Gold Pendant 22K", "22K (916)", "75.300", "8,750", "6,59,875", "In Stock"],
  ["GCT-21K-006", "Gold Earring 21K", "21K (875)", "55.600", "8,325", "4,62,480", "Low Stock"],
  ["GCH-20K-007", "Gold Chain 20K", "20K (833)", "40.250", "7,950", "3,19,988", "Low Stock"],
  ["GRN-18K-008", "Gold Ring 18K", "18K (750)", "25.000", "7,125", "1,78,125", "Low Stock"],
] as const;

export const mortgageRows = [
  ["MTG-2024-001", "18 May, 2024", "Rahim Khan", "Gold Chain 22K", "25.500", "6,25,000", "18 Jun, 2024", "Active"],
  ["MTG-2024-002", "17 May, 2024", "Sadia Akter", "Gold Ring 21K", "15.250", "1,35,000", "17 Jun, 2024", "Active"],
  ["MTG-2024-003", "16 May, 2024", "Fahim Ahmed", "Gold Pendant 22K", "12.750", "1,10,000", "16 Jun, 2024", "Overdue"],
  ["MTG-2024-004", "15 May, 2024", "Jannat Islam", "Gold Bangle 22K", "30.000", "2,60,000", "15 Jun, 2024", "Active"],
  ["MTG-2024-005", "14 May, 2024", "Arif Hossain", "Gold Chain 21K", "18.500", "1,60,000", "14 Jun, 2024", "Active"],
  ["MTG-2024-006", "12 May, 2024", "Nusrat Jahan", "Gold Earring 21K", "8.250", "70,000", "12 Jun, 2024", "Active"],
  ["MTG-2024-007", "10 May, 2024", "Mahmud Hasan", "Gold Ring 22K", "10.000", "95,000", "10 Jun, 2024", "Active"],
  ["MTG-2024-008", "09 May, 2024", "Biplob Roy", "Gold Chain 22K", "20.250", "1,80,000", "09 Jun, 2024", "Active"],
] as const;

export const purchaseRows = [
  ["PUR-2024-042", "18 May, 2024", "Gold Supplier Ltd.", "Gold Purchase", "12,50,000", "Bank", "Paid"],
  ["PUR-2024-041", "17 May, 2024", "Diamond World", "Diamond Purchase", "6,75,000", "Cash", "Paid"],
  ["PUR-2024-040", "16 May, 2024", "Gold Supplier Ltd.", "Gold Purchase", "8,20,000", "Bank", "Paid"],
  ["PUR-2024-039", "15 May, 2024", "Silver House", "Other Purchase", "1,85,000", "Cash", "Paid"],
  ["PUR-2024-038", "14 May, 2024", "Gold Supplier Ltd.", "Gold Purchase", "4,10,000", "Bank", "Partial"],
  ["PUR-2024-037", "13 May, 2024", "Diamond World", "Diamond Purchase", "2,00,000", "Cash", "Partial"],
  ["PUR-2024-036", "12 May, 2024", "Gold Supplier Ltd.", "Gold Purchase", "3,45,000", "Bank", "Paid"],
  ["PUR-2024-035", "11 May, 2024", "Silver House", "Other Purchase", "1,25,000", "Cash", "Paid"],
] as const;

export const cashRows = [
  ["18 May, 2024", "Opening Balance", "Opening", "-", "-", "1,25,650", "-"],
  ["18 May, 2024", "Sales Collection - Invoice INV-10045", "Income", "85,500", "-", "2,11,150", "Cash"],
  ["18 May, 2024", "Gold Purchase Payment", "Expense", "-", "65,000", "1,46,150", "Cash"],
  ["18 May, 2024", "Customer Advance - Rahim Khan", "Income", "45,000", "-", "1,91,150", "Cash"],
  ["18 May, 2024", "Electricity Bill Payment", "Expense", "-", "8,750", "1,82,400", "Cash"],
  ["18 May, 2024", "Miscellaneous Income", "Income", "22,300", "-", "2,04,700", "Cash"],
  ["18 May, 2024", "Staff Refreshment", "Expense", "-", "3,250", "2,01,450", "Cash"],
  ["18 May, 2024", "Customer Payment - Sadia Akter", "Income", "43,850", "-", "2,45,300", "Cash"],
  ["18 May, 2024", "Bank Deposit", "Expense", "-", "61,100", "1,84,200", "Bank"],
] as const;

export const mortgageSlices = [
  { color: "#1769df", label: "Short Term", value: 48 },
  { color: "#f08b36", label: "Long Term", value: 36 },
  { color: "#55c28b", label: "Bullet Payment", value: 16 },
] as const;

export const purchaseSlices = [
  { color: "#1769df", label: "Gold Purchase", value: 65.8 },
  { color: "#f34f45", label: "Diamond Purchase", value: 23.7 },
  { color: "#9ba9b8", label: "Other Purchase", value: 10.5 },
] as const;
