import { AIProvider } from "./types";
import { ai } from "../gemini";
import { 
  AnalysisReportOutput, 
  BusinessPlanOutput, 
  StartupNamesOutput, 
  BusinessSuggestionsOutput,
  CompetitorReportOutput,
  BusinessModelCanvasOutput,
  MvpRoadmapOutput,
  PitchDeckOutput
} from "../openai";

// Schema definitions using Gemini's OpenAPI-compliant Schema structures
const analysisReportSchema: any = {
  type: "OBJECT",
  properties: {
    marketScore: { type: "INTEGER" },
    swotAnalysis: {
      type: "OBJECT",
      properties: {
        strengths: { type: "ARRAY", items: { type: "STRING" } },
        weaknesses: { type: "ARRAY", items: { type: "STRING" } },
        opportunities: { type: "ARRAY", items: { type: "STRING" } },
        threats: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"]
    },
    competitorAnalysis: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          url: { type: "STRING" },
          strength: { type: "STRING" },
          gap: { type: "STRING" }
        },
        required: ["name", "url", "strength", "gap"]
      }
    },
    targetPersona: {
      type: "OBJECT",
      properties: {
        archetype: { type: "STRING" },
        painPoints: { type: "ARRAY", items: { type: "STRING" } },
        coreNeeds: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["archetype", "painPoints", "coreNeeds"]
    },
    marketSize: {
      type: "OBJECT",
      properties: {
        tam: { type: "STRING" },
        sam: { type: "STRING" },
        som: { type: "STRING" },
        assumptions: { type: "STRING" }
      },
      required: ["tam", "sam", "som", "assumptions"]
    },
    risks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          description: { type: "STRING" },
          mitigation: { type: "STRING" }
        },
        required: ["category", "description", "mitigation"]
      }
    },
    validationSteps: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          step: { type: "STRING" },
          methodology: { type: "STRING" },
          successCriteria: { type: "STRING" }
        },
        required: ["step", "methodology", "successCriteria"]
      }
    }
  },
  required: [
    "marketScore",
    "swotAnalysis",
    "competitorAnalysis",
    "targetPersona",
    "marketSize",
    "risks",
    "validationSteps"
  ]
};

const businessPlanSchema: any = {
  type: "OBJECT",
  properties: {
    executiveSummary: { type: "STRING" },
    problemSolution: { type: "STRING" },
    monetizationModel: { type: "STRING" },
    marketingStrategy: { type: "STRING" },
    financialPlan: {
      type: "OBJECT",
      properties: {
        pricingStructure: { type: "STRING" },
        startupCosts: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              item: { type: "STRING" },
              cost: { type: "NUMBER" }
            },
            required: ["item", "cost"]
          }
        },
        projectedRevenuesY1: { type: "NUMBER" },
        projectedExpensesY1: { type: "NUMBER" }
      },
      required: ["pricingStructure", "startupCosts", "projectedRevenuesY1", "projectedExpensesY1"]
    },
    milestones: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          phase: { type: "STRING" },
          tasks: { type: "ARRAY", items: { type: "STRING" } },
          timeline: { type: "STRING" }
        },
        required: ["phase", "tasks", "timeline"]
      }
    }
  },
  required: ["executiveSummary", "problemSolution", "monetizationModel", "marketingStrategy", "financialPlan", "milestones"]
};

const startupNamesSchema: any = {
  type: "OBJECT",
  properties: {
    suggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          tagline: { type: "STRING" },
          rationale: { type: "STRING" }
        },
        required: ["name", "tagline", "rationale"]
      }
    }
  },
  required: ["suggestions"]
};

const businessSuggestionsSchema: any = {
  type: "OBJECT",
  properties: {
    suggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          impact: { type: "STRING", enum: ["LOW", "MEDIUM", "HIGH"] },
          difficulty: { type: "STRING", enum: ["EASY", "MEDIUM", "HARD"] }
        },
        required: ["title", "description", "impact", "difficulty"]
      }
    }
  },
  required: ["suggestions"]
};

