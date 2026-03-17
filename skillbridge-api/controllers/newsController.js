const NewsDaily = require('../models/NewsDaily')
const { generateNews } = require('../utils/aiService')
const { groqChat } = require('../config/groq')

// Get today's news - generate if not exists or force refresh
const getDailyNews = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const force = req.query.force === 'true'

    let news = await NewsDaily.findOne({ date: today })

    // If news doesn't exist or force refresh is requested
    if (!news || force) {
      console.log('Generating new daily news...')

      // Generate news using AI
      const generatedNews = await generateNews()

      // Save to database
      news = await NewsDaily.findOneAndUpdate(
        { date: today },
        {
          ...generatedNews,
          date: today,
          updatedAt: new Date()
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
    }

    res.json(news)
  } catch (error) {
    console.error('Error fetching daily news:', error)
    res.status(500).json({
      message: 'Failed to fetch daily news',
      error: error.message
    })
  }
}

// Get news by date
const getNewsByDate = async (req, res) => {
  try {
    const { date } = req.params

    const news = await NewsDaily.findOne({ date })

    if (!news) {
      return res.status(404).json({ message: 'News not found for this date' })
    }

    res.json(news)
  } catch (error) {
    console.error('Error fetching news by date:', error)
    res.status(500).json({
      message: 'Failed to fetch news',
      error: error.message
    })
  }
}

// Get news archive (last 30 days)
const getNewsArchive = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30

    const news = await NewsDaily.find()
      .sort({ date: -1 })
      .limit(limit)
      .select('date headline articles.sector articles.impact')

    res.json(news)
  } catch (error) {
    console.error('Error fetching news archive:', error)
    res.status(500).json({
      message: 'Failed to fetch news archive',
      error: error.message
    })
  }
}

// Get expanded article by ID
const getArticleById = async (req, res) => {
  try {
    const { articleId } = req.params

    // Find the article in NewsDaily
    const newsDoc = await NewsDaily.findOne(
      { 'articles.id': articleId },
      { articles: { $elemMatch: { id: articleId } }, date: 1, sectorSummary: 1 }
    )

    if (!newsDoc || !newsDoc.articles[0]) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      })
    }

    const article = newsDoc.articles[0]

    // Check if expanded content is cached
    if (article.expandedContent) {
      return res.json({
        success: true,
        data: {
          ...article.expandedContent,
          sectorSummary: newsDoc.sectorSummary?.get(article.sector) || ''
        }
      })
    }

    // Expand using Groq
    const systemPrompt = `You are a professional tech journalist writing detailed, accurate industry news articles. Respond with valid JSON only, no markdown, no code fences.`

    const userPrompt = `Expand this news headline into a full detailed article:

Title: ${article.title}
Sector: ${article.sector}
Category: ${article.category}
Summary: ${article.summary}
Tags: ${article.tags.join(', ')}

Write a thorough, realistic news article about this topic. Include relevant technical details, industry context, and implications for developers and job seekers.

Return this exact JSON and nothing else:
{
  "title": "${article.title}",
  "sector": "${article.sector}",
  "category": "${article.category}",
  "impact": "${article.impact}",
  "tags": ${JSON.stringify(article.tags)},
  "readTime": "${article.readTime}",
  "publishedDate": "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}",
  "fullContent": "string - 4 to 6 paragraphs of detailed article content",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "relatedSkills": [
    { 
      "skill": "skill name", 
      "relevance": "why this skill matters for this news",
      "trend": "Rising | Stable | Declining",
      "demandScore": number 0-100
    }
  ],
  "industryImpact": "2 sentences on how this affects the industry",
  "sourceUrl": "https://techcrunch.com or relevant realistic URL",
  "sourceName": "TechCrunch or relevant source name"
}
Generate exactly 4 to 5 relatedSkills relevant to this article.`

    const groqResponse = await groqChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])

    // Parse the JSON response
    let expandedArticle
    try {
      const cleanedResponse = groqResponse.replace(/```json\s*|\s*```/g, '').trim()
      expandedArticle = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return res.status(500).json({
        success: false,
        error: 'Failed to generate article content'
      })
    }

    // Cache the expanded content
    await NewsDaily.updateOne(
      { 'articles.id': articleId },
      { $set: { 'articles.$.expandedContent': expandedArticle } }
    )

    res.json({
      success: true,
      data: {
        ...expandedArticle,
        sectorSummary: newsDoc.sectorSummary?.get(article.sector) || ''
      }
    })

  } catch (error) {
    console.error('Error fetching article:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = {
  getDailyNews,
  getNewsByDate,
  getNewsArchive,
  getArticleById
}