import { NextResponse } from "next/server";
import { analyzeNote } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { content, title } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const analysis = await analyzeNote(content, title || "");
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze note" }, { status: 500 });
  }
}
