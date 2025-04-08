"use client";

import React, { useState } from "react";
import PdfUploader from "@/components/pdf/PdfUploader";

export default function PdfTestPage() {
  const [parsedText, setParsedText] = useState<string>("");

  const handlePdfParsed = (text: string) => {
    setParsedText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">PDF Upload and Parse Test</h1>

      <div className="mb-8">
        <PdfUploader
          onPdfParsed={handlePdfParsed}
          className="mx-auto max-w-md"
        />
      </div>

      {parsedText && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Parsed Content:</h2>
          <div className="max-h-96 overflow-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <pre className="whitespace-pre-wrap text-sm">{parsedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
