"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  MessageSquare, 
  BarChart4, 
  Sparkles, 
  Check,
  TrendingUp,
  Target
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any, // Custom premium ease-out
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white font-outfit">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              FounderAI
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            {!isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
            {isSignedIn && (
              <>
                <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all">
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-32 md:pb-32 max-w-7xl mx-auto text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge indicator */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-300 text-xs font-semibold mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing FounderAI 1.0 — Your AI Co-Founder</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-7xl font-extrabold tracking-tight font-outfit text-white max-w-4xl leading-[1.1]"
          >
            Your AI Startup Co-Founder. <br/>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              From Idea to Enterprise.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl text-slate-400 max-w-2xl mt-6 leading-relaxed"
          >
            Validate business concepts, analyze live competitors, estimate market sizing (TAM/SAM/SOM), and co-pilot execution roadmaps alongside dynamic AI co-founders.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all shadow-xl shadow-violet-600/30 hover:scale-[1.02] cursor-pointer">
                  Launch Your First Idea
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all shadow-xl shadow-violet-600/30 hover:scale-[1.02]">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-colors">
              How it works
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Demo Section */}
      <section id="features" className="px-6 py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white">
              Complete Validation Pipeline
            </h2>
            <p className="text-slate-400 mt-4">
              Stop guessing if your idea will work. Get deep, quantitative assessments generated by specialized AI agents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-950 bg-slate-900/30 hover:bg-slate-900/50 p-8 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-white mb-2">Market Viability Score</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive an aggregate viability index based on customer demand, monetization potential, and regulatory barriers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-950 bg-slate-900/30 hover:bg-slate-900/50 p-8 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-fuchsia-600/10 flex items-center justify-center text-fuchsia-400 mb-6 border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
                <BarChart4 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-white mb-2">SWOT & Market Estimates</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Structured assessments outlining strengths, risks, and estimations for Total Addressable Market size (TAM/SAM/SOM).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-950 bg-slate-900/30 hover:bg-slate-900/50 p-8 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-600/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-pink-600/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-white mb-2">Interactive AI Co-Pilot</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bounce off thoughts and refine your business model in real-time with an AI partner anchored on your business plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 mt-4">
            Start validating for free, upgrade when you are ready to build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold font-outfit text-white">Free Sandbox</h3>
              <p className="text-slate-400 text-sm mt-2">Perfect for brainstorming initial ideas.</p>
              <div className="text-4xl font-extrabold text-white mt-6">$0</div>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>1 Active Idea Validation</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Interactive Chat Co-Pilot (Gemini)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500 line-through">
                  <span>SWOT & Competitor Maps (OpenAI)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500 line-through">
                  <span>TAM/SAM/SOM Analysis (OpenAI)</span>
                </li>
              </ul>
            </div>
            
            <Link href="/dashboard" className="w-full mt-8 py-3 rounded-xl text-center text-sm font-semibold border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white transition-colors">
              Start Brainstorming
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl border border-violet-500/50 bg-slate-900/50 p-8 backdrop-blur-sm flex flex-col justify-between shadow-lg shadow-violet-600/10">
            <div className="absolute -top-4 right-6 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
              RECOMMENDED
            </div>
            <div>
              <h3 className="text-2xl font-bold font-outfit text-white">Founder Pro</h3>
              <p className="text-slate-400 text-sm mt-2">For serious builders creating companies.</p>
              <div className="text-4xl font-extrabold text-white mt-6">$49<span className="text-lg font-normal text-slate-400">/mo</span></div>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Unlimited Idea Validations</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Complete SWOT & Competitor Analysis</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>TAM/SAM/SOM Calculations</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Interactive Co-Founder Chat</span>
                </li>
              </ul>
            </div>
            
            <Link href="/dashboard" className="w-full mt-8 py-3 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all shadow-md shadow-violet-600/20">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 FounderAI. Built for innovators, powered by intelligence.</p>
      </footer>
    </div>
  );
}
