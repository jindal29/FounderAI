"use client";

import { useEffect, useState } from "react";
import { 
  Code, 
  Server, 
  CheckSquare, 
  Sparkles, 
  Milestone, 
  Plus, 
  Trash2, 
  Loader2, 
  ChevronRight,
  DollarSign,
  Clock,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MvpPhase {
  name: string;
  tasks: string[];
}

interface TechStackItem {
  category: string;
  tech: string;
  why: string;
}

interface MvpRoadmap {
  id: string;
  title: string;
  description: string;
  industry: string;
  phases: MvpPhase[];
  techStack: TechStackItem[];
  timeline: string;
  cost: string;
  createdAt: string;
}

interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  industry: string;
}

export default function MvpPlannerPage() {
  const [roadmaps, setRoadmaps] = useState<MvpRoadmap[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<MvpRoadmap | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Form states
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>("");
  const [formTitle, setFormTitle] = useState("");
  const [formIndustry, setFormIndustry] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const loadingSteps = [
    "Establishing pipeline with AI system architects...",
    "Deconstructing MVP scope and core features...",
    "Designing database relations and software architecture...",
    "Configuring SaaS tech stack recommendations...",
    "Estimating overall launch timeline sprints...",
    "Calculating infrastructure budget requirements...",
    "Caching MVP roadmap in PostgreSQL database..."
  ];

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch("/api/mvp");
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data);
        if (data.length > 0 && !activeRoadmap) {
          setActiveRoadmap(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
    }
  };

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRoadmaps(), fetchIdeas()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Loading step intervals
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (runningAnalysis) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [runningAnalysis]);

  const handleIdeaSelect = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    if (!ideaId) {
      setFormTitle("");
      setFormIndustry("");
      setFormDescription("");
      return;
    }
    const pickedIdea = ideas.find(i => i.id === ideaId);
    if (pickedIdea) {
      setFormTitle(pickedIdea.title);
      setFormIndustry(pickedIdea.industry);
      setFormDescription(pickedIdea.description);
    }
  };

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formIndustry || !formDescription) {
      alert("Please fill out all required fields.");
      return;
    }

    setRunningAnalysis(true);
    setLoadingStep(0);
    setOpenNewDialog(false);

    try {
      const res = await fetch("/api/mvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          industry: formIndustry,
          ideaId: selectedIdeaId || null
        })
      });

      if (res.ok) {
        const newRoadmap = await res.json();
        setRoadmaps(prev => [newRoadmap, ...prev]);
        setActiveRoadmap(newRoadmap);
      } else {
        alert("Failed to generate MVP roadmap. Please try again.");
      }
    } catch (err) {
      console.error("Creation error:", err);
      alert("Error calling roadmap pipeline.");
    } finally {
      setRunningAnalysis(false);
      setFormTitle("");
      setFormIndustry("");
      setFormDescription("");
      setSelectedIdeaId("");
    }
  };

  const handleDeleteRoadmap = async (roadmapId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this MVP roadmap?")) return;

    try {
      const res = await fetch(`/api/mvp/${roadmapId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
        if (activeRoadmap?.id === roadmapId) {
          const remaining = roadmaps.filter(r => r.id !== roadmapId);
          setActiveRoadmap(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading MVP roadmaps...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">MVP Planner & Architecture</h1>
          <p className="text-slate-400 text-sm mt-1">Design your tech stack, outline architecture blueprints, and plan sprints.</p>
        </div>
        <div>
          <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
            <DialogTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>New MVP Roadmap</span>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 max-w-lg p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white font-outfit">MVP Roadmap Generator</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  AI will analyze your concept to recommend an optimal tech stack, budget costs, and launch sprints.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoadmap} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="existing-idea" className="text-xs text-slate-400">Select Idea to Autofill (Optional)</Label>
                  <select
                    id="existing-idea"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-violet-600"
                    value={selectedIdeaId}
                    onChange={(e) => handleIdeaSelect(e.target.value)}
                  >
                    <option value="">-- Create from scratch --</option>
                    {ideas.map((idea) => (
                      <option key={idea.id} value={idea.id}>{idea.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs text-slate-400">Startup Title</Label>
                  <Input
                    id="title"
                    className="bg-slate-900 border-slate-800 focus:border-violet-600 text-xs text-white"
                    placeholder="e.g., FounderAI"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-xs text-slate-400">Industry</Label>
                  <Input
                    id="industry"
                    className="bg-slate-900 border-slate-800 focus:border-violet-600 text-xs text-white"
                    placeholder="e.g., SaaS / Development"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs text-slate-400">Startup Concept Description</Label>
                  <Textarea
                    id="description"
                    className="bg-slate-900 border-slate-800 focus:border-violet-600 text-xs text-white min-h-[120px]"
                    placeholder="Describe what your startup does, target audiences, core features, and value proposition..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    required
                  />
                </div>

                <DialogFooter className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setOpenNewDialog(false)} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer">
                    Generate Roadmap
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline running progress steps */}
      {runningAnalysis && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl shadow-violet-600/5">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">AI System Architecture Compiler</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Generating stack specifications, timeline gantts, and task roadmaps.
            </p>
          </div>
          <div className="text-xs text-violet-400 font-medium px-4 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 inline-block animate-pulse">
            {loadingSteps[loadingStep]}
          </div>
        </div>
      )}

      {/* Empty State */}
      {roadmaps.length === 0 && !runningAnalysis && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-16 text-center max-w-xl mx-auto space-y-6">
          <Milestone className="w-12 h-12 text-slate-650 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">No MVP Roadmaps Mapped</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Initiate a roadmap scan to compile structured development phases, estimated launch costs, and customized tech stack recommendations.
            </p>
          </div>
          <button
            onClick={() => setOpenNewDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Roadmap Specs</span>
          </button>
        </div>
      )}

      {/* Main Roadmap content details */}
      {roadmaps.length > 0 && !runningAnalysis && activeRoadmap && (
        <div className="space-y-6">
          
          {/* Top selection bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select Roadmap:</span>
              <select
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-600"
                value={activeRoadmap.id}
                onChange={(e) => {
                  const target = roadmaps.find(r => r.id === e.target.value);
                  if (target) setActiveRoadmap(target);
                }}
              >
                {roadmaps.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={(e) => handleDeleteRoadmap(activeRoadmap.id, e)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-900/20 hover:bg-rose-950/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-450 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Roadmap</span>
            </button>
          </div>

          {/* Estimates Card Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/20 border-slate-900 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Estimated Timeline</span>
                <h3 className="text-xl font-bold text-white font-outfit mt-0.5">{activeRoadmap.timeline}</h3>
              </div>
            </Card>

            <Card className="bg-slate-900/20 border-slate-900 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-650/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450 shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Estimated Cost</span>
                <h3 className="text-xl font-bold text-emerald-400 font-outfit mt-0.5">{activeRoadmap.cost}</h3>
              </div>
            </Card>

            <Card className="bg-slate-900/20 border-slate-900 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-600/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Project Concept</span>
                <h3 className="text-sm font-bold text-white font-outfit truncate mt-0.5 max-w-[180px]">{activeRoadmap.title}</h3>
              </div>
            </Card>
          </div>

          {/* Main Content Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Tech Stack Column */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-base font-bold text-white font-outfit">Tech Stack Specs</h2>
              <div className="space-y-3">
                {activeRoadmap.techStack.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-1.5 hover:border-slate-850 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold font-mono">{item.category}</span>
                      <Badge className="bg-violet-950/40 text-violet-400 border border-violet-500/20 text-[9px] font-bold">{item.tech}</Badge>
                    </div>
                    <p className="text-slate-400 text-xs leading-normal">{item.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprints Milestones Column */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-base font-bold text-white font-outfit">Development Sprints</h2>
              <Card className="bg-slate-900/20 border-slate-900 p-6">
                <div className="space-y-8">
                  {activeRoadmap.phases.map((phase, idx) => (
                    <div key={idx} className="relative pl-8 border-l border-slate-850 space-y-3 last:border-0 pb-2">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-600 border border-slate-950 shadow-md shadow-violet-600/20" />
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm font-outfit">{phase.name}</h4>
                        <Badge variant="outline" className="border-violet-500/25 text-violet-400 text-[8px] font-mono font-bold uppercase tracking-wider">
                          Phase {idx + 1}
                        </Badge>
                      </div>
                      <ul className="space-y-2 pl-1">
                        {phase.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-slate-350 text-xs flex items-start gap-2.5 leading-relaxed">
                            <CheckSquare className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
