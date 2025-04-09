"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";

export interface HeaderEditFormProps {
  data: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    profileImage?: string;
  };
  handleChange: (key: keyof HeaderEditFormProps["data"], value: string) => void;
  onSave: () => void;
}

export function HeaderEditForm({
  data,
  handleChange,
  onSave,
}: HeaderEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Full Name"
          className="w-full border-b border-gray-300 bg-transparent px-1 text-2xl font-bold outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Professional Title"
          className="w-full border-b border-gray-300 bg-transparent px-1 text-lg text-gray-600 outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="flex-1 border-b border-gray-300 bg-transparent px-1 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-400" />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
            className="flex-1 border-b border-gray-300 bg-transparent px-1 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Location"
            className="flex-1 border-b border-gray-300 bg-transparent px-1 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-400" />
          <input
            type="url"
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Website"
            className="flex-1 border-b border-gray-300 bg-transparent px-1 outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <button
        onClick={onSave}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 print:hidden"
      >
        Save
      </button>
    </div>
  );
}
