export const diamondRows = [
  ["DIA-2024-001", "Round", "1.02", "D", "VS1", "Excellent", "GIA-148655321", "1,85,000", "1,88,700", "In Stock"],
  ["DIA-2024-002", "Princess", "0.75", "E", "VVS2", "Very Good", "GIA-148655322", "1,72,000", "1,29,000", "In Stock"],
  ["DIA-2024-003", "Oval", "1.25", "F", "VS2", "Excellent", "IGI-452133221", "1,90,000", "2,37,500", "In Stock"],
  ["DIA-2024-004", "Round", "0.50", "G", "SI1", "Good", "IGI-452133222", "1,45,000", "72,500", "In Stock"],
  ["DIA-2024-005", "Pear", "1.10", "E", "VS1", "Very Good", "GIA-148655323", "1,78,000", "1,95,800", "Low Stock"],
  ["DIA-2024-006", "Emerald", "0.90", "H", "SI2", "Good", "IGI-452133223", "1,25,000", "1,12,500", "In Stock"],
  ["DIA-2024-007", "Marquise", "0.60", "F", "VS2", "Very Good", "GIA-148655324", "1,55,000", "93,000", "In Stock"],
  ["DIA-2024-008", "Round", "1.50", "D", "VVS1", "Excellent", "GIA-148655325", "2,15,000", "3,22,500", "In Stock"],
] as const;

export const karigarRows = [
  ["KRG-2024-001", "Raju Sarker", "Gold Smith", "01712-345678", "Gold Jewellery", "10 Jan, 2024", "Active"],
  ["KRG-2024-002", "Babulal Verma", "Polish Worker", "01823-456789", "Polish", "12 Jan, 2024", "Active"],
  ["KRG-2024-003", "Amit Das", "Stone Setter", "01798-765432", "Diamond Setting", "15 Jan, 2024", "Active"],
  ["KRG-2024-004", "Suresh Kumar", "Gold Smith", "01911-223344", "Gold Jewellery", "18 Jan, 2024", "Active"],
  ["KRG-2024-005", "Nurul Islam", "Casting Worker", "01671-334455", "Casting", "20 Jan, 2024", "Active"],
  ["KRG-2024-006", "Mahmud Hasan", "Engraving", "01844-667788", "Engraving", "22 Jan, 2024", "Inactive"],
  ["KRG-2024-007", "Biplob Roy", "Polish Worker", "01733-556677", "Polish", "25 Jan, 2024", "Active"],
  ["KRG-2024-008", "Jamal Uddin", "Stone Setter", "01552-998877", "Stone Setting", "28 Jan, 2024", "Active"],
] as const;

export const productionRows = [
  ["PROD-2024-001", "18 May, 2024", "Gold Chain 22K", "Raju Sarker", "10 Pcs", "125.500", "In Progress", "25 May, 2024"],
  ["PROD-2024-002", "17 May, 2024", "Gold Ring 21K", "Babulal Verma", "15 Pcs", "67.250", "In Progress", "24 May, 2024"],
  ["PROD-2024-003", "16 May, 2024", "Gold Bangle 22K", "Suresh Kumar", "8 Pcs", "98.300", "Completed", "18 May, 2024"],
  ["PROD-2024-004", "15 May, 2024", "Diamond Pendant", "Amit Das", "5 Pcs", "34.200", "Completed", "17 May, 2024"],
  ["PROD-2024-005", "14 May, 2024", "Silver Anklet", "Nurul Islam", "12 Pcs", "210.000", "On Hold", "22 May, 2024"],
  ["PROD-2024-006", "13 May, 2024", "Gold Nose Pin 22K", "Mahmud Hasan", "20 Pcs", "12.750", "In Progress", "21 May, 2024"],
] as const;

export const salesSummaryRows = [
  ["18 May, 2024", "1,85,000", "22", "18", "1,28,500", "56,500", "30.54%"],
  ["17 May, 2024", "2,25,000", "28", "21", "1,52,000", "73,000", "32.44%"],
  ["16 May, 2024", "1,65,000", "20", "15", "1,12,000", "53,000", "32.12%"],
  ["15 May, 2024", "2,95,000", "32", "24", "2,02,000", "93,000", "31.53%"],
  ["14 May, 2024", "1,95,000", "25", "19", "1,31,000", "64,000", "32.82%"],
] as const;

export const diamondShapeSlices = [
  { color: "#1769df", label: "Round", value: 45 }, { color: "#4d8ce5", label: "Princess", value: 15 }, { color: "#2cad9e", label: "Oval", value: 12 }, { color: "#f2ae20", label: "Pear", value: 10 }, { color: "#ef5b4d", label: "Others", value: 18 },
] as const;
export const workSlices = [
  { color: "#1769df", label: "Gold Jewellery", value: 58.8 }, { color: "#f08b36", label: "Polish", value: 17.6 }, { color: "#52bf87", label: "Stone Setting", value: 11.8 }, { color: "#23a4aa", label: "Casting", value: 8.8 }, { color: "#9ba9b8", label: "Others", value: 3 },
] as const;
export const productionSlices = [
  { color: "#1769df", label: "In Progress", value: 42.86 }, { color: "#43bb76", label: "Completed", value: 47.62 }, { color: "#f08b36", label: "On Hold", value: 7.14 }, { color: "#ef5b4d", label: "Cancelled", value: 2.38 },
] as const;
export const salesCategorySlices = [
  { color: "#1769df", label: "Gold Jewellery", value: 55 }, { color: "#2ba5b0", label: "Diamond Jewellery", value: 25 }, { color: "#f1b31f", label: "Silver Jewellery", value: 10 }, { color: "#ef6548", label: "Others", value: 10 },
] as const;
