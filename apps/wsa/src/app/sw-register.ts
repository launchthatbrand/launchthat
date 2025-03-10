// This script is meant to be imported in pages where you want to register the service worker

// Define types for installation prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Define extended Navigator type for Safari
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

/**
 * Register the service worker for PWA functionality
 */
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

/**
 * Check if the PWA is already installed
 * @returns boolean indicating if the app is running in standalone mode
 */
export function isPWAInstalled() {
  if (typeof window !== "undefined") {
    // Check if the app is in standalone mode (installed)
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as SafariNavigator).standalone === true
    );
  }
  return false;
}

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
