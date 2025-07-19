import fs from 'fs';
import pdfParse from 'pdf-parse';
import { fromPath as pdf2picFromPath } from 'pdf2pic';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  if (data.text && data.text.trim().length > 50) {
    return data.text;
  }
  // Fallback to OCR if text is insufficient
  const pdf2pic = pdf2picFromPath(filePath, { density: 200, format: 'png', saveFilename: 'temp', savePath: './' });
  const numPages = data.numpages || 1;
  let ocrText = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf2pic(i);
    const { data: { text } } = await Tesseract.recognize(page.path, 'eng');
    ocrText += text + '\n';
    fs.unlinkSync(page.path); // Clean up temp image
  }
  return ocrText;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromTXT(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filePath.endsWith('.docx')
  ) {
    return await extractTextFromDOCX(filePath);
  } else if (mimetype === 'text/plain' || filePath.endsWith('.txt')) {
    return await extractTextFromTXT(filePath);
  } else {
    throw new Error('Unsupported file type for text extraction');
  }
} 