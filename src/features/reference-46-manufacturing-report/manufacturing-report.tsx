"use client";

import { AlertTriangle, CheckCircle2, Clock3, Download, Factory } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import base from "@/features/reference-43-operations/operations.module.css";
import styles from "./manufacturing-report.module.css";

function Stat({ icon, label, value, meta }: { icon: ReactNode; label: string; value: string; meta: string }) {
  return <Card className={base.stat}><span className={base.statIcon}>{icon}</span><div><p>{label}</p><h2>{value}</h2><small>{meta}</small></div></Card>;
}

export function ManufacturingReport184() {
  const [from, setFrom] = useState("2024-05-01");
  const [to, setTo] = useState("2024-05-31");
  const [message, setMessage] = useState("");
  const products = [["Gold Necklace", "320", "25.48%"], ["Gold Bangles", "280", "22.29%"], ["Diamond Ring", "240", "19.11%"], ["Gold Earrings", "200", "15.92%"], ["Platinum Chain", "216", "17.20%"]];
  const karigars = [["Ramesh Sharma", "210", "16.72%"], ["Mahesh Kumar", "190", "15.11%"], ["Suresh Patel", "180", "14.31%"], ["Vijay Tiwari", "170", "13.51%"], ["Gopal Mehta", "165", "13.11%"]];
  return <div className={base.page}><PageHeader action={<div className={styles.headerActions}><input aria-label="From date" className="field" onChange={(event) => setFrom(event.target.value)} type="date" value={from} /><input aria-label="To date" className="field" onChange={(event) => setTo(event.target.value)} type="date" value={to} /><button className={`button ${base.primary}`} onClick={() => setMessage(`Manufacturing report for ${from} to ${to} exported.`)} type="button"><Download size={14} />Export Report</button></div>} description="Home  ›  Manufacturing Report" title="Reports & Analytics" />{message ? <p className={base.notice}>{message}</p> : null}<section className={base.stats}><Stat icon={<Factory size={20} />} label="Total Production" value="1,256" meta="↑ 13.8% from last month" /><Stat icon={<AlertTriangle size={20} />} label="Total Rejection" value="78" meta="↑ 8.9% from last month" /><Stat icon={<CheckCircle2 size={20} />} label="Yield Rate" value="93.80%" meta="↑ 4.2% from last month" /><Stat icon={<Clock3 size={20} />} label="Avg Production Time" value="5.6 Hrs" meta="↓ 3.1% from last month" /></section><section className={base.charts}><Card className={base.chartCard}><h2>Production vs Rejection Trend</h2><div className={styles.trendLegend}><span>Production (Nos)</span><span>Rejection (Nos)</span></div><div className={base.lineChart}><svg aria-label="Production versus rejection trend" role="img" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" points="2,62 12,47 22,30 33,55 44,42 55,23 67,48 77,63 88,28 98,58" stroke="#1976d2" strokeWidth="2" /><polyline fill="none" points="2,86 12,76 22,65 33,82 44,75 55,61 67,80 77,88 88,63 98,84" stroke="#ea4d32" strokeWidth="2" /></svg><div className={base.axis}><span>May 01</span><span>May 06</span><span>May 11</span><span>May 16</span><span>May 21</span><span>May 26</span><span>May 31</span></div></div></Card><Card className={base.chartCard}><h2>Rejection Reasons</h2><div className={base.donutLayout}><div className={styles.donut} /><div className={base.legend}>{[["Stone Loose", "28 (35.9%)"], ["Polish Issue", "20 (25.6%)"], ["Measurement Error", "16 (20.5%)"], ["Casting Defect", "14 (17.9%)"]].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></div></Card></section><section className={base.charts}><Card className={base.panel}><h2>Top Products by Production</h2><table><thead><tr><th>Product Name</th><th>Production (Nos)</th><th>% Share</th></tr></thead><tbody>{products.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card><Card className={base.panel}><h2>Production by Karigar</h2><table><thead><tr><th>Karigar Name</th><th>Production (Nos)</th><th>% Share</th></tr></thead><tbody>{karigars.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Card></section></div>;
}
