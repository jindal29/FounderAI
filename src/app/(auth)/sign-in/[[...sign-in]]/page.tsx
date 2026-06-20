import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-2">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              FounderAI
            </span>
          </div>
          <p className="text-sm text-slate-400 text-center">Validate your ideas, co-pilot your build</p>
        </div>
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                card: "bg-transparent border-0 shadow-none p-0 w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                logoBox: "hidden",
                footerActionText: "text-slate-400 font-normal",
                footerActionLink: "text-violet-400 hover:text-violet-300 font-medium",
                formButtonPrimary: "bg-violet-600 hover:bg-violet-500 text-white border-0 transition-colors shadow-lg shadow-violet-500/20",
                formFieldLabel: "text-slate-300 font-medium",
                formFieldInput: "bg-slate-900/60 border-slate-800 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500",
                identityPreviewTextButton: "text-slate-300 hover:text-white",
                identityPreviewEditButton: "text-violet-400 hover:text-violet-300",
                dividerLine: "bg-slate-800",
                dividerText: "text-slate-500",
                socialButtonsBlockButton: "bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-300 rounded-lg transition-colors",
                socialButtonsBlockButtonText: "text-slate-300 font-medium",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
