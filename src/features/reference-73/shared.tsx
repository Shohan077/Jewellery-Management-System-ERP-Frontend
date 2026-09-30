"use client";

import { type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import baseStyles from "../reference-70/reference-70.module.css";
import styles from "./reference-73.module.css";

export const base = baseStyles;
export type Metric = { label: string; value: string; note: string; trend?: string; tone?: "success" | "danger" };

export function Intro({ actions, description, title }: { actions?: ReactNode; description: string; title: string }) {
  return <header className={base.pageIntro}><div><h1>{title}</h1><p>{description}</p></div>{actions ? <div className={base.pageActions}>{actions}</div> : null}</header>;
}

export function Button({ children, className = "", disabled = false, onClick, primary = false, type = "button" }: { children: ReactNode; className?: string; disabled?: boolean; onClick?: () => void; primary?: boolean; type?: "button" | "submit" }) {
  return <button className={`${primary ? base.primaryButton : base.secondaryButton} ${className}`} disabled={disabled} onClick={onClick} type={type}>{children}</button>;
}

export function Metrics({ rows }: { rows: readonly Metric[] }) {
  return <section className={base.metrics} style={{ "--metric-count": rows.length } as CSSProperties}>{rows.map((row) => <Card as="article" className={base.metricCard} key={row.label}><span>{row.label}</span><strong>{row.value}</strong><small>{row.trend ? <b className={row.tone === "danger" ? base.dangerText : undefined}>{row.trend}</b> : null}{row.trend ? " " : ""}{row.note}</small></Card>)}</section>;
}

export function Tabs<T extends string>({ active, onChange, tabs }: { active: T; onChange: (tab: T) => void; tabs: readonly T[] }) {
  return <nav className={base.tabs}>{tabs.map((tab) => <button aria-current={active === tab ? "page" : undefined} key={tab} onClick={() => onChange(tab)}>{tab}</button>)}</nav>;
}

export function SearchBox({ onChange, placeholder, value }: { onChange: (value: string) => void; placeholder: string; value: string }) {
  return <label className={base.searchField}><Search size={13}/><input aria-label={placeholder} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type="search" value={value}/></label>;
}

export function Pager({ current, last, onChange }: { current: number; last: number; onChange: (page: number) => void }) {
  const pages = last > 7 ? [1, 2, 3, 4, 5] : Array.from({ length: last }, (_, index) => index + 1);
  return <nav className={base.pagination}><button disabled={current === 1} onClick={() => onChange(current - 1)}><ChevronLeft size={12}/></button>{pages.map((page) => <button aria-current={current === page ? "page" : undefined} key={page} onClick={() => onChange(page)}>{page}</button>)}{last > 7 ? <><span>…</span><button onClick={() => onChange(last)}>{last}</button></> : null}<button disabled={current === last} onClick={() => onChange(current + 1)}><ChevronRight size={12}/></button></nav>;
}

export function Status({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" }) {
  return <span className={`${base.status} ${base[tone]}`}>{children}</span>;
}

export function Feedback({ text }: { text: string }) { return <p className={`${base.feedback} ${text ? base.feedbackVisible : ""}`}>{text}</p>; }

export function Modal({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  return <div className={base.backdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><Card className={base.modal}><header className={base.modalHeader}><div><h2>{title}</h2><p>{description}</p></div><button aria-label="Close" onClick={onClose}><X size={15}/></button></header>{children}</Card></div>;
}

export function Select({ children, label, onChange, value }: { children: ReactNode; label: string; onChange?: (value: string) => void; value?: string }) {
  return <select aria-label={label} className={styles.select} onChange={onChange ? (event) => onChange(event.target.value) : undefined} value={value}>{children}</select>;
}

export function Donut({ center, label, slices }: { center: string; label: string; slices: readonly { label: string; value: number; color: string; note?: string }[] }) {
  const stops = slices.map((slice, index) => { const start = slices.slice(0, index).reduce((sum, item) => sum + item.value, 0); return `${slice.color} ${start}% ${start + slice.value}%`; });
  return <div className={`${base.donutLayout} ${styles.compactDonut}`}><div className={base.donut} style={{ "--donut": `conic-gradient(${stops.join(",")})` } as CSSProperties}><span><strong>{center}</strong><small>{label}</small></span></div><ul>{slices.map((slice) => <li key={slice.label}><i style={{ background: slice.color }}/><span>{slice.label}</span><b>{slice.note ?? `${slice.value}%`}</b></li>)}</ul></div>;
}

export function exportCsv(name: string, headers: string[], rows: string[][]) {
  const csv = [headers, ...rows].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}
