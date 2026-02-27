"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2 cursor-pointer text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
