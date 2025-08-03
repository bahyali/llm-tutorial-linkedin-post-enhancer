// src/lib/ai.ts

import { PostGenerationRequest } from "./types";

// Ensure the Google Generative AI SDK is installed: npm install @google/generative-ai
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-pro";

// A more robust prompt engineering function
function buildPrompt(request: PostGenerationRequest): string {
    const { context, idea, audience, tone } = request;

    // The new prompt is much more direct and includes strict negative constraints.
    return `
You are an expert LinkedIn post generator. Your SOLE task is to generate the text for a single LinkedIn post based on the provided details.

---
CRITICAL RULES:
1.  **NO PREAMBLE:** Do NOT include any introductory text, conversational phrases, or explanations like "Here is your post." Your response MUST start directly with the first word of the LinkedIn post itself.
2.  **NO MARKDOWN:** Do NOT use any Markdown formatting. This includes asterisks for bolding (**text**), underscores for italics (_text_), horizontal rules (--- or ***), or hashtags for headers (# Header). The post must be plain text.
3.  **ALLOWED FORMATTING:** You MAY use standard Unicode emojis (like 📈, ✅, 👉) and line breaks to structure the post for maximum readability on LinkedIn.
---

**CORE INFORMATION:**
- **Company/Project Context:** "${context}"
- **Specific Idea to Convey:** "${idea}"

**POST REQUIREMENTS:**
- **Target Audience:** ${audience}. Tailor the language and value propositions to this group.
- **Tone of Voice:** ${tone}.
- **Structure:** Use short paragraphs (2-3 sentences max). Use lists where appropriate for clarity.
- **Call to Action (CTA):** End the post with a clear, engaging question to encourage comments.
- **Hashtags:** Include 3-5 relevant and specific hashtags at the end.
---

Generate the LinkedIn post now.
`;
}



export async function generatePostWithAI(request: PostGenerationRequest): Promise<string> {
    const apiKey = process.env.AI_PROVIDER_API_KEY;

    if (!apiKey) {
        throw new Error("AI_PROVIDER_API_KEY is not set in environment variables.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Configuration for content safety
        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        // Stricter safety settings can be configured if needed
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const prompt = buildPrompt(request);

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        });

        if (result.response.promptFeedback?.blockReason) {
            throw new Error(`Request was blocked for safety reasons: ${result.response.promptFeedback.blockReason}`);
        }

        const postText = result.response.text();
        if (!postText) {
            throw new Error("The AI returned an empty response.");
        }

        return postText;

    } catch (error: any) {
        console.error("Error calling AI service:", error);
        // Re-throw a more user-friendly error message
        throw new Error(`Failed to generate post. Reason: ${error.message}`);
    }
}