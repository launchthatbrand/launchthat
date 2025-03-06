"use client";

import { signIn } from "@acme/auth-monday";
import { LoginForm } from "@acme/ui/general/LoginForm";
import { MondayIcon } from "@acme/ui/icons/index";

const providers = [
  {
    id: "monday",
    name: "Monday",
    icon: MondayIcon,
    signIn: () => signIn("monday"),
  },
];

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-full items-center justify-center">
      <LoginForm
        className="w-[400px]"
        providers={providers}
        title="Welcome to Monday App"
        description="Sign in with your Monday.com account"
      />
    </div>
  );
}
