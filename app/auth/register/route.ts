// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // We'll set up Prisma client in /lib/prisma.ts
import { hashPassword } from "@/lib/auth";  // For hashing the password

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Hash the password before storing
  const hashedPassword = await hashPassword(password);

  // Store the new user in the database
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
