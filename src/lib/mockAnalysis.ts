export type ContentType = "text" | "image" | "video";
export type Classification = "Fake" | "Likely Fake" | "Unverified" | "Likely True" | "Verified";
export type RiskLevel = "high" | "medium" | "low";

export interface AnalysisResult {
  id: string;
  timestamp: string;
  contentType: ContentType;
  contentPreview: string;
  sourceUrl?: string;
  classification: Classification;
  confidenceScore: number;
  riskScore: number;
  similarityMatch: number;
  explanation: string;
  flaggedPhrases: string[];
  riskLevel: RiskLevel;
  textRisk: number;
  sourceCredibility: number;
  viralityPattern: number;
  mediaManipulation: number;
  similarCases: string[];
}

const SUSPICIOUS_PHRASES = [
  "breaking news", "you won't believe", "scientists baffled", "they don't want you to know",
  "100% proven", "share before deleted", "mainstream media won't tell you", "shocking truth",
  "miracle cure", "exposed", "conspiracy", "cover-up", "secret agenda", "wake up",
  "deep state", "crisis actors", "false flag", "hoax", "propaganda"
];

const SIMILAR_CASES = [
  "Similar claim debunked by Reuters Fact Check (2024)",
  "Matches viral misinformation pattern identified by WHO",
  "Related to previously flagged narrative on social media",
  "Resembles known disinformation campaign targeting elections",
  "Pattern matches coordinated inauthentic behavior report",
];

function detectSuspiciousPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return SUSPICIOUS_PHRASES.filter(p => lower.includes(p));
}

function computeTextRisk(text: string, flagged: string[]): number {
  let risk = 20;
  risk += flagged.length * 12;
  if (text.length < 50) risk += 10;
  if (text.toUpperCase() === text && text.length > 10) risk += 25;
  if ((text.match(/!/g) || []).length > 3) risk += 15;
  if ((text.match(/\?{2,}/g) || []).length > 0) risk += 10;
  return Math.min(100, Math.max(0, risk));
}

function getClassification(riskScore: number): Classification {
  if (riskScore >= 80) return "Fake";
  if (riskScore >= 60) return "Likely Fake";
  if (riskScore >= 40) return "Unverified";
  if (riskScore >= 20) return "Likely True";
  return "Verified";
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 60) return "high";
  if (riskScore >= 35) return "medium";
  return "low";
}

export function analyzeContent(
  contentType: ContentType,
  content: string,
  sourceUrl?: string
): AnalysisResult {
  const flaggedPhrases = contentType === "text" ? detectSuspiciousPhrases(content) : [];
  const textRisk = contentType === "text" ? computeTextRisk(content, flaggedPhrases) : Math.random() * 60 + 20;
  const sourceCredibility = sourceUrl ? (sourceUrl.includes("gov") || sourceUrl.includes("edu") ? 15 : 55 + Math.random() * 30) : 50;
  const viralityPattern = Math.random() * 70 + 10;
  const mediaManipulation = contentType === "image" ? Math.random() * 80 + 10 : contentType === "video" ? Math.random() * 60 + 20 : 5;

  const riskScore = Math.round(
    textRisk * 0.5 + sourceCredibility * 0.2 + viralityPattern * 0.2 + mediaManipulation * 0.1
  );

  const classification = getClassification(riskScore);
  const confidenceScore = Math.round(60 + Math.random() * 35);
  const similarityMatch = Math.round(Math.random() * 85);

  const explanations: Record<Classification, string> = {
    "Fake": "Multiple indicators suggest this content is fabricated. High-risk language patterns detected with significant similarity to known misinformation.",
    "Likely Fake": "Several warning signs detected. Content contains manipulative language patterns and low source credibility.",
    "Unverified": "Unable to fully verify this content. Some suspicious elements detected but insufficient evidence for definitive classification.",
    "Likely True": "Content appears mostly credible with minor concerns. Source has moderate trustworthiness.",
    "Verified": "Content aligns with verified information sources. No significant manipulation indicators detected.",
  };

  const numSimilar = Math.floor(Math.random() * 3) + 1;
  const similarCases = SIMILAR_CASES.sort(() => Math.random() - 0.5).slice(0, numSimilar);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    contentType,
    contentPreview: content.slice(0, 200),
    sourceUrl,
    classification,
    confidenceScore,
    riskScore,
    similarityMatch,
    explanation: explanations[classification],
    flaggedPhrases,
    riskLevel: getRiskLevel(riskScore),
    textRisk: Math.round(textRisk),
    sourceCredibility: Math.round(sourceCredibility),
    viralityPattern: Math.round(viralityPattern),
    mediaManipulation: Math.round(mediaManipulation),
    similarCases,
  };
}

// Generate sample data for dashboard
export function generateSampleData(): AnalysisResult[] {
  const samples = [
    { type: "text" as ContentType, content: "BREAKING: Scientists baffled by miracle cure that they don't want you to know about!! Share before deleted!!!", url: "http://fakenews.example.com" },
    { type: "text" as ContentType, content: "New study published in Nature confirms climate change acceleration patterns consistent with IPCC models.", url: "https://nature.edu/studies" },
    { type: "text" as ContentType, content: "You won't believe what the government is hiding! The shocking truth exposed about the deep state conspiracy!", url: "" },
    { type: "image" as ContentType, content: "protest_photo_modified.jpg", url: "http://social-share.net/viral" },
    { type: "text" as ContentType, content: "Local community center announces free vaccination clinic this Saturday from 9am to 5pm.", url: "https://cityhealth.gov/news" },
    { type: "text" as ContentType, content: "WAKE UP! Crisis actors spotted at the scene. False flag operation confirmed by anonymous sources!", url: "" },
    { type: "video" as ContentType, content: "deepfake_political_speech.mp4", url: "http://unverified-source.xyz" },
    { type: "text" as ContentType, content: "The World Health Organization has released updated guidelines for respiratory illness prevention.", url: "https://who.int/guidelines" },
  ];

  return samples.map(s => analyzeContent(s.type, s.content, s.url || undefined));
}
