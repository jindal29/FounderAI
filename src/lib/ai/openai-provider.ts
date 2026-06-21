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
import {
  getMockStructuredReport,
  getMockBusinessPlan,
  getMockStartupNames,
  getMockBusinessSuggestions,
  getMockCompetitorReport,
  getMockBusinessModelCanvas,
  getMockMvpRoadmap,
  getMockPitchDeck
} from "./mock-data";

export class OpenAIProvider implements AIProvider {
  private isDummy(): boolean {
    const key = process.env.OPENAI_API_KEY;
    return !key || key.includes("dummy") || key.includes("sk-proj-...") || key === "";
  }

  async generateStructuredReport(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<AnalysisReportOutput> {
    if (this.isDummy()) {
      return getMockStructuredReport(title, oneLiner, description, industry, targetAudience);
    }
    return generateStructuredReport(title, oneLiner, description, industry, targetAudience);
  }

  async generateBusinessPlan(
    title: string,
    oneLiner: string,
    description: string,
    industry: string,
    targetAudience: string
  ): Promise<BusinessPlanOutput> {
    if (this.isDummy()) {
      return getMockBusinessPlan(title, oneLiner, description, industry, targetAudience);
    }
    return generateBusinessPlan(title, oneLiner, description, industry, targetAudience);
  }

  async generateStartupNames(
    description: string,
    industry: string
  ): Promise<StartupNamesOutput> {
    if (this.isDummy()) {
      return getMockStartupNames(description, industry);
    }
    return generateStartupNames(description, industry);
  }

  async generateBusinessSuggestions(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessSuggestionsOutput> {
    if (this.isDummy()) {
      return getMockBusinessSuggestions(title, description, industry);
    }
    return generateBusinessSuggestions(title, description, industry);
  }

  async generateCompetitorReport(
    title: string,
    description: string,
    industry: string
  ): Promise<CompetitorReportOutput> {
    if (this.isDummy()) {
      return getMockCompetitorReport(title, description, industry);
    }
    return generateCompetitorReport(title, description, industry);
  }

  async generateBusinessModelCanvas(
    title: string,
    description: string,
    industry: string
  ): Promise<BusinessModelCanvasOutput> {
    if (this.isDummy()) {
      return getMockBusinessModelCanvas(title, description, industry);
    }
    return generateBusinessModelCanvas(title, description, industry);
  }

  async generateMvpRoadmap(
    title: string,
    description: string,
    industry: string
  ): Promise<MvpRoadmapOutput> {
    if (this.isDummy()) {
      return getMockMvpRoadmap(title, description, industry);
    }
    return generateMvpRoadmap(title, description, industry);
  }

  async generatePitchDeck(
    title: string,
    description: string,
    industry: string
  ): Promise<PitchDeckOutput> {
    if (this.isDummy()) {
      return getMockPitchDeck(title, description, industry);
    }
    return generatePitchDeck(title, description, industry);
  }
}
