import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
{ to: "/dashboard", label: "Dashboard" },
{ to: "/diagnose", label: "Diagnose" },
{ to: "/chat", label: "Assistant" },
{ to: "/crops", label: "Crops" },
{ to: "/history", label: "History" }];


export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">FarmWise</span>
          </Link>

          {user &&
          <nav className="hidden md:flex items-center gap-1">
              {navItems.map((n) =>
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
              cn("px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
              isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")
              }>
              
                  {n.label}
                </NavLink>
            )}
            </nav>
          }

          <div className="flex items-center gap-2">
            {user ?
            <>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-smooth">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {(user.fullName || user.full_name || user.email)[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">{user.fullName || user.full_name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => {logout();navigate("/");}} title="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </> :

            <>
                <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
                <Link to="/register"><Button variant="hero">Get Started</Button></Link>
              </>
            }
          </div>
        </div>

        {user && open &&
        <nav className="md:hidden border-t border-border bg-background">
            <div className="container py-2 flex flex-col">
              {navItems.map((n) =>
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
              cn("px-4 py-3 rounded-lg text-sm font-medium",
              isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")
              }>
              
                  {n.label}
                </NavLink>
            )}
            </div>
          </nav>
        }
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FarmWise — Empowering farmers with AI.
        </div>
      </footer>
    </div>);

}