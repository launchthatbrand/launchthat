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

export function SocialLinksForm() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Social & Online Presence</CardTitle>
          <CardDescription>
            Add links to your social media profiles and online portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the Social Links form. The complete
            implementation would include:
          </p>
          <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
            <li>Adding multiple social media links</li>
            <li>Support for LinkedIn, GitHub, personal websites, etc.</li>
            <li>Automatically formatting links based on platform</li>
            <li>URL validation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
