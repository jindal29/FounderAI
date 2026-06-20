"use client";

import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Search, 
  Sparkles, 
  Loader2, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Maximize2
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

interface Competitor {
  name: string;
  website: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  differentiation: string;
}

interface CompetitorReport {
  id: string;
  title: string;
  description: string;
  industry: string;
  competitors: Competitor[];
  createdAt: string;
}

interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  industry: string;
  targetAudience: string;
}

export default function CompetitorsPage() {
  const [reports, setReports] = useState<CompetitorReport[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeReport, setActiveReport] = useState<CompetitorReport | null>(null);
  
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
    "Establishing secure connection to AI agents...",
    "Querying Google Search grounding indexes...",
    "Retrieving pricing pages and service tiers...",
    "Analysing core strengths and performance vectors...",
    "Synthesizing market positioning and gap matrices...",
    "Saving report datasets in PostgreSQL cache..."
  ];

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/competitors");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0 && !activeReport) {
          setActiveReport(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch competitor reports:", err);
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
      await Promise.all([fetchReports(), fetchIdeas()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Loading steps animation loop
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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formIndustry || !formDescription) {
      alert("Please fill out all required fields.");
      return;
    }

    setRunningAnalysis(true);
    setLoadingStep(0);
    setOpenNewDialog(false);

    try {
      const res = await fetch("/api/competitors", {
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
        const newReport = await res.json();
        setReports(prev => [newReport, ...prev]);
        setActiveReport(newReport);
      } else {
        alert("Failed to analyze competitors. Please try again.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Internal Error running analysis pipeline.");
    } finally {
      setRunningAnalysis(false);
      // Reset form
      setFormTitle("");
      setFormIndustry("");
      setFormDescription("");
      setSelectedIdeaId("");
    }
  };

  const handleDelete = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this competitor analysis?")) return;

    try {
      const res = await fetch(`/api/competitors/${reportId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        if (activeReport?.id === reportId) {
          const remaining = reports.filter(r => r.id !== reportId);
          setActiveReport(remaining.length > 0 ? remaining[0] : null);
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
        <span className="text-sm text-slate-400">Loading competitor reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Competitor Landscape</h1>
          <p className="text-slate-400 text-sm mt-1">Map competing products, analyze pricing models, and identify feature gaps.</p>
        </div>
        <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
          <DialogTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
            <Sparkles className="w-4 h-4" />
            <span>New Competitor Scan</span>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 max-w-lg p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white font-outfit">Competitor Scanner Configuration</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Configure your startup concept parameters. AI will perform Google search grounding to find real competitors.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAnalyze} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="existing-idea" className="text-xs text-slate-400">Auto-fill from Existing Idea (Optional)</Label>
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
                <Label htmlFor="industry" className="text-xs text-slate-400">Industry Sector</Label>
                <Input
                  id="industry"
                  className="bg-slate-900 border-slate-800 focus:border-violet-600 text-xs text-white"
                  placeholder="e.g., AI SaaS / Venture Capital"
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
                  Run Competitor Analysis
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main pipeline loading screen */}
      {runningAnalysis && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl shadow-violet-600/5">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">AI Competitor Scanning Engine</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Searching the web for live alternatives, extracting pricing charts, and structuring differences.
            </p>
          </div>
          <div className="text-xs text-violet-400 font-medium px-4 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 inline-block animate-pulse">
            {loadingSteps[loadingStep]}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reports.length === 0 && !runningAnalysis && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-16 text-center max-w-xl mx-auto space-y-6">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">No Competitor Analyses Run</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Run your first competitor scan to search live search engine indexes, extract competitor profiles, pricing structures, and opportunities to win.
            </p>
          </div>
          <button
            onClick={() => setOpenNewDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Competitors Now</span>
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      {reports.length > 0 && !runningAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Left Column: List of competitor scans */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-base font-bold text-white font-outfit">Historical Scans</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setActiveReport(report)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    activeReport?.id === report.id
                      ? "border-violet-600 bg-slate-900/40 shadow-md shadow-violet-600/5"
                      : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{report.title}</h4>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">{report.industry}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Report Detail View / Right Column */}
          {activeReport && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Report Header Info */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white font-outfit">{activeReport.title}</h2>
                  <Badge variant="outline" className="border-violet-500/25 text-violet-400 text-[9px] uppercase tracking-wider font-bold">
                    {activeReport.industry}
                  </Badge>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{activeReport.description}</p>
                <span className="text-[9px] text-slate-500 block">Report Compiled: {new Date(activeReport.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Competitors List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  <span>Mapped Competitors ({activeReport.competitors.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeReport.competitors.map((comp, index) => (
                    <Card key={index} className="bg-slate-900/20 border-slate-900 flex flex-col justify-between hover:border-slate-850 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <CardTitle className="text-sm font-bold text-white">{comp.name}</CardTitle>
                            <Badge variant="secondary" className="text-[8px] bg-slate-950 text-slate-400 border-slate-850 hover:text-white font-mono">
                              {comp.website}
                            </Badge>
                          </div>
                          <Badge className="bg-violet-950/40 text-violet-400 text-[9px] border border-violet-500/20 px-2 py-0.5">
                            {comp.pricing}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-xs">
                        
                        {/* Market Position */}
                        <div className="p-2.5 rounded-lg bg-slate-950/20 border border-slate-900 space-y-1">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Positioning</span>
                          <p className="text-slate-350 font-medium leading-relaxed">{comp.marketPosition}</p>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <span className="text-[8px] font-bold text-emerald-450 uppercase tracking-widest font-mono flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              Strengths
                            </span>
                            <ul className="space-y-1">
                              {comp.strengths.map((str, idx) => (
                                <li key={idx} className="text-slate-400 text-[10px] leading-relaxed flex items-start gap-1">
                                  <ChevronRight className="w-2.5 h-2.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-[8px] font-bold text-rose-400 uppercase tracking-widest font-mono flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-rose-400" />
                              Weaknesses
                            </span>
                            <ul className="space-y-1">
                              {comp.weaknesses.map((weak, idx) => (
                                <li key={idx} className="text-slate-400 text-[10px] leading-relaxed flex items-start gap-1">
                                  <ChevronRight className="w-2.5 h-2.5 text-rose-500 shrink-0 mt-0.5" />
                                  <span>{weak}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Differentiation Value Props */}
                        <div className="p-3 rounded-lg bg-violet-950/5 border border-violet-950/20 space-y-1">
                          <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest font-mono flex items-center gap-1">
                            <Lightbulb className="w-2.5 h-2.5" />
                            Differentiation Gap
                          </span>
                          <p className="text-slate-300 leading-normal font-medium">{comp.differentiation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
