import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN"]);

  const currentUserId = (session!.user as { id?: string }).id;
  if (id === currentUserId) {
    return NextResponse.json(
      { message: "You cannot deactivate your own account." },
      { status: 403 },
    );
  }

  const body = await request.json();

  const user = await db.user.update({
    where: { id },
    data: {
      ...(typeof body.isActive === "boolean" ? { isActive: body.isActive } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
