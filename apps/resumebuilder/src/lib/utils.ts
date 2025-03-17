import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | undefined): string {
  if (!date) return "";

  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (_) {
    return date;
  }
}

export function downloadAsPdf(elementId: string, filename: string): void {
  // This is a placeholder for PDF generation functionality
  // In a real application, you would use a library like html2pdf.js or jsPDF
  // or make a server request to generate a PDF

  console.log(
    `Downloading element ${elementId} as PDF with filename ${filename}`,
  );
  alert("PDF download functionality will be implemented in a future update.");

  // Example implementation with html2pdf would be something like:
  /*
  import html2pdf from 'html2pdf.js';
  
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const opt = {
    margin: 1,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
  */
}
