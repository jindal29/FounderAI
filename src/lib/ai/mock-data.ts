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

export function getMockStructuredReport(
  title: string,
  oneLiner: string,
  description: string,
  industry: string,
  targetAudience: string
): AnalysisReportOutput {
  return {
    marketScore: 84,
    swotAnalysis: {
      strengths: [
        `Direct focus on the high-growth ${industry} space.`,
        "Value proposition is easily understandable: solving pain points for target segments.",
        `Tailored solution for ${targetAudience} yielding high initial conversion potential.`
      ],
      weaknesses: [
        "Relies heavily on continuous user adoption loops.",
        "Initial customer acquisition costs (CAC) might be high in competitive digital channels.",
        "Product differentiation relies on continuous proprietary technology iteration."
      ],
      opportunities: [
        "Unlocking corporate enterprise partnerships for wholesale licensing.",
        "Expanding feature verticals into closely aligned digital workspaces.",
        "Developing developer SDK wrappers to enable white-label integrations."
      ],
      threats: [
        "Rapid emergence of low-cost copycat alternatives.",
        "Platform dependency on primary infrastructure providers (e.g. AWS, OpenAI, Clerk).",
        "Potential regulatory shifts around data privacy and automated operations."
      ]
    },
    competitorAnalysis: [
      {
        name: `${title} Competitor Alpha`,
        url: "https://competitor-alpha-example.com",
        strength: "Large existing market footprint and enterprise sales channels.",
        gap: "Relatively slow feature development cycle and rigid, expensive licensing models."
      },
      {
        name: `${title} Competitor Beta`,
        url: "https://competitor-beta-example.com",
        strength: "Open-source developer community backing.",
        gap: "Lack of hosted user-friendly dashboards and premium customer support."
      }
    ],
    targetPersona: {
      archetype: `Tech-Savvy Professionals / ${targetAudience}`,
      painPoints: [
        "Wasting hours on manual, repetitive setup pipelines.",
        "High cost of existing premium corporate toolsets.",
        "Lack of centralized, unified project management platforms."
      ],
      coreNeeds: [
        "Automation of foundational tasks to reclaim time.",
        "Affordable pricing tiers suited for small teams and individuals.",
        "Clean, intuitive, and modern UI dashboards."
      ]
    },
    marketSize: {
      tam: "$5.2B Global market spend in related digital tools",
      sam: "$850M Serviceable digital market segment",
      som: "$42M Serviceable obtainable share within 3 years",
      assumptions: "Calculated based on standard industry analyst reports, assuming a $10/month pricing model per active subscriber."
    },
    risks: [
      {
        category: "Technical Risk",
        description: "API changes or service outages from foundational providers (e.g., Clerk, Stripe, LLMs).",
        mitigation: "Implement robust query caching layers and build abstract provider wrappers for quick switching."
      },
      {
        category: "Adoption Risk",
        description: "User signups stall due to high friction in onboarding.",
        mitigation: "Optimize Clerk signup paths, pre-load interactive sandbox states, and provide single-click templates."
      }
    ],
    validationSteps: [
      {
        step: "Validate Value Hypothesis",
        methodology: "Create a simple glassmorphic landing page with high-fidelity mockups and track email signup conversion rates.",
        successCriteria: "Achieve a minimum 15% conversion rate on cold traffic signups."
      },
      {
        step: "Validate Willingness to Pay",
        methodology: "Introduce a Stripe pre-order checkout flow or discounted beta tier during early pilot programs.",
        successCriteria: "Secure at least 50 paid pre-orders within the first 30 days."
      }
    ]
  };
}

export function getMockBusinessPlan(
  title: string,
  oneLiner: string,
  description: string,
  industry: string,
  targetAudience: string
): BusinessPlanOutput {
  return {
    executiveSummary: `${title} is a disruptive platform in the ${industry} space. Our core mission is: "${oneLiner}". We address critical friction points for ${targetAudience} by providing a state-of-the-art, fully automated workflow engine.`,
    problemSolution: `The market currently lacks efficient, unified solutions for ${targetAudience}. Existing alternatives are fragmented, complex, or prohibitively expensive. ${title} solves this by delivering an integrated, premium dashboard experience that automates complex processes with zero setup overhead.`,
    monetizationModel: "We utilize a clear, predictable SaaS model: a Free tier for basic onboarding, a Pro tier at $19/month for advanced features and API access, and an Enterprise custom tier with dedicated support and data privacy guarantees.",
    marketingStrategy: "Our go-to-market strategy revolves around vertical content marketing, organic search engine optimization, developer community engagement, and targeted performance marketing on channels frequented by our target persona.",
    financialPlan: {
      pricingStructure: "$19/month Pro subscription, $99/month Team tier.",
      startupCosts: [
        { item: "Hosting & Server Infrastructure", cost: 1500 },
        { item: "Auth & Payments Integration API costs", cost: 500 },
        { item: "Initial Marketing & CAC Budget", cost: 3000 }
      ],
      projectedRevenuesY1: 120000,
      projectedExpensesY1: 45000
    },
    milestones: [
      {
        phase: "Phase 1: Core API & Auth",
        tasks: [
          "Deploy Next.js server configuration on Vercel.",
          "Integrate Clerk authentication middleware and database syncing.",
          "Establish Prisma schema tables and run initial migrations."
        ],
        timeline: "Weeks 1-4"
      },
      {
        phase: "Phase 2: Premium Features & Payments",
        tasks: [
          "Build AI service layers for OpenAI and Gemini.",
          "Implement Stripe checkout webhook logic to process subscription updates.",
          "Finalize main dashboard viewports and responsive layouts."
        ],
        timeline: "Weeks 5-8"
      }
    ]
  };
}

