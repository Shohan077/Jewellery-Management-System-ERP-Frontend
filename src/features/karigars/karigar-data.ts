export const karigarSkills = [
  "Gold Smith",
  "Diamond Setting",
  "Polishing",
  "Design Making",
  "Casting",
  "Engraving",
  "Stone Setting",
  "Repairing",
  "Wax Modeling",
] as const;

export type KarigarSkill = (typeof karigarSkills)[number];
export type KarigarStatus = "Active" | "Inactive";

export type KarigarRecord = {
  id: number;
  name: string;
  skill: KarigarSkill;
  phone: string;
  joiningDate: string;
  status: KarigarStatus;
};

const featuredKarigars: KarigarRecord[] = [
  { id: 1, name: "Abdul Karim", skill: "Gold Smith", phone: "01712-345678", joiningDate: "2023-01-12", status: "Active" },
  { id: 2, name: "Salim Mia", skill: "Diamond Setting", phone: "01823-456789", joiningDate: "2023-03-05", status: "Active" },
  { id: 3, name: "Rafiqul Islam", skill: "Polishing", phone: "01611-223344", joiningDate: "2023-02-18", status: "Active" },
  { id: 4, name: "Jahid Hossain", skill: "Design Making", phone: "01755-667788", joiningDate: "2023-04-10", status: "Active" },
  { id: 5, name: "Mizanur Rahman", skill: "Casting", phone: "01844-556677", joiningDate: "2023-01-22", status: "Inactive" },
  { id: 6, name: "Harun Or Rashid", skill: "Engraving", phone: "01933-112233", joiningDate: "2023-02-14", status: "Active" },
  { id: 7, name: "Alamgir Hossain", skill: "Stone Setting", phone: "01677-889900", joiningDate: "2023-03-28", status: "Active" },
  { id: 8, name: "Sultan Ahmed", skill: "Repairing", phone: "01866-778899", joiningDate: "2023-04-17", status: "Active" },
  { id: 9, name: "Nasir Uddin", skill: "Gold Smith", phone: "01911-334455", joiningDate: "2023-01-02", status: "Active" },
  { id: 10, name: "Kamrul Hasan", skill: "Wax Modeling", phone: "01790-998877", joiningDate: "2023-02-09", status: "Active" },
];

const firstNames = [
  "Aminul",
  "Bashir",
  "Delwar",
  "Emdadul",
  "Faruk",
  "Golam",
  "Habib",
  "Iqbal",
  "Jamal",
  "Khaled",
  "Liton",
  "Mahbub",
  "Nayeem",
  "Omar",
  "Parvez",
] as const;

const lastNames = ["Haque", "Mollah", "Sarker", "Khan", "Talukdar"] as const;
const phonePrefixes = ["017", "018", "019", "016", "015", "013", "014"] as const;

const supportingKarigars: KarigarRecord[] = Array.from({ length: 75 }, (_, index) => {
  const id = index + featuredKarigars.length + 1;
  const firstName = firstNames[Math.floor(index / lastNames.length)];
  const lastName = lastNames[index % lastNames.length];
  const prefix = phonePrefixes[index % phonePrefixes.length];
  const exchange = String((index * 7 + 21) % 100).padStart(2, "0");
  const subscriber = String(210000 + index * 137).padStart(6, "0");
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index * 3) % 28 + 1).padStart(2, "0");

  return {
    id,
    name: `${firstName} ${lastName}`,
    skill: karigarSkills[index % karigarSkills.length],
    phone: `${prefix}${exchange}-${subscriber}`,
    joiningDate: `2024-${month}-${day}`,
    status: index % 8 === 6 ? "Inactive" : "Active",
  };
});

export const initialKarigars: KarigarRecord[] = [...featuredKarigars, ...supportingKarigars];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export function formatJoiningDate(value: string) {
  const [year, month, day] = value.split("-");
  const monthName = monthNames[Number(month) - 1];

  return monthName ? `${day} ${monthName} ${year}` : value;
}

export function karigarInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
