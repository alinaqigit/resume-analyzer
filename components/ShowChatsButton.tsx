"use client";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Props = {
  firstChatId?: number;
};

export default function ShowChatsButton({ firstChatId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (!firstChatId) {
      toast.error("No chats found! Upload a PDF to get started.");
      return;
    }
    router.push(`/chat/${firstChatId}`);
  };

  return (
    <Button onClick={handleClick} variant="outline">
      <MessageSquare className="mr-2 h-4 w-4" />
      My Chats
    </Button>
  );
}