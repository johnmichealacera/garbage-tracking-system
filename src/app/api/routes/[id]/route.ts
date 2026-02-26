import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER", "DRIVER"]);

  const route = await db.route.findUnique({
    where: { id },
    include: {
      truck: true,
      area: true,
      stops: {
        orderBy: { sequence: "asc" },
      },
      pickupLogs: true,
    },
  });

  if (!route) {
    return NextResponse.json({ message: "Route not found" }, { status: 404 });
  }

  return NextResponse.json(route);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const body = await request.json();

  const updated = await db.$transaction(async (tx) => {
    await tx.route.update({
      where: { id },
      data: {
        name: body.name,
        scheduledDate: body.scheduledDate
          ? new Date(body.scheduledDate)
          : undefined,
        status: body.status,
        truckId: body.truckId,
        areaId: body.areaId,
        driverId: body.driverId ?? null,
      },
    });

    if (Array.isArray(body.stops)) {
      await tx.routeStop.deleteMany({
        where: { routeId: id },
      });

      await tx.routeStop.createMany({
        data: body.stops.map((stop: any, index: number) => ({
          routeId: id,
          sequence: stop.sequence ?? index + 1,
          name: stop.name ?? null,
          address: stop.address ?? null,
          latitude: stop.latitude ?? null,
          longitude: stop.longitude ?? null,
          eta: stop.eta ? new Date(stop.eta) : null,
          type: stop.type ?? "RESIDENTIAL",
          expectedVolumeKg: stop.expectedVolumeKg ?? null,
        })),
      });
    }

    return tx.route.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { sequence: "asc" },
        },
      },
    });
  });

  return NextResponse.json(updated);
}

