import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET() {
  const userId = getUserId();
  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  try {
    const userId = getUserId();
    const body = await req.json();
    if (!body?.title || !body?.content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        userId,
      },
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}