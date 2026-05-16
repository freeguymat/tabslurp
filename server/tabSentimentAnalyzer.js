// Lightweight keyword-based sentiment scoring for tab titles

const POSITIVE_WORDS = [
  'awesome', 'great', 'best', 'top', 'guide', 'tutorial', 'learn', 'how',
  'free', 'open', 'new', 'official', 'intro', 'getting started', 'tips'
];

const NEGATIVE_WORDS = [
  'error', 'bug', 'issue', 'broken', 'fail', 'deprecated', 'warning',
  'slow', 'crash', 'problem', 'fix', 'hack', 'workaround', 'dead'
];

function scoreTitle(title) {
  if (!title || typeof title !== 'string') return 0;
  const lower = title.toLowerCase();
  let score = 0;
  for (const word of POSITIVE_WORDS) {
    if (lower.includes(word)) score += 1;
  }
  for (const word of NEGATIVE_WORDS) {
    if (lower.includes(word)) score -= 1;
  }
  return score;
}

function getSentimentLabel(score) {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function analyzeTab(tab) {
  const score = scoreTitle(tab.title);
  return {
    ...tab,
    sentiment: {
      score,
      label: getSentimentLabel(score)
    }
  };
}

function analyzeTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(analyzeTab);
}

function sentimentSummary(tabs) {
  const analyzed = analyzeTabs(tabs);
  const counts = { positive: 0, neutral: 0, negative: 0 };
  for (const tab of analyzed) {
    counts[tab.sentiment.label]++;
  }
  return {
    total: analyzed.length,
    counts,
    averageScore: analyzed.length
      ? analyzed.reduce((sum, t) => sum + t.sentiment.score, 0) / analyzed.length
      : 0
  };
}

module.exports = { scoreTitle, getSentimentLabel, analyzeTab, analyzeTabs, sentimentSummary };
