import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["DRIVER"]);

  const userId = session!.user.id;
  const body = await request.json();
  const { latitude, longitude, routeId } = body as {
    latitude: unknown;
    longitude: unknown;
    routeId: unknown;
  };

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 });
  }

  await db.driverLocation.upsert({
    where: { userId },
    update: { latitude, longitude, routeId: typeof routeId === "string" ? routeId : null },
    create: { userId, latitude, longitude, routeId: typeof routeId === "string" ? routeId : null },
  });

  return NextResponse.json({ ok: true });
}
