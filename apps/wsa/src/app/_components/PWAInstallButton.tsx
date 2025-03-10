"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@acme/ui/components/button";
import { Download } from "lucide-react";
import { env } from "~/env";
import { isPWAInstalled } from "../sw-register";

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  className?: string;
}

export default function PWAInstallButton({ className }: PWAInstallButtonProps) {
  // State to track if we're in development mode
  const [isDev] = useState(env.NODE_ENV === "development");
  const [canInstall, setCanInstall] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Use a ref to store the event between renders
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Log initial state
    console.log(
      "[PWA-BUTTON] Component mounted, checking installation status...",
    );
    setDebugMessage("Waiting for installation event...");

    // Function to handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Store the event for later use
      promptEvent.current = e as BeforeInstallPromptEvent;

      // Update state to show install button
      setCanInstall(true);
      setDebugMessage("Install prompt captured and ready!");

      console.log("[PWA-BUTTON] Install prompt event captured", e);
    };

    // Add the event listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already installed
    if (isPWAInstalled()) {
      console.log("[PWA-BUTTON] App already installed");
      setDebugMessage("App is already installed");
      setCanInstall(false);
    } else {
      console.log("[PWA-BUTTON] App not installed");
    }

    // Clean up
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    // If we don't have the prompt event, we can't do anything
    if (!promptEvent.current) {
      console.log("[PWA-BUTTON] No installation prompt available");
      setDebugMessage(
        "No installation prompt available. Try visiting from Chrome on Android or desktop.",
      );

      // For testing - force showing installation criteria
      if (isDev) {
        window.open("chrome://apps", "_blank");
      }
      return;
    }

    try {
      console.log("[PWA-BUTTON] Triggering installation prompt...");
      setDebugMessage("Showing installation prompt...");

      // Show the install prompt
      await promptEvent.current.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await promptEvent.current.userChoice;

      console.log(
        "[PWA-BUTTON] User installation choice:",
        choiceResult.outcome,
      );

      if (choiceResult.outcome === "accepted") {
        console.log("[PWA-BUTTON] User accepted the installation");
        setDebugMessage("App installation successful!");
        setCanInstall(false);
      } else {
        console.log("[PWA-BUTTON] User dismissed the installation");
        setDebugMessage("Installation dismissed. Try again later.");
      }

      // Clear the saved prompt since it can only be used once
      promptEvent.current = null;
    } catch (error) {
      console.error("[PWA-BUTTON] Error during PWA installation:", error);
      setDebugMessage(`Installation error: ${String(error)}`);
    }
  };

  // In development, always show the button for testing
  // In production, only show when installable
  if (!isDev && !canInstall) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleInstallClick}
        className={className}
        variant="outline"
        size="sm"
      >
        <Download className="mr-2 h-4 w-4" />
        Install App
      </Button>
      {isDev && debugMessage && (
        <div className="mt-1 text-xs text-muted-foreground">{debugMessage}</div>
      )}
    </div>
  );
}
