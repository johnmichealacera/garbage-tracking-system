import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN"]);

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

  const logs = await db.pickupLog.findMany({
    where,
    include: {
      route: {
        include: {
          area: true,
        },
      },
    },
  });

  const byDay = new Map<string, { count: number; volumeKg: number }>();
  const byArea = new Map<string, { areaName: string; count: number; volumeKg: number }>();

  for (const log of logs) {
    const dayKey = log.completedAt.toISOString().slice(0, 10);
    const volume = log.actualVolumeKg ?? 0;

    const day = byDay.get(dayKey) ?? { count: 0, volumeKg: 0 };
    day.count += 1;
    day.volumeKg += volume;
    byDay.set(dayKey, day);

    const areaId = log.route.areaId;
    const areaName = log.route.area.name;
    const area = byArea.get(areaId) ?? { areaName, count: 0, volumeKg: 0 };
    area.count += 1;
    area.volumeKg += volume;
    byArea.set(areaId, area);
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
      ...value,
    })),
  });
}

