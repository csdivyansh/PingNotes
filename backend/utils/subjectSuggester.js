import fetch from "node-fetch";

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
