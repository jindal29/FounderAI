import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const apiKey = process.env.OPENAI_API_KEY || "dummy_openai_key_for_nextjs_build";

export const openai = new OpenAI({ apiKey });

// Zod schemas for structured output matching our database JSON fields
export const SwotSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});

export const CompetitorSchema = z.object({
  name: z.string(),
  url: z.string().describe("Simulated or real URL of competitor"),
  strength: z.string(),
  gap: z.string().describe("Where this competitor falls short and our user can differentiate"),
});

export const TargetPersonaSchema = z.object({
  archetype: z.string().describe("Name/title of user archetype"),
  painPoints: z.array(z.string()),
  coreNeeds: z.array(z.string()),
});

export const MarketSizeSchema = z.object({
  tam: z.string().describe("Total Addressable Market size with details"),
  sam: z.string().describe("Serviceable Addressable Market size with details"),
  som: z.string().describe("Serviceable Obtainable Market size with details"),
  assumptions: z.string().describe("Key calculations and assumptions made"),
});

export const RiskSchema = z.object({
  category: z.string(),
  description: z.string(),
  mitigation: z.string(),
});

export const ValidationStepSchema = z.object({
  step: z.string(),
  methodology: z.string(),
  successCriteria: z.string(),
});

export const AnalysisReportOutputSchema = z.object({
  marketScore: z.number().min(1).max(100),
  swotAnalysis: SwotSchema,
  competitorAnalysis: z.array(CompetitorSchema),
  targetPersona: TargetPersonaSchema,
  marketSize: MarketSizeSchema,
  risks: z.array(RiskSchema),
  validationSteps: z.array(ValidationStepSchema),
});

export async function generateStructuredReport(
  title: string,
  oneLiner: string,
  description: string,
  industry: string,
  targetAudience: string
) {
  const prompt = `
    You are an expert venture capitalist and experienced startup builder. 
    Analyze the following startup idea and generate a structured startup validation report.
    
    Startup Name/Title: ${title}
    One Liner: ${oneLiner}
    Description: ${description}
    Industry: ${industry}
    Target Audience: ${targetAudience}
    
    Evaluate the market viability, strengths/weaknesses/opportunities/threats, direct and indirect competitors, customer personas, market sizing estimations, execution risks, and a roadmap of validation steps.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You analyze startup concepts and output rich, deeply structured JSON validation reports." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(AnalysisReportOutputSchema, "report"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as AnalysisReportOutput;
}
export type AnalysisReportOutput = z.infer<typeof AnalysisReportOutputSchema>;

export const BusinessPlanOutputSchema = z.object({
  executiveSummary: z.string(),
  problemSolution: z.string(),
  monetizationModel: z.string(),
  marketingStrategy: z.string(),
  financialPlan: z.object({
    pricingStructure: z.string(),
    startupCosts: z.array(z.object({ item: z.string(), cost: z.number() })),
    projectedRevenuesY1: z.number(),
    projectedExpensesY1: z.number(),
  }),
  milestones: z.array(
    z.object({
      phase: z.string(),
      tasks: z.array(z.string()),
      timeline: z.string(),
    })
  ),
});

export type BusinessPlanOutput = z.infer<typeof BusinessPlanOutputSchema>;

export async function generateBusinessPlan(
  title: string,
  oneLiner: string,
  description: string,
  industry: string,
  targetAudience: string
) {
  const prompt = `
    You are an expert startup co-founder.
    Create a comprehensive business plan for the following startup concept.
    
    Startup Name/Title: ${title}
    One Liner: ${oneLiner}
    Description: ${description}
    Industry: ${industry}
    Target Audience: ${targetAudience}
    
    Generate detailed executive summary, problem-solution statement, monetization structure, marketing and customer acquisition strategy, financial projections (pricing, initial cost checklist, year 1 projected revenue and expenses), and development milestones/roadmap.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You draft detailed startup business plans and output formatted JSON objects." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(BusinessPlanOutputSchema, "business_plan"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as BusinessPlanOutput;
}

export const StartupNamesOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string(),
      tagline: z.string(),
      rationale: z.string(),
    })
  ),
});

export type StartupNamesOutput = z.infer<typeof StartupNamesOutputSchema>;

export async function generateStartupNames(description: string, industry: string) {
  const prompt = `
    Generate 5 catchy, premium, modern startup name suggestions for a project in the ${industry} industry.
    Project Description: ${description}
    
    Provide a name, a tagline, and a brief rationale explaining why the name fits the concept.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You generate premium, brandable startup names and taglines in JSON format." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(StartupNamesOutputSchema, "names"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as StartupNamesOutput;
}

export const BusinessSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    })
  ),
});

export type BusinessSuggestionsOutput = z.infer<typeof BusinessSuggestionsOutputSchema>;

export async function generateBusinessSuggestions(title: string, description: string, industry: string) {
  const prompt = `
    Generate 3 tactical business suggestions or pivots for the following startup concept.
    
    Startup: ${title}
    Industry: ${industry}
    Description: ${description}
    
    Provide actionable ideas (e.g., pricing hacks, distribution channels, feature adjustments), ranking their business impact and implementation difficulty.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You analyze startup concepts and output tactical suggestions in JSON format." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(BusinessSuggestionsOutputSchema, "suggestions"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as BusinessSuggestionsOutput;
}

export const CompetitorDetailSchema = z.object({
  name: z.string(),
  website: z.string().describe("Real or simulated URL of the competitor"),
  pricing: z.string().describe("Pricing model details, e.g. Free, subscription, one-time"),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  marketPosition: z.string().describe("Market positioning, e.g. Leader, Niche, Disrupter, Challenger"),
  differentiation: z.string().describe("Opportunities to differentiate against this competitor"),
});