export function getMockStartupNames(description: string, industry: string): StartupNamesOutput {
  return {
    suggestions: [
      {
        name: "LaunchFlow",
        tagline: "Accelerate your development pipeline.",
        rationale: "Aligns with speed, efficiency, and developer workflows."
      },
      {
        name: "Stratify",
        tagline: "Smart startup strategy, automated.",
        rationale: "Conveys high-end analytical planning and intelligence."
      },
      {
        name: "VenturePulse",
        tagline: "Keep your finger on the market pulse.",
        rationale: "Reflects active monitoring of industry trends and metrics."
      },
      {
        name: "CoFounderX",
        tagline: "Your digital startup companion.",
        rationale: "Directly relates to co-founder support and interactive guidance."
      },
      {
        name: "ApexSaaS",
        tagline: "Build premium software products quickly.",
        rationale: "Conveys excellence, performance, and scaling."
      }
    ]
  };
}

export function getMockBusinessSuggestions(title: string, description: string, industry: string): BusinessSuggestionsOutput {
  return {
    suggestions: [
      {
        title: "Focus on Niche Vertical Launch",
        description: "Instead of marketing universally, target a highly specific subset of users in the industry to build a loyal core fanbase.",
        impact: "HIGH",
        difficulty: "EASY"
      },
      {
        title: "Leverage Product-Led Growth (PLG) Loops",
        description: "Integrate shareable report assets (e.g. public view links for charts) to encourage organic viral referral signups.",
        impact: "HIGH",
        difficulty: "MEDIUM"
      },
      {
        title: "Offer Custom Enterprise Security Add-ons",
        description: "Charge premium rates for advanced audit logging, dedicated proxy endpoints, and private database encryptions.",
        impact: "MEDIUM",
        difficulty: "HARD"
      }
    ]
  };
}

export function getMockCompetitorReport(title: string, description: string, industry: string): CompetitorReportOutput {
  return {
    competitors: [
      {
        name: `${title} Direct Competitor A`,
        website: "https://competitor-a.example.com",
        pricing: "$15/month starter tier, subscription model",
        strengths: ["Highly recognizable brand", "Rich documentation libraries", "Extensive list of integrations"],
        weaknesses: ["Outdated user interface design", "Prohibitively expensive pricing for solo users", "Slow customer support responses"],
        marketPosition: "Established market leader facing disruption",
        differentiation: `Offer a modern, highly fluid glassmorphic UI, lightning-fast setup pipelines, and direct customer communication channels.`
      },
      {
        name: `${title} Challenger B`,
        website: "https://challenger-b.example.com",
        pricing: "Freemium, $29/month Pro tier",
        strengths: ["Strong community engagement", "Highly focused feature list", "Clean design language"],
        weaknesses: ["Limited advanced configurations", "Performance bottlenecks under heavy query loads", "Lack of enterprise compliance features"],
        marketPosition: "Niche challenger gaining organic traction",
        differentiation: "Incorporate robust multi-agent orchestration, collaborative session views, and native PDF exports."
      },
      {
        name: `${title} Legacy Player C`,
        website: "https://legacy-c.example.com",
        pricing: "Enterprise quote only, one-time setup fee",
        strengths: ["Very high data security standards", "Decades of historical industry datasets", "Dedicated account managers"],
        weaknesses: ["Extremely long onboarding cycles (weeks)", "No self-serve signup options", "Rigid visual themes"],
        marketPosition: "Legacy incumbent serving traditional corporations",
        differentiation: "Enable instant self-serve onboarding, developer-friendly APIs, and modular billing schemes."
      }
    ]
  };
}

