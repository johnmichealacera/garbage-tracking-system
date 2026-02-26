import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  assertRole(session, ["DRIVER"]);

  const userId = session!.user.id;

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  const route = await db.route.findFirst({
    where: {
      driverId: userId,
      scheduledDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      truck: true,
      area: true,
      stops: {
        orderBy: { sequence: "asc" },
      },
      pickupLogs: true,
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });

  if (!route) {
    return NextResponse.json(
      { message: "No route assigned for today." },
      { status: 404 },
    );
  }

  return NextResponse.json(route);
}

