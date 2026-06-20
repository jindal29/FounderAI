"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Users, 
  ShieldAlert, 
  Map, 
  Loader2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  industry: string;
  targetAudience: string;
  status: "DRAFT" | "ANALYZING" | "COMPLETED" | "FAILED";
  createdAt: string;
  analysisReport?: {
    marketScore: number;
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    competitorAnalysis: Array<{
      name: string;
      url: string;
      strength: string;
      gap: string;
    }>;
    targetPersona: {
      archetype: string;
      painPoints: string[];
      coreNeeds: string[];
    };
    marketSize: {
      tam: string;
      sam: string;
      som: string;
      assumptions: string;
    };
    risks: Array<{
      category: string;
      description: string;
      mitigation: string;
    }>;
    validationSteps: Array<{
      step: string;
      methodology: string;
      successCriteria: string;
    }>;
  };
  businessPlan?: {
    executiveSummary: string;
    problemSolution: string;
    monetizationModel: string;
    marketingStrategy: string;
    financialPlan: {
      pricingStructure: string;
      startupCosts: Array<{ item: string; cost: number }>;
      projectedRevenuesY1: number;
      projectedExpensesY1: number;
    };
    milestones: Array<{
      phase: string;
      tasks: string[];
      timeline: string;
    }>;
  };
}

