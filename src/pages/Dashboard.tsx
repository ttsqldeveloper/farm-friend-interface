import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, MessageCircle, BookOpen, History, ArrowRight } from "lucide-react";

const cards = [
  { to: "/diagnose", icon: Camera, title: "Diagnose a Plant", desc: "Upload a leaf image to detect diseases.", gradient: "bg-gradient-primary" },
  { to: "/chat", icon: MessageCircle, title: "Ask the Assistant", desc: "Get expert farming advice instantly.", gradient: "bg-gradient-warm" },
  { to: "/crops", icon: BookOpen, title: "Crop Guides", desc: "Browse seasonal growing tips.", gradient: "bg-gradient-primary" },
  { to: "/history", icon: History, title: "Your History", desc: "Review past diagnoses and chats.", gradient: "bg-gradient-warm" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.fullName || user?.full_name || "Farmer";
  return (
    <div className="container py-10 md:py-14">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {name.split(" ")[0]} 🌱</h1>
        <p className="text-muted-foreground mt-2 text-lg">What would you like to do today?</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group relative overflow-hidden rounded-2xl p-7 bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${c.gradient} opacity-10 group-hover:opacity-20 transition-smooth`} />
            <div className={`relative w-14 h-14 rounded-xl ${c.gradient} flex items-center justify-center shadow-soft mb-4`}>
              <c.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{c.title}</h3>
            <p className="text-muted-foreground">{c.desc}</p>
            <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
          </Link>
        ))}
      </div>
    </div>
  );
}
