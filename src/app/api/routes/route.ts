import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const areaId = searchParams.get("areaId");

  const where: Record<string, unknown> = {};

  if (date) {
    const day = new Date(date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    where.scheduledDate = {
      gte: day,
      lt: nextDay,
    };
  }

  if (areaId) {
    where.areaId = areaId;
  }

  const routes = await db.route.findMany({
    where,
    include: {
      truck: true,
      area: true,
      stops: true,
      pickupLogs: true,
    },
    orderBy: { scheduledDate: "asc" },
  });

  return NextResponse.json(routes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const body = await request.json();

  const route = await db.route.create({
    data: {
      name: body.name,
      scheduledDate: new Date(body.scheduledDate),
      status: body.status ?? "PLANNED",
      truckId: body.truckId,
      areaId: body.areaId,
      driverId: body.driverId ?? null,
      stops: {
        create:
          body.stops?.map((stop: any, index: number) => ({
            sequence: stop.sequence ?? index + 1,
            name: stop.name ?? null,
            address: stop.address ?? null,
            latitude: stop.latitude ?? null,
            longitude: stop.longitude ?? null,
            eta: stop.eta ? new Date(stop.eta) : null,
            type: stop.type ?? "RESIDENTIAL",
            expectedVolumeKg: stop.expectedVolumeKg ?? null,
          })) ?? [],
      },
    },
    include: {
      stops: true,
    },
  });

  return NextResponse.json(route, { status: 201 });
}

