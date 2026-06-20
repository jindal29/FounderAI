import { AIProvider } from "./types";
import { 
  generateStructuredReport, 
  generateBusinessPlan, 
  generateStartupNames, 
  generateBusinessSuggestions,
  generateCompetitorReport,
  generateBusinessModelCanvas,
  generateMvpRoadmap,
  generatePitchDeck,
  AnalysisReportOutput,
  BusinessPlanOutput,
  StartupNamesOutput,
  BusinessSuggestionsOutput,
  CompetitorReportOutput,
  BusinessModelCanvasOutput,
  MvpRoadmapOutput,
  PitchDeckOutput
} from "../openai";

export class OpenAIProvider implements AIProvider {
  async generateStructuredReport(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<AnalysisReportOutput> {
    return generateStructuredReport(title, oneLiner, description, industry, targetAudience);
  }

  async generateBusinessPlan(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<BusinessPlanOutput> {
    return generateBusinessPlan(title, oneLiner, description, industry, targetAudience);
  }

  async generateStartupNames(
    description: string,
    industry: string
  ): Promise<StartupNamesOutput> {
    return generateStartupNames(description, industry);
  }

  async generateBusinessSuggestions(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessSuggestionsOutput> {
    return generateBusinessSuggestions(title, description, industry);
  }

  async generateCompetitorReport(
    title: string,
    description: string,
    industry: string
  ): Promise<CompetitorReportOutput> {
    return generateCompetitorReport(title, description, industry);
  }

  async generateBusinessModelCanvas(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessModelCanvasOutput> {
    return generateBusinessModelCanvas(title, description, industry);
  }

  async generateMvpRoadmap(
    title: string,
    description: string,
    industry: string
  ): Promise<MvpRoadmapOutput> {
    return generateMvpRoadmap(title, description, industry);
  }

  async generatePitchDeck(
    title: string,
    description: string,
    industry: string
  ): Promise<PitchDeckOutput> {
    return generatePitchDeck(title, description, industry);
  }
}




