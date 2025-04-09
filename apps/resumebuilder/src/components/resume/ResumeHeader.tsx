"use client";

import { Camera, Globe, Mail, MapPin, Phone, X } from "lucide-react";
import { useRef, useState } from "react";

import Image from "next/image";
import type { TemplateStyles } from "@/config/templates";

interface ResumeHeaderProps {
  data: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    profileImage?: string;
  };
  onChange: (data: ResumeHeaderProps["data"]) => void;
  templateStyles: TemplateStyles;
}

export const ResumeHeader = ({
  data,
  onChange,
  templateStyles,
}: ResumeHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    key: keyof ResumeHeaderProps["data"],
    value: string,
  ) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        handleChange("profileImage", event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    handleChange("profileImage", "");
  };

  return (
    <div className={`mb-6 ${templateStyles.header}`}>
      <div className="flex flex-col-reverse items-center gap-4 md:flex-row md:items-start">
        {/* Text Content */}
        <div className="flex-1">
          {isEditing ? (
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
                onClick={() => setIsEditing(false)}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 print:hidden"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              className="cursor-text space-y-4 print:cursor-default"
              onClick={() => setIsEditing(true)}
            >
              <h1 className={`text-2xl font-bold ${templateStyles.headerName}`}>
                {data.fullName || "Your Name"}
              </h1>
              <h2 className={`text-lg ${templateStyles.headerTitle}`}>
                {data.title || "Professional Title"}
              </h2>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                {data.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{data.location}</span>
                  </div>
                )}
                {data.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <span>{data.website}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="relative h-24 w-24 flex-shrink-0 md:h-32 md:w-32">
          {data.profileImage ? (
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gray-200">
              <Image
                src={data.profileImage}
                alt={`${data.fullName || "User"}'s profile`}
                fill
                className="object-cover"
              />
              <button
                onClick={removeProfileImage}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white print:hidden"
                aria-label="Remove profile image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="flex h-full w-full cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 print:hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={24} className="text-gray-400" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
