"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Loader2 } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";

type Props = { chatId: number };

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const ChatComponent = ({ chatId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.post<Message[]>("/api/get-messages", { chatId });
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post<Message>("/api/chat", {
        chatId,
        message: userInput,
      });
      // Add AI/assistant reply
      setMessages((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove user message if failed
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-white">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-4 bg-white border-b z-10">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            {loading && (
              <div className="flex justify-start pr-10 mt-2">
                <div className="bg-gray-200 rounded-lg px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* input */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-4 py-4 bg-white border-t"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question..."
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;