"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Area {
  id: string;
  name: string;
}

interface RouteStop {
  id: string;
}

interface PickupLog {
  id: string;
}

interface Truck {
  code: string;
}

interface Route {
  id: string;
  name: string;
  scheduledDate: string;
  status: string;
  area: Area;
  truck: Truck;
  stops: RouteStop[];
  pickupLogs: PickupLog[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoutesPage() {
  const [date, setDate] = useState("");
  const [areaId, setAreaId] = useState("");

  const { data: areas } = useSWR<Area[]>("/api/areas", fetcher);

  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (areaId) params.set("areaId", areaId);

  const { data: routes } = useSWR<Route[]>(
    `/api/routes${params.toString() ? `?${params.toString()}` : ""}`,
    fetcher,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Routes</h1>
        <Link href="/routes/new">
          <Button>Create route</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium">Date</p>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium">Area</p>
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="">All</option>
              {areas?.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Area</th>
                  <th className="text-left py-2 pr-4">Truck</th>
                  <th className="text-left py-2 pr-4">Stops</th>
                  <th className="text-left py-2 pr-4">Completed</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {routes?.map((route) => {
                  const totalStops = route.stops.length;
                  const completed = route.pickupLogs.length;
                  const dateLabel = new Date(
                    route.scheduledDate,
                  ).toLocaleDateString();
                  return (
                    <tr key={route.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{dateLabel}</td>
                      <td className="py-2 pr-4">{route.name}</td>
                      <td className="py-2 pr-4">{route.area?.name}</td>
                      <td className="py-2 pr-4">{route.truck?.code}</td>
                      <td className="py-2 pr-4">{totalStops}</td>
                      <td className="py-2 pr-4">
                        {completed}/{totalStops}
                      </td>
                      <td className="py-2 pr-4">{route.status}</td>
                      <td className="py-2 pr-4">
                        <Link href={`/routes/${route.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {!routes?.length && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-4 text-center text-muted-foreground"
                    >
                      No routes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

