"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteMap } from "@/components/map/route-map";
import { getTodayInPhilippinesYmd } from "@/lib/philippine-time";
import {
  CheckCircle2,
  XCircle,
  Circle,
  MapPin,
  Calendar,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

interface ScheduleStop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string;
  expectedVolumeKg: number | null;
  isCompleted: boolean;
  isMissed: boolean;
}

interface ScheduleArea {
  id: string;
  name: string;
  description: string | null;
  centerLat: number | null;
  centerLng: number | null;
}

interface ScheduleTruck {
  code: string;
  plateNumber: string | null;
  capacityKg: number | null;
}

interface ScheduleDriver {
  name: string;
}

interface ScheduleRoute {
  id: string;
  name: string;
  scheduledDate: string;
  area: ScheduleArea;
  truck: ScheduleTruck;
  driver: ScheduleDriver;
  status: string;
  totalStops: number;
  completedStops: number;
  missedStops: number;
  pendingStops: number;
  stops: ScheduleStop[];
}

interface ScheduleResponse {
  date: string;
  routes: ScheduleRoute[];
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to load schedule");
    return res.json();
  });

/** Avoid UTC shift when displaying YYYY-MM-DD from the API */
function formatLocalDayLabel(isoDate: string) {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return isoDate;
  }
  const [y, m, d] = parts;
  return new Date(y!, m! - 1, d!).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stopTypeLabel(type: string) {
  return type.replace(/_/g, " ").toLowerCase();
}

function statusLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ");
}

