export const loyaltyTiers = ["Bronze", "Silver", "Gold", "Platinum"] as const;
export const memberStatuses = ["Active", "Inactive"] as const;

export type LoyaltyTier = (typeof loyaltyTiers)[number];
export type MemberStatus = (typeof memberStatuses)[number];

export type LoyaltyMember = {
  id: string;
  name: string;
  phone: string;
  tier: LoyaltyTier;
  points: number;
  status: MemberStatus;
};

export type PointEntry = {
  id: string;
  member: string;
  customerId: string;
  date: string;
  activity: string;
  points: number;
  kind: "Earned" | "Redeemed";
};

export type RewardScheme = {
  id: string;
  title: string;
  tier: LoyaltyTier | "All Tiers";
  points: number;
  reward: string;
  active: boolean;
};

export type LoyaltyCampaign = {
  id: string;
  name: string;
  audience: string;
  period: string;
  members: number;
  status: "Active" | "Scheduled" | "Completed";
};

const featuredMembers: LoyaltyMember[] = [
  { id: "C-000125", name: "Rahim Uddin", phone: "01712-345678", tier: "Gold", points: 12_450, status: "Active" },
  { id: "C-000128", name: "Nusrat Jahan", phone: "01823-456678", tier: "Silver", points: 8_230, status: "Active" },
  { id: "C-000132", name: "Tanvir Ahmed", phone: "01611-223344", tier: "Platinum", points: 25_600, status: "Active" },
  { id: "C-000145", name: "Farzana Akter", phone: "01987-654321", tier: "Silver", points: 6_780, status: "Active" },
  { id: "C-000156", name: "Md. Selim", phone: "01755-667788", tier: "Bronze", points: 3_450, status: "Inactive" },
  { id: "C-000162", name: "Sabrina Khan", phone: "01844-112233", tier: "Gold", points: 15_230, status: "Active" },
  { id: "C-000178", name: "Karim Hossain", phone: "01970-334455", tier: "Silver", points: 7_890, status: "Active" },
  { id: "C-000182", name: "Laila Begum", phone: "01670-889900", tier: "Gold", points: 13_200, status: "Active" },
  { id: "C-000199", name: "Nasir Uddin", phone: "01811-776655", tier: "Bronze", points: 2_560, status: "Inactive" },
  { id: "C-000201", name: "Mizanur Rahman", phone: "01795-445566", tier: "Silver", points: 9_340, status: "Active" },
];

const firstNames = ["Arif", "Shamim", "Rafia", "Nabila", "Sajid", "Anika", "Imran", "Sharmin", "Rashed", "Tania", "Mahmud", "Jannat"];
const lastNames = ["Hasan", "Ahmed", "Akter", "Islam", "Chowdhury", "Khan", "Haque", "Sultana", "Kabir", "Hossain"];

const generatedMembers: LoyaltyMember[] = Array.from({ length: 1_238 }, (_, index) => ({
  id: `C-${String(index + 1_000).padStart(6, "0")}`,
  name: `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`,
  phone: `01${6 + (index % 4)}${String(10_000_000 + index).slice(-8, -5)}-${String(10_000_000 + index).slice(-5)}`,
  tier: loyaltyTiers[index % loyaltyTiers.length],
  points: 369 + (index < 748 ? 1 : 0),
  status: index < 884 ? "Active" : "Inactive",
}));

export const initialMembers: LoyaltyMember[] = [...featuredMembers, ...generatedMembers];

export const pointHistory: PointEntry[] = [
  { id: "PT-00081", member: "Rahim Uddin", customerId: "C-000125", date: "30 Apr 2025", activity: "Sales invoice S-000125", points: 850, kind: "Earned" },
  { id: "PT-00080", member: "Nusrat Jahan", customerId: "C-000128", date: "29 Apr 2025", activity: "Gold member reward", points: 500, kind: "Earned" },
  { id: "PT-00079", member: "Tanvir Ahmed", customerId: "C-000132", date: "28 Apr 2025", activity: "Voucher redeemed", points: -1_500, kind: "Redeemed" },
  { id: "PT-00078", member: "Sabrina Khan", customerId: "C-000162", date: "27 Apr 2025", activity: "Sales invoice S-000119", points: 720, kind: "Earned" },
  { id: "PT-00077", member: "Farzana Akter", customerId: "C-000145", date: "26 Apr 2025", activity: "Birthday reward", points: 1_000, kind: "Earned" },
  { id: "PT-00076", member: "Laila Begum", customerId: "C-000182", date: "25 Apr 2025", activity: "Discount redeemed", points: -750, kind: "Redeemed" },
];

export const rewardSchemes: RewardScheme[] = [
  { id: "RW-001", title: "Welcome Bonus", tier: "All Tiers", points: 500, reward: "Joining reward", active: true },
  { id: "RW-002", title: "Gold Privilege", tier: "Gold", points: 5_000, reward: "5% invoice discount", active: true },
  { id: "RW-003", title: "Platinum Reward", tier: "Platinum", points: 10_000, reward: "Premium gift voucher", active: true },
  { id: "RW-004", title: "Silver Saver", tier: "Silver", points: 3_000, reward: "Free jewellery cleaning", active: false },
];

export const campaigns: LoyaltyCampaign[] = [
  { id: "CMP-025", name: "Pohela Boishakh Bonus", audience: "All active members", period: "01 Apr - 30 Apr 2025", members: 892, status: "Active" },
  { id: "CMP-024", name: "Gold Tier Double Points", audience: "Gold members", period: "01 May - 15 May 2025", members: 316, status: "Scheduled" },
  { id: "CMP-023", name: "VIP Spring Collection", audience: "Platinum members", period: "01 Mar - 31 Mar 2025", members: 86, status: "Completed" },
];

export const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);

