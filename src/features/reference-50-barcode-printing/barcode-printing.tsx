"use client";

import {
  Barcode,
  Download,
  FilePenLine,
  Info,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./barcode-printing.module.css";

type JewelleryKind = "necklace" | "bangles" | "pendant" | "earrings" | "ring" | "chain";
type LabelTemplate = "standard" | "large" | "small" | "two-column";

type Product = {
  id: string;
  sku: string;
  name: string;
  detail: string;
  category: string;
  purity: string;
  weight: string;
  price: string;
  barcode: string;
  kind: JewelleryKind;
  metal: "gold" | "diamond" | "silver";
};

type Filters = {
  category: string;
  sku: string;
  barcodeType: string;
  branch: string;
};

const PRODUCTS: Product[] = [
  { id: "1", sku: "GOL22K-0001", name: "22K Gold Necklace", detail: "Antique Design", category: "Gold Jewellery", purity: "22K", weight: "25.500 g", price: "Rs. 1,25,600", barcode: "8901234567890", kind: "necklace", metal: "gold" },
  { id: "2", sku: "GOL22K-0002", name: "22K Gold Bangles", detail: "Traditional", category: "Gold Jewellery", purity: "22K", weight: "18.250 g", price: "Rs. 89,450", barcode: "8901234567891", kind: "bangles", metal: "gold" },
  { id: "3", sku: "GOL22K-0003", name: "22K Gold Pendant", detail: "Peacock", category: "Gold Jewellery", purity: "22K", weight: "6.750 g", price: "Rs. 34,200", barcode: "8901234567892", kind: "pendant", metal: "gold" },
  { id: "4", sku: "DME18K-0001", name: "Diamond Earrings", detail: "18K", category: "Diamond Jewellery", purity: "18K", weight: "4.250 g", price: "Rs. 74,800", barcode: "8901234567893", kind: "earrings", metal: "diamond" },
  { id: "5", sku: "SIL925-0001", name: "Silver Ring", detail: "Oxidized", category: "Silver Jewellery", purity: "925", weight: "3.800 g", price: "Rs. 3,950", barcode: "8901234567894", kind: "ring", metal: "silver" },
  { id: "6", sku: "SIL925-0002", name: "Silver Chain", detail: "925", category: "Silver Jewellery", purity: "925", weight: "12.500 g", price: "Rs. 12,600", barcode: "8901234567895", kind: "chain", metal: "silver" },
];

const DEFAULT_FILTERS: Filters = {
  category: "All Categories",
  sku: "",
  barcodeType: "EAN-13",
  branch: "Main Branch",
};

const TEMPLATE_OPTIONS: { id: LabelTemplate; label: string }[] = [
  { id: "standard", label: "Standard Label (50mm x 30mm)" },
  { id: "large", label: "Large Label (60mm x 40mm)" },
  { id: "small", label: "Small Label (40mm x 25mm)" },
  { id: "two-column", label: "Two Column Label" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <span className={`${styles.productArtwork} ${styles[product.metal]} ${large ? styles.artworkLarge : ""}`}>
      <svg aria-hidden="true" viewBox="0 0 60 60">
        {product.kind === "necklace" ? <><path {...common} d="M9 10c2 22 10 34 21 34s19-12 21-34" strokeWidth="3"/><path {...common} d="M13 17c5 17 10 23 17 23s12-6 17-23" strokeWidth="2"/><path {...common} d="m30 39-6 8 6 7 6-7-6-8Z" strokeWidth="2.4"/><circle cx="30" cy="47" fill="currentColor" r="2"/></> : null}
        {product.kind === "bangles" ? <><ellipse {...common} cx="25" cy="29" rx="17" ry="11" strokeWidth="3"/><ellipse {...common} cx="35" cy="31" rx="17" ry="11" strokeWidth="3"/><path {...common} d="m13 24 24 13M20 20l24 13" opacity=".55"/></> : null}
        {product.kind === "pendant" ? <><path {...common} d="M20 7c6 5 14 5 20 0M30 10v17" strokeWidth="2"/><path {...common} d="m30 24-8 13 8 15 8-15-8-13Z" strokeWidth="2.8"/><path {...common} d="m26 38 4-7 4 7-4 7-4-7Z"/></> : null}
        {product.kind === "earrings" ? <><path {...common} d="M19 10v13m22-13v13" strokeWidth="2"/><circle {...common} cx="19" cy="27" r="5" strokeWidth="2"/><circle {...common} cx="41" cy="27" r="5" strokeWidth="2"/><path {...common} d="m19 32-7 11 7 9 7-9-7-11Zm22 0-7 11 7 9 7-9-7-11Z" strokeWidth="2"/></> : null}
        {product.kind === "ring" ? <><circle {...common} cx="30" cy="35" r="16" strokeWidth="4"/><path {...common} d="m20 19 4-9h12l4 9-10 8-10-8Z" strokeWidth="2.5"/><path {...common} d="m24 10 6 17 6-17"/></> : null}
        {product.kind === "chain" ? <><path {...common} d="M11 8c0 28 7 44 19 44S49 36 49 8" strokeWidth="3"/><path {...common} d="M15 9c1 24 6 37 15 37S44 33 45 9" strokeDasharray="2 4" strokeWidth="2"/></> : null}
      </svg>
    </span>
  );
}

function BarcodeBars({ value, compact = false }: { value: string; compact?: boolean }) {
  return <figure className={`${styles.barcodeFigure} ${compact ? styles.barcodeCompact : ""}`}><span className={styles.barcodeBars} /><figcaption>{value}</figcaption></figure>;
}

function LabelPreview({
  product,
  template,
  title,
  showSku,
  showPrice,
  showQr,
  printable = false,
}: {
  product: Product;
  template: LabelTemplate;
  title: string;
  showSku: boolean;
  showPrice: boolean;
  showQr: boolean;
  printable?: boolean;
}) {
  return (
    <article className={`${styles.label} ${styles[`label_${template.replace("-", "_")}`]} ${printable ? styles.printableLabel : ""}`}>
      <div className={styles.labelTop}>
        <ProductArtwork large product={product} />
        <div className={styles.labelIdentity}>
          <strong>{product.name}</strong>
          <span>{product.detail}</span>
          {showSku ? <small>SKU: {product.sku}</small> : null}
          <small>Purity: {product.purity}</small>
          <small>Weight: {product.weight}</small>
          {showPrice ? <b>{product.price}</b> : null}
        </div>
      </div>
      <BarcodeBars compact value={product.barcode} />
      <span className={styles.labelBrand}>{title}</span>
      {showQr ? <span aria-label="QR code" className={styles.qrCode} /> : null}
    </article>
  );
}

function createPdfBlob(products: Product[], totalLabels: number) {
  const clean = (value: string) => value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/([\\()])/g, "\\$1");
  const lines = products.map((product) => `${product.sku} - ${product.name} - ${product.weight}`);
  const content = [
    "BT",
    "/F1 18 Tf",
    "48 792 Td",
    "(Jewellery Barcode Labels) Tj",
    "/F1 10 Tf",
    "0 -25 Td",
    `(Prepared labels: ${totalLabels}) Tj`,
    ...lines.flatMap((line) => ["0 -18 Td", `(${clean(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function BarcodePrinting198() {
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["1", "2"]));
  const [quantities, setQuantities] = useState<Record<string, number>>({ "1": 2, "2": 2, "3": 2, "4": 1, "5": 3, "6": 2 });
  const [template, setTemplate] = useState<LabelTemplate>("standard");
  const [copies, setCopies] = useState(1);
  const [showSku, setShowSku] = useState(true);
  const [showPrice, setShowPrice] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [labelTitle, setLabelTitle] = useState("Sri Venkateswara Jewellers");

  const visibleProducts = useMemo(() => {
    const query = filters.sku.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = filters.category === "All Categories" || product.category === filters.category;
      const matchesSearch = !query || `${product.sku} ${product.name} ${product.detail}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [filters]);

  const selectedProducts = PRODUCTS.filter((product) => selected.has(product.id));
  const previewProduct = selectedProducts[0] ?? visibleProducts[0] ?? PRODUCTS[0];
  const totalLabels = selectedProducts.reduce((total, product) => total + (quantities[product.id] ?? 1) * copies, 0);
  const allVisibleSelected = visibleProducts.length > 0 && visibleProducts.every((product) => selected.has(product.id));

  function toggleProduct(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVisibleProducts() {
    setSelected((current) => {
      const next = new Set(current);
      visibleProducts.forEach((product) => allVisibleSelected ? next.delete(product.id) : next.add(product.id));
      return next;
    });
  }

  function applyFilters() {
    setFilters(draftFilters);
    setPage(1);
    setMessage("Product filters applied.");
  }

  function resetFilters() {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setMessage("Filters reset.");
  }

  function generateBarcodes() {
    if (!selected.size) {
      setMessage("Select at least one product to generate a barcode.");
      return;
    }
    setMessage(`${selected.size} product barcode${selected.size === 1 ? "" : "s"} generated successfully.`);
  }

  function printLabels() {
    if (!selected.size) {
      setMessage("Select at least one product to print labels.");
      return;
    }
    setMessage(`${totalLabels} label${totalLabels === 1 ? "" : "s"} sent to print preview.`);
    window.print();
  }

  function downloadPdf() {
    if (!selected.size) {
      setMessage("Select at least one product to download labels.");
      return;
    }
    const url = URL.createObjectURL(createPdfBlob(selectedProducts, totalLabels));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jewellery-barcode-labels.pdf";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
    setMessage("Barcode label PDF downloaded.");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<div className={styles.headerActions}>
          <button className={`button ${styles.primary}`} onClick={generateBarcodes} type="button"><Barcode size={14} />Generate Barcode</button>
          <button className={`button ${styles.primary}`} onClick={printLabels} type="button"><Printer size={14} />Print Labels</button>
          <button className={`button ${styles.primary}`} onClick={downloadPdf} type="button"><Download size={14} />Download PDF</button>
        </div>}
        description="Generate and print barcodes and product labels"
        title="Barcode & Printing"
      />

      {message ? <p aria-live="polite" className={styles.notice}>{message}</p> : null}

      <Card className={styles.filters}>
        <div className={styles.filterGrid}>
          <Field label="Category">
            <select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))} value={draftFilters.category}>
              <option>All Categories</option><option>Gold Jewellery</option><option>Diamond Jewellery</option><option>Silver Jewellery</option>
            </select>
          </Field>
          <Field label="SKU">
            <input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, sku: event.target.value }))} onKeyDown={(event) => event.key === "Enter" && applyFilters()} placeholder="Enter SKU" value={draftFilters.sku} />
          </Field>
          <Field label="Barcode Type">
            <select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, barcodeType: event.target.value }))} value={draftFilters.barcodeType}><option>EAN-13</option><option>Code 128</option><option>UPC-A</option></select>
          </Field>
          <Field label="Branch">
            <select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, branch: event.target.value }))} value={draftFilters.branch}><option>Main Branch</option><option>Secunderabad Branch</option><option>Kukatpally Branch</option></select>
          </Field>
          <button className={`button ${styles.primary} ${styles.filterButton}`} onClick={applyFilters} type="button">Apply Filter</button>
          <button className={`button ${styles.resetButton}`} onClick={resetFilters} type="button"><RotateCcw size={13} />Reset</button>
        </div>
      </Card>

      <section className={styles.workspace}>
        <Card className={styles.productCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead><tr><th><input aria-label="Select all visible products" checked={allVisibleSelected} onChange={toggleVisibleProducts} type="checkbox" /></th><th>#</th><th>Image</th><th>SKU</th><th>Product Name</th><th>Purity</th><th>Weight</th><th>Print Qty</th></tr></thead>
              <tbody>
                {visibleProducts.map((product) => <tr className={selected.has(product.id) ? styles.selectedRow : ""} key={product.id}>
                  <td><input aria-label={`Select ${product.name}`} checked={selected.has(product.id)} onChange={() => toggleProduct(product.id)} type="checkbox" /></td>
                  <td>{product.id}</td>
                  <td><ProductArtwork product={product} /></td>
                  <td><b className={styles.sku}>{product.sku}</b></td>
                  <td><span className={styles.productName}>{product.name}<small>{product.detail}</small></span></td>
                  <td>{product.purity}</td><td>{product.weight}</td>
                  <td><input aria-label={`Print quantity for ${product.name}`} className={styles.quantity} min="1" onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: Math.max(1, Math.min(99, Number(event.target.value) || 1)) }))} type="number" value={quantities[product.id] ?? 1} /></td>
                </tr>)}
                {!visibleProducts.length ? <tr><td className={styles.empty} colSpan={8}>No products match these filters.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <footer className={styles.tableFooter}>
            <span>Showing 1 to {visibleProducts.length} of 152 items</span>
            <nav aria-label="Product pagination" className={styles.pagination}>
              <button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">‹</button>
              {[1, 2, 3, 4, 5].map((number) => <button className={page === number ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
              <span>…</span><button className={page === 26 ? styles.currentPage : ""} onClick={() => setPage(26)} type="button">26</button>
              <button aria-label="Next page" disabled={page === 26} onClick={() => setPage((current) => Math.min(26, current + 1))} type="button">›</button>
            </nav>
          </footer>
        </Card>

        <aside className={styles.sidebar}>
          <Card className={styles.previewCard}>
            <h2>Label Preview</h2>
            <div className={styles.previewCanvas}><LabelPreview product={previewProduct} showPrice={showPrice} showQr={showQr} showSku={showSku} template={template} title={labelTitle} /></div>
          </Card>
          <Card className={styles.templateCard}>
            <h2>Print Template</h2>
            <div className={styles.templateOptions}>{TEMPLATE_OPTIONS.map((option) => <label key={option.id}><input checked={template === option.id} name="label-template" onChange={() => setTemplate(option.id)} type="radio" /><span>{option.label}</span></label>)}</div>
            <button className={styles.editButton} onClick={() => setEditingTemplate((current) => !current)} type="button"><FilePenLine size={12} />{editingTemplate ? "Close Editor" : "Edit Template"}</button>
            {editingTemplate ? <div className={styles.templateEditor}><label><span>Label heading</span><input className="field" maxLength={32} onChange={(event) => setLabelTitle(event.target.value)} value={labelTitle} /></label></div> : null}
          </Card>
          <Card className={styles.settingsCard}>
            <h2>Print Settings</h2>
            <div className={styles.settingsGrid}>
              <Field label="Copies"><select className="select" onChange={(event) => setCopies(Number(event.target.value))} value={copies}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></Field>
              <label className={styles.checkSetting}><input checked={showSku} onChange={(event) => setShowSku(event.target.checked)} type="checkbox" />Print SKU Text</label>
              <label className={styles.checkSetting}><input checked={showPrice} onChange={(event) => setShowPrice(event.target.checked)} type="checkbox" />Print Price</label>
              <label className={styles.checkSetting}><input checked={showQr} onChange={(event) => setShowQr(event.target.checked)} type="checkbox" />Print QR Code</label>
            </div>
          </Card>
          <div className={styles.selectionSummary}><Info size={14} /><span>Total Items Selected: <b>{selected.size}</b></span><span>Total Labels: <b>{totalLabels}</b></span></div>
        </aside>
      </section>

      <section aria-hidden="true" className={styles.printSheet}>
        {selectedProducts.flatMap((product) => Array.from({ length: Math.min((quantities[product.id] ?? 1) * copies, 40) }, (_, index) => <LabelPreview key={`${product.id}-${index}`} printable product={product} showPrice={showPrice} showQr={showQr} showSku={showSku} template={template} title={labelTitle} />))}
      </section>
    </div>
  );
}
