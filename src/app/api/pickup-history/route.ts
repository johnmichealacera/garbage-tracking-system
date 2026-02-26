import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER", "DRIVER"]);

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
  const routeId = searchParams.get("routeId") ?? undefined;

  const where: { routeId?: string } = {};
  if (routeId) where.routeId = routeId;

  // Drivers see only their own pickups
  const user = session!.user as { id: string; role: string };
  if (user.role === "DRIVER") {
    (where as { completedById: string }).completedById = user.id;
  }

  const logs = await db.pickupLog.findMany({
    where,
    orderBy: { completedAt: "desc" },
    take: limit,
    include: {
      completedBy: { select: { id: true, name: true, email: true } },
      route: {
        select: {
          id: true,
          name: true,
          scheduledDate: true,
          area: { select: { name: true } },
        },
      },
      routeStop: {
        select: {
          id: true,
          sequence: true,
          name: true,
          address: true,
        },
      },
    },
  });

  return NextResponse.json(logs);
}
