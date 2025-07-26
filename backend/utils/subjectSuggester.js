import fetch from "node-fetch";
import fs from "fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  GEMINI_API_KEY;

const SUBJECT_CANDIDATES = [
  "Database Management Systems",
  "Mathematics",
  "Physics",
  "Programming",
  "History",
  "Biology",
  "Chemistry",
  "Economics",
  "English",
  "Computer Science",
  "Artificial Intelligence",
  "Data Structures",
  "Operating Systems",
  "Networks",
  "Web Development",
  "Machine Learning",
  "Software Engineering",
  "Nature",
  "Art",
  "Photography",
  "Architecture",
  "Food",
  "Travel",
  "Sports",
  "Technology",
  "Business",
  "Health",
  "Fashion",
  "Music",
  "Literature",
  // ...add more as needed
];

export async function normalizeSubjectWithGemini(subject) {
  if (!subject) return subject;
  const prompt = `Given the subject name "${subject}", map it to its full canonical academic subject name from this list: [${SUBJECT_CANDIDATES.join(
    ", "
  )}]. Respond with only the canonical name.`;
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
    console.log("Gemini normalization result:", result);
    const normalized =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return normalized || subject;
  } catch (err) {
    console.error("Gemini normalization error:", err);
    return subject;
  }
}

export async function suggestTopicFromText(text) {
  if (!text || !text.trim()) {
    console.log("No text extracted for topic suggestion.");
    return null;
  }
  
  // Check if the extracted text is meaningful for topic classification
  const meaningfulText = text.trim();
  if (meaningfulText.length < 10) {
    console.log("Extracted text too short for meaningful topic classification.");
    return null;
  }
  
  // Check if text contains mostly non-alphanumeric characters or is just noise
  const alphanumericRatio = (meaningfulText.match(/[a-zA-Z0-9]/g) || []).length / meaningfulText.length;
  if (alphanumericRatio < 0.3) {
    console.log("Extracted text contains mostly non-alphanumeric characters, likely not meaningful for topic classification.");
    return null;
  }
  
  const prompt = `Given the following text, suggest a specific topic or theme (2-4 words). Be descriptive but concise. For example:
    - Math content → "Algebra Equations", "Calculus Problems", "Statistics Analysis"
    - Programming content → "JavaScript Functions", "Python Algorithms", "Database Design"
    - Science content → "Chemical Reactions", "Physics Laws", "Biology Concepts"
    - Literature content → "Poetry Analysis", "Novel Themes", "Literary Devices"
    Respond with only the topic name.\nText: ${text}`;
  
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
    console.log("Gemini topic API result:", result);
    const topic = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return topic || null;
  } catch (err) {
    console.error("Gemini topic API error:", err);
    return null;
  }
}

export async function suggestSubjectFromText(text) {
  // Heuristic: if text contains dbms/database/sql, suggest DBMS
  if (text && /\b(dbms|database|sql)\b/i.test(text)) {
    console.log("Heuristic matched: DBMS");
    return "Database Management Systems";
  }
  if (!text || !text.trim()) {
    console.log("No text extracted for subject suggestion.");
    return null;
  }
  
  // Check if the extracted text is meaningful for subject classification
  const meaningfulText = text.trim();
  if (meaningfulText.length < 10) {
    console.log("Extracted text too short for meaningful subject classification.");
    return null;
  }
  
  // Check if text contains mostly non-alphanumeric characters or is just noise
  const alphanumericRatio = (meaningfulText.match(/[a-zA-Z0-9]/g) || []).length / meaningfulText.length;
  if (alphanumericRatio < 0.3) {
    console.log("Extracted text contains mostly non-alphanumeric characters, likely not meaningful for subject classification.");
    return null;
  }
  
  const prompt = `Given the following text, what is the most likely academic subject? Choose from: [${SUBJECT_CANDIDATES.join(
    ", "
  )}]. Respond with only the subject name.\nText: ${text}`;
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
    console.log("Gemini API result:", result);
    let subject = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (subject) {
      subject = await normalizeSubjectWithGemini(subject);
    }
    return subject || null;
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
}

// Helper function to encode image to base64
function encodeImageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
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

