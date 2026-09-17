export const karigarSkills = [
  "Gold Setting",
  "Polishing",
  "Engraving",
  "Casting",
  "Chain Making",
  "Design",
  "Stone Setting",
  "Finishing",
  "Mould Making",
  "Repairing",
] as const;

export const karigarStatuses = ["Active", "On Work", "Inactive", "Others"] as const;

export type KarigarSkill = (typeof karigarSkills)[number];
export type KarigarStatus = (typeof karigarStatuses)[number];

export type Karigar = {
  numericId: number;
  code: string;
  name: string;
  phone: string;
  skill: KarigarSkill;
  status: KarigarStatus;
};

const featuredKarigars: Karigar[] = [
  { numericId: 1, code: "K-001", name: "Abdul Karim", phone: "01712-345678", skill: "Gold Setting", status: "Active" },
  { numericId: 2, code: "K-002", name: "Salim Mia", phone: "01823-456678", skill: "Polishing", status: "Active" },
  { numericId: 3, code: "K-003", name: "Rafiqul Islam", phone: "01611-223344", skill: "Engraving", status: "On Work" },
  { numericId: 4, code: "K-004", name: "Jahid Hossain", phone: "01987-654321", skill: "Casting", status: "Active" },
  { numericId: 5, code: "K-005", name: "Mizanur Rahman", phone: "01755-667788", skill: "Chain Making", status: "Active" },
  { numericId: 6, code: "P-006", name: "Harun Rashid", phone: "01844-112233", skill: "Design", status: "On Work" },
  { numericId: 7, code: "K-007", name: "Alomgir Hossain", phone: "01521-998877", skill: "Stone Setting", status: "Inactive" },
  { numericId: 8, code: "K-008", name: "Sultan Ahmed", phone: "01881-776655", skill: "Finishing", status: "Active" },
  { numericId: 9, code: "DK-009", name: "Nasir Uddin", phone: "01790-334455", skill: "Mould Making", status: "Active" },
  { numericId: 10, code: "GK-010", name: "Kamrul Hasan", phone: "01670-889600", skill: "Repairing", status: "Others" },
];

const additionalNames = [
  "Azizul Haque", "Belal Miah", "Chandan Das", "Delwar Hossain", "Elias Ahmed", "Farid Uddin",
  "Golam Rabbani", "Habib Khan", "Imran Hossain", "Jamal Sheikh", "Khaled Mahmud", "Liton Sarker",
  "Masud Rana", "Naim Islam", "Omar Faruk", "Parvez Mollah", "Quddus Ali", "Rashed Kabir",
  "Sohel Mia", "Tariq Hasan", "Uzzal Roy", "Vashir Ahmed", "Wasim Akram", "Yasin Arafat",
] as const;

const supportingKarigars: Karigar[] = additionalNames.map((name, index) => {
  const numericId = index + 11;
  const prefix = ["017", "018", "019", "016", "015"][index % 5];
  const exchange = String(20 + ((index * 7) % 79)).padStart(2, "0");
  const subscriber = String(210000 + index * 1947).padStart(6, "0");
  // Keep the generated population aligned with the management overview:
  // 28 available craftsmen (18 currently on work) and 6 inactive overall.
  const status: KarigarStatus = index < 16
    ? "On Work"
    : index < 21
      ? "Inactive"
      : index === 21
        ? "Active"
        : "Others";

  return {
    numericId,
    code: `K-${String(numericId).padStart(3, "0")}`,
    name,
    phone: `${prefix}${exchange}-${subscriber}`,
    skill: karigarSkills[index % karigarSkills.length],
    status,
  };
});

export const initialKarigars: Karigar[] = [...featuredKarigars, ...supportingKarigars];

export function karigarInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
