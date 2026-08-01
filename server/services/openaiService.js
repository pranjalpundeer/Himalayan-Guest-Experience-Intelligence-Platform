/**
 * AI Service - Uses Google Gemini API with local fallback
 */

const { analyzeReviewLocally, analyzeReviewsLocally } = require("./localAnalysis");

const analyzeReview = async (review) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // If no API key, use local analysis
  if (!apiKey) return analyzeReviewLocally(review);

  const prompt = `You are an expert hospitality analyst for a luxury Himalayan hotel brand.
Analyze this guest review and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

Rules:
- "sentiment" must be exactly one of: "Positive", "Neutral", "Negative"
- "theme" must be exactly one of: "Food", "Host", "Location", "Cleanliness", "Value", "Experience"
- "response" must be a single professional management reply sentence (max 25 words)
- Return ONLY the JSON object, nothing else

JSON format:
{
  "review": "<the original review text>",
  "sentiment": "<Positive|Neutral|Negative>",
  "theme": "<Food|Host|Location|Cleanliness|Value|Experience>",
  "response": "<professional one-line management reply>"
}

Guest review: "${review}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API error: ${await response.text()}`);

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) throw new Error("Empty response from Gemini");

    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    let parsed;
    try { parsed = JSON.parse(cleaned); }
    catch (e) { throw new Error(`Failed to parse Gemini response: ${cleaned}`); }

    const validSentiments = ["Positive", "Neutral", "Negative"];
    const validThemes = ["Food", "Host", "Location", "Cleanliness", "Value", "Experience"];
    if (!validSentiments.includes(parsed.sentiment)) parsed.sentiment = "Neutral";
    if (!validThemes.includes(parsed.theme)) parsed.theme = "Experience";

    return { review, sentiment: parsed.sentiment, theme: parsed.theme, response: parsed.response || "Thank you for your valuable feedback." };

  } catch (err) {
    // Fallback to local analysis if Gemini fails
    console.log("Gemini failed, using local analysis:", err.message);
    return analyzeReviewLocally(review);
  }
};

const analyzeReviews = async (reviews) => {
  const CONCURRENCY = 5;
  const results = [];
  for (let i = 0; i < reviews.length; i += CONCURRENCY) {
    const batch = reviews.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((r) => analyzeReview(r)));
    results.push(...batchResults);
  }
  return results;
};

module.exports = { analyzeReview, analyzeReviews };
