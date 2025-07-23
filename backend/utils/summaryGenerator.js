import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  GEMINI_API_KEY;
const MAX_PROMPT_LENGTH = 8000; // Adjust as needed for Gemini's limits

/**
 * Generate an AI summary for a file's extracted text using Google Gemini.
 * @param {string} text - The extracted text from the file.
 * @returns {Promise<string>} - The AI-generated summary.
 */
export async function generateSummary(text) {
  if (!text || typeof text !== "string") return "No content to summarize.";
  let promptText =
    text.length > MAX_PROMPT_LENGTH ? text.slice(0, MAX_PROMPT_LENGTH) : text;
  const prompt = `Summarize the following document in 5-7 sentences, focusing on the main ideas and key points.\n\n${promptText}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return summary || "No summary generated.";
  } catch (err) {
    console.error("Gemini summary error:", err);
    return "Failed to generate summary.";
  }
}
