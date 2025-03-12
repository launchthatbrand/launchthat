import type { BadgeProps } from "../badge";
import { Badge } from "../badge";

import React from "react";

// Make sure the StatusVariant matches the available variants in the Badge component
export type StatusVariant = "default" | "secondary" | "destructive" | "outline";

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: string;
  statusMap?: Record<string, StatusVariant>;
  lowercase?: boolean;
}

/**
 * Default mapping for common status values
 */
const defaultStatusMap: Record<string, StatusVariant> = {
  // Common success statuses
  completed: "default",
  complete: "default",
  success: "default",
  active: "default",
  approved: "default",

  // Processing statuses
  processing: "secondary",
  pending: "secondary",
  inprogress: "secondary",
  "in-progress": "secondary",

  // Warning statuses
  "on-hold": "outline",
  onhold: "outline",
  waiting: "outline",

  // Error statuses
  cancelled: "destructive",
  canceled: "destructive",
  failed: "destructive",
  error: "destructive",
  rejected: "destructive",
};

/**
 * A flexible status badge component that maps status strings to visual variants
 */
export function StatusBadge({
  status,
  statusMap = defaultStatusMap,
  lowercase = true,
  className,
  ...props
}: StatusBadgeProps) {
  // Normalize status for mapping
  const normalizedStatus = lowercase
    ? status.toLowerCase().replace(/\s+/g, "")
    : status.replace(/\s+/g, "");

  // Get variant from map or default to outline
  const variant = statusMap[normalizedStatus] ?? "outline";

  return (
    <Badge variant={variant} className={className} {...props}>
      {status}
    </Badge>
  );
}