export default function PublicSchedulePage() {
  const [date, setDate] = useState(() => getTodayInPhilippinesYmd());
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
    null,
  );
  const { data, error, isLoading } = useSWR<ScheduleResponse>(
    `/api/public/schedule?date=${date}`,
    fetcher,
  );

  /** Keeps a valid selection when the date changes or data first loads */
  const resolvedRouteId = useMemo(() => {
    if (!data?.routes.length) return null;
    if (selectedRouteId && data.routes.some((r) => r.id === selectedRouteId)) {
      return selectedRouteId;
    }
    return data.routes[0]!.id;
  }, [data, selectedRouteId]);

  const selectedRoute = useMemo(
    () =>
      resolvedRouteId
        ? data?.routes.find((r) => r.id === resolvedRouteId) ?? null
        : null,
    [data, resolvedRouteId],
  );

  const selectedRouteProgress = useMemo(() => {
    if (!selectedRoute) return null;
    const completedIds = new Set(
      selectedRoute.stops.filter((s) => s.isCompleted).map((s) => s.id),
    );
    const pct =
      selectedRoute.totalStops > 0
        ? Math.round(
            (selectedRoute.completedStops / selectedRoute.totalStops) * 100,
          )
        : 0;
    return { completedIds, pct };
  }, [selectedRoute]);

  const totals = useMemo(() => {
    if (!data?.routes.length) {
      return {
        routes: 0,
        stops: 0,
        completed: 0,
        missed: 0,
        pending: 0,
      };
    }
    return data.routes.reduce(
      (acc, r) => ({
        routes: acc.routes + 1,
        stops: acc.stops + r.totalStops,
        completed: acc.completed + r.completedStops,
        missed: acc.missed + r.missedStops,
        pending: acc.pending + r.pendingStops,
      }),
      { routes: 0, stops: 0, completed: 0, missed: 0, pending: 0 },
    );
  }, [data]);

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-muted/30">
      <div className="mx-auto max-w-5xl px-2 py-2 sm:px-3">
        <header className="mb-2 rounded-md border bg-card/60 px-2 py-1.5">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
              <MapPin className="size-3" />
              Socorro LGU
            </span>
            <h1 className="text-[12px] font-semibold tracking-tight text-foreground">
              Socorro Garbage Collection Schedule
            </h1>
            <span className="hidden text-muted-foreground/60 sm:inline">•</span>
            <p className="text-[10px]">
              Municipality of Socorro, Surigao del Norte — official day-by-day
              route and stop progress.
            </p>
          </div>
        </header>

        <Card className="mb-2 gap-0 py-0 border-primary/10 shadow-sm">
          <CardHeader className="gap-0! p-0!">
            <div className="flex flex-wrap items-center gap-1.5 px-2 py-1">
              <div className="text-[10px] text-muted-foreground">
                <CardTitle className="inline text-[11px] font-semibold text-foreground">
                  Choose a date
                </CardTitle>{" "}
                • Select any calendar day to see routes and stops scheduled for that day.
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Calendar className="size-3.5 text-muted-foreground max-sm:hidden" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-7 w-auto min-w-32 bg-background px-2 text-[11px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-2 pt-0">
            {error && !data && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            )}

            {isLoading && !data && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            )}

            {data && (
              <>
                <div className="grid gap-x-3 gap-y-0.5 rounded-md border bg-muted/20 px-2.5 py-1.5 text-[10px] sm:grid-cols-2 lg:grid-cols-5">
                  <p className="inline-flex items-center gap-1 text-muted-foreground/90">
                    <span className="size-1.5 rounded-full bg-primary/70" />
                    Routes: <span className="font-medium text-foreground">{totals.routes}</span>
                  </p>
                  <p className="inline-flex items-center gap-1 text-muted-foreground/90">
                    <span className="size-1.5 rounded-full bg-cyan-500/70" />
                    Total stops: <span className="font-medium text-foreground">{totals.stops}</span>
                  </p>
                  <p className="inline-flex items-center gap-1 text-muted-foreground/90">
                    <span className="size-1.5 rounded-full bg-emerald-500/70" />
                    Completed pickups: <span className="font-medium text-foreground">{totals.completed}</span>
                  </p>
                  <p className="inline-flex items-center gap-1 text-muted-foreground/90">
                    <span className="size-1.5 rounded-full bg-amber-500/70" />
                    Missed / Pending:{" "}
                    <span className="font-medium text-foreground">
                      {totals.missed}/{totals.pending}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-muted-foreground sm:col-span-2 lg:col-span-1">
                    <ClipboardList className="size-3.5" />
                    <span>
                      {data.routes.length} route{data.routes.length === 1 ? "" : "s"} for{" "}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatLocalDayLabel(data.date)}
                    </span>
                  </div>
                </div>

                {data.routes.length > 0 ? (
                  <div className="grid gap-1 rounded-md border bg-card/70 px-2.5 py-1.5 lg:grid-cols-[max-content_1fr] lg:items-center lg:gap-x-2 lg:gap-y-0.5">
                    <Label
                      htmlFor="route-area"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground"
                    >
                      <MapPin className="size-3 text-primary" />
                      Barangay / area &amp; route
                    </Label>
                    <p className="text-[10px] text-muted-foreground/90">
                      Choose one barangay to view route, stops, and map.
                    </p>
                    <select
                      id="route-area"
                      className="h-7 w-full max-w-2xl rounded-sm border border-input bg-background px-2 text-[10px] shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:col-span-2"
                      value={resolvedRouteId ?? ""}
                      onChange={(e) =>
                        setSelectedRouteId(e.target.value || null)
                      }
                    >
                      {data.routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.area.name} — {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {data.routes.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/40 px-6 py-14 text-center">
                    <AlertCircle className="mx-auto mb-3 size-10 text-muted-foreground" />
                    <p className="font-medium">No collection routes</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Nothing is scheduled for this date. Try another day.
                    </p>
                  </div>
                ) : selectedRoute && selectedRouteProgress ? (
                  <Card
                    key={selectedRoute.id}
                    className="overflow-hidden gap-0 py-0 border-primary/15 shadow-sm"
                  >
                    <CardHeader className="gap-0! p-0! border-b">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 px-2 py-1">
                          <p className="truncate text-[11px] font-medium text-foreground">
                            {selectedRoute.area.name} — {selectedRoute.name}
                          </p>
                          {selectedRoute.area.description ? (
                            <p className="truncate text-[10px] text-muted-foreground">
                              {selectedRoute.area.description}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={`inline-flex w-fit shrink-0 items-center rounded-full px-1.5 py-0 text-[10px] font-medium capitalize ${
                            selectedRoute.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : selectedRoute.status === "IN_PROGRESS"
                                ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                                : selectedRoute.status === "CANCELLED"
                                  ? "bg-destructive/15 text-destructive"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {statusLabel(selectedRoute.status)}
                        </span>
                      </div>

                      <div className="grid gap-x-2 gap-y-0.5 px-2 py-1 text-[10px] leading-tight sm:grid-cols-2 xl:grid-cols-4">
                        <p>
                          <span className="font-medium text-foreground">Truck:</span>{" "}
                          <span className="font-mono">{selectedRoute.truck.code}</span>{" "}
                          <span className="text-muted-foreground">
                            (Plate: {selectedRoute.truck.plateNumber ?? "N/A"})
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Driver:</span>{" "}
                          <span>{selectedRoute.driver.name}</span>{" "}
                          <span className="text-muted-foreground">(Collection team)</span>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Capacity:</span>{" "}
                          <span>
                            {selectedRoute.truck.capacityKg != null
                              ? `${selectedRoute.truck.capacityKg.toLocaleString()} kg`
                              : "N/A"}
                          </span>{" "}
                          <span className="text-muted-foreground">(Vehicle load limit)</span>
                        </p>
                        <div className="space-y-0">
                          <p>
                            <span className="font-medium text-foreground">Progress:</span>{" "}
                            <span>
                              {selectedRoute.completedStops}/{selectedRoute.totalStops} done
                            </span>
                          </p>
                          <div className="h-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${selectedRouteProgress.pct}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="grid gap-2 p-1 pt-1 lg:grid-cols-2">
                      <div className="min-w-0 space-y-3 rounded-xl border border-primary/25 bg-background p-3 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                          <ClipboardList className="size-4" />
                          Stop list
                        </h3>
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full min-w-[320px] text-left text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                                <th className="px-3 py-2.5">#</th>
                                <th className="px-3 py-2.5">Status</th>
                                <th className="px-3 py-2.5">Stop</th>
                                <th className="hidden px-3 py-2.5 sm:table-cell">
                                  Type
                                </th>
                                <th className="hidden px-3 py-2.5 md:table-cell">
                                  Est. kg
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedRoute.stops.map((stop) => (
                                <tr
                                  key={stop.id}
                                  className="border-b border-border/60 last:border-0"
                                >
                                  <td className="px-3 py-3 align-top font-mono text-muted-foreground">
                                    {stop.sequence}
                                  </td>
                                  <td className="px-3 py-3 align-top">
                                    {stop.isCompleted ? (
                                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-500">
                                        <CheckCircle2 className="size-4" />
                                        Done
                                      </span>
                                    ) : stop.isMissed ? (
                                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500">
                                        <XCircle className="size-4" />
                                        Missed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                                        <Circle className="size-4" />
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3 align-top">
                                    <p className="font-medium leading-snug">
                                      {stop.name ?? "Stop"}
                                    </p>
                                    {stop.address ? (
                                      <p className="mt-0.5 text-xs text-muted-foreground">
                                        {stop.address}
                                      </p>
                                    ) : null}
                                  </td>
                                  <td className="hidden px-3 py-3 align-top capitalize sm:table-cell">
                                    {stopTypeLabel(stop.type)}
                                  </td>
                                  <td className="hidden px-3 py-3 align-top text-muted-foreground md:table-cell">
                                    {stop.expectedVolumeKg != null
                                      ? stop.expectedVolumeKg.toLocaleString()
                                      : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="min-w-0 space-y-3 rounded-xl border border-primary/25 bg-background p-3 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                          <MapPin className="size-4" />
                          Route map (Socorro)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Stops with coordinates appear on the map (green =
                          collected, gray = still pending). Approximate locations
                          within the municipality.
                        </p>
                        <RouteMap
                          stops={selectedRoute.stops}
                          completedStopIds={selectedRouteProgress.completedIds}
                          mapHeightPx={280}
                          emptyMessage="Stop locations for this route are not on the map yet. The LGU adds map points when coordinates are recorded for each stop."
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <footer className="flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            Garbage Tracking System • Socorro LGU • Surigao del Norte
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              className={cn(
                "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs",
                "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-primary hover:underline"
            >
              Staff sign in
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
