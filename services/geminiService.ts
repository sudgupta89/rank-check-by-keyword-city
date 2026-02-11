import { GoogleGenAI, Type } from "@google/genai";
import { SeoResult, GroundingChunk } from "../types";

const parseResult = (text: string): SeoResult => {
  try {
    // Attempt to extract JSON if it's wrapped in code blocks
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonStr = match ? match[1] : text;
    return JSON.parse(jsonStr) as SeoResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Invalid response format from AI engine.");
  }
};

export const analyzeRanking = async (
  keyword: string,
  city: string,
  targetUrl: string
): Promise<{ result: SeoResult; groundingChunks: GroundingChunk[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert SEO Ranking Analysis Engine.
    Your task is to simulate a Google search for a specific keyword in a specific location and determine if a target URL is ranking in the top results.
    
    1. Perform a Google search for the query provided.
    2. Analyze the search results found via the Google Search tool.
    3. Look for the 'Target URL' in the results. Match loosely on domain/subdomain if exact path isn't found, but prefer exact matches.
    4. If found, estimate the position based on the order of search results returned to you.
    5. Return the output strictly in the requested JSON format.
    6. Include a list of top 3-5 competitor domains found in the 'competitors' array in the JSON.
  `;

  const prompt = `
    Inputs:
    - Keyword: ${keyword}
    - City / Location: ${city}
    - Target URL: ${targetUrl}

    Perform the search simulation: "${keyword} in ${city}".
    
    Output Format (JSON ONLY):
    {
      "keyword": "${keyword}",
      "city": "${city}",
      "search_query": "${keyword} in ${city}",
      "target_url": "${targetUrl}",
      "ranking_status": "Found / Not Found",
      "position": "Numeric value (e.g. 1, 5) or null if not found",
      "serp_page": "Page number (assume 10 results per page) or null",
      "ranking_url": "The exact URL found in SERP or null",
      "seo_note": "A short, actionable SEO insight based on the competitors and the result.",
      "competitors": ["url1", "url2", "url3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Convert generic chunks to our typed chunks if compatible, or filter
    const safeGroundingChunks: GroundingChunk[] = groundingChunks.map(chunk => ({
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : undefined
    })).filter(c => c.web !== undefined);

    const parsedResult = parseResult(resultText);

    return {
      result: parsedResult,
      groundingChunks: safeGroundingChunks,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An error occurred during the SEO analysis.");
  }
};