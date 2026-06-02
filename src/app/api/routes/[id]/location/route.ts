import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const STALE_MS = 5 * 60 * 1000; // hide marker after 5 minutes of no update

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const route = await db.route.findUnique({
    where: { id },
    select: { driverId: true, status: true },
  });

  if (!route?.driverId) return NextResponse.json(null);
  if (route.status === "COMPLETED" || route.status === "CANCELLED") {
    return NextResponse.json(null);
  }

  const loc = await db.driverLocation.findUnique({
    where: { userId: route.driverId },
    select: { latitude: true, longitude: true, updatedAt: true, routeId: true },
  });

  if (!loc) return NextResponse.json(null);
  if (loc.routeId !== id) return NextResponse.json(null);
  if (Date.now() - loc.updatedAt.getTime() > STALE_MS) return NextResponse.json(null);

  return NextResponse.json({
    latitude: loc.latitude,
    longitude: loc.longitude,
    updatedAt: loc.updatedAt.toISOString(),
  });
}
