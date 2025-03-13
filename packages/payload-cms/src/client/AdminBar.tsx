"use client";

import React from "react";

interface AdminBarProps {
  adminBarProps?: {
    preview?: boolean;
  };
}

export const AdminBar: React.FC<AdminBarProps> = ({ adminBarProps }) => {
  if (!adminBarProps?.preview) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-black px-4 py-2 text-center text-white">
      Preview Mode
    </div>
  );
};
