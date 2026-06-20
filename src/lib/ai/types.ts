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

export interface AIProvider {
  generateStructuredReport(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<AnalysisReportOutput>;

  generateBusinessPlan(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<BusinessPlanOutput>;

  generateStartupNames(
    description: string,
    industry: string
  ): Promise<StartupNamesOutput>;

  generateBusinessSuggestions(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessSuggestionsOutput>;

  generateCompetitorReport(
    title: string,
    description: string,
    industry: string
  ): Promise<CompetitorReportOutput>;

  generateBusinessModelCanvas(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessModelCanvasOutput>;

  generateMvpRoadmap(
    title: string,
    description: string,
    industry: string
  ): Promise<MvpRoadmapOutput>;

  generatePitchDeck(
    title: string,
    description: string,
    industry: string
  ): Promise<PitchDeckOutput>;
}




