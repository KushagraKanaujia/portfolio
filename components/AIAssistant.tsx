"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  links?: Array<{ label: string; href: string }>;
}

interface KnowledgeBase {
  keywords: string[];
  response: string;
  links?: Array<{ label: string; href: string }>;
}

const knowledgeBase: KnowledgeBase[] = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hey there! 👋 I'm Kushagra's AI assistant. I can tell you about his projects, skills, experience, or anything else you'd like to know!",
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "built", "made"],
    response: "Kushagra has built some impressive projects! His top ones are:\n\n• Dawdle - iOS social app with 1K+ active users\n• Visual Layer - ML platform processing 10M+ images\n• NSight Analytics - Real-time dashboard handling 2M+ requests\n\nWhich one would you like to explore?",
    links: [
      { label: "View Projects", href: "#projects" },
    ],
  },
  {
    keywords: ["dawdle"],
    response: "Dawdle is an iOS social app that connects students for spontaneous hangouts! It uses a real-time matching algorithm and handles 1K+ active users with <2s latency. Built with Swift, Firebase, Node.js, and WebSocket.",
    links: [
      { label: "See Project", href: "#projects" },
    ],
  },
  {
    keywords: ["visual layer", "visual", "ml", "machine learning"],
    response: "Visual Layer is an ML data quality platform! It processes over 10 million images with computer vision pipelines for dataset validation and model training optimization. Achieved 98% accuracy with 50% speed improvement. Tech stack: Python, PyTorch, FastAPI, React, PostgreSQL, AWS.",
    links: [
      { label: "See Project", href: "#projects" },
    ],
  },
  {
    keywords: ["nsight", "analytics", "dashboard"],
    response: "NSight Analytics is a real-time analytics dashboard with data visualization and predictive modeling. It handles 2M+ requests with 99.9% uptime and 150ms response time. Built with Next.js, PostgreSQL, Redis, Python, and TensorFlow.",
    links: [
      { label: "See Project", href: "#projects" },
    ],
  },
  {
    keywords: ["skill", "skills", "tech", "technology", "technologies", "stack"],
    response: "Kushagra is a full-stack ML engineer with expertise in:\n\n• Languages: Python, JavaScript, TypeScript, Java\n• Frontend: React, Next.js\n• Backend: Node.js, FastAPI, PostgreSQL, Redis\n• ML/AI: PyTorch, TensorFlow\n• DevOps: Docker, Kubernetes, AWS\n\nHe loves working across the entire stack!",
    links: [
      { label: "See All Skills", href: "#skills" },
    ],
  },
  {
    keywords: ["experience", "work experience", "job", "jobs", "worked"],
    response: "Kushagra is currently studying Computer Science at UC Santa Barbara. He's shipped production apps handling millions of requests, optimized ML pipelines for enterprise systems, and built tools that improve developer productivity.",
    links: [
      { label: "Learn More", href: "#about" },
    ],
  },
  {
    keywords: ["education", "school", "university", "college", "ucsb", "santa barbara"],
    response: "Kushagra is studying Computer Science at UC Santa Barbara. He's passionate about building intelligent systems that solve real-world problems through the intersection of ML and full-stack development.",
    links: [
      { label: "About", href: "#about" },
    ],
  },
  {
    keywords: ["contact", "email", "reach", "hire", "hiring", "available", "opportunities"],
    response: "Kushagra is open to opportunities, collaborations, and conversations about technology! You can reach him via email or check out his social profiles.",
    links: [
      { label: "Get in Touch", href: "#contact" },
      { label: "GitHub", href: "https://github.com/KushagraKanaujia" },
      { label: "LinkedIn", href: "https://linkedin.com/in/kushagra-kanaujia" },
    ],
  },
  {
    keywords: ["resume", "cv", "download"],
    response: "You can download Kushagra's resume from the contact section. It includes detailed information about his experience, projects, and technical skills.",
    links: [
      { label: "Contact Section", href: "#contact" },
    ],
  },
  {
    keywords: ["who", "about", "tell me about"],
    response: "Kushagra is a Machine Learning Engineer and Full-Stack Developer passionate about building intelligent systems. He's currently at UC Santa Barbara, and has experience with production-grade applications, ML pipelines, and scalable backends. He loves working at the intersection of clean code, smart algorithms, and thoughtful design!",
    links: [
      { label: "Learn More", href: "#about" },
    ],
  },
  {
    keywords: ["best", "favorite", "top"],
    response: "Kushagra's most impressive project is Visual Layer - an ML data quality platform that processes over 10 million images! It achieved 98% accuracy and improved pipeline speed by 50%. The system uses PyTorch, FastAPI, and is deployed on AWS.",
    links: [
      { label: "View Project", href: "#projects" },
    ],
  },
];

const defaultResponse: KnowledgeBase = {
  keywords: [],
  response: "That's a great question! I'm still learning, but you can explore Kushagra's portfolio using the navigation or try asking about:\n\n• His projects\n• Technical skills\n• Work experience\n• How to contact him",
  links: [
    { label: "View All Sections", href: "#home" },
  ],
};

function findBestMatch(query: string): KnowledgeBase {
  const lowerQuery = query.toLowerCase();

  // Find best matching knowledge base entry
  let bestMatch = defaultResponse;
  let highestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += keyword.length; // Longer matches score higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm Kushagra's AI assistant. Ask me anything about his projects, skills, or experience!",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      text: input,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const match = findBestMatch(input);
      const botMessage: Message = {
        id: messages.length + 1,
        text: match.response,
        isBot: true,
        links: match.links,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-accent to-accent-blue shadow-lg shadow-accent/50 flex items-center justify-center group hover:scale-110 transition-transform"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="w-6 h-6 text-black" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 w-96 h-[600px] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-accent to-accent-blue p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">AI Assistant</h3>
                  <p className="text-xs text-black/70">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isBot
                        ? "bg-white/10 text-white"
                        : "bg-gradient-to-r from-accent to-accent-blue text-black"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-xs px-3 py-1 rounded-full bg-accent/20 hover:bg-accent/30 transition-colors border border-accent/40"
                          >
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-accent rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-accent rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-accent rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-blue flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
