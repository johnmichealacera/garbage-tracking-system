import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user.role;
  const displayName = session.user.name ?? session.user.email ?? "Team member";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full bg-teal-500/8 blur-3xl"
        aria-hidden
      />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-card/70 px-4 py-6 backdrop-blur-md md:flex md:flex-col md:gap-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-2.5 shadow-sm transition-all hover:border-primary/30 hover:bg-background/80"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-lg bg-linear-to-br from-primary/25 via-transparent to-teal-500/20 blur-sm opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-lg border border-border/60 bg-card p-1.5">
                <Image
                  src="/socorro_logo.png"
                  alt="Municipality of Socorro"
                  width={36}
                  height={36}
                  className="h-8 w-8 object-contain"
                />
              </div>
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

          <div className="rounded-xl border border-border/60 bg-background/60 p-3">
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

          <div className="flex-1">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Workspace
            </p>
            <SidebarNav role={role} />
          </div>

          <div className="border-t border-border/60 pt-3">
            <SignOutButton />
          </div>
        </aside>

        <main className="relative flex-1 min-w-0">
          <div className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 shadow-sm">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="rounded-lg border border-border bg-background p-1 shadow-sm">
                <Image
                  src="/socorro_logo.png"
                  alt="Municipality of Socorro"
                  width={28}
                  height={28}
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none">
                  Socorro LGU
                </p>
                <p className="truncate text-sm font-bold tracking-tight leading-snug">
                  Garbage Tracking
                </p>
              </div>
            </Link>
            <MobileNav role={role} displayName={displayName} initials={initials} />
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
