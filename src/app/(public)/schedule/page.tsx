"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Circle } from "lucide-react";

interface ScheduleStop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  isCompleted: boolean;
  isMissed: boolean;
}

interface ScheduleRoute {
  id: string;
  name: string;
  area: string;
  truck: string;
  driver: string;
  status: string;
  totalStops: number;
  completedStops: number;
  missedStops: number;
  pendingStops: number;
  stops: ScheduleStop[];
}

interface ScheduleResponse {
  date: string;
  routes: ScheduleRoute[];
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to load schedule");
    return res.json();
  });

export default function PublicSchedulePage() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const { data, error } = useSWR<ScheduleResponse>(
    `/api/public/schedule?date=${date}`,
    fetcher,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Socorro Garbage Collection Schedule
          </h1>
          <p className="mt-2 text-muted-foreground">
            Municipality of Socorro, Surigao del Norte
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Collection schedule</CardTitle>
            <p className="text-sm text-muted-foreground">
              View garbage collection routes and status. No login required.
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label htmlFor="date" className="mb-2 block text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="max-w-xs"
              />
            </div>

            {error && (
              <p className="text-destructive">{error.message}</p>
            )}

            {data && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {data.routes.length} route(s) scheduled for{" "}
                  {new Date(data.date).toLocaleDateString("en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {data.routes.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No collection routes scheduled for this date.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.routes.map((route) => (
                      <Card key={route.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {route.area} – {route.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>Truck {route.truck}</span>
                            <span>•</span>
                            <span>Driver: {route.driver}</span>
                            <span>•</span>
                            <span
                              className="rounded-full px-2 py-0.5 font-medium capitalize"
                              style={{
                                backgroundColor:
                                  route.status === "COMPLETED"
                                    ? "hsl(var(--chart-2))"
                                    : route.status === "IN_PROGRESS"
                                      ? "hsl(var(--chart-3))"
                                      : "hsl(var(--muted))",
                              }}
                            >
                              {route.status.toLowerCase().replace("_", " ")}
                            </span>
                            <span>•</span>
                            <span>
                              {route.completedStops}/{route.totalStops} completed
                              {route.missedStops > 0 &&
                                `, ${route.missedStops} missed`}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {route.stops.map((stop) => (
                              <div
                                key={stop.id}
                                className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
                              >
                                {stop.isCompleted ? (
                                  <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                                ) : stop.isMissed ? (
                                  <XCircle className="size-4 shrink-0 text-amber-500" />
                                ) : (
                                  <Circle className="size-4 shrink-0 text-muted-foreground" />
                                )}
                                <span className="font-medium">
                                  #{stop.sequence}{" "}
                                  {stop.name ?? stop.address ?? "Stop"}
                                </span>
                                {stop.address && stop.name && (
                                  <span className="text-muted-foreground">
                                    – {stop.address}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Garbage Tracking System • Socorro LGU • Surigao del Norte
        </p>
      </div>
    </div>
  );
}
