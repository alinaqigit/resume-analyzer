import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    chatId: string;
  }>;
};

const ChatPage = async ({ params }: Props) => {
  const { chatId } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  
  if (!_chats || _chats.length === 0) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  if (!currentChat) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* chat sidebar */}
      <div className="w-64 flex-shrink-0">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
      </div>

      {/* pdf viewer */}
      <div className="flex-1 overflow-auto">
        <PDFViewer pdf_url={currentChat.pdfUrl || ""} />
      </div>

      {/* chat component */}
      <div className="w-96 flex-shrink-0 border-l border-gray-200">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  );
};

export default ChatPage;