export function getMockBusinessModelCanvas(title: string, description: string, industry: string): BusinessModelCanvasOutput {
  return {
    keyPartners: [
      "Infrastructure & Cloud hosting services (Vercel, AWS)",
      "Authentication providers (Clerk)",
      "Payment processing network (Stripe)",
      "AI/LLM foundation API providers"
    ],
    keyActivities: [
      "Continuous feature updates and optimization of dashboard layouts",
      "AI model engineering, system instruction tuning, and prompt refinement",
      "Customer acquisition, brand marketing, and community management",
      "Securing data pipeline reliability and performance scaling"
    ],
    keyResources: [
      "Proprietary visual templates and dashboard design code",
      "Customer usage logs and analytical trends database",
      "Core developer and engineering team",
      "Brand equity and organic community traffic channels"
    ],
    valuePropositions: [
      "Unified, instant setup workspace for early-stage software founders",
      "Advanced AI co-pilot capabilities with search-grounded market intelligence",
      "Interactive 16:9 PDF pitch deck compiler and customizable verbal scripts",
      "Highly responsive, premium visual aesthetics that maximize ease of use"
    ],
    customerRelationships: [
      "Self-serve, automated onboarding flows with integrated sandbox guides",
      "Responsive customer support via dedicated community channels",
      "Direct email newsletters featuring product updates and founder interviews"
    ],
    channels: [
      "Direct SaaS website and SEO search landing pages",
      "Organic viral loops (sharing generated reports and public canvases)",
      "Developer forum discussions, startup directories, and newsletters"
    ],
    customerSegments: [
      "Early-stage tech startup founders and indie hackers",
      "Product managers and venture researchers scanning market sectors",
      "Accelerators, incubators, and university entrepreneurship programs"
    ],
    costStructure: [
      "Cloud hosting, database persistence, and CDN subscription costs",
      "LLM API usage fees and search grounding network overhead",
      "Customer acquisition costs (CAC) and advertising channel spend",
      "Development resources, licensing software, and operational costs"
    ],
    revenueStreams: [
      "Recurring monthly SaaS subscription fee (Pro tier at $19/month)",
      "Recurring annual discounted license tier ($149/year)",
      "Add-on credits for high-frequency automated competitor scans",
      "Custom white-label team dashboard configurations for accelerators"
    ]
  };
}

export function getMockMvpRoadmap(title: string, description: string, industry: string): MvpRoadmapOutput {
  return {
    phases: [
      {
        name: "Phase 1: Core System & Auth Setup",
        tasks: [
          "Configure Clerk authentication and Prisma model sync.",
          "Build PostgreSQL schema tables and run initial prisma migrations.",
          "Design responsive overview layouts and custom form triggers."
        ]
      },
      {
        name: "Phase 2: AI Pipeline & Integrations",
        tasks: [
          "Integrate OpenAI and Gemini provider factory layers.",
          "Implement Stripe checkout session webhook processing.",
          "Develop interactive canvas editor and speaker notes manager."
        ]
      },
      {
        name: "Phase 3: Export Engines & Public Release",
        tasks: [
          "Polish CSS @media print styling for native 16:9 PDF print output.",
          "Enable interactive chat streams and history caching.",
          "Deploy live beta staging server and test transaction logic."
        ]
      }
    ],
    techStack: [
      {
        category: "Framework Core",
        tech: "Next.js 16 (App Router)",
        why: "Provides server-side rendering, API route nesting, and fast page loading out of the box."
      },
      {
        category: "Database & ORM",
        tech: "Prisma ORM with PostgreSQL",
        why: "Ensures type-safe SQL query generation, simple schema updates, and robust connection pooling."
      },
      {
        category: "User Authentication",
        tech: "Clerk Middleware",
        why: "Handles secure user sessions, social signups, and route protections with minimal backend footprint."
      },
      {
        category: "Payments processing",
        tech: "Stripe SDK",
        why: "The industry standard for secure subscription handling, webhook synchronization, and portal management."
      }
    ],
    timeline: "6-8 Weeks to complete MVP",
    cost: "Estimated build cost: $5,000 - $10,000 using modular cloud services"
  };
}

