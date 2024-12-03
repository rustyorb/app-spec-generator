import Anthropic from "@anthropic-ai/sdk";
import { getApiKey } from "./storage";

export const generateSpecification = async (appDescription: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: `You are an expert software architect tasked with creating a comprehensive application specification for Lovable.dev. Transform this app description into a detailed specification:

        ${appDescription}

        Format your response as a structured specification covering:
        1. Application Overview
        2. Core Functionality
        3. UI/UX Specifications
        4. Technical Architecture
        5. Integration Points
        6. Data Models
        7. Security Requirements
        8. Development Guidelines

        For each section, provide detailed, practical implementation guidance that aligns with Lovable.dev's React + Vite + TypeScript + Tailwind CSS + shadcn/ui stack.`
      }
    ]
  });

  // Handle the response content safely
  if (response.content && response.content.length > 0) {
    const firstContent = response.content[0];
    if ('text' in firstContent) {
      return firstContent.text;
    }
  }
  
  // If we can't get the text content, return an error message
  return "Error: Unable to generate specification. Unexpected response format.";
};