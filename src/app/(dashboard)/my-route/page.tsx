"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

interface Stop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
}

interface MyRoute {
  id: string;
  name: string;
  scheduledDate: string;
  area: Area;
  truck: Truck;
  stops: Stop[];
  pickupLogs: PickupLog[];
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json().catch(() => null))?.message ?? "Error");
    }
    return res.json();
  });

export default function MyRoutePage() {
  const { data, error } = useSWR<MyRoute>("/api/my-route", fetcher, {
    refreshInterval: 10000,
  });
  const [pendingStop, setPendingStop] = useState<Stop | null>(null);
  const [volumeKg, setVolumeKg] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function completeStop(stopId: string, payload?: { actualVolumeKg?: number; notes?: string }) {
    if (!data) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/routes/${data.id}/stops/${stopId}/complete`,
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

  function handleOpenComplete(stop: Stop) {
    setPendingStop(stop);
    setVolumeKg("");
    setNotes("");
  }

  function handleSubmitComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingStop) return;
    const actualVolumeKg = volumeKg ? parseInt(volumeKg, 10) : undefined;
    completeStop(pendingStop.id, {
      actualVolumeKg: Number.isNaN(actualVolumeKg) ? undefined : actualVolumeKg,
      notes: notes.trim() || undefined,
    });
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">My Route</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedIds = new Set(data.pickupLogs.map((log) => log.routeStopId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Route</h1>
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {new Date(data.scheduledDate).toLocaleDateString()} •{" "}
            {data.area.name} • Truck {data.truck.code}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.stops.map((stop) => {
            const isCompleted = completedIds.has(stop.id);
            return (
              <div
                key={stop.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    #{stop.sequence} {stop.name ?? stop.address ?? "Stop"}
                  </p>
                  {stop.address ? (
                    <p className="text-xs text-muted-foreground">
                      {stop.address}
                    </p>
                  ) : null}
                </div>
                <Button
                  size="sm"
                  variant={isCompleted ? "outline" : "default"}
                  disabled={isCompleted}
                  onClick={() => handleOpenComplete(stop)}
                >
                  {isCompleted ? "Completed" : "Mark completed"}
                </Button>
              </div>
            );
          })}
          {!data.stops.length && (
            <p className="text-sm text-muted-foreground">
              This route has no stops yet.
            </p>
          )}
        </CardContent>
      </Card>

      {pendingStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Log pickup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              #{pendingStop.sequence} {pendingStop.name ?? pendingStop.address ?? "Stop"}
            </p>
            <form onSubmit={handleSubmitComplete} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (kg)</Label>
                <Input
                  id="volume"
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={volumeKg}
                  onChange={(e) => setVolumeKg(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Optional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Confirm pickup"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

