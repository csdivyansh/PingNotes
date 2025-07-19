import natural from "natural";

export function suggestSubjectFromText(text, numKeywords = 3) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());
  // Remove stopwords and short words
  const stopwords = new Set(natural.stopwords);
  const filtered = words.filter((w) => !stopwords.has(w) && w.length > 2);
  // Count word frequencies
  const freq = {};
  filtered.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });
  // Sort by frequency
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  // Return top N keywords as a subject string
  return sorted
    .slice(0, numKeywords)
    .map(([w]) => w)
    .join(" ");
}
