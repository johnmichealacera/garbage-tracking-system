import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const trucks = await db.truck.findMany({
    orderBy: { code: "asc" },
  });

  return NextResponse.json(trucks);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const body = await request.json();

  const truck = await db.truck.create({
    data: {
      code: body.code,
      plateNumber: body.plateNumber ?? null,
      capacityKg: body.capacityKg ?? null,
      status: body.status ?? "ACTIVE",
      currentAreaId: body.currentAreaId ?? null,
    },
  });

  return NextResponse.json(truck, { status: 201 });
}

