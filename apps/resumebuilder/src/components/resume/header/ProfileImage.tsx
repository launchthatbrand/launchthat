"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

export interface ProfileImageProps {
  profileImage?: string;
  fullName: string;
  onImageChange: (imageUrl: string) => void;
  onRemoveImage: () => void;
  compactMode?: boolean;
}

export function ProfileImage({
  profileImage,
  fullName,
  onImageChange,
  onRemoveImage,
  compactMode = false,
}: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        onImageChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const sizeClasses = compactMode
    ? "h-20 w-20 md:h-24 md:w-24"
    : "h-24 w-24 md:h-32 md:w-32";

  return (
    <div className={`relative ${sizeClasses} flex-shrink-0`}>
      {profileImage ? (
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gray-200">
          <Image
            src={profileImage}
            alt={`${fullName || "User"}'s profile`}
            fill
            className="object-cover"
          />
          <button
            onClick={onRemoveImage}
            className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white print:hidden"
            aria-label="Remove profile image"
          >
            <X size={compactMode ? 12 : 16} />
          </button>
        </div>
      ) : (
        <div
          className="flex h-full w-full cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 print:hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={compactMode ? 20 : 24} className="text-gray-400" />
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
  );
}
