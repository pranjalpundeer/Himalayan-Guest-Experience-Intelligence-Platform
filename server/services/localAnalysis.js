/**
 * Local AI Fallback - Smart keyword-based review analysis
 * Used when external AI APIs are unavailable
 */

const POSITIVE_WORDS = ["amazing", "excellent", "great", "wonderful", "fantastic", "loved", "perfect", "outstanding", "beautiful", "brilliant", "superb", "impressive", "delightful", "enjoyed", "recommend", "best", "clean", "friendly", "helpful", "stunning", "breathtaking", "cozy", "comfortable", "warm", "divine", "exceptional", "incredible"];

const NEGATIVE_WORDS = ["terrible", "awful", "horrible", "disgusting", "dirty", "rude", "slow", "disappointing", "worst", "bad", "poor", "unacceptable", "dirty", "broken", "cold", "noisy", "overpriced", "waited", "wrong", "complained", "unhappy", "dissatisfied", "avoid", "never"];

const THEME_KEYWORDS = {
  Food: ["food", "meal", "breakfast", "lunch", "dinner", "restaurant", "cuisine", "buffet", "dish", "taste", "delicious", "menu", "chef", "dal", "curry", "tea", "coffee", "drink"],
  Host: ["staff", "service", "team", "host", "receptionist", "manager", "helpful", "friendly", "rude", "attentive", "professional", "courteous", "guide"],
  Location: ["location", "view", "mountain", "himalaya", "scenic", "nearby", "town", "transport", "access", "distance", "situated", "surroundings", "nature"],
  Cleanliness: ["clean", "dirty", "hygiene", "spotless", "tidy", "messy", "washroom", "bathroom", "housekeeping", "neat", "sanitized"],
  Value: ["price", "value", "expensive", "cheap", "worth", "overpriced", "affordable", "cost", "money", "budget", "rate"],
  Experience: ["experience", "stay", "trip", "visit", "trekking", "trek", "spa", "yoga", "adventure", "activity", "overall", "recommend", "room", "bed", "pillow", "view"],
};

const RESPONSES = {
  Positive: {
    Food: "Thank you for appreciating our culinary offerings — we'll keep delighting your palate!",
    Host: "We're thrilled our team made your stay special — your kind words inspire us!",
    Location: "We're glad our stunning Himalayan setting left you breathless!",
    Cleanliness: "Our housekeeping team will be delighted to hear your kind words!",
    Value: "Thank you — we strive to offer exceptional value for every guest!",
    Experience: "What a wonderful review — we can't wait to welcome you back!",
  },
  Negative: {
    Food: "We sincerely apologize for the dining experience — our chef will address this immediately.",
    Host: "We're sorry for the service shortfall — this is being escalated to our management team.",
    Location: "Thank you for the feedback — we offer shuttle services to make access easier.",
    Cleanliness: "We sincerely apologize — our housekeeping standards have been shared with the team.",
    Value: "We appreciate your honest feedback and are reviewing our pricing structure.",
    Experience: "We're sorry your stay didn't meet expectations — please contact us to make it right.",
  },
  Neutral: {
    Food: "Thank you for your feedback on our dining — we're always looking to improve.",
    Host: "We appreciate your comments and will use them to enhance our service.",
    Location: "Thank you for sharing your experience with our location.",
    Cleanliness: "We appreciate your feedback and will maintain our hygiene standards.",
    Value: "Thank you for your honest assessment — we're always working to improve value.",
    Experience: "Thank you for staying with us — we hope to exceed your expectations next time.",
  },
};

const analyzeReviewLocally = (review) => {
  const text = review.toLowerCase();
  const words = text.split(/\s+/);

  // Score sentiment
  let positiveScore = 0;
  let negativeScore = 0;
  words.forEach(word => {
    if (POSITIVE_WORDS.some(p => word.includes(p))) positiveScore++;
    if (NEGATIVE_WORDS.some(n => word.includes(n))) negativeScore++;
  });

  let sentiment;
  if (positiveScore > negativeScore) sentiment = "Positive";
  else if (negativeScore > positiveScore) sentiment = "Negative";
  else sentiment = "Neutral";

  // Detect theme
  let theme = "Experience";
  let maxScore = 0;
  for (const [t, keywords] of Object.entries(THEME_KEYWORDS)) {
    const score = keywords.filter(k => text.includes(k)).length;
    if (score > maxScore) { maxScore = score; theme = t; }
  }

  const response = RESPONSES[sentiment][theme];

  return { review, sentiment, theme, response };
};

const analyzeReviewsLocally = (reviews) => reviews.map(analyzeReviewLocally);

module.exports = { analyzeReviewLocally, analyzeReviewsLocally };
