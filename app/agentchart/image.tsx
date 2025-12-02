"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  sender: "human" | "ai";
  text: string;
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
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  // Send message
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

    // Fake AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "Working on it .........",
        },
      ]);
    }, 1000);
  };

  // Initial AI greetings
  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "How can I help you?",
      },
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "You can ask me on the exact topic!",
      },
    ]);
  }, []);

  // Auto scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[90vh] top-0 relative flex flex-col">
      

      {/* Scrollable messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 no-scrollbar"
      >

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "human" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[70%] text-sm break-words ${msg.sender === "human"
                  ? "bg-indigo-700 text-white"
                  : "bg-[#132016] text-white"
                }`}
            >
              {msg.text}
            </div>
          </div>


        ))}


      </div>

      {/* Input area */}
   <div className="w-full p-3 flex items-center space-x-2">
  <textarea
    ref={textareaRef}
    placeholder="Type your message..."
    value={input}
    onInput={handleSize}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
    className="bg-white flex-1 resize-none rounded-lg px-4 py-3 text-sm text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm min-h-12 max-h-[160px] overflow-y-auto"
  />
  
  <button
    className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-md flex-shrink-0"
    onClick={handleSend}
  >
    <span className="material-symbols-outlined text-lg">send</span>
  </button>
</div>


    </div>
  );
}
