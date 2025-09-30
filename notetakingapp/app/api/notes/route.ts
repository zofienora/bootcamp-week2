import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { analyzeNote } from "@/lib/ai";

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

    // Get AI analysis
    let analysis = null;
    try {
      analysis = await analyzeNote(body.content, body.title);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Continue without AI analysis
    }
    
    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        tags: analysis ? JSON.stringify(analysis.tags) : null,
        topics: analysis ? JSON.stringify(analysis.topics) : null,
        userId,
      },
    });
    
    return NextResponse.json({ 
      note: {
        ...note,
        tags: analysis?.tags || [],
        topics: analysis?.topics || [],
        suggestions: analysis?.suggestions || [],
        improvements: analysis?.improvements || '',
        relatedTopics: analysis?.relatedTopics || []
      }
    }, { status: 201 });
  } catch (e) {
    console.error("Create note error:", e);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}