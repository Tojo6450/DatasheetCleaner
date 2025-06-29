import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildHeaderMappingPrompt } from "@/utils/aimapprompt";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sampleRows, entityType } = body;

    const { prompt } = buildHeaderMappingPrompt(sampleRows, entityType);

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleanText = text.trim().replace(/^```json/, "").replace(/```$/, "");
    const mapping = JSON.parse(cleanText);

    return NextResponse.json({ mapping });
  }  catch (error: unknown) {
  if (error instanceof Error) {
    console.error("AI map error:", error);
    return NextResponse.json(
      { error: "Failed to map headers", details: error.message },
      { status: 500 }
    );
  }

  // Fallback if error is not an instance of Error
  console.error("Unknown error:", error);
  return NextResponse.json(
    { error: "Failed to map headers", details: "Unknown error occurred." },
    { status: 500 }
  );
}

}
