"use client";

import { Printer, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import { barcodeItems, type BarcodeItem } from "./barcode-invoice-data";
import { BarcodeVisual } from "./barcode-visual";
import styles from "./barcode-invoice.module.css";

function BarcodeLabel({ item }: { item: BarcodeItem }) {
  return <article className={styles.barcodeLabel}><BarcodeVisual compact value={item.code} /><strong>{item.name}</strong><span>Wt: {item.weight}</span></article>;
}

export function BarcodePrinting() {
  const [itemType, setItemType] = useState<BarcodeItem["type"]>("Gold Jewellery");
  const [category, setCategory] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [size, setSize] = useState("Medium (40 x 20 mm)");
  const [copies, setCopies] = useState(1);
  const [message, setMessage] = useState("");

  const typeItems = barcodeItems.filter((item) => item.type === itemType);
  const categories = [...new Set(typeItems.map((item) => item.category))];
  const matchingItems = typeItems.filter((item) => !category || item.category === category);
  const selectedItem = barcodeItems.find((item) => item.code === selectedCode);
  const printable = useMemo(() => {
    const source = selectedItem ? [selectedItem] : barcodeItems;
    return source.flatMap((item) => Array.from({ length: Math.max(1, copies) }, () => item));
  }, [copies, selectedItem]);

  function changeType(value: BarcodeItem["type"]) {
    setItemType(value);
    setCategory("");
    setSelectedCode("");
  }

  function reset() {
    setItemType("Gold Jewellery");
    setCategory("");
    setSelectedCode("");
    setSize("Medium (40 x 20 mm)");
    setCopies(1);
    setMessage("Print controls reset.");
  }

  function print() {
    setMessage(`${printable.length} ${size} label${printable.length === 1 ? "" : "s"} sent to the print dialog.`);
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Barcode Printing</h1><p>Home <span>›</span> Barcode &amp; Invoice <span>›</span> Barcode Printing</p></header>
      <section className={`${styles.twoColumn} ${styles.printingColumns}`}>
        <Card className={styles.panel}>
          <h2>Print Barcode</h2>
          <div className={styles.stackForm}>
            <label><span>Item Type <b>*</b></span><select className="select" onChange={(event) => changeType(event.target.value as BarcodeItem["type"])} value={itemType}><option>Gold Jewellery</option><option>Diamond Jewellery</option></select></label>
            <label><span>Item Category <b>*</b></span><select className="select" onChange={(event) => { setCategory(event.target.value); setSelectedCode(""); }} value={category}><option value="">Select Category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Item Name <b>*</b></span><select className="select" onChange={(event) => setSelectedCode(event.target.value)} value={selectedCode}><option value="">Select Item</option>{matchingItems.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
            <label><span>Barcode Size</span><select className="select" onChange={(event) => setSize(event.target.value)} value={size}><option>Small (30 x 15 mm)</option><option>Medium (40 x 20 mm)</option><option>Large (50 x 30 mm)</option></select></label>
            <label><span>No. of Copies <b>*</b></span><input className="field" max="50" min="1" onChange={(event) => setCopies(Number(event.target.value))} type="number" value={copies} /></label>
          </div>
          <div className={styles.formActions}><button className={styles.greenButton} onClick={print} type="button"><Printer size={16} />Print Barcode</button><button className={styles.secondaryButton} onClick={reset} type="button"><RotateCcw size={16} />Reset</button></div>
          <p aria-live="polite" className={message ? styles.inlineFeedback : "sr-only"}>{message}</p>
        </Card>

        <Card className={`${styles.panel} ${styles.printPreview}`}><h2>Print Preview</h2><div className={styles.labelGrid}>{barcodeItems.map((item) => <BarcodeLabel item={item} key={item.code} />)}</div></Card>
      </section>
      <section aria-label="Prepared barcode labels" className={styles.printOnly}>{printable.map((item, index) => <BarcodeLabel item={item} key={`${item.code}-${index}`} />)}</section>
    </div>
  );
}

