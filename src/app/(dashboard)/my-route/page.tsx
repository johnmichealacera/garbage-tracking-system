"use client";

import useSWR, { mutate } from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const { data, error } = useSWR<MyRoute>("/api/my-route", fetcher);

  async function completeStop(stopId: string) {
    if (!data) return;
    try {
      const res = await fetch(
        `/api/routes/${data.id}/stops/${stopId}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      if (!res.ok) {
        toast.error("Failed to log pickup");
        return;
      }
      mutate("/api/my-route");
      toast.success("Pickup logged");
    } catch {
      toast.error("Failed to log pickup");
    }
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
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">My Route</h1>
        <p className="text-muted-foreground">Loading...</p>
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
                  onClick={() => completeStop(stop.id)}
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
    </div>
  );
}

