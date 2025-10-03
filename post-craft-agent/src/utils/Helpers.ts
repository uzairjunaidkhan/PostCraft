// utils/suggestions.ts

export type Suggestion = {
  tones: ToneResult[];
  improvements: string[];
  issues: string[];
  analytics: AnalyticsData;
  sentiment: SentimentResult;
  qualityScore: number;
  platformRecommendations?: PlatformRecommendation[];
};

export type ToneResult = {
  tone: string;
  confidence: number;
};

export type AnalyticsData = {
  wordCount: number;
  characterCount: number;
  emojiCount: number;
  hashtagCount: number;
  mentionCount: number;
  linkCount: number;
  readabilityScore: number;
  avgWordLength: number;
  estimatedReadTime: string;
};

export type SentimentResult = {
  label: "Positive" | "Negative" | "Neutral" | "Mixed";
  score: number;
};

export type PlatformRecommendation = {
  platform: string;
  suitability: number;
  reason: string;
};

// Scoring weight constants
const SCORING_WEIGHTS = {
  SHORT_TEXT_PENALTY: 10,
  LONG_TEXT_PENALTY: 10,
  NO_HASHTAGS_PENALTY: 5,
  LOW_READABILITY_PENALTY: 10,
  NEGATIVE_SENTIMENT_PENALTY: 10,
  ISSUE_PENALTY: 5,
  IMPROVEMENT_PENALTY: 2,
  NO_CTA_PENALTY: 5,
  NO_PUNCTUATION_PENALTY: 5,
  BUZZWORD_OVERUSE_PENALTY: 8,
};

