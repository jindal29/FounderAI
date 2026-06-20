"use client";

import { useState } from "react";
import { TrendingUp, Users, Target, ShieldAlert, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MarketResearchPage() {
  // Calculator state
  const [totalCustomers, setTotalCustomers] = useState(100000);
  const [annualValue, setAnnualValue] = useState(120);
  const [serviceablePercent, setServiceablePercent] = useState(30);
  const [obtainablePercent, setObtainablePercent] = useState(5);

  // Static Math
  const tam = totalCustomers * annualValue;
  const sam = tam * (serviceablePercent / 100);
  const som = sam * (obtainablePercent / 100);

  const trends = [
    { trend: "SaaS Verticalization", impact: "High", detail: "Users demand niche, hyper-customized platforms instead of generic platforms like Salesforce." },
    { trend: "AI Agent Orchestration", impact: "Medium", detail: "Transitioning from conversational chatbots to autonomous workflows." },
    { trend: "Zero-Code Prototyping", impact: "High", detail: "Indie hackers launch MVPs within days using integrated component frameworks." }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">Market Research & Sizing</h1>
          <p className="text-slate-400 text-sm mt-1">Estimate market segments, identify industry trends, and size your TAM/SAM/SOM.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
          <Sparkles className="w-4 h-4" />
          <span>Scan Live Trends</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sizing Interactive Calculator */}
        <Card className="bg-slate-900/20 border-slate-900 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white font-outfit">Market Sizing Calculator</CardTitle>
            <CardDescription className="text-xs">Estimate numbers to calculate your share</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-350">Total Potential Customers (TAM)</Label>
              <Input
                type="number"
                value={totalCustomers}
                onChange={(e) => setTotalCustomers(Number(e.target.value))}
                className="bg-slate-950 border-slate-850 text-slate-100 text-xs focus:ring-violet-600 focus:border-violet-600"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-350">Annual ACV/Subscription Value ($)</Label>
              <Input
                type="number"
                value={annualValue}
                onChange={(e) => setAnnualValue(Number(e.target.value))}
                className="bg-slate-950 border-slate-850 text-slate-100 text-xs focus:ring-violet-600 focus:border-violet-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-350">SAM Share (%)</Label>
                <Input
                  type="number"
                  value={serviceablePercent}
                  onChange={(e) => setServiceablePercent(Number(e.target.value))}
                  className="bg-slate-950 border-slate-850 text-slate-100 text-xs focus:ring-violet-600 focus:border-violet-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-350">SOM Share (%)</Label>
                <Input
                  type="number"
                  value={obtainablePercent}
                  onChange={(e) => setObtainablePercent(Number(e.target.value))}
                  className="bg-slate-950 border-slate-850 text-slate-100 text-xs focus:ring-violet-600 focus:border-violet-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Math Output Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TAM Projections</span>
              <div className="text-2xl font-black text-white mt-3 font-outfit">${tam.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Total Addressable Market</span>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SAM Projections</span>
              <div className="text-2xl font-black text-violet-400 mt-3 font-outfit">${sam.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Serviceable Market ({serviceablePercent}%)</span>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SOM Projections</span>
              <div className="text-2xl font-black text-emerald-450 mt-3 font-outfit">${som.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Share of Market ({obtainablePercent}%)</span>
            </div>
          </div>

          {/* Industry Trends */}
          <Card className="bg-slate-900/20 border-slate-900">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-outfit">Industry Trends & Impacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trends.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">{item.trend}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                      item.impact === "High" ? "bg-rose-950/20 border border-rose-500/20 text-rose-400" : "bg-amber-950/20 border border-amber-500/20 text-amber-400"
                    }`}>{item.impact} Impact</span>
                  </div>
                  <p className="text-slate-450 text-[11px] leading-relaxed pt-1">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
