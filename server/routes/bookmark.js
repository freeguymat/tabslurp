const express = require('express');
const router = express.Router();
const {
  bookmarkTab,
  unbookmarkTab,
  isBookmarked,
  bookmarkTabs,
  getBookmarkedTabs,
  clearBookmarks,
  getBookmarkCount,
} = require('../tabBookmarker');

// GET /bookmarks — list all bookmarked tabs
router.get('/', (req, res) => {
  const tabs = getBookmarkedTabs();
  res.json({ count: getBookmarkCount(), tabs });
});

// POST /bookmarks — bookmark one or more tabs
router.post('/', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return res.status(400).json({ error: 'tabs must be a non-empty array' });
  }
  const bookmarked = bookmarkTabs(tabs);
  res.json({ bookmarked });
});

// GET /bookmarks/check?url=... — check if a url is bookmarked
router.get('/check', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'url query param required' });
  }
  res.json({ url, bookmarked: isBookmarked(url) });
});

// DELETE /bookmarks — remove a bookmark by url
router.delete('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }
  const removed = unbookmarkTab(url);
  if (!removed) {
    return res.status(404).json({ error: 'bookmark not found' });
  }
  res.json({ removed: true, url });
});

// DELETE /bookmarks/all — clear all bookmarks
router.delete('/all', (req, res) => {
  clearBookmarks();
  res.json({ cleared: true });
});

module.exports = router;
