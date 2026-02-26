import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; stopId: string }> },
) {
  const { id, stopId } = await params;
  const session = await getServerSession(authOptions);
  assertRole(session, ["DRIVER", "ADMIN", "DISPATCHER"]);

  const userId = session!.user.id;
  const body = await request.json().catch(() => ({}));

  const log = await db.pickupLog.create({
    data: {
      routeId: id,
      routeStopId: stopId,
      completedById: userId,
      completedAt: body.completedAt ? new Date(body.completedAt) : new Date(),
      actualVolumeKg: body.actualVolumeKg ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json(log, { status: 201 });
}

