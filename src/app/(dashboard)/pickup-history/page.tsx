"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowLeft } from "lucide-react";

interface PickupLogItem {
  id: string;
  completedAt: string;
  actualVolumeKg: number | null;
  notes: string | null;
  completedBy: { id: string; name: string; email: string };
  route: {
    id: string;
    name: string;
    scheduledDate: string;
    area: { name: string };
  };
  routeStop: {
    id: string;
    sequence: number;
    name: string | null;
    address: string | null;
  };
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to load pickup history");
    return res.json();
  });

export default function PickupHistoryPage() {
  const { data, error, isLoading } = useSWR<PickupLogItem[]>(
    "/api/pickup-history",
    fetcher,
    { refreshInterval: 10000 },
  );

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Pickup history</h1>
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pickup history</h1>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer transition-colors hover:bg-accent"
          >
            <ArrowLeft className="mr-2 size-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Recent pickups
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest garbage pickups across all routes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.map((log) => (
              <Link
                key={log.id}
                href={`/routes/${log.route.id}`}
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {log.routeStop.name ?? log.routeStop.address ?? `Stop #${log.routeStop.sequence}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.route.name} • {log.route.area.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(log.completedAt).toLocaleString()} • by{" "}
                      {log.completedBy.name}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {log.actualVolumeKg != null && (
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {log.actualVolumeKg} kg
                      </span>
                    )}
                  </div>
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    {log.notes}
                  </p>
                )}
              </Link>
            ))}
            {!data?.length && (
              <p className="py-8 text-center text-muted-foreground">
                No pickups recorded yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
