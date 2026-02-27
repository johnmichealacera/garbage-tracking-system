"use client";

import useSWR from "swr";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="h-64">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="h-64">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reporting</h1>
      <p className="text-sm text-muted-foreground">
        Barangay-level pickup and missed stop analytics for Socorro
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium">From</p>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium">To</p>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pickups per day</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data?.byDay?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="currentColor" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                No data for selected period.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pickups per barangay</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data?.byArea?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byArea}>
                  <XAxis dataKey="areaName" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="currentColor" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                No data for selected period.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {data?.byArea?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Barangay summary table</CardTitle>
            <p className="text-sm text-muted-foreground">
              Pickups and missed stops by barangay (Socorro)
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="text-left py-2 pr-4">Barangay</th>
                    <th className="text-right py-2 pr-4">Pickups</th>
                    <th className="text-right py-2 pr-4">Volume (kg)</th>
                    <th className="text-right py-2 pr-4">Missed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byArea.map((row) => (
                    <tr key={row.areaId} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{row.areaName}</td>
                      <td className="py-2 pr-4 text-right">{row.count}</td>
                      <td className="py-2 pr-4 text-right">{row.volumeKg}</td>
                      <td className="py-2 pr-4 text-right">
                        {row.missedCount > 0 ? (
                          <span className="text-amber-600 dark:text-amber-500">
                            {row.missedCount}
                          </span>
                        ) : (
                          "0"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

