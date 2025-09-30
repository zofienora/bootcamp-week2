import { NextResponse } from "next/server";
import { improveGrammarAndStyle } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const improvedContent = await improveGrammarAndStyle(content);
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    console.error("AI Improvement Error:", error);
    return NextResponse.json({ error: "Failed to improve content" }, { status: 500 });
  }
}
