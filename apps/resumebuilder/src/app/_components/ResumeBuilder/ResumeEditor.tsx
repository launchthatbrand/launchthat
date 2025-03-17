"use client";

import type { ResumeSection } from "@/store/resumeStore";
import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";

import { Card, CardContent } from "@acme/ui/components/card";
import { Separator } from "@acme/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";

import { CertificationsForm } from "./forms/CertificationsForm";
import { EducationForm } from "./forms/EducationForm";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { SkillsForm } from "./forms/SkillsForm";
import { SocialLinksForm } from "./forms/SocialLinksForm";
import { WorkExperienceForm } from "./forms/WorkExperienceForm";

export function ResumeEditor() {
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);

  const sections: {
    id: ResumeSection;
    label: string;
    component: React.ReactNode;
  }[] = [
    {
      id: "personalInfo",
      label: "Personal Info",
      component: <PersonalInfoForm />,
    },
    {
      id: "workExperience",
      label: "Work Experience",
      component: <WorkExperienceForm />,
    },
    {
      id: "education",
      label: "Education",
      component: <EducationForm />,
    },
    {
      id: "skills",
      label: "Skills",
      component: <SkillsForm />,
    },
    {
      id: "certifications",
      label: "Certifications",
      component: <CertificationsForm />,
    },
    {
      id: "socialLinks",
      label: "Social Links",
      component: <SocialLinksForm />,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs
          value={activeSection}
          onValueChange={(value) => setActiveSection(value as ResumeSection)}
          className="w-full"
        >
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Separator className="my-4" />
          {sections.map((section) => (
            <TabsContent
              key={section.id}
              value={section.id}
              className="mt-4 space-y-4"
            >
              {section.component}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
