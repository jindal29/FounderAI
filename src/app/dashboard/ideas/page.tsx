"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lightbulb, ArrowRight, Loader2, Plus } from "lucide-react";

interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  industry: string;
  targetAudience: string;
  status: "DRAFT" | "ANALYZING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export default function IdeasListPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await fetch("/api/ideas");
        if (res.ok) {
          const data = await res.json();
          setIdeas(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Startup Concepts</h1>
          <p className="text-slate-400 text-sm mt-1">Select an idea to view its real-time SWOT analysis and interactive business plans.</p>
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Concept</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
          <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white font-outfit">No business concepts yet</h3>
          <p className="text-slate-500 text-sm mt-1">Create an idea on the main overview dashboard to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => {
            const statusColors = {
              DRAFT: "bg-slate-900 border-slate-800 text-slate-400",
              ANALYZING: "bg-amber-950/20 border-amber-500/20 text-amber-400 animate-pulse",
              COMPLETED: "bg-emerald-950/20 border-emerald-500/20 text-emerald-400",
              FAILED: "bg-rose-950/20 border-rose-500/20 text-rose-400",
            };

            return (
              <div 
                key={idea.id}
                className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col justify-between hover:border-slate-800 transition-all hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-violet-400">{idea.industry}</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusColors[idea.status]}`}>
                      {idea.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-outfit text-white mt-3">{idea.title}</h3>
                  <p className="text-slate-400 text-xs font-medium mt-1 italic">"{idea.oneLiner}"</p>
                  <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">{idea.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">
                    Created {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                  
                  <Link 
                    href={`/dashboard/ideas/${idea.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <span>Analyze Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
