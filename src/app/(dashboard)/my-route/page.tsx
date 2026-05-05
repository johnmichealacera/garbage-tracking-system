"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  MapPin,
  Navigation,
  Scale,
  Truck as TruckIcon,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { RouteMap } from "@/components/map/route-map";

interface Area {
  name: string;
}

interface Truck {
  code: string;
}

interface PickupLog {
  id: string;
  routeStopId: string;
}

interface MissedStop {
  id: string;
  routeStopId: string;
  reason: string | null;
}

interface Stop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface MyRoute {
  id: string;
  name: string;
  scheduledDate: string;
  area: Area;
  truck: Truck;
  stops: Stop[];
  pickupLogs: PickupLog[];
  missedStops: MissedStop[];
}

type PendingStopCtx = { routeId: string; stop: Stop };

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json().catch(() => null))?.message ?? "Error");
    }
    return res.json();
  });

export default function MyRoutePage() {
  const { data, error } = useSWR<MyRoute[]>("/api/my-route", fetcher, {
    refreshInterval: 10000,
  });
  const [pendingStop, setPendingStop] = useState<PendingStopCtx | null>(null);
  const [pendingMissed, setPendingMissed] = useState<PendingStopCtx | null>(
    null,
  );
  const [volumeKg, setVolumeKg] = useState("");
  const [notes, setNotes] = useState("");
  const [missedReason, setMissedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function completeStop(
    routeId: string,
    stopId: string,
    payload?: { actualVolumeKg?: number; notes?: string },
  ) {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/routes/${routeId}/stops/${stopId}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actualVolumeKg: payload?.actualVolumeKg ?? null,
            notes: payload?.notes || null,
          }),
        },
      );
      if (!res.ok) {
        toast.error("Failed to log pickup");
        return;
      }
      mutate("/api/my-route");
      toast.success("Pickup logged");
      setPendingStop(null);
      setVolumeKg("");
      setNotes("");
    } catch {
      toast.error("Failed to log pickup");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function markMissed(routeId: string, stopId: string, reason?: string) {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/routes/${routeId}/stops/${stopId}/missed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: reason || null }),
        },
      );
      if (!res.ok) {
        toast.error("Failed to log missed stop");
        return;
      }
      mutate("/api/my-route");
      toast.success("Missed stop logged");
      setPendingMissed(null);
      setMissedReason("");
    } catch {
      toast.error("Failed to log missed stop");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenComplete(routeId: string, stop: Stop) {
    setPendingStop({ routeId, stop });
    setVolumeKg("");
    setNotes("");
  }

  function handleOpenMissed(routeId: string, stop: Stop) {
    setPendingMissed({ routeId, stop });
    setMissedReason("");
  }

  function handleSubmitMissed(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingMissed) return;
    markMissed(
      pendingMissed.routeId,
      pendingMissed.stop.id,
      missedReason.trim() || undefined,
    );
  }

  function handleSubmitComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingStop) return;
    const actualVolumeKg = volumeKg ? parseInt(volumeKg, 10) : undefined;
    completeStop(pendingStop.routeId, pendingStop.stop.id, {
      actualVolumeKg: Number.isNaN(actualVolumeKg) ? undefined : actualVolumeKg,
      notes: notes.trim() || undefined,
    });
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <PageHeader
          eyebrow="Field"
          icon={<Navigation className="size-5" />}
          title="My route"
          description="Your assigned collection route for today."
        />
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const totalStops = data.reduce((sum, r) => sum + r.stops.length, 0);
  const totalCompleted = data.reduce((sum, r) => sum + r.pickupLogs.length, 0);
  const totalMissed = data.reduce((sum, r) => sum + r.missedStops.length, 0);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Field"
        icon={<Navigation className="size-5" />}
        title="My route"
        description={
          data.length
            ? `You have ${data.length} route${
                data.length === 1 ? "" : "s"
              } scheduled today — ${totalCompleted}/${totalStops} stops completed${
                totalMissed > 0 ? `, ${totalMissed} missed` : ""
              }.`
            : "No routes assigned to you yet."
        }
      />

      {data.length === 0 ? (
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Navigation className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium">Nothing scheduled</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              When a dispatcher assigns you a route, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {data.map((route) => {
        const completedIds = new Set(
          route.pickupLogs.map((log) => log.routeStopId),
        );
        const missedIds = new Set(
          route.missedStops?.map((m) => m.routeStopId) ?? [],
        );
        const completed = route.pickupLogs.length;
        const pct =
          route.stops.length === 0
            ? 0
            : Math.round((completed / route.stops.length) * 100);

        return (
          <div key={route.id} className="space-y-4">
            <Card className="relative overflow-hidden border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/12 blur-3xl"
                aria-hidden
              />
              <CardHeader className="relative pb-3">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {route.name}
                </CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {new Date(route.scheduledDate).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {route.area.name}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <TruckIcon className="size-3.5" />
                    <span className="font-mono">{route.truck.code}</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-muted-foreground">
                    Progress
                  </span>
                  <span className="tabular-nums font-semibold">
                    {completed}/{route.stops.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-teal-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Stops
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Tap a stop to mark it as completed or missed.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {route.stops.map((stop) => {
                  const isCompleted = completedIds.has(stop.id);
                  const isMissed = missedIds.has(stop.id);
                  const isDone = isCompleted || isMissed;
                  return (
                    <div
                      key={stop.id}
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors",
                        isCompleted
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : isMissed
                            ? "border-amber-500/30 bg-amber-500/5"
                            : "border-border/60 bg-background/60 hover:bg-background",
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
                        ) : isMissed ? (
                          <XCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-500" />
                        ) : (
                          <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">
                            <span className="mr-1 text-muted-foreground">
                              #{stop.sequence}
                            </span>
                            {stop.name ?? stop.address ?? "Stop"}
                          </p>
                          {stop.address ? (
                            <p className="text-xs text-muted-foreground">
                              {stop.address}
                            </p>
                          ) : null}
                          {isMissed ? (
                            <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                              Marked as missed
                            </p>
                          ) : null}
                          {isCompleted ? (
                            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              Pickup logged
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          disabled={isDone}
                          onClick={() => handleOpenComplete(route.id, stop)}
                          className="gap-1.5"
                        >
                          <CheckCircle2 className="size-3.5" />
                          {isCompleted ? "Completed" : "Mark completed"}
                        </Button>
                        <Button
                          size="sm"
                          variant={isMissed ? "outline" : "destructive"}
                          disabled={isDone}
                          onClick={() => handleOpenMissed(route.id, stop)}
                          className="gap-1.5"
                        >
                          <XCircle className="size-3.5" />
                          {isMissed ? "Missed" : "Mark missed"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {!route.stops.length && (
                  <p className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                    This route has no stops yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Route map
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Green markers = completed · Gray markers = pending
                </p>
              </CardHeader>
              <CardContent>
                <RouteMap
                  stops={route.stops}
                  completedStopIds={completedIds}
                  mapHeightPx={320}
                />
              </CardContent>
            </Card>
          </div>
        );
      })}

      {pendingStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight">
                  Log pickup
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  #{pendingStop.stop.sequence}{" "}
                  {pendingStop.stop.name ??
                    pendingStop.stop.address ??
                    "Stop"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmitComplete} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="volume" className="inline-flex items-center gap-1.5">
                  <Scale className="size-3.5 text-muted-foreground" />
                  Volume (kg)
                </Label>
                <Input
                  id="volume"
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={volumeKg}
                  onChange={(e) => setVolumeKg(e.target.value)}
                  className="h-10 bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Optional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-10 bg-background/80"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPendingStop(null);
                    setVolumeKg("");
                    setNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 shadow-md"
                >
                  <CheckCircle2 className="size-4" />
                  {isSubmitting ? "Saving..." : "Confirm pickup"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingMissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/25 dark:text-amber-400">
                <XCircle className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight">
                  Mark missed stop
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  #{pendingMissed.stop.sequence}{" "}
                  {pendingMissed.stop.name ??
                    pendingMissed.stop.address ??
                    "Stop"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmitMissed} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  placeholder="e.g. Road blocked, No access, Gate locked"
                  value={missedReason}
                  onChange={(e) => setMissedReason(e.target.value)}
                  className="h-10 bg-background/80"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPendingMissed(null);
                    setMissedReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                  className="gap-2 shadow-md"
                >
                  <XCircle className="size-4" />
                  {isSubmitting ? "Saving..." : "Confirm missed"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
