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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navConfig = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/routes", label: "Routes", icon: Route },
  { href: "/trucks", label: "Trucks", icon: Truck },
  { href: "/areas", label: "Areas", icon: Map },
  { href: "/my-route", label: "My Route", icon: MapPin },
  { href: "/reporting", label: "Reporting", icon: BarChart3 },
] as const;

const roleNavMap: Record<string, string[]> = {
  ADMIN: ["/dashboard", "/routes", "/trucks", "/areas", "/reporting"],
  DISPATCHER: ["/dashboard", "/routes", "/trucks", "/areas"],
  DRIVER: ["/dashboard", "/my-route"],
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "hover:bg-accent/80",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
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
