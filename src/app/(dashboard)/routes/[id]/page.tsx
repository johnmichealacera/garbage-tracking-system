"use client";

import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouteMap } from "@/components/map/route-map";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, Circle, Pencil } from "lucide-react";

interface CompletedBy {
  id: string;
  name: string;
  email: string;
}

interface PickupLog {
  id: string;
  routeStopId: string;
  completedAt: string;
  actualVolumeKg: number | null;
  notes: string | null;
  completedBy: CompletedBy;
}

interface RouteStop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string;
  expectedVolumeKg: number | null;
}

interface RouteDetail {
  id: string;
  name: string;
  scheduledDate: string;
  status: string;
  truck: { code: string };
  area: { name: string };
  driver: { name: string } | null;
  stops: RouteStop[];
  pickupLogs: PickupLog[];
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to load route");
    }
    return res.json();
  });

export default function RouteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, error } = useSWR<RouteDetail>(
    id ? `/api/routes/${id}` : null,
    fetcher,
    { refreshInterval: 10000 },
  );

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/routes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to routes
          </Button>
        </Link>
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedStopIds = new Set(data.pickupLogs.map((l) => l.routeStopId));
  const pickupLogByStop = new Map<string, PickupLog>();
  for (const log of data.pickupLogs) {
    pickupLogByStop.set(log.routeStopId, log);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/routes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to routes
          </Button>
        </Link>
        <Link href={`/routes/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 size-4" />
            Edit route
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>
              {new Date(data.scheduledDate).toLocaleDateString()} •{" "}
              {data.area.name} • Truck {data.truck.code}
            </span>
            {data.driver && (
              <span>• Driver: {data.driver.name}</span>
            )}
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 font-medium capitalize">
              {data.status.toLowerCase().replace("_", " ")}
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
          <p className="text-sm text-muted-foreground">
            Route stops on map (green = completed, gray = pending)
          </p>
        </CardHeader>
        <CardContent>
          <RouteMap stops={data.stops} completedStopIds={completedStopIds} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stops & pickups</CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.pickupLogs.length} of {data.stops.length} stops completed
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.stops.map((stop) => {
            const isCompleted = completedStopIds.has(stop.id);
            const log = pickupLogByStop.get(stop.id);

            return (
              <div
                key={stop.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-start gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      #{stop.sequence} {stop.name ?? stop.address ?? "Stop"}
                    </p>
                    {stop.address && (
                      <p className="text-sm text-muted-foreground">
                        {stop.address}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{stop.type.toLowerCase()}</span>
                      {stop.expectedVolumeKg != null && (
                        <span>Expected: {stop.expectedVolumeKg} kg</span>
                      )}
                    </div>
                    {log && (
                      <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm">
                        <p className="font-medium text-foreground">
                          Picked up by {log.completedBy.name}
                        </p>
                        <p className="text-muted-foreground">
                          {new Date(log.completedAt).toLocaleString()}
                        </p>
                        {log.actualVolumeKg != null && (
                          <p>Volume: {log.actualVolumeKg} kg</p>
                        )}
                        {log.notes && (
                          <p className="mt-1 italic">{log.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!data.stops.length && (
            <p className="text-sm text-muted-foreground">
              This route has no stops.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
