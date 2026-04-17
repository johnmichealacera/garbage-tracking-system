"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, MapPin, Package, Scale, User } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

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

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function PickupHistoryPage() {
  const { data, error, isLoading } = useSWR<PickupLogItem[]>(
    "/api/pickup-history",
    fetcher,
    { refreshInterval: 10000 },
  );

  const totalVolume = (data ?? []).reduce(
    (sum, log) => sum + (log.actualVolumeKg ?? 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Activity"
        icon={<Package className="size-5" />}
        title="Pickup history"
        description="Latest garbage pickups across all routes, refreshed automatically every few seconds."
      />

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Recent pickups
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${data?.length ?? 0} entries · ${totalVolume} kg collected`}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data?.length ? (
            <ul className="space-y-3">
              {data.map((log) => {
                const stopLabel =
                  log.routeStop.name ??
                  log.routeStop.address ??
                  `Stop #${log.routeStop.sequence}`;
                return (
                  <li key={log.id}>
                    <Link
                      href={`/routes/${log.route.id}`}
                      className="group relative block overflow-hidden rounded-xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/30 hover:bg-background hover:shadow-md"
                    >
                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/8 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                      <div className="relative flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                            <Package className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {stopLabel}
                            </p>
                            <p className="mt-0.5 inline-flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground/80">
                                {log.route.name}
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="size-3" />
                                {log.route.area.name}
                              </span>
                            </p>
                            <p className="mt-1 inline-flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span>
                                {dateTimeFormatter.format(
                                  new Date(log.completedAt),
                                )}
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1">
                                <User className="size-3" />
                                {log.completedBy.name}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {log.actualVolumeKg != null ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-500/25 dark:text-teal-400">
                              <Scale className="size-3" />
                              {log.actualVolumeKg} kg
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            View route
                            <ArrowUpRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                      {log.notes ? (
                        <p className="relative mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs italic text-muted-foreground">
                          “{log.notes}”
                        </p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Package className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium">No pickups yet</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Once drivers begin logging pickups, they will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
