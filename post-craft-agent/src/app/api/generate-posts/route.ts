// // src/app/api/generate-posts/route.ts
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const MODEL_NAME = "gemini-2.5-flash-lite";
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const { text } = await req.json();

//     const prompt = `You are an expert LinkedIn content writer.
// Turn this text into 3 LinkedIn posts:
// 1. Storytelling style
// 2. Professional style
// 3. Engaging question style
// Add line breaks for readability.
// Text: ${text}`;

//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const result = await model.generateContent(prompt);

//     // Extract plain text
//     const generated =
//       result.response.candidates
//         ?.flatMap(c =>
//           c.content?.parts?.map(p => p.text).filter(Boolean)
//         )
//         .filter(Boolean) || [];

//         console.log('generated',generated);

//     return NextResponse.json({ posts: generated });
//   } catch (err) {
//     console.error("Generation error:", err);
//     return NextResponse.json(
//       { error: "Failed to generate posts" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash-lite";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
    try {
        const { text, tones } = await req.json();

        if (!text || !tones || tones.length === 0) {
            return NextResponse.json({ error: "Missing text or tones" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generatedPosts: string[] = [];

        for (const tone of tones) {
            //             const prompt = `You are an expert LinkedIn content writer.
            // Write 1 LinkedIn post in a ${tone} tone.
            // Keep it short, clear, and engaging.
            // Add line breaks for readability.
            // Text: ${text}`;

            const prompt = `You are an expert LinkedIn content writer. Write exactly 1 authentic LinkedIn post in a ${tone} tone about: ${text}
Return ONLY valid JSON (no markdown, no explanation). Use this schema:

{
  "tone": "${tone}",
  "meta": {
    "topic": "...",
    "audience": "...",
    "style": "..."
  },
  "post": {
    "hook": "...",
    "story": "...",
    "value": "..." or null,
    "list": [...] or null,
    "cta": "..." or null,
    "quote": "..." or null,
    "stat": "..." or null,
    "hashtags": [...]
  }
}

TONE-SPECIFIC GUIDELINES:

**Professional**: 
- Focus on insights, frameworks, data-driven observations
- Use business terminology and industry language
- Include stats or proven strategies when possible
- Structure: Hook → Key insight → Supporting points → Thought-provoking question

**Casual**: 
- Write like a conversation with a colleague
- Use personal anecdotes, everyday language, humor
- Skip formal structures - just tell the story naturally
- Structure: Relatable moment → What happened → Quick takeaway → Open-ended engagement

**Inspirational**: 
- Lead with emotion, transformation, or breakthrough moments
- Use metaphors, bold statements, aspirational language
- Include quotes or powerful one-liners when fitting
- Structure: Powerful hook → Journey/struggle → Lesson learned → Motivational CTA

**Funny**: 
- Start with an unexpected twist, exaggeration, or absurd scenario
- Use self-deprecating humor, pop culture references, ironic observations
- Keep it light - minimal business jargon
- Structure: Setup → Punchline → Brief connection to topic → Playful question

CRITICAL RULES:
- Hook: 10-20 words. Must match the tone's energy (professional = insightful, casual = conversational, inspirational = bold, funny = unexpected)
- Story: 2-5 sentences. This is the main content - make it distinctive to the tone
- Value: Only include if it fits naturally (professional/inspirational = often yes, casual/funny = often no)
- List: Only use for professional posts with actionable tips. Skip for other tones unless absolutely essential
- Quote: Only for inspirational posts, and only if genuinely impactful
- Stat: Only for professional posts when you want to add credibility
- CTA: Vary it - questions for casual, challenges for inspirational, jokes for funny, insights for professional
- Hashtags: 1-4 relevant ones. Don't overdo it
- Emojis: Integrate naturally in the text itself (not as decoration). Professional = minimal (1-2), Casual = moderate (3-5), Inspirational = purposeful (2-4), Funny = liberal (4-6)

The post should feel like it was written by a different person for each tone. Vary sentence length, vocabulary, and energy level dramatically.`;

            const result = await model.generateContent(prompt);

            const content =
                result.response.candidates
                    ?.flatMap(c => c.content?.parts?.map(p => p.text).filter(Boolean))
                    .filter(Boolean)
                    .join(" ") || "";

            if (content) {
                generatedPosts.push(content.trim());
            }
        }

        return NextResponse.json({ posts: generatedPosts });
    } catch (err) {
        console.error("Generation error:", err);
        return NextResponse.json(
            { error: "Failed to generate posts" },
            { status: 500 }
        );
    }
}
