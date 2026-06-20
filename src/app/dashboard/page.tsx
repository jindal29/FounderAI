"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lightbulb, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export default function DashboardOverview() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          oneLiner,
          description,
          industry,
          targetAudience,
        }),
      });

      if (res.ok) {
        const newIdea = await res.json();
        setIdeas([newIdea, ...ideas]);
        setIsOpen(false);
        // Clear form
        setTitle("");
        setOneLiner("");
        setDescription("");
        setIndustry("");
        setTargetAudience("");
        
        // Redirect directly to the new idea page
        router.push(`/dashboard/ideas/${newIdea.id}`);
      }
    } catch (err) {
      console.error("Error creating idea:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Stat calculation
  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(i => i.status === "COMPLETED").length;
  const pendingIdeas = ideas.filter(i => i.status === "ANALYZING").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and validate your business ideas alongside your AI Co-Founder.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Validate New Idea</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-outfit text-white">Submit a Startup Idea</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Fill out the specifications below. Our AI Co-Founder will run validation reports, competitor mappings, and SWOT evaluations.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-300">Startup Name / Working Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., FounderAI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-600 focus:ring-violet-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="oneLiner" className="text-xs font-semibold text-slate-300">One-Line Pitch</Label>
                <Input
                  id="oneLiner"
                  placeholder="e.g., An AI Co-founder that validates startup ideas and designs business plans."
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  className="bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-600 focus:ring-violet-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-xs font-semibold text-slate-300">Industry / Sector</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., SaaS, AI, EdTech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-600 focus:ring-violet-600"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="targetAudience" className="text-xs font-semibold text-slate-300">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Early-stage entrepreneurs"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-600 focus:ring-violet-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-300">Core Problem & Solution Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain the problem you are solving, who you are solving it for, and what makes your product uniquely differentiated."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-600 focus:ring-violet-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Submit & Run Analysis</span>
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Total Ideas</span>
            <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4">{totalIdeas}</div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Validated Reports</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4">{completedIdeas}</div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Pending Processing</span>
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4">{pendingIdeas}</div>
        </div>
      </div>

      {/* Recent Ideas Table/Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Your Business Concepts</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
            <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white font-outfit">No startup ideas yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Submit your first business idea and let the AI validation agent execute market sizing and competitor scanning.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Validate First Idea</span>
            </button>
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
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
