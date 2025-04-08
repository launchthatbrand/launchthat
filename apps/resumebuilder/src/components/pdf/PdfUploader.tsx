"use client";

import React, { useRef, useState } from "react";

import { parsePdfBuffer } from "./PdfParser.server";

interface PdfUploaderProps {
  onPdfParsed: (text: string) => void;
  className?: string;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({
  onPdfParsed,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      // Convert array buffer to Buffer (Node.js Buffer is not available in browser)
      const buffer = new Uint8Array(arrayBuffer);

      // Call server action to parse PDF
      const text = await parsePdfBuffer(buffer as unknown as Buffer);
      onPdfParsed(text);
    } catch (err) {
      console.error("PDF parsing error:", err);
      setError("Failed to parse PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) void setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void setIsDragging(false);

    const files = e.dataTransfer.files;
    void handleFileChange(files);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      void fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        tabIndex={0}
        aria-label="Upload PDF file"
        role="button"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e.target.files)}
          aria-hidden="true"
        />

        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PDF files only
        </p>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/75 dark:bg-black/75">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
