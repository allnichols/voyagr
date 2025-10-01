import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const doesUserExist = await prisma.user.findUnique({ where: { email } });
  if (doesUserExist) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 },
    );
  }

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return NextResponse.json({ user });
}
