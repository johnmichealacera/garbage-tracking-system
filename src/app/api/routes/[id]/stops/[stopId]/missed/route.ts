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
  const reason = body.reason ?? null;

  const missed = await db.missedStop.create({
    data: {
      routeId: id,
      routeStopId: stopId,
      reportedById: userId,
      reason,
    },
  });

  return NextResponse.json(missed, { status: 201 });
}
