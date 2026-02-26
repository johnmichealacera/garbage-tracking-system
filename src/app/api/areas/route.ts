import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const areas = await db.area.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(areas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const body = await request.json();

  const area = await db.area.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      centerLat: body.centerLat ?? null,
      centerLng: body.centerLng ?? null,
    },
  });

  return NextResponse.json(area, { status: 201 });
}

