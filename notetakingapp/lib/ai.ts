import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysis {
  topics: string[];
  tags: string[];
  suggestions: string[];
  improvements: string;
  relatedTopics: string[];
}

export async function analyzeNote(content: string, title: string): Promise<AIAnalysis> {
  try {
    // Demo mode - return mock analysis if no API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return getMockAnalysis(content, title);
    }

    const prompt = `
Analyze this note and provide the following:

Title: "${title}"
Content: "${content}"

Please provide a JSON response with:
1. "topics": Extract 3-5 key topics from the content
2. "tags": Generate 3-7 relevant tags (short, descriptive keywords)
3. "suggestions": Provide 2-3 smart suggestions for completing or improving the note
4. "improvements": Suggest grammar and style improvements (be specific)
5. "relatedTopics": Suggest 3-5 related topics that could be explored

Format the response as valid JSON only.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return getMockAnalysis(content, title);
  }
}

function getMockAnalysis(content: string, title: string): AIAnalysis {
  // Simple keyword extraction for demo
  const words = content.toLowerCase().split(/\s+/);
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  const keywords = words.filter(word => word.length > 3 && !commonWords.includes(word));
  
  return {
    topics: keywords.slice(0, 3),
    tags: keywords.slice(0, 5),
    suggestions: [
      "Consider adding more specific examples",
      "You might want to expand on this point",
      "Add a conclusion or next steps"
    ],
    improvements: "The content looks good! Consider varying sentence length for better flow.",
    relatedTopics: keywords.slice(0, 3)
  };
}

export async function generateSmartSuggestions(content: string): Promise<string[]> {
  try {
    // Demo mode
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return [
        "Consider adding more specific examples",
        "You might want to expand on this point", 
        "Add a conclusion or next steps"
      ];
    }

    const prompt = `
Based on this note content, provide 3 smart suggestions for completing or expanding the note:

"${content}"

Return only a JSON array of suggestion strings.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Smart Suggestions Error:', error);
    return ['Continue your thought...', 'Add more details', 'Consider examples'];
  }
}

export async function improveGrammarAndStyle(content: string): Promise<string> {
  try {
    // Demo mode
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return content + " (Improved with better flow and clarity)";
    }

    const prompt = `
Improve the grammar and style of this text while keeping the original meaning and tone:

"${content}"

Return only the improved text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Grammar Improvement Error:', error);
    return content;
  }
}

export async function findRelatedNotes(content: string, existingNotes: Array<{id: string, title: string, content: string}>): Promise<Array<{id: string, title: string, similarity: number}>> {
  try {
    // Demo mode
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return existingNotes.slice(0, 3).map(note => ({
        id: note.id,
        title: note.title,
        similarity: Math.random() * 0.5 + 0.3 // Random similarity between 0.3-0.8
      }));
    }

    const prompt = `
Given this note content: "${content}"

And these existing notes:
${existingNotes.map(note => `- ID: ${note.id}, Title: "${note.title}", Content: "${note.content.substring(0, 200)}..."`).join('\n')}

Find the 3 most related notes and return a JSON array with their IDs, titles, and similarity scores (0-1).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Related Notes Error:', error);
    return [];
  }
}
