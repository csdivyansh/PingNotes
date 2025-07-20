import fetch from "node-fetch";

const HF_TOKEN = process.env.HUGGINGFACE_HUB_TOKEN;
const API_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

const SUBJECT_CANDIDATES = [
  "Database Management",
  "DBMS",
  "Database",
  "Database Management System",
  "SQL",
  "Relational Databases",
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
  // ...add more as needed
];

export async function suggestSubjectFromText(text) {
  console.log(
    "Text sent to HF API:",
    text && text.slice ? text.slice(0, 200) : text
  );
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: { candidate_labels: SUBJECT_CANDIDATES },
    }),
  });
  const result = await response.json();
  console.log("HF API result:", result);
  if (result && result.labels && result.labels.length > 0) {
    return result.labels[0];
  }
  return null;
}
