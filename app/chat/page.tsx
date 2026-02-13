"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setError("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
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

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-3 text-center">
        🤖 AI Chatbot
      </h1>

      {/* Chat Window */}
      <div className="flex-1 border rounded p-3 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            AI is typing...
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          className="border rounded flex-1 p-2"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
