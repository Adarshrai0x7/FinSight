"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendHorizonal, X, MessageSquare } from "lucide-react"

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <path d="M7.75 7.75C7.75 6.19381 9.05289 4.95 10.6875 4.95H13.3125C14.9471 4.95 16.25 6.19381 16.25 7.75V10.25C16.25 11.8062 14.9471 13.05 13.3125 13.05H10.6875C9.05289 13.05 7.75 11.8062 7.75 10.25V7.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 16.25C4.5 14.4551 5.95507 13 7.75 13H16.25C18.0449 13 19.5 14.4551 19.5 16.25V17.375C19.5 18.2722 18.7722 19 17.875 19H6.125C5.22779 19 4.5 18.2722 4.5 17.375V16.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 9.5L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 9.5L13.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center space-x-2"
  >
    <BotAvatar />
    <div className="p-3 bg-slate-700 rounded-lg flex items-center space-x-1">
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.8, delay: 0.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </motion.div>
);

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m your FinSight assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

 const handleSend = async () => {
  if (!input.trim() || isLoading) return;
  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text })
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  } catch (err) {
    setMessages((prev) => [...prev, { sender: "bot", text: "Oops, something went wrong. Please try again." }]);
  }

  setIsLoading(false);
};


  const widgetVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring" as const, stiffness: 300, damping: 30 } 
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-80 sm:w-96 h-[32rem] bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden"
          >
            <div className="bg-slate-800/70 px-4 py-3 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <BotAvatar />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800" />
                </div>
                <h2 className="font-bold text-lg text-white">FinSight Assistant</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "justify-end" : ""}`}
                >
                  {msg.sender === "bot" && <BotAvatar />}
                  <div
                    className={`p-3 rounded-xl max-w-[85%] text-white ${
                      msg.sender === "bot"
                        ? "bg-slate-700 rounded-bl-none"
                        : "bg-cyan-600 rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1 border border-slate-600 focus-within:border-cyan-500 transition-colors">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-white placeholder-slate-400"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} size="icon" className="bg-cyan-600 hover:bg-cyan-700 w-9 h-9 flex-shrink-0" disabled={isLoading}>
                  <SendHorizonal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setOpen(!open)}
          className="rounded-full w-16 h-16 shadow-lg bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center"
        >
          {open ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
        </Button>
      </motion.div>
    </div>
  );
}
