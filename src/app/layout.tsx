import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FounderAI - AI Startup Co-Founder & Validator",
  description: "Validate your startup ideas, run deep SWOT analysis, calculate market sizes, map competitors, and chat with an interactive AI startup builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c3aed", // violet-600
        },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${outfit.variable} h-full dark`}
        style={{ colorScheme: "dark" }}
      >
        <body className="font-sans min-h-full bg-slate-950 text-slate-100 flex flex-col antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
