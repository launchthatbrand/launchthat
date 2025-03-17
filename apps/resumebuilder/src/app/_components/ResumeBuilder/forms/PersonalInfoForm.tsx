"use client";

import { personalInfoSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/resumeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Textarea } from "@acme/ui/components/textarea";

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((state) => state.data.personalInfo);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: personalInfo.firstName || "",
      lastName: personalInfo.lastName || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      address: personalInfo.address || "",
      title: personalInfo.title || "",
      summary: personalInfo.summary || "",
    },
  });

  const onSubmit = (values: PersonalInfoFormValues) => {
    updatePersonalInfo(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Title</FormLabel>
              <FormControl>
                <Input placeholder="Frontend Developer" {...field} />
              </FormControl>
              <FormDescription>
                Your current professional title or role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="City, State, Country" {...field} />
              </FormControl>
              <FormDescription>
                You can provide a full address or just city/state/country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief professional summary about yourself..."
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief summary of your skills, experience, and career goals
                (recommended: 3-5 sentences)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Personal Information</Button>
      </form>
    </Form>
  );
}
