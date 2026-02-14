"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi 👋 I’m Aira. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError("");

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/ai/chat/",
        { message: userMsg.content },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔵 Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 hover:cursor-pointer right-6 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl flex items-center justify-center hover:scale-105 transition"
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
        </button>
      )}

      {/* 💬 Chat Widget */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[370px] h-[540px] bg-slate-50 rounded-2xl shadow-2xl flex flex-col border border-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="font-semibold leading-tight">Aira</p>
                <p className="text-xs opacity-90">AI Assistant</p>
              </div>
            </div>

            <button onClick={() => setOpen(false)} className="hover:cursor-pointer">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-md"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-slate-400 italic">
                Aira is typing<span className="animate-pulse">...</span>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2">
              <input
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="Ask Aira anything..."
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className={`p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-400 transition  ${loading ? "opacity-50 cursor-progress" : "hover:cursor-pointer"}`}
              >
                <PaperAirplaneIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
