"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useSignIn } from "@acme/auth-wsa/client";
import { LoginForm } from "@acme/ui/general/LoginForm";
import { DiscordIcon } from "@acme/ui/icons/index";

import { loginWithWordPress } from "./actions";

export default function LoginPage() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_discord",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
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
        router.push("/");
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
    <div className="container flex h-screen w-full items-center justify-center">
      <LoginForm
        className="w-[400px]"
        providers={providers}
        title="Welcome to WSA"
        description="Sign in to your account using Discord"
        onSubmit={onSubmit}
      />
    </div>
  );
}
