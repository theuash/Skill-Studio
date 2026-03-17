const express = require('express')
const router = express.Router()
const { getDailyNews, getNewsByDate, getNewsArchive, getArticleById } = require('../controllers/newsController')
const { protect } = require('../middleware/authMiddleware')

// All news routes require authentication
router.use(protect)

// Get today's news (generates if not exists)
router.get('/daily', getDailyNews)

// Get news by specific date
router.get('/date/:date', getNewsByDate)

// Get news archive
router.get('/archive', getNewsArchive)

// Get expanded article by ID
router.get('/article/:articleId', getArticleById)

module.exports = router