import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error in Groq API route:", error);
    return NextResponse.json({ error: "Failed to fetch response from Groq" }, { status: 500 });
  }
}