import Anthropic from "@anthropic-ai/sdk";
import { getApiKey } from "./storage";

export const generateSpecification = async (appDescription: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not found");
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Add this option to allow browser usage
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

    // Check if response has content
    if (!response.content || response.content.length === 0) {
      console.error("Empty response from Claude API:", response);
      throw new Error("Empty response from Claude API");
    }

    // Get the first content block
    const firstContent = response.content[0];

    // Type guard to check if the content has text property
    if ('text' in firstContent) {
      return firstContent.text;
    }
    
    console.error("Unexpected response format:", firstContent);
    throw new Error("Unexpected response format from Claude API");
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};