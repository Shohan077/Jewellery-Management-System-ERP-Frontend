import type { SVGProps } from "react";

type BrandMarkProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function BrandMark({ size = 34, ...props }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 64 56"
      width={size}
      {...props}
    >
      <path
        d="M10 16 19 5h26l9 11-22 34L10 16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="m10 16 15-1L19 5m35 11-15-1 6-10M25 15l7-10 7 10-7 35M10 16h44M25 15l7 35 7-35"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <BrandMark size={compact ? 33 : 39} />
      {!compact && (
        <div>
          <strong>Jewellery ERP</strong>
          <span>Smart Jewellery Management</span>
        </div>
      )}
    </div>
  );
}
