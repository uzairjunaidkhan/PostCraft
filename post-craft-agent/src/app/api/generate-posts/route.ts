// src/app/api/generate-posts/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `You are an expert LinkedIn content writer.
Turn this text into 3 LinkedIn posts:
1. Storytelling style
2. Professional style
3. Engaging question style
Add line breaks for readability.
Text: ${text}`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);

    // Extract plain text
    const generated =
      result.response.candidates
        ?.flatMap(c =>
          c.content?.parts?.map(p => p.text).filter(Boolean)
        )
        .filter(Boolean) || [];

    return NextResponse.json({ posts: generated });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate posts" },
      { status: 500 }
    );
  }
}
