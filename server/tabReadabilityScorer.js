// Scores tabs by estimated readability based on title and URL characteristics

const SIMPLE_WORDS = ['home', 'about', 'blog', 'news', 'docs', 'guide', 'help', 'faq'];
const COMPLEX_INDICATORS = ['?', '&', '%', '=', '#', 'utm_', 'ref=', 'session'];

function scoreTitleReadability(title) {
  if (!title || typeof title !== 'string') return 0;
  const words = title.trim().split(/\s+/);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / (words.length || 1);
  const lengthScore = Math.max(0, 10 - Math.abs(words.length - 6));
  const complexityScore = avgWordLength <= 6 ? 10 : Math.max(0, 10 - (avgWordLength - 6));
  return Math.round((lengthScore + complexityScore) / 2);
}

function scoreUrlReadability(url) {
  if (!url || typeof url !== 'string') return 0;
  let score = 10;
  COMPLEX_INDICATORS.forEach(indicator => {
    if (url.includes(indicator)) score -= 2;
  });
  const pathSegments = url.replace(/https?:\/\/[^/]+/, '').split('/').filter(Boolean);
  if (pathSegments.length > 4) score -= (pathSegments.length - 4);
  SIMPLE_WORDS.forEach(word => {
    if (pathSegments.includes(word)) score += 1;
  });
  return Math.max(0, Math.min(10, score));
}

function getReadabilityLabel(score) {
  if (score >= 8) return 'easy';
  if (score >= 5) return 'moderate';
  return 'complex';
}

function scoreTab(tab) {
  const titleScore = scoreTitleReadability(tab.title);
  const urlScore = scoreUrlReadability(tab.url);
  const combined = Math.round((titleScore + urlScore) / 2);
  return {
    ...tab,
    readability: {
      titleScore,
      urlScore,
      score: combined,
      label: getReadabilityLabel(combined)
    }
  };
}

function scoreTabs(tabs) {
  return tabs.map(scoreTab);
}

function readabilitySummary(scoredTabs) {
  const counts = { easy: 0, moderate: 0, complex: 0 };
  let total = 0;
  scoredTabs.forEach(tab => {
    const label = tab.readability?.label;
    if (label && counts[label] !== undefined) counts[label]++;
    total += tab.readability?.score || 0;
  });
  return {
    total: scoredTabs.length,
    averageScore: scoredTabs.length ? Math.round(total / scoredTabs.length) : 0,
    breakdown: counts
  };
}

module.exports = { scoreTitleReadability, scoreUrlReadability, getReadabilityLabel, scoreTab, scoreTabs, readabilitySummary };
