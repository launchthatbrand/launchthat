"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Download as DownloadIcon,
  FileDown,
  FileIcon,
  Search,
} from "lucide-react";

import {
  cardVariants,
  containerVariants,
  filterToggleVariants,
  slideInVariants,
  smoothTransition,
} from "@acme/ui/animations/index";
import { Button } from "@acme/ui/components/button";
import { Card } from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { cn } from "@acme/ui/lib/utils";

import { downloadCategories } from "./demo-data";

interface Download {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  updatedAt: string;
}

const MotionButton = motion(Button);
const MotionCard = motion(Card);

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter downloads based on search query and selected category
  const filteredCategories = downloadCategories
    .map((category) => ({
      ...category,
      downloads: category.downloads.filter(
        (download) =>
          (!selectedCategory || category.id === selectedCategory) &&
          (download.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            download.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            download.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      ),
    }))
    .filter((category) => category.downloads.length > 0);

  const handleDownload = (download: Download) => {
    console.log(`Downloading: ${download.title}`);
    window.open(download.fileUrl, "_blank");
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "xlsx":
        return "bg-green-100 text-green-700";
      case "zip":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container h-full max-w-7xl py-8">
      {/* Header Section */}
      <div className="mb-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Downloads</h1>
          <p className="text-lg text-muted-foreground">
            Access our comprehensive collection of trading resources, guides,
            and tools.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div
              variants={filterToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
            >
              <MotionButton
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="min-w-[100px]"
                animate={{
                  backgroundColor:
                    selectedCategory === null
                      ? "var(--primary)"
                      : "var(--background)",
                  color:
                    selectedCategory === null
                      ? "var(--primary-foreground)"
                      : "var(--foreground)",
                }}
                transition={smoothTransition}
              >
                All
              </MotionButton>
            </motion.div>
            {downloadCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={filterToggleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                whileTap="tap"
              >
                <MotionButton
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="min-w-[100px]"
                  animate={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? "var(--primary)"
                        : "var(--background)",
                    color:
                      selectedCategory === category.id
                        ? "var(--primary-foreground)"
                        : "var(--foreground)",
                  }}
                  transition={smoothTransition}
                >
                  {category.name}
                </MotionButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Downloads Grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              variants={slideInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <motion.div
                layout
                variants={containerVariants}
                className="grid gap-4 md:grid-cols-2"
              >
                <AnimatePresence mode="popLayout">
                  {category.downloads.map((download, index) => (
                    <motion.div
                      key={download.id}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      layoutId={download.id}
                      transition={{
                        layout: { duration: 0.3 },
                        delay: index * 0.05,
                      }}
                    >
                      <MotionCard className="group overflow-hidden border bg-card/50 transition-all hover:border-primary/50 hover:shadow-md">
                        <div className="flex items-start gap-4 p-6">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                              getFileTypeColor(download.fileType),
                            )}
                          >
                            <FileIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold tracking-tight">
                                {download.title}
                              </h3>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-medium",
                                  getFileTypeColor(download.fileType),
                                )}
                              >
                                {download.fileType}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {download.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DownloadIcon className="h-3.5 w-3.5" />
                                <span>
                                  {download.downloadCount.toLocaleString()}{" "}
                                  downloads
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  Updated{" "}
                                  {new Date(
                                    download.updatedAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="text-xs font-medium">
                                {download.fileSize}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(download)}
                            className="ml-4 shrink-0 transition-transform group-hover:scale-105"
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </MotionCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCategories.length === 0 && (
        <motion.div
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-center"
        >
          <p className="text-muted-foreground">
            No downloads found matching your search criteria.
          </p>
        </motion.div>
      )}
    </div>
  );
}
