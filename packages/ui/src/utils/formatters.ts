/**
 * Formats a date string to a localized format.
 *
 * @param dateString - The date string to format
 * @param locale - The locale to use for formatting (defaults to user's locale)
 * @param options - DateTimeFormat options
 * @returns Formatted date string or "N/A" if the input is invalid
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  locale?: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  if (!dateString) return "N/A";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return new Intl.DateTimeFormat(locale ?? undefined, options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}

/**
 * Formats a currency value
 *
 * @param value - The currency value to format
 * @param currency - The currency code (e.g., "USD", "EUR")
 * @param locale - The locale to use for formatting (defaults to user's locale)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | undefined,
  currency = "USD",
  locale?: string,
): string {
  if (value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "";

  try {
    return new Intl.NumberFormat(locale ?? undefined, {
      style: "currency",
      currency,
    }).format(numValue);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return String(value);
  }
}

/**
 * Gets a full name from first and last name properties
 *
 * @param user - Object containing first/last name properties
 * @param firstNameKey - Key for first name (default: "firstName")
 * @param lastNameKey - Key for last name (default: "lastName")
 * @returns Full name string
 */
export function getFullName<T extends Record<string, string | undefined>>(
  user: T | null | undefined,
  firstNameKey = "firstName",
  lastNameKey = "lastName",
): string {
  if (!user) return "";

  const firstName = user[firstNameKey] ?? "";
  const lastName = user[lastNameKey] ?? "";

  return [firstName, lastName].filter(Boolean).join(" ") || "";
}

/**
 * Truncates a string to a maximum length and adds an ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength = 50): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
