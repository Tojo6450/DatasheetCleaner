import { GoogleGenAI } from "@google/genai";
import { buildValidationPrompt } from "@/utils/validationsPrompt"; 

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { entityType, data } = await req.json();

    if (!entityType || !Array.isArray(data) || !data.length) {
      return Response.json({ error: "Missing or invalid data/entityType." }, { status: 400 });
    }

    const prompt = buildValidationPrompt(entityType, data);

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]");
    const jsonText = raw.slice(jsonStart, jsonEnd + 1).trim();

    let suggestions: any[] = [];

    try {
      suggestions = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse AI JSON:", jsonText);
      return Response.json({ error: "AI returned malformed JSON." }, { status: 500 });
    }

    return Response.json({ suggestions });
  } catch (error: any) {
    console.error("Gemini AI Validation Error:", error.message);
    return Response.json(
      { error: "Failed to validate data with AI", message: error.message },
      { status: 500 }
    );
  }
}
