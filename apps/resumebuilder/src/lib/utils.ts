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

export function downloadAsPdf(elementId: string, filename: string): void {
  // Check if we're in debug mode
  const debugMode = document.documentElement.classList.contains("debug-mode");

  if (debugMode) {
    console.group("[PDF Export]");
    console.log(`Starting export for element: #${elementId}`);
    console.time("PDF Export Duration");
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // Get template information from element's data attributes
  const templateName = element.getAttribute("data-template");
  const layoutType = element.getAttribute("data-layout");

  if (debugMode) {
    console.log("Template:", templateName);
    console.log("Layout:", layoutType);

    // Log computed styles before printing
    const beforeStyles = window.getComputedStyle(element);
    console.log("Before print styles:", {
      width: beforeStyles.width,
      height: beforeStyles.height,
      background: beforeStyles.backgroundColor,
      color: beforeStyles.color,
      cssVariables: {
        primaryColor: beforeStyles.getPropertyValue("--template-primary-color"),
        secondaryColor: beforeStyles.getPropertyValue(
          "--template-secondary-color",
        ),
        accentColor: beforeStyles.getPropertyValue("--template-accent-color"),
        textColor: beforeStyles.getPropertyValue("--template-text-color"),
        backgroundColor: beforeStyles.getPropertyValue(
          "--template-background-color",
        ),
      },
    });
  }

  // Save current styles and document state
  const _originalStyles = {
    margin: document.body.style.margin,
    padding: document.body.style.padding,
    overflow: document.body.style.overflow,
  };

  // Mark the document as being in print mode - helps with debugging
  document.documentElement.classList.add("printing");

  // Add resume-content class to the element for CSS targeting
  element.classList.add("resume-content");

  // Add print-specific styles
  const style = document.createElement("style");
  style.id = "print-style-override";
  style.textContent = `
    @media print {
      /* Hide everything initially */
      body * {
        visibility: hidden;
      }
      
      /* Show only the resume content */
      #${elementId}, #${elementId} * {
        visibility: visible;
      }
      
      /* Position content perfectly on the page */
      #${elementId} {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        /* Force colors to print */
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Hide buttons and interactive elements */
      #${elementId} button,
      #${elementId} [role="button"],
      #${elementId} .interactive-only {
        display: none !important;
      }
      
      /* Page size and margins */
      @page {
        size: letter portrait;
        margin: 0mm;
      }
      
      /* Preserve all CSS custom properties */
      :root {
        --template-primary-color: var(--resume-primary-color);
        --template-secondary-color: var(--resume-secondary-color);
        --template-accent-color: var(--resume-accent-color);
        --template-text-color: var(--resume-text-color);
        --template-background-color: var(--resume-background-color);
      }
      
      /* Apply template-specific overrides */
      html[data-resume-template="${templateName}"] #${elementId} {
        /* Template-specific print adjustments here */
      }
      
      /* Ensure sections don't break across pages */
      #${elementId} .section {
        page-break-inside: avoid;
      }
      
      /* Debug outline - add visual borders in debug mode */
      ${
        debugMode
          ? `
      .debug-print-outline {
        outline: 1px dashed red !important;
      }
      `
          : ""
      }
    }
  `;
  document.head.appendChild(style);

  // Set filename in document title (some browsers use this for the PDF filename)
  const originalTitle = document.title;
  document.title = filename || "resume";

  if (debugMode) {
    console.log("Print style sheet added");
    console.log("Starting print dialog...");
  }

  // Use the browser's print functionality
  window.print();

  if (debugMode) {
    console.log("Print dialog closed");
  }

  // Cleanup
  document.head.removeChild(style);
  document.title = originalTitle;
  document.documentElement.classList.remove("printing");
  element.classList.remove("resume-content");

  if (debugMode) {
    // Log computed styles after printing to check for differences
    const afterStyles = window.getComputedStyle(element);
    console.log("After print styles:", {
      width: afterStyles.width,
      height: afterStyles.height,
      background: afterStyles.backgroundColor,
      color: afterStyles.color,
      cssVariables: {
        primaryColor: afterStyles.getPropertyValue("--template-primary-color"),
        secondaryColor: afterStyles.getPropertyValue(
          "--template-secondary-color",
        ),
        accentColor: afterStyles.getPropertyValue("--template-accent-color"),
        textColor: afterStyles.getPropertyValue("--template-text-color"),
        backgroundColor: afterStyles.getPropertyValue(
          "--template-background-color",
        ),
      },
    });

    console.timeEnd("PDF Export Duration");
    console.groupEnd();
  }
}
