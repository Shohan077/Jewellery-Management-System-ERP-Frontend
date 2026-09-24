export const settingsSections = [
  { label: "General Settings", href: "/settings/system-settings" },
  { label: "Company Profile", href: "/settings/company-profile" },
  { label: "Business Settings", href: "/settings" },
  { label: "Tax & Currency", href: "/settings/tax-currency" },
  { label: "Notification Settings", href: "/settings/notifications" },
  { label: "Email Configuration", href: "/settings/email-configuration" },
  { label: "SMS Configuration", href: "/settings/sms-whatsapp" },
  { label: "Security Settings", href: "/settings/security" },
  { label: "System Maintenance", href: "/settings/maintenance" },
] as const;

export type CompanyProfileState = {
  companyName: string;
  shopName: string;
  businessType: string;
  phone: string;
  email: string;
  website: string;
  tradeLicense: string;
  taxNumber: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;
};

export const initialCompanyProfile: CompanyProfileState = {
  companyName: "Shree Hari Jewellers Pvt. Ltd.",
  shopName: "Shree Hari Jewellers",
  businessType: "Jewellery Retail & Wholesale",
  phone: "+91 98765 43210",
  email: "info@shreeharijewellers.com",
  website: "www.shreeharijewellers.com",
  tradeLicense: "TL/2024/12589",
  taxNumber: "24AABCS1234D1Z5",
  address: "123, Gold Market, Zaveri Bazaar\nNear Panchkuva, Opp. SBI Bank",
  city: "Ahmedabad",
  district: "Ahmedabad",
  state: "Gujarat",
  pinCode: "380001",
  country: "India",
};

export type TaxRule = {
  id: number;
  slabFrom: string;
  slabTo: string;
  type: string;
  rate: string;
  active: boolean;
};

export const initialTaxRules: TaxRule[] = [
  { id: 1, slabFrom: "0.00", slabTo: "500,000.00", type: "Making Charge", rate: "5.00", active: true },
  { id: 2, slabFrom: "500,000.01", slabTo: "1,000,000.00", type: "Making Charge", rate: "4.50", active: true },
  { id: 3, slabFrom: "1,000,000.01", slabTo: "2,000,000.00", type: "Making Charge", rate: "4.00", active: true },
  { id: 4, slabFrom: "2,000,000.01", slabTo: "Above", type: "Making Charge", rate: "3.50", active: true },
  { id: 5, slabFrom: "All", slabTo: "All", type: "Stone Charge", rate: "1.50", active: true },
  { id: 6, slabFrom: "All", slabTo: "All", type: "Sales Tax (GST)", rate: "5.00", active: true },
];

export type BranchRecord = {
  id: number;
  code: string;
  name: string;
  manager: string;
  phone: string;
  city: string;
  openingDate: string;
  active: boolean;
  email: string;
  address: string;
  warehouse: string;
  invoicePrefix: string;
  goldRateSource: string;
};

export const initialBranches: BranchRecord[] = [
  { id: 1, code: "BR001", name: "Head Office", manager: "Rajesh Patel", phone: "98765 43210", city: "Ahmedabad", openingDate: "01/01/2015", active: true, email: "head@shreeharijewellers.com", address: "123 Gold Market, Ahmedabad", warehouse: "Main Warehouse", invoicePrefix: "HO-", goldRateSource: "Manual Entry" },
  { id: 2, code: "BR002", name: "Maninagar Branch", manager: "Amit Shah", phone: "98765 42111", city: "Ahmedabad", openingDate: "15/03/2018", active: true, email: "maninagar@shreeharijewellers.com", address: "2nd Floor, Shree Complex, Maninagar, Ahmedabad - 380008", warehouse: "Main Warehouse", invoicePrefix: "MNGR-", goldRateSource: "Manual Entry" },
  { id: 3, code: "BR003", name: "CG Road Branch", manager: "Meena Joshi", phone: "98765 43212", city: "Ahmedabad", openingDate: "10/06/2019", active: true, email: "cgroad@shreeharijewellers.com", address: "CG Road, Ahmedabad", warehouse: "CG Warehouse", invoicePrefix: "CGR-", goldRateSource: "Head Office" },
  { id: 4, code: "BR004", name: "Surat Branch", manager: "Vikram Desai", phone: "98765 43213", city: "Surat", openingDate: "05/08/2019", active: true, email: "surat@shreeharijewellers.com", address: "Ring Road, Surat", warehouse: "Surat Warehouse", invoicePrefix: "SRT-", goldRateSource: "Head Office" },
  { id: 5, code: "BR005", name: "Vadodara Branch", manager: "Pooja Sharma", phone: "98765 43214", city: "Vadodara", openingDate: "20/01/2020", active: false, email: "vadodara@shreeharijewellers.com", address: "Alkapuri, Vadodara", warehouse: "Vadodara Warehouse", invoicePrefix: "VDR-", goldRateSource: "Head Office" },
  { id: 6, code: "BR006", name: "Rajkot Branch", manager: "Nilesh Kothari", phone: "98765 43215", city: "Rajkot", openingDate: "12/07/2021", active: true, email: "rajkot@shreeharijewellers.com", address: "Kalawad Road, Rajkot", warehouse: "Rajkot Warehouse", invoicePrefix: "RJK-", goldRateSource: "Manual Entry" },
  { id: 7, code: "BR007", name: "Mehsana Branch", manager: "Harshil Modi", phone: "98765 43216", city: "Mehsana", openingDate: "01/10/2022", active: true, email: "mehsana@shreeharijewellers.com", address: "Modhera Road, Mehsana", warehouse: "Mehsana Warehouse", invoicePrefix: "MHS-", goldRateSource: "Head Office" },
  { id: 8, code: "BR008", name: "Bhavnagar Branch", manager: "Ketan Trivedi", phone: "98765 43217", city: "Bhavnagar", openingDate: "15/03/2024", active: true, email: "bhavnagar@shreeharijewellers.com", address: "Waghawadi Road, Bhavnagar", warehouse: "Bhavnagar Warehouse", invoicePrefix: "BHV-", goldRateSource: "Head Office" },
];
