"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { DiscordIcon } from "@acme/ui/icons/index";
import { LoginForm } from "@acme/ui/general/LoginForm";
import { Suspense } from "react";
import { loginWithWordPress } from "./actions";
import { toast } from "sonner";
import { useSignIn } from "@acme/auth-wsa/client";

// Create a client component that uses the search params
function LoginContent() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the redirect URL from search params
  const redirectUrl = searchParams.get("redirect");
  const decodedRedirectUrl = redirectUrl
    ? decodeURIComponent(redirectUrl)
    : "/";

  const handleSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_discord",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: decodedRedirectUrl,
      });
    } catch (err) {
      console.error("Monday auth error", err);
    }
  };

  async function onSubmit(data: { email: string; password: string }) {
    if (!signIn) return;

    try {
      // Authenticate with WordPress and get Clerk credentials
      const credentials = await loginWithWordPress(data);

      // Sign in with Clerk using the returned credentials
      const result = await signIn.create({
        identifier: credentials.email,
        password: credentials.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect to the original URL if available, otherwise to home
        router.push(decodedRedirectUrl);
      } else {
        console.error("Unexpected Clerk response:", result);
        throw new Error("Failed to complete login");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const providers = [
    {
      id: "discord",
      name: "Discord",
      icon: DiscordIcon,
      signIn: handleSignIn,
    },
  ];

  return (
    <LoginForm
      className="w-[400px]"
      providers={providers}
      title="Welcome to WSA"
      description="Sign in to your account using Discord"
      onSubmit={onSubmit}
    />
  );
}

// Main page component with Suspense
export default function LoginPage() {
  return (
    <div className="container flex h-screen w-full items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
