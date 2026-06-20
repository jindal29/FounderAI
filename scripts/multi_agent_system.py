import asyncio
import json
import os
import pydantic
from google.antigravity import Agent, LocalAgentConfig

# =====================================================================
# 1. Pydantic Structured Output Schemas (Aligns with Postgres Prisma models)
# =====================================================================

class MarketResearchOutput(pydantic.BaseModel):
    marketScore: int
    tam: str
    sam: str
    som: str
    sizingAssumptions: str
    industryTrends: list[dict[str, str]]  # list of {"trend": "...", "impact": "..."}
    barriersToEntry: list[str]
    regulations: list[str]
    swotAnalysis: dict[str, list[str]]    # {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []}

class CompetitorItem(pydantic.BaseModel):
    name: str
    websiteUrl: str
    strengths: list[str]
    weaknesses: list[str]
    features: list[str]
    pricingModel: str
    gapAnalysis: str
    marketShare: str

class CompetitorAnalysisOutput(pydantic.BaseModel):
    competitors: list[CompetitorItem]

class BusinessStrategyOutput(pydantic.BaseModel):
    keyPartners: list[str]
    keyActivities: list[str]
    keyResources: list[str]
    valuePropositions: list[str]
    customerRelationships: list[str]
    channels: list[str]
    customerSegments: list[str]
    costStructure: list[str]
    revenueStreams: list[str]

class CostChecklist(pydantic.BaseModel):
    item: str
    cost: float

class FinancialPlanningOutput(pydantic.BaseModel):
    pricingStructure: str
    startupCosts: list[CostChecklist]
    projectedRevenuesY1: float
    projectedExpensesY1: float

class MilestoneItem(pydantic.BaseModel):
    phase: str
    timeline: str
    tasks: list[str]
    deliverables: list[str]

class MvpPlanningOutput(pydantic.BaseModel):
    techStack: list[str]
    architecture: str
    milestones: list[MilestoneItem]

class SlideItem(pydantic.BaseModel):
    title: str
    subtitle: str
    bullets: list[str]
    visualTip: str

class InvestorPitchOutput(pydantic.BaseModel):
    theme: str
    script: str
    slides: list[SlideItem]

# Unified output wrapper representing the combined final validation report
class FinalStartupValidationReport(pydantic.BaseModel):
    marketResearch: MarketResearchOutput
    competitors: CompetitorAnalysisOutput
    businessStrategy: BusinessStrategyOutput
    financialPlan: FinancialPlanningOutput
    mvpPlan: MvpPlanningOutput
    investorPitch: InvestorPitchOutput

# =====================================================================
# 2. Agent Orchestration Core
# =====================================================================

async def run_market_research_agent(idea_context: str) -> MarketResearchOutput:
    prompt = f"Analyze the market landscape for this startup concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are a Senior Market Research Analyst. Analyze target market sizing (TAM/SAM/SOM), "
            "determine macro industry trends, outline regulatory roadblocks, and compile SWOT matrices."
        ),
        response_schema=MarketResearchOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

async def run_competitor_analysis_agent(idea_context: str) -> CompetitorAnalysisOutput:
    prompt = f"Scan direct and indirect competitors for this startup concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are an expert Competitive Intelligence Analyst. Research the top 3 direct or "
            "indirect competitors. Outline their pricing, core features, strengths/weaknesses, "
            "and identify feature gaps where our user can differentiate."
        ),
        response_schema=CompetitorAnalysisOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

async def run_business_strategy_agent(idea_context: str) -> BusinessStrategyOutput:
    prompt = f"Develop a Business Model Canvas strategy for this concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are a Venture Partner and Business Strategist. Generate a structured "
            "Business Model Canvas covering Partners, Activities, Resources, Propositions, "
            "Relationships, Channels, Segments, Costs, and Revenues."
        ),
        response_schema=BusinessStrategyOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

async def run_financial_planning_agent(idea_context: str) -> FinancialPlanningOutput:
    prompt = f"Model the financial forecasts for this concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are a Startup Chief Financial Officer (CFO). Design pricing structures, "
            "calculate MVP initial setup costs, and forecast Year 1 projected revenue and operational expenses."
        ),
        response_schema=FinancialPlanningOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

async def run_mvp_planning_agent(idea_context: str) -> MvpPlanningOutput:
    prompt = f"Design an MVP development roadmap for this concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are a CTO and Software Architect. Determine the optimal modern stack, "
            "draft baseline modular architecture schemas, and detail a 4-week task milestone roadmap."
        ),
        response_schema=MvpPlanningOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

async def run_investor_pitch_agent(idea_context: str) -> InvestorPitchOutput:
    prompt = f"Generate an investor pitch deck structure for this concept: {idea_context}"
    config = LocalAgentConfig(
        system_instruction=(
            "You are an experienced Presentation Coach and Pitch Consultant. Create a structured "
            "10-slide deck outline. Provide presentation scripts and visual illustration guidelines for each slide."
        ),
        response_schema=InvestorPitchOutput
    )
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.structured_output()

# =====================================================================
# 3. Main Multi-Agent Workflow Coordinator
# =====================================================================

async def compile_startup_validation_report(title: str, one_liner: str, description: str) -> FinalStartupValidationReport:
    context = f"Title: {title}\nOne-Liner: {one_liner}\nDescription: {description}"
    
    print(f"[*] Initializing validation pipeline for concept: {title}...")
    
    # Run all 6 specialized agents concurrently
    market_task = run_market_research_agent(context)
    competitor_task = run_competitor_analysis_agent(context)
    strategy_task = run_business_strategy_agent(context)
    financial_task = run_financial_planning_agent(context)
    mvp_task = run_mvp_planning_agent(context)
    pitch_task = run_investor_pitch_agent(context)
    
    results = await asyncio.gather(
        market_task,
        competitor_task,
        strategy_task,
        financial_task,
        mvp_task,
        pitch_task,
        return_exceptions=True
    )
    
    # Check for execution exceptions
    for i, res in enumerate(results):
        if isinstance(res, Exception):
            print(f"[!] Error executing agent task index {i}: {res}")
            raise res
            
    print("[*] All agents finished. Compiling final combined validation report...")
    
    final_report = FinalStartupValidationReport(
        marketResearch=results[0],
        competitors=results[1],
        businessStrategy=results[2],
        financialPlan=results[3],
        mvpPlan=results[4],
        investorPitch=results[5]
    )
    
    return final_report

# CLI Testing interface
if __name__ == "__main__":
    import sys
    
    sample_title = "FounderAI"
    sample_pitch = "An AI startup co-founder validating concepts and plans"
    sample_desc = (
        "An AI platform that acts as a startup partner. It lets founders submit ideas, "
        "validates TAM/SAM/SOM sizing, charts competitors, compiles Business Model Canvas, "
        "designs MVP tech stacks, and formats pitch decks."
    )
    
    if "GEMINI_API_KEY" not in os.environ:
        print("[!] Warning: GEMINI_API_KEY not set. Using dummy mocks or execution may fail.")
        os.environ["GEMINI_API_KEY"] = "dummy_key_for_testing"
        
    loop = asyncio.get_event_loop()
    try:
        report = loop.run_until_complete(
            compile_startup_validation_report(sample_title, sample_pitch, sample_desc)
        )
        print("\n=== Pipeline Output Validated ===")
        print(json.dumps(report.model_dump(), indent=2))
    except Exception as e:
        print(f"[!] Execution failed: {e}")
