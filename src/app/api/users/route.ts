import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, assertRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN"]);

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  assertRole(session, ["ADMIN"]);

  const body = await request.json();
  const { name, email, role, password } = body;

  if (!name?.trim() || !email?.trim() || !role || !password) {
    return NextResponse.json(
      { message: "Name, email, role, and password are required." },
      { status: 400 },
    );
  }

  const existing = await db.user.findUnique({ where: { email: email.trim() } });
  if (existing) {
    return NextResponse.json(
      { message: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const hashedPassword = await hash(password, 10);

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
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

  return NextResponse.json(user, { status: 201 });
}
