export const certificateTypes = ["Hallmark", "GIA", "IGI"] as const;
export const certificateStatuses = ["Valid", "Expired"] as const;

export type CertificateType = (typeof certificateTypes)[number];
export type CertificateStatus = (typeof certificateStatuses)[number];

export type CertificateRecord = {
  id: number;
  certificateNo: string;
  productName: string;
  type: CertificateType;
  purity: string;
  issueDate: string;
  status: CertificateStatus;
};

const featuredCertificates: CertificateRecord[] = [
  { id: 1, certificateNo: "GIA123456", productName: "Diamond Ring", type: "GIA", purity: "VS1", issueDate: "2025-01-12", status: "Valid" },
  { id: 2, certificateNo: "IGI987654", productName: "Diamond Earring", type: "IGI", purity: "VS2", issueDate: "2025-02-18", status: "Valid" },
  { id: 3, certificateNo: "HUID224466", productName: "Gold Necklace", type: "Hallmark", purity: "22K", issueDate: "2025-03-05", status: "Valid" },
  { id: 4, certificateNo: "HUID224467", productName: "Gold Bracelet", type: "Hallmark", purity: "22K", issueDate: "2025-03-10", status: "Valid" },
  { id: 5, certificateNo: "GIA556677", productName: "Diamond Pendant", type: "GIA", purity: "VVS1", issueDate: "2025-03-22", status: "Valid" },
  { id: 6, certificateNo: "IGI445566", productName: "Diamond Ring", type: "IGI", purity: "SI1", issueDate: "2025-04-01", status: "Expired" },
  { id: 7, certificateNo: "HUID224468", productName: "Gold Chain", type: "Hallmark", purity: "18K", issueDate: "2025-04-12", status: "Valid" },
  { id: 8, certificateNo: "HUID224469", productName: "Gold Bangle", type: "Hallmark", purity: "22K", issueDate: "2025-04-18", status: "Valid" },
  { id: 9, certificateNo: "GIA778899", productName: "Diamond Nose Pin", type: "GIA", purity: "VS2", issueDate: "2025-04-20", status: "Valid" },
  { id: 10, certificateNo: "IGI334455", productName: "Diamond Bracelet", type: "IGI", purity: "SI2", issueDate: "2025-04-25", status: "Valid" },
];

const goldProducts = ["Gold Necklace", "Gold Ring", "Gold Bracelet", "Gold Chain", "Gold Bangle", "Gold Earring"];
const diamondProducts = ["Diamond Ring", "Diamond Earring", "Diamond Pendant", "Diamond Nose Pin", "Diamond Bracelet"];
const diamondPurities = ["VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const expiredIds = new Set([61, 113, 171, 229]);

function generatedIssueDate(id: number) {
  const month = ((id * 3) % 12) + 1;
  const day = ((id * 7) % 27) + 1;
  const year = id < 80 ? 2023 : id < 170 ? 2024 : 2025;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildGeneratedCertificate(id: number): CertificateRecord {
  const isHallmark = id <= 204;
  const type: CertificateType = isHallmark ? "Hallmark" : id % 2 === 0 ? "GIA" : "IGI";
  const productPool = isHallmark ? goldProducts : diamondProducts;

  return {
    id,
    certificateNo: isHallmark
      ? `HUID${String(224459 + id).padStart(6, "0")}`
      : `${type}${String(410000 + id * 73).padStart(6, "0")}`,
    productName: productPool[(id - 1) % productPool.length],
    type,
    purity: isHallmark ? (id % 4 === 0 ? "18K" : "22K") : diamondPurities[(id - 1) % diamondPurities.length],
    issueDate: generatedIssueDate(id),
    status: expiredIds.has(id) ? "Expired" : "Valid",
  };
}

export const initialCertificates: CertificateRecord[] = [
  ...featuredCertificates,
  ...Array.from({ length: 235 }, (_, index) => buildGeneratedCertificate(index + 11)),
];

export function nextCertificateId(records: CertificateRecord[]) {
  return records.reduce((highest, record) => Math.max(highest, record.id), 0) + 1;
}

