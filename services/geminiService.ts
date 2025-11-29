import { GoogleGenAI } from "@google/genai";

// Use environment variable for API key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateMarketingMessage = async (customerName: string, segment: string, lastPurchase: string): Promise<string> => {
  if (!apiKey) {
    console.warn("VITE_GOOGLE_API_KEY is missing. Using mock response.");
    return new Promise((resolve) => {
      setTimeout(() => {
        if (segment === 'Champion') {
          resolve(`Hi ${customerName}! Thanks for being our VIP. Enjoy 20% off your next visit to Siam Coffee as a token of our appreciation! ☕`);
        } else if (segment === 'At Risk') {
          resolve(`Miss you ${customerName}! It's been a while since your visit on ${lastPurchase}. Come back this week for a free pastry with any drink! 🥐`);
        } else {
          resolve(`Hello ${customerName}, check out our new arrivals at Siam Coffee! We hope to see you soon.`);
        }
      }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.0-flash-exp"; // Or gemini-1.5-flash
    const prompt = `Write a short, friendly, and engaging SMS marketing message (max 160 chars) in Thai for a customer named ${customerName}. 
    They are in the '${segment}' segment. Their last purchase was ${lastPurchase}. 
    Offer them a discount or promotion relevant to their segment. Use emojis.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Failed to generate message.";
  } catch (error) {
    console.error("Error generating AI message:", error);
    return "Sorry, I couldn't generate a message right now.";
  }
};
