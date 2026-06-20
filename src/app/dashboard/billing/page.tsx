"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingStatus {
  isPro: boolean;
  stripeCurrentPeriodEnd: string | null;
}

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch("/api/billing");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (err) {
        console.error("Failed to load billing status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const handleCheckout = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        alert("Failed to initiate subscription. Please configure Stripe price keys.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  const isPro = status?.isPro || false;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-outfit text-white">Subscription Management</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your payment details and manage subscription tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Overview Card */}
        <Card className="bg-slate-900/20 border-slate-900 md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white font-outfit">Current Plan</CardTitle>
            <CardDescription className="text-xs">Your current active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="text-3xl font-black text-white font-outfit uppercase">
              {isPro ? "Pro Plan" : "Free Tier"}
            </div>
            {isPro && status?.stripeCurrentPeriodEnd && (
              <p className="text-xs text-slate-400">
                Renews on: <strong className="text-slate-200">{new Date(status.stripeCurrentPeriodEnd).toLocaleDateString()}</strong>
              </p>
            )}
            
            {isPro ? (
              <button
                onClick={handlePortal}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Manage Billing</span>}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Upgrade to Pro</span>}
              </button>
            )}
          </CardContent>
        </Card>

        {/* Feature comparison */}
        <Card className="bg-slate-900/20 border-slate-900 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white font-outfit">Tier Features</CardTitle>
            <CardDescription className="text-xs">Compare plan capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Free sandbox</span>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>1 Active Validation</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Co-Pilot Chat (Gemini)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Pro founder</span>
                </span>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-xs text-slate-350">
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Unlimited Validations</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-350">
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Deep competitor maps (OpenAI)</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-350">
                    <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Interactive Business Plan</span>
                  </li>
                </ul>
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
