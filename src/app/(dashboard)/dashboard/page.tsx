"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryResponse {
  totalPickups: number;
  totalVolumeKg: number;
  byDay: { date: string; count: number; volumeKg: number }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data } = useSWR<SummaryResponse>(
    "/api/report/summary",
    fetcher,
  );

  const today = data?.byDay.at(-1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {data?.totalPickups ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total volume (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {data?.totalVolumeKg ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {today?.count ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

