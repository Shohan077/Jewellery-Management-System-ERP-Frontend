import { Gem } from "lucide-react";

import styles from "./barcode-invoice.module.css";

function barcodeSegments(value: string) {
  const source = value || "000000";
  return Array.from({ length: Math.max(38, source.length * 6) }, (_, index) => {
    const character = source.charCodeAt(index % source.length);
    return { ink: index % 2 === 0, width: 1 + ((character + index * 7) % 4) };
  });
}

export function BarcodeVisual({ compact = false, value }: { compact?: boolean; value: string }) {
  return (
    <figure aria-label={`Barcode ${value}`} className={`${styles.barcodeVisual} ${compact ? styles.compactBarcode : ""}`} role="img">
      <span aria-hidden="true" className={styles.barcodeBars}>
        {barcodeSegments(value).map((segment, index) => (
          <i className={segment.ink ? styles.blackBar : styles.whiteBar} key={`${value}-${index}`} style={{ width: segment.width }} />
        ))}
      </span>
      <figcaption>{value}</figcaption>
    </figure>
  );
}

export function JewelleryMark({ small = false }: { small?: boolean }) {
  return <span aria-hidden="true" className={`${styles.jewelleryMark} ${small ? styles.smallMark : ""}`}><Gem size={small ? 18 : 29} /></span>;
}

