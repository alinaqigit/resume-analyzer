// app/page.tsx
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/fileuploader";
import ShowChatsButton from "@/components/ShowChatsButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
    firstChat = userChats[0];
  }

  return (
    <div className="w-screen min-h-screen ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold text-white">Chat with any PDF</h1>
            
          </div>

          

          <p className="max-w-xl mt-2 text-lg text-slate-600 text-white">
            Join millions of students, researchers and professionals to instantly
            answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
            <div className="flex justify-center mt-4">
            {isAuth && <ShowChatsButton firstChatId={firstChat?.id} />}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
