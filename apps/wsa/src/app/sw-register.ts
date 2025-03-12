// This script is meant to be imported in pages where you want to register the service worker

import { env } from "~/env";

// Define types for installation prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Check if PWA is installed
export const isPWAInstalled = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
};

// Unregister service worker and clear caches
export const unregisterServiceWorker = async () => {
  if (typeof window === "undefined") return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }

    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));

    console.log("[SW] Service worker unregistered and caches cleared");
  } catch (error) {
    console.error("[SW] Error unregistering service worker:", error);
  }
};

// Register service worker
export const registerServiceWorker = async () => {
  if (typeof window === "undefined") return;

  const isDev = env.NODE_ENV === "development";

  try {
    // In development, unregister any existing service worker
    if (isDev) {
      await unregisterServiceWorker();
      console.log("[SW] Development mode - Service worker disabled");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("[SW] Service worker registered successfully", registration);
  } catch (error) {
    console.error("[SW] Service worker registration failed:", error);
  }
};

// Get installation prompt status
export function usePWAInstall() {
  if (typeof window === "undefined") {
    return {
      canInstall: false,
      promptInstall: () => Promise.resolve(false),
    };
  }

  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-info bar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
  });

  const canInstall = !!deferredPrompt && !isPWAInstalled();

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    // Clear the deferredPrompt variable
    deferredPrompt = null;

    return choiceResult.outcome === "accepted";
  };

  return { canInstall, promptInstall };
}
