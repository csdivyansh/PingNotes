import fs from "fs";
import pdfParse from "pdf-parse";
import { fromPath as pdf2picFromPath } from "pdf2pic";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";

function isMeaningfulText(text) {
  if (!text || text.trim().length < 50) return false;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return false;
  const freq = {};
  lines.forEach((l) => {
    freq[l] = (freq[l] || 0) + 1;
  });
  const mostCommon = Math.max(...Object.values(freq));
  if (mostCommon / lines.length > 0.6) return false;
  return true;
}

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  if (isMeaningfulText(data.text)) {
    console.log("Used embedded text extraction");
    return data.text;
  }
  // Fallback to OCR if text is insufficient or repetitive
  console.log("Falling back to OCR for PDF");
  const pdf2pic = pdf2picFromPath(filePath, {
    density: 100,
    format: "png",
    saveFilename: "temp",
    savePath: "./",
  });
  const numPages = Math.min(data.numpages || 1, 3); // Only process first 3 pages
  let ocrText = "";
  for (let i = 1; i <= numPages; i++) {
    try {
      const page = await pdf2pic(i);
      const {
        data: { text },
      } = await Tesseract.recognize(page.path, "eng");
      ocrText += text + "\n";
      fs.unlinkSync(page.path); // Clean up temp image
    } catch (err) {
      console.error(`OCR failed for page ${i}:`, err);
    }
  }
  return ocrText;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromTXT(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

export async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filePath.endsWith(".docx")
  ) {
    return await extractTextFromDOCX(filePath);
  } else if (
    mimetype === "text/plain" ||
    filePath.endsWith(".txt") ||
    filePath.endsWith(".sql")
  ) {
    return await extractTextFromTXT(filePath);
  } else {
    throw new Error("Unsupported file type for text extraction");
  }
}
