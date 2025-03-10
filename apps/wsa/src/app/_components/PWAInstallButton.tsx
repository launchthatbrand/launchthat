"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/components/dialog";
import { Download, Share, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@acme/ui/components/button";
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
  // State for device and installation detection
  const [isIOS, setIsIOS] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Use a ref to store the event between renders
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Detect iOS devices and show modal automatically
    if (typeof window !== "undefined") {
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & { MSStream?: boolean }).MSStream;

      setIsIOS(isIOSDevice);

      // Automatically show modal for iOS devices if not installed
      if (isIOSDevice && !isPWAInstalled()) {
        setShowIOSModal(true);
      }
    }

    // Log initial state
    console.log(
      "[PWA-BUTTON] Component mounted, checking installation status...",
    );
    setDebugMessage("Waiting for installation event...");

    // Function to handle the beforeinstallprompt event (non-iOS)
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
    // For iOS, show the custom modal
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // For other platforms, use the native install prompt
    if (!promptEvent.current) {
      console.log("[PWA-BUTTON] No installation prompt available");
      setDebugMessage(
        "No installation prompt available. Try visiting from Chrome on Android or desktop.",
      );
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

  // Determine if we should show the button
  // Always show in development mode
  const isDev = env.NODE_ENV === "development";
  const shouldShowButton = isDev || canInstall || isIOS;

  // Don't render anything on server
  if (!isClient || (!shouldShowButton && !isDev)) {
    return null;
  }

  return (
    <>
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
          <div className="mt-1 text-xs text-muted-foreground">
            {debugMessage}
          </div>
        )}
      </div>

      {/* iOS Installation Modal using shadcn Dialog */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Install WSA Learning Platform
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 px-2 py-4">
            <div className="rounded-2xl bg-gray-100 p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-black">
                <span className="text-lg font-semibold text-white">WSA</span>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-lg font-medium">
                Install this application on your home screen for quick and easy
                access when you're on the go.
              </p>

              <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
                <p className="font-semibold">Just two steps to install:</p>
                <ol className="space-y-3 text-left">
                  <li className="flex items-center space-x-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
                      1
                    </span>
                    <span className="flex items-center">
                      Tap the share button <Share className="ml-2 h-5 w-5" />
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
                      2
                    </span>
                    <span>Select 'Add to Home Screen'</span>
                  </li>
                </ol>
              </div>
            </div>

            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                setShowIOSModal(false);
                setDebugMessage(
                  "On iOS: Tap share icon, then 'Add to Home Screen'",
                );
              }}
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
