"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Sparkles, 
  Lightbulb, 
  Loader2,
  Menu,
  ChevronRight,
  TrendingUp,
  Cpu
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

interface Idea {
  id: string;
  title: string;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIdeaId = searchParams.get("ideaId");

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(initialIdeaId);
  
  const [input, setInput] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch all chat sessions and startup ideas
  useEffect(() => {
    const initData = async () => {
      try {
        const [sessionsRes, ideasRes] = await Promise.all([
          fetch("/api/chat/sessions"),
          fetch("/api/ideas")
        ]);

        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setSessions(sessionsData);
          
          // If sessions exist, load the most recent one
          if (sessionsData.length > 0) {
            setActiveSessionId(sessionsData[0].id);
          } else {
            // Otherwise, create a new session
            handleCreateSession("General Discussion");
          }
        }

        if (ideasRes.ok) {
          const ideasData = await ideasRes.json();
          setIdeas(ideasData.filter((i: any) => i.status === "COMPLETED"));
        }
      } catch (err) {
        console.error("Init data load failed:", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    initData();
  }, []);

  // Fetch messages when active session changes
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/chat/sessions?sessionId=${activeSessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeSessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateSession = async (title: string = "New Brainstorming") => {
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const newSession = await res.json();
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || !activeSessionId || sending) return;

    setInput("");
    setSending(true);

    // Append user message locally
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "USER",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Setup streaming placeholder for assistant response
    const assistantMessageId = Math.random().toString();
    const assistantMessagePlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "ASSISTANT",
      content: "",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessagePlaceholder]);

    try {
      // Map previous message payload for the backend API
      const apiMessages = [
        ...messages.map(m => ({ role: m.role.toLowerCase(), content: m.content })),
        { role: "user", content: textToSend }
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: activeSessionId,
          ideaId: selectedIdeaId,
        }),
      });

      if (!res.ok) throw new Error("Streaming error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          
          // Update the last message content locally
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedText }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat sending failed:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, I had trouble processing that request. Please try again." }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeIdea = ideas.find(i => i.id === selectedIdeaId);

  const starterPrompts = [
    "Draft a target persona details page for my startup.",
    "Give me 3 pricing tiers and monetization options.",
    "Write a short cold email pitch for early adopters.",
    "What are the biggest execution risks for this concept?"
  ];

  return (
    <div className="flex h-[calc(100vh-8.5rem)] rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden max-w-6xl mx-auto">
      {/* Sessions sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-900 bg-slate-950/40 backdrop-blur-md shrink-0">
        <div className="p-4 border-b border-slate-900 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sessions</span>
          <button 
            onClick={() => handleCreateSession()}
            className="p-1 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="New Session"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loadingSessions ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
              </div>
            ) : sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 border border-slate-850 text-white font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/30"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Main chat interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/10">
        {/* Chat Header controls */}
        <div className="h-14 border-b border-slate-900 flex items-center justify-between px-6 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold font-outfit text-white">
              {activeSession ? activeSession.title : "Brainstorming Session"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Anchored Concept:</label>
            <select
              value={selectedIdeaId || ""}
              onChange={(e) => setSelectedIdeaId(e.target.value || null)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:ring-violet-600 focus:border-violet-600 cursor-pointer"
            >
              <option value="">None (General chat)</option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message scroll area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.length === 0 && !loadingMessages && (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white font-outfit">Consult your AI Co-Founder</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Ask questions, iterate on monetization pricing, design target marketing messages, or run simulated user interviews.
                  </p>
                </div>
                {activeIdea && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 text-[10px] font-bold text-violet-350">
                    <Lightbulb className="w-3.5 h-3.5 text-violet-400" />
                    <span>Anchored to: {activeIdea.title}</span>
                  </div>
                )}
                
                {/* Quick starter questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-6 text-left">
                  {starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(undefined, prompt)}
                      className="p-3 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-slate-850 hover:bg-slate-900/40 text-xs text-slate-400 hover:text-slate-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loadingMessages ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "USER";
                return (
                  <div 
                    key={message.id}
                    className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                        F
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                        : "bg-slate-900/60 border border-slate-900 text-slate-200"
                    }`}>
                      {message.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input panel */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeIdea ? `Ask about "${activeIdea.title}"...` : "Discuss startup strategy..."}
              className="bg-slate-900/60 border-slate-850 text-slate-100 placeholder:text-slate-600 text-xs focus:ring-violet-600 focus:border-violet-600"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