export default function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const router = useRouter();
  const { ideaId } = use(params);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Establishing secure connection to AI agents...",
    "Scanning competitor domain spaces via Google search grounding...",
    "Drafting SWOT matrix quadrants...",
    "Computing TAM, SAM, and SOM estimations...",
    "Delineating targeted customer persona templates...",
    "Mapping execution risks and creating mitigation schemes...",
    "Synthesizing preliminary business plan and milestones...",
    "Wrapping up database caching..."
  ];

  const fetchIdea = async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}`);
      if (res.ok) {
        const data = await res.json();
        setIdea(data);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, [ideaId]);

  // Loading steps animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (runningAnalysis || (idea && idea.status === "ANALYZING")) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [runningAnalysis, idea]);

  const handleRunAnalysis = async () => {
    setRunningAnalysis(true);
    setLoadingStep(0);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/analyze`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIdea(data);
      } else {
        alert("Failed to analyze idea. Please try again.");
      }
    } catch (error) {
      console.error("Analysis trigger error:", error);
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this idea concept? This action is permanent.")) return;

    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading startup details...</span>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-white">Idea not found</h2>
        <Link href="/dashboard" className="text-violet-400 text-sm hover:underline mt-2 inline-block">Return to dashboard</Link>
      </div>
    );
  }

  const isProcessing = runningAnalysis || idea.status === "ANALYZING";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-outfit text-white">{idea.title}</h1>
              <Badge variant="outline" className="border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase">{idea.industry}</Badge>
            </div>
            <p className="text-slate-400 text-xs mt-1 italic">"{idea.oneLiner}"</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/20 hover:bg-rose-950/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Delete Concept"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link 
            href={`/dashboard/chat?ideaId=${idea.id}`}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 transition-colors"
          >
            Ask Co-Founder
          </Link>
        </div>
      </div>

      {/* Analysis State Handlers */}
      {isProcessing && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl shadow-violet-600/5">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">AI Validation Engine Processing</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Evaluating market dynamics. This usually takes around 15-30 seconds.
            </p>
          </div>
          <div className="text-xs text-violet-400 font-medium px-4 py-1.5 rounded-lg bg-violet-950/20 border border-violet-500/20 inline-block animate-pulse">
            {loadingSteps[loadingStep]}
          </div>
        </div>
      )}

      {idea.status === "DRAFT" && !isProcessing && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center max-w-xl mx-auto space-y-6">
          <Sparkles className="w-12 h-12 text-violet-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">Concept Ready for validation</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Run our structured co-founder analysis pipeline to build SWOT metrics, competitor scans, TAM/SAM/SOM sizing, and your business roadmap.
            </p>
          </div>
          <button
            onClick={handleRunAnalysis}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Co-Founder Analysis</span>
          </button>
        </div>
      )}

      {idea.status === "FAILED" && !isProcessing && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/5 p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-outfit">Analysis Pipeline Failed</h3>
            <p className="text-rose-350 text-sm max-w-sm mx-auto leading-relaxed">
              The AI validation script encountered a timeout or model exception. Please retry the compilation.
            </p>
          </div>
          <button
            onClick={handleRunAnalysis}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl font-semibold text-sm transition-colors mx-auto cursor-pointer"
          >
            <span>Retry Pipeline</span>
          </button>
        </div>
      )}

      {/* Main Validation Dashboard */}
      {idea.status === "COMPLETED" && idea.analysisReport && idea.businessPlan && !isProcessing && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/60 p-1 border border-slate-850 rounded-xl flex flex-wrap gap-1 md:inline-flex">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold px-4 py-2 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer">
              Overview
            </TabsTrigger>
            <TabsTrigger value="competitors" className="rounded-lg text-xs font-semibold px-4 py-2 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer">
              Competitors & Persona
            </TabsTrigger>
            <TabsTrigger value="risks" className="rounded-lg text-xs font-semibold px-4 py-2 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer">
              Risks & Steps
            </TabsTrigger>
            <TabsTrigger value="business-plan" className="rounded-lg text-xs font-semibold px-4 py-2 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer">
              Business Plan
            </TabsTrigger>
          </TabsList>

          {/* TAB: OVERVIEW (SWOT & Market Sizing) */}
          <TabsContent value="overview" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Viability Gauge Card */}
              <Card className="bg-slate-900/20 border-slate-900 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white font-outfit">Viability Index</CardTitle>
                  <CardDescription className="text-xs">Aggregate startup validity score</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Circle SVG */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        stroke="#7c3aed" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * idea.analysisReport.marketScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-4xl font-black text-white font-outfit">{idea.analysisReport.marketScore}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Score</div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/40 border border-slate-850 px-3 py-1.5 rounded-lg text-center">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    <span>Strong market potential</span>
                  </div>
                </CardContent>
              </Card>

              {/* Market Size Estimations TAM SAM SOM */}
              <Card className="bg-slate-900/20 border-slate-900 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white font-outfit">Market Sizing (TAM / SAM / SOM)</CardTitle>
                  <CardDescription className="text-xs">AI-driven venture market scale projections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TAM</span>
                      <div className="text-lg font-black text-white mt-1 font-outfit">{idea.analysisReport.marketSize.tam}</div>
                      <span className="text-[10px] text-slate-400 block mt-1">Total Market</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SAM</span>
                      <div className="text-lg font-black text-white mt-1 font-outfit">{idea.analysisReport.marketSize.sam}</div>
                      <span className="text-[10px] text-slate-400 block mt-1">Serviceable Market</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SOM</span>
                      <div className="text-lg font-black text-white mt-1 font-outfit">{idea.analysisReport.marketSize.som}</div>
                      <span className="text-[10px] text-slate-400 block mt-1">Share of Market</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/20">
                    <h4 className="text-xs font-semibold text-white mb-1">Key Estimations & Assumptions</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{idea.analysisReport.marketSize.assumptions}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SWOT Quadrant Matrix */}
            <Card className="bg-slate-900/20 border-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white font-outfit">SWOT Matrix Analysis</CardTitle>
                <CardDescription className="text-xs">Strategic vectors breakdown for market entry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="p-5 rounded-xl border border-emerald-950 bg-emerald-950/5">
                    <h4 className="font-outfit font-bold text-emerald-400 mb-3 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>Strengths (Internal)</span>
                    </h4>
                    <ul className="space-y-2">
                      {idea.analysisReport.swotAnalysis.strengths.map((s, idx) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-5 rounded-xl border border-amber-950 bg-amber-950/5">
                    <h4 className="font-outfit font-bold text-amber-400 mb-3 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>Weaknesses (Internal)</span>
                    </h4>
                    <ul className="space-y-2">
                      {idea.analysisReport.swotAnalysis.weaknesses.map((w, idx) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-5 rounded-xl border border-violet-950 bg-violet-950/5">
                    <h4 className="font-outfit font-bold text-violet-400 mb-3 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                      <span>Opportunities (External)</span>
                    </h4>
                    <ul className="space-y-2">
                      {idea.analysisReport.swotAnalysis.opportunities.map((o, idx) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-5 rounded-xl border border-rose-950 bg-rose-950/5">
                    <h4 className="font-outfit font-bold text-rose-400 mb-3 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span>Threats (External)</span>
                    </h4>
                    <ul className="space-y-2">
                      {idea.analysisReport.swotAnalysis.threats.map((t, idx) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: COMPETITORS & TARGET PERSONA */}
          <TabsContent value="competitors" className="grid grid-cols-1 md:grid-cols-3 gap-6 outline-none">
            {/* Competitor Scanner Card */}
            <Card className="bg-slate-900/20 border-slate-900 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white font-outfit">Competitor Landscape</CardTitle>
                <CardDescription className="text-xs">Mapped market alternatives & key differentiation opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.analysisReport.competitorAnalysis.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{comp.name}</h4>
                        <Badge variant="secondary" className="text-[8px] px-1.5 py-0 bg-slate-900 border-slate-800 text-slate-400 font-mono">
                          {comp.url}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        <strong className="text-slate-300">Core Strength:</strong> {comp.strength}
                      </p>
                      <p className="text-violet-350 text-xs leading-relaxed mt-1">
                        <strong className="text-violet-300">Differentiation Gap:</strong> {comp.gap}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Target Customer Persona */}
            <Card className="bg-slate-900/20 border-slate-900 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white font-outfit">Ideal Customer Archetype</CardTitle>
                <CardDescription className="text-xs">Who is your initial beachhead buyer?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{idea.analysisReport.targetPersona.archetype}</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Beachhead Archetype</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950/30 border border-slate-850">
                    <h5 className="text-xs font-bold text-amber-400 mb-1">Key Pain Points</h5>
                    <ul className="space-y-1.5">
                      {idea.analysisReport.targetPersona.painPoints.map((p, idx) => (
                        <li key={idx} className="text-slate-400 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/30 border border-slate-850">
                    <h5 className="text-xs font-bold text-violet-400 mb-1">Core Needs</h5>
                    <ul className="space-y-1.5">
                      {idea.analysisReport.targetPersona.coreNeeds.map((n, idx) => (
                        <li key={idx} className="text-slate-400 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: RISKS & EXPERIMENTS */}
          <TabsContent value="risks" className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none">
            {/* Risk Mappings */}
            <Card className="bg-slate-900/20 border-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white font-outfit">Execution Risks & Mitigations</CardTitle>
                <CardDescription className="text-xs">Anticipating critical operational hazards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.analysisReport.risks.map((risk, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-rose-950/30 bg-rose-950/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">{risk.category} RISK</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-medium">{risk.description}</p>
                    <p className="text-emerald-450 text-[11px] leading-relaxed">
                      <strong className="text-emerald-400">Mitigation Strategy:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Validation Steps/Experiments */}
            <Card className="bg-slate-900/20 border-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white font-outfit">Recommended Validation Roadmap</CardTitle>
                <CardDescription className="text-xs">Scientific experiments to validate customer interest before building</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.analysisReport.validationSteps.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs">{v.step}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        <strong className="text-slate-300">Methodology:</strong> {v.methodology}
                      </p>
                      <p className="text-violet-350 text-[10px] leading-relaxed">
                        <strong className="text-violet-300">Success Criteria:</strong> {v.successCriteria}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: BUSINESS PLAN */}
          <TabsContent value="business-plan" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Executive Details */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{idea.businessPlan.executiveSummary}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Problem & Solution Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{idea.businessPlan.problemSolution}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Monetization & Pricing Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{idea.businessPlan.monetizationModel}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Go-To-Market (GTM) Acquisition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{idea.businessPlan.marketingStrategy}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Financials & Milestones */}
              <div className="md:col-span-1 space-y-6">
                {/* Financial Projections */}
                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Financial Projections Y1</CardTitle>
                    <CardDescription className="text-xs">Estimate startup operations costs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 text-center">
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Projected Revenue</span>
                        <div className="text-lg font-black text-emerald-400 mt-1 font-outfit">
                          ${idea.businessPlan.financialPlan.projectedRevenuesY1.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 text-center">
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Projected Expenses</span>
                        <div className="text-lg font-black text-rose-400 mt-1 font-outfit">
                          ${idea.businessPlan.financialPlan.projectedExpensesY1.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950/20 border border-slate-850 space-y-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Pricing Structure</span>
                      <p className="text-slate-400 text-xs leading-relaxed">{idea.businessPlan.financialPlan.pricingStructure}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950/20 border border-slate-850 space-y-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Startup Costs Checklist</span>
                      <ul className="space-y-1.5">
                        {idea.businessPlan.financialPlan.startupCosts.map((cost, idx) => (
                          <li key={idx} className="flex items-center justify-between text-xs text-slate-400">
                            <span>{cost.item}</span>
                            <span className="font-semibold text-white">${cost.cost.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Milestones */}
                <Card className="bg-slate-900/20 border-slate-900">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-white font-outfit">Project Milestones</CardTitle>
                    <CardDescription className="text-xs">Roadmap timeline to launch MVP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {idea.businessPlan.milestones.map((phase, idx) => (
                      <div key={idx} className="relative pl-6 border-l border-slate-800 space-y-1">
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-600 border border-slate-950" />
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs">{phase.phase}</h4>
                          <span className="text-[9px] text-violet-400 font-semibold">{phase.timeline}</span>
                        </div>
                        <ul className="space-y-1 pt-1">
                          {phase.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="text-slate-450 text-[10px] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
