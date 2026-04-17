import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getTodayInPhilippinesYmd,
  getUtcBoundsForPhilippinesDay,
} from "@/lib/philippine-time";

/**
 * Public API - no auth required.
 * Returns collection schedule for a date with area, truck, and stop details for display.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const requestedYmd = dateParam ?? getTodayInPhilippinesYmd();

  let startUtc: Date;
  let endUtc: Date;
  let canonicalYmd: string;
  try {
    ({ startUtc, endUtc, canonicalYmd } =
      getUtcBoundsForPhilippinesDay(requestedYmd));
  } catch {
    return NextResponse.json(
      { message: "Invalid date. Expected YYYY-MM-DD." },
      { status: 400 },
    );
  }

  const routes = await db.route.findMany({
    where: {
      scheduledDate: {
        gte: startUtc,
        lt: endUtc,
      },
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          description: true,
          centerLat: true,
          centerLng: true,
        },
      },
      truck: {
        select: {
          code: true,
          plateNumber: true,
          capacityKg: true,
        },
      },
      driver: {
        select: { name: true },
      },
      stops: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
          sequence: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          type: true,
          expectedVolumeKg: true,
        },
      },
      pickupLogs: { select: { routeStopId: true } },
      missedStops: { select: { routeStopId: true } },
    },
    orderBy: [{ area: { name: "asc" } }, { name: "asc" }],
  });

  const schedule = routes.map((r) => ({
    id: r.id,
    name: r.name,
    scheduledDate: r.scheduledDate.toISOString(),
    area: {
      id: r.area.id,
      name: r.area.name,
      description: r.area.description,
      centerLat: r.area.centerLat,
      centerLng: r.area.centerLng,
    },
    truck: {
      code: r.truck.code,
      plateNumber: r.truck.plateNumber,
      capacityKg: r.truck.capacityKg,
    },
    driver: {
      name: r.driver?.name ?? "Unassigned",
    },
    status: r.status,
    totalStops: r.stops.length,
    completedStops: r.pickupLogs.length,
    missedStops: r.missedStops.length,
    pendingStops:
      r.stops.length - r.pickupLogs.length - r.missedStops.length,
    stops: r.stops.map((s) => ({
      id: s.id,
      sequence: s.sequence,
      name: s.name,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      type: s.type,
      expectedVolumeKg: s.expectedVolumeKg,
      isCompleted: r.pickupLogs.some((p) => p.routeStopId === s.id),
      isMissed: r.missedStops.some((m) => m.routeStopId === s.id),
    })),
  }));

  return NextResponse.json({
    date: canonicalYmd,
    routes: schedule,
  });
}
