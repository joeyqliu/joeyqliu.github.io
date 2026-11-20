"use client";

import { PrinterIcon } from "@phosphor-icons/react";

export default function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <PrinterIcon weight="duotone" aria-hidden="true" />
      print / save pdf
    </button>
  );
}
