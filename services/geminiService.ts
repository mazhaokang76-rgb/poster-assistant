import { GoogleGenAI, Type } from "@google/genai";
import { PosterTextData } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates structured text content for the poster.
 */
export const generatePosterText = async (topic: string, grade: string): Promise<PosterTextData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `You are a helpful assistant for Chinese students making school posters (手抄报).
  Topic: ${topic}
  Target Audience: ${grade} students.
  
  Please generate content for the following sections in Simplified Chinese:
  1. Title (Short, catchy, artistic)
  2. Intro (Opening remarks, ~50 words)
  3. Facts (Interesting knowledge or tips, ~80 words)
  4. Relations (How this topic relates to the student's life, ~60 words)
  
  Ensure the tone is educational, encouraging, and age-appropriate.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Main headline for the poster" },
          intro: { type: Type.STRING, description: "Introduction paragraph" },
          facts: { type: Type.STRING, description: "Key facts or knowledge points" },
          relations: { type: Type.STRING, description: "Personal reflection or relation to student life" },
        },
        required: ["title", "intro", "facts", "relations"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No text returned from Gemini");
  }

  return JSON.parse(text) as PosterTextData;
};

/**
 * Generates a reference image layout for the poster.
 */
export const generatePosterImage = async (topic: string, grade: string): Promise<string> => {
  // Using gemini-2.5-flash-image as standard, or pro if available/needed. 
  // For layout reference, standard flash-image is usually sufficient and faster.
  const model = "gemini-2.5-flash-image";

  const prompt = `A hand-drawn educational poster (手抄报) design layout on A4 paper landscape mode. 
  Topic: ${topic}. 
  Style: Marker pen drawing, bright colors, cute illustrations suitable for ${grade} students.
  Layout: Clear borders, empty bubbles for text, a large central illustration related to ${topic}. 
  White background, high quality, flat lay photography style.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      // No specific responseMimeType needed for image generation via generateContent (returns base64 in parts usually, but here we expect a link or data?)
      // Wait, standard Gemini API returns base64 inline data for images if requested properly via specific endpoint or returns text.
      // However, for Text-to-Image in Gemini, we strictly check the parts.
      // NOTE: The instructions say "Call generateContent to generate images with nano banana series models".
    },
  });

  // Parse response for image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64String = part.inlineData.data;
      return `data:image/png;base64,${base64String}`;
    }
  }
  
  // Fallback if no image found (though strictly it should work)
  throw new Error("Failed to generate image.");
};