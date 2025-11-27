import { GoogleGenAI } from "@google/genai";

// NOTE: In a real app, this key would come from a secure backend or proxy to prevent exposure.
// The prompt instructions say to use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'mock_key' });

export const generateMarketingMessage = async (customerName: string, segment: string, lastPurchase: string): Promise<string> => {
  // In a real implementation we would make the API call.
  // Since we are mocking the frontend mostly, we simulate the network delay.
  
  /* 
  const model = "gemini-2.5-flash";
  const prompt = `Write a short, friendly 140 char SMS marketing message for a customer named ${customerName}. 
  They are in the '${segment}' segment. Their last purchase was ${lastPurchase}. 
  Offer them a discount relevant to their segment.`;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  return response.text;
  */

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
};
