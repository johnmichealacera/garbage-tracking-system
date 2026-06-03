"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { SignOutButton } from "./sign-out-button";

interface MobileNavProps {
  role: string;
  displayName: string;
  initials: string;
}

export function MobileNav({ role, displayName, initials }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button — sits in the mobile top bar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-95"
      >
        <Menu className="size-5" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card px-4 py-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-2.5 shadow-sm transition-all hover:border-primary/30 hover:bg-background/80"
          >
            <div className="relative rounded-lg border border-border/60 bg-card p-1.5">
              <Image
                src="/socorro_logo.png"
                alt="Municipality of Socorro"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Socorro LGU
              </p>
              <p className="truncate text-sm font-semibold tracking-tight">
                Garbage Tracking
              </p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* User info */}
        <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-teal-500/20 text-xs font-semibold text-primary ring-1 ring-primary/20">
              {initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-4 flex-1">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Workspace
          </p>
          <SidebarNav role={role} />
        </div>

        {/* Sign out */}
        <div className="border-t border-border/60 pt-3">
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
