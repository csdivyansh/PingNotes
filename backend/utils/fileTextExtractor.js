import fs from "fs";
import pdfParse from "pdf-parse";
import { fromPath as pdf2picFromPath } from "pdf2pic";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import path from "path";

function cleanExtractedText(text) {
  if (!text) return "";
  // Remove lines like 'Scanned with ... Scanner' (case-insensitive)
  return text
    .split("\n")
    .filter((line) => !/^scanned with .+scanner$/i.test(line.trim()))
    .join("\n");
}

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
  // Try pdf-parse first
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  let text = cleanExtractedText(data.text);
  if (isMeaningfulText(text)) {
    console.log("Used embedded text extraction");
    return text;
  }
  // Fallback to image-based OCR for the first page
  console.log("Falling back to OCR for PDF");
  const pdf2pic = pdf2picFromPath(filePath, {
    density: 50,
    format: "png",
    saveFilename: "temp",
    savePath: "./",
  });
  let ocrText = "";
  try {
    const page = await pdf2pic(1);
    const {
      data: { text },
    } = await Tesseract.recognize(page.path, "eng");
    ocrText += text + "\n";
    fs.unlinkSync(page.path); // Clean up temp image
  } catch (err) {
    console.error(`OCR failed for PDF page 1:`, err);
  }
  ocrText = cleanExtractedText(ocrText);
  if (!isMeaningfulText(ocrText)) {
    throw new Error(
      "Could not extract meaningful text from your file. Please upload a higher-quality scan or a text-based file."
    );
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

async function extractTextFromImage(filePath) {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "eng");
  return text;
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
  } else if (
    mimetype.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(
      path.extname(filePath).toLowerCase()
    )
  ) {
    return await extractTextFromImage(filePath);
  } else {
    throw new Error("Unsupported file type for text extraction");
  }
}
