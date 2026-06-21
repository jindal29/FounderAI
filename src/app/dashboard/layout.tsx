"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Lightbulb, 
  TrendingUp, 
  Search, 
  Grid3X3, 
  Code, 
  Presentation, 
  MessageSquare, 
  Settings,
  ChevronRight,
  Sparkles,
  AlertOctagon
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const checkDbHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) {
          const data = await res.json();
          if (data.database && !data.database.connected) {
            setDbError(data.database.error || "Database server is unreachable.");
          }
        } else {
          setDbError(null);
        }
      } catch (err) {
        console.error("Health check error:", err);
      }
    };
    checkDbHealth();
  }, [pathname]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Idea Validator",
      href: "/dashboard/ideas",
      icon: Lightbulb,
    },
    {
      name: "Market Research",
      href: "/dashboard/market-research",
      icon: TrendingUp,
    },
    {
      name: "Competitor Analysis",
      href: "/dashboard/competitors",
      icon: Search,
    },
    {
      name: "Business Canvas",
      href: "/dashboard/canvas",
      icon: Grid3X3,
    },
    {
      name: "MVP Planner",
      href: "/dashboard/mvp-planner",
      icon: Code,
    },
    {
      name: "Pitch Generator",
      href: "/dashboard/pitch-deck",
      icon: Presentation,
    },
    {
      name: "AI Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950/40 backdrop-blur-xl shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-900">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white font-outfit">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              FounderAI
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/15"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-450 group-hover:text-violet-400"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-900 flex items-center justify-between gap-3 bg-slate-900/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <UserButton />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">{user?.fullName || "Founder"}</span>
              <span className="text-[10px] text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-[9px] font-bold text-violet-400">
            PRO
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
          <div className="md:hidden">
            {/* Logo on small viewports */}
            <Link href="/dashboard" className="font-bold text-lg text-white font-outfit">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                FounderAI
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Workspace</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200">Founder Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/chat" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 border border-violet-500/20 text-violet-300 transition-colors">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Co-Founder Co-Pilot</span>
            </Link>
            <div className="md:hidden">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 p-6 md:p-8 space-y-6">
          {dbError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 flex items-start gap-3 text-xs text-rose-200">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold">Database Server Configuration Mismatch (P1001)</p>
                <p className="text-slate-450 leading-relaxed pt-0.5">
                  FounderAI cannot connect to the PostgreSQL instance. Verify your <code className="text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded font-mono">DATABASE_URL</code> in your environment or check if your local PostgreSQL server is active on port 5432.
                </p>
                {dbError !== "Database server is unreachable." && (
                  <p className="text-rose-400 font-mono text-[10px] pt-1">Error: {dbError}</p>
                )}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
