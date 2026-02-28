"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>
      <UserProfile
        routing="hash"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "w-full",
            card: "w-full shadow-none border-0 bg-transparent",
          },
        }}
      />
    </div>
  );
}