// Optimized syllable counter
const countSyllables = (word: string): number => {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  // Remove silent 'e' at the end
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  // Count vowel groups
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

// Enhanced readability score (Flesch Reading Ease)
const readabilityScore = (text: string): number => {
  const sentences = text.split(/[.!?…。！？]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  
  const totalSyllables = words.reduce((sum, word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return sum + countSyllables(cleanWord);
  }, 0);
  
  const score = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (totalSyllables / wordCount);
  return Math.round(Math.max(0, Math.min(100, score)));
};

// Enhanced sentiment analysis
const sentimentAnalysis = (text: string): SentimentResult => {
  const positiveWords = [
    'happy', 'excited', 'grateful', 'love', 'amazing', 'great', 'excellent',
    'wonderful', 'fantastic', 'awesome', 'thrilled', 'delighted', 'joy',
    'success', 'achievement', 'proud', 'celebrate', 'win', 'breakthrough'
  ];
  
  const negativeWords = [
    'sad', 'angry', 'frustrated', 'tired', 'concerned', 'worried', 'hate',
    'terrible', 'awful', 'horrible', 'disappointed', 'upset', 'annoyed',
    'struggle', 'fail', 'problem', 'issue', 'crisis', 'disaster'
  ];
  
  const positiveEmojis = ['😊', '😄', '😃', '🎉', '🚀', '❤️', '💪', '✨', '🙏', '👏', '🔥', '💯'];
  const negativeEmojis = ['😢', '😭', '😡', '😤', '😞', '😔', '💔', '😩', '😰'];
  
  const lowerText = text.toLowerCase();
  
  // Check for negation patterns
  const negationPattern = /\b(not|no|never|don't|doesn't|didn't|won't|can't|cannot)\s+(\w+)/gi;
  let negationAdjustment = 0;
  
  let matches;
  while ((matches = negationPattern.exec(text)) !== null) {
    const negatedWord = matches[2].toLowerCase();
    if (positiveWords.includes(negatedWord)) {
      negationAdjustment -= 1;
    } else if (negativeWords.includes(negatedWord)) {
      negationAdjustment += 1;
    }
  }
  
  let positiveCount = positiveWords.reduce((count, word) => 
    count + (lowerText.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0
  );
  
  let negativeCount = negativeWords.reduce((count, word) => 
    count + (lowerText.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0
  );
  
  positiveCount += positiveEmojis.reduce((count, emoji) => 
    count + (text.split(emoji).length - 1), 0
  );
  
  negativeCount += negativeEmojis.reduce((count, emoji) => 
    count + (text.split(emoji).length - 1), 0
  );
  
  positiveCount += negationAdjustment;
  negativeCount -= negationAdjustment;
  
  const totalSentimentWords = positiveCount + negativeCount;
  
  if (totalSentimentWords === 0) {
    return { label: "Neutral", score: 50 };
  }
  
  const sentimentScore = (positiveCount / totalSentimentWords) * 100;
  
  let label: "Positive" | "Negative" | "Neutral" | "Mixed";
  if (positiveCount > 0 && negativeCount > 0 && Math.abs(positiveCount - negativeCount) <= 1) {
    label = "Mixed";
  } else if (sentimentScore >= 60) {
    label = "Positive";
  } else if (sentimentScore <= 40) {
    label = "Negative";
  } else {
    label = "Neutral";
  }
  
  return { label, score: Math.round(sentimentScore) };
};

// Tone detection with confidence scores
const detectTones = (text: string): ToneResult[] => {
  const tonePatterns = [
    {
      tone: "Inspirational",
      patterns: /\b(amazing|inspired|excited|thrilled|transform|empower|achieve|dream|believe|possible|motivat|aspir)\b|[🎉🚀✨💪🌟]/gi,
      weight: 1.2
    },
    {
      tone: "Professional",
      patterns: /\b(innovation|strategy|business|growth|efficiency|productivity|optimize|leverage|stakeholder|market|revenue|analysis)\b/gi,
      weight: 1.0
    },
    {
      tone: "Casual",
      patterns: /\b(hey|guys|folks|cool|yeah|awesome|gonna|wanna|btw|lol|omg)\b|[😂😅🤣😊]/gi,
      weight: 1.0
    },
    {
      tone: "Grateful",
      patterns: /\b(thanks|thank you|grateful|appreciate|gratitude|blessed|thankful)\b|🙏/gi,
      weight: 1.1
    },
    {
      tone: "Educational",
      patterns: /\b(learn|discover|understand|tip|guide|tutorial|how to|explained|lesson|knowledge|study)\b|📚|💡/gi,
      weight: 1.0
    },
    {
      tone: "Urgent",
      patterns: /\b(breaking|urgent|alert|now|immediately|asap|deadline|hurry|quick|fast|limited time)\b|⚠️|🚨/gi,
      weight: 1.3
    },
    {
      tone: "Humorous",
      patterns: /\b(funny|hilarious|joke|laugh|haha|lmao|rofl)\b|[😂😅🤣]/gi,
      weight: 1.0
    },
    {
      tone: "Promotional",
      patterns: /\b(sale|discount|offer|deal|buy|shop|limited|exclusive|save|free|launch|release)\b|💰|🛍️/gi,
      weight: 1.0
    },
    {
      tone: "Informative",
      patterns: /\b(according|report|study|data|research|statistics|found|shows|indicates|reveals)\b|📊|📈/gi,
      weight: 1.0
    },
    {
      tone: "Conversational",
      patterns: /\b(what do you think|your thoughts|let me know|tell me|share|comment|discuss)\b|\?/gi,
      weight: 1.0
    }
  ];
  
  const tones: ToneResult[] = [];
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  tonePatterns.forEach(({ tone, patterns, weight }) => {
    const matches = text.match(patterns);
    if (matches) {
      const matchCount = matches.length;
      const confidence = Math.min(100, Math.round((matchCount / Math.max(wordCount / 10, 1)) * 100 * weight));
      if (confidence > 15) {
        tones.push({ tone, confidence });
      }
    }
  });
  
  // Sort by confidence
  tones.sort((a, b) => b.confidence - a.confidence);
  
  // Return top 3 tones or all if less than 3
  return tones.length > 0 ? tones.slice(0, 3) : [{ tone: "Neutral", confidence: 100 }];
};

// Platform suitability recommendations
const getPlatformRecommendations = (
  text: string,
  analytics: AnalyticsData,
  sentiment: SentimentResult,
  tones: ToneResult[]
): PlatformRecommendation[] => {
  const recommendations: PlatformRecommendation[] = [];
  const { wordCount, hashtagCount, emojiCount, characterCount } = analytics;
  
  // Twitter/X
  let twitterScore = 100;
  if (characterCount > 280) twitterScore -= 30;
  if (hashtagCount > 3) twitterScore -= 10;
  if (wordCount < 10) twitterScore += 10;
  recommendations.push({
    platform: "Twitter/X",
    suitability: Math.max(0, twitterScore),
    reason: characterCount <= 280 ? "Perfect length for Twitter" : "Too long for a single tweet"
  });
  
  // LinkedIn
  let linkedInScore = 100;
  if (wordCount < 50) linkedInScore -= 20;
  if (tones.some(t => t.tone === "Professional" || t.tone === "Educational")) linkedInScore += 15;
  if (tones.some(t => t.tone === "Casual" || t.tone === "Humorous")) linkedInScore -= 10;
  if (hashtagCount === 0) linkedInScore -= 5;
  recommendations.push({
    platform: "LinkedIn",
    suitability: Math.max(0, linkedInScore),
    reason: tones.some(t => t.tone === "Professional") ? "Professional tone fits LinkedIn" : "Add more professional context"
  });
  
  // Instagram
  let instagramScore = 100;
  if (emojiCount === 0) instagramScore -= 15;
  if (hashtagCount < 5) instagramScore -= 10;
  if (wordCount > 150) instagramScore -= 10;
  recommendations.push({
    platform: "Instagram",
    suitability: Math.max(0, instagramScore),
    reason: emojiCount > 2 && hashtagCount > 5 ? "Great visual appeal for Instagram" : "Add more emojis and hashtags"
  });
  
  // Facebook
  let facebookScore = 100;
  if (wordCount > 300) facebookScore -= 10;
  if (sentiment.label === "Mixed" || sentiment.label === "Neutral") facebookScore -= 5;
  recommendations.push({
    platform: "Facebook",
    suitability: Math.max(0, facebookScore),
    reason: "Suitable for Facebook's diverse audience"
  });
  
  return recommendations.sort((a, b) => b.suitability - a.suitability);
};

// Main analysis function
export const analyzeText = (text: string, context: "user" | "ai" = "user"): Suggestion => {
  if (!text || text.trim().length === 0) {
    return {
      tones: [{ tone: "Neutral", confidence: 0 }],
      improvements: ["Add content to analyze"],
      issues: ["No text provided"],
      analytics: {
        wordCount: 0,
        characterCount: 0,
        emojiCount: 0,
        hashtagCount: 0,
        mentionCount: 0,
        linkCount: 0,
        readabilityScore: 0,
        avgWordLength: 0,
        estimatedReadTime: "0 sec"
      },
      sentiment: { label: "Neutral", score: 50 },
      qualityScore: 0
    };
  }
  
  const improvements: string[] = [];
  const issues: string[] = [];
  
  // ----- Analytics -----
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = text.length;
  const emojiCount = (text.match(/\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu) || []).length;
  const hashtagCount = (text.match(/#[a-z0-9_]+/gi) || []).length;
  const mentionCount = (text.match(/@[a-z0-9_]+/gi) || []).length;
  const linkCount = (text.match(/https?:\/\/[^\s]+/gi) || []).length;
  const readability = readabilityScore(text);
  const avgWordLength = words.reduce((sum, word) => sum + word.replace(/[^\w]/g, '').length, 0) / wordCount;
  const estimatedReadTime = wordCount < 50 ? "< 30 sec" : `${Math.ceil(wordCount / 200)} min`;
  
  const analytics: AnalyticsData = {
    wordCount,
    characterCount,
    emojiCount,
    hashtagCount,
    mentionCount,
    linkCount,
    readabilityScore: readability,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    estimatedReadTime
  };
  
  // ----- Tone Detection -----
  const tones = detectTones(text);
  
  // ----- Sentiment Analysis -----
  const sentiment = sentimentAnalysis(text);
  
  // ----- Improvements -----
  if (wordCount < 15) {
    improvements.push("Consider expanding with more context or details for better engagement.");
  }
  
  if (!/[.!?…。！？]\s*$/.test(text.trim())) {
    improvements.push("End with proper punctuation for a polished finish.");
  }
  
  if (!/\b(you|your|we|our|us)\b/i.test(text)) {
    improvements.push("Make it more engaging by directly addressing your audience.");
  }
  
  const ctaWords = /\b(click|join|check|visit|learn|follow|read|subscribe|download|share|comment|try|discover|explore|get)\b/i;
  if (!ctaWords.test(text)) {
    improvements.push("Add a clear call-to-action to drive engagement (e.g., 'Learn more', 'Join us').");
  }
  
  if (!/\?/.test(text) && wordCount > 20) {
    improvements.push("Consider asking a question to encourage audience interaction.");
  }
  
  if (hashtagCount === 0 && wordCount > 15) {
    improvements.push("Add 2–5 relevant hashtags to improve discoverability.");
  } else if (hashtagCount > 10) {
    improvements.push("Reduce hashtags to 5-8 for optimal engagement (too many can look spammy).");
  }
  
  if (emojiCount === 0 && wordCount > 20) {
    improvements.push("Consider adding 1-3 emojis to make your post more visually appealing.");
  } else if (emojiCount > 10) {
    improvements.push("Reduce emoji usage for a more professional appearance.");
  }
  
  if (readability < 60) {
    improvements.push("Simplify your language for better readability (use shorter sentences and common words).");
  }
  
  if (context === "user") {
    improvements.push("Review the tone and ensure it aligns with your brand voice.");
  } else if (context === "ai") {
    improvements.push("Polish AI-generated text to add personality and match your unique style.");
  }
  
  // ----- Issues -----
  if (characterCount > 280 && characterCount < 500) {
    issues.push("Post is long for Twitter/X (280 chars). Consider condensing or using a thread.");
  } else if (characterCount > 2000) {
    issues.push("Very long post may reduce engagement. Consider breaking into multiple posts or a blog.");
  }
  
  const buzzwords = text.match(/\b(synergy|disruptive|innovative|leverage|paradigm|transform|revolutionary|cutting-edge|game-changer)\b/gi);
  if (buzzwords && buzzwords.length > 3) {
    issues.push(`Overuse of buzzwords (${buzzwords.length} found) may reduce authenticity. Be more specific.`);
  }
  
  if (/http/i.test(text)) {
    const validLinks = text.match(/https?:\/\/[^\s]+\.[^\s]+/g);
    if (!validLinks || validLinks.length === 0) {
      issues.push("Link appears broken or incomplete. Ensure it starts with http:// or https://");
    }
  }
  
  if (text.split('\n').length > 10) {
    issues.push("Too many line breaks can make the post look cluttered. Consolidate paragraphs.");
  }
  
  if (sentiment.label === "Negative" && !tones.some(t => t.tone === "Educational" || t.tone === "Informative")) {
    issues.push("Negative sentiment detected. Consider balancing with constructive or positive elements.");
  }
  
  const capsWords = text.match(/\b[A-Z]{3,}\b/g);
  if (capsWords && capsWords.length > 2) {
    issues.push("Excessive use of ALL CAPS can feel like shouting. Use sparingly for emphasis.");
  }
  
  // ----- Quality Scoring -----
  let score = 100;
  
  if (wordCount < 15) score -= SCORING_WEIGHTS.SHORT_TEXT_PENALTY;
  if (characterCount > 280) score -= SCORING_WEIGHTS.LONG_TEXT_PENALTY;
  if (hashtagCount === 0 && wordCount > 15) score -= SCORING_WEIGHTS.NO_HASHTAGS_PENALTY;
  if (readability < 50) score -= SCORING_WEIGHTS.LOW_READABILITY_PENALTY;
  if (sentiment.label === "Negative") score -= SCORING_WEIGHTS.NEGATIVE_SENTIMENT_PENALTY;
  if (!ctaWords.test(text) && wordCount > 20) score -= SCORING_WEIGHTS.NO_CTA_PENALTY;
  if (!/[.!?…。！？]\s*$/.test(text.trim())) score -= SCORING_WEIGHTS.NO_PUNCTUATION_PENALTY;
  if (buzzwords && buzzwords.length > 3) score -= SCORING_WEIGHTS.BUZZWORD_OVERUSE_PENALTY;
  
  score -= issues.length * SCORING_WEIGHTS.ISSUE_PENALTY;
  score -= improvements.length * SCORING_WEIGHTS.IMPROVEMENT_PENALTY;
  
  // Bonus points
  if (hashtagCount >= 2 && hashtagCount <= 5) score += 5;
  if (emojiCount >= 1 && emojiCount <= 3) score += 5;
  if (sentiment.label === "Positive") score += 10;
  if (readability >= 70) score += 5;
  if (ctaWords.test(text)) score += 5;
  
  score = Math.max(0, Math.min(100, score));
  
  // ----- Platform Recommendations -----
  const platformRecommendations = getPlatformRecommendations(text, analytics, sentiment, tones);
  
  return {
    tones,
    improvements,
    issues,
    analytics,
    sentiment,
    qualityScore: score,
    platformRecommendations
  };
};