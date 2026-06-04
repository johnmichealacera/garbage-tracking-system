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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN"]);

  const currentUserId = (session!.user as { id?: string }).id;
  if (id === currentUserId) {
    return NextResponse.json(
      { message: "You cannot delete your own account." },
      { status: 403 },
    );
  }

  const target = await db.user.findUnique({
    where: { id },
    select: { role: true, name: true },
  });

  if (!target) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  // Prevent deleting the last admin
  if (target.role === "ADMIN") {
    const adminCount = await db.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { message: "Cannot delete the only administrator account." },
        { status: 409 },
      );
    }
  }

  // Prevent deletion if the user has logged pickups or reported missed stops
  const [pickupCount, missedCount] = await Promise.all([
    db.pickupLog.count({ where: { completedById: id } }),
    db.missedStop.count({ where: { reportedById: id } }),
  ]);

  if (pickupCount > 0 || missedCount > 0) {
    return NextResponse.json(
      {
        message:
          `Cannot delete ${target.name} — they have existing pickup records. Deactivate instead.`,
      },
      { status: 409 },
    );
  }

  await db.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
