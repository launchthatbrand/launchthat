"use client";

import { Plus } from "lucide-react";

import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

export function SkillsForm() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add your technical and professional skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the Skills form. The complete
            implementation would include:
          </p>
          <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
            <li>Adding multiple skills with rating levels</li>
            <li>Categorizing skills by type</li>
            <li>Reordering skills with drag and drop</li>
            <li>Form validation for required fields</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
