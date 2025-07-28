import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Apni API Key ko .env file se access karein
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Generative AI model ko API key ke saath initialize karein
const genAI = new GoogleGenerativeAI(API_KEY);

// 3. Model configuration - Yahan hum specify kar rahe hain ki humein response JSON format mein chahiye
const generationConfig = {
  responseMimeType: "application/json",
};

// 4. 'gemini-1.5-flash' model select karein aur upar di gayi configuration apply karein
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: generationConfig,
});

// 5. Ek chat session start karein jise hum apne doosre components mein use karenge
export const chatSession = model.startChat();