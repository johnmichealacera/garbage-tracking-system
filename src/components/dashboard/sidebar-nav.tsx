"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  Truck,
  MapPin,
  BarChart3,
  Map,
  Network,
  Package,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navConfig = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/routes", label: "Routes", icon: Route },
  { href: "/trucks", label: "Trucks", icon: Truck },
  { href: "/areas", label: "Areas", icon: Map },
  { href: "/my-route", label: "My Route", icon: MapPin },
  { href: "/pickup-history", label: "Pickup history", icon: Package },
  { href: "/users", label: "User accounts", icon: Users },
  { href: "/reporting", label: "Reporting", icon: BarChart3 },
  { href: "/system-map", label: "System map", icon: Network },
] as const;

const roleNavMap: Record<string, string[]> = {
  ADMIN: ["/dashboard", "/routes", "/trucks", "/areas", "/users", "/pickup-history", "/reporting", "/system-map"],
  DISPATCHER: ["/dashboard", "/routes", "/trucks", "/areas", "/pickup-history"],
  DRIVER: ["/dashboard", "/my-route", "/pickup-history"],
};

interface SidebarNavProps {
  role: string;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const allowedHrefs = roleNavMap[role] ?? [];
  const items = navConfig.filter((item) => allowedHrefs.includes(item.href));

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                "group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "hover:bg-accent/70",
                isActive
                  ? "bg-linear-to-r from-primary/12 to-primary/0 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                <span
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={cn(
                  "size-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
