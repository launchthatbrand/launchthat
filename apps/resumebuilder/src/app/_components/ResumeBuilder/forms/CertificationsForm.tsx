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

export function CertificationsForm() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Add your professional certifications and licenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the Certifications form. The complete
            implementation would include:
          </p>
          <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
            <li>Adding multiple certifications</li>
            <li>
              Including certification details like issue date and issuing
              authority
            </li>
            <li>Adding certification URLs for verification</li>
            <li>Form validation for required fields</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
