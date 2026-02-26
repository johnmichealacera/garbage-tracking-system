import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN", "DISPATCHER"]);

  const drivers = await db.user.findMany({
    where: { role: "DRIVER", isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(drivers);
}