export const CompetitorReportOutputSchema = z.object({
  competitors: z.array(CompetitorDetailSchema),
});

export type CompetitorReportOutput = z.infer<typeof CompetitorReportOutputSchema>;

export async function generateCompetitorReport(title: string, description: string, industry: string) {
  const prompt = `
    You are an expert venture capitalist and startup strategist.
    Generate a detailed competitor analysis report for the following startup concept.
    
    Startup Name/Title: ${title}
    Industry: ${industry}
    Description: ${description}
    
    Identify 3-4 top competitors. For each competitor, evaluate their website, pricing model/cost, strengths, weaknesses, market position, and specific differentiation opportunities for our startup concept.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You perform exhaustive competitor analysis and output structured JSON reports." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(CompetitorReportOutputSchema, "competitor_report"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as CompetitorReportOutput;
}

export const BusinessModelCanvasOutputSchema = z.object({
  keyPartners: z.array(z.string()),
  keyActivities: z.array(z.string()),
  keyResources: z.array(z.string()),
  valuePropositions: z.array(z.string()),
  customerRelationships: z.array(z.string()),
  channels: z.array(z.string()),
  customerSegments: z.array(z.string()),
  costStructure: z.array(z.string()),
  revenueStreams: z.array(z.string()),
});

export type BusinessModelCanvasOutput = z.infer<typeof BusinessModelCanvasOutputSchema>;

export async function generateBusinessModelCanvas(title: string, description: string, industry: string) {
  const prompt = `
    You are an expert startup co-founder and strategist.
    Generate a complete, professional Business Model Canvas (BMC) for the following startup concept.
    
    Startup Name/Title: ${title}
    Industry: ${industry}
    Description: ${description}
    
    For each of the 9 sections of the Business Model Canvas, generate 3-5 highly relevant, actionable points.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You generate professional Business Model Canvases and output structured JSON objects." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(BusinessModelCanvasOutputSchema, "canvas"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as BusinessModelCanvasOutput;
}

export const MvpPhaseSchema = z.object({
  name: z.string().describe("Phase title, e.g. Phase 1: Core API Setup"),
  tasks: z.array(z.string()).describe("List of milestones/tasks for this phase"),
});

export const TechStackItemSchema = z.object({
  category: z.string().describe("Category of tech, e.g. Frontend Core, Storage Database"),
  tech: z.string().describe("Name of technology, e.g. Next.js, PostgreSQL"),
  why: z.string().describe("Rationale for selection"),
});

export const MvpRoadmapOutputSchema = z.object({
  phases: z.array(MvpPhaseSchema),
  techStack: z.array(TechStackItemSchema),
  timeline: z.string().describe("Overall estimated timeline, e.g. '4 Weeks'"),
  cost: z.string().describe("Overall estimated cost to build/launch, e.g. '$1,200'"),
});

export type MvpRoadmapOutput = z.infer<typeof MvpRoadmapOutputSchema>;

export async function generateMvpRoadmap(title: string, description: string, industry: string) {
  const prompt = `
    You are an expert Chief Technology Officer and startup builder.
    Generate a detailed MVP development roadmap and technical specification for the following startup concept.
    
    Startup Name/Title: ${title}
    Industry: ${industry}
    Description: ${description}
    
    Structure the roadmap exactly into 3 clear implementation phases (Phase 1, Phase 2, Phase 3) containing 3-5 development tasks each.
    Recommend a tailored tech stack (frontend, backend, auth, database, APIs/services) explaining the selection rationale.
    Provide an estimated timeline and overall cost to build and launch this MVP.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You act as a CTO. Generate highly structured technical MVP roadmaps in JSON format." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(MvpRoadmapOutputSchema, "roadmap"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as MvpRoadmapOutput;
}

export const SlideSchema = z.object({
  title: z.string().describe("Slide title, e.g. The Problem or The Ask"),
  subtitle: z.string().describe("Slide subtitle or main takeaway phrase"),
  bullets: z.array(z.string()).describe("3-4 bullet points supporting the slide topic"),
  script: z.string().describe("Verbal script notes/speaker notes for the presenter"),
});

export const PitchDeckOutputSchema = z.object({
  slides: z.array(SlideSchema),
});

export type PitchDeckOutput = z.infer<typeof PitchDeckOutputSchema>;

export async function generatePitchDeck(title: string, description: string, industry: string) {
  const prompt = `
    You are an expert venture capitalist and pitch advisor.
    Generate a 10-slide investor-ready pitch deck script and slide outlines for the following startup concept.
    
    Startup Name/Title: ${title}
    Industry: ${industry}
    Description: ${description}
    
    You MUST generate exactly 10 slides, in the following order:
    1. Title Slide: Title, subtitle, and intro script
    2. Problem: 3 critical pain points, and explanation script
    3. Solution: 3 core solution value propositions, and explanation script
    4. Market Opportunity: TAM/SAM/SOM market sizing numbers, and script
    5. Product: Key product features and user benefits, and script
    6. Business Model: 3 monetization and pricing channels, and script
    7. Competitors: Competitive advantages and differentiation gaps, and script
    8. Go-To-Market: Marketing channels and customer acquisition strategy, and script
    9. Team: Ideal key roles and profiles needed, and script
    10. Ask: Funding request, milestone milestones, and call to action script
    
    For each slide, provide a concise title, a subtitle, exactly 3-4 bullet points, and a detailed verbal presenter script.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You generate professional 10-slide pitch decks in structured JSON format." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(PitchDeckOutputSchema, "pitch_deck"),
  });

  return JSON.parse(completion.choices[0].message.content || "{}") as PitchDeckOutput;
}






