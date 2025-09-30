import { NextResponse } from "next/server";
import { generateSmartSuggestions } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const suggestions = await generateSmartSuggestions(content);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
