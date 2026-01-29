import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Using the exact model name from your available list
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "You are a world-class security researcher and developer. Review this code for bugs, security leaks, and performance. Return ONLY a valid JSON object. Format: {\"summary\": \"...\", \"reviews\": [{\"line\": 1, \"suggestion\": \"...\"}]}. Code: " + code
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "API Error" }, { status: response.status });
    }

    let text = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown if the AI includes it
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Parse Error:", error);
    return NextResponse.json({ error: "AI response was not valid JSON. Please try again." }, { status: 500 });
  }
}