export function getMockPitchDeck(title: string, description: string, industry: string): PitchDeckOutput {
  return {
    slides: [
      {
        title: `${title} - Startup Companion`,
        subtitle: `Disrupting the ${industry} market.`,
        bullets: [
          "An integrated digital workspace for software entrepreneurs.",
          "Auto-generated business model canvases, MVP roadmaps, and pitch outlines.",
          "AI-driven search engine grounding for real-time market updates."
        ],
        script: `Hello everyone, and welcome. Today I'm thrilled to present ${title}, an AI-powered co-founder designed to help early-stage entrepreneurs validate assumptions, map competitors, and launch products in record time. We are transforming startup planning from static spreadsheets to interactive, dynamic execution.`
      },
      {
        title: "The Problem",
        subtitle: "Startup building is fragmented and slow.",
        bullets: [
          "Founders spend weeks drafting legacy plans that go out of date instantly.",
          "Competitor tracking is manually intensive and ignores real-time web changes.",
          "Lack of cohesive tools leads to misaligned tech stacks and cost overruns."
        ],
        script: "The main challenge for startup builders isn't having ideas—it's validating them fast enough. Founders lose precious months manually scanning competitors, guessing market sizes, and creating slide decks. In today's fast-moving software economy, that latency kills startups."
      },
      {
        title: "The Solution",
        subtitle: "Automated, search-grounded workspace.",
        bullets: [
          "Instant structured validation reports with customized SWOT grids.",
          "Automated competitor gap scans leveraging live search queries.",
          "CTO-aligned MVP technology roadmaps and 16:9 slide presentation visualizers."
        ],
        script: `${title} solves this by acting as your digital co-founder. With our unified dashboard, you input your concept parameters once, and the AI agent automatically scans the web, estimates your TAM, designs your BMC, and builds an investor-ready pitch deck script.`
      },
      {
        title: "Market Opportunity",
        subtitle: "$5.2B Global Startup Tool Market.",
        bullets: [
          "Millions of new startup LLCs registered worldwide each year.",
          "Increasing adoption of low-code and digital software workspaces.",
          "Growing segment of freelance builders and developer indie hackers."
        ],
        script: "The market for digital startup planning tools is massive. We are targeting a $5.2 billion addressable space. By focusing on indie hackers and early stage software builders, we can capture a significant serviceable market within our first few years of operations."
      },
      {
        title: "The Product",
        subtitle: "State-of-the-art interactive workspace.",
        bullets: [
          "Responsive, glassmorphic dark-mode dashboards.",
          "Editable slide outlines with native landscape PDF export rules.",
          "Collaborative startup-specific founder co-pilot chat streams."
        ],
        script: "Our product is built on premium design guidelines. We offer responsive visual cards, interactive canvas grids, and editable speaker scripts. Everything is persistently stored, allowing teams to edit, optimize, and present their slides directly to stakeholders."
      },
      {
        title: "Business Model",
        subtitle: "Predictable, value-driven SaaS tiers.",
        bullets: [
          "Free tier for basic concept drafting.",
          "Pro subscription ($19/month) for AI engines, scans, and PDF downloads.",
          "Enterprise licenses for incubators and university entrepreneur cohorts."
        ],
        script: "We operate a simple SaaS business model. Our Pro tier at $19/month unlocks full AI-assisted report generation, live search queries, and unlimited slide PDF downloads. This ensures a recurring and scalable revenue loop from day one."
      },
      {
        title: "Competitors",
        subtitle: "Our differentiation opportunity.",
        bullets: [
          "Legacy planning tools take weeks and lack real-time web scans.",
          "Traditional VC databases are rigid and prohibitively expensive.",
          "We differentiate on design fluidness, cost-efficiency, and search grounding."
        ],
        script: "While there are legacy business planners and VC research databases, they are either extremely expensive or slow. We differentiate by integrating live search grounding and offering a premium, self-serve developer-aligned workspace at a fraction of the cost."
      },
      {
        title: "Go-To-Market",
        subtitle: "Product-led organic customer acquisition.",
        bullets: [
          "Viral PLG loops via sharing public canvas viewports.",
          "Organic SEO targeting startup validation queries and developer tools.",
          "Strategic partnerships with early-stage business incubators."
        ],
        script: "Our customer acquisition strategy relies on product-led growth loops. When users share their public business model canvases or pitch slides, it drives organic traffic back to our dashboard. This is complemented by organic SEO and direct community partnerships."
      },
      {
        title: "The Team",
        subtitle: "CTO, CEO, and Strategic Advisors.",
        bullets: [
          "Core founders with software engineering and venture build experience.",
          "Advisory board of venture capitalists and startup coaches.",
          "Lean operational structure focusing resources on product velocity."
        ],
        script: "Our team consists of experienced full-stack engineers and startup builders who have successfully scaled products before. We are backed by a network of venture advisors, ensuring our product roadmap matches what modern investors look for."
      },
      {
        title: "The Ask",
        subtitle: "$500k Pre-Seed round to accelerate velocity.",
        bullets: [
          "60% allocated to product engineering and custom model training.",
          "20% allocated to go-to-market channels and customer acquisition.",
          "20% allocated to operational scaling and database persistence."
        ],
        script: "We are raising a $500,000 pre-seed round to accelerate our development speed and scale our marketing outreach. We invite you to join us on this journey to automate startup planning and empower the next generation of builders."
      }
    ]
  };
}
