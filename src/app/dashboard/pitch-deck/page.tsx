"use client";

import { useEffect, useState } from "react";
import { 
  Presentation, 
  Plus, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Loader2, 
  Trash2,
  Save,
  Download,
  Eye
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

interface Slide {
  title: string;
  subtitle: string;
  bullets: string[];
  script: string;
}

interface PitchDeck {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
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

export default function PitchDeckPage() {
  const [decks, setDecks] = useState<PitchDeck[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeDeck, setActiveDeck] = useState<PitchDeck | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Edit states for current slide script
  const [slideScript, setSlideScript] = useState("");
  const [savingScript, setSavingScript] = useState(false);

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
    "Establishing pipeline with AI pitch strategists...",
    "Framing Problem & Solution narratives...",
    "Integrating TAM/SAM/SOM opportunity values...",
    "Designing GTM loops & business pricing models...",
    "Drafting ideal team configurations & funding asks...",
    "Writing verbal presenter scripts and speaker notes...",
    "Caching Pitch Deck slides in PostgreSQL database..."
  ];

  const fetchDecks = async () => {
    try {
      const res = await fetch("/api/pitch");
      if (res.ok) {
        const data = await res.json();
        setDecks(data);
        if (data.length > 0 && !activeDeck) {
          setActiveDeck(data[0]);
          setActiveSlide(0);
          setSlideScript(data[0].slides[0]?.script || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch decks:", err);
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
      await Promise.all([fetchDecks(), fetchIdeas()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update script input field when active slide changes
  useEffect(() => {
    if (activeDeck && activeDeck.slides[activeSlide]) {
      setSlideScript(activeDeck.slides[activeSlide].script);
    }
  }, [activeSlide, activeDeck]);

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

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formIndustry || !formDescription) {
      alert("Please fill out all fields.");
      return;
    }

    setRunningAnalysis(true);
    setLoadingStep(0);
    setOpenNewDialog(false);

    try {
      const res = await fetch("/api/pitch", {
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
        const newDeck = await res.json();
        setDecks(prev => [newDeck, ...prev]);
        setActiveDeck(newDeck);
        setActiveSlide(0);
      } else {
        alert("Failed to generate Pitch Deck. Please try again.");
      }
    } catch (err) {
      console.error("Creation error:", err);
      alert("Error calling pitch deck pipeline.");
    } finally {
      setRunningAnalysis(false);
      setFormTitle("");
      setFormIndustry("");
      setFormDescription("");
      setSelectedIdeaId("");
    }
  };

  const handleSaveScript = async () => {
    if (!activeDeck) return;
    setSavingScript(true);

    try {
      const updatedSlides = [...activeDeck.slides];
      updatedSlides[activeSlide] = {
        ...updatedSlides[activeSlide],
        script: slideScript
      };

      const res = await fetch(`/api/pitch/${activeDeck.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: updatedSlides })
      });

      if (res.ok) {
        const updated = await res.json();
        setDecks(prev => prev.map(d => d.id === updated.id ? updated : d));
        setActiveDeck(updated);
      } else {
        alert("Failed to save presenter notes.");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSavingScript(false);
    }
  };

  const handleDeleteDeck = async (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this Pitch Deck?")) return;

    try {
      const res = await fetch(`/api/pitch/${deckId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDecks(prev => prev.filter(d => d.id !== deckId));
        if (activeDeck?.id === deckId) {
          const remaining = decks.filter(d => d.id !== deckId);
          setActiveDeck(remaining.length > 0 ? remaining[0] : null);
          setActiveSlide(0);
        }
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading Pitch Decks...</span>
      </div>
    );
  }

  const currentSlide = activeDeck?.slides[activeSlide];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Print-only Stylesheet */}
      <style>{`
        #print-slide-container {
          display: none;
        }
        @media print {
          body, html {
            background: #020617 !important;
            color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #dashboard-sidebar, 
          #dashboard-header,
          header, 
          nav, 
          .no-print {
            display: none !important;
          }
          #print-slide-container {
            display: block !important;
            width: 100% !important;
          }
          .print-slide {
            page-break-after: always !important;
            break-after: page !important;
            width: 100% !important;
            aspect-ratio: 16/9 !important;
            padding: 3.5rem !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background: #030712 !important;
            color: #ffffff !important;
            height: 100vh !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900 no-print">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Pitch Deck Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Design slides, edit presentation scripts, and export investor pitch decks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
            <DialogTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>New Pitch Deck</span>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 max-w-lg p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white font-outfit">Pitch Deck Generator</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Generate a complete 10-slide outline and speaker scripts for presenting to investors.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDeck} className="space-y-4 py-4">
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
                    Generate Deck
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline running loader */}
      {runningAnalysis && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl shadow-violet-600/5 no-print">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">AI Investor Pitch Deck Compiler</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Generating slide assets, opportunity sizing, and detailed presentation speaker scripts.
            </p>
          </div>
          <div className="text-xs text-violet-400 font-medium px-4 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 inline-block animate-pulse">
            {loadingSteps[loadingStep]}
          </div>
        </div>
      )}

      {/* Empty State */}
      {decks.length === 0 && !runningAnalysis && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-16 text-center max-w-xl mx-auto space-y-6 no-print">
          <Presentation className="w-12 h-12 text-slate-650 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">No Pitch Decks Compiled</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Validate your story layout, write presenter slides scripts, and download clean PDF copies.
            </p>
          </div>
          <button
            onClick={() => setOpenNewDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Pitch Deck</span>
          </button>
        </div>
      )}

      {/* Interactive Deck Layout */}
      {decks.length > 0 && !runningAnalysis && activeDeck && currentSlide && (
        <div className="space-y-6 no-print">
          
          {/* Top selection bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select Deck:</span>
              <select
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-600"
                value={activeDeck.id}
                onChange={(e) => {
                  const target = decks.find(d => d.id === e.target.value);
                  if (target) {
                    setActiveDeck(target);
                    setActiveSlide(0);
                  }
                }}
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button 
                onClick={(e) => handleDeleteDeck(activeDeck.id, e)}
                className="p-2 border border-slate-800 bg-slate-900/20 hover:bg-rose-950/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-450 rounded-lg transition-colors cursor-pointer"
                title="Delete Deck"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Outline Selector */}
            <Card className="bg-slate-900/20 border-slate-900 lg:col-span-1 flex flex-col justify-between">
              <CardHeader className="p-4">
                <CardTitle className="text-xs font-bold font-outfit text-white uppercase tracking-wider">Slide Deck Outline</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1.5 flex-1 max-h-[460px] overflow-y-auto pr-1">
                {activeDeck.slides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      idx === activeSlide
                        ? "bg-violet-600 text-white font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] opacity-70">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="truncate max-w-[130px]">{slide.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Visual Preview Frame */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video rounded-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between p-8 overflow-hidden shadow-2xl">
                {/* Glow layer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest font-mono">FounderAI Pitch</span>
                  <span className="font-mono text-xs text-slate-500">
                    {activeSlide + 1 < 10 ? `0${activeSlide + 1}` : activeSlide + 1} / {activeDeck.slides.length}
                  </span>
                </div>

                <div className="space-y-4 text-left z-10 flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit">{currentSlide.title}</h2>
                  <p className="text-slate-400 text-xs italic">"{currentSlide.subtitle}"</p>
                  
                  <ul className="space-y-2 pt-4">
                    {currentSlide.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-slate-300 text-xs flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-[9px] text-slate-600 text-left border-t border-slate-900/60 pt-4 z-10 flex justify-between">
                  <span>Confidential Presentation. All Rights Reserved.</span>
                  <span>{activeDeck.title}</span>
                </div>
              </div>
            </div>

            {/* Script Text Editor */}
            <Card className="bg-slate-900/20 border-slate-900 lg:col-span-1 flex flex-col justify-between">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-bold text-white font-outfit">Presentation Script</CardTitle>
                <CardDescription className="text-xs">Verbal scripts or speaker notes</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                <textarea
                  className="w-full flex-1 bg-slate-950/85 border border-slate-850 rounded-lg p-3 text-xs text-slate-350 focus:border-violet-650 outline-none resize-none min-h-[260px]"
                  value={slideScript}
                  onChange={(e) => setSlideScript(e.target.value)}
                />
                <Button 
                  onClick={handleSaveScript}
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  disabled={savingScript}
                >
                  {savingScript ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-violet-400" />
                  )}
                  <span>Save Slide Script</span>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      )}

      {/* Hidden print container for high-fidelity multi-page PDF generation */}
      {activeDeck && (
        <div id="print-slide-container">
          {activeDeck.slides.map((slide, idx) => (
            <div key={idx} className="print-slide">
              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid #1e293b", paddingBottom: "1rem" }}>
                <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest font-mono">FounderAI Pitch</span>
                <span className="font-mono text-xs text-slate-400">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} / {activeDeck.slides.length}
                </span>
              </div>

              <div className="space-y-6 text-left" style={{ margin: "auto 0" }}>
                <h2 className="text-4xl font-extrabold tracking-tight text-white font-outfit">{slide.title}</h2>
                <p className="text-slate-400 text-sm italic">"{slide.subtitle}"</p>
                
                <ul className="space-y-3 pt-6" style={{ listStyleType: "none" }}>
                  {slide.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-slate-200 text-sm flex items-start gap-3 leading-relaxed">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0" style={{ marginTop: "0.4rem" }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[10px] text-slate-500 text-left flex justify-between" style={{ borderTop: "1px solid #1e293b", paddingTop: "1rem" }}>
                <span>Confidential Presentation. All Rights Reserved.</span>
                <span>{activeDeck.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
