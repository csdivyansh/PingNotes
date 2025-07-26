import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  GEMINI_API_KEY;
const MAX_PROMPT_LENGTH = 100000; // Safe for Gemini's limits

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

// Helper function to encode image to base64
function encodeImageToBase64(filePath) {
  try {
    console.log('[Gemini Summary] Reading image file:', filePath);
    const imageBuffer = fs.readFileSync(filePath);
    console.log('[Gemini Summary] Image buffer size:', imageBuffer.length, 'bytes');
    
    // Validate buffer is not empty
    if (imageBuffer.length === 0) {
      throw new Error('Image file is empty');
    }
    
    // Check if it looks like a valid image by checking first few bytes
    const header = imageBuffer.slice(0, 8);
    console.log('[Gemini Summary] Image header (hex):', header.toString('hex'));
    
    const base64String = imageBuffer.toString('base64');
    console.log('[Gemini Summary] Base64 string length:', base64String.length);
    
    // Validate base64 string is not empty
    if (!base64String || base64String.length === 0) {
      throw new Error('Failed to encode image to base64');
    }
    
    return base64String;
  } catch (error) {
    console.error('[Gemini Summary] Error encoding image to base64:', error);
    throw error;
  }
}

// Helper function to get MIME type from file extension
function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Generate an AI summary for any file (text, PDF, image, etc.) using Gemini.
 * @param {string} filePath - Path to the file.
 * @param {string} mimetype - File mimetype.
 * @returns {Promise<string>} - The AI-generated summary.
 */
export async function generateSummaryFromFile(filePath, mimetype) {
  // Add file validation and debugging
  console.log('[Gemini Summary] Starting summary generation for:', {
    filePath,
    mimetype,
    fileExists: fs.existsSync(filePath),
    fileSize: fs.existsSync(filePath) ? fs.statSync(filePath).size : 'N/A'
  });

  // Validate file exists and is readable
  if (!fs.existsSync(filePath)) {
    console.error('[Gemini Summary] File does not exist:', filePath);
    return "Failed to generate summary: File not found.";
  }

  try {
    // Test if file is readable
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch (err) {
    console.error('[Gemini Summary] File is not readable:', filePath, err);
    return "Failed to generate summary: File not readable.";
  }

  if (
    mimetype.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(
      path.extname(filePath).toLowerCase()
    )
  ) {
    // Summarize image content
    console.log('[Gemini Summary] Processing as image file');
    
    try {
      const base64Image = encodeImageToBase64(filePath);
      console.log('[Gemini Summary] Image encoded to base64, length:', base64Image.length);
      
      const mimeType = getMimeType(filePath);
      console.log('[Gemini Summary] Detected MIME type:', mimeType);
      
      const prompt = `Describe and summarize the main content, subject, and context of this image in 5-7 sentences. If the image contains people, objects, scenes, text, diagrams, or any notable features, include them in the summary. Be as descriptive and informative as possible, even if the image is abstract or artistic.`;
      const body = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }]
      };
      
      console.log('[Gemini Summary] Sending request to Gemini API...');
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      console.log('[Gemini Image Summary] HTTP Status:', response.status);
      console.log('[Gemini Image Summary] API result:', JSON.stringify(result, null, 2));
      
      if (!response.ok) {
        console.error('[Gemini Image Summary] HTTP Error:', response.status, response.statusText);
        return `Failed to generate summary (HTTP ${response.status}).`;
      }
      
      if (!result?.candidates || !result.candidates.length) {
        console.error('[Gemini Image Summary] No candidates returned:', result);
        if (result?.error) {
          console.error('[Gemini Image Summary] API Error:', result.error);
          return `Failed to generate summary: ${result.error.message || 'Unknown API error'}`;
        }
        return "No summary generated (no candidates).";
      }
      
      const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!summary) {
        console.error('[Gemini Image Summary] Empty summary text returned:', result);
        return "No summary generated (empty response).";
      }
      
      console.log('[Gemini Summary] Successfully generated image summary');
      return summary;
    } catch (err) {
      console.error("Gemini image summary error:", err);
      return "Failed to generate summary.";
    }
  } else {
    // For non-image files, extract text and summarize
    console.log('[Gemini Summary] Processing as text-based file');
    const { extractTextFromFile } = await import("./fileTextExtractor.js");
    const text = await extractTextFromFile(filePath, mimetype, true); // Use Gemini for images if needed
    return await generateSummary(text);
  }
}