export async function suggestSubjectFromImage(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.log("Image file not found for subject suggestion.");
    return null;
  }

  console.log("🔍 Using GEMINI API for image subject analysis...");
  
  try {
    const base64Image = encodeImageToBase64(imagePath);
    const mimeType = getMimeType(imagePath);
    
    const prompt = `Analyze this image and determine the most appropriate category/subject. Choose from: [${SUBJECT_CANDIDATES.join(
      ", "
    )}]. Consider the visual content, objects, scenes, or any text present. For example:
    - Nature photos (flowers, landscapes, animals) → "Nature"
    - Art pieces, paintings, drawings → "Art"
    - Buildings, structures → "Architecture"
    - Food items → "Food"
    - Technology devices → "Technology"
    - Academic content (equations, diagrams, text) → appropriate academic subject
    Respond with only the subject name.`;
    
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

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    console.log("✅ Gemini image analysis completed successfully");
    
    let subject = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (subject) {
      subject = await normalizeSubjectWithGemini(subject);
    }
    return subject || null;
  } catch (err) {
    console.error("❌ Gemini image analysis error:", err);
    return null;
  }
}

export async function suggestTopicFromImage(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.log("Image file not found for topic suggestion.");
    return null;
  }

  console.log("🔍 Using GEMINI API for image topic analysis...");
  
  try {
    const base64Image = encodeImageToBase64(imagePath);
    const mimeType = getMimeType(imagePath);
    
    const prompt = `Analyze this image of equations or diagrams or any text. Suggest the most specific  topic or concept represented (e.g., "Wave Interference", "Radioactive Decay", "Optics", "Newton's Laws", "Thermodynamics", "Electromagnetic Induction", "Quantum Mechanics", etc.). This is just a physics example but you have to give accurate topic for that particular subject not like "Physics Equations".
Avoid generic answers like "physics equations" or "math formulas". Respond with only the most specific topic or concept. If multiple topics are present, pick the one most visually prominent or central. If possible, use standard physics curriculum topic names.`;
    
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

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    console.log("✅ Gemini topic analysis completed successfully");
    
    const topic = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return topic || null;
  } catch (err) {
    console.error("❌ Gemini topic analysis error:", err);
    return null;
  }
}

export async function suggestSubjectAndTopicFromImage(imagePath) {
  const subject = await suggestSubjectFromImage(imagePath);
  const topic = await suggestTopicFromImage(imagePath);
  
  return {
    subject: subject,
    topic: topic
  };
}

export async function suggestSubjectAndTopicFromText(text) {
  const subject = await suggestSubjectFromText(text);
  const topic = await suggestTopicFromText(text);
  
  return {
    subject: subject,
    topic: topic
  };
}

export async function suggestSubjectAndTopicFromFile(filePath, mimetype) {
  // Check if it's an image file
  if (mimetype.startsWith("image/") || 
      [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(
        filePath.split('.').pop().toLowerCase()
      )) {
    console.log("📸 Image file detected - using direct Gemini analysis...");
    return await suggestSubjectAndTopicFromImage(filePath);
  }
  
  // For non-image files, extract text first (existing logic)
  console.log("📄 Text-based file detected - extracting text first...");
  // You'll need to import and use extractTextFromFile here
  const { extractTextFromFile } = await import('./fileTextExtractor.js');
  const text = await extractTextFromFile(filePath, mimetype);
  return await suggestSubjectAndTopicFromText(text);
}

export async function suggestSubjectFromTextOrImage(filePath, mimetype) {
  // Check if it's an image file
  if (mimetype.startsWith("image/") || 
      [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(
        filePath.split('.').pop().toLowerCase()
      )) {
    console.log("📸 Image file detected - using direct Gemini analysis...");
    return await suggestSubjectFromImage(filePath);
  }
  
  // For non-image files, extract text first (existing logic)
  console.log("📄 Text-based file detected - extracting text first...");
  // You'll need to import and use extractTextFromFile here
  const { extractTextFromFile } = await import('./fileTextExtractor.js');
  const text = await extractTextFromFile(filePath, mimetype);
  return await suggestSubjectFromText(text);
}
