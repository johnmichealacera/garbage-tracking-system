"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Filter,
  Plus,
  Route as RouteIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  StatusBadge,
  routeStatusToTone,
} from "@/components/dashboard/status-badge";

interface Area {
  id: string;
  name: string;
}

interface RouteStop {
  id: string;
}

interface PickupLog {
  id: string;
}

interface Truck {
  code: string;
}

interface Route {
  id: string;
  name: string;
  scheduledDate: string;
  status: string;
  area: Area;
  truck: Truck;
  stops: RouteStop[];
  pickupLogs: PickupLog[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoutesPage() {
  const [date, setDate] = useState("");
  const [areaId, setAreaId] = useState("");

  const { data: areas } = useSWR<Area[]>("/api/areas", fetcher);

  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (areaId) params.set("areaId", areaId);

  const { data: routes, isLoading } = useSWR<Route[]>(
    `/api/routes${params.toString() ? `?${params.toString()}` : ""}`,
    fetcher,
  );

  const hasFilters = Boolean(date || areaId);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Operations"
        icon={<RouteIcon className="size-5" />}
        title="Routes"
        description="Plan collection routes by barangay, assign trucks, and track completion in real time."
        actions={
          <Link href="/routes/new">
            <Button className="h-10 gap-2 shadow-md transition-all hover:shadow-lg">
              <Plus className="size-4" />
              Create route
            </Button>
          </Link>
        }
      />

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold tracking-tight">
              Filters
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Narrow down the list by schedule date and barangay.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Date
            </p>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 bg-background/80"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Barangay
            </p>
            <select
              className="h-10 w-full rounded-md border border-input bg-background/80 px-3 text-sm shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="">All barangays</option>
              {areas?.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-2"
                onClick={() => {
                  setDate("");
                  setAreaId("");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Showing all routes.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Planned routes
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {routes?.length ?? 0} route{routes?.length === 1 ? "" : "s"} found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : routes?.length ? (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 text-left">Date</th>
                      <th className="px-4 py-2.5 text-left">Name</th>
                      <th className="px-4 py-2.5 text-left">Barangay</th>
                      <th className="px-4 py-2.5 text-left">Truck</th>
                      <th className="px-4 py-2.5 text-right">Progress</th>
                      <th className="px-4 py-2.5 text-left">Status</th>
                      <th className="px-4 py-2.5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => {
                      const totalStops = route.stops.length;
                      const completed = route.pickupLogs.length;
                      const pct =
                        totalStops === 0
                          ? 0
                          : Math.round((completed / totalStops) * 100);
                      const dateLabel = new Date(
                        route.scheduledDate,
                      ).toLocaleDateString();
                      return (
                        <tr
                          key={route.id}
                          className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarDays className="size-3.5" />
                              {dateLabel}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle font-medium">
                            {route.name}
                          </td>
                          <td className="px-4 py-3 align-middle text-muted-foreground">
                            {route.area?.name}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 font-mono text-xs">
                              {route.truck?.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs tabular-nums text-muted-foreground">
                                {completed}/{totalStops}
                              </span>
                              <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-teal-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <StatusBadge
                              label={route.status.toLowerCase().replace("_", " ")}
                              tone={routeStatusToTone(route.status)}
                            />
                          </td>
                          <td className="px-4 py-3 align-middle text-right">
                            <Link href={`/routes/${route.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-primary hover:text-primary"
                              >
                                View
                                <ArrowUpRight className="size-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <RouteIcon className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium">No routes found</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {hasFilters
                  ? "Try clearing your filters, or create a new route."
                  : "Create your first route to start tracking pickups."}
              </p>
              <Link href="/routes/new" className="mt-4">
                <Button size="sm" className="gap-2">
                  <Plus className="size-4" />
                  Create route
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