const competitorReportSchema: any = {
  type: "OBJECT",
  properties: {
    competitors: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          website: { type: "STRING" },
          pricing: { type: "STRING" },
          strengths: { type: "ARRAY", items: { type: "STRING" } },
          weaknesses: { type: "ARRAY", items: { type: "STRING" } },
          marketPosition: { type: "STRING" },
          differentiation: { type: "STRING" }
        },
        required: ["name", "website", "pricing", "strengths", "weaknesses", "marketPosition", "differentiation"]
      }
    }
  },
  required: ["competitors"]
};

const businessModelCanvasSchema: any = {
  type: "OBJECT",
  properties: {
    keyPartners: { type: "ARRAY", items: { type: "STRING" } },
    keyActivities: { type: "ARRAY", items: { type: "STRING" } },
    keyResources: { type: "ARRAY", items: { type: "STRING" } },
    valuePropositions: { type: "ARRAY", items: { type: "STRING" } },
    customerRelationships: { type: "ARRAY", items: { type: "STRING" } },
    channels: { type: "ARRAY", items: { type: "STRING" } },
    customerSegments: { type: "ARRAY", items: { type: "STRING" } },
    costStructure: { type: "ARRAY", items: { type: "STRING" } },
    revenueStreams: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "keyPartners",
    "keyActivities",
    "keyResources",
    "valuePropositions",
    "customerRelationships",
    "channels",
    "customerSegments",
    "costStructure",
    "revenueStreams",
  ],
};

const mvpRoadmapSchema: any = {
  type: "OBJECT",
  properties: {
    phases: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          tasks: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["name", "tasks"]
      }
    },
    techStack: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          tech: { type: "STRING" },
          why: { type: "STRING" }
        },
        required: ["category", "tech", "why"]
      }
    },
    timeline: { type: "STRING" },
    cost: { type: "STRING" }
  },
  required: ["phases", "techStack", "timeline", "cost"]
};

const pitchDeckSchema: any = {
  type: "OBJECT",
  properties: {
    slides: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          subtitle: { type: "STRING" },
          bullets: { type: "ARRAY", items: { type: "STRING" } },
          script: { type: "STRING" }
        },
        required: ["title", "subtitle", "bullets", "script"]
      }
    }
  },
  required: ["slides"]
};





