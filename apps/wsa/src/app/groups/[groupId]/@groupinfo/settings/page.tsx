"use client";

import Link from "next/link";

import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

export default function TestContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings Content</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the content for Settings tab</p>
        <Link href="/groups/YnBHcm91cDox/settings/general">General</Link>
      </CardContent>
    </Card>
  );
}
