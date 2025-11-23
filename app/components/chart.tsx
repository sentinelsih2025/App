
"use client"
import { useState, useRef, useEffect } from "react"



type Message = {
  id: string;
  sender: "human" | "ai";
  text: string;
};

export default function Chart() {
  const [width, fullScreen] = useState(20);
  const [icon, setIcon] = useState("chevron_left");




  // for the input box and send button
 const textareaRef = useRef<HTMLTextAreaElement | null>(null);


  const handleSize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto"; // reset height
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };




  // for chart

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");




  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: "human",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
    }



    //for the ai response
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

  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "How can I help You ! ",
      },
    ]);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "You can ask me on the exact topic !",
      },
    ]);
  }, []);



  // for auto scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);







  return (
    <div
      style={{ width: `${width}vw` }}
      className="h-screen bg-gray-100 duration-200  sticky top-0"
    >
      <div className="flex items-center gap-3 h-auto p-4">
        <button
          className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-200 transition material-symbols-outlined"
          onClick={() => {
            if (width === 20) {
              fullScreen(50);
              setIcon("chevron_right");
            } else {
              fullScreen(20);
              setIcon("chevron_left");
            }
          }}
        >
          <span className="material-icons text-xl">{icon}</span>
        </button>

        <h1 className="text-gray-900 text-2xl font-semibold">
          Chart with Agent
        </h1>
      </div>
      <hr />

      {/* Chart Section  */}

      <div className="h-[85vh] overflow-y-auto no-scrollbar">

        <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-3">
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
        <div ref={messagesEndRef} />
      </div>





      {/* input */}
      <div className="w-full absolute bottom-0 p-2 flex items-center space-x-2">
        <textarea
          ref={textareaRef}
          placeholder="Type your message or chart command..."
          onInput={handleSize}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // stop newline
              handleSend();       // send message
            }
          }}

          className="bg-white flex-1
               resize-none rounded-md px-3 py-2
               text-sm text-gray-800
               border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-400
               shadow-sm no-scrollbar
               min-h-10 max-h-[150px] overflow-y-auto"
        />

        <button
          className="flex items-center justify-center
               w-12 h-full rounded-md
               bg-indigo-600 text-white
               hover:bg-indigo-700 active:bg-indigo-800
               transition-colors duration-200 shadow-sm py-3"
          onClick={handleSend}
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>

    </div>
  );
}
