import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public API - no auth required.
 * Returns today's collection schedule for Socorro barangays.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  const targetDate = dateParam
    ? new Date(dateParam)
    : new Date();
  const startOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const endOfDay = new Date(startOfDay.getTime() + 86400000);

  const routes = await db.route.findMany({
    where: {
      scheduledDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      area: { select: { id: true, name: true } },
      truck: { select: { code: true } },
      driver: { select: { name: true } },
      stops: { orderBy: { sequence: "asc" }, select: { id: true, sequence: true, name: true, address: true } },
      pickupLogs: { select: { routeStopId: true } },
      missedStops: { select: { routeStopId: true } },
    },
    orderBy: { scheduledDate: "asc" },
  });

  const schedule = routes.map((r) => ({
    id: r.id,
    name: r.name,
    area: r.area.name,
    truck: r.truck.code,
    driver: r.driver?.name ?? "Unassigned",
    status: r.status,
    totalStops: r.stops.length,
    completedStops: r.pickupLogs.length,
    missedStops: r.missedStops.length,
    pendingStops: r.stops.length - r.pickupLogs.length - r.missedStops.length,
    stops: r.stops.map((s) => ({
      id: s.id,
      sequence: s.sequence,
      name: s.name,
      address: s.address,
      isCompleted: r.pickupLogs.some((p) => p.routeStopId === s.id),
      isMissed: r.missedStops.some((m) => m.routeStopId === s.id),
    })),
  }));

  return NextResponse.json({
    date: startOfDay.toISOString().slice(0, 10),
    routes: schedule,
  });
}
