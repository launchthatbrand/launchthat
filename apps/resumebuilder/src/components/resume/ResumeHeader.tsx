"use client";

import { HeaderDisplay } from "./header/HeaderDisplay";
import { HeaderEditForm } from "./header/HeaderEditForm";
import { ProfileImage } from "./header/ProfileImage";
import type { TemplateStyles } from "@/config/templates";
import { useState } from "react";

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
  compactMode?: boolean;
}

export const ResumeHeader = ({
  data,
  onChange,
  templateStyles,
  compactMode = false,
}: ResumeHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    key: keyof ResumeHeaderProps["data"],
    value: string,
  ) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const removeProfileImage = () => {
    handleChange("profileImage", "");
  };

  return (
    <div
      className={`${compactMode ? "mb-4" : "mb-6"} ${templateStyles.header}`}
    >
      <div
        className={`flex ${compactMode ? "flex-col" : "flex-col-reverse md:flex-row"} items-center gap-4 md:items-start`}
      >
        {/* Text Content */}
        <div className="flex-1">
          {isEditing ? (
            <HeaderEditForm
              data={data}
              handleChange={handleChange}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <HeaderDisplay
              data={data}
              templateStyles={templateStyles}
              onEdit={() => setIsEditing(true)}
              compactMode={compactMode}
            />
          )}
        </div>

        {/* Profile Image */}
        {(!compactMode || data.profileImage) && (
          <ProfileImage
            profileImage={data.profileImage}
            fullName={data.fullName}
            onImageChange={(newImageUrl: string) =>
              handleChange("profileImage", newImageUrl)
            }
            onRemoveImage={removeProfileImage}
            compactMode={compactMode}
          />
        )}
      </div>
    </div>
  );
};
