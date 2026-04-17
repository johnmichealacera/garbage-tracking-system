"use client";

import useSWR from "swr";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Package, Scale, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import React from "react";

interface SummaryResponse {
  totalPickups: number;
  totalVolumeKg: number;
  byDay: { date: string; count: number; volumeKg: number }[];
  byArea: {
    areaId: string;
    areaName: string;
    count: number;
    volumeKg: number;
    missedCount: number;
  }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber(value: number | undefined): string {
  return numberFormatter.format(value ?? 0);
}

export default function ReportingPage() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const { data, isLoading } = useSWR<SummaryResponse>(
    `/api/report/summary${params.toString() ? `?${params.toString()}` : ""}`,
    fetcher,
  );

  const totalMissed = (data?.byArea ?? []).reduce(
    (sum, a) => sum + a.missedCount,
    0,
  );
  const hasFilters = Boolean(from || to);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Insights"
        icon={<BarChart3 className="size-5" />}
        title="Reporting"
        description="Barangay-level pickup and missed stop analytics for the Municipality of Socorro."
      />

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold tracking-tight">
            Date range
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Leave blank to include all recorded activity.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              From
            </p>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 bg-background/80"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              To
            </p>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 bg-background/80"
            />
          </div>
          <div className="flex items-end">
            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2"
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
              >
                Clear dates
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total pickups"
          value={
            isLoading ? undefined : formatNumber(data?.totalPickups)
          }
          icon={<Package className="size-5" />}
          accent="from-primary/15 to-primary/0 text-primary"
        />
        <SummaryCard
          label="Total volume"
          value={
            isLoading
              ? undefined
              : `${formatNumber(data?.totalVolumeKg)} kg`
          }
          icon={<Scale className="size-5" />}
          accent="from-teal-500/15 to-teal-500/0 text-teal-600 dark:text-teal-400"
        />
        <SummaryCard
          label="Missed stops"
          value={isLoading ? undefined : formatNumber(totalMissed)}
          icon={<AlertTriangle className="size-5" />}
          accent="from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-400"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold tracking-tight">
              Pickups per day
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Trend of collection activity
            </p>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : data?.byDay?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.byDay}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barPrimary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPanel message="No data for selected period." />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold tracking-tight">
              Pickups per barangay
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Coverage distribution across areas
            </p>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : data?.byArea?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.byArea}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#14b8a6"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor="#14b8a6"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="areaName"
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barTeal)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPanel message="No data for selected period." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Barangay summary
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pickups and missed stops by barangay
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.byArea?.length ? (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 text-left">Barangay</th>
                      <th className="px-4 py-2.5 text-right">Pickups</th>
                      <th className="px-4 py-2.5 text-right">Volume (kg)</th>
                      <th className="px-4 py-2.5 text-right">Missed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byArea.map((row) => (
                      <tr
                        key={row.areaId}
                        className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 align-middle font-medium">
                          {row.areaName}
                        </td>
                        <td className="px-4 py-3 text-right align-middle tabular-nums">
                          {formatNumber(row.count)}
                        </td>
                        <td className="px-4 py-3 text-right align-middle tabular-nums text-muted-foreground">
                          {formatNumber(row.volumeKg)}
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          {row.missedCount > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:text-amber-400">
                              <AlertTriangle className="size-3" />
                              {row.missedCount}
                            </span>
                          ) : (
                            <span className="tabular-nums text-muted-foreground">
                              0
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyPanel message="No summary data yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
  accent: string;
}

function SummaryCard({ label, value, icon, accent }: SummaryCardProps) {
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
          {value === undefined ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {value}
            </p>
          )}
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

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
