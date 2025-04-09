"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";

import type { TemplateStyles } from "@/config/templates";

export interface HeaderDisplayProps {
  data: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    profileImage?: string;
  };
  templateStyles: TemplateStyles;
  onEdit: () => void;
  compactMode?: boolean;
}

export function HeaderDisplay({
  data,
  templateStyles,
  onEdit,
  compactMode = false,
}: HeaderDisplayProps) {
  return (
    <div
      className="cursor-text space-y-4 print:cursor-default"
      onClick={onEdit}
    >
      <h1
        className={`${compactMode ? "text-xl" : "text-2xl"} font-bold ${templateStyles.headerName}`}
      >
        {data.fullName || "Your Name"}
      </h1>
      <h2
        className={`${compactMode ? "text-base" : "text-lg"} ${templateStyles.headerTitle}`}
      >
        {data.title || "Professional Title"}
      </h2>
      <div
        className={`${compactMode ? "space-y-2" : "grid grid-cols-1 gap-2 text-sm md:grid-cols-2"}`}
      >
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail size={compactMode ? 14 : 16} className="text-gray-400" />
            <span className={compactMode ? "text-sm" : ""}>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone size={compactMode ? 14 : 16} className="text-gray-400" />
            <span className={compactMode ? "text-sm" : ""}>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2">
            <MapPin size={compactMode ? 14 : 16} className="text-gray-400" />
            <span className={compactMode ? "text-sm" : ""}>
              {data.location}
            </span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-2">
            <Globe size={compactMode ? 14 : 16} className="text-gray-400" />
            <span className={compactMode ? "text-sm" : ""}>{data.website}</span>
          </div>
        )}
      </div>
    </div>
  );
}
