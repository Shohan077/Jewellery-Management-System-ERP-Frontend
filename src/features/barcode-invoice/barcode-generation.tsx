"use client";

import { Printer, RotateCcw, Settings2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  barcodeItems,
  getBarcodeSnapshot,
  INITIAL_BARCODE_SNAPSHOT,
  parseBarcodeRecords,
  persistBarcodeRecords,
  subscribeBarcodeInvoice,
  type BarcodeItem,
  type GeneratedBarcode,
} from "./barcode-invoice-data";
import { BarcodeVisual } from "./barcode-visual";
import styles from "./barcode-invoice.module.css";

const firstItem = barcodeItems[0];

function displayDate() {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
}

export function BarcodeGeneration() {
  const snapshot = useSyncExternalStore(subscribeBarcodeInvoice, getBarcodeSnapshot, () => INITIAL_BARCODE_SNAPSHOT);
  const records = useMemo(() => parseBarcodeRecords(snapshot), [snapshot]);
  const [itemType, setItemType] = useState<BarcodeItem["type"]>(firstItem.type);
  const [category, setCategory] = useState(firstItem.category);
  const [selectedCode, setSelectedCode] = useState(firstItem.code);
  const [itemLabel, setItemLabel] = useState("Gold Name");
  const [barcodeType, setBarcodeType] = useState<GeneratedBarcode["barcodeType"]>("Code 128");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [printRecord, setPrintRecord] = useState<GeneratedBarcode | null>(null);

  const typeItems = barcodeItems.filter((item) => item.type === itemType);
  const categories = [...new Set(typeItems.map((item) => item.category))];
  const matchingItems = typeItems.filter((item) => item.category === category);
  const selectedItem = barcodeItems.find((item) => item.code === selectedCode) ?? matchingItems[0] ?? firstItem;

  function selectType(value: BarcodeItem["type"]) {
    const next = barcodeItems.find((item) => item.type === value) ?? firstItem;
    setItemType(value);
    setCategory(next.category);
    setSelectedCode(next.code);
    setItemLabel(value === "Gold Jewellery" ? "Gold Name" : "Diamond Name");
  }

  function selectCategory(value: string) {
    const next = barcodeItems.find((item) => item.type === itemType && item.category === value);
    setCategory(value);
    if (next) setSelectedCode(next.code);
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record: GeneratedBarcode = {
      ...selectedItem,
      id: records.find((item) => item.code === selectedItem.code)?.id ?? `barcode-${crypto.randomUUID()}`,
      date: displayDate(),
      barcodeType,
    };
    persistBarcodeRecords([record, ...records.filter((item) => item.code !== record.code)]);
    setMessage(`${quantity} barcode${quantity === 1 ? "" : "s"} generated for ${record.name}.`);
  }

  function reset() {
    setItemType(firstItem.type);
    setCategory(firstItem.category);
    setSelectedCode(firstItem.code);
    setItemLabel("Gold Name");
    setBarcodeType("Code 128");
    setQuantity(1);
    setMessage("Generator reset to the default item.");
  }

  function print(record: GeneratedBarcode) {
    setPrintRecord(record);
    setMessage(`${record.code} is ready to print.`);
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Barcode Generation</h1><p>Home <span>›</span> Barcode &amp; Invoice <span>›</span> Barcode Generation</p></header>

      <section className={styles.twoColumn}>
        <Card as="form" className={styles.panel} onSubmit={generate}>
          <h2>Generate Barcode</h2>
          <div className={styles.formGrid}>
            <label><span>Item Type <b>*</b></span><select className="select" onChange={(event) => selectType(event.target.value as BarcodeItem["type"])} value={itemType}><option>Gold Jewellery</option><option>Diamond Jewellery</option></select></label>
            <label><span>Item Category <b>*</b></span><select className="select" onChange={(event) => selectCategory(event.target.value)} value={category}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Item Name <b>*</b></span><input className="field" onChange={(event) => setItemLabel(event.target.value)} required value={itemLabel} /></label>
            <label><span>Item</span><select className="select" onChange={(event) => setSelectedCode(event.target.value)} value={selectedItem.code}>{matchingItems.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
            <label><span>Item Code</span><input className="field" readOnly value={selectedItem.code} /></label>
            <label><span>Barcode Type</span><select className="select" onChange={(event) => setBarcodeType(event.target.value as GeneratedBarcode["barcodeType"])} value={barcodeType}><option>Code 128</option><option>Code 39</option><option>EAN-13</option></select></label>
            <label><span>No. of Barcode <b>*</b></span><input className="field" max="50" min="1" onChange={(event) => setQuantity(Number(event.target.value))} required type="number" value={quantity} /></label>
          </div>
          <div className={styles.formActions}><button className={styles.blueButton} type="submit"><Settings2 size={16} />Generate Barcode</button><button className={styles.secondaryButton} onClick={reset} type="button"><RotateCcw size={16} />Reset</button></div>
        </Card>

        <Card className={`${styles.panel} ${styles.previewPanel}`}><h2>Preview</h2><div className={styles.largeBarcode}><BarcodeVisual value={selectedItem.code} /></div></Card>
      </section>

      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>

      <Card className={styles.tableCard}>
        <h2>Recent Generated Barcodes</h2>
        <div className={styles.tableScroller}><table className={styles.table}><caption className="sr-only">Recently generated barcodes</caption><thead><tr><th scope="col">SL</th><th scope="col">Item Code</th><th scope="col">Item Name</th><th scope="col">Barcode</th><th scope="col">Date</th><th scope="col">Action</th></tr></thead><tbody>{records.slice(0, 8).map((record, index) => <tr key={record.id}><td>{index + 1}</td><td><strong>{record.code}</strong></td><td>{record.name}</td><td><BarcodeVisual compact value={record.code} /></td><td>{record.date}</td><td><button className={styles.rowPrint} onClick={() => print(record)} type="button"><Printer size={14} />Print</button></td></tr>)}</tbody></table></div>
      </Card>

      <section aria-label="Barcode print sheet" className={styles.printOnly}>{Array.from({ length: quantity }, (_, index) => printRecord ? <article className={styles.printLabel} key={index}><BarcodeVisual value={printRecord.code} /><strong>{printRecord.name}</strong><span>Wt: {printRecord.weight}</span></article> : null)}</section>
    </div>
  );
}

