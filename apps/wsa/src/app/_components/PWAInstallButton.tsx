"use client";

import { isPWAInstalled, usePWAInstall } from "../sw-register";
import { useEffect, useState } from "react";

import { Button } from "@acme/ui/components/button";
import { Download } from "lucide-react";

interface PWAInstallButtonProps {
  className?: string;
}

export default function PWAInstallButton({ className }: PWAInstallButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [canShowInstall, setCanShowInstall] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setIsClient(true);

    // Check if app can be installed
    const checkInstallable = () => {
      if (typeof window !== "undefined") {
        if (!isPWAInstalled()) {
          setCanShowInstall(true);
        }
      }
    };

    // Initial check
    checkInstallable();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      checkInstallable();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Get install prompt functionality
  const { promptInstall } = usePWAInstall();

  // Handler for install button click
  const handleInstallClick = async () => {
    try {
      const installed = await promptInstall();
      if (installed) {
        setCanShowInstall(false);
      }
    } catch (error) {
      console.error("Failed to prompt installation:", error);
    }
  };

  // Don't render anything on server or if installation is not available
  if (!isClient || !canShowInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className={className}
      variant="outline"
      size="sm"
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
}
