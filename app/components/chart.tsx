"use client";

import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  sender: "human" | "ai";
  text: string;
  time?: string;
};

export default function Chart() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-grow textarea
  const handleSize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: "human",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Polished AI reply with slight delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "Got it — analysing the data. I'll provide a short summary, 3 insights, and suggested next steps.",
        },
      ]);
    }, 900);
  };

  // Initial welcome
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Welcome — paste data or a chart image link to get clear insights.",
      },
    ]);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      className="h-[89vh] w-[50vw] 
      bg-linear-to-br from-[#f8fafc] via-white to-[#eef2f7]
      rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)]
      border border-white/40 backdrop-blur-md p-4 flex gap-6"
    >
      {/* Left: Chat container (flex-1) */}
      <div className="flex-1 flex flex-col w-full bg-white/90 rounded-2xl
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_20px_50px_rgba(0,0,0,0.15)]
        border border-gray-200/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          bg-linear-to-r from-black/80 to-black/60 border border-[#1FA97A]
          text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center
              bg-white/20 backdrop-blur font-bold tracking-wide">
              C
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-wide">Chart</h3>
              <p className="text-xs text-white/80">Premium chart analysis & insights</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 p-6 space-y-5 overflow-y-auto no-scrollbar
          bg-linear-to-b from-white to-gray-50"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "human" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm wrap-break-word
                shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                ${
                  m.sender === "human"
                    ? "bg-black/90 border border-[#1FA97A] text-white rounded-br-md"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-[14px]">{m.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-5 py-4 border-t bg-white/90 backdrop-blur-md flex items-center gap-3 shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onInput={handleSize}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a question or paste chart data / image URL..."
            className="flex-1 resize-none min-h-[52px] max-h-[180px]
              px-4 py-3 rounded-xl border border-gray-300
              bg-gray-50 focus:outline-none
              focus:ring-4 focus:ring-emerald-200
              text-sm shadow-sm"
          />

          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-xl
            bg-linear-to-br bg-black/80 border border-[#1FA97A]
            text-white flex items-center justify-center
            shadow-lg hover:scale-105 hover:shadow-xl transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>

     
    </div>
  );
}