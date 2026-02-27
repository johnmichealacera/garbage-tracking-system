import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER", "DRIVER"]);

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};

  if (from || to) {
    const gte = from ? new Date(from) : undefined;
    const lte = to ? new Date(to) : undefined;

    where.completedAt = {
      ...(gte ? { gte } : {}),
      ...(lte ? { lte } : {}),
    };
  }

  const [logs, missedCounts] = await Promise.all([
    db.pickupLog.findMany({
      where,
      include: {
        route: {
          include: {
            area: true,
          },
        },
      },
    }),
    db.missedStop.groupBy({
      by: ["routeId"],
      where:
        from || to
          ? {
              reportedAt: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : undefined,
      _count: { id: true },
    }),
  ]);

  const missedByRoute = new Map(
    missedCounts.map((m) => [m.routeId, m._count.id]),
  );

  const byDay = new Map<string, { count: number; volumeKg: number }>();
  const byArea = new Map<string, { areaName: string; count: number; volumeKg: number; missedCount: number }>();

  for (const log of logs) {
    const dayKey = log.completedAt.toISOString().slice(0, 10);
    const volume = log.actualVolumeKg ?? 0;

    const day = byDay.get(dayKey) ?? { count: 0, volumeKg: 0 };
    day.count += 1;
    day.volumeKg += volume;
    byDay.set(dayKey, day);

    const areaId = log.route.areaId;
    const areaName = log.route.area.name;
    const area = byArea.get(areaId) ?? { areaName, count: 0, volumeKg: 0, missedCount: 0 };
    area.count += 1;
    area.volumeKg += volume;
    byArea.set(areaId, area);
  }

  // Add missed stops to area totals (from routes in that area)
  const routesWithMissed = await db.route.findMany({
    where: { id: { in: missedCounts.map((m) => m.routeId) } },
    select: { id: true, areaId: true },
  });
  for (const r of routesWithMissed) {
    const missed = missedByRoute.get(r.id) ?? 0;
    const area = byArea.get(r.areaId);
    if (area) {
      area.missedCount = (area.missedCount ?? 0) + missed;
    } else {
      const areaData = await db.area.findUnique({ where: { id: r.areaId } });
      if (areaData) {
        byArea.set(r.areaId, {
          areaName: areaData.name,
          count: 0,
          volumeKg: 0,
          missedCount: missed,
        });
      }
    }
  }

  return NextResponse.json({
    totalPickups: logs.length,
    totalVolumeKg: logs.reduce(
      (sum, l) => sum + (l.actualVolumeKg ?? 0),
      0,
    ),
    byDay: Array.from(byDay.entries()).map(([date, value]) => ({
      date,
      ...value,
    })),
    byArea: Array.from(byArea.entries()).map(([areaId, value]) => ({
      areaId,
      areaName: value.areaName,
      count: value.count,
      volumeKg: value.volumeKg,
      missedCount: value.missedCount ?? 0,
    })),
  });
}

