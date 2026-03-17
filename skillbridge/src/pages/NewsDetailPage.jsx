import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Minus, Clock, Calendar, Newspaper } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import api from '../api/axios'
import toast from 'react-hot-toast'

const SECTOR_COLORS = {
  Tech: { bg: 'rgba(108,99,255,0.1)', text: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  Finance: { bg: 'rgba(76,205,196,0.1)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  Healthcare: { bg: 'rgba(255,193,7,0.1)', text: '#FFC107', border: 'rgba(255,193,7,0.3)' },
  Education: { bg: 'rgba(255,107,107,0.1)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

const IMPACT_COLORS = {
  High: '#FF6B6B',
  Medium: '#FFC107',
  Low: '#4ECDC4',
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="p-6 rounded-2xl mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded mb-3"></div>
            ))}
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded mb-2"></div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded mb-3"></div>
            ))}
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded mb-2"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillCard({ skill, relevance, trend, demandScore }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'Rising': return <TrendingUp size={16} style={{ color: '#4ECDC4' }} />
      case 'Declining': return <TrendingDown size={16} style={{ color: '#FF6B6B' }} />
      default: return <Minus size={16} style={{ color: '#FFC107' }} />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'Rising': return '#4ECDC4'
      case 'Declining': return '#FF6B6B'
      default: return '#FFC107'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className="font-semibold" style={{ color: 'var(--text)' }}>{skill}</span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)' }}>
          {trend}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{relevance}</p>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: getTrendColor() }}
              initial={{ width: 0 }}
              animate={{ width: `${demandScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{demandScore}%</span>
      </div>
    </motion.div>
  )
}

function SimilarArticleCard({ article, onClick }) {
  const sectorColors = SECTOR_COLORS[article.sector] || SECTOR_COLORS.Tech

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl transition-all hover:bg-[rgba(255,255,255,0.04)]"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: sectorColors.bg, color: sectorColors.text }}
        >
          {article.sector}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{article.readTime}</span>
      </div>
      <h4 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>
        {article.title}
      </h4>
      <div className="w-8 h-8 rounded-full flex items-center justify-center ml-auto" style={{ background: 'rgba(108,99,255,0.1)' }}>
        <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
          {(article.title || 'A').charAt(0)}
        </span>
      </div>
    </motion.button>
  )
}

export default function NewsDetailPage() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [similarArticles, setSimilarArticles] = useState([])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/news/article/${articleId}`)
      if (!res.data?.success) {
        throw new Error(res.data?.error || 'Unable to load article')
      }
      setArticle(res.data.data)
    } catch (err) {
      console.error('Article fetch error:', err)
      setError(err.message || 'Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarArticles = async () => {
    if (!article) return
    try {
      const res = await api.get('/news/daily')
      const todayNews = res.data
      const similar = todayNews.articles
        .filter(a => a.sector === article.sector && a.id !== articleId)
        .slice(0, 3)
      setSimilarArticles(similar)
    } catch (err) {
      console.error('Similar articles fetch error:', err)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  useEffect(() => {
    if (article) {
      fetchSimilarArticles()
    }
  }, [article])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-7xl">
          <ArticleSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !article) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-7xl">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,107,107,0.1)' }}>
              <Newspaper size={32} style={{ color: '#FF6B6B' }} />
            </div>
            <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
              Article not found
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              This article may have been removed from today's briefing.
            </p>
            <Button onClick={() => navigate('/news')}>
              ← Back to News
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const sectorColors = SECTOR_COLORS[article.sector] || SECTOR_COLORS.Tech
  const impactColor = IMPACT_COLORS[article.impact]

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl">
        {/* Top Bar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-all hover:translate-x-[-3px]"
          style={{ color: 'var(--text)' }}
        >
          <ArrowLeft size={16} />
          <span className="hover:text-[var(--accent)] transition-colors">Back to News</span>
        </button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl mb-8 relative overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, var(--accent), rgba(0,212,255,0.7))' }} />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ background: sectorColors.bg, color: sectorColors.text }}
            >
              {article.sector}
            </span>
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--background)', color: 'var(--text-muted)' }}>
              {article.category}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: impactColor }}
              />
              <span className="text-sm font-medium" style={{ color: impactColor }}>
                {article.impact} Impact
              </span>
            </div>
          </div>

          <h1
            className="font-heading font-extrabold mb-4"
            style={{
              color: 'var(--text)',
              fontSize: 'clamp(24px, 4vw, 36px)',
              lineHeight: '1.2'
            }}
          >
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {article.publishedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </div>
            <div className="flex items-center gap-1">
              <Newspaper size={14} />
              {article.sourceName}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs"
                style={{ background: 'var(--background)', color: 'var(--text-muted)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="prose prose-lg max-w-none">
                {article.fullContent?.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed"
                    style={{
                      color: i === 0 ? 'var(--text)' : 'var(--text-secondary)',
                      fontSize: i === 0 ? '16px' : '15px',
                      fontWeight: i === 0 ? '500' : '400'
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Key Takeaways */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl relative"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, var(--accent), rgba(0,212,255,0.7))' }} />
              <h3 className="font-heading font-bold text-xl mb-4" style={{ color: 'var(--text)' }}>
                💡 Key Takeaways
              </h3>
              <div className="space-y-3">
                {article.keyTakeaways?.map((takeaway, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {takeaway}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Industry Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-bold text-xl mb-4" style={{ color: 'var(--text)' }}>
                🏭 Industry Impact
              </h3>
              <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                {article.industryImpact}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl relative"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, var(--accent), rgba(0,212,255,0.7))' }} />
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    Want to learn more about this?
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Read the full story on {article.sourceName}
                  </p>
                </div>
                <Button
                  onClick={() => article.sourceUrl && window.open(article.sourceUrl, '_blank', 'noopener,noreferrer')}
                  className="px-6 py-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.7))',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(108,99,255,0.3)'
                  }}
                  disabled={!article.sourceUrl}
                >
                  Know More →
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Related Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
                🔥 Related Skills
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Skills mentioned in this article
              </p>
              <div className="space-y-3">
                {article.relatedSkills?.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <SkillCard {...skill} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sector Pulse */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
                📊 {article.sector} Sector Overview
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {article.sectorSummary || `The ${article.sector} sector continues to evolve with emerging technologies and market demands.`}
              </p>
              <Button
                onClick={() => navigate(`/jobs?sector=${article.sector}`)}
                variant="ghost"
                className="w-full"
              >
                Browse {article.sector} Jobs →
              </Button>
            </motion.div>

            {/* More Sector News */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--text)' }}>
                📰 More {article.sector} News
              </h3>
              <div className="space-y-3">
                {similarArticles.map((similarArticle, i) => (
                  <motion.div
                    key={similarArticle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <SimilarArticleCard
                      article={similarArticle}
                      onClick={() => navigate(`/news/${similarArticle.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}