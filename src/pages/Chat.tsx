import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string; }

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your FarmWise assistant. Ask me about crops, diseases, soil, irrigation, or anything farming." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res: any = await api.chat(q);
      const answer = res.answer || res.response || res.message || res.reply || (typeof res === "string" ? res : "I couldn't generate a response.");
      setMessages((m) => [...m, { role: "assistant", content: String(answer) }]);
    } catch (err: any) {
      toast.error(err.message);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I had trouble responding. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Farming Assistant</h1>
        <p className="text-muted-foreground mt-2">Ask anything about your crops.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-soft flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-accent" : "bg-gradient-primary"}`}>
                {m.role === "user" ? <UserIcon className="w-4 h-4 text-accent-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-secondary-foreground rounded-tl-sm"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="p-4 border-t border-border flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="How do I treat tomato blight?" disabled={loading} />
          <Button type="submit" variant="hero" size="icon" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
