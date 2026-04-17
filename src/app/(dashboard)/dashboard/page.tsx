"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Package,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SummaryResponse {
  totalPickups: number;
  totalVolumeKg: number;
  byDay: { date: string; count: number; volumeKg: number }[];
  byArea?: {
    areaId: string;
    areaName: string;
    count: number;
    volumeKg: number;
    missedCount: number;
  }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const numberFormatter = new Intl.NumberFormat("en-US");
const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

function formatNumber(value: number | undefined): string {
  return numberFormatter.format(value ?? 0);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useSWR<SummaryResponse>(
    "/api/report/summary",
    fetcher,
  );

  const utcDayKey = new Date().toISOString().slice(0, 10);
  const todayPickups =
    data?.byDay.find((d) => d.date === utcDayKey)?.count ?? 0;
  const todayVolume =
    data?.byDay.find((d) => d.date === utcDayKey)?.volumeKg ?? 0;

  const recentDays = (data?.byDay ?? [])
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  const topAreas = (data?.byArea ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const displayName =
    session?.user?.name?.split(" ")[0] ??
    session?.user?.email?.split("@")[0] ??
    "there";
  const role = session?.user?.role?.toLowerCase() ?? "team member";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10 sm:p-7">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {getGreeting()}
            </p>
            <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-primary to-teal-600 bg-clip-text text-transparent dark:from-primary dark:to-teal-400">
                {displayName}
              </span>
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Here is a quick look at today&apos;s collection activity across
              Socorro. You are signed in as{" "}
              <span className="font-medium capitalize text-foreground/90">
                {role}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/routes"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/25 bg-background/80 px-4 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-primary/5 hover:shadow-md"
            >
              <CalendarDays className="size-4 text-primary" />
              View routes
              <ArrowUpRight className="size-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/reporting"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg"
            >
              <TrendingUp className="size-4" />
              Open reporting
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total pickups"
          value={formatNumber(data?.totalPickups)}
          helper="Across all routes"
          icon={<Package className="size-5" />}
          accent="from-primary/15 to-primary/0 text-primary"
        />
        <StatCard
          label="Total volume"
          value={`${formatNumber(data?.totalVolumeKg)} kg`}
          helper="Recorded collection weight"
          icon={<Scale className="size-5" />}
          accent="from-teal-500/15 to-teal-500/0 text-teal-600 dark:text-teal-400"
        />
        <StatCard
          label="Today's pickups"
          value={formatNumber(todayPickups)}
          helper={`${formatNumber(todayVolume)} kg collected today`}
          icon={<Activity className="size-5" />}
          accent="from-emerald-500/15 to-emerald-500/0 text-emerald-600 dark:text-emerald-400"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Recent days
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest collection activity at a glance
              </p>
            </div>
            <Link
              href="/pickup-history"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              History <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentDays.length ? (
              <ul className="divide-y divide-border/60">
                {recentDays.map((day) => {
                  const max = Math.max(
                    ...recentDays.map((d) => d.count),
                    1,
                  );
                  const pct = Math.max((day.count / max) * 100, 6);
                  const dateObj = new Date(day.date);
                  return (
                    <li
                      key={day.date}
                      className="flex items-center gap-4 py-3"
                    >
                      <div className="w-28 shrink-0">
                        <p className="text-sm font-medium">
                          {dayLabelFormatter.format(dateObj)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatNumber(day.volumeKg)} kg
                        </p>
                      </div>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-teal-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums">
                        {formatNumber(day.count)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                title="No recent activity"
                description="Once pickups are logged, they will appear here."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Top barangays
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                By number of pickups
              </p>
            </div>
            <Link
              href="/reporting"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Reports <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {topAreas.length ? (
              <ul className="space-y-3">
                {topAreas.map((area, idx) => (
                  <li
                    key={area.areaId}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3 transition-colors hover:bg-background"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                        idx === 0
                          ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {area.areaName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatNumber(area.volumeKg)} kg ·{" "}
                        {area.missedCount > 0 ? (
                          <span className="text-amber-600 dark:text-amber-500">
                            {area.missedCount} missed
                          </span>
                        ) : (
                          "no missed stops"
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">
                      {formatNumber(area.count)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No barangay data yet"
                description="Top areas will show once pickups have been recorded."
              />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, helper, icon, accent }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:ring-white/10">
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br opacity-90 blur-2xl",
          accent,
        )}
        aria-hidden
      />
      <CardContent className="relative flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ring-1 ring-inset ring-black/5 dark:ring-white/10",
            accent,
          )}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
