"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResumeDataPayload } from "../api/receive-data/route";
import { useResumeStore } from "@/store/useResumeStore";

// Function to handle promises without warning
const ignoredPromise = (promise: Promise<unknown>): void => {
  promise.catch((error) => console.error("Ignored promise error:", error));
};

interface ErrorResponse {
  error: string;
}

interface ImportResponse {
  resumeData: ResumeDataPayload;
}

function ImportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get store actions
  const { updateHeaderData, updateSectionItems, addSection, setTemplate } =
    useResumeStore();

  useEffect(() => {
    async function fetchImportData() {
      try {
        setIsLoading(true);

        if (!token) {
          setError("No import token provided. Unable to import resume data.");
          setIsLoading(false);
          return;
        }

        // Fetch the resume data from the server
        const response = await fetch("/api/get-import-data?token=" + token);

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponse;
          throw new Error(errorData.error || "Failed to import resume data");
        }

        const data = (await response.json()) as ImportResponse;

        if (!data.resumeData) {
          throw new Error("No resume data found");
        }

        // Begin importing the data into our store
        const { resumeData } = data;

        // 1. Import personal info
        if (resumeData.personalInfo) {
          // Map to HeaderData format
          const headerData = {
            fullName: resumeData.personalInfo.fullName ?? "",
            title: resumeData.personalInfo.title ?? "",
            email: resumeData.personalInfo.email ?? "",
            phone: resumeData.personalInfo.phone ?? "",
            location: resumeData.personalInfo.location ?? "",
            website: resumeData.personalInfo.website ?? "",
            profileImage: resumeData.personalInfo.profileImage ?? "",
          };

          updateHeaderData(headerData);
        }

        // 2. Import work experience
        if (resumeData.workExperience && resumeData.workExperience.length > 0) {
          updateSectionItems("experience", resumeData.workExperience);
        }

        // 3. Import education
        if (resumeData.education && resumeData.education.length > 0) {
          updateSectionItems("education", resumeData.education);
        }

        // 4. Import skills
        if (resumeData.skills && resumeData.skills.length > 0) {
          updateSectionItems("skills", resumeData.skills);
        }

        // 5. Import custom sections
        if (resumeData.customSections) {
          Object.entries(resumeData.customSections).forEach(([id, section]) => {
            addSection(id, section.title);
            updateSectionItems(id, section.items);
          });
        }

        // 6. Set template if provided
        if (resumeData.template) {
          setTemplate(resumeData.template);
        }

        // Redirect to the main editor after successful import
        ignoredPromise(
          new Promise((resolve) => {
            setTimeout(() => {
              router.push("/");
              resolve(true);
            }, 1500);
          }),
        );
      } catch (error) {
        console.error("Error importing resume data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to import resume data",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      ignoredPromise(fetchImportData());
    }
  }, [
    token,
    router,
    updateHeaderData,
    updateSectionItems,
    addSection,
    setTemplate,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Importing Resume Data
          </h1>
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-center text-gray-600">
              Please wait while we import your resume data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Import Error
          </h1>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Resume Builder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Resume Data Imported!
        </h1>
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Your resume data has been successfully imported!
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Redirecting to the resume builder...
        </p>
      </div>
    </div>
  );
}

// Wrap the component in a Suspense boundary for useSearchParams
export default function ImportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Loading Import Page
            </h1>
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-center text-gray-600">
                Preparing to import resume data...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ImportContent />
    </Suspense>
  );
}
