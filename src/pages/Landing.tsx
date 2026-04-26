import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Camera, MessageCircle, BookOpen, Sparkles, Shield } from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: Camera, title: "Disease Diagnosis", desc: "Snap a photo of any leaf and get instant AI-powered disease detection." },
  { icon: MessageCircle, title: "Smart Assistant", desc: "Ask farming questions and receive expert advice 24/7." },
  { icon: BookOpen, title: "Crop Guides", desc: "Access curated growing tips for tomato, maize, potato, and more." },
  { icon: Sparkles, title: "AI-Powered", desc: "Built on hosted machine learning trained on thousands of crop images." },
  { icon: Shield, title: "Your History", desc: "Securely track your diagnoses and conversations in one place." },
  { icon: Leaf, title: "Made for Farmers", desc: "Designed for real growers — simple, fast, and works on any device." },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Sunlit farmland with green crops" width={1920} height={1088} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative container py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/15 backdrop-blur border border-background/20 text-primary-foreground text-sm mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Farming Companion
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground max-w-4xl mx-auto leading-tight">
            Grow smarter with <span className="text-accent">FarmWise</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Detect plant diseases instantly, chat with a farming expert, and access crop guides — all powered by AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/diagnose" : "/register"}>
              <Button variant="hero" size="lg" className="text-base">
                <Camera className="w-5 h-5" /> Try Diagnosis
              </Button>
            </Link>
            <Link to={user ? "/chat" : "/login"}>
              <Button variant="outline" size="lg" className="bg-background/10 border-background/30 text-primary-foreground hover:bg-background/20 backdrop-blur text-base">
                <MessageCircle className="w-5 h-5" /> Ask the Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need in the field</h2>
          <p className="mt-4 text-muted-foreground text-lg">Tools built to help you make better decisions, faster.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-16 text-center shadow-elegant">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to start growing smarter?</h2>
          <p className="mt-4 text-primary-foreground/90 text-lg max-w-xl mx-auto">Create your free account and protect your crops with AI today.</p>
          <Link to={user ? "/dashboard" : "/register"} className="inline-block mt-8">
            <Button variant="warm" size="lg" className="text-base">Get Started — It's Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
