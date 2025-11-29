import { cn } from "@/lib/utils";
import React from "react";
import { Message } from "./ChatComponent";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end pl-10": message.role === "user",
            "justify-start pr-10": message.role === "assistant",
          })}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm shadow-sm max-w-[80%]",
              {
                "bg-blue-600 text-white": message.role === "user",
                "bg-gray-100 text-gray-900": message.role === "assistant",
              }
            )}
          >
            <p className="whitespace-pre-wrap wrap-break-words">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;