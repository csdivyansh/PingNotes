import React, { useState } from "react";
import { pipeline } from "@xenova/transformers";
import Tesseract from "tesseract.js";

// List of candidate subjects
const SUBJECT_CANDIDATES = [
  "Database Management",
  "DBMS",
  "Database",
  "SQL",
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

export default function ZeroShotSubjectClassifier() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [classifier, setClassifier] = useState(null);

  // Load the model on first use
  async function loadClassifier() {
    if (!classifier) {
      setLoading(true);
      const pipe = await pipeline(
        "zero-shot-classification",
        "Xenova/distilbert-mnli-zeroshot"
      );
      setClassifier(() => pipe);
      setLoading(false);
      return pipe;
    }
    return classifier;
  }

  // Handle file upload and text extraction
  async function handleFileChange(e) {
    setFile(e.target.files[0]);
    setExtractedText("");
    setSubject("");
    setOcrProgress(0);

    const file = e.target.files[0];
    if (!file) return;

    // Handle text files
    if (file.type === "text/plain") {
      const text = await file.text();
      setExtractedText(text);
      classifyText(text);
    }
    // Handle images (OCR)
    else if (file.type.startsWith("image/")) {
      setLoading(true);
      Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setOcrProgress(m.progress);
        },
      }).then(({ data: { text } }) => {
        setExtractedText(text);
        setLoading(false);
        classifyText(text);
      });
    }
    // Handle PDFs (OCR first page only, for demo)
    else if (file.type === "application/pdf") {
      setLoading(true);
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");
      Tesseract.recognize(dataUrl, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setOcrProgress(m.progress);
        },
      }).then(({ data: { text } }) => {
        setExtractedText(text);
        setLoading(false);
        classifyText(text);
      });
    }
  }

  // Run zero-shot classification
  async function classifyText(text) {
    setLoading(true);
    const pipe = await loadClassifier();
    const result = await pipe(text, SUBJECT_CANDIDATES);
    setSubject(result.labels[0]);
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>AI Subject Classifier (Client-side)</h2>
      <input
        type="file"
        accept=".txt,image/*,application/pdf"
        onChange={handleFileChange}
      />
      {loading && (
        <div style={{ margin: "1rem 0", color: "#3b82f6" }}>
          Using AI to get file subject...
        </div>
      )}
      {ocrProgress > 0 && ocrProgress < 1 && (
        <div style={{ margin: "1rem 0" }}>
          OCR Progress: {(ocrProgress * 100).toFixed(0)}%
        </div>
      )}
      {extractedText && (
        <div style={{ margin: "1rem 0" }}>
          <strong>Extracted Text:</strong>
          <pre
            style={{
              background: "#f9f9f9",
              padding: 8,
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            {extractedText.slice(0, 1000)}
          </pre>
        </div>
      )}
      {subject && (
        <div style={{ margin: "1rem 0", color: "#16a34a", fontWeight: 600 }}>
          AI Thinks the subject is:{" "}
          <span style={{ color: "#0a192f" }}>{subject}</span>
        </div>
      )}
    </div>
  );
}
