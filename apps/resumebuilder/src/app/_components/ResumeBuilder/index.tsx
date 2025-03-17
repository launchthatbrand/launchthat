"use client";

import { useState } from "react";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";

// import { FileUploader } from "./FileUploader";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Resume Builder</h2>
              <div className="flex items-center space-x-2">
                {/* <FileUploader /> */}
                <Button variant="outline">Download PDF</Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Build your professional resume in minutes. Choose a template,
              customize your content, and download your resume.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <TemplateSelector />
        </div>

        <div className="md:col-span-3">
          <Tabs
            defaultValue="editor"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "editor" | "preview");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Edit Resume</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="mt-4">
              <ResumeEditor />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <ResumePreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
