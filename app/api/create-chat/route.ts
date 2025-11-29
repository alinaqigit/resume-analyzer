// app/api/create-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    console.log("Creating chat for file:", file_key, file_name);

    // Insert chat into database FIRST
    const insertedChats = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning();

    const chat_id = insertedChats[0].id;
    console.log("Chat created with ID:", chat_id);

    // Load PDF into Pinecone AFTER database insert
    await loadS3IntoPinecone(file_key);

    return NextResponse.json(
      {
        chat_id: chat_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}