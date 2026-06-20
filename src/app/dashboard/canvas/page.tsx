"use client";

import { useEffect, useState } from "react";
import { 
  Grid3X3, 
  Edit3, 
  HelpCircle, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2, 
  ChevronRight,
  RefreshCw
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

interface BusinessModelCanvas {
  id: string;
  title: string;
  description: string;
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  createdAt: string;
  ideaId?: string | null;
}

interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  industry: string;
}

export default function BusinessModelCanvasPage() {
  const [canvases, setCanvases] = useState<BusinessModelCanvas[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeCanvas, setActiveCanvas] = useState<BusinessModelCanvas | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local changes during edit mode
  const [editState, setEditState] = useState<Partial<BusinessModelCanvas> | null>(null);

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
    "Establishing pipeline with AI strategists...",
    "Extracting beachhead buyer personas and customer segments...",
    "Defining value proposition layers and features...",
    "Structuring channels, customer relations, and key partners...",
    "Calculating operational cost structures and revenue vectors...",
    "Caching Business Model Canvas in PostgreSQL..."
  ];

  const fetchCanvases = async () => {
    try {
      const res = await fetch("/api/canvas");
      if (res.ok) {
        const data = await res.json();
        setCanvases(data);
        if (data.length > 0 && !activeCanvas) {
          setActiveCanvas(data[0]);
          setEditState(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch canvases:", err);
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
      await Promise.all([fetchCanvases(), fetchIdeas()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update editState when activeCanvas switches
  useEffect(() => {
    if (activeCanvas) {
      setEditState(activeCanvas);
    } else {
      setEditState(null);
    }
  }, [activeCanvas]);

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

  const handleCreateCanvas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formIndustry || !formDescription) {
      alert("Please fill out all fields.");
      return;
    }

    setRunningAnalysis(true);
    setLoadingStep(0);
    setOpenNewDialog(false);

    try {
      const res = await fetch("/api/canvas", {
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
        const newCanvas = await res.json();
        setCanvases(prev => [newCanvas, ...prev]);
        setActiveCanvas(newCanvas);
      } else {
        alert("Failed to generate canvas. Please try again.");
      }
    } catch (err) {
      console.error("Creation error:", err);
      alert("Error calling canvas pipeline.");
    } finally {
      setRunningAnalysis(false);
      setFormTitle("");
      setFormIndustry("");
      setFormDescription("");
      setSelectedIdeaId("");
    }
  };

  const handleSaveChanges = async () => {
    if (!activeCanvas || !editState) return;

    try {
      const res = await fetch(`/api/canvas/${activeCanvas.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editState)
      });

      if (res.ok) {
        const updated = await res.json();
        setCanvases(prev => prev.map(c => c.id === updated.id ? updated : c));
        setActiveCanvas(updated);
        setIsEditing(false);
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving updates.");
    }
  };

  const handleOptimize = async () => {
    if (!activeCanvas) return;
    if (!confirm("AI will regenerate all points based on the current title and description. Manual edits will be overwritten. Continue?")) return;

    setRunningAnalysis(true);
    setLoadingStep(0);
    setIsEditing(false);

    try {
      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeCanvas.title,
          description: activeCanvas.description,
          industry: "Technology", // default or retrieved from idea
          ideaId: activeCanvas.ideaId
        })
      });

      if (res.ok) {
        const newCanvas = await res.json();
        // Remove old and insert new
        setCanvases(prev => prev.map(c => c.id === activeCanvas.id ? newCanvas : c));
        setActiveCanvas(newCanvas);
      } else {
        alert("AI optimization failed.");
      }
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleDeleteCanvas = async (canvasId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this Business Model Canvas?")) return;

    try {
      const res = await fetch(`/api/canvas/${canvasId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCanvases(prev => prev.filter(c => c.id !== canvasId));
        if (activeCanvas?.id === canvasId) {
          const remaining = canvases.filter(c => c.id !== canvasId);
          setActiveCanvas(remaining.length > 0 ? remaining[0] : null);
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
        <span className="text-sm text-slate-400">Loading Business Model Canvases...</span>
      </div>
    );
  }

  const bmcSections = activeCanvas && editState ? [
    {
      key: "keyPartners",
      title: "Key Partners",
      desc: "Who helps you build?",
      items: (isEditing ? editState.keyPartners : activeCanvas.keyPartners) || [],
      color: "border-violet-500/25 bg-violet-950/5",
      grid: "md:col-span-1 md:row-span-2"
    },
    {
      key: "keyActivities",
      title: "Key Activities",
      desc: "What do you do daily?",
      items: (isEditing ? editState.keyActivities : activeCanvas.keyActivities) || [],
      color: "border-fuchsia-500/25 bg-fuchsia-950/5",
      grid: "md:col-span-1"
    },
    {
      key: "valuePropositions",
      title: "Value Propositions",
      desc: "Why do users choose you?",
      items: (isEditing ? editState.valuePropositions : activeCanvas.valuePropositions) || [],
      color: "border-pink-500/25 bg-pink-950/5",
      grid: "md:col-span-1 md:row-span-2"
    },
    {
      key: "customerRelationships",
      title: "Customer Relationships",
      desc: "How do you interact?",
      items: (isEditing ? editState.customerRelationships : activeCanvas.customerRelationships) || [],
      color: "border-sky-500/25 bg-sky-950/5",
      grid: "md:col-span-1"
    },
    {
      key: "customerSegments",
      title: "Customer Segments",
      desc: "Who are your buyers?",
      items: (isEditing ? editState.customerSegments : activeCanvas.customerSegments) || [],
      color: "border-emerald-500/25 bg-emerald-950/5",
      grid: "md:col-span-1 md:row-span-2"
    },
    {
      key: "keyResources",
      title: "Key Resources",
      desc: "What assets do you need?",
      items: (isEditing ? editState.keyResources : activeCanvas.keyResources) || [],
      color: "border-amber-500/25 bg-amber-950/5",
      grid: "md:col-span-1"
    },
    {
      key: "channels",
      title: "Channels",
      desc: "How do you reach them?",
      items: (isEditing ? editState.channels : activeCanvas.channels) || [],
      color: "border-teal-500/25 bg-teal-950/5",
      grid: "md:col-span-1"
    },
    {
      key: "costStructure",
      title: "Cost Structure",
      desc: "Where does money go?",
      items: (isEditing ? editState.costStructure : activeCanvas.costStructure) || [],
      color: "border-rose-500/25 bg-rose-950/5",
      grid: "md:col-span-2"
    },
    {
      key: "revenueStreams",
      title: "Revenue Streams",
      desc: "How do you make money?",
      items: (isEditing ? editState.revenueStreams : activeCanvas.revenueStreams) || [],
      color: "border-indigo-500/25 bg-indigo-950/5",
      grid: "md:col-span-3"
    }
  ] : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Business Model Canvas</h1>
          <p className="text-slate-400 text-sm mt-1">Structure your business assumptions on a single visual framework.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
            <DialogTrigger className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>New Canvas</span>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 max-w-lg p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white font-outfit">Business Model Canvas Generator</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Provide your concept details to generate a comprehensive 9-box canvas diagram.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCanvas} className="space-y-4 py-4">
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
                    placeholder="e.g., Venture Tech"
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
                    Generate Canvas
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main loading steps indicator */}
      {runningAnalysis && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl shadow-violet-600/5">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">AI Business Strategist Canvas Builder</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Calculating your market vectors and building the canvas structure.
            </p>
          </div>
          <div className="text-xs text-violet-400 font-medium px-4 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 inline-block animate-pulse">
            {loadingSteps[loadingStep]}
          </div>
        </div>
      )}

      {/* Empty State */}
      {canvases.length === 0 && !runningAnalysis && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-16 text-center max-w-xl mx-auto space-y-6">
          <Grid3X3 className="w-12 h-12 text-slate-650 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">No Canvas Models Created</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Run the canvas generation pipeline to map cost structures, customer channels, activities, and value props onto a single interactive grid.
            </p>
          </div>
          <button
            onClick={() => setOpenNewDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Business Canvas</span>
          </button>
        </div>
      )}

      {/* Main interactive grid and sidebar lists */}
      {canvases.length > 0 && !runningAnalysis && activeCanvas && (
        <div className="space-y-6">
          
          {/* Top selection bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select Canvas:</span>
              <select
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-600"
                value={activeCanvas.id}
                onChange={(e) => {
                  const target = canvases.find(c => c.id === e.target.value);
                  if (target) setActiveCanvas(target);
                }}
              >
                {canvases.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <button 
                  onClick={handleSaveChanges}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Edit Canvas</span>
                </button>
              )}

              <button 
                onClick={handleOptimize}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="AI Regenerate"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                <span>AI Optimize</span>
              </button>

              <button 
                onClick={(e) => handleDeleteCanvas(activeCanvas.id, e)}
                className="p-2 border border-slate-800 bg-slate-900/20 hover:bg-rose-950/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-450 rounded-lg transition-colors cursor-pointer"
                title="Delete Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Business Model Canvas Box Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {bmcSections.map((section, idx) => (
              <Card 
                key={idx}
                className={`border ${section.color} ${section.grid} transition-all hover:border-slate-850`}
              >
                <CardHeader className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-bold font-outfit text-white uppercase tracking-wider">{section.title}</CardTitle>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-700 hover:text-slate-500 cursor-pointer" />
                  </div>
                  <CardDescription className="text-[9px] text-slate-500">{section.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {isEditing ? (
                    <textarea
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:border-violet-600 outline-none"
                      rows={6}
                      defaultValue={section.items.join("\n")}
                      onChange={(e) => {
                        const lines = e.target.value.split("\n");
                        setEditState(prev => prev ? {
                          ...prev,
                          [section.key]: lines
                        } : null);
                      }}
                    />
                  ) : (
                    <ul className="space-y-2">
                      {section.items.map((item, iIdx) => (
                        <li 
                          key={iIdx} 
                          className="p-2 rounded-lg bg-slate-950/40 border border-slate-900 text-[11px] text-slate-350 leading-normal flex items-start gap-1.5"
                        >
                          <ChevronRight className="w-3 h-3 text-violet-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
