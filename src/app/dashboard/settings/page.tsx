"use client";

import { useUser } from "@clerk/nextjs";
import { CreditCard, Shield, User, Key, Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-outfit text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage user preferences, API allocations, and billings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-slate-900/20 border-slate-900 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white font-outfit">User Profile</CardTitle>
            <CardDescription className="text-xs">Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2 pb-4">
              <img 
                src={user?.imageUrl} 
                alt="Profile image" 
                className="w-16 h-16 rounded-full border border-violet-500/20 shadow-md"
              />
              <span className="text-sm font-semibold text-white mt-2">{user?.fullName || "Founder"}</span>
              <span className="text-[10px] text-slate-500 font-mono">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-350">Display Name</Label>
              <Input 
                value={user?.fullName || ""}
                readOnly
                className="bg-slate-950 border-slate-850 text-slate-300 text-xs focus:ring-violet-600 focus:border-violet-600 cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan & Usage */}
        <Card className="bg-slate-900/20 border-slate-900 md:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white font-outfit">Subscription Tier & Usage</CardTitle>
            <CardDescription className="text-xs">Manage active credit allotments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Active Plan</span>
                <h3 className="text-2xl font-black text-white font-outfit mt-1">Founder Pro</h3>
                <p className="text-[11px] text-slate-400 mt-1">Unlimited idea valuations & SWOT outputs active.</p>
              </div>
              <Badge className="bg-violet-600 hover:bg-violet-600 text-white font-bold text-[10px] px-3 py-1">
                PRO ACTIVE
              </Badge>
            </div>

            {/* Simulated Quotas */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Usage Quotas</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Idea Validations</span>
                    <span className="font-semibold text-white">4 / Unlimited</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-900 border border-slate-850 overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Co-Pilot AI Chat completions</span>
                    <span className="font-semibold text-white">356 / Unlimited</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-900 border border-slate-850 overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