export class GeminiProvider implements AIProvider {
  async generateStructuredReport(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<AnalysisReportOutput> {
    const prompt = `
      You are an expert venture capitalist and experienced startup builder. 
      Analyze the following startup idea and generate a structured startup validation report conforming to the requested schema.
      
      Startup Name/Title: ${title}
      One Liner: ${oneLiner}
      Description: ${description}
      Industry: ${industry}
      Target Audience: ${targetAudience}
      
      Evaluate the market viability, strengths/weaknesses/opportunities/threats, direct and indirect competitors, customer personas, market sizing estimations, execution risks, and a roadmap of validation steps.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You analyze startup concepts and output rich, deeply structured JSON validation reports.",
        responseMimeType: "application/json",
        responseSchema: analysisReportSchema,
      }
    });

    return JSON.parse(response.text || "{}") as AnalysisReportOutput;
  }

  async generateBusinessPlan(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<BusinessPlanOutput> {
    const prompt = `
      You are an expert startup co-founder.
      Create a comprehensive business plan for the following startup concept conforming to the requested schema.
      
      Startup Name/Title: ${title}
      One Liner: ${oneLiner}
      Description: ${description}
      Industry: ${industry}
      Target Audience: ${targetAudience}
      
      Generate detailed executive summary, problem-solution statement, monetization structure, marketing and customer acquisition strategy, financial projections (pricing, initial cost checklist, year 1 projected revenue and expenses), and development milestones/roadmap.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You draft detailed startup business plans and output formatted JSON objects.",
        responseMimeType: "application/json",
        responseSchema: businessPlanSchema,
      }
    });

    return JSON.parse(response.text || "{}") as BusinessPlanOutput;
  }

  async generateStartupNames(
    description: string,
    industry: string
  ): Promise<StartupNamesOutput> {
    const prompt = `
      Generate 5 catchy, premium, modern startup name suggestions for a project in the ${industry} industry.
      Project Description: ${description}
      
      Provide a name, a tagline, and a brief rationale explaining why the name fits the concept.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You generate premium, brandable startup names and taglines in JSON format.",
        responseMimeType: "application/json",
        responseSchema: startupNamesSchema,
      }
    });

    return JSON.parse(response.text || "{}") as StartupNamesOutput;
  }

  async generateBusinessSuggestions(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessSuggestionsOutput> {
    const prompt = `
      Generate 3 tactical business suggestions or pivots for the following startup concept.
      
      Startup: ${title}
      Industry: ${industry}
      Description: ${description}
      
      Provide actionable ideas (e.g., pricing hacks, distribution channels, feature adjustments), ranking their business impact and implementation difficulty.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You analyze startup concepts and output tactical suggestions in JSON format.",
        responseMimeType: "application/json",
        responseSchema: businessSuggestionsSchema,
      }
    });

    return JSON.parse(response.text || "{}") as BusinessSuggestionsOutput;
  }

  async generateCompetitorReport(
    title: string,
    description: string,
    industry: string
  ): Promise<CompetitorReportOutput> {
    const prompt = `
      You are an expert venture capitalist and startup strategist.
      Generate a detailed competitor analysis report for the following startup concept conforming to the requested schema.
      
      Startup Name/Title: ${title}
      Industry: ${industry}
      Description: ${description}
      
      Identify 3-4 top competitors. For each competitor, evaluate their website, pricing model/cost, strengths, weaknesses, market position, and specific differentiation opportunities for our startup concept.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You perform exhaustive competitor analysis and output structured JSON reports.",
        responseMimeType: "application/json",
        responseSchema: competitorReportSchema,
      }
    });

    return JSON.parse(response.text || "{}") as CompetitorReportOutput;
  }

  async generateBusinessModelCanvas(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessModelCanvasOutput> {
    const prompt = `
      You are an expert startup co-founder and strategist.
      Generate a complete, professional Business Model Canvas (BMC) for the following startup concept conforming to the requested schema.
      
      Startup Name/Title: ${title}
      Industry: ${industry}
      Description: ${description}
      
      For each of the 9 sections of the Business Model Canvas, generate 3-5 highly relevant, actionable points.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You generate professional Business Model Canvases and output structured JSON objects.",
        responseMimeType: "application/json",
        responseSchema: businessModelCanvasSchema,
      }
    });

    return JSON.parse(response.text || "{}") as BusinessModelCanvasOutput;
  }

  async generateMvpRoadmap(
    title: string,
    description: string,
    industry: string
  ): Promise<MvpRoadmapOutput> {
    const prompt = `
      You are an expert Chief Technology Officer and startup builder.
      Generate a detailed MVP development roadmap and technical specification for the following startup concept conforming to the requested schema.
      
      Startup Name/Title: ${title}
      Industry: ${industry}
      Description: ${description}
      
      Structure the roadmap exactly into 3 clear implementation phases (Phase 1, Phase 2, Phase 3) containing 3-5 development tasks each.
      Recommend a tailored tech stack (frontend, backend, auth, database, APIs/services) explaining the selection rationale.
      Provide an estimated timeline and overall cost to build and launch this MVP.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You act as a CTO. Generate highly structured technical MVP roadmaps in JSON format.",
        responseMimeType: "application/json",
        responseSchema: mvpRoadmapSchema,
      }
    });

    return JSON.parse(response.text || "{}") as MvpRoadmapOutput;
  }

  async generatePitchDeck(
    title: string,
    description: string,
    industry: string
  ): Promise<PitchDeckOutput> {
    const prompt = `
      You are an expert venture capitalist and pitch advisor.
      Generate a 10-slide investor-ready pitch deck script and slide outlines for the following startup concept conforming to the requested schema.
      
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You generate professional 10-slide pitch decks in structured JSON format.",
        responseMimeType: "application/json",
        responseSchema: pitchDeckSchema,
      }
    });

    return JSON.parse(response.text || "{}") as PitchDeckOutput;
  }
}



