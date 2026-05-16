// tabTranslator.js — map tab titles/urls to localized or aliased display names

const translationStore = {};

function getTranslationKey(tab) {
  return tab.url ? tab.url.trim().toLowerCase() : null;
}

function setTranslation(tab, translatedTitle) {
  const key = getTranslationKey(tab);
  if (!key) throw new Error('Tab must have a valid url');
  if (typeof translatedTitle !== 'string' || !translatedTitle.trim()) {
    throw new Error('translatedTitle must be a non-empty string');
  }
  translationStore[key] = translatedTitle.trim();
  return { key, translatedTitle: translationStore[key] };
}

function getTranslation(tab) {
  const key = getTranslationKey(tab);
  return key ? translationStore[key] || null : null;
}

function removeTranslation(tab) {
  const key = getTranslationKey(tab);
  if (!key || !translationStore[key]) return false;
  delete translationStore[key];
  return true;
}

function hasTranslation(tab) {
  const key = getTranslationKey(tab);
  return key ? Object.prototype.hasOwnProperty.call(translationStore, key) : false;
}

function applyTranslations(tabs) {
  return tabs.map(tab => {
    const translated = getTranslation(tab);
    return translated
      ? { ...tab, title: translated, originalTitle: tab.title }
      : { ...tab };
  });
}

function clearTranslations() {
  Object.keys(translationStore).forEach(k => delete translationStore[k]);
}

function getTranslationSummary(tabs) {
  const total = tabs.length;
  const translated = tabs.filter(t => hasTranslation(t)).length;
  return { total, translated, untranslated: total - translated };
}

module.exports = {
  getTranslationKey,
  setTranslation,
  getTranslation,
  removeTranslation,
  hasTranslation,
  applyTranslations,
  clearTranslations,
  getTranslationSummary,
};
