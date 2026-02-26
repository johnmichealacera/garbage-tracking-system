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
  }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReportingPage() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const { data } = useSWR<SummaryResponse>(
    `/api/report/summary${params.toString() ? `?${params.toString()}` : ""}`,
    fetcher,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reporting</h1>

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
            <CardTitle>Pickups per area</CardTitle>
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
    </div>
  );
}

