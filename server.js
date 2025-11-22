import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { temperature: 0.1 }
});

// Helpers
const normalize = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

const fuzzyIncludes = (text, brand) =>
  normalize(text).includes(normalize(brand));

app.post("/check", async (req, res) => {
  const { prompt, brand } = req.body;

  const structuredPrompt = `You are an assistant that returns a clean, numbered list of tools, platforms, or products 
        mentioned in your answer based on the user's query below.

        User query:
        "${prompt}"

        Your job:
        1. Understand the user's query
        2. Produce ONLY a numbered list (1, 2, 3...)
        3. Each item must be one product/tool/platform name only
        4. Do NOT add explanations
        5. Do NOT add extra text before or after the list
        6. Always return at least 5 items if possible

        Example output:
        1. Salesforce
        2. HubSpot
        3. Zoho CRM
        4. Microsoft Dynamics
        5. Pipedrive

        Now produce the list.`;

  if (!prompt || !brand) {
    return res.status(400).json({
      error: "Prompt and Brand are required"
    });
  }

  try {
    const result = await model.generateContent(structuredPrompt);
    const text = result.response.text();

    const mentioned = fuzzyIncludes(text, brand);
    let position = null;

    if (mentioned) {
      const normText = normalize(text);
      const normBrand = normalize(brand);
      const index = normText.indexOf(normBrand);
      position = index !== -1 ? 1 : null;
    }

    return res.json({
      prompt,
      mentioned: mentioned ? "Yes" : "No",
      position: position,
      answer: text
    });

  } catch (err) {
    console.log(err);

    // CANNED ERROR ANSWER
    return res.json({
      prompt,
      mentioned: "No",
      position: null,
      error: "Gemini unavailable — fallback used."
    });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));