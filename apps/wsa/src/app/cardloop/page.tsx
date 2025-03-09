"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Crown, Flame, Star } from "lucide-react";

import type { ThemeVariant } from "@acme/ui/themes/types";
import { Button } from "@acme/ui/components/button";
import { ThemeToggle } from "@acme/ui/components/theme";
import { CardLoop } from "@acme/ui/general/CardLoop";
import { GeneralCard } from "@acme/ui/general/GeneralCard";

import type { Course, CoursesData } from "../courses/page";
import { GET_COURSES } from "../courses/queries";
import { fetchWordPress } from "../utils/api";

type CardLayout = "stacked" | "inline" | "overlay";

const themes: ThemeVariant[] = ["glass", "brutalist"];
const layouts = ["stacked", "inline", "overlay"] as const;

const getRandomTheme = () => {
  return themes[Math.floor(Math.random() * themes.length)];
};

const getRandomLayout = () => {
  return layouts[Math.floor(Math.random() * layouts.length)];
};

const getBadgeForCourse = (index: number) => {
  const badges = [
    {
      text: "Popular",
      icon: <Flame className="h-4 w-4" />,
      variant: "default" as const,
      color: {
        background: "#ef4444",
        text: "#ffffff",
      },
    },
    {
      text: "Featured",
      icon: <Star className="h-4 w-4" />,
      variant: "secondary" as const,
      color: {
        background: "#f59e0b",
        text: "#ffffff",
      },
    },
    {
      text: "Premium",
      icon: <Crown className="h-4 w-4" />,
      variant: "outline" as const,
      color: {
        background: "#6366f1",
        text: "#ffffff",
        border: "#818cf8",
      },
    },
  ];

  return badges[index % badges.length];
};

function CardLoopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layout =
    (searchParams.get("layout") as (typeof layouts)[number]) ?? "stacked";

  const { data: coursesData, error } = useQuery<CoursesData>({
    queryKey: ["courses"],
    queryFn: () => fetchWordPress(GET_COURSES),
  });

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "Failed to fetch courses"}
        </div>
      </div>
    );
  }

  if (!coursesData) {
    return (
      <div className="container py-8">
        <div className="text-center text-yellow-500">
          No course data available
        </div>
      </div>
    );
  }

  const publishedCourses = coursesData.published?.nodes ?? [];
  const draftCourses = coursesData.drafts?.nodes ?? [];
  const allCourses: Course[] = [
    ...(Array.isArray(publishedCourses) ? publishedCourses : []),
    ...(Array.isArray(draftCourses) ? draftCourses : []),
  ];

  return (
    <div className="container space-y-8 py-8">
      <div className="text-center">
        <h1 className="font-display mb-2 text-3xl font-bold">Course Layouts</h1>
        <p className="font-body text-muted-foreground">
          Showcasing different card layouts and themes
        </p>
      </div>

      {/* Theme Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <ThemeToggle />
        </div>

        {/* Layout Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {layouts.map((l) => (
            <Button
              key={l}
              variant={layout === l ? "default" : "outline"}
              onClick={() => updateParams("layout", l)}
              className="font-body capitalize"
            >
              {l}
            </Button>
          ))}
        </div>
      </div>

      <CardLoop
        items={allCourses}
        renderItem={(course: Course, index: number) => (
          <GeneralCard
            key={course.id}
            title={course.title}
            subtitle={`${layout} layout with ${getRandomTheme()} theme`}
            content={
              <p className="font-body text-sm text-white/60">
                This is a sample course description that shows different layouts
                and themes. Each card is randomly styled to showcase the
                possibilities.
              </p>
            }
            hoverContent={
              layout === "overlay" ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <p className="font-body text-sm text-white">
                    Click to learn more about this course
                  </p>
                  <Button
                    variant="outline"
                    className="font-body border-white text-white hover:bg-white/20"
                  >
                    View Course
                  </Button>
                </div>
              ) : undefined
            }
            image={{
              src:
                course.featuredImage?.node.sourceUrl ??
                "https://picsum.photos/800/400",
              alt: course.title,
            }}
            layout={layout}
            navigation={{
              path: `/courses/${course.id}`,
              type: layout === "overlay" ? "card" : "button",
              buttonText: "Learn More",
            }}
            badge={getBadgeForCourse(index)}
          />
        )}
        gridCols={{
          default: 1,
          sm: 2,
          lg: 3,
        }}
        gap="gap-8"
      />
    </div>
  );
}

export default CardLoopPage;
