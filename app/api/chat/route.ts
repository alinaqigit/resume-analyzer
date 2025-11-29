// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { HfInference } from "@huggingface/inference";
import { getContext } from "@/lib/context";

const hf = new HfInference(process.env.HF_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { chatId, message: userMessage }: { chatId: number; message: string } =
      await req.json();

    // Fetch chat to get file key
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;

    // Get relevant context from Pinecone
    const context = await getContext(userMessage, fileKey);

    // Get chat context from previous messages
    const previousMessages = await db
      .select()
      .from(_messages)
      .where(eq(_messages.chatId, chatId))
      .limit(10);

    // Generate response using Hugging Face with RAG context
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant answering questions about a PDF document. Use the following context from the document to answer the user's question. If the context doesn't contain relevant information, say so.

CONTEXT:
${context}`,
        },
        ...previousMessages.slice(-5).map((msg) => ({
          role: msg.role === "user" ? "user" as const : "assistant" as const,
          content: msg.content,
        })),
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiContent = response.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";

    // Save user message
    await db.insert(_messages).values({
      chatId,
      content: userMessage,
      role: "user",
    });

    // Save AI message
    const insertedMessage = await db
      .insert(_messages)
      .values({
        chatId,
        content: aiContent,
        role: "system",
      })
      .returning();

    // Return AI message to frontend
    return NextResponse.json({
      id: insertedMessage[0].id.toString(),
      role: "assistant",
      content: aiContent,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}