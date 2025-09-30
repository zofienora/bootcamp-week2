import { NextResponse } from "next/server";
import { findRelatedNotes } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const userId = getUserId();
    
    // Get all user's notes
    const existingNotes = await prisma.note.findMany({
      where: { userId },
      select: { id: true, title: true, content: true }
    });

    const relatedNotes = await findRelatedNotes(content, existingNotes);
    
    return NextResponse.json({ relatedNotes });
  } catch (error) {
    console.error("AI Related Notes Error:", error);
    return NextResponse.json({ error: "Failed to find related notes" }, { status: 500 });
  }
}
