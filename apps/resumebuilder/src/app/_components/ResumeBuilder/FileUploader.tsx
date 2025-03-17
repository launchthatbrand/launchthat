"use client";

import { useState } from "react";
import { parseResumeFile } from "@/lib/documentParser";
import { fileUploadSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/resumeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@acme/ui/components/alert";
import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/dialog";

type FileUploadForm = z.infer<typeof fileUploadSchema>;

export function FileUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setResumeData = useResumeStore((state) => state.setResumeData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FileUploadForm>({
    resolver: zodResolver(fileUploadSchema),
  });

  const file = watch("file");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setValue("file", acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async (data: FileUploadForm) => {
    setIsUploading(true);
    setError(null);

    try {
      const parsedData = await parseResumeFile(data.file);
      setResumeData({
        ...parsedData,
      } as any); // Using any here because parseResumeFile returns Partial<ResumeData>
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse resume file",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Existing Resume</DialogTitle>
          <DialogDescription>
            Upload a PDF or Word document to import your existing resume.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center ${
              isDragActive ? "border-primary" : "border-muted"
            }`}
          >
            <input {...getInputProps()} {...register("file")} />
            {file ? (
              <div className="text-sm">
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">
                  Drag & drop a file here, or click to select a file
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            )}
          </div>

          {errors.file && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{errors.file.message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Import Resume"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
