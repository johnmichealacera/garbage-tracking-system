import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { href: "/routes", label: "Routes", roles: ["ADMIN", "DISPATCHER"] },
  { href: "/trucks", label: "Trucks", roles: ["ADMIN", "DISPATCHER"] },
  { href: "/my-route", label: "My Route", roles: ["DRIVER"] },
  { href: "/reporting", label: "Reporting", roles: ["ADMIN"] },
];

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
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r px-4 py-6 flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase text-muted-foreground tracking-wide">
            Garbage Tracking
          </p>
          <p className="font-semibold text-sm mt-1 truncate">
            {session.user.name ?? session.user.email}
          </p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
        <nav className="flex flex-col gap-2">
          {filteredNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}

