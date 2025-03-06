"use client";

import { useSignIn } from "@acme/auth-wsa";
import { LoginForm } from "@acme/ui/general/LoginForm";
import { DiscordIcon } from "@acme/ui/icons/index";

export function LoginContent() {
  const { signIn, isLoaded } = useSignIn();

  const handleSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_discord",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Discord auth error", err);
    }
  };

  if (!isLoaded) {
    return null; // or a loading spinner
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
      />
    </div>
  );
}
