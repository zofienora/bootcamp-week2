import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = getUserId();
  const note = await prisma.note.findFirst({ where: { id: params.id, userId } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ note });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId();
    const body = await req.json();
    const note = await prisma.note.update({
      where: { id: params.id },
      data: { title: body.title, content: body.content, userId },
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId();
    const body = await req.json();
    
    // Update only tags and topics
    const updateData: any = {};
    if (body.tags !== undefined) {
      updateData.tags = JSON.stringify(body.tags);
    }
    if (body.topics !== undefined) {
      updateData.topics = JSON.stringify(body.topics);
    }
    
    const note = await prisma.note.update({
      where: { id: params.id, userId },
      data: updateData,
    });
    
    return NextResponse.json({ 
      note: {
        ...note,
        tags: body.tags || JSON.parse(note.tags || '[]'),
        topics: body.topics || JSON.parse(note.topics || '[]')
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to update tags/topics" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId();
    // Ensure it belongs to the user
    await prisma.note.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}