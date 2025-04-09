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
  } catch {
    return date;
  }
}

export function downloadAsPdf(elementId: string, _filename: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  window.print();
}
