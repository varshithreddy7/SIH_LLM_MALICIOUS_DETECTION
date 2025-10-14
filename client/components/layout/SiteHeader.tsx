import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Radar, Network, FileText } from "lucide-react";

const nav = [
  { to: "/verify", label: "Verify" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/threat-graph", label: "Threat Graph" },
  { to: "/audit-log", label: "Audit Log" },
  { to: "/reports", label: "Reports" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl text-cyan-300 neon-text">
          <Shield className="text-cyan-400" />
          AI Defense Intelligence
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-cyan-300' : 'text-foreground/70 hover:text-foreground'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/verify" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-cyan-300 hover:bg-white/10 transition-colors">
            <Radar className="size-4" /> Verify
          </Link>
          <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 transition-colors">
            <Network className="size-4" /> Dashboard
          </Link>
          <Link to="/auth/login" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 transition-colors">Sign In</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
