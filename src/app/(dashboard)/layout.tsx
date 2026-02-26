import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

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

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r bg-muted/30 px-4 py-6 flex flex-col gap-8">
        <div className="px-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Garbage Tracking
          </p>
          <p className="mt-2 font-semibold text-sm truncate">
            {session.user.name ?? session.user.email}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground capitalize">
            {role.toLowerCase()}
          </p>
        </div>
        <SidebarNav role={role} />
      </aside>
      <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
    </div>
  );
}

