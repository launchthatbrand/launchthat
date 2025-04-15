"use client";

import type { TemplateStyles } from "@/config/templates";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { EditableField } from "./EditableField";
import { ProfileImage } from "./header/ProfileImage";

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
  const handleChange = (
    key: keyof ResumeHeaderProps["data"],
    value: string,
  ) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const contactStyle = templateStyles.headerContact ?? "text-sm text-gray-600";

  // Get the custom class for the text container, provide a fallback
  const textContainerClass =
    templateStyles.customClasses?.headerTextContainer ?? "flex-1";

  return (
    <div
      className={`${compactMode ? "mb-4" : "mb-6"} ${templateStyles.header}`}
    >
      <div
        className={`flex ${compactMode ? "flex-col" : "flex-col-reverse md:flex-row"} items-center gap-4 md:items-start`}
      >
        <div className={textContainerClass}>
          <EditableField
            value={data.fullName}
            onChange={(newValue: string) => handleChange("fullName", newValue)}
            className={templateStyles.headerName}
          />
          <EditableField
            value={data.title}
            onChange={(newValue: string) => handleChange("title", newValue)}
            className={templateStyles.headerTitle}
          />
          <div
            className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 ${contactStyle}`}
          >
            {data.phone && (
              <div
                className={
                  templateStyles.customClasses?.contactItem ??
                  "flex items-center"
                }
              >
                <Phone
                  size={14}
                  className={
                    templateStyles.customClasses?.contactIcon ?? "mr-1.5"
                  }
                />
                <EditableField
                  value={data.phone}
                  onChange={(newValue: string) =>
                    handleChange("phone", newValue)
                  }
                  className={contactStyle}
                />
              </div>
            )}
            {data.email && (
              <div
                className={
                  templateStyles.customClasses?.contactItem ??
                  "flex items-center"
                }
              >
                <Mail
                  size={14}
                  className={
                    templateStyles.customClasses?.contactIcon ?? "mr-1.5"
                  }
                />
                <EditableField
                  value={data.email}
                  onChange={(newValue: string) =>
                    handleChange("email", newValue)
                  }
                  className={contactStyle}
                />
              </div>
            )}
            {data.location && (
              <div
                className={
                  templateStyles.customClasses?.contactItem ??
                  "flex items-center"
                }
              >
                <MapPin
                  size={14}
                  className={
                    templateStyles.customClasses?.contactIcon ?? "mr-1.5"
                  }
                />
                <EditableField
                  value={data.location}
                  onChange={(newValue: string) =>
                    handleChange("location", newValue)
                  }
                  className={contactStyle}
                />
              </div>
            )}
            {data.website && (
              <div
                className={
                  templateStyles.customClasses?.contactItem ??
                  "flex items-center"
                }
              >
                <Globe
                  size={14}
                  className={
                    templateStyles.customClasses?.contactIcon ?? "mr-1.5"
                  }
                />
                <EditableField
                  value={data.website}
                  onChange={(newValue: string) =>
                    handleChange("website", newValue)
                  }
                  className={contactStyle}
                />
              </div>
            )}
          </div>
        </div>

        {/* Conditionally render Profile Image: 
            - Not in compact mode OR if image exists
            - AND the template layout is NOT 'split' 
        */}
        {(!compactMode || data.profileImage) &&
          templateStyles.layout !== "split" && (
            <ProfileImage
              profileImage={data.profileImage}
              fullName={data.fullName}
              // Apply custom class if defined in template, otherwise defaults handled in ProfileImage
              className={templateStyles.customClasses?.profileImage}
              onImageChange={(newImageUrl: string) =>
                handleChange("profileImage", newImageUrl)
              }
              onRemoveImage={() => handleChange("profileImage", "")}
              compactMode={compactMode}
            />
          )}
      </div>
    </div>
  );
};
