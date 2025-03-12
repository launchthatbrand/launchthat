import type { Customer } from "./types";

/**
 * Get the variant for displaying order status badges
 */
export const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "on-hold":
      return "outline";
    case "cancelled":
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Get customer full name
 */
export const getCustomerName = (customer: Customer) => {
  return `${customer.firstName} ${customer.lastName}`;
};
